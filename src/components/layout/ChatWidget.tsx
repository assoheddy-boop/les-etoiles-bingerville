"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { hideAiChat, showWhatsAppButton } from "@/lib/nav";
import { ChatBubble } from "./ChatBubble";
import { ChatWindow, type ChatLine } from "./ChatWindow";

type HistoryPayload = {
  configured?: boolean;
  roleLabel?: string;
  messages?: ChatLine[];
  error?: string;
};

const DARK_KEY = "etoiles-ai-dark";

function preferDark() {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(DARK_KEY);
  if (stored === "1") return true;
  if (stored === "0") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

async function readSse(
  response: Response,
  onDelta: (text: string) => void,
  onMeta: (roleLabel: string) => void,
) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Flux indisponible");
  const decoder = new TextDecoder();
  let buffer = "";
  let errorFromStream: string | null = null;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";
    for (const block of blocks) {
      const line = block.split("\n").find((row) => row.startsWith("data:"));
      if (!line) continue;
      try {
        const event = JSON.parse(line.slice(5).trim()) as {
          type?: string;
          text?: string;
          roleLabel?: string;
          error?: string;
        };
        if (event.type === "meta" && event.roleLabel) onMeta(event.roleLabel);
        if (event.type === "delta" && event.text) onDelta(event.text);
        if (event.type === "error" && event.error) errorFromStream = event.error;
      } catch {
        // ignore malformed chunks
      }
    }
  }
  if (errorFromStream) throw new Error(errorFromStream);
}

export function ChatWidget() {
  const pathname = usePathname();
  const hidden = hideAiChat(pathname);
  const [chrome, setChrome] = useState({ chat: true, whatsapp: true });
  const stacked = chrome.whatsapp && showWhatsAppButton(pathname);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [roleLabel, setRoleLabel] = useState("");
  const [messages, setMessages] = useState<ChatLine[]>([]);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const historyGen = useRef(0);

  useEffect(() => {
    setDark(preferDark());
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/site-chrome", { credentials: "same-origin" })
      .then((response) => response.json())
      .then((data: { chat?: boolean; whatsapp?: boolean }) => {
        if (cancelled) return;
        setChrome({
          chat: data.chat !== false,
          whatsapp: data.whatsapp !== false,
        });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, streaming, open]);

  const loadHistory = useCallback(async (gen: number) => {
    try {
      const response = await fetch("/api/ai", { credentials: "same-origin" });
      if (response.status === 403) {
        setChrome((current) => ({ ...current, chat: false }));
        return;
      }
      const data = (await response.json()) as HistoryPayload;
      if (gen !== historyGen.current) return;
      setConfigured(Boolean(data.configured));
      if (data.roleLabel) setRoleLabel(data.roleLabel);
      if (Array.isArray(data.messages)) setMessages(data.messages);
    } catch {
      if (gen !== historyGen.current) return;
      setError("Impossible de charger l’historique.");
    }
  }, []);

  useEffect(() => {
    if (hidden || !open) return;
    const gen = historyGen.current;
    void loadHistory(gen);
  }, [hidden, open, loadHistory, pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (hidden || !chrome.chat) return null;

  const toggleDark = () => {
    setDark((current) => {
      const next = !current;
      window.localStorage.setItem(DARK_KEY, next ? "1" : "0");
      return next;
    });
  };

  const onClear = async () => {
    setError(null);
    try {
      const response = await fetch("/api/ai", { method: "DELETE", credentials: "same-origin" });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error || "Effacement impossible.");
        return;
      }
      setMessages([]);
    } catch {
      setError("Effacement impossible.");
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || streaming || configured === false) return;
    historyGen.current += 1;
    setDraft("");
    setError(null);
    const userId = `local-${crypto.randomUUID()}`;
    const assistantId = `local-${crypto.randomUUID()}`;
    setMessages((current) => [
      ...current,
      { id: userId, role: "user", content: text },
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setStreaming(true);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("text/event-stream")) {
        const data = (await response.json()) as { error?: string };
        const message = data.error || "Assistant indisponible.";
        if (response.status === 503) setConfigured(false);
        setMessages((current) => current.filter((row) => row.id !== assistantId && row.id !== userId));
        setDraft(text);
        setError(message);
        return;
      }
      await readSse(
        response,
        (delta) => {
          setMessages((current) =>
            current.map((row) => (row.id === assistantId ? { ...row, content: row.content + delta } : row)),
          );
        },
        (label) => setRoleLabel(label),
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "La réponse a échoué.");
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      <ChatWindow
        open={open}
        stacked={stacked}
        dark={dark}
        configured={configured}
        roleLabel={roleLabel}
        messages={messages}
        draft={draft}
        streaming={streaming}
        error={error}
        listRef={listRef}
        onClose={() => setOpen(false)}
        onClear={() => void onClear()}
        onToggleDark={toggleDark}
        onDraftChange={setDraft}
        onSubmit={(event) => void onSubmit(event)}
      />
      {open ? null : <ChatBubble stacked={stacked} onToggle={() => setOpen(true)} />}
    </>
  );
}
