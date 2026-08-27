import { AdminFlash, Card, Field, PageIntro, btnDanger, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { classLabel, currentYear, readSchoolLife, studentFullName, studentsInClass } from "@/lib/school-life";
import { CYCLES } from "@/lib/school-life-types";

export const dynamic = "force-dynamic";

export default async function AdminClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const year = currentYear(data);

  return (
    <div className="space-y-6">
      <PageIntro
        title="Classes"
        lead="Créez d’abord l’année, puis les classes (GS, CE2, 6ème…). Les élèves et l’EDT s’y rattachent."
      />
      <AdminFlash ok={ok} error={error} />
      {year ? (
        <p className="text-sm text-muted">
          Année en cours : <strong className="text-ink">{year.label}</strong>
        </p>
      ) : null}

      <Card title="Nouvelle classe">
        <form action="/api/admin/classes" method="post" className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom">
            <input name="name" required placeholder="Ex. CE1" className={fieldClass} />
          </Field>
          <Field label="Cycle">
            <select name="cycle" required className={fieldClass}>
              {CYCLES.map((cycle) => (
                <option key={cycle} value={cycle}>
                  {cycle}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Établissement">
            <select name="establishmentId" required className={fieldClass}>
              {data.establishments.map((est) => (
                <option key={est.id} value={est.id}>
                  {est.shortName} ({est.cycle})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Année scolaire">
            <select name="schoolYearId" defaultValue={data.currentSchoolYearId} className={fieldClass}>
              {data.schoolYears.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                  {item.current ? " (en cours)" : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Salle">
            <input name="room" placeholder="Ex. Salle CE1" className={fieldClass} />
          </Field>
          <div className="flex items-end">
            <button className={btnPrimary}>Créer la classe</button>
          </div>
        </form>
      </Card>

      {data.classes.map((item) => {
        const count = studentsInClass(item.id, data).length;
        const yearLabel = data.schoolYears.find((row) => row.id === item.schoolYearId)?.label ?? item.schoolYearId;
        return (
          <Card key={item.id} title={classLabel(item.id, data)}>
            <p className="mb-4 text-sm text-muted">
              {item.cycle} · {yearLabel}
              {item.room ? ` · ${item.room}` : ""} · {count} élève(s)
            </p>
            <form action="/api/admin/classes" method="post" className="grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="id" value={item.id} />
              <Field label="Nom">
                <input name="name" required defaultValue={item.name} className={fieldClass} />
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
              <Field label="Établissement">
                <select name="establishmentId" defaultValue={item.establishmentId} className={fieldClass}>
                  {data.establishments.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.shortName} ({est.cycle})
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Année">
                <select name="schoolYearId" defaultValue={item.schoolYearId} className={fieldClass}>
                  {data.schoolYears.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Salle">
                <input name="room" defaultValue={item.room ?? ""} className={fieldClass} />
              </Field>
              <div className="flex flex-wrap items-end gap-3">
                <button className={btnPrimary}>Enregistrer</button>
              </div>
            </form>
            <form action="/api/admin/classes" method="post" className="mt-4">
              <input type="hidden" name="action" value="delete" />
              <input type="hidden" name="id" value={item.id} />
              <button className={btnDanger}>Supprimer</button>
            </form>
            {count > 0 ? (
              <ul className="mt-4 text-sm text-muted">
                {studentsInClass(item.id, data)
                  .slice(0, 6)
                  .map((student) => (
                    <li key={student.id}>{studentFullName(student)}</li>
                  ))}
                {count > 6 ? <li>… et {count - 6} autre(s)</li> : null}
              </ul>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}
