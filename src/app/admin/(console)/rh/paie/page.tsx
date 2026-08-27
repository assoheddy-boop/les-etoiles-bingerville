import { AdminFlash, Card, Field, PageIntro, TableWrap, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { payrollRunForMonth, payrollStatusLabels, payslipsForRun, staffById, staffDisplayName } from "@/lib/hr";
import { formatFcfa } from "@/lib/payments";
import { currentMonth, monthLabel, readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminPayrollPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; month?: string }>;
}) {
  const { ok, error, month: monthQ } = await searchParams;
  const data = await readSchoolLife();
  const month = monthQ || currentMonth();
  const run = payrollRunForMonth(month, data);
  const slips = run ? payslipsForRun(run.id, data) : [];

  return (
    <div className="space-y-6">
      <PageIntro title={`Paie — ${monthLabel(month)}`} lead="Générer les bulletins, les télécharger en PDF, puis marquer la paie comme payée (écriture trésorerie)." />
      <AdminFlash ok={ok} error={error} />
      <form className="flex flex-wrap items-end gap-3">
        <Field label="Mois">
          <input name="month" type="month" defaultValue={month} className={fieldClass} />
        </Field>
        <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold">Changer période</button>
      </form>
      {!run || run.status === "draft" ? (
        <Card title="Générer la paie">
          <form action="/api/admin/hr" method="post">
            <input type="hidden" name="action" value="payroll-generate" />
            <input type="hidden" name="month" value={month} />
            <p className="mb-3 text-sm text-muted">
              Bulletins pour {data.staffProfiles.filter((row) => row.status !== "inactive").length} membre(s) actif(s),
              avec rubriques et avances approuvées.
            </p>
            <button className={btnPrimary}>Générer la paie</button>
          </form>
        </Card>
      ) : null}
      {run ? (
        <Card title={`Statut : ${payrollStatusLabels[run.status]}`}>
          <p className="text-sm text-muted">Total net : {formatFcfa(run.totalNet)}</p>
          {run.status === "draft" ? (
            <form action="/api/admin/hr" method="post" className="mt-3">
              <input type="hidden" name="action" value="payroll-validate" />
              <input type="hidden" name="id" value={run.id} />
              <button className={btnPrimary}>Valider</button>
            </form>
          ) : null}
          {run.status === "validated" ? (
            <form action="/api/admin/hr" method="post" className="mt-3 flex flex-wrap items-end gap-3">
              <input type="hidden" name="action" value="payroll-pay" />
              <input type="hidden" name="id" value={run.id} />
              <Field label="Compte de paiement">
                <select name="accountId" required className={fieldClass}>
                  {data.financeAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({formatFcfa(account.balance)})
                    </option>
                  ))}
                </select>
              </Field>
              <button className={btnPrimary}>Marquer comme payée</button>
            </form>
          ) : null}
          <TableWrap>
            <table className="mt-4 w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className="text-muted">
                  <th className="py-2">Personnel</th>
                  <th>Base</th>
                  <th>Primes</th>
                  <th>Retenues</th>
                  <th>Avances</th>
                  <th>Net</th>
                  <th>PDF</th>
                </tr>
              </thead>
              <tbody>
                {slips.map((slip) => (
                  <tr key={slip.id} className="border-t border-line">
                    <td className="py-3 font-semibold">{staffDisplayName(staffById(slip.staffId, data))}</td>
                    <td>{formatFcfa(slip.baseSalary)}</td>
                    <td>{formatFcfa(slip.bonuses)}</td>
                    <td>{formatFcfa(slip.deductions)}</td>
                    <td>{formatFcfa(slip.advances)}</td>
                    <td>{formatFcfa(slip.netPay)}</td>
                    <td>
                      <a href={`/api/admin/hr/payslip/${slip.id}`} className="font-semibold text-green-deep">
                        Fiche de paie
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </Card>
      ) : null}
    </div>
  );
}
