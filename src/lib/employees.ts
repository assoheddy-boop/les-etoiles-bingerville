import { readJsonDocument, writeJsonDocument } from "./persist";
import { hashPassword, verifyPassword } from "./password";
import type { Employee, EmployeesStore } from "./employee-types";
import { emptyEmployeesStore } from "./employee-types";
import { isEmployeeRoleId } from "./rbac";
import { newId } from "./school-life";

function hydrate(raw: unknown): EmployeesStore {
  const seed = emptyEmployeesStore();
  if (!raw || typeof raw !== "object") return seed;
  const source = raw as Partial<EmployeesStore>;
  if (!Array.isArray(source.employees)) return seed;
  const employees = source.employees.filter((row): row is Employee => {
    if (!row || typeof row !== "object") return false;
    const item = row as Partial<Employee>;
    return (
      typeof item.id === "string" &&
      typeof item.firstName === "string" &&
      typeof item.lastName === "string" &&
      typeof item.email === "string" &&
      typeof item.username === "string" &&
      typeof item.roleId === "string" &&
      isEmployeeRoleId(item.roleId) &&
      typeof item.active === "boolean" &&
      typeof item.createdAt === "string" &&
      typeof item.passwordHash === "string"
    );
  });
  return { employees };
}

export async function readEmployees(): Promise<EmployeesStore> {
  const raw = await readJsonDocument("employees");
  if (!raw) return emptyEmployeesStore();
  try {
    return hydrate(JSON.parse(raw));
  } catch {
    return emptyEmployeesStore();
  }
}

export async function writeEmployees(store: EmployeesStore) {
  await writeJsonDocument("employees", store);
}

export function employeeDisplayName(employee: Pick<Employee, "firstName" | "lastName">) {
  return `${employee.firstName} ${employee.lastName}`.trim();
}

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function findEmployeeById(store: EmployeesStore, id: string) {
  return store.employees.find((row) => row.id === id);
}

export function findEmployeeByUsername(store: EmployeesStore, username: string) {
  const key = normalizeUsername(username);
  return store.employees.find((row) => normalizeUsername(row.username) === key);
}

export function usernameTaken(store: EmployeesStore, username: string, exceptId?: string) {
  const key = normalizeUsername(username);
  return store.employees.some(
    (row) => row.id !== exceptId && normalizeUsername(row.username) === key,
  );
}

export function emailTaken(store: EmployeesStore, email: string, exceptId?: string) {
  const key = normalizeEmail(email);
  return store.employees.some((row) => row.id !== exceptId && normalizeEmail(row.email) === key);
}

export async function authenticateEmployee(username: string, password: string) {
  const store = await readEmployees();
  const employee = findEmployeeByUsername(store, username);
  if (!employee || !employee.active) return null;
  const ok = await verifyPassword(password, employee.passwordHash);
  return ok ? employee : null;
}

export function generateTempPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let body = "";
  for (let i = 0; i < 10; i += 1) {
    body += chars[Math.floor(Math.random() * chars.length)];
  }
  return `Temp${body}!`;
}

export type EmployeeInput = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  roleId: Employee["roleId"];
  phone?: string;
  poste?: string;
  password?: string;
  active?: boolean;
};

export async function createEmployee(input: EmployeeInput) {
  const store = await readEmployees();
  if (usernameTaken(store, input.username)) throw new Error("duplicate");
  if (emailTaken(store, input.email)) throw new Error("duplicate");
  if (!input.password) throw new Error("missing");
  const employee: Employee = {
    id: newId("emp"),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: normalizeEmail(input.email),
    username: normalizeUsername(input.username),
    roleId: input.roleId,
    active: input.active ?? true,
    createdAt: new Date().toISOString(),
    passwordHash: await hashPassword(input.password),
    phone: input.phone?.trim() || undefined,
    poste: input.poste?.trim() || undefined,
  };
  store.employees.unshift(employee);
  await writeEmployees(store);
  return employee;
}

export async function updateEmployee(id: string, input: Partial<EmployeeInput>) {
  const store = await readEmployees();
  const employee = findEmployeeById(store, id);
  if (!employee) throw new Error("missing");
  if (input.username && usernameTaken(store, input.username, id)) throw new Error("duplicate");
  if (input.email && emailTaken(store, input.email, id)) throw new Error("duplicate");
  if (input.firstName) employee.firstName = input.firstName.trim();
  if (input.lastName) employee.lastName = input.lastName.trim();
  if (input.email) employee.email = normalizeEmail(input.email);
  if (input.username) employee.username = normalizeUsername(input.username);
  if (input.roleId) employee.roleId = input.roleId;
  if (typeof input.active === "boolean") employee.active = input.active;
  if (input.phone !== undefined) employee.phone = input.phone.trim() || undefined;
  if (input.poste !== undefined) employee.poste = input.poste.trim() || undefined;
  if (input.password) employee.passwordHash = await hashPassword(input.password);
  await writeEmployees(store);
  return employee;
}

export async function setEmployeeActive(id: string, active: boolean) {
  return updateEmployee(id, { active });
}

export async function resetEmployeePassword(id: string) {
  const temp = generateTempPassword();
  await updateEmployee(id, { password: temp });
  return temp;
}

export function publicEmployee(employee: Employee) {
  return {
    id: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    username: employee.username,
    roleId: employee.roleId,
    active: employee.active,
    createdAt: employee.createdAt,
    phone: employee.phone,
    poste: employee.poste,
  };
}
