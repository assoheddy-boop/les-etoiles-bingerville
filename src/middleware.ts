import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Même nom que `VIGILE_COOKIE` / `SUPERADMIN_COOKIE` dans session.ts — pas d’import (Edge). */
const VIGILE_COOKIE = "etoiles_vigile";
const SUPERADMIN_COOKIE = "etoiles_superadmin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasVigile = Boolean(request.cookies.get(VIGILE_COOKIE)?.value);
  if (hasVigile && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/espace-vigile", request.url));
  }
  if (pathname.startsWith("/super-admin") && pathname !== "/super-admin/connexion") {
    if (!request.cookies.get(SUPERADMIN_COOKIE)?.value) {
      return NextResponse.redirect(new URL("/super-admin/connexion", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/super-admin", "/super-admin/:path*"],
};
