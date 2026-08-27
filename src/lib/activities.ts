export const activities = [
  {
    slug: "natation",
    emoji: "🏊",
    title: "Natation",
    punchline: "Maîtriser l’eau, grandir en confiance",
    summary:
      "À la piscine, les enfants apprennent à nager, à se dépasser et à respecter les règles de sécurité — dès le plus jeune âge.",
    details:
      "L’atelier natation développe endurance, coordination et confiance. Encadré par des éducateurs, il s’adresse aux cycles maternelle et primaire, avec une progression adaptée au niveau de chacun.",
    image: "/images/activites/natation.jpg",
    imageAlt: "Bassin de natation — illustration d’atelier (photo libre, pas le campus)",
  },
  {
    slug: "robotique",
    emoji: "🤖",
    title: "Robotique",
    punchline: "Développer la créativité par la robotique",
    summary:
      "Construire, programmer, expérimenter : un atelier STEM pour apprendre en faisant, et aimer les sciences.",
    details:
      "Les élèves manipulent robots et kits éducatifs, travaillent en équipe et découvrent la logique, le raisonnement et la créativité. Un pont concret vers les métiers de demain, sans jargon inutile.",
    image: "/images/activites/robotique.jpg",
    imageAlt: "Élèves africains en uniforme, en classe — illustration Pexels",
  },
  {
    slug: "anglais",
    emoji: "🇬🇧",
    title: "Anglais",
    punchline: "Parler le monde dès le plus jeune âge",
    summary:
      "Des cours interactifs pour oser s’exprimer : jeux, chansons, dialogues — l’anglais comme une langue vivante.",
    details:
      "L’anglais aux Étoiles n’est pas une liste de mots à reciter. Les enfants parlent, écoutent, jouent. L’objectif : une oreille habituée et le plaisir de communiquer, dès la maternelle.",
    image: "/images/activites/anglais.jpg",
    imageAlt: "Enfants africains en classe, mains levées — illustration Pexels",
  },
  {
    slug: "cuisine",
    emoji: "🍳",
    title: "Cuisine",
    punchline: "Goûter, créer, partager autour d’un atelier",
    summary:
      "Un atelier cuisine scolaire pour éveiller les sens, l’autonomie et le goût du travail bien fait.",
    details:
      "Mesurer, mélanger, présenter : la cuisine apprend la patience et la coopération. Les enfants découvrent des recettes simples, l’hygiène en cuisine et le plaisir de partager ce qu’ils ont préparé.",
    image: "/images/activites/cuisine.jpg",
    imageAlt: "Bol de légumes et céréales — illustration d’atelier cuisine (Pexels)",
  },
  {
    slug: "danse",
    emoji: "💃",
    title: "Danse",
    punchline: "Le corps en mouvement, l’enfant en expression",
    summary:
      "Rythme, posture, joie : un cours de danse pour libérer l’énergie et cultiver la présence sur scène comme en classe.",
    details:
      "La danse aux Étoiles allie coordination, écoute du groupe et confiance en soi. Un espace où chaque enfant peut s’exprimer, sans jugement, et apprendre à habiter son corps.",
    image: "/images/activites/danse.jpg",
    imageAlt: "Enfants africains souriant à la fenêtre d’une école — Unsplash",
  },
] as const;

/** Photo de couverture — page Facebook officielle (avril 2024). */
export const heroImage = {
  src: "/images/facebook/cover-campus.jpg",
  alt: "Campus du Groupe scolaire Les Étoiles de Bingerville — photo Facebook officielle",
} as const;

export const campusEntranceImage = {
  src: "/images/facebook/rentree-03.jpg",
  alt: "Cour et espaces de jeux — photo Facebook Les Étoiles",
} as const;
