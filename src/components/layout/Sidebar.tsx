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
  ChevronRight
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", path: "/" },
  { icon: Mail, label: "Inbox", id: "inbox", path: "/inbox", count: 10 },
  { icon: Calendar, label: "Calendar", id: "calendar", path: "/calendar" },
  { icon: Users, label: "Employees", id: "employees", path: "/employees" },
  { icon: UserCheck, label: "Attendance", id: "attendance", path: "/attendance" },
  { icon: LineChart, label: "Performance", id: "performance", path: "/performance" },
  { icon: CircleDollarSign, label: "Payroll", id: "payroll", path: "/payroll" },
  { icon: CalendarX, label: "Leave Management", id: "leave", path: "/leave" },
  { icon: UserPlus2, label: "Recruitment", id: "recruitment", path: "/recruitment" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-slate-100 bg-white lg:flex">
      <div className="flex h-20 items-center px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
              <path d="M12 3v18" />
              <path d="M4.5 7.5L12 12l7.5-4.5" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">TeamHub</span>
        </div>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all",
                isActive 
                  ? "bg-brand text-white shadow-md shadow-brand/20" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                {item.label}
              </div>
              {item.count && (
                <span className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                  isActive ? "bg-white/20 text-white" : "bg-brand text-white"
                )}>
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4">
        <div className="rounded-2xl bg-emerald-50 p-5">
          <h4 className="mb-2 text-sm font-bold text-slate-800">Level Up Your HR System</h4>
          <p className="mb-4 text-xs leading-relaxed text-slate-500">
            TeamHub Pro gives you full control with advanced modules and extended layouts
          </p>
          <Button className="w-full text-xs" variant="primary">
            Get TeamHub Pro
          </Button>
        </div>
      </div>
    </aside>
  );
}
