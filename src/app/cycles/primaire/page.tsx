import Link from "next/link";
import { SubNav } from "@/components/layout/SubNav";
import { Container, PageHero, Prose } from "@/components/ui/Page";
import type { Metadata } from "next";

const nav = [
  { href: "/cycles", label: "Vue d’ensemble" },
  { href: "/cycles/maternelle", label: "Maternelle" },
  { href: "/cycles/primaire", label: "Primaire" },
  { href: "/cycles/secondaire", label: "Secondaire" },
];

export const metadata: Metadata = { title: "Primaire — Les Étoiles" };

export default function PrimairePage() {
  return (
    <>
      <SubNav items={nav} />
      <PageHero
        kicker="Primaire"
        title="Primaire Les Étoiles"
        lead="Du CP au CM2. Agrément MEN à confirmer. Parcours français (CP1–CM1) et mixte en CM2."
      />
      <Container className="max-w-3xl space-y-6 py-12">
        <Prose>
          <p>
            Du CP au CM2, le primaire consolide la lecture, l’écriture, le calcul et le civisme. Nous
            visons un rythme régulier, des évaluations lisibles pour les parents, et une préparation
            sereine au collège.
          </p>
          <p>
            Le campus d’Adjamé-Bingerville permet aux frères et sœurs de grandir au même endroit. Les frais de
            scolarité et de cantine se règlent ensuite dans l’espace parents.
          </p>
        </Prose>
        <Link href="/inscriptions" className="inline-flex rounded-full bg-terracotta px-5 py-3 font-semibold text-white">
          Demander une inscription
        </Link>
      </Container>
    </>
  );
}
