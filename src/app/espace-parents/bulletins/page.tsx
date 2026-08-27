import { notFound } from "next/navigation";
import { Container, PageHero } from "@/components/ui/Page";
import { requireParent } from "@/lib/auth";
import { parentChildView, readSchoolLife } from "@/lib/school-life";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ParentBulletinsPage() {
  const session = await requireParent();
  const data = await readSchoolLife();
  const child = parentChildView(session.studentId, data);
  if (!child) notFound();
  const bulletins = data.bulletins.filter((item) => item.studentId === child.id);

  return (
    <>
      <PageHero
        kicker="Bulletins"
        title={`Bulletins de ${child.studentName}`}
        lead="Consultation en ligne et téléchargement du bulletin en PDF."
      />
      <Container className="space-y-4 py-10">
        {bulletins.length === 0 ? (
          <p className="rounded-3xl border border-line bg-white p-6 text-muted">Aucun bulletin publié.</p>
        ) : (
          bulletins.map((item) => (
            <article key={item.id} className="rounded-3xl border border-line bg-white p-6">
              <p className="text-xs uppercase tracking-wider text-terracotta">{item.period}</p>
              <h2 className="mt-1 font-display text-2xl text-green-deep">Moyenne {item.average}/20</h2>
              <p className="mt-3 text-muted">{item.comment}</p>
              <p className="mt-4 text-sm text-muted">Publié le {formatDateFr(item.createdAt)}</p>
              <a
                href={`/api/parent/bulletins/${item.id}/pdf`}
                className="mt-4 inline-flex rounded-full bg-green px-5 py-2.5 font-semibold text-white hover:bg-green-deep"
              >
                Télécharger le PDF
              </a>
            </article>
          ))
        )}
      </Container>
    </>
  );
}
