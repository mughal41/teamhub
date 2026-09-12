import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { getAttendanceForUser } from "@/src/lib/permissions";
import { getCollection, saveCollection, type AttendanceRecord } from "@/src/lib/db";
import { Clock, UserCheck, CheckCircle2, PenLine } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function EmployeeAttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = React.useState(() => getAttendanceForUser(user));
  const [toast, setToast] = React.useState("");
  const [showCorrection, setShowCorrection] = React.useState(false);
  const [corrDate, setCorrDate] = React.useState("");
  const [corrIn, setCorrIn] = React.useState("09:00");
  const [corrOut, setCorrOut] = React.useState("17:30");
  const [corrReason, setCorrReason] = React.useState("");

  React.useEffect(() => {
    setRecords(getAttendanceForUser(user));
  }, [user]);

  const today = records[0];
  const onTime = records.filter((r) => r.status === "On-Time").length;
  const late = records.filter((r) => r.status === "Late").length;
  const pendingCorrections = records.filter(
    (r) => r.hrApprovalStatus === "Pending" || r.forwardedStatus === "Pending"
  ).length;

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2200);
  };

  const clockAction = (type: "in" | "out") => {
    if (!user) return;
    const all = getCollection<AttendanceRecord[]>("db_attendance", []);
    const idx = all.findIndex((r) => r.id === user.employeeId);
    const now = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (idx >= 0) {
      all[idx] = {
        ...all[idx],
        in: type === "in" ? now : all[idx].in,
        out: type === "out" ? now : all[idx].out,
        status: type === "in" ? "On-Time" : all[idx].status,
        comment: type === "in" ? "Self clock-in from employee panel" : all[idx].comment,
      };
    } else {
      all.unshift({
        id: user.employeeId,
        name: user.name,
        role: user.roleTitle,
        subRole: "Self",
        dept: "—",
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        model: "Hybrid",
        in: type === "in" ? now : "—",
        out: type === "out" ? now : "—",
        duration: "—",
        overtime: "0h",
        status: "On-Time",
        avatar: user.avatar,
        correctionRequestsThisMonth: 0,
        comment: "Created from employee self clock",
        forwardedTo: "None",
        forwardedStatus: "None",
        hrApprovalStatus: "None",
      });
    }
    saveCollection("db_attendance", all);
    setRecords(getAttendanceForUser(user));
    showToast(type === "in" ? "Clock-in recorded." : "Clock-out recorded.");
  };

  const submitCorrection = () => {
    if (!user || !corrDate || !corrReason.trim()) {
      showToast("Date and reason are required.");
      return;
    }
    const all = getCollection<AttendanceRecord[]>("db_attendance", []);
    const monthCount =
      all.filter((r) => r.id === user.employeeId).reduce((n, r) => n + (r.correctionRequestsThisMonth || 0), 0) + 1;

    all.unshift({
      id: user.employeeId,
      name: user.name,
      role: user.roleTitle,
      subRole: "Correction",
      dept: "—",
      date: new Date(corrDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      model: "Hybrid",
      in: corrIn,
      out: corrOut,
      duration: "—",
      overtime: "0h",
      status: "On-Time",
      avatar: user.avatar,
      correctionRequestsThisMonth: monthCount,
      comment: corrReason.trim(),
      forwardedTo: "Marcus Brody",
      forwardedStatus: "Pending",
      hrApprovalStatus: "Pending",
    });
    saveCollection("db_attendance", all);
    setRecords(getAttendanceForUser(user));
    setShowCorrection(false);
    setCorrReason("");
    showToast("Correction request submitted to your manager.");
  };

  return (
    <AppLayout
      title="My Attendance"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "My Attendance" }]}
    >
      <div className="w-full space-y-6">
        {toast ? (
          <div className="fixed right-6 top-24 z-[80] flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-800 shadow-lg">
            <CheckCircle2 className="h-4 w-4" />
            {toast}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm text-slate-500">Today</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{today?.status || "—"}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              {today ? `${today.in} – ${today.out}` : "No record"}
            </p>
          </div>
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm text-slate-500">On-time days</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{onTime}</p>
          </div>
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm text-slate-500">Late days</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{late}</p>
          </div>
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm text-slate-500">Pending corrections</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{pendingCorrections}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Clock actions</h3>
              <p className="text-sm text-slate-500">Record your in/out time for today.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => clockAction("in")}
                className="h-11 rounded-xl bg-[#28C2A9] px-4 text-sm font-bold text-white hover:bg-[#209f8a]"
              >
                Clock in
              </button>
              <button
                type="button"
                onClick={() => clockAction("out")}
                className="h-11 rounded-xl border border-[#E4E4E1] bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-[#F3F3F0]"
              >
                Clock out
              </button>
              <button
                type="button"
                onClick={() => setShowCorrection((v) => !v)}
                className="h-11 inline-flex items-center gap-2 rounded-xl border border-[#E4E4E1] bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-[#F3F3F0]"
              >
                <PenLine className="h-4 w-4" />
                Request correction
              </button>
            </div>
          </div>

          {showCorrection ? (
            <div className="mt-5 grid gap-3 rounded-xl border border-[#E4E4E1] bg-[#F3F3F0] p-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Work date</label>
                <input
                  type="date"
                  value={corrDate}
                  onChange={(e) => setCorrDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 text-sm outline-none focus:border-[#28C2A9]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Correct in</label>
                  <input
                    type="time"
                    value={corrIn}
                    onChange={(e) => setCorrIn(e.target.value)}
                    className="h-10 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 text-sm outline-none focus:border-[#28C2A9]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Correct out</label>
                  <input
                    type="time"
                    value={corrOut}
                    onChange={(e) => setCorrOut(e.target.value)}
                    className="h-10 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 text-sm outline-none focus:border-[#28C2A9]"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-500">Reason</label>
                <textarea
                  value={corrReason}
                  onChange={(e) => setCorrReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. Forgot to clock out after client call"
                  className="w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2 text-sm outline-none focus:border-[#28C2A9]"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCorrection(false)}
                  className="h-10 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitCorrection}
                  className="h-10 rounded-xl bg-[#28C2A9] px-4 text-sm font-bold text-white hover:bg-[#209f8a]"
                >
                  Submit to manager
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E4E4E1] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="border-b border-[#E4E4E1] px-5 py-4">
            <h3 className="font-bold text-slate-900">Attendance history</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] bg-white text-left text-sm">
              <thead>
                <tr className="border-b border-[#E4E4E1] text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">In</th>
                  <th className="px-5 py-3 font-semibold">Out</th>
                  <th className="px-5 py-3 font-semibold">Duration</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Correction</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                      <UserCheck className="mx-auto mb-2 h-6 w-6" />
                      No attendance records yet
                    </td>
                  </tr>
                ) : (
                  records.map((r) => (
                    <tr key={`${r.id}-${r.date}-${r.in}-${r.comment}`} className="border-b border-[#E4E4E1] last:border-0">
                      <td className="px-5 py-3 font-medium text-slate-800">{r.date}</td>
                      <td className="px-5 py-3 text-slate-600">{r.in}</td>
                      <td className="px-5 py-3 text-slate-600">{r.out}</td>
                      <td className="px-5 py-3 text-slate-600">{r.duration}</td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "rounded-md px-2 py-1 text-[11px] font-bold",
                            r.status === "On-Time" && "bg-emerald-50 text-emerald-700",
                            r.status === "Late" && "bg-amber-50 text-amber-700",
                            r.status === "Absent" && "bg-slate-800 text-white",
                            r.status === "On Leave" && "bg-sky-50 text-sky-700"
                          )}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-500">
                        {r.hrApprovalStatus === "Pending" || r.forwardedStatus === "Pending"
                          ? "Pending review"
                          : r.subRole === "Correction"
                            ? r.hrApprovalStatus || "Submitted"
                            : "—"}
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
