"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const providers = [
  { id: "wave", name: "Wave", hint: "Clé WAVE_API_KEY à configurer" },
  { id: "orange_money", name: "Orange Money", hint: "Clé ORANGE_MONEY_MERCHANT_KEY à configurer" },
  { id: "cinetpay", name: "CinetPay", hint: "CINETPAY_API_KEY, SITE_ID et SECRET_KEY à configurer" },
] as const;

export function PaymentCheckout({
  invoiceId,
  label,
  amountLabel,
  paymentsOnline,
  demoMode,
}: {
  invoiceId: string;
  label: string;
  amountLabel: string;
  paymentsOnline: boolean;
  demoMode: boolean;
}) {
  const router = useRouter();
  const [provider, setProvider] = useState<(typeof providers)[number]["id"]>("wave");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function pay(simulate: boolean) {
    setPending(true);
    setMessage("");
    const response = await fetch("/api/payments/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId, provider, simulate }),
    });
    const payload = (await response.json()) as { ok?: boolean; error?: string; message?: string };
    setPending(false);
    if (!response.ok) {
      setMessage(payload.error || "Paiement impossible pour le moment.");
      return;
    }
    if (payload.ok && simulate) {
      router.push("/espace-parents/paiements");
      router.refresh();
      return;
    }
    setMessage(payload.message || "Prestataire non configuré.");
  }

  if (!paymentsOnline && !demoMode) {
    return (
      <div className="space-y-5 rounded-3xl border border-line bg-white p-6">
        <p className="rounded-2xl bg-terracotta-soft px-4 py-3 text-sm font-medium text-ink">
          Paiement en ligne bientôt disponible — contactez le secrétariat pour régler cette échéance
          (espèces, virement ou autre mode convenu avec l’école).
        </p>
        <div>
          <h2 className="font-display text-2xl text-green-deep">{label}</h2>
          <p className="text-muted">{amountLabel}</p>
        </div>
        <p className="text-sm text-muted">
          Aucun débit en ligne est possible pour le moment. Le secrétariat confirmera le montant et les modalités.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-3xl border border-line bg-white p-6">
      {demoMode ? (
        <p className="mb-3 rounded-2xl bg-paper-2 px-4 py-3 text-sm text-muted">
          Mode démo local — Wave, Orange Money et CinetPay sont affichés pour les tests. Aucun débit réel.
        </p>
      ) : null}
      <div>
        <h2 className="font-display text-2xl text-green-deep">{label}</h2>
        <p className="text-muted">{amountLabel}</p>
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Mode de paiement</legend>
        {providers.map((item) => (
          <label key={item.id} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-3">
            <input
              type="radio"
              name="provider"
              checked={provider === item.id}
              onChange={() => setProvider(item.id)}
              className="mt-1"
            />
            <span>
              <span className="block font-medium">{item.name}</span>
              <span className="text-xs text-muted">{item.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <button
        type="button"
        disabled={pending}
        onClick={() => pay(false)}
        className="w-full rounded-full bg-green px-5 py-3 font-semibold text-white disabled:opacity-60"
      >
        Continuer vers le paiement
      </button>
      {demoMode ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => pay(true)}
          className="w-full rounded-full border border-line px-5 py-3 text-sm font-medium"
        >
          Simuler un paiement (mode démo local uniquement)
        </button>
      ) : null}
      {message ? (
        <p className="rounded-2xl bg-terracotta-soft p-4 text-sm text-ink">{message}</p>
      ) : null}
      {demoMode ? (
        <p className="text-xs text-muted">
          Les clés Wave / Orange Money / CinetPay doivent être renseignées dans .env pour un paiement réel.
        </p>
      ) : null}
    </div>
  );
}
