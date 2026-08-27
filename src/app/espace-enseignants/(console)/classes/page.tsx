import { requireTeacher } from "@/lib/auth";
import { classLabel, readSchoolLife, studentFullName, studentsInClass, teacherClasses } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function TeacherClassesPage() {
  const session = await requireTeacher();
  const data = await readSchoolLife();
  const classes = teacherClasses(session.teacherId, data);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-green-deep">Classes Les Étoiles</h1>
        <p className="mt-2 text-muted">Maternelle, primaire et secondaire (ouverture). Effectifs de démonstration.</p>
      </div>
      {classes.map((item) => {
        const students = studentsInClass(item.id, data);
        return (
          <article key={item.id} className="rounded-3xl border border-line bg-white p-6">
            <h2 className="font-display text-2xl text-green-deep">{classLabel(item.id, data)}</h2>
            <p className="mt-1 text-sm text-muted">
              {item.cycle} · {students.length} élève(s)
            </p>
            <ul className="mt-4 divide-y divide-line">
              {students.map((student) => (
                <li key={student.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <span className="font-medium">{studentFullName(student)}</span>
                  <span className="text-sm text-muted">
                    {student.matricule ?? "Sans compte parent"}
                    {student.parentName ? ` · ${student.parentName}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
