import { NextResponse } from "next/server";
import { getAdminSession, getParentSession, getTeacherSession } from "@/lib/auth";
import { notifyTeacherToParentMessage } from "@/lib/email-notify";
import { parentPortalAllowed } from "@/lib/module-control";
import {
  actorFromSession,
  addMessage,
  canMessage,
  readSchoolLife,
} from "@/lib/school-life";

export async function POST(request: Request) {
  const [parent, teacher, admin] = await Promise.all([
    getParentSession(),
    getTeacherSession(),
    getAdminSession(),
  ]);
  const session = parent ?? teacher ?? admin;
  if (!session) {
    return NextResponse.redirect(new URL("/connexion", request.url), 303);
  }
  const form = await request.formData();
  const partnerId = String(form.get("partnerId") || "");
  const content = String(form.get("content") || "").trim();
  const next = String(form.get("next") || "/");
  const safeNext = next.startsWith("/") ? next : "/";
  const data = await readSchoolLife();
  if (parent && !parentPortalAllowed(data, parent.studentId)) {
    return NextResponse.json({ error: "Module parents désactivé" }, { status: 403 });
  }
  const actor = actorFromSession(session, data);
  if (!content || !canMessage(actor, partnerId, data)) {
    const err = new URL(safeNext, request.url);
    err.searchParams.set("error", "1");
    return NextResponse.redirect(err, 303);
  }
  const message = {
    id: crypto.randomUUID(),
    senderId: actor.id,
    receiverId: partnerId,
    studentId: session.role === "parent" ? session.studentId : String(form.get("studentId") || "") || undefined,
    content,
    createdAt: new Date().toISOString(),
  };
  await addMessage(message);
  if (actor.role === "teacher" || actor.role === "school") {
    try {
      await notifyTeacherToParentMessage(await readSchoolLife(), message);
    } catch (error) {
      console.error("[email] notify after persist failed", error);
    }
  }
  const ok = new URL(safeNext, request.url);
  ok.searchParams.set("ok", "1");
  return NextResponse.redirect(ok, 303);
}
