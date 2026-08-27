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

export const metadata: Metadata = { title: "Secondaire" };

export default function SecondairePage() {
  return (
    <>
      <SubNav items={nav} />
      <PageHero
        kicker="Secondaire"
        title="Pas de collège pour l’instant"
        lead="L’objet social de l’établissement est le préscolaire et le primaire. Aucune date d’ouverture collège n’est publiée."
      />
      <Container className="max-w-3xl space-y-6 py-12">
        <Prose>
          <p>
            Le Groupe scolaire Les Étoiles de Bingerville accueille les enfants de la garderie au CM2.
            Tant que la direction n’annonce pas un cycle secondaire, aucune inscription collège n’est
            proposée en ligne.
          </p>
          <p>Laissez vos coordonnées si vous souhaitez être prévenus d’une éventuelle ouverture.</p>
        </Prose>
        <Link href="/contact" className="inline-flex rounded-full bg-green px-5 py-3 font-semibold text-white">
          Nous écrire
        </Link>
      </Container>
    </>
  );
}
