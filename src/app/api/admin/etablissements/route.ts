import { formText, withAdminMutate } from "@/lib/admin-api";
import { campusFromEstablishment } from "@/lib/establishments";
import { CYCLES, type CycleId } from "@/lib/school-life-types";

function asCycle(value: string): CycleId {
  if (CYCLES.includes(value as CycleId)) return value as CycleId;
  throw new Error("data");
}

export async function POST(request: Request) {
  return withAdminMutate(request, "/admin/etablissements", (data, form) => {
    const id = formText(form, "id");
    const name = formText(form, "name");
    const shortName = formText(form, "shortName");
    if (!id || !name || !shortName) throw new Error("data");
    const existing = data.establishments.find((row) => row.id === id);
    if (!existing) throw new Error("not_found");
    existing.name = name;
    existing.shortName = shortName;
    existing.cycle = asCycle(formText(form, "cycle") || existing.cycle);
    existing.campus = formText(form, "campus") || existing.campus;
    existing.menDecision = formText(form, "menDecision") || undefined;
    existing.menDate = formText(form, "menDate") || undefined;
    existing.address = formText(form, "address") || existing.address;
    existing.phone = formText(form, "phone") || undefined;
    const campusLabel = campusFromEstablishment(existing);
    for (const klass of data.classes) {
      if (klass.establishmentId === existing.id) klass.campus = campusLabel;
    }
    for (const profile of data.staffProfiles) {
      if (profile.establishmentId === existing.id) profile.campus = campusLabel;
    }
    return "/admin/etablissements?ok=1";
  });
}
