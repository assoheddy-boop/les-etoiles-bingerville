import Link from "next/link";
import { Container, PageHero } from "@/components/ui/Page";
import { facebookMotto } from "@/lib/facebook-gallery";
import { school } from "@/lib/school";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "L’école",
  description: `${school.name} — garderie, maternelle et primaire à Bingerville. ${school.tagline}`,
};

const pillars = [
  {
    emoji: "📐",
    title: "Rigueur",
    text: "Des attentes claires, des routines stables et un suivi régulier — pour que chaque enfant progresse sereinement.",
  },
  {
    emoji: "🎯",
    title: "Discipline",
    text: "Le respect des autres, des adultes et du cadre : des valeurs qui se vivent chaque jour en classe et dans la cour.",
  },
  {
    emoji: "✏️",
    title: "Travail",
    text: "L’effort, la persévérance et le plaisir d’apprendre — du premier jeu en garderie aux devoirs du primaire.",
  },
];

export default function EcolePage() {
  return (
    <>
      <PageHero
        kicker="L’école"
        title="Qui sommes-nous ?"
        lead={`${school.tagline} Un groupe scolaire chaleureux à Bingerville — garderie, maternelle et primaire pour les familles d'Adjamé-Bingerville.`}
      />
      <Container className="space-y-10 py-12">
        <div className="rounded-[2rem] border border-line bg-gradient-to-r from-peach/50 via-lavender/40 to-mint/30 px-6 py-8 text-center md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Notre devise</p>
          <p className="mt-3 font-display text-2xl text-green-deep md:text-3xl">{facebookMotto}</p>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Ces mots guident le quotidien de l&apos;établissement, comme sur notre page Facebook officielle.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <article className="md:col-span-2 space-y-5 text-lg leading-relaxed text-ink/90">
            <p>
              {school.name} rassemble, sur un même campus à {school.neighborhood}, une garderie, une
              maternelle et une école primaire. Les agréments du Ministère seront publiés dès confirmation
              par la direction — sans numéro inventé sur ce site.
            </p>
            <p>
              Nous ne sommes pas un simple portail de paiement : nous sommes une école avec des classes,
              une direction joignable et un accompagnement clair pour les familles — de la première visite
              jusqu&apos;aux frais de scolarité et de cantine.
            </p>
            <p>
              Le nom « Les Étoiles » porte l&apos;esprit de l&apos;établissement : prendre l&apos;enfant au sérieux,
              cultiver la curiosité, exiger le respect. Un cadre moderne à Bingerville, une équipe
              bienveillante, des familles partenaires.
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
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="home-card-hover rounded-3xl border border-line bg-white p-6 shadow-sm"
            >
              <span className="text-3xl" aria-hidden>
                {pillar.emoji}
              </span>
              <h2 className="mt-3 font-display text-2xl text-green-deep">{pillar.title}</h2>
              <p className="mt-3 text-muted">{pillar.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
