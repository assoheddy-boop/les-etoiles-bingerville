import { contractTypeLabels, jobTitleLabels, staffDisplayName } from "./hr";
import {
  CONTENT_W,
  PAGE_MARGIN,
  createBrandedPdf,
  drawHLine,
  drawOfficialSchoolHeader,
  drawRect,
  drawText,
  drawTitleBand,
  drawVLine,
  pdfMoney,
  personNameSlug,
} from "./pdf-branding";
import { monthLabel } from "./school-life";
import { school } from "./school";
import type { Payslip, SchoolLifeData, StaffProfile } from "./school-life-types";
import { formatDateFr } from "./utils";

export function payslipDownloadName(profile: StaffProfile, payslip: Payslip) {
  return `fiche-paie-${personNameSlug(profile.lastName, profile.firstName)}-${payslip.month}.pdf`;
}

export async function buildPayslipPdf(input: {
  payslip: Payslip;
  profile: StaffProfile;
  data: SchoolLifeData;
}): Promise<Uint8Array> {
  const { payslip, profile } = input;
  const ctx = await createBrandedPdf();
  let y = drawOfficialSchoolHeader(ctx);
  y = drawTitleBand(ctx, y, "BULLETIN DE PAIE MENSUELLE");

  const blockH = 64;
  drawRect(ctx.page, PAGE_MARGIN, y, CONTENT_W, blockH);
  drawVLine(ctx.page, PAGE_MARGIN + CONTENT_W * 0.55, y, blockH);
  const left = [
    ["MATRICULE", profile.id.replace("staff-", "ETOILES-").toUpperCase()],
    ["DATE D'EMBAUCHE", formatDateFr(profile.startDate)],
    ["CAMPUS", profile.campus],
    ["CONTRAT", contractTypeLabels[profile.contractType]],
    ["E-MAIL", profile.email || "-"],
  ];
  left.forEach((row, i) => {
    drawText(ctx, `${row[0]} : ${row[1]}`, PAGE_MARGIN + 6, y + 6 + i * 11, { size: 6.5, bold: true });
  });
  const rightX = PAGE_MARGIN + CONTENT_W * 0.55 + 6;
  const right = [
    ["PERIODE DE PAIE", monthLabel(payslip.month)],
    ["NOM", profile.lastName.toUpperCase()],
    ["PRENOMS", profile.firstName],
    ["FONCTION", jobTitleLabels[profile.jobTitle]],
    ["TELEPHONE", profile.phone || "-"],
  ];
  right.forEach((row, i) => {
    drawText(ctx, `${row[0]} : ${row[1]}`, rightX, y + 6 + i * 11, { size: 6.5, bold: true });
  });
  y += blockH + 8;

  const cols = [
    { key: "code", label: "CODE", width: 34 },
    { key: "rubrique", label: "RUBRIQUE", width: 164 },
    { key: "base", label: "BASE", width: 68 },
    { key: "rate", label: "NBRE/TAUX", width: 62 },
    { key: "gains", label: "GAINS", width: 68 },
    { key: "deductions", label: "RETENUES", width: 119.28 },
  ];
  const headerH = 18;
  const rowH = 15;
  const tableH = headerH + payslip.lines.length * rowH + rowH;
  drawRect(ctx.page, PAGE_MARGIN, y, CONTENT_W, tableH);
  let cx = PAGE_MARGIN;
  cols.forEach((col) => {
    drawText(ctx, col.label, cx, y + 5, { size: 6.5, bold: true, maxWidth: col.width, align: "center" });
    cx += col.width;
    if (cx < PAGE_MARGIN + CONTENT_W) drawVLine(ctx.page, cx, y, tableH);
  });
  drawHLine(ctx.page, PAGE_MARGIN, PAGE_MARGIN + CONTENT_W, y + headerH);
  y += headerH;

  for (const line of payslip.lines) {
    const gains = line.kind === "earning" ? pdfMoney(line.amount) : "";
    const deductions = line.kind === "deduction" ? pdfMoney(line.amount) : "";
    const cells = [
      line.code || "",
      line.label,
      line.base != null ? pdfMoney(line.base) : "",
      line.rateLabel || (line.rate != null ? `${line.rate}%` : ""),
      gains,
      deductions,
    ];
    cx = PAGE_MARGIN;
    cols.forEach((col, i) => {
      const align = i === 0 || i === 3 ? "center" : i >= 2 ? "right" : "left";
      drawText(ctx, cells[i], cx + (align === "left" ? 4 : 0), y + 4, {
        size: 7,
        maxWidth: col.width - (align === "left" ? 4 : 8),
        align: align === "left" ? "left" : align,
      });
      cx += col.width;
    });
    y += rowH;
    drawHLine(ctx.page, PAGE_MARGIN, PAGE_MARGIN + CONTENT_W, y);
  }

  drawText(ctx, "SOUS-TOTAL", PAGE_MARGIN + 4, y + 4, { size: 7, bold: true });
  drawText(ctx, pdfMoney(payslip.baseSalary + payslip.bonuses), PAGE_MARGIN + 34 + 164 + 68 + 62, y + 4, {
    size: 7,
    bold: true,
    maxWidth: 68,
    align: "right",
  });
  drawText(ctx, pdfMoney(payslip.deductions + payslip.advances), PAGE_MARGIN + 34 + 164 + 68 + 62 + 68, y + 4, {
    size: 7,
    bold: true,
    maxWidth: 119.28,
    align: "right",
  });
  y += rowH + 10;

  const boxW = 200;
  const boxX = PAGE_MARGIN + CONTENT_W - boxW;
  const totals = [
    ["TOTAL GAINS", pdfMoney(payslip.baseSalary + payslip.bonuses)],
    ["TOTAL RETENUES", pdfMoney(payslip.deductions + payslip.advances)],
    ["NET A PAYER", pdfMoney(payslip.netPay)],
  ];
  totals.forEach((row, i) => {
    drawRect(ctx.page, boxX, y + i * 18, boxW, 18);
    drawVLine(ctx.page, boxX + 108, y + i * 18, 18);
    drawText(ctx, row[0], boxX + 4, y + i * 18 + 5, { size: 7, bold: true });
    drawText(ctx, row[1], boxX + 108, y + i * 18 + 5, { size: i === 2 ? 8 : 7, bold: i === 2, maxWidth: 92, align: "right" });
  });
  y += 18 * 3 + 14;

  const colW = CONTENT_W / 3;
  const h = 48;
  drawRect(ctx.page, PAGE_MARGIN, y, CONTENT_W, h);
  drawVLine(ctx.page, PAGE_MARGIN + colW, y, h);
  drawVLine(ctx.page, PAGE_MARGIN + colW * 2, y, h);
  drawText(ctx, "REGLEMENT en Francs CFA", PAGE_MARGIN + 4, y + 4, { size: 7, bold: true });
  drawText(ctx, "[x] Espece    [ ] Cheque    [ ] Virement", PAGE_MARGIN + 8, y + 20, { size: 7 });
  drawText(ctx, "L' EMPLOYE", PAGE_MARGIN + colW, y + 4, { size: 7, bold: true, maxWidth: colW, align: "center" });
  drawText(ctx, "Signature", PAGE_MARGIN + colW, y + 30, { size: 6, maxWidth: colW, align: "center" });
  drawText(ctx, "L' EMPLOYEUR", PAGE_MARGIN + colW * 2, y + 4, { size: 7, bold: true, maxWidth: colW, align: "center" });
  drawText(ctx, school.directorName.toUpperCase(), PAGE_MARGIN + colW * 2, y + 20, {
    size: 7,
    maxWidth: colW,
    align: "center",
  });
  drawText(ctx, school.directorTitle, PAGE_MARGIN + colW * 2, y + 32, { size: 6, maxWidth: colW, align: "center" });
  y += h + 10;
  drawText(ctx, `Agent : ${staffDisplayName(profile)}  ·  Les Etoiles de Bingerville - Bingerville`, PAGE_MARGIN, y, { size: 7 });

  return ctx.pdf.save();
}
