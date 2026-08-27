"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { showWhatsAppButton } from "@/lib/nav";
import { school, whatsappUrl } from "@/lib/school";

export function WhatsAppButton() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/site-chrome", { credentials: "same-origin" })
      .then((response) => response.json())
      .then((data: { whatsapp?: boolean }) => {
        if (!cancelled) setEnabled(data.whatsapp !== false);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (!enabled || !showWhatsAppButton(pathname)) return null;

  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-40 inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-[#1f9e4b] px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-green-deep/20 hover:bg-[#188a3f] sm:bottom-5 sm:right-5 sm:px-4"
      aria-label={`WhatsApp ${school.phones[0].display}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10 10 0 0 0 4.65 1.15h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2Zm5.76 14.17c-.24.67-1.4 1.28-1.94 1.36-.5.07-1.13.1-1.82-.11-.42-.13-.95-.31-1.64-.6-2.89-1.25-4.77-4.16-4.92-4.35-.14-.2-1.18-1.56-1.18-2.98 0-1.41.74-2.11 1-2.4.24-.27.64-.39 1.02-.39.12 0 .23 0 .33.01.29.01.44.03.63.49.24.55.82 2 .89 2.15.07.15.12.32.02.52-.09.2-.14.32-.27.5-.14.17-.28.38-.4.51-.13.14-.27.29-.12.56.15.27.67 1.1 1.44 1.78 1 .88 1.81 1.16 2.1 1.29.28.13.45.11.62-.07.17-.17.73-.84.93-1.13.2-.29.39-.24.66-.14.27.1 1.71.8 2 .95.29.15.48.22.55.35.07.13.07.75-.17 1.42Z" />
      </svg>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
