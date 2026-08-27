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
  title: "Maternelle",
  description:
    "Maternelle Les Étoiles de Bingerville — petite, moyenne et grande section : éveil, langage et vie en groupe.",
};

const rhythm = [
  {
    time: "7h30",
    emoji: "☀️",
    label: "Rituel du matin",
    detail: "Accueil, registre des présences, comptines et jeux libres.",
  },
  {
    time: "9h",
    emoji: "📖",
    label: "Ateliers structurés",
    detail: "Langage, graphisme, motricité fine ou découverte des nombres.",
  },
  {
    time: "10h30",
    emoji: "🍎",
    label: "Collation & cour",
    detail: "Pause goûter, jeux dehors ou dans la salle de motricité.",
  },
  {
    time: "14h",
    emoji: "🎨",
    label: "Créativité & musique",
    detail: "Peinture, chants, jeux de rôle ou atelier nature.",
  },
  {
    time: "16h30",
    emoji: "🌙",
    label: "Au revoir",
    detail: "Retour serein : un mot sur la journée si besoin.",
  },
];

const expectations = [
  "Petite, moyenne et grande section : un parcours progressif vers le primaire.",
  "Langage, motricité, vie en groupe et premiers apprentissages — sans précipitation.",
  "Classes colorées, routines claires et temps de jeu quotidiens.",
  "Les parents sont informés des sorties, de la cantine et des temps forts de l’année.",
  "Réponse du secrétariat sous 24 h les jours ouvrés pour une visite ou une inscription.",
];

export default function MaternellePage() {
  return (
    <>
      <SubNav items={nav} />
      <PageHero
        kicker="Maternelle"
        title="Maternelle Les Étoiles"
        lead="Petite, moyenne et grande sections : éveil joyeux, langage et premiers apprentissages en douceur."
      />
      <Container className="max-w-3xl space-y-8 py-12">
        <Prose>
          <p>
            La maternelle accueille les enfants de 3 à 5 ans dans un cadre coloré et rassurant. Langage,
            motricité, vie en groupe, arts et éveil scientifique se mêlent à des routines que les
            tout-petits adorent — et qui préparent sereinement l’entrée au CP.
          </p>
          <p>
            Nous prenons l’enfant au sérieux avec douceur : on écoute, on observe, on encourage. Les
            familles sont associées dès la rentrée pour les horaires, la cantine, les sorties et le suivi
            des premiers apprentissages.
          </p>
        </Prose>

        <CycleRhythm title="Une journée en maternelle" steps={rhythm} />
        <CycleExpectations
          title="Ce que vous pouvez attendre"
          items={expectations}
          tint="from-lavender/50 to-peach/40"
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
