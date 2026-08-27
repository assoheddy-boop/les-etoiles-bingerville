import { notFound } from "next/navigation";
import { PickupCodeCard } from "@/components/school/PickupQr";
import { Container, PageHero } from "@/components/ui/Page";
import { requireParent } from "@/lib/auth";
import { parentChildView, readSchoolLife, todayISO, todayPickup } from "@/lib/school-life";
import { formatDateTimeFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ParentSortiePage() {
  const session = await requireParent();
  const data = await readSchoolLife();
  const child = parentChildView(session.studentId, data);
  if (!child) notFound();
  const auth = todayPickup(child.id, data);

  return (
    <>
      <div className="print:hidden">
        <PageHero
          kicker="Sortie"
          title={`QR du jour — ${child.studentName}`}
          lead="Montrez ce QR à la grille, ou le code en dessous si le vigile n’a pas de lecteur. Valable uniquement aujourd’hui."
        />
      </div>
      <Container className="py-10">
        {!auth ? (
          <article className="rounded-3xl border border-line bg-white p-6">
            <p className="text-muted">
              Pas encore de QR aujourd’hui ({todayISO()}). Le secrétariat ou l’enseignant le génère le matin.
            </p>
          </article>
        ) : (
          <div className="mx-auto max-w-md">
            <PickupCodeCard
              code={auth.code}
              person={auth.authorizedPerson}
              phone={auth.authorizedPhone}
              usedAt={auth.usedAt}
              studentName={child.studentName}
            />
            {auth.usedAt ? (
              <p className="mt-4 text-center text-sm text-muted print:hidden">
                Validé le {formatDateTimeFr(auth.usedAt)}.
              </p>
            ) : null}
          </div>
        )}
      </Container>
    </>
  );
}
