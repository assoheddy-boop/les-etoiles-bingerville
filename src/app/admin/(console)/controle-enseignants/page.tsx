import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, PageIntro, TableWrap } from "@/components/school/AdminUi";
import { ControlSubnav } from "@/components/school/ControlSubnav";
import { PollRefresh } from "@/components/school/PollRefresh";
import { requireAdmin, staffRoleOf } from "@/lib/auth";
import { readSchoolLife, staffPresenceLabels } from "@/lib/school-life";
import {
  canExportControlStats,
  canToggleTeacherControl,
  computeAlerts,
  isTeacherControlEnabled,
  staffRoleLabels,
  teacherControlRanking,
} from "@/lib/teacher-control";
import { formatDateTimeFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

function pct(value: number) {
  return `${Math.round(value * 100)} %`;
}

export default async function AdminTeacherControlPage() {
  const session = await requireAdmin();
  const role = staffRoleOf(session);
  const data = await readSchoolLife();
  const enabled = isTeacherControlEnabled(data);
  if (!enabled && !canToggleTeacherControl(role)) notFound();
  const ranking = enabled ? teacherControlRanking(data) : [];
  const alerts = enabled ? computeAlerts(data) : [];

  return (
    <div className="space-y-6">
      <PollRefresh seconds={30} />
      <PageIntro
        title="Contrôle des enseignants"
        lead={`Vue ${staffRoleLabels[role].toLowerCase()}. Classement et alertes calculés à la lecture — actualisation toutes les 30 s, sans websocket.`}
      />
      <ControlSubnav role={role} pathname="/admin/controle-enseignants" />
      {!enabled ? (
        <p className="rounded-2xl bg-terracotta-soft px-4 py-3 text-sm text-terracotta">
          Module désactivé.{" "}
          <Link href="/admin/controle-enseignants/parametres" className="font-semibold underline">
            Réactiver dans les paramètres
          </Link>
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card title="Enseignants">
          <p className="text-2xl font-semibold">{data.teachers.length}</p>
        </Card>
        <Card title="Alertes">
          <p className="text-2xl font-semibold">{alerts.length}</p>
        </Card>
        <Card title="Journal">
          <p className="text-2xl font-semibold">{data.activityLogs.length}</p>
        </Card>
      </div>
      {enabled ? (
        <Card title="Classement">
          {canExportControlStats(role) ? (
            <Link
              href="/api/admin/teacher-control/export"
              className="mb-4 inline-flex min-h-10 items-center rounded-full bg-green px-4 text-sm font-semibold text-white"
            >
              Export CSV
            </Link>
          ) : null}
          <TableWrap>
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-muted">
                  <th className="py-2 pr-3 font-medium">#</th>
                  <th className="py-2 pr-3 font-medium">Enseignant</th>
                  <th className="py-2 pr-3 font-medium">Score</th>
                  <th className="py-2 pr-3 font-medium">Validations</th>
                  <th className="py-2 pr-3 font-medium">Devoirs</th>
                  <th className="py-2 pr-3 font-medium">Notes</th>
                  <th className="py-2 pr-3 font-medium">Alertes</th>
                  <th className="py-2 font-medium">Présence</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((row, index) => (
                  <tr key={row.teacherId} className="border-b border-line/70">
                    <td className="py-3 pr-3">{index + 1}</td>
                    <td className="py-3 pr-3">
                      <Link
                        href={`/admin/controle-enseignants/${row.teacherId}`}
                        className="font-semibold text-green-deep hover:underline"
                      >
                        {row.teacherName}
                      </Link>
                      <span className="mt-0.5 block text-xs text-muted">{row.classLabels.join(" · ") || "—"}</span>
                    </td>
                    <td className="py-3 pr-3 font-semibold">{row.score}</td>
                    <td className="py-3 pr-3">{pct(row.validationRate)}</td>
                    <td className="py-3 pr-3">{pct(row.homeworkRate)}</td>
                    <td className="py-3 pr-3">{pct(row.gradeRate)}</td>
                    <td className="py-3 pr-3">{row.alertCount}</td>
                    <td className="py-3">
                      {row.presenceToday !== "—" && row.presenceToday in staffPresenceLabels
                        ? staffPresenceLabels[row.presenceToday as keyof typeof staffPresenceLabels]
                        : row.presenceToday}
                      {row.lastLoginAt ? (
                        <span className="mt-0.5 block text-xs text-muted">{formatDateTimeFr(row.lastLoginAt)}</span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </Card>
      ) : null}
    </div>
  );
}
