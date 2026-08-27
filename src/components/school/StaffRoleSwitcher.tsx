import type { StaffRole } from "@/lib/school-life-types";
import { staffRoleLabels } from "@/lib/teacher-control";

export function StaffRoleSwitcher({ current }: { current: StaffRole }) {
  return (
    <form
      action="/api/auth/admin/role"
      method="post"
      className="flex flex-wrap items-center gap-2 border-b border-line bg-paper-2 px-4 py-2 md:px-6"
    >
      <p className="text-xs text-muted">Prévisualiser un rôle direction</p>
      <label className="sr-only" htmlFor="staff-role">
        Rôle
      </label>
      <select
        id="staff-role"
        name="staffRole"
        defaultValue={current}
        className="min-h-10 rounded-full border border-line bg-white px-3 text-sm"
      >
        {(Object.keys(staffRoleLabels) as StaffRole[]).map((role) => (
          <option key={role} value={role}>
            {staffRoleLabels[role]}
          </option>
        ))}
      </select>
      <button className="min-h-10 rounded-full border border-line bg-white px-4 text-sm font-semibold hover:bg-paper">
        Appliquer
      </button>
    </form>
  );
}
