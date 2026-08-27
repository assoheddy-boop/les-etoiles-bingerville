import { trySuperAdminLogin } from "@/lib/superadmin";
import { loginFailure, loginSuccess, readCredentialBody } from "@/lib/login";
import { SUPERADMIN_COOKIE, signSession } from "@/lib/session";

export async function POST(request: Request) {
  const body = await readCredentialBody(request);
  const username = body.username || body.email || body.identifiant || "";
  const account = await trySuperAdminLogin(username, body.password || "");
  if (!account) {
    return loginFailure(request, "/super-admin/connexion");
  }
  const token = await signSession(account);
  return loginSuccess(request, "/super-admin", SUPERADMIN_COOKIE, token);
}
