import { formText, withParentMutate } from "@/lib/admin-api";
import { claimLostItem, parentOfStudent } from "@/lib/school-life";

export async function POST(request: Request) {
  return withParentMutate(request, "/espace-parents/objets-perdus", (data, form, studentId) => {
    const student = data.students.find((row) => row.id === studentId);
    const parent = student ? parentOfStudent(student, data) : undefined;
    if (!parent) throw new Error("missing");
    claimLostItem(data, formText(form, "id"), parent.id);
    return "/espace-parents/objets-perdus?ok=1";
  });
}
