import { findStaffDemo } from "@/lib/demo-accounts";
import { rejectDemoLoginIfBlocked } from "@/lib/demo-guard";
import { authenticateEmployee, employeeDisplayName } from "@/lib/employees";
import { loginDemoBlocked, loginFailure, loginSuccess, readCredentialBody } from "@/lib/login";
import { ADMIN_COOKIE, SUPERADMIN_COOKIE, signSession } from "@/lib/session";
import { trySuperAdminLogin } from "@/lib/superadmin";
import type { StaffRole } from "@/lib/school-life-types";
import type { EmployeeRoleId } from "@/lib/rbac";

function staffRoleForEmployee(roleId: EmployeeRoleId): StaffRole {
  if (roleId === "surveillant") return "vie_scolaire";
  return "directeur";
}

export async function POST(request: Request) {
  const body = await readCredentialBody(request);
  const username = body.username || body.email || body.identifiant || "";
  const password = body.password || "";
  const superadmin = await trySuperAdminLogin(username, password);
  if (superadmin) {
    const token = await signSession(superadmin);
    return loginSuccess(request, "/super-admin", SUPERADMIN_COOKIE, token);
  }
  if (rejectDemoLoginIfBlocked("staff", { username, password })) {
    return loginDemoBlocked(request, "/admin/connexion");
  }
  const account = findStaffDemo(username, password);
  if (account) {
    const token = await signSession({
      role: "admin",
      displayName: account.displayName,
      staffRole: account.staffRole,
      canSwitchRole: account.staffRole === "fondateur",
    });
    return loginSuccess(request, "/admin", ADMIN_COOKIE, token);
  }
  const employee = await authenticateEmployee(username, password);
  if (employee) {
    const token = await signSession({
      role: "admin",
      displayName: employeeDisplayName(employee),
      staffRole: staffRoleForEmployee(employee.roleId),
      employeeId: employee.id,
      employeeRole: employee.roleId,
    });
    return loginSuccess(request, "/admin", ADMIN_COOKIE, token);
  }
  return loginFailure(request, "/admin/connexion");
}
