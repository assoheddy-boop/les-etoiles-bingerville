import { formText } from "./admin-api";
import {
  currentYear,
  generateInvoicesForStudent,
  newId,
  nextMatricule,
  studentFullName,
  studentsInClass,
  syncParentLink,
} from "./school-life";
import type {
  EnrollmentDocumentKey,
  EnrollmentStatus,
  RosterStudent,
  SchoolLifeData,
  StudentEnrollment,
} from "./school-life-types";

export const ENROLLMENT_DOCUMENTS: Array<{ key: EnrollmentDocumentKey; label: string }> = [
  { key: "photos", label: "Photos" },
  { key: "extraitNaissance", label: "Extrait de naissance" },
  { key: "certificatScolarite", label: "Certificat de scolarité" },
  { key: "carnetCorrespondance", label: "Carnet de correspondance" },
  { key: "visiteMedicale", label: "Visite médicale" },
  { key: "carteAcces", label: "Carte d'accès" },
  { key: "macaron", label: "Macaron" },
  { key: "teeShirt", label: "Tee-shirt" },
  { key: "short", label: "Short" },
  { key: "droitExamen", label: "Droit d'examen" },
  { key: "livretScolaire", label: "Livret scolaire" },
  { key: "manuelInformatique", label: "Manuel informatique" },
  { key: "carteIdentiteUnique", label: "Carte d'identité unique" },
  { key: "inscriptionLigne", label: "Insc. ligne" },
];

export const ENROLLMENT_STATUS_OPTIONS: Array<{ value: EnrollmentStatus; label: string }> = [
  { value: "NOUVEAU", label: "Nouvel élève" },
  { value: "REINSCRIPTION", label: "Réinscription" },
  { value: "TRANSFERT", label: "Transfert" },
  { value: "REAFFECTATION", label: "Réaffectation" },
];

export const LV2_OPTIONS = [
  { value: "", label: "— Non renseigné —" },
  { value: "ANGLAIS", label: "Anglais" },
  { value: "ALLEMAND", label: "Allemand" },
  { value: "ESPAGNOL", label: "Espagnol" },
  { value: "ARABE", label: "Arabe" },
  { value: "PORTUGAIS", label: "Portugais" },
];

export const SERIES_OPTIONS = [
  { value: "A", label: "Série A" },
  { value: "C", label: "Série C" },
  { value: "D", label: "Série D" },
  { value: "G", label: "Série G" },
];

export function emptyChecklist(): Record<EnrollmentDocumentKey, boolean> {
  return Object.fromEntries(ENROLLMENT_DOCUMENTS.map((doc) => [doc.key, false])) as Record<
    EnrollmentDocumentKey,
    boolean
  >;
}

export function mergeChecklist(stored?: Record<string, boolean> | null) {
  const base = emptyChecklist();
  if (!stored) return base;
  for (const doc of ENROLLMENT_DOCUMENTS) {
    if (stored[doc.key] === true) base[doc.key] = true;
  }
  return base;
}

export function parseDocumentsChecklist(form: FormData) {
  const checklist = emptyChecklist();
  for (const doc of ENROLLMENT_DOCUMENTS) {
    const value = form.get(`doc_${doc.key}`);
    checklist[doc.key] = value === "on" || value === "true";
  }
  return checklist;
}

export function enrollmentStatusLabel(value?: string) {
  return ENROLLMENT_STATUS_OPTIONS.find((opt) => opt.value === value)?.label || value || "—";
}

export function lv2Label(value?: string) {
  return LV2_OPTIONS.find((opt) => opt.value === value)?.label || value || "—";
}

export function enrollmentForStudent(studentId: string, data: SchoolLifeData) {
  const yearId = data.currentSchoolYearId;
  return data.enrollments.find((row) => row.studentId === studentId && row.schoolYearId === yearId);
}

export function classGenderCounts(classId: string, data: SchoolLifeData) {
  const students = studentsInClass(classId, data);
  const male = students.filter((row) => row.gender === "M").length;
  const female = students.filter((row) => row.gender === "F").length;
  return { male, female, total: students.length };
}

export function listEnrollmentRows(
  data: SchoolLifeData,
  filters: { q?: string; men?: string; classId?: string; status?: string; establishmentId?: string },
) {
  const yearId = data.currentSchoolYearId;
  const q = (filters.q || "").trim().toLowerCase();
  const men = (filters.men || "").trim().toLowerCase();
  return data.students
    .filter((student) => {
      if (filters.classId && student.classId !== filters.classId) return false;
      if (filters.establishmentId) {
        const klass = data.classes.find((row) => row.id === student.classId);
        if (klass?.establishmentId !== filters.establishmentId) return false;
      }
      if (men && (student.nationalMatricule || "").toLowerCase() !== men) return false;
      if (q) {
        const hay = `${student.lastName} ${student.firstName} ${student.matricule || ""} ${student.nationalMatricule || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      const enrollment = data.enrollments.find(
        (row) => row.studentId === student.id && row.schoolYearId === yearId,
      );
      if (filters.status && (enrollment?.enrollmentStatus || "") !== filters.status) return false;
      return true;
    })
    .map((student) => {
      const klass = data.classes.find((row) => row.id === student.classId);
      const enrollment = data.enrollments.find(
        (row) => row.studentId === student.id && row.schoolYearId === yearId,
      );
      return {
        student,
        className: klass ? `${klass.name} — ${klass.campus}` : student.classId,
        enrollment,
        enrolled: Boolean(enrollment),
      };
    })
    .sort((a, b) => studentFullName(a.student).localeCompare(studentFullName(b.student), "fr"));
}

function asStatus(value: string): EnrollmentStatus {
  if (
    value === "NOUVEAU" ||
    value === "REINSCRIPTION" ||
    value === "TRANSFERT" ||
    value === "REAFFECTATION"
  ) {
    return value;
  }
  return "NOUVEAU";
}

function applyIdentity(student: RosterStudent, form: FormData) {
  student.firstName = formText(form, "firstName");
  student.lastName = formText(form, "lastName");
  student.classId = formText(form, "classId");
  student.matricule = formText(form, "matricule") || undefined;
  student.nationalMatricule = formText(form, "nationalMatricule") || undefined;
  student.birthDate = formText(form, "birthDate") || undefined;
  student.birthPlace = formText(form, "birthPlace") || undefined;
  student.gender = formText(form, "gender") === "F" ? "F" : formText(form, "gender") === "M" ? "M" : undefined;
  student.nationality = formText(form, "nationality") || undefined;
  student.fatherName = formText(form, "fatherName") || undefined;
  student.motherName = formText(form, "motherName") || undefined;
  student.guardianName = formText(form, "guardianName") || undefined;
  student.guardianPhone = formText(form, "guardianPhone") || undefined;
  student.contactPhone = formText(form, "contactPhone") || undefined;
  student.contactEmail = formText(form, "contactEmail") || undefined;
  student.series = formText(form, "series") || undefined;
}

function applyEnrollmentFields(enrollment: StudentEnrollment, form: FormData, schoolYearId: string) {
  enrollment.schoolYearId = schoolYearId;
  enrollment.enrolledAt = formText(form, "enrolledAt") || enrollment.enrolledAt;
  enrollment.enrollmentStatus = asStatus(formText(form, "enrollmentStatus"));
  enrollment.lv2 = formText(form, "lv2") || undefined;
  enrollment.birthCertNumber = formText(form, "birthCertNumber") || undefined;
  enrollment.birthCertDate = formText(form, "birthCertDate") || undefined;
  enrollment.birthCertPlace = formText(form, "birthCertPlace") || undefined;
  enrollment.previousSchool = formText(form, "previousSchool") || undefined;
  enrollment.previousClass = formText(form, "previousClass") || undefined;
  enrollment.transferRef = formText(form, "transferRef") || undefined;
  enrollment.decisionNumber = formText(form, "decisionNumber") || undefined;
  enrollment.isScholarship = form.get("isScholarship") === "on";
  enrollment.repeatYear = form.get("repeatYear") === "on";
  enrollment.documentsChecklist = parseDocumentsChecklist(form);
  enrollment.notes = formText(form, "notes") || undefined;
}

export function validateEnrollmentForm(data: SchoolLifeData, form: FormData, studentId?: string) {
  const firstName = formText(form, "firstName");
  const lastName = formText(form, "lastName");
  const classId = formText(form, "classId");
  if (!firstName || !lastName || !classId) return "data";
  if (!data.classes.some((row) => row.id === classId)) return "class";

  const matricule = formText(form, "matricule");
  if (matricule) {
    const clash = data.students.find(
      (row) => row.matricule?.toLowerCase() === matricule.toLowerCase() && row.id !== studentId,
    );
    if (clash) return "matricule";
  }
  const nationalMatricule = formText(form, "nationalMatricule");
  if (nationalMatricule) {
    const clash = data.students.find(
      (row) =>
        row.nationalMatricule?.toLowerCase() === nationalMatricule.toLowerCase() && row.id !== studentId,
    );
    if (clash) return "nationalMatricule";
  }
  return null;
}

export function saveNewEnrollment(data: SchoolLifeData, form: FormData) {
  const error = validateEnrollmentForm(data, form);
  if (error) return { ok: false as const, error };
  const year = currentYear(data);
  if (!year) return { ok: false as const, error: "data" };

  const student: RosterStudent = {
    id: newId("stu"),
    firstName: "",
    lastName: "",
    classId: "",
  };
  applyIdentity(student, form);
  if (!student.matricule) student.matricule = nextMatricule(data);
  data.students.push(student);
  const parentId = formText(form, "parentId") || undefined;
  if (parentId) syncParentLink(data, student, parentId);

  const enrollment: StudentEnrollment = {
    id: newId("enr"),
    studentId: student.id,
    schoolYearId: year.id,
    enrolledAt: formText(form, "enrolledAt") || new Date().toISOString().slice(0, 10),
    enrollmentStatus: "NOUVEAU",
    isScholarship: false,
    documentsChecklist: emptyChecklist(),
    repeatYear: false,
  };
  applyEnrollmentFields(enrollment, form, year.id);
  data.enrollments.push(enrollment);
  data.invoices.push(...generateInvoicesForStudent(student, data));
  return { ok: true as const, studentId: student.id };
}

export function saveExistingEnrollment(data: SchoolLifeData, studentId: string, form: FormData) {
  const error = validateEnrollmentForm(data, form, studentId);
  if (error) return { ok: false as const, error };
  const year = currentYear(data);
  const student = data.students.find((row) => row.id === studentId);
  if (!year || !student) return { ok: false as const, error: "not_found" };

  applyIdentity(student, form);
  const parentId = formText(form, "parentId") || undefined;
  syncParentLink(data, student, parentId || undefined);

  let enrollment = enrollmentForStudent(studentId, data);
  if (!enrollment) {
    enrollment = {
      id: newId("enr"),
      studentId,
      schoolYearId: year.id,
      enrolledAt: formText(form, "enrolledAt") || new Date().toISOString().slice(0, 10),
      enrollmentStatus: "NOUVEAU",
      isScholarship: false,
      documentsChecklist: emptyChecklist(),
      repeatYear: false,
    };
    data.enrollments.push(enrollment);
  }
  applyEnrollmentFields(enrollment, form, year.id);
  data.invoices.push(...generateInvoicesForStudent(student, data));
  return { ok: true as const, studentId };
}
