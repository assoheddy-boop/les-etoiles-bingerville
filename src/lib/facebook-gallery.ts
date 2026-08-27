/** Photos publiques de la page Facebook officielle (avril 2024 — rentrée). */
export type FacebookGalleryItem = {
  src: string;
  alt: string;
  caption?: string;
};

export const facebookPageUrl =
  "https://www.facebook.com/p/Groupe-Scolaire-les-Etoiles-de-Bingerville-61551554664090/";

export const facebookPageId = "61551554664090";

/** Devise officielle affichée sur la page Facebook. */
export const facebookMotto = "Rigueur · Discipline · Travail";

export const facebookGallery: FacebookGalleryItem[] = [
  {
    src: "/images/facebook/cover-campus.jpg",
    alt: "Façade et campus du Groupe scolaire Les Étoiles de Bingerville",
    caption: "Notre campus à Adjamé-Bingerville",
  },
  {
    src: "/images/facebook/rentree-01.jpg",
    alt: "Préparation de la rentrée scolaire aux Les Étoiles",
    caption: "Rentrée 2024-2025",
  },
  {
    src: "/images/facebook/rentree-02.jpg",
    alt: "Salles de classe prêtes pour les enfants",
    caption: "Classes accueillantes",
  },
  {
    src: "/images/facebook/rentree-03.jpg",
    alt: "Espace de jeux et cour de l'école",
    caption: "Cour et jeux",
  },
  {
    src: "/images/facebook/rentree-04.jpg",
    alt: "Enfants et activités sur le campus",
    caption: "Vie scolaire",
  },
  {
    src: "/images/facebook/rentree-05.jpg",
    alt: "Équipe et élèves des Les Étoiles",
    caption: "Grandir ensemble",
  },
];

export const facebookHero = facebookGallery[0];
