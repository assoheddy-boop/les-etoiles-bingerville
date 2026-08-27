import { requireParent } from "@/lib/auth";
import { ConsoleNav } from "@/components/layout/ConsoleNav";
import { ModuleBlocked } from "@/components/school/ModuleBlocked";
import { parentActorId, readSchoolLife, unreadCount } from "@/lib/school-life";
import { filterNavByModules, parentPortalAllowed } from "@/lib/module-control";
import { parentConsoleNav } from "@/lib/nav";

export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const session = await requireParent();
  const data = await readSchoolLife();
  if (!parentPortalAllowed(data, session.studentId)) {
    return (
      <div className="min-h-screen bg-paper-2/60">
        <ConsoleNav
          title="Espace parents"
          subtitle={`${session.displayName} · ${session.matricule}`}
          groups={[]}
          logoutNext="/connexion"
          variant="light"
        />
        <ModuleBlocked
          title="Espace parents inactif"
          lead="Votre accès n’est pas activé pour le moment. Contactez le secrétariat Les Étoiles (espèces / inscription). Les familles démo ETOILES-DEMO-001 et ETOILES-DEMO-002 restent ouvertes tant que le SuperAdmin ne les désactive pas."
        />
      </div>
    );
  }
  const unread = unreadCount(parentActorId(session.studentId), data);
  const groups = filterNavByModules(parentConsoleNav, data, { role: "parent" }).map((group) => ({
    ...group,
    links: group.links.map((link) =>
      link.href.endsWith("/messages") && unread > 0 ? { ...link, badge: unread } : link,
    ),
  }));

  return (
    <div className="min-h-screen bg-paper-2/60">
      <ConsoleNav
        title="Espace parents"
        subtitle={`${session.displayName} · ${session.matricule}`}
        groups={groups}
        logoutNext="/connexion"
        variant="light"
      />
      {children}
    </div>
  );
}
