import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  PARENT_COOKIE,
  SUPERADMIN_COOKIE,
  TEACHER_COOKIE,
  VIGILE_COOKIE,
  readSessionCookie,
  type AdminSession,
  type ParentSession,
  type SuperAdminSession,
  type TeacherSession,
  type VigileSession,
} from "./session";
import type { StaffRole } from "./school-life-types";

export function staffRoleOf(session: AdminSession): StaffRole {
  return session.staffRole || "fondateur";
}

export async function getParentSession(): Promise<ParentSession | null> {
  const jar = await cookies();
  const session = await readSessionCookie(jar.get(PARENT_COOKIE)?.value);
  return session?.role === "parent" ? session : null;
}

export async function requireParent(): Promise<ParentSession> {
  const session = await getParentSession();
  if (!session) redirect("/connexion");
  return session;
}

export async function getSuperAdminSession(): Promise<SuperAdminSession | null> {
  const jar = await cookies();
  const session = await readSessionCookie(jar.get(SUPERADMIN_COOKIE)?.value);
  return session?.role === "superadmin" ? session : null;
}

/** Cookie SuperAdmin dont l’identité est assoheddy@gmail.com — personne d’autre. */
export async function superadminOnly(): Promise<SuperAdminSession | null> {
  return getSuperAdminSession();
}

export async function requireSuperAdmin(): Promise<SuperAdminSession> {
  const session = await getSuperAdminSession();
  if (!session) redirect("/super-admin/connexion");
  return session;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const superadmin = await getSuperAdminSession();
  if (superadmin) {
    return {
      role: "admin",
      displayName: superadmin.displayName,
      staffRole: "fondateur",
      canSwitchRole: true,
      isSuperAdmin: true,
    };
  }
  const jar = await cookies();
  const session = await readSessionCookie(jar.get(ADMIN_COOKIE)?.value);
  return session?.role === "admin" ? session : null;
}

export async function requireAdmin(): Promise<AdminSession> {
  const vigile = await getVigileSession();
  if (vigile) redirect("/espace-vigile");
  const session = await getAdminSession();
  if (!session) redirect("/admin/connexion");
  return session;
}

export async function getTeacherSession(): Promise<TeacherSession | null> {
  const jar = await cookies();
  const session = await readSessionCookie(jar.get(TEACHER_COOKIE)?.value);
  return session?.role === "teacher" ? session : null;
}

export async function requireTeacher(): Promise<TeacherSession> {
  const session = await getTeacherSession();
  if (!session) redirect("/espace-enseignants/connexion");
  return session;
}

export async function getVigileSession(): Promise<VigileSession | null> {
  const jar = await cookies();
  const session = await readSessionCookie(jar.get(VIGILE_COOKIE)?.value);
  return session?.role === "vigile" ? session : null;
}

export async function requireVigile(): Promise<VigileSession> {
  const session = await getVigileSession();
  if (!session) redirect("/espace-vigile/connexion");
  return session;
}
