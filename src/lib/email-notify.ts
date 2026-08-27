import { normalizeEmail, schoolInbox, sendMail, summarizeMail, type MailResult } from "./email";
import {
  cashPaymentEmail,
  contactSchoolEmail,
  homeworkEmail,
  inscriptionAckEmail,
  inscriptionSchoolEmail,
  parentModuleEmail,
  pickupCodeEmail,
  teacherMessageEmail,
} from "./email-templates";
import { formatFcfa } from "./payments";
import { classLabel, parentOfStudent, resolveActorName, studentFullName } from "./school-life";
import type {
  Homework,
  ParentAccount,
  PickupAuthorization,
  RosterStudent,
  SchoolLifeData,
  SchoolMessage,
} from "./school-life-types";
import { formatDateFr } from "./utils";

function parentEmail(parent: ParentAccount | undefined, student?: RosterStudent) {
  return normalizeEmail(parent?.email) || normalizeEmail(student?.contactEmail);
}

async function sendAll(jobs: Array<Promise<MailResult>>) {
  if (jobs.length === 0) return { status: "skipped" as const, reason: "no_recipient" };
  const results = await Promise.all(jobs);
  return summarizeMail(results);
}

export async function notifyPublicContact(input: {
  id: string;
  name: string;
  phone: string;
  email?: string;
  cycle?: string;
  message: string;
}): Promise<MailResult> {
  const tpl = contactSchoolEmail(input);
  return sendMail({
    to: schoolInbox(),
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    tag: "contact",
    replyTo: input.email,
    id: input.id,
  });
}

export async function notifyPublicInscription(input: {
  id: string;
  name: string;
  phone: string;
  email?: string;
  cycle?: string;
  message: string;
}): Promise<MailResult> {
  const schoolTpl = inscriptionSchoolEmail(input);
  const jobs: Array<Promise<MailResult>> = [
    sendMail({
      to: schoolInbox(),
      subject: schoolTpl.subject,
      html: schoolTpl.html,
      text: schoolTpl.text,
      tag: "inscription",
      replyTo: input.email,
      id: input.id,
    }),
  ];
  const parentTo = normalizeEmail(input.email);
  if (parentTo) {
    const ack = inscriptionAckEmail({ name: input.name, cycle: input.cycle });
    jobs.push(
      sendMail({
        to: parentTo,
        subject: ack.subject,
        html: ack.html,
        text: ack.text,
        tag: "inscription-ack",
        id: input.id,
      }),
    );
  }
  return sendAll(jobs);
}

export async function notifyTeacherToParentMessage(data: SchoolLifeData, message: SchoolMessage) {
  if (!message.receiverId.startsWith("parent:")) return;
  const studentId = message.studentId || message.receiverId.slice("parent:".length);
  const student = data.students.find((row) => row.id === studentId);
  if (!student) return;
  const parent = parentOfStudent(student, data);
  const to = parentEmail(parent, student);
  if (!to) return;
  const tpl = teacherMessageEmail({
    parentName: parent?.displayName || student.parentName || "Parent",
    studentName: studentFullName(student),
    senderName: resolveActorName(message.senderId, data),
    content: message.content,
  });
  await sendMail({
    to,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    tag: "message",
    id: message.id,
  });
}

export async function notifyHomeworkCreated(data: SchoolLifeData, homework: Homework) {
  const klass = classLabel(homework.classId, data);
  const seen = new Set<string>();
  const jobs: Array<Promise<MailResult>> = [];
  for (const student of data.students.filter((row) => row.classId === homework.classId)) {
    const parent = parentOfStudent(student, data);
    const to = parentEmail(parent, student);
    if (!to) continue;
    const key = to.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const tpl = homeworkEmail({
      parentName: parent?.displayName || student.parentName || "Parent",
      studentName: studentFullName(student),
      classLabel: klass,
      title: homework.title,
      description: homework.description || undefined,
      dueDate: homework.dueDate,
    });
    jobs.push(
      sendMail({
        to,
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
        tag: "homework",
        id: homework.id,
      }),
    );
  }
  await sendAll(jobs);
}

export async function notifyCashPaymentValidated(
  data: SchoolLifeData,
  input: { paymentId: string; parentId: string; amount: number; date: string; studentId?: string },
) {
  const parent = data.parents.find((row) => row.id === input.parentId);
  const student = input.studentId ? data.students.find((row) => row.id === input.studentId) : undefined;
  const to = parentEmail(parent, student);
  if (!to || !parent) return;
  const tpl = cashPaymentEmail({
    parentName: parent.displayName,
    amountLabel: formatFcfa(input.amount),
    dateLabel: formatDateFr(input.date),
    studentName: student ? studentFullName(student) : undefined,
  });
  await sendMail({
    to,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    tag: "payment",
    id: input.paymentId,
  });
}

export async function notifyParentModuleActivated(parent: ParentAccount) {
  const to = parentEmail(parent);
  if (!to) return;
  const tpl = parentModuleEmail({ parentName: parent.displayName });
  await sendMail({
    to,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    tag: "parent-module",
    id: parent.id,
  });
}

export async function notifyPickupCodesCreated(
  data: SchoolLifeData,
  auths: PickupAuthorization[],
) {
  const seen = new Set<string>();
  const jobs: Array<Promise<MailResult>> = [];
  for (const auth of auths) {
    const student = data.students.find((row) => row.id === auth.studentId);
    if (!student) continue;
    const parent = parentOfStudent(student, data);
    const to = parentEmail(parent, student);
    if (!to) continue;
    const key = to.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const tpl = pickupCodeEmail({
      parentName: parent?.displayName || student.parentName || "Parent",
      studentName: studentFullName(student),
    });
    jobs.push(
      sendMail({
        to,
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
        tag: "pickup",
        id: auth.id,
      }),
    );
  }
  await sendAll(jobs);
}
