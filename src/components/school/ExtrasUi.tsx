import { healthKindLabels, studentFullName, todayISO, transportEventLabels } from "@/lib/school-life";
import type { HealthKind, RosterStudent, TransportEvent } from "@/lib/school-life-types";
import { Flash } from "./PortalUi";

export const extrasErrors: Record<string, string> = {
  invalid: "Code invalide ou inconnu.",
  expired: "Ce code n’est valable que pour aujourd’hui.",
  used: "Ce code a déjà servi à la grille.",
  "no-bus": "Cet élève n’est pas inscrit sur une ligne de bus.",
  claimed: "Cet objet a déjà été réclamé.",
  missing: "Élément introuvable.",
  overlap: "Une demande de congé couvre déjà ces dates.",
  "too-large": "La photo dépasse 4 Mo.",
  type: "Format de photo non accepté (JPG, PNG ou WebP).",
  file: "Impossible d’enregistrer la photo.",
  amount: "Montant invalide.",
  range: "Les dates sont incohérentes.",
  paid: "Déjà traité.",
};

export function ExtrasFlash({
  ok,
  error,
  okText,
}: {
  ok?: string;
  error?: string;
  okText: string;
}) {
  const decoded = ok && ok !== "1" ? decodeURIComponent(ok) : "";
  return (
    <Flash
      ok={ok}
      error={error}
      okText={decoded ? decoded : okText}
      errorText={extrasErrors[error ?? ""] || "Enregistrement impossible. Vérifiez les champs."}
    />
  );
}

export function VigileFlash({ ok, error }: { ok?: string; error?: string }) {
  if (ok) {
    const text = ok !== "1" ? decodeURIComponent(ok) : "Sortie validée.";
    return (
      <div className="rounded-3xl bg-green px-6 py-8 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.3em]">Autorisé</p>
        <p className="mt-2 font-display text-3xl leading-tight sm:text-5xl">{text}</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-3xl bg-[#b42318] px-6 py-8 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.3em]">Refusé</p>
        <p className="mt-2 font-display text-3xl leading-tight sm:text-5xl">
          {extrasErrors[error] || "Code refusé."}
        </p>
      </div>
    );
  }
  return null;
}

export function TransportButtons({
  action,
  student,
  latest,
  extra,
}: {
  action: string;
  student: RosterStudent;
  latest?: TransportEvent;
  extra?: Record<string, string>;
}) {
  const events: TransportEvent[] = ["boarded", "arrived", "left_school", "picked_up"];
  return (
    <form action={action} method="post" className="flex flex-wrap gap-2">
      <input type="hidden" name="studentId" value={student.id} />
      {extra
        ? Object.entries(extra).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />)
        : null}
      {events.map((event) => (
        <button
          key={event}
          name="event"
          value={event}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
            latest === event
              ? "border-green bg-green-soft text-green-deep"
              : "border-line hover:bg-paper-2"
          }`}
        >
          {transportEventLabels[event]}
        </button>
      ))}
    </form>
  );
}

export function HealthForm({
  action,
  students,
}: {
  action: string;
  students: RosterStudent[];
}) {
  const kinds = Object.entries(healthKindLabels) as Array<[HealthKind, string]>;
  return (
    <form action={action} method="post" className="space-y-4">
      <label className="grid gap-1 text-sm font-medium">
        Élève
        <select name="studentId" required className="rounded-xl border border-line bg-paper px-3 py-2.5 font-normal">
          <option value="">— Choisir —</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {studentFullName(student)}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Type
        <select name="kind" required className="rounded-xl border border-line bg-paper px-3 py-2.5 font-normal">
          {kinds.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Note courte (pas de dossier médical)
        <textarea
          name="note"
          required
          rows={3}
          maxLength={240}
          placeholder="Ex. Fièvre légère, parents prévenus."
          className="rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
        />
      </label>
      <button type="submit" className="rounded-full bg-green px-5 py-3 font-semibold text-white hover:bg-green-deep">
        Enregistrer le signalement
      </button>
    </form>
  );
}

export function LostItemForm({ action }: { action: string }) {
  return (
    <form action={action} method="post" encType="multipart/form-data" className="space-y-4">
      <label className="grid gap-1 text-sm font-medium">
        Description
        <input
          name="description"
          required
          placeholder="Ex. Gourde bleue, sweat gris…"
          className="rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Lieu
        <input
          name="place"
          required
          placeholder="Ex. Cour maternelle"
          className="rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Date
        <input
          name="foundAt"
          type="date"
          required
          defaultValue={todayISO()}
          className="rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Photo (optionnel)
        <input
          name="photo"
          type="file"
          accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
          className="rounded-xl border border-line bg-paper px-3 py-2.5 font-normal file:mr-3 file:rounded-full file:border-0 file:bg-green-soft file:px-3 file:py-1 file:text-sm file:font-semibold file:text-green-deep"
        />
        <span className="text-xs font-normal text-muted">JPG, PNG ou WebP — 4 Mo maximum.</span>
      </label>
      <button type="submit" className="rounded-full bg-green px-5 py-3 font-semibold text-white hover:bg-green-deep">
        Déclarer l’objet trouvé
      </button>
    </form>
  );
}

export function PickupGateForm({
  action,
  extra,
  defaultCode,
  variant = "default",
}: {
  action: string;
  extra?: Record<string, string>;
  defaultCode?: string;
  variant?: "default" | "vigile";
}) {
  const vigile = variant === "vigile";
  return (
    <form action={action} method="post" className="space-y-4">
      {extra
        ? Object.entries(extra).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />)
        : null}
      <label className={`grid gap-2 font-medium ${vigile ? "text-base" : "text-sm"}`}>
        {vigile ? "Code du jour (saisie ou lecteur USB)" : "Code (saisie ou scan USB)"}
        <input
          name="code"
          required
          autoFocus
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          defaultValue={defaultCode}
          placeholder="ETOILES-XXXX"
          className={
            vigile
              ? "rounded-2xl border-2 border-line bg-paper px-5 py-6 text-center font-mono text-3xl uppercase tracking-[0.18em] sm:text-5xl"
              : "rounded-2xl border border-line bg-paper px-4 py-4 font-mono text-2xl uppercase tracking-[0.2em]"
          }
        />
      </label>
      <button
        type="submit"
        className={
          vigile
            ? "w-full rounded-full bg-green px-5 py-6 text-2xl font-semibold text-white hover:bg-green-deep"
            : "w-full rounded-full bg-green px-5 py-4 text-lg font-semibold text-white hover:bg-green-deep"
        }
      >
        Valider la sortie
      </button>
    </form>
  );
}
