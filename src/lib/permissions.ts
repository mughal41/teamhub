import type { PublicAuthUser } from "@/src/lib/auth";
import {
  getCollection,
  type AttendanceRecord,
  type Employee,
  type LeaveActivityItem,
  type PayrollItem,
} from "@/src/lib/db";

export function getTeamMemberIds(managerEmployeeId: string): string[] {
  const employees = getCollection<Employee[]>("db_employees", []);
  return employees
    .filter((e) => e.managerId === managerEmployeeId)
    .map((e) => e.id);
}

export function getEmployeesForUser(user: PublicAuthUser | null): Employee[] {
  const all = getCollection<Employee[]>("db_employees", []);
  if (!user) return [];
  if (user.accessRole === "admin") return all;
  if (user.accessRole === "manager") {
    return all.filter((e) => e.managerId === user.employeeId);
  }
  return all.filter((e) => e.id === user.employeeId);
}

export function getAttendanceForUser(user: PublicAuthUser | null): AttendanceRecord[] {
  const all = getCollection<AttendanceRecord[]>("db_attendance", []);
  if (!user) return [];
  if (user.accessRole === "admin") return all;
  if (user.accessRole === "manager") {
    const teamIds = new Set(getTeamMemberIds(user.employeeId));
    return all.filter((r) => teamIds.has(r.id));
  }
  return all.filter((r) => r.id === user.employeeId);
}

export function getLeavesForUser(user: PublicAuthUser | null): LeaveActivityItem[] {
  const all = getCollection<LeaveActivityItem[]>("db_leaves", []);
  if (!user) return [];
  if (user.accessRole === "admin") return all;
  if (user.accessRole === "manager") {
    const teamIds = new Set(getTeamMemberIds(user.employeeId));
    return all.filter((r) => teamIds.has(r.id));
  }
  return all.filter((r) => r.id === user.employeeId);
}

export function getPayrollForUser(user: PublicAuthUser | null): PayrollItem[] {
  const all = getCollection<PayrollItem[]>("db_payroll", []);
  if (!user) return [];
  if (user.accessRole === "admin") return all;
  if (user.accessRole === "employee") {
    return all.filter((r) => r.id === user.employeeId);
  }
  return [];
}

export function canAccessPayroll(user: PublicAuthUser | null): boolean {
  return user?.accessRole === "admin" || user?.accessRole === "employee";
}

export function canManageEmployees(user: PublicAuthUser | null): boolean {
  return user?.accessRole === "admin";
}
