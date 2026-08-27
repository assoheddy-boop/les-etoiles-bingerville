import Link from "next/link";
import { SubNav } from "@/components/layout/SubNav";
import { Container, PageHero } from "@/components/ui/Page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos cycles",
};

const items = [
  { href: "/cycles", label: "Vue d’ensemble" },
  { href: "/cycles/maternelle", label: "Maternelle" },
  { href: "/cycles/primaire", label: "Primaire" },
  { href: "/cycles/secondaire", label: "Secondaire" },
];

const cycles = [
  {
    href: "/cycles/maternelle",
    title: "Maternelle",
    name: "Maternelle Les Étoiles",
    text: "Petite, moyenne et grande sections — et garderie. Agrément MEN à confirmer.",
  },
  {
    href: "/cycles/primaire",
    title: "Primaire",
    name: "Primaire Les Étoiles",
    text: "Du CP au CM2, système français (CP1–CM1) et mixte en CM2. Agrément MEN à confirmer.",
  },
  {
    href: "/cycles/secondaire",
    title: "Secondaire",
    name: "Non proposé pour l’instant",
    text: "L’établissement est préscolaire et primaire. Aucun collège n’est ouvert.",
  },
];

export default function CyclesPage() {
  return (
    <>
      <SubNav items={items} />
      <PageHero
        kicker="Pédagogie"
        title="Nos cycles"
        lead="Un parcours à Bingerville — Adjamé, de la garderie au CM2."
      />
      <Container className="grid gap-4 py-12 md:grid-cols-3">
        {cycles.map((cycle) => (
          <Link
            key={cycle.href}
            href={cycle.href}
            className="rounded-3xl border border-line bg-white p-6 hover:border-green/40"
          >
            <p className="text-sm text-terracotta">{cycle.title}</p>
            <h2 className="mt-1 font-display text-2xl text-green-deep">{cycle.name}</h2>
            <p className="mt-3 text-muted">{cycle.text}</p>
          </Link>
        ))}
      </Container>
    </>
  );
}
