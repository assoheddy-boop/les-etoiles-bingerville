import { notFound } from "next/navigation";
import { Container, PageHero } from "@/components/ui/Page";
import { requireParent } from "@/lib/auth";
import { absencesForStudent, attendanceLabels, parentChildView, readSchoolLife } from "@/lib/school-life";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ParentAbsencesPage() {
  const session = await requireParent();
  const data = await readSchoolLife();
  const child = parentChildView(session.studentId, data);
  if (!child) notFound();
  const absences = absencesForStudent(child.id, data);

  return (
    <>
      <PageHero
        kicker="Présences"
        title={`Absences et retards de ${child.studentName}`}
        lead="Issus de l’appel du jour fait par l’enseignant."
      />
      <Container className="py-10">
        <article className="rounded-3xl border border-line bg-white p-6">
          {absences.length === 0 ? (
            <p className="text-muted">Aucune absence ni retard enregistré.</p>
          ) : (
            <ul className="space-y-3">
              {absences.map((row) => (
                <li
                  key={`${row.date}-${row.status}`}
                  className="flex items-center justify-between rounded-2xl bg-paper px-4 py-3"
                >
                  <span className="font-medium">{formatDateFr(row.date)}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      row.status === "late" ? "bg-[#f8f1d8] text-[#7a5b00]" : "bg-terracotta-soft text-terracotta"
                    }`}
                  >
                    {attendanceLabels[row.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </Container>
    </>
  );
}
