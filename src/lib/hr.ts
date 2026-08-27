import type {
  AdvanceStatus,
  ContractType,
  JobTitleId,
  LeaveRequest,
  PayRubrique,
  PayRubriqueKind,
  PayrollRunStatus,
  SchoolLifeData,
  StaffPresence,
  StaffPresenceStatus,
  StaffProfile,
  StaffStatus,
} from "./school-life-types";

function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function todayISO() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Abidjan" });
}

export const jobTitleLabels: Record<JobTitleId, string> = {
  enseignant: "Enseignant",
  atsem: "ATSEM",
  menage: "Ménage / entretien",
  gardien: "Gardien / sécurité",
  chauffeur: "Chauffeur",
  secretariat: "Secrétariat",
  comptabilite: "Comptabilité",
  other: "Autre",
};

export const contractTypeLabels: Record<ContractType, string> = {
  cdi: "CDI",
  cdd: "CDD",
  vacataire: "Vacataire",
  stage: "Stage",
};

export const staffStatusLabels: Record<StaffStatus, string> = {
  active: "Actif",
  on_leave: "En congé",
  inactive: "Sorti",
};

export const advanceStatusLabels: Record<AdvanceStatus, string> = {
  pending: "En attente",
  approved: "Approuvé",
  refused: "Refusé",
  deducted: "Déduit",
};

export const payrollStatusLabels: Record<PayrollRunStatus, string> = {
  draft: "Brouillon",
  validated: "Validé",
  paid: "Payé",
};

export const rubriqueKindLabels: Record<PayRubriqueKind, string> = {
  earning: "Gain",
  deduction: "Retenue",
};

export const hrAdminNav = [
  { href: "/admin/rh", label: "Tableau de bord" },
  { href: "/admin/rh/personnel", label: "Personnel" },
  { href: "/admin/rh/conges", label: "Congés" },
  { href: "/admin/rh/presence", label: "Présence" },
  { href: "/admin/rh/avances", label: "Avances" },
  { href: "/admin/rh/evaluations", label: "Évaluations" },
  { href: "/admin/rh/rubriques", label: "Rubriques paie" },
  { href: "/admin/rh/paie", label: "Paie" },
] as const;

export function isJobTitle(value: string): value is JobTitleId {
  return value in jobTitleLabels;
}

export function isContractType(value: string): value is ContractType {
  return value in contractTypeLabels;
}

export function isStaffStatus(value: string): value is StaffStatus {
  return value in staffStatusLabels;
}

export function isAdvanceStatus(value: string): value is AdvanceStatus {
  return value in advanceStatusLabels;
}

export function staffDisplayName(profile?: StaffProfile | null) {
  if (!profile) return "—";
  return `${profile.firstName} ${profile.lastName}`.trim() || "—";
}

export function staffById(id: string, data: SchoolLifeData) {
  return data.staffProfiles.find((row) => row.id === id);
}

export function staffForTeacher(teacherId: string, data: SchoolLifeData) {
  return data.staffProfiles.find((row) => row.teacherId === teacherId);
}

export function resolveStaffId(data: SchoolLifeData, staffId?: string, teacherId?: string) {
  if (staffId && data.staffProfiles.some((row) => row.id === staffId)) return staffId;
  if (teacherId) return staffForTeacher(teacherId, data)?.id;
  return undefined;
}

export function leaveStaffId(leave: LeaveRequest, data: SchoolLifeData) {
  return resolveStaffId(data, leave.staffId, leave.teacherId) ?? leave.staffId;
}

export function presenceStaffId(row: StaffPresence, data: SchoolLifeData) {
  return resolveStaffId(data, row.staffId, row.teacherId) ?? row.staffId;
}

export function countLeaveDays(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0;
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
}

export function calcNetPay(input: {
  baseSalary: number;
  bonuses?: number;
  deductions?: number;
  advances?: number;
}) {
  return Math.max(
    0,
    (input.baseSalary || 0) + (input.bonuses || 0) - (input.deductions || 0) - (input.advances || 0),
  );
}

export function rubriqueAmount(rubrique: PayRubrique, baseSalary: number) {
  if (rubrique.percent != null && rubrique.percent > 0) {
    return Math.round((baseSalary * rubrique.percent) / 100);
  }
  return Math.round(rubrique.amount || 0);
}

export function approvedAdvancesTotal(staffId: string, data: SchoolLifeData) {
  return data.salaryAdvances
    .filter((row) => row.staffId === staffId && row.status === "approved")
    .reduce((sum, row) => sum + row.amount, 0);
}

export function payrollRunForMonth(month: string, data: SchoolLifeData) {
  return data.payrollRuns.find((row) => row.month === month);
}

export function payslipsForRun(runId: string, data: SchoolLifeData) {
  return data.payslips.filter((row) => row.payrollRunId === runId);
}

export function generatePayrollRun(data: SchoolLifeData, month: string) {
  const existing = payrollRunForMonth(month, data);
  if (existing?.status === "paid") throw new Error("paid");
  const active = data.staffProfiles.filter((row) => row.status === "active" || row.status === "on_leave");
  if (active.length === 0) throw new Error("missing");

  const run: SchoolLifeData["payrollRuns"][number] = existing ?? {
    id: newId("prun"),
    month,
    status: "draft",
    totalNet: 0,
    createdAt: new Date().toISOString(),
  };
  run.status = "draft";
  run.paidAt = undefined;
  run.accountId = undefined;
  if (!existing) data.payrollRuns.unshift(run);

  data.payslips = data.payslips.filter((row) => row.payrollRunId !== run.id);

  let totalNet = 0;
  for (const profile of active) {
    const lines: SchoolLifeData["payslips"][number]["lines"] = [
      {
        id: newId("pline"),
        code: "100",
        label: "Salaire de base",
        kind: "earning",
        amount: profile.baseSalary,
        base: profile.baseSalary,
      },
    ];
    let bonuses = 0;
    let deductions = 0;
    for (const rubrique of data.payRubriques) {
      const amount = rubriqueAmount(rubrique, profile.baseSalary);
      if (amount <= 0) continue;
      lines.push({
        id: newId("pline"),
        code: rubrique.code,
        label: rubrique.name,
        kind: rubrique.type,
        amount,
        base: rubrique.percent != null ? profile.baseSalary : amount,
        rate: rubrique.percent,
        rateLabel: rubrique.percent != null ? `${rubrique.percent}%` : undefined,
      });
      if (rubrique.type === "earning") bonuses += amount;
      else deductions += amount;
    }
    const advances = approvedAdvancesTotal(profile.id, data);
    if (advances > 0) {
      lines.push({
        id: newId("pline"),
        code: "453",
        label: "Avances",
        kind: "deduction",
        amount: advances,
        base: advances,
      });
    }
    const netPay = calcNetPay({ baseSalary: profile.baseSalary, bonuses, deductions, advances });
    totalNet += netPay;
    data.payslips.push({
      id: newId("pslip"),
      payrollRunId: run.id,
      staffId: profile.id,
      month,
      baseSalary: profile.baseSalary,
      bonuses,
      deductions,
      advances,
      netPay,
      lines,
      createdAt: new Date().toISOString(),
    });
  }
  run.totalNet = totalNet;
  return run;
}

export function markPayrollPaid(data: SchoolLifeData, runId: string, accountId?: string) {
  const run = data.payrollRuns.find((row) => row.id === runId);
  if (!run) throw new Error("missing");
  if (run.status === "paid") throw new Error("paid");
  run.status = "paid";
  run.paidAt = new Date().toISOString();
  run.accountId = accountId || undefined;
  const slips = payslipsForRun(run.id, data);
  const staffIds = new Set(slips.map((row) => row.staffId));
  for (const advance of data.salaryAdvances) {
    if (staffIds.has(advance.staffId) && advance.status === "approved") {
      advance.status = "deducted";
      advance.reviewedAt = advance.reviewedAt || new Date().toISOString();
    }
  }
  return { run, slips };
}

export function profileFromTeacher(
  teacher: SchoolLifeData["teachers"][number],
  campus: string,
  establishmentId?: string,
): StaffProfile {
  const parts = teacher.displayName.trim().split(/\s+/);
  const firstName = parts[0] || teacher.displayName;
  const lastName = parts.slice(1).join(" ") || teacher.displayName;
  return {
    id: `staff-${teacher.id}`,
    firstName,
    lastName,
    jobTitle: "enseignant",
    contractType: "cdi",
    status: "active",
    startDate: "2022-09-01",
    campus,
    establishmentId,
    teacherId: teacher.id,
    email: teacher.email,
    phone: teacher.phone,
    baseSalary: 0,
    documents: [],
  };
}

export function ensureStaffForTeachers(data: SchoolLifeData, defaultCampus: string) {
  const linked = new Set(data.staffProfiles.map((row) => row.teacherId).filter(Boolean));
  const defaultEst =
    data.establishments?.find((row) => row.shortName === defaultCampus) ?? data.establishments?.[0];
  for (const teacher of data.teachers) {
    if (linked.has(teacher.id)) continue;
    data.staffProfiles.push(
      profileFromTeacher(teacher, defaultEst?.shortName ?? defaultCampus, defaultEst?.id),
    );
  }
}

export function upsertStaffPresence(
  data: SchoolLifeData,
  staffOrTeacherId: string,
  status: StaffPresenceStatus,
  note?: string,
) {
  const profile =
    data.staffProfiles.find((row) => row.id === staffOrTeacherId) ||
    data.staffProfiles.find((row) => row.teacherId === staffOrTeacherId);
  const staffId = profile?.id ?? staffOrTeacherId;
  const teacherId = profile?.teacherId;
  const date = todayISO();
  const existing = data.staffPresence.find(
    (row) =>
      (row.staffId === staffId || (teacherId && row.teacherId === teacherId)) && row.date === date,
  );
  if (existing) {
    existing.staffId = staffId;
    existing.teacherId = teacherId;
    existing.status = status;
    existing.note = note || undefined;
    return existing;
  }
  const row: StaffPresence = {
    id: newId("pres"),
    staffId,
    teacherId,
    date,
    status,
    note: note || undefined,
  };
  data.staffPresence.unshift(row);
  return row;
}
