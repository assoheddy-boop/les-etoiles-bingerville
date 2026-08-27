import Link from "next/link";
import { SubNav } from "@/components/layout/SubNav";
import { Container, PageHero, Prose } from "@/components/ui/Page";
import type { Metadata } from "next";

const nav = [
  { href: "/cycles", label: "Vue d’ensemble" },
  { href: "/cycles/garderie", label: "Garderie" },
  { href: "/cycles/maternelle", label: "Maternelle" },
  { href: "/cycles/primaire", label: "Primaire" },
];

export const metadata: Metadata = { title: "Garderie — Les Étoiles" };

export default function GarderiePage() {
  return (
    <>
      <SubNav items={nav} />
      <PageHero
        kicker="Garderie"
        title="Garderie Les Étoiles"
        lead="Un accueil doux pour les tout-petits, dès 3 mois. Sécurité, jeux, premiers liens et confiance."
      />
      <Container className="max-w-3xl space-y-6 py-12">
        <Prose>
          <p>
            La garderie accueille les bébés et les très jeunes enfants dans un espace adapté : jeux
            sensoriels, temps de repos, repas et sorties encadrées. Chaque enfant est connu par son
            nom, rythmé par des routines claires qui rassurent les familles.
          </p>
          <p>
            Les professionnels veillent à la propreté, à la communication avec les parents et à un
            climat bienveillant. Les places sont limitées pour garder un accompagnement attentif.
          </p>
        </Prose>
        <Link
          href="/inscriptions"
          className="inline-flex rounded-full bg-coral px-5 py-3 font-semibold text-white shadow-sm hover:bg-coral-deep"
        >
          Demander une inscription
        </Link>
      </Container>
    </>
  );
}
