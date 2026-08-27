import Link from "next/link";
import { Card, Field, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { ExtrasFlash, PickupGateForm } from "@/components/school/ExtrasUi";
import { PickupCodeList } from "@/components/school/PickupQr";
import { requireTeacher } from "@/lib/auth";
import { classLabel, readSchoolLife, studentFullName, teacherClasses, teacherStudents, todayISO } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function TeacherSortiePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await requireTeacher();
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const classes = teacherClasses(session.teacherId, data);
  const students = teacherStudents(session.teacherId, data);
  const date = todayISO();
  const today = data.pickupAuths.filter(
    (row) => row.date === date && students.some((student) => student.id === row.studentId),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-green-deep">QR sortie</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Générez le QR du jour pour un élève ou une classe. Tableau de bord vigile :{" "}
          <Link href="/espace-vigile" className="font-semibold text-green-deep underline">
            /espace-vigile
          </Link>
          .
        </p>
      </div>
      <ExtrasFlash ok={ok} error={error} okText="QR généré. Les parents le voient dans leur espace." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Générer">
          <form action="/api/teacher/pickup" method="post" className="space-y-4">
            <Field label="Élève">
              <select name="studentId" required className={fieldClass}>
                <option value="">— Choisir —</option>
                {students.map((student) => (
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
            <button className={btnPrimary}>Générer le QR du jour</button>
          </form>
          <form action="/api/teacher/pickup" method="post" className="mt-6 space-y-3">
            <input type="hidden" name="action" value="generate-class" />
            <Field label="Toute une classe">
              <select name="classId" required className={fieldClass}>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {classLabel(item.id, data)}
                  </option>
                ))}
              </select>
            </Field>
            <button className={btnPrimary}>Générer pour la classe</button>
          </form>
        </Card>
        <Card title="Valider à la grille">
          <PickupGateForm action="/api/teacher/pickup" extra={{ action: "validate" }} />
        </Card>
      </div>
      <Card title="QR du jour">
        {today.length === 0 ? (
          <p className="text-sm text-muted">Aucun QR généré pour vos classes aujourd’hui.</p>
        ) : (
          <PickupCodeList
            items={today.map((auth) => {
              const student = data.students.find((row) => row.id === auth.studentId);
              return {
                id: auth.id,
                code: auth.code,
                studentName: student ? studentFullName(student) : "",
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
