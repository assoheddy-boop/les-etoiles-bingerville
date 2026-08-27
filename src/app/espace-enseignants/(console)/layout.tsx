import { requireTeacher } from "@/lib/auth";
import { ConsoleNav } from "@/components/layout/ConsoleNav";
import { ModuleBlocked } from "@/components/school/ModuleBlocked";
import { actorFromSession, readSchoolLife, unreadCount } from "@/lib/school-life";
import { filterNavByModules, isModuleEnabled } from "@/lib/module-control";
import { teacherConsoleNavFor } from "@/lib/nav";
import { computeAlerts, isTeacherControlEnabled } from "@/lib/teacher-control";

export default async function TeacherConsoleLayout({ children }: { children: React.ReactNode }) {
  const session = await requireTeacher();
  const data = await readSchoolLife();
  if (!isModuleEnabled(data, "enseignants", { role: "teacher", userId: session.teacherId })) {
    return (
      <div className="min-h-screen bg-paper">
        <ConsoleNav
          title="Les Étoiles — enseignants"
          subtitle={session.displayName}
          groups={[]}
          logoutNext="/espace-enseignants/connexion"
        />
        <ModuleBlocked
          title="Espace enseignants inactif"
          lead="Le module enseignants est désactivé pour votre profil. Contactez la direction."
        />
      </div>
    );
  }
  const actor = actorFromSession(session, data);
  const unread = unreadCount(actor.id, data);
  const enabled = isTeacherControlEnabled(data);
  const alertCount = enabled ? computeAlerts(data, session.teacherId).length : 0;
  const groups = filterNavByModules(teacherConsoleNavFor(enabled), data, {
    role: "teacher",
    userId: session.teacherId,
  }).map((group) => ({
    ...group,
    links: group.links.map((link) => {
      if (link.href.endsWith("/messages") && unread > 0) return { ...link, badge: unread };
      if (link.href.endsWith("/cours") && alertCount > 0) return { ...link, badge: alertCount };
      return link;
    }),
  }));

  return (
    <div className="min-h-screen bg-paper">
      <ConsoleNav
        title="Les Étoiles — enseignants"
        subtitle={session.displayName}
        groups={groups}
        logoutNext="/espace-enseignants/connexion"
      />
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">{children}</div>
    </div>
  );
}
