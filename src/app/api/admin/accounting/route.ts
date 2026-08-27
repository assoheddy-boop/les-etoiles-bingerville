import { formInt, formText, withAdminMutate } from "@/lib/admin-api";
import {
  isCategoryKind,
  isFinanceAccountType,
  isTxType,
  paySupplierInvoice,
  postTransaction,
} from "@/lib/accounting";
import { newId, todayISO } from "@/lib/school-life";

export async function POST(request: Request) {
  return withAdminMutate(request, "/admin/compta", (data, form) => {
    const action = formText(form, "action");
    const ok = (path: string) => `${path}${path.includes("?") ? "&" : "?"}ok=1`;

    if (action === "account-create") {
      const name = formText(form, "name");
      const type = formText(form, "type");
      if (!name || !isFinanceAccountType(type)) throw new Error("data");
      data.financeAccounts.push({ id: newId("acc"), name, type, balance: formInt(form, "balance") || 0 });
      return ok("/admin/compta/comptes");
    }

    if (action === "category-create") {
      const name = formText(form, "name");
      const kind = formText(form, "kind");
      if (!name || !isCategoryKind(kind)) throw new Error("data");
      data.expenseCategories.push({ id: newId("cat"), name, kind });
      return ok("/admin/compta/depenses");
    }

    if (action === "transaction") {
      const type = formText(form, "type");
      const accountId = formText(form, "accountId");
      const amount = formInt(form, "amount");
      const label = formText(form, "label") || formText(form, "description");
      if (!isTxType(type) || !accountId || !label || !Number.isFinite(amount) || amount <= 0) throw new Error("amount");
      postTransaction(data, {
        type,
        accountId,
        amount,
        label,
        date: formText(form, "date") || todayISO(),
        categoryId: formText(form, "categoryId") || undefined,
        reference: formText(form, "reference") || undefined,
      });
      return ok("/admin/compta/comptes");
    }

    if (action === "invoice-create") {
      const supplier = formText(form, "supplier") || formText(form, "supplierName");
      const amount = formInt(form, "amount");
      if (!supplier || !Number.isFinite(amount) || amount <= 0) throw new Error("amount");
      data.supplierInvoices.unshift({
        id: newId("sinv"),
        supplier,
        amount,
        status: "pending",
        dueDate: formText(form, "dueDate") || undefined,
        description: formText(form, "description") || undefined,
        categoryId: formText(form, "categoryId") || undefined,
        createdAt: new Date().toISOString(),
      });
      return ok("/admin/compta/factures");
    }

    if (action === "invoice-pay") {
      paySupplierInvoice(data, formText(form, "id"), formText(form, "accountId"));
      return ok("/admin/compta/factures");
    }

    if (action === "invoice-cancel") {
      const invoice = data.supplierInvoices.find((row) => row.id === formText(form, "id"));
      if (!invoice || invoice.status !== "pending") throw new Error("paid");
      invoice.status = "cancelled";
      return ok("/admin/compta/factures");
    }

    if (action === "budget") {
      const categoryId = formText(form, "categoryId");
      const year = formText(form, "year") || "2026-2027";
      const plannedAmount = formInt(form, "plannedAmount");
      if (!categoryId || !Number.isFinite(plannedAmount) || plannedAmount < 0) throw new Error("amount");
      const existing = data.budgetLines.find((row) => row.categoryId === categoryId && row.year === year);
      if (existing) existing.plannedAmount = plannedAmount;
      else data.budgetLines.push({ id: newId("bud"), categoryId, plannedAmount, year });
      return ok("/admin/compta/budget");
    }

    throw new Error("missing");
  });
}
