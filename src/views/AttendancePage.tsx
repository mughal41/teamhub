import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  Search,
  Check,
  X,
  Clock,
  ChevronsUpDown,
  Plus,
  MessageSquare,
  CornerUpRight,
  ShieldCheck,
  Instagram,
  Linkedin,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import {
  getCollection,
  saveCollection,
  initialAttendance,
  initialLeaves,
  AttendanceRecord,
  LeaveActivityItem,
} from "../lib/db";
import { AttendanceCorrectionModal } from "../components/attendance/AttendanceCorrectionModal";
import { MarkAttendanceModal } from "../components/attendance/MarkAttendanceModal";
import {
  AttendanceOverviewChart,
  ChartFilterSelection,
} from "../components/attendance/AttendanceOverviewChart";

// Social media icon for X
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const managersList = [
  { name: "Marcus Brody", role: "Marketing & Sales Manager" },
  { name: "Sophia Chen", role: "Lead UI/UX Architect" },
  { name: "Zara Patel", role: "Operations Director" },
  { name: "Leila Vance", role: "HR Senior Supervisor" },
  { name: "David Vance", role: "Customer Support Head" },
];

export default function AttendancePage() {
  const navigate = useNavigate();

  // Load records from db_attendance, defaulting to initialAttendance from Figma design
  const [records, setRecordsState] = React.useState<AttendanceRecord[]>(() => {
    const stored = getCollection<AttendanceRecord[]>("db_attendance", []);
    return stored.length > 0 ? stored : initialAttendance;
  });

  const setRecords = (
    update: AttendanceRecord[] | ((prev: AttendanceRecord[]) => AttendanceRecord[])
  ) => {
    if (typeof update === "function") {
      setRecordsState((prev) => {
        const next = update(prev);
        saveCollection("db_attendance", next);
        return next;
      });
    } else {
      setRecordsState(update);
      saveCollection("db_attendance", update);
    }
  };

  React.useEffect(() => {
    const handleDbUpdate = () => {
      const stored = getCollection<AttendanceRecord[]>("db_attendance", []);
      setRecordsState(stored.length > 0 ? stored : initialAttendance);
    };
    window.addEventListener("db_updated", handleDbUpdate);
    window.addEventListener("storage", handleDbUpdate);
    return () => {
      window.removeEventListener("db_updated", handleDbUpdate);
      window.removeEventListener("storage", handleDbUpdate);
    };
  }, []);

  // Toast feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Controls state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<string>("All");
  const [filterModel, setFilterModel] = React.useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<string>("Name");
  const [isSortOpen, setIsSortOpen] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  // Chart-derived table filter state
  const [chartFilter, setChartFilter] = React.useState<ChartFilterSelection | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [isPageSizeOpen, setIsPageSizeOpen] = React.useState(false);

  // Modal State
  const [selectedRequest, setSelectedRequest] = React.useState<AttendanceRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");
  const [forwardTo, setForwardTo] = React.useState("");
  const [editIn, setEditIn] = React.useState("");
  const [editOut, setEditOut] = React.useState("");

  // Apply Attendance / Mark Attendance Modal
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);

  // Active daily date scope for KPI cards (defaults to canonical operational date June 19, 2035)
  const activeDailyDate = React.useMemo(() => {
    return records[0]?.date || "19 Jun 2035";
  }, [records]);

  // Yesterday date calculation (e.g. "19 Jun 2035" -> "18 Jun 2035")
  const yesterdayDateStr = React.useMemo(() => {
    const match = activeDailyDate.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (match) {
      const d = parseInt(match[1], 10);
      const mStr = match[2];
      const y = parseInt(match[3], 10);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const mIdx = monthNames.findIndex((m) => mStr.toLowerCase().startsWith(m.toLowerCase()));
      if (mIdx >= 0) {
        const dateObj = new Date(y, mIdx, d);
        dateObj.setDate(dateObj.getDate() - 1);
        return dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      }
    }
    return "18 Jun 2035";
  }, [activeDailyDate]);

  // Read leaves collection from db_leaves / initialLeaves
  const leaves = React.useMemo(() => {
    const stored = getCollection<LeaveActivityItem[]>("db_leaves", []);
    return stored.length > 0 ? stored : initialLeaves;
  }, []);

  // Filter records for active date & yesterday
  const recordsToday = React.useMemo(() => {
    return records.filter((r) => r.date === activeDailyDate);
  }, [records, activeDailyDate]);

  const recordsYesterday = React.useMemo(() => {
    return records.filter((r) => r.date === yesterdayDateStr);
  }, [records, yesterdayDateStr]);

  // 1. DATA-DRIVEN PRESENT CARD METRICS
  const presentMetrics = React.useMemo(() => {
    const onTimeSet = new Set<string>();
    const lateSet = new Set<string>();

    recordsToday.forEach((r) => {
      if (r.status === "On-Time") {
        onTimeSet.add(r.id);
      } else if (r.status === "Late" && !onTimeSet.has(r.id)) {
        lateSet.add(r.id);
      }
    });

    const onTimeCount = onTimeSet.size;
    const lateCount = lateSet.size;
    const presentCount = onTimeCount + lateCount;

    // Yesterday comparison from actual historical records
    let vsYesterday: { diff: number; label: string; isPositive: boolean; isNeutral: boolean } | null = null;
    if (recordsYesterday.length > 0) {
      const yOnTimeSet = new Set<string>();
      const yLateSet = new Set<string>();
      recordsYesterday.forEach((r) => {
        if (r.status === "On-Time") yOnTimeSet.add(r.id);
        else if (r.status === "Late" && !yOnTimeSet.has(r.id)) yLateSet.add(r.id);
      });
      const yPresentCount = yOnTimeSet.size + yLateSet.size;
      const diff = presentCount - yPresentCount;
      vsYesterday = {
        diff,
        label: diff > 0 ? `+${diff}` : `${diff}`,
        isPositive: diff > 0,
        isNeutral: diff === 0,
      };
    }

    return { onTimeCount, lateCount, presentCount, vsYesterday };
  }, [recordsToday, recordsYesterday]);

  // 2. DATA-DRIVEN ON LEAVE CARD METRICS
  const onLeaveMetrics = React.useMemo(() => {
    const annualSet = new Set<string>();
    const sickSet = new Set<string>();
    const othersSet = new Set<string>();

    // Check attendance records with status === "On Leave"
    recordsToday.forEach((r) => {
      if (r.status === "On Leave") {
        const comment = (r.comment || "").toLowerCase();
        if (comment.includes("sick")) {
          sickSet.add(r.id);
        } else if (comment.includes("annual")) {
          annualSet.add(r.id);
        } else {
          othersSet.add(r.id);
        }
      }
    });

    // Check leaves collection with approved status covering active date
    leaves.forEach((l) => {
      if (l.status === "Approved") {
        const matchesDate =
          (l.startDate && l.endDate && "2035-06-19" >= l.startDate && "2035-06-19" <= l.endDate) ||
          (l.period && l.period.includes("19 Jun")) ||
          (l.period && l.period.includes("17-21 June 2035"));

        if (matchesDate) {
          const lType = (l.type || "").toLowerCase();
          if (lType.includes("annual")) {
            annualSet.add(l.id);
          } else if (lType.includes("sick")) {
            sickSet.add(l.id);
          } else {
            othersSet.add(l.id);
          }
        }
      }
    });

    const annualCount = annualSet.size;
    const sickCount = sickSet.size;
    const othersCount = othersSet.size;
    const onLeaveCount = annualCount + sickCount + othersCount;

    // Yesterday comparison from actual historical records
    let vsYesterday: { diff: number; label: string; isPositive: boolean; isNeutral: boolean } | null = null;
    if (recordsYesterday.length > 0) {
      const yLeaveSet = new Set<string>();
      recordsYesterday.forEach((r) => {
        if (r.status === "On Leave") yLeaveSet.add(r.id);
      });
      const diff = onLeaveCount - yLeaveSet.size;
      vsYesterday = {
        diff,
        label: diff > 0 ? `+${diff}` : `${diff}`,
        isPositive: diff > 0,
        isNeutral: diff === 0,
      };
    }

    return { annualCount, sickCount, othersCount, onLeaveCount, vsYesterday };
  }, [recordsToday, recordsYesterday, leaves]);

  // 3. DATA-DRIVEN ABSENT CARD METRICS
  const absentMetrics = React.useMemo(() => {
    const absentSet = new Set<string>();
    recordsToday.forEach((r) => {
      if (r.status === "Absent") {
        absentSet.add(r.id);
      }
    });

    const absentCount = absentSet.size;

    // Yesterday comparison from actual historical records
    let vsYesterday: { diff: number; label: string; isPositive: boolean; isNeutral: boolean } | null = null;
    if (recordsYesterday.length > 0) {
      const yAbsentSet = new Set<string>();
      recordsYesterday.forEach((r) => {
        if (r.status === "Absent") yAbsentSet.add(r.id);
      });
      const diff = absentCount - yAbsentSet.size;
      vsYesterday = {
        diff,
        label: diff > 0 ? `+${diff}` : `${diff}`,
        isPositive: diff < 0, // Fewer absences is positive
        isNeutral: diff === 0,
      };
    }

    return { absentCount, vsYesterday };
  }, [recordsToday, recordsYesterday]);

  // Close popovers on click outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown-container]")) {
        setIsFilterOpen(false);
        setIsSortOpen(false);
        setIsPageSizeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter & Sort Logic with Chart-to-Table synchronization
  const filteredRecords = React.useMemo(() => {
    return records.filter((rec) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        String(rec.name || "").toLowerCase().includes(q) ||
        String(rec.id || "").toLowerCase().includes(q) ||
        String(rec.role || "").toLowerCase().includes(q) ||
        String(rec.dept || "").toLowerCase().includes(q);

      const matchesStatus =
        filterStatus === "All" || rec.status?.toLowerCase() === filterStatus.toLowerCase();

      const matchesModel =
        filterModel === "All" || rec.model?.toLowerCase() === filterModel.toLowerCase();

      // Chart-derived synchronization filter
      let matchesChart = true;
      if (chartFilter) {
        if (chartFilter.status && chartFilter.status !== "All") {
          if (chartFilter.status === "Present") {
            matchesChart = rec.status === "On-Time" || rec.status === "Late";
          } else {
            matchesChart = rec.status?.toLowerCase() === chartFilter.status.toLowerCase();
          }
        }
        if (matchesChart && chartFilter.startDate && chartFilter.endDate) {
          const matchDate = rec.date?.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
          if (matchDate) {
            const day = parseInt(matchDate[1], 10);
            const mStr = matchDate[2].toLowerCase();
            const year = parseInt(matchDate[3], 10);
            const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
            const mIdx = monthNames.findIndex((m) => mStr.startsWith(m));
            if (mIdx >= 0) {
              const recD = new Date(year, mIdx, day);
              const sD = new Date(chartFilter.startDate);
              const eD = new Date(chartFilter.endDate);
              matchesChart = recD >= sD && recD <= eD;
            }
          }
        }
      }

      return matchesSearch && matchesStatus && matchesModel && matchesChart;
    });
  }, [records, searchQuery, filterStatus, filterModel, chartFilter]);

  const sortedRecords = React.useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let result = 0;
      if (sortBy === "Name") {
        result = String(a.name || "").localeCompare(String(b.name || ""));
      } else if (sortBy === "Job Title") {
        result = String(a.role || "").localeCompare(String(b.role || ""));
      } else if (sortBy === "Date") {
        result = String(a.date || "").localeCompare(String(b.date || ""));
      } else if (sortBy === "Work Model") {
        result = String(a.model || "").localeCompare(String(b.model || ""));
      } else if (sortBy === "Check In - Out") {
        result = String(a.in || "").localeCompare(String(b.in || ""));
      } else if (sortBy === "Duration") {
        result = String(a.duration || "").localeCompare(String(b.duration || ""));
      } else if (sortBy === "Overtime") {
        result = String(a.overtime || "").localeCompare(String(b.overtime || ""));
      } else if (sortBy === "Status") {
        result = String(a.status || "").localeCompare(String(b.status || ""));
      }
      return sortOrder === "asc" ? result : -result;
    });
  }, [filteredRecords, sortBy, sortOrder]);

  // Paginated records
  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const paginatedRecords = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  // Handle column header sort click
  const handleSortClick = (columnName: string) => {
    if (sortBy === columnName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnName);
      setSortOrder("asc");
    }
  };

  // Modal open
  const handleOpenDetails = (record: AttendanceRecord) => {
    setSelectedRequest(record);
    setCommentText(record.comment || "");
    setForwardTo(record.forwardedTo || "");
    setEditIn(record.in || "09:00 AM");
    setEditOut(record.out || "05:00 PM");
    setIsDetailModalOpen(true);
  };

  // Handle save edited record in modal
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    const updated = records.map((r) =>
      r.id === selectedRequest.id
        ? {
            ...r,
            in: editIn,
            out: editOut,
            comment: commentText,
            forwardedTo: forwardTo,
          }
        : r
    );
    setRecords(updated);
    setIsDetailModalOpen(false);
    setToastMessage("Attendance record updated successfully!");
  };

  const handleUpdateStatus = (newStatus: "Approved" | "Rejected") => {
    if (!selectedRequest) return;
    const updated = records.map((r) =>
      r.id === selectedRequest.id
        ? { ...r, hrApprovalStatus: newStatus }
        : r
    );
    setRecords(updated);
    setSelectedRequest((prev) => (prev ? { ...prev, hrApprovalStatus: newStatus } : null));
    setToastMessage(`Attendance correction marked as ${newStatus}!`);
  };

  return (
    <AppLayout
      title="Attendance"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Attendance" }]}
    >
      <div className="space-y-5">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0E4D41] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <Check className="h-4 w-4 text-[#35BFA3]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* =========================================================================
            TOP SECTION: SUMMARY & CHARTS (Height: 195px matching Figma Specs)
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
          {/* Card 1: Present (width: 175px in Figma, responsive lg:col-span-3 xl:col-span-2) */}
          <div className="lg:col-span-3 xl:col-span-2 bg-white rounded-[16px] h-[195px] overflow-hidden shadow-2xs flex flex-col justify-between border border-[#EBECEB]">
            {/* Detail Header: bg-[#E4F2D3], height: 51px */}
            <div className="bg-[#E4F2D3] px-4 py-3.5 h-[51px] flex items-center shrink-0">
              <h3 className="text-[16px] font-semibold text-[#203430] leading-none">
                Present
              </h3>
            </div>

            {/* Main Body: height: 128px */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[40px] font-bold text-[#0E4D41] leading-none tracking-tight">
                    {presentMetrics.presentCount}
                  </p>
                  <p className="text-[10px] text-[#63716E] mt-1.5 font-normal">
                    Employees
                  </p>
                </div>

                {presentMetrics.vsYesterday && (
                  <div className="flex flex-col items-end gap-1">
                    <div className="bg-[#F7F7F7] px-1.5 py-0.5 rounded-[6px] flex items-center justify-center">
                      <span
                        className={cn(
                          "text-[16px] font-semibold leading-none",
                          presentMetrics.vsYesterday.isPositive
                            ? "text-[#35BFA3]"
                            : presentMetrics.vsYesterday.isNeutral
                            ? "text-[#63716E]"
                            : "text-[#E63D4B]"
                        )}
                      >
                        {presentMetrics.vsYesterday.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#63716E] leading-none">
                      vs yesterday
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Additional Numbers Bar */}
              <div className="bg-[#F7F7F7] rounded-[8px] px-2.5 py-1 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-[16px] font-semibold text-[#0E4D41]">
                    {presentMetrics.onTimeCount}
                  </span>
                  <span className="text-[10px] text-[#63716E]">On-Time</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[16px] font-semibold text-[#0E4D41]">
                    {presentMetrics.lateCount}
                  </span>
                  <span className="text-[10px] text-[#63716E]">Late</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: On Leave (width: 271px in Figma, responsive lg:col-span-3 xl:col-span-3) */}
          <div className="lg:col-span-3 xl:col-span-3 bg-white rounded-[16px] h-[195px] overflow-hidden shadow-2xs flex flex-col justify-between border border-[#EBECEB]">
            {/* Detail Header: bg-[#35BFA3], height: 51px */}
            <div className="bg-[#35BFA3] px-4 py-3.5 h-[51px] flex items-center shrink-0">
              <h3 className="text-[16px] font-semibold text-white leading-none">
                On Leave
              </h3>
            </div>

            {/* Main Body */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[40px] font-bold text-[#0E4D41] leading-none tracking-tight">
                    {onLeaveMetrics.onLeaveCount}
                  </p>
                  <p className="text-[10px] text-[#63716E] mt-1.5 font-normal">
                    Employees
                  </p>
                </div>

                {onLeaveMetrics.vsYesterday && (
                  <div className="flex flex-col items-end gap-1">
                    <div className="bg-[#F7F7F7] px-1.5 py-0.5 rounded-[6px] flex items-center justify-center">
                      <span
                        className={cn(
                          "text-[16px] font-semibold leading-none",
                          onLeaveMetrics.vsYesterday.isPositive
                            ? "text-[#35BFA3]"
                            : onLeaveMetrics.vsYesterday.isNeutral
                            ? "text-[#63716E]"
                            : "text-[#E63D4B]"
                        )}
                      >
                        {onLeaveMetrics.vsYesterday.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#63716E] leading-none">
                      vs yesterday
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Additional Numbers Bar: 3 items */}
              <div className="bg-[#F7F7F7] rounded-[8px] px-2.5 py-1 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-[16px] font-semibold text-[#0E4D41]">
                    {onLeaveMetrics.annualCount}
                  </span>
                  <span className="text-[10px] text-[#63716E]">Annual Leave</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[16px] font-semibold text-[#0E4D41]">
                    {onLeaveMetrics.sickCount}
                  </span>
                  <span className="text-[10px] text-[#63716E]">Sick Leave</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[16px] font-semibold text-[#0E4D41]">
                    {onLeaveMetrics.othersCount}
                  </span>
                  <span className="text-[10px] text-[#63716E]">Others</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Absent (width: 135px in Figma, responsive lg:col-span-2 xl:col-span-2) */}
          <div className="lg:col-span-2 xl:col-span-2 bg-white rounded-[16px] h-[195px] overflow-hidden shadow-2xs flex flex-col justify-between border border-[#EBECEB]">
            {/* Detail Header: bg-[#0E4D41], height: 51px */}
            <div className="bg-[#0E4D41] px-4 py-3.5 h-[51px] flex items-center shrink-0">
              <h3 className="text-[16px] font-semibold text-white leading-none">
                Absent
              </h3>
            </div>

            {/* Main Body */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <p className="text-[40px] font-bold text-[#0E4D41] leading-none tracking-tight">
                  {absentMetrics.absentCount}
                </p>
                <p className="text-[10px] text-[#63716E] mt-1.5 font-normal">
                  Employees
                </p>
              </div>

              {absentMetrics.vsYesterday && (
                <div className="flex items-center gap-1.5">
                  <div className="bg-[#F7F7F7] px-1.5 py-0.5 rounded-[6px] flex items-center justify-center">
                    <span
                      className={cn(
                        "text-[16px] font-semibold leading-none",
                        absentMetrics.vsYesterday.isPositive
                          ? "text-[#35BFA3]"
                          : absentMetrics.vsYesterday.isNeutral
                          ? "text-[#63716E]"
                          : "text-[#E63D4B]"
                      )}
                    >
                      {absentMetrics.vsYesterday.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#63716E] leading-tight">
                    vs yesterday
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Fully Interactive Data-Driven Attendance Overview Chart */}
          <AttendanceOverviewChart
            records={records}
            activeFilter={chartFilter}
            onSelectFilter={(f) => {
              setChartFilter(f);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* =========================================================================
            EMPLOYEE ATTENDANCE TABLE SECTION
            ========================================================================= */}
        <div className="bg-white rounded-[16px] p-4 shadow-2xs border border-[#EBECEB]">
          {/* Table Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4" data-dropdown-container>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-[16px] font-semibold text-[#203430]">
                Employee Attendance
              </h2>

              {chartFilter && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#E4F2D3] border border-[#35BFA3]/40 text-[#0E4D41] text-[11px] font-medium animate-in fade-in">
                  <span>
                    Filtered by Chart: {chartFilter.periodLabel}
                    {chartFilter.status && chartFilter.status !== "All" && ` • ${chartFilter.status}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setChartFilter(null);
                      setCurrentPage(1);
                    }}
                    className="p-0.5 rounded hover:bg-black/10 cursor-pointer ml-0.5 text-[#0E4D41]"
                    title="Clear chart filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#203430]" />
                <input
                  type="text"
                  placeholder="Search employee"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8 pr-3 h-[34px] w-[200px] sm:w-[223px] bg-[#F7F7F7] text-[#203430] placeholder:text-[#63716E] rounded-[8px] text-[12px] outline-none border border-transparent focus:border-[#35BFA3]"
                />
              </div>

              {/* Filter Button (#E4F2D3 with Funnel Icon) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="h-[34px] px-3 rounded-[8px] bg-[#E4F2D3] text-[#203430] text-[12px] font-medium flex items-center gap-1.5 hover:bg-[#d9edc3] transition-colors cursor-pointer"
                >
                  <Filter className="h-3.5 w-3.5 text-[#203430]" />
                  <span>Filter</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#203430]" />
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#63716E] block mb-1">
                        Filter by Status
                      </label>
                      <select
                        value={filterStatus}
                        onChange={(e) => {
                          setFilterStatus(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full h-8 px-2 rounded-lg bg-[#F7F7F7] text-xs text-[#203430] outline-none border-none cursor-pointer"
                      >
                        <option value="All">All Statuses</option>
                        <option value="On-Time">On-Time</option>
                        <option value="Late">Late</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#63716E] block mb-1">
                        Filter by Work Model
                      </label>
                      <select
                        value={filterModel}
                        onChange={(e) => {
                          setFilterModel(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full h-8 px-2 rounded-lg bg-[#F7F7F7] text-xs text-[#203430] outline-none border-none cursor-pointer"
                      >
                        <option value="All">All Models</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                        <option value="On-Site">On-Site</option>
                      </select>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setFilterStatus("All");
                          setFilterModel("All");
                          setIsFilterOpen(false);
                          setToastMessage("Filters cleared.");
                        }}
                        className="text-[11px] font-medium text-rose-600 hover:underline cursor-pointer"
                      >
                        Reset All
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsFilterOpen(false)}
                        className="text-[11px] font-bold text-[#0E4D41] hover:underline cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sort By Section */}
              <div className="flex items-center gap-1.5 relative">
                <span className="text-[11px] text-[#6E6F78]">Sort by:</span>
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="h-[34px] px-3 rounded-[8px] bg-[#E4F2D3] text-[#203430] text-[12px] font-medium flex items-center gap-1 hover:bg-[#d9edc3] transition-colors cursor-pointer"
                >
                  <span>{sortBy}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#203430]" />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-50 animate-in fade-in">
                    {[
                      "Name",
                      "Job Title",
                      "Date",
                      "Work Model",
                      "Check In - Out",
                      "Duration",
                      "Overtime",
                      "Status",
                    ].map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => {
                          setSortBy(col);
                          setIsSortOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer",
                          sortBy === col
                            ? "bg-[#E4F2D3] text-[#0E4D41] font-bold"
                            : "text-[#203430] hover:bg-slate-50"
                        )}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mark Attendance Button (formerly Apply Attendance) */}
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="h-[34px] px-3.5 rounded-[8px] bg-[#35BFA3] text-white text-[12px] font-semibold hover:bg-[#28C2A9] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Directly mark employee attendance punches"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Mark Attendance</span>
              </button>
            </div>
          </div>

          {/* Table Container with Bounded Horizontal Scrolling */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[900px]">
              {/* Header row: height 42px, bg-[#F7F7F7], rounded 8px */}
              <thead>
                <tr className="bg-[#F7F7F7] h-[42px] rounded-[8px] text-[10px] text-[#63716E] font-normal">
                  <th
                    onClick={() => handleSortClick("Name")}
                    className="px-3.5 py-2.5 font-normal cursor-pointer select-none rounded-l-[8px]"
                  >
                    <div className="flex items-center gap-1">
                      <span>Name</span>
                      <ChevronsUpDown className="h-3 w-3 text-[#63716E]" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortClick("Job Title")}
                    className="px-3 py-2.5 font-normal cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Job Title</span>
                      <ChevronsUpDown className="h-3 w-3 text-[#63716E]" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortClick("Date")}
                    className="px-3 py-2.5 font-normal cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Date</span>
                      <ChevronsUpDown className="h-3 w-3 text-[#63716E]" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortClick("Work Model")}
                    className="px-3 py-2.5 font-normal cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Work Model</span>
                      <ChevronsUpDown className="h-3 w-3 text-[#63716E]" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortClick("Check In - Out")}
                    className="px-3 py-2.5 font-normal cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Check In - Out</span>
                      <ChevronsUpDown className="h-3 w-3 text-[#63716E]" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortClick("Duration")}
                    className="px-3 py-2.5 font-normal cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Duration</span>
                      <ChevronsUpDown className="h-3 w-3 text-[#63716E]" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortClick("Overtime")}
                    className="px-3 py-2.5 font-normal cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Overtime</span>
                      <ChevronsUpDown className="h-3 w-3 text-[#63716E]" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortClick("Status")}
                    className="px-3 py-2.5 font-normal cursor-pointer select-none rounded-r-[8px]"
                  >
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      <ChevronsUpDown className="h-3 w-3 text-[#63716E]" />
                    </div>
                  </th>
                </tr>
              </thead>

              {/* Table Body: 54px rows matching Screenshot 1 */}
              <tbody className="divide-y divide-[#E5E6E6]">
                {paginatedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-xs text-[#63716E]">
                      No employee attendance records match your active filter.
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((r, i) => (
                    <tr
                      key={r.id || i}
                      onClick={() => handleOpenDetails(r)}
                      className="h-[54px] hover:bg-[#F7F7F7]/70 cursor-pointer transition-colors group"
                      title="Click to view and edit attendance record"
                    >
                      {/* Name & ID */}
                      <td className="px-3.5 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={r.avatar}
                            alt={r.name}
                            className="h-7 w-7 rounded-full object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-[#203430] group-hover:text-[#35BFA3] transition-colors leading-tight">
                              {r.name}
                            </p>
                            <p className="text-[10px] text-[#63716E] leading-tight">
                              {r.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Job Title & Dept */}
                      <td className="px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-[#203430] leading-tight">
                            {r.role}
                          </p>
                          <p className="text-[10px] text-[#63716E] leading-tight">
                            {r.subRole || r.dept}
                          </p>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-3 py-2.5 text-[11px] text-[#203430]">
                        {r.date}
                      </td>

                      {/* Work Model with colored dot */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={cn(
                              "h-1.5 w-1.5 rounded-full shrink-0",
                              r.model === "Hybrid"
                                ? "bg-[#35BFA3]"
                                : r.model === "Remote"
                                ? "bg-[#0E4D41]"
                                : "bg-[#35BFA3]"
                            )}
                          />
                          <span className="text-[11px] text-[#203430]">
                            {r.model}
                          </span>
                        </div>
                      </td>

                      {/* Check In - Out */}
                      <td className="px-3 py-2.5 text-[11px] text-[#203430]">
                        {r.in && r.out ? `${r.in} – ${r.out}` : r.in || "– – –"}
                      </td>

                      {/* Duration */}
                      <td className="px-3 py-2.5 text-[11px] text-[#203430]">
                        {r.duration || "–"}
                      </td>

                      {/* Overtime */}
                      <td className="px-3 py-2.5 text-[11px] text-[#203430]">
                        {r.overtime || "–"}
                      </td>

                      {/* Status Badges strictly matching Screenshot 1 */}
                      <td className="px-3 py-2.5">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-medium leading-none",
                            r.status === "On-Time" && "bg-[#35BFA3] text-white",
                            r.status === "Late" && "bg-[#E4F2D3] text-[#203430]",
                            r.status === "On Leave" && "bg-[#E5E6E6] text-[#203430]",
                            r.status === "Absent" && "bg-[#0E4D41] text-white"
                          )}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer: Show Results & Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2 border-t border-[#E5E6E6] text-xs">
            {/* Left: Show 10 of results */}
            <div className="flex items-center gap-2 text-[#757575] text-[14px]" data-dropdown-container>
              <span>Show</span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
                  className="h-7 px-2.5 bg-[#F7F7F7] text-[#203430] font-medium text-[12px] rounded-[8px] flex items-center gap-1.5 hover:bg-[#EFEFEF] transition-colors cursor-pointer"
                >
                  <span>{pageSize}</span>
                  <ChevronDown className="h-3 w-3 text-[#203430]" />
                </button>

                {isPageSizeOpen && (
                  <div className="absolute left-0 bottom-full mb-1 w-20 bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-50 animate-in fade-in">
                    {[10, 20, 50].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          setPageSize(sz);
                          setCurrentPage(1);
                          setIsPageSizeOpen(false);
                        }}
                        className={cn(
                          "w-full text-center px-2 py-1 rounded-lg text-xs font-medium cursor-pointer",
                          pageSize === sz
                            ? "bg-[#E4F2D3] text-[#0E4D41] font-bold"
                            : "text-[#203430] hover:bg-slate-50"
                        )}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span>of {sortedRecords.length} results</span>
            </div>

            {/* Right: Pagination buttons matching Figma CSS */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-7 w-7 rounded-[8px] bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#203430] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Dynamic Page Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  onClick={() => setCurrentPage(pg)}
                  className={cn(
                    "h-7 w-7 rounded-[8px] text-[12px] font-medium flex items-center justify-center transition-colors cursor-pointer",
                    currentPage === pg
                      ? "bg-[#35BFA3] text-white font-bold shadow-2xs"
                      : "bg-[#F7F7F7] text-[#203430] hover:bg-[#EAEAEA]"
                  )}
                >
                  {pg}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="h-7 w-7 rounded-[8px] bg-[#F7F7F7] hover:bg-[#EAEAEA] text-[#203430] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM PAGE FOOTER (Matching Figma Specs)
            ========================================================================= */}
        <div className="pt-6 border-t border-[#EBECEB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#63716E]">
          <div className="flex items-center gap-4">
            <span className="font-bold text-[#203430]">
              Copyright © 2025 Peterdraw
            </span>
            <span
              onClick={() => setToastMessage("Privacy Policy opened.")}
              className="hover:text-[#203430] cursor-pointer"
            >
              Privacy Policy
            </span>
            <span
              onClick={() => setToastMessage("Terms & Conditions opened.")}
              className="hover:text-[#203430] cursor-pointer"
            >
              Term and conditions
            </span>
            <span
              onClick={() => setToastMessage("Contact support: support@teamhub.io")}
              className="hover:text-[#203430] cursor-pointer"
            >
              Contact
            </span>
          </div>

          <div className="flex items-center gap-3 text-[#63716E]">
            <span
              onClick={() => setToastMessage("Facebook link copied.")}
              className="h-6 w-6 rounded-full hover:text-[#203430] flex items-center justify-center cursor-pointer font-bold"
            >
              f
            </span>
            <span
              onClick={() => setToastMessage("X handle copied.")}
              className="hover:text-[#203430] cursor-pointer"
            >
              <XLogo className="h-3 w-3" />
            </span>
            <span
              onClick={() => setToastMessage("Instagram link copied.")}
              className="hover:text-[#203430] cursor-pointer"
            >
              <Instagram className="h-3.5 w-3.5" />
            </span>
            <span
              onClick={() => setToastMessage("YouTube channel copied.")}
              className="hover:text-[#203430] cursor-pointer font-bold text-[10px]"
            >
              yt
            </span>
            <span
              onClick={() => setToastMessage("LinkedIn page copied.")}
              className="hover:text-[#203430] cursor-pointer"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        {/* =========================================================================
            ATTENDANCE RECORD & VERIFICATION MODAL (2-STAGE APPROVAL & PUNCH COMPARE)
            ========================================================================= */}
        <AttendanceCorrectionModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          record={selectedRequest}
          onApproveBySupervisor={(recordId, remark) => {
            const timestamp =
              new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }) +
              ", " +
              new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
            const updated = records.map((r) =>
              r.id === recordId
                ? {
                    ...r,
                    forwardedStatus: "Approved",
                    supervisorRemark: remark,
                    supervisorReviewedAt: timestamp,
                  }
                : r
            );
            setRecords(updated);
            setSelectedRequest((prev) =>
              prev && prev.id === recordId
                ? {
                    ...prev,
                    forwardedStatus: "Approved",
                    supervisorRemark: remark,
                    supervisorReviewedAt: timestamp,
                  }
                : prev
            );
            setToastMessage("Supervisor approval recorded with remarks.");
          }}
          onRejectBySupervisor={(recordId, remark) => {
            const timestamp =
              new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }) +
              ", " +
              new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
            const updated = records.map((r) =>
              r.id === recordId
                ? {
                    ...r,
                    forwardedStatus: "Rejected",
                    supervisorRemark: remark,
                    supervisorReviewedAt: timestamp,
                  }
                : r
            );
            setRecords(updated);
            setSelectedRequest((prev) =>
              prev && prev.id === recordId
                ? {
                    ...prev,
                    forwardedStatus: "Rejected",
                    supervisorRemark: remark,
                    supervisorReviewedAt: timestamp,
                  }
                : prev
            );
            setToastMessage("Supervisor rejection recorded with remarks.");
          }}
          onFinalApproveByAdmin={(recordId, adminRemark) => {
            const timestamp =
              new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }) +
              ", " +
              new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
            const updated = records.map((r) =>
              r.id === recordId
                ? {
                    ...r,
                    hrApprovalStatus: "Approved",
                    status: "On-Time",
                    in: r.requestedIn || (r.status === "Late" ? "09:00 AM" : r.in),
                    out: r.requestedOut || r.out,
                    adminRemark: adminRemark || r.adminRemark,
                    hrReviewedAt: timestamp,
                  }
                : r
            );
            setRecords(updated);
            setSelectedRequest((prev) =>
              prev && prev.id === recordId
                ? {
                    ...prev,
                    hrApprovalStatus: "Approved",
                    status: "On-Time",
                    in: prev.requestedIn || (prev.status === "Late" ? "09:00 AM" : prev.in),
                    out: prev.requestedOut || prev.out,
                    adminRemark: adminRemark || prev.adminRemark,
                    hrReviewedAt: timestamp,
                  }
                : prev
            );
            setToastMessage("Final HR/Admin approval granted! Timesheet reconciled.");
          }}
          onFinalRejectByAdmin={(recordId, adminRemark) => {
            const timestamp =
              new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }) +
              ", " +
              new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
            const updated = records.map((r) =>
              r.id === recordId
                ? {
                    ...r,
                    hrApprovalStatus: "Rejected",
                    adminRemark: adminRemark || r.adminRemark,
                    hrReviewedAt: timestamp,
                  }
                : r
            );
            setRecords(updated);
            setSelectedRequest((prev) =>
              prev && prev.id === recordId
                ? {
                    ...prev,
                    hrApprovalStatus: "Rejected",
                    adminRemark: adminRemark || prev.adminRemark,
                    hrReviewedAt: timestamp,
                  }
                : prev
            );
            setToastMessage("Attendance correction final rejected by HR/Admin.");
          }}
          onUpdateRecord={(updatedRecord) => {
            const updated = records.map((r) =>
              r.id === updatedRecord.id ? updatedRecord : r
            );
            setRecords(updated);
            setSelectedRequest(updatedRecord);
            setToastMessage("Attendance verification state updated.");
          }}
        />

        {/* =========================================================================
            MARK ATTENDANCE MODAL (ADMIN DIRECT PUNCH ENTRY)
            ========================================================================= */}
        <MarkAttendanceModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onMarkAttendance={(newRecord) => {
            // Prepend new attendance record to state & collection
            setRecords([newRecord, ...records]);
            setToastMessage(`Attendance marked for ${newRecord.name}!`);
          }}
        />
      </div>
    </AppLayout>
  );
}
