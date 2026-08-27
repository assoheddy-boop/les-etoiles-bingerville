import { AdminFlash, Card, Field, PageIntro, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { presenceStaffId, staffDisplayName } from "@/lib/hr";
import { readSchoolLife, staffPresenceLabels, todayISO } from "@/lib/school-life";

export const dynamic = "force-dynamic";

export default async function AdminPresencePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();
  const date = todayISO();

  return (
    <div className="space-y-6">
      <PageIntro title="Présence" lead="Pointage du jour pour tout le personnel, pas seulement les enseignants." />
      <AdminFlash ok={ok} error={error} />
      <Card title={`Présence du ${date}`}>
        <ul className="space-y-3">
          {data.staffProfiles
            .filter((row) => row.status !== "inactive")
            .map((profile) => {
              const presence = data.staffPresence.find(
                (row) => presenceStaffId(row, data) === profile.id && row.date === date,
              );
              return (
                <li key={profile.id} className="rounded-2xl bg-paper p-4">
                  <p className="font-semibold">{staffDisplayName(profile)}</p>
                  <form action="/api/admin/hr" method="post" className="mt-3 flex flex-wrap items-end gap-3">
                    <input type="hidden" name="action" value="presence" />
                    <input type="hidden" name="staffId" value={profile.id} />
                    <Field label="Statut">
                      <select name="status" defaultValue={presence?.status ?? "present"} className={fieldClass}>
                        {Object.entries(staffPresenceLabels).map(([id, label]) => (
                          <option key={id} value={id}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Note">
                      <input name="note" defaultValue={presence?.note ?? ""} className={fieldClass} />
                    </Field>
                    <button className={btnPrimary}>Enregistrer</button>
                  </form>
                </li>
              );
            })}
        </ul>
      </Card>
    </div>
  );
}
