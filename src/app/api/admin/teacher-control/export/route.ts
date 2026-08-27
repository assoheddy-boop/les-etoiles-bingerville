import { NextResponse } from "next/server";
import { getAdminSession, staffRoleOf } from "@/lib/auth";
import { readSchoolLife } from "@/lib/school-life";
import {
  canExportControlStats,
  controlCsv,
  isTeacherControlEnabled,
} from "@/lib/teacher-control";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const role = staffRoleOf(session);
  const data = await readSchoolLife();
  if (!isTeacherControlEnabled(data) || !canExportControlStats(role)) {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }
  const csv = controlCsv(data);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="controle-enseignants.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
