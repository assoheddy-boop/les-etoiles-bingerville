import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminFlash, Card, Field, PageIntro, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { requireAdminPermission } from "@/lib/auth";
import { employeeDisplayName, findEmployeeById, readEmployees } from "@/lib/employees";
import { EMPLOYEE_ROLE_IDS, EMPLOYEE_ROLE_LABELS } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function AdminEmployeEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string; temp?: string }>;
}) {
  await requireAdminPermission("parametres", "write");
  const { id } = await params;
  const { ok, error, temp } = await searchParams;
  const store = await readEmployees();
  const employee = findEmployeeById(store, id);
  if (!employee) notFound();

  return (
    <div className="space-y-6">
      <PageIntro
        title={employeeDisplayName(employee)}
        lead="Modifiez le profil, le rôle ou le statut du compte. Le mot de passe n’est jamais affiché."
      />
      <AdminFlash ok={ok} error={error} />
      {temp ? (
        <Card title="Mot de passe temporaire">
          <p className="text-sm text-muted">
            Communiquez ce mot de passe une seule fois à l’employé. Il devra le changer lors de sa prochaine connexion
            (fonctionnalité à venir).
          </p>
          <p className="mt-3 rounded-xl border border-line bg-paper px-4 py-3 font-mono text-lg font-semibold text-green-deep">
            {temp}
          </p>
        </Card>
      ) : null}
      <Card title="Modifier le profil">
        <form action="/api/admin/employes" method="post" className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="action" value="update" />
          <input type="hidden" name="id" value={employee.id} />
          <Field label="Prénom">
            <input name="firstName" required defaultValue={employee.firstName} className={fieldClass} />
          </Field>
          <Field label="Nom">
            <input name="lastName" required defaultValue={employee.lastName} className={fieldClass} />
          </Field>
          <Field label="E-mail">
            <input name="email" type="email" required defaultValue={employee.email} className={fieldClass} />
          </Field>
          <Field label="Identifiant de connexion">
            <input name="username" required defaultValue={employee.username} className={fieldClass} />
          </Field>
          <Field label="Téléphone">
            <input name="phone" type="tel" defaultValue={employee.phone ?? ""} className={fieldClass} />
          </Field>
          <Field label="Poste / fonction">
            <input name="poste" defaultValue={employee.poste ?? ""} className={fieldClass} />
          </Field>
          <Field label="Rôle">
            <select name="roleId" required defaultValue={employee.roleId} className={fieldClass}>
              {EMPLOYEE_ROLE_IDS.map((roleId) => (
                <option key={roleId} value={roleId}>
                  {EMPLOYEE_ROLE_LABELS[roleId]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Nouveau mot de passe">
            <input
              name="password"
              type="password"
              placeholder="Laisser vide pour ne pas changer"
              className={fieldClass}
            />
          </Field>
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button type="submit" className={btnPrimary}>
              Enregistrer
            </button>
            <Link href="/admin/employes" className="inline-flex min-h-11 items-center text-sm font-semibold text-green-deep">
              Retour à la liste
            </Link>
          </div>
        </form>
      </Card>
      <Card title="Statut du compte">
        <p className="mb-4 text-sm text-muted">
          Compte actuellement <strong>{employee.active ? "actif" : "inactif"}</strong>.
          {employee.active
            ? " Un compte inactif ne peut plus se connecter."
            : " Réactivez le compte pour autoriser la connexion."}
        </p>
        <form action="/api/admin/employes" method="post">
          <input type="hidden" name="action" value="toggle-active" />
          <input type="hidden" name="id" value={employee.id} />
          <input type="hidden" name="active" value={employee.active ? "0" : "1"} />
          <button type="submit" className={btnPrimary}>
            {employee.active ? "Désactiver le compte" : "Réactiver le compte"}
          </button>
        </form>
      </Card>
      <Card title="Réinitialisation du mot de passe">
        <p className="mb-4 text-sm text-muted">
          Génère un mot de passe temporaire affiché une seule fois après confirmation.
        </p>
        <form action="/api/admin/employes" method="post">
          <input type="hidden" name="action" value="reset-password" />
          <input type="hidden" name="id" value={employee.id} />
          <button type="submit" className={btnPrimary}>
            Réinitialiser le mot de passe
          </button>
        </form>
      </Card>
    </div>
  );
}
