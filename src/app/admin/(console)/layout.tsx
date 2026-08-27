import { requireAdmin, staffRoleOf } from "@/lib/auth";
import { ConsoleNav } from "@/components/layout/ConsoleNav";
import { StaffRoleSwitcher } from "@/components/school/StaffRoleSwitcher";
import { adminConsoleNavFor } from "@/lib/nav";
import { filterNavByModules } from "@/lib/module-control";
import { readSchoolLife } from "@/lib/school-life";
import { computeAlerts, isTeacherControlEnabled, staffRoleLabels } from "@/lib/teacher-control";

export default async function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const role = staffRoleOf(session);
  const data = await readSchoolLife();
  const enabled = isTeacherControlEnabled(data);
  const alertCount = enabled ? computeAlerts(data).length : 0;
  const bypass = Boolean(session.isSuperAdmin);
  const groups = filterNavByModules(adminConsoleNavFor(enabled, alertCount, role === "fondateur"), data, {
    role,
    bypass,
  });
  const nav = session.isSuperAdmin
    ? [{ title: "SuperAdmin", links: [{ href: "/super-admin", label: "Console SuperAdmin" }] }, ...groups]
    : groups;

  return (
    <div className="min-h-screen bg-paper">
      <ConsoleNav
        title="Les Étoiles — direction"
        subtitle={`${session.displayName} · ${session.isSuperAdmin ? "SuperAdmin" : staffRoleLabels[role]}`}
        groups={nav}
        logoutNext={session.isSuperAdmin ? "/super-admin/connexion" : "/admin/connexion"}
      />
      {!session.isSuperAdmin && (role === "fondateur" || session.canSwitchRole) ? (
        <StaffRoleSwitcher current={role} />
      ) : null}
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">{children}</div>
    </div>
  );
}
