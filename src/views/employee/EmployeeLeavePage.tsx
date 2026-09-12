import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { getLeavesForUser } from "@/src/lib/permissions";
import { getCollection, saveCollection, type LeaveActivityItem } from "@/src/lib/db";
import { CalendarX, CheckCircle2, Plus, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function EmployeeLeavePage() {
  const { user } = useAuth();
  const [leaves, setLeaves] = React.useState(() => getLeavesForUser(user));
  const [open, setOpen] = React.useState(false);
  const [toast, setToast] = React.useState("");
  const [form, setForm] = React.useState({
    type: "Annual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  React.useEffect(() => {
    setLeaves(getLeavesForUser(user));
  }, [user]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2400);
  };

  const balance = leaves[0] || {
    remainingQuota: 12,
    annualLeavesRemaining: 8,
    sickLeavesRemaining: 3,
    casualLeavesRemaining: 1,
  };

  const submitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.startDate || !form.endDate || !form.reason.trim()) {
      showToast("Please complete all fields.");
      return;
    }
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
    const period = `${start.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    })} – ${end.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;

    const next: LeaveActivityItem = {
      id: user.employeeId,
      name: user.name,
      role: user.roleTitle,
      dept: "Marketing",
      type: form.type,
      submit: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      period,
      duration: `${days} day${days > 1 ? "s" : ""}`,
      reason: form.reason.trim(),
      status: "Pending",
      avatar: user.avatar,
      remainingQuota: balance.remainingQuota,
      totalQuota: 18,
      sickLeavesRemaining: balance.sickLeavesRemaining,
      casualLeavesRemaining: balance.casualLeavesRemaining,
      annualLeavesRemaining: balance.annualLeavesRemaining,
      otherLeavesRemaining: 0,
      startDate: form.startDate,
      endDate: form.endDate,
      forwardedTo: "Marcus Brody",
      forwardedStatus: "Pending",
      comment: "Submitted from employee self-service",
    };

    const all = getCollection<LeaveActivityItem[]>("db_leaves", []);
    saveCollection("db_leaves", [next, ...all]);
    setLeaves(getLeavesForUser(user));
    setOpen(false);
    setForm({ type: "Annual Leave", startDate: "", endDate: "", reason: "" });
    showToast("Leave request submitted for approval.");
  };

  return (
    <AppLayout
      title="My Leave"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "My Leave" }]}
    >
      <div className="w-full space-y-6">
        {toast ? (
          <div className="fixed right-6 top-24 z-[80] flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-800 shadow-lg">
            <CheckCircle2 className="h-4 w-4" />
            {toast}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Request time off and track approval status.</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#28C2A9] px-4 text-sm font-bold text-white hover:bg-[#209f8a]"
          >
            <Plus className="h-4 w-4" />
            Apply for leave
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Remaining", value: balance.remainingQuota },
            { label: "Annual", value: balance.annualLeavesRemaining },
            { label: "Sick", value: balance.sickLeavesRemaining },
            { label: "Casual", value: balance.casualLeavesRemaining },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E4E4E1] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="border-b border-[#E4E4E1] px-5 py-4">
            <h3 className="font-bold text-slate-900">My leave requests</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] bg-white text-left text-sm">
              <thead>
                <tr className="border-b border-[#E4E4E1] text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Period</th>
                  <th className="px-5 py-3 font-semibold">Duration</th>
                  <th className="px-5 py-3 font-semibold">Submitted</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                      <CalendarX className="mx-auto mb-2 h-6 w-6" />
                      No leave requests yet
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave, i) => (
                    <tr key={`${leave.type}-${leave.submit}-${i}`} className="border-b border-[#E4E4E1] last:border-0">
                      <td className="px-5 py-3 font-medium text-slate-800">{leave.type}</td>
                      <td className="px-5 py-3 text-slate-600">{leave.period}</td>
                      <td className="px-5 py-3 text-slate-600">{leave.duration}</td>
                      <td className="px-5 py-3 text-slate-600">{leave.submit}</td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "rounded-md px-2 py-1 text-[11px] font-bold",
                            leave.status === "Approved" && "bg-emerald-50 text-emerald-700",
                            leave.status === "Pending" && "bg-amber-50 text-amber-700",
                            leave.status === "Rejected" && "bg-rose-50 text-rose-700"
                          )}
                        >
                          {leave.status}
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

      {open ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 p-4">
          <form
            onSubmit={submitLeave}
            className="w-full max-w-lg rounded-2xl border border-[#E4E4E1] bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Apply for leave</h3>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-[#F3F3F0]">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <div className="space-y-3">
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Leave type</span>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-[#E4E4E1] px-3 text-sm outline-none focus:border-[#28C2A9]"
                >
                  <option>Annual Leave</option>
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Unpaid Leave</option>
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Start</span>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-[#E4E4E1] px-3 text-sm outline-none focus:border-[#28C2A9]"
                    required
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">End</span>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-[#E4E4E1] px-3 text-sm outline-none focus:border-[#28C2A9]"
                    required
                  />
                </label>
              </div>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Reason</span>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                  rows={4}
                  className="w-full rounded-xl border border-[#E4E4E1] px-3 py-2 text-sm outline-none focus:border-[#28C2A9]"
                  required
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-5 h-11 w-full rounded-xl bg-[#28C2A9] text-sm font-bold text-white hover:bg-[#209f8a]"
            >
              Submit request
            </button>
          </form>
        </div>
      ) : null}
    </AppLayout>
  );
}
