import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/auth";
import { PersistWriteError } from "@/lib/persist";
import { formText } from "@/lib/admin-api";
import {
  createEmployee,
  publicEmployee,
  readEmployees,
  resetEmployeePassword,
  setEmployeeActive,
  updateEmployee,
} from "@/lib/employees";
import { isEmployeeRoleId } from "@/lib/rbac";

function redirectWithError(request: Request, fallback: string, code: string) {
  const url = new URL(fallback, request.url);
  url.searchParams.set("error", code);
  return NextResponse.redirect(url, 303);
}

export async function GET() {
  const session = await getAdminSession();
  if (!session || !hasPermission(session, "parametres", "write")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const store = await readEmployees();
  return NextResponse.json({
    employees: store.employees.map(publicEmployee),
  });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.redirect(new URL("/admin/connexion", request.url), 303);
  }
  if (!hasPermission(session, "parametres", "write")) {
    return redirectWithError(request, "/admin/employes", "forbidden");
  }

  const form = await request.formData();
  const action = formText(form, "action") || "create";
  const fallback = "/admin/employes";

  try {
    if (action === "toggle-active") {
      const id = formText(form, "id");
      const active = formText(form, "active") === "1";
      if (!id) throw new Error("missing");
      await setEmployeeActive(id, active);
      return NextResponse.redirect(new URL(`${fallback}?ok=1`, request.url), 303);
    }
    if (action === "reset-password") {
      const id = formText(form, "id");
      if (!id) throw new Error("missing");
      const temp = await resetEmployeePassword(id);
      return NextResponse.redirect(
        new URL(`/admin/employes/${id}?ok=1&temp=${encodeURIComponent(temp)}`, request.url),
        303,
      );
    }

    const firstName = formText(form, "firstName");
    const lastName = formText(form, "lastName");
    const email = formText(form, "email");
    const username = formText(form, "username");
    const roleId = formText(form, "roleId");
    const phone = formText(form, "phone");
    const poste = formText(form, "poste");
    const password = formText(form, "password");
    if (!firstName || !lastName || !email || !username || !isEmployeeRoleId(roleId)) {
      throw new Error("data");
    }

    if (action === "update") {
      const id = formText(form, "id");
      if (!id) throw new Error("missing");
      await updateEmployee(id, {
        firstName,
        lastName,
        email,
        username,
        roleId,
        phone: phone || undefined,
        poste: poste || undefined,
        password: password || undefined,
      });
      return NextResponse.redirect(new URL(`/admin/employes/${id}?ok=1`, request.url), 303);
    }

    if (!password) throw new Error("missing");
    const employee = await createEmployee({
      firstName,
      lastName,
      email,
      username,
      roleId,
      phone: phone || undefined,
      poste: poste || undefined,
      password,
    });
    return NextResponse.redirect(new URL(`/admin/employes/${employee.id}?ok=1`, request.url), 303);
  } catch (error) {
    const message =
      error instanceof PersistWriteError
        ? "persist"
        : error instanceof Error
          ? error.message
          : "error";
    const path =
      action === "update" || action === "reset-password"
        ? `/admin/employes/${formText(form, "id")}`
        : action === "create"
          ? "/admin/employes/nouveau"
          : fallback;
    return redirectWithError(request, path, message);
  }
}
