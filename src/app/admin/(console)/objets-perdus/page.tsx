import { AdminFlash, Card, PageIntro } from "@/components/school/AdminUi";
import { LostItemListRow } from "@/components/school/LostItemCard";
import { LostItemForm } from "@/components/school/ExtrasUi";
import { readSchoolLife, todayISO } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminObjetsPerdusPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const items = [...data.lostItems].sort((a, b) => b.foundAt.localeCompare(a.foundAt));

  return (
    <div className="space-y-6">
      <PageIntro
        title="Objets perdus"
        lead="Déclarer un objet trouvé. Les parents peuvent dire « c’est à nous ». Un tableau public est visible sous Informations."
      />
      <AdminFlash ok={ok} error={error} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Déclarer">
          <LostItemForm action="/api/admin/lost-items" />
        </Card>
        <Card title="Tableau">
          {items.length === 0 ? (
            <p className="text-sm text-muted">Aucun objet.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => {
                const parent = item.claimedByParentId
                  ? data.parents.find((row) => row.id === item.claimedByParentId)
                  : undefined;
                return (
                  <LostItemListRow key={item.id} item={item}>
                    {item.claimed ? (
                      <p className="mt-2 text-sm font-semibold text-green-deep">
                        Réclamé{parent ? ` — ${parent.displayName}` : ""}
                      </p>
                    ) : (
                      <form action="/api/admin/lost-items" method="post" className="mt-2">
                        <input type="hidden" name="action" value="claimed" />
                        <input type="hidden" name="id" value={item.id} />
                        <button className="text-sm font-semibold text-terracotta hover:underline">
                          Marquer récupéré au secrétariat
                        </button>
                      </form>
                    )}
                  </LostItemListRow>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
      <p className="text-xs text-muted">Tableau public : /informations/objets-perdus · Date du jour (Abidjan) {todayISO()}.</p>
    </div>
  );
}
