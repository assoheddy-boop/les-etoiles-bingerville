import type { SchoolClass } from "@/lib/school-life-types";
import { todayISO } from "@/lib/school-life";

export function HomeworkForm({ classes }: { classes: SchoolClass[] }) {
  const minDate = todayISO();
  return (
    <form action="/api/teacher/homeworks" method="post" encType="multipart/form-data" className="space-y-4">
      <label className="grid gap-1 text-sm font-medium">
        Classe
        <select name="classId" required className="w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2.5 font-normal">
          <option value="">— Choisir —</option>
          {classes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} — {item.campus}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Titre
        <input
          name="title"
          required
          placeholder="Ex. Exercices page 42"
          className="w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Consignes pour les parents
        <textarea
          name="description"
          rows={3}
          placeholder="Détails, matériel, date de rendu…"
          className="w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Date limite
        <input
          name="dueDate"
          type="date"
          required
          min={minDate}
          className="w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2.5 font-normal"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Pièce jointe (optionnel)
        <input
          name="attachment"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.doc,.docx"
          className="rounded-xl border border-line bg-paper px-3 py-2.5 font-normal file:mr-3 file:rounded-full file:border-0 file:bg-green-soft file:px-3 file:py-1 file:text-sm file:font-semibold file:text-green-deep"
        />
        <span className="text-xs font-normal text-muted">PDF, image ou document — 8 Mo maximum. Les parents pourront le télécharger.</span>
      </label>
      <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-green px-5 py-3 font-semibold text-white hover:bg-green-deep sm:w-auto">
        Publier le devoir
      </button>
    </form>
  );
}
