import { NextResponse } from "next/server";
import { appendInbox } from "@/lib/cms";
import { publicMailHint } from "@/lib/email";
import { notifyPublicContact, notifyPublicInscription } from "@/lib/email-notify";
import { PersistWriteError } from "@/lib/persist";

function parseBody(body: Record<string, unknown>) {
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const message = String(body.message || "").trim();
  const email = String(body.email || "").trim();
  const cycle = String(body.cycle || "").trim();
  if (!name || !phone || !message) {
    return { error: "Nom, téléphone et message sont obligatoires." };
  }
  return { name, phone, message, email, cycle };
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const parsed = parseBody(body);
  if ("error" in parsed && parsed.error) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const kind = request.url.includes("/inscriptions") ? "inscription" : "contact";
  const id = crypto.randomUUID();
  const payload = {
    id,
    name: parsed.name!,
    phone: parsed.phone!,
    email: parsed.email || undefined,
    cycle: parsed.cycle || undefined,
    message: parsed.message!,
  };
  try {
    await appendInbox({
      createdAt: new Date().toISOString(),
      kind,
      ...payload,
    });
  } catch (error) {
    const message =
      error instanceof PersistWriteError
        ? error.message
        : "Enregistrement impossible pour le moment. Appelez l’école ou écrivez sur WhatsApp.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
  let mail;
  try {
    mail =
      kind === "inscription" ? await notifyPublicInscription(payload) : await notifyPublicContact(payload);
  } catch (error) {
    console.error("[email] notify after persist failed", error);
    mail = { status: "failed" as const, reason: "notify_failed" };
  }
  return NextResponse.json({
    ok: true,
    email: mail.status,
    hint: publicMailHint(kind, mail),
  });
}
