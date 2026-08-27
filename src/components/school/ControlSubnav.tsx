import Link from "next/link";
import type { StaffRole } from "@/lib/school-life-types";
import { canToggleTeacherControl, canViewControlLogs } from "@/lib/teacher-control";

export function ControlSubnav({ role, pathname }: { role: StaffRole; pathname: string }) {
  const links = [
    { href: "/admin/controle-enseignants", label: "Tableau de bord" },
    { href: "/admin/controle-enseignants/alertes", label: "Alertes" },
    ...(canViewControlLogs(role) ? [{ href: "/admin/controle-enseignants/logs", label: "Journal" }] : []),
    ...(canToggleTeacherControl(role) ? [{ href: "/admin/controle-enseignants/parametres", label: "Paramètres" }] : []),
  ];
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Contrôle des enseignants">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold ${
              active ? "bg-green text-white" : "border border-line bg-white hover:bg-paper-2"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
