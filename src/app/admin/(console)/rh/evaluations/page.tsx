import { AdminFlash, Card, Field, PageIntro, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { staffById, staffDisplayName } from "@/lib/hr";
import { readSchoolLife, todayISO } from "@/lib/school-life";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminEvaluationsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();

  return (
    <div className="space-y-6">
      <PageIntro title="Évaluations" lead="Note simple (sur 20) et commentaire — pas une grille d’inspection complète." />
      <AdminFlash ok={ok} error={error} />
      <Card title="Nouvelle évaluation">
        <form action="/api/admin/hr" method="post" className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="action" value="evaluation-create" />
          <Field label="Personnel">
            <select name="staffId" required className={fieldClass}>
              {data.staffProfiles.map((row) => (
                <option key={row.id} value={row.id}>
                  {staffDisplayName(row)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date">
            <input name="date" type="date" defaultValue={todayISO()} className={fieldClass} />
          </Field>
          <Field label="Score / 20">
            <input name="score" type="number" min="0" max="20" required className={fieldClass} />
          </Field>
          <Field label="Commentaire">
            <input name="comment" required className={fieldClass} />
          </Field>
          <div>
            <button className={btnPrimary}>Enregistrer</button>
          </div>
        </form>
      </Card>
      <Card title="Historique">
        <ul className="space-y-3">
          {data.staffEvaluations.map((row) => (
            <li key={row.id} className="rounded-2xl bg-paper px-4 py-3">
              <p className="font-semibold">
                {staffDisplayName(staffById(row.staffId, data))} · {row.score}/20
              </p>
              <p className="text-sm text-muted">{formatDateFr(row.date)}</p>
              <p className="mt-1 text-sm">{row.comment}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
