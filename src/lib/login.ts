import { NextResponse } from "next/server";
import { DEMO_BLOCKED_MESSAGE } from "./login-messages";
import { cookieOptions } from "./session";

export async function readCredentialBody(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const body = (await request.json()) as Record<string, unknown>;
      const out: Record<string, string> = {};
      for (const [key, value] of Object.entries(body || {})) {
        if (typeof value === "string") out[key] = value;
      }
      return out;
    } catch {
      return {};
    }
  }
  try {
    const form = await request.formData();
    const out: Record<string, string> = {};
    for (const [key, value] of form.entries()) {
      if (typeof value === "string") out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

function isFormLogin(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  return contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");
}

export function loginSuccess(request: Request, nextPath: string, cookieName: string, token: string) {
  const response = isFormLogin(request)
    ? NextResponse.redirect(new URL(nextPath, request.url), 303)
    : NextResponse.json({ ok: true, next: nextPath });
  response.cookies.set(cookieName, token, cookieOptions);
  return response;
}

export function loginFailure(request: Request, loginPath: string) {
  if (!isFormLogin(request)) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }
  const url = new URL(loginPath, request.url);
  url.searchParams.set("erreur", "1");
  return NextResponse.redirect(url, 303);
}

export function loginDemoBlocked(request: Request, loginPath: string) {
  if (!isFormLogin(request)) {
    return NextResponse.json(
      { error: "demo_blocked", message: DEMO_BLOCKED_MESSAGE },
      { status: 403 },
    );
  }
  const url = new URL(loginPath, request.url);
  url.searchParams.set("erreur", "demo");
  return NextResponse.redirect(url, 303);
}
