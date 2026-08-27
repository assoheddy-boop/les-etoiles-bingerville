import { formInt, formText, withTeacherMutate } from "@/lib/admin-api";
import { staffForTeacher, upsertStaffPresence } from "@/lib/hr";
import { isLeaveType, isStaffPresenceStatus, newId } from "@/lib/school-life";

export async function POST(request: Request) {
  return withTeacherMutate(request, "/espace-enseignants/rh", (data, form, teacherId) => {
    const profile = staffForTeacher(teacherId, data);
    if (!profile) throw new Error("missing");
    const action = formText(form, "action") || "leave";

    if (action === "presence") {
      const status = formText(form, "status") || "present";
      if (!isStaffPresenceStatus(status)) throw new Error("missing");
      upsertStaffPresence(data, profile.id, status);
      return "/espace-enseignants/rh?ok=1";
    }

    if (action === "advance") {
      const amount = formInt(form, "amount");
      const reason = formText(form, "reason");
      if (!reason || !Number.isFinite(amount) || amount <= 0) throw new Error("amount");
      data.salaryAdvances.unshift({
        id: newId("adv"),
        staffId: profile.id,
        amount,
        reason,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      return "/espace-enseignants/rh?ok=1";
    }

    const type = formText(form, "type");
    const startDate = formText(form, "startDate");
    const endDate = formText(form, "endDate");
    const reason = formText(form, "reason");
    if (!isLeaveType(type) || !startDate || !endDate || !reason) throw new Error("missing");
    if (endDate < startDate) throw new Error("range");
    const overlap = data.leaveRequests.some(
      (row) =>
        row.staffId === profile.id &&
        row.status !== "refused" &&
        row.startDate <= endDate &&
        row.endDate >= startDate,
    );
    if (overlap) throw new Error("overlap");
    data.leaveRequests.unshift({
      id: newId("leave"),
      staffId: profile.id,
      teacherId,
      type,
      startDate,
      endDate,
      reason,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    return "/espace-enseignants/rh?ok=1";
  });
}
