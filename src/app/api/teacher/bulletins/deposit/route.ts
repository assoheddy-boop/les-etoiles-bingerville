import { getTeacherSession } from "@/lib/auth";
import { formText, withTeacherMutate } from "@/lib/admin-api";
import { NextResponse } from "next/server";
import { depositBulletinsInPlace, isTeacherControlEnabled } from "@/lib/teacher-control";

export async function POST(request: Request) {
  const session = await getTeacherSession();
  if (!session) {
    return NextResponse.redirect(new URL("/espace-enseignants/connexion", request.url), 303);
  }
  return withTeacherMutate(request, "/espace-enseignants/bulletins", (data, form, teacherId) => {
    if (!isTeacherControlEnabled(data)) throw new Error("forbidden");
    depositBulletinsInPlace(data, {
      teacherId,
      classId: formText(form, "classId"),
      period: formText(form, "period"),
    });
    return "/espace-enseignants/bulletins?ok=1";
  });
}
