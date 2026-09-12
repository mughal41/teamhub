import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { getCollection, saveCollection } from "../lib/db";
import { Card, Badge } from "../components/ui/LayoutAddons";
import { Button } from "../components/ui/Button";
import {
  Search,
  Filter,
  Plus,
  Grid2X2,
  List,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
  UserPlus,
  UserMinus,
  UserCog,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

/**
 * @typedef {Object} Employee
 * @property {string} id - Unique operational identifier of the personnel (e.g., "EMP-0234")
 * @property {string} name - Full Legal Name of the staff member
 * @property {string} role - Core functional role and job title (e.g., "Marketing Executive")
 * @property {string} dept - Structural department assignment (e.g., "Marketing" | "R&D" | "Product Design" | "Operations" | "Human Resources" | "Customer Service")
 * @property {string} type - Contract status (e.g., "Full-Time" | "Part-Time" | "Internship" | "Freelance")
 * @property {string} model - Attendance work model (e.g., "Hybrid" | "Remote" | "On-Site")
 * @property {string} status - Dynamic status (e.g., "Active" | "On Leave" | "Absent" | "Inactive")
 * @property {string} avatar - Public HTTPS profile vector / photoreal image url hook
 * @property {string} joinDate - Certified onboarding date in "DD MMM YYYY" format
 *
 * @api_response_format {Employee[]}
 * @endpoint GET `/api/employees` - Returns a JSON array list matching this schema representation.
 * @endpoint POST `/api/employees` - Expects a subset of body payload fields to insert a certified profile ledger.
 *
 * @example_json_payload
 * [
 *   {
 *     "id": "EMP-0234",
 *     "name": "Olivia Mason",
 *     "role": "Marketing Executive",
 *     "dept": "Marketing",
 *     "type": "Full-Time",
 *     "model": "On-Site",
 *     "status": "Active",
 *     "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
 *     "joinDate": "12 Jan 2033"
 *   }
 * ]
 */

// Dynamic department tracking lists will be computed inside the component body directly from the employee store

export default function EmployeeListPage() {
  const [view, setView] = React.useState<"grid" | "table">("table");
  
  /*
   * EXPECTED JSON SCHEMA / RECORD FORMAT FOR THE EMPLOYEE DATABASE STORE (db_employees):
   * [
   *   {
   *     "id": "EMP-0234",                     // String: Staff operational ID (e.g. "EMP-XXXX")
   *     "name": "Olivia Mason",               // String: Full legal name
   *     "role": "Marketing Executive",       // String: Corporate role / job title
   *     "dept": "Marketing",                // String: Department ("Marketing", "R&D", "Product Design", "Operations", "Human Resources", "Customer Service")
   *     "type": "Full-Time",                  // String: Employment type ("Full-Time", "Part-Time", "Internship", "Freelance")
   *     "model": "On-Site",                   // String: Work style ("On-Site", "Remote", "Hybrid")
   *     "status": "Active",                   // String: Status ("Active", "On Leave", "Absent", "Inactive")
   *     "avatar": "https://images.unsplash...",// String: Valid HTTPS avatar image URL
   *     "joinDate": "12 Jan 2033"             // String: Formatted onboard date
   *   }
   * ]
   */
  const [employeeStore, setEmployeeStoreState] = React.useState<any[]>(() => {
    return getCollection<any[]>("db_employees", []);
  });

  const setEmployeeStore = (update: any[] | ((prev: any[]) => any[])) => {
    if (typeof update === "function") {
      setEmployeeStoreState((prev) => {
        const next = update(prev);
        saveCollection("db_employees", next);
        return next;
      });
    } else {
      setEmployeeStoreState(update);
      saveCollection("db_employees", update);
    }
  };

  React.useEffect(() => {
    const handleDbUpdate = () => {
      setEmployeeStoreState(getCollection<any[]>("db_employees", []));
    };
    window.addEventListener("db_updated", handleDbUpdate);
    window.addEventListener("storage", handleDbUpdate);
    return () => {
      window.removeEventListener("db_updated", handleDbUpdate);
      window.removeEventListener("storage", handleDbUpdate);
    };
  }, []);

  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [deptFilter, setDeptFilter] = React.useState("All");
  const [modelFilter, setModelFilter] = React.useState("All");
  const [sortBy, setSortBy] = React.useState<"name" | "id">("name");

  // Dynamic department statistics calculated directly from database array
  const marketingCount = employeeStore.filter(e => e.dept === "Marketing").length;
  const rdCount = employeeStore.filter(e => e.dept === "R&D").length;
  const productCount = employeeStore.filter(e => e.dept === "Product Design" || e.dept === "Product").length;
  const opsCount = employeeStore.filter(e => e.dept === "Operations").length;
  const hrCount = employeeStore.filter(e => e.dept === "Human Resources" || e.dept === "HR").length;
  const csCount = employeeStore.filter(e => e.dept === "Customer Service").length;

  const totalEmpsForDept = employeeStore.length || 1;

  const deptData = [
    { name: "Customer Service", value: csCount, color: "#0E4D41" },
    { name: "Operations", value: opsCount, color: "#35BFA3" },
    { name: "Marketing", value: marketingCount, color: "#E4F2D3" },
    { name: "Product Design", value: productCount, color: "#63716E" },
    { name: "R&D", value: rdCount, color: "#A4ACAB" },
    { name: "Human Resources", value: hrCount, color: "#E5E6E6" },
  ].filter(d => d.value > 0);

  const filteredEmployees = employeeStore
    .filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.role.toLowerCase().includes(search.toLowerCase()) ||
        emp.id.toLowerCase().includes(search.toLowerCase()) ||
        emp.dept.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || emp.status === statusFilter;
      const matchesDept = deptFilter === "All" || emp.dept === deptFilter;
      const matchesModel = modelFilter === "All" || emp.model === modelFilter;
      return matchesSearch && matchesStatus && matchesDept && matchesModel;
    })
    .sort((a, b) => {
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
        <div className="flex items-center justify-end gap-2 mb-2">
          <div className="flex items-center bg-white border border-[#E4E4E1] rounded-xl p-1">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                view === "grid"
                  ? "bg-slate-50 text-brand"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                view === "table"
                  ? "bg-slate-50 text-brand"
                  : "text-slate-400 hover:text-slate-600",
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
                    <span className="text-xs font-medium text-[#63716E]">
                      Total Employees
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold text-[#0E4D41]">
                      {employeeStore.length}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#0E4D41] text-[10px] font-bold text-white">
                        <ArrowUpRight className="h-3 w-3" /> Live
                      </span>
                      <span className="text-[10px] text-[#63716E]">
                        database record
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="flex flex-col justify-between p-5 h-full min-h-[120px]">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-brand" />
                    <span className="text-xs font-medium text-[#63716E]">
                      Active Staff
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold text-[#203430]">
                      {employeeStore.filter((e) => e.status === "Active").length}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#E4F2D3] text-[10px] font-bold text-[#0E4D41]">
                        Active status
                      </span>
                      <span className="text-[10px] text-[#63716E]">
                        in database
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="flex flex-col justify-between p-5 h-full min-h-[120px]">
                  <div className="flex items-center gap-2">
                    <UserCog className="h-4 w-4 text-brand" />
                    <span className="text-xs font-medium text-[#63716E]">
                      Hybrid Staff
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold text-[#203430]">
                      {employeeStore.filter((e) => e.model === "Hybrid").length}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#FAEFF0] text-[10px] font-bold text-[#203430]">
                        Hybrid model
                      </span>
                      <span className="text-[10px] text-[#63716E]">
                        in database
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="flex flex-col justify-between p-5 h-full min-h-[120px]">
                  <div className="flex items-center gap-2">
                    <UserMinus className="h-4 w-4 text-brand" />
                    <span className="text-xs font-medium text-[#63716E]">
                      Remote Staff
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold text-[#203430]">
                      {employeeStore.filter((e) => e.model === "Remote").length}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#E4F2D3] text-[10px] font-bold text-[#0E4D41]">
                        Remote model
                      </span>
                      <span className="text-[10px] text-[#63716E]">
                        in database
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="w-full lg:w-[450px] p-5 flex flex-col justify-between min-h-[256px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#203430]">
                    Departments
                  </h3>
                  <button className="flex items-center gap-1 bg-[#E4F2D3] px-2 py-1 rounded text-[10px] font-bold text-slate-700">
                    This Month <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
                {employeeStore.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-slate-200 rounded-xl h-[160px] text-center gap-1">
                    <Users className="h-6 w-6 text-slate-300" />
                    <p className="text-[11px] font-bold text-slate-600">No Department Records</p>
                    <p className="text-[9px] text-slate-400">Roster needs logged profiles</p>
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
                  <h2 className="text-sm font-bold text-[#203430]">
                    Employee List
                  </h2>
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
                    <option value="Marketing">Marketing</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="R&D">R&D</option>
                    <option value="Operations">Operations</option>
                    <option value="Customer Service">Customer Service</option>
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
                <table className="w-full bg-white">
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
                      ].map((col) => (
                        <th
                          key={col.label}
                          className="px-4 py-3 text-left whitespace-nowrap"
                        >
                          <div className="flex items-center gap-1 text-[10px] font-bold text-[#63716E] uppercase tracking-wider">
                            {col.label}{" "}
                            <SlidersHorizontal className="h-3 w-3" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-5 py-20 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2 max-w-sm mx-auto">
                            <div className="h-10 w-10 bg-slate-50 border border-[#E4E4E1] rounded-full flex items-center justify-center text-slate-400">
                              <Users className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-[12px] text-[#203430] mt-2">
                              No Employees Logged
                            </h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              No registered staff records match your current
                              organizational filter criteria. Add a profile
                              using the button above to begin.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((emp) => (
                        <tr
                          key={emp.id}
                          className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                          onClick={() => {
                            if (emp.status === "Draft") {
                              navigate(`/employees/new?id=${emp.id}`);
                            } else {
                              navigate(`/employees/${emp.id}`);
                            }
                          }}
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
                                      : "bg-slate-400",
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
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer / Pagination */}
              <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">Showing</span>
                  <button className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded text-[11px] font-bold text-slate-700 cursor-default">
                    {filteredEmployees.length} <ChevronDown className="h-3 w-3" />
                  </button>
                  <span className="text-[11px] text-slate-400">
                    of {employeeStore.length} recorded
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="p-1 px-1.5 rounded-md bg-slate-50 text-slate-300" disabled>
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button className="h-7 w-7 rounded-md text-[11px] font-bold bg-brand text-white">
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
          <>
            {/* Grid View Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search employee..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 w-full rounded-xl bg-white border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-brand transition-all"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#E4F2D3] h-10 px-3 rounded-xl text-xs font-bold text-slate-700 outline-none hover:opacity-90 transition-all cursor-pointer border-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Absent">Absent</option>
                </select>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="bg-[#E4F2D3] h-10 px-3 rounded-xl text-xs font-bold text-slate-700 outline-none hover:opacity-90 transition-all cursor-pointer border-none"
                >
                  <option value="All">All Departments</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="R&D">R&D</option>
                  <option value="Operations">Operations</option>
                  <option value="Customer Service">Customer Service</option>
                </select>
                <select
                  value={modelFilter}
                  onChange={(e) => setModelFilter(e.target.value)}
                  className="bg-[#E4F2D3] h-10 px-3 rounded-xl text-xs font-bold text-slate-700 outline-none hover:opacity-90 transition-all cursor-pointer border-none"
                >
                  <option value="All">All Models</option>
                  <option value="On-Site">On-Site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  Sort by:
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "name" | "id")}
                    className="bg-[#E4F2D3] h-10 px-3 rounded-xl text-xs font-bold text-slate-700 outline-none hover:opacity-90 transition-all cursor-pointer border-none"
                  >
                    <option value="name">Name</option>
                    <option value="id">ID</option>
                  </select>
                </div>
                <Button
                  onClick={() => navigate("/employees/new")}
                  className="h-10 gap-1.5 px-4 text-sm font-bold shadow-lg shadow-brand/20"
                >
                  <Plus className="h-4 w-4" /> New Employee
                </Button>
              </div>
            </div>

            {/* Grid Render */}
            <div className="w-full">
              {filteredEmployees.length === 0 ? (
                <Card className="p-12 text-center max-w-sm mx-auto flex flex-col items-center justify-center space-y-3 bg-white border border-[#E4E4E1] rounded-2xl">
                  <div className="h-10 w-10 bg-slate-50 border border-[#E4E4E1] rounded-full flex items-center justify-center text-slate-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-[12px] text-[#203430] mt-2">
                    No Grid Matches
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    There are currently no staff profiles to display. Click "New
                    Employee" in the header to register.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in duration-200">
                  {filteredEmployees.map((emp) => (
                    <Card
                      key={emp.id}
                      className="relative flex flex-col p-5 hover:border-[#28C2A9] transition-all group overflow-hidden cursor-pointer bg-white rounded-[16px] border border-[#E4E4E1]"
                      onClick={() => {
                        if (emp.status === "Draft") {
                          navigate(`/employees/new?id=${emp.id}`);
                        } else {
                          navigate(`/employees/${emp.id}`);
                        }
                      }}
                    >
                      {/* Avatar and name header centered */}
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="relative h-20 w-20 rounded-full bg-[#28C2A9] flex items-center justify-center p-0.5 border border-[#E4E4E1] shrink-0 mb-3">
                          <img
                            src={emp.avatar}
                            className="h-full w-full rounded-full object-cover border-2 border-white group-hover:scale-105 duration-500 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">
                          {emp.id}
                        </p>
                        <h4 className="text-[14px] font-black text-[#203430] group-hover:text-[#28C2A9] transition-colors leading-tight">
                          {emp.name}
                        </h4>
                      </div>

                      {/* Details block with gray background and line divider */}
                      <div className="w-full bg-white border border-[#E6E6E4] rounded-[12px] p-3.5 space-y-2 mb-4 text-[10px] text-left">
                        <div className="flex items-center pb-2 border-b border-slate-200/50">
                          <span className="font-semibold text-slate-450 w-[80px] shrink-0 text-left">Job Title</span>
                          <span className="font-bold text-[#203430] text-left truncate flex-1">{emp.role}</span>
                        </div>
                        <div className="flex items-center pt-1">
                          <span className="font-semibold text-slate-450 w-[80px] shrink-0 text-left">Department</span>
                          <span className="font-bold text-[#203430] text-left truncate flex-1">{emp.dept}</span>
                        </div>
                      </div>

                      {/* Badges row: Type/Model on left, Status on right */}
                      <div className="flex items-center justify-between w-full mt-auto">
                        <div className="flex items-center gap-1.5">
                          {/* Employment Type */}
                          <div className={cn(
                            "px-2.5 py-1 rounded-[8px] text-[9px] font-bold tracking-wide uppercase",
                            emp.type === "Full-Time" 
                              ? "bg-[#E4F2D3] text-[#0E4D41]" 
                              : emp.type === "Part-Time"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-slate-50 text-slate-650 border border-slate-200" // Internship / Freelance
                          )}>
                            {emp.type}
                          </div>

                          {/* Model */}
                          <div className="px-2.5 py-1 rounded-[8px] bg-[#F3F3F0]/60 text-[9px] font-bold text-[#63716E] uppercase">
                            {emp.model}
                          </div>
                        </div>

                        {/* Status */}
                        <span className={cn(
                          "px-3 py-1 rounded-[12px] text-[9px] font-bold text-white min-w-[55px] text-center uppercase shrink-0",
                          emp.status === "Active"
                            ? "bg-[#28C2A9]"
                            : emp.status === "On Leave"
                              ? "bg-[#63716E]"
                              : "bg-[#0E4D41]" // Absent
                        )}>
                          {emp.status}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Grid Pagination */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Showing</span>
                <button className="flex items-center gap-1.5 bg-white border border-[#E4E4E1] px-2 py-1 rounded-lg text-xs font-bold text-slate-700 cursor-default">
                  {filteredEmployees.length} <ChevronDown className="h-3 w-3" />
                </button>
                <span className="text-xs text-slate-400">of {employeeStore.length} recorded</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-1 px-1.5 text-slate-300 animate-none opacity-50 cursor-not-allowed" disabled>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="h-9 w-9 rounded-xl text-sm font-bold bg-brand text-white shadow-lg shadow-brand/20">
                  1
                </button>
                <button className="p-1 px-1.5 text-slate-300 animate-none opacity-50 cursor-not-allowed" disabled>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
