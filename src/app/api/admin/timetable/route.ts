import { formText, withAdminMutate } from "@/lib/admin-api";
import { attachTeacherToClass, isWeekday, newId, timetableConflict } from "@/lib/school-life";

export async function POST(request: Request) {
  return withAdminMutate(request, "/admin/emploi-du-temps", (data, form) => {
    const classId = formText(form, "classId");
    const next = classId
      ? `/admin/emploi-du-temps?classId=${encodeURIComponent(classId)}&ok=1`
      : "/admin/emploi-du-temps?ok=1";
    const action = formText(form, "action") || "create";
    if (action === "delete") {
      const id = formText(form, "id");
      data.timetableSlots = data.timetableSlots.filter((row) => row.id !== id);
      return next;
    }

    const startTime = formText(form, "startTime");
    const endTime = formText(form, "endTime");
    const subjectId = formText(form, "subjectId");
    const teacherId = formText(form, "teacherId");
    const room = formText(form, "room");
    const day = Number(formText(form, "dayOfWeek"));
    if (!classId || !startTime || !endTime || !subjectId || !teacherId || !isWeekday(day)) {
      throw new Error("missing");
    }
    if (startTime >= endTime) throw new Error("missing");
    if (!data.classes.some((row) => row.id === classId)) throw new Error("missing");
    if (!data.subjects.some((row) => row.id === subjectId)) throw new Error("missing");
    const teacher = data.teachers.find((row) => row.id === teacherId);
    if (!teacher) throw new Error("missing");

    const slot = {
      classId,
      dayOfWeek: day,
      startTime,
      endTime,
      subjectId,
      teacherId,
      room: room || undefined,
    };
    const conflict = timetableConflict(slot, data);
    if (conflict) throw new Error("conflict");

    data.timetableSlots.push({ id: newId("edt"), ...slot });
    attachTeacherToClass(teacher, classId);
    if (!teacher.subjectIds.includes(subjectId)) teacher.subjectIds.push(subjectId);
    return next;
  });
}
