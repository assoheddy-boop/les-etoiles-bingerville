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

export const metadata: Metadata = { title: "Primaire — Les Étoiles" };

export default function PrimairePage() {
  return (
    <>
      <SubNav items={nav} />
      <PageHero
        kicker="Primaire"
        title="Primaire Les Étoiles"
        lead="Du CP au CM2 : lire, compter, raisonner et grandir avec confiance."
      />
      <Container className="max-w-3xl space-y-6 py-12">
        <Prose>
          <p>
            Le primaire consolide la lecture, l&apos;écriture, le calcul et le civisme. Nous visons un
            rythme régulier, des évaluations lisibles pour les parents, et un climat où chaque enfant
            ose poser des questions.
          </p>
          <p>
            Parcours français du CP1 au CM1 et dispositif mixte en CM2. Le campus d&apos;Adjamé-Bingerville
            permet aux frères et sœurs de grandir au même endroit, de la garderie au CM2.
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
