import { AdminFlash, Card, PageIntro } from "@/components/school/AdminUi";
import { HealthForm } from "@/components/school/ExtrasUi";
import { classLabel, healthKindLabels, readSchoolLife, studentFullName } from "@/lib/school-life";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSantePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const incidents = [...data.healthIncidents].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="space-y-6">
      <PageIntro
        title="Santé"
        lead="Signalements courts (fièvre, blessure, renvoyé à la maison). Pas de dossier médical : les parents voient uniquement la note de leur enfant."
      />
      <AdminFlash ok={ok} error={error} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Nouveau signalement">
          <HealthForm action="/api/admin/health" students={data.students} />
        </Card>
        <Card title="Dernières notes">
          {incidents.length === 0 ? (
            <p className="text-sm text-muted">Aucun signalement.</p>
          ) : (
            <ul className="space-y-3">
              {incidents.map((item) => {
                const student = data.students.find((row) => row.id === item.studentId);
                return (
                  <li key={item.id} className="rounded-2xl bg-paper px-4 py-3">
                    <p className="text-xs text-muted">
                      {formatDateFr(item.date)} · {student ? studentFullName(student) : item.studentId} ·{" "}
                      {student ? classLabel(student.classId, data) : ""}
                    </p>
                    <p className="mt-1 font-semibold text-green-deep">{healthKindLabels[item.kind]}</p>
                    <p className="mt-1 text-sm text-muted">{item.note}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
