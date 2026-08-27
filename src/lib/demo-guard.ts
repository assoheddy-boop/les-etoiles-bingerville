import {
  demoStudents,
  findStaffDemo,
  findStudent,
  isVigileCredentials,
  teacherDemoHint,
} from "./demo-accounts";
import { isProductionRuntime } from "./runtime";

const DEMO_MATRICULES = new Set(demoStudents.map((row) => row.matricule.toLowerCase()));

/**
 * Autorise la connexion avec les identifiants de démonstration codés en dur.
 * Défaut : oui en local, non en production Vercel — sauf ETOILES_DEMO_MODE=true ou DEMO_MODE=true.
 */
export function demoLoginsAllowed() {
  const flag =
    process.env.ETOILES_DEMO_MODE?.trim().toLowerCase() ||
    process.env.DEMO_MODE?.trim().toLowerCase();
  if (flag === "true" || flag === "1") return true;
  if (flag === "false" || flag === "0") return false;
  return !isProductionRuntime();
}

export function isDemoMatricule(matricule: string) {
  return DEMO_MATRICULES.has(matricule.trim().toLowerCase());
}

export function isDemoParentLogin(matricule: string, password: string) {
  return isDemoMatricule(matricule) || Boolean(findStudent(matricule, password));
}

export function isDemoStaffLogin(username: string, password: string) {
  return Boolean(findStaffDemo(username, password));
}

export function isDemoTeacherLogin(email: string, password: string) {
  return (
    email.trim().toLowerCase() === teacherDemoHint.email &&
    password === teacherDemoHint.password
  );
}

export function isDemoVigileLogin(username: string, password: string) {
  return isVigileCredentials(username, password);
}

/** Retourne true si la tentative doit être refusée (compte démo bloqué en prod). */
export function rejectDemoLoginIfBlocked(kind: "parent" | "staff" | "teacher" | "vigile", creds: {
  matricule?: string;
  username?: string;
  email?: string;
  password: string;
}) {
  if (demoLoginsAllowed()) return false;
  switch (kind) {
    case "parent":
      if (isDemoMatricule(creds.matricule || creds.username || "")) return true;
      return isDemoParentLogin(creds.matricule || creds.username || "", creds.password);
    case "staff":
      return isDemoStaffLogin(creds.username || creds.email || "", creds.password);
    case "teacher":
      return isDemoTeacherLogin(creds.email || creds.username || "", creds.password);
    case "vigile":
      return isDemoVigileLogin(creds.username || creds.email || "", creds.password);
    default:
      return false;
  }
}
