import { NextResponse } from "next/server";
import { appendActivityLog } from "@/lib/activity-log";
import { PersistWriteError } from "@/lib/persist";
import { setModuleOverride } from "@/lib/module-control";
import { asBool, asString, isJsonRequest, readMixedBody } from "@/lib/request-body";
import { superadminOnly } from "@/lib/auth";
import { readSchoolLife, writeSchoolLife } from "@/lib/school-life";
import type { ModuleScope } from "@/lib/school-life-types";

export const dynamic = "force-dynamic";

function isScope(value: string): value is ModuleScope {
  return value === "global" || value === "role" || value === "establishment" || value === "user";
}

export async function POST(request: Request) {
  const session = await superadminOnly();
  if (!session) {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }
  const body = await readMixedBody(request);
  const moduleId = asString(body.moduleId);
  const scopeRaw = asString(body.scope) || "global";
  const scopeId = asString(body.scopeId) || undefined;
  const enabled = asBool(body.enabled);
  if (!moduleId || !isScope(scopeRaw)) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  try {
    const data = await readSchoolLife();
    setModuleOverride(data, {
      moduleId,
      scope: scopeRaw,
      scopeId,
      enabled,
      by: session.email,
    });
    appendActivityLog(data, {
      actorId: `superadmin:${session.email}`,
      actorRole: "superadmin",
      action: "module_toggle",
      payload: { moduleId, scope: scopeRaw, scopeId: scopeId || null, enabled },
    });
    await writeSchoolLife(data);
  } catch (error) {
    if (error instanceof PersistWriteError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    const code = error instanceof Error ? error.message : "error";
    if (isJsonRequest(request)) {
      return NextResponse.json({ error: code }, { status: 400 });
    }
    const url = new URL("/super-admin/modules", request.url);
    url.searchParams.set("error", code);
    return NextResponse.redirect(url, 303);
  }
  if (isJsonRequest(request)) {
    return NextResponse.json({ ok: true, moduleId, enabled });
  }
  const next = new URL("/super-admin/modules", request.url);
  next.searchParams.set("ok", "1");
  const scopeQs = asString(body.filterScope);
  const scopeIdQs = asString(body.filterScopeId);
  if (scopeQs) next.searchParams.set("scope", scopeQs);
  if (scopeIdQs) next.searchParams.set("scopeId", scopeIdQs);
  return NextResponse.redirect(next, 303);
}
