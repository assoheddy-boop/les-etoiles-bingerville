import Link from "next/link";
import { AdminFlash, Card, Field, PageIntro, TableWrap, btnDanger, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { classLabel, readSchoolLife, studentFullName } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; classId?: string; establishmentId?: string }>;
}) {
  const { ok, error, classId, establishmentId } = await searchParams;
  const data = await readSchoolLife();
  const classIds = establishmentId
    ? new Set(data.classes.filter((row) => row.establishmentId === establishmentId).map((row) => row.id))
    : null;
  const students = data.students.filter((row) => {
    if (classId && row.classId !== classId) return false;
    if (classIds && !classIds.has(row.classId)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageIntro
        title="Élèves"
        lead="Liste rapide. Pour le dossier complet (pièces, PDF, certificats), ouvrez la fiche d’inscription."
      />
      <AdminFlash ok={ok} error={error} />

      <form className="flex flex-wrap items-end gap-3" method="get">
        <Field label="Filtrer par établissement">
          <select name="establishmentId" defaultValue={establishmentId ?? ""} className={fieldClass}>
            <option value="">Tous</option>
            {data.establishments.map((est) => (
              <option key={est.id} value={est.id}>
                {est.shortName}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Filtrer par classe">
          <select name="classId" defaultValue={classId ?? ""} className={fieldClass}>
            <option value="">Toutes les classes</option>
            {data.classes
              .filter((item) => !establishmentId || item.establishmentId === establishmentId)
              .map((item) => (
              <option key={item.id} value={item.id}>
                {classLabel(item.id, data)}
              </option>
            ))}
          </select>
        </Field>
        <button className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold">Filtrer</button>
      </form>

      <Card title="Nouvel élève (raccourci)">
        <p className="mb-4 text-sm text-muted">
          Préférez{" "}
          <Link href="/admin/inscriptions/nouvelle" className="font-semibold text-green">
            Nouvelle fiche d’inscription
          </Link>{" "}
          pour le dossier complet.
        </p>
        <form action="/api/admin/students" method="post" className="grid gap-4 sm:grid-cols-2">
          <Field label="Prénom">
            <input name="firstName" required className={fieldClass} />
          </Field>
          <Field label="Nom">
            <input name="lastName" required className={fieldClass} />
          </Field>
          <Field label="Classe">
            <select name="classId" required defaultValue={classId ?? ""} className={fieldClass}>
              <option value="">— Choisir —</option>
              {data.classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {classLabel(item.id, data)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Parent">
            <select name="parentId" className={fieldClass}>
              <option value="">Sans compte parent</option>
              {data.parents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.displayName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date de naissance">
            <input name="birthDate" type="date" className={fieldClass} />
          </Field>
          <Field label="Matricule (auto si parent)">
            <input name="matricule" placeholder="Laissé vide = généré" className={fieldClass} />
          </Field>
          <div className="flex items-end">
            <button className={btnPrimary}>Inscrire l’élève</button>
          </div>
        </form>
      </Card>

      <Card title={`${students.length} élève(s)`}>
        <TableWrap>
          <table className="min-w-[40rem] w-full text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="px-2 py-2 font-semibold">Élève</th>
                <th className="px-2 py-2 font-semibold">Classe</th>
                <th className="px-2 py-2 font-semibold">Parent</th>
                <th className="px-2 py-2 font-semibold">Matricule</th>
                <th className="px-2 py-2 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t border-line align-top">
                  <td className="px-2 py-3" colSpan={5}>
                    <form action="/api/admin/students" method="post" className="grid gap-3 md:grid-cols-6">
                      <input type="hidden" name="id" value={student.id} />
                      <input name="firstName" required defaultValue={student.firstName} className={fieldClass} />
                      <input name="lastName" required defaultValue={student.lastName} className={fieldClass} />
                      <select name="classId" defaultValue={student.classId} className={fieldClass}>
                        {data.classes.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <select name="parentId" defaultValue={student.parentId ?? ""} className={fieldClass}>
                        <option value="">Sans parent</option>
                        {data.parents.map((parent) => (
                          <option key={parent.id} value={parent.id}>
                            {parent.displayName}
                          </option>
                        ))}
                      </select>
                      <input name="matricule" defaultValue={student.matricule ?? ""} className={fieldClass} />
                      <div className="flex flex-wrap gap-2">
                        <button className="rounded-full bg-green px-4 py-2 text-sm font-semibold text-white">OK</button>
                        <a
                          href={`/admin/inscriptions/${student.id}`}
                          className="rounded-full border border-line px-4 py-2 text-sm font-semibold"
                        >
                          Fiche
                        </a>
                      </div>
                    </form>
                    <form action="/api/admin/students" method="post" className="mt-2">
                      <input type="hidden" name="action" value="delete" />
                      <input type="hidden" name="id" value={student.id} />
                      <button className={btnDanger}>Supprimer {studentFullName(student)}</button>
                    </form>
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
