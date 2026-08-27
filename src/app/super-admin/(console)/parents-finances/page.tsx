import { AdminFlash, Card, Field, PageIntro, TableWrap, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { PollRefresh } from "@/components/school/PollRefresh";
import { cashPaymentsOf, cashTotals, parentFinanceRows } from "@/lib/cash-payments";
import { isParentModuleActive } from "@/lib/module-control";
import { formatFcfa } from "@/lib/payments";
import { readSchoolLife } from "@/lib/school-life";
import { formatDateTimeFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SuperAdminParentFinancesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const totals = cashTotals(data);
  const rows = parentFinanceRows(data);
  const queue = cashPaymentsOf(data);

  return (
    <div className="space-y-6">
      <PollRefresh seconds={30} />
      <PageIntro
        title="Finances parents — espèces"
        lead="File d’attente interne (pas de Wave / Orange Money). Totaux dérivés des factures existantes et des encaissements espèces. Accès lecture à la caisse direction : /admin/caisse."
      />
      <AdminFlash ok={ok} error={error} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Factures payées">
          <p className="text-2xl font-semibold">{formatFcfa(totals.invoicesPaid)}</p>
          <p className="mt-1 text-xs text-muted">Démo / caisse interne</p>
        </Card>
        <Card title="Reste factures">
          <p className="text-2xl font-semibold">{formatFcfa(totals.invoicesDue)}</p>
        </Card>
        <Card title="Espèces validées">
          <p className="text-2xl font-semibold">{formatFcfa(totals.cashValidated)}</p>
        </Card>
        <Card title="File en attente">
          <p className="text-2xl font-semibold">{formatFcfa(totals.cashPending)}</p>
        </Card>
      </div>
      <Card title="Enregistrer un paiement espèces">
        <form action="/api/secretaire/cash-payment" method="post" className="grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="next" value="/super-admin/parents-finances" />
          <Field label="Parent">
            <select name="parentId" required className={fieldClass}>
              <option value="">Choisir…</option>
              {data.parents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.displayName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Élève (optionnel)">
            <select name="studentId" className={fieldClass}>
              <option value="">—</option>
              {data.students
                .filter((row) => row.parentId)
                .map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.firstName} {row.lastName}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Montant (FCFA)">
            <input name="amount" type="number" min={1} required className={fieldClass} />
          </Field>
          <div className="flex items-end">
            <button className={btnPrimary}>Mettre en file</button>
          </div>
        </form>
      </Card>
      <Card title="File d’attente">
        {queue.length === 0 ? (
          <p className="text-sm text-muted">Aucun paiement espèces.</p>
        ) : (
          <TableWrap>
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-muted">
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="py-2 pr-3 font-medium">Parent</th>
                  <th className="py-2 pr-3 font-medium">Montant</th>
                  <th className="py-2 pr-3 font-medium">Statut</th>
                  <th className="py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((payment) => {
                  const parent = data.parents.find((row) => row.id === payment.parentId);
                  return (
                    <tr key={payment.id} className="border-b border-line/70">
                      <td className="py-3 pr-3">{payment.date}</td>
                      <td className="py-3 pr-3">{parent?.displayName || payment.parentId}</td>
                      <td className="py-3 pr-3">{formatFcfa(payment.amount)}</td>
                      <td className="py-3 pr-3">{payment.status === "validated" ? "validé" : "en attente"}</td>
                      <td className="py-3">
                        {payment.status === "pending" ? (
                          <div className="flex flex-wrap gap-2">
                            <form action="/api/superadmin/validate-payment" method="post">
                              <input type="hidden" name="paymentId" value={payment.id} />
                              <button className="rounded-full bg-green px-3 py-1.5 text-xs font-semibold text-white">
                                Valider
                              </button>
                            </form>
                            <form action="/api/superadmin/validate-payment" method="post">
                              <input type="hidden" name="paymentId" value={payment.id} />
                              <input type="hidden" name="activateParentModule" value="1" />
                              <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold">
                                Valider + activer parents
                              </button>
                            </form>
                          </div>
                        ) : (
                          <span className="text-xs text-muted">
                            {payment.validatedBy || "—"}
                            {payment.validatedAt ? ` · ${formatDateTimeFr(payment.validatedAt)}` : ""}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>
      <Card title="Par famille">
        <TableWrap>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="py-2 pr-3 font-medium">Parent</th>
                <th className="py-2 pr-3 font-medium">Payé</th>
                <th className="py-2 pr-3 font-medium">Reste</th>
                <th className="py-2 pr-3 font-medium">Espèces</th>
                <th className="py-2 font-medium">Module</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.parentId} className="border-b border-line/70">
                  <td className="py-3 pr-3">
                    <span className="font-semibold">{row.parentName}</span>
                    <span className="mt-0.5 block text-xs text-muted">{row.studentLabels || "—"}</span>
                  </td>
                  <td className="py-3 pr-3">{formatFcfa(row.paid)}</td>
                  <td className="py-3 pr-3">{formatFcfa(row.due)}</td>
                  <td className="py-3 pr-3">
                    {formatFcfa(row.cashValidated)}
                    {row.cashPending ? (
                      <span className="mt-0.5 block text-xs text-muted">file {formatFcfa(row.cashPending)}</span>
                    ) : null}
                  </td>
                  <td className="py-3">{row.moduleParentsActive || isParentModuleActive(data.parents.find((p) => p.id === row.parentId)) ? "actif" : "off"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}
