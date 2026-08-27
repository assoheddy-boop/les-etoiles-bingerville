import { notFound } from "next/navigation";
import { Container, PageHero } from "@/components/ui/Page";
import { requireParent } from "@/lib/auth";
import {
  busForStudent,
  latestTransportEvent,
  parentChildView,
  readSchoolLife,
  todayISO,
  transportEventLabels,
  transportLogsForStudent,
} from "@/lib/school-life";
import { formatDateTimeFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ParentTransportPage() {
  const session = await requireParent();
  const data = await readSchoolLife();
  const child = parentChildView(session.studentId, data);
  if (!child) notFound();
  const date = todayISO();
  const bus = busForStudent(child.id, data);
  const latest = latestTransportEvent(child.id, data, date);
  const logs = transportLogsForStudent(child.id, data, date);

  return (
    <>
      <PageHero
        kicker="Transport"
        title={`Bus de ${child.studentName}`}
        lead={bus ? `${bus.name} · ${bus.driverName}` : "Pas encore affecté à une ligne."}
      />
      <Container className="space-y-6 py-10">
        {bus ? (
          <article className="rounded-3xl border border-line bg-white p-6">
            <p className="text-sm text-muted">{bus.note}</p>
            <p className="mt-1 text-sm text-muted">Immatriculation {bus.plate}</p>
            <h2 className="mt-4 font-display text-xl text-green-deep">Arrêts</h2>
            <ol className="mt-3 space-y-2">
              {bus.stops.map((stop) => (
                <li key={stop.id} className="flex justify-between rounded-2xl bg-paper px-4 py-3">
                  <span>{stop.name}</span>
                  <span className="font-semibold">{stop.time}</span>
                </li>
              ))}
            </ol>
          </article>
        ) : null}
        <article className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Aujourd’hui</h2>
          <p className="mt-3 text-lg font-semibold text-green-deep">
            {latest ? transportEventLabels[latest.event] : "Pas encore de pointage"}
          </p>
          {logs.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Le surveillant n’a pas encore noté le trajet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {logs.map((log) => (
                <li key={log.id} className="flex justify-between rounded-2xl bg-paper px-4 py-3 text-sm">
                  <span>{transportEventLabels[log.event]}{log.note ? ` — ${log.note}` : ""}</span>
                  <span className="text-muted">{formatDateTimeFr(log.recordedAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </Container>
    </>
  );
}
