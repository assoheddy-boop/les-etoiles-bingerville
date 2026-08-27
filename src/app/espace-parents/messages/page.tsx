import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, PageHero } from "@/components/ui/Page";
import { requireParent } from "@/lib/auth";
import { actorFromSession, parentChildView, partnersForActor, readSchoolLife, unreadCount } from "@/lib/school-life";
import { school, whatsappUrl } from "@/lib/school";

export const dynamic = "force-dynamic";

export default async function ParentMessagesPage() {
  const session = await requireParent();
  const data = await readSchoolLife();
  const child = parentChildView(session.studentId, data);
  if (!child) notFound();
  const actor = actorFromSession(session, data);
  const partners = partnersForActor(actor, data);

  return (
    <>
      <PageHero
        kicker="Messagerie"
        title="Contacter l’école"
        lead="Écrivez à l’enseignant de la classe ou au secrétariat. WhatsApp reste un canal de secours."
      />
      <Container className="space-y-4 py-10">
        {partners.map((partner) => {
          const unread = unreadCount(actor.id, data, partner.id);
          return (
            <Link
              key={partner.id}
              href={`/espace-parents/messages/${encodeURIComponent(partner.id)}`}
              className="flex items-center justify-between rounded-3xl border border-line bg-white p-6 hover:border-green/30"
            >
              <span>
                <span className="block font-display text-xl text-green-deep">{partner.name}</span>
                <span className="text-sm text-muted">{partner.label}</span>
              </span>
              {unread > 0 ? (
                <span className="rounded-full bg-terracotta px-3 py-1 text-sm font-semibold text-white">
                  {unread}
                </span>
              ) : (
                <span className="text-sm font-semibold text-green">Ouvrir</span>
              )}
            </Link>
          );
        })}
        <a
          href={whatsappUrl(`Bonjour, je suis ${session.displayName}, parent de ${child.studentName}.`)}
          target="_blank"
          rel="noreferrer"
          className="block rounded-3xl border border-dashed border-green/40 bg-green-soft/40 p-6 text-green-deep"
        >
          <span className="font-display text-xl">WhatsApp secrétariat</span>
          <span className="mt-1 block text-sm">{school.phones[0].display} — canal secondaire</span>
        </a>
      </Container>
    </>
  );
}
