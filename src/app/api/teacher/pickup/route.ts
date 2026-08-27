import { formText, withTeacherMutate } from "@/lib/admin-api";
import { notifyPickupCodesCreated } from "@/lib/email-notify";
import {
  ensureTodayPickup,
  studentFullName,
  teacherActorId,
  teacherClasses,
  teacherStudents,
  todayPickup,
  validatePickupCode,
} from "@/lib/school-life";
import type { PickupAuthorization, RosterStudent, SchoolLifeData } from "@/lib/school-life-types";

function generatePickup(
  data: SchoolLifeData,
  student: RosterStudent,
  createdBy: string,
  created: PickupAuthorization[],
  person?: string,
  phone?: string,
) {
  const before = todayPickup(student.id, data);
  const auth = ensureTodayPickup(data, student, createdBy, person, phone);
  if (!before || before.usedAt) created.push(auth);
}

export async function POST(request: Request) {
  return withTeacherMutate(request, "/espace-enseignants/sortie", (data, form, teacherId) => {
    const action = formText(form, "action") || "create";
    const actor = teacherActorId(teacherId);
    if (action === "validate") {
      const result = validatePickupCode(data, formText(form, "code"), actor);
      const name = result.student ? studentFullName(result.student) : "élève";
      return `/espace-enseignants/sortie?ok=${encodeURIComponent(`Sortie validée : ${name}`)}`;
    }
    const created: PickupAuthorization[] = [];
    const allowed = new Set(teacherStudents(teacherId, data).map((row) => row.id));
    if (action === "generate-class") {
      const classId = formText(form, "classId");
      if (!teacherClasses(teacherId, data).some((item) => item.id === classId)) throw new Error("missing");
      for (const student of data.students.filter((row) => row.classId === classId)) {
        generatePickup(data, student, actor, created);
      }
      return {
        path: "/espace-enseignants/sortie?ok=1",
        afterWrite: () => notifyPickupCodesCreated(data, created),
      };
    }
    const student = data.students.find((row) => row.id === formText(form, "studentId"));
    if (!student || !allowed.has(student.id)) throw new Error("missing");
    generatePickup(
      data,
      student,
      actor,
      created,
      formText(form, "authorizedPerson") || undefined,
      formText(form, "authorizedPhone") || undefined,
    );
    return {
      path: "/espace-enseignants/sortie?ok=1",
      afterWrite: () => notifyPickupCodesCreated(data, created),
    };
  });
}
