export const school = {
  name: "Groupe scolaire Les Étoiles de Bingerville",
  shortName: "Les Étoiles",
  legalName: "Groupe scolaire Les Étoiles de Bingerville SARL",
  tagline: "Grandir, briller, exceller.",
  description:
    "Groupe scolaire à Bingerville — Adjamé-Bingerville : garderie, maternelle et primaire. Établissement privé constitué en 2021, campus de 16 classes. Agréments MEN à confirmer.",
  neighborhood: "Adjamé-Bingerville",
  city: "Bingerville",
  region: "Abidjan",
  country: "Côte d’Ivoire",
  address:
    "Bingerville, quartier Adjamé-Bingerville, Lot 1359-1360-1361-1362, Ilot 32 — Côte d’Ivoire",
  bp: "01 BP 4772 Abidjan 01",
  rccm: "CI-ABJ-03-2021-B12-05532",
  phones: [
    {
      label: "Mobile / WhatsApp",
      display: "À confirmer",
      href: "tel:+2250000000000",
      e164: "2250000000000",
    },
    {
      label: "Fixe",
      display: "À confirmer",
      href: "tel:+2250000000000",
      e164: "2250000000000",
    },
  ],
  email: "contact@lesetoilesbingerville.ci",
  facebook: "",
  website: "https://les-etoiles-bingerville.vercel.app",
  mapsQuery: "Groupe scolaire Les Étoiles Adjamé-Bingerville Bingerville",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Groupe%20scolaire%20Les%20Etoiles%20Adjame-Bingerville%20Bingerville",
  osmEmbed:
    "https://www.openstreetmap.org/export/embed.html?bbox=-3.94%2C5.33%2C-3.87%2C5.38&layer=mapnik&marker=5.355%2C-3.905",
  hours: "Lundi – vendredi, 7h30 – 16h30",
  hoursNote:
    "Horaires d’accueil administratif à confirmer auprès du secrétariat. Réponse visée sous 24 h les jours ouvrés.",
  whatsappMessage:
    "Bonjour, je souhaite des informations pour inscrire un enfant au Groupe scolaire Les Étoiles de Bingerville (Adjamé-Bingerville).",
  directorTitle: "La Directrice",
  directorName: "Mme Koné",
  dren: "DRENA Abidjan 1 — Inspection primaire Bingerville",
  educationLevels: "Garderie · Maternelle · Primaire",
  logoPath: "/images/logo-etoiles.png",
} as const;

export const menApprovals = [
  {
    cycle: "Maternelle",
    schoolName: "Maternelle Les Étoiles de Bingerville",
    decision: "À confirmer (MENA / DEEP) — maternelle",
    date: "À confirmer",
  },
  {
    cycle: "Primaire",
    schoolName: "Primaire Les Étoiles de Bingerville",
    decision: "À confirmer (MENA / DEEP) — primaire",
    date: "À confirmer",
  },
] as const;

export function whatsappUrl(message: string = school.whatsappMessage) {
  const phone = school.phones[0].e164;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
