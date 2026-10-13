import * as React from "react";
import {
  X,
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Building,
  ShieldCheck,
  Download,
  Paperclip,
  Check,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { LeaveActivityItem, Employee, getCollection, saveCollection } from "../../lib/db";

export interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: LeaveActivityItem | null;
  onApprove?: (record: LeaveActivityItem, remark?: string) => void;
  onReject?: (record: LeaveActivityItem, remark: string) => void;
}

export function LeaveReviewModal({
  isOpen,
  onClose,
  record,
  onApprove,
  onReject,
}: LeaveReviewModalProps) {
  const [adminRemark, setAdminRemark] = React.useState("");
  const [remarkError, setRemarkError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showConfirmAction, setShowConfirmAction] = React.useState<"approve" | "reject" | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setAdminRemark("");
      setRemarkError(null);
      setShowConfirmAction(null);
      setIsSubmitting(false);
    }
  }, [isOpen, record?.id]);

  if (!isOpen || !record) return null;

  const isFinalized = record.status === "Approved" || record.status === "Rejected" || record.status === "Cancelled";

  // Resolve employee full directory info for leave quotas & supervisor
  const allEmployees = getCollection<Employee[]>("db_employees", []);
  const employeeInfo = allEmployees.find(
    (e) => e.id === record.id || e.name.toLowerCase() === record.name.toLowerCase()
  );

  // Leave balance calculations
  const totalAllowance = record.totalQuota ?? 20;
  let availableBalance = record.remainingQuota ?? 10;
  if (record.type === "Sick Leave" && record.sickLeavesRemaining !== undefined) {
    availableBalance = record.sickLeavesRemaining;
  } else if (record.type === "Annual Leave" && record.annualLeavesRemaining !== undefined) {
    availableBalance = record.annualLeavesRemaining;
  } else if (record.type === "Casual Leave" && record.casualLeavesRemaining !== undefined) {
    availableBalance = record.casualLeavesRemaining;
  } else if (record.type === "Other Leave" && record.otherLeavesRemaining !== undefined) {
    availableBalance = record.otherLeavesRemaining;
  }

  // Parse days from duration string (e.g. "3 Days" -> 3, "1 Day" -> 1)
  const durationDays = parseInt(record.duration, 10) || 1;
  const projectedBalance = Math.max(0, availableBalance - durationDays);

  // Supervisor resolution
  const supervisorName = record.supervisorName || record.forwardedTo || "Jane Doe";
  const supervisorRole = record.supervisorRole || "Reporting Lead";
  const supervisorStatus = record.supervisorStatus || (record.forwardedStatus === "Approved" ? "Approved" : record.forwardedStatus === "Rejected" ? "Rejected" : "Pending");
  const supervisorRemarks = record.supervisorComment || (supervisorStatus === "Approved" ? "Verified operational work plan coverage during absence window." : "Awaiting departmental handoff verification.");

  // Conflict detection
  const allLeaves = getCollection<LeaveActivityItem[]>("db_leaves", []);
  const overlappingConflict = allLeaves.find(
    (l) =>
      l.id === record.id &&
      l.submit !== record.submit &&
      l.status === "Approved" &&
      l.startDate === record.startDate
  );
  const isInsufficientBalance = availableBalance < durationDays;

  const handleApprove = () => {
    setIsSubmitting(true);
    const updated: LeaveActivityItem = {
      ...record,
      status: "Approved",
      adminComment: adminRemark.trim() || "Approved by HR Administrator.",
      adminTimestamp: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      remainingQuota: projectedBalance,
    };

    // Update in database
    const currentList = getCollection<LeaveActivityItem[]>("db_leaves", []);
    const nextList = currentList.map((item) =>
      item.id === record.id && item.submit === record.submit && item.period === record.period ? updated : item
    );
    saveCollection("db_leaves", nextList);

    if (onApprove) onApprove(updated, adminRemark.trim());
    setIsSubmitting(false);
    setShowConfirmAction(null);
    onClose();
  };

  const handleReject = () => {
    if (!adminRemark.trim()) {
      setRemarkError("A written justification remark is required when rejecting a leave request.");
      setShowConfirmAction(null);
      return;
    }
    setIsSubmitting(true);
    const updated: LeaveActivityItem = {
      ...record,
      status: "Rejected",
      adminComment: adminRemark.trim(),
      adminTimestamp: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    // Update in database
    const currentList = getCollection<LeaveActivityItem[]>("db_leaves", []);
    const nextList = currentList.map((item) =>
      item.id === record.id && item.submit === record.submit && item.period === record.period ? updated : item
    );
    saveCollection("db_leaves", nextList);

    if (onReject) onReject(updated, adminRemark.trim());
    setIsSubmitting(false);
    setShowConfirmAction(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 sm:p-4 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EBECEB] flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-[17px] font-bold text-[#203430] tracking-[-0.03em]">
              Leave Request
            </h2>
            <p className="text-[11px] text-[#63716E]">
              Official employee absence application and authorization review
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#63716E] hover:text-[#203430] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-left flex-1 min-h-0">
          {/* Employee Identity Card */}
          <div className="p-3.5 bg-[#F7F7F7] rounded-xl border border-[#EBECEB] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={record.avatar || employeeInfo?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"}
                alt={record.name}
                className="h-11 w-11 rounded-full object-cover shrink-0 border border-[#35BFA3]/30"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold text-[#203430] truncate">
                    {record.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-[#0E4D41] bg-[#E4F2D3] px-2 py-0.5 rounded-md">
                    {record.id}
                  </span>
                </div>
                <p className="text-[11px] text-[#63716E] truncate">
                  {record.role || employeeInfo?.role || "Staff Member"} • {record.dept || employeeInfo?.dept || "Corporate"}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="shrink-0">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-[11px] font-bold tracking-tight inline-flex items-center gap-1",
                  record.status === "Approved"
                    ? "bg-[#35BFA3] text-white"
                    : record.status === "Rejected"
                    ? "bg-[#E63D4B] text-white"
                    : "bg-[#E4F2D3] text-[#0E4D41] border border-[#35BFA3]/30"
                )}
              >
                {record.status === "Approved" && <Check className="h-3 w-3 stroke-[3]" />}
                {record.status === "Rejected" && <X className="h-3 w-3 stroke-[3]" />}
                {record.status === "Pending" && <Clock className="h-3 w-3" />}
                {record.status}
              </span>
            </div>
          </div>

          {/* Leave Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 bg-white rounded-lg border border-[#EBECEB]">
              <span className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider block mb-0.5">
                Leave Type
              </span>
              <span className="text-[12px] font-bold text-[#203430] block truncate">
                {record.type}
              </span>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-[#EBECEB]">
              <span className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider block mb-0.5">
                Submitted
              </span>
              <span className="text-[12px] font-semibold text-[#203430] block truncate">
                {record.submit}
              </span>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-[#EBECEB]">
              <span className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider block mb-0.5">
                Duration
              </span>
              <span className="text-[12px] font-bold text-[#0E4D41] block truncate">
                {record.duration}
              </span>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-[#EBECEB]">
              <span className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider block mb-0.5">
                Classification
              </span>
              <span className="text-[12px] font-semibold text-[#203430] block truncate">
                {record.paidType || (record.type === "Casual Leave" ? "Unpaid" : "Paid")}
              </span>
            </div>
          </div>

          {/* Period Range */}
          <div className="p-3 bg-white rounded-xl border border-[#EBECEB] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px]">
              <Calendar className="h-4 w-4 text-[#35BFA3] shrink-0" />
              <span className="text-[#63716E]">Scheduled Leave Window:</span>
              <span className="font-bold text-[#203430]">{record.period}</span>
            </div>
            <span className="text-[11px] font-semibold text-[#0E4D41] bg-[#E4F2D3] px-2 py-0.5 rounded">
              {record.isHalfDay ? "Half Day" : "Full Working Days"}
            </span>
          </div>

          {/* Employee's Written Reason */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block">
              Employee Statement / Reason
            </label>
            <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#EBECEB] text-[12px] text-[#203430] leading-relaxed">
              {record.reason ? record.reason : "No formal written commentary provided."}
            </div>
          </div>

          {/* Supporting Document / Attachments */}
          {(record.attachment || record.attachmentName || record.reason?.toLowerCase().includes("doctor") || record.reason?.toLowerCase().includes("attached")) && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block">
                Supporting Documentation
              </label>
              <div className="p-3 bg-white rounded-xl border border-[#EBECEB] flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 bg-[#E4F2D3] rounded-lg text-[#0E4D41]">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-[#203430] truncate">
                      {record.attachmentName || "medical_clearance_record.pdf"}
                    </p>
                    <p className="text-[10px] text-[#63716E]">
                      Authorized Medical Verification Document • 1.4 MB
                    </p>
                  </div>
                </div>
                <a
                  href="#download"
                  onClick={(e) => {
                    e.preventDefault();
                    const blob = new Blob([`Official Verification Note for ${record.name}\nLeave Type: ${record.type}\nPeriod: ${record.period}\nReason: ${record.reason}`], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = record.attachmentName || "medical_clearance_record.txt";
                    a.click();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#E4F2D3] hover:bg-[#d8ecbe] text-[#0E4D41] rounded-lg text-[11px] font-bold transition-colors cursor-pointer shrink-0"
                >
                  <Download className="h-3 w-3" />
                  View Attachment
                </a>
              </div>
            </div>
          )}

          {/* Leave Balance Quota Breakdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block">
              Leave Balance & Policy Quota
            </label>
            <div className="p-3.5 bg-white rounded-xl border border-[#EBECEB] grid grid-cols-3 gap-3 text-center">
              <div className="border-r border-[#EBECEB] pr-2">
                <span className="text-[10px] text-[#63716E] block mb-0.5">Available Balance</span>
                <span className="text-[16px] font-bold text-[#203430]">{availableBalance} Days</span>
              </div>
              <div className="border-r border-[#EBECEB] pr-2">
                <span className="text-[10px] text-[#63716E] block mb-0.5">Requested Duration</span>
                <span className="text-[16px] font-bold text-[#0E4D41]">{durationDays} Days</span>
              </div>
              <div>
                <span className="text-[10px] text-[#63716E] block mb-0.5">Projected Remaining</span>
                <span className={cn("text-[16px] font-bold", isInsufficientBalance ? "text-[#E63D4B]" : "text-[#35BFA3]")}>
                  {projectedBalance} Days
                </span>
              </div>
            </div>

            {/* Conflict Warnings */}
            {isInsufficientBalance && (
              <div className="p-2.5 bg-red-50 text-[#E63D4B] rounded-lg border border-red-200 flex items-center gap-2 text-[11px] font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Notice: Requested duration exceeds current standard available balance quota.</span>
              </div>
            )}
            {overlappingConflict && (
              <div className="p-2.5 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 flex items-center gap-2 text-[11px] font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Warning: Conflicting existing leave record found for this employee on the requested dates.</span>
              </div>
            )}
          </div>

          {/* Supervisor Review Section */}
          <div className="p-3.5 bg-[#F7F7F7] rounded-xl border border-[#EBECEB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#203430] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#35BFA3]" />
                Supervisor Review
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold",
                  supervisorStatus === "Approved"
                    ? "bg-[#E4F2D3] text-[#0E4D41]"
                    : supervisorStatus === "Rejected"
                    ? "bg-red-100 text-[#E63D4B]"
                    : "bg-amber-100 text-amber-800"
                )}
              >
                {supervisorStatus}
              </span>
            </div>
            <div className="text-[12px] text-[#203430] flex items-center justify-between">
              <span className="font-semibold text-[#63716E]">Assigned Supervisor:</span>
              <span className="font-bold text-[#203430]">{supervisorName} ({supervisorRole})</span>
            </div>
            <div className="text-[11px] text-[#63716E] italic bg-white p-2.5 rounded-lg border border-[#EBECEB]">
              "{supervisorRemarks}"
            </div>
            {record.supervisorTimestamp && (
              <p className="text-[10px] text-[#63716E] text-right">
                Logged: {record.supervisorTimestamp}
              </p>
            )}
          </div>

          {/* HR / Admin Final Review & Decision */}
          {!isFinalized ? (
            <div className="p-3.5 bg-white rounded-xl border border-[#35BFA3]/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#0E4D41] uppercase tracking-wider">
                  HR / Admin Final Decision
                </span>
                <span className="text-[10px] text-[#63716E]">
                  Action committed with administrative authorization
                </span>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#203430] block mb-1">
                  HR / Admin Review Remarks {showConfirmAction === "reject" && <span className="text-[#E63D4B] font-bold">*</span>}
                </label>
                <textarea
                  value={adminRemark}
                  onChange={(e) => {
                    setAdminRemark(e.target.value);
                    if (remarkError) setRemarkError(null);
                  }}
                  rows={2}
                  placeholder="Enter administrative review notes (mandatory when rejecting, optional when approving)..."
                  className={cn(
                    "w-full text-[12px] text-[#203430] bg-[#F7F7F7] border rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-[#35BFA3] resize-none",
                    remarkError ? "border-[#E63D4B]" : "border-[#EBECEB]"
                  )}
                />
                {remarkError && (
                  <p className="text-[10px] text-[#E63D4B] mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {remarkError}
                  </p>
                )}
              </div>

              {/* Confirmation Prompt if action triggered */}
              {showConfirmAction && (
                <div className="p-3 rounded-lg border bg-[#F7F7F7] flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="text-[11px] text-[#203430]">
                    <span className="font-bold">Confirm {showConfirmAction === "approve" ? "Approval" : "Rejection"}?</span>
                    <p className="text-[#63716E]">
                      This will finalize the request for {record.name} ({record.duration}).
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowConfirmAction(null)}
                      className="px-2.5 py-1 text-[11px] font-bold text-[#63716E] hover:bg-slate-200 rounded-md cursor-pointer"
                    >
                      Cancel
                    </button>
                    {showConfirmAction === "approve" ? (
                      <button
                        type="button"
                        onClick={handleApprove}
                        disabled={isSubmitting}
                        className="px-3 py-1 bg-[#35BFA3] hover:bg-[#2ea88f] text-white rounded-md text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        {isSubmitting ? "Processing..." : "Confirm Approve"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleReject}
                        disabled={isSubmitting}
                        className="px-3 py-1 bg-[#E63D4B] hover:bg-red-700 text-white rounded-md text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        {isSubmitting ? "Processing..." : "Confirm Reject"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3.5 bg-[#F7F7F7] rounded-xl border border-[#EBECEB] space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#203430] uppercase tracking-wider">
                  Final Decision Recorded
                </span>
                <span className="font-bold text-[#0E4D41] bg-[#E4F2D3] px-2 py-0.5 rounded">
                  {record.adminTimestamp || "Recorded"}
                </span>
              </div>
              <p className="text-[12px] text-[#203430]">
                {record.adminComment || (record.status === "Approved" ? "Leave application approved by administrator." : "Leave request rejected.")}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 border-t border-[#EBECEB] bg-[#F7F7F7] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#EBECEB] bg-white hover:bg-slate-50 text-[#63716E] font-semibold text-[12px] rounded-lg cursor-pointer transition-colors"
          >
            Close
          </button>

          {!isFinalized && !showConfirmAction && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!adminRemark.trim()) {
                    setRemarkError("Please write a reason remark before rejecting.");
                    return;
                  }
                  setShowConfirmAction("reject");
                }}
                className="px-4 py-2 border border-[#E63D4B] text-[#E63D4B] hover:bg-red-50 font-bold text-[12px] rounded-lg cursor-pointer transition-colors"
              >
                Reject Request
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmAction("approve")}
                className="px-4 py-2 bg-[#35BFA3] hover:bg-[#2ea88f] text-white font-bold text-[12px] rounded-lg cursor-pointer shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Check className="h-4 w-4 stroke-[2.5]" />
                Approve Leave
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
