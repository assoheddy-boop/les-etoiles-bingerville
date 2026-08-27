import { homeActivities } from "./home-activities";

const catalogDetails: Record<string, string> = {
  "eveil-motricite":
    "Parcours moteurs, jeux de repérage et manipulation : les tout-petits découvrent leur corps en sécurité. L’équipe adapte les ateliers à l’âge (garderie, maternelle, début primaire) et veille au rythme de chacun.",
  "ateliers-creatifs":
    "Peinture, collage, modelage et bricolage : l’enfant exprime ses idées sans pression de résultat. Les réalisations peuvent être montrées aux parents ou exposées en classe pour valoriser l’effort.",
  "pre-lecture":
    "Comptines, histoires lues, graphisme et premières lettres : on prépare la lecture avec patience. En maternelle et en CP, les routines sont courtes et joyeuses pour garder l’envie d’apprendre.",
  "musique":
    "Chants, instruments simples et mouvements en groupe : la musique aide à mémoriser, à écouter les autres et à prendre confiance. Les fêtes scolaires permettent aussi de montrer ce travail aux familles.",
  "jeux-educatifs":
    "Puzzles, jeux de société adaptés, cubes à compter et jeux de rôle : on apprend en jouant, seul ou à plusieurs. L’objectif est la curiosité et la coopération, pas la compétition.",
  "nature-jardinage":
    "Observer les plantes, arroser le potager, toucher la terre : des moments calmes pour éveiller le respect du vivant. Selon la saison, les enfants peuvent semer, récolter ou dessiner ce qu’ils voient dans la cour.",
  "mini-sport":
    "Jeux de ballon, course, cerceaux et activités collectives sur la cour ou le terrain : bouger, partager et respecter les règles du jeu. L’encadrement reste bienveillant et adapté à chaque cycle.",
  "cuisine-ludique":
    "Découvrir les fruits, mélanger, goûter et partager : une approche sensorielle de l’alimentation. Hygiène des mains et vocabulaire des saveurs font partie du jeu, sans obligation de « bien manger » à tout prix.",
};

/** Catalogue étendu — aligné sur les 8 activités de la page d’accueil. */
export const activities = homeActivities.map((activity) => ({
  slug: activity.slug,
  emoji: activity.emoji,
  title: activity.title,
  punchline: activity.description,
  summary: activity.description,
  details: catalogDetails[activity.slug] ?? activity.description,
  image: activity.image?.src,
  imageAlt: activity.image?.alt ?? activity.title,
  tint: activity.tint,
}));

/** Photo de couverture — page Facebook officielle (avril 2024). */
export const heroImage = {
  src: "/images/facebook/cover-campus.jpg",
  alt: "Campus du Groupe scolaire Les Étoiles de Bingerville — photo Facebook officielle",
} as const;

export const campusEntranceImage = {
  src: "/images/facebook/rentree-03.jpg",
  alt: "Cour et espaces de jeux — photo Facebook Les Étoiles",
} as const;
