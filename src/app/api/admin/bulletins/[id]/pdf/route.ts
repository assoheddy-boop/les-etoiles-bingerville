import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { bulletinDownloadName, buildBulletinPdf } from "@/lib/bulletin-pdf";
import { contentDisposition } from "@/lib/homework-files";
import { currentYear, gradesForStudent, parentChildView, readSchoolLife } from "@/lib/school-life";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.redirect(new URL("/admin/connexion", request.url));
  const { id } = await context.params;
  const data = await readSchoolLife();
  const bulletin = data.bulletins.find((row) => row.id === id);
  const child = bulletin ? parentChildView(bulletin.studentId, data) : null;
  const student = bulletin ? data.students.find((row) => row.id === bulletin.studentId) : undefined;
  if (!bulletin || !child || !student) return NextResponse.json({ error: "not_found" }, { status: 404 });
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
