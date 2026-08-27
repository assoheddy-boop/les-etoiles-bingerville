import { formList, formText, withAdminMutate } from "@/lib/admin-api";
import { hashPassword } from "@/lib/password";
import { newId, nextMatricule, syncParentLink } from "@/lib/school-life";

export async function POST(request: Request) {
  return withAdminMutate(request, "/admin/parents", async (data, form) => {
    const action = formText(form, "action") || "create";
    if (action === "delete") {
      const id = formText(form, "id");
      for (const student of data.students) {
        if (student.parentId === id) syncParentLink(data, student, undefined);
      }
      data.parents = data.parents.filter((row) => row.id !== id);
      return "/admin/parents?ok=1";
    }

    const displayName = formText(form, "displayName");
    const password = formText(form, "password");
    const email = formText(form, "email");
    const phone = formText(form, "phone");
    const studentIds = formList(form, "studentIds").filter((id) => data.students.some((row) => row.id === id));
    if (!displayName) throw new Error("missing");

    const id = formText(form, "id") || newId("par");
    const existing = data.parents.find((row) => row.id === id);
    if (existing) {
      existing.displayName = displayName;
      existing.email = email || undefined;
      existing.phone = phone || undefined;
      if (password) existing.password = await hashPassword(password);
    } else {
      if (!password) throw new Error("missing");
      data.parents.push({
        id,
        displayName,
        password: await hashPassword(password),
        email: email || undefined,
        phone: phone || undefined,
        studentIds: [],
        moduleParentsActive: false,
      });
    }

    const parent = data.parents.find((row) => row.id === id)!;
    for (const student of data.students) {
      if (student.parentId === id && !studentIds.includes(student.id)) {
        syncParentLink(data, student, undefined);
      }
    }
    for (const studentId of studentIds) {
      const student = data.students.find((row) => row.id === studentId);
      if (!student) continue;
      syncParentLink(data, student, parent.id);
      if (!student.matricule) student.matricule = nextMatricule(data);
    }
    return "/admin/parents?ok=1";
  });
}
