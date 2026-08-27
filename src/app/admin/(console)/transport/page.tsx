import { Card, CheckboxGroup, Field, PageIntro, btnDanger, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { ExtrasFlash, TransportButtons } from "@/components/school/ExtrasUi";
import {
  busForStudent,
  classLabel,
  formatStops,
  latestTransportEvent,
  readSchoolLife,
  studentFullName,
  todayISO,
  transportEventLabels,
} from "@/lib/school-life";
import { formatDateTimeFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminTransportPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const date = todayISO();
  const studentOptions = data.students.map((student) => ({
    id: student.id,
    label: `${studentFullName(student)} · ${classLabel(student.classId, data)}`,
  }));

  return (
    <div className="space-y-6">
      <PageIntro
        title="Transport scolaire"
        lead="Lignes Bingerville, arrêts, élèves affectés. L’enseignant (ou le surveillant) note montée et arrivée ; les parents voient le statut du jour."
      />
      <ExtrasFlash ok={ok} error={error} okText="Ligne enregistrée. Les espaces parents et enseignants voient la mise à jour." />

      <Card title="Nouvelle ligne">
        <form action="/api/admin/transport" method="post" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom de la ligne">
              <input name="name" required placeholder="Ex. Ligne Les Étoiles" className={fieldClass} />
            </Field>
            <Field label="Chauffeur">
              <input name="driverName" required className={fieldClass} />
            </Field>
            <Field label="Immatriculation">
              <input name="plate" placeholder="CI-0000-BV" className={fieldClass} />
            </Field>
            <Field label="Note">
              <input name="note" placeholder="Départ 06:25 — Adjamé-Bingerville" className={fieldClass} />
            </Field>
          </div>
          <Field label="Arrêts (une ligne : 06:40 — Marché Bingerville)">
            <textarea name="stops" rows={4} className={fieldClass} placeholder={"06:25 — Adjamé-Bingerville\n06:55 — Les Étoiles"} />
          </Field>
          <div>
            <p className="mb-2 text-sm font-medium">Élèves de la ligne</p>
            <CheckboxGroup name="studentIds" options={studentOptions} selected={[]} />
          </div>
          <button className={btnPrimary}>Créer la ligne</button>
        </form>
      </Card>

      {data.busLines.map((line) => (
        <Card key={line.id} title={line.name}>
          <p className="mb-4 text-sm text-muted">
            {line.driverName} · {line.plate}
            {line.note ? ` · ${line.note}` : ""}
          </p>
          <form action="/api/admin/transport" method="post" className="space-y-4">
            <input type="hidden" name="id" value={line.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom">
                <input name="name" required defaultValue={line.name} className={fieldClass} />
              </Field>
              <Field label="Chauffeur">
                <input name="driverName" required defaultValue={line.driverName} className={fieldClass} />
              </Field>
              <Field label="Immatriculation">
                <input name="plate" defaultValue={line.plate} className={fieldClass} />
              </Field>
              <Field label="Note">
                <input name="note" defaultValue={line.note ?? ""} className={fieldClass} />
              </Field>
            </div>
            <Field label="Arrêts">
              <textarea name="stops" rows={4} defaultValue={formatStops(line.stops)} className={fieldClass} />
            </Field>
            <div>
              <p className="mb-2 text-sm font-medium">Élèves</p>
              <CheckboxGroup name="studentIds" options={studentOptions} selected={line.studentIds} />
            </div>
            <button className={btnPrimary}>Enregistrer</button>
          </form>
          <form action="/api/admin/transport" method="post" className="mt-4">
            <input type="hidden" name="action" value="delete" />
            <input type="hidden" name="id" value={line.id} />
            <button className={btnDanger}>Supprimer la ligne</button>
          </form>
        </Card>
      ))}

      <Card title={`Journal du ${date}`}>
        {data.busLines.length === 0 ? (
          <p className="text-sm text-muted">Aucune ligne pour l’instant.</p>
        ) : (
          <div className="space-y-6">
            {data.busLines.map((line) => (
              <div key={line.id}>
                <h3 className="font-semibold text-green-deep">{line.name}</h3>
                <ul className="mt-3 space-y-3">
                  {line.studentIds.map((id) => {
                    const student = data.students.find((row) => row.id === id);
                    if (!student) return null;
                    const latest = latestTransportEvent(id, data, date);
                    return (
                      <li key={id} className="rounded-2xl bg-paper px-4 py-3">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium">{studentFullName(student)}</span>
                          <span className="text-xs text-muted">
                            {latest ? transportEventLabels[latest.event] : "Pas encore de pointage"}
                          </span>
                        </div>
                        <TransportButtons
                          action="/api/admin/transport"
                          student={student}
                          latest={latest?.event}
                          extra={{ action: "log" }}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-xs text-muted">
          Le journal enseignant / surveillant se fait aussi depuis l’espace enseignants. Les parents voient le
          dernier statut.
        </p>
      </Card>

      <Card title="Historique récent">
        <ul className="space-y-2 text-sm">
          {data.transportLogs.slice(0, 12).map((log) => {
            const student = data.students.find((row) => row.id === log.studentId);
            const bus = busForStudent(log.studentId, data);
            return (
              <li key={log.id} className="flex flex-wrap justify-between gap-2 rounded-2xl bg-paper px-4 py-3">
                <span>
                  <strong>{student ? studentFullName(student) : log.studentId}</strong>
                  {" · "}
                  {transportEventLabels[log.event]}
                  {bus ? ` · ${bus.name}` : ""}
                </span>
                <span className="text-muted">{formatDateTimeFr(log.recordedAt)}</span>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
