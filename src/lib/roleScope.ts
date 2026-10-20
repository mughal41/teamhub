/**
 * Static data-scope helpers — who can see whose records in lists/KPIs.
 * Maps demo login users onto seed employee names in db.ts.
 */

import type { AccessLevel, ModuleKey, RoleId } from "./rbac";
import { getAccess } from "./rbac";

export type DataScope = "own" | "team" | "company" | "none";

export interface RoleScopeConfig {
  /** Must match a name that appears on attendance / leave / payroll / employees seed rows */
  employeeName: string;
  employeeId?: string;
  /** Juniors / team members visible to Senior & Team lead */
  teamNames: string[];
  deptHint?: string;
}

/**
 * Fixed demo mapping onto existing seed people so "own" / "team" filters work without a backend.
 */
export const ROLE_IDENTITY: Record<RoleId, RoleScopeConfig> = {
  employee: {
    employeeName: "Ethan Ray",
    employeeId: "EMP-0178",
    teamNames: [],
    deptHint: "Product Design",
  },
  senior: {
    employeeName: "Daniel Cheung",
    employeeId: "EMP-0291",
    teamNames: ["Ethan Ray", "Kelvin Yu", "Jacob Yuen"],
    deptHint: "Operations",
  },
  team_lead: {
    employeeName: "Sara Kim",
    employeeId: "EMP-0356",
    teamNames: ["Ethan Ray", "Daniel Cheung", "Kelvin Yu", "Jacob Yuen", "Mia Torres"],
    deptHint: "Customer Service",
  },
  hr_manager: {
    employeeName: "Olivia Mason",
    employeeId: "EMP-0234",
    teamNames: [],
    deptHint: "Executive Marketing",
  },
  finance_manager: {
    employeeName: "Farah Nabila",
    employeeId: "EMP-0320",
    teamNames: [],
    deptHint: "Customer Service",
  },
  system_admin: {
    employeeName: "Lina Armand",
    employeeId: "EMP-0312",
    teamNames: [],
    deptHint: "R&D",
  },
};

/** Resolve list visibility for a module based on access level + role */
export function resolveDataScope(roleId: RoleId, module: ModuleKey): DataScope {
  const level: AccessLevel = getAccess(roleId, module);
  if (level === "none") return "none";
  if (level === "own") return "own";

  // Senior / Team lead see self + juniors / team even on view|approve
  if (roleId === "senior" || roleId === "team_lead") {
    if (level === "view" || level === "approve") return "team";
  }

  // Company-wide for HR / Finance / Admin when they have view+
  return "company";
}

export function getVisibleNames(roleId: RoleId, module: ModuleKey): string[] | null {
  const scope = resolveDataScope(roleId, module);
  const identity = ROLE_IDENTITY[roleId];
  if (scope === "none") return [];
  if (scope === "own") return [identity.employeeName];
  if (scope === "team") {
    return Array.from(new Set([identity.employeeName, ...identity.teamNames]));
  }
  return null; // null = no name filter (company-wide)
}

export function matchesVisibleName(
  recordName: string | undefined | null,
  visibleNames: string[] | null
): boolean {
  if (visibleNames === null) return true;
  if (!recordName) return false;
  const n = recordName.trim().toLowerCase();
  return visibleNames.some((v) => v.toLowerCase() === n);
}

/** Filter any array of records that have a `name` field */
export function filterByRoleScope<T extends { name?: string }>(
  items: T[],
  roleId: RoleId,
  module: ModuleKey
): T[] {
  const visible = getVisibleNames(roleId, module);
  if (visible === null) return items;
  if (visible.length === 0) return [];
  return items.filter((item) => matchesVisibleName(item.name, visible));
}

export function scopeLabel(scope: DataScope): string {
  switch (scope) {
    case "own":
      return "Own data only";
    case "team":
      return "Self + team";
    case "company":
      return "Whole company";
    case "none":
      return "No access";
    default:
      return "";
  }
}
