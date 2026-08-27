import { Card } from "@/components/school/AdminUi";
import { ExtrasFlash, LostItemForm } from "@/components/school/ExtrasUi";
import { LostItemListRow } from "@/components/school/LostItemCard";
import { requireTeacher } from "@/lib/auth";
import { readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function TeacherObjetsPerdusPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  await requireTeacher();
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const items = [...data.lostItems].sort((a, b) => b.foundAt.localeCompare(a.foundAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-green-deep">Objets perdus</h1>
        <p className="mt-2 max-w-2xl text-muted">Déclarez un objet trouvé. Les familles peuvent le réclamer.</p>
      </div>
      <ExtrasFlash ok={ok} error={error} okText="Objet déclaré. Visible pour les parents et sur le tableau public." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Déclarer">
          <LostItemForm action="/api/teacher/lost-items" />
        </Card>
        <Card title="Tableau">
          <ul className="space-y-3">
            {items.map((item) => (
              <LostItemListRow key={item.id} item={item}>
                <p className="mt-1 text-sm font-semibold">{item.claimed ? "Réclamé" : "En attente"}</p>
              </LostItemListRow>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
