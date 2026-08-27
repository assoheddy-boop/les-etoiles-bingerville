import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { classGenderCounts } from "@/lib/enrollment";
import { readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const classId = new URL(request.url).searchParams.get("classId") || "";
  const data = await readSchoolLife();
  return NextResponse.json(classGenderCounts(classId, data));
}
