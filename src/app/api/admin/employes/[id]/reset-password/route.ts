import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/auth";
import { findEmployeeById, readEmployees, resetEmployeePassword } from "@/lib/employees";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const session = await getAdminSession();
  if (!session || !hasPermission(session, "parametres", "write")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await context.params;
  const store = await readEmployees();
  if (!findEmployeeById(store, id)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const tempPassword = await resetEmployeePassword(id);
  return NextResponse.json({ tempPassword });
}
