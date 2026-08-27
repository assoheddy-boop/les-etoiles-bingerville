import { studentFullName } from "@/lib/school-life";
import type { RosterStudent, SchoolClass } from "@/lib/school-life-types";

export function GradeForm({
  classes,
  students,
}: {
  classes: SchoolClass[];
  students: RosterStudent[];
}) {
  return (
    <form action="/api/teacher/grades" method="post" className="space-y-4">
      <label className="grid gap-1 text-sm font-medium">
        Élève
        <select name="studentId" required className="w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2.5 font-normal">
          <option value="">— Choisir —</option>
          {classes.map((item) => (
            <optgroup key={item.id} label={`${item.name} — ${item.campus}`}>
              {students
                .filter((student) => student.classId === item.id)
                .map((student) => (
                  <option key={student.id} value={student.id}>
                    {studentFullName(student)}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Matière
          <input
            name="subject"
            required
            placeholder="Ex. Mathématiques"
            className="w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Période
          <input
            name="period"
            required
            defaultValue="Trimestre 1 — 2026-2027"
            className="w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Note
          <input
            name="value"
            type="number"
            step="0.25"
            min="0"
            required
            className="w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Sur
          <input
            name="maxValue"
            type="number"
            step="0.25"
            min="1"
            defaultValue={20}
            className="w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
          />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-medium">
        Commentaire
        <textarea name="comment" rows={2} className="w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2.5 font-normal" />
      </label>
      <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-green px-5 py-3 font-semibold text-white hover:bg-green-deep sm:w-auto">
        Enregistrer la note
      </button>
    </form>
  );
}
