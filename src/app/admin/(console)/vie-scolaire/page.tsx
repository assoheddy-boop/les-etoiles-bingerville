import Link from "next/link";
import { attendanceLabels, classLabel, readSchoolLife, resolveActorName, studentFullName } from "@/lib/school-life";
import { formatDateFr, formatDateTimeFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminVieScolairePage() {
  const data = await readSchoolLife();
  const recentMessages = [...data.messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 12);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-green-deep">Vie scolaire</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Vue direction : appels, devoirs, messages et bulletins. Le transport, la sortie, la santé, la RH et la caisse ont leurs pages dédiées.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-green-deep">Derniers appels</h2>
        {data.classes.map((item) => {
          const sessions = data.attendance
            .filter((row) => row.classId === item.id)
            .sort((a, b) => b.date.localeCompare(a.date));
          const last = sessions[0];
          const counts = last
            ? last.entries.reduce(
                (acc, entry) => {
                  acc[entry.status] += 1;
                  return acc;
                },
                { present: 0, late: 0, absent: 0 },
              )
            : null;
          return (
            <article key={item.id} className="rounded-3xl border border-line bg-white p-5">
              <h3 className="font-display text-xl text-green-deep">{classLabel(item.id, data)}</h3>
              {!last ? (
                <p className="mt-2 text-sm text-muted">Aucun appel enregistré.</p>
              ) : (
                <p className="mt-2 text-sm text-muted">
                  {formatDateFr(last.date)} · {counts!.present} {attendanceLabels.present.toLowerCase()}s ·{" "}
                  {counts!.late} retard(s) · {counts!.absent} absent(s)
                </p>
              )}
            </article>
          );
        })}
      </section>

      <section>
        <h2 className="font-display text-2xl text-green-deep">Devoirs</h2>
        <ul className="mt-4 space-y-3">
          {data.homeworks.length === 0 ? <li className="text-muted">Aucun devoir.</li> : null}
          {data.homeworks.map((item) => (
            <li key={item.id} className="rounded-3xl border border-line bg-white px-5 py-4">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted">
                {classLabel(item.classId, data)} · à rendre le {formatDateFr(item.dueDate)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl text-green-deep">Bulletins</h2>
        <p className="mt-2 text-sm text-muted">
          {data.bulletins.length} bulletin(s) publié(s).{" "}
          <Link href="/admin/bulletins" className="font-semibold text-green-deep">
            Télécharger les PDF
          </Link>
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-green-deep">Messages récents</h2>
        <ul className="mt-4 space-y-3">
          {recentMessages.map((message) => {
            const student = message.studentId
              ? data.students.find((row) => row.id === message.studentId)
              : undefined;
            return (
              <li key={message.id} className="rounded-3xl border border-line bg-white px-5 py-4">
                <p className="text-xs text-muted">
                  {formatDateTimeFr(message.createdAt)}
                  {student ? ` · ${studentFullName(student)}` : ""}
                </p>
                <p className="mt-1 text-sm font-medium">
                  {resolveActorName(message.senderId, data)} → {resolveActorName(message.receiverId, data)}
                </p>
                <p className="mt-2 text-muted">{message.content}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
