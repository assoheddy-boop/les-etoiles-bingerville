import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { buildCertificatScolaritePdf } from "@/lib/enrollment-pdf";
import { contentDisposition } from "@/lib/homework-files";
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
  if (!student) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const result = await buildCertificatScolaritePdf({ student, data });
  return new NextResponse(Buffer.from(result.bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": contentDisposition(result.filename),
      "Cache-Control": "private, no-store",
    },
  });
}
