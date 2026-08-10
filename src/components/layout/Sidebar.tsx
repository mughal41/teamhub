import { cn } from "@/src/lib/utils";
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
  ChevronDown,
  ChevronRight,
  Briefcase,
  Clock,
  Award
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import * as React from "react";

interface NavSingle {
  type: "single";
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
}

interface NavChild {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
}

interface NavGroup {
  type: "group";
  id: string;
  label: string;
  icon: React.ElementType;
  children: NavChild[];
}

type NavItem = NavSingle | NavGroup;

const navigationConfig: NavItem[] = [
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

export function Sidebar() {
  const location = useLocation();

  // State to track open dropdown groups
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    navigationConfig.forEach((item) => {
      if (item.type === "group") {
        const isChildActive = item.children.some(
          (child) => location.pathname === child.path || (child.path !== "/" && location.pathname.startsWith(child.path))
        );
        initialState[item.id] = isChildActive; // Auto expand if active page is inside group
      }
    });
    return initialState;
  });

  // Auto-expand group when location changes if not already expanded
  React.useEffect(() => {
    navigationConfig.forEach((item) => {
      if (item.type === "group") {
        const isChildActive = item.children.some(
          (child) => location.pathname === child.path || (child.path !== "/" && location.pathname.startsWith(child.path))
        );
        if (isChildActive) {
          setOpenGroups((prev) => ({ ...prev, [item.id]: true }));
        }
      }
    });
  }, [location.pathname]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-slate-100 bg-white lg:flex justify-between z-40">
      <div className="overflow-y-auto">
        <div className="flex h-20 items-center px-8">
          <div className="flex items-center gap-2">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#28C2A9] shrink-0"
            >
              <path d="M12 12C12 7 8 3 4 4C3 8 7 12 12 12Z" fill="currentColor" />
              <path d="M12 12C17 12 21 8 20 4C16 3 12 7 12 12Z" fill="currentColor" />
              <path d="M12 12C12 17 16 21 20 20C21 16 17 12 12 12Z" fill="currentColor" />
              <path d="M12 12C7 12 3 16 4 20C8 21 12 17 12 12Z" fill="currentColor" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-[#0E4D41]">TeamHub</span>
          </div>
        </div>

        <div className="space-y-1 px-4 py-2">
          {navigationConfig.map((item) => {
            if (item.type === "single") {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#28C2A9] text-white shadow-sm font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"
                      )}
                    />
                    {item.label}
                  </div>
                </Link>
              );
            }

            const isGroupOpen = !!openGroups[item.id];
            const isAnyChildActive = item.children.some(
              (child) =>
                location.pathname === child.path ||
                (child.path !== "/" && location.pathname.startsWith(child.path))
            );

            return (
              <div key={item.id} className="space-y-1">
                {/* Collapsible Dropdown Header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(item.id)}
                  className={cn(
                    "w-full group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all select-none",
                    isAnyChildActive
                      ? "text-[#0E4D41] bg-slate-50 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isAnyChildActive ? "text-[#28C2A9]" : "text-slate-400 group-hover:text-slate-900"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isGroupOpen ? (
                    <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-200" />
                  )}
                </button>

                {/* Submenu Dropdown Items */}
                {isGroupOpen && (
                  <div className="pl-6 space-y-1 border-l-2 border-slate-100 ml-5 py-1">
                    {item.children.map((child) => {
                      const isChildActive =
                        location.pathname === child.path ||
                        (child.path !== "/" && location.pathname.startsWith(child.path));
                      return (
                        <Link
                          key={child.id}
                          to={child.path}
                          className={cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all",
                            isChildActive
                              ? "bg-[#28C2A9] text-white shadow-xs font-bold"
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                          )}
                        >
                          <child.icon
                            className={cn(
                              "h-4 w-4 transition-colors",
                              isChildActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"
                            )}
                          />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 mb-4">
        <div className="rounded-[16px] bg-[#E4F2D3] p-5">
          <h4 className="mb-2 text-sm font-bold text-[#0E4D41]">Level Up Your HR System</h4>
          <p className="mb-4 text-xs leading-relaxed text-[#4a5754]">
            TeamHub Pro gives you full control with advanced modules and extended layouts
          </p>
          <Link
            to="#"
            className="flex h-9 w-full items-center justify-center rounded-lg bg-[#28C2A9] hover:bg-[#209f8a] text-xs font-bold text-white transition-colors"
          >
            Get TeamHub Pro
          </Link>
        </div>
      </div>
    </aside>
  );
}
