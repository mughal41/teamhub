import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
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
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useNavigate } from "react-router-dom";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';

const employees = [
  { id: "EMP-0234", name: "Olivia Mason", role: "Marketing Executive", dept: "Marketing", type: "Full-Time", model: "Hybrid", status: "Active", avatar: "https://i.pravatar.cc/150?u=11", joinDate: "12 Jan 2034" },
  { id: "EMP-0178", name: "Ethan Ray", role: "UI Designer", dept: "Product Design", type: "Full-Time", model: "Remote", status: "Active", avatar: "https://i.pravatar.cc/150?u=12", joinDate: "03 Mar 2033" },
  { id: "EMP-0312", name: "Lina Armand", role: "Lab Analyst", dept: "R&D", type: "Part-Time", model: "On-Site", status: "On Leave", avatar: "https://i.pravatar.cc/150?u=13", joinDate: "22 Jul 2034" },
  { id: "EMP-0115", name: "Jacob Yuen", role: "Site Supervisor", dept: "Operations", type: "Full-Time", model: "On-Site", status: "Absent", avatar: "https://i.pravatar.cc/150?u=14", joinDate: "05 Sep 2032" },
  { id: "EMP-0289", name: "Mia Torres", role: "HR Officer", dept: "Human Resources", type: "Full-Time", model: "Hybrid", status: "Active", avatar: "https://i.pravatar.cc/150?u=15", joinDate: "14 Feb 2033" },
  { id: "EMP-0291", name: "Daniel Cheung", role: "Compliance Specialist", dept: "Operations", type: "Full-Time", model: "Remote", status: "Active", avatar: "https://i.pravatar.cc/150?u=16", joinDate: "19 Nov 2033" },
  { id: "EMP-0275", name: "Anya Rodriguez", role: "Graphic Designer", dept: "Marketing", type: "Freelance", model: "Remote", status: "Active", avatar: "https://i.pravatar.cc/150?u=17", joinDate: "06 Apr 2035" },
  { id: "EMP-0356", name: "Sara Kim", role: "Customer Support Intern", dept: "Customer Service", type: "Internship", model: "On-Site", status: "Active", avatar: "https://i.pravatar.cc/150?u=18", joinDate: "10 May 2035" },
  { id: "EMP-0159", name: "Kelvin Yu", role: "Training Coordinator", dept: "HR", type: "Part-Time", model: "On-Site", status: "Active", avatar: "https://i.pravatar.cc/150?u=19", joinDate: "27 Jun 2032" },
  { id: "EMP-0320", name: "Farah Nabila", role: "Customer Experience Lead", dept: "Customer Service", type: "Full-Time", model: "Hybrid", status: "Active", avatar: "https://i.pravatar.cc/150?u=20", joinDate: "08 Aug 2034" },
  { id: "EMP-0362", name: "Juno Park", role: "UX Researcher", dept: "Product Design", type: "Full-Time", model: "Hybrid", status: "Active", avatar: "https://i.pravatar.cc/150?u=21", joinDate: "15 Sep 2035" },
  { id: "EMP-0265", name: "Hana Putri", role: "Recruitment Assistant", dept: "Human Resources", type: "Internship", model: "On-Site", status: "Active", avatar: "https://i.pravatar.cc/150?u=22", joinDate: "11 Oct 2034" },
];

const deptData = [
  { name: 'Customer Service', value: 26, color: '#0E4D41' },
  { name: 'Operations', value: 26, color: '#35BFA3' },
  { name: 'Marketing', value: 23, color: '#E4F2D3' },
  { name: 'Product Design', value: 20, color: '#63716E' },
  { name: 'R&D', value: 18, color: '#A4ACAB' },
  { name: 'Human Resources', value: 15, color: '#E5E6E6' },
];

export default function EmployeeListPage() {
  const [view, setView] = React.useState<'grid' | 'table'>('table');
  const navigate = useNavigate();

  return (
    <AppLayout 
      title="Employees" 
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Employees" }]}
    >
      <div className="space-y-6">
        
        {/* Toggle View & Global Actions */}
        <div className="flex items-center justify-end gap-2 mb-2">
            <div className="flex items-center bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
                <button 
                  onClick={() => setView('grid')}
                  className={cn("p-1.5 rounded-lg transition-all", view === 'grid' ? "bg-slate-50 text-brand" : "text-slate-400 hover:text-slate-600")}
                >
                  <Grid2X2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setView('table')}
                  className={cn("p-1.5 rounded-lg transition-all", view === 'table' ? "bg-slate-50 text-brand" : "text-slate-400 hover:text-slate-600")}
                >
                  <List className="h-4 w-4" />
                </button>
            </div>
        </div>

        {view === 'table' && (
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
                    <span className="text-3xl font-bold text-[#0E4D41]">128</span>
                    <div className="flex flex-col items-end gap-1">
                       <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#0E4D41] text-[10px] font-bold text-white">
                         <ArrowUpRight className="h-3 w-3" /> 1.6%
                       </span>
                       <span className="text-[10px] text-[#63716E]">from last month</span>
                    </div>
                  </div>
                </Card>

                <Card className="flex flex-col justify-between p-5 h-full min-h-[120px]">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-brand" />
                    <span className="text-xs font-medium text-[#63716E]">New Employees (This Month)</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold text-[#203430]">7</span>
                    <div className="flex flex-col items-end gap-1">
                       <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#E4F2D3] text-[10px] font-bold text-[#0E4D41]">
                         <ArrowUpRight className="h-3 w-3" /> 5.8%
                       </span>
                       <span className="text-[10px] text-[#63716E]">from last month</span>
                    </div>
                  </div>
                </Card>

                <Card className="flex flex-col justify-between p-5 h-full min-h-[120px]">
                  <div className="flex items-center gap-2">
                    <UserCog className="h-4 w-4 text-brand" />
                    <span className="text-xs font-medium text-[#63716E]">Turnover Rate</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold text-[#203430]">3.1%</span>
                    <div className="flex flex-col items-end gap-1">
                       <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#FAEFF0] text-[10px] font-bold text-[#203430]">
                         <ArrowDownRight className="h-3 w-3" /> 2.4%
                       </span>
                       <span className="text-[10px] text-[#63716E]">from last month</span>
                    </div>
                  </div>
                </Card>

                <Card className="flex flex-col justify-between p-5 h-full min-h-[120px]">
                  <div className="flex items-center gap-2">
                    <UserMinus className="h-4 w-4 text-brand" />
                    <span className="text-xs font-medium text-[#63716E]">Resigned Employees (This Month)</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold text-[#203430]">4</span>
                    <div className="flex flex-col items-end gap-1">
                       <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#E4F2D3] text-[10px] font-bold text-[#0E4D41]">
                         <ArrowUpRight className="h-3 w-3" /> 2.1%
                       </span>
                       <span className="text-[10px] text-[#63716E]">from last month</span>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="w-full lg:w-[450px] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#203430]">Departments</h3>
                  <button className="flex items-center gap-1 bg-[#E4F2D3] px-2 py-1 rounded text-[10px] font-bold text-slate-700">
                    This Month <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
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
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: dept.color }} />
                          <span className="text-[9px] font-medium text-[#203430] whitespace-nowrap">{dept.name}</span>
                        </div>
                        <div className="flex items-center gap-1 ml-3.5">
                          <Users className="h-2.5 w-2.5 text-brand" />
                          <span className="text-[9px] font-bold text-[#63716E]">{dept.value}</span>
                          <span className="text-[9px] font-bold text-[#203430]">— {Math.round((dept.value / 128) * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                          placeholder="Search employee" 
                          className="h-9 w-full rounded-lg bg-slate-50 pl-9 pr-4 text-xs outline-none focus:ring-1 focus:ring-brand transition-all"
                        />
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-[#E4F2D3] px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-700">
                       <Filter className="h-3.5 w-3.5" /> Filter <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 px-2">
                       Sort by:
                       <button className="flex items-center gap-1 bg-[#E4F2D3] px-3 py-1.5 rounded-lg font-bold text-slate-700">
                          Name <ChevronDown className="h-3.5 w-3.5" />
                       </button>
                    </div>
                    <Button onClick={() => navigate('/employees/new')} className="h-9 gap-1.5 px-4 text-xs font-bold shadow-lg shadow-brand/20">
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
                        <input type="checkbox" className="h-3 w-3 rounded-[3px] border-slate-200 text-brand ring-0 focus:ring-0" />
                      </th>
                      {[
                        { label: 'Employee ID', key: 'id' },
                        { label: 'Name', key: 'name' },
                        { label: 'Job Title', key: 'role' },
                        { label: 'Department', key: 'dept' },
                        { label: 'Employment Type', key: 'type' },
                        { label: 'Work Model', key: 'model' },
                        { label: 'Join Date', key: 'date' },
                        { label: 'Status', key: 'status' }
                      ].map(col => (
                        <th key={col.label} className="px-4 py-3 text-left whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-[#63716E] uppercase tracking-wider">
                            {col.label} <SlidersHorizontal className="h-3 w-3" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => navigate(`/employees/${emp.id}`)}>
                        <td className="px-5 py-3">
                          <input type="checkbox" className="h-3 w-3 rounded-[3px] border-slate-200 text-brand ring-0 focus:ring-0" />
                        </td>
                        <td className="px-4 py-3 text-[11px] font-medium text-slate-600">{emp.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                             <img src={emp.avatar} className="h-7 w-7 rounded-full object-cover" />
                             <span className="text-[11px] font-bold text-[#203430]">{emp.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[11px] font-medium text-slate-600">{emp.role}</td>
                        <td className="px-4 py-3 text-[11px] font-medium text-slate-600">{emp.dept}</td>
                        <td className="px-4 py-3">
                           <div className="inline-flex px-2 py-0.5 rounded border border-brand/20 bg-emerald-50 text-[10px] font-medium text-brand">
                              {emp.type}
                           </div>
                        </td>
                        <td className="px-4 py-3">
                           <div className="flex items-center gap-1.5">
                              <div className={cn("h-1.5 w-1.5 rounded-full", emp.model === 'Remote' ? "bg-brand" : emp.model === 'Hybrid' ? "bg-amber-400" : "bg-slate-400")} />
                              <span className="text-[11px] font-medium text-slate-600">{emp.model}</span>
                           </div>
                        </td>
                        <td className="px-4 py-3 text-[11px] font-medium text-slate-600">{emp.joinDate}</td>
                        <td className="px-4 py-3">
                           <Badge variant={emp.status === 'Active' ? 'success' : emp.status === 'On Leave' ? 'warning' : 'default'} className="text-[10px] px-2.5 py-0.5">
                              {emp.status}
                           </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Table Footer / Pagination */}
              <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-50">
                 <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">Show</span>
                    <button className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded text-[11px] font-bold text-slate-700">
                       10 <ChevronDown className="h-3 w-3" />
                    </button>
                    <span className="text-[11px] text-slate-400">of 480 results</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <button className="p-1 px-1.5 rounded-md bg-slate-50 text-slate-300"><ChevronLeft className="h-3.5 w-3.5" /></button>
                    {[1, 2, 3, '...', 16].map((p, i) => (
                      <button key={i} className={cn("h-7 w-7 rounded-md text-[11px] font-bold transition-all", p === 1 ? "bg-brand text-white shadow-sm" : "text-slate-500 hover:bg-slate-50")}>{p}</button>
                    ))}
                    <button className="p-1 px-1.5 rounded-md bg-slate-50 text-slate-700"><ChevronRight className="h-3.5 w-3.5" /></button>
                 </div>
              </div>
            </Card>
          </>
        )}

        {view === 'grid' && (
          <>
            {/* Grid View Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
               <div className="flex items-center gap-3">
                  <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search employee" 
                        className="h-10 w-full rounded-xl bg-white border border-white pl-10 pr-4 text-sm outline-none focus:border-brand shadow-sm transition-all"
                      />
                  </div>
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F2D3] text-slate-700">
                     <SlidersHorizontal className="h-4 w-4" />
                  </button>
                  <button className="flex items-center gap-2 bg-[#E4F2D3] h-10 px-4 rounded-xl text-xs font-bold text-slate-700 whitespace-nowrap">
                     All Department <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button className="flex items-center gap-2 bg-[#E4F2D3] h-10 px-4 rounded-xl text-xs font-bold text-slate-700 whitespace-nowrap">
                     All Position <ChevronDown className="h-3.5 w-3.5" />
                  </button>
               </div>
               <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    Sort by:
                    <button className="flex items-center gap-1 bg-[#E4F2D3] px-3 py-2 rounded-lg font-bold text-slate-700">
                       Name <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <Button onClick={() => navigate('/employees/new')} className="h-10 gap-1.5 px-4 text-sm font-bold shadow-lg shadow-brand/20">
                     <Plus className="h-4 w-4" /> New Employee
                  </Button>
               </div>
            </div>

            {/* Grid Render */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
               {employees.map((emp) => (
                 <Card key={emp.id} className="relative flex flex-col p-4 hover:border-brand transition-all group overflow-hidden cursor-pointer" onClick={() => navigate(`/employees/${emp.id}`)}>
                    <div className="flex flex-col items-center gap-3 mb-6">
                        <div className="relative">
                            <img src={emp.avatar} className="h-20 w-20 rounded-full object-cover ring-4 ring-emerald-50 duration-500 group-hover:scale-105 transition-transform" />
                            <div className={cn("absolute -bottom-1 right-2 h-4 w-4 rounded-full border-2 border-white", emp.status === 'Active' ? "bg-emerald-500" : "bg-slate-300")} />
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{emp.id}</p>
                            <h4 className="text-base font-bold text-[#203430] group-hover:text-brand transition-colors">{emp.name}</h4>
                        </div>
                    </div>

                    <div className="bg-[#F7F7F7] rounded-xl p-3 space-y-3 mb-4">
                        <div className="flex items-center justify-between gap-4">
                           <span className="text-[10px] font-medium text-slate-400">Job Title</span>
                           <span className="text-[10px] font-bold text-[#203430] text-right truncate">{emp.role}</span>
                        </div>
                        <div className="h-[1px] bg-slate-100" />
                        <div className="flex items-center justify-between gap-4">
                           <span className="text-[10px] font-medium text-slate-400">Department</span>
                           <span className="text-[10px] font-bold text-[#203430] text-right">{emp.dept}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#E4F2D3] px-2 py-1 rounded text-[9px] font-bold text-[#0E4D41] uppercase">{emp.type}</div>
                            <div className="bg-slate-100 px-2 py-1 rounded text-[9px] font-bold text-[#0E4D41] uppercase">{emp.model}</div>
                        </div>
                        <div className={cn("px-3 py-1 rounded-full text-[9px] font-bold text-white", emp.status === 'Active' ? "bg-brand" : "bg-slate-400")}>
                           {emp.status}
                        </div>
                    </div>
                 </Card>
               ))}
            </div>

            {/* Grid Pagination */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6">
               <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Show</span>
                  <button className="flex items-center gap-1.5 bg-white border border-slate-100 px-2 py-1 rounded-lg text-xs font-bold text-slate-700">
                     12 <ChevronDown className="h-3 w-3" />
                  </button>
                  <span className="text-xs text-slate-400">of 480 results</span>
               </div>
               
               <div className="flex items-center gap-2">
                  <button className="p-1 px-1.5 text-slate-300"><ChevronLeft className="h-5 w-5" /></button>
                  {[1, 2, 3, '...', 16].map((p, i) => (
                    <button key={i} className={cn("h-9 w-9 rounded-xl text-sm font-bold transition-all", p === 1 ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-slate-500 hover:bg-slate-50")}>{p}</button>
                  ))}
                  <button className="p-1 px-1.5 text-slate-700"><ChevronRight className="h-5 w-5" /></button>
               </div>
            </div>
          </>
        )}

      </div>
    </AppLayout>
  );
}

