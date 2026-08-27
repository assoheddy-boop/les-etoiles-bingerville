import { Container, PageHero } from "@/components/ui/Page";
import { LostItemCard } from "@/components/school/LostItemCard";
import { unclaimedLostItems, readSchoolLife } from "@/lib/school-life";
import { school } from "@/lib/school";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Objets perdus",
  description: `Objets trouvés à ${school.name}, Bingerville.`,
};

export default async function PublicObjetsPerdusPage() {
  const data = await readSchoolLife();
  const items = unclaimedLostItems(data);

  return (
    <>
      <PageHero
        kicker="Informations"
        title="Objets perdus"
        lead="Objets trouvés sur les campus Les Étoiles. Les familles connectées peuvent indiquer « c’est à nous »."
      />
      <Container className="grid gap-4 py-12 md:grid-cols-2">
        {items.length === 0 ? (
          <p className="rounded-3xl border border-line bg-white p-6 text-muted">Aucun objet en attente.</p>
        ) : (
          items.map((item) => <LostItemCard key={item.id} item={item} />)
        )}
      </Container>
    </>
  );
}
