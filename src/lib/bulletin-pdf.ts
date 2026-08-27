import type { PDFFont } from "pdf-lib";
import type { Bulletin, Grade, ParentChildView, RosterStudent, SchoolLifeData } from "./school-life-types";
import { currentYear } from "./school-life";
import { enrollmentForStudent } from "./enrollment";
import { school } from "./school";
import { formatDateFr } from "./utils";
import {
  CONTENT_W,
  PAGE_MARGIN,
  createBrandedPdf,
  drawFooterNote,
  drawHLine,
  drawOfficialSchoolHeader,
  drawRect,
  drawText,
  drawTitleBand,
  drawVLine,
  formatGradeCiOrDash,
  pdfSafe,
  personNameSlug,
  trimestreSlug,
  yearSlugFromPeriod,
} from "./pdf-branding";

export { pdfSafe };

export function wrapPdfText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = pdfSafe(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

const SUBJECT_COEF: Record<string, number> = {
  Français: 3,
  Mathématiques: 3,
  EMC: 1,
  Sciences: 2,
  "Histoire-Géographie": 2,
  Anglais: 2,
  EPS: 1,
  "Langage oral": 2,
  Graphisme: 2,
  Éveil: 1,
  Motricité: 1,
};

function termTitle(period: string) {
  const term = trimestreSlug(period);
  if (term === "T1") return "BULLETIN DE NOTES DU PREMIER TRIMESTRE";
  if (term === "T2") return "BULLETIN DE NOTES DU DEUXIEME TRIMESTRE";
  if (term === "T3") return "BULLETIN DE NOTES DU TROISIEME TRIMESTRE";
  if (term === "Annuelle") return "BULLETIN DE NOTES - BILAN ANNUEL";
  return "BULLETIN DE NOTES";
}

function splitName(full: string, student?: RosterStudent) {
  if (student) return { lastName: student.lastName, firstName: student.firstName };
  const parts = full.trim().split(/\s+/);
  return { firstName: parts[0] || full, lastName: parts.slice(1).join(" ") || full };
}

export function bulletinDownloadName(
  child: ParentChildView,
  bulletin: Bulletin,
  extra?: { student?: RosterStudent; className?: string; yearLabel?: string },
) {
  const names = splitName(child.studentName, extra?.student);
  const klass = (extra?.className || child.classroom.split("—")[0] || child.classroom)
    .trim()
    .replace(/\s+/g, "");
  const term = trimestreSlug(bulletin.period);
  const year = yearSlugFromPeriod(bulletin.period, extra?.yearLabel);
  const parts = ["bulletin", personNameSlug(names.lastName, names.firstName), klass, term, year].filter(Boolean);
  return `${parts.join("-")}.pdf`;
}

type SubjectRow = {
  subject: string;
  average: number;
  coef: number;
  weighted: number;
  teacherName: string;
  comment: string;
};

function subjectRows(grades: Grade[], data: SchoolLifeData): SubjectRow[] {
  const bySubject = new Map<string, Grade[]>();
  for (const grade of grades) {
    const list = bySubject.get(grade.subject) ?? [];
    list.push(grade);
    bySubject.set(grade.subject, list);
  }
  return [...bySubject.entries()].map(([subject, list]) => {
    const avg20 =
      list.reduce((sum, grade) => sum + (grade.maxValue ? (grade.value / grade.maxValue) * 20 : grade.value), 0) /
      list.length;
    const coef = SUBJECT_COEF[subject] ?? 1;
    const teacher = data.teachers.find((row) => row.id === list[0]?.teacherId);
    const parts = teacher?.displayName.trim().split(/\s+/) ?? [];
    const last = (parts.slice(1).join(" ") || parts[0] || "").toUpperCase();
    const first = parts[0] ? `${parts[0].charAt(0).toUpperCase()}.` : "";
    return {
      subject,
      average: Math.round(avg20 * 100) / 100,
      coef,
      weighted: Math.round(avg20 * coef * 100) / 100,
      teacherName: teacher ? `M. ${last} ${first}`.trim() : "",
      comment: list.map((g) => g.comment).filter(Boolean).join(" · "),
    };
  });
}

function mentionFromAverage(average: number) {
  if (average >= 16) return "Tableau d'honneur";
  if (average >= 14) return "Encouragements";
  if (average >= 12) return "Tableau d'honneur (passable+)";
  if (average >= 10) return "Passable";
  return "Insuffisant";
}

export async function buildBulletinPdf(input: {
  bulletin: Bulletin;
  child: ParentChildView;
  grades: Grade[];
  data: SchoolLifeData;
}): Promise<Uint8Array> {
  const { bulletin, child, grades, data } = input;
  const student = data.students.find((row) => row.id === child.id);
  const klass = data.classes.find((row) => row.id === child.classId);
  const year = currentYear(data);
  const enrollment = enrollmentForStudent(child.id, data);
  const classmates = data.students.filter((row) => row.classId === child.classId);
  const rows = subjectRows(grades, data);
  const ctx = await createBrandedPdf();
  let y = drawOfficialSchoolHeader(ctx);
  y = drawTitleBand(ctx, y, termTitle(bulletin.period));

  drawText(ctx, `Annee scolaire : ${year?.label ?? "-"}`, PAGE_MARGIN, y, {
    size: 8,
    bold: true,
    maxWidth: CONTENT_W,
    align: "right",
  });
  y += 14;

  const leftW = CONTENT_W * 0.58;
  const rightW = CONTENT_W * 0.42;
  drawRect(ctx.page, PAGE_MARGIN, y, leftW, 48);
  drawRect(ctx.page, PAGE_MARGIN + leftW, y, rightW, 48);
  drawText(ctx, school.name.toUpperCase(), PAGE_MARGIN + 6, y + 6, { size: 8, bold: true });
  drawText(ctx, school.address, PAGE_MARGIN + 6, y + 18, { size: 7 });
  drawText(ctx, `Infoline : ${school.phones[0].display}`, PAGE_MARGIN + 6, y + 30, { size: 7 });
  drawText(ctx, `Classe : ${klass?.name ?? child.classroom}`, PAGE_MARGIN + leftW + 6, y + 6, { size: 8, bold: true });
  drawText(ctx, `Effectif : ${classmates.length}`, PAGE_MARGIN + leftW + 6, y + 18, { size: 7 });
  drawText(ctx, `Redouble : ${enrollment?.repeatYear ? "redoublant" : "non redoublant"}`, PAGE_MARGIN + leftW + 6, y + 30, {
    size: 7,
  });
  y += 54;

  const studentH = 44;
  drawRect(ctx.page, PAGE_MARGIN, y, CONTENT_W, studentH, 1);
  const fullName = student
    ? `${student.lastName.toUpperCase()} ${student.firstName.toUpperCase()}`
    : child.studentName.toUpperCase();
  drawText(ctx, `Nom et prenoms : ${fullName}`, PAGE_MARGIN + 6, y + 4, { size: 8, bold: true });
  drawText(ctx, `Sexe : ${student?.gender ?? "-"}`, PAGE_MARGIN + 6, y + 15, { size: 7 });
  const birth = student?.birthDate ? formatDateFr(student.birthDate).replace(/ /g, " / ") : "-";
  drawText(ctx, `Ne le : ${birth}    a : ${student?.birthPlace || "-"}`, PAGE_MARGIN + 6, y + 25, { size: 7 });
  drawText(ctx, `Nationalite : ${student?.nationality || "-"}`, PAGE_MARGIN + 6, y + 35, { size: 7 });
  const col2 = PAGE_MARGIN + CONTENT_W * 0.48;
  drawText(ctx, `Matricule DREN : ${student?.nationalMatricule || "-"}`, col2, y + 4, { size: 7 });
  drawText(ctx, `Mle Ets : ${student?.matricule || child.matricule || "-"}`, col2, y + 15, { size: 7 });
  drawText(ctx, "Regime : -", col2, y + 25, { size: 7 });
  drawText(ctx, "Interne : Non", col2, y + 35, { size: 7 });
  y += studentH + 8;

  const cols = [
    { key: "discipline", label: "DISCIPLINE", width: 115 },
    { key: "moy", label: "MOY/20", width: 38 },
    { key: "coef", label: "Coef", width: 30 },
    { key: "moyCoef", label: "Moy Coef", width: 46 },
    { key: "rang", label: "Rang", width: 34 },
    { key: "teacher", label: "PROFESSEURS", width: 104 },
    { key: "appr", label: "Appreciation et signature", width: 148.28 },
  ];
  const headerH = 22;
  const rowH = 18;
  drawRect(ctx.page, PAGE_MARGIN, y, CONTENT_W, headerH + rows.length * rowH + 22);
  let cx = PAGE_MARGIN;
  for (const col of cols) {
    drawText(ctx, col.label, cx, y + 7, { size: 6.5, bold: true, maxWidth: col.width, align: "center" });
    cx += col.width;
    if (cx < PAGE_MARGIN + CONTENT_W) drawVLine(ctx.page, cx, y, headerH + rows.length * rowH + 22);
  }
  drawHLine(ctx.page, PAGE_MARGIN, PAGE_MARGIN + CONTENT_W, y + headerH);
  y += headerH;

  let totalCoef = 0;
  rows.forEach((row, index) => {
    const cells = [
      row.subject,
      formatGradeCiOrDash(row.average),
      String(row.coef),
      formatGradeCiOrDash(row.weighted),
      String(index + 1),
      row.teacherName,
      row.comment.slice(0, 42),
    ];
    cx = PAGE_MARGIN;
    cols.forEach((col, i) => {
      drawText(ctx, cells[i], cx + 3, y + 5, { size: 7, maxWidth: col.width - 6 });
      cx += col.width;
    });
    totalCoef += row.coef;
    y += rowH;
    if (index < rows.length - 1) drawHLine(ctx.page, PAGE_MARGIN, PAGE_MARGIN + CONTENT_W, y);
  });

  drawHLine(ctx.page, PAGE_MARGIN, PAGE_MARGIN + CONTENT_W, y);
  drawText(ctx, "TOTAUX / MOYENNE", PAGE_MARGIN + 4, y + 6, { size: 7, bold: true });
  drawText(ctx, String(totalCoef), PAGE_MARGIN + 115 + 38 + 4, y + 6, { size: 7, bold: true });
  drawText(ctx, formatGradeCiOrDash(bulletin.average), PAGE_MARGIN + 115 + 4, y + 6, { size: 8, bold: true });
  y += 28;

  const sumH = 52;
  drawRect(ctx.page, PAGE_MARGIN, y, CONTENT_W, sumH);
  drawVLine(ctx.page, PAGE_MARGIN + CONTENT_W * 0.45, y, sumH);
  drawHLine(ctx.page, PAGE_MARGIN, PAGE_MARGIN + CONTENT_W, y + sumH / 2);
  drawText(ctx, `Moyenne trimestre : ${formatGradeCiOrDash(bulletin.average)}/20    /${classmates.length}`, PAGE_MARGIN + 6, y + 6, {
    size: 8,
    bold: true,
  });
  drawText(ctx, "Rang : -", PAGE_MARGIN + 6, y + 20, { size: 7 });
  drawText(ctx, `M. eleve : ${formatGradeCiOrDash(bulletin.average)}`, PAGE_MARGIN + CONTENT_W * 0.48, y + 6, { size: 7 });
  drawText(ctx, `Heure(s) d'absence : 0`, PAGE_MARGIN + CONTENT_W * 0.48, y + 20, { size: 7 });
  drawText(ctx, `Appreciation : ${bulletin.comment.slice(0, 80)}`, PAGE_MARGIN + 6, y + 32, { size: 7 });
  y += sumH + 10;

  const colW = CONTENT_W / 3;
  const boxH = 56;
  drawRect(ctx.page, PAGE_MARGIN, y, colW, boxH);
  drawRect(ctx.page, PAGE_MARGIN + colW, y, colW, boxH);
  drawRect(ctx.page, PAGE_MARGIN + colW * 2, y, colW, boxH);
  drawText(ctx, "PROFESSEUR PRINCIPAL", PAGE_MARGIN, y + 4, { size: 7, bold: true, maxWidth: colW, align: "center" });
  const homeroom = data.teachers.find((row) => row.classIds.includes(child.classId));
  drawText(ctx, homeroom?.displayName || "Adjoua N'Guessan", PAGE_MARGIN, y + 20, {
    size: 8,
    maxWidth: colW,
    align: "center",
  });
  drawText(ctx, "Appreciation, Signature", PAGE_MARGIN, y + 40, { size: 7, maxWidth: colW, align: "center" });
  drawText(ctx, "VISA DU DIRECTEUR DES ETUDES", PAGE_MARGIN + colW, y + 4, {
    size: 7,
    bold: true,
    maxWidth: colW,
    align: "center",
  });
  drawText(ctx, school.directorName, PAGE_MARGIN + colW, y + 20, { size: 8, maxWidth: colW, align: "center" });
  drawText(ctx, "SIGNATURE", PAGE_MARGIN + colW, y + 40, { size: 7, maxWidth: colW, align: "center" });
  drawText(ctx, "DISTINCTION OU SANCTION", PAGE_MARGIN + colW * 2, y + 4, {
    size: 7,
    bold: true,
    maxWidth: colW,
    align: "center",
  });
  drawText(ctx, mentionFromAverage(bulletin.average), PAGE_MARGIN + colW * 2, y + 22, {
    size: 8,
    maxWidth: colW,
    align: "center",
  });
  y += boxH + 14;
  drawText(ctx, school.directorTitle, PAGE_MARGIN + CONTENT_W / 2, y, {
    size: 9,
    bold: true,
    maxWidth: CONTENT_W / 2,
    align: "center",
  });
  y += 16;
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
  drawFooterNote(ctx, y, `${school.city}, le ${dateStr}`);

  return ctx.pdf.save();
}
