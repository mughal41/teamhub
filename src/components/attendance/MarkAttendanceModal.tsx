import * as React from "react";
import { createPortal } from "react-dom";
import {
  X,
  Search,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  User,
  Check,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AttendanceRecord, Employee, getCollection } from "../../lib/db";
import { InteractiveTimePicker } from "./InteractiveTimePicker";
import { TeamHubCalendarPopover } from "./TeamHubCalendarPopover";

export interface MarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkAttendance: (record: AttendanceRecord) => void;
}

export function MarkAttendanceModal({
  isOpen,
  onClose,
  onMarkAttendance,
}: MarkAttendanceModalProps) {
  // Fetch available real employees
  const employees = React.useMemo(() => {
    return getCollection<Employee[]>("db_employees", []);
  }, [isOpen]);

  // Read company attendance configuration (defaults to 2-punch)
  const punchMode = React.useMemo<"2-punch" | "4-punch">(() => {
    const config = localStorage.getItem("hrms_punch_system");
    return (config as "2-punch" | "4-punch") || "2-punch";
  }, [isOpen]);

  // Form State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = React.useState(false);

  // Date state
  const [selectedDate, setSelectedDate] = React.useState("19 Jun 2035");
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [calendarMonth, setCalendarMonth] = React.useState(new Date(2035, 5, 1)); // June 2035

  const dateTriggerRef = React.useRef<HTMLButtonElement>(null);
  const datePopoverRef = React.useRef<HTMLDivElement>(null);

  // Time punches (interactive time pickers)
  const [checkInTime, setCheckInTime] = React.useState("09:00 AM");
  const [checkOutTime, setCheckOutTime] = React.useState("05:00 PM");
  const [breakOutTime, setBreakOutTime] = React.useState("01:00 PM");
  const [breakInTime, setBreakInTime] = React.useState("02:00 PM");

  // Validation errors
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Viewport-aware collision positioning for Date Picker Portal
  const [dateCoords, setDateCoords] = React.useState<{
    top: number;
    left: number;
    placement: "top" | "bottom";
  }>({
    top: 0,
    left: 0,
    placement: "bottom",
  });

  const updateDatePosition = React.useCallback(() => {
    if (!dateTriggerRef.current) return;
    const rect = dateTriggerRef.current.getBoundingClientRect();
    const popoverHeight = 310;
    const popoverWidth = 270;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Viewport-aware collision: flip above if constrained below
    const openAbove = spaceBelow < popoverHeight && spaceAbove > spaceBelow;
    const top = openAbove ? rect.top - popoverHeight - 6 : rect.bottom + 6;

    // Adaptive horizontal placement within safe viewport bounds
    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - popoverWidth - 12);
    } else {
      left = Math.max(12, left);
    }

    setDateCoords({
      top: Math.round(top),
      left: Math.round(left),
      placement: openAbove ? "top" : "bottom",
    });
  }, []);

  React.useEffect(() => {
    if (!isDatePickerOpen) return;

    updateDatePosition();
    window.addEventListener("scroll", updateDatePosition, true);
    window.addEventListener("resize", updateDatePosition);

    return () => {
      window.removeEventListener("scroll", updateDatePosition, true);
      window.removeEventListener("resize", updateDatePosition);
    };
  }, [isDatePickerOpen, updateDatePosition]);

  // Click outside and Escape handling for Date Picker & Employee Combobox
  React.useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as HTMLElement;

      // Employee combobox
      if (!target.closest("[data-emp-picker]")) {
        setIsEmployeeDropdownOpen(false);
      }

      // Date picker popover & trigger
      if (
        isDatePickerOpen &&
        datePopoverRef.current &&
        !datePopoverRef.current.contains(target) &&
        dateTriggerRef.current &&
        !dateTriggerRef.current.contains(target)
      ) {
        setIsDatePickerOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (isDatePickerOpen) {
          e.stopPropagation();
          setIsDatePickerOpen(false);
        } else if (isEmployeeDropdownOpen) {
          e.stopPropagation();
          setIsEmployeeDropdownOpen(false);
        }
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDatePickerOpen, isEmployeeDropdownOpen]);

  // Filtered employees for autocomplete
  const filteredEmployees = React.useMemo(() => {
    if (!searchQuery.trim()) return employees.slice(0, 8);
    const q = searchQuery.toLowerCase();
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.dept?.toLowerCase().includes(q)
    );
  }, [employees, searchQuery]);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedEmployee(null);
      setIsEmployeeDropdownOpen(false);
      setIsDatePickerOpen(false);
      setErrorMessage(null);
      setCheckInTime("09:00 AM");
      setCheckOutTime("05:00 PM");
      setBreakOutTime("01:00 PM");
      setBreakInTime("02:00 PM");
      setCalendarMonth(new Date(2035, 5, 1));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calendar days generator
  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfWeek = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1
  ).getDay();

  const handleSelectDate = (day: number) => {
    const d = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    const formatted = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setSelectedDate(formatted);
    setIsDatePickerOpen(false);
    if (errorMessage) setErrorMessage(null);
  };

  // Convert "09:00 AM" to minutes from midnight for chronology check
  const timeToMinutes = (timeStr: string) => {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return -1;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridian = match[3].toUpperCase();
    if (meridian === "PM" && hours < 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedEmployee) {
      setErrorMessage("Please select an employee.");
      return;
    }
    if (!selectedDate) {
      setErrorMessage("Please select an attendance date.");
      return;
    }
    if (!checkInTime || !checkOutTime) {
      setErrorMessage("Please enter both Check-In and Check-Out times.");
      return;
    }

    const inMin = timeToMinutes(checkInTime);
    const outMin = timeToMinutes(checkOutTime);

    if (inMin < 0 || outMin < 0) {
      setErrorMessage("Please enter valid punch times in HH:MM AM/PM format.");
      return;
    }

    if (punchMode === "4-punch") {
      const boMin = timeToMinutes(breakOutTime);
      const biMin = timeToMinutes(breakInTime);
      if (boMin < 0 || biMin < 0) {
        setErrorMessage("Please enter valid Break-Out and Break-In times.");
        return;
      }
      // Standard chronology: Check-In <= Break-Out <= Break-In <= Check-Out
      if (outMin > inMin) {
        if (boMin < inMin || biMin < boMin || outMin < biMin) {
          setErrorMessage(
            "Punches must follow chronological order: Check-In ≤ Break-Out ≤ Break-In ≤ Check-Out."
          );
          return;
        }
      }
    } else {
      // 2-punch chronology
      if (outMin <= inMin) {
        setErrorMessage("Check-Out time must be later than Check-In time.");
        return;
      }
    }

    setIsSubmitting(true);

    // Calculate duration in hours and minutes
    const diffMin = outMin >= inMin ? outMin - inMin : 24 * 60 - inMin + outMin;
    const durH = Math.floor(diffMin / 60);
    const durM = diffMin % 60;
    const durationStr = `${durH}h ${durM}m`;

    // Determine status based on standard 09:00 AM check-in
    const standardCheckInMin = 9 * 60;
    const isLate = inMin > standardCheckInMin + 5; // 5 min grace period
    const status = isLate ? "Late" : "On-Time";

    const newRecord: AttendanceRecord = {
      id: selectedEmployee.id,
      name: selectedEmployee.name,
      role: selectedEmployee.role,
      subRole: selectedEmployee.dept,
      dept: selectedEmployee.dept,
      date: selectedDate,
      model: selectedEmployee.model || "On-Site",
      in: checkInTime,
      out: checkOutTime,
      duration: durationStr,
      overtime: durH > 8 ? `${durH - 8}h ${durM}m` : "0m",
      status: status,
      avatar: selectedEmployee.avatar,
      correctionRequestsThisMonth: 0,
      comment: "Manually marked by Administrator.",
      forwardedTo: "",
      forwardedStatus: "None",
      hrApprovalStatus: "Approved",
      breakOut: punchMode === "4-punch" ? breakOutTime : undefined,
      breakIn: punchMode === "4-punch" ? breakInTime : undefined,
    };

    onMarkAttendance(newRecord);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mark-attendance-title"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in"
    >
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-[480px] flex flex-col text-left overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3
              id="mark-attendance-title"
              className="font-bold text-base text-[#203430]"
            >
              Mark Attendance
            </h3>
            <p className="text-xs text-[#63716E] mt-0.5">
              Directly record employee attendance punches
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. EMPLOYEE SEARCHABLE COMBOBOX */}
          <div className="relative" data-emp-picker>
            <label className="font-bold text-[#63716E] block mb-1">
              Employee <span className="text-rose-500">*</span>
            </label>

            {selectedEmployee ? (
              <div className="flex items-center justify-between p-2 rounded-xl border border-[#35BFA3] bg-[#F8FCF3]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={selectedEmployee.avatar}
                    alt={selectedEmployee.name}
                    className="h-7 w-7 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-[#203430] truncate">
                      {selectedEmployee.name}
                    </p>
                    <p className="text-[10px] text-[#63716E] truncate">
                      {selectedEmployee.id} • {selectedEmployee.dept}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEmployee(null);
                    setSearchQuery("");
                  }}
                  className="text-xs text-slate-400 hover:text-rose-600 font-semibold px-2 py-1 cursor-pointer"
                >
                  Change
                </button>
              </div>
            ) : (
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsEmployeeDropdownOpen(true);
                    }}
                    onFocus={() => setIsEmployeeDropdownOpen(true)}
                    placeholder="Search employee by name or ID..."
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none text-xs"
                  />
                </div>

                {isEmployeeDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-100 max-h-48 overflow-y-auto z-50 p-1 divide-y divide-slate-50">
                    {filteredEmployees.length === 0 ? (
                      <div className="p-3 text-center text-slate-400 text-xs">
                        No matching employees found
                      </div>
                    ) : (
                      filteredEmployees.map((emp) => (
                        <button
                          key={emp.id}
                          type="button"
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setIsEmployeeDropdownOpen(false);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#F8FCF3] text-left transition-colors cursor-pointer"
                        >
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="h-6 w-6 rounded-full object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-xs text-[#203430] block truncate">
                              {emp.name}
                            </span>
                            <span className="text-[10px] text-[#63716E]">
                              {emp.id} • {emp.dept}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. ATTENDANCE DATE PICKER (PORTAL RENDERING WITH COLLISION DETECTION) */}
          <div className="relative">
            <label className="font-bold text-[#63716E] block mb-1">
              Attendance Date <span className="text-rose-500">*</span>
            </label>
            <button
              ref={dateTriggerRef}
              type="button"
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className={cn(
                "w-full h-9 px-3 rounded-xl border bg-white flex items-center justify-between text-xs text-[#203430] cursor-pointer transition-all",
                isDatePickerOpen
                  ? "border-[#35BFA3] ring-1 ring-[#35BFA3]/20 shadow-xs"
                  : "border-[#E5E6E6] hover:border-slate-300"
              )}
            >
              <span className="font-medium">{selectedDate}</span>
              <CalendarIcon className="h-4 w-4 text-[#35BFA3]" />
            </button>

            {/* Calendar Popover Rendered via Shared TeamHubCalendarPopover */}
            <TeamHubCalendarPopover
              isOpen={isDatePickerOpen}
              onClose={() => setIsDatePickerOpen(false)}
              selectedDate={selectedDate}
              onSelectDate={(newDate) => {
                setSelectedDate(newDate);
                if (errorMessage) setErrorMessage(null);
              }}
              triggerRef={dateTriggerRef}
            />
          </div>

          {/* 3. PUNCH TIMES (MATCHING INTERACTIVE TIME PICKERS) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-[#63716E] block">
                Punch Times
              </label>
              <span className="text-[10px] text-[#63716E]">
                {punchMode === "4-punch" ? "4-Punch Mode" : "2-Punch Mode"}
              </span>
            </div>

            {punchMode === "4-punch" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <InteractiveTimePicker
                  id="punch-check-in"
                  label="Check-In"
                  value={checkInTime}
                  onChange={(t) => {
                    setCheckInTime(t);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  placeholder="09:00 AM"
                />
                <InteractiveTimePicker
                  id="punch-break-out"
                  label="Break-Out"
                  value={breakOutTime}
                  onChange={(t) => {
                    setBreakOutTime(t);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="01:00 PM"
                />
                <InteractiveTimePicker
                  id="punch-break-in"
                  label="Break-In"
                  value={breakInTime}
                  onChange={(t) => {
                    setBreakInTime(t);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="02:00 PM"
                />
                <InteractiveTimePicker
                  id="punch-check-out"
                  label="Check-Out"
                  value={checkOutTime}
                  onChange={(t) => {
                    setCheckOutTime(t);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  placeholder="05:00 PM"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <InteractiveTimePicker
                  id="punch-check-in"
                  label="Check-In"
                  value={checkInTime}
                  onChange={(t) => {
                    setCheckInTime(t);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  placeholder="09:00 AM"
                />
                <InteractiveTimePicker
                  id="punch-check-out"
                  label="Check-Out"
                  value={checkOutTime}
                  onChange={(t) => {
                    setCheckOutTime(t);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  placeholder="05:00 PM"
                />
              </div>
            )}
          </div>

          {/* Modal Footer (Cancel | Mark Attendance) */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-[#E5E6E6] hover:bg-slate-50 font-medium text-xs text-[#203430] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-[#35BFA3] hover:bg-[#28C2A9] text-white font-bold text-xs cursor-pointer shadow-2xs transition-colors"
            >
              {isSubmitting ? "Recording..." : "Mark Attendance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
