import { formText, withStaffMutate } from "@/lib/admin-api";
import { classLabel, studentFullName, validatePickupCode } from "@/lib/school-life";

export async function POST(request: Request) {
  return withStaffMutate(request, "/espace-vigile", (data, form, actorId) => {
    const result = validatePickupCode(data, formText(form, "code"), actorId);
    const name = result.student ? studentFullName(result.student) : "élève";
    const classroom = result.student ? classLabel(result.student.classId, data) : "";
    const person = result.auth.authorizedPerson;
    const detail = classroom ? `${name} · ${classroom} — ${person}` : `${name} — ${person}`;
    return `/espace-vigile?ok=${encodeURIComponent(detail)}`;
  });
}
