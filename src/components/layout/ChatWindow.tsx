"use client";

import Link from "next/link";
import type { FormEvent, ReactNode, RefObject } from "react";

export type ChatLine = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const PATH_RE =
  /(\/(?:admin|espace-parents|espace-enseignants|espace-vigile|inscriptions|connexion|contact|ecole|cycles|informations|actualites|activites|mentions-legales)[a-z0-9\-/?#]*)/gi;

function renderContent(text: string) {
  const parts: ReactNode[] = [];
  let last = 0;
  const regex = new RegExp(PATH_RE.source, "gi");
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const href = match[0].replace(/[.,;:!?)]+$/, "");
    parts.push(
      <Link key={`${href}-${match.index}`} href={href} className="underline decoration-green/40 underline-offset-2">
        {href}
      </Link>,
    );
    last = match.index + match[0].length;
    if (href.length !== match[0].length) {
      parts.push(match[0].slice(href.length));
      last = match.index + match[0].length;
    }
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function ChatWindow({
  open,
  stacked,
  dark,
  configured,
  roleLabel,
  messages,
  draft,
  streaming,
  error,
  listRef,
  onClose,
  onClear,
  onToggleDark,
  onDraftChange,
  onSubmit,
}: {
  open: boolean;
  stacked: boolean;
  dark: boolean;
  configured: boolean | null;
  roleLabel: string;
  messages: ChatLine[];
  draft: string;
  streaming: boolean;
  error: string | null;
  listRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onClear: () => void;
  onToggleDark: () => void;
  onDraftChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  if (!open) return null;

  const shell = dark
    ? "border-white/10 bg-[#152018] text-[#f4eee6]"
    : "border-line bg-white text-ink";
  const muted = dark ? "text-white/55" : "text-muted";
  const pane = dark ? "bg-[#1c281f]" : "bg-paper";
  const userBubble = dark ? "bg-green text-white" : "bg-green-deep text-white";
  const botBubble = dark ? "bg-white/10 text-[#f4eee6]" : "bg-paper-2 text-ink";
  const field = dark
    ? "border-white/10 bg-[#101610] text-[#f4eee6] placeholder:text-white/35"
    : "border-line bg-white text-ink placeholder:text-muted/70";

  return (
    <section
      id="etoiles-ai-window"
      role="dialog"
      aria-label="Assistant Les Étoiles"
      className={`fixed z-50 flex flex-col overflow-hidden border shadow-2xl ${shell} inset-3 rounded-2xl sm:inset-auto sm:right-5 sm:h-[min(36rem,calc(100dvh-8rem))] sm:w-[24rem] ${
        stacked ? "sm:bottom-24" : "sm:bottom-5"
      }`}
    >
      <header className="flex items-start gap-2 bg-green-deep px-3 py-3 text-white">
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg leading-tight">Assistant Les Étoiles</p>
          <p className="mt-0.5 text-xs text-white/75">
            Aide à la navigation, ne remplace pas le secrétariat.
            {roleLabel ? ` · ${roleLabel}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleDark}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
          aria-label={dark ? "Mode clair" : "Mode sombre"}
          title={dark ? "Mode clair" : "Mode sombre"}
        >
          {dark ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <circle cx="12" cy="12" r="3.5" />
              <path d="M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M16.5 13.2A6.2 6.2 0 0 1 10.8 4.4 7 7 0 1 0 19.6 13a6.1 6.1 0 0 1-3.1.2Z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
          aria-label="Effacer la conversation"
          title="Effacer"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M5 7h14M10 7V5h4v2M8 7l1 12h6l1-12" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
          aria-label="Fermer"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </header>

      {configured === false ? (
        <div className={`border-b px-3 py-2 text-sm ${dark ? "border-white/10 bg-terracotta/20" : "border-line bg-terracotta-soft"}`}>
          Assistant non configuré. Écrivez au secrétariat ou via WhatsApp en attendant.
        </div>
      ) : null}

      <div ref={listRef} className={`flex-1 space-y-3 overflow-y-auto px-3 py-3 ${pane}`}>
        {messages.length === 0 ? (
          <p className={`text-sm ${muted}`}>
            Bonjour. Je vous oriente dans le site Les Étoiles (inscriptions, espaces parents, enseignants, direction). Posez
            une question.
          </p>
        ) : null}
        {messages.map((line) => (
          <div key={line.id} className={`flex ${line.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                line.role === "user" ? userBubble : botBubble
              }`}
            >
              {line.role === "assistant" ? renderContent(line.content) : line.content}
            </div>
          </div>
        ))}
        {streaming ? <p className={`text-xs ${muted}`}>Rédaction…</p> : null}
        {error ? <p className="text-sm text-terracotta">{error}</p> : null}
      </div>

      <form onSubmit={onSubmit} className={`border-t p-2.5 ${dark ? "border-white/10" : "border-line"}`}>
        <label className="sr-only" htmlFor="etoiles-ai-input">
          Message à l’assistant
        </label>
        <div className="flex items-end gap-2">
          <textarea
            id="etoiles-ai-input"
            rows={2}
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            disabled={streaming || configured === false}
            placeholder={configured === false ? "Assistant non configuré" : "Votre question…"}
            className={`min-h-11 flex-1 resize-none rounded-xl border px-3 py-2 text-sm ${field}`}
          />
          <button
            type="submit"
            disabled={streaming || configured === false || !draft.trim()}
            className="inline-flex h-11 min-w-11 items-center justify-center rounded-xl bg-green-deep px-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            Envoyer
          </button>
        </div>
      </form>
    </section>
  );
}
