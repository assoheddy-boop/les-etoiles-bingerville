import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, PageHero } from "@/components/ui/Page";
import { requireParent } from "@/lib/auth";
import { invoiceOverlay } from "@/lib/ledger";
import { feeKindLabels, invoicesForStudent, parentChildView, readSchoolLife } from "@/lib/school-life";
import { formatFcfa, onlinePaymentsConnected, paymentsDemoMode } from "@/lib/payments";

export const dynamic = "force-dynamic";

const labels = (demo: boolean) => ({
  due: "À payer",
  paid: demo ? "Payé (démo)" : "Payé",
  pending: "En cours",
});

export default async function PaiementsPage() {
  const session = await requireParent();
  const data = await readSchoolLife();
  const child = parentChildView(session.studentId, data);
  if (!child) notFound();
  const overlay = await invoiceOverlay(child.id);
  const invoices = invoicesForStudent(child.id, data).map((invoice) => ({
    ...invoice,
    status: overlay.get(invoice.id)?.status ?? invoice.status,
  }));
  const demoMode = paymentsDemoMode();
  const paymentsOnline = onlinePaymentsConnected();
  const statusLabels = labels(demoMode);
  const lead = paymentsOnline
    ? "Choisissez une échéance et réglez en ligne."
    : demoMode
      ? "Mode démo : simulation locale des échéances."
      : "Consultez vos échéances. Le paiement en ligne arrive bientôt — contactez le secrétariat pour régler.";

  return (
    <>
      <PageHero kicker="Paiements" title="Scolarité et cantine" lead={lead} />
      <Container className="space-y-4 py-10">
        {!paymentsOnline && !demoMode ? (
          <p className="rounded-3xl border border-terracotta/30 bg-terracotta-soft px-5 py-4 text-sm font-medium text-ink">
            Paiement en ligne bientôt disponible — contactez le secrétariat pour les modalités de règlement.
          </p>
        ) : null}
        {invoices.length === 0 ? (
          <p className="rounded-3xl border border-line bg-white p-6 text-muted">Aucune échéance pour le moment.</p>
        ) : null}
        {invoices.map((invoice) => (
          <article
            key={invoice.id}
            className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs uppercase tracking-wider text-terracotta">{feeKindLabels[invoice.kind]}</p>
              <h2 className="font-display text-2xl text-green-deep">{invoice.label}</h2>
              <p className="text-muted">
                {invoice.period} · {formatFcfa(invoice.amountFcfa)} · {statusLabels[invoice.status]}
              </p>
            </div>
            {invoice.status === "due" ? (
              <Link
                href={`/espace-parents/paiements/${invoice.id}`}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-green px-5 py-3 text-center font-semibold text-white"
              >
                Régler
              </Link>
            ) : (
              <span className="rounded-full bg-green-soft px-4 py-2 text-sm font-semibold text-green-deep">
                {statusLabels[invoice.status]}
              </span>
            )}
          </article>
        ))}
      </Container>
    </>
  );
}
