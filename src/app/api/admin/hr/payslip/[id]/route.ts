import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { contentDisposition } from "@/lib/homework-files";
import { staffById } from "@/lib/hr";
import { buildPayslipPdf, payslipDownloadName } from "@/lib/payslip-pdf";
import { readSchoolLife } from "@/lib/school-life";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.redirect(new URL("/admin/connexion", request.url));
  const { id } = await context.params;
  const data = await readSchoolLife();
  const payslip = data.payslips.find((row) => row.id === id);
  const profile = payslip ? staffById(payslip.staffId, data) : undefined;
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
