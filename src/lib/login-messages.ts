export const DEMO_BLOCKED_MESSAGE =
  "Compte démo désactivé en production — contactez le support";

export async function readLoginErrorMessage(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { error?: string; message?: string };
    if (data.error === "demo_blocked" && data.message) return data.message;
  } catch {
    // Réponse non JSON (redirection HTML, etc.)
  }
  return fallback;
}

export function loginErrorFromSearchParams(
  params: URLSearchParams,
  fallback: string,
  demoFallback = DEMO_BLOCKED_MESSAGE,
) {
  const code = params.get("erreur");
  if (code === "demo") return demoFallback;
  if (code === "1") return fallback;
  return "";
}
