import { NextResponse } from "next/server";
import { getSuperAdminSession } from "@/lib/auth";
import { isModuleEnabled } from "@/lib/module-control";
import { readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export async function GET() {
  const [data, superadmin] = await Promise.all([readSchoolLife(), getSuperAdminSession()]);
  return NextResponse.json({
    chat: Boolean(superadmin) || isModuleEnabled(data, "chat_ia"),
    whatsapp: isModuleEnabled(data, "whatsapp"),
  });
}
