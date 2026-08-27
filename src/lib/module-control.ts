import type { ConsoleGroup } from "./nav";
import type {
  ModuleControlStore,
  ModuleHistoryEntry,
  ModuleId,
  ModuleOverride,
  ModuleScope,
  ParentAccount,
  SchoolLifeData,
} from "./school-life-types";

export const DEMO_PARENT_IDS = new Set(["par-kouadio", "par-yao"]);

export type ModuleDef = {
  id: ModuleId;
  label: string;
  defaultOn: boolean;
  comingSoon?: boolean;
};

export const MODULE_CATALOG: ModuleDef[] = [
  { id: "parents", label: "Parents", defaultOn: true },
  { id: "enseignants", label: "Enseignants", defaultOn: true },
  { id: "vie_scolaire", label: "Vie scolaire", defaultOn: true },
  { id: "direction", label: "Direction", defaultOn: true },
  { id: "secretariat", label: "Secrétariat", defaultOn: true },
  { id: "comptabilite", label: "Comptabilité", defaultOn: true },
  { id: "paiements", label: "Paiements (UI)", defaultOn: true },
  { id: "notes", label: "Notes", defaultOn: true },
  { id: "devoirs", label: "Devoirs", defaultOn: true },
  { id: "examens", label: "Examens", defaultOn: true },
  { id: "presence", label: "Présence", defaultOn: true },
  { id: "discipline", label: "Discipline", defaultOn: false, comingSoon: true },
  { id: "chat_ia", label: "Chat IA", defaultOn: true },
  { id: "notifications_sms", label: "Notifications SMS", defaultOn: false, comingSoon: true },
  { id: "whatsapp", label: "WhatsApp", defaultOn: true },
  { id: "finances", label: "Finances", defaultOn: true },
  { id: "rapports", label: "Rapports", defaultOn: false, comingSoon: true },
  { id: "controle_enseignants", label: "Contrôle enseignants", defaultOn: true },
  { id: "avances", label: "Avancés", defaultOn: false, comingSoon: true },
  { id: "premium", label: "Premium", defaultOn: false, comingSoon: true },
];

export const MODULE_ROLES: Array<{ id: string; label: string }> = [
  { id: "parent", label: "Parent" },
  { id: "teacher", label: "Enseignant" },
  { id: "fondateur", label: "Fondateur" },
  { id: "directeur", label: "Directeur" },
  { id: "vie_scolaire", label: "Vie scolaire" },
  { id: "vigile", label: "Vigile" },
];

export const MODULE_SCOPES: Array<{ id: ModuleScope; label: string }> = [
  { id: "global", label: "Global" },
  { id: "role", label: "Rôle" },
  { id: "establishment", label: "École" },
  { id: "user", label: "Utilisateur" },
];

const HREF_MODULES: Array<{ prefix: string; moduleId: ModuleId }> = [
  { prefix: "/espace-parents/notes", moduleId: "notes" },
  { prefix: "/espace-parents/devoirs", moduleId: "devoirs" },
  { prefix: "/espace-parents/bulletins", moduleId: "examens" },
  { prefix: "/espace-parents/absences", moduleId: "presence" },
  { prefix: "/espace-parents/paiements", moduleId: "paiements" },
  { prefix: "/espace-enseignants/notes", moduleId: "notes" },
  { prefix: "/espace-enseignants/devoirs", moduleId: "devoirs" },
  { prefix: "/espace-enseignants/controles", moduleId: "examens" },
  { prefix: "/espace-enseignants/bulletins", moduleId: "examens" },
  { prefix: "/espace-enseignants/appel", moduleId: "presence" },
  { prefix: "/espace-enseignants/cours", moduleId: "controle_enseignants" },
  { prefix: "/espace-enseignants/journal", moduleId: "controle_enseignants" },
  { prefix: "/admin/controle-enseignants", moduleId: "controle_enseignants" },
  { prefix: "/admin/vie-scolaire", moduleId: "vie_scolaire" },
  { prefix: "/admin/emploi-du-temps", moduleId: "vie_scolaire" },
  { prefix: "/admin/transport", moduleId: "vie_scolaire" },
  { prefix: "/admin/sortie", moduleId: "vie_scolaire" },
  { prefix: "/admin/sante", moduleId: "vie_scolaire" },
  { prefix: "/admin/objets-perdus", moduleId: "vie_scolaire" },
  { prefix: "/admin/compta", moduleId: "comptabilite" },
  { prefix: "/admin/caisse", moduleId: "paiements" },
  { prefix: "/admin/frais", moduleId: "finances" },
  { prefix: "/admin/cas-sociaux", moduleId: "finances" },
  { prefix: "/admin/parents", moduleId: "parents" },
  { prefix: "/admin/enseignants", moduleId: "enseignants" },
  { prefix: "/admin/bulletins", moduleId: "examens" },
  { prefix: "/admin/demandes", moduleId: "secretariat" },
  { prefix: "/admin/inscriptions", moduleId: "secretariat" },
  { prefix: "/admin/reinscriptions", moduleId: "secretariat" },
  { prefix: "/admin/eleves", moduleId: "secretariat" },
];

export type ModuleContext = {
  role?: string;
  establishmentId?: string;
  userId?: string;
  /** SuperAdmin ignore les toggles (contrôle total). */
  bypass?: boolean;
};

export function emptyModuleControl(): ModuleControlStore {
  return {
    modules: MODULE_CATALOG.map((row) => ({
      id: row.id,
      label: row.label,
      defaultOn: row.defaultOn,
    })),
    overrides: [],
    history: [],
  };
}

export function moduleDef(id: string) {
  return MODULE_CATALOG.find((row) => row.id === id);
}

function overrideKey(row: Pick<ModuleOverride, "scope" | "scopeId">) {
  return `${row.scope}:${row.scopeId || ""}`;
}

export function hydrateModuleControl(stored: unknown): ModuleControlStore {
  const seed = emptyModuleControl();
  if (!stored || typeof stored !== "object") return seed;
  const source = stored as Partial<ModuleControlStore>;
  const overrides = Array.isArray(source.overrides)
    ? source.overrides.filter(
        (row): row is ModuleOverride =>
          Boolean(row && typeof row === "object" && typeof row.moduleId === "string" && typeof row.scope === "string"),
      )
    : [];
  const history = Array.isArray(source.history)
    ? source.history.filter(
        (row): row is ModuleHistoryEntry =>
          Boolean(row && typeof row === "object" && typeof row.moduleId === "string"),
      )
    : [];
  return {
    modules: seed.modules,
    overrides,
    history,
  };
}

export function isComingSoon(id: string) {
  return Boolean(moduleDef(id)?.comingSoon);
}

export function resolveModuleOverride(store: ModuleControlStore, moduleId: string, ctx: ModuleContext = {}) {
  const rows = store.overrides.filter((row) => row.moduleId === moduleId);
  const user = ctx.userId
    ? rows.find((row) => row.scope === "user" && row.scopeId === ctx.userId)
    : undefined;
  if (user) return { override: user, source: "user" as const };
  const establishment = ctx.establishmentId
    ? rows.find((row) => row.scope === "establishment" && row.scopeId === ctx.establishmentId)
    : undefined;
  if (establishment) return { override: establishment, source: "establishment" as const };
  const role = ctx.role ? rows.find((row) => row.scope === "role" && row.scopeId === ctx.role) : undefined;
  if (role) return { override: role, source: "role" as const };
  const global = rows.find((row) => row.scope === "global");
  if (global) return { override: global, source: "global" as const };
  return { override: undefined, source: "default" as const };
}

export function isModuleEnabled(data: SchoolLifeData, moduleId: ModuleId | string, ctx: ModuleContext = {}) {
  if (ctx.bypass) return true;
  const def = moduleDef(moduleId);
  if (!def) return false;
  if (def.comingSoon) return false;
  const store = data.moduleControl || emptyModuleControl();
  const resolved = resolveModuleOverride(store, moduleId, ctx);
  if (resolved.override) return resolved.override.enabled;
  return def.defaultOn;
}

export function moduleSourceLabel(source: "user" | "establishment" | "role" | "global" | "default") {
  if (source === "user") return "override utilisateur";
  if (source === "establishment") return "override école";
  if (source === "role") return "override rôle";
  if (source === "global") return "override global";
  return "héritage (défaut)";
}

export function isParentModuleActive(parent: ParentAccount | undefined) {
  if (!parent) return false;
  if (typeof parent.moduleParentsActive === "boolean") return parent.moduleParentsActive;
  return DEMO_PARENT_IDS.has(parent.id);
}

function parentForStudent(data: SchoolLifeData, studentId: string) {
  const student = data.students.find((row) => row.id === studentId);
  if (!student) return undefined;
  if (student.parentId) {
    const byId = data.parents.find((row) => row.id === student.parentId);
    if (byId) return byId;
  }
  return data.parents.find((row) => row.studentIds.includes(student.id));
}

export function parentPortalAllowed(data: SchoolLifeData, studentId: string, ctx: ModuleContext = {}) {
  const parent = parentForStudent(data, studentId);
  if (!isModuleEnabled(data, "parents", { ...ctx, role: ctx.role || "parent", userId: ctx.userId || parent?.id })) {
    return false;
  }
  return isParentModuleActive(parent);
}

export function moduleForHref(href: string): ModuleId | undefined {
  const match = HREF_MODULES.find((row) => href === row.prefix || href.startsWith(`${row.prefix}/`));
  return match?.moduleId;
}

export function filterNavByModules(groups: ConsoleGroup[], data: SchoolLifeData, ctx: ModuleContext): ConsoleGroup[] {
  return groups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => {
        const moduleId = moduleForHref(link.href);
        if (!moduleId) return true;
        return isModuleEnabled(data, moduleId, ctx);
      }),
    }))
    .filter((group) => group.links.length > 0);
}

export function setModuleOverride(
  data: SchoolLifeData,
  input: {
    moduleId: string;
    scope: ModuleScope;
    scopeId?: string;
    enabled: boolean;
    by: string;
  },
) {
  const def = moduleDef(input.moduleId);
  if (!def || def.comingSoon) throw new Error("module");
  if (!data.moduleControl) data.moduleControl = emptyModuleControl();
  const at = new Date().toISOString();
  const scopeId = input.scope === "global" ? undefined : input.scopeId?.trim() || undefined;
  if (input.scope !== "global" && !scopeId) throw new Error("scope");
  const next: ModuleOverride = {
    moduleId: def.id,
    scope: input.scope,
    scopeId,
    enabled: input.enabled,
    at,
    by: input.by,
  };
  const key = overrideKey(next);
  data.moduleControl.overrides = [
    next,
    ...data.moduleControl.overrides.filter((row) => row.moduleId !== next.moduleId || overrideKey(row) !== key),
  ];
  data.moduleControl.history.unshift({
    id: `mod-${crypto.randomUUID().slice(0, 8)}`,
    moduleId: def.id,
    scope: input.scope,
    scopeId,
    enabled: input.enabled,
    at,
    by: input.by,
  });
}

export function moduleCounts(data: SchoolLifeData) {
  const store = data.moduleControl || emptyModuleControl();
  let on = 0;
  let off = 0;
  let soon = 0;
  for (const def of MODULE_CATALOG) {
    if (def.comingSoon) {
      soon += 1;
      continue;
    }
    if (isModuleEnabled(data, def.id)) on += 1;
    else off += 1;
  }
  return { on, off, soon, overrides: store.overrides.length, history: store.history.length };
}
