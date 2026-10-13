import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/LayoutAddons";
import { getCollection, saveCollection } from "../lib/db";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal,
  ArrowUpRight,
  History,
  ClipboardSignature,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Award,
  ArrowLeft,
  CheckCircle2,
  X,
  PlusCircle,
  Clock,
  Check,
  Download,
  Eye,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { EmployeePerformanceProfile } from "../components/performance/EmployeePerformanceProfile";
import { ReviewWorkflow } from "../components/performance/ReviewWorkflow";

/*
 * EXPECTED JSON SCHEMA / RECORD FORMAT FOR THE EMPLOYEE DATABASE STORE (db_employees) WITH PERFORMANCE METRICS:
 * [
 *   {
 *     "id": "EMP-0234",                     // String: Staff operational ID (e.g. "EMP-XXXX")
 *     "name": "Olivia Mason",               // String: Full legal name
 *     "role": "Marketing Executive",       // String: Corporate role / job title
 *     "dept": "Marketing",                // String: Department name
 *     "type": "Full-Time",                  // String: Employment type
 *     "model": "On-Site",                   // String: Work style
 *     "status": "Active",                   // String: Status ("Active", "On Leave", etc.)
 *     "avatar": "https://images.unsplash...",// String: Valid HTTPS avatar image URL
 *     "joinDate": "12 Jan 2033",            // String: Formatted onboard date
 *     "teamwork": 4.8,                      // Number: Cooperation rating (out of 5.0)
 *     "quality": 4.7,                       // Number: Work quality rating (out of 5.0)
 *     "problem": 4.5,                       // Number: Cognitive resolution rating (out of 5.0)
 *     "time": 4.6,                          // Number: Punctuality and resource rating (out of 5.0)
 *     "score": 94,                          // Number: Overall weighted score percentage (0 to 100)
 *     "subRole": "Marketing Specialist",    // String: Specific department sub-role
 *     "lastMonthly": "2026-05-01",          // String: Last monthly appraisal review date
 *     "lastQuarterly": "2026-03-01",        // String: Last quarterly progress check date
 *     "lastAnnual": "2025-12-01"            // String: Last annual review date
 *   }
 * ]
 */

interface TeamPerfItem {
  month: string;
  marketing: number;
  product: number;
  hr: number;
  ops: number;
  totalPercentage: number;
}

function MicroSegmentBar({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) {
  const totalSegments = 100;
  const activeSegments = Math.round((Math.max(0, Math.min(100, percentage)) / 100) * totalSegments);

  return (
    <div
      className="w-full h-[14px] overflow-hidden rounded-[2px]"
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        viewBox="0 0 400 14"
        preserveAspectRatio="none"
        className="w-full h-full block"
      >
        {Array.from({ length: totalSegments }).map((_, i) => (
          <rect
            key={i}
            x={i * 4}
            y={0}
            width={2}
            height={14}
            rx={0.5}
            fill={i < activeSegments ? color : "#ECEEED"}
          />
        ))}
      </svg>
    </div>
  );
}

function TeamPerformanceChart({
  data,
  timeframe,
}: {
  data: TeamPerfItem[];
  timeframe: string;
}) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [hoveredCoords, setHoveredCoords] = React.useState<{ x: number; y: number } | null>(null);

  if (!data || data.length === 0) return null;

  const baselineY = 135;
  const maxTrackH = 100;
  const colWidth = 22;
  const svgWidth = 340;
  const leftMargin = 26;
  const rightMargin = 26;
  const step = (svgWidth - leftMargin - rightMargin) / (data.length - 1);

  const hoveredItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  const handlePointerEnter = (e: React.SyntheticEvent, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredIndex(index);
    setHoveredCoords({ x: rect.left + rect.width / 2, y: rect.top });
  };

  const handlePointerLeave = () => {
    setHoveredIndex(null);
    setHoveredCoords(null);
  };

  return (
    <div className="relative w-full">
      <div className="w-full h-[180px]">
        <svg
          viewBox="0 0 340 165"
          className="w-full h-full block overflow-visible select-none"
        >
          <defs>
            {data.map((item, index) => {
              const colH = Math.max(8, (item.totalPercentage / 100) * maxTrackH);
              const colTopY = baselineY - colH;
              const colX = Math.round(leftMargin + index * step - colWidth / 2);
              return (
                <clipPath key={`clip-${index}`} id={`col-clip-${index}`}>
                  <rect
                    x={colX}
                    y={colTopY}
                    width={colWidth}
                    height={colH}
                    rx={4}
                    ry={4}
                  />
                </clipPath>
              );
            })}
          </defs>

          {data.map((item, index) => {
            const centerX = Math.round(leftMargin + index * step);
            const colX = Math.round(centerX - colWidth / 2);
            const colH = Math.max(8, (item.totalPercentage / 100) * maxTrackH);
            const colTopY = baselineY - colH;

            // Stack order (bottom to top: Marketing -> Product Design -> HR -> Operations)
            const mktH = (item.marketing / item.totalPercentage) * colH;
            const prdH = (item.product / item.totalPercentage) * colH;
            const hrH = (item.hr / item.totalPercentage) * colH;
            const opsH = Math.max(0, colH - (mktH + prdH + hrH));

            const mktY = baselineY - mktH;
            const prdY = mktY - prdH;
            const hrY = prdY - hrH;
            const opsY = colTopY;

            const isHovered = hoveredIndex === index;

            return (
              <g
                key={item.month}
                className="cursor-pointer group"
                tabIndex={0}
                role="button"
                aria-label={`${item.month}: ${item.totalPercentage}% performance`}
                onMouseEnter={(e) => handlePointerEnter(e, index)}
                onMouseMove={(e) => handlePointerEnter(e, index)}
                onMouseLeave={handlePointerLeave}
                onFocus={(e) => handlePointerEnter(e, index)}
                onBlur={handlePointerLeave}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handlePointerEnter(e, index);
                  }
                }}
              >
                {/* Full-height subtle background track */}
                <rect
                  x={colX}
                  y={baselineY - maxTrackH}
                  width={colWidth}
                  height={maxTrackH}
                  rx={4}
                  ry={4}
                  fill="#F5F6F6"
                  className="transition-colors"
                />

                {/* Stacked department segments clipped to rounded top */}
                <g
                  clipPath={`url(#col-clip-${index})`}
                  style={{
                    filter: isHovered
                      ? "drop-shadow(0 2px 4px rgba(14,77,65,0.25))"
                      : "none",
                    opacity: hoveredIndex !== null && !isHovered ? 0.75 : 1,
                    transition: "opacity 150ms ease, filter 150ms ease",
                  }}
                >
                  {/* Marketing - Dark Forest Green (#0E4D41) */}
                  <rect
                    x={colX}
                    y={mktY}
                    width={colWidth}
                    height={mktH + 0.5}
                    fill="#0E4D41"
                  />
                  {/* Product Design - Teal (#35BFA3) */}
                  <rect
                    x={colX}
                    y={prdY}
                    width={colWidth}
                    height={prdH + 0.5}
                    fill="#35BFA3"
                  />
                  {/* Human Resources - Pale Mint (#E4F2D3) */}
                  <rect
                    x={colX}
                    y={hrY}
                    width={colWidth}
                    height={hrH + 0.5}
                    fill="#E4F2D3"
                  />
                  {/* Operations - Light Gray (#E5E6E6) */}
                  <rect
                    x={colX}
                    y={opsY}
                    width={colWidth}
                    height={opsH + 0.5}
                    fill="#E5E6E6"
                  />
                </g>

                {/* Subtle active outline when hovered - NO gray rectangle */}
                {isHovered && (
                  <rect
                    x={colX - 1}
                    y={colTopY - 1}
                    width={colWidth + 2}
                    height={colH + 2}
                    rx={5}
                    ry={5}
                    fill="none"
                    stroke="#0E4D41"
                    strokeWidth={1.5}
                    className="pointer-events-none"
                  />
                )}

                {/* Percentage label above bar */}
                <text
                  x={centerX}
                  y={Math.max(16, colTopY - 7)}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill="#203430"
                  className="pointer-events-none select-none"
                >
                  {item.totalPercentage}%
                </text>

                {/* Month label below baseline */}
                <text
                  x={centerX}
                  y={154}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={isHovered ? 700 : 500}
                  fill={isHovered ? "#203430" : "#63716E"}
                  className="pointer-events-none select-none transition-colors"
                >
                  {item.month}
                </text>

                {/* Generous invisible target for seamless mouse/touch interaction */}
                <rect
                  x={colX - 10}
                  y={0}
                  width={colWidth + 20}
                  height={165}
                  fill="transparent"
                  className="cursor-pointer"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Viewport-Anchored Overlay Tooltip - ZERO layout reflow */}
      {hoveredIndex !== null && hoveredItem && hoveredCoords && (
        <div
          style={{
            position: "fixed",
            left: `${Math.min(window.innerWidth - 185, Math.max(12, hoveredCoords.x - 87))}px`,
            top: `${hoveredCoords.y - 148 < 12 ? hoveredCoords.y + 36 : hoveredCoords.y - 148}px`,
            zIndex: 9999,
          }}
          className="w-[175px] bg-white border border-[#E5E6E6] rounded-[12px] shadow-xl p-3 text-[#203430] pointer-events-none select-none animate-in fade-in duration-75"
        >
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#F0F0F0]">
            <span className="text-[12px] font-bold text-[#203430]">
              {hoveredItem.month} {timeframe === "Last Year" ? "2025" : "2026"}
            </span>
            <span className="text-[11px] font-bold text-[#0E4D41] bg-[#E4F2D3] px-1.5 py-0.5 rounded-[5px]">
              {hoveredItem.totalPercentage}%
            </span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#0E4D41] shrink-0" />
                <span className="text-[#63716E] font-medium">Marketing</span>
              </div>
              <span className="font-bold text-[#203430]">
                {hoveredItem.marketing}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#35BFA3] shrink-0" />
                <span className="text-[#63716E] font-medium">Product Design</span>
              </div>
              <span className="font-bold text-[#203430]">
                {hoveredItem.product}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#E4F2D3] border border-[#CCDBC0] shrink-0" />
                <span className="text-[#63716E] font-medium">HR</span>
              </div>
              <span className="font-bold text-[#203430]">
                {hoveredItem.hr}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#E5E6E6] border border-[#D5D6D6] shrink-0" />
                <span className="text-[#63716E] font-medium">Operations</span>
              </div>
              <span className="font-bold text-[#203430]">
                {hoveredItem.ops}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AveragePerformanceGauge({
  score,
  evaluatedCount,
  period,
}: {
  score: number;
  evaluatedCount: number;
  period: string;
}) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [gaugeCoords, setGaugeCoords] = React.useState<{ x: number; y: number } | null>(null);

  const R = 82;
  const totalLength = Math.PI * R;
  const clampedScore = Math.max(0, Math.min(100, score));
  const filledLength = (clampedScore / 100) * totalLength;
  const tealLength = Math.min(22, filledLength * 0.16);
  const greenLength = Math.max(0, filledLength - tealLength);

  const handlePointerEnter = (e: React.SyntheticEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setGaugeCoords({ x: rect.left + rect.width / 2, y: rect.top });
    setShowTooltip(true);
  };

  const handlePointerLeave = () => {
    setShowTooltip(false);
    setGaugeCoords(null);
  };

  return (
    <div
      className="relative w-full flex flex-col items-center justify-center pt-2 cursor-default select-none"
      onMouseEnter={handlePointerEnter}
      onMouseMove={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      onFocus={handlePointerEnter}
      onBlur={handlePointerLeave}
      tabIndex={0}
      role="region"
      aria-label={`Average Performance score ${clampedScore} percent`}
    >
      <div className="w-[230px] h-[135px] relative flex items-center justify-center">
        <svg
          viewBox="0 0 240 140"
          className="w-full h-full block overflow-visible"
        >
          {/* Subtle Background Track */}
          <path
            d="M 38 122 A 82 82 0 0 1 202 122"
            fill="none"
            stroke="#ECEEED"
            strokeWidth={18}
            strokeLinecap="round"
          />

          {/* Primary Arc - Dark Forest Green (#0E4D41) */}
          {greenLength > 0 && (
            <path
              d="M 38 122 A 82 82 0 0 1 202 122"
              fill="none"
              stroke="#0E4D41"
              strokeWidth={18}
              strokeDasharray={`${greenLength} ${totalLength}`}
              strokeDashoffset={0}
              strokeLinecap="round"
            />
          )}

          {/* End Segment - TeamHub Teal (#35BFA3) */}
          {tealLength > 0 && (
            <path
              d="M 38 122 A 82 82 0 0 1 202 122"
              fill="none"
              stroke="#35BFA3"
              strokeWidth={18}
              strokeDasharray={`${tealLength} ${totalLength}`}
              strokeDashoffset={-greenLength}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Center Content Stack - perfectly separated from the arc and each other */}
        <div className="absolute inset-x-0 bottom-4 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[12px] font-medium text-[#63716E] leading-none mb-1.5">
            Total Score
          </span>
          <span className="text-[32px] font-bold text-[#0E4D41] leading-none my-1 tracking-tight">
            {clampedScore}%
          </span>
          <div className="flex items-center gap-1 bg-[#E4F2D3] px-2.5 py-0.5 rounded-[6px] mt-1 shadow-2xs">
            <ArrowUpRight className="h-3 w-3 text-[#0E4D41]" />
            <span className="text-[11px] font-bold text-[#0E4D41]">
              {evaluatedCount > 0 ? "+4.7%" : "0.0%"}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Info Tooltip - Fixed Viewport Anchored, ZERO layout reflow */}
      {showTooltip && gaugeCoords && (
        <div
          style={{
            position: "fixed",
            left: `${Math.min(window.innerWidth - 200, Math.max(12, gaugeCoords.x - 95))}px`,
            top: `${gaugeCoords.y - 95 < 12 ? gaugeCoords.y + 40 : gaugeCoords.y - 95}px`,
            zIndex: 9999,
          }}
          className="bg-white border border-[#E5E6E6] rounded-xl shadow-lg px-3 py-2 text-[11px] text-[#203430] w-[190px] pointer-events-none animate-in fade-in duration-75"
        >
          <div className="font-bold text-[#203430] border-b border-[#F0F0F0] pb-1 mb-1 flex justify-between items-center">
            <span>Average Score</span>
            <span className="text-[#0E4D41]">{clampedScore}%</span>
          </div>
          <div className="space-y-0.5 text-[#63716E]">
            <p>Period: <span className="font-medium text-[#203430]">{period}</span></p>
            <p>Evaluated Staff: <span className="font-medium text-[#203430]">{evaluatedCount} members</span></p>
            <p>Trend: <span className="font-medium text-[#0E4D41]">+4.7% vs last period</span></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PerformancePage() {
  const [employees, setEmployees] = React.useState<any[]>(() => {
    const raw = getCollection<any[]>("db_employees", []);
    const nonDraft = raw.filter((e) => e.status !== "Draft");
    return nonDraft.map((e) => {
      const isSeeded = ["EMP-0234", "EMP-0178", "EMP-0289", "EMP-0312"].includes(e.id);
      return {
        ...e,
        teamwork: e.teamwork !== undefined ? e.teamwork : (isSeeded ? (e.id === "EMP-0234" ? 4.8 : e.id === "EMP-0178" ? 4.5 : e.id === "EMP-0289" ? 4.1 : e.id === "EMP-0312" ? 3.9 : undefined) : undefined),
        quality: e.quality !== undefined ? e.quality : (isSeeded ? (e.id === "EMP-0234" ? 4.7 : e.id === "EMP-0178" ? 4.6 : e.id === "EMP-0289" ? 4.3 : e.id === "EMP-0312" ? 3.5 : undefined) : undefined),
        problem: e.problem !== undefined ? e.problem : (isSeeded ? (e.id === "EMP-0234" ? 4.5 : e.id === "EMP-0178" ? 4.2 : e.id === "EMP-0289" ? 4.1 : e.id === "EMP-0312" ? 3.8 : undefined) : undefined),
        time: e.time !== undefined ? e.time : (isSeeded ? (e.id === "EMP-0234" ? 4.6 : e.id === "EMP-0178" ? 4.4 : e.id === "EMP-0289" ? 3.8 : e.id === "EMP-0312" ? 3.9 : undefined) : undefined),
        score: e.score !== undefined ? e.score : (isSeeded ? (e.id === "EMP-0234" ? 94 : e.id === "EMP-0178" ? 89 : e.id === "EMP-0289" ? 81 : e.id === "EMP-0312" ? 72 : undefined) : undefined),
        subRole: e.subRole || e.dept || "Specialist",
        lastMonthly: e.lastMonthly || (isSeeded ? "2026-05-01" : undefined),
        lastQuarterly: e.lastQuarterly || (isSeeded ? "2026-03-01" : undefined),
        lastAnnual: e.lastAnnual || (isSeeded ? "2025-12-01" : undefined)
      };
    });
  });

  const topPerformers = React.useMemo(() => {
    return [...employees]
      .filter((e) => e.score !== undefined && e.score !== null && (e.score || 0) >= 80)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 5);
  }, [employees]);

  const alerts = React.useMemo(() => {
    return employees
      .filter((e) => e.time !== undefined && e.time !== null && (e.time || 0) < 4.0)
      .map((e) => ({
        id: e.id,
        name: e.name,
        avatar: e.avatar,
        role: e.role,
        text: `Time competency has dropped to ${e.time}/5.0 (Critical Limit).`
      }));
  }, [employees]);

  // Live synchronizing engine across tab frames
  React.useEffect(() => {
    const handleDbUpdate = () => {
      const raw = getCollection<any[]>("db_employees", []);
      const nonDraft = raw.filter((e) => e.status !== "Draft");
      setEmployees(nonDraft.map((e) => {
        const isSeeded = ["EMP-0234", "EMP-0178", "EMP-0289", "EMP-0312"].includes(e.id);
        return {
          ...e,
          teamwork: e.teamwork !== undefined ? e.teamwork : (isSeeded ? (e.id === "EMP-0234" ? 4.8 : e.id === "EMP-0178" ? 4.5 : e.id === "EMP-0289" ? 4.1 : e.id === "EMP-0312" ? 3.9 : undefined) : undefined),
          quality: e.quality !== undefined ? e.quality : (isSeeded ? (e.id === "EMP-0234" ? 4.7 : e.id === "EMP-0178" ? 4.6 : e.id === "EMP-0289" ? 4.3 : e.id === "EMP-0312" ? 3.5 : undefined) : undefined),
          problem: e.problem !== undefined ? e.problem : (isSeeded ? (e.id === "EMP-0234" ? 4.5 : e.id === "EMP-0178" ? 4.2 : e.id === "EMP-0289" ? 4.1 : e.id === "EMP-0312" ? 3.8 : undefined) : undefined),
          time: e.time !== undefined ? e.time : (isSeeded ? (e.id === "EMP-0234" ? 4.6 : e.id === "EMP-0178" ? 4.4 : e.id === "EMP-0289" ? 3.8 : e.id === "EMP-0312" ? 3.9 : undefined) : undefined),
          score: e.score !== undefined ? e.score : (isSeeded ? (e.id === "EMP-0234" ? 94 : e.id === "EMP-0178" ? 89 : e.id === "EMP-0289" ? 81 : e.id === "EMP-0312" ? 72 : undefined) : undefined),
          subRole: e.subRole || e.dept || "Specialist",
          lastMonthly: e.lastMonthly || (isSeeded ? "2026-05-01" : undefined),
          lastQuarterly: e.lastQuarterly || (isSeeded ? "2026-03-01" : undefined),
          lastAnnual: e.lastAnnual || (isSeeded ? "2025-12-01" : undefined)
        };
      }));
    };

    window.addEventListener("storage", handleDbUpdate);
    window.addEventListener("db_updated", handleDbUpdate);
    window.addEventListener("roleChanged", handleDbUpdate);

    return () => {
      window.removeEventListener("storage", handleDbUpdate);
      window.removeEventListener("db_updated", handleDbUpdate);
      window.removeEventListener("roleChanged", handleDbUpdate);
    };
  }, []);

  // Timeframe and menu states
  const [teamPerfTimeframe, setTeamPerfTimeframe] = React.useState("Last Year");
  const [showTeamPerfMenu, setShowTeamPerfMenu] = React.useState(false);

  const [categoryTimeframe, setCategoryTimeframe] = React.useState("This Month");
  const [showCategoryMenu, setShowCategoryMenu] = React.useState(false);

  const [tableTimeframe, setTableTimeframe] = React.useState("This Month");
  const [showTableMenu, setShowTableMenu] = React.useState(false);

  const [activeCardMenu, setActiveCardMenu] = React.useState<string | null>(null);

  // Search & Filtering & Sorting
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortField, setSortField] = React.useState<string>("score");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");

  // Table pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(7);
  const [showPageSizeMenu, setShowPageSizeMenu] = React.useState(false);

  // Close menus on click outside
  React.useEffect(() => {
    const handleDocumentClick = () => {
      setShowTeamPerfMenu(false);
      setShowCategoryMenu(false);
      setShowTableMenu(false);
      setActiveCardMenu(null);
      setShowPageSizeMenu(false);
    };
    window.addEventListener("click", handleDocumentClick);
    return () => window.removeEventListener("click", handleDocumentClick);
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const filteredEmployees = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = employees.filter(
      (e) =>
        e.name.toLowerCase().includes(query) ||
        (e.role && e.role.toLowerCase().includes(query)) ||
        (e.subRole && e.subRole.toLowerCase().includes(query)) ||
        (e.dept && e.dept.toLowerCase().includes(query)) ||
        e.id.toLowerCase().includes(query)
    );

    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (aVal === undefined || aVal === null) aVal = -1;
      if (bVal === undefined || bVal === null) bVal = -1;

      if (typeof aVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(String(bVal))
          : String(bVal).localeCompare(aVal);
      }
      return sortDirection === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });

    return result;
  }, [employees, searchQuery, sortField, sortDirection]);

  // Paginated employees
  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
  const paginatedEmployees = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  const [hoveredCategory, setHoveredCategory] = React.useState<{
    name: string;
    score: number;
    percentage: number;
    x: number;
    y: number;
  } | null>(null);

  const dynamicTeamPerformance = React.useMemo(() => {
    const evaluated = employees.filter((e) => e.score !== undefined && e.score !== null);
    if (evaluated.length === 0) return [];
    const depts = ["Marketing", "Product Design", "Human Resources", "Operations"];
    const deptAverages = depts.map((d) => {
      const matching = evaluated.filter((e) => e.dept === d);
      if (matching.length === 0) return 40;
      const sum = matching.reduce((acc, e) => acc + (e.score || 0), 0);
      return Math.round(sum / matching.length);
    });

    let monthsConfig = [
      { month: "Jan", mults: [0.16, 0.15, 0.12, 0.11] },
      { month: "Feb", mults: [0.19, 0.18, 0.14, 0.13] },
      { month: "Mar", mults: [0.21, 0.20, 0.16, 0.15] },
      { month: "Apr", mults: [0.23, 0.22, 0.18, 0.15] },
      { month: "May", mults: [0.24, 0.24, 0.20, 0.17] },
      { month: "Jun", mults: [0.26, 0.26, 0.20, 0.18] },
    ];

    if (teamPerfTimeframe === "This Year") {
      monthsConfig = [
        { month: "Jan", mults: [0.18, 0.17, 0.14, 0.13] },
        { month: "Feb", mults: [0.20, 0.19, 0.15, 0.14] },
        { month: "Mar", mults: [0.22, 0.21, 0.17, 0.15] },
        { month: "Apr", mults: [0.24, 0.23, 0.18, 0.16] },
        { month: "May", mults: [0.25, 0.25, 0.19, 0.17] },
        { month: "Jun", mults: [0.27, 0.27, 0.21, 0.19] },
      ];
    } else if (teamPerfTimeframe === "Last 6 Months") {
      monthsConfig = [
        { month: "Jan", mults: [0.17, 0.16, 0.13, 0.12] },
        { month: "Feb", mults: [0.18, 0.18, 0.14, 0.13] },
        { month: "Mar", mults: [0.20, 0.19, 0.15, 0.14] },
        { month: "Apr", mults: [0.22, 0.21, 0.17, 0.15] },
        { month: "May", mults: [0.24, 0.23, 0.19, 0.17] },
        { month: "Jun", mults: [0.26, 0.25, 0.20, 0.18] },
      ];
    }

    return monthsConfig.map((m) => {
      const marketing = Math.round(deptAverages[0] * m.mults[0]);
      const product = Math.round(deptAverages[1] * m.mults[1]);
      const hr = Math.round(deptAverages[2] * m.mults[2]);
      const ops = Math.round(deptAverages[3] * m.mults[3]);
      const totalPercentage = marketing + product + hr + ops;
      return {
        month: m.month,
        marketing,
        product,
        hr,
        ops,
        totalPercentage,
      };
    });
  }, [employees, teamPerfTimeframe]);

  const dynamicCategoryPerformance = React.useMemo(() => {
    const evaluated = employees.filter((e) => e.score !== undefined && e.score !== null);
    if (evaluated.length === 0) return [];
    const total = evaluated.length;
    let avgTeamwork = evaluated.reduce((sum, e) => sum + (e.teamwork || 0), 0) / total;
    let avgQuality = evaluated.reduce((sum, e) => sum + (e.quality || 0), 0) / total;
    let avgProblem = evaluated.reduce((sum, e) => sum + (e.problem || 0), 0) / total;
    let avgTime = evaluated.reduce((sum, e) => sum + (e.time || 0), 0) / total;

    if (categoryTimeframe === "Last Month") {
      avgTeamwork = Math.max(1, avgTeamwork - 0.1);
      avgQuality = Math.max(1, avgQuality - 0.15);
      avgProblem = Math.max(1, avgProblem - 0.05);
      avgTime = Math.max(1, avgTime - 0.1);
    } else if (categoryTimeframe === "This Quarter") {
      avgTeamwork = Math.min(5, avgTeamwork + 0.05);
      avgQuality = Math.min(5, avgQuality + 0.05);
    } else if (categoryTimeframe === "This Year") {
      avgTeamwork = parseFloat((avgTeamwork * 0.98).toFixed(1));
      avgQuality = parseFloat((avgQuality * 0.99).toFixed(1));
    }

    return [
      {
        name: "Team Work",
        score: parseFloat(avgTeamwork.toFixed(1)),
        max: 5,
        percentage: Math.min(100, Math.round((avgTeamwork / 5) * 100)),
        color: "#35BFA3"
      },
      {
        name: "Work Quality",
        score: parseFloat(avgQuality.toFixed(1)),
        max: 5,
        percentage: Math.min(100, Math.round((avgQuality / 5) * 100)),
        color: "#0E4D41"
      },
      {
        name: "Problem-Solving",
        score: parseFloat(avgProblem.toFixed(1)),
        max: 5,
        percentage: Math.min(100, Math.round((avgProblem / 5) * 100)),
        color: "#8E9B97"
      },
      {
        name: "Time Management",
        score: parseFloat(avgTime.toFixed(1)),
        max: 5,
        percentage: Math.min(100, Math.round((avgTime / 5) * 100)),
        color: "#F8C947"
      }
    ];
  }, [employees, categoryTimeframe]);

  const avgScore = React.useMemo(() => {
    const evaluated = employees.filter((e) => e.score !== undefined && e.score !== null);
    if (evaluated.length === 0) return 0;
    const sum = evaluated.reduce((acc, e) => acc + (e.score || 0), 0);
    return Math.round(sum / evaluated.length);
  }, [employees]);

  const [selectedEmployee, setSelectedEmployee] = React.useState<any | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [modalStep, setModalStep] = React.useState<1 | 2 | 3>(1);
  const [selectedPeriod, setSelectedPeriod] = React.useState<"monthly" | "quarterly" | "annual">("monthly");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [currentView, setCurrentView] = React.useState<"dashboard" | "previous-reports" | "review-workflow">("dashboard");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const checkOverdueReviews = (emp: any) => {
    const now = new Date("2026-06-03").getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    const mDiff = emp.lastMonthly
      ? (now - new Date(emp.lastMonthly).getTime()) / oneDay
      : 999;
    const qDiff = emp.lastQuarterly
      ? (now - new Date(emp.lastQuarterly).getTime()) / oneDay
      : 999;
    const aDiff = emp.lastAnnual
      ? (now - new Date(emp.lastAnnual).getTime()) / oneDay
      : 999;

    const monthlyOverdue = mDiff > 30;
    const quarterlyOverdue = qDiff > 90;
    const annualOverdue = aDiff > 365;

    return {
      monthly: monthlyOverdue,
      quarterly: quarterlyOverdue,
      annual: annualOverdue,
      hasAny: monthlyOverdue || quarterlyOverdue || annualOverdue,
      mDays: Math.floor(mDiff),
      qDays: Math.floor(qDiff),
      aDays: Math.floor(aDiff),
    };
  };

  React.useEffect(() => {
    if (selectedEmployee) {
      const status = checkOverdueReviews(selectedEmployee);
      if (status.monthly) {
        setSelectedPeriod("monthly");
      } else if (status.quarterly) {
        setSelectedPeriod("quarterly");
      } else if (status.annual) {
        setSelectedPeriod("annual");
      } else {
        setSelectedPeriod("monthly");
      }
    }
  }, [selectedEmployee]);

  const startReviewForEmployee = () => {
    if (!selectedEmployee) return;
    setShowModal(false);
    setCurrentView("review-workflow");
  };

  const mockHistoryData: Record<string, any[]> = {
    "EMP-0234": [
      {
        id: "h-1",
        period: "Monthly Review",
        date: "April 12, 2026",
        score: "92%",
        status: "Approved & Signed",
        lead: "Marcus Vance",
      },
      {
        id: "h-2",
        period: "Quarterly Appraisal",
        date: "February 10, 2026",
        score: "89%",
        status: "Approved & Signed",
        lead: "Marcus Vance",
      },
      {
        id: "h-3",
        period: "Annual Assessment",
        date: "November 20, 2025",
        score: "90%",
        status: "Archived Record",
        lead: "Marcus Vance",
      },
    ],
    "EMP-0178": [
      {
        id: "h-1",
        period: "Monthly Review",
        date: "May 28, 2026",
        score: "90%",
        status: "Approved & Signed",
        lead: "Aria Sterling",
      },
      {
        id: "h-2",
        period: "Monthly Review",
        date: "April 25, 2026",
        score: "88%",
        status: "Approved & Signed",
        lead: "Aria Sterling",
      },
      {
        id: "h-3",
        period: "Quarterly Appraisal",
        date: "January 15, 2026",
        score: "91%",
        status: "Approved & Signed",
        lead: "Aria Sterling",
      },
    ],
    "EMP-0312": [
      {
        id: "h-1",
        period: "Monthly Review",
        date: "May 02, 2026",
        score: "81%",
        status: "Approved & Signed",
        lead: "Dr. Harold Foster",
      },
      {
        id: "h-2",
        period: "Quarterly Appraisal",
        date: "April 10, 2026",
        score: "83%",
        status: "Approved & Signed",
        lead: "Dr. Harold Foster",
      },
      {
        id: "h-3",
        period: "Annual Assessment",
        date: "May 15, 2024",
        score: "79%",
        status: "Archived Record",
        lead: "Dr. Harold Foster",
      },
    ],
    "EMP-0289": [
      {
        id: "h-1",
        period: "Monthly Review",
        date: "April 05, 2026",
        score: "89%",
        status: "Approved & Signed",
        lead: "Sophia Ramirez",
      },
      {
        id: "h-2",
        period: "Quarterly Appraisal",
        date: "March 12, 2026",
        score: "87%",
        status: "Approved & Signed",
        lead: "Sophia Ramirez",
      },
    ],
  };

  const getHistoryList = (empId: string) => {
    return (
      mockHistoryData[empId] || [
        {
          id: "fallback-1",
          period: "Monthly Review",
          date: "May 10, 2026",
          score: "85%",
          status: "Approved & Signed",
          lead: "HR Portal Admin",
        },
        {
          id: "fallback-2",
          period: "Quarterly Appraisal",
          date: "March 05, 2026",
          score: "84%",
          status: "Approved & Signed",
          lead: "HR Portal Admin",
        },
      ]
    );
  };

  return (
    <AppLayout
      title="Performance"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Performance" },
      ]}
    >
      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-8 left-1/2 -translate-x-1/2 bg-[#203430] border border-[#0E4D41] text-white rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl z-[1001]"
          >
            <div className="w-5 h-5 rounded-full bg-[#35BFA3] flex items-center justify-center shrink-0">
              <Check className="h-3 w-3 text-[#203430] stroke-[3]" />
            </div>
            <p className="text-xs sm:text-sm font-semibold tracking-wide">
              {toastMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {currentView === "previous-reports" && selectedEmployee ? (
        <EmployeePerformanceProfile
          employee={selectedEmployee}
          onBack={() => {
            setCurrentView("dashboard");
            setSelectedEmployee(null);
          }}
        />
      ) : currentView === "review-workflow" && selectedEmployee ? (
        <ReviewWorkflow
          employee={selectedEmployee}
          selectedPeriod={selectedPeriod}
          onCancel={() => {
            setCurrentView("dashboard");
            setSelectedEmployee(null);
          }}
          onPublishSuccess={(updatedEmployee) => {
            setEmployees((prev) =>
              prev.map((emp) =>
                emp.id === updatedEmployee.id ? updatedEmployee : emp,
              ),
            );
            setCurrentView("dashboard");
            setSelectedEmployee(null);
            showToast(
              `Successfully published ${selectedPeriod} review cycle for ${updatedEmployee.name}!`,
            );
          }}
        />
      ) : (
        <div className="flex flex-col xl:flex-row gap-5 relative">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Top Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Team Performance Card (approx 32% of desktop dashboard width, 5 of 12 cols in main section) */}
              <Card className="md:col-span-5 min-h-[314px] p-5 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[16px] font-bold text-[#203430]">
                      Team Performance
                    </h3>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTeamPerfMenu(!showTeamPerfMenu);
                          setShowCategoryMenu(false);
                        }}
                        className="flex items-center gap-2 bg-[#F7F7F7] hover:bg-[#EBEBEB] px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-[#203430] transition-colors cursor-pointer"
                      >
                        {teamPerfTimeframe} <ChevronDown className="h-3 w-3 text-[#63716E]" />
                      </button>
                      {showTeamPerfMenu && (
                        <div className="absolute right-0 top-8 z-30 w-36 bg-white border border-[#E5E6E6] rounded-xl shadow-lg py-1">
                          {["Last Year", "This Year", "Last 6 Months"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTeamPerfTimeframe(option);
                                setShowTeamPerfMenu(false);
                              }}
                              className={cn(
                                "w-full text-left px-3 py-1.5 text-[12px] transition-colors flex items-center justify-between",
                                teamPerfTimeframe === option
                                  ? "bg-[#E4F2D3] font-bold text-[#0E4D41]"
                                  : "text-[#203430] hover:bg-slate-50"
                              )}
                            >
                              <span>{option}</span>
                              {teamPerfTimeframe === option && <Check className="h-3 w-3 text-[#0E4D41]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {employees.length === 0 ? (
                    <div className="h-[210px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#E5E6E6] rounded-[12px] gap-1 bg-[#FDFDFD]">
                      <TrendingUp className="h-7 w-7 text-[#63716E]/30 mb-1" />
                      <p className="text-xs font-bold text-[#203430]">No Trend Metrics Available</p>
                      <p className="text-[11px] text-[#63716E] max-w-[240px]">Historical department tracking compiles automatically once employees are active.</p>
                    </div>
                  ) : (
                    <div className="w-full">
                      <TeamPerformanceChart
                        data={dynamicTeamPerformance}
                        timeframe={teamPerfTimeframe}
                      />

                      {/* Legend - matching bottom-to-top stack order */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 px-1 pt-2 border-t border-[#F0F0F0]">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#0E4D41] shrink-0" />
                          <span className="text-[11px] font-medium text-[#63716E]">
                            Marketing
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#35BFA3] shrink-0" />
                          <span className="text-[11px] font-medium text-[#63716E]">
                            Product Design
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#E4F2D3] border border-[#CCDBC0] shrink-0" />
                          <span className="text-[11px] font-medium text-[#63716E]">
                            Human Resources
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#E5E6E6] border border-[#D5D6D6] shrink-0" />
                          <span className="text-[11px] font-medium text-[#63716E]">
                            Operations
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Performance by Category Card (approx 42% of desktop dashboard width, 7 of 12 cols in main section) */}
              <Card className="md:col-span-7 min-h-[314px] p-5 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[16px] font-bold text-[#203430]">
                      Performance by Category
                    </h3>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCategoryMenu(!showCategoryMenu);
                          setShowTeamPerfMenu(false);
                        }}
                        className="flex items-center gap-2 bg-[#E4F2D3] hover:bg-[#d8ebc3] px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-[#0E4D41] transition-colors cursor-pointer"
                      >
                        {categoryTimeframe} <ChevronDown className="h-3 w-3 text-[#0E4D41]" />
                      </button>
                      {showCategoryMenu && (
                        <div className="absolute right-0 top-8 z-30 w-36 bg-white border border-[#E5E6E6] rounded-xl shadow-lg py-1">
                          {["This Month", "Last Month", "This Quarter", "This Year"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCategoryTimeframe(option);
                                setShowCategoryMenu(false);
                              }}
                              className={cn(
                                "w-full text-left px-3 py-1.5 text-[12px] transition-colors flex items-center justify-between",
                                categoryTimeframe === option
                                  ? "bg-[#E4F2D3] font-bold text-[#0E4D41]"
                                  : "text-[#203430] hover:bg-slate-50"
                              )}
                            >
                              <span>{option}</span>
                              {categoryTimeframe === option && <Check className="h-3 w-3 text-[#0E4D41]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {employees.length === 0 ? (
                    <div className="h-[210px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#E5E6E6] rounded-[12px] gap-1 bg-[#FDFDFD]">
                      <Award className="h-7 w-7 text-[#63716E]/30 mb-1" />
                      <p className="text-xs font-bold text-[#203430]">No Categories Recorded</p>
                      <p className="text-[11px] text-[#63716E] max-w-[240px]">Competency levels will display once staff reviews exist.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {dynamicCategoryPerformance.map((cat) => (
                        <div
                          key={cat.name}
                          className="space-y-1.5 relative group p-1.5 -mx-1.5 rounded-xl transition-colors hover:bg-[#F8FAF9] focus:outline-none focus:ring-1 focus:ring-[#35BFA3] cursor-default"
                          tabIndex={0}
                          role="region"
                          aria-label={`${cat.name}: ${cat.score} out of 5, ${cat.percentage} percent`}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredCategory({
                              name: cat.name,
                              score: cat.score,
                              percentage: cat.percentage,
                              x: rect.right,
                              y: rect.top + rect.height / 2,
                            });
                          }}
                          onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredCategory({
                              name: cat.name,
                              score: cat.score,
                              percentage: cat.percentage,
                              x: rect.right,
                              y: rect.top + rect.height / 2,
                            });
                          }}
                          onMouseLeave={() => setHoveredCategory(null)}
                          onFocus={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredCategory({
                              name: cat.name,
                              score: cat.score,
                              percentage: cat.percentage,
                              x: rect.right,
                              y: rect.top + rect.height / 2,
                            });
                          }}
                          onBlur={() => setHoveredCategory(null)}
                        >
                          <div className="flex justify-between items-baseline">
                            <span className="text-[12px] font-semibold text-[#203430] group-hover:text-[#0E4D41] transition-colors">
                              {cat.name}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-[12px] font-bold text-[#203430]">
                                {cat.score}
                              </span>
                              <span className="text-[11px] text-[#63716E]">/5</span>
                              <span className="text-[11px] text-[#E5E6E6] mx-1">
                                |
                              </span>
                              <span className="text-[12px] font-bold text-[#203430]">
                                {cat.percentage}%
                              </span>
                            </div>
                          </div>
                          <MicroSegmentBar
                            percentage={cat.percentage}
                            color={cat.color}
                          />
                        </div>
                      ))}

                      {/* Subtle Category Hover Tooltip - Floating Fixed Viewport Overlay */}
                      {hoveredCategory && (
                        <div
                          style={{
                            position: "fixed",
                            left: `${Math.min(window.innerWidth - 220, Math.max(12, hoveredCategory.x - 210))}px`,
                            top: `${Math.max(12, hoveredCategory.y - 36)}px`,
                            zIndex: 9999,
                          }}
                          className="bg-white border border-[#E5E6E6] rounded-xl shadow-lg px-2.5 py-1 text-[11px] text-[#203430] pointer-events-none flex items-center gap-2 animate-in fade-in duration-75"
                        >
                          <span className="font-bold text-[#0E4D41]">{hoveredCategory.name}:</span>
                          <span className="text-[#63716E]">{hoveredCategory.score}/5 ({hoveredCategory.percentage}%)</span>
                          <span className="text-[#A4ACAB]">·</span>
                          <span className="text-[#63716E]">{employees.filter((e) => e.score !== undefined).length} reviews</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Employee Performance Table Card */}
            <Card className="border-none rounded-[16px] bg-white shadow-sm overflow-hidden p-0 flex flex-col min-h-[568px]">
              {/* Header bar */}
              <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F5F5F5]">
                <div>
                  <h2 className="text-[16px] font-bold text-[#203430]">
                    Employee Performance
                  </h2>
                  <p className="text-[12px] text-[#63716E] mt-0.5 font-medium">
                    Select any employee row to verify timeline latency or initiate review actions
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Search Bar */}
                  <div className="relative w-full sm:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#63716E]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search employee, role..."
                      className="w-full h-[34px] pl-8.5 pr-7 text-[12px] bg-[#F7F7F7] border border-[#E5E6E6] rounded-[8px] focus:outline-none focus:border-[#35BFA3] text-[#203430] placeholder:text-[#A4ACAB]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A4ACAB] hover:text-[#63716E]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* Timeframe Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTableMenu(!showTableMenu);
                      }}
                      className="flex items-center gap-2 bg-[#E4F2D3] hover:bg-[#d8ebc3] h-[34px] px-3 rounded-[8px] text-[12px] font-medium text-[#0E4D41] transition-colors cursor-pointer"
                    >
                      {tableTimeframe} <ChevronDown className="h-3 w-3 text-[#0E4D41]" />
                    </button>
                    {showTableMenu && (
                      <div className="absolute right-0 top-9.5 z-30 w-36 bg-white border border-[#E5E6E6] rounded-xl shadow-lg py-1">
                        {["This Month", "Last Month", "This Quarter", "This Year"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTableTimeframe(opt);
                              setShowTableMenu(false);
                            }}
                            className={cn(
                              "w-full text-left px-3 py-1.5 text-[12px] transition-colors flex items-center justify-between",
                              tableTimeframe === opt
                                ? "bg-[#E4F2D3] font-bold text-[#0E4D41]"
                                : "text-[#203430] hover:bg-slate-50"
                            )}
                          >
                            <span>{opt}</span>
                            {tableTimeframe === opt && <Check className="h-3 w-3 text-[#0E4D41]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Table Data */}
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="bg-[#F7F7F7]">
                    <tr>
                      <th
                        onClick={() => handleSort("name")}
                        className="px-6 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#63716E] uppercase whitespace-nowrap">
                          Name
                          <ArrowUpDown className={cn("h-3 w-3", sortField === "name" ? "text-[#35BFA3]" : "text-[#A4ACAB]")} />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("role")}
                        className="px-6 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#63716E] uppercase whitespace-nowrap">
                          Job Title
                          <ArrowUpDown className={cn("h-3 w-3", sortField === "role" ? "text-[#35BFA3]" : "text-[#A4ACAB]")} />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("teamwork")}
                        className="px-6 py-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#63716E] uppercase whitespace-nowrap">
                          Teamwork
                          <ArrowUpDown className={cn("h-3 w-3", sortField === "teamwork" ? "text-[#35BFA3]" : "text-[#A4ACAB]")} />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("quality")}
                        className="px-6 py-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#63716E] uppercase whitespace-nowrap">
                          Work Quality
                          <ArrowUpDown className={cn("h-3 w-3", sortField === "quality" ? "text-[#35BFA3]" : "text-[#A4ACAB]")} />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("problem")}
                        className="px-6 py-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#63716E] uppercase whitespace-nowrap">
                          Problem Solving
                          <ArrowUpDown className={cn("h-3 w-3", sortField === "problem" ? "text-[#35BFA3]" : "text-[#A4ACAB]")} />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("time")}
                        className="px-6 py-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#63716E] uppercase whitespace-nowrap">
                          Time Management
                          <ArrowUpDown className={cn("h-3 w-3", sortField === "time" ? "text-[#35BFA3]" : "text-[#A4ACAB]")} />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("score")}
                        className="px-6 py-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#0E4D41] uppercase whitespace-nowrap">
                          Score
                          <ArrowUpDown className={cn("h-3 w-3", sortField === "score" ? "text-[#35BFA3]" : "text-[#A4ACAB]")} />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E6E6]">
                    {paginatedEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-sm text-slate-400 mx-auto">
                              <TrendingUp className="h-4 w-4" />
                            </div>
                            <p className="text-[13px] font-bold text-[#203430] mt-1">
                              No Scorecards Found
                            </p>
                            <p className="text-[11px] text-[#63716E] max-w-sm mx-auto leading-relaxed">
                              {searchQuery ? `No employees match "${searchQuery}". Clear your search query to see all scorecards.` : "There are currently no performance reviews recorded."}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedEmployees.map((e) => {
                        const state = checkOverdueReviews(e);
                        return (
                          <tr
                            key={e.id}
                            onClick={() => {
                              setSelectedEmployee(e);
                              setModalStep(1);
                              setShowModal(true);
                            }}
                            className="hover:bg-[#F7F7F7] active:bg-[#F0F0F0] transition-colors group h-[60px] cursor-pointer"
                            id={`emrow-${e.id.toLowerCase()}`}
                          >
                            <td className="px-6 py-2.5 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <img
                                  src={e.avatar}
                                  className="h-8.5 w-8.5 rounded-full object-cover shadow-xs border border-slate-100"
                                  alt={e.name}
                                />
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-bold text-[#203430] leading-none whitespace-nowrap group-hover:text-[#35BFA3] transition-colors">
                                      {e.name}
                                    </span>
                                    {state.hasAny && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-tight shrink-0">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                        Due
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-[#63716E] mt-1 uppercase font-bold tracking-wider">
                                    {e.id}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-[12px] font-bold text-[#203430] leading-none whitespace-nowrap">
                                  {e.role}
                                </span>
                                <span className="text-[11px] text-[#63716E] mt-1 font-medium">
                                  {e.subRole}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-2.5 text-center text-[12px] font-medium text-[#203430]">
                              {e.teamwork !== undefined && e.teamwork !== null ? e.teamwork : "—"}
                            </td>
                            <td className="px-6 py-2.5 text-center text-[12px] font-medium text-[#203430]">
                              {e.quality !== undefined && e.quality !== null ? e.quality : "—"}
                            </td>
                            <td className="px-6 py-2.5 text-center text-[12px] font-medium text-[#203430]">
                              {e.problem !== undefined && e.problem !== null ? e.problem : "—"}
                            </td>
                            <td className="px-6 py-2.5 text-center text-[12px] font-medium text-[#203430]">
                              {e.time !== undefined && e.time !== null ? e.time : "—"}
                            </td>
                            <td className="px-6 py-2.5 text-center whitespace-nowrap">
                              {e.score !== undefined && e.score !== null ? (
                                <span className="inline-block px-2.5 py-1 rounded-md text-[12px] font-bold bg-[#E4F2D3] text-[#0E4D41]">
                                  {e.score}%
                                </span>
                              ) : (
                                <span className="text-[11px] text-[#A4ACAB] font-medium">
                                  Not Evaluated
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Footer */}
              <div className="p-4 sm:p-5 border-t border-[#E5E6E6] flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                <div className="flex items-center gap-2.5">
                  <span className="text-[13px] text-[#63716E]">Show</span>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPageSizeMenu(!showPageSizeMenu);
                      }}
                      className="flex items-center gap-1.5 bg-[#F7F7F7] hover:bg-[#EBEBEB] h-[28px] px-2.5 rounded-[8px] text-[12px] font-bold text-[#203430] transition-colors cursor-pointer"
                    >
                      {pageSize} <ChevronDown className="h-3 w-3 text-[#63716E]" />
                    </button>
                    {showPageSizeMenu && (
                      <div className="absolute left-0 bottom-8 z-30 w-20 bg-white border border-[#E5E6E6] rounded-xl shadow-lg py-1">
                        {[5, 7, 10, 15].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPageSize(s);
                              setCurrentPage(1);
                              setShowPageSizeMenu(false);
                            }}
                            className={cn(
                              "w-full text-center px-2 py-1 text-[12px] transition-colors",
                              pageSize === s
                                ? "bg-[#E4F2D3] font-bold text-[#0E4D41]"
                                : "text-[#203430] hover:bg-slate-50"
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[13px] text-[#63716E]">
                    of {filteredEmployees.length} results
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="h-8 w-8 flex items-center justify-center rounded-[8px] bg-[#F5F5F5] hover:bg-[#EBEBEB] text-[#203430] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pNum = i + 1;
                    return (
                      <button
                        key={pNum}
                        type="button"
                        onClick={() => setCurrentPage(pNum)}
                        className={cn(
                          "h-8 min-w-[32px] px-2 flex items-center justify-center rounded-[8px] text-[12px] font-bold transition-colors cursor-pointer",
                          currentPage === pNum
                            ? "bg-[#35BFA3] text-white shadow-xs"
                            : "bg-[#F5F5F5] text-[#203430] hover:bg-[#EBEBEB]"
                        )}
                      >
                        {pNum}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="h-8 w-8 flex items-center justify-center rounded-[8px] bg-[#F5F5F5] hover:bg-[#EBEBEB] text-[#203430] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Sidebar Area (approx 26% of desktop dashboard width, 255px-310px) */}
          <div className="w-full xl:w-[26%] min-w-[255px] shrink-0 space-y-5">
            {/* Average Performance Gauge Card */}
            <Card className="min-h-[220px] p-5 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-full flex items-center justify-between mb-2">
                  <h3 className="text-[16px] font-bold text-[#203430]">
                    Average Performance
                  </h3>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCardMenu(activeCardMenu === "avg" ? null : "avg");
                      }}
                      className="p-1 rounded-md hover:bg-slate-100 transition-colors text-[#63716E]"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {activeCardMenu === "avg" && (
                      <div className="absolute right-0 top-7 z-30 w-44 bg-white border border-[#E5E6E6] rounded-xl shadow-lg py-1">
                        <button
                          type="button"
                          onClick={() => {
                            showToast("KPI calculation criteria loaded.");
                            setActiveCardMenu(null);
                          }}
                          className="w-full text-left px-3.5 py-1.5 text-[12px] text-[#203430] hover:bg-slate-50 font-medium flex items-center gap-2"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#63716E]" />
                          <span>View Scoring Rubric</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            showToast("Average performance report exported.");
                            setActiveCardMenu(null);
                          }}
                          className="w-full text-left px-3.5 py-1.5 text-[12px] text-[#203430] hover:bg-slate-50 font-medium flex items-center gap-2"
                        >
                          <Download className="h-3.5 w-3.5 text-[#63716E]" />
                          <span>Export Summary</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {employees.length === 0 ? (
                  <div className="h-[140px] flex flex-col items-center justify-center text-center gap-1 w-full p-2">
                    <Award className="h-6 w-6 text-[#63716E]/30 mb-0.5" />
                    <p className="text-[12px] font-bold text-[#203430]">No Ratings Yet</p>
                    <p className="text-[10px] text-[#63716E] max-w-[180px]">Add team members to view average ratings.</p>
                  </div>
                ) : (
                  <AveragePerformanceGauge
                    score={avgScore}
                    evaluatedCount={employees.filter((e) => e.score !== undefined).length}
                    period={categoryTimeframe}
                  />
                )}
              </div>
            </Card>

            {/* Top Performers Card */}
            <Card className="min-h-[380px] p-5 border-none rounded-[16px] bg-white shadow-sm flex flex-col">
              <div className="w-full flex items-center justify-between mb-3">
                <h3 className="text-[16px] font-bold text-[#203430]">
                  Top Performers
                </h3>
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCardMenu(activeCardMenu === "top" ? null : "top");
                    }}
                    className="p-1 rounded-md hover:bg-slate-100 transition-colors text-[#63716E]"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {activeCardMenu === "top" && (
                    <div className="absolute right-0 top-7 z-30 w-44 bg-white border border-[#E5E6E6] rounded-xl shadow-lg py-1">
                      <button
                        type="button"
                        onClick={() => {
                          showToast("Top performer leaderboard refreshed.");
                          setActiveCardMenu(null);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-[12px] text-[#203430] hover:bg-slate-50 font-medium flex items-center gap-2"
                      >
                        <RefreshCw className="h-3.5 w-3.5 text-[#63716E]" />
                        <span>Refresh Rankings</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 divide-y divide-[#E5E6E6]">
                {topPerformers.length === 0 ? (
                  <div className="py-10 px-2 text-center text-slate-400 text-[11px] leading-relaxed">
                    No high-achieving records recorded this evaluation cycle.
                  </div>
                ) : (
                  topPerformers.map((p) => (
                    <div
                      key={p.name}
                      onClick={() => {
                        setSelectedEmployee(p);
                        setModalStep(1);
                        setShowModal(true);
                      }}
                      className="flex items-center gap-3 py-2.5 hover:bg-slate-50/60 rounded-lg px-1 transition-colors cursor-pointer"
                    >
                      <img
                        src={p.avatar}
                        className="h-8.5 w-8.5 rounded-full object-cover shrink-0 shadow-xs border border-slate-100"
                        alt={p.name}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-[#203430] truncate hover:text-[#35BFA3] transition-colors">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-[#63716E] truncate font-medium">
                          {p.role}
                        </p>
                      </div>
                      <div className="flex items-baseline shrink-0">
                        <span className="text-[13px] font-bold text-[#0E4D41]">
                          {p.score}
                        </span>
                        <span className="text-[10px] text-[#63716E] font-medium">/100</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Time Management Alerts Card */}
            <Card className="min-h-[250px] p-5 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-full flex items-center justify-between mb-3">
                  <h3 className="text-[16px] font-bold text-[#203430]">
                    Time Management Alerts
                  </h3>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCardMenu(activeCardMenu === "alert" ? null : "alert");
                      }}
                      className="p-1 rounded-md hover:bg-slate-100 transition-colors text-[#63716E]"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {activeCardMenu === "alert" && (
                      <div className="absolute right-0 top-7 z-30 w-44 bg-white border border-[#E5E6E6] rounded-xl shadow-lg py-1">
                        <button
                          type="button"
                          onClick={() => {
                            showToast("All time alerts marked as acknowledged.");
                            setActiveCardMenu(null);
                          }}
                          className="w-full text-left px-3.5 py-1.5 text-[12px] text-[#203430] hover:bg-slate-50 font-medium flex items-center gap-2"
                        >
                          <Check className="h-3.5 w-3.5 text-[#63716E]" />
                          <span>Mark Acknowledged</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-[#E5E6E6]">
                  {alerts.length === 0 ? (
                    <div className="py-8 px-2 text-center text-slate-400 text-[11px] leading-relaxed">
                      No time tracking flags. All performance parameters are within baseline guidelines.
                    </div>
                  ) : (
                    alerts.map((a) => (
                      <div key={a.name} className="flex gap-3 py-2.5 px-1">
                        <div className="relative shrink-0">
                          <img
                            src={a.avatar}
                            className="h-8.5 w-8.5 rounded-full object-cover shadow-xs border border-slate-100"
                            alt={a.name}
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-[#E63D4B] rounded-full border-2 border-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-1.5 truncate">
                            <span className="text-[12px] font-bold text-[#203430]">
                              {a.name}
                            </span>
                            <span className="text-[11px] text-[#E5E6E6]">
                              |
                            </span>
                            <span className="text-[11px] text-[#63716E] truncate">
                              {a.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#63716E] mt-0.5 leading-snug">
                            {a.text}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Performance Initiation & Actions Modal */}
      <AnimatePresence>
        {showModal && selectedEmployee && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => setShowModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-[580px] rounded-2xl shadow-2xl flex flex-col relative z-50 overflow-hidden border border-slate-100 max-h-[90vh]"
            >
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-50 cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {modalStep === 1 && (
                <div id="step-1" className="flex flex-col h-full">
                  <div className="p-6 pb-4">
                    <h1 className="text-xl font-bold text-[#203430] tracking-tight">
                      Performance Actions
                    </h1>
                    <p className="text-xs text-[#63716E] mt-1">
                      Choose an action for {selectedEmployee.name} ({selectedEmployee.id})
                    </p>
                  </div>

                  {/* Profile Mini-Card */}
                  <div className="mx-6 mb-5 p-3.5 bg-[#F7F7F7] rounded-xl border border-slate-100 flex items-center gap-3.5">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#E4F2D3] shrink-0">
                      <img
                        alt={`${selectedEmployee.name} Profile`}
                        className="w-full h-full object-cover"
                        src={selectedEmployee.avatar}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[13px] text-[#203430] truncate">
                        {selectedEmployee.name}
                      </h3>
                      <p className="text-[11px] text-[#63716E] truncate">
                        {selectedEmployee.role} • {selectedEmployee.subRole}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <span className="bg-[#E4F2D3] text-[#0E4D41] font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border border-[#0E4D41]/10">
                        ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Overdue Review Status warnings */}
                  {(() => {
                    const status = checkOverdueReviews(selectedEmployee);
                    if (status.hasAny) {
                      return (
                        <div className="mx-6 mb-4 p-3 rounded-xl bg-orange-50/80 border border-orange-200 text-[#7a4100] flex gap-2.5 items-start">
                          <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-[11px] font-extrabold tracking-tight uppercase">
                              Review Timing Due:
                            </h4>
                            <p className="text-[11px] font-medium leading-relaxed mt-0.5">
                              {status.monthly && `Monthly Report is ${status.mDays - 30} days past standard cycle. `}
                              {status.quarterly && `Quarterly Appraisal is ${status.qDays - 90} days past due. `}
                              {status.annual && `Annual Review is ${status.aDays - 365} days past due.`}
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Newly Onboarded Employee Note */}
                  {(selectedEmployee.score === undefined || selectedEmployee.score === null) && (
                    <div className="mx-6 mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex gap-2.5 items-start">
                      <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-[11px] font-extrabold tracking-tight uppercase text-slate-700">
                          Newly Onboarded Employee
                        </h4>
                        <p className="text-[11px] font-medium leading-relaxed mt-0.5">
                          This employee was recently added to the roster. You may initiate their initial baseline review now.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Cards */}
                  <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      className="group flex flex-col p-4 bg-white border border-[#E5E6E6] hover:border-[#35BFA3] hover:bg-[#E4F2D3]/15 transition-all text-left rounded-xl cursor-pointer"
                      onClick={() => setModalStep(2)}
                    >
                      <div className="w-9 h-9 mb-3 rounded-xl bg-[#E4F2D3] text-[#0E4D41] flex items-center justify-center group-hover:bg-[#35BFA3] group-hover:text-white transition-colors">
                        <ClipboardSignature className="h-4.5 w-4.5" />
                      </div>
                      <h4 className="text-[13px] font-bold text-[#203430] mb-1">
                        Start New Review
                      </h4>
                      <p className="text-[11px] text-[#63716E] leading-normal font-medium">
                        Initiate a new evaluation cycle across Lead, Manager, and HR stages.
                      </p>
                    </button>

                    <button
                      type="button"
                      className="group flex flex-col p-4 bg-white border border-[#E5E6E6] hover:border-[#35BFA3] hover:bg-[#E4F2D3]/15 transition-all text-left rounded-xl cursor-pointer"
                      onClick={() => {
                        setCurrentView("previous-reports");
                        setShowModal(false);
                      }}
                    >
                      <div className="w-9 h-9 mb-3 rounded-xl bg-slate-100 text-[#0E4D41] flex items-center justify-center group-hover:bg-[#35BFA3] group-hover:text-white transition-colors">
                        <History className="h-4.5 w-4.5" />
                      </div>
                      <h4 className="text-[13px] font-bold text-[#203430] mb-1">
                        View Previous Reports
                      </h4>
                      <p className="text-[11px] text-[#63716E] leading-normal font-medium">
                        Access historical performance data, competency scores, and past feedback.
                      </p>
                    </button>
                  </div>

                  <div className="px-6 py-3.5 bg-[#F7F7F7] flex justify-end gap-3 mt-auto border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-[#203430] hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {modalStep === 2 && (
                <div id="step-2" className="flex flex-col h-full">
                  <div className="p-6 pb-4 border-b border-slate-100">
                    <h1 className="text-xl font-bold text-[#203430] tracking-tight">
                      Select Review Period
                    </h1>
                    <p className="text-xs text-[#63716E] mt-1">
                      Define the evaluation timeline structure for {selectedEmployee.name}.
                    </p>
                  </div>

                  <div className="p-6 space-y-3 overflow-y-auto max-h-[50vh]">
                    {[
                      {
                        id: "monthly",
                        title: "Monthly Review",
                        desc: "For regular monthly talent touchpoints and alignment metrics.",
                        icon: Clock,
                      },
                      {
                        id: "quarterly",
                        title: "Quarterly Appraisal",
                        desc: "Standard quarterly performance milestone and KPI auditing.",
                        icon: TrendingUp,
                      },
                      {
                        id: "annual",
                        title: "Annual Review",
                        desc: "Comprehensive year-end alignment, bonus audit & salary review.",
                        icon: Award,
                      },
                    ].map((period) => (
                      <label
                        key={period.id}
                        className={cn(
                          "relative flex items-center p-3.5 border rounded-xl cursor-pointer hover:bg-[#F7F7F7] transition-all group",
                          selectedPeriod === period.id
                            ? "border-[#35BFA3] bg-[#E4F2D3]/20"
                            : "border-[#E5E6E6]"
                        )}
                      >
                        <input
                          type="radio"
                          name="period"
                          value={period.id}
                          checked={selectedPeriod === period.id}
                          onChange={() => setSelectedPeriod(period.id as any)}
                          className="sr-only"
                        />
                        <div className="w-9 h-9 rounded-xl bg-slate-50 text-[#0E4D41] flex items-center justify-center mr-3.5 group-hover:bg-white transition-colors shrink-0">
                          <period.icon className="h-4.5 w-4.5 text-[#0E4D41]" />
                        </div>
                        <div className="flex-1 pr-6">
                          <span className="font-bold text-[13px] text-[#203430]">
                            {period.title}
                          </span>
                          <p className="text-[11px] text-[#63716E] mt-0.5 font-medium">
                            {period.desc}
                          </p>
                        </div>
                        <div className="absolute right-4 w-4.5 h-4.5 border-2 rounded-full flex items-center justify-center border-[#A4ACAB]">
                          {selectedPeriod === period.id && (
                            <div className="w-2.5 h-2.5 bg-[#35BFA3] rounded-full" />
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="px-6 py-3.5 bg-[#F7F7F7] flex justify-between items-center mt-auto border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setModalStep(1)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={startReviewForEmployee}
                      className="bg-[#35BFA3] hover:bg-[#2CA88E] text-white font-bold text-xs h-10 px-5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    >
                      <span>Confirm & Start Review</span>
                    </button>
                  </div>
                </div>
              )}

              {modalStep === 3 && (
                <div id="step-3" className="flex flex-col h-full">
                  <div className="p-6 pb-4 border-b border-slate-100">
                    <h1 className="text-xl font-bold text-[#203430] tracking-tight">
                      Performance History
                    </h1>
                    <p className="text-xs text-[#63716E] mt-1">
                      Historical report cards and approval trail logs for {selectedEmployee.name}.
                    </p>
                  </div>

                  <div className="p-6 space-y-3 overflow-y-auto max-h-[50vh]">
                    {getHistoryList(selectedEmployee.id).map((historyItem: any, index: number) => (
                      <div
                        key={index}
                        className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3.5 hover:bg-slate-100/50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-[#E4F2D3] flex items-center justify-center text-[#0E4D41] shrink-0 font-bold text-xs">
                          {historyItem.score}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-[#203430]">
                              {historyItem.period}
                            </span>
                            <span className="text-[10px] font-extrabold text-[#0E4D41] uppercase tracking-wide">
                              {historyItem.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-[#63716E]">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 shrink-0" />
                              {historyItem.date}
                            </span>
                            <span>•</span>
                            <span>Lead: {historyItem.lead}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-6 py-3.5 bg-[#F7F7F7] flex justify-between items-center mt-auto border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setModalStep(1)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-[#203430] hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-[#E5E6E6] flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-12">
          <p className="text-[12px] font-bold text-[#203430]">
            Copyright © 2025 Peterdraw
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Term and conditions", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[12px] text-[#63716E] hover:text-[#35BFA3] transition-colors whitespace-nowrap"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </AppLayout>
  );
}
