import { isVigileCredentials, vigileDemo } from "@/lib/demo-accounts";
import { rejectDemoLoginIfBlocked } from "@/lib/demo-guard";
import { loginFailure, loginSuccess, readCredentialBody } from "@/lib/login";
import { signSession, VIGILE_COOKIE } from "@/lib/session";

export async function POST(request: Request) {
  const body = await readCredentialBody(request);
  const username = body.username || body.email || body.identifiant || "";
  const password = body.password || "";
  if (rejectDemoLoginIfBlocked("vigile", { username, password })) {
    return loginFailure(request, "/espace-vigile/connexion");
  }
  if (!isVigileCredentials(username, password)) {
    return loginFailure(request, "/espace-vigile/connexion");
  }
  const token = await signSession({ role: "vigile", displayName: vigileDemo.displayName });
  return loginSuccess(request, "/espace-vigile", VIGILE_COOKIE, token);
}
