export type NavChild = { href: string; label: string };
export type NavItem = {
  href: string;
  label: string;
  children?: NavChild[];
  /** Extra prefixes that keep the parent tab active (Infos spans several roots). */
  match?: string[];
};

export const mainNav: NavItem[] = [
  { href: "/", label: "Accueil" },
  {
    href: "/ecole",
    label: "L’école",
    children: [
      { href: "/ecole", label: "Présentation" },
      { href: "/ecole/histoire", label: "Histoire & valeurs" },
      { href: "/ecole/mot-du-proviseur", label: "Mot de la direction" },
      { href: "/ecole/agrements", label: "Agréments" },
    ],
  },
  {
    href: "/cycles",
    label: "Cycles",
    children: [
      { href: "/cycles/garderie", label: "Garderie" },
      { href: "/cycles/maternelle", label: "Maternelle" },
      { href: "/cycles/primaire", label: "Primaire" },
    ],
  },
  { href: "/activites", label: "Activités" },
  {
    href: "/informations",
    label: "Infos",
    match: ["/informations", "/actualites", "/contact", "/mentions-legales"],
    children: [
      { href: "/informations", label: "Informations" },
      { href: "/actualites", label: "Actualités" },
      { href: "/informations/objets-perdus", label: "Objets perdus" },
      { href: "/contact", label: "Contact" },
      { href: "/mentions-legales", label: "Mentions légales" },
    ],
  },
];

export const inscriptionCta = { href: "/inscriptions", label: "Inscriptions" };

export const espacesNav: NavChild[] = [
  { href: "/connexion", label: "Parents" },
  { href: "/espace-enseignants/connexion", label: "Enseignants" },
  { href: "/espace-vigile/connexion", label: "Vigile" },
  { href: "/admin/connexion", label: "Direction" },
];

export const footerGroups: { title: string; links: NavChild[] }[] = [
  {
    title: "L’école",
    links: [
      { href: "/ecole", label: "Présentation" },
      { href: "/ecole/histoire", label: "Histoire & valeurs" },
      { href: "/ecole/mot-du-proviseur", label: "Mot du proviseur" },
      { href: "/ecole/agrements", label: "Agréments MEN" },
      { href: "/cycles", label: "Tous les cycles" },
      { href: "/cycles/garderie", label: "Garderie" },
      { href: "/cycles/maternelle", label: "Maternelle" },
      { href: "/cycles/primaire", label: "Primaire" },
      { href: "/activites", label: "Activités" },
    ],
  },
  {
    title: "Infos",
    links: [
      { href: "/informations", label: "Informations pratiques" },
      { href: "/actualites", label: "Actualités" },
      { href: "/informations/objets-perdus", label: "Objets perdus" },
      { href: "/inscriptions", label: "Inscriptions" },
      { href: "/contact", label: "Contact & plan" },
      { href: "/mentions-legales", label: "Mentions légales" },
    ],
  },
  {
    title: "Espaces",
    links: espacesNav,
  },
];

function pathMatches(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Pages without public header / footer / WhatsApp (portails). */
export function hideSiteChrome(pathname: string) {
  if (pathname.startsWith("/portail")) return true;
  if (pathname.startsWith("/espace-parents")) return true;
  if (pathname.startsWith("/super-admin") && pathname !== "/super-admin/connexion") return true;
  if (pathname.startsWith("/admin") && pathname !== "/admin/connexion") return true;
  if (pathname.startsWith("/espace-enseignants") && pathname !== "/espace-enseignants/connexion") {
    return true;
  }
  if (pathname.startsWith("/espace-vigile") && pathname !== "/espace-vigile/connexion") {
    return true;
  }
  return false;
}

/** WhatsApp flottant : pages publiques uniquement. */
export function showWhatsAppButton(pathname: string) {
  if (hideSiteChrome(pathname)) return false;
  if (pathname.startsWith("/admin")) return false;
  if (pathname.startsWith("/super-admin")) return false;
  if (pathname.startsWith("/espace-enseignants")) return false;
  if (pathname.startsWith("/espace-vigile")) return false;
  return true;
}

/** Masquer le chat sur l’écran vigile plein écran (champ de scan). */
export function hideAiChat(pathname: string) {
  if (pathname.startsWith("/portail")) return true;
  if (pathname.startsWith("/espace-vigile") && pathname !== "/espace-vigile/connexion") {
    return true;
  }
  return false;
}

export function isNavItemActive(pathname: string, item: NavItem) {
  if (item.children?.some((child) => pathMatches(pathname, child.href))) return true;
  if (item.match?.some((href) => pathMatches(pathname, href))) return true;
  return pathMatches(pathname, item.href);
}

export function isEspacesActive(pathname: string) {
  return espacesNav.some((item) => pathMatches(pathname, item.href));
}

export type ConsoleLink = { href: string; label: string; badge?: number };
export type ConsoleGroup = { title: string; links: ConsoleLink[] };

export const parentConsoleNav: ConsoleGroup[] = [
  {
    title: "Suivi",
    links: [
      { href: "/espace-parents", label: "Tableau de bord" },
      { href: "/espace-parents/emploi-du-temps", label: "Emploi du temps" },
      { href: "/espace-parents/notes", label: "Notes" },
      { href: "/espace-parents/absences", label: "Absences" },
      { href: "/espace-parents/devoirs", label: "Devoirs" },
      { href: "/espace-parents/bulletins", label: "Bulletins" },
    ],
  },
  {
    title: "Vie scolaire",
    links: [
      { href: "/espace-parents/paiements", label: "Paiements" },
      { href: "/espace-parents/transport", label: "Bus" },
      { href: "/espace-parents/sortie", label: "Sortie" },
      { href: "/espace-parents/sante", label: "Santé" },
      { href: "/espace-parents/objets-perdus", label: "Objets perdus" },
    ],
  },
  {
    title: "Contact",
    links: [{ href: "/espace-parents/messages", label: "Messages" }],
  },
];

export const teacherConsoleNav: ConsoleGroup[] = [
  {
    title: "Classe",
    links: [
      { href: "/espace-enseignants", label: "Accueil" },
      { href: "/espace-enseignants/emploi-du-temps", label: "Emploi du temps" },
      { href: "/espace-enseignants/cours", label: "Cours du jour" },
      { href: "/espace-enseignants/journal", label: "Cours effectués" },
      { href: "/espace-enseignants/appel", label: "Appel" },
      { href: "/espace-enseignants/devoirs", label: "Devoirs" },
      { href: "/espace-enseignants/controles", label: "Contrôles" },
      { href: "/espace-enseignants/notes", label: "Notes" },
      { href: "/espace-enseignants/bulletins", label: "Bulletins" },
      { href: "/espace-enseignants/classes", label: "Classes" },
    ],
  },
  {
    title: "Vie scolaire",
    links: [
      { href: "/espace-enseignants/transport", label: "Bus" },
      { href: "/espace-enseignants/sortie", label: "Sortie" },
      { href: "/espace-enseignants/sante", label: "Santé" },
      { href: "/espace-enseignants/rh", label: "RH" },
      { href: "/espace-enseignants/objets-perdus", label: "Objets perdus" },
    ],
  },
  {
    title: "Contact",
    links: [{ href: "/espace-enseignants/messages", label: "Messages" }],
  },
];

export const adminConsoleNav: ConsoleGroup[] = [
  {
    title: "Accueil",
    links: [{ href: "/admin", label: "Accueil" }],
  },
  {
    title: "Établissement",
    links: [
      { href: "/admin/etablissements", label: "Établissements" },
      { href: "/admin/annee-scolaire", label: "Année scolaire" },
      { href: "/admin/contenu", label: "Contenu" },
      { href: "/admin/actualites", label: "Actualités" },
      { href: "/admin/demandes", label: "Demandes" },
    ],
  },
  {
    title: "Scolarité",
    links: [
      { href: "/admin/inscriptions", label: "Fiches inscription" },
      { href: "/admin/reinscriptions", label: "Réinscriptions" },
      { href: "/admin/eleves", label: "Élèves" },
      { href: "/admin/classes", label: "Classes" },
      { href: "/admin/parents", label: "Parents" },
      { href: "/admin/enseignants", label: "Enseignants" },
    ],
  },
  {
    title: "Pédagogie",
    links: [
      { href: "/admin/emploi-du-temps", label: "Emploi du temps" },
      { href: "/admin/matieres", label: "Matières" },
      { href: "/admin/bulletins", label: "Bulletins" },
      { href: "/admin/vie-scolaire", label: "Vie scolaire" },
      { href: "/admin/controle-enseignants", label: "Contrôle enseignants" },
    ],
  },
  {
    title: "Finances",
    links: [
      { href: "/admin/frais", label: "Frais" },
      { href: "/admin/compta", label: "Comptabilité" },
      { href: "/admin/caisse", label: "Caisse" },
      { href: "/admin/cas-sociaux", label: "Cas sociaux" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/admin/transport", label: "Transport" },
      { href: "/admin/sortie", label: "Sortie" },
      { href: "/admin/sante", label: "Santé" },
      { href: "/admin/objets-perdus", label: "Objets perdus" },
    ],
  },
  {
    title: "RH",
    links: [{ href: "/admin/rh", label: "RH" }],
  },
];

export const superAdminConsoleNav: ConsoleGroup[] = [
  {
    title: "Pilotage",
    links: [
      { href: "/super-admin", label: "Tableau de bord" },
      { href: "/super-admin/modules", label: "Modules" },
    ],
  },
  {
    title: "Parents",
    links: [
      { href: "/super-admin/parents-modules", label: "Modules parents" },
      { href: "/super-admin/parents-finances", label: "Finances espèces" },
    ],
  },
  {
    title: "Pédagogie",
    links: [{ href: "/super-admin/controle-enseignants", label: "Contrôle enseignants" }],
  },
  {
    title: "Consoles",
    links: [{ href: "/admin", label: "Direction classique" }],
  },
];

const teacherControlHrefs = new Set([
  "/espace-enseignants/cours",
  "/espace-enseignants/journal",
  "/espace-enseignants/controles",
  "/espace-enseignants/bulletins",
]);

export function teacherConsoleNavFor(enabled: boolean): ConsoleGroup[] {
  if (enabled) return teacherConsoleNav;
  return teacherConsoleNav.map((group) => ({
    ...group,
    links: group.links.filter((link) => !teacherControlHrefs.has(link.href)),
  }));
}

export function adminConsoleNavFor(enabled: boolean, alertCount = 0, keepControlLink = false): ConsoleGroup[] {
  return adminConsoleNav.map((group) => ({
    ...group,
    links: group.links
      .filter((link) => {
        if (link.href !== "/admin/controle-enseignants") return true;
        return enabled || keepControlLink;
      })
      .map((link) =>
        link.href === "/admin/controle-enseignants" && alertCount > 0
          ? { ...link, badge: alertCount }
          : link,
      ),
  }));
}
