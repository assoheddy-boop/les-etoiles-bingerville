"use client";

export function ChatBubble({ stacked, onToggle }: { stacked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={false}
      aria-controls="etoiles-ai-window"
      aria-label="Ouvrir l’assistant Les Étoiles"
      className={`fixed z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-deep text-white shadow-lg shadow-green-deep/25 transition hover:bg-green ${
        stacked ? "bottom-20 right-4 sm:bottom-24 sm:right-5" : "bottom-4 right-4 sm:bottom-5 sm:right-5"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v6a3.5 3.5 0 0 1-3.5 3.5H11l-4 3.2V16H8.5A3.5 3.5 0 0 1 5 12.5v-6Z" />
        <path d="M9 8.5h6M9 12h4" strokeLinecap="round" />
      </svg>
    </button>
  );
}
