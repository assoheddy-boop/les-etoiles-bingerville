import { notFound } from "next/navigation";
import { AdminFlash, Card, Field, PageIntro, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { ControlSubnav } from "@/components/school/ControlSubnav";
import { requireAdmin, staffRoleOf } from "@/lib/auth";
import { readSchoolLife } from "@/lib/school-life";
import { canToggleTeacherControl, noMessageDays } from "@/lib/teacher-control";

export const dynamic = "force-dynamic";

export default async function AdminTeacherControlSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await requireAdmin();
  const role = staffRoleOf(session);
  if (!canToggleTeacherControl(role)) notFound();
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();

  return (
    <div className="space-y-6">
      <PageIntro
        title="Paramètres du module"
        lead="Réservé au fondateur. Si le module est off, la navigation et les APIs enseignants correspondantes sont masquées (403)."
      />
      <ControlSubnav role={role} pathname="/admin/controle-enseignants/parametres" />
      <AdminFlash ok={ok} error={error} />
      <Card title="Activation">
        <form action="/api/admin/teacher-control/settings" method="post" className="space-y-4">
          <label className="inline-flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="enabled"
              value="1"
              defaultChecked={data.teacherControlEnabled !== false}
              className="accent-green"
            />
            Module « Contrôle des enseignants » actif
          </label>
          <Field label="Jours sans message aux familles avant alerte">
            <input
              name="noMessageDays"
              type="number"
              min={1}
              max={60}
              defaultValue={noMessageDays(data)}
              className={fieldClass}
            />
          </Field>
          <button className={btnPrimary}>Enregistrer</button>
        </form>
      </Card>
    </div>
  );
}
