import { CAMPUSES } from "@/lib/school-life-types";
import { campusFromEstablishment, findEstablishment, inferEstablishmentId } from "@/lib/establishments";
import {
  generatePayrollRun,
  isAdvanceStatus,
  isContractType,
  isJobTitle,
  isStaffStatus,
  markPayrollPaid,
  upsertStaffPresence,
} from "@/lib/hr";
import { formInt, formText, withAdminMutate } from "@/lib/admin-api";
import { isStaffPresenceStatus, newId, todayISO } from "@/lib/school-life";
import { postTransaction } from "@/lib/accounting";
import type { LeaveStatus, PayRubriqueKind } from "@/lib/school-life-types";

export async function POST(request: Request) {
  return withAdminMutate(request, "/admin/rh", (data, form) => {
    const action = formText(form, "action");
    const ok = (path: string) => (path.includes("?") ? path : `${path}?ok=1`);

    if (action === "staff-create" || action === "staff-update") {
      const firstName = formText(form, "firstName");
      const lastName = formText(form, "lastName");
      const jobTitle = formText(form, "jobTitle");
      const contractType = formText(form, "contractType") || "cdd";
      const status = formText(form, "status") || "active";
      const startDate = formText(form, "startDate") || todayISO();
      const establishmentId =
        formText(form, "establishmentId") || inferEstablishmentId(formText(form, "campus"), data.establishments);
      const est = findEstablishment(establishmentId, data);
      const campus = campusFromEstablishment(est, formText(form, "campus") || CAMPUSES[0]);
      const baseSalary = formInt(form, "baseSalary");
      if (!firstName || !lastName || !isJobTitle(jobTitle) || !isContractType(contractType) || !isStaffStatus(status)) {
        throw new Error("data");
      }
      if (!Number.isFinite(baseSalary) || baseSalary < 0) throw new Error("amount");
      const teacherId = formText(form, "teacherId") || undefined;
      if (action === "staff-create") {
        const id = newId("staff");
        data.staffProfiles.unshift({
          id,
          firstName,
          lastName,
          jobTitle,
          contractType,
          status,
          startDate,
          campus,
          establishmentId: est?.id,
          teacherId,
          email: formText(form, "email") || undefined,
          phone: formText(form, "phone") || undefined,
          baseSalary,
          documents: [],
          notes: formText(form, "notes") || undefined,
        });
        return ok("/admin/rh/personnel");
      }
      const profile = data.staffProfiles.find((row) => row.id === formText(form, "id"));
      if (!profile) throw new Error("missing");
      Object.assign(profile, {
        firstName,
        lastName,
        jobTitle,
        contractType,
        status,
        startDate,
        campus,
        establishmentId: est?.id,
        teacherId,
        email: formText(form, "email") || undefined,
        phone: formText(form, "phone") || undefined,
        baseSalary,
        notes: formText(form, "notes") || undefined,
      });
      return ok(`/admin/rh/personnel/${profile.id}`);
    }

    if (action === "staff-document") {
      const profile = data.staffProfiles.find((row) => row.id === formText(form, "id"));
      const filename = formText(form, "filename");
      if (!profile || !filename) throw new Error("data");
      profile.documents.unshift({
        id: newId("sdoc"),
        filename,
        note: formText(form, "note") || undefined,
      });
      return ok(`/admin/rh/personnel/${profile.id}`);
    }

    if (action === "review") {
      const leave = data.leaveRequests.find((row) => row.id === formText(form, "id"));
      const status = formText(form, "status") as LeaveStatus;
      if (!leave || (status !== "approved" && status !== "refused")) throw new Error("missing");
      leave.status = status;
      leave.adminNote = formText(form, "adminNote") || undefined;
      leave.reviewedAt = new Date().toISOString();
      return ok("/admin/rh/conges");
    }

    if (action === "presence") {
      const staffId = formText(form, "staffId");
      const status = formText(form, "status");
      if (!staffId || !isStaffPresenceStatus(status)) throw new Error("missing");
      upsertStaffPresence(data, staffId, status, formText(form, "note") || undefined);
      return ok("/admin/rh/presence");
    }

    if (action === "advance-create") {
      const staffId = formText(form, "staffId");
      const amount = formInt(form, "amount");
      const reason = formText(form, "reason");
      if (!staffId || !reason || !Number.isFinite(amount) || amount <= 0) throw new Error("amount");
      data.salaryAdvances.unshift({
        id: newId("adv"),
        staffId,
        amount,
        reason,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      return ok("/admin/rh/avances");
    }

    if (action === "advance-review") {
      const row = data.salaryAdvances.find((item) => item.id === formText(form, "id"));
      const status = formText(form, "status");
      if (!row || (status !== "approved" && status !== "refused") || !isAdvanceStatus(status)) throw new Error("missing");
      row.status = status;
      row.adminNote = formText(form, "adminNote") || undefined;
      row.reviewedAt = new Date().toISOString();
      return ok("/admin/rh/avances");
    }

    if (action === "evaluation-create") {
      const staffId = formText(form, "staffId");
      const date = formText(form, "date") || todayISO();
      const score = formInt(form, "score");
      const comment = formText(form, "comment");
      if (!staffId || !comment || !Number.isFinite(score) || score < 0 || score > 20) throw new Error("data");
      data.staffEvaluations.unshift({
        id: newId("eval"),
        staffId,
        date,
        score,
        comment,
        createdAt: new Date().toISOString(),
      });
      return ok("/admin/rh/evaluations");
    }

    if (action === "rubrique-create") {
      const name = formText(form, "name");
      const type = formText(form, "type") as PayRubriqueKind;
      if (!name || (type !== "earning" && type !== "deduction")) throw new Error("data");
      const percentRaw = formText(form, "percent");
      const amountRaw = formText(form, "amount");
      data.payRubriques.push({
        id: newId("rub"),
        code: formText(form, "code") || undefined,
        name,
        type,
        percent: percentRaw ? Number(percentRaw) : undefined,
        amount: amountRaw ? formInt(form, "amount") : undefined,
      });
      return ok("/admin/rh/rubriques");
    }

    if (action === "rubrique-delete") {
      const id = formText(form, "id");
      data.payRubriques = data.payRubriques.filter((row) => row.id !== id);
      return ok("/admin/rh/rubriques");
    }

    if (action === "payroll-generate") {
      const month = formText(form, "month") || todayISO().slice(0, 7);
      generatePayrollRun(data, month);
      return `/admin/rh/paie?ok=1&month=${month}`;
    }

    if (action === "payroll-validate") {
      const run = data.payrollRuns.find((row) => row.id === formText(form, "id"));
      if (!run || run.status === "paid") throw new Error("paid");
      run.status = "validated";
      return ok("/admin/rh/paie");
    }

    if (action === "payroll-pay") {
      const runId = formText(form, "id");
      const accountId = formText(form, "accountId");
      const { run, slips } = markPayrollPaid(data, runId, accountId || undefined);
      if (accountId) {
        postTransaction(data, {
          type: "out",
          accountId,
          amount: run.totalNet || slips.reduce((sum, row) => sum + row.netPay, 0),
          label: `Paie ${run.month}`,
          categoryId: data.expenseCategories.find((row) => row.name === "Salaires")?.id,
          payrollRunId: run.id,
        });
      }
      return ok("/admin/rh/paie");
    }

    throw new Error("missing");
  });
}
