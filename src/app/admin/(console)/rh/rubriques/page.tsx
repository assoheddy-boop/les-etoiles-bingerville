import { AdminFlash, Card, Field, PageIntro, btnDanger, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { rubriqueKindLabels } from "@/lib/hr";
import { formatFcfa } from "@/lib/payments";
import { readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminRubriquesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();

  return (
    <div className="space-y-6">
      <PageIntro title="Rubriques paie" lead="Gains et retenues (montant fixe ou %). Appliquées à la génération de la paie du mois." />
      <AdminFlash ok={ok} error={error} />
      <Card title="Nouvelle rubrique">
        <form action="/api/admin/hr" method="post" className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="action" value="rubrique-create" />
          <Field label="Code (optionnel)">
            <input name="code" placeholder="204" className={fieldClass} />
          </Field>
          <Field label="Libellé">
            <input name="name" required placeholder="Indemnité de transport" className={fieldClass} />
          </Field>
          <Field label="Type">
            <select name="type" className={fieldClass}>
              <option value="earning">Gain</option>
              <option value="deduction">Retenue</option>
            </select>
          </Field>
          <Field label="Montant fixe (FCFA)">
            <input name="amount" type="number" min="0" className={fieldClass} />
          </Field>
          <Field label="Pourcentage (%)">
            <input name="percent" type="number" min="0" step="0.1" className={fieldClass} />
          </Field>
          <div className="sm:col-span-2">
            <button className={btnPrimary}>Ajouter</button>
          </div>
        </form>
      </Card>
      {data.payRubriques.map((row) => (
        <Card key={row.id} title={`${row.code ? `${row.code} · ` : ""}${row.name}`}>
          <p className="text-sm text-muted">
            {rubriqueKindLabels[row.type]} ·{" "}
            {row.percent != null ? `${row.percent} %` : formatFcfa(row.amount || 0)}
          </p>
          <form action="/api/admin/hr" method="post" className="mt-3">
            <input type="hidden" name="action" value="rubrique-delete" />
            <input type="hidden" name="id" value={row.id} />
            <button className={btnDanger}>Retirer</button>
          </form>
        </Card>
      ))}
    </div>
  );
}
