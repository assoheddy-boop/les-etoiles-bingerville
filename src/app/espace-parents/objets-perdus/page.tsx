import { notFound } from "next/navigation";
import { ExtrasFlash } from "@/components/school/ExtrasUi";
import { LostItemCard } from "@/components/school/LostItemCard";
import { Container, PageHero } from "@/components/ui/Page";
import { requireParent } from "@/lib/auth";
import { parentChildView, readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function ParentObjetsPerdusPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await requireParent();
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const child = parentChildView(session.studentId, data);
  if (!child) notFound();
  const items = [...data.lostItems].sort((a, b) => b.foundAt.localeCompare(a.foundAt));

  return (
    <>
      <PageHero
        kicker="Objets perdus"
        title="Tableau des objets trouvés"
        lead="Si c’est à vous, signalez-le : le secrétariat vous le remet à la grille."
      />
      <Container className="space-y-4 py-10">
        <ExtrasFlash ok={ok} error={error} okText="C’est noté. Passez récupérer l’objet au secrétariat." />
        {items.map((item) => (
          <LostItemCard key={item.id} item={item}>
            {item.claimed ? (
              <p className="mt-3 text-sm font-semibold text-muted">Déjà réclamé</p>
            ) : (
              <form action="/api/parent/lost-items" method="post" className="mt-4">
                <input type="hidden" name="id" value={item.id} />
                <button className="rounded-full bg-green px-5 py-3 font-semibold text-white hover:bg-green-deep">
                  C’est à nous
                </button>
              </form>
            )}
          </LostItemCard>
        ))}
      </Container>
    </>
  );
}
