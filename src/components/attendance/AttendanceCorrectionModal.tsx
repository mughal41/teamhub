import * as React from "react";
import {
  X,
  ArrowRight,
  AlertCircle,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AttendanceRecord, Employee, getCollection } from "../../lib/db";
import { useAuth } from "../../context/AuthContext";

export interface AttendanceCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord | null;
  onApproveBySupervisor?: (recordId: string, remark: string) => void;
  onRejectBySupervisor?: (recordId: string, remark: string) => void;
  onFinalApproveByAdmin?: (recordId: string, adminRemark: string) => void;
  onFinalRejectByAdmin?: (recordId: string, adminRemark: string) => void;
  onUpdateRecord?: (updatedRecord: AttendanceRecord) => void;
}

export function AttendanceCorrectionModal({
  isOpen,
  onClose,
  record,
  onApproveBySupervisor,
  onRejectBySupervisor,
  onFinalApproveByAdmin,
  onFinalRejectByAdmin,
  onUpdateRecord,
}: AttendanceCorrectionModalProps) {
  const { canApprove, canManage, user } = useAuth();
  // Map static RBAC → legacy modal roles (team lead = supervisor, HR = admin)
  const currentUserRole = React.useMemo<"supervisor" | "admin" | "employee">(() => {
    if (canManage("attendance")) return "admin";
    if (canApprove("attendance")) return "supervisor";
    return "employee";
  }, [canApprove, canManage, user?.roleId]);

  // System punch mode (2-punch vs 4-punch system configuration)
  const punchMode = React.useMemo<"2-punch" | "4-punch">(() => {
    if (record?.breakOut || record?.breakIn || record?.requestedBreakOut || record?.requestedBreakIn) {
      return "4-punch";
    }
    const savedConfig = localStorage.getItem("hrms_punch_system");
    return (savedConfig as "2-punch" | "4-punch") || "2-punch";
  }, [record]);

  // Local input states for remarks
  const [supervisorRemarkInput, setSupervisorRemarkInput] = React.useState("");
  const [adminRemarkInput, setAdminRemarkInput] = React.useState("");

  // Validation feedback
  const [supervisorError, setSupervisorError] = React.useState<string | null>(null);

  // Reset inputs when modal opens or closes
  React.useEffect(() => {
    setSupervisorError(null);
    setSupervisorRemarkInput("");
    setAdminRemarkInput("");
  }, [isOpen, record?.id]);

  if (!isOpen || !record) return null;

  // Resolve Assigned Supervisor from existing employee directory data
  const allEmployees = getCollection<Employee[]>("db_employees", []);
  
  const resolveSupervisor = () => {
    if (record.supervisorName || record.forwardedTo) {
      const name = record.supervisorName || record.forwardedTo;
      const matched = allEmployees.find(
        (e) => e.name.toLowerCase() === name.toLowerCase()
      );
      return {
        assigned: true,
        name: name,
        role: record.supervisorRole || matched?.role || "Reporting Lead",
      };
    }

    const deptManager = allEmployees.find(
      (e) =>
        e.dept?.toLowerCase() === record.dept?.toLowerCase() &&
        (e.role?.toLowerCase().includes("lead") ||
          e.role?.toLowerCase().includes("manager") ||
          e.role?.toLowerCase().includes("supervisor") ||
          e.role?.toLowerCase().includes("director") ||
          e.role?.toLowerCase().includes("head"))
    );

    if (deptManager && deptManager.name !== record.name) {
      return {
        assigned: true,
        name: deptManager.name,
        role: deptManager.role,
      };
    }

    return {
      assigned: false,
      name: null,
      role: null,
    };
  };

  const supervisorInfo = resolveSupervisor();

  // Workflow states
  const supervisorStatus = record.forwardedStatus || "Pending";
  const hrStatus = record.hrApprovalStatus || "Pending";

  // Punch times
  const displayOriginalIn = record.in || "Not recorded";
  const displayRequestedIn = record.requestedIn || (record.status === "Late" && !record.requestedIn ? "09:00 AM" : null);

  const displayOriginalOut = record.out || "Not recorded";
  const displayRequestedOut = record.requestedOut || null;

  const displayOriginalBreakOut = record.breakOut || (punchMode === "4-punch" ? "01:10 PM" : null);
  const displayRequestedBreakOut = record.requestedBreakOut || (punchMode === "4-punch" ? "01:00 PM" : null);

  const displayOriginalBreakIn = record.breakIn || (punchMode === "4-punch" ? "01:50 PM" : null);
  const displayRequestedBreakIn = record.requestedBreakIn || (punchMode === "4-punch" ? "01:45 PM" : null);

  // Check which punches are changed
  const isCheckInChanged = Boolean(displayRequestedIn && displayRequestedIn !== displayOriginalIn);
  const isCheckOutChanged = Boolean(displayRequestedOut && displayRequestedOut !== displayOriginalOut);
  const isBreakOutChanged = Boolean(displayRequestedBreakOut && displayRequestedBreakOut !== displayOriginalBreakOut);
  const isBreakInChanged = Boolean(displayRequestedBreakIn && displayRequestedBreakIn !== displayOriginalBreakIn);

  // Employee Reason category & explanation
  const reasonCategory = record.reasonCategory || "Machine Error";
  const reasonExplanation = record.comment || "Biometric machine did not register punch on arrival.";

  // Actions
  const handleSupervisorApprove = () => {
    if (!supervisorRemarkInput.trim()) {
      setSupervisorError("Supervisor remark is required.");
      return;
    }
    setSupervisorError(null);
    if (onApproveBySupervisor) {
      onApproveBySupervisor(record.id, supervisorRemarkInput.trim());
    } else if (onUpdateRecord) {
      onUpdateRecord({
        ...record,
        forwardedStatus: "Approved",
        supervisorRemark: supervisorRemarkInput.trim(),
        supervisorReviewedAt: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) + ", " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        supervisorName: supervisorInfo.name || "Assigned Supervisor",
      });
    }
    onClose();
  };

  const handleSupervisorReject = () => {
    if (!supervisorRemarkInput.trim()) {
      setSupervisorError("Supervisor remark is required.");
      return;
    }
    setSupervisorError(null);
    if (onRejectBySupervisor) {
      onRejectBySupervisor(record.id, supervisorRemarkInput.trim());
    } else if (onUpdateRecord) {
      onUpdateRecord({
        ...record,
        forwardedStatus: "Rejected",
        supervisorRemark: supervisorRemarkInput.trim(),
        supervisorReviewedAt: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) + ", " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        supervisorName: supervisorInfo.name || "Assigned Supervisor",
      });
    }
    onClose();
  };

  const handleAdminApprove = () => {
    if (onFinalApproveByAdmin) {
      onFinalApproveByAdmin(record.id, adminRemarkInput.trim());
    } else if (onUpdateRecord) {
      onUpdateRecord({
        ...record,
        hrApprovalStatus: "Approved",
        status: "On-Time",
        in: displayRequestedIn || record.in,
        out: displayRequestedOut || record.out,
        adminRemark: adminRemarkInput.trim() || record.adminRemark,
        hrReviewedAt: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) + ", " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }
    onClose();
  };

  const handleAdminReject = () => {
    if (onFinalRejectByAdmin) {
      onFinalRejectByAdmin(record.id, adminRemarkInput.trim());
    } else if (onUpdateRecord) {
      onUpdateRecord({
        ...record,
        hrApprovalStatus: "Rejected",
        adminRemark: adminRemarkInput.trim() || record.adminRemark,
        hrReviewedAt: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) + ", " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="attendance-request-title"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in"
    >
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-[540px] max-h-[90dvh] flex flex-col text-left overflow-hidden my-auto">
        
        {/* =========================================================================
            HEADER (PART 1.2 — CLEAN & COMPACT)
            ========================================================================= */}
        <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3
                id="attendance-request-title"
                className="font-bold text-base text-[#203430]"
              >
                Attendance Request
              </h3>
              <p className="text-xs text-[#63716E] mt-0.5">
                Review attendance correction
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer shrink-0 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Compact Employee Identity (Avatar, Name, ID, Date, Single Status Badge) */}
          <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={record.avatar}
                alt={record.name}
                className="h-9 w-9 rounded-full object-cover shrink-0 border border-slate-200/60"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs sm:text-sm text-[#203430] truncate">
                    {record.name}
                  </h4>
                  <span className="text-[11px] text-[#63716E]">
                    {record.id}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#63716E] mt-0.5">
                  <Calendar className="h-3 w-3 text-[#35BFA3]" />
                  <span>{record.date}</span>
                </div>
              </div>
            </div>

            {/* Single Prominent Status Badge */}
            <div className="shrink-0 text-right">
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold",
                  record.status === "On-Time"
                    ? "bg-[#E4F2D3] text-[#0E4D41]"
                    : record.status === "Late"
                    ? "bg-amber-100 text-amber-800"
                    : record.status === "On Leave"
                    ? "bg-slate-100 text-slate-700"
                    : "bg-[#0E4D41] text-white"
                )}
              >
                {record.status}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SCROLLABLE CONTENT AREA
            ========================================================================= */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto text-xs min-h-0">
          
          {/* SECTION 1 — PUNCH CORRECTIONS (Original → Requested) */}
          <div>
            <h5 className="font-bold text-xs text-[#203430] mb-2">
              Punch Corrections
            </h5>

            <div className={cn(
              "grid gap-2",
              punchMode === "4-punch" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
            )}>
              {/* Check-In */}
              <div className="p-2.5 rounded-xl border border-[#E5E6E6] bg-slate-50/50 flex items-center justify-between gap-3">
                <span className="font-semibold text-[#63716E] text-[11px]">
                  Check-In
                </span>
                <div className="text-right">
                  {isCheckInChanged ? (
                    <div className="inline-flex items-center gap-1.5 text-xs">
                      <span className="text-slate-400 font-medium line-through sm:no-underline">
                        {displayOriginalIn}
                      </span>
                      <ArrowRight className="h-3 w-3 text-[#35BFA3]" />
                      <span className="font-bold text-[#0E4D41] bg-[#E4F2D3] px-1.5 py-0.5 rounded">
                        {displayRequestedIn}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-500 font-medium">
                      {displayOriginalIn} — Unchanged
                    </span>
                  )}
                </div>
              </div>

              {/* Break-Out (4-punch only) */}
              {punchMode === "4-punch" && (
                <div className="p-2.5 rounded-xl border border-[#E5E6E6] bg-slate-50/50 flex items-center justify-between gap-3">
                  <span className="font-semibold text-[#63716E] text-[11px]">
                    Break-Out
                  </span>
                  <div className="text-right">
                    {isBreakOutChanged ? (
                      <div className="inline-flex items-center gap-1.5 text-xs">
                        <span className="text-slate-400 font-medium">
                          {displayOriginalBreakOut || "Not recorded"}
                        </span>
                        <ArrowRight className="h-3 w-3 text-[#35BFA3]" />
                        <span className="font-bold text-[#0E4D41] bg-[#E4F2D3] px-1.5 py-0.5 rounded">
                          {displayRequestedBreakOut}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500 font-medium">
                        {displayOriginalBreakOut || "–"} — Unchanged
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Break-In (4-punch only) */}
              {punchMode === "4-punch" && (
                <div className="p-2.5 rounded-xl border border-[#E5E6E6] bg-slate-50/50 flex items-center justify-between gap-3">
                  <span className="font-semibold text-[#63716E] text-[11px]">
                    Break-In
                  </span>
                  <div className="text-right">
                    {isBreakInChanged ? (
                      <div className="inline-flex items-center gap-1.5 text-xs">
                        <span className="text-slate-400 font-medium">
                          {displayOriginalBreakIn || "Not recorded"}
                        </span>
                        <ArrowRight className="h-3 w-3 text-[#35BFA3]" />
                        <span className="font-bold text-[#0E4D41] bg-[#E4F2D3] px-1.5 py-0.5 rounded">
                          {displayRequestedBreakIn}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500 font-medium">
                        {displayOriginalBreakIn || "–"} — Unchanged
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Check-Out */}
              <div className="p-2.5 rounded-xl border border-[#E5E6E6] bg-slate-50/50 flex items-center justify-between gap-3">
                <span className="font-semibold text-[#63716E] text-[11px]">
                  Check-Out
                </span>
                <div className="text-right">
                  {isCheckOutChanged ? (
                    <div className="inline-flex items-center gap-1.5 text-xs">
                      <span className="text-slate-400 font-medium">
                        {displayOriginalOut}
                      </span>
                      <ArrowRight className="h-3 w-3 text-[#35BFA3]" />
                      <span className="font-bold text-[#0E4D41] bg-[#E4F2D3] px-1.5 py-0.5 rounded">
                        {displayRequestedOut}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-500 font-medium">
                      {displayOriginalOut} — Unchanged
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2 — EMPLOYEE'S REASON & CATEGORY (PART 2) */}
          <div className="p-3 rounded-xl border border-[#E5E6E6] bg-white">
            <div className="flex items-center justify-between mb-1.5">
              <h5 className="font-bold text-xs text-[#203430]">
                Employee's Reason
              </h5>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E4F2D3] text-[#0E4D41]">
                {reasonCategory}
              </span>
            </div>
            <p className="text-xs text-[#203430] leading-relaxed">
              "{reasonExplanation}"
            </p>
          </div>

          {/* SECTION 3 — SUPERVISOR REVIEW (PART 3) */}
          <div className="p-3 rounded-xl border border-[#E5E6E6] bg-white space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-xs text-[#203430]">
                Supervisor Review
              </h5>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold",
                  supervisorStatus === "Approved"
                    ? "bg-[#E4F2D3] text-[#0E4D41]"
                    : supervisorStatus === "Rejected"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-amber-100 text-amber-800"
                )}
              >
                {supervisorStatus === "Approved"
                  ? "Approved"
                  : supervisorStatus === "Rejected"
                  ? "Rejected"
                  : "Awaiting review"}
              </span>
            </div>

            {supervisorInfo.assigned ? (
              <p className="text-[11px] text-[#63716E]">
                Supervisor: <strong className="text-[#203430] font-semibold">{supervisorInfo.name}</strong>
              </p>
            ) : (
              <p className="text-[11px] text-amber-700 flex items-center gap-1 font-medium">
                <AlertCircle className="h-3 w-3 shrink-0" />
                No supervisor assigned
              </p>
            )}

            {/* Display existing supervisor remark if reviewed */}
            {supervisorStatus !== "Pending" && record.supervisorRemark && (
              <p className="text-xs text-[#203430] bg-slate-50 p-2 rounded-lg border border-slate-200/60 italic">
                "{record.supervisorRemark}"
              </p>
            )}

            {/* If authenticated user is Supervisor reviewing pending request */}
            {currentUserRole === "supervisor" && supervisorStatus === "Pending" && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="font-bold text-[#63716E] block text-[11px]">
                  Supervisor Remarks <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={supervisorRemarkInput}
                  onChange={(e) => {
                    setSupervisorRemarkInput(e.target.value);
                    if (supervisorError) setSupervisorError(null);
                  }}
                  placeholder="Enter remarks (required)..."
                  className={cn(
                    "w-full p-2 text-xs rounded-xl border outline-none resize-none transition-colors",
                    supervisorError ? "border-rose-300 bg-rose-50/20" : "border-[#E5E6E6] focus:border-[#35BFA3]"
                  )}
                />
                {supervisorError && (
                  <p className="text-rose-600 text-[10px] font-medium">
                    {supervisorError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* SECTION 4 — HR REMARKS (WHEN IN ADMIN / HR VIEW) */}
          {currentUserRole === "admin" && (
            <div className="p-3 rounded-xl border border-[#E5E6E6] bg-white space-y-1.5">
              <h5 className="font-bold text-xs text-[#203430]">
                HR Remarks
              </h5>
              <textarea
                rows={2}
                value={adminRemarkInput}
                onChange={(e) => setAdminRemarkInput(e.target.value)}
                placeholder="Optional administrative remarks..."
                className="w-full p-2 text-xs rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none resize-none"
              />
            </div>
          )}

        </div>

        {/* =========================================================================
            MODAL FOOTER (CLEAN ACTIONS: Cancel | Reject | Approve)
            ========================================================================= */}
        <div className="p-4 sm:p-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-[#FBFDFB] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl border border-[#E5E6E6] hover:bg-slate-100 text-xs font-semibold text-[#203430] cursor-pointer transition-colors"
          >
            Cancel
          </button>

          {currentUserRole === "supervisor" && supervisorStatus === "Pending" ? (
            <>
              <button
                type="button"
                onClick={handleSupervisorReject}
                className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer transition-colors"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={handleSupervisorApprove}
                className="px-4 py-1.5 rounded-xl bg-[#35BFA3] hover:bg-[#28C2A9] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
              >
                Approve
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleAdminReject}
                className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer transition-colors"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={handleAdminApprove}
                className="px-4 py-1.5 rounded-xl bg-[#35BFA3] hover:bg-[#28C2A9] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
              >
                Approve
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
