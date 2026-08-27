import Link from "next/link";
import { AdminFlash, Card, PageIntro } from "@/components/school/AdminUi";
import { formatFcfa } from "@/lib/payments";
import { staffDisplayName } from "@/lib/hr";
import { readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminRhDashboard({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const pendingLeaves = data.leaveRequests.filter((row) => row.status === "pending").length;
  const pendingAdvances = data.salaryAdvances.filter((row) => row.status === "pending").length;
  const masse = data.staffProfiles
    .filter((row) => row.status !== "inactive")
    .reduce((sum, row) => sum + row.baseSalary, 0);
  const latestRun = [...data.payrollRuns].sort((a, b) => b.month.localeCompare(a.month))[0];

  return (
    <div className="space-y-6">
      <PageIntro
        title="Ressources humaines"
        lead="Annuaire du personnel (enseignants, ATSEM, ménage, gardiens), congés, présence, avances, évaluations et paie du mois."
      />
      <AdminFlash ok={ok} error={error} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Personnel actif">
          <p className="text-2xl font-semibold">{data.staffProfiles.filter((row) => row.status === "active").length}</p>
        </Card>
        <Card title="Congés en attente">
          <p className="text-2xl font-semibold">{pendingLeaves}</p>
        </Card>
        <Card title="Masse salariale">
          <p className="text-2xl font-semibold">{formatFcfa(masse)}</p>
        </Card>
        <Card title="Paie du mois">
          <p className="text-2xl font-semibold">{latestRun ? formatFcfa(latestRun.totalNet) : "—"}</p>
          <p className="mt-1 text-sm text-muted">{latestRun?.month ?? "Pas encore générée"}</p>
        </Card>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["/admin/rh/personnel", "Dossiers personnel"],
          ["/admin/rh/conges", `Valider congés (${pendingLeaves})`],
          ["/admin/rh/presence", "Présence"],
          ["/admin/rh/avances", `Avances (${pendingAdvances})`],
          ["/admin/rh/paie", "Paie mensuelle"],
          ["/admin/rh/evaluations", "Évaluations"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="rounded-2xl border border-line bg-white px-4 py-3 font-semibold hover:bg-paper">
            {label}
          </Link>
        ))}
      </div>
      <Card title="Derniers dossiers">
        <ul className="space-y-2 text-sm">
          {data.staffProfiles.slice(0, 6).map((row) => (
            <li key={row.id}>
              <Link href={`/admin/rh/personnel/${row.id}`} className="font-semibold text-green-deep hover:underline">
                {staffDisplayName(row)}
              </Link>
              <span className="text-muted"> · {row.jobTitle}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
