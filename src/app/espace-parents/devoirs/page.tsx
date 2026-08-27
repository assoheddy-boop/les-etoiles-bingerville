import { notFound } from "next/navigation";
import { Container, PageHero } from "@/components/ui/Page";
import { requireParent } from "@/lib/auth";
import { findTeacherById, homeworksForStudent, parentChildView, readSchoolLife } from "@/lib/school-life";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ParentDevoirsPage() {
  const session = await requireParent();
  const data = await readSchoolLife();
  const child = parentChildView(session.studentId, data);
  if (!child) notFound();
  const homeworks = homeworksForStudent(child.id, data);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageHero
        kicker="Travail à la maison"
        title={`Devoirs de ${child.studentName}`}
        lead="Publiés par l’enseignant. Relais parent, sans compte pour l’enfant."
      />
      <Container className="space-y-4 py-10">
        {homeworks.length === 0 ? (
          <p className="rounded-3xl border border-line bg-white p-6 text-muted">Aucun devoir publié.</p>
        ) : (
          homeworks.map((item) => {
            const teacher = findTeacherById(item.teacherId, data);
            const late = item.dueDate < today;
            return (
              <article key={item.id} className="rounded-3xl border border-line bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="font-display text-2xl text-green-deep">{item.title}</h2>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      late ? "bg-terracotta-soft text-terracotta" : "bg-green-soft text-green-deep"
                    }`}
                  >
                    À rendre le {formatDateFr(item.dueDate)}
                  </span>
                </div>
                {item.description ? <p className="mt-3 text-muted">{item.description}</p> : null}
                <p className="mt-3 text-sm text-muted">Par {teacher?.displayName ?? "l’enseignant"}</p>
                {item.attachment ? (
                  <a
                    href={`/api/parent/homeworks/${item.id}/attachment`}
                    className="mt-4 inline-flex rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-deep"
                  >
                    Télécharger {item.attachmentName || "la pièce jointe"}
                  </a>
                ) : null}
              </article>
            );
          })
        )}
      </Container>
    </>
  );
}
