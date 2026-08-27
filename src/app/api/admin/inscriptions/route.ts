import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readInbox, writeInbox } from "@/lib/cms";
import { saveNewEnrollment } from "@/lib/enrollment";
import { formText } from "@/lib/admin-api";
import { PersistWriteError } from "@/lib/persist";
import { readSchoolLife, writeSchoolLife } from "@/lib/school-life";
import { saveStudentPhoto } from "@/lib/student-photos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.redirect(new URL("/admin/connexion", request.url), 303);
  }
  const form = await request.formData();
  const data = await readSchoolLife();
  try {
    const result = saveNewEnrollment(data, form);
    if (!result.ok) {
      return NextResponse.redirect(
        new URL(`/admin/inscriptions/nouvelle?error=${result.error}`, request.url),
        303,
      );
    }
    const student = data.students.find((row) => row.id === result.studentId);
    const file = form.get("photo");
    if (student && file instanceof File && file.size > 0) {
      const stored = await saveStudentPhoto(student.id, file);
      if (stored) student.photo = stored;
    }
    const inboxId = formText(form, "inboxId");
    if (inboxId) {
      const inbox = await readInbox();
      const item = inbox.find((row) => row.id === inboxId);
      if (item) {
        item.convertedStudentId = result.studentId;
        await writeInbox(inbox);
      }
    }
    await writeSchoolLife(data);
    return NextResponse.redirect(
      new URL(`/admin/inscriptions/${result.studentId}?ok=1`, request.url),
      303,
    );
  } catch (error) {
    const message = error instanceof PersistWriteError ? "persist" : error instanceof Error ? error.message : "error";
    return NextResponse.redirect(new URL(`/admin/inscriptions/nouvelle?error=${message}`, request.url), 303);
  }
}
