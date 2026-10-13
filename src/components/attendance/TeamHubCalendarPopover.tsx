import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface TeamHubCalendarPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // e.g. "19 Jun 2035"
  onSelectDate: (formattedDate: string) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  popoverWidth?: number;
}

export function TeamHubCalendarPopover({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
  triggerRef,
  popoverWidth = 270,
}: TeamHubCalendarPopoverProps) {
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Parse initial month from selectedDate or default to June 2035
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(() => {
    if (selectedDate) {
      const match = selectedDate.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
      if (match) {
        const monthStr = match[2].toLowerCase();
        const year = parseInt(match[3], 10);
        const monthIndex = [
          "jan", "feb", "mar", "apr", "may", "jun",
          "jul", "aug", "sep", "oct", "nov", "dec"
        ].findIndex((m) => monthStr.startsWith(m));
        if (monthIndex >= 0) return new Date(year, monthIndex, 1);
      }
    }
    return new Date(2035, 5, 1); // June 2035
  });

  // Sync calendarMonth when selectedDate changes
  React.useEffect(() => {
    if (selectedDate) {
      const match = selectedDate.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
      if (match) {
        const monthStr = match[2].toLowerCase();
        const year = parseInt(match[3], 10);
        const monthIndex = [
          "jan", "feb", "mar", "apr", "may", "jun",
          "jul", "aug", "sep", "oct", "nov", "dec"
        ].findIndex((m) => monthStr.startsWith(m));
        if (monthIndex >= 0) {
          setCalendarMonth(new Date(year, monthIndex, 1));
        }
      }
    }
  }, [selectedDate]);

  // Viewport-aware collision positioning
  const [coords, setCoords] = React.useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverHeight = 310;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Viewport-aware collision: flip above if constrained below
    const openAbove = spaceBelow < popoverHeight && spaceAbove > spaceBelow;
    const top = openAbove ? rect.top - popoverHeight - 6 : rect.bottom + 6;

    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - popoverWidth - 12);
    } else {
      left = Math.max(12, left);
    }

    setCoords({
      top: Math.round(top),
      left: Math.round(left),
    });
  }, [triggerRef, popoverWidth]);

  React.useEffect(() => {
    if (!isOpen) return;

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  // Click outside and Escape handling
  React.useEffect(() => {
    if (!isOpen) return;

    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

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

  const handleSelectDay = (day: number) => {
    const d = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    const formatted = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    onSelectDate(formatted);
    onClose();
  };

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: "fixed",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        zIndex: 9999,
      }}
      className="w-[270px] bg-white rounded-2xl border border-slate-100 shadow-2xl p-3 text-[#203430] animate-in fade-in zoom-in-95 duration-100"
      role="dialog"
      aria-label="TeamHub Calendar Date Picker"
    >
      {/* Month Navigator */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-xs text-[#203430]">
          {calendarMonth.toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              setCalendarMonth(
                new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)
              )
            }
            className="p-1 rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() =>
              setCalendarMonth(
                new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
              )
            }
            className="p-1 rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-[10px] text-center text-[#63716E] font-bold mb-1">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1 text-[11px] text-center mb-2">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const d = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
          const formatted = d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
          const isSelected = selectedDate === formatted;
          return (
            <button
              key={day}
              type="button"
              onClick={() => handleSelectDay(day)}
              className={cn(
                "h-6 w-6 mx-auto rounded-full flex items-center justify-center font-medium cursor-pointer transition-colors",
                isSelected
                  ? "bg-[#35BFA3] text-white font-bold shadow-2xs"
                  : "hover:bg-slate-100 text-[#203430]"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Calendar Footer Shortcuts */}
      <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
        <button
          type="button"
          onClick={() => {
            const now = new Date(2035, 5, 19); // Canonical active date June 19, 2035
            setCalendarMonth(new Date(now.getFullYear(), now.getMonth(), 1));
            handleSelectDay(now.getDate());
          }}
          className="text-[10px] font-semibold text-[#0E4D41] hover:underline cursor-pointer"
        >
          Today
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-[10px] font-semibold text-[#63716E] hover:text-[#203430] cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}
