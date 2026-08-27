import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, PARENT_COOKIE, SUPERADMIN_COOKIE, TEACHER_COOKIE, VIGILE_COOKIE } from "@/lib/session";

export async function POST(request: Request) {
  const form = await request.formData();
  const next = String(form.get("next") || "/");
  const jar = await cookies();
  jar.delete(PARENT_COOKIE);
  jar.delete(TEACHER_COOKIE);
  jar.delete(ADMIN_COOKIE);
  jar.delete(VIGILE_COOKIE);
  jar.delete(SUPERADMIN_COOKIE);
  const safe = next.startsWith("/") ? next : "/";
  return NextResponse.redirect(new URL(safe, request.url), 303);
}
