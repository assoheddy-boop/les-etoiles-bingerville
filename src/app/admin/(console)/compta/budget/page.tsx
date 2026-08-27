import { AdminFlash, Card, Field, PageIntro, TableWrap, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { budgetRows, categoryKindLabels } from "@/lib/accounting";
import { formatFcfa } from "@/lib/payments";
import { currentYear, readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminBudgetPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const year = currentYear(data)?.label ?? "2026-2027";
  const rows = budgetRows(data, year);

  return (
    <div className="space-y-6">
      <PageIntro title={`Budget ${year}`} lead="Montants prévus par catégorie, comparés aux mouvements de l’année." />
      <AdminFlash ok={ok} error={error} />
      <Card title="Ligne de budget">
        <form action="/api/admin/accounting" method="post" className="grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="action" value="budget" />
          <input type="hidden" name="year" value={year} />
          <Field label="Catégorie">
            <select name="categoryId" required className={fieldClass}>
              {data.expenseCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({categoryKindLabels[cat.kind]})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Montant prévu (FCFA)">
            <input name="plannedAmount" type="number" min="0" required className={fieldClass} />
          </Field>
          <div>
            <button className={btnPrimary}>Enregistrer la ligne</button>
          </div>
        </form>
      </Card>
      <Card title="Suivi">
        <TableWrap>
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="text-muted">
                <th className="py-2">Catégorie</th>
                <th>Prévu</th>
                <th>Réalisé</th>
                <th>Écart</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-line">
                  <td className="py-2">{row.categoryName}</td>
                  <td>{formatFcfa(row.planned)}</td>
                  <td>{formatFcfa(row.actual)}</td>
                  <td>{formatFcfa(row.variance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}
