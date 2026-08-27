import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { saveExistingEnrollment } from "@/lib/enrollment";
import { formText } from "@/lib/admin-api";
import { readSchoolLife, writeSchoolLife } from "@/lib/school-life";
import { saveStudentPhoto } from "@/lib/student-photos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ studentId: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.redirect(new URL("/admin/connexion", request.url), 303);
  }
  const { studentId } = await context.params;
  const form = await request.formData();
  const data = await readSchoolLife();
  try {
    const result = saveExistingEnrollment(data, studentId, form);
    if (!result.ok) {
      return NextResponse.redirect(
        new URL(`/admin/inscriptions/${studentId}?error=${result.error}`, request.url),
        303,
      );
    }
    const student = data.students.find((row) => row.id === studentId);
    if (student) {
      if (formText(form, "removePhoto") === "on") student.photo = undefined;
      const file = form.get("photo");
      if (file instanceof File && file.size > 0) {
        const stored = await saveStudentPhoto(student.id, file);
        if (stored) student.photo = stored;
      }
    }
    await writeSchoolLife(data);
    return NextResponse.redirect(new URL(`/admin/inscriptions/${studentId}?ok=1`, request.url), 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "error";
    return NextResponse.redirect(new URL(`/admin/inscriptions/${studentId}?error=${message}`, request.url), 303);
  }
}
