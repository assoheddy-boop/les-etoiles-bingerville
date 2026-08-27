import Link from "next/link";
import { requireTeacher } from "@/lib/auth";
import {
  actorFromSession,
  readSchoolLife,
  staffPresenceLabels,
  studentFullName,
  teacherClasses,
  unreadCount,
} from "@/lib/school-life";
import { isTeacherControlEnabled, teacherDashboardKpis } from "@/lib/teacher-control";

export const dynamic = "force-dynamic";

function pct(value: number) {
  return `${Math.round(value * 100)} %`;
}

export default async function TeacherHomePage() {
  const session = await requireTeacher();
  const data = await readSchoolLife();
  const classes = teacherClasses(session.teacherId, data);
  const actor = actorFromSession(session, data);
  const unread = unreadCount(actor.id, data);
  const myHomeworks = data.homeworks.filter((item) => item.teacherId === session.teacherId).slice(0, 3);
  const myGrades = data.grades.filter((item) => item.teacherId === session.teacherId).slice(0, 3);
  const enabled = isTeacherControlEnabled(data);
  const kpis = enabled ? teacherDashboardKpis(session.teacherId, data) : null;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">Espace enseignants</p>
        <h1 className="mt-2 font-display text-3xl text-green-deep">Bonjour, {session.displayName}</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Appel, devoirs, notes, messages et suivi pédagogique de vos classes.
        </p>
      </div>
      {kpis ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-3xl border border-line bg-white p-4">
            <p className="text-sm text-muted">Cours du jour</p>
            <p className="mt-1 font-display text-2xl text-green-deep">
              {kpis.todayValidated}/{kpis.todayExpected}
            </p>
            {kpis.todayOverdue > 0 ? (
              <p className="mt-1 text-xs font-semibold text-terracotta">{kpis.todayOverdue} non validé(s)</p>
            ) : (
              <p className="mt-1 text-xs text-muted">validés</p>
            )}
          </article>
          <article className="rounded-3xl border border-line bg-white p-4">
            <p className="text-sm text-muted">Devoirs (7 jours)</p>
            <p className="mt-1 font-display text-2xl text-green-deep">{kpis.homeworks}</p>
          </article>
          <article className="rounded-3xl border border-line bg-white p-4">
            <p className="text-sm text-muted">Contrôles</p>
            <p className="mt-1 font-display text-2xl text-green-deep">{kpis.assessmentsDone}</p>
            {kpis.assessmentsLate > 0 ? (
              <p className="mt-1 text-xs font-semibold text-terracotta">{kpis.assessmentsLate} en retard</p>
            ) : (
              <p className="mt-1 text-xs text-muted">faits</p>
            )}
          </article>
          <article className="rounded-3xl border border-line bg-white p-4">
            <p className="text-sm text-muted">Taux de notes</p>
            <p className="mt-1 font-display text-2xl text-green-deep">{pct(kpis.gradeRate)}</p>
          </article>
          <article className="rounded-3xl border border-line bg-white p-4">
            <p className="text-sm text-muted">Présence du jour</p>
            <p className="mt-1 font-display text-2xl text-green-deep">
              {kpis.presence ? staffPresenceLabels[kpis.presence] : "—"}
            </p>
          </article>
          <article className="rounded-3xl border border-line bg-white p-4">
            <p className="text-sm text-muted">Retards (RH)</p>
            <p className="mt-1 font-display text-2xl text-green-deep">{kpis.lateDays}</p>
          </article>
          <article className="rounded-3xl border border-line bg-white p-4">
            <p className="text-sm text-muted">Alertes</p>
            <p className="mt-1 font-display text-2xl text-green-deep">{kpis.alerts.length}</p>
          </article>
          <article className="rounded-3xl border border-line bg-white p-4">
            <p className="text-sm text-muted">Score semaine</p>
            <p className="mt-1 font-display text-2xl text-green-deep">{kpis.score.score}/100</p>
          </article>
        </div>
      ) : null}
      {kpis && kpis.alerts.length > 0 ? (
        <section className="rounded-3xl border border-terracotta/30 bg-white p-5">
          <h2 className="font-display text-xl text-green-deep">À traiter</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {kpis.alerts.slice(0, 6).map((alert) => (
              <li key={alert.id}>
                {alert.href ? (
                  <Link href={alert.href} className="font-semibold text-terracotta hover:underline">
                    {alert.title}
                  </Link>
                ) : (
                  <span className="font-semibold text-terracotta">{alert.title}</span>
                )}
                <span className="mt-0.5 block text-muted">{alert.detail}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {enabled ? (
          <Link href="/espace-enseignants/cours" className="rounded-3xl border border-line bg-white p-6">
            <h2 className="font-display text-xl text-green-deep">Cours du jour</h2>
            <p className="mt-2 text-sm text-muted">Valider chaque créneau : chapitre et contenu.</p>
          </Link>
        ) : null}
        <Link href="/espace-enseignants/emploi-du-temps" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Mon EDT</h2>
          <p className="mt-2 text-sm text-muted">Cours qui vous sont attribués cette semaine.</p>
        </Link>
        <Link href="/espace-enseignants/appel" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Faire l’appel</h2>
          <p className="mt-2 text-sm text-muted">Présent, retard ou absent — les parents voient les absences.</p>
        </Link>
        <Link href="/espace-enseignants/devoirs" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Publier un devoir</h2>
          <p className="mt-2 text-sm text-muted">{myHomeworks.length} devoir(s) récents.</p>
        </Link>
        {enabled ? (
          <Link href="/espace-enseignants/controles" className="rounded-3xl border border-line bg-white p-6">
            <h2 className="font-display text-xl text-green-deep">Contrôles</h2>
            <p className="mt-2 text-sm text-muted">Planifier un contrôle ou une composition.</p>
          </Link>
        ) : null}
        <Link href="/espace-enseignants/notes" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Saisir une note</h2>
          <p className="mt-2 text-sm text-muted">{myGrades.length} dernière(s) note(s) affichée(s) aux parents.</p>
        </Link>
        <Link href="/espace-enseignants/classes" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Mes classes</h2>
          <p className="mt-2 text-sm text-muted">
            {classes.map((item) => item.name).join(" · ") || "Aucune classe"}
          </p>
        </Link>
        <Link href="/espace-enseignants/messages" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Messages aux familles</h2>
          <p className="mt-2 text-sm text-muted">
            {unread ? `${unread} message(s) non lu(s)` : "Écrire aux parents des élèves"}
          </p>
        </Link>
        <Link href="/espace-enseignants/transport" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Suivi bus</h2>
          <p className="mt-2 text-sm text-muted">Pointer montée et arrivée pour les lignes Les Étoiles.</p>
        </Link>
        <Link href="/espace-enseignants/sortie" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">QR sortie</h2>
          <p className="mt-2 text-sm text-muted">QR du jour — les parents le montrent à la grille.</p>
        </Link>
        <Link href="/espace-enseignants/sante" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Santé</h2>
          <p className="mt-2 text-sm text-muted">Fièvre, blessure, renvoyé à la maison.</p>
        </Link>
        <Link href="/espace-enseignants/rh" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Mes congés</h2>
          <p className="mt-2 text-sm text-muted">Présence du jour et demandes de congé.</p>
        </Link>
        <Link href="/espace-enseignants/objets-perdus" className="rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-xl text-green-deep">Objets perdus</h2>
          <p className="mt-2 text-sm text-muted">Déclarer un objet trouvé dans la cour ou la classe.</p>
        </Link>
      </div>
      <section className="rounded-3xl border border-line bg-white p-6">
        <h2 className="font-display text-xl text-green-deep">Élèves liés aux comptes parents démo</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {data.students
            .filter((student) => student.matricule)
            .map((student) => (
              <li key={student.id} className="rounded-2xl bg-paper px-4 py-3">
                <strong>{studentFullName(student)}</strong> · {student.matricule} · {student.parentName}
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
