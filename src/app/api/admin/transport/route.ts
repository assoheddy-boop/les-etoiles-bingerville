import { formList, formText, withAdminMutate } from "@/lib/admin-api";
import { addTransportLog, isTransportEvent, newId, parseStops } from "@/lib/school-life";

export async function POST(request: Request) {
  return withAdminMutate(request, "/admin/transport", (data, form) => {
    const action = formText(form, "action") || "save";
    if (action === "log") {
      const studentId = formText(form, "studentId");
      const event = formText(form, "event");
      if (!studentId || !isTransportEvent(event)) throw new Error("missing");
      addTransportLog(data, { studentId, event, recordedBy: "school:secretariat" });
      return "/admin/transport?ok=1";
    }
    if (action === "delete") {
      const id = formText(form, "id");
      data.busLines = data.busLines.filter((row) => row.id !== id);
      return "/admin/transport?ok=1";
    }
    const name = formText(form, "name");
    const driverName = formText(form, "driverName");
    const plate = formText(form, "plate");
    const note = formText(form, "note");
    const stops = parseStops(formText(form, "stops"));
    const studentIds = formList(form, "studentIds").filter((id) => data.students.some((row) => row.id === id));
    if (!name || !driverName) throw new Error("missing");

    const id = formText(form, "id") || newId("bus");
    const existing = data.busLines.find((row) => row.id === id);
    const payload = { id, name, driverName, plate, note: note || undefined, stops, studentIds };
    if (existing) {
      Object.assign(existing, payload);
    } else {
      data.busLines.push(payload);
    }
    return "/admin/transport?ok=1";
  });
}
