import { SubNav } from "@/components/layout/SubNav";
import { Container, PageHero, Prose } from "@/components/ui/Page";
import Link from "next/link";
import type { Metadata } from "next";

const nav = [
  { href: "/cycles", label: "Vue d’ensemble" },
  { href: "/cycles/maternelle", label: "Maternelle" },
  { href: "/cycles/primaire", label: "Primaire" },
  { href: "/cycles/secondaire", label: "Secondaire" },
];

export const metadata: Metadata = { title: "Maternelle — Les Étoiles" };

export default function MaternellePage() {
  return (
    <>
      <SubNav items={nav} />
      <PageHero
        kicker="Maternelle"
        title="Maternelle Les Étoiles"
        lead="Garderie, petite, moyenne et grande sections. Agrément MEN à confirmer auprès de la direction."
      />
      <Container className="max-w-3xl space-y-6 py-12">
        <Prose>
          <p>
            La maternelle pose les bases : langage, vie en groupe, motricité, éveil scientifique et
            artistique. Les classes sont organisées en petite, moyenne et grande sections.
          </p>
          <p>
            Les familles sont associées dès la rentrée : horaires, cantine, et suivi des premiers
            apprentissages. Pour une visite ou une inscription, le secrétariat répond sous 24 h les
            jours ouvrés.
          </p>
        </Prose>
        <Link href="/inscriptions" className="inline-flex rounded-full bg-terracotta px-5 py-3 font-semibold text-white">
          Demander une inscription
        </Link>
      </Container>
    </>
  );
}
