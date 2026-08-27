import Link from "next/link";
import { AdminFlash, Card, Field, PageIntro, TableWrap, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { discountLabel, motifLabel, socialDiscountLabels, socialMotifs, studentFeeBalance } from "@/lib/accounting";
import { formatFcfa } from "@/lib/payments";
import { classLabel, readSchoolLife, studentFullName } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminCasSociauxPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; q?: string; studentId?: string }>;
}) {
  const { ok, error, q, studentId } = await searchParams;
  const data = await readSchoolLife();
  const query = (q || "").trim().toLowerCase();
  const matches = query
    ? data.students.filter((student) =>
        `${student.firstName} ${student.lastName} ${student.matricule || ""}`.toLowerCase().includes(query),
      )
    : [];
  const selected = studentId ? data.students.find((row) => row.id === studentId) : undefined;
  const balance = selected ? studentFeeBalance(selected.id, data) : null;

  return (
    <div className="space-y-6">
      <PageIntro
        title="Cas sociaux"
        lead="Remises sur les frais (pourcentage, montant fixe ou note d’échéancier), distinctes des bourses plateforme."
      />
      <AdminFlash ok={ok} error={error} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Nouveau dossier">
          <form className="mb-4 grid gap-3">
            <Field label="Rechercher un élève">
              <input name="q" defaultValue={q} placeholder="Nom, prénom ou matricule" className={fieldClass} />
            </Field>
            <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold">Rechercher</button>
          </form>
          {matches.length > 0 ? (
            <TableWrap>
              <table className="mb-4 w-full text-left text-sm">
                <tbody>
                  {matches.map((student) => (
                    <tr key={student.id} className="border-t border-line">
                      <td className="py-2">{studentFullName(student)}</td>
                      <td>{student.matricule || "—"}</td>
                      <td>
                        <Link
                          href={`/admin/cas-sociaux?studentId=${student.id}&q=${encodeURIComponent(q || "")}`}
                          className="font-semibold text-green-deep"
                        >
                          Choisir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          ) : null}
          {selected && balance ? (
            <div className="space-y-3">
              <p>
                <strong>{studentFullName(selected)}</strong>
                <br />
                <span className="text-sm text-muted">{classLabel(selected.classId, data)}</span>
              </p>
              <p className="text-sm text-muted">
                Catalogue {formatFcfa(balance.catalog)} · dû {formatFcfa(balance.due)}
              </p>
              {balance.socialCase ? (
                <p className="text-sm">Un dossier actif existe déjà. Clôturez-le avant d’en ouvrir un autre.</p>
              ) : (
                <form action="/api/admin/cas-sociaux" method="post" className="grid gap-3">
                  <input type="hidden" name="studentId" value={selected.id} />
                  <Field label="Motif">
                    <select name="motif" required className={fieldClass}>
                      <option value="">Choisir…</option>
                      {socialMotifs.map((motif) => (
                        <option key={motif.value} value={motif.value}>
                          {motif.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Type de remise">
                    <select name="discountType" className={fieldClass}>
                      {Object.entries(socialDiscountLabels).map(([id, label]) => (
                        <option key={id} value={id}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Valeur">
                    <input name="discountValue" type="number" min="1" required className={fieldClass} />
                  </Field>
                  <Field label="Notes">
                    <textarea name="note" rows={2} className={fieldClass} />
                  </Field>
                  <button className={btnPrimary}>Enregistrer le dossier</button>
                </form>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted">Choisissez un élève (orphelin, précarité, famille nombreuse…).</p>
          )}
        </Card>
        <Card title="Dossiers">
          <ul className="space-y-3">
            {data.socialCases.map((row) => {
              const student = data.students.find((item) => item.id === row.studentId);
              return (
                <li key={row.id} className="rounded-2xl bg-paper p-4">
                  <p className="font-semibold">{student ? studentFullName(student) : row.studentId}</p>
                  <p className="text-sm text-muted">
                    {motifLabel(row.motif)} · {discountLabel(row)} · {row.status}
                  </p>
                  {row.note ? <p className="mt-1 text-sm">{row.note}</p> : null}
                  {row.status === "actif" ? (
                    <form action="/api/admin/cas-sociaux" method="post" className="mt-3">
                      <input type="hidden" name="action" value="close" />
                      <input type="hidden" name="id" value={row.id} />
                      <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold">Clôturer</button>
                    </form>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
