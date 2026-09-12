import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { getLeavesForUser } from "@/src/lib/permissions";
import { type LeaveActivityItem } from "@/src/lib/db";
import { Button } from "@/src/components/ui/Button";
import { Check, X, ClipboardCheck } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function ManagerLeaveApprovalsPage() {
  const { user } = useAuth();
  const [leaves, setLeaves] = React.useState<LeaveActivityItem[]>(() => getLeavesForUser(user));
  const [filter, setFilter] = React.useState<"All" | "Pending" | "Approved" | "Rejected">("Pending");
  const [toast, setToast] = React.useState("");
  const [busyId, setBusyId] = React.useState<number | string | null>(null);

  const refresh = React.useCallback(() => setLeaves(getLeavesForUser(user)), [user]);

  React.useEffect(() => {
    const onUpdate = () => refresh();
    void (async () => {
      try {
        const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
        await syncCollectionsFromApi();
      } catch {
        // keep cached
      }
      refresh();
    })();
    window.addEventListener("db_updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("db_updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refresh]);

  const updateStatus = async (leave: LeaveActivityItem, status: "Approved" | "Rejected") => {
    const key = leave.leaveId ?? leave.id;
    setBusyId(key);
    try {
      if (leave.leaveId != null) {
        const { decideLeave } = await import("@/src/lib/api/modules");
        const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
        await decideLeave(
          leave.leaveId,
          status,
          status === "Approved"
            ? `Approved by ${user?.name || "Manager"}`
            : `Rejected by ${user?.name || "Manager"}`
        );
        await syncCollectionsFromApi();
        refresh();
      }
      setToast(`Leave request ${status.toLowerCase()}.`);
      setTimeout(() => setToast(""), 2500);
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Could not update leave.");
      setTimeout(() => setToast(""), 3000);
    } finally {
      setBusyId(null);
    }
  };

  const filtered = filter === "All" ? leaves : leaves.filter((l) => l.status === filter);
  const pendingCount = leaves.filter((l) => l.status === "Pending").length;

  return (
    <AppLayout
      title="Leave Approvals"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Leave Approvals" }]}
    >
      <div className="space-y-6">
        {toast && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {toast}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Approve or reject leave from your team. Leave policy is managed by Admin/HR.
          </p>
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            {(["Pending", "Approved", "Rejected", "All"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                  filter === f ? "bg-[#28C2A9] text-white" : "text-slate-500 hover:text-slate-800"
                )}
              >
                {f}
                {f === "Pending" ? ` (${pendingCount})` : ""}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#28C2A9] p-5 text-white">
            <ClipboardCheck className="mb-2 h-5 w-5" />
            <p className="text-sm text-white/80">Pending</p>
            <p className="text-3xl font-bold">{pendingCount}</p>
          </div>
          <div className="admin-panel p-5">
            <p className="text-sm text-slate-500">Approved</p>
            <p className="text-3xl font-bold text-slate-900">
              {leaves.filter((l) => l.status === "Approved").length}
            </p>
          </div>
          <div className="admin-panel p-5">
            <p className="text-sm text-slate-500">Rejected</p>
            <p className="text-3xl font-bold text-slate-900">
              {leaves.filter((l) => l.status === "Rejected").length}
            </p>
          </div>
        </div>

        <div className="admin-panel p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left bg-white">
              <thead>
                <tr className="border-b border-line bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Period</th>
                  <th className="px-5 py-3">Reason</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">
                      No leave requests in this filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((leave) => (
                    <tr key={leave.leaveId ?? `${leave.id}-${leave.startDate}`} className="border-b border-slate-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={leave.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{leave.name}</p>
                            <p className="text-xs text-slate-400">{leave.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{leave.type}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        <p>{leave.period}</p>
                        <p className="text-xs text-slate-400">{leave.duration}</p>
                      </td>
                      <td className="px-5 py-4 max-w-[200px] truncate text-sm text-slate-600">
                        {leave.reason}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-bold",
                            leave.status === "Pending" && "bg-amber-50 text-amber-700",
                            leave.status === "Approved" && "bg-emerald-50 text-emerald-700",
                            leave.status === "Rejected" && "bg-rose-50 text-rose-700"
                          )}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {leave.status === "Pending" ? (
                          <div className="inline-flex gap-2">
                            <Button
                              type="button"
                              className="h-9 gap-1 px-3 text-xs font-bold"
                              disabled={busyId === (leave.leaveId ?? leave.id)}
                              onClick={() => void updateStatus(leave, "Approved")}
                            >
                              <Check className="h-3.5 w-3.5" /> Approve
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-9 gap-1 px-3 text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
                              disabled={busyId === (leave.leaveId ?? leave.id)}
                              onClick={() => void updateStatus(leave, "Rejected")}
                            >
                              <X className="h-3.5 w-3.5" /> Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">{leave.comment || "—"}</span>
                        )}
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
