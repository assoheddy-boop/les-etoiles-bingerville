import { isModuleEnabled } from "./module-control";
import { appendActivityLog } from "./activity-log";
import { upsertStaffPresence } from "./hr";
import {
  classLabel,
  newId,
  subjectName,
  teacherActorId,
  teacherClasses,
  teacherTimetable,
  todayISO,
} from "./school-life";
import type {
  ActivityLogAction,
  Assessment,
  AssessmentKind,
  AssessmentStatus,
  LessonValidation,
  SchoolLifeData,
  StaffRole,
  TeacherAccount,
  TimetableSlot,
  WeekdayId,
} from "./school-life-types";

export const DEFAULT_NO_MESSAGE_DAYS = 7;
export const HOMEWORK_RECENT_DAYS = 7;

export const staffRoleLabels: Record<StaffRole, string> = {
  fondateur: "Fondateur",
  directeur: "Directeur",
  vie_scolaire: "Vie scolaire",
};

export const activityActionLabels: Record<ActivityLogAction, string> = {
  login: "Connexion",
  validate_lesson: "Validation de cours",
  homework_create: "Création de devoir",
  grade_save: "Saisie de note",
  bulletin_deposit: "Dépôt de bulletin",
  assessment_submit: "Contrôle / composition",
  message_send: "Message aux familles",
  module_toggle: "Activation de module",
};

export const assessmentKindLabels: Record<AssessmentKind, string> = {
  controle: "Contrôle",
  composition: "Composition",
};

export const assessmentStatusLabels: Record<AssessmentStatus, string> = {
  planifie: "Planifié",
  fait: "Fait",
  en_retard: "En retard",
};

export type TeacherAlertKind =
  | "lesson_unvalidated"
  | "homework_missing"
  | "grades_late"
  | "assessment_late"
  | "no_message"
  | "bulletin_missing";

export const alertKindLabels: Record<TeacherAlertKind, string> = {
  lesson_unvalidated: "Cours non validé",
  homework_missing: "Devoir non créé",
  grades_late: "Notes en retard",
  assessment_late: "Contrôle en retard",
  no_message: "Pas de message",
  bulletin_missing: "Bulletin manquant",
};

export type TeacherAlert = {
  id: string;
  kind: TeacherAlertKind;
  teacherId: string;
  teacherName: string;
  title: string;
  detail: string;
  href?: string;
};

export type TeacherControlScore = {
  teacherId: string;
  teacherName: string;
  title: string;
  classLabels: string[];
  validationRate: number;
  homeworkRate: number;
  gradeRate: number;
  score: number;
  alertCount: number;
  presenceToday: string;
  lastMessageAt?: string;
  lastLoginAt?: string;
  lessonsValidated: number;
  lessonsExpected: number;
  homeworksRecent: number;
  assessmentsDone: number;
  assessmentsLate: number;
};

export function isStaffRole(value: string): value is StaffRole {
  return value === "fondateur" || value === "directeur" || value === "vie_scolaire";
}

export function isTeacherControlEnabled(data: SchoolLifeData) {
  if (data.teacherControlEnabled === false) return false;
  return isModuleEnabled(data, "controle_enseignants");
}

export function noMessageDays(data: SchoolLifeData) {
  const n = data.teacherControlNoMessageDays;
  return Number.isFinite(n) && n > 0 ? Math.round(n) : DEFAULT_NO_MESSAGE_DAYS;
}

export function canViewTeacherControl(role: StaffRole) {
  return role === "fondateur" || role === "directeur" || role === "vie_scolaire";
}

export function canViewControlLogs(role: StaffRole) {
  return role === "fondateur" || role === "directeur";
}

export function canExportControlStats(role: StaffRole) {
  return role === "fondateur" || role === "directeur";
}

export function canToggleTeacherControl(role: StaffRole) {
  return role === "fondateur";
}

export function abidjanTime(): string {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: "Africa/Abidjan",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function isoWeekday(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).getUTCDay();
}

export function toWeekdayId(date: string): WeekdayId | null {
  const js = isoWeekday(date);
  if (js === 0) return null;
  return js as WeekdayId;
}

export function addDaysISO(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  const cursor = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  cursor.setUTCDate(cursor.getUTCDate() + days);
  return cursor.toISOString().slice(0, 10);
}

export function recentSchoolDates(count = 14, from = todayISO()) {
  const out: string[] = [];
  let cursor = from;
  let guard = 0;
  while (out.length < count && guard < 40) {
    if (isoWeekday(cursor) !== 0) out.push(cursor);
    cursor = addDaysISO(cursor, -1);
    guard += 1;
  }
  return out;
}

export function datesThisWeek(today = todayISO()) {
  const js = isoWeekday(today);
  const mondayOffset = js === 0 ? 6 : js - 1;
  const monday = addDaysISO(today, -mondayOffset);
  const out: string[] = [];
  for (let i = 0; i < 6; i += 1) {
    const date = addDaysISO(monday, i);
    if (date > today) break;
    out.push(date);
  }
  return out;
}

export function slotsForTeacherDate(teacherId: string, date: string, data: SchoolLifeData) {
  const day = toWeekdayId(date);
  if (!day) return [];
  return teacherTimetable(teacherId, data)
    .filter((slot) => slot.dayOfWeek === day)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function findLessonValidation(
  data: SchoolLifeData,
  teacherId: string,
  slotId: string,
  date: string,
) {
  return data.lessonValidations.find(
    (row) => row.teacherId === teacherId && row.slotId === slotId && row.date === date,
  );
}

export function isSlotPast(slot: TimetableSlot, date: string, today = todayISO(), now = abidjanTime()) {
  if (date < today) return true;
  if (date > today) return false;
  return slot.endTime <= now;
}

export type DayLessonRow = {
  slot: TimetableSlot;
  date: string;
  past: boolean;
  validation?: LessonValidation;
};

export function dayLessonRows(teacherId: string, date: string, data: SchoolLifeData): DayLessonRow[] {
  const today = todayISO();
  const now = abidjanTime();
  return slotsForTeacherDate(teacherId, date, data).map((slot) => ({
    slot,
    date,
    past: isSlotPast(slot, date, today, now),
    validation: findLessonValidation(data, teacherId, slot.id, date),
  }));
}

export function validateLessonInPlace(
  data: SchoolLifeData,
  input: {
    teacherId: string;
    slotId: string;
    date: string;
    chapter: string;
    content: string;
  },
) {
  const chapter = input.chapter.trim();
  const content = input.content.trim();
  if (!chapter || !content) throw new Error("data");
  const slots = slotsForTeacherDate(input.teacherId, input.date, data);
  const slot = slots.find((row) => row.id === input.slotId);
  if (!slot) throw new Error("missing");
  if (findLessonValidation(data, input.teacherId, input.slotId, input.date)) {
    throw new Error("exists");
  }
  const row: LessonValidation = {
    id: newId("lval"),
    teacherId: input.teacherId,
    slotId: slot.id,
    date: input.date,
    classId: slot.classId,
    subjectId: slot.subjectId,
    chapter,
    content,
    validatedAt: new Date().toISOString(),
  };
  data.lessonValidations.unshift(row);
  appendActivityLog(data, {
    actorId: teacherActorId(input.teacherId),
    actorRole: "teacher",
    action: "validate_lesson",
    payload: {
      validationId: row.id,
      slotId: slot.id,
      date: input.date,
      classId: slot.classId,
      subjectId: slot.subjectId,
    },
  });
  return row;
}

export function effectiveAssessmentStatus(row: Assessment, today = todayISO()): AssessmentStatus {
  if (row.validated || row.status === "fait") return "fait";
  if (row.date < today) return "en_retard";
  return row.status === "en_retard" ? "en_retard" : "planifie";
}

export function isAssessmentKind(value: string): value is AssessmentKind {
  return value === "controle" || value === "composition";
}

export function upsertAssessmentInPlace(
  data: SchoolLifeData,
  input: {
    id?: string;
    teacherId: string;
    classId: string;
    subjectId: string;
    kind: AssessmentKind;
    date: string;
    topic: string;
    attachment?: string;
    attachmentName?: string;
    markDone?: boolean;
  },
) {
  const topic = input.topic.trim();
  if (!topic || !input.date || !input.classId || !input.subjectId) throw new Error("data");
  const allowed = teacherClasses(input.teacherId, data).some((item) => item.id === input.classId);
  if (!allowed) throw new Error("class");
  const today = todayISO();
  const markDone = Boolean(input.markDone);
  const row: Assessment = {
    id: input.id ?? newId("asm"),
    teacherId: input.teacherId,
    classId: input.classId,
    subjectId: input.subjectId,
    kind: input.kind,
    date: input.date,
    topic,
    attachment: input.attachment,
    attachmentName: input.attachmentName,
    status: markDone ? "fait" : input.date < today ? "en_retard" : "planifie",
    validated: markDone,
    createdAt: new Date().toISOString(),
    submittedAt: markDone ? new Date().toISOString() : undefined,
  };
  data.assessments.unshift(row);
  appendActivityLog(data, {
    actorId: teacherActorId(input.teacherId),
    actorRole: "teacher",
    action: "assessment_submit",
    payload: {
      assessmentId: row.id,
      classId: row.classId,
      subjectId: row.subjectId,
      kind: row.kind,
      date: row.date,
      validated: row.validated,
    },
  });
  return row;
}

export function markAssessmentDone(data: SchoolLifeData, assessmentId: string, teacherId: string) {
  const row = data.assessments.find((item) => item.id === assessmentId && item.teacherId === teacherId);
  if (!row) throw new Error("missing");
  row.status = "fait";
  row.validated = true;
  row.submittedAt = new Date().toISOString();
  appendActivityLog(data, {
    actorId: teacherActorId(teacherId),
    actorRole: "teacher",
    action: "assessment_submit",
    payload: {
      assessmentId: row.id,
      classId: row.classId,
      subjectId: row.subjectId,
      kind: row.kind,
      date: row.date,
      validated: true,
    },
  });
  return row;
}

export function recordTeacherLogin(data: SchoolLifeData, teacher: TeacherAccount) {
  const today = todayISO();
  const now = abidjanTime();
  const slots = slotsForTeacherDate(teacher.id, today, data);
  const first = slots[0];
  const already = data.staffPresence.find(
    (row) => (row.teacherId === teacher.id || row.staffId === `staff-${teacher.id}`) && row.date === today,
  );
  if (!already) {
    const late = Boolean(first && now > first.startTime);
    upsertStaffPresence(data, teacher.id, late ? "late" : "present", late ? "Connexion après le premier cours" : "Connexion");
  }
  appendActivityLog(data, {
    actorId: teacherActorId(teacher.id),
    actorRole: "teacher",
    action: "login",
    payload: { teacherId: teacher.id, date: today },
  });
}

export function depositBulletinsInPlace(
  data: SchoolLifeData,
  input: { teacherId: string; classId: string; period: string },
) {
  const period = input.period.trim();
  if (!period) throw new Error("data");
  const allowed = teacherClasses(input.teacherId, data).some((item) => item.id === input.classId);
  if (!allowed) throw new Error("class");
  const students = data.students.filter((row) => row.classId === input.classId);
  const generated = students.filter((student) =>
    data.bulletins.some((row) => row.studentId === student.id && row.period === period),
  ).length;
  appendActivityLog(data, {
    actorId: teacherActorId(input.teacherId),
    actorRole: "teacher",
    action: "bulletin_deposit",
    payload: {
      classId: input.classId,
      period,
      students: students.length,
      generated,
    },
  });
}

export function workdayHistory(teacherId: string, data: SchoolLifeData, days = 14) {
  return recentSchoolDates(days).map((date) => {
    const rows = dayLessonRows(teacherId, date, data);
    const expected = rows.length;
    const validated = rows.filter((row) => row.validation).length;
    const login = data.activityLogs.some(
      (log) =>
        log.action === "login" &&
        log.actorId === teacherActorId(teacherId) &&
        log.at.slice(0, 10) === date,
    );
    const presence = data.staffPresence.find(
      (row) => (row.teacherId === teacherId || row.staffId === `staff-${teacherId}`) && row.date === date,
    );
    return {
      date,
      expected,
      validated,
      worked: expected === 0 ? login || Boolean(presence) : validated > 0,
      login,
      presence: presence?.status,
      pendingPast: rows.filter((row) => row.past && !row.validation).length,
    };
  });
}

function daysBetween(from: string, to: string) {
  const a = new Date(`${from}T00:00:00Z`).getTime();
  const b = new Date(`${to}T00:00:00Z`).getTime();
  return Math.round((b - a) / 86400000);
}

function lastTeacherMessageAt(teacherId: string, data: SchoolLifeData) {
  const actorId = teacherActorId(teacherId);
  const sent = data.messages
    .filter((row) => row.senderId === actorId && row.receiverId.startsWith("parent:"))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return sent[0]?.createdAt;
}

function lastLoginAt(teacherId: string, data: SchoolLifeData) {
  const actorId = teacherActorId(teacherId);
  return data.activityLogs.find((row) => row.action === "login" && row.actorId === actorId)?.at;
}

function homeworkSince(teacherId: string, classId: string, data: SchoolLifeData, sinceDate: string) {
  return data.homeworks.some(
    (row) => row.teacherId === teacherId && row.classId === classId && row.createdAt.slice(0, 10) >= sinceDate,
  );
}

export function computeAlerts(data: SchoolLifeData, teacherId?: string): TeacherAlert[] {
  if (!isTeacherControlEnabled(data)) return [];
  const today = todayISO();
  const week = datesThisWeek(today);
  const since = addDaysISO(today, -HOMEWORK_RECENT_DAYS);
  const threshold = noMessageDays(data);
  const teachers = teacherId ? data.teachers.filter((row) => row.id === teacherId) : data.teachers;
  const alerts: TeacherAlert[] = [];

  for (const teacher of teachers) {
    const name = teacher.displayName;
    const rowsToday = dayLessonRows(teacher.id, today, data);
    for (const row of rowsToday) {
      if (row.past && !row.validation) {
        alerts.push({
          id: `lesson_unvalidated:${teacher.id}:${row.slot.id}:${today}`,
          kind: "lesson_unvalidated",
          teacherId: teacher.id,
          teacherName: name,
          title: `Cours non validé — ${subjectName(row.slot.subjectId, data)}`,
          detail: `${row.slot.startTime}–${row.slot.endTime} · ${classLabel(row.slot.classId, data)}`,
          href: "/espace-enseignants/cours",
        });
      }
    }

    const classesThisWeek = new Set<string>();
    for (const date of week) {
      for (const slot of slotsForTeacherDate(teacher.id, date, data)) {
        classesThisWeek.add(slot.classId);
      }
    }
    for (const classId of classesThisWeek) {
      if (!homeworkSince(teacher.id, classId, data, since)) {
        alerts.push({
          id: `homework_missing:${teacher.id}:${classId}`,
          kind: "homework_missing",
          teacherId: teacher.id,
          teacherName: name,
          title: `Pas de devoir récent — ${classLabel(classId, data)}`,
          detail: `Aucun devoir créé depuis ${HOMEWORK_RECENT_DAYS} jours alors que des cours ont lieu cette semaine.`,
          href: "/espace-enseignants/devoirs",
        });
      }
    }

    for (const assessment of data.assessments.filter((row) => row.teacherId === teacher.id)) {
      const status = effectiveAssessmentStatus(assessment, today);
      if (status === "en_retard") {
        alerts.push({
          id: `assessment_late:${assessment.id}`,
          kind: "assessment_late",
          teacherId: teacher.id,
          teacherName: name,
          title: `${assessmentKindLabels[assessment.kind]} en retard`,
          detail: `${subjectName(assessment.subjectId, data)} · ${classLabel(assessment.classId, data)} · prévu le ${assessment.date}`,
          href: "/espace-enseignants/controles",
        });
      }
      if (status === "fait") {
        const students = data.students.filter((row) => row.classId === assessment.classId);
        const subjectLabel = subjectName(assessment.subjectId, data);
        const missing = students.filter(
          (student) =>
            !data.grades.some(
              (grade) =>
                grade.studentId === student.id &&
                grade.teacherId === teacher.id &&
                grade.subject === subjectLabel &&
                grade.createdAt.slice(0, 10) >= addDaysISO(assessment.date, -14),
            ),
        );
        if (students.length > 0 && missing.length > 0) {
          alerts.push({
            id: `grades_late:${assessment.id}`,
            kind: "grades_late",
            teacherId: teacher.id,
            teacherName: name,
            title: `Notes manquantes — ${subjectLabel}`,
            detail: `${missing.length}/${students.length} élève(s) sans note après le ${assessmentKindLabels[assessment.kind].toLowerCase()} du ${assessment.date}.`,
            href: "/espace-enseignants/notes",
          });
        }
      }
    }

    const lastMsg = lastTeacherMessageAt(teacher.id, data);
    const lastDay = lastMsg?.slice(0, 10);
    const silentDays = lastDay ? daysBetween(lastDay, today) : 999;
    if (silentDays >= threshold) {
      alerts.push({
        id: `no_message:${teacher.id}`,
        kind: "no_message",
        teacherId: teacher.id,
        teacherName: name,
        title: "Pas de message aux familles",
        detail: lastDay
          ? `Dernier message le ${lastDay} (${silentDays} jour(s)). Seuil : ${threshold} jours.`
          : `Aucun message envoyé. Seuil : ${threshold} jours.`,
        href: "/espace-enseignants/messages",
      });
    }

    const year = data.schoolYears.find((row) => row.id === data.currentSchoolYearId);
    const periodHint = year ? `Trimestre 1 — ${year.label}` : "";
    for (const klass of teacherClasses(teacher.id, data)) {
      const students = data.students.filter((row) => row.classId === klass.id);
      if (students.length === 0) continue;
      const missing = students.filter(
        (student) => !data.bulletins.some((row) => row.studentId === student.id),
      );
      const currentMissing = students.filter(
        (student) =>
          !data.bulletins.some(
            (row) => row.studentId === student.id && (!periodHint || row.period.includes(year?.label ?? "")),
          ),
      );
      if (currentMissing.length === students.length && missing.length === students.length) {
        alerts.push({
          id: `bulletin_missing:${teacher.id}:${klass.id}`,
          kind: "bulletin_missing",
          teacherId: teacher.id,
          teacherName: name,
          title: `Bulletins manquants — ${klass.name}`,
          detail: `${students.length} élève(s) sans bulletin pour l’année en cours.`,
          href: "/espace-enseignants/bulletins",
        });
      }
    }
  }

  return alerts;
}

function rate(part: number, total: number) {
  if (total <= 0) return 1;
  return Math.max(0, Math.min(1, part / total));
}

export function teacherControlScore(teacher: TeacherAccount, data: SchoolLifeData): TeacherControlScore {
  const today = todayISO();
  const week = datesThisWeek(today);
  const since = addDaysISO(today, -HOMEWORK_RECENT_DAYS);
  let expected = 0;
  let validated = 0;
  const classesThisWeek = new Set<string>();
  for (const date of week) {
    const rows = dayLessonRows(teacher.id, date, data);
    expected += rows.length;
    validated += rows.filter((row) => row.validation).length;
    for (const row of rows) classesThisWeek.add(row.slot.classId);
  }
  const classes = teacherClasses(teacher.id, data);
  const classIds = classes.map((item) => item.id);
  const withHomework = [...classesThisWeek].filter((classId) => homeworkSince(teacher.id, classId, data, since)).length;
  const students = data.students.filter((student) => classIds.includes(student.classId));
  const withGrade = students.filter((student) =>
    data.grades.some((grade) => grade.studentId === student.id && grade.teacherId === teacher.id),
  ).length;
  const assessments = data.assessments.filter((row) => row.teacherId === teacher.id);
  const assessmentsDone = assessments.filter((row) => effectiveAssessmentStatus(row, today) === "fait").length;
  const assessmentsLate = assessments.filter((row) => effectiveAssessmentStatus(row, today) === "en_retard").length;
  const validationRate = rate(validated, expected);
  const homeworkRate = rate(withHomework, classesThisWeek.size);
  const gradeRate = rate(withGrade, students.length);
  const score = Math.round(((validationRate + homeworkRate + gradeRate) / 3) * 100);
  const presence = data.staffPresence.find(
    (row) => (row.teacherId === teacher.id || row.staffId === `staff-${teacher.id}`) && row.date === today,
  );
  const alerts = computeAlerts(data, teacher.id);

  return {
    teacherId: teacher.id,
    teacherName: teacher.displayName,
    title: teacher.title,
    classLabels: classes.map((item) => item.name),
    validationRate,
    homeworkRate,
    gradeRate,
    score,
    alertCount: alerts.length,
    presenceToday: presence?.status ?? "—",
    lastMessageAt: lastTeacherMessageAt(teacher.id, data),
    lastLoginAt: lastLoginAt(teacher.id, data),
    lessonsValidated: validated,
    lessonsExpected: expected,
    homeworksRecent: data.homeworks.filter(
      (row) => row.teacherId === teacher.id && row.createdAt.slice(0, 10) >= since,
    ).length,
    assessmentsDone,
    assessmentsLate,
  };
}

export function teacherControlRanking(data: SchoolLifeData) {
  return data.teachers
    .map((teacher) => teacherControlScore(teacher, data))
    .sort((a, b) => b.score - a.score || a.teacherName.localeCompare(b.teacherName, "fr"));
}

export function teacherDashboardKpis(teacherId: string, data: SchoolLifeData) {
  const teacher = data.teachers.find((row) => row.id === teacherId);
  const score = teacher
    ? teacherControlScore(teacher, data)
    : teacherControlScore(
        {
          id: teacherId,
          email: "",
          password: "",
          displayName: "",
          title: "",
          classIds: [],
          subjectIds: [],
        },
        data,
      );
  const today = todayISO();
  const rows = dayLessonRows(teacherId, today, data);
  const alerts = computeAlerts(data, teacherId);
  const presence = data.staffPresence.find(
    (row) => (row.teacherId === teacherId || row.staffId === `staff-${teacherId}`) && row.date === today,
  );
  const lateDays = data.staffPresence.filter((row) => row.teacherId === teacherId && row.status === "late").length;
  return {
    score,
    todayValidated: rows.filter((row) => row.validation).length,
    todayExpected: rows.length,
    todayPending: rows.filter((row) => !row.validation).length,
    todayOverdue: rows.filter((row) => row.past && !row.validation).length,
    homeworks: score.homeworksRecent,
    assessmentsDone: score.assessmentsDone,
    assessmentsLate: score.assessmentsLate,
    gradeRate: score.gradeRate,
    presence: presence?.status,
    lateDays,
    alerts,
  };
}

export function controlCsv(data: SchoolLifeData) {
  const rows = teacherControlRanking(data);
  const header = [
    "Enseignant",
    "Classes",
    "Score",
    "Validations %",
    "Devoirs %",
    "Notes %",
    "Cours validés (semaine)",
    "Cours attendus (semaine)",
    "Devoirs récents",
    "Contrôles faits",
    "Contrôles en retard",
    "Alertes",
    "Présence du jour",
    "Dernier message",
    "Dernière connexion",
  ];
  const lines = [
    header.join(";"),
    ...rows.map((row) =>
      [
        csvCell(row.teacherName),
        csvCell(row.classLabels.join(", ")),
        row.score,
        Math.round(row.validationRate * 100),
        Math.round(row.homeworkRate * 100),
        Math.round(row.gradeRate * 100),
        row.lessonsValidated,
        row.lessonsExpected,
        row.homeworksRecent,
        row.assessmentsDone,
        row.assessmentsLate,
        row.alertCount,
        csvCell(row.presenceToday),
        csvCell(row.lastMessageAt ?? ""),
        csvCell(row.lastLoginAt ?? ""),
      ].join(";"),
    ),
  ];
  return `\uFEFF${lines.join("\n")}`;
}

function csvCell(value: string) {
  if (/[;"\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function journalByClassSubject(teacherId: string, data: SchoolLifeData) {
  const rows = [...data.lessonValidations]
    .filter((row) => row.teacherId === teacherId)
    .sort((a, b) => b.date.localeCompare(a.date) || b.validatedAt.localeCompare(a.validatedAt));
  const groups = new Map<string, LessonValidation[]>();
  for (const row of rows) {
    const key = `${row.classId}::${row.subjectId}`;
    const list = groups.get(key) ?? [];
    list.push(row);
    groups.set(key, list);
  }
  return [...groups.entries()].map(([key, items]) => {
    const [classId, subjectId] = key.split("::");
    return {
      classId,
      subjectId,
      classLabel: classLabel(classId, data),
      subjectLabel: subjectName(subjectId, data),
      items,
    };
  });
}

export function currentBulletinPeriod(data: SchoolLifeData) {
  const year = data.schoolYears.find((row) => row.id === data.currentSchoolYearId);
  return year ? `Trimestre 1 — ${year.label}` : "Trimestre en cours";
}

export function teacherMessageSummaries(teacherId: string, data: SchoolLifeData) {
  const actorId = teacherActorId(teacherId);
  const sent = data.messages
    .filter((row) => row.senderId === actorId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return sent.map((row) => ({
    id: row.id,
    to: row.receiverId,
    studentId: row.studentId,
    content: row.content,
    createdAt: row.createdAt,
    readAt: row.readAt,
    status: row.readAt ? ("lu" as const) : ("envoyé" as const),
  }));
}
