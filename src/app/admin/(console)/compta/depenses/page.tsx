import { AdminFlash, Card, Field, PageIntro, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { categoryKindLabels } from "@/lib/accounting";
import { readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminDepensesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();

  return (
    <div className="space-y-6">
      <PageIntro title="Dépenses / catégories" lead="Catégories de recettes et de dépenses pour classer les mouvements." />
      <AdminFlash ok={ok} error={error} />
      <Card title="Nouvelle catégorie">
        <form action="/api/admin/accounting" method="post" className="grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="action" value="category-create" />
          <Field label="Nom">
            <input name="name" required placeholder="Ex. Fournitures" className={fieldClass} />
          </Field>
          <Field label="Type">
            <select name="kind" className={fieldClass}>
              <option value="expense">Dépense</option>
              <option value="income">Recette</option>
            </select>
          </Field>
          <div>
            <button className={btnPrimary}>Ajouter</button>
          </div>
        </form>
      </Card>
      <Card title="Catégories">
        <ul className="space-y-2 text-sm">
          {data.expenseCategories.map((cat) => (
            <li key={cat.id} className="rounded-2xl bg-paper px-4 py-3">
              <strong>{cat.name}</strong> · {categoryKindLabels[cat.kind]}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
