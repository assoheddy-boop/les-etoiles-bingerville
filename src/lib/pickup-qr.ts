import QRCode from "qrcode";

const CODE_RE = /ETOILES-[A-Z0-9]+/i;

/** Extrait ETOILES-XXXX d’une saisie, d’un scan USB ou d’une URL (?code=). */
export function normalizePickupCode(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed, "https://lesetoiles.ci");
    const fromQuery = url.searchParams.get("code");
    if (fromQuery) {
      const match = fromQuery.toUpperCase().match(CODE_RE);
      if (match) return match[0];
    }
  } catch {
    // texte brut, pas une URL
  }
  const match = trimmed.toUpperCase().match(CODE_RE);
  return match ? match[0] : trimmed.toUpperCase();
}

export function pickupQrPayload(code: string) {
  return normalizePickupCode(code);
}

export async function pickupQrSvg(code: string, size = 240): Promise<string> {
  const payload = pickupQrPayload(code);
  if (!payload) return "";
  return QRCode.toString(payload, {
    type: "svg",
    width: size,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#1a1714", light: "#ffffff" },
  });
}
