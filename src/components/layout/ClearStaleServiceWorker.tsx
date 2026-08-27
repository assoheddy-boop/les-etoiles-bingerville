"use client";

import { useEffect } from "react";

/** Unregisters leftover PWA workers (e.g. another app previously served on :3000). */
export function ClearStaleServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) void reg.unregister();
      });
    }
    if ("caches" in window) {
      void caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
    }
  }, []);
  return null;
}
