import { GradeForm } from "@/components/school/GradeForm";
import { Flash } from "@/components/school/PortalUi";
import { requireTeacher } from "@/lib/auth";
import { readSchoolLife, studentFullName, teacherClasses } from "@/lib/school-life";
import { computeAlerts, isTeacherControlEnabled } from "@/lib/teacher-control";

export const dynamic = "force-dynamic";

export default async function TeacherNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await requireTeacher();
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const classes = teacherClasses(session.teacherId, data);
  const classIds = new Set(classes.map((item) => item.id));
  const students = data.students.filter((student) => classIds.has(student.classId));
  const recent = data.grades.filter((grade) => grade.teacherId === session.teacherId).slice(0, 8);
  const gradeAlerts = isTeacherControlEnabled(data)
    ? computeAlerts(data, session.teacherId).filter((row) => row.kind === "grades_late")
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-green-deep">Saisie des notes</h1>
        <p className="mt-2 text-muted">
          Les familles voient les notes dès l’enregistrement. Un contrôle passé sans notes déclenche une alerte.
        </p>
      </div>
      <Flash ok={ok} error={error} okText="Note enregistrée." errorText="Vérifiez l’élève, la matière et la note." />
      {gradeAlerts.length > 0 ? (
        <p className="rounded-2xl bg-terracotta-soft px-4 py-3 text-sm text-terracotta">
          {gradeAlerts.map((row) => row.title).join(" · ")}
        </p>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-line bg-white p-6">
          <GradeForm classes={classes} students={students} />
        </article>
        <article className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Dernières notes</h2>
          {recent.length === 0 ? (
            <p className="mt-4 text-muted">Aucune note saisie.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recent.map((grade) => {
                const student = data.students.find((row) => row.id === grade.studentId);
                return (
                  <li key={grade.id} className="rounded-2xl bg-paper px-4 py-3 text-sm">
                    <strong>{student ? studentFullName(student) : grade.studentId}</strong> · {grade.subject}{" "}
                    {grade.value}/{grade.maxValue}
                    <span className="mt-1 block text-muted">{grade.period}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </article>
      </div>
    </div>
  );
}
