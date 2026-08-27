import { HomeworkForm } from "@/components/school/HomeworkForm";
import { Flash } from "@/components/school/PortalUi";
import { requireTeacher } from "@/lib/auth";
import { classLabel, readSchoolLife, teacherClasses, todayISO } from "@/lib/school-life";
import { computeAlerts, isTeacherControlEnabled } from "@/lib/teacher-control";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TeacherDevoirsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await requireTeacher();
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const classes = teacherClasses(session.teacherId, data);
  const classIds = new Set(classes.map((item) => item.id));
  const list = data.homeworks.filter((item) => classIds.has(item.classId));
  const today = todayISO();
  const enabled = isTeacherControlEnabled(data);
  const homeworkAlerts = enabled
    ? computeAlerts(data, session.teacherId).filter((row) => row.kind === "homework_missing")
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-green-deep">Devoirs</h1>
        <p className="mt-2 text-muted">
          Les parents voient le travail dans leur espace. Un message leur est envoyé à la publication.
        </p>
      </div>
      <Flash
        ok={ok}
        error={error}
        okText="Devoir publié."
        errorText={
          error === "file"
            ? "Pièce jointe refusée (PDF, image ou document — 8 Mo max)."
            : "Vérifiez la classe, le titre et la date."
        }
      />
      {homeworkAlerts.length > 0 ? (
        <p className="rounded-2xl bg-terracotta-soft px-4 py-3 text-sm text-terracotta">
          {homeworkAlerts.map((row) => row.title).join(" · ")}
        </p>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Publier</h2>
          <div className="mt-4">
            <HomeworkForm classes={classes} />
          </div>
        </article>
        <article className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Devoirs publiés</h2>
          {list.length === 0 ? (
            <p className="mt-4 text-muted">Aucun devoir.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {list.map((item) => (
                <li key={item.id} className="rounded-2xl bg-paper px-4 py-3">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted">
                    {classLabel(item.classId, data)} · à rendre le {formatDateFr(item.dueDate)} ·{" "}
                    {item.dueDate < today ? "en retard (date limite dépassée)" : "créé"}
                  </p>
                  {item.attachment ? (
                    <a
                      href={`/api/teacher/homeworks/${item.id}/attachment`}
                      className="mt-2 inline-block text-sm font-semibold text-green-deep underline"
                    >
                      {item.attachmentName || "Pièce jointe"}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </div>
  );
}
