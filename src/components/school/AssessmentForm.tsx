import { btnPrimary, fieldClass } from "./AdminUi";
import type { SchoolClass, Subject } from "@/lib/school-life-types";
import { todayISO } from "@/lib/school-life";

export function AssessmentForm({
  classes,
  subjects,
}: {
  classes: SchoolClass[];
  subjects: Subject[];
}) {
  return (
    <form action="/api/teacher/assessments" method="post" encType="multipart/form-data" className="space-y-4">
      <input type="hidden" name="action" value="create" />
      <label className="grid gap-1 text-sm font-medium">
        Type
        <select name="kind" required className={fieldClass}>
          <option value="controle">Contrôle</option>
          <option value="composition">Composition</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Classe
        <select name="classId" required className={fieldClass}>
          <option value="">— Choisir —</option>
          {classes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} — {item.campus}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Matière
        <select name="subjectId" required className={fieldClass}>
          <option value="">— Choisir —</option>
          {subjects.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Date
        <input name="date" type="date" required defaultValue={todayISO()} className={fieldClass} />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Sujet
        <textarea name="topic" required rows={3} placeholder="Texte du sujet ou consigne." className={fieldClass} />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Fichier (optionnel)
        <input
          name="attachment"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.doc,.docx"
          className="rounded-xl border border-line bg-paper px-3 py-2.5 font-normal file:mr-3 file:rounded-full file:border-0 file:bg-green-soft file:px-3 file:py-1 file:text-sm file:font-semibold file:text-green-deep"
        />
      </label>
      <label className="inline-flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="markDone" value="1" className="accent-green" />
        Marquer comme fait / validé
      </label>
      <button className={btnPrimary}>Enregistrer</button>
    </form>
  );
}
