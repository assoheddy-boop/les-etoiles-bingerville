import { AdminFlash, Card, Field, PageIntro, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { advanceStatusLabels, staffById, staffDisplayName } from "@/lib/hr";
import { formatFcfa } from "@/lib/payments";
import { readSchoolLife } from "@/lib/school-life";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAdvancesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const pending = data.salaryAdvances.filter((row) => row.status === "pending");

  return (
    <div className="space-y-6">
      <PageIntro title="Avances" lead="Avances sur salaire : saisie direction ou demande enseignant, puis validation." />
      <AdminFlash ok={ok} error={error} />
      <Card title="Nouvelle avance">
        <form action="/api/admin/hr" method="post" className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="action" value="advance-create" />
          <Field label="Personnel">
            <select name="staffId" required className={fieldClass}>
              {data.staffProfiles.map((row) => (
                <option key={row.id} value={row.id}>
                  {staffDisplayName(row)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Montant (FCFA)">
            <input name="amount" type="number" min="1" required className={fieldClass} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Motif">
              <input name="reason" required className={fieldClass} />
            </Field>
          </div>
          <div>
            <button className={btnPrimary}>Enregistrer</button>
          </div>
        </form>
      </Card>
      <Card title={`En attente (${pending.length})`}>
        {pending.length === 0 ? <p className="text-sm text-muted">Aucune avance en attente.</p> : null}
        <ul className="space-y-4">
          {pending.map((row) => (
            <li key={row.id} className="rounded-2xl bg-paper p-4">
              <p className="font-semibold">
                {staffDisplayName(staffById(row.staffId, data))} — {formatFcfa(row.amount)}
              </p>
              <p className="text-sm text-muted">{row.reason}</p>
              <form action="/api/admin/hr" method="post" className="mt-3 flex flex-wrap gap-2">
                <input type="hidden" name="action" value="advance-review" />
                <input type="hidden" name="id" value={row.id} />
                <button name="status" value="approved" className={btnPrimary}>
                  Approuver
                </button>
                <button name="status" value="refused" className="rounded-full border border-line px-5 py-3 font-semibold">
                  Refuser
                </button>
              </form>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Historique">
        <ul className="space-y-2 text-sm">
          {data.salaryAdvances.map((row) => (
            <li key={row.id} className="flex flex-wrap justify-between gap-2 rounded-2xl bg-paper px-4 py-3">
              <span>
                {staffDisplayName(staffById(row.staffId, data))} · {formatFcfa(row.amount)} · {row.reason} ·{" "}
                {formatDateFr(row.createdAt)}
              </span>
              <strong>{advanceStatusLabels[row.status]}</strong>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
