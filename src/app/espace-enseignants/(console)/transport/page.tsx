import { ExtrasFlash, TransportButtons } from "@/components/school/ExtrasUi";
import { requireTeacher } from "@/lib/auth";
import {
  latestTransportEvent,
  readSchoolLife,
  studentFullName,
  todayISO,
  transportEventLabels,
} from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function TeacherTransportPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  await requireTeacher();
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const date = todayISO();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-green-deep">Suivi bus</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Pointage chauffeur / surveillant : monté, arrivé, sorti, récupéré. Les parents voient le statut du jour.
        </p>
      </div>
      <ExtrasFlash ok={ok} error={error} okText="Pointage enregistré. Les parents voient la mise à jour." />
      {data.busLines.map((line) => (
        <article key={line.id} className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-2xl text-green-deep">{line.name}</h2>
          <p className="mt-1 text-sm text-muted">
            {line.driverName} · {line.plate}
            {line.note ? ` · ${line.note}` : ""}
          </p>
          <ol className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
            {line.stops.map((stop) => (
              <li key={stop.id} className="rounded-full bg-paper px-3 py-1">
                {stop.time} {stop.name}
              </li>
            ))}
          </ol>
          <ul className="mt-5 space-y-3">
            {line.studentIds.map((id) => {
              const student = data.students.find((row) => row.id === id);
              if (!student) return null;
              const latest = latestTransportEvent(id, data, date);
              return (
                <li key={id} className="rounded-2xl bg-paper px-4 py-3">
                  <div className="mb-2 flex flex-wrap justify-between gap-2">
                    <span className="font-medium">{studentFullName(student)}</span>
                    <span className="text-xs font-semibold text-green-deep">
                      {latest ? transportEventLabels[latest.event] : "En attente"}
                    </span>
                  </div>
                  <TransportButtons action="/api/teacher/transport" student={student} latest={latest?.event} />
                </li>
              );
            })}
          </ul>
        </article>
      ))}
    </div>
  );
}
