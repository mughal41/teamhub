import * as React from "react";
import { createPortal } from "react-dom";
import { Clock, Check, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface InteractiveTimePickerProps {
  id?: string;
  label: string;
  value: string; // e.g. "09:00 AM"
  onChange: (time: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

// Quick presets standard for HR punch times
const QUICK_TIME_PRESETS = [
  "09:00 AM",
  "01:00 PM",
  "02:00 PM",
  "05:00 PM",
  "06:00 PM",
];

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = [
  "00", "05", "10", "15", "20", "25",
  "30", "35", "40", "45", "50", "55",
];

export function InteractiveTimePicker({
  id,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = "09:00 AM",
  className,
}: InteractiveTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [typedValue, setTypedValue] = React.useState(value);

  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Parse hour, minute, period from current string value
  const parsedTime = React.useMemo(() => {
    const match = (value || "").match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      return {
        hour: parseInt(match[1], 10),
        minute: match[2],
        period: match[3].toUpperCase() as "AM" | "PM",
      };
    }
    return { hour: 9, minute: "00", period: "AM" as "AM" | "PM" };
  }, [value]);

  const [selectedHour, setSelectedHour] = React.useState(parsedTime.hour);
  const [selectedMinute, setSelectedMinute] = React.useState(parsedTime.minute);
  const [selectedPeriod, setSelectedPeriod] = React.useState(parsedTime.period);

  // Sync internal state when external value changes
  React.useEffect(() => {
    setTypedValue(value);
    setSelectedHour(parsedTime.hour);
    setSelectedMinute(parsedTime.minute);
    setSelectedPeriod(parsedTime.period);
  }, [value, parsedTime]);

  // Viewport-aware collision positioning
  const [coords, setCoords] = React.useState<{ top: number; left: number; placement: "top" | "bottom" }>({
    top: 0,
    left: 0,
    placement: "bottom",
  });

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverHeight = 250;
    const popoverWidth = 260;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

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
      placement: openAbove ? "top" : "bottom",
    });
  }, []);

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
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const commitTime = (h: number, m: string, p: "AM" | "PM") => {
    const formatted = `${String(h).padStart(2, "0")}:${m} ${p}`;
    setSelectedHour(h);
    setSelectedMinute(m);
    setSelectedPeriod(p);
    setTypedValue(formatted);
    onChange(formatted);
  };

  const handleSelectHour = (h: number) => {
    commitTime(h, selectedMinute, selectedPeriod);
  };

  const handleSelectMinute = (m: string) => {
    commitTime(selectedHour, m, selectedPeriod);
  };

  const handleSelectPeriod = (p: "AM" | "PM") => {
    commitTime(selectedHour, selectedMinute, p);
  };

  const handlePresetClick = (preset: string) => {
    const match = preset.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      const h = parseInt(match[1], 10);
      const m = match[2];
      const p = match[3].toUpperCase() as "AM" | "PM";
      commitTime(h, m, p);
    }
  };

  const handleSetCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const period: "AM" | "PM" = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    // Round minutes to nearest 5 or keep exact
    const roundedMin = String(Math.round(minutes / 5) * 5 % 60).padStart(2, "0");
    commitTime(hours, roundedMin, period);
  };

  // Allow manual input editing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setTypedValue(raw);

    // If matches complete time pattern, automatically sync
    const match = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      const h = parseInt(match[1], 10);
      const m = match[2];
      const p = match[3].toUpperCase() as "AM" | "PM";
      if (h >= 1 && h <= 12 && parseInt(m, 10) >= 0 && parseInt(m, 10) < 60) {
        setSelectedHour(h);
        setSelectedMinute(m);
        setSelectedPeriod(p);
        onChange(`${String(h).padStart(2, "0")}:${m} ${p}`);
      }
    }
  };

  const handleInputBlur = () => {
    // If invalid format on blur, restore to last committed value
    const match = typedValue.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) {
      setTypedValue(value);
    }
  };

  return (
    <div className={cn("min-w-0 flex-1", className)}>
      <label
        htmlFor={id}
        className="text-[10px] font-bold text-[#63716E] block mb-1 truncate"
      >
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      {/* Trigger Field */}
      <div
        ref={triggerRef}
        className={cn(
          "relative flex items-center h-9 rounded-xl border bg-white transition-all",
          isOpen
            ? "border-[#35BFA3] ring-1 ring-[#35BFA3]/20 shadow-xs"
            : "border-[#E5E6E6] hover:border-slate-300",
          disabled && "opacity-60 pointer-events-none bg-slate-50"
        )}
      >
        <input
          id={id}
          type="text"
          value={typedValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="w-full h-full pl-3 pr-8 rounded-xl outline-none text-xs text-[#203430] font-medium bg-transparent"
        />

        <button
          type="button"
          onClick={() => {
            if (!disabled) setIsOpen((prev) => !prev);
          }}
          aria-label={`Pick time for ${label}`}
          aria-expanded={isOpen}
          className="absolute right-2 p-1 text-slate-400 hover:text-[#35BFA3] cursor-pointer transition-colors"
        >
          <Clock className="h-4 w-4" />
        </button>
      </div>

      {/* Interactive Time Picker Popover via React Portal */}
      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 9999,
            }}
            className="w-[260px] bg-white rounded-2xl border border-slate-100 shadow-2xl p-3 text-[#203430] animate-in fade-in zoom-in-95 duration-100"
            role="dialog"
            aria-label={`Time picker for ${label}`}
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 min-w-0">
                <Clock className="h-3.5 w-3.5 text-[#35BFA3] shrink-0" />
                <span className="font-bold text-xs text-[#203430] truncate">
                  {label}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#F8FCF3] text-[#0E4D41] font-bold text-[11px] border border-[#35BFA3]/30 tracking-wide">
                {String(selectedHour).padStart(2, "0")}:{selectedMinute} {selectedPeriod}
              </span>
            </div>

            {/* Selection Columns: Hours | Minutes | Period */}
            <div className="grid grid-cols-3 gap-1.5 pb-2.5 mb-2 border-b border-slate-100">
              {/* Hours Column */}
              <div>
                <span className="block text-[10px] font-bold text-[#63716E] text-center mb-1">
                  Hour
                </span>
                <div className="h-32 overflow-y-auto space-y-0.5 pr-0.5 overscroll-contain">
                  {HOURS.map((h) => {
                    const isSelected = selectedHour === h;
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => handleSelectHour(h)}
                        className={cn(
                          "w-full h-6 rounded-lg text-[11px] font-semibold flex items-center justify-center transition-colors cursor-pointer",
                          isSelected
                            ? "bg-[#35BFA3] text-white font-bold shadow-2xs"
                            : "hover:bg-[#F8FCF3] text-[#203430]"
                        )}
                      >
                        {String(h).padStart(2, "0")}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minutes Column */}
              <div>
                <span className="block text-[10px] font-bold text-[#63716E] text-center mb-1">
                  Minute
                </span>
                <div className="h-32 overflow-y-auto space-y-0.5 pr-0.5 overscroll-contain">
                  {MINUTES.map((m) => {
                    const isSelected = selectedMinute === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleSelectMinute(m)}
                        className={cn(
                          "w-full h-6 rounded-lg text-[11px] font-semibold flex items-center justify-center transition-colors cursor-pointer",
                          isSelected
                            ? "bg-[#35BFA3] text-white font-bold shadow-2xs"
                            : "hover:bg-[#F8FCF3] text-[#203430]"
                        )}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Period Column */}
              <div>
                <span className="block text-[10px] font-bold text-[#63716E] text-center mb-1">
                  AM / PM
                </span>
                <div className="space-y-1.5 pt-1">
                  {(["AM", "PM"] as const).map((p) => {
                    const isSelected = selectedPeriod === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleSelectPeriod(p)}
                        className={cn(
                          "w-full h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-colors cursor-pointer",
                          isSelected
                            ? "bg-[#35BFA3] text-white shadow-2xs"
                            : "hover:bg-slate-100 text-[#63716E] border border-slate-100"
                        )}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mb-2">
              <span className="block text-[9px] font-bold text-[#63716E] uppercase tracking-wider mb-1">
                Quick Presets
              </span>
              <div className="flex flex-wrap gap-1">
                {QUICK_TIME_PRESETS.map((preset) => {
                  const isActive = value === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className={cn(
                        "px-1.5 py-0.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer",
                        isActive
                          ? "bg-[#35BFA3] text-white font-bold"
                          : "bg-slate-100 hover:bg-[#F8FCF3] text-[#203430] hover:text-[#0E4D41]"
                      )}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Popover Footer */}
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSetCurrentTime}
                className="text-[10px] font-semibold text-[#0E4D41] hover:underline cursor-pointer"
              >
                Set Current Time
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 rounded-lg bg-[#35BFA3] hover:bg-[#28C2A9] text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <Check className="h-3 w-3" />
                Done
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
