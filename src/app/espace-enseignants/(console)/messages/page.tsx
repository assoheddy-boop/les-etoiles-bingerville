import Link from "next/link";
import { requireTeacher } from "@/lib/auth";
import { actorFromSession, partnersForActor, readSchoolLife, unreadCount } from "@/lib/school-life";
import { school, whatsappUrl } from "@/lib/school";
import { isTeacherControlEnabled, teacherMessageSummaries } from "@/lib/teacher-control";
import { formatDateTimeFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TeacherMessagesPage() {
  const session = await requireTeacher();
  const data = await readSchoolLife();
  const actor = actorFromSession(session, data);
  const partners = partnersForActor(actor, data);
  const sent = isTeacherControlEnabled(data) ? teacherMessageSummaries(session.teacherId, data).slice(0, 12) : [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl text-green-deep">Messages</h1>
        <p className="mt-2 text-muted">Fils simples avec les familles des élèves qui ont un compte parent.</p>
      </div>
      {partners.map((partner) => {
        const unread = unreadCount(actor.id, data, partner.id);
        return (
          <Link
            key={partner.id}
            href={`/espace-enseignants/messages/${encodeURIComponent(partner.id)}`}
            className="flex items-center justify-between rounded-3xl border border-line bg-white p-6 hover:border-green/30"
          >
            <span>
              <span className="block font-display text-xl text-green-deep">{partner.name}</span>
              <span className="text-sm text-muted">{partner.label}</span>
            </span>
            {unread > 0 ? (
              <span className="rounded-full bg-terracotta px-3 py-1 text-sm font-semibold text-white">{unread}</span>
            ) : (
              <span className="text-sm font-semibold text-green">Ouvrir</span>
            )}
          </Link>
        );
      })}
      {sent.length > 0 ? (
        <article className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Mes envois</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {sent.map((row) => (
              <li key={row.id} className="rounded-2xl bg-paper px-4 py-3">
                <span className="font-semibold">{row.status === "lu" ? "Lu par la famille" : "Envoyé"}</span>
                <span className="text-muted"> · {formatDateTimeFr(row.createdAt)}</span>
                <span className="mt-1 block text-muted">{row.content.slice(0, 140)}</span>
              </li>
            ))}
          </ul>
        </article>
      ) : null}
      <a
        href={whatsappUrl("Bonjour, message de l’équipe pédagogique Les Étoiles.")}
        target="_blank"
        rel="noreferrer"
        className="block rounded-3xl border border-dashed border-green/40 bg-green-soft/40 p-6 text-green-deep"
      >
        WhatsApp secrétariat · {school.phones[0].display}
      </a>
    </div>
  );
}
