import { NextResponse } from "next/server";
import { getAdminSession, getSuperAdminSession, staffRoleOf } from "@/lib/auth";
import { recordCashPayment } from "@/lib/cash-payments";
import { PersistWriteError } from "@/lib/persist";
import { asNumber, asString, isJsonRequest, readMixedBody } from "@/lib/request-body";
import { readSchoolLife, writeSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

function canRecordCash() {
  return Promise.all([getSuperAdminSession(), getAdminSession()]).then(([superadmin, admin]) => {
    if (superadmin) return { ok: true as const, recordedBy: superadmin.email };
    if (!admin) return { ok: false as const };
    const role = staffRoleOf(admin);
    if (role === "fondateur" || role === "directeur" || role === "vie_scolaire") {
      return { ok: true as const, recordedBy: `${role}:${admin.displayName}` };
    }
    return { ok: false as const };
  });
}

export async function POST(request: Request) {
  const auth = await canRecordCash();
  if (!auth.ok) {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }
  const body = await readMixedBody(request);
  const parentId = asString(body.parentId);
  const studentId = asString(body.studentId) || undefined;
  const invoiceId = asString(body.invoiceId) || undefined;
  const amount = asNumber(body.amount);
  if (!parentId) {
    return NextResponse.json({ error: "parentId requis" }, { status: 400 });
  }
  try {
    const data = await readSchoolLife();
    const payment = recordCashPayment(data, {
      parentId,
      studentId,
      invoiceId,
      amount,
      recordedBy: auth.recordedBy,
    });
    await writeSchoolLife(data);
    if (isJsonRequest(request)) {
      return NextResponse.json({ ok: true, payment });
    }
    const next = asString(body.next) || "/super-admin/parents-finances";
    const url = new URL(next.startsWith("/") ? next : "/super-admin/parents-finances", request.url);
    url.searchParams.set("ok", "1");
    return NextResponse.redirect(url, 303);
  } catch (error) {
    if (error instanceof PersistWriteError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    const code = error instanceof Error ? error.message : "error";
    if (isJsonRequest(request)) {
      return NextResponse.json({ error: code }, { status: 400 });
    }
    return NextResponse.redirect(new URL("/admin/caisse?error=" + code, request.url), 303);
  }
}
