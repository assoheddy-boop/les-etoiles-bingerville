import Link from "next/link";
import { AdminFlash, Card, Field, PageIntro, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { requireAdminPermission } from "@/lib/auth";
import { EMPLOYEE_ROLE_IDS, EMPLOYEE_ROLE_LABELS } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function AdminEmployeNouveauPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  await requireAdminPermission("parametres", "write");
  const { ok, error } = await searchParams;

  return (
    <div className="space-y-6">
      <PageIntro title="Ajouter un employé" lead="Créez un compte avec rôle et mot de passe initial." />
      <AdminFlash ok={ok} error={error} />
      <Card title="Informations du compte">
        <form action="/api/admin/employes" method="post" className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="action" value="create" />
          <Field label="Prénom">
            <input name="firstName" required className={fieldClass} />
          </Field>
          <Field label="Nom">
            <input name="lastName" required className={fieldClass} />
          </Field>
          <Field label="E-mail">
            <input name="email" type="email" required className={fieldClass} />
          </Field>
          <Field label="Identifiant de connexion">
            <input name="username" required placeholder="ex. marie.kone" className={fieldClass} />
          </Field>
          <Field label="Téléphone">
            <input name="phone" type="tel" className={fieldClass} />
          </Field>
          <Field label="Poste / fonction">
            <input name="poste" placeholder="ex. Secrétaire principale" className={fieldClass} />
          </Field>
          <Field label="Rôle">
            <select name="roleId" required className={fieldClass}>
              {EMPLOYEE_ROLE_IDS.map((roleId) => (
                <option key={roleId} value={roleId}>
                  {EMPLOYEE_ROLE_LABELS[roleId]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Mot de passe initial">
            <input name="password" type="password" required minLength={8} className={fieldClass} />
          </Field>
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button type="submit" className={btnPrimary}>
              Enregistrer
            </button>
            <Link href="/admin/employes" className="inline-flex min-h-11 items-center text-sm font-semibold text-green-deep">
              Annuler
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
