import { newId, studentFullName, todayISO } from "./school-life";
import type {
  ExpenseCategoryKind,
  FinanceAccountType,
  FinanceTxType,
  SchoolLifeData,
  SocialCase,
  SocialDiscountType,
  StudentInvoice,
  SupplierInvoiceStatus,
} from "./school-life-types";

export const financeAccountTypeLabels: Record<FinanceAccountType, string> = {
  cash: "Caisse (espèces)",
  wave: "Wave",
  orange_money: "Orange Money",
  bank: "Banque",
};

export const categoryKindLabels: Record<ExpenseCategoryKind, string> = {
  income: "Recette",
  expense: "Dépense",
};

export const txTypeLabels: Record<FinanceTxType, string> = {
  in: "Recette",
  out: "Dépense",
};

export const supplierInvoiceStatusLabels: Record<SupplierInvoiceStatus, string> = {
  pending: "En attente",
  paid: "Payée",
  cancelled: "Annulée",
};

export const socialDiscountLabels: Record<SocialDiscountType, string> = {
  percent: "Pourcentage (%)",
  fixed: "Montant fixe (FCFA)",
  installment: "Échéancier (note)",
};

export const socialMotifs = [
  { value: "orphelin", label: "Orphelin / orpheline" },
  { value: "precarite", label: "Précarité" },
  { value: "famille-nombreuse", label: "Famille nombreuse" },
  { value: "personnel", label: "Enfant du personnel" },
  { value: "autre", label: "Autre" },
] as const;

export const comptaAdminNav = [
  { href: "/admin/compta", label: "Trésorerie" },
  { href: "/admin/compta/comptes", label: "Comptes" },
  { href: "/admin/compta/depenses", label: "Dépenses" },
  { href: "/admin/compta/factures", label: "Factures fournisseurs" },
  { href: "/admin/compta/budget", label: "Budget" },
] as const;

export function isFinanceAccountType(value: string): value is FinanceAccountType {
  return value in financeAccountTypeLabels;
}

export function isCategoryKind(value: string): value is ExpenseCategoryKind {
  return value in categoryKindLabels;
}

export function isTxType(value: string): value is FinanceTxType {
  return value === "in" || value === "out";
}

export function isSocialDiscountType(value: string): value is SocialDiscountType {
  return value in socialDiscountLabels;
}

export function motifLabel(value: string) {
  return socialMotifs.find((row) => row.value === value)?.label ?? value;
}

export function accountById(id: string, data: SchoolLifeData) {
  return data.financeAccounts.find((row) => row.id === id);
}

export function categoryById(id: string | undefined, data: SchoolLifeData) {
  if (!id) return undefined;
  return data.expenseCategories.find((row) => row.id === id);
}

export function activeSocialCase(studentId: string, data: SchoolLifeData) {
  return data.socialCases.find((row) => row.studentId === studentId && row.status === "actif");
}

export function discountLabel(cas: SocialCase) {
  if (cas.discountType === "percent") return `${cas.discountValue} %`;
  if (cas.discountType === "fixed") return `${cas.discountValue.toLocaleString("fr-FR")} FCFA`;
  return cas.note || "Échéancier";
}

export function applySocialDiscount(amount: number, cas?: SocialCase | null) {
  if (!cas || cas.status !== "actif") return amount;
  if (cas.discountType === "percent") {
    return Math.max(0, Math.round(amount * (1 - cas.discountValue / 100)));
  }
  if (cas.discountType === "fixed") {
    return Math.max(0, amount - cas.discountValue);
  }
  return amount;
}

export function invoiceDueAmount(invoice: StudentInvoice, data: SchoolLifeData) {
  if (invoice.status === "paid") return 0;
  return applySocialDiscount(invoice.amountFcfa, activeSocialCase(invoice.studentId, data));
}

export function studentFeeBalance(studentId: string, data: SchoolLifeData) {
  const invoices = data.invoices.filter((row) => row.studentId === studentId);
  const cas = activeSocialCase(studentId, data);
  const catalog = invoices.reduce((sum, row) => sum + row.amountFcfa, 0);
  const due = invoices
    .filter((row) => row.status !== "paid")
    .reduce((sum, row) => sum + applySocialDiscount(row.amountFcfa, cas), 0);
  const paid = invoices.filter((row) => row.status === "paid").reduce((sum, row) => sum + row.amountFcfa, 0);
  return { invoices, catalog, due, paid, remaining: due, socialCase: cas };
}

export function postTransaction(
  data: SchoolLifeData,
  input: {
    type: FinanceTxType;
    accountId: string;
    amount: number;
    label: string;
    date?: string;
    categoryId?: string;
    reference?: string;
    invoiceId?: string;
    supplierInvoiceId?: string;
    payrollRunId?: string;
  },
) {
  const account = accountById(input.accountId, data);
  if (!account) throw new Error("account");
  const amount = Math.round(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("amount");
  if (input.type === "out" && account.balance < amount) {
    // Demo school ops: still allow overdraft-like posting but keep the number honest.
  }
  account.balance += input.type === "in" ? amount : -amount;
  const row = {
    id: newId("ftx"),
    type: input.type,
    accountId: account.id,
    categoryId: input.categoryId || undefined,
    date: input.date || todayISO(),
    label: input.label,
    amount,
    reference: input.reference || undefined,
    invoiceId: input.invoiceId,
    supplierInvoiceId: input.supplierInvoiceId,
    payrollRunId: input.payrollRunId,
    createdAt: new Date().toISOString(),
  };
  data.financeTransactions.unshift(row);
  return row;
}

export function collectCaisse(
  data: SchoolLifeData,
  input: { invoiceId: string; accountId: string },
) {
  const invoice = data.invoices.find((row) => row.id === input.invoiceId);
  if (!invoice) throw new Error("invoice");
  if (invoice.status === "paid") throw new Error("paid");
  const student = data.students.find((row) => row.id === invoice.studentId);
  if (!student) throw new Error("missing");
  const amount = invoiceDueAmount(invoice, data);
  if (amount <= 0) throw new Error("amount");
  const wanted =
    invoice.kind === "scolarite" || invoice.kind === "inscription"
      ? "Scolarité"
      : invoice.kind === "cantine"
        ? "Cantine"
        : "";
  const incomeCat =
    data.expenseCategories.find((row) => row.kind === "income" && row.name === wanted) ||
    data.expenseCategories.find((row) => row.kind === "income");
  invoice.status = "paid";
  const tx = postTransaction(data, {
    type: "in",
    accountId: input.accountId,
    amount,
    label: `Caisse — ${studentFullName(student)} — ${invoice.label}`,
    categoryId: incomeCat?.id,
    invoiceId: invoice.id,
    reference: invoice.id,
  });
  return { invoice, student, tx, amount };
}

export function paySupplierInvoice(data: SchoolLifeData, invoiceId: string, accountId: string) {
  const invoice = data.supplierInvoices.find((row) => row.id === invoiceId);
  if (!invoice) throw new Error("invoice");
  if (invoice.status !== "pending") throw new Error("paid");
  invoice.status = "paid";
  invoice.paidAt = new Date().toISOString();
  invoice.accountId = accountId;
  const tx = postTransaction(data, {
    type: "out",
    accountId,
    amount: invoice.amount,
    label: `Fournisseur — ${invoice.supplier}`,
    categoryId: invoice.categoryId,
    supplierInvoiceId: invoice.id,
    reference: invoice.id,
  });
  return { invoice, tx };
}

export function treasuryTotal(data: SchoolLifeData) {
  return data.financeAccounts.reduce((sum, row) => sum + row.balance, 0);
}

export function periodKey(date: string) {
  return date.slice(0, 7);
}

export function transactionsForMonth(month: string, data: SchoolLifeData) {
  return data.financeTransactions.filter((row) => periodKey(row.date) === month);
}

function yearTokens(yearLabel: string) {
  const match = yearLabel.match(/20\d{2}/g);
  return match && match.length ? match : [yearLabel.slice(0, 4)];
}

export function spentForCategoryInYear(categoryId: string, yearLabel: string, data: SchoolLifeData) {
  const years = yearTokens(yearLabel);
  const category = categoryById(categoryId, data);
  return data.financeTransactions
    .filter((row) => row.categoryId === categoryId && years.some((token) => row.date.includes(token)))
    .reduce((sum, row) => {
      if (category?.kind === "income") return sum + (row.type === "in" ? row.amount : 0);
      return sum + (row.type === "out" ? row.amount : 0);
    }, 0);
}

export function budgetRows(data: SchoolLifeData, year: string) {
  return data.budgetLines
    .filter((row) => row.year === year)
    .map((row) => {
      const category = categoryById(row.categoryId, data);
      const actual = spentForCategoryInYear(row.categoryId, year, data);
      return {
        ...row,
        categoryName: category?.name ?? row.categoryId,
        kind: category?.kind ?? "expense",
        planned: row.plannedAmount,
        actual,
        variance: row.plannedAmount - actual,
      };
    });
}
