import { notFound } from "next/navigation";
import { Container, PageHero } from "@/components/ui/Page";
import { requireParent } from "@/lib/auth";
import { gradesForStudent, parentChildView, readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function ParentNotesPage() {
  const session = await requireParent();
  const data = await readSchoolLife();
  const child = parentChildView(session.studentId, data);
  if (!child) notFound();
  const grades = gradesForStudent(child.id, data);

  return (
    <>
      <PageHero kicker="Notes" title={`Résultats de ${child.studentName}`} lead={child.classroom} />
      <Container className="py-10">
        <article className="overflow-hidden rounded-3xl border border-line bg-white">
          {grades.length === 0 ? (
            <p className="p-6 text-muted">Aucune note publiée pour le moment.</p>
          ) : (
            <>
              <ul className="grid gap-3 p-4 md:hidden">
                {grades.map((grade) => (
                  <li key={grade.id} className="rounded-2xl bg-paper px-4 py-3">
                    <p className="font-semibold text-green-deep">{grade.subject}</p>
                    <p className="mt-1 text-lg font-bold">
                      {grade.value}/{grade.maxValue}
                    </p>
                    <p className="text-sm text-muted">{grade.period}</p>
                    {grade.comment ? <p className="mt-1 text-sm">{grade.comment}</p> : null}
                  </li>
                ))}
              </ul>
              <div className="hidden overflow-x-auto overscroll-x-contain md:block">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-paper-2 text-muted">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Matière</th>
                      <th className="px-4 py-3 font-semibold">Note</th>
                      <th className="px-4 py-3 font-semibold">Période</th>
                      <th className="px-4 py-3 font-semibold">Commentaire</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((grade) => (
                      <tr key={grade.id} className="border-t border-line">
                        <td className="px-4 py-3 font-medium">{grade.subject}</td>
                        <td className="px-4 py-3">
                          {grade.value}/{grade.maxValue}
                        </td>
                        <td className="px-4 py-3 text-muted">{grade.period}</td>
                        <td className="px-4 py-3 text-muted">{grade.comment || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </article>
      </Container>
    </>
  );
}
