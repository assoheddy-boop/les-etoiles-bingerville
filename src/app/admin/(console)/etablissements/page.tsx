import { AdminFlash, Card, Field, PageIntro, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { CYCLES } from "@/lib/school-life-types";
import { readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminEstablishmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();

  return (
    <div className="space-y-6">
      <PageIntro
        title="Établissements"
        lead="Le groupe scolaire Les Étoiles rassemble trois établissements sur le campus d’Adjamé-Bingerville à Bingerville. Modifiez les fiches (agréments MEN, coordonnées) — pas besoin d’ajouter des campus à l’infini."
      />
      <AdminFlash ok={ok} error={error} />

      {data.establishments.map((item) => (
        <Card key={item.id} title={item.shortName}>
          <p className="mb-4 text-sm text-muted">
            {item.cycle}
            {item.menDecision ? ` · Agrément ${item.menDecision}` : " · Ouverture"}
            {item.menDate ? ` (${item.menDate})` : ""}
          </p>
          <form action="/api/admin/etablissements" method="post" className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="id" value={item.id} />
            <Field label="Nom officiel">
              <input name="name" required defaultValue={item.name} className={fieldClass} />
            </Field>
            <Field label="Nom court (affiché dans l’admin)">
              <input name="shortName" required defaultValue={item.shortName} className={fieldClass} />
            </Field>
            <Field label="Cycle">
              <select name="cycle" defaultValue={item.cycle} className={fieldClass}>
                {CYCLES.map((cycle) => (
                  <option key={cycle} value={cycle}>
                    {cycle}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Campus (site)">
              <input name="campus" defaultValue={item.campus} className={fieldClass} />
            </Field>
            <Field label="Décision MEN">
              <input name="menDecision" defaultValue={item.menDecision ?? ""} placeholder="À confirmer (MENA / DEEP)" className={fieldClass} />
            </Field>
            <Field label="Date d’agrément">
              <input name="menDate" defaultValue={item.menDate ?? ""} placeholder="À confirmer" className={fieldClass} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Adresse">
                <textarea name="address" rows={2} defaultValue={item.address} className={fieldClass} />
              </Field>
            </div>
            <Field label="Téléphone">
              <input name="phone" defaultValue={item.phone ?? ""} className={fieldClass} />
            </Field>
            <div className="flex items-end">
              <button className={btnPrimary}>Enregistrer</button>
            </div>
          </form>
        </Card>
      ))}
    </div>
  );
}
