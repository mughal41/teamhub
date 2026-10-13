import * as React from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Search,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  ChevronDown,
  Building,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { LeaveActivityItem, Employee, getCollection, saveCollection } from "../../lib/db";

export interface AddLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeaveAdded?: (record: LeaveActivityItem) => void;
}

const LEAVE_TYPES = [
  { id: "Annual Leave", name: "Annual Leave", maxQuota: 20 },
  { id: "Sick Leave", name: "Sick Leave", maxQuota: 10 },
  { id: "Casual Leave", name: "Casual Leave", maxQuota: 5 },
  { id: "Other Leave", name: "Other Leave", maxQuota: 5 },
];

export function AddLeaveModal({ isOpen, onClose, onLeaveAdded }: AddLeaveModalProps) {
  const employees = React.useMemo(() => {
    return getCollection<Employee[]>("db_employees", []);
  }, [isOpen]);

  // Form State
  const [selectedEmpId, setSelectedEmpId] = React.useState<string>("");
  const [empSearchQuery, setEmpSearchQuery] = React.useState<string>("");
  const [isEmpDropdownOpen, setIsEmpDropdownOpen] = React.useState<boolean>(false);
  const [leaveType, setLeaveType] = React.useState<string>("Annual Leave");
  const [startDate, setStartDate] = React.useState<string>("2035-06-25");
  const [endDate, setEndDate] = React.useState<string>("2035-06-27");
  const [durationMode, setDurationMode] = React.useState<"Full Day" | "Half Day">("Full Day");
  const [reason, setReason] = React.useState<string>("");
  const [attachmentName, setAttachmentName] = React.useState<string>("");
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  // Initialize or reset when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (employees.length > 0 && !selectedEmpId) {
        setSelectedEmpId(employees[0].id);
      }
      setEmpSearchQuery("");
      setIsEmpDropdownOpen(false);
      setLeaveType("Annual Leave");
      setStartDate("2035-06-25");
      setEndDate("2035-06-27");
      setDurationMode("Full Day");
      setReason("");
      setAttachmentName("");
      setValidationError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, employees]);

  if (!isOpen) return null;

  const selectedEmployee = employees.find((e) => e.id === selectedEmpId) || employees[0];

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(empSearchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(empSearchQuery.toLowerCase()) ||
      e.dept.toLowerCase().includes(empSearchQuery.toLowerCase())
  );

  // Calculate working days between startDate and endDate
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;
    
    // Count days excluding weekends (Sat/Sun)
    let count = 0;
    const current = new Date(start);
    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    if (durationMode === "Half Day") return 0.5;
    return Math.max(1, count);
  };

  const calculatedDays = calculateDays();

  // Determine available balance for selected employee & leave type
  const allLeaves = getCollection<LeaveActivityItem[]>("db_leaves", []);
  const employeeApprovedLeaves = allLeaves.filter(
    (l) => l.id === selectedEmployee?.id && l.status === "Approved" && l.type === leaveType
  );
  const usedDays = employeeApprovedLeaves.reduce((acc, l) => {
    const d = parseInt(l.duration, 10) || 1;
    return acc + d;
  }, 0);

  const matchedTypeConfig = LEAVE_TYPES.find((t) => t.id === leaveType) || LEAVE_TYPES[0];
  const maxQuota = matchedTypeConfig.maxQuota;
  const availableBalance = Math.max(0, maxQuota - usedDays);
  const projectedRemaining = availableBalance - calculatedDays;
  const isInsufficient = projectedRemaining < 0;

  // Format display period
  const formatPeriodDisplay = () => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const sStr = s.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const eStr = e.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    if (startDate === endDate) return sStr;
    return `${s.getDate()}–${e.getDate()} ${e.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) {
      setValidationError("Please select an employee.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setValidationError("End date cannot be prior to start date.");
      return;
    }
    if (!reason.trim()) {
      setValidationError("Please provide a business or personal reason for manual entry.");
      return;
    }

    setIsSubmitting(true);

    const newRecord: LeaveActivityItem = {
      id: selectedEmployee.id,
      name: selectedEmployee.name,
      role: selectedEmployee.role,
      dept: selectedEmployee.dept,
      type: leaveType,
      submit: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      period: formatPeriodDisplay(),
      duration: durationMode === "Half Day" ? "0.5 Day" : `${calculatedDays} ${calculatedDays === 1 ? "Day" : "Days"}`,
      reason: reason.trim(),
      status: "Approved", // Direct admin creation is authorized & approved without redundant supervisor loop
      avatar: selectedEmployee.avatar,
      remainingQuota: Math.max(0, projectedRemaining),
      totalQuota: maxQuota,
      sickLeavesRemaining: leaveType === "Sick Leave" ? Math.max(0, projectedRemaining) : 5,
      casualLeavesRemaining: leaveType === "Casual Leave" ? Math.max(0, projectedRemaining) : 3,
      annualLeavesRemaining: leaveType === "Annual Leave" ? Math.max(0, projectedRemaining) : 10,
      otherLeavesRemaining: leaveType === "Other Leave" ? Math.max(0, projectedRemaining) : 2,
      startDate: startDate,
      endDate: endDate,
      forwardedTo: "HR Administrator (Direct Entry)",
      forwardedStatus: "Approved",
      comment: "Direct administrative leave allocation.",
      adminComment: "Directly entered and authorized by HR Administrator.",
      adminTimestamp: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      attachmentName: attachmentName || undefined,
      isHalfDay: durationMode === "Half Day",
      paidType: leaveType === "Casual Leave" ? "Unpaid" : "Paid",
    };

    // Save to database
    const currentList = getCollection<LeaveActivityItem[]>("db_leaves", []);
    const updatedList = [newRecord, ...currentList];
    saveCollection("db_leaves", updatedList);

    if (onLeaveAdded) {
      onLeaveAdded(newRecord);
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 sm:p-4 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EBECEB] flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-[17px] font-bold text-[#203430] tracking-[-0.03em]">
              Add Leave
            </h2>
            <p className="text-[11px] text-[#63716E]">
              Direct administrative employee leave recording and schedule booking
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-left flex-1 min-h-0">
          {validationError && (
            <div className="p-3 bg-red-50 text-[#E63D4B] rounded-xl border border-red-200 text-[11px] font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. Employee Selector */}
          <div className="space-y-1.5 relative">
            <label className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block">
              Employee Selection <span className="text-[#E63D4B]">*</span>
            </label>

            {/* Selected Employee Preview / Dropdown Button */}
            <div
              onClick={() => setIsEmpDropdownOpen(!isEmpDropdownOpen)}
              className="p-3 bg-[#F7F7F7] hover:bg-slate-100/70 rounded-xl border border-[#EBECEB] flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={selectedEmployee?.avatar}
                  alt={selectedEmployee?.name}
                  className="h-9 w-9 rounded-full object-cover shrink-0 border border-[#35BFA3]/30"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#203430] truncate">
                      {selectedEmployee?.name}
                    </span>
                    <span className="text-[10px] font-bold text-[#0E4D41] bg-[#E4F2D3] px-1.5 py-0.5 rounded">
                      {selectedEmployee?.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#63716E] truncate">
                    {selectedEmployee?.role} • {selectedEmployee?.dept}
                  </p>
                </div>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-[#63716E] transition-transform", isEmpDropdownOpen && "rotate-180")} />
            </div>

            {/* Searchable Dropdown Popover */}
            {isEmpDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-[#EBECEB] p-2 z-30 max-h-56 overflow-y-auto">
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#63716E]" />
                  <input
                    type="text"
                    value={empSearchQuery}
                    onChange={(e) => setEmpSearchQuery(e.target.value)}
                    placeholder="Search by name, ID, or department..."
                    className="w-full pl-8 pr-3 py-1.5 text-[11px] bg-[#F7F7F7] rounded-lg border border-[#EBECEB] focus:outline-none focus:ring-1 focus:ring-[#35BFA3]"
                    autoFocus
                  />
                </div>
                <div className="space-y-1">
                  {filteredEmployees.map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => {
                        setSelectedEmpId(emp.id);
                        setIsEmpDropdownOpen(false);
                        setEmpSearchQuery("");
                      }}
                      className={cn(
                        "w-full text-left p-2 rounded-lg text-[11px] flex items-center justify-between hover:bg-[#E4F2D3]/40 transition-colors cursor-pointer",
                        selectedEmpId === emp.id && "bg-[#E4F2D3] font-bold text-[#0E4D41]"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img src={emp.avatar} alt={emp.name} className="h-6 w-6 rounded-full object-cover shrink-0" />
                        <span className="truncate">{emp.name}</span>
                        <span className="text-[#63716E] text-[10px]">({emp.id})</span>
                      </div>
                      <span className="text-[10px] text-[#63716E] shrink-0">{emp.dept}</span>
                    </button>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <p className="text-center text-[11px] text-[#63716E] py-3">No matching employees found</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 2. Leave Type & Duration Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block">
                Leave Category <span className="text-[#E63D4B]">*</span>
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full text-[12px] font-semibold text-[#203430] bg-[#F7F7F7] border border-[#EBECEB] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#35BFA3]"
              >
                {LEAVE_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (Max {t.maxQuota} days)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block">
                Working Day Scope <span className="text-[#E63D4B]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDurationMode("Full Day")}
                  className={cn(
                    "py-2 px-3 rounded-xl text-[12px] font-bold border transition-colors cursor-pointer text-center",
                    durationMode === "Full Day"
                      ? "bg-[#E4F2D3] text-[#0E4D41] border-[#35BFA3]"
                      : "bg-[#F7F7F7] text-[#63716E] border-[#EBECEB] hover:bg-slate-100"
                  )}
                >
                  Full Day
                </button>
                <button
                  type="button"
                  onClick={() => setDurationMode("Half Day")}
                  className={cn(
                    "py-2 px-3 rounded-xl text-[12px] font-bold border transition-colors cursor-pointer text-center",
                    durationMode === "Half Day"
                      ? "bg-[#E4F2D3] text-[#0E4D41] border-[#35BFA3]"
                      : "bg-[#F7F7F7] text-[#63716E] border-[#EBECEB] hover:bg-slate-100"
                  )}
                >
                  Half Day
                </button>
              </div>
            </div>
          </div>

          {/* 3. Dates (Start Date & End Date) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block">
                Start Date <span className="text-[#E63D4B]">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-[#35BFA3]" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (e.target.value > endDate) setEndDate(e.target.value);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-[12px] font-semibold text-[#203430] bg-[#F7F7F7] border border-[#EBECEB] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#35BFA3]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block">
                End Date <span className="text-[#E63D4B]">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-[#35BFA3]" />
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-[12px] font-semibold text-[#203430] bg-[#F7F7F7] border border-[#EBECEB] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#35BFA3]"
                  required
                />
              </div>
            </div>
          </div>

          {/* 4. Dynamic Leave Balance Breakdown Widget */}
          <div className="p-3.5 bg-white rounded-xl border border-[#EBECEB] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#203430] uppercase tracking-wider">
                Leave Balance Assessment
              </span>
              <span className="text-[#63716E]">
                Excludes weekends & public holidays
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-[#EBECEB]">
              <div className="p-1.5 bg-[#F7F7F7] rounded-lg">
                <span className="text-[10px] text-[#63716E] block">Available</span>
                <span className="text-[14px] font-bold text-[#203430]">{availableBalance} Days</span>
              </div>
              <div className="p-1.5 bg-[#E4F2D3] rounded-lg">
                <span className="text-[10px] text-[#0E4D41] block">Requested</span>
                <span className="text-[14px] font-bold text-[#0E4D41]">{calculatedDays} Days</span>
              </div>
              <div className={cn("p-1.5 rounded-lg", isInsufficient ? "bg-red-50 text-[#E63D4B]" : "bg-[#F7F7F7] text-[#35BFA3]")}>
                <span className="text-[10px] text-[#63716E] block">Remaining</span>
                <span className="text-[14px] font-bold">{projectedRemaining} Days</span>
              </div>
            </div>

            {isInsufficient && (
              <p className="text-[10px] font-bold text-[#E63D4B] flex items-center gap-1 pt-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                Requested leave duration exceeds remaining quota for {selectedEmployee?.name}.
              </p>
            )}
          </div>

          {/* 5. Written Justification Reason */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block">
              Reason / Administrative Notes <span className="text-[#E63D4B]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (validationError) setValidationError(null);
              }}
              rows={2}
              placeholder="Record the official reason for logging this leave on the employee's behalf..."
              className="w-full text-[12px] text-[#203430] bg-[#F7F7F7] border border-[#EBECEB] rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#35BFA3] resize-none"
              required
            />
          </div>

          {/* 6. Supporting Document Attachment (Optional) */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block">
              Supporting Documentation (Optional)
            </label>
            <div className="flex items-center gap-2">
              <label className="flex-1 border border-dashed border-[#EBECEB] hover:border-[#35BFA3] bg-[#F7F7F7] rounded-xl p-2.5 flex items-center justify-between cursor-pointer transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <Upload className="h-4 w-4 text-[#35BFA3] shrink-0" />
                  <span className="text-[11px] text-[#63716E] truncate">
                    {attachmentName ? attachmentName : "Upload medical note or authorization slip (PDF, PNG)..."}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#0E4D41] bg-[#E4F2D3] px-2 py-0.5 rounded shrink-0">
                  Browse
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setAttachmentName(file.name);
                  }}
                />
              </label>
              {attachmentName && (
                <button
                  type="button"
                  onClick={() => setAttachmentName("")}
                  className="p-2 text-[#63716E] hover:text-[#E63D4B] rounded-lg hover:bg-red-50"
                  title="Remove attachment"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Administrative Direct Approval Notice */}
          <div className="p-3 bg-[#E4F2D3]/40 rounded-xl border border-[#35BFA3]/20 flex items-center gap-2 text-[11px] text-[#0E4D41]">
            <ShieldCheck className="h-4 w-4 text-[#35BFA3] shrink-0" />
            <span>Direct Admin Entry: This record will be authorized immediately and synced with the active calendar.</span>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-[#EBECEB] flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#EBECEB] bg-white hover:bg-slate-50 text-[#63716E] font-semibold text-[12px] rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#35BFA3] hover:bg-[#2ea88f] text-white font-bold text-[12px] rounded-lg cursor-pointer shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="h-4 w-4" />
              {isSubmitting ? "Recording..." : "Add Leave"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
