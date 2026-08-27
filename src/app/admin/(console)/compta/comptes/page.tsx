import { AdminFlash, Card, Field, PageIntro, TableWrap, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { categoryKindLabels, financeAccountTypeLabels, txTypeLabels } from "@/lib/accounting";
import { formatFcfa } from "@/lib/payments";
import { readSchoolLife, todayISO } from "@/lib/school-life";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminComptesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();

  return (
    <div className="space-y-6">
      <PageIntro title="Comptes + mouvements" lead="Caisse, Wave, Orange Money, banque — et les écritures." />
      <AdminFlash ok={ok} error={error} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Ajouter un compte">
          <form action="/api/admin/accounting" method="post" className="grid gap-3">
            <input type="hidden" name="action" value="account-create" />
            <Field label="Nom">
              <input name="name" required placeholder="Ex. MTN Money" className={fieldClass} />
            </Field>
            <Field label="Type">
              <select name="type" required className={fieldClass}>
                {Object.entries(financeAccountTypeLabels).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <button className={btnPrimary}>Ajouter</button>
          </form>
        </Card>
        <Card title="Nouvelle opération">
          <form action="/api/admin/accounting" method="post" className="grid gap-3">
            <input type="hidden" name="action" value="transaction" />
            <Field label="Type">
              <select name="type" required className={fieldClass}>
                <option value="in">Recette</option>
                <option value="out">Dépense</option>
              </select>
            </Field>
            <Field label="Montant (FCFA)">
              <input name="amount" type="number" min="1" required className={fieldClass} />
            </Field>
            <Field label="Compte">
              <select name="accountId" required className={fieldClass}>
                {data.financeAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Catégorie">
              <select name="categoryId" className={fieldClass}>
                <option value="">—</option>
                {data.expenseCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({categoryKindLabels[cat.kind]})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date">
              <input name="date" type="date" defaultValue={todayISO()} className={fieldClass} />
            </Field>
            <Field label="Libellé">
              <input name="label" required className={fieldClass} />
            </Field>
            <button className={btnPrimary}>Enregistrer</button>
          </form>
        </Card>
      </div>
      <Card title="Comptes">
        <TableWrap>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-muted">
                <th className="py-2">Compte</th>
                <th>Type</th>
                <th>Solde</th>
              </tr>
            </thead>
            <tbody>
              {data.financeAccounts.map((account) => (
                <tr key={account.id} className="border-t border-line">
                  <td className="py-2">{account.name}</td>
                  <td>{financeAccountTypeLabels[account.type]}</td>
                  <td>{formatFcfa(account.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>
      <Card title="Mouvements">
        <ul className="space-y-2 text-sm">
          {data.financeTransactions.map((tx) => (
            <li key={tx.id} className="flex flex-wrap justify-between gap-2 rounded-2xl bg-paper px-4 py-3">
              <span>
                {formatDateFr(tx.date)} · {txTypeLabels[tx.type]} · {tx.label}
              </span>
              <strong>{formatFcfa(tx.amount)}</strong>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
