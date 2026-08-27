import { notFound } from "next/navigation";
import { Flash } from "@/components/school/PortalUi";
import { LessonValidateForm } from "@/components/school/LessonValidateForm";
import { PollRefresh } from "@/components/school/PollRefresh";
import { requireTeacher } from "@/lib/auth";
import { classLabel, readSchoolLife, staffPresenceLabels, subjectName, todayISO } from "@/lib/school-life";
import {
  dayLessonRows,
  isTeacherControlEnabled,
  workdayHistory,
} from "@/lib/teacher-control";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TeacherCoursPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await requireTeacher();
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  if (!isTeacherControlEnabled(data)) notFound();
  const date = todayISO();
  const rows = dayLessonRows(session.teacherId, date, data);
  const history = workdayHistory(session.teacherId, data, 12);
  const overdue = rows.filter((row) => row.past && !row.validation).length;

  return (
    <div className="space-y-6">
      <PollRefresh seconds={30} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">Présence pédagogique</p>
        <h1 className="mt-2 font-display text-3xl text-green-deep">Cours du jour</h1>
        <p className="mt-2 max-w-2xl text-muted">
          {formatDateFr(date)} — validez chaque créneau (chapitre + contenu). Mise à jour toutes les 30 secondes.
        </p>
      </div>
      <Flash
        ok={ok}
        error={error}
        okText="Cours validé. La direction voit l’entrée dans le journal."
        errorText={
          error === "exists"
            ? "Ce créneau est déjà validé."
            : error === "forbidden"
              ? "Le module est désactivé."
              : "Indiquez le chapitre et le contenu du cours."
        }
      />
      {overdue > 0 ? (
        <p className="rounded-2xl bg-terracotta-soft px-4 py-3 text-sm text-terracotta">
          {overdue} créneau(x) passé(s) non validé(s).
        </p>
      ) : null}
      {rows.length === 0 ? (
        <article className="rounded-3xl border border-line bg-white p-6">
          <p className="text-muted">Pas de cours dans votre EDT aujourd’hui (dimanche ou jour sans créneau).</p>
        </article>
      ) : (
        <div className="grid gap-4">
          {rows.map((row) => (
            <article
              key={row.slot.id}
              className={`rounded-3xl border bg-white p-5 ${
                row.past && !row.validation ? "border-terracotta/40" : "border-line"
              }`}
            >
              <p className="text-sm font-semibold text-terracotta">
                {row.slot.startTime} – {row.slot.endTime}
                {row.past && !row.validation ? " · à valider" : row.validation ? " · validé" : " · à venir"}
              </p>
              <h2 className="mt-1 font-display text-xl text-green-deep">
                {subjectName(row.slot.subjectId, data)} · {classLabel(row.slot.classId, data)}
              </h2>
              {row.slot.room ? <p className="text-sm text-muted">{row.slot.room}</p> : null}
              {row.validation ? (
                <div className="mt-3 rounded-2xl bg-paper px-4 py-3 text-sm">
                  <p>
                    <strong>Chapitre :</strong> {row.validation.chapter}
                  </p>
                  <p className="mt-1">{row.validation.content}</p>
                </div>
              ) : (
                <LessonValidateForm slotId={row.slot.id} date={date} />
              )}
            </article>
          ))}
        </div>
      )}
      <article className="rounded-3xl border border-line bg-white p-5">
        <h2 className="font-display text-xl text-green-deep">Jours travaillés / non travaillés</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {history.map((day) => (
            <li key={day.date} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-paper px-4 py-3">
              <span>
                <strong>{formatDateFr(day.date)}</strong>
                {day.expected ? ` · ${day.validated}/${day.expected} cours` : " · pas de créneau"}
              </span>
              <span className={day.worked ? "font-semibold text-green-deep" : "font-semibold text-terracotta"}>
                {day.worked ? "Travaillé" : "Non travaillé"}
                {day.presence ? ` · ${staffPresenceLabels[day.presence]}` : day.login ? " · connecté" : ""}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
