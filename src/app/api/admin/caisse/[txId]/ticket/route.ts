import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { accountById } from "@/lib/accounting";
import { buildCaisseTicketPdf, caisseTicketName } from "@/lib/caisse-pdf";
import { contentDisposition } from "@/lib/homework-files";
import { readSchoolLife } from "@/lib/school-life";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ txId: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.redirect(new URL("/admin/connexion", request.url));
  const { txId } = await context.params;
  const data = await readSchoolLife();
  const tx = data.financeTransactions.find((row) => row.id === txId && row.invoiceId);
  const invoice = tx?.invoiceId ? data.invoices.find((row) => row.id === tx.invoiceId) : undefined;
  const student = invoice ? data.students.find((row) => row.id === invoice.studentId) : undefined;
  const account = tx ? accountById(tx.accountId, data) : undefined;
  if (!tx || !invoice || !student || !account) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const bytes = await buildCaisseTicketPdf({ student, invoice, tx, account, data });
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": contentDisposition(caisseTicketName(student, tx)),
      "Cache-Control": "private, no-store",
    },
  });
}
