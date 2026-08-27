import { NextResponse } from "next/server";
import { getTeacherSession } from "@/lib/auth";
import { formText, withTeacherMutate } from "@/lib/admin-api";
import { todayISO } from "@/lib/school-life";
import { isTeacherControlEnabled, validateLessonInPlace } from "@/lib/teacher-control";

export async function POST(request: Request) {
  const session = await getTeacherSession();
  if (!session) {
    return NextResponse.redirect(new URL("/espace-enseignants/connexion", request.url), 303);
  }
  return withTeacherMutate(request, "/espace-enseignants/cours", (data, form, teacherId) => {
    if (!isTeacherControlEnabled(data)) throw new Error("forbidden");
    validateLessonInPlace(data, {
      teacherId,
      slotId: formText(form, "slotId"),
      date: formText(form, "date") || todayISO(),
      chapter: formText(form, "chapter"),
      content: formText(form, "content"),
    });
    return "/espace-enseignants/cours?ok=1";
  });
}
