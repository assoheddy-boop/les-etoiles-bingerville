import { school, whatsappUrl } from "@/lib/school";
import type { SchoolMessage } from "@/lib/school-life-types";
import { formatDateTimeFr } from "@/lib/utils";

export function MessageThread({
  actorId,
  partnerId,
  partnerName,
  messages,
  next,
  studentId,
}: {
  actorId: string;
  partnerId: string;
  partnerName: string;
  messages: SchoolMessage[];
  next: string;
  studentId?: string;
}) {
  const wa = whatsappUrl(
    `Bonjour, je vous contacte depuis l’espace Les Étoiles à propos de ${partnerName}.`,
  );
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white">
      <div className="space-y-3 p-4 md:p-6">
        {messages.length === 0 ? (
          <p className="rounded-2xl bg-paper px-4 py-6 text-center text-sm text-muted">
            Aucun message. Envoyez le premier.
          </p>
        ) : (
          messages.map((message) => {
            const mine = message.senderId === actorId;
            return (
              <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    mine ? "bg-green text-white" : "bg-paper text-ink"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  <time className={`mt-1 block text-xs ${mine ? "text-white/75" : "text-muted"}`}>
                    {formatDateTimeFr(message.createdAt)}
                  </time>
                </div>
              </div>
            );
          })
        )}
      </div>
      <form action="/api/messages" method="post" className="border-t border-line bg-paper-2/50 p-4 md:p-5">
        <input type="hidden" name="partnerId" value={partnerId} />
        <input type="hidden" name="next" value={next} />
        {studentId ? <input type="hidden" name="studentId" value={studentId} /> : null}
        <label className="grid gap-1 text-sm font-medium">
          Message
          <textarea
            name="content"
            required
            rows={3}
            placeholder="Écrire un message…"
            className="rounded-xl border border-line bg-white px-3 py-2.5 font-normal"
          />
        </label>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="submit" className="rounded-full bg-green px-5 py-2.5 font-semibold text-white hover:bg-green-deep">
            Envoyer
          </button>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-green hover:underline"
          >
            Ou WhatsApp {school.phones[0].display}
          </a>
        </div>
      </form>
    </div>
  );
}
