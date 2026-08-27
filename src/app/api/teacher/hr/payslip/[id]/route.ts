import { NextResponse } from "next/server";
import { getTeacherSession } from "@/lib/auth";
import { contentDisposition } from "@/lib/homework-files";
import { staffForTeacher } from "@/lib/hr";
import { buildPayslipPdf, payslipDownloadName } from "@/lib/payslip-pdf";
import { readSchoolLife } from "@/lib/school-life";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getTeacherSession();
  if (!session) return NextResponse.redirect(new URL("/espace-enseignants/connexion", request.url));
  const { id } = await context.params;
  const data = await readSchoolLife();
  const profile = staffForTeacher(session.teacherId, data);
  const payslip = data.payslips.find((row) => row.id === id && row.staffId === profile?.id);
  if (!payslip || !profile) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const bytes = await buildPayslipPdf({ payslip, profile, data });
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": contentDisposition(payslipDownloadName(profile, payslip)),
      "Cache-Control": "private, no-store",
    },
  });
}
