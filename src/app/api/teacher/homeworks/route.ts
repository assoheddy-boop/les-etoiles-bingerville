import { NextResponse } from "next/server";
import { getTeacherSession } from "@/lib/auth";
import { notifyHomeworkCreated } from "@/lib/email-notify";
import { saveHomeworkAttachment } from "@/lib/homework-files";
import { addHomework, readSchoolLife, teacherClasses } from "@/lib/school-life";

export async function POST(request: Request) {
  const session = await getTeacherSession();
  if (!session) {
    return NextResponse.redirect(new URL("/espace-enseignants/connexion", request.url), 303);
  }
  const form = await request.formData();
  const classId = String(form.get("classId") || "");
  const title = String(form.get("title") || "").trim();
  const description = String(form.get("description") || "").trim();
  const dueDate = String(form.get("dueDate") || "");
  const data = await readSchoolLife();
  const allowed = teacherClasses(session.teacherId, data).some((item) => item.id === classId);
  if (!allowed || !title || !dueDate) {
    return NextResponse.redirect(new URL("/espace-enseignants/devoirs?error=1", request.url), 303);
  }

  const id = crypto.randomUUID();
  const file = form.get("attachment");
  let attachment: string | undefined;
  let attachmentName: string | undefined;
  if (file instanceof File && file.size > 0) {
    try {
      const saved = await saveHomeworkAttachment(id, file);
      if (saved) {
        attachment = saved.storedName;
        attachmentName = saved.originalName;
      }
    } catch {
      return NextResponse.redirect(new URL("/espace-enseignants/devoirs?error=file", request.url), 303);
    }
  }

  const homework = {
    id,
    classId,
    teacherId: session.teacherId,
    title,
    description,
    dueDate,
    createdAt: new Date().toISOString(),
    attachment,
    attachmentName,
  };
  await addHomework(homework);
  try {
    await notifyHomeworkCreated(await readSchoolLife(), homework);
  } catch (error) {
    console.error("[email] notify after persist failed", error);
  }
  return NextResponse.redirect(new URL("/espace-enseignants/devoirs?ok=1", request.url), 303);
}
