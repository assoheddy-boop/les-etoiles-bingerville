import { notFound } from "next/navigation";
import { PaymentCheckout } from "@/components/payments/PaymentCheckout";
import { Container, PageHero } from "@/components/ui/Page";
import { requireParent } from "@/lib/auth";
import { invoiceOverlay } from "@/lib/ledger";
import { invoicesForStudent, parentChildView, readSchoolLife } from "@/lib/school-life";
import { formatFcfa } from "@/lib/payments";

export const dynamic = "force-dynamic";

export default async function InvoicePayPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  const session = await requireParent();
  const data = await readSchoolLife();
  const child = parentChildView(session.studentId, data);
  if (!child) notFound();
  const invoice = invoicesForStudent(child.id, data).find((item) => item.id === invoiceId);
  if (!invoice) notFound();
  const overlay = await invoiceOverlay(child.id);
  const status = overlay.get(invoice.id)?.status ?? invoice.status;
  if (status === "paid") {
    notFound();
  }

  return (
    <>
      <PageHero kicker="Règlement" title="Choisir un mode de paiement" lead="Interface de démonstration — aucun débit réel tant que le prestataire n’est pas branché." />
      <Container className="max-w-xl py-10">
        <PaymentCheckout
          invoiceId={invoice.id}
          label={`${invoice.label} — ${invoice.period}`}
          amountLabel={formatFcfa(invoice.amountFcfa)}
        />
      </Container>
    </>
  );
}
