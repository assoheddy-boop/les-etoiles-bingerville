import { cookies } from "next/headers";
import {
  getAdminSession,
  getParentSession,
  getSuperAdminSession,
  getTeacherSession,
  getVigileSession,
  staffRoleOf,
} from "./auth";
import { cookieOptions } from "./session";

export type AiRole =
  | "public"
  | "parent"
  | "enseignant"
  | "vigile"
  | "fondateur"
  | "direction"
  | "secretariat"
  | "vie_scolaire"
  | "superadmin";

export const AI_GUEST_COOKIE = "etoiles_ai_guest";

export const AI_ROLES: AiRole[] = [
  "public",
  "parent",
  "enseignant",
  "vigile",
  "fondateur",
  "direction",
  "secretariat",
  "vie_scolaire",
  "superadmin",
];

export function isAiRole(value: string): value is AiRole {
  return AI_ROLES.includes(value as AiRole);
}

export const aiRoleLabels: Record<AiRole, string> = {
  public: "Visiteur",
  parent: "Parent",
  enseignant: "Enseignant",
  vigile: "Vigile",
  fondateur: "Fondateur",
  direction: "Direction",
  secretariat: "Secrétariat",
  vie_scolaire: "Vie scolaire",
  superadmin: "SuperAdmin",
};

export type AiActor = {
  role: AiRole;
  userKey: string;
  displayName: string;
  guestId?: string;
  isNewGuest?: boolean;
};

function staffToAiRole(staffRole: string): AiRole {
  if (staffRole === "fondateur") return "fondateur";
  if (staffRole === "vie_scolaire") return "vie_scolaire";
  if (staffRole === "secretariat") return "secretariat";
  return "direction";
}

export async function resolveAiActor(suggested?: string): Promise<AiActor> {
  const [superadmin, admin, teacher, parent, vigile] = await Promise.all([
    getSuperAdminSession(),
    getAdminSession(),
    getTeacherSession(),
    getParentSession(),
    getVigileSession(),
  ]);

  const available: AiActor[] = [];
  if (superadmin) {
    available.push({
      role: "superadmin",
      userKey: `superadmin:${superadmin.email}`,
      displayName: superadmin.displayName,
    });
  }
  if (admin && !admin.isSuperAdmin) {
    const role = staffToAiRole(staffRoleOf(admin));
    available.push({
      role,
      userKey: `admin:${role}:${admin.displayName}`,
      displayName: admin.displayName,
    });
  }
  if (teacher) {
    available.push({
      role: "enseignant",
      userKey: `teacher:${teacher.teacherId}`,
      displayName: teacher.displayName,
    });
  }
  if (parent) {
    available.push({
      role: "parent",
      userKey: `parent:${parent.studentId}`,
      displayName: parent.displayName,
    });
  }
  if (vigile) {
    available.push({
      role: "vigile",
      userKey: `vigile:${vigile.displayName}`,
      displayName: vigile.displayName,
    });
  }

  if (suggested && isAiRole(suggested)) {
    const match = available.find((row) => row.role === suggested);
    if (match) return match;
  }

  if (available[0]) return available[0];

  const jar = await cookies();
  const existing = jar.get(AI_GUEST_COOKIE)?.value?.trim();
  const guestId = existing && /^[a-zA-Z0-9_-]{8,64}$/.test(existing) ? existing : crypto.randomUUID();
  return {
    role: "public",
    userKey: `public:${guestId}`,
    displayName: "Visiteur",
    guestId,
    isNewGuest: !existing,
  };
}

export const guestCookieOptions = {
  ...cookieOptions,
  maxAge: 60 * 60 * 24 * 30,
};
