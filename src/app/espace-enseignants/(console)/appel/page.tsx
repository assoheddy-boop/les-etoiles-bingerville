import { AttendanceForm } from "@/components/school/AttendanceForm";
import { Flash } from "@/components/school/PortalUi";
import { requireTeacher } from "@/lib/auth";
import {
  attendanceForClassDate,
  classLabel,
  readSchoolLife,
  studentsInClass,
  teacherClasses,
  todayISO,
} from "@/lib/school-life";
import type { AttendanceStatus } from "@/lib/school-life-types";

export const dynamic = "force-dynamic";

export default async function TeacherAppelPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await requireTeacher();
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const classes = teacherClasses(session.teacherId, data);
  const date = todayISO();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-green-deep">Appel du jour</h1>
        <p className="mt-2 text-muted">Date : {date} (heure d’Abidjan). Un appel par classe, modifiable dans la journée.</p>
      </div>
      <Flash
        ok={ok}
        error={error}
        okText="Appel enregistré. Les absences et retards apparaissent chez les parents."
        errorText="Impossible d’enregistrer cet appel."
      />
      {classes.map((item) => {
        const students = studentsInClass(item.id, data);
        const existing = attendanceForClassDate(item.id, date, data);
        const current: Record<string, AttendanceStatus> = {};
        for (const entry of existing?.entries ?? []) current[entry.studentId] = entry.status;
        return (
          <article key={item.id} className="rounded-3xl border border-line bg-white p-6">
            <h2 className="font-display text-2xl text-green-deep">{classLabel(item.id, data)}</h2>
            <p className="mt-1 text-sm text-muted">{item.cycle} · {students.length} élève(s)</p>
            <div className="mt-5">
              <AttendanceForm classId={item.id} date={date} students={students} current={current} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
