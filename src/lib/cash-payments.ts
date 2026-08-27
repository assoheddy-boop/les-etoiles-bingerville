import { collectCaisse, studentFeeBalance } from "./accounting";
import { newId, todayISO } from "./school-life";
import type { CashPayment, SchoolLifeData } from "./school-life-types";
import { isParentModuleActive } from "./module-control";

export function cashPaymentsOf(data: SchoolLifeData) {
  return Array.isArray(data.cashPayments) ? data.cashPayments : [];
}

export function recordCashPayment(
  data: SchoolLifeData,
  input: {
    parentId: string;
    studentId?: string;
    invoiceId?: string;
    amount: number;
    recordedBy: string;
    date?: string;
  },
) {
  const parent = data.parents.find((row) => row.id === input.parentId);
  if (!parent) throw new Error("missing");
  const amount = Math.round(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("amount");
  if (input.studentId && !parent.studentIds.includes(input.studentId)) throw new Error("student");
  if (input.invoiceId) {
    const invoice = data.invoices.find((row) => row.id === input.invoiceId);
    if (!invoice) throw new Error("invoice");
    if (invoice.status === "paid") throw new Error("paid");
  }
  if (!Array.isArray(data.cashPayments)) data.cashPayments = [];
  const row: CashPayment = {
    id: newId("cash"),
    parentId: parent.id,
    studentId: input.studentId,
    invoiceId: input.invoiceId,
    amount,
    date: input.date || todayISO(),
    recordedBy: input.recordedBy,
    status: "pending",
    mode: "cash",
  };
  data.cashPayments.unshift(row);
  return row;
}

export function validateCashPayment(
  data: SchoolLifeData,
  input: { paymentId: string; validatedBy: string; activateParentModule?: boolean },
) {
  const payment = cashPaymentsOf(data).find((row) => row.id === input.paymentId);
  if (!payment) throw new Error("missing");
  if (payment.status === "validated") return payment;
  payment.status = "validated";
  payment.validatedBy = input.validatedBy;
  payment.validatedAt = new Date().toISOString();
  if (payment.invoiceId) {
    const invoice = data.invoices.find((row) => row.id === payment.invoiceId);
    if (invoice && invoice.status !== "paid") {
      const cashAccount = data.financeAccounts.find((row) => row.type === "cash") || data.financeAccounts[0];
      if (cashAccount) {
        collectCaisse(data, { invoiceId: invoice.id, accountId: cashAccount.id });
      }
    }
  }
  if (input.activateParentModule) {
    const parent = data.parents.find((row) => row.id === payment.parentId);
    if (parent) parent.moduleParentsActive = true;
  }
  return payment;
}

export function setParentModule(data: SchoolLifeData, parentId: string, enabled: boolean) {
  const parent = data.parents.find((row) => row.id === parentId);
  if (!parent) throw new Error("missing");
  parent.moduleParentsActive = enabled;
  return parent;
}

export type ParentFinanceRow = {
  parentId: string;
  parentName: string;
  studentLabels: string;
  catalog: number;
  paid: number;
  due: number;
  cashPending: number;
  cashValidated: number;
  moduleParentsActive: boolean;
};

export function parentFinanceRows(data: SchoolLifeData): ParentFinanceRow[] {
  const cash = cashPaymentsOf(data);
  return data.parents.map((parent) => {
    const students = data.students.filter(
      (row) => row.parentId === parent.id || parent.studentIds.includes(row.id),
    );
    const balances = students.map((student) => studentFeeBalance(student.id, data));
    const catalog = balances.reduce((sum, row) => sum + row.catalog, 0);
    const paid = balances.reduce((sum, row) => sum + row.paid, 0);
    const due = balances.reduce((sum, row) => sum + row.due, 0);
    const parentCash = cash.filter((row) => row.parentId === parent.id);
    return {
      parentId: parent.id,
      parentName: parent.displayName,
      studentLabels: students
        .map((row) => `${row.firstName} ${row.lastName}`.trim())
        .filter(Boolean)
        .join(" · "),
      catalog,
      paid,
      due,
      cashPending: parentCash.filter((row) => row.status === "pending").reduce((sum, row) => sum + row.amount, 0),
      cashValidated: parentCash.filter((row) => row.status === "validated").reduce((sum, row) => sum + row.amount, 0),
      moduleParentsActive: isParentModuleActive(parent),
    };
  });
}

export function cashTotals(data: SchoolLifeData) {
  const invoicesPaid = data.invoices.filter((row) => row.status === "paid").reduce((sum, row) => sum + row.amountFcfa, 0);
  const invoicesDue = data.invoices.filter((row) => row.status !== "paid").reduce((sum, row) => sum + row.amountFcfa, 0);
  const cash = cashPaymentsOf(data);
  const pending = cash.filter((row) => row.status === "pending").reduce((sum, row) => sum + row.amount, 0);
  const validated = cash.filter((row) => row.status === "validated").reduce((sum, row) => sum + row.amount, 0);
  return {
    invoicesPaid,
    invoicesDue,
    cashPending: pending,
    cashValidated: validated,
    demoRevenue: invoicesPaid + validated,
  };
}
