import { NextResponse } from "next/server";
import { getTeacherSession } from "@/lib/auth";
import { addGrade, readSchoolLife, teacherClasses } from "@/lib/school-life";

export async function POST(request: Request) {
  const session = await getTeacherSession();
  if (!session) {
    return NextResponse.redirect(new URL("/espace-enseignants/connexion", request.url), 303);
  }
  const form = await request.formData();
  const studentId = String(form.get("studentId") || "");
  const subject = String(form.get("subject") || "").trim();
  const period = String(form.get("period") || "").trim();
  const value = Number(form.get("value"));
  const maxValue = Number(form.get("maxValue") || 20);
  const comment = String(form.get("comment") || "").trim();
  const data = await readSchoolLife();
  const student = data.students.find((row) => row.id === studentId);
  const allowed =
    student && teacherClasses(session.teacherId, data).some((item) => item.id === student.classId);
  if (!allowed || !subject || !period || Number.isNaN(value) || value < 0 || maxValue < 1) {
    return NextResponse.redirect(new URL("/espace-enseignants/notes?error=1", request.url), 303);
  }
  await addGrade({
    id: crypto.randomUUID(),
    studentId,
    teacherId: session.teacherId,
    subject,
    value,
    maxValue,
    period,
    comment: comment || undefined,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.redirect(new URL("/espace-enseignants/notes?ok=1", request.url), 303);
}
