import { formText, withAdminMutate } from "@/lib/admin-api";
import { newId } from "@/lib/school-life";
import { CYCLES, type CycleId } from "@/lib/school-life-types";

export async function POST(request: Request) {
  return withAdminMutate(request, "/admin/matieres", (data, form) => {
    const action = formText(form, "action") || "create";
    if (action === "delete") {
      const id = formText(form, "id");
      if (data.timetableSlots.some((row) => row.subjectId === id)) throw new Error("in-use");
      data.subjects = data.subjects.filter((row) => row.id !== id);
      for (const teacher of data.teachers) {
        teacher.subjectIds = teacher.subjectIds.filter((subjectId) => subjectId !== id);
      }
      return "/admin/matieres?ok=1";
    }

    const name = formText(form, "name");
    const cycleRaw = formText(form, "cycle");
    if (!name) throw new Error("missing");
    const cycle = CYCLES.includes(cycleRaw as CycleId) ? (cycleRaw as CycleId) : undefined;

    const id = formText(form, "id") || newId("sub");
    const existing = data.subjects.find((row) => row.id === id);
    if (existing) {
      existing.name = name;
      existing.cycle = cycle;
    } else {
      data.subjects.push({ id, name, cycle });
    }
    return "/admin/matieres?ok=1";
  });
}
