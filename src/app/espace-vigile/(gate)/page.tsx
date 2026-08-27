import { PickupGateForm, VigileFlash } from "@/components/school/ExtrasUi";
import { requireVigile } from "@/lib/auth";
import { classLabel, readSchoolLife, studentFullName, todayISO } from "@/lib/school-life";
import { normalizePickupCode } from "@/lib/pickup-qr";
import { formatDateTimeFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

function formatTimeFr(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Abidjan",
  }).format(new Date(iso));
}

export default async function VigileGatePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; code?: string }>;
}) {
  const session = await requireVigile();
  const { ok, error, code } = await searchParams;
  const data = await readSchoolLife();
  const date = todayISO();
  const today = data.pickupAuths.filter((row) => row.date === date);
  const recent = today
    .filter((row) => row.usedAt)
    .sort((a, b) => (b.usedAt ?? "").localeCompare(a.usedAt ?? ""));
  const pending = today
    .filter((row) => !row.usedAt)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const defaultCode = code ? normalizePickupCode(code) : undefined;

  return (
    <div className="min-h-screen bg-green-deep px-4 py-6 text-white sm:py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">Les Étoiles Bingerville</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Tableau de bord vigile</h1>
          <p className="mt-3 text-white/80">
            Écran dédié à la grille. Un lecteur USB tape le code dans le champ (puis Entrée). Sinon, saisissez le
            code du parent.
          </p>
          <p className="mt-2 text-sm text-white/60">
            {session.displayName} · {date} · {pending.length} élève{pending.length === 1 ? "" : "s"} encore à
            récupérer · {recent.length} validation{recent.length === 1 ? "" : "s"}
          </p>
        </div>

        <VigileFlash ok={ok} error={error} />

        <div className="rounded-3xl bg-white p-6 text-ink sm:p-8">
          <PickupGateForm action="/api/pickup/validate" defaultCode={defaultCode} variant="vigile" />
        </div>

        <div className="rounded-3xl bg-white/10 p-6">
          <h2 className="font-display text-2xl">Élèves encore à récupérer</h2>
          {pending.length === 0 ? (
            <p className="mt-3 text-white/70">Aucun élève en attente de sortie aujourd’hui.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/10">
              {pending.map((auth) => {
                const student = data.students.find((row) => row.id === auth.studentId);
                const classroom = student ? classLabel(student.classId, data) : "—";
                return (
                  <li key={auth.id} className="py-3">
                    <span className="block text-lg font-semibold">
                      {student ? studentFullName(student) : auth.studentId}
                    </span>
                    <span className="text-sm text-white/70">
                      {classroom} · {auth.authorizedPerson}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-3xl bg-white/10 p-6">
          <h2 className="font-display text-2xl">Validations du jour</h2>
          {recent.length === 0 ? (
            <p className="mt-3 text-white/70">Aucune sortie validée aujourd’hui.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/10">
              {recent.map((auth) => {
                const student = data.students.find((row) => row.id === auth.studentId);
                const classroom = student ? classLabel(student.classId, data) : "—";
                return (
                  <li key={auth.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                    <span>
                      <span className="block text-lg font-semibold">
                        {student ? studentFullName(student) : auth.studentId}
                      </span>
                      <span className="text-sm text-white/70">
                        {classroom} · {auth.authorizedPerson}
                      </span>
                    </span>
                    <span className="font-mono text-lg text-white/90">
                      {auth.usedAt ? formatTimeFr(auth.usedAt) : formatDateTimeFr(auth.createdAt)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <form action="/api/auth/logout" method="post" className="text-center">
          <input type="hidden" name="next" value="/espace-vigile/connexion" />
          <button type="submit" className="text-sm text-white/60 underline hover:text-white">
            Déconnexion
          </button>
        </form>
      </div>
    </div>
  );
}
