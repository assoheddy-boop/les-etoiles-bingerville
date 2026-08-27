import Link from "next/link";
import { Card, PageIntro, TableWrap } from "@/components/school/AdminUi";
import { enrollmentForStudent, enrollmentStatusLabel } from "@/lib/enrollment";
import { classLabel, currentYear, readSchoolLife, studentFullName } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function ReinscriptionsPage() {
  const data = await readSchoolLife();
  const year = currentYear(data);
  const previous = data.schoolYears.find((row) => row.id !== data.currentSchoolYearId);
  const toComplete = data.students.filter((student) => !enrollmentForStudent(student.id, data));
  const done = data.students.filter((student) => enrollmentForStudent(student.id, data));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageIntro
          title="Réinscriptions"
          lead={`Campagne ${year?.label ?? ""}${previous ? ` — les élèves sans fiche ${year?.label} sont à reprendre.` : "."}`}
        />
        <Link href="/admin/inscriptions" className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold">
          Fiches inscription
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="À réinscrire">
          <p className="text-3xl font-display text-green-deep">{toComplete.length}</p>
          <p className="text-sm text-muted">Pas encore de fiche pour {year?.label}.</p>
        </Card>
        <Card title="Fiches de l’année">
          <p className="text-3xl font-display text-green-deep">{done.length}</p>
          <p className="text-sm text-muted">Dossiers ouverts ou complets.</p>
        </Card>
      </div>

      <Card title="Élèves sans fiche cette année">
        {toComplete.length === 0 ? (
          <p>Tous les élèves ont une fiche {year?.label}.</p>
        ) : (
          <TableWrap>
            <table className="min-w-[36rem] w-full text-left text-sm">
              <thead className="text-muted">
                <tr>
                  <th className="px-2 py-2 font-semibold">Élève</th>
                  <th className="px-2 py-2 font-semibold">Classe actuelle</th>
                  <th className="px-2 py-2 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {toComplete.map((student) => (
                  <tr key={student.id} className="border-t border-line">
                    <td className="px-2 py-3 font-semibold">{studentFullName(student)}</td>
                    <td className="px-2 py-3">{classLabel(student.classId, data)}</td>
                    <td className="px-2 py-3">
                      <Link
                        href={`/admin/inscriptions/${student.id}`}
                        className="rounded-full bg-green px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Réinscrire
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>

      <Card title="Déjà inscrits cette année">
        <TableWrap>
          <table className="min-w-[36rem] w-full text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="px-2 py-2 font-semibold">Élève</th>
                <th className="px-2 py-2 font-semibold">Statut</th>
                <th className="px-2 py-2 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {done.map((student) => {
                const enrollment = enrollmentForStudent(student.id, data);
                return (
                  <tr key={student.id} className="border-t border-line">
                    <td className="px-2 py-3">{studentFullName(student)}</td>
                    <td className="px-2 py-3">{enrollmentStatusLabel(enrollment?.enrollmentStatus)}</td>
                    <td className="px-2 py-3">
                      <Link href={`/admin/inscriptions/${student.id}`} className="text-sm font-semibold text-green">
                        Ouvrir
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}
