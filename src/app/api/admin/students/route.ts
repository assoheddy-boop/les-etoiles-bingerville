import { formText, withAdminMutate } from "@/lib/admin-api";
import {
  generateInvoicesForStudent,
  newId,
  nextMatricule,
  syncParentLink,
} from "@/lib/school-life";

export async function POST(request: Request) {
  return withAdminMutate(request, "/admin/eleves", (data, form) => {
    const action = formText(form, "action") || "create";
    if (action === "delete") {
      const id = formText(form, "id");
      const student = data.students.find((row) => row.id === id);
      if (!student) throw new Error("missing");
      syncParentLink(data, student, undefined);
      data.students = data.students.filter((row) => row.id !== id);
      data.invoices = data.invoices.filter((row) => row.studentId !== id);
      data.enrollments = data.enrollments.filter((row) => row.studentId !== id);
      data.grades = data.grades.filter((row) => row.studentId !== id);
      data.bulletins = data.bulletins.filter((row) => row.studentId !== id);
      for (const session of data.attendance) {
        session.entries = session.entries.filter((entry) => entry.studentId !== id);
      }
      return "/admin/eleves?ok=1";
    }

    const firstName = formText(form, "firstName");
    const lastName = formText(form, "lastName");
    const classId = formText(form, "classId");
    const parentId = formText(form, "parentId") || undefined;
    const birthDate = formText(form, "birthDate");
    let matricule = formText(form, "matricule") || undefined;
    if (!firstName || !lastName || !classId) throw new Error("missing");
    if (!data.classes.some((row) => row.id === classId)) throw new Error("missing");
    if (parentId && !data.parents.some((row) => row.id === parentId)) throw new Error("missing");

    const id = formText(form, "id") || newId("stu");
    if (matricule) {
      const clash = data.students.find(
        (row) => row.matricule?.toLowerCase() === matricule!.toLowerCase() && row.id !== id,
      );
      if (clash) throw new Error("duplicate");
    }

    const existing = data.students.find((row) => row.id === id);
    if (existing) {
      existing.firstName = firstName;
      existing.lastName = lastName;
      existing.classId = classId;
      existing.birthDate = birthDate || undefined;
      if (parentId && !matricule && !existing.matricule) matricule = nextMatricule(data);
      if (matricule) existing.matricule = matricule;
      syncParentLink(data, existing, parentId);
      data.invoices.push(...generateInvoicesForStudent(existing, data));
    } else {
      if (parentId && !matricule) matricule = nextMatricule(data);
      const student = {
        id,
        firstName,
        lastName,
        classId,
        matricule,
        birthDate: birthDate || undefined,
      };
      data.students.push(student);
      syncParentLink(data, student, parentId);
      data.invoices.push(...generateInvoicesForStudent(student, data));
    }
    return "/admin/eleves?ok=1";
  });
}
