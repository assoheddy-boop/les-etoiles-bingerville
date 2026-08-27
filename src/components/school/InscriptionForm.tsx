import Link from "next/link";
import { ClassEffectif } from "@/components/school/ClassEffectif";
import { Field, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { ENROLLMENT_DOCUMENTS, ENROLLMENT_STATUS_OPTIONS, LV2_OPTIONS, SERIES_OPTIONS, mergeChecklist } from "@/lib/enrollment";
import type { ParentAccount, RosterStudent, SchoolClass, StudentEnrollment } from "@/lib/school-life-types";
import { studentPhotoSrc } from "@/lib/student-photos";

export type InscriptionPrefill = {
  firstName?: string;
  lastName?: string;
  guardianName?: string;
  guardianPhone?: string;
  contactEmail?: string;
  classId?: string;
  enrollmentStatus?: string;
  inboxId?: string;
};

export function InscriptionForm({
  yearLabel,
  classes,
  parents,
  student,
  enrollment,
  prefill,
}: {
  yearLabel: string;
  classes: SchoolClass[];
  parents: ParentAccount[];
  student?: RosterStudent;
  enrollment?: StudentEnrollment;
  prefill?: InscriptionPrefill;
}) {
  const isNew = !student;
  const action = isNew ? "/api/admin/inscriptions" : `/api/admin/inscriptions/${student.id}`;
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Abidjan" });
  const checklist = mergeChecklist(enrollment?.documentsChecklist);
  const photo = student ? studentPhotoSrc(student) : null;
  const classId = student?.classId || prefill?.classId || "";
  const showSeries = classes.some((item) => item.cycle === "Secondaire");

  return (
    <form action={action} method="post" encType="multipart/form-data" className="space-y-6">
      {prefill?.inboxId ? <input type="hidden" name="inboxId" value={prefill.inboxId} /> : null}

      <article className="rounded-3xl border border-line bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">Année scolaire</p>
            <p className="font-display text-xl text-green-deep">{yearLabel}</p>
          </div>
          <Field label="Date inscription">
            <input
              type="date"
              name="enrolledAt"
              defaultValue={enrollment?.enrolledAt?.slice(0, 10) || today}
              className={fieldClass}
            />
          </Field>
          <ClassEffectif classId={classId} />
        </div>
      </article>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-line bg-white p-4 sm:p-6">
          <h2 className="font-display text-xl text-green-deep">Identité & scolarité</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Mle étab.">
              <input
                name="matricule"
                defaultValue={student?.matricule ?? ""}
                placeholder="Matricule interne"
                className={fieldClass}
              />
            </Field>
            <Field label="Mle nat. (MEN)">
              <input
                name="nationalMatricule"
                defaultValue={student?.nationalMatricule ?? ""}
                placeholder="Matricule national"
                className={fieldClass}
              />
            </Field>
            <Field label="Nom *">
              <input name="lastName" required defaultValue={student?.lastName || prefill?.lastName || ""} className={fieldClass} />
            </Field>
            <Field label="Prénoms *">
              <input
                name="firstName"
                required
                defaultValue={student?.firstName || prefill?.firstName || ""}
                className={fieldClass}
              />
            </Field>
            <Field label="Né(e) le">
              <input type="date" name="birthDate" defaultValue={student?.birthDate ?? ""} className={fieldClass} />
            </Field>
            <Field label="À">
              <input name="birthPlace" defaultValue={student?.birthPlace ?? ""} placeholder="Ville / commune" className={fieldClass} />
            </Field>
            <Field label="Sexe">
              <select name="gender" defaultValue={student?.gender ?? ""} className={fieldClass}>
                <option value="">—</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
            </Field>
            <Field label="Nationalité">
              <input name="nationality" defaultValue={student?.nationality || "Ivoirienne"} className={fieldClass} />
            </Field>
            <Field label="Extrait N°">
              <input name="birthCertNumber" defaultValue={enrollment?.birthCertNumber ?? ""} className={fieldClass} />
            </Field>
            <Field label="Date déli.">
              <input type="date" name="birthCertDate" defaultValue={enrollment?.birthCertDate ?? ""} className={fieldClass} />
            </Field>
            <Field label="Lieu déli.">
              <input name="birthCertPlace" defaultValue={enrollment?.birthCertPlace ?? ""} className={`${fieldClass} sm:col-span-2`} />
            </Field>
            <Field label="Classe *">
              <select name="classId" id="classIdSelect" required defaultValue={classId} className={fieldClass}>
                <option value="">— Choisir —</option>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — {item.campus}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Statut">
              <select
                name="enrollmentStatus"
                defaultValue={enrollment?.enrollmentStatus || prefill?.enrollmentStatus || "NOUVEAU"}
                className={fieldClass}
              >
                {ENROLLMENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="LV2">
              <select name="lv2" defaultValue={enrollment?.lv2 ?? ""} className={fieldClass}>
                {LV2_OPTIONS.map((opt) => (
                  <option key={opt.value || "none"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            {showSeries ? (
              <Field label="Série">
                <select name="series" defaultValue={student?.series ?? ""} className={fieldClass}>
                  <option value="">—</option>
                  {SERIES_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Field>
            ) : null}
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="repeatYear" defaultChecked={enrollment?.repeatYear} className="accent-green" />
              Redoublant
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                name="isScholarship"
                defaultChecked={enrollment?.isScholarship}
                className="accent-green"
              />
              Boursier
            </label>
          </div>
        </article>

        <article className="rounded-3xl border border-line bg-white p-4 sm:p-6">
          <h2 className="font-display text-xl text-green-deep">Famille & parcours</h2>
          <div className="mt-4 grid gap-4">
            <Field label="Père">
              <input name="fatherName" defaultValue={student?.fatherName ?? ""} className={fieldClass} />
            </Field>
            <Field label="Mère">
              <input name="motherName" defaultValue={student?.motherName ?? ""} className={fieldClass} />
            </Field>
            <Field label="Tuteur">
              <input
                name="guardianName"
                defaultValue={student?.guardianName || prefill?.guardianName || ""}
                className={fieldClass}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tél. tuteur">
                <input
                  type="tel"
                  name="guardianPhone"
                  defaultValue={student?.guardianPhone || prefill?.guardianPhone || ""}
                  className={fieldClass}
                />
              </Field>
              <Field label="Contact">
                <input type="tel" name="contactPhone" defaultValue={student?.contactPhone ?? ""} className={fieldClass} />
              </Field>
            </div>
            <Field label="E-mail">
              <input
                type="email"
                name="contactEmail"
                defaultValue={student?.contactEmail || prefill?.contactEmail || ""}
                className={fieldClass}
              />
            </Field>
            <Field label="Compte parent (espace familles)">
              <select name="parentId" defaultValue={student?.parentId ?? ""} className={fieldClass}>
                <option value="">Sans compte parent</option>
                {parents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.displayName}
                  </option>
                ))}
              </select>
            </Field>
            <hr className="border-line" />
            <Field label="N° décision statut">
              <input name="decisionNumber" defaultValue={enrollment?.decisionNumber ?? ""} className={fieldClass} />
            </Field>
            <Field label="N° transfert / réaf.">
              <input name="transferRef" defaultValue={enrollment?.transferRef ?? ""} className={fieldClass} />
            </Field>
            <Field label="Établissement d'origine">
              <input name="previousSchool" defaultValue={enrollment?.previousSchool ?? ""} className={fieldClass} />
            </Field>
            <Field label="Classe suivie">
              <input name="previousClass" defaultValue={enrollment?.previousClass ?? ""} className={fieldClass} />
            </Field>
            <Field label="Photo">
              {photo ? (
                <div className="mb-3 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt="" className="h-20 w-20 rounded-xl object-cover" />
                  <label className="flex items-center gap-2 text-sm font-normal">
                    <input type="checkbox" name="removePhoto" className="accent-green" />
                    Supprimer la photo
                  </label>
                </div>
              ) : null}
              <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" className="text-sm" />
            </Field>
          </div>
        </article>
      </div>

      <article className="rounded-3xl border border-line bg-white p-4 sm:p-6">
        <h2 className="font-display text-xl text-green-deep">Dossier — pièces fournies</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ENROLLMENT_DOCUMENTS.map((doc) => (
            <label key={doc.key} className="flex min-h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm">
              <input
                type="checkbox"
                name={`doc_${doc.key}`}
                defaultChecked={checklist[doc.key]}
                className="accent-green"
              />
              {doc.label}
            </label>
          ))}
        </div>
        <div className="mt-4">
          <Field label="Observations">
            <textarea name="notes" rows={3} defaultValue={enrollment?.notes ?? ""} className={fieldClass} />
          </Field>
        </div>
      </article>

      {!isNew && student ? (
        <article className="rounded-3xl border border-line bg-white p-4 sm:p-6">
          <h2 className="font-display text-xl text-green-deep">Certificats</h2>
          <p className="mt-1 text-sm text-muted">Documents officiels à imprimer ou télécharger.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/api/admin/inscriptions/${student.id}/fiche`}
              className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold"
              target="_blank"
            >
              Fiche PDF
            </Link>
            <Link
              href={`/api/admin/inscriptions/${student.id}/certificat`}
              className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold"
              target="_blank"
            >
              Certificat de scolarité
            </Link>
            <Link
              href={`/api/admin/inscriptions/${student.id}/attestation`}
              className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold"
              target="_blank"
            >
              Attestation d’inscription
            </Link>
          </div>
        </article>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button className={btnPrimary}>Enregistrer la fiche</button>
        <Link href="/admin/inscriptions" className="inline-flex min-h-11 items-center rounded-full border border-line px-5 py-3 font-semibold">
          Annuler
        </Link>
      </div>
    </form>
  );
}
