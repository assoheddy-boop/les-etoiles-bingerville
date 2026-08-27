import type { AiRole } from "./ai-roles";

export type HelpPage = {
  path: string;
  title: string;
  blurb: string;
  roles: Array<AiRole | "all">;
};

/** Carte statique des modules — jamais le JSON school-life. */
export const helpPages: HelpPage[] = [
  { path: "/", title: "Accueil", blurb: "Présentation du groupe scolaire.", roles: ["all"] },
  { path: "/ecole", title: "L’école", blurb: "Présentation, valeurs, implantation Bingerville – Adjamé.", roles: ["all"] },
  { path: "/ecole/histoire", title: "Histoire & valeurs", blurb: "Parcours du groupe Les Étoiles.", roles: ["all"] },
  { path: "/ecole/mot-du-proviseur", title: "Mot du proviseur", blurb: "Message de la direction.", roles: ["all"] },
  { path: "/ecole/agrements", title: "Agréments MEN", blurb: "Décisions ministérielles maternelle et primaire.", roles: ["all"] },
  { path: "/cycles", title: "Cycles", blurb: "Garderie, maternelle et primaire.", roles: ["all"] },
  { path: "/cycles/garderie", title: "Garderie", blurb: "Garderie Les Étoiles.", roles: ["all"] },
  { path: "/cycles/maternelle", title: "Maternelle", blurb: "Maternelle Les Étoiles.", roles: ["all"] },
  { path: "/cycles/primaire", title: "Primaire", blurb: "Primaire Les Étoiles.", roles: ["all"] },
  { path: "/activites", title: "Activités", blurb: "Vie extra-scolaire.", roles: ["all"] },
  { path: "/informations", title: "Informations pratiques", blurb: "Horaires, accès, consignes.", roles: ["all"] },
  { path: "/actualites", title: "Actualités", blurb: "Annonces publiées.", roles: ["all"] },
  { path: "/informations/objets-perdus", title: "Objets perdus (public)", blurb: "Annonces d’objets retrouvés.", roles: ["all"] },
  { path: "/contact", title: "Contact", blurb: "Formulaire, téléphone, plan. E-mail au secrétariat si Resend est configuré, sinon la demande est quand même enregistrée.", roles: ["all"] },
  { path: "/inscriptions", title: "Inscriptions", blurb: "Demande d’inscription en ligne (pas de paiement en ligne). Accusé e-mail au parent si Resend est configuré.", roles: ["all"] },
  { path: "/mentions-legales", title: "Mentions légales", blurb: "Éditeur et données.", roles: ["all"] },
  { path: "/politique-confidentialite", title: "Confidentialité", blurb: "Traitement des données personnelles.", roles: ["all"] },
  { path: "/connexion", title: "Connexion parents", blurb: "Espace familles (matricule).", roles: ["all"] },
  { path: "/espace-enseignants/connexion", title: "Connexion enseignants", blurb: "Espace professeurs.", roles: ["all"] },
  { path: "/espace-vigile/connexion", title: "Connexion vigile", blurb: "Accès grille / sorties.", roles: ["all"] },
  { path: "/admin/connexion", title: "Connexion direction", blurb: "Fondateur, directeur, vie scolaire.", roles: ["all"] },
  { path: "/super-admin/connexion", title: "Connexion SuperAdmin", blurb: "Accès réservé — ne pas divulguer d’identifiants.", roles: ["all"] },

  { path: "/espace-parents", title: "Tableau de bord parent", blurb: "Vue d’ensemble de l’élève.", roles: ["parent", "fondateur", "direction"] },
  { path: "/espace-parents/emploi-du-temps", title: "Emploi du temps", blurb: "Planning de la classe.", roles: ["parent", "fondateur", "direction"] },
  { path: "/espace-parents/notes", title: "Notes", blurb: "Notes déjà saisies — l’assistant ne les invente pas.", roles: ["parent", "fondateur", "direction"] },
  { path: "/espace-parents/absences", title: "Absences", blurb: "Appel et retards.", roles: ["parent", "fondateur", "direction"] },
  { path: "/espace-parents/devoirs", title: "Devoirs", blurb: "Travail à la maison.", roles: ["parent", "fondateur", "direction"] },
  { path: "/espace-parents/bulletins", title: "Bulletins", blurb: "Bulletins déposés, PDF.", roles: ["parent", "fondateur", "direction"] },
  { path: "/espace-parents/paiements", title: "Paiements", blurb: "Échéances. Wave / Orange Money n’encaissent pas encore.", roles: ["parent", "fondateur", "direction", "secretariat"] },
  { path: "/espace-parents/transport", title: "Bus", blurb: "Suivi transport scolaire.", roles: ["parent", "fondateur", "direction"] },
  { path: "/espace-parents/sortie", title: "Autorisation de sortie", blurb: "QR / code pour le vigile.", roles: ["parent", "fondateur", "direction", "vigile"] },
  { path: "/espace-parents/sante", title: "Santé", blurb: "Incidents infirmés à l’école.", roles: ["parent", "fondateur", "direction", "vie_scolaire"] },
  { path: "/espace-parents/objets-perdus", title: "Objets perdus", blurb: "Signalements familles.", roles: ["parent", "fondateur", "direction"] },
  { path: "/espace-parents/messages", title: "Messages parents", blurb: "Échanges avec l’école / enseignants.", roles: ["parent", "fondateur", "direction"] },

  { path: "/espace-enseignants", title: "Accueil enseignants", blurb: "Tableau de bord professeur.", roles: ["enseignant", "fondateur", "direction", "vie_scolaire"] },
  { path: "/espace-enseignants/emploi-du-temps", title: "EDT enseignant", blurb: "Créneaux du professeur.", roles: ["enseignant", "fondateur", "direction"] },
  { path: "/espace-enseignants/cours", title: "Cours du jour", blurb: "Valider les cours effectués.", roles: ["enseignant", "fondateur", "direction", "vie_scolaire"] },
  { path: "/espace-enseignants/journal", title: "Cours effectués", blurb: "Historique des validations.", roles: ["enseignant", "fondateur", "direction", "vie_scolaire"] },
  { path: "/espace-enseignants/appel", title: "Appel", blurb: "Présences de la classe.", roles: ["enseignant", "fondateur", "direction", "vie_scolaire"] },
  { path: "/espace-enseignants/devoirs", title: "Devoirs (prof)", blurb: "Publier un devoir, pièce jointe.", roles: ["enseignant", "fondateur", "direction"] },
  { path: "/espace-enseignants/controles", title: "Contrôles", blurb: "Planifier contrôles et compositions.", roles: ["enseignant", "fondateur", "direction"] },
  { path: "/espace-enseignants/notes", title: "Saisie des notes", blurb: "Notes dans l’espace professeur.", roles: ["enseignant", "fondateur", "direction"] },
  { path: "/espace-enseignants/bulletins", title: "Dépôt de bulletins", blurb: "Déposer un bulletin pour les familles.", roles: ["enseignant", "fondateur", "direction"] },
  { path: "/espace-enseignants/classes", title: "Classes", blurb: "Effectifs du professeur.", roles: ["enseignant", "fondateur", "direction"] },
  { path: "/espace-enseignants/rh", title: "RH enseignant", blurb: "Présence, congés, fiche paie si publiée.", roles: ["enseignant", "fondateur", "direction"] },
  { path: "/espace-enseignants/messages", title: "Messages enseignants", blurb: "Écrire aux familles.", roles: ["enseignant", "fondateur", "direction"] },

  { path: "/espace-vigile", title: "Tableau vigile", blurb: "Écran grille : valider le code / QR de sortie.", roles: ["vigile", "fondateur", "direction", "vie_scolaire"] },

  { path: "/admin", title: "Accueil direction", blurb: "Console administrative.", roles: ["fondateur", "direction", "vie_scolaire", "secretariat"] },
  { path: "/admin/etablissements", title: "Établissements", blurb: "Les 3 sites (maternelle, primaire, collège).", roles: ["fondateur", "direction"] },
  { path: "/admin/annee-scolaire", title: "Année scolaire", blurb: "Période active, trimestres.", roles: ["fondateur", "direction"] },
  { path: "/admin/contenu", title: "Contenu du site", blurb: "Textes publics (histoire, infos…).", roles: ["fondateur", "direction"] },
  { path: "/admin/actualites", title: "Actualités (admin)", blurb: "Publier une news.", roles: ["fondateur", "direction"] },
  { path: "/admin/demandes", title: "Demandes", blurb: "Messages du formulaire contact / inscriptions.", roles: ["fondateur", "direction", "secretariat"] },
  { path: "/admin/inscriptions", title: "Fiches inscription", blurb: "Dossiers élèves, photos, attestations.", roles: ["fondateur", "direction", "secretariat"] },
  { path: "/admin/inscriptions/nouvelle", title: "Nouvelle inscription", blurb: "Créer une fiche.", roles: ["fondateur", "direction", "secretariat"] },
  { path: "/admin/reinscriptions", title: "Réinscriptions", blurb: "Campagne de réinscription.", roles: ["fondateur", "direction", "secretariat"] },
  { path: "/admin/eleves", title: "Élèves", blurb: "Liste et fiches.", roles: ["fondateur", "direction", "vie_scolaire", "secretariat"] },
  { path: "/admin/classes", title: "Classes", blurb: "Structure pédagogique.", roles: ["fondateur", "direction", "vie_scolaire"] },
  { path: "/admin/parents", title: "Parents", blurb: "Comptes familles.", roles: ["fondateur", "direction", "secretariat"] },
  { path: "/admin/enseignants", title: "Enseignants", blurb: "Comptes professeurs.", roles: ["fondateur", "direction"] },
  { path: "/admin/emploi-du-temps", title: "Emploi du temps (admin)", blurb: "Grille des cours.", roles: ["fondateur", "direction", "vie_scolaire"] },
  { path: "/admin/matieres", title: "Matières", blurb: "Référentiel.", roles: ["fondateur", "direction"] },
  { path: "/admin/bulletins", title: "Bulletins (admin)", blurb: "Suivi des dépôts.", roles: ["fondateur", "direction"] },
  { path: "/admin/vie-scolaire", title: "Vie scolaire", blurb: "Absences, incidents, suivi.", roles: ["fondateur", "direction", "vie_scolaire"] },
  { path: "/admin/controle-enseignants", title: "Contrôle enseignants", blurb: "Cours validés, alertes, journaux d’activité (non éditables depuis le chat).", roles: ["fondateur", "direction", "vie_scolaire"] },
  { path: "/admin/controle-enseignants/alertes", title: "Alertes contrôle", blurb: "Retards de validation, devoirs, notes.", roles: ["fondateur", "direction", "vie_scolaire"] },
  { path: "/admin/controle-enseignants/logs", title: "Journaux enseignants", blurb: "Logs métier en lecture — ne pas proposer de les modifier.", roles: ["fondateur", "direction"] },
  { path: "/admin/controle-enseignants/parametres", title: "Paramètres contrôle", blurb: "Activer / seuils du module.", roles: ["fondateur"] },
  { path: "/admin/frais", title: "Frais de scolarité", blurb: "Barèmes et échéances (affichage). Pas d’encaissement Wave/OM.", roles: ["fondateur", "direction", "secretariat"] },
  { path: "/admin/compta", title: "Comptabilité", blurb: "Comptes, dépenses, factures, budget.", roles: ["fondateur", "direction"] },
  { path: "/admin/compta/comptes", title: "Comptes finance", blurb: "Caisse, banque, Wave, OM (suivis internes, pas de PSP).", roles: ["fondateur", "direction"] },
  { path: "/admin/caisse", title: "Caisse", blurb: "Encaissements au secrétariat (espèces / saisie).", roles: ["fondateur", "direction", "secretariat"] },
  { path: "/admin/cas-sociaux", title: "Cas sociaux", blurb: "Remises et échéanciers familiaux.", roles: ["fondateur", "direction"] },
  { path: "/admin/transport", title: "Transport (admin)", blurb: "Lignes et suivis bus.", roles: ["fondateur", "direction", "vie_scolaire"] },
  { path: "/admin/sortie", title: "Sorties (admin)", blurb: "Autorisations de récupération.", roles: ["fondateur", "direction", "vie_scolaire"] },
  { path: "/admin/sante", title: "Santé (admin)", blurb: "Registre infirmerie.", roles: ["fondateur", "direction", "vie_scolaire"] },
  { path: "/admin/objets-perdus", title: "Objets perdus (admin)", blurb: "Gestion des annonces.", roles: ["fondateur", "direction", "vie_scolaire"] },
  { path: "/admin/rh", title: "RH", blurb: "Personnel, présence, congés.", roles: ["fondateur", "direction"] },
  { path: "/admin/rh/paie", title: "Paie", blurb: "Bulletins de salaire internes.", roles: ["fondateur", "direction"] },
  { path: "/admin/rh/presence", title: "Présence staff", blurb: "Pointage personnel.", roles: ["fondateur", "direction"] },
  { path: "/super-admin", title: "Tableau SuperAdmin", blurb: "KPI établissements, modules, finances espèces (démo), activité enseignants. Carte E-mails : configuré / non (Resend).", roles: ["superadmin"] },
  { path: "/super-admin/modules", title: "Contrôle des modules", blurb: "Activer / désactiver un module (global, rôle, école, utilisateur).", roles: ["superadmin"] },
  { path: "/super-admin/parents-modules", title: "Modules parents", blurb: "Activer l’espace parents par famille (moduleParentsActive).", roles: ["superadmin"] },
  { path: "/super-admin/parents-finances", title: "Finances parents (espèces)", blurb: "File d’attente espèces interne — pas de Wave / Orange Money.", roles: ["superadmin"] },
  { path: "/super-admin/controle-enseignants", title: "Contrôle enseignants (SuperAdmin)", blurb: "Même vue que /admin/controle-enseignants.", roles: ["superadmin"] },
];

export function helpContextFor(role: AiRole) {
  const pages =
    role === "superadmin"
      ? helpPages
      : helpPages.filter((page) => page.roles.includes("all") || page.roles.includes(role));
  return pages.map((page) => `- ${page.title} — ${page.path} : ${page.blurb}`).join("\n");
}
