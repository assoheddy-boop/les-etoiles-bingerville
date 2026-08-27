import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, PageIntro } from "@/components/school/AdminUi";
import { ControlSubnav } from "@/components/school/ControlSubnav";
import { PollRefresh } from "@/components/school/PollRefresh";
import { requireAdmin, staffRoleOf } from "@/lib/auth";
import { readSchoolLife } from "@/lib/school-life";
import {
  alertKindLabels,
  computeAlerts,
  isTeacherControlEnabled,
  type TeacherAlertKind,
} from "@/lib/teacher-control";

export const dynamic = "force-dynamic";

const KINDS: TeacherAlertKind[] = [
  "lesson_unvalidated",
  "homework_missing",
  "grades_late",
  "assessment_late",
  "no_message",
  "bulletin_missing",
];

export default async function AdminTeacherAlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; teacherId?: string }>;
}) {
  const session = await requireAdmin();
  const role = staffRoleOf(session);
  const data = await readSchoolLife();
  if (!isTeacherControlEnabled(data)) notFound();
  const { kind, teacherId } = await searchParams;
  let alerts = computeAlerts(data, teacherId || undefined);
  if (kind && KINDS.includes(kind as TeacherAlertKind)) {
    alerts = alerts.filter((row) => row.kind === kind);
  }

  return (
    <div className="space-y-6">
      <PollRefresh seconds={30} />
      <PageIntro
        title="Alertes enseignants"
        lead="Calculées à chaque chargement : cours non validés, devoirs, notes, contrôles, messages, bulletins."
      />
      <ControlSubnav role={role} pathname="/admin/controle-enseignants/alertes" />
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/controle-enseignants/alertes"
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${!kind ? "bg-green text-white" : "border border-line bg-white"}`}
        >
          Toutes ({computeAlerts(data).length})
        </Link>
        {KINDS.map((item) => {
          const count = computeAlerts(data).filter((row) => row.kind === item).length;
          return (
            <Link
              key={item}
              href={`/admin/controle-enseignants/alertes?kind=${item}`}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                kind === item ? "bg-green text-white" : "border border-line bg-white"
              }`}
            >
              {alertKindLabels[item]} ({count})
            </Link>
          );
        })}
      </div>
      {alerts.length === 0 ? (
        <Card title="Aucune alerte">
          <p className="text-sm text-muted">Rien à signaler pour ce filtre.</p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {alerts.map((alert) => (
            <li key={alert.id} className="rounded-3xl border border-line bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-terracotta">
                {alertKindLabels[alert.kind]}
              </p>
              <h2 className="mt-1 font-display text-xl text-green-deep">{alert.title}</h2>
              <p className="mt-1 text-sm text-muted">{alert.teacherName}</p>
              <p className="mt-2 text-sm">{alert.detail}</p>
              <Link
                href={`/admin/controle-enseignants/${alert.teacherId}`}
                className="mt-3 inline-block text-sm font-semibold text-green-deep underline"
              >
                Fiche enseignant
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
