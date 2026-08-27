import { NextResponse } from "next/server";
import { getTeacherSession } from "@/lib/auth";
import { contentDisposition, mimeFromFilename, readHomeworkAttachment } from "@/lib/homework-files";
import { readSchoolLife, teacherClasses } from "@/lib/school-life";
import { isTeacherControlEnabled } from "@/lib/teacher-control";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getTeacherSession();
  if (!session) {
    return NextResponse.redirect(new URL("/espace-enseignants/connexion", _request.url));
  }
  const data = await readSchoolLife();
  if (!isTeacherControlEnabled(data)) {
    return NextResponse.json({ error: "Module désactivé" }, { status: 403 });
  }
  const { id } = await context.params;
  const classIds = new Set(teacherClasses(session.teacherId, data).map((item) => item.id));
  const assessment = data.assessments.find((row) => row.id === id && classIds.has(row.classId));
  if (!assessment?.attachment) {
    return NextResponse.json({ error: "Pièce jointe introuvable." }, { status: 404 });
  }
  const bytes = await readHomeworkAttachment(assessment.attachment);
  if (!bytes) {
    return NextResponse.json({ error: "Fichier absent du serveur." }, { status: 404 });
  }
  const filename = assessment.attachmentName || assessment.attachment;
  return new NextResponse(bytes as BodyInit, {
    headers: {
      "Content-Type": mimeFromFilename(filename),
      "Content-Disposition": contentDisposition(filename),
      "Cache-Control": "private, no-store",
    },
  });
}
