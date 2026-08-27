"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-green-deep hover:bg-paper print:hidden"
    >
      {label}
    </button>
  );
}
