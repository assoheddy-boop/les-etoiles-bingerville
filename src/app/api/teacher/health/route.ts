import { formText, withTeacherMutate } from "@/lib/admin-api";
import { addHealthIncident, isHealthKind, teacherActorId, teacherStudents, todayISO } from "@/lib/school-life";

export async function POST(request: Request) {
  return withTeacherMutate(request, "/espace-enseignants/sante", (data, form, teacherId) => {
    const studentId = formText(form, "studentId");
    const kind = formText(form, "kind");
    const note = formText(form, "note");
    const allowed = teacherStudents(teacherId, data).some((row) => row.id === studentId);
    if (!allowed || !isHealthKind(kind) || !note) throw new Error("missing");
    addHealthIncident(data, {
      studentId,
      kind,
      note,
      date: todayISO(),
      recordedBy: teacherActorId(teacherId),
    });
    return "/espace-enseignants/sante?ok=1";
  });
}
