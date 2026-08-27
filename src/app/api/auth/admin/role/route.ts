import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { isStaffRole } from "@/lib/teacher-control";
import { ADMIN_COOKIE, cookieOptions, signSession } from "@/lib/session";
import { readCredentialBody } from "@/lib/login";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.redirect(new URL("/admin/connexion", request.url), 303);
  }
  if (!session.canSwitchRole && session.staffRole !== "fondateur") {
    return NextResponse.redirect(new URL("/admin/controle-enseignants?error=forbidden", request.url), 303);
  }
  const body = await readCredentialBody(request);
  const nextRole = body.staffRole || "";
  if (!isStaffRole(nextRole)) {
    return NextResponse.redirect(new URL("/admin?error=1", request.url), 303);
  }
  const token = await signSession({
    role: "admin",
    displayName: session.displayName,
    staffRole: nextRole,
    canSwitchRole: true,
  });
  const response = NextResponse.redirect(new URL("/admin/controle-enseignants", request.url), 303);
  response.cookies.set(ADMIN_COOKIE, token, cookieOptions);
  return response;
}
