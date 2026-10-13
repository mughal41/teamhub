import * as React from "react";
import { ChevronDown, Check, X, Layers, Building2, Briefcase, Users } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Employee } from "../../lib/db";

export interface EmployeeOverviewChartProps {
  employees: Employee[];
  selectedDept?: string;
  selectedModel?: string;
  selectedType?: string;
  onSelectDept?: (dept: string) => void;
  onSelectModel?: (model: string) => void;
  onSelectType?: (type: string) => void;
  onResetQuickFilter?: () => void;
}

type BreakdownMode = "department" | "model" | "type";

const COLOR_PALETTE = [
  "#0E4D41", // Deep forest teal
  "#28C2A9", // Bright mint teal
  "#9AE06D", // Soft lime green
  "#35BFA3", // Medium teal
  "#E4F2D3", // Pale mint
  "#6B7875", // Slate gray
  "#1F312E", // Dark slate
];

export function EmployeeOverviewChart({
  employees,
  selectedDept = "All",
  selectedModel = "All",
  selectedType = "All",
  onSelectDept,
  onSelectModel,
  onSelectType,
  onResetQuickFilter,
}: EmployeeOverviewChartProps) {
  const [mode, setMode] = React.useState<BreakdownMode>("department");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute breakdown data based on mode
  const data = React.useMemo(() => {
    const total = employees.length;
    if (total === 0) return [];

    const countMap: Record<string, number> = {};

    employees.forEach((emp) => {
      let key = "Other";
      if (mode === "department") {
        key = emp.dept || "Unassigned";
      } else if (mode === "model") {
        key = emp.model || "Standard";
      } else if (mode === "type") {
        key = emp.type || "Full-Time";
      }
      countMap[key] = (countMap[key] || 0) + 1;
    });

    const entries = Object.entries(countMap)
      .map(([name, count], index) => {
        let color = COLOR_PALETTE[index % COLOR_PALETTE.length];
        if (mode === "model") {
          if (name === "Hybrid") color = "#9AE06D";
          else if (name === "Remote") color = "#0E4D41";
          else if (name === "On-Site") color = "#28C2A9";
        }
        return {
          name,
          count,
          pct: Math.round((count / total) * 100),
          color,
        };
      })
      .sort((a, b) => b.count - a.count);

    return entries;
  }, [employees, mode]);

  const activeFilterName =
    mode === "department" && selectedDept !== "All"
      ? selectedDept
      : mode === "model" && selectedModel !== "All"
      ? selectedModel
      : mode === "type" && selectedType !== "All"
      ? selectedType
      : null;

  const handleBarClick = (name: string) => {
    if (mode === "department") {
      onSelectDept?.(selectedDept === name ? "All" : name);
    } else if (mode === "model") {
      onSelectModel?.(selectedModel === name ? "All" : name);
    } else if (mode === "type") {
      onSelectType?.(selectedType === name ? "All" : name);
    }
  };

  return (
    <div className="bg-white rounded-[16px] h-[195px] overflow-hidden shadow-2xs flex flex-col justify-between border border-[#EBECEB]">
      {/* Header Bar: 51px matching Figma specs */}
      <div className="px-3.5 sm:px-4 py-2.5 h-[51px] flex items-center justify-between border-b border-[#EBECEB] shrink-0 bg-white">
        <div className="flex items-center gap-1.5 min-w-0">
          <Layers className="h-4 w-4 text-[#28C2A9] shrink-0" />
          <h3 className="text-[13px] sm:text-[14px] font-bold text-[#1F312E] truncate">
            Workforce Overview
          </h3>
          {activeFilterName && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-[#E4F2D3] text-[#0E4D41] px-2 py-0.5 rounded-full truncate">
              {activeFilterName}
              <button
                type="button"
                onClick={onResetQuickFilter}
                className="hover:text-red-600 cursor-pointer"
                title="Clear filter"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
        </div>

        {/* Mode Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-7 px-2.5 rounded-lg bg-[#F6F7F6] hover:bg-[#EBECEB] text-[#1F312E] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-[#E5E6E6]"
          >
            <span>
              {mode === "department"
                ? "Department"
                : mode === "model"
                ? "Work Model"
                : "Type"}
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 text-[#6B7875] transition-transform",
                isDropdownOpen && "rotate-180"
              )}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-[#E5E6E6] p-1 z-50 animate-fade-in text-left">
              {[
                { id: "department", label: "By Department", icon: Building2 },
                { id: "model", label: "By Work Model", icon: Briefcase },
                { id: "type", label: "By Employment", icon: Users },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setMode(opt.id as BreakdownMode);
                    setIsDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex items-center justify-between transition-colors cursor-pointer",
                    mode === opt.id
                      ? "bg-[#E4F2D3] text-[#0E4D41] font-bold"
                      : "text-[#203430] hover:bg-[#F7F7F7]"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <opt.icon className="h-3 w-3 text-[#28C2A9]" />
                    <span>{opt.label}</span>
                  </div>
                  {mode === opt.id && <Check className="h-3 w-3 text-[#0E4D41]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chart Body: height ~144px */}
      <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 overflow-hidden">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[11px] text-[#6B7875]">
            No employee records to analyze
          </div>
        ) : (
          <>
            {/* Top Stacked Proportion Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#6B7875] font-medium">Headcount Proportion</span>
                <span className="text-[#0E4D41] font-bold">
                  {employees.length} {employees.length === 1 ? "Staff" : "Total Staff"}
                </span>
              </div>
              <div className="h-3.5 w-full bg-[#F0F1F0] rounded-full overflow-hidden flex p-0.5 gap-0.5">
                {data.map((item) => {
                  const isSelected = activeFilterName === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleBarClick(item.name)}
                      title={`${item.name}: ${item.count} (${item.pct}%) - Click to filter`}
                      style={{
                        width: `${Math.max(item.pct, 6)}%`,
                        backgroundColor: item.color,
                      }}
                      className={cn(
                        "h-full rounded-full transition-all cursor-pointer first:rounded-l-full last:rounded-r-full hover:opacity-90",
                        isSelected && "ring-2 ring-offset-1 ring-[#0E4D41]"
                      )}
                    />
                  );
                })}
              </div>
            </div>

            {/* Bottom Legend Chips - Clickable to filter */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 overflow-y-auto max-h-[70px] pr-1">
              {data.slice(0, 6).map((item) => {
                const isSelected = activeFilterName === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleBarClick(item.name)}
                    className={cn(
                      "flex items-center justify-between px-2 py-1 rounded-lg text-[10.5px] transition-all cursor-pointer border text-left truncate",
                      isSelected
                        ? "bg-[#E4F2D3] border-[#28C2A9] text-[#0E4D41] font-bold shadow-2xs"
                        : "bg-[#F7F7F7] border-transparent hover:bg-[#EFEFEF] text-[#203430]"
                    )}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#0E4D41] ml-1 shrink-0">
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
