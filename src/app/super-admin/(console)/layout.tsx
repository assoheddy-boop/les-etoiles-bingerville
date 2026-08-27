import { ConsoleNav } from "@/components/layout/ConsoleNav";
import { requireSuperAdmin } from "@/lib/auth";
import { superAdminConsoleNav } from "@/lib/nav";

export default async function SuperAdminConsoleLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSuperAdmin();
  return (
    <div className="min-h-screen bg-paper">
      <ConsoleNav
        title="Les Étoiles — SuperAdmin"
        subtitle={`${session.displayName} · ${session.email}`}
        groups={superAdminConsoleNav}
        logoutNext="/super-admin/connexion"
      />
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">{children}</div>
    </div>
  );
}
