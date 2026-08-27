import { AdminFlash, Card, Field, PageIntro, TableWrap, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { supplierInvoiceStatusLabels } from "@/lib/accounting";
import { formatFcfa } from "@/lib/payments";
import { readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminFacturesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const expenseCats = data.expenseCategories.filter((row) => row.kind === "expense");

  return (
    <div className="space-y-6">
      <PageIntro title="Factures fournisseurs" lead="Saisir, payer (écriture en trésorerie) ou annuler." />
      <AdminFlash ok={ok} error={error} />
      <Card title="Enregistrer une facture">
        <form action="/api/admin/accounting" method="post" className="grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="action" value="invoice-create" />
          <Field label="Fournisseur">
            <input name="supplier" required className={fieldClass} />
          </Field>
          <Field label="Montant (FCFA)">
            <input name="amount" type="number" min="1" required className={fieldClass} />
          </Field>
          <Field label="Description">
            <input name="description" className={fieldClass} />
          </Field>
          <Field label="Échéance">
            <input name="dueDate" type="date" className={fieldClass} />
          </Field>
          <Field label="Catégorie">
            <select name="categoryId" className={fieldClass}>
              <option value="">—</option>
              {expenseCats.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <button className={btnPrimary}>Enregistrer la facture</button>
          </div>
        </form>
      </Card>
      <Card title="Liste">
        <TableWrap>
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="text-muted">
                <th className="py-2">Fournisseur</th>
                <th>Montant</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.supplierInvoices.map((inv) => (
                <tr key={inv.id} className="border-t border-line">
                  <td className="py-3">
                    <strong>{inv.supplier}</strong>
                    {inv.description ? <span className="block text-muted">{inv.description}</span> : null}
                  </td>
                  <td>{formatFcfa(inv.amount)}</td>
                  <td>{supplierInvoiceStatusLabels[inv.status]}</td>
                  <td>
                    {inv.status === "pending" ? (
                      <div className="flex flex-wrap gap-2">
                        <form action="/api/admin/accounting" method="post" className="flex flex-wrap gap-2">
                          <input type="hidden" name="action" value="invoice-pay" />
                          <input type="hidden" name="id" value={inv.id} />
                          <select name="accountId" required className={fieldClass}>
                            {data.financeAccounts.map((account) => (
                              <option key={account.id} value={account.id}>
                                {account.name}
                              </option>
                            ))}
                          </select>
                          <button className={btnPrimary}>Payer</button>
                        </form>
                        <form action="/api/admin/accounting" method="post">
                          <input type="hidden" name="action" value="invoice-cancel" />
                          <input type="hidden" name="id" value={inv.id} />
                          <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold">Annuler</button>
                        </form>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}
