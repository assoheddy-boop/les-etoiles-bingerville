import Link from "next/link";
import { readInbox } from "@/lib/cms";

export const dynamic = "force-dynamic";

const kindLabels: Record<string, string> = {
  contact: "Contact",
  inscription: "Inscription",
};

export default async function DemandesPage() {
  const inbox = await readInbox();

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-green-deep">Demandes familles</h1>
      <p className="text-sm text-muted">
        Messages du formulaire contact et des demandes d’inscription. Les e-mails partent automatiquement si
        Resend est configuré ; cette liste reste la source de vérité côté secrétariat.
      </p>
      {inbox.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-line bg-white p-8 text-center text-muted">
          Aucune demande pour le moment. Les nouvelles soumissions depuis{" "}
          <Link href="/contact" className="font-semibold text-green hover:underline">
            /contact
          </Link>{" "}
          et{" "}
          <Link href="/inscriptions" className="font-semibold text-green hover:underline">
            /inscriptions
          </Link>{" "}
          apparaîtront ici.
        </p>
      ) : null}
      {inbox.map((item) => (
        <article key={item.id} className="rounded-3xl border border-line bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-terracotta">
            {kindLabels[item.kind] ?? item.kind} · {new Date(item.createdAt).toLocaleString("fr-FR")}
          </p>
          <h2 className="mt-1 font-display text-xl">{item.name}</h2>
          <p className="text-sm">
            {item.phone}
            {item.email ? ` · ${item.email}` : ""}
            {item.cycle ? ` · ${item.cycle}` : ""}
          </p>
          <p className="mt-3 whitespace-pre-wrap text-muted">{item.message}</p>
          {item.kind === "inscription" ? (
            <div className="mt-4">
              {item.convertedStudentId ? (
                <Link
                  href={`/admin/inscriptions/${item.convertedStudentId}`}
                  className="inline-flex rounded-full bg-green-soft px-4 py-2 text-sm font-semibold text-green-deep"
                >
                  Fiche créée — ouvrir
                </Link>
              ) : (
                <Link
                  href={`/admin/inscriptions/nouvelle?inboxId=${encodeURIComponent(item.id)}`}
                  className="inline-flex rounded-full bg-green px-4 py-2 text-sm font-semibold text-white"
                >
                  Créer la fiche d’inscription
                </Link>
              )}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
