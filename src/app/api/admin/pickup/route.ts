import { formText, withAdminMutate } from "@/lib/admin-api";
import { notifyPickupCodesCreated } from "@/lib/email-notify";
import {
  ensureTodayPickup,
  studentFullName,
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
  return withAdminMutate(request, "/admin/sortie", (data, form) => {
    const action = formText(form, "action") || "create";
    if (action === "validate") {
      const result = validatePickupCode(data, formText(form, "code"), "school:secretariat");
      const name = result.student ? studentFullName(result.student) : "élève";
      return `/admin/sortie?ok=${encodeURIComponent(`Sortie validée : ${name}`)}`;
    }
    const created: PickupAuthorization[] = [];
    if (action === "generate-class") {
      const classId = formText(form, "classId");
      const students = data.students.filter((row) => row.classId === classId);
      for (const student of students) {
        generatePickup(data, student, "school:secretariat", created);
      }
      return {
        path: "/admin/sortie?ok=1",
        afterWrite: () => notifyPickupCodesCreated(data, created),
      };
    }
    const student = data.students.find((row) => row.id === formText(form, "studentId"));
    if (!student) throw new Error("missing");
    generatePickup(
      data,
      student,
      "school:secretariat",
      created,
      formText(form, "authorizedPerson") || undefined,
      formText(form, "authorizedPhone") || undefined,
    );
    return {
      path: "/admin/sortie?ok=1",
      afterWrite: () => notifyPickupCodesCreated(data, created),
    };
  });
}
