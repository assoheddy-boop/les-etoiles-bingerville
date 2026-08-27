import Link from "next/link";
import { AdminFlash, Card, PageIntro, TableWrap } from "@/components/school/AdminUi";
import { budgetRows, financeAccountTypeLabels, treasuryTotal, txTypeLabels } from "@/lib/accounting";
import { formatFcfa } from "@/lib/payments";
import { currentMonth, currentYear, readSchoolLife } from "@/lib/school-life";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminComptaPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const month = currentMonth();
  const year = currentYear(data)?.label ?? "2026-2027";
  const txs = data.financeTransactions.filter((row) => row.date.slice(0, 7) === month);
  const income = txs.filter((row) => row.type === "in").reduce((sum, row) => sum + row.amount, 0);
  const expense = txs.filter((row) => row.type === "out").reduce((sum, row) => sum + row.amount, 0);
  const budget = budgetRows(data, year);

  return (
    <div className="space-y-6">
      <PageIntro
        title="Comptabilité"
        lead="Trésorerie Wave, Orange Money, caisse et banque — comptes d’école, pas la plateforme super-admin."
      />
      <AdminFlash ok={ok} error={error} />
      <div className="flex flex-wrap gap-3 text-sm">
        <Link href={`/api/admin/caisse?journal=1&month=${month}`} className="rounded-full border border-line px-4 py-2 font-semibold">
          Journal PDF {month}
        </Link>
        <Link href="/admin/caisse" className="rounded-full border border-line px-4 py-2 font-semibold">
          Caisse
        </Link>
        <Link href="/admin/cas-sociaux" className="rounded-full border border-line px-4 py-2 font-semibold">
          Cas sociaux
        </Link>
        <Link href="/admin/frais" className="rounded-full border border-line px-4 py-2 font-semibold">
          Frais
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Solde des comptes">
          <p className="text-2xl font-semibold">{formatFcfa(treasuryTotal(data))}</p>
        </Card>
        <Card title={`Recettes — ${month}`}>
          <p className="text-2xl font-semibold">{formatFcfa(income)}</p>
        </Card>
        <Card title={`Dépenses — ${month}`}>
          <p className="text-2xl font-semibold">{formatFcfa(expense)}</p>
        </Card>
        <Card title="Cas sociaux">
          <p className="text-2xl font-semibold">{data.socialCases.filter((row) => row.status === "actif").length}</p>
        </Card>
      </div>
      <Card title="Trésorerie par compte">
        <div className="grid gap-3 sm:grid-cols-2">
          {data.financeAccounts.map((account) => (
            <div key={account.id} className="rounded-2xl bg-paper p-4">
              <p className="text-sm text-muted">
                {account.name} ({financeAccountTypeLabels[account.type]})
              </p>
              <p className="text-xl font-semibold">{formatFcfa(account.balance)}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card title={`Budget ${year}`}>
        <TableWrap>
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="text-muted">
                <th className="py-2">Catégorie</th>
                <th>Prévu</th>
                <th>Réalisé</th>
                <th>Écart</th>
              </tr>
            </thead>
            <tbody>
              {budget.map((row) => (
                <tr key={row.id} className="border-t border-line">
                  <td className="py-2">{row.categoryName}</td>
                  <td>{formatFcfa(row.planned)}</td>
                  <td>{formatFcfa(row.actual)}</td>
                  <td>{formatFcfa(row.variance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>
      <Card title="Derniers mouvements">
        <ul className="space-y-2 text-sm">
          {data.financeTransactions.slice(0, 8).map((tx) => (
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
