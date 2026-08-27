import { AdminFlash, Card, Field, PageIntro, TableWrap, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { PollRefresh } from "@/components/school/PollRefresh";
import {
  MODULE_CATALOG,
  MODULE_ROLES,
  MODULE_SCOPES,
  isComingSoon,
  moduleSourceLabel,
  resolveModuleOverride,
} from "@/lib/module-control";
import { readSchoolLife } from "@/lib/school-life";
import { formatDateTimeFr } from "@/lib/utils";
import type { ModuleScope } from "@/lib/school-life-types";

export const dynamic = "force-dynamic";

function isScope(value: string): value is ModuleScope {
  return value === "global" || value === "role" || value === "establishment" || value === "user";
}

export default async function SuperAdminModulesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; scope?: string; scopeId?: string }>;
}) {
  const { ok, error, scope: scopeRaw, scopeId: scopeIdRaw } = await searchParams;
  const data = await readSchoolLife();
  const scope: ModuleScope = isScope(scopeRaw ?? "") ? (scopeRaw as ModuleScope) : "global";
  const scopeId = (scopeIdRaw || "").trim();
  const store = data.moduleControl;
  const ctx =
    scope === "global"
      ? {}
      : scope === "role"
        ? { role: scopeId || undefined }
        : scope === "establishment"
          ? { establishmentId: scopeId || undefined }
          : { userId: scopeId || undefined };

  const users = [
    ...data.parents.map((row) => ({ id: row.id, label: `Parent · ${row.displayName}` })),
    ...data.teachers.map((row) => ({ id: row.id, label: `Enseignant · ${row.displayName}` })),
  ];

  return (
    <div className="space-y-6">
      <PollRefresh seconds={30} />
      <PageIntro
        title="Contrôle des modules"
        lead="Overrides persistés (global, rôle, école, utilisateur). Les modules « bientôt » sont stockés au catalogue mais le toggle est grisé. Actualisation 30 s."
      />
      <AdminFlash ok={ok} error={error} />
      <Card title="Filtre">
        <form className="grid gap-3 sm:grid-cols-3">
          <Field label="Portée">
            <select name="scope" defaultValue={scope} className={fieldClass}>
              {MODULE_SCOPES.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Cible">
            {scope === "global" ? (
              <p className="py-2.5 text-sm text-muted">Tous les rôles / écoles</p>
            ) : (
              <select name="scopeId" defaultValue={scopeId} className={fieldClass}>
                <option value="">Choisir…</option>
                {scope === "role"
                  ? MODULE_ROLES.map((row) => (
                      <option key={row.id} value={row.id}>
                        {row.label}
                      </option>
                    ))
                  : null}
                {scope === "establishment"
                  ? data.establishments.map((row) => (
                      <option key={row.id} value={row.id}>
                        {row.shortName}
                      </option>
                    ))
                  : null}
                {scope === "user"
                  ? users.map((row) => (
                      <option key={row.id} value={row.id}>
                        {row.label}
                      </option>
                    ))
                  : null}
              </select>
            )}
          </Field>
          <div className="flex items-end">
            <button className={btnPrimary}>Filtrer</button>
          </div>
        </form>
      </Card>
      <Card title="Modules">
        <TableWrap>
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="py-2 pr-3 font-medium">Module</th>
                <th className="py-2 pr-3 font-medium">État (filtre)</th>
                <th className="py-2 pr-3 font-medium">Source</th>
                <th className="py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {MODULE_CATALOG.map((def) => {
                const resolved = resolveModuleOverride(store, def.id, ctx);
                const enabled = def.comingSoon ? false : resolved.override ? resolved.override.enabled : def.defaultOn;
                const source = def.comingSoon ? "default" : resolved.source;
                const isOverride = source !== "default";
                return (
                  <tr key={def.id} className="border-b border-line/70">
                    <td className="py-3 pr-3">
                      <span className="font-semibold">{def.label}</span>
                      {def.comingSoon ? <span className="ml-2 text-xs text-muted">bientôt</span> : null}
                    </td>
                    <td className="py-3 pr-3">{def.comingSoon ? "—" : enabled ? "on" : "off"}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          isOverride ? "bg-terracotta-soft text-terracotta" : "bg-green-soft text-green-deep"
                        }`}
                      >
                        {def.comingSoon ? "catalogue" : moduleSourceLabel(source)}
                      </span>
                    </td>
                    <td className="py-3">
                      {def.comingSoon || isComingSoon(def.id) ? (
                        <span className="text-xs text-muted">Toggle grisé</span>
                      ) : (
                        <form action="/api/superadmin/modules" method="post" className="flex flex-wrap gap-2">
                          <input type="hidden" name="moduleId" value={def.id} />
                          <input type="hidden" name="scope" value={scope} />
                          {scope !== "global" ? <input type="hidden" name="scopeId" value={scopeId} /> : null}
                          <input type="hidden" name="filterScope" value={scope} />
                          {scopeId ? <input type="hidden" name="filterScopeId" value={scopeId} /> : null}
                          <input type="hidden" name="enabled" value={enabled ? "0" : "1"} />
                          <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:bg-paper-2">
                            {enabled ? "Désactiver" : "Activer"}
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableWrap>
      </Card>
      <Card title="Historique">
        {store.history.length === 0 ? (
          <p className="text-sm text-muted">Aucune activation enregistrée.</p>
        ) : (
          <TableWrap>
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="text-muted">
                  <th className="py-2 pr-3 font-medium">Quand</th>
                  <th className="py-2 pr-3 font-medium">Module</th>
                  <th className="py-2 pr-3 font-medium">Portée</th>
                  <th className="py-2 font-medium">Par</th>
                </tr>
              </thead>
              <tbody>
                {store.history.slice(0, 40).map((row) => (
                  <tr key={row.id} className="border-t border-line">
                    <td className="py-2 pr-3">{formatDateTimeFr(row.at)}</td>
                    <td className="py-2 pr-3">
                      {row.moduleId} · {row.enabled ? "on" : "off"}
                    </td>
                    <td className="py-2 pr-3">
                      {row.scope}
                      {row.scopeId ? ` · ${row.scopeId}` : ""}
                    </td>
                    <td className="py-2">{row.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>
    </div>
  );
}
