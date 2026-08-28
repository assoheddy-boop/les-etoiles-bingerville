import type { EmployeeRoleId } from "./rbac";

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  roleId: EmployeeRoleId;
  active: boolean;
  createdAt: string;
  passwordHash: string;
  phone?: string;
  poste?: string;
};

export type EmployeesStore = {
  employees: Employee[];
};

export function emptyEmployeesStore(): EmployeesStore {
  return { employees: [] };
}
