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
}: {
  invoiceId: string;
  label: string;
  amountLabel: string;
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

  return (
    <div className="space-y-5 rounded-3xl border border-line bg-white p-6">
      <div>
        <p className="mb-3 rounded-2xl bg-paper-2 px-4 py-3 text-sm text-muted">
          Paiement non branché — Wave, Orange Money et CinetPay sont affichés pour la démo. Aucun débit réel.
        </p>
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
      <button
        type="button"
        disabled={pending}
        onClick={() => pay(true)}
        className="w-full rounded-full border border-line px-5 py-3 text-sm font-medium"
      >
        Simuler un paiement (mode démo local uniquement)
      </button>
      {message ? (
        <p className="rounded-2xl bg-terracotta-soft p-4 text-sm text-ink">{message}</p>
      ) : null}
      <p className="text-xs text-muted">
        TODO : brancher les clés Wave / Orange Money / CinetPay dans le fichier .env. Tant qu’elles
        sont absentes, aucun débit réel n’a lieu.
      </p>
    </div>
  );
}
