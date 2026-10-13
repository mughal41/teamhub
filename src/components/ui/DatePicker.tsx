import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Calendar as CalendarIcon, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export interface TeamHubDatePickerProps {
  mode?: "month" | "date" | "hybrid";
  year?: number;
  month?: number; // 0-11
  day?: number; // 1-31
  label?: string;
  presets?: string[];
  onChange?: (val: { year: number; month: number; day: number; label: string }) => void;
  onPresetSelect?: (preset: string) => void;
  buttonClassName?: string;
  align?: "left" | "right";
  icon?: boolean;
}

export function TeamHubDatePicker({
  mode = "date",
  year: initialYear = 2026,
  month: initialMonth = 9, // Oct = 9
  day: initialDay = 8,
  label,
  presets = ["This Month", "Last Month", "This Week", "All Time"],
  onChange,
  onPresetSelect,
  buttonClassName,
  align = "right",
  icon = true,
}: TeamHubDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [view, setView] = React.useState<"presets" | "month" | "date">(
    mode === "hybrid" ? "presets" : mode === "month" ? "month" : "date"
  );

  const [year, setYear] = React.useState(initialYear);
  const [month, setMonth] = React.useState(initialMonth);
  const [day, setDay] = React.useState(initialDay);
  const [activePreset, setActivePreset] = React.useState<string | null>(null);

  React.useEffect(() => {
    setYear(initialYear);
    setMonth(initialMonth);
    setDay(initialDay);
  }, [initialYear, initialMonth, initialDay]);

  // Days in month calculation
  const daysInMonth = React.useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  // Get starting day of week for current month (0 = Sun, 1 = Mon...)
  const startDayOfWeek = React.useMemo(() => {
    return new Date(year, month, 1).getDay();
  }, [year, month]);

  const displayLabel = label || (
    activePreset ? activePreset :
    mode === "month"
      ? `${MONTH_NAMES[month]} ${year}`
      : `${day} ${MONTH_SHORT[month]} ${year}`
  );

  const handleSelectDay = (selectedDay: number) => {
    setDay(selectedDay);
    setActivePreset(null);
    const dateLabel = `${selectedDay} ${MONTH_SHORT[month]} ${year}`;
    if (onChange) {
      onChange({ year, month, day: selectedDay, label: dateLabel });
    }
    setIsOpen(false);
  };

  const handleSelectMonth = (selectedMonth: number) => {
    setMonth(selectedMonth);
    setActivePreset(null);
    const monthLabel = `${MONTH_NAMES[selectedMonth]} ${year}`;
    if (mode === "month") {
      if (onChange) {
        onChange({ year, month: selectedMonth, day: 1, label: monthLabel });
      }
      setIsOpen(false);
    } else {
      // In date mode, switch to date view after selecting month
      setView("date");
    }
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 bg-[#E4F2D3] hover:bg-[#d8ebc3] text-[#0E4D41] text-[12px] font-semibold px-3 py-1.5 rounded-[8px] border-none cursor-pointer transition-colors shadow-none outline-none",
          buttonClassName
        )}
      >
        {icon && <CalendarIcon className="h-3.5 w-3.5 text-[#0E4D41]" />}
        <span>{displayLabel}</span>
        <ChevronDown className="h-3.5 w-3.5 ml-0.5 text-[#0E4D41]" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[199]"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              "absolute top-9 z-[200] w-64 bg-white rounded-2xl shadow-xl border border-[#E5E6E6] p-3 text-left animate-in fade-in duration-100",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            {/* Hybrid Mode Presets View */}
            {mode === "hybrid" && view === "presets" && (
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider px-2 py-1">
                  Timeframe Options
                </p>
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setActivePreset(p);
                      if (onPresetSelect) onPresetSelect(p);
                      if (onChange) onChange({ year, month, day, label: p });
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-none transition-colors flex items-center justify-between",
                      activePreset === p ? "bg-[#35BFA3] text-white" : "text-[#203430] hover:bg-slate-50"
                    )}
                  >
                    <span>{p}</span>
                    {activePreset === p && <Check className="h-3.5 w-3.5 text-white" />}
                  </button>
                ))}
                <div className="border-t border-[#E5E6E6] my-1 pt-1">
                  <button
                    type="button"
                    onClick={() => setView("date")}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-[#35BFA3] hover:bg-emerald-50 cursor-pointer border-none bg-transparent transition-colors"
                  >
                    Custom Date & Month...
                  </button>
                </div>
              </div>
            )}

            {/* Month & Year Selection View */}
            {view === "month" && (
              <div>
                {/* Year Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E6E6]">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setYear((y) => y - 1); }}
                    className="p-1 rounded-lg hover:bg-slate-100 text-[#203430] border-none bg-transparent cursor-pointer transition-colors"
                    title="Previous Year"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-[13px] font-bold text-[#203430]">{year}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setYear((y) => y + 1); }}
                    className="p-1 rounded-lg hover:bg-slate-100 text-[#203430] border-none bg-transparent cursor-pointer transition-colors"
                    title="Next Year"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* 12 Months Grid */}
                <div className="grid grid-cols-3 gap-1.5">
                  {MONTH_NAMES.map((mName, mIdx) => (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => handleSelectMonth(mIdx)}
                      className={cn(
                        "py-1.5 px-2 rounded-lg text-xs font-semibold cursor-pointer border-none transition-all text-center",
                        month === mIdx
                          ? "bg-[#35BFA3] text-white font-bold shadow-sm"
                          : "bg-[#F7F7F7] text-[#203430] hover:bg-slate-200"
                      )}
                    >
                      {mName.slice(0, 3)}
                    </button>
                  ))}
                </div>

                {mode === "hybrid" && (
                  <div className="border-t border-[#E5E6E6] mt-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setView("presets")}
                      className="text-[11px] font-bold text-[#63716E] hover:underline bg-transparent border-none cursor-pointer"
                    >
                      ← Back to Presets
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Full Date Selection View (Year + Month + Day) */}
            {view === "date" && (
              <div>
                {/* Year Navigator */}
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#E5E6E6]">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setYear((y) => y - 1); }}
                    className="p-1 rounded-lg hover:bg-slate-100 text-[#203430] border-none bg-transparent cursor-pointer transition-colors"
                    title="Previous Year"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("month")}
                    className="text-[13px] font-bold text-[#203430] hover:text-[#35BFA3] cursor-pointer bg-transparent border-none transition-colors"
                  >
                    {year}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setYear((y) => y + 1); }}
                    className="p-1 rounded-lg hover:bg-slate-100 text-[#203430] border-none bg-transparent cursor-pointer transition-colors"
                    title="Next Year"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Month Navigator */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E6E6]">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 rounded-lg hover:bg-slate-100 text-[#203430] border-none bg-transparent cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("month")}
                    className="text-[12px] font-semibold text-[#0E4D41] hover:underline cursor-pointer bg-transparent border-none"
                  >
                    {MONTH_NAMES[month]}
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 rounded-lg hover:bg-slate-100 text-[#203430] border-none bg-transparent cursor-pointer transition-colors"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Days Grid (7 Columns) */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#63716E] mb-1">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells before month start day */}
                  {Array.from({ length: startDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-6 w-6" />
                  ))}

                  {/* Day buttons */}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleSelectDay(d)}
                      className={cn(
                        "h-6 w-6 mx-auto rounded-full text-[11px] font-semibold flex items-center justify-center cursor-pointer border-none transition-all",
                        day === d
                          ? "bg-[#35BFA3] text-white font-bold ring-2 ring-[#0E4D41]/20 shadow-sm"
                          : "text-[#203430] hover:bg-emerald-50"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                {mode === "hybrid" && (
                  <div className="border-t border-[#E5E6E6] mt-2 pt-1 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setView("presets")}
                      className="text-[10px] font-bold text-[#63716E] hover:underline bg-transparent border-none cursor-pointer"
                    >
                      ← Back to Presets
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
