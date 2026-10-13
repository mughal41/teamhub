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
  UserPlus2
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import * as React from "react";

import { TeamHubIcon } from "../ui/TeamHubLogo";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", path: "/" },
  { icon: Mail, label: "Inbox", id: "inbox", path: "/inbox" },
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
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-slate-100 bg-white lg:flex justify-between">
      <div>
        <div className="flex h-20 items-center px-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <TeamHubIcon size={30} color="#35BFA3" className="shrink-0 transition-transform group-hover:scale-105" />
            <span className="text-xl font-bold tracking-tight text-[#0E4D41] font-['DM_Sans',sans-serif]">TeamHub</span>
          </Link>
        </div>

        <div className="space-y-1 px-4 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  isActive 
                    ? "bg-[#28C2A9] text-white shadow-sm" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                  {item.label}
                </div>
              </Link>
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
