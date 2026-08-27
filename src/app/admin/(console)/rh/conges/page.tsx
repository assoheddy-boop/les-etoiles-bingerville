import { AdminFlash, Card, Field, PageIntro, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { countLeaveDays, leaveStaffId, staffById, staffDisplayName } from "@/lib/hr";
import { leaveStatusLabels, leaveTypeLabels, readSchoolLife } from "@/lib/school-life";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminLeavesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const pending = data.leaveRequests.filter((row) => row.status === "pending");

  return (
    <div className="space-y-6">
      <PageIntro title="Congés" lead="Valider les demandes du personnel. Les enseignants saisissent aussi depuis leur espace." />
      <AdminFlash ok={ok} error={error} />
      <Card title={`En attente (${pending.length})`}>
        {pending.length === 0 ? <p className="text-sm text-muted">Aucune demande en attente.</p> : null}
        <ul className="space-y-4">
          {pending.map((leave) => {
            const profile = staffById(leaveStaffId(leave, data), data);
            return (
              <li key={leave.id} className="rounded-2xl bg-paper p-4">
                <p className="font-semibold">{staffDisplayName(profile)}</p>
                <p className="text-sm text-muted">
                  {leaveTypeLabels[leave.type]} · {formatDateFr(leave.startDate)} → {formatDateFr(leave.endDate)} ·{" "}
                  {countLeaveDays(leave.startDate, leave.endDate)} j
                </p>
                <p className="mt-2 text-sm">{leave.reason}</p>
                <form action="/api/admin/hr" method="post" className="mt-3 flex flex-wrap items-end gap-3">
                  <input type="hidden" name="action" value="review" />
                  <input type="hidden" name="id" value={leave.id} />
                  <Field label="Note direction">
                    <input name="adminNote" className={fieldClass} />
                  </Field>
                  <button name="status" value="approved" className={btnPrimary}>
                    Accepter
                  </button>
                  <button name="status" value="refused" className="rounded-full border border-terracotta/30 px-5 py-3 font-semibold text-terracotta">
                    Refuser
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      </Card>
      <Card title="Historique">
        <ul className="space-y-3 text-sm">
          {data.leaveRequests.map((leave) => (
            <li key={leave.id} className="flex flex-wrap justify-between gap-2 rounded-2xl bg-paper px-4 py-3">
              <span>
                <strong>{staffDisplayName(staffById(leaveStaffId(leave, data), data))}</strong> · {leaveTypeLabels[leave.type]} ·{" "}
                {formatDateFr(leave.startDate)} → {formatDateFr(leave.endDate)}
              </span>
              <span className="font-semibold">{leaveStatusLabels[leave.status]}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
