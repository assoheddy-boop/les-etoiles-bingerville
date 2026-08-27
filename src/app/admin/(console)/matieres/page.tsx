import { AdminFlash, Card, Field, PageIntro, btnDanger, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { readSchoolLife } from "@/lib/school-life";
import { CYCLES } from "@/lib/school-life-types";

export const dynamic = "force-dynamic";

export default async function AdminSubjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();

  return (
    <div className="space-y-6">
      <PageIntro title="Matières" lead="Les matières alimentent l’emploi du temps et les notes." />
      <AdminFlash ok={ok} error={error} />

      <Card title="Nouvelle matière">
        <form action="/api/admin/subjects" method="post" className="grid gap-4 sm:grid-cols-3">
          <Field label="Nom">
            <input name="name" required placeholder="Ex. Français" className={fieldClass} />
          </Field>
          <Field label="Cycle (optionnel)">
            <select name="cycle" className={fieldClass}>
              <option value="">Tous cycles</option>
              {CYCLES.map((cycle) => (
                <option key={cycle} value={cycle}>
                  {cycle}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex items-end">
            <button className={btnPrimary}>Ajouter</button>
          </div>
        </form>
      </Card>

      <Card title="Liste">
        <ul className="space-y-4">
          {data.subjects.map((subject) => (
            <li key={subject.id} className="rounded-2xl bg-paper p-4">
              <form action="/api/admin/subjects" method="post" className="grid gap-3 sm:grid-cols-3">
                <input type="hidden" name="id" value={subject.id} />
                <input name="name" required defaultValue={subject.name} className={fieldClass} />
                <select name="cycle" defaultValue={subject.cycle ?? ""} className={fieldClass}>
                  <option value="">Tous cycles</option>
                  {CYCLES.map((cycle) => (
                    <option key={cycle} value={cycle}>
                      {cycle}
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-full bg-green px-4 py-2 text-sm font-semibold text-white">OK</button>
                </div>
              </form>
              <form action="/api/admin/subjects" method="post" className="mt-2">
                <input type="hidden" name="action" value="delete" />
                <input type="hidden" name="id" value={subject.id} />
                <button className={btnDanger}>Supprimer</button>
              </form>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
