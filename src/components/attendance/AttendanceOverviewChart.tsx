import * as React from "react";
import { ChevronDown, Calendar, AlertCircle, X, Check, RefreshCw } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AttendanceRecord } from "../../lib/db";
import { TeamHubCalendarPopover } from "./TeamHubCalendarPopover";

export interface ChartFilterSelection {
  periodLabel: string;
  status?: "Present" | "On Leave" | "Absent" | "All";
  startDate?: string;
  endDate?: string;
}

export interface AttendanceOverviewChartProps {
  records: AttendanceRecord[];
  activeFilter?: ChartFilterSelection | null;
  onSelectFilter?: (filter: ChartFilterSelection | null) => void;
}

interface BucketData {
  key: string;
  label: string;
  dateStart: Date;
  dateEnd: Date;
  presentCount: number;
  leaveCount: number;
  absentCount: number;
  total: number;
  presentPct: number;
  leavePct: number;
  absentPct: number;
}

const PRESET_TIMEFRAMES = [
  "Last 6 Months",
  "This Year",
  "Last 3 Months",
  "Last 12 Months",
  "This Month",
  "Last 30 Days",
  "Last 7 Days",
  "Today",
  "Yesterday",
  "Last Year",
  "Custom Range",
];

// Helper to parse dates like "19 Jun 2035", "19 June 2035", "2035-06-19"
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  const match = dateStr.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (match) {
    const day = parseInt(match[1], 10);
    const monthStr = match[2].toLowerCase();
    const year = parseInt(match[3], 10);
    const monthIndex = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec",
    ].findIndex((m) => monthStr.startsWith(m));
    if (monthIndex >= 0) {
      return new Date(year, monthIndex, day);
    }
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

const MONTH_NAMES_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function AttendanceOverviewChart({
  records,
  activeFilter,
  onSelectFilter,
}: AttendanceOverviewChartProps) {
  // Reference date: June 19, 2035
  const refDate = React.useMemo(() => new Date(2035, 5, 19), []);

  const [timeframe, setTimeframe] = React.useState("Last 6 Months");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  // Custom Date Range State
  const [isCustomRangeOpen, setIsCustomRangeOpen] = React.useState(false);
  const [customStart, setCustomStart] = React.useState("01 Jun 2035");
  const [customEnd, setCustomEnd] = React.useState("30 Jun 2035");
  const [appliedCustomLabel, setAppliedCustomLabel] = React.useState<string | null>(null);
  const [customRangeError, setCustomRangeError] = React.useState<string | null>(null);

  // Calendar popover refs for custom range
  const [isStartCalendarOpen, setIsStartCalendarOpen] = React.useState(false);
  const [isEndCalendarOpen, setIsEndCalendarOpen] = React.useState(false);
  const startTriggerRef = React.useRef<HTMLButtonElement>(null);
  const endTriggerRef = React.useRef<HTMLButtonElement>(null);

  // Interactive Legend Highlight State
  const [highlightCategory, setHighlightCategory] = React.useState<
    "Present" | "On Leave" | "Absent" | null
  >(null);

  // Hovered bar state for tooltip
  const [hoveredBucket, setHoveredBucket] = React.useState<BucketData | null>(null);
  const [hoveredCoords, setHoveredCoords] = React.useState<{ x: number; y: number } | null>(null);

  // Generate buckets based on selected timeframe
  const buckets = React.useMemo<BucketData[]>(() => {
    const list: { key: string; label: string; dateStart: Date; dateEnd: Date }[] = [];

    if (timeframe === "Today") {
      const start = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate(), 0, 0, 0);
      const end = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate(), 23, 59, 59);
      list.push({ key: "today", label: "19 Jun", dateStart: start, dateEnd: end });
    } else if (timeframe === "Yesterday") {
      const yesterday = new Date(refDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const start = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
      const end = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
      list.push({ key: "yesterday", label: "18 Jun", dateStart: start, dateEnd: end });
    } else if (timeframe === "Last 7 Days") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(refDate);
        d.setDate(d.getDate() - i);
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
        const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
        const label = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
        list.push({ key: `day-${i}`, label, dateStart: start, dateEnd: end });
      }
    } else if (timeframe === "Last 30 Days") {
      // 5 weekly buckets of 6 days
      for (let w = 4; w >= 0; w--) {
        const startD = new Date(refDate);
        startD.setDate(startD.getDate() - (w * 6 + 5));
        const endD = new Date(refDate);
        endD.setDate(endD.getDate() - w * 6);
        const label = `W${5 - w}`;
        list.push({ key: `w-${w}`, label, dateStart: startD, dateEnd: endD });
      }
    } else if (timeframe === "This Month") {
      // June 2035: 4 weeks
      for (let w = 1; w <= 4; w++) {
        const startDay = (w - 1) * 7 + 1;
        const endDay = Math.min(30, w * 7);
        const start = new Date(2035, 5, startDay, 0, 0, 0);
        const end = new Date(2035, 5, endDay, 23, 59, 59);
        list.push({ key: `w-${w}`, label: `W${w}`, dateStart: start, dateEnd: end });
      }
    } else if (timeframe === "Last 3 Months") {
      // Apr, May, Jun 2035
      [3, 4, 5].forEach((m) => {
        const start = new Date(2035, m, 1, 0, 0, 0);
        const end = new Date(2035, m + 1, 0, 23, 59, 59);
        list.push({ key: `m-${m}`, label: MONTH_NAMES_SHORT[m], dateStart: start, dateEnd: end });
      });
    } else if (timeframe === "Last 6 Months") {
      // Feb, Mar, Apr, May, Jun, Jul matching Screenshot & Figma specs
      [1, 2, 3, 4, 5, 6].forEach((m) => {
        const start = new Date(2035, m, 1, 0, 0, 0);
        const end = new Date(2035, m + 1, 0, 23, 59, 59);
        list.push({ key: `m-${m}`, label: MONTH_NAMES_SHORT[m], dateStart: start, dateEnd: end });
      });
    } else if (timeframe === "Last 12 Months") {
      // Past 12 months leading up to June 2035
      for (let i = 11; i >= 0; i--) {
        const d = new Date(2035, 5 - i, 1);
        const m = d.getMonth();
        const y = d.getFullYear();
        const start = new Date(y, m, 1, 0, 0, 0);
        const end = new Date(y, m + 1, 0, 23, 59, 59);
        list.push({ key: `m-${y}-${m}`, label: MONTH_NAMES_SHORT[m], dateStart: start, dateEnd: end });
      }
    } else if (timeframe === "This Year") {
      // Jan - Dec 2035
      for (let m = 0; m < 12; m++) {
        const start = new Date(2035, m, 1, 0, 0, 0);
        const end = new Date(2035, m + 1, 0, 23, 59, 59);
        list.push({ key: `m-2035-${m}`, label: MONTH_NAMES_SHORT[m], dateStart: start, dateEnd: end });
      }
    } else if (timeframe === "Last Year") {
      // Jan - Dec 2034
      for (let m = 0; m < 12; m++) {
        const start = new Date(2034, m, 1, 0, 0, 0);
        const end = new Date(2034, m + 1, 0, 23, 59, 59);
        list.push({ key: `m-2034-${m}`, label: MONTH_NAMES_SHORT[m], dateStart: start, dateEnd: end });
      }
    } else if (timeframe === "Custom Range") {
      const sDate = parseDate(customStart) || new Date(2035, 5, 1);
      const eDate = parseDate(customEnd) || new Date(2035, 5, 30);
      const diffDays = Math.max(1, Math.round((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24)));

      if (diffDays <= 10) {
        // Daily buckets
        for (let d = 0; d < diffDays; d++) {
          const cur = new Date(sDate);
          cur.setDate(cur.getDate() + d);
          const start = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate(), 0, 0, 0);
          const end = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate(), 23, 59, 59);
          list.push({
            key: `custom-d-${d}`,
            label: cur.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
            dateStart: start,
            dateEnd: end,
          });
        }
      } else if (diffDays <= 60) {
        // Weekly buckets (approx 4-8 bars)
        const weekCount = Math.min(8, Math.ceil(diffDays / 7));
        const daysPerBucket = Math.ceil(diffDays / weekCount);
        for (let w = 0; w < weekCount; w++) {
          const curStart = new Date(sDate);
          curStart.setDate(curStart.getDate() + w * daysPerBucket);
          const curEnd = new Date(sDate);
          curEnd.setDate(Math.min(eDate.getDate(), curEnd.getDate() + (w + 1) * daysPerBucket - 1));
          list.push({
            key: `custom-w-${w}`,
            label: `W${w + 1}`,
            dateStart: curStart,
            dateEnd: curEnd,
          });
        }
      } else {
        // Monthly buckets
        const startM = sDate.getMonth();
        const startY = sDate.getFullYear();
        const endM = eDate.getMonth();
        const endY = eDate.getFullYear();
        let curY = startY;
        let curM = startM;
        while (curY < endY || (curY === endY && curM <= endM)) {
          const mStart = new Date(curY, curM, 1, 0, 0, 0);
          const mEnd = new Date(curY, curM + 1, 0, 23, 59, 59);
          list.push({
            key: `custom-m-${curY}-${curM}`,
            label: MONTH_NAMES_SHORT[curM],
            dateStart: mStart,
            dateEnd: mEnd,
          });
          curM++;
          if (curM > 11) {
            curM = 0;
            curY++;
          }
        }
      }
    }

    // Now aggregate actual records into each bucket
    return list.map((b) => {
      // Find matching attendance records within bucket date range
      const matching = records.filter((r) => {
        const rd = parseDate(r.date);
        if (!rd) return false;
        return rd >= b.dateStart && rd <= b.dateEnd;
      });

      const presentSet = new Set<string>();
      const leaveSet = new Set<string>();
      const absentSet = new Set<string>();

      matching.forEach((r) => {
        if (r.status === "On-Time" || r.status === "Late") {
          presentSet.add(r.id);
        } else if (r.status === "On Leave") {
          leaveSet.add(r.id);
        } else if (r.status === "Absent") {
          absentSet.add(r.id);
        }
      });

      const presentCount = presentSet.size;
      const leaveCount = leaveSet.size;
      const absentCount = absentSet.size;
      const total = presentCount + leaveCount + absentCount;

      let presentPct = 0;
      let leavePct = 0;
      let absentPct = 0;

      if (total > 0) {
        presentPct = Math.round((presentCount / total) * 100);
        leavePct = Math.round((leaveCount / total) * 100);
        absentPct = Math.max(0, 100 - presentPct - leavePct);
      }

      return {
        ...b,
        presentCount,
        leaveCount,
        absentCount,
        total,
        presentPct,
        leavePct,
        absentPct,
      };
    });
  }, [timeframe, refDate, records, customStart, customEnd]);

  // Total records across all generated buckets in the active view
  const totalRecordsInView = React.useMemo(() => {
    return buckets.reduce((acc, b) => acc + b.total, 0);
  }, [buckets]);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-chart-timeframe-dropdown]")) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle custom range validation & submit
  const handleApplyCustomRange = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomRangeError(null);

    const s = parseDate(customStart);
    const endD = parseDate(customEnd);

    if (!s || !endD) {
      setCustomRangeError("Please select both valid start and end dates.");
      return;
    }
    if (endD < s) {
      setCustomRangeError("End date cannot precede start date.");
      return;
    }

    const label = `${s.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} – ${endD.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`;
    setAppliedCustomLabel(label);
    setTimeframe("Custom Range");
    setIsCustomRangeOpen(false);
    setIsDropdownOpen(false);
  };

  // Handle segment click to filter table
  const handleBarClick = (bucket: BucketData, category?: "Present" | "On Leave" | "Absent") => {
    if (!onSelectFilter) return;

    // If already selected, toggle off
    if (
      activeFilter &&
      activeFilter.periodLabel === bucket.label &&
      activeFilter.status === category
    ) {
      onSelectFilter(null);
    } else {
      onSelectFilter({
        periodLabel: bucket.label,
        status: category || "All",
        startDate: bucket.dateStart.toISOString().split("T")[0],
        endDate: bucket.dateEnd.toISOString().split("T")[0],
      });
    }
  };

  // Display label for timeframe button
  const displayTimeframeLabel = React.useMemo(() => {
    if (timeframe === "Custom Range" && appliedCustomLabel) {
      return appliedCustomLabel;
    }
    return timeframe;
  }, [timeframe, appliedCustomLabel]);

  return (
    <div className="lg:col-span-4 xl:col-span-5 bg-white rounded-[16px] h-[195px] p-4 shadow-2xs border border-[#EBECEB] flex items-center justify-between gap-4 relative">
      {/* Left Column: Title, Picker, Legend */}
      <div
        className="flex flex-col justify-between h-full py-0.5 min-w-[140px] shrink-0"
        data-chart-timeframe-dropdown
      >
        <div>
          <h3 className="text-[16px] font-semibold text-[#203430] leading-tight mb-2">
            Attendance Overview
          </h3>

          {/* Timeframe Dropdown Picker Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-7 px-2.5 rounded-[8px] bg-[#F7F7F7] text-[#203430] text-[12px] font-medium flex items-center gap-1.5 hover:bg-[#EFEFEF] transition-colors cursor-pointer"
            >
              <span className="truncate max-w-[110px]">{displayTimeframeLabel}</span>
              <ChevronDown className="h-3 w-3 text-[#203430] shrink-0" />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-50 animate-in fade-in max-h-56 overflow-y-auto">
                {PRESET_TIMEFRAMES.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      if (opt === "Custom Range") {
                        setIsCustomRangeOpen(true);
                      } else {
                        setTimeframe(opt);
                        setAppliedCustomLabel(null);
                      }
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors",
                      timeframe === opt
                        ? "bg-[#E4F2D3] text-[#0E4D41] font-bold"
                        : "text-[#203430] hover:bg-slate-50"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Legend with Interactive Category Highlighting */}
        <div className="space-y-1.5">
          {/* Present Legend */}
          <div
            role="button"
            tabIndex={0}
            onClick={() =>
              setHighlightCategory((prev) => (prev === "Present" ? null : "Present"))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setHighlightCategory((prev) => (prev === "Present" ? null : "Present"));
              }
            }}
            title="Click to highlight Present attendance across chart"
            className={cn(
              "flex items-center gap-2 cursor-pointer transition-all rounded-md px-1 py-0.5 -mx-1 select-none",
              highlightCategory === "Present" && "bg-[#E4F2D3]/60 ring-1 ring-[#0E4D41]/20 font-bold"
            )}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-[#E4F2D3] shrink-0 border border-slate-300" />
            <span className="text-[12px] text-[#63716E]">Present</span>
          </div>

          {/* On Leave Legend */}
          <div
            role="button"
            tabIndex={0}
            onClick={() =>
              setHighlightCategory((prev) => (prev === "On Leave" ? null : "On Leave"))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setHighlightCategory((prev) => (prev === "On Leave" ? null : "On Leave"));
              }
            }}
            title="Click to highlight On Leave attendance across chart"
            className={cn(
              "flex items-center gap-2 cursor-pointer transition-all rounded-md px-1 py-0.5 -mx-1 select-none",
              highlightCategory === "On Leave" && "bg-[#35BFA3]/20 ring-1 ring-[#35BFA3] font-bold"
            )}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-[#35BFA3] shrink-0" />
            <span className="text-[12px] text-[#63716E]">On Leave</span>
          </div>

          {/* Absent Legend */}
          <div
            role="button"
            tabIndex={0}
            onClick={() =>
              setHighlightCategory((prev) => (prev === "Absent" ? null : "Absent"))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setHighlightCategory((prev) => (prev === "Absent" ? null : "Absent"));
              }
            }}
            title="Click to highlight Absent attendance across chart"
            className={cn(
              "flex items-center gap-2 cursor-pointer transition-all rounded-md px-1 py-0.5 -mx-1 select-none",
              highlightCategory === "Absent" && "bg-[#0E4D41]/15 ring-1 ring-[#0E4D41] font-bold"
            )}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-[#0E4D41] shrink-0" />
            <span className="text-[12px] text-[#63716E]">Absent</span>
          </div>
        </div>
      </div>

      {/* Right Column: 100% Stacked Bar Chart */}
      <div className="flex-1 h-full flex items-end justify-end gap-1.5 sm:gap-2.5 pr-1 relative min-w-0">
        {/* Empty State when no attendance records exist in the entire active view */}
        {totalRecordsInView === 0 ? (
          <div className="flex-1 h-[126px] mb-4 flex flex-col items-center justify-center text-center p-2 rounded-xl bg-[#F7F7F7]/60 border border-dashed border-slate-200">
            <p className="text-[11px] font-medium text-[#63716E]">
              No attendance data for this period.
            </p>
            <button
              type="button"
              onClick={() => {
                setTimeframe("Last 6 Months");
                setAppliedCustomLabel(null);
              }}
              className="mt-1.5 px-2.5 py-1 rounded-lg bg-[#E4F2D3] hover:bg-[#d8ecc5] text-[#0E4D41] text-[11px] font-bold cursor-pointer transition-colors"
            >
              Switch to Last 6 Months
            </button>
          </div>
        ) : (
          <>
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between h-[126px] mb-5 text-[10px] text-[#63716E] pr-1 select-none shrink-0">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {/* Stacked Bars */}
            <div className="flex-1 h-full flex items-end justify-around sm:justify-end gap-1.5 sm:gap-2.5 overflow-x-auto min-w-0 pb-0.5">
              {buckets.map((col, idx) => {
                const isSelected = activeFilter && activeFilter.periodLabel === col.label;
                const hasData = col.total > 0;

                return (
                  <div
                    key={col.key || idx}
                    className="flex flex-col items-center gap-1.5 h-full justify-end group relative"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredBucket(col);
                      setHoveredCoords({ x: rect.left + rect.width / 2, y: rect.top });
                    }}
                    onMouseLeave={() => {
                      setHoveredBucket(null);
                      setHoveredCoords(null);
                    }}
                  >
                    {/* The 126px Stacked Column Bar */}
                    <div
                      className={cn(
                        "w-[26px] sm:w-[30.5px] h-[126px] rounded-t-[8px] overflow-hidden flex flex-col justify-end bg-[#F7F7F7] relative cursor-pointer transition-all",
                        isSelected && "ring-2 ring-[#35BFA3] shadow-md",
                        !hasData && "opacity-35"
                      )}
                      tabIndex={0}
                      role="button"
                      aria-label={`${col.label} attendance stats`}
                      onClick={() => handleBarClick(col)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleBarClick(col);
                        }
                      }}
                    >
                      {hasData ? (
                        <>
                          {/* Top Segment: Absent (Dark Green #0E4D41) */}
                          <div
                            style={{ height: `${col.absentPct}%` }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBarClick(col, "Absent");
                            }}
                            className={cn(
                              "w-full bg-[#0E4D41] transition-all rounded-t-[8px] hover:brightness-110",
                              highlightCategory && highlightCategory !== "Absent" && "opacity-25"
                            )}
                            title={`${col.label}: Absent ${col.absentCount} (${col.absentPct}%)`}
                          />

                          {/* Middle Segment: On Leave (Teal #35BFA3) */}
                          <div
                            style={{ height: `${col.leavePct}%` }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBarClick(col, "On Leave");
                            }}
                            className={cn(
                              "w-full bg-[#35BFA3] transition-all hover:brightness-110",
                              highlightCategory && highlightCategory !== "On Leave" && "opacity-25"
                            )}
                            title={`${col.label}: On Leave ${col.leaveCount} (${col.leavePct}%)`}
                          />

                          {/* Bottom Segment: Present (Light Green #E4F2D3) */}
                          <div
                            style={{ height: `${col.presentPct}%` }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBarClick(col, "Present");
                            }}
                            className={cn(
                              "w-full bg-[#E4F2D3] transition-all hover:brightness-95",
                              highlightCategory && highlightCategory !== "Present" && "opacity-25"
                            )}
                            title={`${col.label}: Present ${col.presentCount} (${col.presentPct}%)`}
                          />
                        </>
                      ) : (
                        <div className="w-full h-1.5 bg-slate-300 rounded-t-sm" title={`${col.label}: No records logged`} />
                      )}
                    </div>

                    {/* Bucket Label */}
                    <span
                      className={cn(
                        "text-[10px] text-[#63716E] font-normal leading-none truncate max-w-[36px] text-center",
                        isSelected && "font-bold text-[#203430]"
                      )}
                    >
                      {col.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Hover Tooltip (Safe Viewport Collision Containment) */}
        {hoveredBucket && hoveredCoords && (
          <div
            style={{
              position: "fixed",
              left: `${Math.min(window.innerWidth - 180, Math.max(12, hoveredCoords.x - 85))}px`,
              top: `${Math.max(12, hoveredCoords.y - 105)}px`,
              zIndex: 9999,
            }}
            className="w-44 bg-white rounded-xl border border-slate-100 shadow-xl p-2.5 text-xs text-[#203430] pointer-events-none animate-in fade-in zoom-in-95 duration-75"
          >
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
              <span className="font-bold text-xs text-[#203430]">
                {hoveredBucket.label}
              </span>
              <span className="text-[10px] text-[#63716E]">
                {hoveredBucket.total} Total
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-[#E4F2D3] border border-slate-300" />
                  <span>Present</span>
                </div>
                <span className="font-semibold text-[#0E4D41]">
                  {hoveredBucket.presentCount} ({hoveredBucket.presentPct}%)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-[#35BFA3]" />
                  <span>On Leave</span>
                </div>
                <span className="font-semibold text-[#0E4D41]">
                  {hoveredBucket.leaveCount} ({hoveredBucket.leavePct}%)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-[#0E4D41]" />
                  <span>Absent</span>
                </div>
                <span className="font-semibold text-[#0E4D41]">
                  {hoveredBucket.absentCount} ({hoveredBucket.absentPct}%)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          CUSTOM DATE RANGE POPOVER (MATCHING TEAMHUB DESIGN & NEVER CLIPPING)
          ========================================================================= */}
      {isCustomRangeOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-[360px] p-5 text-left text-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-sm text-[#203430]">Custom Date Range</h4>
                <p className="text-[11px] text-[#63716E] mt-0.5">
                  Select start and end dates for overview chart
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomRangeOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {customRangeError && (
              <div className="mb-3 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{customRangeError}</span>
              </div>
            )}

            <form onSubmit={handleApplyCustomRange} className="space-y-3.5">
              {/* Start Date Field */}
              <div>
                <label className="font-bold text-[#63716E] block mb-1">
                  Start Date <span className="text-rose-500">*</span>
                </label>
                <button
                  ref={startTriggerRef}
                  type="button"
                  onClick={() => {
                    setIsStartCalendarOpen(true);
                    setIsEndCalendarOpen(false);
                  }}
                  className="w-full h-9 px-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] bg-white flex items-center justify-between text-xs text-[#203430] cursor-pointer"
                >
                  <span>{customStart}</span>
                  <Calendar className="h-4 w-4 text-[#35BFA3]" />
                </button>
                <TeamHubCalendarPopover
                  isOpen={isStartCalendarOpen}
                  onClose={() => setIsStartCalendarOpen(false)}
                  selectedDate={customStart}
                  onSelectDate={(d) => {
                    setCustomStart(d);
                    if (customRangeError) setCustomRangeError(null);
                  }}
                  triggerRef={startTriggerRef}
                />
              </div>

              {/* End Date Field */}
              <div>
                <label className="font-bold text-[#63716E] block mb-1">
                  End Date <span className="text-rose-500">*</span>
                </label>
                <button
                  ref={endTriggerRef}
                  type="button"
                  onClick={() => {
                    setIsEndCalendarOpen(true);
                    setIsStartCalendarOpen(false);
                  }}
                  className="w-full h-9 px-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] bg-white flex items-center justify-between text-xs text-[#203430] cursor-pointer"
                >
                  <span>{customEnd}</span>
                  <Calendar className="h-4 w-4 text-[#35BFA3]" />
                </button>
                <TeamHubCalendarPopover
                  isOpen={isEndCalendarOpen}
                  onClose={() => setIsEndCalendarOpen(false)}
                  selectedDate={customEnd}
                  onSelectDate={(d) => {
                    setCustomEnd(d);
                    if (customRangeError) setCustomRangeError(null);
                  }}
                  triggerRef={endTriggerRef}
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCustomRangeOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-[#E5E6E6] hover:bg-slate-50 text-xs text-[#203430] font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#35BFA3] hover:bg-[#28C2A9] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Apply Range
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
