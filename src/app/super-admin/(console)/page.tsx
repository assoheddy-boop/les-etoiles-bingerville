import Link from "next/link";
import { Card, PageIntro, TableWrap } from "@/components/school/AdminUi";
import { EmailStatusCard } from "@/components/school/EmailStatusCard";
import { PollRefresh } from "@/components/school/PollRefresh";
import { cashTotals } from "@/lib/cash-payments";
import { MODULE_CATALOG, isModuleEnabled, moduleCounts } from "@/lib/module-control";
import { formatFcfa } from "@/lib/payments";
import { readSchoolLife } from "@/lib/school-life";
import { activityActionLabels, computeAlerts, isTeacherControlEnabled } from "@/lib/teacher-control";
import { formatDateTimeFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SuperAdminHomePage() {
  const data = await readSchoolLife();
  const modules = moduleCounts(data);
  const money = cashTotals(data);
  const controlOn = isTeacherControlEnabled(data);
  const alerts = controlOn ? computeAlerts(data) : [];
  const recentLogs = data.activityLogs.slice(0, 8);
  const parentsOn = data.parents.filter((row) => row.moduleParentsActive).length;

  return (
    <div className="space-y-6">
      <PollRefresh seconds={30} />
      <PageIntro
        title="Pilotage SuperAdmin"
        lead="Vue globale du groupe : établissements, modules, finances (démo / espèces internes, pas de Wave ni Orange Money), activité enseignants."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Établissements">
          <p className="text-2xl font-semibold">{data.establishments.length}</p>
        </Card>
        <Card title="Enseignants">
          <p className="text-2xl font-semibold">{data.teachers.length}</p>
        </Card>
        <Card title="Parents">
          <p className="text-2xl font-semibold">{data.parents.length}</p>
          <p className="mt-1 text-sm text-muted">{parentsOn} module(s) parents actif(s)</p>
        </Card>
        <Card title="Modules">
          <p className="text-2xl font-semibold">
            {modules.on} on · {modules.off} off
          </p>
          <p className="mt-1 text-sm text-muted">{modules.soon} bientôt</p>
        </Card>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Revenus (démo / espèces)">
          <p className="text-2xl font-semibold">{formatFcfa(money.demoRevenue)}</p>
          <p className="mt-1 text-sm text-muted">
            Factures payées {formatFcfa(money.invoicesPaid)} · espèces validées {formatFcfa(money.cashValidated)}
          </p>
          <p className="mt-1 text-xs text-muted">Reste factures {formatFcfa(money.invoicesDue)} · file espèces {formatFcfa(money.cashPending)}</p>
        </Card>
        <Card title="Contrôle enseignants">
          <p className="text-2xl font-semibold">{alerts.length} alerte(s)</p>
          <p className="mt-1 text-sm text-muted">{controlOn ? "Module actif" : "Module off"}</p>
          <Link href="/super-admin/controle-enseignants" className="mt-3 inline-block text-sm font-semibold text-green-deep">
            Ouvrir la vue
          </Link>
        </Card>
        <Card title="File espèces">
          <p className="text-2xl font-semibold">{(data.cashPayments || []).filter((row) => row.status === "pending").length}</p>
          <p className="mt-1 text-sm text-muted">Paiements en attente de validation</p>
          <Link href="/super-admin/parents-finances" className="mt-3 inline-block text-sm font-semibold text-green-deep">
            Voir la caisse
          </Link>
        </Card>
        <EmailStatusCard />
      </div>
      <Card title="État des modules">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {MODULE_CATALOG.map((def) => {
            const on = !def.comingSoon && isModuleEnabled(data, def.id);
            return (
              <li key={def.id} className="flex items-center justify-between rounded-2xl bg-paper px-4 py-3 text-sm">
                <span>{def.label}</span>
                <span className={def.comingSoon ? "text-muted" : on ? "font-semibold text-green-deep" : "text-terracotta"}>
                  {def.comingSoon ? "bientôt" : on ? "on" : "off"}
                </span>
              </li>
            );
          })}
        </ul>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Alertes enseignants">
          {alerts.length === 0 ? (
            <p className="text-sm text-muted">{controlOn ? "Aucune alerte." : "Module contrôle enseignants désactivé."}</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {alerts.slice(0, 6).map((alert) => (
                <li key={alert.id} className="rounded-2xl bg-paper px-4 py-3">
                  <p className="font-semibold">{alert.teacherName}</p>
                  <p className="text-muted">{alert.title}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Journaux récents">
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted">Aucun log.</p>
          ) : (
            <TableWrap>
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="text-muted">
                    <th className="py-2 pr-3 font-medium">Quand</th>
                    <th className="py-2 pr-3 font-medium">Action</th>
                    <th className="py-2 font-medium">Acteur</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((row) => (
                    <tr key={row.id} className="border-t border-line">
                      <td className="py-2 pr-3">{formatDateTimeFr(row.at)}</td>
                      <td className="py-2 pr-3">{activityActionLabels[row.action] || row.action}</td>
                      <td className="py-2">{row.actorRole}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
        </Card>
      </div>
    </div>
  );
}
