import { formList, formText, withAdminMutate } from "@/lib/admin-api";
import { hashPassword } from "@/lib/password";
import { newId } from "@/lib/school-life";

export async function POST(request: Request) {
  return withAdminMutate(request, "/admin/enseignants", async (data, form) => {
    const action = formText(form, "action") || "create";
    if (action === "delete") {
      const id = formText(form, "id");
      if (data.timetableSlots.some((row) => row.teacherId === id)) throw new Error("in-use");
      data.teachers = data.teachers.filter((row) => row.id !== id);
      return "/admin/enseignants?ok=1";
    }

    const email = formText(form, "email").toLowerCase();
    const displayName = formText(form, "displayName");
    const title = formText(form, "title") || "Enseignant";
    const phone = formText(form, "phone");
    const password = formText(form, "password");
    const classIds = formList(form, "classIds").filter((id) => data.classes.some((row) => row.id === id));
    const subjectIds = formList(form, "subjectIds").filter((id) => data.subjects.some((row) => row.id === id));
    if (!email || !displayName) throw new Error("missing");

    const id = formText(form, "id") || newId("tch");
    const duplicate = data.teachers.find((row) => row.email.toLowerCase() === email && row.id !== id);
    if (duplicate) throw new Error("duplicate");

    const existing = data.teachers.find((row) => row.id === id);
    if (existing) {
      existing.email = email;
      existing.displayName = displayName;
      existing.title = title;
      existing.phone = phone || undefined;
      existing.classIds = classIds;
      existing.subjectIds = subjectIds;
      if (password) existing.password = await hashPassword(password);
    } else {
      if (!password) throw new Error("missing");
      data.teachers.push({
        id,
        email,
        password: await hashPassword(password),
        displayName,
        title,
        classIds,
        subjectIds,
        phone: phone || undefined,
      });
    }
    return "/admin/enseignants?ok=1";
  });
}
