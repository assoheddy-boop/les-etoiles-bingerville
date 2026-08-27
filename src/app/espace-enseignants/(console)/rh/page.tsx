import { Card, Field, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { ExtrasFlash } from "@/components/school/ExtrasUi";
import { requireTeacher } from "@/lib/auth";
import { advanceStatusLabels, contractTypeLabels, jobTitleLabels, staffForTeacher } from "@/lib/hr";
import { formatFcfa } from "@/lib/payments";
import {
  leaveStatusLabels,
  leaveTypeLabels,
  readSchoolLife,
  staffPresenceLabels,
  todayISO,
} from "@/lib/school-life";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TeacherRhPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await requireTeacher();
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const profile = staffForTeacher(session.teacherId, data);
  const date = todayISO();
  const presence = profile
    ? data.staffPresence.find((row) => row.staffId === profile.id && row.date === date)
    : undefined;
  const leaves = profile ? data.leaveRequests.filter((row) => row.staffId === profile.id) : [];
  const advances = profile ? data.salaryAdvances.filter((row) => row.staffId === profile.id) : [];
  const slips = profile ? data.payslips.filter((row) => row.staffId === profile.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-green-deep">Mon espace RH</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Votre dossier, présence, congés, avances et fiches de paie. Les salaires des autres agents ne sont pas visibles.
        </p>
      </div>
      <ExtrasFlash ok={ok} error={error} okText="Enregistré. La direction voit la demande ou le pointage." />
      {profile ? (
        <Card title="Mon profil">
          <p className="font-semibold">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-sm text-muted">
            {jobTitleLabels[profile.jobTitle]} · {contractTypeLabels[profile.contractType]} · {profile.campus}
          </p>
          <p className="mt-2 text-sm">Salaire de base (votre dossier) : {formatFcfa(profile.baseSalary)}</p>
        </Card>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Présence du jour">
          <p className="mb-4 text-sm text-muted">
            Statut actuel : <strong>{presence ? staffPresenceLabels[presence.status] : "Pas encore pointé"}</strong>
          </p>
          <form action="/api/teacher/hr" method="post" className="flex flex-wrap gap-2">
            <input type="hidden" name="action" value="presence" />
            {(["present", "late", "absent"] as const).map((status) => (
              <button
                key={status}
                name="status"
                value={status}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  presence?.status === status ? "border-green bg-green-soft text-green-deep" : "border-line hover:bg-paper-2"
                }`}
              >
                {staffPresenceLabels[status]}
              </button>
            ))}
          </form>
        </Card>
        <Card title="Mes fiches de paie">
          {slips.length === 0 ? <p className="text-sm text-muted">Aucun bulletin de paie pour l’instant.</p> : null}
          <ul className="space-y-3">
            {slips.map((slip) => (
              <li key={slip.id} className="rounded-2xl bg-paper px-4 py-3">
                <p className="font-semibold">
                  {slip.month} · net {formatFcfa(slip.netPay)}
                </p>
                <a href={`/api/teacher/hr/payslip/${slip.id}`} className="text-sm font-semibold text-green-deep">
                  Télécharger ma fiche de paie
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card title="Demander un congé">
        <form action="/api/teacher/hr" method="post" className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="action" value="leave" />
          <Field label="Type">
            <select name="type" required className={fieldClass}>
              {Object.entries(leaveTypeLabels).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Motif">
            <input name="reason" required className={fieldClass} />
          </Field>
          <Field label="Du">
            <input name="startDate" type="date" required min={date} className={fieldClass} />
          </Field>
          <Field label="Au">
            <input name="endDate" type="date" required min={date} className={fieldClass} />
          </Field>
          <div className="sm:col-span-2">
            <button className={btnPrimary}>Envoyer à la direction</button>
          </div>
        </form>
      </Card>
      <Card title="Mes demandes">
        {leaves.length === 0 ? <p className="text-sm text-muted">Aucune demande.</p> : null}
        <ul className="space-y-3">
          {leaves.map((leave) => (
            <li key={leave.id} className="rounded-2xl bg-paper px-4 py-3">
              <p className="font-semibold">
                {leaveTypeLabels[leave.type]} · {leaveStatusLabels[leave.status]}
              </p>
              <p className="text-sm text-muted">
                {formatDateFr(leave.startDate)} → {formatDateFr(leave.endDate)} — {leave.reason}
              </p>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Demander une avance">
        <form action="/api/teacher/hr" method="post" className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="action" value="advance" />
          <Field label="Montant (FCFA)">
            <input name="amount" type="number" min="1" required className={fieldClass} />
          </Field>
          <Field label="Motif">
            <input name="reason" required className={fieldClass} />
          </Field>
          <div>
            <button className={btnPrimary}>Envoyer</button>
          </div>
        </form>
        <ul className="mt-4 space-y-2 text-sm">
          {advances.map((row) => (
            <li key={row.id} className="rounded-2xl bg-paper px-4 py-3">
              {formatFcfa(row.amount)} · {row.reason} · {advanceStatusLabels[row.status]}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
