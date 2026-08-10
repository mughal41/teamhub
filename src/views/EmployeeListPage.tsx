import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card, Badge } from "../components/ui/LayoutAddons";
import { Button } from "../components/ui/Button";
import {
  Search,
  Plus,
  Grid2X2,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
  UserPlus,
  UserMinus,
  UserCog,
  ArrowUpRight,
  SlidersHorizontal,
  Trash2,
  Loader2,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getEmployeesApi, deleteEmployeeApi, Employee as ApiEmployee } from "../lib/api/employees";

export default function EmployeeListPage() {
  const [view, setView] = React.useState<"grid" | "table">("table");
  const [employees, setEmployees] = React.useState<ApiEmployee[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [deptFilter, setDeptFilter] = React.useState("All");
  const [modelFilter, setModelFilter] = React.useState("All");
  const [sortBy, setSortBy] = React.useState<"name" | "id">("name");

  // Fetch API data on filter/search change
  const fetchRoster = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEmployeesApi({
        q: search,
        dept: deptFilter,
        model: modelFilter,
        status: statusFilter,
      });
      setEmployees(data);
    } catch (err: any) {
      setError(err.message || "Failed to load employee roster.");
    } finally {
      setIsLoading(false);
    }
  }, [search, deptFilter, modelFilter, statusFilter]);

  React.useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to remove employee ${id}?`)) return;
    try {
      await deleteEmployeeApi(id);
      fetchRoster();
    } catch (err: any) {
      alert(err.message || "Failed to delete employee.");
    }
  };

  // Map API fields to view model
  const employeeStore = employees.map((emp) => ({
    id: emp.id,
    name: emp.name,
    role: emp.role_title,
    dept: emp.department_name || emp.sub_role || "General",
    type: emp.employment_type,
    model: emp.work_model,
    status: emp.status,
    avatar:
      emp.avatar ||
      `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80`,
    joinDate: emp.join_date,
  }));

  // Dynamic department statistics calculated directly from backend response
  const marketingCount = employeeStore.filter((e) => e.dept === "Executive Marketing" || e.dept === "Marketing").length;
  const engCount = employeeStore.filter((e) => e.dept === "Engineering" || e.dept === "R&D").length;
  const productCount = employeeStore.filter((e) => e.dept === "Product Design" || e.dept === "Product").length;
  const hrCount = employeeStore.filter((e) => e.dept === "Human Resources" || e.dept === "HR").length;

  const totalEmpsForDept = employeeStore.length || 1;

  const deptData = [
    { name: "Engineering", value: engCount, color: "#35BFA3" },
    { name: "Executive Marketing", value: marketingCount, color: "#E4F2D3" },
    { name: "Product Design", value: productCount, color: "#63716E" },
    { name: "Human Resources", value: hrCount, color: "#0E4D41" },
  ].filter((d) => d.value > 0);

  const sortedEmployees = [...employeeStore].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return a.id.localeCompare(b.id);
  });

  return (
    <AppLayout
      title="Employees"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Employees" }]}
    >
      <div className="space-y-6">
        {/* Toggle View & Global Actions */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isLoading && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-brand">
                <Loader2 className="h-4 w-4 animate-spin" /> Fetching live API roster...
              </span>
            )}
            {error && (
              <span className="text-xs font-semibold text-rose-500">{error}</span>
            )}
          </div>
          <div className="flex items-center bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                view === "grid" ? "bg-slate-50 text-brand" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                view === "table" ? "bg-slate-50 text-brand" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {view === "table" && (
          <>
            {/* Table View Summary Section */}
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                <Card className="flex flex-col justify-between bg-[#E4F2D3] border-none p-5 h-full min-h-[120px]">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand" />
                    <span className="text-xs font-medium text-[#63716E]">Total Employees</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold text-[#0E4D41]">
                      {employeeStore.length}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#0E4D41] text-[10px] font-bold text-white">
                        <ArrowUpRight className="h-3 w-3" /> Live DRF
                      </span>
                      <span className="text-[10px] text-[#63716E]">database API</span>
                    </div>
                  </div>
                </Card>

                <Card className="flex flex-col justify-between p-5 h-full min-h-[120px]">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-brand" />
                    <span className="text-xs font-medium text-[#63716E]">Active Staff</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold text-[#203430]">
                      {employeeStore.filter((e) => e.status === "Active").length}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#E4F2D3] text-[10px] font-bold text-[#0E4D41]">
                        Active status
                      </span>
                      <span className="text-[10px] text-[#63716E]">in roster</span>
                    </div>
                  </div>
                </Card>

                <Card className="flex flex-col justify-between p-5 h-full min-h-[120px]">
                  <div className="flex items-center gap-2">
                    <UserCog className="h-4 w-4 text-brand" />
                    <span className="text-xs font-medium text-[#63716E]">Hybrid Staff</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold text-[#203430]">
                      {employeeStore.filter((e) => e.model === "Hybrid").length}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#FAEFF0] text-[10px] font-bold text-[#203430]">
                        Hybrid model
                      </span>
                      <span className="text-[10px] text-[#63716E]">in roster</span>
                    </div>
                  </div>
                </Card>

                <Card className="flex flex-col justify-between p-5 h-full min-h-[120px]">
                  <div className="flex items-center gap-2">
                    <UserMinus className="h-4 w-4 text-brand" />
                    <span className="text-xs font-medium text-[#63716E]">Remote Staff</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold text-[#203430]">
                      {employeeStore.filter((e) => e.model === "Remote").length}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#E4F2D3] text-[10px] font-bold text-[#0E4D41]">
                        Remote model
                      </span>
                      <span className="text-[10px] text-[#63716E]">in roster</span>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="w-full lg:w-[450px] p-5 flex flex-col justify-between min-h-[256px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#203430]">Departments</h3>
                  <button className="flex items-center gap-1 bg-[#E4F2D3] px-2 py-1 rounded text-[10px] font-bold text-slate-700">
                    Live View <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
                {employeeStore.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-slate-200 rounded-xl h-[160px] text-center gap-1">
                    <Users className="h-6 w-6 text-slate-300" />
                    <p className="text-[11px] font-bold text-slate-600">No Department Records</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 h-[160px]">
                    <div className="w-[160px] h-full shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={deptData}
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {deptData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 py-2 overflow-y-auto hidden-scrollbar">
                      {deptData.map((dept) => (
                        <div key={dept.name} className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: dept.color }}
                            />
                            <span className="text-[9px] font-medium text-[#203430] whitespace-nowrap">
                              {dept.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 ml-3.5">
                            <Users className="h-2.5 w-2.5 text-brand" />
                            <span className="text-[9px] font-bold text-[#63716E]">
                              {dept.value}
                            </span>
                            <span className="text-[9px] font-bold text-[#203430]">
                              — {Math.round((dept.value / totalEmpsForDept) * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Table Controls */}
            <Card className="p-0 overflow-hidden bg-white">
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-50">
                <div className="flex items-center gap-4 flex-1">
                  <h2 className="text-sm font-bold text-[#203430]">Employee List</h2>
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search employee..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-9 w-full rounded-lg bg-slate-50 pl-9 pr-4 text-xs outline-none focus:ring-1 focus:ring-brand transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#E4F2D3] h-9 px-2.5 rounded-lg text-[11px] font-bold text-slate-700 outline-none hover:opacity-90 transition-all cursor-pointer border-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Absent">Absent</option>
                  </select>

                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="bg-[#E4F2D3] h-9 px-2.5 rounded-lg text-[11px] font-bold text-slate-700 outline-none hover:opacity-90 transition-all cursor-pointer border-none"
                  >
                    <option value="All">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Executive Marketing">Executive Marketing</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>

                  <select
                    value={modelFilter}
                    onChange={(e) => setModelFilter(e.target.value)}
                    className="bg-[#E4F2D3] h-9 px-2.5 rounded-lg text-[11px] font-bold text-slate-700 outline-none hover:opacity-90 transition-all cursor-pointer border-none"
                  >
                    <option value="All">All Models</option>
                    <option value="On-Site">On-Site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "name" | "id")}
                    className="bg-[#E4F2D3] h-9 px-2.5 rounded-lg text-[11px] font-bold text-slate-700 outline-none hover:opacity-90 transition-all cursor-pointer border-none mr-2"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="id">Sort by ID</option>
                  </select>

                  <Button
                    onClick={() => navigate("/employees/new")}
                    className="h-9 gap-1.5 px-4 text-xs font-bold shadow-lg shadow-brand/20"
                  >
                    <Plus className="h-3.5 w-3.5" /> New Employee
                  </Button>
                </div>
              </div>

              {/* Table Render */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-5 py-3 text-left">
                        <input
                          type="checkbox"
                          className="h-3 w-3 rounded-[3px] border-slate-200 text-brand ring-0 focus:ring-0"
                        />
                      </th>
                      {[
                        { label: "Employee ID", key: "id" },
                        { label: "Name", key: "name" },
                        { label: "Job Title", key: "role" },
                        { label: "Department", key: "dept" },
                        { label: "Employment Type", key: "type" },
                        { label: "Work Model", key: "model" },
                        { label: "Join Date", key: "date" },
                        { label: "Status", key: "status" },
                        { label: "Action", key: "action" },
                      ].map((col) => (
                        <th key={col.label} className="px-4 py-3 text-left whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-[#63716E] uppercase tracking-wider">
                            {col.label} <SlidersHorizontal className="h-3 w-3" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-5 py-20 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2 max-w-sm mx-auto">
                            <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-sm text-slate-400">
                              <Users className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-[12px] text-[#203430] mt-2">
                              No Employees Logged
                            </h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              No registered staff records match your current organizational filter criteria.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      sortedEmployees.map((emp) => (
                        <tr
                          key={emp.id}
                          className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                          onClick={() => navigate(`/employees/${emp.id}`)}
                        >
                          <td className="px-5 py-3">
                            <input
                              type="checkbox"
                              className="h-3 w-3 rounded-[3px] border-slate-200 text-brand ring-0 focus:ring-0"
                            />
                          </td>
                          <td className="px-4 py-3 text-[11px] font-medium text-slate-600">
                            {emp.id}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={emp.avatar}
                                className="h-7 w-7 rounded-full object-cover"
                              />
                              <span className="text-[11px] font-bold text-[#203430]">
                                {emp.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[11px] font-medium text-slate-600">
                            {emp.role}
                          </td>
                          <td className="px-4 py-3 text-[11px] font-medium text-slate-600">
                            {emp.dept}
                          </td>
                          <td className="px-4 py-3">
                            <div className="inline-flex px-2 py-0.5 rounded border border-brand/20 bg-emerald-50 text-[10px] font-medium text-brand">
                              {emp.type}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <div
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  emp.model === "Remote"
                                    ? "bg-brand"
                                    : emp.model === "Hybrid"
                                    ? "bg-amber-400"
                                    : "bg-slate-400"
                                )}
                              />
                              <span className="text-[11px] font-medium text-slate-600">
                                {emp.model}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[11px] font-medium text-slate-600">
                            {emp.joinDate}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={
                                emp.status === "Active"
                                  ? "success"
                                  : emp.status === "On Leave"
                                  ? "warning"
                                  : "default"
                              }
                              className="text-[10px] px-2.5 py-0.5"
                            >
                              {emp.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={(e) => handleDelete(e, emp.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete employee"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">Showing</span>
                  <button className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded text-[11px] font-bold text-slate-700 cursor-default">
                    {sortedEmployees.length} <ChevronDown className="h-3 w-3" />
                  </button>
                  <span className="text-[11px] text-slate-400">
                    of {employeeStore.length} recorded
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="p-1 px-1.5 rounded-md bg-slate-50 text-slate-300" disabled>
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button className="h-7 w-7 rounded-md text-[11px] font-bold bg-brand text-white shadow-sm">
                    1
                  </button>
                  <button className="p-1 px-1.5 rounded-md bg-slate-50 text-slate-300" disabled>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          </>
        )}

        {view === "grid" && (
          <div className="w-full">
            {sortedEmployees.length === 0 ? (
              <Card className="p-12 text-center max-w-sm mx-auto flex flex-col items-center justify-center space-y-3 bg-white border border-slate-100 shadow-sm rounded-2xl">
                <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-sm text-slate-400">
                  <Users className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-[12px] text-[#203430] mt-2">No Grid Matches</h4>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in duration-200">
                {sortedEmployees.map((emp) => (
                  <Card
                    key={emp.id}
                    className="relative flex flex-col p-5 hover:border-[#28C2A9] transition-all group overflow-hidden cursor-pointer bg-white rounded-[16px] border border-slate-100 shadow-sm"
                    onClick={() => navigate(`/employees/${emp.id}`)}
                  >
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className="relative h-20 w-20 rounded-full bg-[#28C2A9] flex items-center justify-center p-0.5 shadow-sm border border-slate-100 shrink-0 mb-3">
                        <img
                          src={emp.avatar}
                          className="h-full w-full rounded-full object-cover border-2 border-white group-hover:scale-105 duration-500 transition-transform"
                        />
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">
                        {emp.id}
                      </p>
                      <h4 className="text-[14px] font-black text-[#203430] group-hover:text-[#28C2A9] transition-colors leading-tight">
                        {emp.name}
                      </h4>
                    </div>

                    <div className="w-full bg-[#F7F7F7] rounded-[12px] p-3.5 space-y-2 mb-4 text-[10px] text-left">
                      <div className="flex items-center pb-2 border-b border-slate-200/50">
                        <span className="font-semibold text-slate-450 w-[80px] shrink-0 text-left">
                          Job Title
                        </span>
                        <span className="font-bold text-[#203430] text-left truncate flex-1">
                          {emp.role}
                        </span>
                      </div>
                      <div className="flex items-center pt-1">
                        <span className="font-semibold text-slate-450 w-[80px] shrink-0 text-left">
                          Department
                        </span>
                        <span className="font-bold text-[#203430] text-left truncate flex-1">
                          {emp.dept}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full mt-auto">
                      <div className="flex items-center gap-1.5">
                        <div className="px-2.5 py-1 rounded-[8px] text-[9px] font-bold tracking-wide uppercase bg-[#E4F2D3] text-[#0E4D41]">
                          {emp.type}
                        </div>
                        <div className="px-2.5 py-1 rounded-[8px] bg-[#E5E6E6]/60 text-[9px] font-bold text-[#63716E] uppercase">
                          {emp.model}
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-[12px] text-[9px] font-bold text-white bg-[#28C2A9] uppercase">
                        {emp.status}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
