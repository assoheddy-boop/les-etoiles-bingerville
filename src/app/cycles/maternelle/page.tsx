import { SubNav } from "@/components/layout/SubNav";
import { Container, PageHero, Prose } from "@/components/ui/Page";
import Link from "next/link";
import type { Metadata } from "next";

const nav = [
  { href: "/cycles", label: "Vue d’ensemble" },
  { href: "/cycles/garderie", label: "Garderie" },
  { href: "/cycles/maternelle", label: "Maternelle" },
  { href: "/cycles/primaire", label: "Primaire" },
];

export const metadata: Metadata = { title: "Maternelle — Les Étoiles" };

export default function MaternellePage() {
  return (
    <>
      <SubNav items={nav} />
      <PageHero
        kicker="Maternelle"
        title="Maternelle Les Étoiles"
        lead="Petite, moyenne et grande sections : éveil joyeux, langage et premiers apprentissages en douceur."
      />
      <Container className="max-w-3xl space-y-6 py-12">
        <Prose>
          <p>
            La maternelle accueille les enfants de 3 à 5 ans dans un cadre coloré et rassurant.
            Langage, motricité, vie en groupe, arts et éveil scientifique se mêlent à des routines
            claires que les tout-petits adorent.
          </p>
          <p>
            Les familles sont associées dès la rentrée : horaires, cantine, sorties et suivi des
            premiers apprentissages. Pour une visite ou une inscription, l&apos;équipe répond sous 24 h
            les jours ouvrés.
          </p>
        </Prose>
        <Link
          href="/inscriptions"
          className="inline-flex rounded-full bg-coral px-5 py-3 font-semibold text-white hover:bg-coral-deep"
        >
          Demander une inscription
        </Link>
      </Container>
    </>
  );
}
