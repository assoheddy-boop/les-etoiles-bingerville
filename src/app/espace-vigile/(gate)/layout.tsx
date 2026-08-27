import type { Metadata } from "next";
import { requireVigile } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Tableau de bord vigile",
  description: "Validation des sorties à la grille — Groupe scolaire Les Étoiles de Bingerville, Bingerville.",
};

export default async function VigileGateLayout({ children }: { children: React.ReactNode }) {
  await requireVigile();
  return children;
}
