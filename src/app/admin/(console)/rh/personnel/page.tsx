import Link from "next/link";
import { AdminFlash, Card, Field, PageIntro, TableWrap, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { contractTypeLabels, jobTitleLabels, staffDisplayName, staffStatusLabels } from "@/lib/hr";
import { formatFcfa } from "@/lib/payments";
import { readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminStaffPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const linked = new Set(data.staffProfiles.map((row) => row.teacherId).filter(Boolean));

  return (
    <div className="space-y-6">
      <PageIntro title="Personnel" lead="Enseignants et personnel non enseignant (ATSEM, ménage, gardien, chauffeur, secrétariat)." />
      <AdminFlash ok={ok} error={error} />
      <Card title="Ajouter un membre">
        <form action="/api/admin/hr" method="post" className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="action" value="staff-create" />
          <Field label="Prénom">
            <input name="firstName" required className={fieldClass} />
          </Field>
          <Field label="Nom">
            <input name="lastName" required className={fieldClass} />
          </Field>
          <Field label="Fonction">
            <select name="jobTitle" required className={fieldClass}>
              {Object.entries(jobTitleLabels).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Contrat">
            <select name="contractType" defaultValue="cdd" className={fieldClass}>
              {Object.entries(contractTypeLabels).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Établissement">
            <select name="establishmentId" className={fieldClass}>
              {data.establishments.map((est) => (
                <option key={est.id} value={est.id}>
                  {est.shortName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date d’embauche">
            <input name="startDate" type="date" className={fieldClass} />
          </Field>
          <Field label="Salaire de base (FCFA)">
            <input name="baseSalary" type="number" min="0" defaultValue={0} className={fieldClass} />
          </Field>
          <Field label="Lier un compte enseignant (optionnel)">
            <select name="teacherId" className={fieldClass}>
              <option value="">— Aucun —</option>
              {data.teachers
                .filter((teacher) => !linked.has(teacher.id))
                .map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.displayName}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="E-mail">
            <input name="email" type="email" className={fieldClass} />
          </Field>
          <Field label="Téléphone">
            <input name="phone" className={fieldClass} />
          </Field>
          <div className="sm:col-span-2">
            <button className={btnPrimary}>Enregistrer</button>
          </div>
        </form>
      </Card>
      <Card title="Annuaire">
        <TableWrap>
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="text-muted">
                <th className="py-2">Nom</th>
                <th>Fonction</th>
                <th>Contrat</th>
                <th>Salaire base</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.staffProfiles.map((row) => (
                <tr key={row.id} className="border-t border-line">
                  <td className="py-3 font-semibold">{staffDisplayName(row)}</td>
                  <td>{jobTitleLabels[row.jobTitle]}</td>
                  <td>{contractTypeLabels[row.contractType]}</td>
                  <td>{formatFcfa(row.baseSalary)}</td>
                  <td>{staffStatusLabels[row.status]}</td>
                  <td>
                    <Link href={`/admin/rh/personnel/${row.id}`} className="font-semibold text-green-deep">
                      Dossier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>
    </div>
  );
}
