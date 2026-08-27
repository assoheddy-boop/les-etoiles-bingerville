import { formText, withAdminMutate } from "@/lib/admin-api";
import { addHealthIncident, isHealthKind, todayISO } from "@/lib/school-life";

export async function POST(request: Request) {
  return withAdminMutate(request, "/admin/sante", (data, form) => {
    const studentId = formText(form, "studentId");
    const kind = formText(form, "kind");
    const note = formText(form, "note");
    if (!studentId || !isHealthKind(kind) || !note) throw new Error("missing");
    addHealthIncident(data, {
      studentId,
      kind,
      note,
      date: todayISO(),
      recordedBy: "school:secretariat",
    });
    return "/admin/sante?ok=1";
  });
}
