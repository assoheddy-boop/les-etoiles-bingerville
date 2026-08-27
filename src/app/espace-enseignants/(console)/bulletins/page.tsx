import Link from "next/link";
import { notFound } from "next/navigation";
import { Flash } from "@/components/school/PortalUi";
import { btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { requireTeacher } from "@/lib/auth";
import { classLabel, readSchoolLife, studentFullName, teacherClasses } from "@/lib/school-life";
import { currentBulletinPeriod, isTeacherControlEnabled } from "@/lib/teacher-control";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TeacherBulletinsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await requireTeacher();
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  if (!isTeacherControlEnabled(data)) notFound();
  const classes = teacherClasses(session.teacherId, data);
  const period = currentBulletinPeriod(data);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-green-deep">Bulletins</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Les PDF sont générés par la direction. Ici : généré vs manquant, et signalement de dépôt (journal d’activité).
        </p>
      </div>
      <Flash
        ok={ok}
        error={error}
        okText="Dépôt enregistré dans le journal."
        errorText="Choisissez une classe."
      />
      {classes.map((klass) => {
        const students = data.students.filter((row) => row.classId === klass.id);
        return (
          <article key={klass.id} className="rounded-3xl border border-line bg-white p-5">
            <h2 className="font-display text-xl text-green-deep">{classLabel(klass.id, data)}</h2>
            <p className="mt-1 text-sm text-muted">Période de référence : {period}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {students.map((student) => {
                const bulletins = data.bulletins.filter((row) => row.studentId === student.id);
                const current = bulletins.find((row) => row.period.includes(data.schoolYears.find((y) => y.id === data.currentSchoolYearId)?.label ?? ""));
                const latest = current ?? bulletins[0];
                return (
                  <li key={student.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-paper px-4 py-3">
                    <span>
                      <strong>{studentFullName(student)}</strong>
                      <span className="mt-1 block text-muted">
                        {latest
                          ? `Bulletin généré · ${latest.period} · ${formatDateFr(latest.createdAt)}`
                          : "Bulletin manquant"}
                      </span>
                    </span>
                    {latest ? (
                      <Link
                        href={`/api/teacher/bulletins/${latest.id}/pdf`}
                        className="text-sm font-semibold text-green-deep underline"
                      >
                        PDF
                      </Link>
                    ) : (
                      <span className="text-sm font-semibold text-terracotta">Manquant</span>
                    )}
                  </li>
                );
              })}
            </ul>
            {students.length === 0 ? <p className="mt-3 text-sm text-muted">Aucun élève dans cette classe.</p> : null}
            <form action="/api/teacher/bulletins/deposit" method="post" className="mt-4 flex flex-wrap items-end gap-3">
              <input type="hidden" name="classId" value={klass.id} />
              <label className="grid gap-1 text-sm font-medium">
                Période déposée
                <input name="period" defaultValue={period} required className={fieldClass} />
              </label>
              <button className={btnPrimary}>Signaler le dépôt</button>
            </form>
          </article>
        );
      })}
    </div>
  );
}
