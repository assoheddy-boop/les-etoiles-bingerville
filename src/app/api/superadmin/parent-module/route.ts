import { NextResponse } from "next/server";
import { PersistWriteError } from "@/lib/persist";
import { asBool, asString, isJsonRequest, readMixedBody } from "@/lib/request-body";
import { superadminOnly } from "@/lib/auth";
import { notifyParentModuleActivated } from "@/lib/email-notify";
import { isParentModuleActive } from "@/lib/module-control";
import { setParentModule } from "@/lib/cash-payments";
import { readSchoolLife, writeSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await superadminOnly();
  if (!session) {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }
  const body = await readMixedBody(request);
  const parentId = asString(body.parentId);
  const enabled = asBool(body.enabled);
  if (!parentId) {
    return NextResponse.json({ error: "parentId requis" }, { status: 400 });
  }
  try {
    const data = await readSchoolLife();
    const previous = data.parents.find((row) => row.id === parentId);
    const wasActive = isParentModuleActive(previous);
    const parent = setParentModule(data, parentId, enabled);
    await writeSchoolLife(data);
    try {
      if (enabled && !wasActive) {
        await notifyParentModuleActivated(parent);
      }
    } catch (error) {
      console.error("[email] notify after persist failed", error);
    }
    if (isJsonRequest(request)) {
      return NextResponse.json({ ok: true, parentId: parent.id, enabled: parent.moduleParentsActive });
    }
    return NextResponse.redirect(new URL("/super-admin/parents-modules?ok=1", request.url), 303);
  } catch (error) {
    if (error instanceof PersistWriteError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    const code = error instanceof Error ? error.message : "error";
    if (isJsonRequest(request)) {
      return NextResponse.json({ error: code }, { status: 400 });
    }
    return NextResponse.redirect(new URL("/super-admin/parents-modules?error=" + code, request.url), 303);
  }
}
