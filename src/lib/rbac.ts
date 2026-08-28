import type { AdminSession } from "./session";

/** Permissions applicatives admin / personnel. */
export type PermissionId =
  | "inscriptions"
  | "eleves"
  | "notes"
  | "cahier_texte"
  | "absences"
  | "discipline"
  | "paiements"
  | "cantine"
  | "transport"
  | "parametres";

export type PermissionLevel = "read" | "write";

export type EmployeeRoleId =
  | "direction"
  | "secretariat"
  | "enseignant"
  | "surveillant"
  | "comptable"
  | "cantine";

export type RolePermissionGrant = {
  permission: PermissionId;
  level: PermissionLevel;
};

export const PERMISSION_LABELS: Record<PermissionId, string> = {
  inscriptions: "Inscriptions",
  eleves: "Élèves",
  notes: "Notes",
  cahier_texte: "Cahier de texte",
  absences: "Absences",
  discipline: "Discipline",
  paiements: "Paiements",
  cantine: "Cantine",
  transport: "Transport",
  parametres: "Paramètres",
};

export const EMPLOYEE_ROLE_LABELS: Record<EmployeeRoleId, string> = {
  direction: "Direction",
  secretariat: "Secrétariat",
  enseignant: "Enseignant / Éducateur",
  surveillant: "Surveillant / Vie scolaire",
  comptable: "Comptable",
  cantine: "Cantine / Transport",
};

const ALL_PERMISSIONS: PermissionId[] = [
  "inscriptions",
  "eleves",
  "notes",
  "cahier_texte",
  "absences",
  "discipline",
  "paiements",
  "cantine",
  "transport",
  "parametres",
];

/** Matrice des permissions par rôle — source de vérité RBAC. */
export const ROLE_PERMISSIONS: Record<EmployeeRoleId, RolePermissionGrant[]> = {
  direction: ALL_PERMISSIONS.map((permission) => ({ permission, level: "write" })),
  secretariat: [
    { permission: "inscriptions", level: "write" },
    { permission: "eleves", level: "write" },
    { permission: "absences", level: "write" },
    { permission: "discipline", level: "write" },
  ],
  enseignant: [
    { permission: "notes", level: "write" },
    { permission: "cahier_texte", level: "write" },
    { permission: "absences", level: "write" },
    { permission: "eleves", level: "read" },
  ],
  surveillant: [
    { permission: "absences", level: "write" },
    { permission: "discipline", level: "write" },
    { permission: "eleves", level: "read" },
  ],
  comptable: [
    { permission: "paiements", level: "write" },
    { permission: "inscriptions", level: "read" },
    { permission: "eleves", level: "read" },
  ],
  cantine: [
    { permission: "cantine", level: "write" },
    { permission: "transport", level: "write" },
    { permission: "eleves", level: "read" },
  ],
};

export const EMPLOYEE_ROLE_IDS = Object.keys(EMPLOYEE_ROLE_LABELS) as EmployeeRoleId[];

export function isEmployeeRoleId(value: string): value is EmployeeRoleId {
  return EMPLOYEE_ROLE_IDS.includes(value as EmployeeRoleId);
}

export function isPermissionId(value: string): value is PermissionId {
  return ALL_PERMISSIONS.includes(value as PermissionId);
}

function grantLevel(grants: RolePermissionGrant[], permission: PermissionId): PermissionLevel | null {
  const row = grants.find((item) => item.permission === permission);
  return row?.level ?? null;
}

function levelSatisfies(granted: PermissionLevel | null, required: PermissionLevel) {
  if (!granted) return false;
  if (required === "read") return granted === "read" || granted === "write";
  return granted === "write";
}

/** Rôle RBAC effectif pour une session admin (démo, SuperAdmin ou employé persisté). */
export function employeeRoleOf(session: AdminSession): EmployeeRoleId {
  if (session.isSuperAdmin) return "direction";
  if (session.employeeRole && isEmployeeRoleId(session.employeeRole)) return session.employeeRole;
  if (session.staffRole === "vie_scolaire") return "surveillant";
  return "direction";
}

export function roleGrants(roleId: EmployeeRoleId): RolePermissionGrant[] {
  return ROLE_PERMISSIONS[roleId];
}

export function hasPermission(
  session: AdminSession,
  permission: PermissionId,
  required: PermissionLevel = "read",
): boolean {
  if (session.isSuperAdmin) return true;
  if (session.staffRole === "fondateur" && session.canSwitchRole) return true;
  const grants = roleGrants(employeeRoleOf(session));
  return levelSatisfies(grantLevel(grants, permission), required);
}

/** Préfixes de routes admin protégées par permission. */
const ADMIN_ROUTE_PERMISSIONS: Array<{
  prefix: string;
  permission: PermissionId;
  level?: PermissionLevel;
}> = [
  { prefix: "/admin/inscriptions", permission: "inscriptions" },
  { prefix: "/admin/reinscriptions", permission: "inscriptions" },
  { prefix: "/admin/eleves", permission: "eleves" },
  { prefix: "/admin/parents", permission: "eleves", level: "write" },
  { prefix: "/admin/classes", permission: "eleves", level: "write" },
  { prefix: "/admin/enseignants", permission: "eleves", level: "write" },
  { prefix: "/admin/bulletins", permission: "notes" },
  { prefix: "/admin/vie-scolaire", permission: "absences" },
  { prefix: "/admin/transport", permission: "transport" },
  { prefix: "/admin/compta", permission: "paiements" },
  { prefix: "/admin/caisse", permission: "paiements" },
  { prefix: "/admin/frais", permission: "paiements" },
  { prefix: "/admin/cas-sociaux", permission: "paiements" },
  { prefix: "/admin/employes", permission: "parametres", level: "write" },
];

export function permissionForAdminHref(href: string): { permission: PermissionId; level: PermissionLevel } | null {
  const match = ADMIN_ROUTE_PERMISSIONS.find(
    (row) => href === row.prefix || href.startsWith(`${row.prefix}/`),
  );
  if (!match) return null;
  return { permission: match.permission, level: match.level ?? "read" };
}

export function canAccessAdminHref(session: AdminSession, href: string) {
  const rule = permissionForAdminHref(href);
  if (!rule) return true;
  return hasPermission(session, rule.permission, rule.level);
}

export function filterNavByRbac(groups: import("./nav").ConsoleGroup[], session: AdminSession) {
  return groups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => canAccessAdminHref(session, link.href)),
    }))
    .filter((group) => group.links.length > 0);
}
