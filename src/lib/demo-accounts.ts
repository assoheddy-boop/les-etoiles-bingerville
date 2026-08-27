export type InvoiceKind = "scolarite" | "cantine";
export type InvoiceStatus = "due" | "paid" | "pending";

export type StudentAccount = {
  id: string;
  matricule: string;
  password: string;
  studentName: string;
  parentName: string;
  cycle: "Maternelle" | "Primaire" | "Secondaire";
  classroom: string;
  invoices: Invoice[];
};

export type Invoice = {
  id: string;
  kind: InvoiceKind;
  label: string;
  period: string;
  amountFcfa: number;
  status: InvoiceStatus;
  demo: true;
};

export const demoStudents: StudentAccount[] = [
  {
    id: "stu-ama",
    matricule: "ETOILES-DEMO-001",
    password: "Parent2026!",
    studentName: "Aïcha Coulibaly",
    parentName: "Famille Coulibaly",
    cycle: "Maternelle",
    classroom: "Grande section — Maternelle Les Étoiles",
    invoices: [
      {
        id: "inv-ama-sco-09",
        kind: "scolarite",
        label: "Mensualité scolarité",
        period: "Septembre 2026",
        amountFcfa: 25000,
        status: "due",
        demo: true,
      },
      {
        id: "inv-ama-can-09",
        kind: "cantine",
        label: "Cantine",
        period: "Septembre 2026",
        amountFcfa: 15000,
        status: "due",
        demo: true,
      },
    ],
  },
  {
    id: "stu-marc",
    matricule: "ETOILES-DEMO-002",
    password: "Parent2026!",
    studentName: "Koffi N’Guessan",
    parentName: "Famille N’Guessan",
    cycle: "Primaire",
    classroom: "CE2 — Primaire Les Étoiles",
    invoices: [
      {
        id: "inv-marc-sco-09",
        kind: "scolarite",
        label: "Mensualité scolarité",
        period: "Septembre 2026",
        amountFcfa: 35000,
        status: "due",
        demo: true,
      },
      {
        id: "inv-marc-can-09",
        kind: "cantine",
        label: "Cantine",
        period: "Septembre 2026",
        amountFcfa: 18000,
        status: "due",
        demo: true,
      },
    ],
  },
];

/** Seul e-mail SuperAdmin (comparaison insensible à la casse). */
export const SUPERADMIN_EMAIL = "assoheddy@gmail.com";
export const SUPERADMIN_LOCAL_PASSWORD = "SuperAdmin2026!";
/** Hash PBKDF2 de SuperAdmin2026! — utilisé si SUPERADMIN_PASSWORD n’est pas défini. */
export const SUPERADMIN_PASSWORD_HASH =
  "$pbkdf2-sha256$100000$TI-tYZo7MqZzTgqadiTUoA$rkysEOq1969No_o68OoMLtSK0Mt7oWzE-CLqnQ-DXrQ";

export const superAdminDemo = {
  email: SUPERADMIN_EMAIL,
  password: SUPERADMIN_LOCAL_PASSWORD,
  displayName: "SuperAdmin Les Étoiles",
};

export const adminDemo = {
  username: "admin",
  aliases: ["admin", "admin@lesetoiles.ci"],
  password: "Direction2026!",
  displayName: "Direction Les Étoiles",
  staffRole: "fondateur" as const,
};

export function isAdminCredentials(username: string, password: string) {
  const id = username.trim().toLowerCase();
  return adminDemo.aliases.includes(id) && password === adminDemo.password;
}

export const staffDemoAccounts = [
  {
    username: "directeur",
    aliases: ["directeur", "directeur@lesetoiles.ci"],
    password: "Direction2026!",
    displayName: "Directeur Les Étoiles",
    staffRole: "directeur" as const,
  },
  {
    username: "viescolaire",
    aliases: ["viescolaire", "vie.scolaire@lesetoiles.ci", "vie-scolaire"],
    password: "VieScolaire2026!",
    displayName: "Vie scolaire Les Étoiles",
    staffRole: "vie_scolaire" as const,
  },
];

export function findStaffDemo(username: string, password: string) {
  const id = username.trim().toLowerCase();
  if (isAdminCredentials(username, password)) {
    return adminDemo;
  }
  return staffDemoAccounts.find((row) => row.aliases.includes(id) && row.password === password);
}

export const teacherDemoHint = {
  email: "enseignant@lesetoiles.ci",
  password: "Enseignant2026!",
};

export const vigileDemo = {
  username: "vigile",
  aliases: ["vigile", "vigile@lesetoiles.ci"],
  password: "Vigile2026!",
  displayName: "Yao Kouamé",
};

export function isVigileCredentials(username: string, password: string) {
  const id = username.trim().toLowerCase();
  return vigileDemo.aliases.includes(id) && password === vigileDemo.password;
}

export function findStudent(matricule: string, password: string) {
  return demoStudents.find(
    (student) =>
      student.matricule.toLowerCase() === matricule.trim().toLowerCase() &&
      student.password === password,
  );
}

export function findStudentById(id: string) {
  return demoStudents.find((student) => student.id === id);
}
