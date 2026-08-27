import { SUPERADMIN_EMAIL } from "./demo-accounts";
import type { StaffRole } from "./school-life-types";

export type ParentSession = {
  role: "parent";
  matricule: string;
  studentId: string;
  displayName: string;
};

export type TeacherSession = {
  role: "teacher";
  teacherId: string;
  email: string;
  displayName: string;
};

export type AdminSession = {
  role: "admin";
  displayName: string;
  staffRole: StaffRole;
  /** True si le compte fondateur peut prévisualiser un autre rôle. */
  canSwitchRole?: boolean;
  /** Présent uniquement si la session vient du cookie SuperAdmin (pas un fondateur). */
  isSuperAdmin?: boolean;
};

export type SuperAdminSession = {
  role: "superadmin";
  email: string;
  displayName: string;
};

export type VigileSession = {
  role: "vigile";
  displayName: string;
};

export type Session = ParentSession | TeacherSession | AdminSession | VigileSession | SuperAdminSession;

export const PARENT_COOKIE = "etoiles_parent";
export const TEACHER_COOKIE = "etoiles_teacher";
export const ADMIN_COOKIE = "etoiles_admin";
export const VIGILE_COOKIE = "etoiles_vigile";
export const SUPERADMIN_COOKIE = "etoiles_superadmin";
export { SUPERADMIN_EMAIL };

const encoder = new TextEncoder();

function secret() {
  const value = process.env.SESSION_SECRET?.trim();
  const fallback = "etoiles-dev-secret-change-me";
  if (value && value !== fallback) return value;
  const production =
    process.env.NEXT_PHASE !== "phase-production-build" &&
    (process.env.VERCEL === "1" || process.env.NODE_ENV === "production");
  if (production) {
    throw new Error(
      "SESSION_SECRET est obligatoire en production. Définissez une valeur aléatoire (32+ caractères) sur Vercel.",
    );
  }
  return fallback;
}

async function hmac(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Buffer.from(signature).toString("base64url");
}

export async function signSession(session: Session) {
  const payload = Buffer.from(JSON.stringify({ ...session, exp: Date.now() + 1000 * 60 * 60 * 12 })).toString(
    "base64url",
  );
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function readSessionCookie(value?: string | null): Promise<Session | null> {
  if (!value) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;
  const expected = await hmac(payload);
  if (expected !== sig) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session & {
      exp?: number;
    };
    if (data.exp && data.exp < Date.now()) return null;
    if (
      data.role !== "parent" &&
      data.role !== "admin" &&
      data.role !== "teacher" &&
      data.role !== "vigile" &&
      data.role !== "superadmin"
    ) {
      return null;
    }
    if (data.role === "superadmin") {
      const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
      if (email !== SUPERADMIN_EMAIL) return null;
      return {
        role: "superadmin",
        email,
        displayName: typeof data.displayName === "string" && data.displayName.trim() ? data.displayName : "SuperAdmin Les Étoiles",
      };
    }
    if (data.role === "admin") {
      const staffRole =
        data.staffRole === "directeur" || data.staffRole === "vie_scolaire" || data.staffRole === "fondateur"
          ? data.staffRole
          : "fondateur";
      return { ...data, staffRole, isSuperAdmin: false };
    }
    return data;
  } catch {
    return null;
  }
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 12,
};
