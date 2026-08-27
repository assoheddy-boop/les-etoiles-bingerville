"use client";

import { useEffect, useState } from "react";

export function ClassEffectif({ classId }: { classId: string }) {
  const [counts, setCounts] = useState({ male: 0, female: 0, total: 0 });

  useEffect(() => {
    const select = document.getElementById("classIdSelect") as HTMLSelectElement | null;
    async function refresh(id: string) {
      if (!id) return;
      const response = await fetch(`/api/admin/inscriptions/effectif?classId=${encodeURIComponent(id)}`, {
        credentials: "same-origin",
      });
      if (!response.ok) return;
      const payload = (await response.json()) as { male: number; female: number; total: number };
      setCounts(payload);
    }
    void refresh(select?.value || classId);
    function onChange(event: Event) {
      const target = event.target as HTMLSelectElement;
      void refresh(target.value);
    }
    select?.addEventListener("change", onChange);
    return () => select?.removeEventListener("change", onChange);
  }, [classId]);

  return (
    <div className="flex flex-wrap gap-3 rounded-2xl border border-green/20 bg-green-soft px-4 py-3 text-sm">
      <span className="font-semibold text-green-deep">Effectif classe</span>
      <span>
        M: <strong>{counts.male}</strong>
      </span>
      <span>
        F: <strong>{counts.female}</strong>
      </span>
      <span>
        T: <strong>{counts.total}</strong>
      </span>
    </div>
  );
}
