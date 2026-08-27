import { notFound } from "next/navigation";
import { Container, PageHero } from "@/components/ui/Page";
import { requireParent } from "@/lib/auth";
import { healthForStudent, healthKindLabels, parentChildView, readSchoolLife } from "@/lib/school-life";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ParentSantePage() {
  const session = await requireParent();
  const data = await readSchoolLife();
  const child = parentChildView(session.studentId, data);
  if (!child) notFound();
  const notes = healthForStudent(child.id, data);

  return (
    <>
      <PageHero
        kicker="Santé"
        title={`Notes santé de ${child.studentName}`}
        lead="Signalements courts de l’école. Pas de dossier médical complet."
      />
      <Container className="py-10">
        <article className="rounded-3xl border border-line bg-white p-6">
          {notes.length === 0 ? (
            <p className="text-muted">Aucun signalement pour le moment.</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((item) => (
                <li key={item.id} className="rounded-2xl bg-paper px-4 py-3">
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="font-semibold text-green-deep">{healthKindLabels[item.kind]}</span>
                    <span className="text-sm text-muted">{formatDateFr(item.date)}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{item.note}</p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </Container>
    </>
  );
}
