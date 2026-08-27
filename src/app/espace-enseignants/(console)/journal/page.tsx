import { notFound } from "next/navigation";
import { requireTeacher } from "@/lib/auth";
import { classLabel, readSchoolLife, subjectName } from "@/lib/school-life";
import { isTeacherControlEnabled, journalByClassSubject } from "@/lib/teacher-control";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TeacherJournalPage() {
  const session = await requireTeacher();
  const data = await readSchoolLife();
  if (!isTeacherControlEnabled(data)) notFound();
  const groups = journalByClassSubject(session.teacherId, data);
  const todaySlots = data.timetableSlots.filter((slot) => slot.teacherId === session.teacherId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-green-deep">Cours effectués</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Journal par matière et classe. Les créneaux du jour non validés restent visibles dans « Cours du jour ».
        </p>
      </div>
      {todaySlots.length > 0 ? (
        <p className="text-sm text-muted">{todaySlots.length} créneau(x) dans votre EDT cette semaine.</p>
      ) : null}
      {groups.length === 0 ? (
        <article className="rounded-3xl border border-line bg-white p-6">
          <p className="text-muted">Aucun cours validé pour l’instant.</p>
        </article>
      ) : (
        groups.map((group) => (
          <article key={`${group.classId}-${group.subjectId}`} className="rounded-3xl border border-line bg-white p-5">
            <h2 className="font-display text-xl text-green-deep">
              {group.subjectLabel} · {group.classLabel}
            </h2>
            <ul className="mt-4 space-y-3">
              {group.items.map((item) => (
                <li key={item.id} className="rounded-2xl bg-paper px-4 py-3 text-sm">
                  <p className="font-semibold">
                    {formatDateFr(item.date)} — {item.chapter}
                  </p>
                  <p className="mt-1 text-muted">
                    {classLabel(item.classId, data)} · {subjectName(item.subjectId, data)}
                  </p>
                  <p className="mt-2">{item.content}</p>
                </li>
              ))}
            </ul>
          </article>
        ))
      )}
    </div>
  );
}
