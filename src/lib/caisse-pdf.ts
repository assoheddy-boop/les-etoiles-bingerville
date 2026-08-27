import { financeAccountTypeLabels } from "./accounting";
import {
  CONTENT_W,
  PAGE_MARGIN,
  createBrandedPdf,
  drawOfficialSchoolHeader,
  drawRect,
  drawText,
  drawTitleBand,
  personNameSlug,
} from "./pdf-branding";
import { school } from "./school";
import { classLabel, studentFullName } from "./school-life";
import type { FinanceAccount, FinanceTransaction, RosterStudent, SchoolLifeData, StudentInvoice } from "./school-life-types";
import { formatDateFr } from "./utils";

function money(amount: number) {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

export function caisseTicketName(student: RosterStudent, tx: FinanceTransaction) {
  return `recu-caisse-${personNameSlug(student.lastName, student.firstName)}-${tx.date}.pdf`;
}

export function journalDownloadName(month: string) {
  return `journal-compta-${month}.pdf`;
}

export async function buildCaisseTicketPdf(input: {
  student: RosterStudent;
  invoice: StudentInvoice;
  tx: FinanceTransaction;
  account: FinanceAccount;
  data: SchoolLifeData;
}): Promise<Uint8Array> {
  const { student, invoice, tx, account, data } = input;
  const ctx = await createBrandedPdf();
  let y = drawOfficialSchoolHeader(ctx);
  y = drawTitleBand(ctx, y, "RECU DE CAISSE - SECRETARIAT");

  const rows: Array<[string, string]> = [
    ["N recu", tx.id],
    ["Date", formatDateFr(tx.date)],
    ["Eleve", studentFullName(student)],
    ["Matricule", student.matricule || "-"],
    ["Classe", classLabel(student.classId, data)],
    ["Libelle", invoice.label],
    ["Periode", invoice.period],
    ["Montant encaisse", money(tx.amount)],
    ["Compte", `${account.name} (${financeAccountTypeLabels[account.type]})`],
    ["Reference", tx.reference || invoice.id],
  ];
  drawRect(ctx.page, PAGE_MARGIN, y, CONTENT_W, rows.length * 16 + 8);
  rows.forEach((row, i) => {
    drawText(ctx, `${row[0]} :`, PAGE_MARGIN + 8, y + 6 + i * 16, { size: 9, bold: true });
    drawText(ctx, row[1], PAGE_MARGIN + 160, y + 6 + i * 16, { size: 9 });
  });
  y += rows.length * 16 + 24;
  drawText(ctx, "Cachet secretariat / Le Directeur", PAGE_MARGIN, y, { size: 10, bold: true });
  y += 8;
  drawRect(ctx.page, PAGE_MARGIN, y, 180, 40);
  y += 52;
  drawText(ctx, `Les Etoiles de Bingerville - ${school.city}. Conservez ce recu.`, PAGE_MARGIN, y, { size: 8 });
  return ctx.pdf.save();
}

export async function buildJournalPdf(input: { month: string; data: SchoolLifeData }): Promise<Uint8Array> {
  const { month, data } = input;
  const ctx = await createBrandedPdf();
  let y = drawOfficialSchoolHeader(ctx);
  y = drawTitleBand(ctx, y, `JOURNAL DE TRESORERIE - ${month}`);
  const txs = data.financeTransactions.filter((row) => row.date.slice(0, 7) === month);
  drawText(ctx, "Date", PAGE_MARGIN, y, { size: 8, bold: true });
  drawText(ctx, "Type", PAGE_MARGIN + 70, y, { size: 8, bold: true });
  drawText(ctx, "Libelle", PAGE_MARGIN + 130, y, { size: 8, bold: true });
  drawText(ctx, "Compte", PAGE_MARGIN + 360, y, { size: 8, bold: true });
  drawText(ctx, "Montant", PAGE_MARGIN + 460, y, { size: 8, bold: true });
  y += 14;
  for (const tx of txs.slice(0, 36)) {
    const account = data.financeAccounts.find((row) => row.id === tx.accountId);
    drawText(ctx, tx.date, PAGE_MARGIN, y, { size: 8 });
    drawText(ctx, tx.type === "in" ? "Recette" : "Depense", PAGE_MARGIN + 70, y, { size: 8 });
    drawText(ctx, tx.label.slice(0, 34), PAGE_MARGIN + 130, y, { size: 8 });
    drawText(ctx, (account?.name || "-").slice(0, 16), PAGE_MARGIN + 360, y, { size: 8 });
    drawText(ctx, money(tx.amount), PAGE_MARGIN + 460, y, { size: 8 });
    y += 12;
    if (y > 780) break;
  }
  return ctx.pdf.save();
}
