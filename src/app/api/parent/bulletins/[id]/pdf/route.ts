import { NextResponse } from "next/server";
import { getParentSession } from "@/lib/auth";
import { buildBulletinPdf, bulletinDownloadName } from "@/lib/bulletin-pdf";
import { contentDisposition } from "@/lib/homework-files";
import { parentPortalAllowed } from "@/lib/module-control";
import { currentYear, gradesForStudent, parentChildView, readSchoolLife } from "@/lib/school-life";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getParentSession();
  if (!session) {
    return NextResponse.redirect(new URL("/connexion", _request.url));
  }
  const data = await readSchoolLife();
  if (!parentPortalAllowed(data, session.studentId)) {
    return NextResponse.json({ error: "Module parents désactivé" }, { status: 403 });
  }
  const { id } = await context.params;
  const child = parentChildView(session.studentId, data);
  const bulletin = data.bulletins.find((row) => row.id === id && row.studentId === session.studentId);
  if (!child || !bulletin) {
    return NextResponse.json({ error: "Bulletin introuvable." }, { status: 404 });
  }
  const grades = gradesForStudent(child.id, data).filter((grade) => grade.period === bulletin.period);
  const bytes = await buildBulletinPdf({ bulletin, child, grades, data });
  const student = data.students.find((row) => row.id === child.id);
  const klass = data.classes.find((row) => row.id === child.classId);
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
