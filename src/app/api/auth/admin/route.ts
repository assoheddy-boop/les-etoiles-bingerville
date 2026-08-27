import { findStaffDemo } from "@/lib/demo-accounts";
import { loginFailure, loginSuccess, readCredentialBody } from "@/lib/login";
import { ADMIN_COOKIE, SUPERADMIN_COOKIE, signSession } from "@/lib/session";
import { trySuperAdminLogin } from "@/lib/superadmin";

export async function POST(request: Request) {
  const body = await readCredentialBody(request);
  const username = body.username || body.email || body.identifiant || "";
  const password = body.password || "";
  const superadmin = await trySuperAdminLogin(username, password);
  if (superadmin) {
    const token = await signSession(superadmin);
    return loginSuccess(request, "/super-admin", SUPERADMIN_COOKIE, token);
  }
  const account = findStaffDemo(username, password);
  if (!account) {
    return loginFailure(request, "/admin/connexion");
  }
  const token = await signSession({
    role: "admin",
    displayName: account.displayName,
    staffRole: account.staffRole,
    canSwitchRole: account.staffRole === "fondateur",
  });
  return loginSuccess(request, "/admin", ADMIN_COOKIE, token);
}
