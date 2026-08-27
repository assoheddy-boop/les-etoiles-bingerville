import Link from "next/link";
import { CycleExpectations, CycleRhythm } from "@/components/cycles/CycleSections";
import { SubNav } from "@/components/layout/SubNav";
import { Container, PageHero, Prose } from "@/components/ui/Page";
import type { Metadata } from "next";

const nav = [
  { href: "/cycles", label: "Vue d’ensemble" },
  { href: "/cycles/garderie", label: "Garderie" },
  { href: "/cycles/maternelle", label: "Maternelle" },
  { href: "/cycles/primaire", label: "Primaire" },
];

export const metadata: Metadata = {
  title: "Garderie",
  description:
    "Garderie Les Étoiles de Bingerville — accueil des tout-petits dès 3 mois, routines douces et communication avec les familles.",
};

const rhythm = [
  {
    time: "7h30",
    emoji: "☀️",
    label: "Accueil individualisé",
    detail: "Échange court avec le parent, adaptation au rythme de l’enfant.",
  },
  {
    time: "9h",
    emoji: "🧸",
    label: "Jeux sensoriels",
    detail: "Motricité fine, exploration, comptines et temps calme.",
  },
  {
    time: "11h",
    emoji: "🍼",
    label: "Repas & sieste",
    detail: "Collation ou repas, change, puis repos selon l’âge de chaque bébé.",
  },
  {
    time: "15h",
    emoji: "🎨",
    label: "Éveil & sortie",
    detail: "Peinture à doigts, parcours moteur ou petite promenade encadrée.",
  },
  {
    time: "16h30",
    emoji: "🌙",
    label: "Retour aux familles",
    detail: "Bilan de la journée : repas, sieste, humeur — avec bienveillance.",
  },
];

const expectations = [
  "Un professionnel référent connaît votre enfant et suit son adaptation.",
  "Communication régulière : carnet ou message sur les repas, la sieste et l’humeur.",
  "Espaces sécurisés, matériel adapté à l’âge et protocoles d’hygiène clairs.",
  "Places limitées pour garder un accompagnement attentif — renseignez-vous tôt.",
  "Même campus que la maternelle et le primaire : une continuité rassurante pour la famille.",
];

export default function GarderiePage() {
  return (
    <>
      <SubNav items={nav} />
      <PageHero
        kicker="Garderie"
        title="Garderie Les Étoiles"
        lead="Un accueil doux pour les tout-petits, dès 3 mois. Sécurité, jeux, premiers liens et confiance — au rythme de chaque bébé."
      />
      <Container className="max-w-3xl space-y-8 py-12">
        <Prose>
          <p>
            La garderie accueille les bébés et les très jeunes enfants dans un espace pensé pour eux :
            tapis mousse, jeux sensoriels, temps de repos et sorties encadrées. Chaque enfant est connu
            par son nom ; des routines claires rassurent les tout-petits comme les parents.
          </p>
          <p>
            L’équipe veille à la propreté, à la communication quotidienne et à un climat bienveillant.
            Les familles d’Adjamé-Bingerville apprécient la proximité du campus et la possibilité de
            faire grandir les frères et sœurs au même endroit.
          </p>
        </Prose>

        <CycleRhythm title="Une journée en garderie" steps={rhythm} />
        <CycleExpectations
          title="Ce que vous pouvez attendre"
          items={expectations}
          tint="from-sky/40 to-mint/30"
        />

        <div className="flex flex-wrap gap-3">
          <Link
            href="/inscriptions"
            className="inline-flex rounded-full bg-coral px-5 py-3 font-semibold text-white shadow-sm hover:bg-coral-deep"
          >
            Demander une inscription
          </Link>
          <Link
            href="/activites"
            className="inline-flex rounded-full border border-line bg-white px-5 py-3 font-semibold text-green-deep hover:border-green/40"
          >
            Nos activités
          </Link>
        </div>
      </Container>
    </>
  );
}
