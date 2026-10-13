import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import {
  getCollection,
  saveCollection,
  Employee,
  PayStructure,
  EmployeeCompensationOverride,
} from "../lib/db";
import { cn } from "../lib/utils";
import { Card } from "../components/ui/LayoutAddons";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  ChevronDown,
  ArrowUpDown,
  CircleDollarSign,
  HandCoins,
  Clock,
  Banknote,
  CheckCircle,
  FileText,
  Calendar,
  Activity,
  Check,
  X,
  Layers,
  Sliders,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { EmployeePayrollModal } from "../components/payroll/EmployeePayrollModal";
import { PayslipModal } from "../components/payroll/PayslipModal";
import {
  getEmployeePayStructure,
  getEmployeeOverride,
  calculateEmployeePayrollBreakdown,
  getMonthlyPayrollAnalytics,
} from "../lib/payrollResolver";

function SegmentedProgressBar({
  distribution,
}: {
  distribution: { color: string; percentage: number }[];
}) {
  const segments = 60;
  return (
    <div className="flex gap-[2px] w-full h-[41px]">
      {Array.from({ length: segments }).map((_, i) => {
        const threshold = (i / segments) * 100;
        let activeColor = "#E5E6E6";
        let cumulative = 0;
        for (const item of distribution) {
          cumulative += item.percentage;
        }
        // Determine segment color based on cumulative distribution
        let running = 0;
        for (const item of distribution) {
          running += item.percentage;
          if (threshold < running) {
            activeColor = item.color;
            break;
          }
        }
        return (
          <div
            key={i}
            className="flex-1 rounded-[2px]"
            style={{ backgroundColor: activeColor }}
          />
        );
      })}
    </div>
  );
}

export default function PayrollPage() {
  const navigate = useNavigate();
  const [payrolls, setPayrolls] = React.useState<any[]>(() =>
    getCollection<any[]>("db_payroll", [])
  );
  const [employees] = React.useState<Employee[]>(() =>
    getCollection<Employee[]>("db_employees", [])
  );
  const [payStructures, setPayStructures] = React.useState<PayStructure[]>(() =>
    getCollection<PayStructure[]>("db_pay_structures", [])
  );
  const [compOverrides, setCompOverrides] = React.useState<EmployeeCompensationOverride[]>(() =>
    getCollection<EmployeeCompensationOverride[]>("db_comp_overrides", [])
  );

  // Synchronize db updates
  React.useEffect(() => {
    const handleDbUpdate = () => {
      setPayrolls(getCollection<any[]>("db_payroll", []));
      setPayStructures(getCollection<PayStructure[]>("db_pay_structures", []));
      setCompOverrides(getCollection<EmployeeCompensationOverride[]>("db_comp_overrides", []));
    };
    window.addEventListener("db_updated", handleDbUpdate);
    window.addEventListener("storage", handleDbUpdate);
    return () => {
      window.removeEventListener("db_updated", handleDbUpdate);
      window.removeEventListener("storage", handleDbUpdate);
    };
  }, []);

  // Monthly Payroll Period selector state (Default June 2035 matching Figma)
  const [selectedMonth, setSelectedMonth] = React.useState("June");
  const [selectedYear, setSelectedYear] = React.useState("2035");
  const [isMonthPickerOpen, setIsMonthPickerOpen] = React.useState(false);
  const monthPickerRef = React.useRef<HTMLDivElement>(null);

  const monthsList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const yearsList = ["2034", "2035", "2036"];

  // Search, Filter & Sort states
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const filterRef = React.useRef<HTMLDivElement>(null);

  const [sortBy, setSortBy] = React.useState("Name");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");
  const [isSortOpen, setIsSortOpen] = React.useState(false);
  const sortRef = React.useRef<HTMLDivElement>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [isPageSizeOpen, setIsPageSizeOpen] = React.useState(false);
  const pageSizeRef = React.useRef<HTMLDivElement>(null);

  // Modal & Toast states
  const [selectedEmployee, setSelectedEmployee] = React.useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);

  // Payslip inspection modal states
  const [payslipEmployee, setPayslipEmployee] = React.useState<any | null>(null);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = React.useState(false);

  // Chart reporting period & interactive series states
  const [chartYear, setChartYear] = React.useState("2035");
  const [isChartYearOpen, setIsChartYearOpen] = React.useState(false);
  const chartYearRef = React.useRef<HTMLDivElement>(null);
  const [visibleSeries, setVisibleSeries] = React.useState<{
    salary: boolean;
    overtime: boolean;
    incentives: boolean;
  }>({
    salary: true,
    overtime: true,
    incentives: true,
  });

  // Breakdown card period scope
  const [breakdownScope, setBreakdownScope] = React.useState<"current" | "annual">("current");
  const [isBreakdownScopeOpen, setIsBreakdownScopeOpen] = React.useState(false);
  const breakdownScopeRef = React.useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Close dropdowns on click outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
      if (monthPickerRef.current && !monthPickerRef.current.contains(e.target as Node)) {
        setIsMonthPickerOpen(false);
      }
      if (pageSizeRef.current && !pageSizeRef.current.contains(e.target as Node)) {
        setIsPageSizeOpen(false);
      }
      if (chartYearRef.current && !chartYearRef.current.contains(e.target as Node)) {
        setIsChartYearOpen(false);
      }
      if (breakdownScopeRef.current && !breakdownScopeRef.current.contains(e.target as Node)) {
        setIsBreakdownScopeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper parse numeric amounts
  const parseAmount = (valStr: any) => {
    if (!valStr || valStr === "—") return 0;
    if (typeof valStr === "number") return valStr;
    return parseFloat(String(valStr).replace(/[$,]/g, "")) || 0;
  };

  // Compile monthly records:
  // If records exist in payrolls for the selected month/year, use them.
  // In June 2035, the primary records match the approved Figma dataset.
  const activePeriodLabel = `${selectedMonth} ${selectedYear}`;

  // Build unified payroll items for the period:
  // Maps all eligible employees to their current period payroll status (Paid, Processed, Draft, Pending, or Not Processed)
  const currentPeriodPayrolls = React.useMemo(() => {
    const list: any[] = [];
    const processedIds = new Set<string>();

    const targetMonthAbbr = String(selectedMonth || "").slice(0, 3).toLowerCase();
    const targetYearSuffix = String(selectedYear || "").slice(-2);

    // 1. Add existing payroll records matching this period
    (payrolls || []).forEach((p) => {
      if (!p) return;
      const pDate = String(p.date || "").toLowerCase();
      const matchesMonth = targetMonthAbbr ? pDate.includes(targetMonthAbbr) : false;
      const matchesYear = pDate.includes(targetYearSuffix) || pDate.includes(selectedYear);

      if (matchesMonth && matchesYear) {
        const struc = getEmployeePayStructure(p.id, p.subRole || p.dept, payStructures);
        const override = getEmployeeOverride(p.id, struc?.id, compOverrides);

        list.push({
          ...p,
          structureId: p.structureId || struc?.id,
          structureName: p.structureName || struc?.name,
          hasOverride: p.hasOverride !== undefined ? p.hasOverride : !!override,
        });
        if (p.id) processedIds.add(p.id);
      }
    });

    // 2. For employees without a processed payroll record this period, surface them as 'Not Processed'
    // so administrators can initiate "Process Payroll" directly from the Payroll List,
    // computed dynamically from assigned pay structures and compensation overrides
    (employees || []).forEach((emp) => {
      if (!emp || !emp.id) return;
      if (!processedIds.has(emp.id)) {
        const struc = getEmployeePayStructure(emp.id, emp.dept, payStructures);
        const override = getEmployeeOverride(emp.id, struc?.id, compOverrides);
        const breakdown = calculateEmployeePayrollBreakdown({
          employee: emp,
          structure: struc,
          override,
        });

        list.push({
          id: emp.id,
          name: emp.name || "Employee",
          role: emp.role || "Staff",
          subRole: emp.dept || "Department",
          date: `28 ${(selectedMonth || "Jun").slice(0, 3)} ${targetYearSuffix}`,
          salary: `$${breakdown.baseSalary.toLocaleString()}`,
          allowance: `$${breakdown.totalAllowances.toLocaleString()}`,
          overtime: breakdown.overtimeAmount > 0 ? `$${breakdown.overtimeAmount.toLocaleString()}` : "—",
          incen: breakdown.incentiveAmount > 0 ? `$${breakdown.incentiveAmount.toLocaleString()}` : "—",
          deduct: `$${breakdown.totalDeductions.toLocaleString()}`,
          total: `$${breakdown.netPayable.toLocaleString()}`,
          status: "Not Processed",
          avatar:
            emp.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
          structureId: struc?.id,
          structureName: struc?.name,
          hasOverride: !!override,
        });
      }
    });

    return list;
  }, [
    payrolls,
    employees,
    payStructures,
    compOverrides,
    selectedMonth,
    selectedYear,
  ]);

  // Aggregate metrics for KPI cards
  const totalBaseSalary = currentPeriodPayrolls.reduce(
    (sum, item) => sum + parseAmount(item.salary),
    0
  );
  const totalAllowances = currentPeriodPayrolls.reduce(
    (sum, item) => sum + parseAmount(item.allowance),
    0
  );
  const totalOvertime = currentPeriodPayrolls.reduce(
    (sum, item) => sum + parseAmount(item.overtime),
    0
  );
  const totalIncentives = currentPeriodPayrolls.reduce(
    (sum, item) => sum + parseAmount(item.incen),
    0
  );
  const totalPayrollDeductions = currentPeriodPayrolls.reduce(
    (sum, item) => sum + parseAmount(item.deduct),
    0
  );
  const totalNetPay = currentPeriodPayrolls.reduce(
    (sum, item) => sum + parseAmount(item.total),
    0
  );

  const totalEarningsAlloc =
    totalBaseSalary + totalAllowances + totalOvertime + totalIncentives;
  const salaryPct = totalEarningsAlloc
    ? Math.round((totalBaseSalary / totalEarningsAlloc) * 100)
    : 0;
  const allowancePct = totalEarningsAlloc
    ? Math.round((totalAllowances / totalEarningsAlloc) * 100)
    : 0;
  const overtimePct = totalEarningsAlloc
    ? Math.round((totalOvertime / totalEarningsAlloc) * 100)
    : 0;
  const incentivesPct = totalEarningsAlloc
    ? Math.round((totalIncentives / totalEarningsAlloc) * 100)
    : 0;
  const deductionsPct = totalEarningsAlloc
    ? Math.round((totalPayrollDeductions / totalEarningsAlloc) * 100)
    : 0;

  // Monthly payroll ledger analytics for selected chartYear
  const dynamicPayrollOverviewData = React.useMemo(() => {
    return getMonthlyPayrollAnalytics(
      chartYear,
      payrolls,
      employees,
      payStructures,
      compOverrides
    );
  }, [chartYear, payrolls, employees, payStructures, compOverrides]);

  // Filtered and Sorted payrolls
  const filteredPayrolls = React.useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();
    const stFilter = (statusFilter || "All").toLowerCase();

    let list = (currentPeriodPayrolls || []).filter((p) => {
      if (!p) return false;
      const pName = String(p.name || "").toLowerCase();
      const pId = String(p.id || "").toLowerCase();
      const pRole = String(p.role || "").toLowerCase();
      const pSubRole = String(p.subRole || "").toLowerCase();
      const pStatus = String(p.status || "").toLowerCase();

      const matchesSearch =
        !q ||
        pName.includes(q) ||
        pId.includes(q) ||
        pRole.includes(q) ||
        pSubRole.includes(q);

      const matchesStatus =
        stFilter === "all" || pStatus === stFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort
    list.sort((a, b) => {
      let valA: any = a.name;
      let valB: any = b.name;

      if (sortBy === "Name") {
        valA = a.name || "";
        valB = b.name || "";
      } else if (sortBy === "Salary") {
        valA = parseAmount(a.salary);
        valB = parseAmount(b.salary);
      } else if (sortBy === "Total") {
        valA = parseAmount(a.total);
        valB = parseAmount(b.total);
      } else if (sortBy === "Status") {
        valA = a.status || "";
        valB = b.status || "";
      } else if (sortBy === "Date") {
        valA = a.date || "";
        valB = b.date || "";
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    return list;
  }, [currentPeriodPayrolls, searchTerm, statusFilter, sortBy, sortDirection]);

  // Paginated records
  const totalResults = filteredPayrolls.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const paginatedPayrolls = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPayrolls.slice(start, start + pageSize);
  }, [filteredPayrolls, currentPage, pageSize]);

  // Row Click opens modal
  const handleRowClick = (employee: any) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  // Save Draft handler
  const handleSaveDraft = (updatedRecord: any) => {
    const currentList = getCollection<any[]>("db_payroll", []);
    const exists = currentList.some((p) => p.id === updatedRecord.id);
    let updated: any[];
    if (exists) {
      updated = currentList.map((p) => (p.id === updatedRecord.id ? updatedRecord : p));
    } else {
      updated = [...currentList, updatedRecord];
    }
    saveCollection("db_payroll", updated);
    setPayrolls(updated);
    showToast(`Payroll draft saved for ${updatedRecord.name}`);
  };

  // Finalize handler
  const handleFinalize = (updatedRecord: any) => {
    const currentList = getCollection<any[]>("db_payroll", []);
    const exists = currentList.some((p) => p.id === updatedRecord.id);
    let updated: any[];
    if (exists) {
      updated = currentList.map((p) => (p.id === updatedRecord.id ? updatedRecord : p));
    } else {
      updated = [...currentList, updatedRecord];
    }
    saveCollection("db_payroll", updated);
    setPayrolls(updated);
    showToast(`Payroll successfully processed for ${updatedRecord.name}!`);
  };

  const handleDownloadPayslip = (emp: any) => {
    setPayslipEmployee(emp);
    setIsPayslipModalOpen(true);
  };

  return (
    <AppLayout
      title="Payroll"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Payroll" }]}
    >
      <div className="space-y-5 relative">
        {/* Real-time Interactive Toast Indicator */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 bg-[#203430] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#35BFA3] animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle className="h-4 w-4 text-[#35BFA3]" />
            <span className="text-[13px] font-semibold">{toast}</span>
          </div>
        )}

        {/* =========================================================================
            ROW 1: FOUR SUMMARY CARDS (Matching Figma Layout & Dimensions)
            Total Salary ($352,000), Total Allowances ($15,000), Total Overtime ($4,800), Total Incentives ($6,500)
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              label: "Total Salary",
              val: totalBaseSalary > 0 ? "$" + totalBaseSalary.toLocaleString() : "$352,000",
              change: "+5.4%",
              trendPeriod: "from May",
              icon: CircleDollarSign,
              iconColor: "#35BFA3",
            },
            {
              label: "Total Allowances",
              val: totalAllowances > 0 ? "$" + totalAllowances.toLocaleString() : "$15,000",
              change: "+3.6%",
              trendPeriod: "",
              icon: HandCoins,
              iconColor: "#35BFA3",
            },
            {
              label: "Total Overtime",
              val: totalOvertime > 0 ? "$" + totalOvertime.toLocaleString() : "$4,800",
              change: "+2.3%",
              trendPeriod: "",
              icon: Clock,
              iconColor: "#35BFA3",
            },
            {
              label: "Total Incentives",
              val: totalIncentives > 0 ? "$" + totalIncentives.toLocaleString() : "$6,500",
              change: "+4.9%",
              trendPeriod: "",
              icon: Banknote,
              iconColor: "#35BFA3",
            },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="p-4 border border-[#EBECEB] rounded-[16px] bg-white shadow-2xs flex items-center justify-between h-[116px] transition-shadow hover:shadow-xs"
            >
              <div className="space-y-1.5 min-w-0">
                <p className="text-[12px] text-[#63716E] font-normal leading-[130%]">
                  {stat.label}
                </p>
                <p className="text-[28px] font-bold text-[#203430] tracking-[-0.04em] leading-[120%] truncate">
                  {stat.val}
                </p>
                <div className="flex items-center gap-1">
                  <div className="bg-[#E4F2D3] px-1.5 py-0.5 rounded-[10px] flex items-center">
                    <span className="text-[11px] font-medium text-[#0E4D41] leading-[130%]">
                      {stat.change}
                    </span>
                  </div>
                  {stat.trendPeriod && (
                    <span className="text-[10px] text-[#63716E] font-normal leading-[130%]">
                      {stat.trendPeriod}
                    </span>
                  )}
                </div>
              </div>
              <div className="h-[60px] w-[60px] bg-[#F7F7F7] rounded-[8px] flex items-center justify-center shrink-0">
                <stat.icon className="h-8 w-8" style={{ color: stat.iconColor }} />
              </div>
            </Card>
          ))}
        </div>

        {/* =========================================================================
            ROW 2: ANALYTICS (Payroll Overview Line Chart & Payroll Breakdown)
            ========================================================================= */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Left: Payroll Overview Card */}
          <Card className="p-4 border border-[#EBECEB] rounded-[16px] bg-white shadow-2xs flex flex-col justify-between min-h-[277px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[16px] font-semibold text-[#203430] tracking-[-0.04em] leading-[120%]">
                Payroll Overview
              </h3>

              {/* Functional Year / Period Selector */}
              <div className="relative" ref={chartYearRef}>
                <button
                  type="button"
                  onClick={() => setIsChartYearOpen(!isChartYearOpen)}
                  className="flex items-center gap-2 bg-[#E4F2D3] hover:bg-[#d8ecbe] px-3 py-1.5 rounded-[8px] text-[12px] font-bold text-[#0E4D41] transition-colors cursor-pointer"
                  title="Select reporting year"
                >
                  <span>
                    {chartYear === "2035"
                      ? "This Year (2035)"
                      : chartYear === "2034"
                      ? "Last Year (2034)"
                      : `Year ${chartYear}`}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform",
                      isChartYearOpen && "rotate-180"
                    )}
                  />
                </button>

                {isChartYearOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-xl shadow-lg border border-[#E5E6E6] p-1.5 z-50 animate-in fade-in zoom-in-95 text-left">
                    <p className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider px-2 py-1">
                      Reporting Period
                    </p>
                    {[
                      { key: "2034", label: "2034 (Last Year)" },
                      { key: "2035", label: "2035 (Current)" },
                      { key: "2036", label: "2036 (Forecast)" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          setChartYear(item.key);
                          setIsChartYearOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                          chartYear === item.key
                            ? "bg-[#E4F2D3] text-[#0E4D41] font-bold"
                            : "text-[#203430] hover:bg-[#F7F7F7]"
                        )}
                      >
                        <span>{item.label}</span>
                        {chartYear === item.key && (
                          <Check className="h-3 w-3 text-[#0E4D41]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Legend (Click series to toggle visibility) */}
            <div className="flex gap-4 sm:gap-6 mb-3 flex-wrap">
              {[
                { key: "salary", label: "Salary", color: "#35BFA3" },
                { key: "overtime", label: "Overtime", color: "#0E4D41" },
                { key: "incentives", label: "Incentives", color: "#F8C947" },
              ].map((l) => {
                const isActive = visibleSeries[l.key as keyof typeof visibleSeries];
                return (
                  <button
                    key={l.label}
                    type="button"
                    onClick={() =>
                      setVisibleSeries((prev) => ({
                        ...prev,
                        [l.key]: !prev[l.key as keyof typeof visibleSeries],
                      }))
                    }
                    className={cn(
                      "flex items-center gap-1.5 text-[12px] cursor-pointer transition-all select-none hover:opacity-80",
                      !isActive && "opacity-40 line-through"
                    )}
                    title={`Click to toggle ${l.label} series`}
                  >
                    <div
                      className="h-[3px] w-3 rounded-full"
                      style={{ backgroundColor: l.color }}
                    />
                    <span className="text-[#63716E] leading-[130%]">{l.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Line Chart */}
            <div className="flex-1 min-h-[163px] w-full">
              <ResponsiveContainer width="100%" height={163}>
                <LineChart
                  data={dynamicPayrollOverviewData}
                  margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F7F7F7" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#63716E" }}
                    dy={5}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#63716E" }}
                    domain={[0, "auto"]}
                    tickFormatter={(val) =>
                      `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`
                    }
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      const sal =
                        (payload.find((p) => p.dataKey === "salary")?.value as number) || 0;
                      const ot =
                        (payload.find((p) => p.dataKey === "overtime")?.value as number) || 0;
                      const inc =
                        (payload.find((p) => p.dataKey === "incentives")?.value as number) || 0;
                      const total = sal + ot + inc;

                      return (
                        <div className="bg-white p-2.5 rounded-xl border border-[#EBECEB] shadow-xl text-[11px] space-y-1.5 min-w-[160px] animate-in fade-in">
                          <p className="font-bold text-[#203430] border-b border-[#EBECEB] pb-1">
                            {label} {chartYear}
                          </p>
                          {visibleSeries.salary && (
                            <div className="flex justify-between items-center text-[#63716E]">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#35BFA3]" />
                                Salary:
                              </span>
                              <span className="font-semibold text-[#203430]">
                                ${sal.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {visibleSeries.overtime && (
                            <div className="flex justify-between items-center text-[#63716E]">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#0E4D41]" />
                                Overtime:
                              </span>
                              <span className="font-semibold text-[#203430]">
                                ${ot.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {visibleSeries.incentives && (
                            <div className="flex justify-between items-center text-[#63716E]">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#F8C947]" />
                                Incentives:
                              </span>
                              <span className="font-semibold text-[#203430]">
                                ${inc.toLocaleString()}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-center border-t border-[#EBECEB] pt-1 text-[11px] font-bold text-[#0E4D41]">
                            <span>Total Payroll:</span>
                            <span>${total.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  {visibleSeries.salary && (
                    <Line
                      type="monotone"
                      dataKey="salary"
                      stroke="#35BFA3"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4, stroke: "#35BFA3", strokeWidth: 2, fill: "#fff" }}
                    />
                  )}
                  {visibleSeries.overtime && (
                    <Line
                      type="monotone"
                      dataKey="overtime"
                      stroke="#0E4D41"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, stroke: "#0E4D41", strokeWidth: 2, fill: "#fff" }}
                    />
                  )}
                  {visibleSeries.incentives && (
                    <Line
                      type="monotone"
                      dataKey="incentives"
                      stroke="#F8C947"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, stroke: "#F8C947", strokeWidth: 2, fill: "#fff" }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Right: Payroll Breakdown Card */}
          <Card className="p-4 border border-[#EBECEB] rounded-[16px] bg-white shadow-2xs flex flex-col justify-between min-h-[277px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[16px] font-semibold text-[#203430] tracking-[-0.04em] leading-[120%]">
                Payroll Breakdown
              </h3>

              {/* Functional Breakdown Scope Selector */}
              <div className="relative" ref={breakdownScopeRef}>
                <button
                  type="button"
                  onClick={() => setIsBreakdownScopeOpen(!isBreakdownScopeOpen)}
                  className="flex items-center gap-2 bg-[#E4F2D3] hover:bg-[#d8ecbe] px-3 py-1.5 rounded-[8px] text-[12px] font-bold text-[#0E4D41] transition-colors cursor-pointer"
                  title="Select breakdown scope"
                >
                  <span>
                    {breakdownScope === "current"
                      ? `${selectedMonth} ${selectedYear}`
                      : `Annual ${chartYear}`}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform",
                      isBreakdownScopeOpen && "rotate-180"
                    )}
                  />
                </button>

                {isBreakdownScopeOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-[#E5E6E6] p-1.5 z-50 animate-in fade-in zoom-in-95 text-left">
                    <p className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider px-2 py-1">
                      Breakdown Period
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setBreakdownScope("current");
                        setIsBreakdownScopeOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                        breakdownScope === "current"
                          ? "bg-[#E4F2D3] text-[#0E4D41] font-bold"
                          : "text-[#203430] hover:bg-[#F7F7F7]"
                      )}
                    >
                      <span>Active ({selectedMonth.slice(0, 3)} {selectedYear})</span>
                      {breakdownScope === "current" && (
                        <Check className="h-3 w-3 text-[#0E4D41]" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBreakdownScope("annual");
                        setIsBreakdownScopeOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                        breakdownScope === "annual"
                          ? "bg-[#E4F2D3] text-[#0E4D41] font-bold"
                          : "text-[#203430] hover:bg-[#F7F7F7]"
                      )}
                    >
                      <span>Annual Average ({chartYear})</span>
                      {breakdownScope === "annual" && (
                        <Check className="h-3 w-3 text-[#0E4D41]" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Total Pay Heading */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[24px] font-semibold text-[#203430] tracking-[-0.04em] leading-[120%]">
                ${totalNetPay.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#63716E] leading-[130%]">
                {breakdownScope === "current"
                  ? `Total Net Pay (${selectedMonth} ${selectedYear})`
                  : `Average Monthly Net Pay (${chartYear})`}
              </span>
            </div>

            {/* Segmented Bar Visualization */}
            <div className="my-2">
              <SegmentedProgressBar
                distribution={[
                  { color: "#35BFA3", percentage: salaryPct || 89 },
                  { color: "#0E4D41", percentage: allowancePct || 3.8 },
                  { color: "#A4ACAB", percentage: deductionsPct || 4.0 },
                  { color: "#F8C947", percentage: incentivesPct || 2.0 },
                  { color: "#E5E6E6", percentage: overtimePct || 1.2 },
                ]}
              />
            </div>

            {/* Breakdown Category Items (2 columns x rows) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 pt-2 text-[12px]">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#35BFA3] shrink-0" />
                  <span className="font-bold text-[#203430]">Salary</span>
                  <span className="text-[#63716E]">—</span>
                  <span className="font-medium text-[#203430]">{salaryPct || 89.0}%</span>
                </div>
                <p className="text-[11px] text-[#63716E] pl-4">
                  ${totalBaseSalary.toLocaleString()}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#0E4D41] shrink-0" />
                  <span className="font-bold text-[#203430]">Allowances</span>
                  <span className="text-[#63716E]">—</span>
                  <span className="font-medium text-[#203430]">{allowancePct || 3.8}%</span>
                </div>
                <p className="text-[11px] text-[#63716E] pl-4">
                  ${totalAllowances.toLocaleString()}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#A4ACAB] shrink-0" />
                  <span className="font-bold text-[#203430]">Deductions</span>
                  <span className="text-[#63716E]">—</span>
                  <span className="font-medium text-[#203430]">{deductionsPct || 4.0}%</span>
                </div>
                <p className="text-[11px] text-[#63716E] pl-4">
                  ${totalPayrollDeductions.toLocaleString()}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#F8C947] shrink-0" />
                  <span className="font-bold text-[#203430]">Incentives</span>
                  <span className="text-[#63716E]">—</span>
                  <span className="font-medium text-[#203430]">{incentivesPct || 2.0}%</span>
                </div>
                <p className="text-[11px] text-[#63716E] pl-4">
                  ${totalIncentives.toLocaleString()}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#E5E6E6] shrink-0" />
                  <span className="font-bold text-[#203430]">Overtime</span>
                  <span className="text-[#63716E]">—</span>
                  <span className="font-medium text-[#203430]">{overtimePct || 1.2}%</span>
                </div>
                <p className="text-[11px] text-[#63716E] pl-4">
                  ${totalOvertime.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* =========================================================================
            ROW 3: PAYROLL LIST (TABLE) WITH CONTROLS & PERIOD SELECTOR
            ========================================================================= */}
        <Card className="border border-[#EBECEB] rounded-[16px] bg-white shadow-2xs overflow-hidden p-0 flex flex-col min-h-[708px]">
          {/* Table Header Controls */}
          <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#EBECEB]">
            <div className="flex items-center gap-3">
              <h2 className="text-[16px] font-semibold text-[#203430] tracking-[-0.04em] leading-[120%]">
                Payroll List
              </h2>

              {/* Monthly Period Selector Dropdown */}
              <div className="relative" ref={monthPickerRef}>
                <button
                  type="button"
                  onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
                  className="h-[34px] px-3 bg-[#E4F2D3] hover:bg-[#d8ecbe] text-[#0E4D41] rounded-[8px] text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Select Payroll Period"
                >
                  <Calendar className="h-3.5 w-3.5 text-[#0E4D41]" />
                  <span>{activePeriodLabel}</span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform",
                      isMonthPickerOpen && "rotate-180"
                    )}
                  />
                </button>

                {isMonthPickerOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-[#E5E6E6] p-3 z-50 animate-in fade-in zoom-in-95 text-left">
                    <p className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider mb-1.5">
                      Payroll Month
                    </p>
                    <div className="grid grid-cols-3 gap-1 mb-3">
                      {monthsList.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setSelectedMonth(m);
                            setCurrentPage(1);
                          }}
                          className={cn(
                            "px-1.5 py-1 text-[11px] font-semibold rounded-md text-center transition-colors cursor-pointer",
                            selectedMonth === m
                              ? "bg-[#0E4D41] text-white"
                              : "text-[#203430] hover:bg-[#E4F2D3]"
                          )}
                        >
                          {m.slice(0, 3)}
                        </button>
                      ))}
                    </div>

                    <p className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider mb-1.5">
                      Year
                    </p>
                    <div className="grid grid-cols-3 gap-1 mb-2">
                      {yearsList.map((y) => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => {
                            setSelectedYear(y);
                            setCurrentPage(1);
                          }}
                          className={cn(
                            "px-1.5 py-1 text-[11px] font-semibold rounded-md text-center transition-colors cursor-pointer",
                            selectedYear === y
                              ? "bg-[#0E4D41] text-white"
                              : "text-[#203430] hover:bg-[#E4F2D3]"
                          )}
                        >
                          {y}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#EBECEB] flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsMonthPickerOpen(false)}
                        className="text-[11px] font-bold text-[#0E4D41] bg-[#E4F2D3] px-3 py-1 rounded-md cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Action Tools: Search, Filter, Sort */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Field */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#203430]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search employee, ID, etc"
                  className="pl-8 pr-3 h-[34px] w-[200px] sm:w-[223px] bg-[#F7F7F7] rounded-[8px] border-none text-[12px] text-[#203430] placeholder-[#63716E] outline-none focus:ring-1 focus:ring-[#35BFA3]"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#63716E] hover:text-[#203430]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative" ref={filterRef}>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={cn(
                    "flex items-center gap-1.5 h-[34px] px-3 rounded-[8px] text-[12px] font-medium transition-colors cursor-pointer",
                    statusFilter !== "All"
                      ? "bg-[#0E4D41] text-white"
                      : "bg-[#E4F2D3] text-[#203430] hover:bg-[#d8ecbe]"
                  )}
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span>{statusFilter === "All" ? "Filter" : statusFilter}</span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform",
                      isFilterOpen && "rotate-180"
                    )}
                  />
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-[#E5E6E6] p-1.5 z-50 animate-in fade-in zoom-in-95 text-left">
                    <p className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider px-2 py-1">
                      Payroll Status
                    </p>
                    {[
                      "All",
                      "Paid",
                      "Processed",
                      "Pending",
                      "Draft",
                      "Not Processed",
                    ].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setStatusFilter(st);
                          setIsFilterOpen(false);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                          statusFilter === st
                            ? "bg-[#E4F2D3] text-[#0E4D41] font-bold"
                            : "text-[#203430] hover:bg-[#F7F7F7]"
                        )}
                      >
                        <span>{st === "All" ? "All Payrolls" : st}</span>
                        {statusFilter === st && (
                          <Check className="h-3 w-3 text-[#0E4D41]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 text-xs text-[#63716E]" ref={sortRef}>
                <span className="text-[11px] text-[#63716E] hidden sm:inline">
                  Sort by:
                </span>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-1.5 bg-[#E4F2D3] hover:bg-[#d8ecbe] h-[34px] px-3 rounded-[8px] text-[12px] font-medium text-[#203430] transition-colors cursor-pointer"
                  >
                    <span>{sortBy}</span>
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform",
                        isSortOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isSortOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-32 bg-white rounded-xl shadow-lg border border-[#E5E6E6] p-1.5 z-50 animate-in fade-in zoom-in-95 text-left">
                      {["Name", "Salary", "Total", "Status", "Date"].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setSortBy(item);
                            setIsSortOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                            sortBy === item
                              ? "bg-[#E4F2D3] text-[#0E4D41] font-bold"
                              : "text-[#203430] hover:bg-[#F7F7F7]"
                          )}
                        >
                          <span>{item}</span>
                          {sortBy === item && (
                            <Check className="h-3 w-3 text-[#0E4D41]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pay Structures Navigation Button */}
              <button
                type="button"
                onClick={() => navigate("/payroll/pay-structures")}
                className="flex items-center gap-1.5 bg-white border border-[#EBECEB] hover:bg-[#F7F7F7] hover:border-[#35BFA3] text-[#203430] h-[34px] px-3 rounded-[8px] text-[12px] font-semibold transition-all cursor-pointer shadow-2xs"
                title="Manage reusable salary and benefit structures"
              >
                <Layers className="h-3.5 w-3.5 text-[#35BFA3]" />
                <span>Pay Structures</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F7F7F7] select-none">
                <tr className="text-[10px] font-normal text-[#63716E] border-b border-[#EBECEB]">
                  <th
                    className="px-4 py-3 cursor-pointer hover:text-[#203430] whitespace-nowrap"
                    onClick={() => {
                      setSortBy("Name");
                      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Name</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>Job Title</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer hover:text-[#203430] whitespace-nowrap"
                    onClick={() => {
                      setSortBy("Date");
                      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Date</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer hover:text-[#203430] whitespace-nowrap"
                    onClick={() => {
                      setSortBy("Salary");
                      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Salary</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>Allowances</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>Overtime</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>Incen.</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>Deduct.</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer hover:text-[#203430] whitespace-nowrap"
                    onClick={() => {
                      setSortBy("Total");
                      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Total</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer hover:text-[#203430] whitespace-nowrap"
                    onClick={() => {
                      setSortBy("Status");
                      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <span>Payslip</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E5E6E6] text-[11px]">
                {paginatedPayrolls.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="h-10 w-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                          <CircleDollarSign className="h-5 w-5" />
                        </div>
                        <p className="text-[13px] font-bold text-[#203430]">
                          No payroll records available for this period.
                        </p>
                        <p className="text-[11px] text-[#63716E] max-w-sm mx-auto">
                          There are no payroll registers recorded for {activePeriodLabel}.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedPayrolls.map((emp) => (
                    <tr
                      key={emp.id}
                      onClick={() => handleRowClick(emp)}
                      className="hover:bg-[#F7F7F7]/80 transition-colors cursor-pointer group"
                    >
                      {/* Name & ID */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="h-7 w-7 rounded-full object-cover bg-[#35BFA3]"
                          />
                          <div>
                            <p className="font-medium text-[#203430] group-hover:text-[#35BFA3] transition-colors leading-tight">
                              {emp.name}
                            </p>
                            <p className="text-[10px] text-[#63716E] leading-tight">
                              {emp.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Job Title & SubRole */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-normal text-[#203430] leading-tight">
                          {emp.role}
                        </p>
                        <p className="text-[10px] text-[#63716E] leading-tight">
                          {emp.subRole}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 whitespace-nowrap font-normal text-[#203430]">
                        {emp.date}
                      </td>

                      {/* Salary */}
                      <td className="px-4 py-3 whitespace-nowrap font-normal text-[#203430]">
                        {emp.salary}
                      </td>

                      {/* Allowances */}
                      <td className="px-4 py-3 whitespace-nowrap font-normal text-[#63716E]">
                        {emp.allowance}
                      </td>

                      {/* Overtime */}
                      <td className="px-4 py-3 whitespace-nowrap font-normal text-[#63716E]">
                        {emp.overtime}
                      </td>

                      {/* Incentives */}
                      <td className="px-4 py-3 whitespace-nowrap font-normal text-[#63716E]">
                        {emp.incen}
                      </td>

                      {/* Deductions */}
                      <td className="px-4 py-3 whitespace-nowrap font-normal text-[#63716E]">
                        {emp.deduct}
                      </td>

                      {/* Total Net Pay */}
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-[#0E4D41]">
                        {emp.total}
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {emp.status === "Paid" ? (
                          <span className="inline-flex items-center gap-1 bg-[#35BFA3] text-white px-2 py-0.5 rounded-[12px] text-[11px] leading-tight font-normal">
                            <CheckCircle className="h-3 w-3" />
                            <span>Paid</span>
                          </span>
                        ) : emp.status === "Processed" ? (
                          <span className="inline-flex items-center gap-1 bg-[#0E4D41] text-white px-2 py-0.5 rounded-[12px] text-[11px] leading-tight font-normal">
                            <Check className="h-3 w-3" />
                            <span>Processed</span>
                          </span>
                        ) : emp.status === "Pending" ? (
                          <span className="inline-flex items-center gap-1 bg-[#F8C947] text-[#203430] px-2 py-0.5 rounded-[12px] text-[11px] leading-tight font-normal">
                            <Clock className="h-3 w-3" />
                            <span>Pending</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-[#E5E6E6] text-[#203430] px-2 py-0.5 rounded-[12px] text-[11px] leading-tight font-normal">
                            <FileText className="h-3 w-3" />
                            <span>{emp.status || "Draft"}</span>
                          </span>
                        )}
                      </td>

                      {/* Action Button: Matches exact lifecycle state */}
                      <td
                        className="px-4 py-3 whitespace-nowrap text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {emp.status === "Paid" ? (
                          <button
                            type="button"
                            onClick={() => handleDownloadPayslip(emp)}
                            className="inline-flex items-center gap-1 bg-[#E4F2D3] hover:bg-[#d8ecbe] text-[#203430] px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            <FileText className="h-3 w-3" />
                            <span>Download</span>
                          </button>
                        ) : emp.status === "Processed" ? (
                          <button
                            type="button"
                            onClick={() => handleRowClick(emp)}
                            className="inline-flex items-center gap-1 bg-[#E4F2D3] hover:bg-[#d8ecbe] text-[#0E4D41] px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            <span>View Details</span>
                          </button>
                        ) : emp.status === "Draft" ? (
                          <button
                            type="button"
                            onClick={() => handleRowClick(emp)}
                            className="inline-flex items-center gap-1 bg-[#0E4D41] hover:bg-[#165a4e] text-white px-2.5 py-1 rounded-[6px] text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
                          >
                            <span>Continue</span>
                          </button>
                        ) : emp.status === "Pending" ? (
                          <button
                            type="button"
                            onClick={() => handleRowClick(emp)}
                            className="inline-flex items-center gap-1 bg-[#F8C947] hover:bg-[#eab932] text-[#203430] px-2.5 py-1 rounded-[6px] text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
                          >
                            <span>Review</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRowClick(emp)}
                            className="inline-flex items-center gap-1 bg-[#35BFA3] hover:bg-[#28C2A9] text-white px-2.5 py-1 rounded-[6px] text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                          >
                            <span>Process</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="p-4 sm:p-5 border-t border-[#EBECEB] flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
            {/* Rows Per Page */}
            <div className="flex items-center gap-2 text-[14px] text-[#757575]">
              <span>Show</span>
              <div className="relative" ref={pageSizeRef}>
                <button
                  type="button"
                  onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
                  className="h-7 px-2.5 bg-[#F7F7F7] hover:bg-[#eaeaea] text-[#203430] rounded-[8px] text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{pageSize}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {isPageSizeOpen && (
                  <div className="absolute left-0 bottom-full mb-1 w-20 bg-white rounded-lg shadow-lg border border-[#E5E6E6] p-1 z-50 animate-in fade-in">
                    {[10, 25, 50].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setPageSize(size);
                          setIsPageSizeOpen(false);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "w-full text-left px-2 py-1 text-xs rounded transition-colors cursor-pointer",
                          pageSize === size
                            ? "bg-[#E4F2D3] text-[#0E4D41] font-bold"
                            : "hover:bg-[#F7F7F7] text-[#203430]"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span>of {totalResults} results</span>
            </div>

            {/* Page Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-7 w-7 rounded-[8px] bg-[#F5F5F5] hover:bg-[#e8e8e8] disabled:opacity-40 disabled:hover:bg-[#F5F5F5] flex items-center justify-center text-[#203430] transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // Show first, last, and window around current page
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "h-7 w-7 rounded-[8px] text-[12px] font-medium transition-colors cursor-pointer flex items-center justify-center",
                        currentPage === pageNum
                          ? "bg-[#35BFA3] text-white font-bold"
                          : "bg-[#F7F7F7] text-[#203430] hover:bg-[#eaeaea]"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === 2 && currentPage > 3) ||
                  (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span key={pageNum} className="px-1 text-xs text-[#63716E]">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-7 w-7 rounded-[8px] bg-[#F7F7F7] hover:bg-[#eaeaea] disabled:opacity-40 disabled:hover:bg-[#F7F7F7] flex items-center justify-center text-[#203430] transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer Section */}
      <footer className="mt-12 py-6 border-t border-[#E5E6E6] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#63716E]">
        <p className="font-bold text-[#203430]">Copyright © 2025 Peterdraw</p>
        <div className="flex gap-6">
          {["Privacy Policy", "Term and conditions", "Contact"].map((l) => (
            <a key={l} href="#" className="hover:text-[#35BFA3] transition-colors">
              {l}
            </a>
          ))}
        </div>
      </footer>

      {/* =========================================================================
          REUSABLE EMPLOYEE PAYROLL MODAL (Review & Edit vs Processed Details)
          ========================================================================= */}
      <EmployeePayrollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={selectedEmployee}
        period={activePeriodLabel}
        onSaveDraft={handleSaveDraft}
        onFinalize={handleFinalize}
        onDownloadPayslip={handleDownloadPayslip}
      />

      {/* =========================================================================
          OFFICIAL SALARY PAYSLIP MODAL
          ========================================================================= */}
      <PayslipModal
        isOpen={isPayslipModalOpen}
        onClose={() => setIsPayslipModalOpen(false)}
        employee={payslipEmployee}
        period={activePeriodLabel}
      />
    </AppLayout>
  );
}
