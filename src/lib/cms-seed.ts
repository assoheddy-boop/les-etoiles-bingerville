import type { CmsContent } from "./cms-types";

export const cmsSeed: CmsContent = {
  histoire: {
    title: "Notre histoire & nos valeurs",
    editorialNote:
      "Texte de démarrage d’après l’avis de constitution (décembre 2021) et l’article FratMat du 18 septembre 2023. Agréments MEN non retrouvés en ligne — placeholders à valider par la direction.",
    body: `Le Groupe scolaire Les Étoiles de Bingerville est une société à responsabilité limitée constituée le 1er septembre 2021 (RCCM CI-ABJ-03-2021-B12-05532). Son objet : la création et l’exploitation d’écoles préscolaires et primaires. Le siège est à Bingerville, quartier Adjamé-Bingerville (lots 1359 à 1362, ilot 32). Gérant : M. Lacina Koné.

Le 17 septembre 2023, l’établissement a été présenté à la notabilité d’Adjamé-Bingerville, sous la conduite de Mme Koné, directrice. Le campus a été conçu pour environ 350 élèves : de la garderie au CM2, 16 classes, salle des maîtres, cantine, bureaux, salle multimédia, espace de jeux et terrain de sport. L’objectif affiché : 25 enfants par classe, un élève par table.

La rentrée 2023-2024 a ouvert le 25 septembre 2023, avec un parcours français du CP1 au CM1 et un dispositif mixte (français / ivoirien) en CM2.

Nous croyons à trois piliers : la bienveillance (chaque enfant est connu et accompagné), l’exigence (le travail, la politesse, la régularité) et le partenariat avec les familles. Les numéros d’agrément MENA / DEEP seront publiés dès confirmation par la direction.`,
  },
  motDuProviseur: {
    title: "Mot de la direction",
    authorLabel: "Mme Koné, directrice",
    editorialNote:
      "Brouillon de ton, inspiré des propos publics de Mme Koné (FratMat, septembre 2023). À remplacer par le message officiel de la direction.",
    body: `Chers parents, chers élèves,

Bienvenue au Groupe scolaire Les Étoiles de Bingerville.

Nous avons voulu un lieu pour la formation des tout-petits : un campus moderne à Adjamé-Bingerville, des classes à effectif maîtrisé, et le respect des familles comme des traditions du village. De la garderie au CM2, notre mission est simple : aider chaque enfant à grandir, briller et exceller.

Ce site présente l’école, oriente vers l’inscription, et ouvre — pour les familles déjà inscrites — un espace de suivi (notes, devoirs, cantine). Les paiements en ligne ne sont pas encore branchés : le secrétariat reste votre interlocuteur.

Je vous invite à nous rendre visite. L’équipe vous répondra.

Ensemble, élevons vos enfants.`,
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
        body: "Lundi à vendredi, 7h30 – 16h30. Pour un rendez-vous avec la direction, merci d’appeler ou d’écrire au préalable. Téléphone WhatsApp : à confirmer.",
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
