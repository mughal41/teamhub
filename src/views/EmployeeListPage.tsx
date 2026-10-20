import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { getCollection, saveCollection, Employee } from "../lib/db";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
  Grid2X2,
  List,
  RotateCcw,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useNavigate } from "react-router-dom";
import { EmployeeTopStats } from "../components/employees/EmployeeTopStats";
import { useAuth } from "../context/AuthContext";
import { filterByRoleScope } from "../lib/roleScope";
import { RoleScopeBanner } from "../components/auth/RoleScopeBanner";

export default function EmployeeListPage() {
  const [view, setView] = React.useState<"table" | "grid">("table");
  const navigate = useNavigate();
  const { canManage, user } = useAuth();
  const canCreateEmployee = canManage("employees");

  const [employeeStoreRaw, setEmployeeStoreState] = React.useState<Employee[]>(() => {
    return getCollection<Employee[]>("db_employees", []);
  });

  // Senior/Lead see self+team; HR/Finance/Admin see company; Employee has no page access
  const employeeStore = React.useMemo(
    () =>
      user
        ? filterByRoleScope(employeeStoreRaw, user.roleId, "employees")
        : employeeStoreRaw,
    [employeeStoreRaw, user]
  );

  React.useEffect(() => {
    const handleDbUpdate = () => {
      setEmployeeStoreState(getCollection<Employee[]>("db_employees", []));
    };
    window.addEventListener("db_updated", handleDbUpdate);
    window.addEventListener("storage", handleDbUpdate);
    return () => {
      window.removeEventListener("db_updated", handleDbUpdate);
      window.removeEventListener("storage", handleDbUpdate);
    };
  }, []);

  // Filter & Search states
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [deptFilter, setDeptFilter] = React.useState("All");
  const [modelFilter, setModelFilter] = React.useState("All");
  const [roleFilter, setRoleFilter] = React.useState("All");
  const [sortBy, setSortBy] = React.useState<string>("Name");
  const [sortColumn, setSortColumn] = React.useState<string>("id");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [isPageSizeOpen, setIsPageSizeOpen] = React.useState(false);
  const pageSizeRef = React.useRef<HTMLDivElement>(null);

  // Multi-select state: initialize with EMP-0178 selected to match exact screenshot
  const [selectedIds, setSelectedIds] = React.useState<string[]>(["EMP-0178"]);

  // Popover & Dropdown states
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isSortOpen, setIsSortOpen] = React.useState(false);
  const filterRef = React.useRef<HTMLDivElement>(null);
  const sortRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
      if (pageSizeRef.current && !pageSizeRef.current.contains(e.target as Node)) {
        setIsPageSizeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Unique lists for filters
  const availableDepts = React.useMemo(() => {
    const set = new Set<string>();
    employeeStore.forEach((e) => {
      if (e.dept) set.add(e.dept);
    });
    return Array.from(set);
  }, [employeeStore]);

  // Active filter count
  const activeFiltersCount =
    (statusFilter !== "All" ? 1 : 0) +
    (deptFilter !== "All" ? 1 : 0) +
    (modelFilter !== "All" ? 1 : 0) +
    (roleFilter !== "All" ? 1 : 0);

  // Reset page when filters or search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, deptFilter, modelFilter, roleFilter]);

  // Sort handler
  const handleSortColumn = (col: string) => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  };

  // Filtered employees
  const filteredEmployees = React.useMemo(() => {
    return employeeStore
      .filter((emp) => {
        if (!emp) return false;
        const query = search.trim().toLowerCase();
        const empName = String(emp.name || "").toLowerCase();
        const empRole = String(emp.role || "").toLowerCase();
        const empId = String(emp.id || "").toLowerCase();
        const empDept = String(emp.dept || "").toLowerCase();

        const matchesSearch =
          !query ||
          empName.includes(query) ||
          empRole.includes(query) ||
          empId.includes(query) ||
          empDept.includes(query);
        const matchesStatus = statusFilter === "All" || emp.status === statusFilter;
        const matchesDept = deptFilter === "All" || emp.dept === deptFilter;
        const matchesModel = modelFilter === "All" || emp.model === modelFilter;
        const matchesRole =
          roleFilter === "All" ||
          emp.role === roleFilter ||
          (emp.type && emp.type.toLowerCase() === roleFilter.toLowerCase());
        return matchesSearch && matchesStatus && matchesDept && matchesModel && matchesRole;
      })
      .sort((a, b) => {
        let comparison = 0;
        const getStr = (val: any) => String(val || "").trim();

        if (sortColumn === "id") {
          comparison = getStr(a.id).localeCompare(getStr(b.id));
        } else if (sortColumn === "name") {
          comparison = getStr(a.name).localeCompare(getStr(b.name));
        } else if (sortColumn === "role") {
          comparison = getStr(a.role).localeCompare(getStr(b.role));
        } else if (sortColumn === "dept") {
          comparison = getStr(a.dept).localeCompare(getStr(b.dept));
        } else if (sortColumn === "type") {
          comparison = getStr(a.type).localeCompare(getStr(b.type));
        } else if (sortColumn === "model") {
          comparison = getStr(a.model).localeCompare(getStr(b.model));
        } else if (sortColumn === "date") {
          comparison = getStr(a.joinDate).localeCompare(getStr(b.joinDate));
        } else if (sortColumn === "status") {
          comparison = getStr(a.status).localeCompare(getStr(b.status));
        } else {
          if (sortBy === "Name") comparison = getStr(a.name).localeCompare(getStr(b.name));
          else comparison = getStr(a.id).localeCompare(getStr(b.id));
        }
        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [
    employeeStore,
    search,
    statusFilter,
    deptFilter,
    modelFilter,
    roleFilter,
    sortColumn,
    sortDirection,
    sortBy,
  ]);

  // Pagination calculation
  const totalItems = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Multi-select helpers
  const handleToggleSelect = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredEmployees.length && filteredEmployees.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEmployees.map((e) => e.id));
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDeptFilter("All");
    setModelFilter("All");
    setRoleFilter("All");
    setSortBy("Name");
    setSortColumn("id");
    setSortDirection("asc");
    setCurrentPage(1);
  };

  const isAllSelected =
    filteredEmployees.length > 0 && selectedIds.length === filteredEmployees.length;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < filteredEmployees.length;

  return (
    <AppLayout
      title="Employees"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Employees" }]}
    >
      <div className="space-y-5">
        <RoleScopeBanner module="employees" />
        {/* =========================================================================
            TOP SECTION: FOUR KPI CARDS (2x2) & DEPARTMENTS DONUT CHART
            Exact Figma Screenshot 1 Auto-Layout Reproduction (Height: 238px)
            Rendered in BOTH Grid View and Table (Row-wise) View
            ========================================================================= */}
        <EmployeeTopStats
          employees={employeeStore}
          selectedDept={deptFilter}
          onSelectDept={(d) => setDeptFilter(d)}
          onResetQuickFilter={handleResetFilters}
        />

        {/* Active Quick Filters Bar */}
        {activeFiltersCount > 0 && (
          <div className="bg-[#E4F2D3]/70 border border-[#28C2A9]/40 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#0E4D41] font-bold">Active Filters:</span>
              {statusFilter !== "All" && (
                <span className="bg-white px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#0E4D41] border border-[#28C2A9]/40 flex items-center gap-1.5 shadow-2xs">
                  <span>Status: <strong>{statusFilter}</strong></span>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("All")}
                    className="hover:text-red-500 cursor-pointer ml-0.5"
                    title="Remove filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {deptFilter !== "All" && (
                <span className="bg-white px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#0E4D41] border border-[#28C2A9]/40 flex items-center gap-1.5 shadow-2xs">
                  <span>Department: <strong>{deptFilter}</strong></span>
                  <button
                    type="button"
                    onClick={() => setDeptFilter("All")}
                    className="hover:text-red-500 cursor-pointer ml-0.5"
                    title="Remove filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {modelFilter !== "All" && (
                <span className="bg-white px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#0E4D41] border border-[#28C2A9]/40 flex items-center gap-1.5 shadow-2xs">
                  <span>Work Model: <strong>{modelFilter}</strong></span>
                  <button
                    type="button"
                    onClick={() => setModelFilter("All")}
                    className="hover:text-red-500 cursor-pointer ml-0.5"
                    title="Remove filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {roleFilter !== "All" && (
                <span className="bg-white px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#0E4D41] border border-[#28C2A9]/40 flex items-center gap-1.5 shadow-2xs">
                  <span>Employment: <strong>{roleFilter}</strong></span>
                  <button
                    type="button"
                    onClick={() => setRoleFilter("All")}
                    className="hover:text-red-500 cursor-pointer ml-0.5"
                    title="Remove filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[#0E4D41] font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer shrink-0 ml-3"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* Toolbar Bar: Title + Search + Filter + Sort + New Employee + View Switcher */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Left Title */}
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1F312E] tracking-tight">
              Employee List
            </h1>
            <span className="bg-[#E4F2D3] text-[#0E4D41] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {filteredEmployees.length}
            </span>
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative min-w-[200px] sm:min-w-[220px]">
              <Search className="h-4 w-4 text-[#8E9B98] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full pl-9 pr-3 rounded-xl bg-[#F6F7F6] text-xs text-[#203430] placeholder-[#8E9B98] border border-transparent focus:border-[#28C2A9] focus:bg-white outline-none transition-all"
              />
            </div>

            {/* Filter Button */}
            <div className="relative" ref={filterRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn(
                  "h-10 px-3.5 sm:px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
                  isFilterOpen || activeFiltersCount > 0
                    ? "bg-[#E4F2D3] text-[#0E4D41] shadow-xs"
                    : "bg-[#E4F2D3] hover:bg-[#d9edc3] text-[#0E4D41]"
                )}
              >
                <Filter className="h-3.5 w-3.5 text-[#0E4D41]" />
                <span>Filter</span>
                {activeFiltersCount > 0 && (
                  <span className="h-4 w-4 rounded-full bg-[#0E4D41] text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-[#0E4D41] transition-transform",
                    isFilterOpen && "rotate-180"
                  )}
                />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E5E6E6] p-4 z-50 animate-fade-in text-left">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E5E6E6]">
                    <span className="text-xs font-bold text-[#0E4D41]">Filter Criteria</span>
                    {activeFiltersCount > 0 && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="text-[10px] font-semibold text-[#28C2A9] hover:underline cursor-pointer"
                      >
                        Reset all
                      </button>
                    )}
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-1.5 mb-3">
                    <label className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider block">
                      Status
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {["All", "Active", "On Leave", "Absent"].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatusFilter(st)}
                          className={cn(
                            "text-[11px] font-semibold py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer truncate",
                            statusFilter === st
                              ? "bg-[#0E4D41] text-white border-[#0E4D41]"
                              : "bg-[#F7F7F7] border-transparent text-[#203430] hover:bg-[#E4F2D3]"
                          )}
                        >
                          {st === "All" ? "All Statuses" : st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Department Filter */}
                  <div className="space-y-1.5 mb-3">
                    <label className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider block">
                      Department
                    </label>
                    <select
                      value={deptFilter}
                      onChange={(e) => setDeptFilter(e.target.value)}
                      className="w-full text-xs font-medium text-[#203430] bg-[#F7F7F7] border border-[#E5E6E6] rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#28C2A9]"
                    >
                      <option value="All">All Departments</option>
                      {availableDepts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Work Model Filter */}
                  <div className="space-y-1.5 mb-3">
                    <label className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider block">
                      Work Model
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {["All", "On-Site", "Remote", "Hybrid"].map((wm) => (
                        <button
                          key={wm}
                          type="button"
                          onClick={() => setModelFilter(wm)}
                          className={cn(
                            "text-[11px] font-semibold py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer truncate",
                            modelFilter === wm
                              ? "bg-[#0E4D41] text-white border-[#0E4D41]"
                              : "bg-[#F7F7F7] border-transparent text-[#203430] hover:bg-[#E4F2D3]"
                          )}
                        >
                          {wm === "All" ? "All Models" : wm}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full py-2 mt-1 text-xs font-bold text-white bg-[#0E4D41] hover:bg-[#1a5d50] rounded-xl transition-colors cursor-pointer"
                  >
                    Apply Filters
                  </button>
                </div>
              )}
            </div>

            {/* Sort by dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#63716E]" ref={sortRef}>
              <span className="font-medium text-[#63716E] hidden sm:inline">Sort by:</span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="h-10 px-3.5 bg-[#E4F2D3] hover:bg-[#d9edc3] text-[#0E4D41] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{sortBy}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-[#0E4D41] transition-transform",
                      isSortOpen && "rotate-180"
                    )}
                  />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-[#E5E6E6] p-1.5 z-50 animate-fade-in text-left">
                    {["Name", "ID", "Date"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setSortBy(item);
                          if (item === "Name") setSortColumn("name");
                          else if (item === "ID") setSortColumn("id");
                          else setSortColumn("date");
                          setIsSortOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                          sortBy === item
                            ? "bg-[#E4F2D3] text-[#0E4D41] font-bold"
                            : "text-[#203430] hover:bg-[#F7F7F7]"
                        )}
                      >
                        <span>{item}</span>
                        {sortBy === item && (
                          <Check className="h-3.5 w-3.5 text-[#0E4D41]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* New Employee Primary Button */}
            <button
              type="button"
              onClick={() => navigate("/employees/new")}
              className={cn(
                "h-10 px-4 rounded-xl text-xs font-bold text-white shadow-xs flex items-center transition-colors whitespace-nowrap",
                canCreateEmployee
                  ? "bg-[#28C2A9] hover:bg-[#20aa94] active:bg-[#1b9380] cursor-pointer"
                  : "bg-slate-300 cursor-not-allowed opacity-60 pointer-events-none"
              )}
              disabled={!canCreateEmployee}
              title={canCreateEmployee ? "Add employee" : "HR manager only — full employee access required"}
            >
              New Employee
            </button>

            {/* View Switch Toggle: Table vs Grid */}
            <div className="flex items-center bg-[#F6F7F6] border border-[#E5E6E6] rounded-xl p-0.5 ml-1">
              <button
                type="button"
                onClick={() => setView("table")}
                title="Table view"
                className={cn(
                  "p-2 rounded-lg transition-all cursor-pointer",
                  view === "table"
                    ? "bg-white text-[#28C2A9] shadow-xs font-bold"
                    : "text-[#A4ACAB] hover:text-[#63716E]"
                )}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                title="Tile view"
                className={cn(
                  "p-2 rounded-lg transition-all cursor-pointer",
                  view === "grid"
                    ? "bg-white text-[#28C2A9] shadow-xs font-bold"
                    : "text-[#A4ACAB] hover:text-[#63716E]"
                )}
              >
                <Grid2X2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Views */}
        {view === "table" ? (
          /* =========================================================================
             SCREENSHOT 1 & 2: TABULAR EMPLOYEE LIST
             ========================================================================= */
          <div className="bg-white rounded-2xl border border-[#EBECEB] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8F9F8] text-[11px] font-semibold text-[#6B7875] border-b border-[#EBECEB] select-none">
                    {/* Master Checkbox: Minus when partially selected, Check when all selected */}
                    <th className="py-3.5 pl-5 pr-3 w-10">
                      <div
                        onClick={handleToggleSelectAll}
                        className={cn(
                          "h-4 w-4 rounded-md flex items-center justify-center cursor-pointer transition-colors",
                          isAllSelected || isSomeSelected
                            ? "bg-[#28C2A9] text-white"
                            : "border border-[#D1D5DB] bg-white hover:border-[#9CA3AF]"
                        )}
                      >
                        {isSomeSelected && <Minus className="h-2.5 w-2.5 stroke-[3]" />}
                        {isAllSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </th>

                    {/* Column: Employee ID */}
                    <th
                      onClick={() => handleSortColumn("id")}
                      className="py-3.5 px-3 whitespace-nowrap font-medium cursor-pointer hover:text-[#1F312E]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Employee ID</span>
                        <ChevronsUpDown className="h-3 w-3 text-[#A4ACAB]" />
                      </div>
                    </th>

                    {/* Column: Name */}
                    <th
                      onClick={() => handleSortColumn("name")}
                      className="py-3.5 px-3 whitespace-nowrap font-medium cursor-pointer hover:text-[#1F312E]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Name</span>
                        <ChevronsUpDown className="h-3 w-3 text-[#A4ACAB]" />
                      </div>
                    </th>

                    {/* Column: Job Title */}
                    <th
                      onClick={() => handleSortColumn("role")}
                      className="py-3.5 px-3 whitespace-nowrap font-medium cursor-pointer hover:text-[#1F312E]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Job Title</span>
                        <ChevronsUpDown className="h-3 w-3 text-[#A4ACAB]" />
                      </div>
                    </th>

                    {/* Column: Department */}
                    <th
                      onClick={() => handleSortColumn("dept")}
                      className="py-3.5 px-3 whitespace-nowrap font-medium cursor-pointer hover:text-[#1F312E]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Department</span>
                        <ChevronsUpDown className="h-3 w-3 text-[#A4ACAB]" />
                      </div>
                    </th>

                    {/* Column: Employment Type */}
                    <th
                      onClick={() => handleSortColumn("type")}
                      className="py-3.5 px-3 whitespace-nowrap font-medium cursor-pointer hover:text-[#1F312E]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Employment Type</span>
                        <ChevronsUpDown className="h-3 w-3 text-[#A4ACAB]" />
                      </div>
                    </th>

                    {/* Column: Work Model */}
                    <th
                      onClick={() => handleSortColumn("model")}
                      className="py-3.5 px-3 whitespace-nowrap font-medium cursor-pointer hover:text-[#1F312E]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Work Model</span>
                        <ChevronsUpDown className="h-3 w-3 text-[#A4ACAB]" />
                      </div>
                    </th>

                    {/* Column: Join Date */}
                    <th
                      onClick={() => handleSortColumn("date")}
                      className="py-3.5 px-3 whitespace-nowrap font-medium cursor-pointer hover:text-[#1F312E]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Join Date</span>
                        <ChevronsUpDown className="h-3 w-3 text-[#A4ACAB]" />
                      </div>
                    </th>

                    {/* Column: Status */}
                    <th
                      onClick={() => handleSortColumn("status")}
                      className="py-3.5 pl-3 pr-6 whitespace-nowrap font-medium cursor-pointer hover:text-[#1F312E]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Status</span>
                        <ChevronsUpDown className="h-3 w-3 text-[#A4ACAB]" />
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0F1F0]">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2.5 max-w-sm mx-auto">
                          <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                            <Users className="h-5 w-5" />
                          </div>
                          <p className="text-xs font-bold text-[#1F312E]">No Employees Found</p>
                          <p className="text-[11px] text-[#6B7875]">
                            No staff members match the selected search or filter criteria.
                          </p>
                          <button
                            type="button"
                            onClick={handleResetFilters}
                            className="mt-2 px-3 py-1.5 rounded-lg bg-[#E4F2D3] text-[#0E4D41] text-xs font-bold flex items-center gap-1.5 hover:bg-[#d9edc3] cursor-pointer"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Reset Filters</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedEmployees.map((emp) => {
                      const isSelected = selectedIds.includes(emp.id);

                      return (
                        <tr
                          key={emp.id}
                          onClick={() => navigate(`/employees/${emp.id}`)}
                          className={cn(
                            "transition-colors cursor-pointer group text-xs",
                            isSelected
                              ? "bg-[#F2F9ED] hover:bg-[#ECF6E7]"
                              : "bg-white hover:bg-[#FAFCF9]"
                          )}
                        >
                          {/* Row Checkbox */}
                          <td className="py-3 pl-5 pr-3">
                            <div
                              onClick={(e) => handleToggleSelect(emp.id, e)}
                              className={cn(
                                "h-4 w-4 rounded-md flex items-center justify-center cursor-pointer transition-colors",
                                isSelected
                                  ? "bg-[#28C2A9] text-white"
                                  : "border border-[#D1D5DB] bg-white group-hover:border-[#9CA3AF]"
                              )}
                            >
                              {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                            </div>
                          </td>

                          {/* Employee ID */}
                          <td className="py-3 px-3 text-[#203430] font-normal whitespace-nowrap">
                            {emp.id}
                          </td>

                          {/* Name with Avatar */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={emp.avatar}
                                alt={emp.name}
                                className="h-7 w-7 rounded-full object-cover shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <span className="font-semibold text-[#1F312E]">
                                {emp.name}
                              </span>
                            </div>
                          </td>

                          {/* Job Title */}
                          <td className="py-3 px-3 text-[#203430] font-normal whitespace-nowrap">
                            {emp.role}
                          </td>

                          {/* Department */}
                          <td className="py-3 px-3 text-[#203430] font-normal whitespace-nowrap">
                            {emp.dept}
                          </td>

                          {/* Employment Type Pill */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="inline-flex px-3 py-0.5 rounded-lg border border-[#7ED6C3] bg-[#F7FDFB] text-xs font-medium text-[#1F312E]">
                              {emp.type}
                            </span>
                          </td>

                          {/* Work Model with Dot */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-xs text-[#203430]">
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full inline-block",
                                  emp.model === "Hybrid"
                                    ? "bg-[#9AE06D]"
                                    : emp.model === "Remote"
                                    ? "bg-[#0E4D41]"
                                    : "bg-[#28C2A9]"
                                )}
                              />
                              <span>{emp.model}</span>
                            </div>
                          </td>

                          {/* Join Date */}
                          <td className="py-3 px-3 text-[#203430] font-normal whitespace-nowrap">
                            {emp.joinDate}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 pl-3 pr-6 whitespace-nowrap">
                            <span
                              className={cn(
                                "inline-flex px-3 py-0.5 rounded-full text-xs font-semibold text-white",
                                emp.status === "Active"
                                  ? "bg-[#28C2A9]"
                                  : emp.status === "On Leave"
                                  ? "bg-[#6B7875]"
                                  : "bg-[#0E4D41]"
                              )}
                            >
                              {emp.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* =========================================================================
             SCREENSHOT 3: TILE VIEW CARDS (Exact match to Lina Armand & Jacob Yuen)
             ========================================================================= */
          filteredEmployees.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#EBECEB] p-16 text-center shadow-2xs">
              <div className="flex flex-col items-center justify-center space-y-2.5 max-w-sm mx-auto">
                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Users className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-[#1F312E]">No Employees Found</p>
                <p className="text-[11px] text-[#6B7875]">
                  No staff members match the selected search or filter criteria.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-[#E4F2D3] text-[#0E4D41] text-xs font-bold flex items-center gap-1.5 hover:bg-[#d9edc3] cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Filters</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-200">
              {paginatedEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                  className="bg-white rounded-[24px] border border-[#EBECEB] p-6 flex flex-col items-center text-center shadow-2xs hover:shadow-md transition-shadow relative cursor-pointer"
                >
                  {/* Circular Avatar with Teal Background */}
                  <div className="w-[88px] h-[88px] rounded-full bg-[#28C2A9] p-1 flex items-center justify-center overflow-hidden mb-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Employee ID */}
                  <div className="text-xs font-medium text-[#6B7875] mb-1">
                    {emp.id}
                  </div>

                  {/* Employee Full Name */}
                  <h3 className="text-lg font-bold text-[#1F312E] mb-4">
                    {emp.name}
                  </h3>

                  {/* Info Box: Job Title & Department in two rows */}
                  <div className="w-full bg-[#F6F7F6] rounded-xl p-3.5 mb-4 text-xs">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[#6B7875]">Job Title</span>
                      <span className="font-semibold text-[#1F312E] text-right truncate ml-2">
                        {emp.role}
                      </span>
                    </div>
                    <div className="border-t border-[#EAEBEA] my-1.5" />
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[#6B7875]">Department</span>
                      <span className="font-semibold text-[#1F312E] text-right truncate ml-2">
                        {emp.dept === "R&D" ? "Research & Development" : emp.dept}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Badges Row: Employment Type, Work Model, Status */}
                  <div className="w-full flex items-center justify-between gap-1.5 mt-auto">
                    {/* Employment Type */}
                    <span className="flex-1 py-1.5 text-center rounded-lg bg-[#E4F2D3] text-[#0E4D41] text-xs font-semibold truncate">
                      {emp.type}
                    </span>

                    {/* Work Model */}
                    <span className="flex-1 py-1.5 text-center rounded-lg bg-[#E8EBEA] text-[#203430] text-xs font-semibold truncate">
                      {emp.model}
                    </span>

                    {/* Status */}
                    <span
                      className={cn(
                        "flex-1 py-1.5 text-center rounded-xl text-xs font-semibold text-white truncate",
                        emp.status === "Active"
                          ? "bg-[#28C2A9]"
                          : emp.status === "On Leave"
                          ? "bg-[#526360]"
                          : "bg-[#0E4D41]"
                      )}
                    >
                      {emp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* =========================================================================
            RESPONSIVE PAGINATION FOOTER (Shared between Table and Grid Views)
            ========================================================================= */}
        {totalItems > 0 && (
          <div className="bg-white rounded-2xl border border-[#EBECEB] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
            {/* Left: Summary text & Page size */}
            <div className="flex items-center gap-3">
              <span className="text-[#6B7875]">
                Showing <strong className="text-[#1F312E]">{startIndex + 1}</strong> to{" "}
                <strong className="text-[#1F312E]">{endIndex}</strong> of{" "}
                <strong className="text-[#1F312E]">{totalItems}</strong> employees
              </span>

              {/* Items per page dropdown */}
              <div className="relative" ref={pageSizeRef}>
                <button
                  type="button"
                  onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
                  className="h-8 px-2.5 rounded-lg bg-[#F6F7F6] border border-[#E5E6E6] text-[#203430] font-semibold flex items-center gap-1 cursor-pointer hover:bg-[#EBECEB]"
                >
                  <span>{pageSize} / page</span>
                  <ChevronDown className="h-3 w-3 text-[#6B7875]" />
                </button>

                {isPageSizeOpen && (
                  <div className="absolute left-0 bottom-full mb-1 w-28 bg-white rounded-xl shadow-lg border border-[#E5E6E6] p-1 z-50 animate-fade-in">
                    {[10, 20, 50].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setPageSize(size);
                          setIsPageSizeOpen(false);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                          pageSize === size
                            ? "bg-[#E4F2D3] text-[#0E4D41]"
                            : "hover:bg-[#F7F7F7] text-[#203430]"
                        )}
                      >
                        {size} per page
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Page Navigation Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage <= 1}
                className={cn(
                  "h-8 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors",
                  safeCurrentPage <= 1
                    ? "border-[#E5E6E6] text-[#A4ACAB] bg-[#F7F7F7] cursor-not-allowed"
                    : "border-[#E5E6E6] text-[#203430] bg-white hover:bg-[#F7F7F7] cursor-pointer"
                )}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {/* Page Number Buttons */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  // Only show numbers within window if totalPages > 5
                  if (
                    totalPages > 5 &&
                    Math.abs(pNum - safeCurrentPage) > 1 &&
                    pNum !== 1 &&
                    pNum !== totalPages
                  ) {
                    if (pNum === 2 || pNum === totalPages - 1) {
                      return (
                        <span key={pNum} className="px-1 text-[#A4ACAB] text-xs">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  const isActive = pNum === safeCurrentPage;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setCurrentPage(pNum)}
                      className={cn(
                        "h-8 min-w-[32px] px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer",
                        isActive
                          ? "bg-[#0E4D41] text-white shadow-2xs"
                          : "text-[#203430] hover:bg-[#F0F1F0]"
                      )}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage >= totalPages}
                className={cn(
                  "h-8 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors",
                  safeCurrentPage >= totalPages
                    ? "border-[#E5E6E6] text-[#A4ACAB] bg-[#F7F7F7] cursor-not-allowed"
                    : "border-[#E5E6E6] text-[#203430] bg-white hover:bg-[#F7F7F7] cursor-pointer"
                )}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

