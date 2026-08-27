import Link from "next/link";
import { AdminFlash, Card, Field, PageIntro, btnDanger, btnPrimary, fieldClass } from "@/components/school/AdminUi";
import { classLabel, feeKindLabels, readSchoolLife } from "@/lib/school-life";
import { CYCLES } from "@/lib/school-life-types";
import { formatFcfa as money } from "@/lib/payments";

export const dynamic = "force-dynamic";

const KINDS = Object.entries(feeKindLabels) as Array<[keyof typeof feeKindLabels, string]>;

export default async function AdminFeesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const data = await readSchoolLife();

  return (
    <div className="space-y-6">
      <PageIntro
        title="Frais"
        lead="Scolarité, cantine, inscription. À la création, les factures sont générées pour les élèves déjà inscrits dans le cycle ou la classe. Encaissement au secrétariat : Caisse."
      />
      <AdminFlash ok={ok} error={error} />
      <p className="text-sm">
        Encaissement familles au secrétariat :{" "}
        <Link href="/admin/caisse" className="font-semibold text-green-deep">
          Caisse
        </Link>
        . Remises :{" "}
        <Link href="/admin/cas-sociaux" className="font-semibold text-green-deep">
          Cas sociaux
        </Link>
        .
      </p>

      <Card title="Nouveau type de frais">
        <form action="/api/admin/fees" method="post" className="grid gap-4 sm:grid-cols-2">
          <Field label="Libellé">
            <input name="name" required placeholder="Ex. Mensualité scolarité" className={fieldClass} />
          </Field>
          <Field label="Nature">
            <select name="kind" required className={fieldClass}>
              {KINDS.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Montant (FCFA)">
            <input name="amountFcfa" type="number" min="0" step="100" required className={fieldClass} />
          </Field>
          <Field label="Période">
            <input name="period" required placeholder="Ex. Septembre 2026" className={fieldClass} />
          </Field>
          <Field label="Cycle (si pas une classe)">
            <select name="cycle" className={fieldClass}>
              <option value="">Tous</option>
              {CYCLES.map((cycle) => (
                <option key={cycle} value={cycle}>
                  {cycle}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Classe précise (optionnel)">
            <select name="classId" className={fieldClass}>
              <option value="">— Aucune —</option>
              {data.classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {classLabel(item.id, data)}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <button className={btnPrimary}>Créer et facturer</button>
          </div>
        </form>
      </Card>

      <form action="/api/admin/fees" method="post">
        <input type="hidden" name="action" value="generate" />
        <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:bg-white">
          Régénérer les factures manquantes
        </button>
      </form>

      {data.feeTypes.map((fee) => (
        <Card key={fee.id} title={`${fee.name} · ${money(fee.amountFcfa)}`}>
          <p className="mb-4 text-sm text-muted">
            {feeKindLabels[fee.kind]} · {fee.period}
            {fee.classId ? ` · ${classLabel(fee.classId, data)}` : fee.cycle ? ` · ${fee.cycle}` : " · tous"}
            {` · ${data.invoices.filter((row) => row.feeTypeId === fee.id).length} facture(s)`}
          </p>
          <form action="/api/admin/fees" method="post" className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="id" value={fee.id} />
            <Field label="Libellé">
              <input name="name" required defaultValue={fee.name} className={fieldClass} />
            </Field>
            <Field label="Nature">
              <select name="kind" defaultValue={fee.kind} className={fieldClass}>
                {KINDS.map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Montant">
              <input name="amountFcfa" type="number" min="0" step="100" defaultValue={fee.amountFcfa} className={fieldClass} />
            </Field>
            <Field label="Période">
              <input name="period" required defaultValue={fee.period} className={fieldClass} />
            </Field>
            <Field label="Cycle">
              <select name="cycle" defaultValue={fee.cycle ?? ""} className={fieldClass}>
                <option value="">Tous</option>
                {CYCLES.map((cycle) => (
                  <option key={cycle} value={cycle}>
                    {cycle}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Classe">
              <select name="classId" defaultValue={fee.classId ?? ""} className={fieldClass}>
                <option value="">— Aucune —</option>
                {data.classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {classLabel(item.id, data)}
                  </option>
                ))}
              </select>
            </Field>
            <div>
              <button className={btnPrimary}>Enregistrer</button>
            </div>
          </form>
          <form action="/api/admin/fees" method="post" className="mt-4">
            <input type="hidden" name="action" value="delete" />
            <input type="hidden" name="id" value={fee.id} />
            <button className={btnDanger}>Supprimer</button>
          </form>
        </Card>
      ))}
    </div>
  );
}
