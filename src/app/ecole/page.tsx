import Link from "next/link";
import { Container, PageHero } from "@/components/ui/Page";
import { school } from "@/lib/school";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "L’école",
  description: `Présentation de ${school.name}, groupe scolaire à Bingerville — Adjamé.`,
};

export default function EcolePage() {
  return (
    <>
      <PageHero
        kicker="L’école"
        title="Qui sommes-nous ?"
        lead="Un groupe scolaire chaleureux à Bingerville — garderie, maternelle et primaire pour les familles d'Adjamé-Bingerville."
      />
      <Container className="grid gap-8 py-12 md:grid-cols-3">
        <article className="md:col-span-2 space-y-5 text-lg leading-relaxed text-ink/90">
          <p>
            {school.name} rassemble, sur un même campus à {school.neighborhood}, une garderie, une
            maternelle et une école primaire. Les agréments du Ministère seront publiés dès
            confirmation par la direction.
          </p>
          <p>
            Nous ne sommes pas un portail de paiement. Nous sommes une école : des classes, une
            direction joignable, des agréments du Ministère de l’Éducation nationale, et un
            accompagnement clair pour les familles — de la première visite jusqu’aux frais de scolarité
            et de cantine.
          </p>
          <p>
            Le nom « Les Étoiles » porte l’esprit de l’établissement : prendre l’enfant au sérieux,
            cultiver la curiosité, exiger le respect. Les Étoiles, c’est ce cadre, à Bingerville.
          </p>
        </article>
        <aside className="space-y-3">
          {[
            ["Histoire & valeurs", "/ecole/histoire"],
            ["Mot de la direction", "/ecole/mot-du-proviseur"],
            ["Agréments officiels", "/ecole/agrements"],
            ["Nos cycles", "/cycles"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="block rounded-2xl border border-line bg-white px-4 py-3 font-medium hover:border-green/40"
            >
              {label}
            </Link>
          ))}
        </aside>
      </Container>
    </>
  );
}
