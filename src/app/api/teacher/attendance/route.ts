import { NextResponse } from "next/server";
import { getTeacherSession } from "@/lib/auth";
import {
  readSchoolLife,
  saveAttendance,
  studentsInClass,
  teacherClasses,
  todayISO,
} from "@/lib/school-life";
import type { AttendanceStatus } from "@/lib/school-life-types";

function isStatus(value: string): value is AttendanceStatus {
  return value === "present" || value === "late" || value === "absent";
}

export async function POST(request: Request) {
  const session = await getTeacherSession();
  if (!session) {
    return NextResponse.redirect(new URL("/espace-enseignants/connexion", request.url), 303);
  }
  const form = await request.formData();
  const classId = String(form.get("classId") || "");
  const date = String(form.get("date") || todayISO());
  const data = await readSchoolLife();
  const allowed = teacherClasses(session.teacherId, data).some((item) => item.id === classId);
  if (!allowed) {
    return NextResponse.redirect(new URL("/espace-enseignants/appel?error=1", request.url), 303);
  }
  const students = studentsInClass(classId, data);
  const entries = students.map((student) => {
    const raw = String(form.get(`status_${student.id}`) || "present");
    return { studentId: student.id, status: isStatus(raw) ? raw : ("present" as const) };
  });
  await saveAttendance({
    id: crypto.randomUUID(),
    date,
    classId,
    teacherId: session.teacherId,
    recordedAt: new Date().toISOString(),
    entries,
  });
  return NextResponse.redirect(new URL("/espace-enseignants/appel?ok=1", request.url), 303);
}
