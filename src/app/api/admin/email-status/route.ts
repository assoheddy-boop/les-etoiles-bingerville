import { NextResponse } from "next/server";
import { getAdminSession, getSuperAdminSession } from "@/lib/auth";
import { emailStatus } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
  const [admin, superadmin] = await Promise.all([getAdminSession(), getSuperAdminSession()]);
  if (!admin && !superadmin) {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }
  return NextResponse.json(emailStatus());
}
