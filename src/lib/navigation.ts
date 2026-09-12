import {
  LayoutDashboard,
  Mail,
  Calendar,
  Users,
  UserCheck,
  LineChart,
  CircleDollarSign,
  CalendarX,
  UserPlus2,
  Building2,
  ClipboardCheck,
  Briefcase,
  Clock,
  Award,
  User,
  FileText,
  type LucideIcon,
} from "lucide-react";
import type { AccessRole } from "@/src/lib/auth";

export type NavChild = {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
};

export type NavSingle = {
  type: "single";
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
};

export type NavGroup = {
  type: "group";
  id: string;
  label: string;
  icon: LucideIcon;
  children: NavChild[];
};

export type NavItem = NavSingle | NavGroup;

/** Admin grouped sidebar (features branch UI) + Departments */
export const ADMIN_NAV: NavItem[] = [
  { type: "single", id: "dashboard", label: "Dashboard", path: "/", icon: LayoutDashboard },
  { type: "single", id: "inbox", label: "Inbox", path: "/inbox", icon: Mail },
  { type: "single", id: "calendar", label: "Calendar", path: "/calendar", icon: Calendar },
  {
    type: "group",
    id: "workforce",
    label: "Workforce",
    icon: Briefcase,
    children: [
      { id: "employees", label: "Employees", path: "/employees", icon: Users },
      { id: "departments", label: "Departments", path: "/departments", icon: Building2 },
      { id: "recruitment", label: "Recruitment", path: "/recruitment", icon: UserPlus2 },
    ],
  },
  {
    type: "group",
    id: "time-attendance",
    label: "Time & Leave",
    icon: Clock,
    children: [
      { id: "attendance", label: "Attendance", path: "/attendance", icon: UserCheck },
      { id: "leave", label: "Leave Management", path: "/leave", icon: CalendarX },
    ],
  },
  {
    type: "group",
    id: "finance-performance",
    label: "Payroll & Review",
    icon: Award,
    children: [
      { id: "performance", label: "Performance", path: "/performance", icon: LineChart },
      { id: "payroll", label: "Payroll", path: "/payroll", icon: CircleDollarSign },
    ],
  },
];

/** Manager flat sidebar */
export const MANAGER_NAV: NavItem[] = [
  { type: "single", id: "dashboard", label: "Dashboard", path: "/", icon: LayoutDashboard },
  { type: "single", id: "my-team", label: "My Team", path: "/my-team", icon: Users },
  { type: "single", id: "attendance", label: "Attendance", path: "/attendance", icon: UserCheck },
  { type: "single", id: "leave", label: "Leave Approvals", path: "/leave", icon: ClipboardCheck },
  { type: "single", id: "performance", label: "Performance", path: "/performance", icon: LineChart },
  { type: "single", id: "calendar", label: "Calendar", path: "/calendar", icon: Calendar },
  { type: "single", id: "inbox", label: "Inbox", path: "/inbox", icon: Mail },
];

/** Employee self-service sidebar */
export const EMPLOYEE_NAV: NavItem[] = [
  { type: "single", id: "dashboard", label: "Dashboard", path: "/", icon: LayoutDashboard },
  { type: "single", id: "profile", label: "My Profile", path: "/settings/personal-info", icon: User },
  { type: "single", id: "attendance", label: "My Attendance", path: "/attendance", icon: UserCheck },
  { type: "single", id: "leave", label: "My Leave", path: "/leave", icon: CalendarX },
  { type: "single", id: "performance", label: "My Performance", path: "/performance", icon: LineChart },
  { type: "single", id: "payroll", label: "Payslips", path: "/payroll", icon: CircleDollarSign },
  { type: "single", id: "documents", label: "My Documents", path: "/settings/personal-documents", icon: FileText },
  { type: "single", id: "calendar", label: "Calendar", path: "/calendar", icon: Calendar },
  { type: "single", id: "inbox", label: "Inbox", path: "/inbox", icon: Mail },
];

export function getNavItemsForRole(role: AccessRole | null | undefined): NavItem[] {
  if (role === "admin") return ADMIN_NAV;
  if (role === "manager") return MANAGER_NAV;
  if (role === "employee") return EMPLOYEE_NAV;
  return [];
}

export function roleLabel(role: AccessRole | null | undefined): string {
  switch (role) {
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "employee":
      return "Employee";
    default:
      return "User";
  }
}
