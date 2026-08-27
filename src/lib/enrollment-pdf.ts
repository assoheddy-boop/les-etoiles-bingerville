import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { pdfSafe, wrapPdfText } from "./bulletin-pdf";
import { ENROLLMENT_DOCUMENTS, enrollmentStatusLabel, lv2Label, mergeChecklist } from "./enrollment";
import { school } from "./school";
import type { RosterStudent, SchoolLifeData, StudentEnrollment } from "./school-life-types";
import { classLabel, currentYear, studentFullName } from "./school-life";
import { formatDateFr } from "./utils";

const GREEN = rgb(0.09, 0.37, 0.24);
const MUTED = rgb(0.32, 0.35, 0.32);
const INK = rgb(0.12, 0.14, 0.13);

function dash(value?: string | null) {
  return value ? pdfSafe(value) : "-";
}

function genderLabel(value?: string) {
  if (value === "F") return "F";
  if (value === "M") return "M";
  return "-";
}

export async function buildEnrollmentFichePdf(input: {
  student: RosterStudent;
  enrollment?: StudentEnrollment;
  data: SchoolLifeData;
  effectif: { male: number; female: number; total: number };
}) {
  const year = currentYear(input.data);
  const schoolYear = year?.label ?? "-";
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  const left = 40;
  const usable = width - 80;
  let y = height - 40;

  page.drawRectangle({ x: left, y: 40, width: usable, height: height - 80, borderColor: INK, borderWidth: 1 });

  page.drawText(pdfSafe("FICHE D'INSCRIPTION"), {
    x: left,
    y: y - 8,
    size: 14,
    font: bold,
    color: GREEN,
  });
  y -= 26;
  page.drawText(pdfSafe(`Annee scolaire ${schoolYear}`), { x: left, y, size: 11, font, color: INK });
  y -= 18;
  page.drawText(pdfSafe(school.name), { x: left + 8, y, size: 9, font, color: INK });
  y -= 12;
  page.drawText(pdfSafe(school.address), { x: left + 8, y, size: 8, font, color: MUTED });
  y -= 12;
  page.drawText(pdfSafe(`Infoline : ${school.phones[0].display}`), {
    x: left + 8,
    y,
    size: 8,
    font,
    color: MUTED,
  });

  const enrolledAt = input.enrollment?.enrolledAt ? formatDateFr(input.enrollment.enrolledAt) : formatDateFr(new Date().toISOString());
  page.drawText(pdfSafe(`Date inscription : ${enrolledAt}`), {
    x: width - 220,
    y: height - 58,
    size: 8,
    font,
    color: INK,
  });
  page.drawRectangle({
    x: width - 160,
    y: height - 108,
    width: 112,
    height: 36,
    borderColor: MUTED,
    borderWidth: 0.8,
  });
  page.drawText(pdfSafe("Effectif classe"), { x: width - 152, y: height - 86, size: 8, font, color: MUTED });
  page.drawText(
    pdfSafe(`M: ${input.effectif.male}   F: ${input.effectif.female}   T: ${input.effectif.total}`),
    { x: width - 152, y: height - 100, size: 9, font: bold, color: INK },
  );
  page.drawRectangle({
    x: width - 135,
    y: height - 220,
    width: 85,
    height: 95,
    borderColor: MUTED,
    borderWidth: 0.8,
  });
  page.drawText(pdfSafe("PHOTO"), { x: width - 112, y: height - 175, size: 8, font, color: MUTED });

  y = height - 130;
  const fields: Array<[string, string]> = [
    ["Mle etab.", dash(input.student.matricule)],
    ["Mle nat. (MEN)", dash(input.student.nationalMatricule)],
    ["Nom", dash(input.student.lastName)],
    ["Prenoms", dash(input.student.firstName)],
    ["Ne(e) le", input.student.birthDate ? formatDateFr(input.student.birthDate) : "-"],
    ["A", dash(input.student.birthPlace)],
    ["Sexe", genderLabel(input.student.gender)],
    ["Nationalite", dash(input.student.nationality)],
    ["Extrait Ndeg", dash(input.enrollment?.birthCertNumber)],
    ["Date deli.", input.enrollment?.birthCertDate ? formatDateFr(input.enrollment.birthCertDate) : "-"],
    ["Lieu deli.", dash(input.enrollment?.birthCertPlace)],
    ["Classe", pdfSafe(classLabel(input.student.classId, input.data))],
    ["Statut", pdfSafe(enrollmentStatusLabel(input.enrollment?.enrollmentStatus))],
    ["LV2", pdfSafe(lv2Label(input.enrollment?.lv2))],
    ["Serie", dash(input.student.series)],
    ["Redoublant", input.enrollment?.repeatYear ? "Oui" : "Non"],
    ["Boursier", input.enrollment?.isScholarship ? "Oui" : "Non"],
  ];

  page.drawText(pdfSafe("IDENTITE & SCOLARITE"), { x: left + 8, y, size: 10, font: bold, color: GREEN });
  y -= 16;
  for (const [label, value] of fields) {
    page.drawText(pdfSafe(label), { x: left + 8, y, size: 8, font, color: MUTED });
    page.drawText(value, { x: left + 118, y, size: 8, font: bold, color: INK });
    y -= 13;
  }

  y -= 6;
  page.drawText(pdfSafe("FAMILLE & PARCOURS"), { x: left + 8, y, size: 10, font: bold, color: GREEN });
  y -= 16;
  const family: Array<[string, string]> = [
    ["Pere", dash(input.student.fatherName)],
    ["Mere", dash(input.student.motherName)],
    ["Tuteur", dash(input.student.guardianName)],
    ["Tel. tuteur", dash(input.student.guardianPhone)],
    ["Contact", dash(input.student.contactPhone)],
    ["E-mail", dash(input.student.contactEmail)],
    ["Ndeg decision", dash(input.enrollment?.decisionNumber)],
    ["Ndeg transfert", dash(input.enrollment?.transferRef)],
    ["Etab. origine", dash(input.enrollment?.previousSchool)],
    ["Classe suivie", dash(input.enrollment?.previousClass)],
  ];
  for (const [label, value] of family) {
    page.drawText(pdfSafe(label), { x: left + 8, y, size: 8, font, color: MUTED });
    page.drawText(value, { x: left + 118, y, size: 8, font: bold, color: INK });
    y -= 13;
  }

  y -= 8;
  page.drawText(pdfSafe("DOSSIER - PIECES FOURNIES"), { x: left + 8, y, size: 10, font: bold, color: GREEN });
  y -= 14;
  const checklist = mergeChecklist(input.enrollment?.documentsChecklist);
  ENROLLMENT_DOCUMENTS.forEach((doc, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const mark = checklist[doc.key] ? "[X]" : "[ ]";
    page.drawText(pdfSafe(`${mark}  ${doc.label}`), {
      x: left + 8 + col * 240,
      y: y - row * 12,
      size: 8,
      font,
      color: INK,
    });
  });
  y -= Math.ceil(ENROLLMENT_DOCUMENTS.length / 2) * 12 + 10;

  if (input.enrollment?.notes) {
    const lines = wrapPdfText(`Observations : ${input.enrollment.notes}`, font, 8, usable - 16);
    for (const line of lines.slice(0, 3)) {
      page.drawText(pdfSafe(line), { x: left + 8, y, size: 8, font, color: INK });
      y -= 11;
    }
  }

  page.drawText(pdfSafe("Le Secretariat"), { x: left + 40, y: 70, size: 9, font, color: INK });
  page.drawText(pdfSafe("Le Directeur"), { x: width - 160, y: 70, size: 9, font, color: INK });
  page.drawText(pdfSafe(`Document genere pour ${school.name} - ${new Date().toLocaleDateString("fr-FR")}`), {
    x: left,
    y: 52,
    size: 7,
    font,
    color: MUTED,
  });

  const bytes = await pdf.save();
  const filename = `fiche-inscription-${input.student.id}-${schoolYear.replace("/", "-")}.pdf`;
  return { bytes, filename };
}

export async function buildCertificatScolaritePdf(input: {
  student: RosterStudent;
  data: SchoolLifeData;
}) {
  const year = currentYear(input.data)?.label ?? "-";
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  let y = height - 72;

  page.drawText(pdfSafe(school.name), { x: 50, y, size: 16, font: bold, color: GREEN });
  y -= 18;
  page.drawText(pdfSafe(school.address), { x: 50, y, size: 9, font, color: MUTED });
  y -= 36;
  page.drawText(pdfSafe("CERTIFICAT DE SCOLARITE"), { x: 50, y, size: 16, font: bold, color: INK });
  y -= 22;
  page.drawText(pdfSafe(`Annee scolaire : ${year}`), { x: 50, y, size: 11, font, color: INK });
  y -= 36;

  const lines = [
    "Je soussigne(e), Directeur(trice) de l'etablissement ci-dessus, certifie que :",
    "",
    `Nom et prenoms : ${studentFullName(input.student)}`,
    input.student.nationalMatricule ? `Matricule national (MEN) : ${input.student.nationalMatricule}` : null,
    input.student.matricule ? `Matricule etablissement : ${input.student.matricule}` : null,
    input.student.birthDate
      ? `Ne(e) le : ${formatDateFr(input.student.birthDate)}${input.student.birthPlace ? ` a ${input.student.birthPlace}` : ""}`
      : null,
    input.student.gender ? `Sexe : ${input.student.gender === "F" ? "Feminin" : "Masculin"}` : null,
    "",
    `Est regulierement inscrit(e) en classe de ${classLabel(input.student.classId, input.data)} pour l'annee scolaire ${year}.`,
    "",
    "En foi de quoi, le present certificat est delivre pour servir et valoir ce que de droit.",
  ].filter((line): line is string => line !== null);

  for (const line of lines) {
    if (!line) {
      y -= 10;
      continue;
    }
    const wrapped = wrapPdfText(line, font, 11, width - 100);
    for (const wrap of wrapped) {
      page.drawText(pdfSafe(wrap), { x: 50, y, size: 11, font, color: INK });
      y -= 16;
    }
  }

  y -= 20;
  page.drawText(pdfSafe(`Fait a ${school.city}, le ${today}`), {
    x: 50,
    y,
    size: 11,
    font,
    color: INK,
  });
  y -= 48;
  page.drawText(pdfSafe("Le Directeur"), { x: width - 180, y, size: 11, font, color: INK });

  const bytes = await pdf.save();
  return { bytes, filename: `certificat-scolarite-${input.student.id}.pdf` };
}

export async function buildAttestationInscriptionPdf(input: {
  student: RosterStudent;
  enrollment?: StudentEnrollment;
  data: SchoolLifeData;
}) {
  const year = currentYear(input.data)?.label ?? "-";
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const enrolledAt = input.enrollment?.enrolledAt ? formatDateFr(input.enrollment.enrolledAt) : today;
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  let y = height - 72;

  page.drawText(pdfSafe(school.name), { x: 50, y, size: 16, font: bold, color: GREEN });
  y -= 18;
  page.drawText(pdfSafe(school.address), { x: 50, y, size: 9, font, color: MUTED });
  y -= 36;
  page.drawText(pdfSafe("ATTESTATION D'INSCRIPTION"), { x: 50, y, size: 16, font: bold, color: INK });
  y -= 22;
  page.drawText(pdfSafe(`Annee scolaire : ${year}`), { x: 50, y, size: 11, font, color: INK });
  y -= 36;

  const lines = [
    "Je soussigne(e), Directeur(trice) de l'etablissement ci-dessus, atteste que :",
    "",
    `L'eleve ${studentFullName(input.student)}`,
    input.student.nationalMatricule ? `(Matricule national : ${input.student.nationalMatricule})` : null,
    "",
    `A ete inscrit(e) au titre de : ${enrollmentStatusLabel(input.enrollment?.enrollmentStatus)}`,
    `En classe de : ${classLabel(input.student.classId, input.data)}`,
    `Date d'inscription : ${enrolledAt}`,
    input.enrollment?.previousSchool ? `Provenance : ${input.enrollment.previousSchool}` : null,
    "",
    "La presente attestation est delivree a la demande de l'interesse(e) pour les usages administratifs.",
  ].filter((line): line is string => line !== null);

  for (const line of lines) {
    if (!line) {
      y -= 10;
      continue;
    }
    const wrapped = wrapPdfText(line, font, 11, width - 100);
    for (const wrap of wrapped) {
      page.drawText(pdfSafe(wrap), { x: 50, y, size: 11, font, color: INK });
      y -= 16;
    }
  }

  y -= 20;
  page.drawText(pdfSafe(`Fait a ${school.city}, le ${today}`), { x: 50, y, size: 11, font, color: INK });
  y -= 48;
  page.drawText(pdfSafe("Le Secretariat"), { x: width - 180, y, size: 11, font, color: INK });

  const bytes = await pdf.save();
  return { bytes, filename: `attestation-inscription-${input.student.id}.pdf` };
}
