import { appendActivityLog } from "./activity-log";
import { hydrateModuleControl } from "./module-control";
import { schoolLifeSeed } from "./school-life-seed";
import { verifyAndUpgrade } from "./password";
import { readJsonDocument, writeJsonDocument } from "./persist";
import type { AdminSession, ParentSession, TeacherSession } from "./session";
import type {
  Actor,
  AttendanceSession,
  AttendanceStatus,
  BusLine,
  CashPayment,
  CycleId,
  FeeType,
  Grade,
  HealthIncident,
  HealthKind,
  Homework,
  BudgetLine,
  ExpenseCategory,
  FinanceAccount,
  FinanceTransaction,
  LeaveRequest,
  LeaveStatus,
  LeaveType,
  LostItem,
  MessagePartner,
  ParentAccount,
  ParentChildView,
  PayRubrique,
  PayrollNote,
  PayrollRun,
  Payslip,
  PickupAuthorization,
  RosterStudent,
  SalaryAdvance,
  SchoolClass,
  StudentEnrollment,
  SchoolLifeData,
  SchoolMessage,
  SocialCase,
  StaffEvaluation,
  StaffPresence,
  StaffPresenceStatus,
  StaffProfile,
  StudentInvoice,
  SupplierInvoice,
  TeacherAccount,
  TimetableSlot,
  TransportEvent,
  WeekdayId,
} from "./school-life-types";
import { CAMPUSES } from "./school-life-types";
import {
  hydrateClassEstablishment,
  hydrateEstablishments,
  hydrateStaffEstablishment,
} from "./establishments";
import { ensureStaffForTeachers, upsertStaffPresence as upsertPresenceByStaff } from "./hr";
import { normalizePickupCode } from "./pickup-qr";

const SECRETARIAT: MessagePartner = {
  id: "school:secretariat",
  name: "Secrétariat Les Étoiles",
  label: "Vie scolaire · Bingerville",
};

function asArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function mergeById<T extends { id: string }>(stored: unknown, seedRows: T[]): T[] {
  const rows = asArray<T>(stored, seedRows);
  const ids = new Set(rows.map((row) => row.id));
  return [...rows, ...seedRows.filter((row) => !ids.has(row.id))];
}

function hydrate(parsed: Partial<SchoolLifeData> | null): SchoolLifeData {
  const seed = structuredClone(schoolLifeSeed);
  const source = parsed ?? {};
  const teachersRaw = asArray<TeacherAccount>(source.teachers, seed.teachers);
  const teacherIds = new Set(teachersRaw.map((teacher) => teacher.id));
  const teachers = [
    ...teachersRaw,
    ...seed.teachers.filter((teacher) => !teacherIds.has(teacher.id)),
  ].map((teacher) => {
    const seeded = seed.teachers.find((row) => row.id === teacher.id || row.email === teacher.email);
    return {
      ...teacher,
      password: teacher.password || seeded?.password || "",
      classIds: teacher.classIds ?? [],
      subjectIds: teacher.subjectIds ?? [],
    };
  });
  const yearId = source.currentSchoolYearId || seed.currentSchoolYearId;
  const establishments = hydrateEstablishments(source.establishments, seed.establishments);
  const classes = asArray<SchoolClass>(source.classes, seed.classes).map((item) =>
    hydrateClassEstablishment(item, establishments, item.schoolYearId || yearId),
  );
  const staffProfiles = mergeById<StaffProfile>(source.staffProfiles, seed.staffProfiles).map((row) =>
    hydrateStaffEstablishment(row, establishments),
  );
  const staffDraft: SchoolLifeData = {
    ...seed,
    establishments,
    teachers,
    classes,
    staffProfiles,
  };
  ensureStaffForTeachers(staffDraft, establishments[0]?.shortName || CAMPUSES[0]);
  const profiles = staffDraft.staffProfiles;
  const staffIdForTeacher = (teacherId?: string) =>
    profiles.find((item) => item.teacherId === teacherId)?.id || teacherId || "";
  return {
    schoolYears: asArray(source.schoolYears, seed.schoolYears),
    currentSchoolYearId: yearId,
    establishments,
    subjects: asArray(source.subjects, seed.subjects),
    teachers,
    classes,
    parents: mergeById<ParentAccount>(source.parents, seed.parents).map((row) => {
      const seeded = seed.parents.find((item) => item.id === row.id);
      const demo = row.id === "par-kouadio" || row.id === "par-yao";
      return {
        ...row,
        password: row.password || seeded?.password || "",
        moduleParentsActive:
          typeof row.moduleParentsActive === "boolean"
            ? row.moduleParentsActive
            : typeof seeded?.moduleParentsActive === "boolean"
              ? seeded.moduleParentsActive
              : demo,
      };
    }),
    students: asArray(source.students, seed.students).map((item) => {
      const seeded = seed.students.find((row) => row.id === item.id);
      return seeded ? { ...seeded, ...item } : item;
    }),
    timetableSlots: asArray(source.timetableSlots, seed.timetableSlots),
    feeTypes: asArray(source.feeTypes, seed.feeTypes),
    invoices: asArray(source.invoices, seed.invoices),
    bulletins: asArray(source.bulletins, seed.bulletins).map((item) => {
      const seeded = seed.bulletins.find((row) => row.id === item.id);
      return { ...item, pdfPath: item.pdfPath ?? seeded?.pdfPath };
    }),
    attendance: asArray(source.attendance, seed.attendance),
    homeworks: asArray(source.homeworks, seed.homeworks).map((item) => {
      const seeded = seed.homeworks.find((row) => row.id === item.id);
      return {
        ...item,
        attachment: item.attachment ?? seeded?.attachment,
        attachmentName: item.attachmentName ?? seeded?.attachmentName,
      };
    }),
    grades: asArray(source.grades, seed.grades),
    messages: asArray(source.messages, seed.messages),
    busLines: asArray<BusLine>(source.busLines, seed.busLines).map((line) => ({
      ...line,
      stops: line.stops ?? [],
      studentIds: line.studentIds ?? [],
    })),
    transportLogs: asArray(source.transportLogs, seed.transportLogs),
    pickupAuths: mergeById<PickupAuthorization>(source.pickupAuths, seed.pickupAuths).map((row) => {
      const seeded = seed.pickupAuths.find((item) => item.id === row.id);
      if (seeded && seeded.code === row.code && !row.usedAt && row.date !== todayISO()) {
        return { ...row, date: todayISO() };
      }
      return row;
    }),
    healthIncidents: asArray(source.healthIncidents, seed.healthIncidents),
    leaveRequests: mergeById<LeaveRequest>(source.leaveRequests, seed.leaveRequests).map((row) => ({
      ...row,
      staffId: row.staffId || staffIdForTeacher(row.teacherId),
    })),
    staffPresence: mergeById<StaffPresence>(source.staffPresence, seed.staffPresence).map((row) => ({
      ...row,
      staffId: row.staffId || staffIdForTeacher(row.teacherId),
    })),
    payrollNotes: asArray<PayrollNote>(source.payrollNotes, seed.payrollNotes),
    staffProfiles: profiles,
    salaryAdvances: mergeById<SalaryAdvance>(source.salaryAdvances, seed.salaryAdvances),
    staffEvaluations: mergeById<StaffEvaluation>(source.staffEvaluations, seed.staffEvaluations),
    payRubriques: mergeById<PayRubrique>(source.payRubriques, seed.payRubriques),
    payrollRuns: mergeById<PayrollRun>(source.payrollRuns, seed.payrollRuns),
    payslips: mergeById<Payslip>(source.payslips, seed.payslips).map((row) => ({
      ...row,
      lines: row.lines ?? [],
    })),
    financeAccounts: mergeById<FinanceAccount>(source.financeAccounts, seed.financeAccounts),
    expenseCategories: mergeById<ExpenseCategory>(source.expenseCategories, seed.expenseCategories),
    financeTransactions: mergeById<FinanceTransaction>(source.financeTransactions, seed.financeTransactions),
    supplierInvoices: mergeById<SupplierInvoice>(source.supplierInvoices, seed.supplierInvoices),
    budgetLines: mergeById<BudgetLine>(source.budgetLines, seed.budgetLines),
    socialCases: mergeById<SocialCase>(source.socialCases, seed.socialCases),
    lostItems: asArray(source.lostItems, seed.lostItems).map((item) => {
      const seeded = seed.lostItems.find((row) => row.id === item.id);
      return { ...item, photo: item.photo ?? seeded?.photo };
    }),
    enrollments: mergeEnrollments(source.enrollments, seed.enrollments),
    teacherControlEnabled: source.teacherControlEnabled ?? seed.teacherControlEnabled,
    teacherControlNoMessageDays:
      source.teacherControlNoMessageDays ?? seed.teacherControlNoMessageDays,
    lessonValidations: mergeById(source.lessonValidations, seed.lessonValidations),
    assessments: mergeById(source.assessments, seed.assessments),
    activityLogs: mergeById(source.activityLogs, seed.activityLogs),
    moduleControl: hydrateModuleControl(source.moduleControl),
    cashPayments: asArray<CashPayment>(source.cashPayments, seed.cashPayments ?? []),
  };
}

function mergeEnrollments(
  stored: unknown,
  seedRows: StudentEnrollment[],
): StudentEnrollment[] {
  const rows = asArray<StudentEnrollment>(stored, seedRows);
  const ids = new Set(rows.map((row) => row.id));
  return [
    ...rows.map((row) => ({
      ...row,
      isScholarship: Boolean(row.isScholarship),
      repeatYear: Boolean(row.repeatYear),
      documentsChecklist: row.documentsChecklist ?? {},
    })),
    ...seedRows.filter((row) => !ids.has(row.id)),
  ];
}

export async function readSchoolLife(): Promise<SchoolLifeData> {
  const raw = await readJsonDocument("school-life");
  if (!raw) return hydrate(null);
  try {
    return hydrate(JSON.parse(raw) as Partial<SchoolLifeData>);
  } catch {
    return hydrate(null);
  }
}

export async function writeSchoolLife(next: SchoolLifeData) {
  await writeJsonDocument("school-life", next);
}

export function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function todayISO() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Abidjan" });
}

export function studentFullName(student: { firstName: string; lastName: string }) {
  return `${student.firstName} ${student.lastName}`;
}

export function currentYear(data: SchoolLifeData) {
  return data.schoolYears.find((row) => row.id === data.currentSchoolYearId) ?? data.schoolYears.find((row) => row.current);
}

export function classLabel(classId: string, data: SchoolLifeData) {
  const item = data.classes.find((row) => row.id === classId);
  if (!item) return classId;
  return `${item.name} — ${item.campus}`;
}

export function subjectName(subjectId: string, data: SchoolLifeData) {
  return data.subjects.find((row) => row.id === subjectId)?.name ?? subjectId;
}

export async function findTeacherByEmail(email: string, password: string, data: SchoolLifeData) {
  const id = email.trim().toLowerCase();
  const teacher = data.teachers.find((row) => row.email.toLowerCase() === id);
  if (!teacher) return undefined;
  const check = await verifyAndUpgrade(password, teacher.password);
  if (!check.ok) return undefined;
  if (check.nextHash) teacher.password = check.nextHash;
  return teacher;
}

export function findTeacherById(id: string, data: SchoolLifeData) {
  return data.teachers.find((teacher) => teacher.id === id);
}

export function parentOfStudent(student: RosterStudent, data: SchoolLifeData): ParentAccount | undefined {
  if (student.parentId) {
    const byId = data.parents.find((row) => row.id === student.parentId);
    if (byId) return byId;
  }
  return data.parents.find((row) => row.studentIds.includes(student.id));
}

export async function findParentLogin(matricule: string, password: string, data: SchoolLifeData) {
  const code = matricule.trim().toLowerCase();
  const student = data.students.find((row) => (row.matricule || "").toLowerCase() === code);
  if (!student) return null;
  const parent = parentOfStudent(student, data);
  if (!parent) return null;
  const check = await verifyAndUpgrade(password, parent.password);
  if (!check.ok) return null;
  if (check.nextHash) parent.password = check.nextHash;
  return { student, parent };
}

export function parentChildView(studentId: string, data: SchoolLifeData): ParentChildView | null {
  const student = data.students.find((row) => row.id === studentId);
  if (!student) return null;
  const klass = data.classes.find((row) => row.id === student.classId);
  const parent = parentOfStudent(student, data);
  return {
    id: student.id,
    studentName: studentFullName(student),
    parentName: parent?.displayName ?? student.parentName ?? "Parent",
    matricule: student.matricule ?? "",
    cycle: klass?.cycle ?? "Primaire",
    classroom: klass ? `${klass.name} — ${klass.campus}` : student.classId,
    classId: student.classId,
  };
}

export function invoicesForStudent(studentId: string, data: SchoolLifeData) {
  return data.invoices.filter((row) => row.studentId === studentId);
}

export function studentsInClass(classId: string, data: SchoolLifeData) {
  return data.students.filter((student) => student.classId === classId);
}

export function teacherClasses(teacherId: string, data: SchoolLifeData) {
  const teacher = findTeacherById(teacherId, data);
  const fromProfile = teacher?.classIds ?? [];
  const fromEdt = data.timetableSlots.filter((slot) => slot.teacherId === teacherId).map((slot) => slot.classId);
  const ids = new Set([...fromProfile, ...fromEdt]);
  return data.classes.filter((item) => ids.has(item.id));
}

export function teacherTimetable(teacherId: string, data: SchoolLifeData) {
  return data.timetableSlots.filter((slot) => slot.teacherId === teacherId);
}

export function classTimetable(classId: string, data: SchoolLifeData) {
  return data.timetableSlots.filter((slot) => slot.classId === classId);
}

export function matchingFeeTypes(classId: string, data: SchoolLifeData): FeeType[] {
  const klass = data.classes.find((row) => row.id === classId);
  if (!klass) return [];
  return data.feeTypes.filter((fee) => {
    if (fee.classId) return fee.classId === classId;
    if (fee.cycle) return fee.cycle === klass.cycle;
    return true;
  });
}

export function generateInvoicesForStudent(student: RosterStudent, data: SchoolLifeData): StudentInvoice[] {
  const existing = new Set(
    data.invoices.filter((row) => row.studentId === student.id).map((row) => row.feeTypeId),
  );
  return matchingFeeTypes(student.classId, data)
    .filter((fee) => !existing.has(fee.id))
    .map((fee) => ({
      id: newId("inv"),
      studentId: student.id,
      feeTypeId: fee.id,
      kind: fee.kind,
      label: fee.name,
      period: fee.period,
      amountFcfa: fee.amountFcfa,
      status: "due" as const,
      createdAt: new Date().toISOString(),
    }));
}

export function nextMatricule(data: SchoolLifeData) {
  const year = currentYear(data)?.label.split("-")[0] ?? "2026";
  const used = data.students
    .map((row) => row.matricule)
    .filter((value): value is string => Boolean(value))
    .map((value) => {
      const match = value.match(/(\d+)$/);
      return match ? Number(match[1]) : 0;
    });
  const next = Math.max(100, ...used, 0) + 1;
  return `ETOILES-${year}-${String(next).padStart(3, "0")}`;
}

export function isWeekday(value: number): value is WeekdayId {
  return value >= 1 && value <= 6;
}

export function timesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart < bEnd && bStart < aEnd;
}

export function timetableConflict(slot: Omit<TimetableSlot, "id">, data: SchoolLifeData, ignoreId?: string) {
  for (const other of data.timetableSlots) {
    if (other.id === ignoreId || other.dayOfWeek !== slot.dayOfWeek) continue;
    if (!timesOverlap(slot.startTime, slot.endTime, other.startTime, other.endTime)) continue;
    if (other.classId === slot.classId) {
      return `La classe a déjà un cours de ${other.startTime} à ${other.endTime}.`;
    }
    if (other.teacherId === slot.teacherId) {
      return `L’enseignant a déjà un cours à cette heure (${classLabel(other.classId, data)}).`;
    }
  }
  return null;
}

export function attachTeacherToClass(teacher: TeacherAccount, classId: string) {
  if (!teacher.classIds.includes(classId)) teacher.classIds.push(classId);
}

export function syncParentLink(data: SchoolLifeData, student: RosterStudent, parentId?: string) {
  for (const parent of data.parents) {
    parent.studentIds = parent.studentIds.filter((id) => id !== student.id);
  }
  student.parentId = parentId;
  if (!parentId) {
    student.parentName = undefined;
    return;
  }
  const parent = data.parents.find((row) => row.id === parentId);
  if (!parent) return;
  if (!parent.studentIds.includes(student.id)) parent.studentIds.push(student.id);
  student.parentName = parent.displayName;
}

export function parentActorId(studentId: string) {
  return `parent:${studentId}`;
}

export function teacherActorId(teacherId: string) {
  return `teacher:${teacherId}`;
}

export function actorFromSession(
  session: ParentSession | TeacherSession | AdminSession,
  data?: SchoolLifeData,
): Actor {
  if (session.role === "parent") {
    return { id: parentActorId(session.studentId), name: session.displayName, role: "parent" };
  }
  if (session.role === "teacher") {
    const teacher = data ? findTeacherById(session.teacherId, data) : null;
    return {
      id: teacherActorId(session.teacherId),
      name: teacher?.displayName ?? session.displayName,
      role: "teacher",
    };
  }
  return { id: SECRETARIAT.id, name: SECRETARIAT.name, role: "school" };
}

export function resolveActorName(actorId: string, data: SchoolLifeData) {
  if (actorId === SECRETARIAT.id) return SECRETARIAT.name;
  if (actorId === "school:vigile") return "Vigile Les Étoiles";
  if (actorId.startsWith("teacher:")) {
    const teacher = findTeacherById(actorId.slice("teacher:".length), data);
    return teacher ? `Mme/M. ${teacher.displayName}` : "Enseignant";
  }
  if (actorId.startsWith("parent:")) {
    const student = data.students.find((row) => row.id === actorId.slice("parent:".length));
    if (!student) return "Parent";
    return parentOfStudent(student, data)?.displayName ?? student.parentName ?? "Parent";
  }
  return "Interlocuteur";
}

export function partnersForActor(actor: Actor, data: SchoolLifeData): MessagePartner[] {
  if (actor.role === "parent") {
    const studentId = actor.id.slice("parent:".length);
    const student = data.students.find((row) => row.id === studentId);
    if (!student) return [SECRETARIAT];
    const teachers = data.teachers.filter((teacher) => {
      const classIds = new Set([
        ...teacher.classIds,
        ...data.timetableSlots.filter((slot) => slot.teacherId === teacher.id).map((slot) => slot.classId),
      ]);
      return classIds.has(student.classId);
    });
    return [
      ...teachers.map((teacher) => ({
        id: teacherActorId(teacher.id),
        name: teacher.displayName,
        label: `${teacher.title} · ${classLabel(student.classId, data)}`,
      })),
      SECRETARIAT,
    ];
  }
  if (actor.role === "teacher") {
    const teacherId = actor.id.slice("teacher:".length);
    const classes = teacherClasses(teacherId, data);
    const classIds = new Set(classes.map((item) => item.id));
    const parents = data.students
      .filter((student) => classIds.has(student.classId) && parentOfStudent(student, data))
      .map((student) => {
        const parent = parentOfStudent(student, data)!;
        return {
          id: parentActorId(student.id),
          name: parent.displayName,
          label: `${studentFullName(student)} · ${classLabel(student.classId, data)}`,
        };
      });
    return [...parents, SECRETARIAT];
  }
  return data.students
    .filter((student) => parentOfStudent(student, data))
    .map((student) => {
      const parent = parentOfStudent(student, data)!;
      return {
        id: parentActorId(student.id),
        name: parent.displayName,
        label: `${studentFullName(student)} · ${classLabel(student.classId, data)}`,
      };
    });
}

export function canMessage(actor: Actor, partnerId: string, data: SchoolLifeData) {
  return partnersForActor(actor, data).some((partner) => partner.id === partnerId);
}

export function conversation(actorId: string, partnerId: string, data: SchoolLifeData) {
  return data.messages
    .filter(
      (message) =>
        (message.senderId === actorId && message.receiverId === partnerId) ||
        (message.senderId === partnerId && message.receiverId === actorId),
    )
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function unreadCount(actorId: string, data: SchoolLifeData, partnerId?: string) {
  return data.messages.filter(
    (message) =>
      message.receiverId === actorId &&
      !message.readAt &&
      (!partnerId || message.senderId === partnerId),
  ).length;
}

export function absencesForStudent(studentId: string, data: SchoolLifeData) {
  const rows: Array<{ date: string; status: AttendanceStatus; classId: string }> = [];
  for (const session of data.attendance) {
    const entry = session.entries.find((item) => item.studentId === studentId);
    if (entry && entry.status !== "present") {
      rows.push({ date: session.date, status: entry.status, classId: session.classId });
    }
  }
  return rows.sort((a, b) => b.date.localeCompare(a.date));
}

export function homeworksForStudent(studentId: string, data: SchoolLifeData) {
  const student = data.students.find((row) => row.id === studentId);
  if (!student) return [];
  return data.homeworks
    .filter((item) => item.classId === student.classId)
    .sort((a, b) => b.dueDate.localeCompare(a.dueDate));
}

export function gradesForStudent(studentId: string, data: SchoolLifeData) {
  return data.grades
    .filter((item) => item.studentId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function attendanceForClassDate(classId: string, date: string, data: SchoolLifeData) {
  return data.attendance.find((session) => session.classId === classId && session.date === date);
}

export async function saveAttendance(session: AttendanceSession) {
  const data = await readSchoolLife();
  data.attendance = data.attendance.filter(
    (row) => !(row.classId === session.classId && row.date === session.date),
  );
  data.attendance.unshift(session);
  await writeSchoolLife(data);
}

export function notifyParentsOfHomework(data: SchoolLifeData, homework: Homework) {
  const students = data.students.filter((student) => student.classId === homework.classId);
  const senderId = teacherActorId(homework.teacherId);
  const label = classLabel(homework.classId, data);
  for (const student of students) {
    if (!parentOfStudent(student, data)) continue;
    data.messages.unshift({
      id: newId("msg"),
      senderId,
      receiverId: parentActorId(student.id),
      studentId: student.id,
      content: `Nouveau devoir pour ${label} : ${homework.title} (à rendre le ${homework.dueDate}).${
        homework.description ? ` ${homework.description}` : ""
      }`,
      createdAt: new Date().toISOString(),
    });
  }
}

export async function addHomework(homework: Homework) {
  const data = await readSchoolLife();
  data.homeworks.unshift(homework);
  notifyParentsOfHomework(data, homework);
  appendActivityLog(data, {
    actorId: teacherActorId(homework.teacherId),
    actorRole: "teacher",
    action: "homework_create",
    payload: {
      homeworkId: homework.id,
      classId: homework.classId,
      title: homework.title,
      dueDate: homework.dueDate,
    },
  });
  await writeSchoolLife(data);
}

export async function addGrade(grade: Grade) {
  const data = await readSchoolLife();
  data.grades.unshift(grade);
  appendActivityLog(data, {
    actorId: teacherActorId(grade.teacherId),
    actorRole: "teacher",
    action: "grade_save",
    payload: {
      gradeId: grade.id,
      studentId: grade.studentId,
      subject: grade.subject,
      period: grade.period,
      value: grade.value,
    },
  });
  await writeSchoolLife(data);
}

export async function addMessage(message: SchoolMessage) {
  const data = await readSchoolLife();
  data.messages.unshift(message);
  if (message.senderId.startsWith("teacher:") || message.senderId.startsWith("school:")) {
    appendActivityLog(data, {
      actorId: message.senderId,
      actorRole: message.senderId.startsWith("teacher:") ? "teacher" : "fondateur",
      action: "message_send",
      payload: {
        messageId: message.id,
        receiverId: message.receiverId,
        studentId: message.studentId ?? "",
      },
    });
  }
  await writeSchoolLife(data);
}

export async function markConversationRead(actorId: string, partnerId: string) {
  const data = await readSchoolLife();
  const now = new Date().toISOString();
  data.messages = data.messages.map((message) => {
    if (message.receiverId === actorId && message.senderId === partnerId && !message.readAt) {
      return { ...message, readAt: now };
    }
    return message;
  });
  await writeSchoolLife(data);
}

export const attendanceLabels: Record<AttendanceStatus, string> = {
  present: "Présent",
  late: "Retard",
  absent: "Absent",
};

export const feeKindLabels: Record<FeeType["kind"], string> = {
  scolarite: "Scolarité",
  cantine: "Cantine",
  inscription: "Inscription",
  other: "Autre",
};

export const transportEventLabels: Record<TransportEvent, string> = {
  boarded: "Monté dans le bus",
  arrived: "Arrivé à l’école",
  left_school: "Sorti de l’école",
  picked_up: "Récupéré à la grille",
};

export const healthKindLabels: Record<HealthKind, string> = {
  fever: "Fièvre",
  injury: "Blessure",
  sent_home: "Renvoyé à la maison",
  other: "Autre",
};

export const leaveTypeLabels: Record<LeaveType, string> = {
  annual: "Congé annuel",
  sick: "Maladie",
  personal: "Personnel",
  unpaid: "Sans solde",
  maternity: "Maternité",
  other: "Autre",
};

export const leaveStatusLabels: Record<LeaveStatus, string> = {
  pending: "En attente",
  approved: "Accepté",
  refused: "Refusé",
};

export const staffPresenceLabels: Record<StaffPresenceStatus, string> = {
  present: "Présent",
  late: "Retard",
  absent: "Absent",
  half_day: "Demi-journée",
};

export function currentMonth() {
  return todayISO().slice(0, 7);
}

export function makePickupCode(data: SchoolLifeData) {
  const used = new Set(data.pickupAuths.map((row) => row.code.toUpperCase()));
  for (let i = 0; i < 12; i += 1) {
    const code = `ETOILES-${crypto.randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase()}`;
    if (!used.has(code)) return code;
  }
  return `ETOILES-${Date.now().toString(36).slice(-4).toUpperCase()}`;
}

export function parseStops(raw: string): BusLine["stops"] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const match = line.match(/^(\d{1,2}:\d{2})\s*[—\-–]?\s*(.+)$/);
      const time = match?.[1] ?? "";
      const name = (match?.[2] ?? line).trim();
      return { id: newId("stop"), name, time: time || `${7 + index}:00`.padStart(5, "0") };
    });
}

export function formatStops(stops: BusLine["stops"]) {
  return stops.map((stop) => `${stop.time} — ${stop.name}`).join("\n");
}

export function busForStudent(studentId: string, data: SchoolLifeData) {
  return data.busLines.find((line) => line.studentIds.includes(studentId));
}

export function transportLogsForStudent(studentId: string, data: SchoolLifeData, date?: string) {
  return data.transportLogs
    .filter((row) => row.studentId === studentId && (!date || row.date === date))
    .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt));
}

export function latestTransportEvent(studentId: string, data: SchoolLifeData, date: string) {
  const logs = transportLogsForStudent(studentId, data, date);
  return logs[logs.length - 1];
}

export function todayPickup(studentId: string, data: SchoolLifeData, date = todayISO()) {
  return data.pickupAuths
    .filter((row) => row.studentId === studentId && row.date === date)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}

export function findPickupByCode(code: string, data: SchoolLifeData) {
  const needle = normalizePickupCode(code);
  if (!needle) return undefined;
  return data.pickupAuths.find((row) => row.code.toUpperCase() === needle);
}

export function validatePickupCode(data: SchoolLifeData, code: string, actorId: string) {
  const auth = findPickupByCode(code, data);
  if (!auth) throw new Error("invalid");
  if (auth.date !== todayISO()) throw new Error("expired");
  if (auth.usedAt) throw new Error("used");
  auth.usedAt = new Date().toISOString();
  try {
    addTransportLog(data, {
      studentId: auth.studentId,
      event: "picked_up",
      note: `Récupéré par ${auth.authorizedPerson}`,
      recordedBy: actorId,
    });
  } catch {
    // Élève sans ligne de bus : la sortie reste valable.
  }
  const student = data.students.find((row) => row.id === auth.studentId);
  return { auth, student };
}

export function ensureTodayPickup(
  data: SchoolLifeData,
  student: RosterStudent,
  createdBy: string,
  person?: string,
  phone?: string,
) {
  const date = todayISO();
  const existing = todayPickup(student.id, data, date);
  if (existing && !existing.usedAt) {
    if (person) existing.authorizedPerson = person;
    if (phone) existing.authorizedPhone = phone;
    return existing;
  }
  const parent = parentOfStudent(student, data);
  const auth: PickupAuthorization = {
    id: newId("pick"),
    studentId: student.id,
    date,
    code: makePickupCode(data),
    authorizedPerson: person || parent?.displayName || student.parentName || "Parent",
    authorizedPhone: phone || parent?.phone,
    createdAt: new Date().toISOString(),
    createdBy,
  };
  data.pickupAuths.unshift(auth);
  return auth;
}

export function healthForStudent(studentId: string, data: SchoolLifeData) {
  return data.healthIncidents
    .filter((row) => row.studentId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addHealthIncident(
  data: SchoolLifeData,
  incident: Omit<HealthIncident, "id" | "createdAt"> & { id?: string; createdAt?: string },
) {
  data.healthIncidents.unshift({
    id: incident.id ?? newId("hlth"),
    createdAt: incident.createdAt ?? new Date().toISOString(),
    studentId: incident.studentId,
    kind: incident.kind,
    note: incident.note,
    date: incident.date,
    recordedBy: incident.recordedBy,
  });
}

export function addTransportLog(
  data: SchoolLifeData,
  input: {
    studentId: string;
    event: TransportEvent;
    note?: string;
    recordedBy: string;
  },
) {
  const bus = busForStudent(input.studentId, data);
  if (!bus) throw new Error("no-bus");
  data.transportLogs.unshift({
    id: newId("tlog"),
    studentId: input.studentId,
    busId: bus.id,
    date: todayISO(),
    event: input.event,
    note: input.note,
    recordedAt: new Date().toISOString(),
    recordedBy: input.recordedBy,
  });
}

export function upsertStaffPresence(
  data: SchoolLifeData,
  teacherId: string,
  status: StaffPresenceStatus,
  note?: string,
) {
  return upsertPresenceByStaff(data, teacherId, status, note);
}

export function addLostItem(
  data: SchoolLifeData,
  input: { description: string; place: string; foundAt: string; recordedBy: string; photo?: string },
) {
  const item: LostItem = {
    id: newId("lost"),
    description: input.description,
    place: input.place,
    foundAt: input.foundAt || todayISO(),
    createdAt: new Date().toISOString(),
    recordedBy: input.recordedBy,
    photo: input.photo,
    claimed: false,
  };
  data.lostItems.unshift(item);
  return item;
}

export function claimLostItem(data: SchoolLifeData, itemId: string, parentId: string) {
  const item = data.lostItems.find((row) => row.id === itemId);
  if (!item) throw new Error("missing");
  if (item.claimed) throw new Error("claimed");
  item.claimed = true;
  item.claimedByParentId = parentId;
  item.claimedAt = new Date().toISOString();
  return item;
}

export function unclaimedLostItems(data: SchoolLifeData) {
  return data.lostItems.filter((item) => !item.claimed).sort((a, b) => b.foundAt.localeCompare(a.foundAt));
}

export function teacherStudents(teacherId: string, data: SchoolLifeData) {
  const classIds = new Set(teacherClasses(teacherId, data).map((item) => item.id));
  return data.students.filter((student) => classIds.has(student.classId));
}

export function isHealthKind(value: string): value is HealthKind {
  return value === "fever" || value === "injury" || value === "sent_home" || value === "other";
}

export function isTransportEvent(value: string): value is TransportEvent {
  return value === "boarded" || value === "arrived" || value === "left_school" || value === "picked_up";
}

export function isLeaveType(value: string): value is LeaveType {
  return value === "annual" || value === "sick" || value === "personal" || value === "unpaid" || value === "maternity" || value === "other";
}

export function isStaffPresenceStatus(value: string): value is StaffPresenceStatus {
  return value === "present" || value === "late" || value === "absent" || value === "half_day";
}

export function monthLabel(month: string) {
  const [year, mm] = month.split("-");
  const names = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  const idx = Number(mm) - 1;
  return `${names[idx] ?? month} ${year}`;
}

export const cycleOptions: CycleId[] = ["Maternelle", "Primaire", "Secondaire"];
