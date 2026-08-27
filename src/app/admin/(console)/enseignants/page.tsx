import { AdminFlash, Card, CheckboxGroup, Field, PageIntro, btnDanger, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { classLabel, readSchoolLife } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminTeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const classOptions = data.classes.map((item) => ({ id: item.id, label: classLabel(item.id, data) }));
  const subjectOptions = data.subjects.map((item) => ({
    id: item.id,
    label: item.cycle ? `${item.name} (${item.cycle})` : item.name,
  }));

  return (
    <div className="space-y-6">
      <PageIntro
        title="Enseignants"
        lead="Chaque enseignant créé ici peut se connecter à l’espace enseignants avec son e-mail et son mot de passe."
      />
      <AdminFlash ok={ok} error={error} />

      <Card title="Nouvel enseignant">
        <form action="/api/admin/teachers" method="post" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom affiché">
              <input name="displayName" required placeholder="Ex. Adjoua N’Guessan" className={fieldClass} />
            </Field>
            <Field label="Fonction">
              <input name="title" placeholder="Ex. Titulaire CE2" className={fieldClass} />
            </Field>
            <Field label="E-mail (identifiant)">
              <input name="email" type="email" required placeholder="prenom@lesetoiles.ci" className={fieldClass} />
            </Field>
            <Field label="Mot de passe">
              <input name="password" type="password" required className={fieldClass} />
            </Field>
            <Field label="Téléphone">
              <input name="phone" className={fieldClass} />
            </Field>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Classes</p>
            <CheckboxGroup name="classIds" options={classOptions} selected={[]} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Matières</p>
            <CheckboxGroup name="subjectIds" options={subjectOptions} selected={[]} />
          </div>
          <button className={btnPrimary}>Créer l’enseignant</button>
        </form>
      </Card>

      {data.teachers.map((teacher) => (
        <Card key={teacher.id} title={teacher.displayName}>
          <p className="mb-4 text-sm text-muted">
            {teacher.title} · {teacher.email}
            {teacher.phone ? ` · ${teacher.phone}` : ""}
          </p>
          <form action="/api/admin/teachers" method="post" className="space-y-4">
            <input type="hidden" name="id" value={teacher.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom affiché">
                <input name="displayName" required defaultValue={teacher.displayName} className={fieldClass} />
              </Field>
              <Field label="Fonction">
                <input name="title" defaultValue={teacher.title} className={fieldClass} />
              </Field>
              <Field label="E-mail">
                <input name="email" type="email" required defaultValue={teacher.email} className={fieldClass} />
              </Field>
              <Field label="Nouveau mot de passe">
                <input name="password" type="password" placeholder="Laisser vide pour ne pas changer" className={fieldClass} />
              </Field>
              <Field label="Téléphone">
                <input name="phone" defaultValue={teacher.phone ?? ""} className={fieldClass} />
              </Field>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Classes</p>
              <CheckboxGroup name="classIds" options={classOptions} selected={teacher.classIds} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Matières</p>
              <CheckboxGroup name="subjectIds" options={subjectOptions} selected={teacher.subjectIds} />
            </div>
            <button className={btnPrimary}>Enregistrer</button>
          </form>
          <form action="/api/admin/teachers" method="post" className="mt-4">
            <input type="hidden" name="action" value="delete" />
            <input type="hidden" name="id" value={teacher.id} />
            <button className={btnDanger}>Supprimer</button>
          </form>
        </Card>
      ))}
    </div>
  );
}
