import { formText, withAdminMutate } from "@/lib/admin-api";
import { campusFromEstablishment, findEstablishment } from "@/lib/establishments";
import { newId } from "@/lib/school-life";
import { CYCLES, type CycleId } from "@/lib/school-life-types";

function asCycle(value: string): CycleId {
  if (CYCLES.includes(value as CycleId)) return value as CycleId;
  throw new Error("missing");
}

export async function POST(request: Request) {
  return withAdminMutate(request, "/admin/classes", (data, form) => {
    const action = formText(form, "action") || "create";
    if (action === "delete") {
      const id = formText(form, "id");
      if (data.students.some((row) => row.classId === id)) throw new Error("in-use");
      if (data.timetableSlots.some((row) => row.classId === id)) throw new Error("in-use");
      data.classes = data.classes.filter((row) => row.id !== id);
      for (const teacher of data.teachers) {
        teacher.classIds = teacher.classIds.filter((classId) => classId !== id);
      }
      data.homeworks = data.homeworks.filter((row) => row.classId !== id);
      data.attendance = data.attendance.filter((row) => row.classId !== id);
      data.feeTypes = data.feeTypes.map((fee) => (fee.classId === id ? { ...fee, classId: undefined } : fee));
      return "/admin/classes?ok=1";
    }

    const name = formText(form, "name");
    const establishmentId = formText(form, "establishmentId");
    const schoolYearId = formText(form, "schoolYearId") || data.currentSchoolYearId;
    const room = formText(form, "room");
    const est = findEstablishment(establishmentId, data);
    if (!name || !est || !schoolYearId) throw new Error("missing");
    const cycle = asCycle(formText(form, "cycle") || est.cycle);
    if (!data.schoolYears.some((row) => row.id === schoolYearId)) throw new Error("missing");
    const campus = campusFromEstablishment(est);

    const id = formText(form, "id") || newId("cls");
    const existing = data.classes.find((row) => row.id === id);
    if (existing) {
      existing.name = name;
      existing.cycle = cycle;
      existing.campus = campus;
      existing.establishmentId = est.id;
      existing.schoolYearId = schoolYearId;
      existing.room = room || undefined;
    } else {
      data.classes.push({
        id,
        name,
        cycle,
        campus,
        establishmentId: est.id,
        schoolYearId,
        room: room || undefined,
      });
    }
    return "/admin/classes?ok=1";
  });
}
