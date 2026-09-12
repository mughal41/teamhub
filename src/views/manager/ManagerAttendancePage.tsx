import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { getAttendanceForUser, getEmployeesForUser } from "@/src/lib/permissions";
import { Search, UserCheck } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function ManagerAttendancePage() {
  const { user } = useAuth();
  const team = getEmployeesForUser(user);
  const records = getAttendanceForUser(user);
  const [search, setSearch] = React.useState("");

  const filtered = records.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
  );

  const present = records.filter((r) => r.status === "On-Time").length;
  const late = records.filter((r) => r.status === "Late").length;
  const onLeave = records.filter((r) => r.status === "On Leave").length;
  const absent = records.filter((r) => r.status === "Absent").length;

  return (
    <AppLayout
      title="Attendance"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Attendance" }]}
    >
      <div className="space-y-6">
        <p className="text-sm text-slate-500">
          Attendance for your team only ({team.length} direct reports).
        </p>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-[#E4F2D3] p-5">
            <p className="text-sm font-medium text-[#0E4D41]/80">On Time</p>
            <p className="mt-1 text-3xl font-bold text-[#0E4D41]">{present}</p>
          </div>
          <div className="rounded-2xl bg-[#28C2A9] p-5 text-white">
            <p className="text-sm text-white/80">Late</p>
            <p className="mt-1 text-3xl font-bold">{late}</p>
          </div>
          <div className="rounded-2xl bg-[#0E4D41] p-5 text-white">
            <p className="text-sm text-white/80">Absent</p>
            <p className="mt-1 text-3xl font-bold">{absent}</p>
          </div>
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm text-slate-500">On Leave</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{onLeave}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-[#28C2A9]" />
              <h2 className="text-lg font-bold text-slate-900">Team Attendance Log</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee..."
                className="h-10 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-[#28C2A9] sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left bg-white">
              <thead>
                <tr className="border-b border-[#E4E4E1] text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Work Mode</th>
                  <th className="pb-3 pr-4">Check-in / Out</th>
                  <th className="pb-3 pr-4">Duration</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-slate-400">
                      No team attendance records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((rec) => (
                    <tr key={rec.id} className="border-b border-slate-50">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <img src={rec.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{rec.name}</p>
                            <p className="text-xs text-slate-400">{rec.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-sm text-slate-600">{rec.date}</td>
                      <td className="py-4 pr-4 text-sm text-slate-600">{rec.model}</td>
                      <td className="py-4 pr-4 text-sm text-slate-600">
                        {rec.in} – {rec.out}
                      </td>
                      <td className="py-4 pr-4 text-sm font-medium text-slate-800">{rec.duration}</td>
                      <td className="py-4">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-bold",
                            rec.status === "On-Time" && "bg-emerald-50 text-emerald-700",
                            rec.status === "Late" && "bg-[#E4F2D3] text-[#0E4D41]",
                            rec.status === "Absent" && "bg-[#0E4D41] text-white",
                            rec.status === "On Leave" && "bg-slate-100 text-slate-600"
                          )}
                        >
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
