export type HomeActivity = {
  slug: string;
  emoji: string;
  title: string;
  description: string;
  tint: string;
  image?: {
    src: string;
    alt: string;
  };
};

export const homeActivitiesSection = {
  eyebrow: "Vie de l'école",
  title: "Petits pas, grandes découvertes",
  subtitle:
    "Des activités douces et joyeuses pour la garderie, la maternelle et le primaire — apprendre en s'amusant, sans précipitation.",
  note: "Activités du quotidien",
  cycles: ["Garderie", "Maternelle", "Primaire"] as const,
  closing: {
    title: "Un monde qui fait grandir",
    text: "Chaque jour, les enfants explorent, créent et s'expriment dans un cadre bienveillant. Ici, on grandit à son rythme, avec confiance et le sourire.",
  },
} as const;

export const homeActivities: HomeActivity[] = [
  {
    slug: "eveil-motricite",
    emoji: "🤸",
    title: "Éveil & motricité",
    description:
      "Blocs géants, parcours de motricité et tapis mousse : on bouge, on explore et on prend confiance dans son corps.",
    tint: "from-sky/50 to-mint/40",
    image: {
      src: "/images/home/eveil-motricite.jpg",
      alt: "Enfants africains jouant dans la cour d'une école en Zambie",
    },
  },
  {
    slug: "ateliers-creatifs",
    emoji: "🎨",
    title: "Ateliers créatifs",
    description:
      "Peinture à pinceaux larges, collage, crayons et pâte à modeler — chaque enfant laisse libre cours à son imagination.",
    tint: "from-peach/60 to-coral/30",
    image: {
      src: "/images/home/ateliers-creatifs.jpg",
      alt: "Enfants africains peignant lors d'un atelier créatif en maternelle",
    },
  },
  {
    slug: "pre-lecture",
    emoji: "📖",
    title: "Pré-lecture / pré-écriture",
    description:
      "Lettres, histoires avec la maîtresse et ardoises : les premiers pas vers la lecture, à son rythme et avec patience.",
    tint: "from-lavender/50 to-sky/30",
    image: {
      src: "/images/home/pre-lecture.jpg",
      alt: "Enfants africains en classe, attentifs et curieux d'apprendre",
    },
  },
  {
    slug: "musique",
    emoji: "🎵",
    title: "Musique & expression",
    description:
      "Comptines, tambourin et maracas, danse en cercle : s'exprimer avec le cœur et le corps.",
    tint: "from-coral/40 to-lavender/40",
    image: {
      src: "/images/home/musique.jpg",
      alt: "Enfants africains en danse et rythme lors d'une fête scolaire en Afrique de l'Ouest",
    },
  },
  {
    slug: "jeux-educatifs",
    emoji: "🧩",
    title: "Jeux éducatifs",
    description:
      "Puzzles en bois, couleurs et formes, jeux de rôle et cubes à chiffres — curiosité et plaisir d'apprendre.",
    tint: "from-mint/50 to-green-soft",
    image: {
      src: "/images/home/jeux-educatifs.jpg",
      alt: "Enfants africains en classe maternelle apprenant l'alphabet avec leur enseignante",
    },
  },
  {
    slug: "nature-jardinage",
    emoji: "🌱",
    title: "Nature & jardinage",
    description:
      "Potager, plantes et graines, cour arborée : observer, toucher et s'émerveiller face à la nature.",
    tint: "from-mint/60 to-sky/40",
    image: {
      src: "/images/home/nature.jpg",
      alt: "Enfants africains regardant par la fenêtre de leur école",
    },
  },
  {
    slug: "mini-sport",
    emoji: "⚽",
    title: "Mini-sport",
    description:
      "Ballon sur la cour, cerceaux, course et jeux de groupe : bouger, partager et s'amuser ensemble.",
    tint: "from-sky/55 to-peach/45",
    image: {
      src: "/images/home/mini-sport.jpg",
      alt: "Enfants jouant au football dans la cour d'une école à Kampala",
    },
  },
  {
    slug: "cuisine-ludique",
    emoji: "🍎",
    title: "Cuisine ludique",
    description:
      "Fruits, mélange dans les bols et petits biscuits : découvrir les saveurs en jouant.",
    tint: "from-peach/55 to-coral/35",
    image: {
      src: "/images/home/cuisine-ludique.jpg",
      alt: "Enfants africains partageant un repas joyeux en classe",
    },
  },
];
