import { attendanceLabels, studentFullName } from "@/lib/school-life";
import type { AttendanceStatus, RosterStudent } from "@/lib/school-life-types";

export function AttendanceForm({
  classId,
  date,
  students,
  current,
}: {
  classId: string;
  date: string;
  students: RosterStudent[];
  current: Record<string, AttendanceStatus>;
}) {
  return (
    <form action="/api/teacher/attendance" method="post" className="space-y-4">
      <input type="hidden" name="classId" value={classId} />
      <input type="hidden" name="date" value={date} />
      <p className="text-sm text-muted">
        Marquez chaque élève : <strong>Présent</strong>, <strong>Retard</strong> ou <strong>Absent</strong>.
      </p>
      <ul className="space-y-3">
        {students.map((student) => {
          const value = current[student.id] ?? "present";
          return (
            <li
              key={student.id}
              className="flex flex-col gap-3 rounded-2xl bg-paper px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-medium">
                {studentFullName(student)}
                {student.matricule ? (
                  <span className="mt-0.5 block text-xs text-muted">{student.matricule}</span>
                ) : null}
              </span>
              <fieldset className="flex flex-wrap gap-2" aria-label={`Présence ${studentFullName(student)}`}>
                {(["present", "late", "absent"] as const).map((status) => (
                  <label
                    key={status}
                    className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                      status === "present"
                        ? "border-green/30 has-[:checked]:bg-green-soft has-[:checked]:text-green-deep"
                        : status === "late"
                          ? "border-gold/40 has-[:checked]:bg-[#f8f1d8] has-[:checked]:text-[#7a5b00]"
                          : "border-terracotta/30 has-[:checked]:bg-terracotta-soft has-[:checked]:text-terracotta"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`status_${student.id}`}
                      value={status}
                      defaultChecked={value === status}
                      className="accent-green"
                    />
                    {attendanceLabels[status]}
                  </label>
                ))}
              </fieldset>
            </li>
          );
        })}
      </ul>
      <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-green px-5 py-3 font-semibold text-white hover:bg-green-deep sm:w-auto">
        Enregistrer l’appel
      </button>
    </form>
  );
}
