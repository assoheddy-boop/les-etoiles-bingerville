import Link from "next/link";
import { notFound } from "next/navigation";
import { AssessmentForm } from "@/components/school/AssessmentForm";
import { Flash } from "@/components/school/PortalUi";
import { requireTeacher } from "@/lib/auth";
import { classLabel, readSchoolLife, subjectName, teacherClasses, todayISO } from "@/lib/school-life";
import {
  assessmentKindLabels,
  assessmentStatusLabels,
  effectiveAssessmentStatus,
  isTeacherControlEnabled,
} from "@/lib/teacher-control";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TeacherControlesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await requireTeacher();
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  if (!isTeacherControlEnabled(data)) notFound();
  const classes = teacherClasses(session.teacherId, data);
  const classIds = new Set(classes.map((item) => item.id));
  const teacher = data.teachers.find((row) => row.id === session.teacherId);
  const allowedSubjects = teacher?.subjectIds.length
    ? data.subjects.filter((subject) => teacher.subjectIds.includes(subject.id))
    : data.subjects;
  const list = data.assessments
    .filter((row) => row.teacherId === session.teacherId && classIds.has(row.classId))
    .sort((a, b) => b.date.localeCompare(a.date));
  const today = todayISO();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-green-deep">Contrôles et compositions</h1>
        <p className="mt-2 text-muted">Planifiez, joignez un sujet, puis marquez comme fait. Les notes se saisissent ensuite.</p>
      </div>
      <Flash
        ok={ok}
        error={error}
        okText="Contrôle enregistré."
        errorText={
          error === "forbidden"
            ? "Le module est désactivé."
            : error === "file" || error === "too-large" || error === "type"
              ? "Pièce jointe refusée (PDF, image ou document — 8 Mo max)."
              : "Vérifiez la classe, la matière, la date et le sujet."
        }
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Nouveau</h2>
          <div className="mt-4">
            <AssessmentForm classes={classes} subjects={allowedSubjects.length ? allowedSubjects : data.subjects} />
          </div>
        </article>
        <article className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Planning</h2>
          {list.length === 0 ? (
            <p className="mt-4 text-muted">Aucun contrôle pour l’instant.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {list.map((item) => {
                const status = effectiveAssessmentStatus(item, today);
                return (
                  <li key={item.id} className="rounded-2xl bg-paper px-4 py-3">
                    <p className="font-semibold">
                      {assessmentKindLabels[item.kind]} — {subjectName(item.subjectId, data)}
                    </p>
                    <p className="text-sm text-muted">
                      {classLabel(item.classId, data)} · {formatDateFr(item.date)} · {assessmentStatusLabels[status]}
                      {item.validated ? " · validé" : ""}
                    </p>
                    <p className="mt-2 text-sm">{item.topic}</p>
                    {item.attachment ? (
                      <Link
                        href={`/api/teacher/assessments/${item.id}/attachment`}
                        className="mt-2 inline-block text-sm font-semibold text-green-deep underline"
                      >
                        {item.attachmentName || "Sujet"}
                      </Link>
                    ) : null}
                    {status !== "fait" ? (
                      <form action="/api/teacher/assessments" method="post" className="mt-3">
                        <input type="hidden" name="action" value="done" />
                        <input type="hidden" name="id" value={item.id} />
                        <button className="rounded-full bg-green px-4 py-2 text-sm font-semibold text-white">
                          Marquer comme fait
                        </button>
                      </form>
                    ) : (
                      <Link href="/espace-enseignants/notes" className="mt-2 inline-block text-sm font-semibold text-green">
                        Saisir les notes →
                      </Link>
                    )}
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
