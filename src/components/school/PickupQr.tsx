import { pickupQrSvg } from "@/lib/pickup-qr";
import { formatDateTimeFr } from "@/lib/utils";
import { PrintButton } from "./PrintButton";

export async function PickupQr({
  code,
  size = 240,
  label,
}: {
  code: string;
  size?: number;
  label?: string;
}) {
  const svg = await pickupQrSvg(code, size);
  if (!svg.startsWith("<svg")) return null;
  return (
    <div
      className="rounded-2xl bg-white p-2 ring-1 ring-line [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `QR code ${code}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export async function PickupCodeCard({
  code,
  person,
  phone,
  usedAt,
  studentName,
}: {
  code: string;
  person: string;
  phone?: string;
  usedAt?: string;
  studentName: string;
}) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-3xl border border-line bg-white p-8 text-center print:border-line">
      <PickupQr code={code} size={280} />
      <p className="font-mono text-3xl font-bold tracking-[0.18em] text-green-deep sm:text-4xl">{code}</p>
      <div>
        <p className="font-semibold">{studentName}</p>
        <p className="text-sm text-muted">Personne autorisée : {person}</p>
        {phone ? <p className="text-sm text-muted">{phone}</p> : null}
      </div>
      {usedAt ? (
        <p className="rounded-full bg-terracotta-soft px-3 py-1 text-sm font-semibold text-terracotta">
          Sortie déjà validée
        </p>
      ) : (
        <>
          <p className="max-w-sm text-sm text-muted">
            À présenter à la grille aujourd’hui. Le vigile scanne ce QR (lecteur USB) ou tape le code.
          </p>
          <PrintButton label="Imprimer le QR" />
        </>
      )}
    </div>
  );
}

export async function PickupCodeList({
  items,
}: {
  items: Array<{
    id: string;
    code: string;
    studentName: string;
    person: string;
    usedAt?: string;
  }>;
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-paper px-4 py-3">
          <PickupQr code={item.code} size={88} />
          <span className="min-w-0 flex-1">
            <strong className="font-mono tracking-wide">{item.code}</strong>
            <span className="mt-0.5 block text-sm">
              {item.studentName} · {item.person}
            </span>
          </span>
          <span className="text-sm font-semibold">
            {item.usedAt ? `Validé ${formatDateTimeFr(item.usedAt)}` : "Actif"}
          </span>
        </li>
      ))}
    </ul>
  );
}
