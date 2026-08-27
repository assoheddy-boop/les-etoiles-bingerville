import { isModuleEnabled, parentPortalAllowed } from "./module-control";
import { NextResponse } from "next/server";
import { getAdminSession, getParentSession, getTeacherSession, getVigileSession } from "./auth";
import { PersistWriteError } from "./persist";
import { readSchoolLife, teacherActorId, writeSchoolLife } from "./school-life";
import type { SchoolLifeData } from "./school-life-types";

export type MutateResult = string | { path: string; afterWrite?: () => void | Promise<void> };

type Mutator = (data: SchoolLifeData, form: FormData) => MutateResult | Promise<MutateResult>;

async function runMutate(
  request: Request,
  fallback: string,
  loginPath: string,
  authorized: boolean,
  mutator: Mutator,
) {
  if (!authorized) {
    return NextResponse.redirect(new URL(loginPath, request.url), 303);
  }
  const form = await request.formData();
  const data = await readSchoolLife();
  try {
    const result = await mutator(data, form);
    const nextPath = typeof result === "string" ? result : result.path;
    await writeSchoolLife(data);
    if (typeof result !== "string" && result.afterWrite) {
      try {
        await result.afterWrite();
      } catch (error) {
        console.error("[email] afterWrite failed", error);
      }
    }
    return NextResponse.redirect(new URL(nextPath, request.url), 303);
  } catch (error) {
    const message = error instanceof PersistWriteError ? "persist" : error instanceof Error ? error.message : "error";
    const url = new URL(fallback, request.url);
    url.searchParams.set("error", message);
    return NextResponse.redirect(url, 303);
  }
}

export async function withAdminMutate(
  request: Request,
  fallback: string,
  mutator: Mutator,
) {
  const session = await getAdminSession();
  return runMutate(request, fallback, "/admin/connexion", Boolean(session), mutator);
}

export async function withTeacherMutate(
  request: Request,
  fallback: string,
  mutator: (data: SchoolLifeData, form: FormData, teacherId: string) => MutateResult | Promise<MutateResult>,
) {
  const session = await getTeacherSession();
  if (!session) {
    return NextResponse.redirect(new URL("/espace-enseignants/connexion", request.url), 303);
  }
  const snapshot = await readSchoolLife();
  if (!isModuleEnabled(snapshot, "enseignants", { role: "teacher", userId: session.teacherId })) {
    return NextResponse.json({ error: "Module enseignants désactivé" }, { status: 403 });
  }
  return runMutate(request, fallback, "/espace-enseignants/connexion", true, (data, form) =>
    mutator(data, form, session.teacherId),
  );
}

export async function withParentMutate(
  request: Request,
  fallback: string,
  mutator: (data: SchoolLifeData, form: FormData, studentId: string) => MutateResult | Promise<MutateResult>,
) {
  const session = await getParentSession();
  if (!session) {
    return NextResponse.redirect(new URL("/connexion", request.url), 303);
  }
  const snapshot = await readSchoolLife();
  if (!parentPortalAllowed(snapshot, session.studentId)) {
    return NextResponse.json({ error: "Module parents désactivé" }, { status: 403 });
  }
  return runMutate(request, fallback, "/connexion", true, (data, form) => mutator(data, form, session.studentId));
}

export async function withStaffMutate(
  request: Request,
  fallback: string,
  mutator: (data: SchoolLifeData, form: FormData, actorId: string) => MutateResult | Promise<MutateResult>,
) {
  const [admin, teacher, vigile] = await Promise.all([
    getAdminSession(),
    getTeacherSession(),
    getVigileSession(),
  ]);
  const actorId = vigile
    ? "school:vigile"
    : admin
      ? "school:secretariat"
      : teacher
        ? teacherActorId(teacher.teacherId)
        : "";
  if (!actorId) {
    return NextResponse.redirect(new URL("/espace-vigile/connexion", request.url), 303);
  }
  return runMutate(request, fallback, "/espace-vigile/connexion", true, (data, form) =>
    mutator(data, form, actorId),
  );
}

export function formText(form: FormData, key: string) {
  return String(form.get(key) || "").trim();
}

export function formInt(form: FormData, key: string) {
  const raw = formText(form, key).replace(/\s/g, "").replace(",", ".");
  const n = Number(raw);
  return Number.isFinite(n) ? Math.round(n) : NaN;
}

export function formList(form: FormData, key: string) {
  return form.getAll(key).map((value) => String(value)).filter(Boolean);
}
