import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import { menApprovals, school } from "./school";

export function pdfSafe(text: string) {
  return text
    .replace(/[’‘]/g, "'")
    .replace(/[“”«»]/g, '"')
    .replace(/[—–]/g, "-")
    .replace(/œ/g, "oe")
    .replace(/Œ/g, "OE")
    .replace(/…/g, "...")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, " ");
}

export const PAGE_W = 595.28;
export const PAGE_H = 841.89;
export const PAGE_MARGIN = 40;
export const CONTENT_W = PAGE_W - PAGE_MARGIN * 2;

export const INK = rgb(0, 0, 0);
export const NAVY = rgb(0, 0.32, 0.8);
export const MUTED = rgb(0.2, 0.2, 0.2);

export type PdfCtx = {
  pdf: PDFDocument;
  page: PDFPage;
  font: PDFFont;
  bold: PDFFont;
  logo?: PDFImage;
};

export function yFromTop(fromTop: number) {
  return PAGE_H - fromTop;
}

export function pdfMoney(amount: number) {
  if (!Number.isFinite(amount) || amount === 0) return "";
  return Math.round(amount).toLocaleString("fr-FR").replace(/\u202f/g, " ");
}

export function pdfMoneyDash(amount: number) {
  return pdfMoney(amount) || "0";
}

export function formatGradeCi(value: number | null | undefined, decimals = 2) {
  if (value == null || !Number.isFinite(value)) return "";
  return value.toFixed(decimals).replace(".", ",");
}

export function formatGradeCiOrDash(value: number | null | undefined, decimals = 2) {
  return formatGradeCi(value, decimals) || "-";
}

export function stripAccents(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function filenameNom(value: string, maxLen = 32) {
  const cleaned = stripAccents(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLen);
  return cleaned || "INCONNU";
}

export function filenamePrenom(value: string, maxLen = 32) {
  const cleaned = stripAccents(value)
    .trim()
    .split(/[\s'-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("-")
    .slice(0, maxLen);
  return cleaned || "Inconnu";
}

export function personNameSlug(lastName: string, firstName: string) {
  return `${filenameNom(lastName)}-${filenamePrenom(firstName)}`;
}

export function trimestreSlug(period: string) {
  const raw = period.toUpperCase();
  if (/\bT1\b/.test(raw) || /PREMIER|1ER\s*TRIM/.test(raw) || /TRIMESTRE\s*1/.test(raw)) return "T1";
  if (/\bT2\b/.test(raw) || /DEUXIEME|2E\s*TRIM/.test(raw) || /TRIMESTRE\s*2/.test(raw)) return "T2";
  if (/\bT3\b/.test(raw) || /TROISIEME|3E\s*TRIM/.test(raw) || /TRIMESTRE\s*3/.test(raw)) return "T3";
  if (/ANNUEL/.test(raw)) return "Annuelle";
  return stripAccents(period).replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "") || "Periode";
}

export function yearSlugFromPeriod(period: string, fallback?: string) {
  const match = period.match(/(20\d{2})\s*[-/]\s*(20\d{2})/);
  if (match) return `${match[1]}-${match[2]}`;
  return fallback?.replace(/\s+/g, "-") || "";
}

export async function createBrandedPdf() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([PAGE_W, PAGE_H]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let logo: PDFImage | undefined;
  try {
    const buf = await readFile(path.join(process.cwd(), "public", "images", "logo-etoiles.png"));
    logo = await pdf.embedPng(buf);
  } catch {
    logo = undefined;
  }
  return { pdf, page, font, bold, logo } satisfies PdfCtx;
}

export function drawRect(
  page: PDFPage,
  x: number,
  fromTop: number,
  w: number,
  h: number,
  borderWidth = 0.75,
) {
  page.drawRectangle({
    x,
    y: yFromTop(fromTop) - h,
    width: w,
    height: h,
    borderColor: INK,
    borderWidth,
  });
}

export function drawHLine(page: PDFPage, x1: number, x2: number, fromTop: number) {
  page.drawLine({
    start: { x: x1, y: yFromTop(fromTop) },
    end: { x: x2, y: yFromTop(fromTop) },
    thickness: 0.75,
    color: INK,
  });
}

export function drawVLine(page: PDFPage, x: number, fromTop: number, h: number) {
  const top = yFromTop(fromTop);
  page.drawLine({
    start: { x, y: top },
    end: { x, y: top - h },
    thickness: 0.75,
    color: INK,
  });
}

export function drawText(
  ctx: PdfCtx,
  text: string,
  x: number,
  fromTop: number,
  opts?: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb>; maxWidth?: number; align?: "left" | "center" | "right" },
) {
  const size = opts?.size ?? 8;
  const font = opts?.bold ? ctx.bold : ctx.font;
  const color = opts?.color ?? INK;
  const safe = pdfSafe(text);
  let drawX = x;
  if (opts?.maxWidth && opts.align && opts.align !== "left") {
    const width = font.widthOfTextAtSize(safe, size);
    if (opts.align === "center") drawX = x + (opts.maxWidth - width) / 2;
    if (opts.align === "right") drawX = x + opts.maxWidth - width;
  }
  ctx.page.drawText(safe, { x: drawX, y: yFromTop(fromTop) - size, size, font, color });
}

function drawLogo(ctx: PdfCtx, x: number, fromTop: number, box: number) {
  if (!ctx.logo) return;
  const pad = 4;
  const size = box - pad * 2;
  const dims = ctx.logo.scaleToFit(size, size);
  ctx.page.drawImage(ctx.logo, {
    x: x + pad + (size - dims.width) / 2,
    y: yFromTop(fromTop) - pad - dims.height - (size - dims.height) / 2,
    width: dims.width,
    height: dims.height,
  });
}

export function drawOfficialSchoolHeader(ctx: PdfCtx) {
  const x = PAGE_MARGIN;
  let y = PAGE_MARGIN;
  const boxH = 68;
  const logoColW = 50;
  const showLogos = Boolean(ctx.logo);
  const leftColW = showLogos ? logoColW : 0;
  const centerX = x + leftColW;
  const centerW = CONTENT_W - leftColW * (showLogos ? 2 : 0);

  drawRect(ctx.page, x, y, CONTENT_W, boxH, 0.6);
  if (showLogos) {
    drawVLine(ctx.page, x + logoColW, y, boxH);
    drawVLine(ctx.page, x + CONTENT_W - logoColW, y, boxH);
    drawLogo(ctx, x, y, logoColW);
    drawLogo(ctx, x + CONTENT_W - logoColW, y, logoColW);
  }

  const agrement = menApprovals.map((row) => `${row.cycle} ${row.decision}`).join("  |  ");
  const contact = `${school.bp}  ·  Tel. ${school.phones[0].display}  ·  ${school.email}`;
  drawText(ctx, school.name.toUpperCase(), centerX, y + 10, {
    size: 11,
    bold: true,
    color: NAVY,
    maxWidth: centerW,
    align: "center",
  });
  drawText(ctx, agrement, centerX, y + 26, { size: 6.5, maxWidth: centerW, align: "center" });
  drawText(ctx, school.educationLevels, centerX, y + 36, { size: 6.5, maxWidth: centerW, align: "center" });
  drawText(ctx, contact, centerX, y + 46, { size: 6.5, maxWidth: centerW, align: "center" });
  drawText(ctx, school.address, centerX, y + 56, { size: 6, maxWidth: centerW, align: "center" });

  y += boxH + 6;
  drawText(ctx, school.dren, x, y, { size: 7, maxWidth: CONTENT_W, align: "center" });
  return y + 12;
}

export function drawTitleBand(ctx: PdfCtx, fromTop: number, title: string) {
  const h = 20;
  drawRect(ctx.page, PAGE_MARGIN, fromTop, CONTENT_W, h, 1);
  drawText(ctx, title, PAGE_MARGIN, fromTop + 5, {
    size: 11,
    bold: true,
    maxWidth: CONTENT_W,
    align: "center",
  });
  return fromTop + h + 6;
}

export function drawFooterNote(ctx: PdfCtx, fromTop: number, cityDate: string) {
  drawText(ctx, cityDate, PAGE_MARGIN, fromTop, { size: 8, maxWidth: CONTENT_W, align: "right" });
  drawText(ctx, "Les Etoiles de Bingerville - Bingerville. Aucun duplicata ne sera delivre.", PAGE_MARGIN, fromTop + 14, {
    size: 7,
    maxWidth: CONTENT_W,
    align: "center",
  });
}
