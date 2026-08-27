import { AdminFlash, Card, CheckboxGroup, Field, PageIntro, btnDanger, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { classLabel, readSchoolLife, studentFullName } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminParentsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const studentOptions = data.students.map((student) => ({
    id: student.id,
    label: `${studentFullName(student)} · ${classLabel(student.classId, data)}`,
  }));

  return (
    <div className="space-y-6">
      <PageIntro
        title="Parents"
        lead="Le parent se connecte avec le matricule de l’enfant et le mot de passe saisi ici. Communiquez-le à la famille."
      />
      <AdminFlash ok={ok} error={error} />

      <Card title="Nouveau parent">
        <form action="/api/admin/parents" method="post" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom de la famille">
              <input name="displayName" required placeholder="Ex. Famille Coulibaly" className={fieldClass} />
            </Field>
            <Field label="Mot de passe espace parents">
              <input name="password" type="password" required className={fieldClass} />
            </Field>
            <Field label="Téléphone">
              <input name="phone" className={fieldClass} />
            </Field>
            <Field label="E-mail">
              <input name="email" type="email" className={fieldClass} />
            </Field>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Enfants</p>
            <CheckboxGroup name="studentIds" options={studentOptions} selected={[]} />
          </div>
          <button className={btnPrimary}>Créer le parent</button>
        </form>
      </Card>

      {data.parents.map((parent) => (
        <Card key={parent.id} title={parent.displayName}>
          <p className="mb-4 text-sm text-muted">
            Mot de passe : saisissez-en un nouveau ci-dessous pour le remplacer (jamais affiché ici).
            {parent.phone ? ` · ${parent.phone}` : ""}
          </p>
          <form action="/api/admin/parents" method="post" className="space-y-4">
            <input type="hidden" name="id" value={parent.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom">
                <input name="displayName" required defaultValue={parent.displayName} className={fieldClass} />
              </Field>
              <Field label="Nouveau mot de passe">
                <input name="password" type="password" placeholder="Laisser vide pour ne pas changer" className={fieldClass} />
              </Field>
              <Field label="Téléphone">
                <input name="phone" defaultValue={parent.phone ?? ""} className={fieldClass} />
              </Field>
              <Field label="E-mail">
                <input name="email" type="email" defaultValue={parent.email ?? ""} className={fieldClass} />
              </Field>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Enfants</p>
              <CheckboxGroup name="studentIds" options={studentOptions} selected={parent.studentIds} />
            </div>
            <button className={btnPrimary}>Enregistrer</button>
          </form>
          <form action="/api/admin/parents" method="post" className="mt-4">
            <input type="hidden" name="action" value="delete" />
            <input type="hidden" name="id" value={parent.id} />
            <button className={btnDanger}>Supprimer</button>
          </form>
        </Card>
      ))}
    </div>
  );
}
