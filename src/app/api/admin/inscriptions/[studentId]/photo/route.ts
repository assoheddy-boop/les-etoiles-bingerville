import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { mimeFromStudentPhoto, readStudentPhoto } from "@/lib/student-photos";
import { readSchoolLife } from "@/lib/school-life";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ studentId: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.redirect(new URL("/admin/connexion", request.url));
  }
  const { studentId } = await context.params;
  const data = await readSchoolLife();
  const student = data.students.find((row) => row.id === studentId);
  if (!student?.photo || student.photo.startsWith("/")) {
    return NextResponse.json({ error: "Photo introuvable." }, { status: 404 });
  }
  const bytes = await readStudentPhoto(student.photo);
  if (!bytes) return NextResponse.json({ error: "Fichier absent." }, { status: 404 });
  return new NextResponse(bytes as BodyInit, {
    headers: {
      "Content-Type": mimeFromStudentPhoto(student.photo),
      "Cache-Control": "private, max-age=3600",
    },
  });
}
