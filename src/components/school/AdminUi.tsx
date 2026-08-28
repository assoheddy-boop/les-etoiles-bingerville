import { Flash } from "./PortalUi";

export const fieldClass =
  "w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2.5 font-normal";
export const btnPrimary =
  "inline-flex min-h-11 w-full items-center justify-center rounded-full bg-green px-5 py-3 font-semibold text-white hover:bg-green-deep sm:w-auto";
export const btnDanger =
  "inline-flex min-h-11 items-center rounded-full border border-terracotta/30 px-3 py-1.5 text-xs font-semibold text-terracotta hover:bg-terracotta-soft";

export function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1">{children}</div>;
}

export function AdminFlash({ error, ok }: { error?: string; ok?: string }) {
  const errorText =
    error === "conflict"
      ? "Ce créneau chevauche un cours déjà posé."
      : error === "in-use"
        ? "Impossible : des élèves ou des cours y sont encore liés."
        : error === "duplicate"
        ? "Cet identifiant ou cet e-mail est déjà utilisé."
        : error === "matricule"
          ? "Ce matricule école est déjà utilisé."
          : error === "nationalMatricule"
            ? "Ce matricule national est déjà utilisé."
            : error === "class"
              ? "Classe invalide."
              : error === "data"
                ? "Veuillez remplir les champs obligatoires (nom, prénom, classe)."
                : error === "not_found"
                  ? "Élève introuvable."
                  : error === "too-large"
                    ? "Photo trop lourde (4 Mo maximum)."
                    : error === "type"
                      ? "Photo : JPG, PNG ou WebP uniquement."
                      : error === "overlap"
                        ? "Une demande de congé couvre déjà ces dates."
                        : error === "amount"
                          ? "Montant invalide."
                          : error === "exists"
                            ? "Un dossier actif existe déjà pour cet élève."
                            : error === "paid"
                              ? "Déjà payé ou clôturé."
                              : error === "account"
                                ? "Compte introuvable."
                                : error === "invoice"
                                  ? "Facture introuvable."
                                  : error === "range"
                                    ? "Les dates sont incohérentes."
                                    : error === "persist"
                                      ? "Enregistrement impossible : stockage durable non configuré (BLOB_READ_WRITE_TOKEN sur Vercel)."
                                      : error === "forbidden"
                                        ? "Action réservée à un autre rôle direction."
                                        : error === "module"
                                          ? "Ce module est désactivé ou indisponible."
                                          : error === "scope"
                                            ? "Choisissez une cible (rôle, école ou utilisateur)."
                                            : error === "student"
                                              ? "Élève invalide pour ce parent."
                                              : error === "missing"
                                                ? "Élément introuvable."
                                        : error
                                          ? "Enregistrement impossible. Vérifiez les champs."
                                          : "";
  return (
    <Flash
      ok={ok}
      error={error}
      okText="Enregistré. Les espaces parents et enseignants voient la mise à jour."
      errorText={errorText}
    />
  );
}

export function PageIntro({ title, lead }: { title: string; lead: string }) {
  return (
    <div>
      <h1 className="font-display text-2xl text-green-deep sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted">{lead}</p>
    </div>
  );
}

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-3xl border border-line bg-white p-4 sm:p-5 md:p-6">
      <h2 className="font-display text-xl text-green-deep">{title}</h2>
      <div className="mt-4">{children}</div>
    </article>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

export function CheckboxGroup({
  name,
  options,
  selected,
}: {
  name: string;
  options: Array<{ id: string; label: string }>;
  selected: string[];
}) {
  if (options.length === 0) {
    return <p className="text-sm text-muted">Aucun élément à cocher pour l’instant.</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <label
          key={option.id}
          className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm font-normal"
        >
          <input
            type="checkbox"
            name={name}
            value={option.id}
            defaultChecked={selected.includes(option.id)}
            className="accent-green"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
