import Link from "next/link";
import { AdminFlash, Card, Field, PageIntro, TableWrap, fieldClass } from "@/components/school/AdminUi";
import { ENROLLMENT_STATUS_OPTIONS, enrollmentStatusLabel, listEnrollmentRows } from "@/lib/enrollment";
import { currentYear, readSchoolLife, studentFullName } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminInscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; q?: string; men?: string; classId?: string; status?: string; notfound?: string; establishmentId?: string }>;
}) {
  const { ok, error, q, men, classId, status, notfound, establishmentId } = await searchParams;
  const data = await readSchoolLife();
  const year = currentYear(data);
  const rows = listEnrollmentRows(data, { q, men, classId, status, establishmentId });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageIntro
          title="Fiches d’inscription"
          lead="Même dossier que le secrétariat EduConnect : identité, famille, pièces, PDF, certificat et attestation."
        />
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/inscriptions/nouvelle" className="rounded-full bg-green px-4 py-2.5 text-sm font-semibold text-white">
            Nouvelle inscription
          </Link>
          <Link href="/admin/reinscriptions" className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold">
            Réinscriptions
          </Link>
        </div>
      </div>
      <p className="text-sm text-muted">
        Année scolaire <strong>{year?.label ?? "—"}</strong> — Groupe scolaire Les Étoiles de Bingerville
      </p>
      <AdminFlash ok={ok} error={error} />
      {notfound ? (
        <p className="rounded-2xl border border-terracotta/30 bg-terracotta-soft px-4 py-3 text-sm">
          Aucun élève trouvé pour ce matricule national (MEN).
        </p>
      ) : null}

      <form method="get" className="flex flex-wrap items-end gap-3 rounded-3xl border border-line bg-white p-4">
        <Field label="Recherche">
          <input name="q" defaultValue={q ?? ""} placeholder="Nom, prénom, matricule école…" className={fieldClass} />
        </Field>
        <Field label="Matricule national (MEN)">
          <input name="men" defaultValue={men ?? ""} placeholder="Ex. CI-2022-00418" className={fieldClass} />
        </Field>
        <Field label="Établissement">
          <select name="establishmentId" defaultValue={establishmentId ?? ""} className={fieldClass}>
            <option value="">Tous</option>
            {data.establishments.map((est) => (
              <option key={est.id} value={est.id}>
                {est.shortName}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Classe">
          <select name="classId" defaultValue={classId ?? ""} className={fieldClass}>
            <option value="">Toutes</option>
            {data.classes
              .filter((item) => !establishmentId || item.establishmentId === establishmentId)
              .map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} — {item.campus}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Statut">
          <select name="status" defaultValue={status ?? ""} className={fieldClass}>
            <option value="">Tous</option>
            {ENROLLMENT_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
        <button className="rounded-full bg-green px-4 py-2.5 text-sm font-semibold text-white">Rechercher</button>
        {q || men || classId || status || establishmentId ? (
          <Link href="/admin/inscriptions" className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold">
            Effacer
          </Link>
        ) : null}
      </form>

      <Card title={`Élèves (${rows.length})`}>
        {rows.length === 0 ? (
          <p>
            Aucun élève.{" "}
            <Link href="/admin/inscriptions/nouvelle" className="font-semibold text-green">
              Créer une fiche d’inscription
            </Link>
            .
          </p>
        ) : (
          <TableWrap>
            <table className="min-w-[48rem] w-full text-left text-sm">
              <thead className="text-muted">
                <tr>
                  <th className="px-2 py-2 font-semibold">Élève</th>
                  <th className="px-2 py-2 font-semibold">Classe</th>
                  <th className="px-2 py-2 font-semibold">Matricule</th>
                  <th className="px-2 py-2 font-semibold">MEN</th>
                  <th className="px-2 py-2 font-semibold">Statut</th>
                  <th className="px-2 py-2 font-semibold">Fiche {year?.label}</th>
                  <th className="px-2 py-2 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.student.id} className="border-t border-line">
                    <td className="px-2 py-3 font-semibold">{studentFullName(row.student)}</td>
                    <td className="px-2 py-3">{row.className}</td>
                    <td className="px-2 py-3 font-mono text-xs">{row.student.matricule || "—"}</td>
                    <td className="px-2 py-3 font-mono text-xs">{row.student.nationalMatricule || "—"}</td>
                    <td className="px-2 py-3">{enrollmentStatusLabel(row.enrollment?.enrollmentStatus)}</td>
                    <td className="px-2 py-3">{row.enrolled ? "✓ Complète" : "— À compléter"}</td>
                    <td className="px-2 py-3">
                      <Link
                        href={`/admin/inscriptions/${row.student.id}`}
                        className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold"
                      >
                        Ouvrir fiche
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>
    </div>
  );
}
