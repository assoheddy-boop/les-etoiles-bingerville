import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, PageIntro } from "@/components/school/AdminUi";
import { ControlSubnav } from "@/components/school/ControlSubnav";
import { requireAdmin, staffRoleOf } from "@/lib/auth";
import {
  classLabel,
  readSchoolLife,
  staffPresenceLabels,
  subjectName,
} from "@/lib/school-life";
import {
  activityActionLabels,
  alertKindLabels,
  computeAlerts,
  isTeacherControlEnabled,
  teacherControlScore,
  teacherMessageSummaries,
  workdayHistory,
} from "@/lib/teacher-control";
import { formatDateFr, formatDateTimeFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminTeacherDetailPage({
  params,
}: {
  params: Promise<{ teacherId: string }>;
}) {
  const session = await requireAdmin();
  const role = staffRoleOf(session);
  const data = await readSchoolLife();
  if (!isTeacherControlEnabled(data)) notFound();
  const { teacherId } = await params;
  const teacher = data.teachers.find((row) => row.id === teacherId);
  if (!teacher) notFound();
  const score = teacherControlScore(teacher, data);
  const alerts = computeAlerts(data, teacher.id);
  const history = workdayHistory(teacher.id, data, 10);
  const messages = teacherMessageSummaries(teacher.id, data).slice(0, 8);
  const logs = data.activityLogs
    .filter((row) => row.actorId === `teacher:${teacher.id}`)
    .slice(0, 12);

  return (
    <div className="space-y-6">
      <PageIntro
        title={teacher.displayName}
        lead={`${teacher.title} · score ${score.score}/100 · ${score.classLabels.join(" · ") || "aucune classe"}`}
      />
      <ControlSubnav role={role} pathname="/admin/controle-enseignants" />
      <p>
        <Link href="/admin/controle-enseignants" className="text-sm font-semibold text-green hover:underline">
          ← Tous les enseignants
        </Link>
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Validations">
          <p className="text-2xl font-semibold">
            {score.lessonsValidated}/{score.lessonsExpected}
          </p>
        </Card>
        <Card title="Devoirs récents">
          <p className="text-2xl font-semibold">{score.homeworksRecent}</p>
        </Card>
        <Card title="Contrôles faits">
          <p className="text-2xl font-semibold">{score.assessmentsDone}</p>
        </Card>
        <Card title="Présence">
          <p className="text-2xl font-semibold">
            {score.presenceToday !== "—" && score.presenceToday in staffPresenceLabels
              ? staffPresenceLabels[score.presenceToday as keyof typeof staffPresenceLabels]
              : score.presenceToday}
          </p>
        </Card>
      </div>
      <Card title="Alertes">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted">Aucune alerte.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {alerts.map((alert) => (
              <li key={alert.id} className="rounded-2xl bg-paper px-4 py-3">
                <strong>{alertKindLabels[alert.kind]}</strong> — {alert.title}
                <span className="mt-1 block text-muted">{alert.detail}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card title="Jours travaillés">
        <ul className="space-y-2 text-sm">
          {history.map((day) => (
            <li key={day.date} className="flex justify-between gap-2 rounded-2xl bg-paper px-4 py-2">
              <span>{formatDateFr(day.date)}</span>
              <span>{day.worked ? "Travaillé" : "Non travaillé"}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Messages aux familles">
        {messages.length === 0 ? (
          <p className="text-sm text-muted">Aucun message envoyé.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {messages.map((row) => (
              <li key={row.id} className="rounded-2xl bg-paper px-4 py-3">
                <span className="font-semibold">{row.status === "lu" ? "Lu" : "Envoyé"}</span> ·{" "}
                {formatDateTimeFr(row.createdAt)}
                <span className="mt-1 block text-muted">{row.content.slice(0, 160)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card title="Journal (extrait)">
        {logs.length === 0 ? (
          <p className="text-sm text-muted">Aucune action tracée.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {logs.map((log) => (
              <li key={log.id} className="rounded-2xl bg-paper px-4 py-3">
                {formatDateTimeFr(log.at)} · {activityActionLabels[log.action]}
                {log.payload.classId ? ` · ${classLabel(String(log.payload.classId), data)}` : ""}
                {log.payload.subjectId ? ` · ${subjectName(String(log.payload.subjectId), data)}` : ""}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
