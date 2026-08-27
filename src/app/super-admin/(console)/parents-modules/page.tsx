import { AdminFlash, Card, PageIntro, TableWrap } from "@/components/school/AdminUi";
import { PollRefresh } from "@/components/school/PollRefresh";
import { isParentModuleActive } from "@/lib/module-control";
import { classLabel, readSchoolLife, studentFullName } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function SuperAdminParentModulesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();

  return (
    <div className="space-y-6">
      <PollRefresh seconds={30} />
      <PageIntro
        title="Modules parents"
        lead="En plus du module global Parents, chaque famille a un drapeau moduleParentsActive (défaut off pour les nouveaux). Les démos ETOILES-DEMO-001 / 002 restent actives tant que vous ne les désactivez pas."
      />
      <AdminFlash ok={ok} error={error} />
      <Card title="Familles">
        <TableWrap>
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="py-2 pr-3 font-medium">Parent</th>
                <th className="py-2 pr-3 font-medium">Élèves</th>
                <th className="py-2 pr-3 font-medium">Accès</th>
                <th className="py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.parents.map((parent) => {
                const students = data.students.filter(
                  (row) => row.parentId === parent.id || parent.studentIds.includes(row.id),
                );
                const active = isParentModuleActive(parent);
                return (
                  <tr key={parent.id} className="border-b border-line/70">
                    <td className="py-3 pr-3 font-semibold">{parent.displayName}</td>
                    <td className="py-3 pr-3">
                      {students.length === 0
                        ? "—"
                        : students
                            .map((row) => `${studentFullName(row)} (${row.matricule || classLabel(row.classId, data)})`)
                            .join(" · ")}
                    </td>
                    <td className="py-3 pr-3">{active ? "actif" : "inactif"}</td>
                    <td className="py-3">
                      <form action="/api/superadmin/parent-module" method="post">
                        <input type="hidden" name="parentId" value={parent.id} />
                        <input type="hidden" name="enabled" value={active ? "0" : "1"} />
                        <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:bg-paper-2">
                          {active ? "Désactiver" : "Activer"}
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}
