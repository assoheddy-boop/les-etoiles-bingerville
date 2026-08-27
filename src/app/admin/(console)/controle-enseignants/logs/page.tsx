import { notFound } from "next/navigation";
import { Card, PageIntro, TableWrap } from "@/components/school/AdminUi";
import { ControlSubnav } from "@/components/school/ControlSubnav";
import { requireAdmin, staffRoleOf } from "@/lib/auth";
import { readSchoolLife, resolveActorName } from "@/lib/school-life";
import {
  activityActionLabels,
  canViewControlLogs,
  isTeacherControlEnabled,
} from "@/lib/teacher-control";
import { formatDateTimeFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminTeacherLogsPage() {
  const session = await requireAdmin();
  const role = staffRoleOf(session);
  if (!canViewControlLogs(role)) notFound();
  const data = await readSchoolLife();
  if (!isTeacherControlEnabled(data)) notFound();
  const logs = [...data.activityLogs].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 200);

  return (
    <div className="space-y-6">
      <PageIntro
        title="Journal d’activité"
        lead="Append-only : lecture seule. Aucune modification ni suppression n’est possible depuis l’interface."
      />
      <ControlSubnav role={role} pathname="/admin/controle-enseignants/logs" />
      <Card title={`${logs.length} entrée(s) récentes`}>
        <TableWrap>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="py-2 pr-3 font-medium">Quand</th>
                <th className="py-2 pr-3 font-medium">Acteur</th>
                <th className="py-2 pr-3 font-medium">Action</th>
                <th className="py-2 font-medium">Détail</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-line/70 align-top">
                  <td className="py-3 pr-3 whitespace-nowrap">{formatDateTimeFr(log.at)}</td>
                  <td className="py-3 pr-3">
                    {resolveActorName(log.actorId, data)}
                    <span className="mt-0.5 block text-xs text-muted">{log.actorRole}</span>
                  </td>
                  <td className="py-3 pr-3 font-semibold">{activityActionLabels[log.action]}</td>
                  <td className="py-3 text-muted">
                    {Object.entries(log.payload)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(" · ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}
