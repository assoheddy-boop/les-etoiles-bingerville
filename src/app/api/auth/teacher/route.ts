import { teacherDemoHint } from "@/lib/demo-accounts";
import { loginFailure, loginSuccess, readCredentialBody } from "@/lib/login";
import { findTeacherByEmail, readSchoolLife, writeSchoolLife } from "@/lib/school-life";
import { signSession, TEACHER_COOKIE } from "@/lib/session";
import { isTeacherControlEnabled, recordTeacherLogin } from "@/lib/teacher-control";

export async function POST(request: Request) {
  const body = await readCredentialBody(request);
  const email = body.email || body.username || "";
  const password = body.password || "";
  const data = await readSchoolLife();
  const passwordBefore = new Map(data.teachers.map((row) => [row.id, row.password]));
  let teacher = await findTeacherByEmail(email, password, data);
  if (
    !teacher &&
    email.trim().toLowerCase() === teacherDemoHint.email &&
    password === teacherDemoHint.password
  ) {
    teacher = data.teachers.find((row) => row.email.toLowerCase() === teacherDemoHint.email);
  }
  if (!teacher) {
    return loginFailure(request, "/espace-enseignants/connexion");
  }
  const passwordChanged = teacher.password !== passwordBefore.get(teacher.id);
  if (isTeacherControlEnabled(data)) {
    recordTeacherLogin(data, teacher);
  }
  if (passwordChanged || isTeacherControlEnabled(data)) {
    try {
      await writeSchoolLife(data);
    } catch {
      // La connexion reste possible si le journal n’a pas pu être écrit.
    }
  }
  const token = await signSession({
    role: "teacher",
    teacherId: teacher.id,
    email: teacher.email,
    displayName: teacher.displayName,
  });
  return loginSuccess(request, "/espace-enseignants", TEACHER_COOKIE, token);
}
