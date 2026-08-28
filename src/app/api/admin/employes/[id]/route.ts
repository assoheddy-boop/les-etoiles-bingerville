import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/auth";
import { findEmployeeById, publicEmployee, readEmployees, updateEmployee } from "@/lib/employees";
import { isEmployeeRoleId, type EmployeeRoleId } from "@/lib/rbac";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await getAdminSession();
  if (!session || !hasPermission(session, "parametres", "write")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await context.params;
  const store = await readEmployees();
  const employee = findEmployeeById(store, id);
  if (!employee) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ employee: publicEmployee(employee) });
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getAdminSession();
  if (!session || !hasPermission(session, "parametres", "write")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const roleRaw = typeof body.roleId === "string" ? body.roleId : undefined;
  let roleId: EmployeeRoleId | undefined;
  if (roleRaw === undefined) {
    roleId = undefined;
  } else if (isEmployeeRoleId(roleRaw)) {
    roleId = roleRaw;
  } else {
    return NextResponse.json({ error: "data" }, { status: 400 });
  }
  try {
    const employee = await updateEmployee(id, {
      firstName: typeof body.firstName === "string" ? body.firstName : undefined,
      lastName: typeof body.lastName === "string" ? body.lastName : undefined,
      email: typeof body.email === "string" ? body.email : undefined,
      username: typeof body.username === "string" ? body.username : undefined,
      roleId,
      phone: typeof body.phone === "string" ? body.phone : undefined,
      poste: typeof body.poste === "string" ? body.poste : undefined,
      active: typeof body.active === "boolean" ? body.active : undefined,
      password: typeof body.password === "string" ? body.password : undefined,
    });
    return NextResponse.json({ employee: publicEmployee(employee) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "error";
    const status = message === "missing" ? 404 : message === "duplicate" ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
