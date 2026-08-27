import { AdminFlash, Card, Field, PageIntro, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { TimetableGrid } from "@/components/school/TimetableGrid";
import { classLabel, classTimetable, readSchoolLife } from "@/lib/school-life";
import { WEEKDAYS } from "@/lib/school-life-types";

export const dynamic = "force-dynamic";

export default async function AdminTimetablePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; classId?: string }>;
}) {
  const { ok, error, classId: rawClassId } = await searchParams;
  const data = await readSchoolLife();
  const classId = rawClassId || data.classes[0]?.id || "";
  const klass = data.classes.find((row) => row.id === classId);
  const slots = classId ? classTimetable(classId, data) : [];

  return (
    <div className="space-y-6">
      <PageIntro
        title="Emploi du temps"
        lead="Posez les cours par classe. Un même enseignant ne peut pas être sur deux classes à la même heure."
      />
      <AdminFlash ok={ok} error={error} />

      <form method="get" className="flex flex-wrap items-end gap-3">
        <Field label="Classe">
          <select name="classId" defaultValue={classId} className={fieldClass}>
            {data.classes.map((item) => (
              <option key={item.id} value={item.id}>
                {classLabel(item.id, data)}
              </option>
            ))}
          </select>
        </Field>
        <button className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold">Afficher</button>
      </form>

      {klass ? (
        <>
          <Card title={`Grille — ${classLabel(klass.id, data)}`}>
            <TimetableGrid
              slots={slots}
              data={data}
              emptyText="Aucun cours pour cette classe. Ajoutez un créneau ci-dessous."
              onDeleteAction="/api/admin/timetable"
            />
          </Card>

          <Card title="Ajouter un créneau">
            <form action="/api/admin/timetable" method="post" className="grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="classId" value={klass.id} />
              <Field label="Jour">
                <select name="dayOfWeek" required className={fieldClass}>
                  {WEEKDAYS.map((day) => (
                    <option key={day.id} value={day.id}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Salle">
                <input name="room" defaultValue={klass.room ?? ""} className={fieldClass} />
              </Field>
              <Field label="Début">
                <input name="startTime" type="time" required defaultValue="08:00" className={fieldClass} />
              </Field>
              <Field label="Fin">
                <input name="endTime" type="time" required defaultValue="09:00" className={fieldClass} />
              </Field>
              <Field label="Matière">
                <select name="subjectId" required className={fieldClass}>
                  <option value="">— Choisir —</option>
                  {data.subjects
                    .filter((subject) => !subject.cycle || subject.cycle === klass.cycle)
                    .map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                </select>
              </Field>
              <Field label="Enseignant">
                <select name="teacherId" required className={fieldClass}>
                  <option value="">— Choisir —</option>
                  {data.teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.displayName}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <button className={btnPrimary}>Poser le cours</button>
              </div>
            </form>
          </Card>
        </>
      ) : (
        <p className="text-muted">Créez d’abord une classe.</p>
      )}
    </div>
  );
}
