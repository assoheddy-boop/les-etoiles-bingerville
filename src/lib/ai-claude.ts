import { CLAUDE_MAX_TOKENS, CLAUDE_MODEL } from "./ai-prompts";

export function anthropicApiKey() {
  return process.env.ANTHROPIC_API_KEY?.trim() || "";
}

export function assistantConfigured() {
  return Boolean(anthropicApiKey());
}

type ClaudeMessage = { role: "user" | "assistant"; content: string };

export async function streamClaude(system: string, messages: ClaudeMessage[]) {
  const key = anthropicApiKey();
  if (!key) {
    return { ok: false as const, status: 503, error: "Assistant non configuré" };
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: CLAUDE_MAX_TOKENS,
      stream: true,
      temperature: 0.3,
      system,
      messages,
    }),
  });

  if (!response.ok || !response.body) {
    let detail = "L’assistant est indisponible pour le moment.";
    try {
      const payload = (await response.json()) as { error?: { message?: string } };
      if (payload.error?.message) detail = "Assistant indisponible.";
    } catch {
      // ignore
    }
    const status = response.status === 429 ? 429 : 502;
    return { ok: false as const, status, error: detail };
  }

  return { ok: true as const, body: response.body };
}

export async function* readClaudeTextDeltas(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";
    for (const block of blocks) {
      for (const line of block.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const raw = line.slice(5).trim();
        if (!raw || raw === "[DONE]") continue;
        try {
          const event = JSON.parse(raw) as {
            type?: string;
            delta?: { type?: string; text?: string };
            error?: { message?: string };
          };
          if (event.type === "error") {
            throw new Error(event.error?.message || "Erreur Claude");
          }
          if (event.type === "content_block_delta" && event.delta?.type === "text_delta" && event.delta.text) {
            yield event.delta.text;
          }
        } catch (error) {
          if (error instanceof SyntaxError) continue;
          throw error;
        }
      }
    }
  }
}
