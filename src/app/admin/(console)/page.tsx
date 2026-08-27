import Link from "next/link";
import { Card, PageIntro } from "@/components/school/AdminUi";
import { EmailStatusCard } from "@/components/school/EmailStatusCard";
import { readInbox } from "@/lib/cms";
import { establishmentKpis } from "@/lib/establishments";
import { formatFcfa } from "@/lib/payments";
import { currentYear, readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const inbox = await readInbox();
  const data = await readSchoolLife();
  const year = currentYear(data);
  const kpis = establishmentKpis(data);
  const pendingLeaves = data.leaveRequests.filter((row) => row.status === "pending").length;
  const invoicesDue = data.invoices.filter((row) => row.status === "due");

  return (
    <div className="space-y-6">
      <PageIntro
        title="Groupe scolaire Les Étoiles"
        lead={`Bingerville — Adjamé. Trois établissements, un campus. ${year ? `Année ${year.label}.` : ""}`}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Élèves">
          <p className="text-2xl font-semibold">{data.students.length}</p>
        </Card>
        <Card title={`Fiches ${year?.label ?? ""}`}>
          <p className="text-2xl font-semibold">
            {data.enrollments.filter((row) => row.schoolYearId === data.currentSchoolYearId).length}
          </p>
        </Card>
        <Card title="Factures à régler">
          <p className="text-2xl font-semibold">{invoicesDue.length}</p>
          <p className="mt-1 text-sm text-muted">{formatFcfa(invoicesDue.reduce((sum, row) => sum + row.amountFcfa, 0))}</p>
        </Card>
        <Card title="Personnel">
          <p className="text-2xl font-semibold">{data.staffProfiles.length}</p>
          <p className="mt-1 text-sm text-muted">{pendingLeaves} congé(s) en attente</p>
        </Card>
        <EmailStatusCard />
      </div>

      <div>
        <h2 className="font-display text-2xl text-green-deep">Par établissement</h2>
        <p className="mt-1 text-sm text-muted">Effectifs, inscriptions de l’année, impayés, agents et congés.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {kpis.map((kpi) => (
          <article key={kpi.establishment.id} className="rounded-3xl border border-line bg-white p-5">
            <p className="text-sm text-terracotta">{kpi.establishment.cycle}</p>
            <h3 className="mt-1 font-display text-xl text-green-deep">{kpi.establishment.shortName}</h3>
            <p className="mt-1 text-xs text-muted">
              {kpi.establishment.menDecision
                ? `Agrément ${kpi.establishment.menDecision}`
                : "Ouverture en cours"}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted">Effectif</dt>
                <dd className="font-semibold">{kpi.students} élève(s)</dd>
              </div>
              <div>
                <dt className="text-muted">Fiches {year?.label}</dt>
                <dd className="font-semibold">{kpi.enrollments}</dd>
              </div>
              <div>
                <dt className="text-muted">Factures dues</dt>
                <dd className="font-semibold">{kpi.invoicesDue}</dd>
              </div>
              <div>
                <dt className="text-muted">Personnel</dt>
                <dd className="font-semibold">{kpi.staff} agent(s)</dd>
              </div>
              <div>
                <dt className="text-muted">Congés en attente</dt>
                <dd className="font-semibold">{kpi.pendingLeaves}</dd>
              </div>
              <div>
                <dt className="text-muted">Classes</dt>
                <dd className="font-semibold">{kpi.classes}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/admin/eleves?establishmentId=${kpi.establishment.id}`}
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold"
              >
                Élèves
              </Link>
              <Link
                href={`/admin/inscriptions?establishmentId=${kpi.establishment.id}`}
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold"
              >
                Inscriptions
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/etablissements" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Fiches établissements</h2>
          <p className="mt-2 text-sm text-muted">{data.establishments.length} établissement(s) — agréments MEN.</p>
        </Link>
        <Link href="/admin/inscriptions" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Fiches inscription</h2>
          <p className="mt-2 text-sm text-muted">
            {data.enrollments.filter((row) => row.schoolYearId === data.currentSchoolYearId).length} fiche(s){" "}
            {year?.label}.
          </p>
        </Link>
        <Link href="/admin/eleves" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Élèves</h2>
          <p className="mt-2 text-sm text-muted">{data.students.length} inscrit(s).</p>
        </Link>
        <Link href="/admin/classes" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Classes</h2>
          <p className="mt-2 text-sm text-muted">{data.classes.length} classe(s).</p>
        </Link>
        <Link href="/admin/enseignants" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Enseignants</h2>
          <p className="mt-2 text-sm text-muted">{data.teachers.length} compte(s). Ils se connectent avec l’e-mail saisi ici.</p>
        </Link>
        <Link href="/admin/emploi-du-temps" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Emploi du temps</h2>
          <p className="mt-2 text-sm text-muted">{data.timetableSlots.length} créneau(x).</p>
        </Link>
        <Link href="/admin/frais" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Frais</h2>
          <p className="mt-2 text-sm text-muted">{invoicesDue.length} facture(s) à régler.</p>
        </Link>
        <Link href="/admin/parents" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Parents</h2>
          <p className="mt-2 text-sm text-muted">{data.parents.length} famille(s) — connexion par matricule.</p>
        </Link>
        <Link href="/admin/vie-scolaire" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Vie scolaire</h2>
          <p className="mt-2 text-sm text-muted">Appels, devoirs et messages.</p>
        </Link>
        <Link href="/admin/controle-enseignants" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Contrôle enseignants</h2>
          <p className="mt-2 text-sm text-muted">Validations de cours, alertes, journal et classement.</p>
        </Link>
        <Link href="/admin/transport" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Transport</h2>
          <p className="mt-2 text-sm text-muted">{data.busLines.length} ligne(s) · suivi bus du jour.</p>
        </Link>
        <Link href="/admin/sortie" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">QR sortie</h2>
          <p className="mt-2 text-sm text-muted">QR du jour et tableau de bord vigile.</p>
        </Link>
        <Link href="/admin/sante" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Santé</h2>
          <p className="mt-2 text-sm text-muted">{data.healthIncidents.length} note(s) aux familles.</p>
        </Link>
        <Link href="/admin/rh" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">RH</h2>
          <p className="mt-2 text-sm text-muted">
            {data.staffProfiles.length} agent(s) · {pendingLeaves} congé(s) en attente.
          </p>
        </Link>
        <Link href="/admin/compta" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Comptabilité</h2>
          <p className="mt-2 text-sm text-muted">{data.financeAccounts.length} compte(s) de trésorerie (groupe).</p>
        </Link>
        <Link href="/admin/caisse" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Caisse</h2>
          <p className="mt-2 text-sm text-muted">{invoicesDue.length} facture(s) à encaisser.</p>
        </Link>
        <Link href="/admin/cas-sociaux" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Cas sociaux</h2>
          <p className="mt-2 text-sm text-muted">
            {data.socialCases.filter((row) => row.status === "actif").length} dossier(s) actif(s).
          </p>
        </Link>
        <Link href="/admin/bulletins" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Bulletins</h2>
          <p className="mt-2 text-sm text-muted">{data.bulletins.length} bulletin(s) à télécharger.</p>
        </Link>
        <Link href="/admin/objets-perdus" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Objets perdus</h2>
          <p className="mt-2 text-sm text-muted">{data.lostItems.filter((item) => !item.claimed).length} objet(s) en attente.</p>
        </Link>
        <Link href="/admin/contenu" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Contenu du site</h2>
          <p className="mt-2 text-sm text-muted">Histoire, mot de la direction.</p>
        </Link>
        <Link href="/admin/actualites" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Actualités</h2>
          <p className="mt-2 text-sm text-muted">Publier un communiqué de rentrée.</p>
        </Link>
        <Link href="/admin/demandes" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Demandes</h2>
          <p className="mt-2 text-sm text-muted">{inbox.length} message(s) en local.</p>
        </Link>
      </div>
    </div>
  );
}
