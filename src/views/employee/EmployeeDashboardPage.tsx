import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import {
  getAttendanceForUser,
  getLeavesForUser,
  getPayrollForUser,
} from "@/src/lib/permissions";
import { getCollection, type Employee } from "@/src/lib/db";
import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  CalendarX,
  LineChart,
  CircleDollarSign,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Megaphone,
  UserRound,
} from "lucide-react";

const ANNOUNCEMENTS = [
  {
    title: "Office closed — Labor Day",
    body: "HQ will be closed Monday. Hybrid staff can work remotely if needed.",
    date: "2 days ago",
  },
  {
    title: "Q3 performance reviews open",
    body: "Complete your self-assessment before the 20th so your manager can finalize scores.",
    date: "5 days ago",
  },
  {
    title: "Updated leave policy",
    body: "Personal leave now accrues monthly. Check My Leave for your updated balance.",
    date: "1 week ago",
  },
];

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const attendance = getAttendanceForUser(user);
  const leaves = getLeavesForUser(user);
  const payslips = getPayrollForUser(user);
  const employees = getCollection<Employee[]>("db_employees", []);
  const me = employees.find((e) => e.id === user?.employeeId);
  const manager = employees.find((e) => e.id === me?.managerId);
  const firstName = user?.name?.split(" ")[0] || "there";

  const today = attendance[0];
  const pendingLeaves = leaves.filter((l) => l.status === "Pending").length;
  const approvedLeaves = leaves.filter((l) => l.status === "Approved").length;
  const latestPay = payslips[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <AppLayout title="Dashboard" breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="w-full space-y-6">
        <div className="rounded-2xl border border-[#E4E4E1] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="text-2xl font-bold text-slate-900">
            Hello {firstName}! {greeting}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your personal workspace — attendance, leave, performance, and payslips in one place.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            onClick={() => navigate("/attendance")}
            className="rounded-2xl bg-[#28C2A9] p-5 text-left text-white transition hover:bg-[#209f8a]"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <UserCheck className="h-5 w-5" />
            </div>
            <p className="text-sm text-white/80">Today&apos;s status</p>
            <p className="mt-1 text-2xl font-bold">{today?.status || "Not logged"}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-white/90">
              <Clock className="h-3.5 w-3.5" />
              {today ? `${today.in} – ${today.out}` : "No clock record yet"}
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/leave")}
            className="rounded-2xl border border-[#E4E4E1] bg-white p-5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F2D3] text-[#0E4D41]">
              <CalendarX className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-500">Leave requests</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{pendingLeaves}</p>
            <p className="mt-2 text-xs font-semibold text-[#28C2A9]">{approvedLeaves} approved</p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/performance")}
            className="rounded-2xl border border-[#E4E4E1] bg-white p-5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F3F0] text-slate-700">
              <LineChart className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-500">Performance</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">4.2</p>
            <p className="mt-2 text-xs text-slate-500">Latest review score</p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/payroll")}
            className="rounded-2xl border border-[#E4E4E1] bg-white p-5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F3F0] text-slate-700">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-500">Latest payslip</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{latestPay?.total || "—"}</p>
            <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#28C2A9]">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {latestPay?.status || "No payslip yet"}
            </p>
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Quick actions</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Apply for leave", path: "/leave" },
                { label: "View attendance", path: "/attendance" },
                { label: "Open calendar", path: "/calendar" },
                { label: "Check inbox", path: "/inbox" },
                { label: "Update profile", path: "/settings/personal-info" },
                { label: "My documents", path: "/settings/personal-documents" },
              ].map((action) => (
                <button
                  key={action.path + action.label}
                  type="button"
                  onClick={() => navigate(action.path)}
                  className="rounded-xl border border-[#E4E4E1] bg-[#F3F3F0] px-4 py-3 text-left text-sm font-semibold text-slate-800 hover:border-[#28C2A9]"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h3 className="mb-4 font-bold text-slate-900">Recent leave activity</h3>
            {leaves.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No leave history yet</p>
            ) : (
              <div className="space-y-3">
                {leaves.slice(0, 4).map((leave) => (
                  <div
                    key={`${leave.id}-${leave.submit}-${leave.type}`}
                    className="flex items-center justify-between rounded-xl border border-[#E4E4E1] p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{leave.type}</p>
                      <p className="text-xs text-slate-500">
                        {leave.period} · {leave.duration}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        leave.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : leave.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="mb-4 flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-[#28C2A9]" />
              <h3 className="font-bold text-slate-900">Company announcements</h3>
            </div>
            <div className="space-y-3">
              {ANNOUNCEMENTS.map((item) => (
                <div key={item.title} className="rounded-xl border border-[#E4E4E1] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <span className="shrink-0 text-[10px] font-medium text-slate-400">{item.date}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E4E4E1] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="mb-4 flex items-center gap-2">
                <UserRound className="h-4 w-4 text-[#28C2A9]" />
                <h3 className="font-bold text-slate-900">Your manager</h3>
              </div>
              {manager ? (
                <div className="flex items-center gap-3">
                  <img
                    src={manager.avatar}
                    alt={manager.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{manager.name}</p>
                    <p className="text-sm text-slate-500">
                      {manager.role} · {manager.dept}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400">No manager assigned yet.</p>
              )}
              <p className="mt-3 text-xs text-slate-500">
                Leave and attendance corrections go to your manager first.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F2D3] text-[#0E4D41]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Profile tip</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Keep your phone number and documents updated so HR can process leave and payroll without delays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
