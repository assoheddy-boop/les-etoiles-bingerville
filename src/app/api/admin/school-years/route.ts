import { withAdminMutate, formText } from "@/lib/admin-api";
import { newId } from "@/lib/school-life";

export async function POST(request: Request) {
  return withAdminMutate(request, "/admin/annee-scolaire", (data, form) => {
    const action = formText(form, "action") || "create";
    if (action === "select") {
      const id = formText(form, "id");
      const year = data.schoolYears.find((row) => row.id === id);
      if (!year) throw new Error("missing");
      data.currentSchoolYearId = id;
      data.schoolYears = data.schoolYears.map((row) => ({ ...row, current: row.id === id }));
      return "/admin/annee?ok=1";
    }
    if (action === "delete") {
      const id = formText(form, "id");
      if (data.classes.some((row) => row.schoolYearId === id)) throw new Error("in-use");
      if (data.schoolYears.length <= 1) throw new Error("in-use");
      data.schoolYears = data.schoolYears.filter((row) => row.id !== id);
      if (data.currentSchoolYearId === id) {
        data.schoolYears[0].current = true;
        data.currentSchoolYearId = data.schoolYears[0].id;
      }
      return "/admin/annee?ok=1";
    }
    const label = formText(form, "label");
    const startDate = formText(form, "startDate");
    const endDate = formText(form, "endDate");
    if (!label || !startDate || !endDate) throw new Error("missing");
    const id = formText(form, "id") || newId("sy");
    const existing = data.schoolYears.find((row) => row.id === id);
    if (existing) {
      existing.label = label;
      existing.startDate = startDate;
      existing.endDate = endDate;
    } else {
      data.schoolYears.push({
        id,
        label,
        startDate,
        endDate,
        current: data.schoolYears.length === 0,
      });
      if (data.schoolYears.length === 1) data.currentSchoolYearId = id;
    }
    return "/admin/annee?ok=1";
  });
}
