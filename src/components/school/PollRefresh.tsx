"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Recharge la page serveur toutes les `seconds` secondes (pas de websocket). */
export function PollRefresh({ seconds = 30 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = window.setInterval(() => router.refresh(), seconds * 1000);
    return () => window.clearInterval(id);
  }, [router, seconds]);
  return null;
}
