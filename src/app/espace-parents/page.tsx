import { invoiceOverlay } from "@/lib/ledger";
import { requireParent } from "@/lib/auth";
import { Container, PageHero } from "@/components/ui/Page";
import { ModuleCard } from "@/components/school/PortalUi";
import { formatFcfa } from "@/lib/payments";
import {
  absencesForStudent,
  gradesForStudent,
  healthForStudent,
  homeworksForStudent,
  invoicesForStudent,
  latestTransportEvent,
  parentActorId,
  parentChildView,
  readSchoolLife,
  todayPickup,
  todayISO,
  transportEventLabels,
  unclaimedLostItems,
  unreadCount,
} from "@/lib/school-life";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EspaceParentsPage() {
  const session = await requireParent();
  const data = await readSchoolLife();
  const child = parentChildView(session.studentId, data);
  if (!child) notFound();
  const overlay = await invoiceOverlay(child.id);
  const invoices = invoicesForStudent(child.id, data).map((invoice) => ({
    ...invoice,
    status: overlay.get(invoice.id)?.status ?? invoice.status,
  }));
  const due = invoices.filter((invoice) => invoice.status === "due");
  const grades = gradesForStudent(child.id, data);
  const absences = absencesForStudent(child.id, data);
  const homeworks = homeworksForStudent(child.id, data);
  const bulletins = data.bulletins.filter((item) => item.studentId === child.id);
  const unread = unreadCount(parentActorId(child.id), data);
  const busStatus = latestTransportEvent(child.id, data, todayISO());
  const pickup = todayPickup(child.id, data);
  const healthNotes = healthForStudent(child.id, data);
  const lostOpen = unclaimedLostItems(data);

  return (
    <>
      <PageHero
        kicker="Espace parents"
        title={child.studentName}
        lead={`${child.classroom} · Matricule ${child.matricule || "—"}`}
      />
      <Container className="grid gap-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <ModuleCard
          href="/espace-parents/emploi-du-temps"
          title="Emploi du temps"
          hint="Grille de la classe, publiée par la direction."
        />
        <ModuleCard
          href="/espace-parents/paiements"
          title="Paiements"
          hint="Scolarité et cantine. Prestataire réel à brancher ensuite."
          value={due.length ? `${due.length} échéance(s) à régler` : "Rien à payer"}
        />
        <ModuleCard
          href="/espace-parents/notes"
          title="Notes"
          hint="Résultats publiés par l’enseignant."
          value={grades.length ? `${grades.length} note(s)` : "Aucune note"}
        />
        <ModuleCard
          href="/espace-parents/absences"
          title="Absences & retards"
          hint="Appel quotidien de la classe."
          value={absences.length ? `${absences.length} signalement(s)` : "Aucun signalement"}
        />
        <ModuleCard
          href="/espace-parents/devoirs"
          title="Devoirs"
          hint="Travail à faire à la maison, sans compte enfant."
          value={homeworks.length ? `${homeworks.length} devoir(s)` : "Aucun devoir"}
        />
        <ModuleCard
          href="/espace-parents/bulletins"
          title="Bulletins"
          hint="Consultation en ligne et téléchargement PDF."
          value={bulletins.length ? `${bulletins.length} bulletin(s)` : "Pas encore"}
        />
        <ModuleCard
          href="/espace-parents/messages"
          title="Messages"
          hint="Écrire à l’enseignant ou au secrétariat. WhatsApp en secours."
          value={unread ? `${unread} non lu(s)` : "Messagerie école"}
        />
        <ModuleCard
          href="/espace-parents/transport"
          title="Bus"
          hint="Ligne, arrêts et statut du trajet aujourd’hui."
          value={busStatus ? transportEventLabels[busStatus.event] : "Pas encore de pointage"}
        />
        <ModuleCard
          href="/espace-parents/sortie"
          title="QR sortie"
          hint="QR du jour à montrer à la grille (ou le code à taper)."
          value={pickup ? (pickup.usedAt ? "Sortie déjà validée" : pickup.code) : "Pas encore de code"}
        />
        <ModuleCard
          href="/espace-parents/sante"
          title="Santé"
          hint="Notes courtes de l’école, sans dossier médical."
          value={healthNotes.length ? `${healthNotes.length} note(s)` : "Rien à signaler"}
        />
        <ModuleCard
          href="/espace-parents/objets-perdus"
          title="Objets perdus"
          hint="Tableau des objets trouvés — « c’est à nous »."
          value={lostOpen.length ? `${lostOpen.length} objet(s) en attente` : "Tableau vide"}
        />
      </Container>
      {due.length > 0 ? (
        <Container className="pb-12">
          <article className="rounded-3xl border border-line bg-white p-6">
            <h2 className="font-display text-2xl text-green-deep">À régler</h2>
            <ul className="mt-4 space-y-3">
              {due.map((invoice) => (
                <li key={invoice.id} className="flex items-center justify-between rounded-2xl bg-paper px-4 py-3">
                  <span>
                    <span className="block font-medium">{invoice.label}</span>
                    <span className="text-sm text-muted">{invoice.period}</span>
                  </span>
                  <span className="font-semibold">{formatFcfa(invoice.amountFcfa)}</span>
                </li>
              ))}
            </ul>
          </article>
        </Container>
      ) : null}
    </>
  );
}
