/**
 * Static Role-Based Access Control matrix (frontend-only).
 * Access levels match the TeamHub permission matrix screenshot.
 */

export type AccessLevel = "full" | "approve" | "view" | "own" | "none";

export type ModuleKey =
  | "profile"
  | "attendance"
  | "leave"
  | "timesheet"
  | "payroll"
  | "employees"
  | "reports"
  | "roles"
  | "delete";

export type RoleId =
  | "employee"
  | "senior"
  | "team_lead"
  | "hr_manager"
  | "finance_manager"
  | "system_admin";

export type RolePermissions = Record<ModuleKey, AccessLevel>;

export interface RoleDefinition {
  id: RoleId;
  label: string;
  scope: string;
  notes: string[];
  permissions: RolePermissions;
}

export const ACCESS_LEVEL_META: Record<
  AccessLevel,
  { label: string; color: string; bg: string }
> = {
  full: { label: "Full manage", color: "#15803d", bg: "#dcfce7" },
  approve: { label: "Approve", color: "#1d4ed8", bg: "#dbeafe" },
  view: { label: "View only", color: "#c2410c", bg: "#ffedd5" },
  own: { label: "Own data", color: "#475569", bg: "#f1f5f9" },
  none: { label: "No access", color: "#b91c1c", bg: "#fee2e2" },
};

export const MODULE_LABELS: Record<ModuleKey, string> = {
  profile: "Profile",
  attendance: "Punch / attendance",
  leave: "Leave",
  timesheet: "Timesheet",
  payroll: "Payroll / salary",
  employees: "Employee records",
  reports: "Reports",
  roles: "Roles and settings",
  delete: "Delete / archive",
};

/** Static permission matrix — exact mapping from the product screenshot */
export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: "employee",
    label: "Employee",
    scope: "Self only",
    notes: [
      "Edit own basic info",
      "Punch, request correction",
      "Apply leave",
      "Submit timesheet",
      "Own payslip only",
    ],
    permissions: {
      profile: "own",
      attendance: "own",
      leave: "own",
      timesheet: "own",
      payroll: "own",
      employees: "none",
      reports: "none",
      roles: "none",
      delete: "none",
    },
  },
  {
    id: "senior",
    label: "Senior",
    scope: "Self + juniors",
    notes: [
      "Timesheet first-level approve",
      "Can view juniors' leave / punch",
      "Final approve belongs to the lead",
    ],
    permissions: {
      profile: "own",
      attendance: "view",
      leave: "view",
      timesheet: "approve",
      payroll: "none",
      employees: "view",
      reports: "view",
      roles: "none",
      delete: "none",
    },
  },
  {
    id: "team_lead",
    label: "Team lead",
    scope: "Own team",
    notes: [
      "Punch requests approve",
      "Leave approve",
      "Timesheet approve",
      "Team reports",
    ],
    permissions: {
      profile: "own",
      attendance: "approve",
      leave: "approve",
      timesheet: "approve",
      payroll: "none",
      employees: "view",
      reports: "view",
      roles: "none",
      delete: "none",
    },
  },
  {
    id: "hr_manager",
    label: "HR manager",
    scope: "Whole company",
    notes: [
      "Onboarding / offboarding",
      "Leave policy, holidays",
      "Attendance corrections",
      "Salary view only",
    ],
    permissions: {
      profile: "full",
      attendance: "full",
      leave: "full",
      timesheet: "view",
      payroll: "view",
      employees: "full",
      reports: "full",
      roles: "none",
      delete: "none",
    },
  },
  {
    id: "finance_manager",
    label: "Finance manager",
    scope: "Whole company",
    notes: [
      "Payroll process, run",
      "Deductions, bonuses",
      "Attendance / leave view for payroll",
      "No delete",
    ],
    permissions: {
      profile: "view",
      attendance: "view",
      leave: "view",
      timesheet: "view",
      payroll: "full",
      employees: "view",
      reports: "full",
      roles: "none",
      delete: "none",
    },
  },
  {
    id: "system_admin",
    label: "System admin",
    scope: "Whole system",
    notes: [
      "Roles assign",
      "Settings, audit logs",
      "Archive users",
      "No salary data",
    ],
    permissions: {
      profile: "view",
      attendance: "none",
      leave: "none",
      timesheet: "none",
      payroll: "none",
      employees: "view",
      reports: "view",
      roles: "full",
      delete: "full",
    },
  },
];

export const ROLE_MAP: Record<RoleId, RoleDefinition> = Object.fromEntries(
  ROLE_DEFINITIONS.map((r) => [r.id, r])
) as Record<RoleId, RoleDefinition>;

const ACCESS_RANK: Record<AccessLevel, number> = {
  none: 0,
  own: 1,
  view: 2,
  approve: 3,
  full: 4,
};

export function getRole(roleId: RoleId): RoleDefinition {
  return ROLE_MAP[roleId];
}

export function getAccess(roleId: RoleId, module: ModuleKey): AccessLevel {
  return ROLE_MAP[roleId]?.permissions[module] ?? "none";
}

/** True if role has at least the required access level on a module */
export function can(
  roleId: RoleId,
  module: ModuleKey,
  minLevel: AccessLevel = "view"
): boolean {
  return ACCESS_RANK[getAccess(roleId, module)] >= ACCESS_RANK[minLevel];
}

export function canView(roleId: RoleId, module: ModuleKey): boolean {
  return getAccess(roleId, module) !== "none";
}

export function canApprove(roleId: RoleId, module: ModuleKey): boolean {
  return can(roleId, module, "approve");
}

export function canManage(roleId: RoleId, module: ModuleKey): boolean {
  return getAccess(roleId, module) === "full";
}

export function isOwnOnly(roleId: RoleId, module: ModuleKey): boolean {
  return getAccess(roleId, module) === "own";
}

/** Sidebar / route module keys used for nav filtering */
export type NavModule =
  | "dashboard"
  | "inbox"
  | "calendar"
  | "employees"
  | "attendance"
  | "performance"
  | "payroll"
  | "leave"
  | "recruitment";

/**
 * Which nav items each role can see.
 * Derived from the matrix (static — no backend).
 */
export function canAccessNav(roleId: RoleId, nav: NavModule): boolean {
  switch (nav) {
    case "dashboard":
    case "inbox":
    case "calendar":
      return true;
    case "employees":
      return canView(roleId, "employees");
    case "attendance":
      return canView(roleId, "attendance");
    case "performance":
      // Performance reviews tied to employee visibility / team oversight
      return canView(roleId, "employees") || canView(roleId, "reports");
    case "payroll":
      return canView(roleId, "payroll");
    case "leave":
      return canView(roleId, "leave");
    case "recruitment":
      // Only HR manages hiring in this static matrix
      return roleId === "hr_manager";
    default:
      return false;
  }
}

/** Path → minimum module access for route guards */
export const ROUTE_ACCESS: { pattern: RegExp; module: ModuleKey | null; nav?: NavModule }[] = [
  { pattern: /^\/$/, module: null, nav: "dashboard" },
  { pattern: /^\/inbox/, module: null, nav: "inbox" },
  { pattern: /^\/calendar/, module: null, nav: "calendar" },
  { pattern: /^\/employees/, module: "employees", nav: "employees" },
  { pattern: /^\/attendance/, module: "attendance", nav: "attendance" },
  { pattern: /^\/performance/, module: "employees", nav: "performance" },
  { pattern: /^\/payroll/, module: "payroll", nav: "payroll" },
  { pattern: /^\/leave/, module: "leave", nav: "leave" },
  { pattern: /^\/recruitment/, module: "employees", nav: "recruitment" },
  { pattern: /^\/settings\/roles/, module: "roles" },
  { pattern: /^\/settings\/organization/, module: "roles" },
  { pattern: /^\/settings\/billing/, module: "roles" },
  { pattern: /^\/settings\//, module: "profile" },
  { pattern: /^\/notifications/, module: null },
];

export function canAccessPath(roleId: RoleId, pathname: string): boolean {
  const match = ROUTE_ACCESS.find((r) => r.pattern.test(pathname));
  if (!match) return true;

  if (match.nav && !canAccessNav(roleId, match.nav)) return false;
  if (match.module && !canView(roleId, match.module)) return false;

  // Recruitment is HR-only even though module is employees
  if (match.nav === "recruitment" && !canAccessNav(roleId, "recruitment")) {
    return false;
  }

  return true;
}
