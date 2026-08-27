import type { InvoiceStatus } from "./demo-accounts";
import type { PaymentProviderId } from "./payments";
import { readJsonDocument, writeJsonDocument } from "./persist";

export type LedgerEntry = {
  invoiceId: string;
  studentId: string;
  status: InvoiceStatus;
  provider?: PaymentProviderId;
  updatedAt: string;
  note?: string;
};

async function readLedger(): Promise<LedgerEntry[]> {
  const raw = await readJsonDocument("ledger");
  if (!raw) return [];
  try {
    return JSON.parse(raw) as LedgerEntry[];
  } catch {
    return [];
  }
}

export async function invoiceOverlay(studentId: string) {
  const ledger = await readLedger();
  return new Map(ledger.filter((row) => row.studentId === studentId).map((row) => [row.invoiceId, row]));
}

export async function recordPayment(entry: LedgerEntry) {
  const ledger = await readLedger();
  const next = ledger.filter((row) => row.invoiceId !== entry.invoiceId);
  next.unshift(entry);
  await writeJsonDocument("ledger", next);
}
