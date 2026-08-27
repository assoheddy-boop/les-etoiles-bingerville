import {
  SUPERADMIN_EMAIL,
  SUPERADMIN_LOCAL_PASSWORD,
  SUPERADMIN_PASSWORD_HASH,
  superAdminDemo,
} from "./demo-accounts";
import { verifyPassword } from "./password";
import type { SuperAdminSession } from "./session";

function timingEqualString(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    crypto.subtle.digest("SHA-256", left);
    return false;
  }
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left[i] ^ right[i];
  return diff === 0;
}

export function isSuperAdminEmail(value: string) {
  return value.trim().toLowerCase() === SUPERADMIN_EMAIL;
}

export async function verifySuperAdminPassword(password: string) {
  const env = process.env.SUPERADMIN_PASSWORD?.trim();
  if (env) return timingEqualString(password, env);
  if (await verifyPassword(password, SUPERADMIN_PASSWORD_HASH)) return true;
  return password === SUPERADMIN_LOCAL_PASSWORD;
}

export async function trySuperAdminLogin(
  username: string,
  password: string,
): Promise<SuperAdminSession | null> {
  if (!isSuperAdminEmail(username)) return null;
  if (!password || !(await verifySuperAdminPassword(password))) return null;
  return {
    role: "superadmin",
    email: SUPERADMIN_EMAIL,
    displayName: superAdminDemo.displayName,
  };
}
