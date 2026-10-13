import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Employee } from "../../lib/db";

export interface DepartmentsDonutChartProps {
  employees: Employee[];
  selectedDept?: string;
  onSelectDept?: (dept: string) => void;
  selectedPeriod?: string;
  onSelectPeriod?: (period: string) => void;
}

// 6 distinctive Figma category colors
const DEPT_COLORS = [
  "#0E4D41", // Dark Green (Primary)
  "#35BFA3", // Green / Teal
  "#E4F2D3", // Light Mint Green
  "#63716E", // Dark Grey
  "#A4ACAB", // Light Grey
  "#E5E6E6", // Semi Subtle Grey / Neutral
];

export function DepartmentsDonutChart({
  employees,
  selectedDept = "All",
  onSelectDept,
  selectedPeriod = "This Month",
  onSelectPeriod,
}: DepartmentsDonutChartProps) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [hoveredDept, setHoveredDept] = React.useState<string | null>(null);

  const periods = ["This Month", "Last Month", "This Quarter", "This Year"];

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute department breakdown from real employee data
  const { total, items } = React.useMemo(() => {
    const totalCount = employees.length;
    if (totalCount === 0) return { total: 0, items: [] };

    const map: Record<string, number> = {};
    employees.forEach((emp) => {
      const deptName = emp.dept?.trim() || "Unassigned";
      map[deptName] = (map[deptName] || 0) + 1;
    });

    const sorted = Object.entries(map)
      .map(([name, count]) => ({
        name,
        count,
        pct: Math.round((count / totalCount) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    const colored = sorted.map((item, index) => ({
      ...item,
      color: DEPT_COLORS[index % DEPT_COLORS.length],
    }));

    return { total: totalCount, items: colored };
  }, [employees]);

  // Donut geometry for SVG with gap segments
  // Radius: 64, StrokeWidth: 26, Center: 78, 78 (Size 156x156)
  const size = 156;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2; // (156 - 26) / 2 = 65
  const circumference = 2 * Math.PI * radius; // ~408.4

  // Split departments into 2 columns for the legend (matching Figma 2 columns)
  // Left column: first half or up to 3 items, Right column: remainder
  const midPoint = Math.ceil(items.length / 2);
  const leftColItems = items.slice(0, midPoint);
  const rightColItems = items.slice(midPoint);

  return (
    <div className="bg-white rounded-[16px] h-full min-h-[238px] p-4 flex flex-col justify-between border border-[#EBECEB] shadow-2xs">
      {/* Header Section: height 34px */}
      <div className="flex items-center justify-between h-[34px] w-full shrink-0">
        <h3 className="text-[16px] font-semibold text-[#203430] tracking-[-0.04em] leading-[120%]">
          Departments
        </h3>

        {/* This Month Dropdown button: Light Green #E4F2D3, border-radius 8px, height 34px */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-[34px] px-3 bg-[#E4F2D3] hover:bg-[#d8ecbe] text-[#203430] rounded-[8px] text-[12px] font-medium flex items-center gap-2 transition-colors cursor-pointer select-none"
          >
            <span>{selectedPeriod}</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-[#203430] transition-transform duration-200",
                isDropdownOpen && "rotate-180"
              )}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-[#E5E6E6] p-1.5 z-50 animate-in fade-in zoom-in-95">
              {periods.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    onSelectPeriod?.(p);
                    setIsDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                    selectedPeriod === p
                      ? "bg-[#E4F2D3] text-[#0E4D41] font-bold"
                      : "text-[#203430] hover:bg-[#F7F7F7]"
                  )}
                >
                  <span>{p}</span>
                  {selectedPeriod === p && <Check className="h-3 w-3 text-[#0E4D41]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body: Donut Chart on Left, 2-Column Legend on Right */}
      {items.length === 0 ? (
        <div className="h-[156px] flex flex-col items-center justify-center text-[#63716E] text-xs">
          <span>No department records found</span>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 px-1 py-1">
          {/* Donut Chart (156x156) */}
          <div className="relative w-[156px] h-[156px] shrink-0 flex items-center justify-center">
            <svg
              width="156"
              height="156"
              viewBox="0 0 156 156"
              className="transform -rotate-90 select-none"
            >
              {(() => {
                let accumulatedPercent = 0;
                // Add a small angular gap between segments if multiple items
                const gapPercent = items.length > 1 ? 1.2 : 0;
                const totalGap = gapPercent * items.length;
                const availablePercent = 100 - totalGap;

                return items.map((item) => {
                  const itemRatio = item.count / total;
                  const itemPercent = Math.max(itemRatio * availablePercent, 2);
                  const strokeDasharray = `${(itemPercent / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((accumulatedPercent / 100) * circumference);

                  accumulatedPercent += itemPercent + gapPercent;

                  const isHovered = hoveredDept === item.name;
                  const isSelected = selectedDept === item.name;

                  return (
                    <circle
                      key={item.name}
                      cx="78"
                      cy="78"
                      r={radius}
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth={isHovered || isSelected ? strokeWidth + 2 : strokeWidth}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="cursor-pointer transition-all duration-200"
                      style={{
                        opacity:
                          hoveredDept && !isHovered && selectedDept === "All"
                            ? 0.45
                            : selectedDept !== "All" && !isSelected
                            ? 0.4
                            : 1,
                      }}
                      onMouseEnter={() => setHoveredDept(item.name)}
                      onMouseLeave={() => setHoveredDept(null)}
                      onClick={() => onSelectDept?.(selectedDept === item.name ? "All" : item.name)}
                    >
                      <title>{`${item.name}: ${item.count} (${item.pct}%)`}</title>
                    </circle>
                  );
                });
              })()}
            </svg>

            {/* Subtle center detail or tooltip indicator */}
            {hoveredDept && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2 animate-in fade-in">
                <span className="text-[10px] font-bold text-[#0E4D41] truncate max-w-[80px]">
                  {hoveredDept}
                </span>
                <span className="text-[12px] font-bold text-[#203430]">
                  {items.find((i) => i.name === hoveredDept)?.pct}%
                </span>
              </div>
            )}
          </div>

          {/* Department Legend: 2 columns matching Figma design */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 w-full">
            {/* Left Column */}
            <div className="flex flex-col gap-3 min-w-0">
              {leftColItems.map((item) => {
                const isHovered = hoveredDept === item.name;
                const isSelected = selectedDept === item.name;
                return (
                  <div
                    key={item.name}
                    className={cn(
                      "flex items-start gap-2 cursor-pointer group transition-opacity",
                      selectedDept !== "All" && !isSelected && "opacity-50",
                      hoveredDept && !isHovered && selectedDept === "All" && "opacity-50"
                    )}
                    onMouseEnter={() => setHoveredDept(item.name)}
                    onMouseLeave={() => setHoveredDept(null)}
                    onClick={() => onSelectDept?.(selectedDept === item.name ? "All" : item.name)}
                  >
                    {/* Color dot: 8x8px rounded-full */}
                    <span
                      className="w-2 h-2 rounded-full shrink-0 mt-1 transition-transform group-hover:scale-125"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[12px] text-[#203430] font-normal leading-[130%] truncate group-hover:text-[#0E4D41]"
                        title={item.name}
                      >
                        {item.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[12px]">
                        {/* Users icon SVG matching Figma */}
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="shrink-0"
                        >
                          <path
                            d="M6 8C7.65685 8 9 6.65685 9 5C9 3.34315 7.65685 2 6 2C4.34315 2 3 3.34315 3 5C3 6.65685 4.34315 8 6 8Z"
                            stroke="#35BFA3"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10.5 5.5C11.6046 5.5 12.5 4.60457 12.5 3.5C12.5 2.39543 11.6046 1.5 10.5 1.5"
                            stroke="#35BFA3"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M1.5 14C1.5 11.5 3.5 9.5 6 9.5C8.5 9.5 10.5 11.5 10.5 14"
                            stroke="#35BFA3"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 9.7C13.2 10.4 14 11.7 14 13.5"
                            stroke="#35BFA3"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-[#63716E] leading-none">{item.count}</span>
                        <span className="text-[#A4ACAB] leading-none">—</span>
                        <span className="font-bold text-[#203430] leading-none">
                          {item.pct}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-3 min-w-0">
              {rightColItems.map((item) => {
                const isHovered = hoveredDept === item.name;
                const isSelected = selectedDept === item.name;
                return (
                  <div
                    key={item.name}
                    className={cn(
                      "flex items-start gap-2 cursor-pointer group transition-opacity",
                      selectedDept !== "All" && !isSelected && "opacity-50",
                      hoveredDept && !isHovered && selectedDept === "All" && "opacity-50"
                    )}
                    onMouseEnter={() => setHoveredDept(item.name)}
                    onMouseLeave={() => setHoveredDept(null)}
                    onClick={() => onSelectDept?.(selectedDept === item.name ? "All" : item.name)}
                  >
                    {/* Color dot: 8x8px rounded-full */}
                    <span
                      className="w-2 h-2 rounded-full shrink-0 mt-1 transition-transform group-hover:scale-125"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[12px] text-[#203430] font-normal leading-[130%] truncate group-hover:text-[#0E4D41]"
                        title={item.name}
                      >
                        {item.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[12px]">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="shrink-0"
                        >
                          <path
                            d="M6 8C7.65685 8 9 6.65685 9 5C9 3.34315 7.65685 2 6 2C4.34315 2 3 3.34315 3 5C3 6.65685 4.34315 8 6 8Z"
                            stroke="#35BFA3"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10.5 5.5C11.6046 5.5 12.5 4.60457 12.5 3.5C12.5 2.39543 11.6046 1.5 10.5 1.5"
                            stroke="#35BFA3"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M1.5 14C1.5 11.5 3.5 9.5 6 9.5C8.5 9.5 10.5 11.5 10.5 14"
                            stroke="#35BFA3"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 9.7C13.2 10.4 14 11.7 14 13.5"
                            stroke="#35BFA3"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-[#63716E] leading-none">{item.count}</span>
                        <span className="text-[#A4ACAB] leading-none">—</span>
                        <span className="font-bold text-[#203430] leading-none">
                          {item.pct}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
