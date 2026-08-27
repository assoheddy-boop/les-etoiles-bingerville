import Link from "next/link";
import { Card, Field, PageIntro, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { ExtrasFlash, PickupGateForm } from "@/components/school/ExtrasUi";
import { PickupCodeList } from "@/components/school/PickupQr";
import { classLabel, readSchoolLife, studentFullName, todayISO } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminSortiePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const date = todayISO();
  const today = data.pickupAuths.filter((row) => row.date === date);

  return (
    <div className="space-y-6">
      <PageIntro
        title="QR sortie"
        lead="QR réel du jour par enfant. Les parents l’affichent (ou l’impriment) ; le vigile le scanne au tableau de bord, ou tape le code."
      />
      <ExtrasFlash ok={ok} error={error} okText="Code généré. Les parents voient le QR dans leur espace." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Générer un code">
          <form action="/api/admin/pickup" method="post" className="space-y-4">
            <Field label="Élève">
              <select name="studentId" required className={fieldClass}>
                <option value="">— Choisir —</option>
                {data.students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {studentFullName(student)} · {classLabel(student.classId, data)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Personne autorisée">
              <input name="authorizedPerson" placeholder="Laisser vide = parent" className={fieldClass} />
            </Field>
            <Field label="Téléphone">
              <input name="authorizedPhone" className={fieldClass} />
            </Field>
            <button className={btnPrimary}>Générer / réafficher le QR du jour</button>
          </form>
          <form action="/api/admin/pickup" method="post" className="mt-6 space-y-3">
            <input type="hidden" name="action" value="generate-class" />
            <Field label="Ou toute une classe">
              <select name="classId" required className={fieldClass}>
                <option value="">— Classe —</option>
                {data.classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {classLabel(item.id, data)}
                  </option>
                ))}
              </select>
            </Field>
            <button className={btnPrimary}>Générer pour la classe</button>
          </form>
        </Card>

        <Card title="Tableau de bord vigile">
          <p className="mb-4 text-sm text-muted">
            Écran grille (espace vigile, plein champ) :{" "}
            <Link href="/espace-vigile" className="font-semibold text-green-deep underline">
              /espace-vigile
            </Link>
          </p>
          <PickupGateForm action="/api/admin/pickup" extra={{ action: "validate" }} />
        </Card>
      </div>

      <Card title={`QR du ${date}`}>
        {today.length === 0 ? (
          <p className="text-sm text-muted">Aucun QR aujourd’hui. Générez-les le matin.</p>
        ) : (
          <PickupCodeList
            items={today.map((auth) => {
              const student = data.students.find((row) => row.id === auth.studentId);
              return {
                id: auth.id,
                code: auth.code,
                studentName: student ? studentFullName(student) : auth.studentId,
                person: auth.authorizedPerson,
                usedAt: auth.usedAt,
              };
            })}
          />
        )}
      </Card>
    </div>
  );
}
