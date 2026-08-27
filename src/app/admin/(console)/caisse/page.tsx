import Link from "next/link";
import { AdminFlash, Card, Field, PageIntro, TableWrap, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { discountLabel, financeAccountTypeLabels, invoiceDueAmount, motifLabel, studentFeeBalance } from "@/lib/accounting";
import { formatFcfa } from "@/lib/payments";
import { classLabel, readSchoolLife, studentFullName } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminCaissePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; q?: string; studentId?: string; ticket?: string }>;
}) {
  const { ok, error, q, studentId, ticket } = await searchParams;
  const data = await readSchoolLife();
  const query = (q || "").trim().toLowerCase();
  const matches = query
    ? data.students.filter((student) => {
        const hay = `${student.firstName} ${student.lastName} ${student.matricule || ""}`.toLowerCase();
        return hay.includes(query);
      })
    : [];
  const selected = studentId ? data.students.find((row) => row.id === studentId) : undefined;
  const balance = selected ? studentFeeBalance(selected.id, data) : null;
  const dueInvoices = selected ? data.invoices.filter((row) => row.studentId === selected.id && row.status !== "paid") : [];
  const receipts = data.financeTransactions.filter((row) => row.invoiceId).slice(0, 8);

  return (
    <div className="space-y-6">
      <PageIntro
        title="Caisse secrétariat"
        lead="Encaisser au guichet contre une facture élève (espèces, Wave, Orange Money ou banque) et imprimer le ticket."
      />
      <AdminFlash ok={ok} error={error} />
      {ticket ? (
        <p className="rounded-2xl bg-green-soft px-4 py-3 text-sm">
          Encaissement enregistré.{" "}
          <a href={`/api/admin/caisse/${ticket}/ticket`} className="font-semibold text-green-deep underline">
            Télécharger le reçu PDF
          </a>
        </p>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Nouvel encaissement">
          <form className="mb-4 grid gap-3">
            <Field label="Rechercher un élève">
              <input name="q" defaultValue={q} placeholder="Nom, prénom ou matricule" className={fieldClass} />
            </Field>
            <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold">Rechercher</button>
          </form>
          {query && matches.length === 0 ? <p className="text-sm text-muted">Aucun élève trouvé.</p> : null}
          {matches.length > 0 ? (
            <TableWrap>
              <table className="mb-4 w-full text-left text-sm">
                <thead>
                  <tr className="text-muted">
                    <th className="py-2">Élève</th>
                    <th>Matricule</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((student) => (
                    <tr key={student.id} className="border-t border-line">
                      <td className="py-2">{studentFullName(student)}</td>
                      <td>{student.matricule || "—"}</td>
                      <td>
                        <Link
                          href={`/admin/caisse?studentId=${student.id}&q=${encodeURIComponent(q || "")}`}
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
          {!selected ? <p className="text-sm text-muted">Choisissez un élève pour encaisser.</p> : null}
          {selected && balance ? (
            <div className="space-y-4">
              <p>
                <strong>{studentFullName(selected)}</strong>
                <br />
                <span className="text-sm text-muted">
                  {selected.matricule || "—"} — {classLabel(selected.classId, data)}
                </span>
              </p>
              {balance.socialCase ? (
                <p className="text-sm">
                  Cas social : {motifLabel(balance.socialCase.motif)} — remise {discountLabel(balance.socialCase)}. Dû
                  après remise : {formatFcfa(balance.due)}.
                </p>
              ) : (
                <p className="text-sm text-muted">Reste à encaisser : {formatFcfa(balance.due)}.</p>
              )}
              {dueInvoices.length === 0 ? (
                <p className="text-sm text-muted">Aucune facture due.</p>
              ) : (
                dueInvoices.map((invoice) => (
                  <form key={invoice.id} action="/api/admin/caisse" method="post" className="rounded-2xl bg-paper p-4">
                    <input type="hidden" name="invoiceId" value={invoice.id} />
                    <p className="font-semibold">
                      {invoice.label} · {invoice.period}
                    </p>
                    <p className="text-sm text-muted">
                      Catalogue {formatFcfa(invoice.amountFcfa)} · à encaisser {formatFcfa(invoiceDueAmount(invoice, data))}
                    </p>
                    <Field label="Compte">
                      <select name="accountId" required className={fieldClass}>
                        {data.financeAccounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.name} ({financeAccountTypeLabels[account.type]})
                          </option>
                        ))}
                      </select>
                    </Field>
                    <button className={`${btnPrimary} mt-3`}>Encaisser</button>
                  </form>
                ))
              )}
            </div>
          ) : null}
        </Card>
        <Card title="Derniers reçus">
          <ul className="space-y-2 text-sm">
            {receipts.map((tx) => (
              <li key={tx.id} className="flex flex-wrap justify-between gap-2 rounded-2xl bg-paper px-4 py-3">
                <span>
                  {tx.label} · {formatFcfa(tx.amount)}
                </span>
                <a href={`/api/admin/caisse/${tx.id}/ticket`} className="font-semibold text-green-deep">
                  Ticket PDF
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card title="Paiement espèces (file SuperAdmin)">
        <p className="mb-4 text-sm text-muted">
          Enregistrement interne en attente de validation SuperAdmin. N’appelle pas Wave ni Orange Money.
        </p>
        <form action="/api/secretaire/cash-payment" method="post" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input type="hidden" name="next" value="/admin/caisse" />
          <Field label="Parent">
            <select name="parentId" required className={fieldClass}>
              <option value="">Choisir…</option>
              {data.parents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.displayName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Élève (optionnel)">
            <select name="studentId" className={fieldClass}>
              <option value="">—</option>
              {data.students
                .filter((row) => row.parentId)
                .map((row) => (
                  <option key={row.id} value={row.id}>
                    {studentFullName(row)}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Montant (FCFA)">
            <input name="amount" type="number" min={1} required className={fieldClass} />
          </Field>
          <div className="flex items-end">
            <button className={btnPrimary}>Mettre en file</button>
          </div>
        </form>
      </Card>
    </div>
  );
}
