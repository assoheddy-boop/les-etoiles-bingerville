import { btnPrimary, fieldClass } from "./AdminUi";

export function LessonValidateForm({ slotId, date }: { slotId: string; date: string }) {
  return (
    <form action="/api/teacher/lessons" method="post" className="mt-3 space-y-3">
      <input type="hidden" name="slotId" value={slotId} />
      <input type="hidden" name="date" value={date} />
      <label className="grid gap-1 text-sm font-medium">
        Chapitre
        <input name="chapter" required placeholder="Ex. Les unités de mesure" className={fieldClass} />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Contenu du cours
        <textarea
          name="content"
          required
          rows={3}
          placeholder="Ce qui a été fait en classe (obligatoire)."
          className={fieldClass}
        />
      </label>
      <button className={btnPrimary}>Valider ce cours</button>
    </form>
  );
}
