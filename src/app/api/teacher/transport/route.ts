import { formText, withTeacherMutate } from "@/lib/admin-api";
import { addTransportLog, isTransportEvent, teacherActorId } from "@/lib/school-life";

export async function POST(request: Request) {
  return withTeacherMutate(request, "/espace-enseignants/transport", (data, form, teacherId) => {
    const studentId = formText(form, "studentId");
    const event = formText(form, "event");
    if (!studentId || !isTransportEvent(event)) throw new Error("missing");
    addTransportLog(data, {
      studentId,
      event,
      note: formText(form, "note") || undefined,
      recordedBy: teacherActorId(teacherId),
    });
    return "/espace-enseignants/transport?ok=1";
  });
}
