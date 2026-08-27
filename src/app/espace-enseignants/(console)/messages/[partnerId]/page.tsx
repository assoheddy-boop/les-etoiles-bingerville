import Link from "next/link";
import { notFound } from "next/navigation";
import { Flash } from "@/components/school/PortalUi";
import { MessageThread } from "@/components/school/MessageThread";
import { requireTeacher } from "@/lib/auth";
import {
  actorFromSession,
  canMessage,
  conversation,
  markConversationRead,
  partnersForActor,
  readSchoolLife,
} from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function TeacherChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ partnerId: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await requireTeacher();
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
  const next = `/espace-enseignants/messages/${encodeURIComponent(partnerId)}`;
  const studentId = partnerId.startsWith("parent:") ? partnerId.slice("parent:".length) : undefined;

  return (
    <div className="space-y-4">
      <Link href="/espace-enseignants/messages" className="text-sm font-semibold text-green hover:underline">
        ← Tous les contacts
      </Link>
      <div>
        <h1 className="font-display text-3xl text-green-deep">{partner.name}</h1>
        <p className="mt-1 text-muted">{partner.label}</p>
      </div>
      <Flash ok={ok} error={error} okText="Message envoyé." errorText="Impossible d’envoyer ce message." />
      <MessageThread
        actorId={actor.id}
        partnerId={partnerId}
        partnerName={partner.name}
        messages={messages}
        next={next}
        studentId={studentId}
      />
    </div>
  );
}
