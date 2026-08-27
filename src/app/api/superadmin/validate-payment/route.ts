import { NextResponse } from "next/server";
import { PersistWriteError } from "@/lib/persist";
import { asBool, asString, isJsonRequest, readMixedBody } from "@/lib/request-body";
import { superadminOnly } from "@/lib/auth";
import { notifyCashPaymentValidated, notifyParentModuleActivated } from "@/lib/email-notify";
import { isParentModuleActive } from "@/lib/module-control";
import { validateCashPayment } from "@/lib/cash-payments";
import { readSchoolLife, writeSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await superadminOnly();
  if (!session) {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }
  const body = await readMixedBody(request);
  const paymentId = asString(body.paymentId);
  const activateParentModule = asBool(body.activateParentModule);
  if (!paymentId) {
    return NextResponse.json({ error: "paymentId requis" }, { status: 400 });
  }
  try {
    const data = await readSchoolLife();
    const pending = data.cashPayments?.find((row) => row.id === paymentId);
    const wasPending = pending?.status === "pending";
    const parent = pending ? data.parents.find((row) => row.id === pending.parentId) : undefined;
    const moduleWasOff = parent ? !isParentModuleActive(parent) : false;
    const payment = validateCashPayment(data, {
      paymentId,
      validatedBy: session.email,
      activateParentModule,
    });
    await writeSchoolLife(data);
    try {
      if (wasPending) {
        await notifyCashPaymentValidated(data, {
          paymentId: payment.id,
          parentId: payment.parentId,
          amount: payment.amount,
          date: payment.date,
          studentId: payment.studentId,
        });
      }
      if (activateParentModule && moduleWasOff && parent) {
        await notifyParentModuleActivated(parent);
      }
    } catch (error) {
      console.error("[email] notify after persist failed", error);
    }
    if (isJsonRequest(request)) {
      return NextResponse.json({ ok: true, payment });
    }
    return NextResponse.redirect(new URL("/super-admin/parents-finances?ok=1", request.url), 303);
  } catch (error) {
    if (error instanceof PersistWriteError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    const code = error instanceof Error ? error.message : "error";
    if (isJsonRequest(request)) {
      return NextResponse.json({ error: code }, { status: 400 });
    }
    return NextResponse.redirect(new URL("/super-admin/parents-finances?error=" + code, request.url), 303);
  }
}
