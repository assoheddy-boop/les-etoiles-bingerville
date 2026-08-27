import { formText, withAdminMutate } from "@/lib/admin-api";
import { generateInvoicesForStudent, newId } from "@/lib/school-life";
import { CYCLES, type CycleId, type FeeKind } from "@/lib/school-life-types";

const FEE_KINDS: FeeKind[] = ["scolarite", "cantine", "inscription", "other"];

function asKind(value: string): FeeKind {
  if (FEE_KINDS.includes(value as FeeKind)) return value as FeeKind;
  throw new Error("missing");
}

export async function POST(request: Request) {
  return withAdminMutate(request, "/admin/frais", (data, form) => {
    const action = formText(form, "action") || "create";
    if (action === "delete") {
      const id = formText(form, "id");
      if (data.invoices.some((row) => row.feeTypeId === id)) throw new Error("in-use");
      data.feeTypes = data.feeTypes.filter((row) => row.id !== id);
      return "/admin/frais?ok=1";
    }
    if (action === "generate") {
      for (const student of data.students) {
        data.invoices.push(...generateInvoicesForStudent(student, data));
      }
      return "/admin/frais?ok=1";
    }

    const name = formText(form, "name");
    const period = formText(form, "period");
    const amountFcfa = Number(formText(form, "amountFcfa"));
    const cycleRaw = formText(form, "cycle");
    const classId = formText(form, "classId") || undefined;
    if (!name || !period || !Number.isFinite(amountFcfa) || amountFcfa < 0) throw new Error("missing");
    const kind = asKind(formText(form, "kind"));
    const cycle = CYCLES.includes(cycleRaw as CycleId) ? (cycleRaw as CycleId) : undefined;
    if (classId && !data.classes.some((row) => row.id === classId)) throw new Error("missing");

    const id = formText(form, "id") || newId("fee");
    const existing = data.feeTypes.find((row) => row.id === id);
    if (existing) {
      existing.name = name;
      existing.kind = kind;
      existing.amountFcfa = amountFcfa;
      existing.period = period;
      existing.cycle = cycle;
      existing.classId = classId;
    } else {
      data.feeTypes.push({ id, name, kind, amountFcfa, period, cycle, classId });
      for (const student of data.students) {
        data.invoices.push(...generateInvoicesForStudent(student, data));
      }
    }
    return "/admin/frais?ok=1";
  });
}
