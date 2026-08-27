import Link from "next/link";
import { SubNav } from "@/components/layout/SubNav";
import { Container, PageHero } from "@/components/ui/Page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos cycles",
};

const items = [
  { href: "/cycles", label: "Vue d’ensemble" },
  { href: "/cycles/garderie", label: "Garderie" },
  { href: "/cycles/maternelle", label: "Maternelle" },
  { href: "/cycles/primaire", label: "Primaire" },
];

const cycles = [
  {
    href: "/cycles/garderie",
    emoji: "🧸",
    title: "Garderie",
    name: "Les tout-petits",
    text: "Dès 3 mois : accueil doux, jeux sensoriels, repas et repos en toute sécurité.",
  },
  {
    href: "/cycles/maternelle",
    emoji: "🌈",
    title: "Maternelle",
    name: "Petite, moyenne, grande",
    text: "Éveil, langage, motricité et vie en groupe. Agrément MEN à confirmer.",
  },
  {
    href: "/cycles/primaire",
    emoji: "📚",
    title: "Primaire",
    name: "Du CP au CM2",
    text: "Lecture, calcul, civisme et suivi régulier des familles. Agrément MEN à confirmer.",
  },
];

export default function CyclesPage() {
  return (
    <>
      <SubNav items={items} />
      <PageHero
        kicker="Pédagogie"
        title="Garderie, maternelle et primaire"
        lead="Un parcours doux et progressif à Bingerville — de la garderie au CM2, sur un même campus."
      />
      <Container className="grid gap-4 py-12 md:grid-cols-3">
        {cycles.map((cycle) => (
          <Link
            key={cycle.href}
            href={cycle.href}
            className="rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-green/40 hover:shadow-md"
          >
            <span className="text-3xl">{cycle.emoji}</span>
            <p className="mt-3 text-sm text-coral">{cycle.title}</p>
            <h2 className="mt-1 font-display text-2xl text-green-deep">{cycle.name}</h2>
            <p className="mt-3 text-muted">{cycle.text}</p>
          </Link>
        ))}
      </Container>
    </>
  );
}
