import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { getAttendanceForUser } from "@/src/lib/permissions";
import type { AttendanceRecord } from "@/src/lib/db";
import { Clock, UserCheck, CheckCircle2, PenLine } from "lucide-react";
import { cn } from "@/src/lib/utils";

function toClockLabel(hhmm: string) {
  // "09:00" -> "09:00 AM"
  const [hStr, mStr = "00"] = hhmm.split(":");
  let h = Number(hStr);
  const suffix = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${String(h).padStart(2, "0")}:${mStr} ${suffix}`;
}

export default function EmployeeAttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = React.useState<AttendanceRecord[]>(() => getAttendanceForUser(user));
  const [toast, setToast] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [showCorrection, setShowCorrection] = React.useState(false);
  const [corrDate, setCorrDate] = React.useState("");
  const [corrIn, setCorrIn] = React.useState("09:00");
  const [corrOut, setCorrOut] = React.useState("17:30");
  const [corrReason, setCorrReason] = React.useState("");

  const refresh = React.useCallback(() => setRecords(getAttendanceForUser(user)), [user]);

  React.useEffect(() => {
    void (async () => {
      try {
        const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
        await syncCollectionsFromApi();
      } catch {
        // keep cached
      }
      refresh();
    })();
    const onUpdate = () => refresh();
    window.addEventListener("db_updated", onUpdate);
    return () => window.removeEventListener("db_updated", onUpdate);
  }, [refresh]);

  const today = records[0];
  const onTime = records.filter((r) => r.status === "On-Time").length;
  const late = records.filter((r) => r.status === "Late").length;
  const pendingCorrections = records.filter(
    (r) =>
      r.is_correction &&
      (r.hrApprovalStatus === "Pending" || r.forwardedStatus === "Pending")
  ).length;

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2200);
  };

  const clockAction = async (type: "in" | "out") => {
    if (!user || busy) return;
    setBusy(true);
    try {
      const { clockAttendance } = await import("@/src/lib/api/modules");
      const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
      await clockAttendance(type);
      await syncCollectionsFromApi();
      refresh();
      showToast(type === "in" ? "Clock-in recorded." : "Clock-out recorded.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not clock.");
    } finally {
      setBusy(false);
    }
  };

  const submitCorrection = async () => {
    if (!user || !corrDate || !corrReason.trim()) {
      showToast("Date and reason are required.");
      return;
    }
    setBusy(true);
    try {
      const { createAttendanceCorrection } = await import("@/src/lib/api/modules");
      const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
      await createAttendanceCorrection({
        date: corrDate,
        clockIn: toClockLabel(corrIn),
        clockOut: toClockLabel(corrOut),
        reason: corrReason.trim(),
      });
      await syncCollectionsFromApi();
      refresh();
      setShowCorrection(false);
      setCorrReason("");
      showToast("Correction request submitted to your manager.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not submit correction.");
    } finally {
      setBusy(false);
    }
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

        <div className="grid gap-5 sm:grid-cols-4">
          <div className="admin-panel p-5">
            <p className="text-sm text-slate-500">Today</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{today?.status || "—"}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              {today ? `${today.in} – ${today.out}` : "No record"}
            </p>
          </div>
          <div className="admin-panel p-5">
            <p className="text-sm text-slate-500">On-time days</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{onTime}</p>
          </div>
          <div className="admin-panel p-5">
            <p className="text-sm text-slate-500">Late days</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{late}</p>
          </div>
          <div className="admin-panel p-5">
            <p className="text-sm text-slate-500">Pending corrections</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{pendingCorrections}</p>
          </div>
        </div>

        <div className="admin-panel p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Clock actions</h3>
              <p className="text-sm text-slate-500">Record your in/out time for today.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => void clockAction("in")}
                className="h-11 rounded-xl bg-[#28C2A9] px-4 text-sm font-bold text-white hover:bg-[#209f8a] disabled:opacity-60"
              >
                Clock in
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void clockAction("out")}
                className="h-11 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-[#F3F3F0] disabled:opacity-60"
              >
                Clock out
              </button>
              <button
                type="button"
                onClick={() => setShowCorrection((v) => !v)}
                className="h-11 inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-[#F3F3F0]"
              >
                <PenLine className="h-4 w-4" />
                Request correction
              </button>
            </div>
          </div>

          {showCorrection ? (
            <div className="mt-5 grid gap-3 rounded-xl border border-line bg-[#F3F3F0] p-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Work date</label>
                <input
                  type="date"
                  value={corrDate}
                  onChange={(e) => setCorrDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-[#28C2A9]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Correct in</label>
                  <input
                    type="time"
                    value={corrIn}
                    onChange={(e) => setCorrIn(e.target.value)}
                    className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-[#28C2A9]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Correct out</label>
                  <input
                    type="time"
                    value={corrOut}
                    onChange={(e) => setCorrOut(e.target.value)}
                    className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-[#28C2A9]"
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
                  className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-[#28C2A9]"
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
                  disabled={busy}
                  onClick={() => void submitCorrection()}
                  className="h-10 rounded-xl bg-[#28C2A9] px-4 text-sm font-bold text-white hover:bg-[#209f8a] disabled:opacity-60"
                >
                  Submit to manager
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="admin-panel p-0 overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <h3 className="font-bold text-slate-900">Attendance history</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] bg-white text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-slate-400">
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
                    <tr
                      key={r.recordId ?? `${r.id}-${r.date}-${r.in}-${r.comment}`}
                      className="border-b border-line last:border-0"
                    >
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
                        {r.is_correction
                          ? r.forwardedStatus === "Pending" || r.hrApprovalStatus === "Pending"
                            ? "Pending review"
                            : r.forwardedStatus || r.hrApprovalStatus || "Submitted"
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
