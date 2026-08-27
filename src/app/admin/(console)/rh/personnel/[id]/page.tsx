import { notFound } from "next/navigation";
import { AdminFlash, Card, Field, PageIntro, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { contractTypeLabels, jobTitleLabels, staffDisplayName, staffStatusLabels } from "@/lib/hr";
import { readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminStaffDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { id } = await params;
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const profile = data.staffProfiles.find((row) => row.id === id);
  if (!profile) notFound();

  return (
    <div className="space-y-6">
      <PageIntro title={staffDisplayName(profile)} lead={`${jobTitleLabels[profile.jobTitle]} · ${profile.campus}`} />
      <AdminFlash ok={ok} error={error} />
      <Card title="Dossier">
        <form action="/api/admin/hr" method="post" className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="action" value="staff-update" />
          <input type="hidden" name="id" value={profile.id} />
          <Field label="Prénom">
            <input name="firstName" required defaultValue={profile.firstName} className={fieldClass} />
          </Field>
          <Field label="Nom">
            <input name="lastName" required defaultValue={profile.lastName} className={fieldClass} />
          </Field>
          <Field label="Fonction">
            <select name="jobTitle" defaultValue={profile.jobTitle} className={fieldClass}>
              {Object.entries(jobTitleLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Contrat">
            <select name="contractType" defaultValue={profile.contractType} className={fieldClass}>
              {Object.entries(contractTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Statut">
            <select name="status" defaultValue={profile.status} className={fieldClass}>
              {Object.entries(staffStatusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Établissement">
            <select name="establishmentId" defaultValue={profile.establishmentId ?? ""} className={fieldClass}>
              {data.establishments.map((est) => (
                <option key={est.id} value={est.id}>
                  {est.shortName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date d’embauche">
            <input name="startDate" type="date" defaultValue={profile.startDate} className={fieldClass} />
          </Field>
          <Field label="Salaire de base">
            <input name="baseSalary" type="number" min="0" defaultValue={profile.baseSalary} className={fieldClass} />
          </Field>
          <Field label="E-mail">
            <input name="email" type="email" defaultValue={profile.email ?? ""} className={fieldClass} />
          </Field>
          <Field label="Téléphone">
            <input name="phone" defaultValue={profile.phone ?? ""} className={fieldClass} />
          </Field>
          <Field label="Compte enseignant">
            <select name="teacherId" defaultValue={profile.teacherId ?? ""} className={fieldClass}>
              <option value="">— Aucun —</option>
              {data.teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.displayName}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes">
              <textarea name="notes" defaultValue={profile.notes ?? ""} rows={2} className={fieldClass} />
            </Field>
          </div>
          <div>
            <button className={btnPrimary}>Enregistrer</button>
          </div>
        </form>
      </Card>
      <Card title="Documents (nom de fichier / note)">
        <ul className="mb-4 space-y-2 text-sm">
          {profile.documents.length === 0 ? <li className="text-muted">Aucun document noté.</li> : null}
          {profile.documents.map((doc) => (
            <li key={doc.id} className="rounded-2xl bg-paper px-4 py-2">
              <strong>{doc.filename}</strong>
              {doc.note ? ` — ${doc.note}` : ""}
            </li>
          ))}
        </ul>
        <form action="/api/admin/hr" method="post" className="grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="action" value="staff-document" />
          <input type="hidden" name="id" value={profile.id} />
          <Field label="Nom de fichier">
            <input name="filename" required placeholder="contrat-CDD.pdf" className={fieldClass} />
          </Field>
          <Field label="Note">
            <input name="note" className={fieldClass} />
          </Field>
          <div>
            <button className={btnPrimary}>Ajouter</button>
          </div>
        </form>
      </Card>
    </div>
  );
}
