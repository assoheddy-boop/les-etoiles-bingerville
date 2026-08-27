import { demoHintsEnabled } from "@/lib/runtime";

export function DemoBanner() {
  if (!demoHintsEnabled()) return null;
  return (
    <p className="border-b border-line bg-paper-2 px-4 py-1.5 text-center text-[11px] text-muted">
      Démo — les identifiants de démonstration sont affichés sur les pages de connexion.
    </p>
  );
}
