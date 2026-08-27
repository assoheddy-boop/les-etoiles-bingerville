import { findStudent } from "@/lib/demo-accounts";
import { loginFailure, loginSuccess, readCredentialBody } from "@/lib/login";
import { findParentLogin, parentOfStudent, readSchoolLife, writeSchoolLife } from "@/lib/school-life";
import { PARENT_COOKIE, signSession } from "@/lib/session";

export async function POST(request: Request) {
  const body = await readCredentialBody(request);
  const matricule = body.matricule || body.username || "";
  const password = body.password || "";
  const data = await readSchoolLife();
  const passwordBefore = new Map(data.parents.map((row) => [row.id, row.password]));
  let result = await findParentLogin(matricule, password, data);
  if (!result) {
    const demo = findStudent(matricule, password);
    const student = demo ? data.students.find((row) => row.id === demo.id) : undefined;
    const parent = student ? parentOfStudent(student, data) : undefined;
    if (student && parent) result = { student, parent };
  }
  if (!result) {
    return loginFailure(request, "/connexion");
  }
  if (result.parent.password !== passwordBefore.get(result.parent.id)) {
    await writeSchoolLife(data);
  }
  const token = await signSession({
    role: "parent",
    matricule: result.student.matricule || "",
    studentId: result.student.id,
    displayName: result.parent.displayName,
  });
  return loginSuccess(request, "/espace-parents", PARENT_COOKIE, token);
}
