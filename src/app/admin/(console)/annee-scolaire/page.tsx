import { AdminFlash, Card, Field, PageIntro, btnDanger, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { currentYear, readSchoolLife } from "@/lib/school-life";
import { formatDateFr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSchoolYearPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const year = currentYear(data);

  return (
    <div className="space-y-6">
      <PageIntro
        title="Année scolaire"
        lead="L’année en cours filtre les classes. Les familles et enseignants voient cette session."
      />
      <AdminFlash ok={ok} error={error} />
      {year ? (
        <p className="text-sm text-muted">
          En cours : <strong className="text-ink">{year.label}</strong> ({formatDateFr(year.startDate)} →{" "}
          {formatDateFr(year.endDate)})
        </p>
      ) : null}

      <Card title="Nouvelle année">
        <form action="/api/admin/school-years" method="post" className="grid gap-4 sm:grid-cols-3">
          <Field label="Libellé">
            <input name="label" required placeholder="Ex. 2027-2028" className={fieldClass} />
          </Field>
          <Field label="Début">
            <input name="startDate" type="date" required className={fieldClass} />
          </Field>
          <Field label="Fin">
            <input name="endDate" type="date" required className={fieldClass} />
          </Field>
          <div className="sm:col-span-3">
            <button className={btnPrimary}>Créer l’année</button>
          </div>
        </form>
      </Card>

      {data.schoolYears.map((item) => (
        <Card key={item.id} title={item.current ? `${item.label} — en cours` : item.label}>
          <form action="/api/admin/school-years" method="post" className="grid gap-4 sm:grid-cols-3">
            <input type="hidden" name="id" value={item.id} />
            <Field label="Libellé">
              <input name="label" required defaultValue={item.label} className={fieldClass} />
            </Field>
            <Field label="Début">
              <input name="startDate" type="date" required defaultValue={item.startDate} className={fieldClass} />
            </Field>
            <Field label="Fin">
              <input name="endDate" type="date" required defaultValue={item.endDate} className={fieldClass} />
            </Field>
            <div className="flex flex-wrap gap-2 sm:col-span-3">
              <button className={btnPrimary}>Enregistrer</button>
            </div>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {!item.current ? (
              <form action="/api/admin/school-years" method="post">
                <input type="hidden" name="action" value="select" />
                <input type="hidden" name="id" value={item.id} />
                <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
                  Définir comme année en cours
                </button>
              </form>
            ) : null}
            <form action="/api/admin/school-years" method="post">
              <input type="hidden" name="action" value="delete" />
              <input type="hidden" name="id" value={item.id} />
              <button className={btnDanger}>Supprimer</button>
            </form>
          </div>
        </Card>
      ))}
    </div>
  );
}
