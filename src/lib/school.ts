export const school = {
  name: "Groupe scolaire Les Étoiles de Bingerville",
  shortName: "Les Étoiles",
  legalName: "Groupe scolaire Les Étoiles de Bingerville SARL",
  tagline: "Grandir en douceur, briller chaque jour.",
  description:
    "Garderie, maternelle et primaire à Bingerville — Adjamé-Bingerville. Un campus chaleureux pour les tout-petits et les enfants, de 3 mois au CM2.",
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
      display: "+225 07 06 06 96 67",
      href: "tel:+2250706069667",
      e164: "2250706069667",
    },
    {
      label: "Fixe",
      display: "À confirmer",
      href: undefined,
      e164: "2250706069667",
    },
  ],
  email: "letoiles67@gmail.com",
  facebook:
    "https://www.facebook.com/p/Groupe-Scolaire-les-Etoiles-de-Bingerville-61551554664090/",
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
    cycle: "Garderie",
    schoolName: "Garderie Les Étoiles de Bingerville",
    decision: "À confirmer (MENA / DEEP) — garderie",
    date: "À confirmer",
  },
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
