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
  title: "Primaire",
  description:
    "Primaire Les Étoiles de Bingerville — du CP au CM2 : lecture, calcul, civisme et suivi des familles.",
};

const rhythm = [
  {
    time: "7h30",
    emoji: "☀️",
    label: "Accueil & préparation",
    detail: "Rangement, appel et rappel des consignes de la journée.",
  },
  {
    time: "8h",
    emoji: "📚",
    label: "Cours du matin",
    detail: "Français, maths, questionner le monde — selon l’emploi du temps.",
  },
  {
    time: "12h",
    emoji: "🍽️",
    label: "Cantine & récréation",
    detail: "Repas à la cantine ou collation, puis jeux encadrés dans la cour.",
  },
  {
    time: "14h",
    emoji: "✏️",
    label: "Cours de l’après-midi",
    detail: "EPS, arts, anglais ou approfondissements selon les classes.",
  },
  {
    time: "16h30",
    emoji: "🌙",
    label: "Devoirs & départ",
    detail: "Temps de lecture ou devoirs guidés, puis retour aux familles.",
  },
];

const expectations = [
  "Parcours du CP1 au CM1, dispositif mixte français / ivoirien en CM2.",
  "Lecture, écriture, calcul et civisme — avec des évaluations lisibles pour les parents.",
  "Effectif maîtrisé : environ 25 élèves par classe, un élève par table.",
  "Espace parents pour notes, devoirs, bulletins et messages (après inscription).",
  "Même campus que la garderie et la maternelle : une continuité pour les frères et sœurs.",
];

export default function PrimairePage() {
  return (
    <>
      <SubNav items={nav} />
      <PageHero
        kicker="Primaire"
        title="Primaire Les Étoiles"
        lead="Du CP au CM2 : lire, compter, raisonner et grandir avec confiance."
      />
      <Container className="max-w-3xl space-y-8 py-12">
        <Prose>
          <p>
            Le primaire consolide la lecture, l&apos;écriture, le calcul et le civisme. Nous visons un
            rythme régulier, des évaluations claires pour les familles, et un climat où chaque enfant ose
            poser des questions.
          </p>
          <p>
            Le campus d&apos;Adjamé-Bingerville permet aux frères et sœurs de grandir au même endroit, de
            la garderie au CM2. Rigueur, discipline et travail — avec la bienveillance qui fait la
            marque des Étoiles.
          </p>
        </Prose>

        <CycleRhythm title="Une journée au primaire" steps={rhythm} />
        <CycleExpectations
          title="Ce que vous pouvez attendre"
          items={expectations}
          tint="from-mint/40 to-green-soft"
        />

        <div className="flex flex-wrap gap-3">
          <Link
            href="/inscriptions"
            className="inline-flex rounded-full bg-coral px-5 py-3 font-semibold text-white hover:bg-coral-deep"
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
