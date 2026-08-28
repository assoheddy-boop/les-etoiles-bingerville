import Link from "next/link";
import { AdminFlash, Card, PageIntro, TableWrap, btnPrimary } from "@/components/school/AdminUi";
import { requireAdminPermission } from "@/lib/auth";
import { employeeDisplayName, readEmployees } from "@/lib/employees";
import { EMPLOYEE_ROLE_LABELS } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function AdminEmployesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  await requireAdminPermission("parametres", "write");
  const { ok, error } = await searchParams;
  const store = await readEmployees();

  return (
    <div className="space-y-6">
      <PageIntro
        title="Gestion des employés"
        lead="Comptes du personnel avec rôles et permissions. Les employés actifs se connectent via /admin/connexion avec leur identifiant."
      />
      <AdminFlash ok={ok} error={error} />
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/employes/nouveau" className={btnPrimary}>
          Ajouter un employé
        </Link>
      </div>
      <Card title="Liste du personnel">
        <TableWrap>
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead>
              <tr className="text-muted">
                <th className="py-2">Nom</th>
                <th>E-mail</th>
                <th>Identifiant</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {store.employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-muted">
                    Aucun employé enregistré. Utilisez le bouton ci-dessus pour créer un compte.
                  </td>
                </tr>
              ) : (
                store.employees.map((row) => (
                  <tr key={row.id} className="border-t border-line">
                    <td className="py-3 font-semibold">{employeeDisplayName(row)}</td>
                    <td>{row.email}</td>
                    <td>{row.username}</td>
                    <td>{EMPLOYEE_ROLE_LABELS[row.roleId]}</td>
                    <td>
                      <span
                        className={
                          row.active
                            ? "rounded-full bg-green/10 px-2 py-0.5 text-xs font-semibold text-green-deep"
                            : "rounded-full bg-terracotta/10 px-2 py-0.5 text-xs font-semibold text-terracotta"
                        }
                      >
                        {row.active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/employes/${row.id}`} className="font-semibold text-green-deep">
                        Modifier
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}
