import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, PageHero } from "@/components/ui/Page";
import { Flash } from "@/components/school/PortalUi";
import { MessageThread } from "@/components/school/MessageThread";
import { requireParent } from "@/lib/auth";
import {
  actorFromSession,
  canMessage,
  conversation,
  markConversationRead,
  partnersForActor,
  readSchoolLife,
} from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function ParentChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ partnerId: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await requireParent();
  const { partnerId: raw } = await params;
  const { ok, error } = await searchParams;
  const partnerId = decodeURIComponent(raw);
  const data = await readSchoolLife();
  const actor = actorFromSession(session, data);
  if (!canMessage(actor, partnerId, data)) notFound();
  await markConversationRead(actor.id, partnerId);
  const refreshed = await readSchoolLife();
  const partner = partnersForActor(actor, refreshed).find((item) => item.id === partnerId);
  if (!partner) notFound();
  const messages = conversation(actor.id, partnerId, refreshed);
  const next = `/espace-parents/messages/${encodeURIComponent(partnerId)}`;

  return (
    <>
      <PageHero kicker="Conversation" title={partner.name} lead={partner.label} />
      <Container className="space-y-4 py-10">
        <Link href="/espace-parents/messages" className="text-sm font-semibold text-green hover:underline">
          ← Tous les contacts
        </Link>
        <Flash
          ok={ok}
          error={error}
          okText="Message envoyé."
          errorText="Impossible d’envoyer ce message."
        />
        <MessageThread
          actorId={actor.id}
          partnerId={partnerId}
          partnerName={partner.name}
          messages={messages}
          next={next}
          studentId={session.studentId}
        />
      </Container>
    </>
  );
}
