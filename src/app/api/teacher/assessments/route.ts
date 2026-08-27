import { NextResponse } from "next/server";
import { getTeacherSession } from "@/lib/auth";
import { formText, withTeacherMutate } from "@/lib/admin-api";
import { saveHomeworkAttachment } from "@/lib/homework-files";
import { newId } from "@/lib/school-life";
import {
  isAssessmentKind,
  isTeacherControlEnabled,
  markAssessmentDone,
  upsertAssessmentInPlace,
} from "@/lib/teacher-control";

export async function POST(request: Request) {
  const session = await getTeacherSession();
  if (!session) {
    return NextResponse.redirect(new URL("/espace-enseignants/connexion", request.url), 303);
  }
  return withTeacherMutate(request, "/espace-enseignants/controles", async (data, form, teacherId) => {
    if (!isTeacherControlEnabled(data)) throw new Error("forbidden");
    const action = formText(form, "action") || "create";
    if (action === "done") {
      markAssessmentDone(data, formText(form, "id"), teacherId);
      return "/espace-enseignants/controles?ok=1";
    }
    const kind = formText(form, "kind");
    if (!isAssessmentKind(kind)) throw new Error("data");
    const id = newId("asm");
    const file = form.get("attachment");
    let attachment: string | undefined;
    let attachmentName: string | undefined;
    if (file instanceof File && file.size > 0) {
      const saved = await saveHomeworkAttachment(id, file);
      if (saved) {
        attachment = saved.storedName;
        attachmentName = saved.originalName;
      }
    }
    upsertAssessmentInPlace(data, {
      id,
      teacherId,
      classId: formText(form, "classId"),
      subjectId: formText(form, "subjectId"),
      kind,
      date: formText(form, "date"),
      topic: formText(form, "topic"),
      attachment,
      attachmentName,
      markDone: form.get("markDone") === "1",
    });
    return "/espace-enseignants/controles?ok=1";
  });
}
