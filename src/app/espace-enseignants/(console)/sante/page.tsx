import { Card } from "@/components/school/AdminUi";
import { ExtrasFlash, HealthForm } from "@/components/school/ExtrasUi";
import { requireTeacher } from "@/lib/auth";
import { healthKindLabels, readSchoolLife, studentFullName, teacherStudents } from "@/lib/school-life";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TeacherSantePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await requireTeacher();
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const students = teacherStudents(session.teacherId, data);
  const allowed = new Set(students.map((row) => row.id));
  const incidents = data.healthIncidents.filter((item) => allowed.has(item.studentId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-green-deep">Santé</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Note courte pour la famille : fièvre, blessure, renvoyé à la maison. Pas de pièce jointe médicale.
        </p>
      </div>
      <ExtrasFlash ok={ok} error={error} okText="Signalement enregistré. Le parent le voit dans son espace." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Signaler">
          <HealthForm action="/api/teacher/health" students={students} />
        </Card>
        <Card title="Notes de vos classes">
          {incidents.length === 0 ? (
            <p className="text-sm text-muted">Aucun signalement.</p>
          ) : (
            <ul className="space-y-3">
              {incidents.map((item) => {
                const student = data.students.find((row) => row.id === item.studentId);
                return (
                  <li key={item.id} className="rounded-2xl bg-paper px-4 py-3">
                    <p className="text-xs text-muted">
                      {formatDateFr(item.date)} · {student ? studentFullName(student) : ""}
                    </p>
                    <p className="mt-1 font-semibold">{healthKindLabels[item.kind]}</p>
                    <p className="mt-1 text-sm text-muted">{item.note}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
