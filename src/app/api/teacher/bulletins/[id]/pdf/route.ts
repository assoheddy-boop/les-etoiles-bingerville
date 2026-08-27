import { NextResponse } from "next/server";
import { getTeacherSession } from "@/lib/auth";
import { buildBulletinPdf, bulletinDownloadName } from "@/lib/bulletin-pdf";
import { contentDisposition } from "@/lib/homework-files";
import { currentYear, gradesForStudent, parentChildView, readSchoolLife, teacherClasses } from "@/lib/school-life";
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
  const bulletin = data.bulletins.find((row) => row.id === id);
  const student = bulletin ? data.students.find((row) => row.id === bulletin.studentId) : undefined;
  if (!bulletin || !student || !classIds.has(student.classId)) {
    return NextResponse.json({ error: "Bulletin introuvable." }, { status: 404 });
  }
  const child = parentChildView(student.id, data);
  if (!child) return NextResponse.json({ error: "Bulletin introuvable." }, { status: 404 });
  const grades = gradesForStudent(child.id, data).filter((grade) => grade.period === bulletin.period);
  const bytes = await buildBulletinPdf({ bulletin, child, grades, data });
  const klass = data.classes.find((row) => row.id === student.classId);
  const filename = bulletinDownloadName(child, bulletin, {
    student,
    className: klass?.name,
    yearLabel: currentYear(data)?.label,
  });
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": contentDisposition(filename),
      "Cache-Control": "private, no-store",
    },
  });
}
