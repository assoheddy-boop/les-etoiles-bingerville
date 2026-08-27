import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { formText, withAdminMutate } from "@/lib/admin-api";
import { collectCaisse } from "@/lib/accounting";
import { buildJournalPdf, journalDownloadName } from "@/lib/caisse-pdf";
import { contentDisposition } from "@/lib/homework-files";
import { currentMonth, readSchoolLife } from "@/lib/school-life";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return withAdminMutate(request, "/admin/caisse", (data, form) => {
    const { tx } = collectCaisse(data, {
      invoiceId: formText(form, "invoiceId"),
      accountId: formText(form, "accountId"),
    });
    return `/admin/caisse?ok=1&ticket=${tx.id}`;
  });
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.redirect(new URL("/admin/connexion", request.url));
  const url = new URL(request.url);
  if (url.searchParams.get("journal") !== "1") {
    return NextResponse.redirect(new URL("/admin/compta", request.url));
  }
  const month = url.searchParams.get("month") || currentMonth();
  const data = await readSchoolLife();
  const bytes = await buildJournalPdf({ month, data });
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": contentDisposition(journalDownloadName(month)),
      "Cache-Control": "private, no-store",
    },
  });
}
