import type { ActivityLog, SchoolLifeData } from "./school-life-types";

export function appendActivityLog(
  data: SchoolLifeData,
  input: Omit<ActivityLog, "id" | "at"> & { id?: string; at?: string },
) {
  if (!Array.isArray(data.activityLogs)) data.activityLogs = [];
  data.activityLogs.unshift({
    id: input.id ?? `log-${crypto.randomUUID().slice(0, 8)}`,
    at: input.at ?? new Date().toISOString(),
    actorId: input.actorId,
    actorRole: input.actorRole,
    action: input.action,
    payload: input.payload ?? {},
  });
}
