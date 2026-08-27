export type PaymentProviderId = "wave" | "orange_money" | "cinetpay";

export type PaymentProvider = {
  id: PaymentProviderId;
  name: string;
  description: string;
  envKeys: string[];
};

export const paymentProviders: PaymentProvider[] = [
  {
    id: "wave",
    name: "Wave",
    description: "Paiement mobile Wave, très utilisé par les familles en Côte d’Ivoire.",
    envKeys: ["WAVE_API_KEY"],
  },
  {
    id: "orange_money",
    name: "Orange Money",
    description: "Paiement Orange Money (merchant / API partenaire).",
    envKeys: ["ORANGE_MONEY_MERCHANT_KEY"],
  },
  {
    id: "cinetpay",
    name: "CinetPay",
    description: "Agrégateur (Mobile Money, cartes). Souvent utilisé pour les sites scolaires.",
    envKeys: ["CINETPAY_API_KEY", "CINETPAY_SITE_ID", "CINETPAY_SECRET_KEY"],
  },
];

export function providerConfigured(provider: PaymentProvider) {
  return provider.envKeys.every((key) => Boolean(process.env[key]));
}

export function paymentsDemoMode() {
  return process.env.PAYMENTS_DEMO_MODE === "true";
}

export function formatFcfa(amount: number) {
  return new Intl.NumberFormat("fr-CI", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);
}
