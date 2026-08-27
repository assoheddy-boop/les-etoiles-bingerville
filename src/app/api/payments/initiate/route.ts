import { NextResponse } from "next/server";
import { getParentSession } from "@/lib/auth";
import { invoicesForStudent, readSchoolLife } from "@/lib/school-life";
import { recordPayment } from "@/lib/ledger";
import { paymentProviders, paymentsDemoMode, providerConfigured, type PaymentProviderId } from "@/lib/payments";

export async function POST(request: Request) {
  const session = await getParentSession();
  if (!session) return NextResponse.json({ error: "Veuillez vous connecter." }, { status: 401 });

  const body = (await request.json()) as {
    invoiceId?: string;
    provider?: PaymentProviderId;
    simulate?: boolean;
  };
  const data = await readSchoolLife();
  const invoice = invoicesForStudent(session.studentId, data).find((item) => item.id === body.invoiceId);
  if (!invoice) {
    return NextResponse.json({ error: "Échéance introuvable." }, { status: 404 });
  }

  const provider = paymentProviders.find((item) => item.id === body.provider);
  if (!provider) {
    return NextResponse.json({ error: "Prestataire inconnu." }, { status: 400 });
  }

  if (body.simulate) {
    if (!paymentsDemoMode()) {
      return NextResponse.json(
        {
          error:
            "La simulation n’est autorisée qu’en local (PAYMENTS_DEMO_MODE=true). Aucun paiement réel n’est actif.",
        },
        { status: 403 },
      );
    }
    await recordPayment({
      invoiceId: invoice.id,
      studentId: session.studentId,
      status: "paid",
      provider: provider.id,
      updatedAt: new Date().toISOString(),
      note: "Simulation locale — ne pas confondre avec un encaissement réel",
    });
    return NextResponse.json({ ok: true, simulated: true });
  }

  if (!providerConfigured(provider)) {
    return NextResponse.json({
      ok: false,
      message: `Paiement ${provider.name} non connecté. TODO : renseigner ${provider.envKeys.join(", ")} dans .env. Aucun débit n’a été effectué.`,
    });
  }

  return NextResponse.json({
    ok: false,
    message: `Les clés ${provider.name} sont présentes mais l’intégration API n’est pas encore écrite. Ne pas encaisser les familles tant que ce TODO n’est pas terminé.`,
  });
}
