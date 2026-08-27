import type { CmsContent } from "./cms-types";

export const cmsSeed: CmsContent = {
  histoire: {
    title: "Notre histoire & nos valeurs",
    editorialNote:
      "Brouillon éditorial — à valider par la direction. Les éléments juridiques (RCCM, adresse) sont publics ; la chronologie détaillée de la fondation reste à confirmer.",
    body: `Le Groupe scolaire Les Étoiles de Bingerville est implanté à Adjamé-Bingerville, sur les lots 1359 à 1362 (ilot 32). La société est enregistrée sous le RCCM CI-ABJ-03-2021-B12-05532, avec pour objet la création et l'exploitation d'établissements préscolaires et primaires.

L'histoire précise de la fondation — date d'ouverture des premières classes, étapes du campus, noms des fondateurs au-delà des informations publiques — sera complétée ici dès validation par la direction. Ce que nous pouvons dire aujourd'hui : un campus pensé pour accueillir la garderie, la maternelle et le primaire jusqu'au CM2, dans un esprit de proximité avec les familles du quartier.

Le campus comprend des classes, une cantine, des espaces de jeux et un terrain de sport. L'objectif affiché : des effectifs maîtrisés pour que chaque enfant soit connu et accompagné.

Nos valeurs : la bienveillance (écouter, rassurer, accompagner), l'exigence (rigueur, discipline, travail — notre devise sur Facebook) et le partenariat avec les familles. Les numéros d'agrément MENA / DEEP seront publiés dès confirmation officielle.`,
  },
  motDuProviseur: {
    title: "Mot de la direction",
    authorLabel: "Mme Koné, directrice — brouillon à confirmer",
    editorialNote:
      "⚠️ Texte provisoire — à remplacer par le message officiel signé par la direction avant publication définitive.",
    body: `Chers parents, chers élèves,

Bienvenue au Groupe scolaire Les Étoiles de Bingerville.

Notre devise — Rigueur · Discipline · Travail — accompagne chaque journée. Nous voulons un lieu où les tout-petits et les enfants grandissent en confiance, du premier accueil en garderie jusqu'au CM2.

Grandir en douceur, briller chaque jour : ce n'est pas un slogan vide. C'est l'attention portée à chaque enfant, la clarté des attentes et le dialogue avec les familles d'Adjamé-Bingerville.

Ce site vous permet de découvrir l'école, de demander une inscription et — une fois inscrits — de suivre la scolarité via l'espace parents. Les paiements en ligne ne sont pas encore activés : le secrétariat reste votre interlocuteur pour les démarches et les frais.

Je vous invite à nous rendre visite. L'équipe se fera un plaisir de vous accueillir.

Ensemble, élevons vos enfants.

Mme Koné
Directrice`,
  },
  informations: {
    title: "Informations pratiques",
    intro:
      "Tout ce qu’une famille doit savoir avant de venir : cycles, horaires, cantine, transport, documents et contact. Les tarifs détaillés seront publiés dès validation par la direction.",
    items: [
      {
        title: "Où nous trouver",
        body: "Bingerville, quartier Adjamé-Bingerville — Lot 1359-1360-1361-1362, Ilot 32. 01 BP 4772 Abidjan 01.",
      },
      {
        title: "Horaires",
        body: "Lundi à vendredi, 7h30 – 16h30. Pour un rendez-vous avec la direction, merci d’appeler ou d’écrire au préalable. WhatsApp : +225 07 06 06 96 67.",
      },
      {
        title: "Cantine",
        body: "Une cantine est prévue sur le campus. Les modalités (jours, menus, tarifs) sont communiquées en début d’année. Le paiement en ligne de la cantine sera disponible dans l’espace parents dès branchement du prestataire.",
      },
      {
        title: "Transport",
        body: "Renseignez-vous auprès du secrétariat pour les circuits éventuels et les conditions. En l’absence d’offre, les familles organisent le trajet.",
      },
      {
        title: "Frais de scolarité",
        body: "Les montants (inscription, mensualités par cycle, cantine, transport) seront publiés ici dès transmission par l’école. En attendant, contactez-nous : réponse visée sous 24 h les jours ouvrés.",
      },
      {
        title: "Documents souvent demandés à l’inscription",
        body: "Extrait de naissance, photos d’identité, carnet de vaccination (maternelle), bulletins de l’année précédente (primaire), photocopie de la pièce du parent. Liste définitive remise au secrétariat.",
      },
    ],
  },
  news: [
    {
      id: "rentree-2026",
      slug: "rentree-2026-2027",
      title: "Rentrée 2026-2027 : inscriptions ouvertes",
      excerpt:
        "Les familles peuvent déposer une demande d’inscription pour la garderie, la maternelle et le primaire.",
      body: `Les inscriptions pour l’année scolaire 2026-2027 sont ouvertes à Bingerville – Adjamé-Bingerville.

Pour réserver une place : remplissez le formulaire « Demander une inscription », écrivez-nous, ou passez au secrétariat.

Merci de prévoir les pièces usuelles (extrait de naissance, photos, bulletins le cas échéant). Les tarifs officiels vous seront communiqués par l’administration. Le numéro WhatsApp sera publié dès confirmation.`,
      publishedAt: "2026-08-01",
      status: "published",
    },
    {
      id: "campus-adjame",
      slug: "campus-adjame-bingerville",
      title: "Un campus à Adjamé-Bingerville",
      excerpt:
        "Garderie au CM2, 16 classes, cantine, salle multimédia, jeux et terrain de sport. Présentation à la notabilité le 17 septembre 2023.",
      body: `Le campus des Étoiles, à Adjamé-Bingerville, a été conçu pour environ 350 élèves, avec 25 enfants par classe.

L’établissement comprend une garderie, la maternelle et le primaire jusqu’au CM2, une salle des maîtres, une cantine, une salle multimédia, un espace de jeux et un terrain de sport.

Les agréments du Ministère de l’Éducation nationale et de l’Alphabétisation seront indiqués ici dès que les numéros officiels seront confirmés par la direction.`,
      publishedAt: "2026-07-18",
      status: "published",
    },
    {
      id: "espace-parents",
      slug: "espace-parents-paiements",
      title: "Espace parents : scolarité et cantine",
      excerpt:
        "Un espace dédié permet de se connecter avec le matricule de l’élève. Le branchement Wave / Orange Money / CinetPay est la prochaine étape.",
      body: `Les parents d’élèves déjà inscrits se connectent avec le matricule et le mot de passe communiqués par l’école.

Vous pourrez y consulter le solde de scolarité et de cantine, puis choisir un mode de paiement. Tant que les clés prestataire ne sont pas configurées, aucun prélèvement réel n’est effectué.

Mot de passe oublié ? Contactez le secrétariat.`,
      publishedAt: "2026-08-10",
      status: "published",
    },
  ],
};
