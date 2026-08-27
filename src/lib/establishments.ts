import { menApprovals, school } from "./school";
import type {
  CycleId,
  Establishment,
  RosterStudent,
  SchoolClass,
  SchoolLifeData,
  StaffProfile,
} from "./school-life-types";
import { CAMPUSES } from "./school-life-types";

export const ESTABLISHMENT_CAMPUS_LABEL = `${school.neighborhood}, ${school.city}`;

export const DEFAULT_ESTABLISHMENT_IDS = {
  maternelle: "est-maternelle",
  primaire: "est-primaire",
  college: "est-college",
} as const;

export function defaultEstablishments(): Establishment[] {
  const address = school.address;
  const phone = school.phones[0]?.display;
  const maternelle = menApprovals.find((row) => row.cycle === "Maternelle");
  const primaire = menApprovals.find((row) => row.cycle === "Primaire");
  return [
    {
      id: DEFAULT_ESTABLISHMENT_IDS.maternelle,
      name: maternelle?.schoolName ?? "Maternelle Les Étoiles",
      shortName: "Maternelle Les Étoiles",
      cycle: "Maternelle",
      campus: ESTABLISHMENT_CAMPUS_LABEL,
      menDecision: maternelle?.decision,
      menDate: maternelle?.date,
      address,
      phone,
    },
    {
      id: DEFAULT_ESTABLISHMENT_IDS.primaire,
      name: primaire?.schoolName ?? "Primaire Les Étoiles",
      shortName: "Primaire Les Étoiles",
      cycle: "Primaire",
      campus: ESTABLISHMENT_CAMPUS_LABEL,
      menDecision: primaire?.decision,
      menDate: primaire?.date,
      address,
      phone,
    },
    {
      id: DEFAULT_ESTABLISHMENT_IDS.college,
      name: "Collège Les Étoiles",
      shortName: "Collège Les Étoiles (non ouvert)",
      cycle: "Secondaire",
      campus: ESTABLISHMENT_CAMPUS_LABEL,
      address,
      phone,
    },
  ];
}

export function findEstablishment(id: string | undefined, data: SchoolLifeData) {
  if (!id) return undefined;
  return data.establishments.find((row) => row.id === id);
}

export function campusFromEstablishment(est: Establishment | undefined, fallback?: string) {
  return est?.shortName || fallback || CAMPUSES[0];
}

export function inferEstablishmentId(
  campus: string | undefined,
  establishments: Establishment[],
  cycle?: CycleId,
): string {
  const list = establishments.length ? establishments : defaultEstablishments();
  const label = (campus || "").trim().toLowerCase();
  if (label) {
    const exact = list.find(
      (row) => row.shortName.toLowerCase() === label || row.name.toLowerCase() === label,
    );
    if (exact) return exact.id;
    if (label.includes("etoiles 2") || label.includes("primaire")) {
      return list.find((row) => row.cycle === "Primaire")?.id ?? DEFAULT_ESTABLISHMENT_IDS.primaire;
    }
    if (label.includes("collège") || label.includes("college") || label.includes("secondaire")) {
      return list.find((row) => row.cycle === "Secondaire")?.id ?? DEFAULT_ESTABLISHMENT_IDS.college;
    }
    if (label.includes("étoiles") || label.includes("etoiles") || label.includes("maternelle")) {
      return list.find((row) => row.cycle === "Maternelle")?.id ?? DEFAULT_ESTABLISHMENT_IDS.maternelle;
    }
  }
  if (cycle) {
    const byCycle = list.find((row) => row.cycle === cycle);
    if (byCycle) return byCycle.id;
  }
  return list[0]?.id ?? DEFAULT_ESTABLISHMENT_IDS.maternelle;
}

export function establishmentOfClass(klass: SchoolClass | undefined, data: SchoolLifeData) {
  if (!klass) return undefined;
  return (
    findEstablishment(klass.establishmentId, data) ??
    data.establishments.find((row) => row.shortName === klass.campus)
  );
}

export function establishmentIdForStudent(student: RosterStudent, data: SchoolLifeData) {
  const klass = data.classes.find((row) => row.id === student.classId);
  return establishmentOfClass(klass, data)?.id;
}

export function establishmentLabel(id: string | undefined, data: SchoolLifeData, fallback = "—") {
  const est = findEstablishment(id, data);
  return est?.shortName || fallback;
}

export function staffEstablishmentId(profile: StaffProfile, data: SchoolLifeData) {
  return profile.establishmentId || inferEstablishmentId(profile.campus, data.establishments);
}

export function classIdsForEstablishment(establishmentId: string, data: SchoolLifeData) {
  return data.classes.filter((row) => row.establishmentId === establishmentId).map((row) => row.id);
}

export function studentsForEstablishment(establishmentId: string, data: SchoolLifeData) {
  const classIds = new Set(classIdsForEstablishment(establishmentId, data));
  return data.students.filter((student) => classIds.has(student.classId));
}

export type EstablishmentKpi = {
  establishment: Establishment;
  students: number;
  enrollments: number;
  invoicesDue: number;
  invoicesDueAmount: number;
  staff: number;
  pendingLeaves: number;
  classes: number;
};

export function establishmentKpis(data: SchoolLifeData): EstablishmentKpi[] {
  const yearId = data.currentSchoolYearId;
  return data.establishments.map((establishment) => {
    const students = studentsForEstablishment(establishment.id, data);
    const studentIds = new Set(students.map((row) => row.id));
    const staff = data.staffProfiles.filter((row) => staffEstablishmentId(row, data) === establishment.id);
    const staffIds = new Set(staff.map((row) => row.id));
    const invoicesDue = data.invoices.filter((row) => studentIds.has(row.studentId) && row.status === "due");
    return {
      establishment,
      students: students.length,
      enrollments: data.enrollments.filter(
        (row) => row.schoolYearId === yearId && studentIds.has(row.studentId),
      ).length,
      invoicesDue: invoicesDue.length,
      invoicesDueAmount: invoicesDue.reduce((sum, row) => sum + row.amountFcfa, 0),
      staff: staff.length,
      pendingLeaves: data.leaveRequests.filter(
        (row) => row.status === "pending" && staffIds.has(row.staffId),
      ).length,
      classes: classIdsForEstablishment(establishment.id, data).length,
    };
  });
}

export function hydrateEstablishments(stored: unknown, seedRows: Establishment[]): Establishment[] {
  const rows = Array.isArray(stored) ? (stored as Establishment[]) : seedRows;
  const ids = new Set(rows.map((row) => row.id));
  const merged = [...rows, ...seedRows.filter((row) => !ids.has(row.id))];
  return merged.map((row) => ({
    ...row,
    campus: row.campus || ESTABLISHMENT_CAMPUS_LABEL,
    address: row.address || school.address,
  }));
}

export function hydrateClassEstablishment(
  item: SchoolClass,
  establishments: Establishment[],
  schoolYearId: string,
): SchoolClass {
  const establishmentId = item.establishmentId || inferEstablishmentId(item.campus, establishments, item.cycle);
  const est = establishments.find((row) => row.id === establishmentId);
  return {
    ...item,
    schoolYearId: item.schoolYearId || schoolYearId,
    establishmentId,
    campus: campusFromEstablishment(est, item.campus),
  };
}

export function hydrateStaffEstablishment(row: StaffProfile, establishments: Establishment[]): StaffProfile {
  const establishmentId = row.establishmentId || inferEstablishmentId(row.campus, establishments);
  const est = establishments.find((item) => item.id === establishmentId);
  return {
    ...row,
    establishmentId,
    campus: campusFromEstablishment(est, row.campus),
    documents: row.documents ?? [],
    baseSalary: Number(row.baseSalary) || 0,
  };
}
