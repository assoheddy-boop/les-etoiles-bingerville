import { NextResponse } from "next/server";
import { appendTurn, archiveActiveConversation, findActiveConversation, getActiveConversation, toClaudeMessages } from "@/lib/ai-chat";
import { assistantConfigured, readClaudeTextDeltas, streamClaude } from "@/lib/ai-claude";
import { HISTORY_TURNS, MAX_USER_MESSAGE, systemPromptFor } from "@/lib/ai-prompts";
import { clientIp, rateLimitKey, sameOrigin, takeRateLimit } from "@/lib/ai-rate-limit";
import { AI_GUEST_COOKIE, aiRoleLabels, guestCookieOptions, resolveAiActor } from "@/lib/ai-roles";
import { isModuleEnabled } from "@/lib/module-control";
import { PersistWriteError } from "@/lib/persist";
import { readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

function sseLine(payload: unknown) {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

function attachGuestCookie(response: NextResponse, guestId?: string, isNewGuest?: boolean) {
  if (guestId && isNewGuest) {
    response.cookies.set(AI_GUEST_COOKIE, guestId, guestCookieOptions);
  }
  return response;
}

async function chatModuleAllowed(role: string) {
  if (role === "superadmin") return true;
  const data = await readSchoolLife();
  return isModuleEnabled(data, "chat_ia");
}

export async function GET() {
  const actor = await resolveAiActor();
  if (!(await chatModuleAllowed(actor.role))) {
    return NextResponse.json({ error: "Module chat IA désactivé", moduleEnabled: false }, { status: 403 });
  }
  const conversation = await findActiveConversation(actor.userKey);
  const response = NextResponse.json({
    configured: assistantConfigured(),
    role: actor.role,
    roleLabel: aiRoleLabels[actor.role],
    conversationId: conversation?.id ?? null,
    messages: (conversation?.messages ?? []).map((row) => ({
      id: row.id,
      role: row.role,
      content: row.content,
      createdAt: row.createdAt,
    })),
  });
  return attachGuestCookie(response, actor.guestId, actor.isNewGuest);
}

export async function DELETE() {
  const actor = await resolveAiActor();
  if (!(await chatModuleAllowed(actor.role))) {
    return NextResponse.json({ error: "Module chat IA désactivé" }, { status: 403 });
  }
  try {
    await archiveActiveConversation(actor.userKey);
  } catch (error) {
    if (error instanceof PersistWriteError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    throw error;
  }
  const next = await getActiveConversation(actor.userKey, actor.role);
  const response = NextResponse.json({
    ok: true,
    conversationId: next.id,
    messages: [] as const,
  });
  return attachGuestCookie(response, actor.guestId, actor.isNewGuest);
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Origine non autorisée." }, { status: 403 });
  }

  let body: { message?: unknown; role?: unknown } = {};
  try {
    body = (await request.json()) as { message?: unknown; role?: unknown };
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Écrivez un message." }, { status: 400 });
  }
  if (message.length > MAX_USER_MESSAGE) {
    return NextResponse.json({ error: "Message trop long." }, { status: 400 });
  }

  const suggested = typeof body.role === "string" ? body.role : undefined;
  const actor = await resolveAiActor(suggested);
  if (!(await chatModuleAllowed(actor.role))) {
    return NextResponse.json({ error: "Module chat IA désactivé" }, { status: 403 });
  }

  const limit = takeRateLimit(rateLimitKey(clientIp(request), actor.userKey));
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Trop de messages. Réessayez dans quelques minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  if (!assistantConfigured()) {
    const response = NextResponse.json({ error: "Assistant non configuré" }, { status: 503 });
    return attachGuestCookie(response, actor.guestId, actor.isNewGuest);
  }

  const conversation = await getActiveConversation(actor.userKey, actor.role);
  const claudeMessages = toClaudeMessages(conversation.messages, message, HISTORY_TURNS);
  const claude = await streamClaude(systemPromptFor(actor.role), claudeMessages);
  if (!claude.ok) {
    const response = NextResponse.json({ error: claude.error }, { status: claude.status });
    return attachGuestCookie(response, actor.guestId, actor.isNewGuest);
  }

  const userMsg = {
    id: crypto.randomUUID(),
    role: "user" as const,
    content: message,
    createdAt: new Date().toISOString(),
  };
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: unknown) => controller.enqueue(encoder.encode(sseLine(payload)));
      send({ type: "meta", role: actor.role, roleLabel: aiRoleLabels[actor.role] });
      let assistantText = "";
      try {
        for await (const delta of readClaudeTextDeltas(claude.body)) {
          assistantText += delta;
          send({ type: "delta", text: delta });
        }
        if (!assistantText.trim()) {
          assistantText = "Je n’ai pas pu formuler de réponse. Réessayez ou contactez le secrétariat.";
          send({ type: "delta", text: assistantText });
        }
        const assistantMsg = {
          id: crypto.randomUUID(),
          role: "assistant" as const,
          content: assistantText,
          createdAt: new Date().toISOString(),
        };
        try {
          await appendTurn(actor.userKey, actor.role, userMsg, assistantMsg);
        } catch (error) {
          if (!(error instanceof PersistWriteError)) throw error;
        }
        send({ type: "done", id: assistantMsg.id });
      } catch {
        send({ type: "error", error: "La réponse a été interrompue. Réessayez." });
      } finally {
        controller.close();
      }
    },
  });

  const headers = new Headers({
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  const response = new NextResponse(stream, { headers });
  return attachGuestCookie(response, actor.guestId, actor.isNewGuest);
}
