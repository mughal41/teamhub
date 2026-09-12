import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import {
  getAttendanceForUser,
  getEmployeesForUser,
  getLeavesForUser,
} from "@/src/lib/permissions";
import { getCollection } from "@/src/lib/db";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  ClipboardCheck,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { cn } from "@/src/lib/utils";

export default function ManagerDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    void (async () => {
      try {
        const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
        await syncCollectionsFromApi();
      } catch {
        // keep cached
      }
      setTick((n) => n + 1);
    })();
    const onUpdate = () => setTick((n) => n + 1);
    window.addEventListener("db_updated", onUpdate);
    return () => window.removeEventListener("db_updated", onUpdate);
  }, []);

  const team = React.useMemo(() => getEmployeesForUser(user), [user, tick]);
  const attendance = React.useMemo(() => getAttendanceForUser(user), [user, tick]);
  const leaves = React.useMemo(() => getLeavesForUser(user), [user, tick]);
  const reviews = React.useMemo(
    () => getCollection<any[]>("db_manager_reviews", []),
    [tick]
  );
  const firstName = user?.name?.split(" ")[0] || "Manager";

  const pendingLeaves = leaves.filter((l) => l.status === "Pending");
  const present = attendance.filter((a) => a.status === "On-Time" || a.status === "Late").length;
  const late = attendance.filter((a) => a.status === "Late").length;
  const attendancePct = team.length
    ? Math.round((present / Math.max(team.length, 1)) * 100)
    : 0;

  const teamReviewAvgs = reviews
    .filter((r) => team.some((t) => t.id === r.employeeId))
    .map((r) => {
      if (r.average != null) return Number(r.average) * 20;
      const a =
        (Number(r.reliability || 0) +
          Number(r.punctuality || 0) +
          Number(r.taskCompletion || 0) +
          Number(r.behavior || 0)) /
        4;
      return a * 20;
    });
  const avgPerf = teamReviewAvgs.length
    ? Math.round(teamReviewAvgs.reduce((s, n) => s + n, 0) / teamReviewAvgs.length)
    : 0;

  const perfTrend = React.useMemo(() => {
    const base = avgPerf || 80;
    return [
      { name: "Jan", value: Math.max(60, base - 12) },
      { name: "Feb", value: Math.max(60, base - 8) },
      { name: "Mar", value: Math.max(60, base - 10) },
      { name: "Apr", value: Math.max(60, base - 4) },
      { name: "May", value: Math.max(60, base - 2) },
      { name: "Jun", value: base },
    ];
  }, [avgPerf]);

  const weekAttendance = React.useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    return days.map((day, idx) => {
      const slice = attendance.filter((_, i) => i % 5 === idx);
      return {
        day,
        present: slice.filter((a) => a.status === "On-Time").length || (idx % 2 === 0 ? present : Math.max(present - 1, 0)),
        late: slice.filter((a) => a.status === "Late").length || (idx === 1 || idx === 3 ? late : 0),
      };
    });
  }, [attendance, present, late]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <AppLayout title="Dashboard" breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Hello {firstName}! {greeting}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Team overview for your direct reports — scoped to your management line only.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            onClick={() => navigate("/my-team")}
            className="rounded-2xl bg-[#28C2A9] p-5 text-left text-white transition hover:bg-[#209f8a]"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-sm text-white/80">My Team</p>
            <p className="mt-1 text-3xl font-bold">{team.length}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-white/90">
              <ArrowUpRight className="h-3.5 w-3.5" /> Direct reports
            </p>
          </button>

          <div className="admin-panel p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F2D3] text-[#0E4D41]">
              <UserCheck className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-500">Team Attendance</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{attendancePct}%</p>
            <p className="mt-2 text-xs text-slate-400">
              {present} present · {late} late
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/leave")}
            className="admin-panel p-5 text-left transition hover:border-[#28C2A9]/40"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-500">Pending Approvals</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{pendingLeaves.length}</p>
            <p className="mt-2 text-xs text-amber-600 font-medium">Leave requests waiting</p>
          </button>

          <div className="admin-panel p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-500">Team Performance</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{avgPerf || "—"}{avgPerf ? "%" : ""}</p>
            <p className="mt-2 text-xs text-emerald-600 font-medium">
              {reviews.length} review{reviews.length === 1 ? "" : "s"} on file
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-5">
          <div className="xl:col-span-3 admin-panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Team Performance Trend</h3>
              <span className="text-xs font-semibold text-slate-400">Last 6 months</span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={perfTrend}>
                  <defs>
                    <linearGradient id="mgrPerf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#28C2A9" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#28C2A9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#28C2A9" fill="url(#mgrPerf)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="xl:col-span-2 admin-panel p-6">
            <h3 className="mb-4 font-bold text-slate-900">This Week Attendance</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekAttendance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="present" stackId="a" fill="#28C2A9" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="late" stackId="a" fill="#0E4D41" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="admin-panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Pending Leave Approvals</h3>
              <button
                type="button"
                onClick={() => navigate("/leave")}
                className="text-xs font-bold text-[#28C2A9] hover:underline"
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {pendingLeaves.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">No pending leave requests</p>
              ) : (
                pendingLeaves.slice(0, 4).map((leave) => (
                  <div
                    key={leave.leaveId ?? `${leave.id}-${leave.startDate}`}
                    className="flex items-center gap-3 rounded-xl border border-line bg-slate-50/50 p-3"
                  >
                    <img src={leave.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{leave.name}</p>
                      <p className="truncate text-xs text-slate-500">
                        {leave.type} · {leave.period}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                      Pending
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="admin-panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Team Attendance Today</h3>
              <button
                type="button"
                onClick={() => navigate("/attendance")}
                className="text-xs font-bold text-[#28C2A9] hover:underline"
              >
                View all
              </button>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigate("/manager/calendar")}
                className="rounded-xl border border-line bg-[#F3F3F0] px-3 py-2.5 text-left text-xs font-bold text-slate-800 hover:border-[#28C2A9]"
              >
                Open calendar
              </button>
              <button
                type="button"
                onClick={() => navigate("/manager/inbox")}
                className="rounded-xl border border-line bg-[#F3F3F0] px-3 py-2.5 text-left text-xs font-bold text-slate-800 hover:border-[#28C2A9]"
              >
                Open inbox
              </button>
            </div>
            <div className="space-y-3">
              {attendance.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">No attendance records yet</p>
              ) : (
                attendance.slice(0, 5).map((rec) => (
                  <div
                    key={rec.recordId ?? `${rec.id}-${rec.date}`}
                    className="flex items-center gap-3 rounded-xl border border-line p-3"
                  >
                    <img src={rec.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{rec.name}</p>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {rec.in} – {rec.out}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold",
                        rec.status === "On-Time" && "bg-emerald-50 text-emerald-700",
                        rec.status === "Late" && "bg-[#E4F2D3] text-[#0E4D41]",
                        rec.status === "Absent" && "bg-slate-800 text-white",
                        rec.status === "On Leave" && "bg-slate-100 text-slate-600"
                      )}
                    >
                      {rec.status === "On-Time" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : rec.status === "Late" ? (
                        <AlertCircle className="h-3 w-3" />
                      ) : null}
                      {rec.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
