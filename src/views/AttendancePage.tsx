import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/LayoutAddons";
import { 
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Settings,
  Bell,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  ArrowUpDown
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, ResponsiveContainer
} from "recharts";
import { cn } from "@/src/lib/utils";

const attendanceOverviewData = [
  { month: 'Feb', present: 70, leave: 15, absent: 5 },
  { month: 'Mar', present: 75, leave: 10, absent: 8 },
  { month: 'Apr', present: 85, leave: 8, absent: 4 },
  { month: 'May', present: 80, leave: 12, absent: 6 },
  { month: 'Jun', present: 92, leave: 5, absent: 3 },
  { month: 'Jul', present: 88, leave: 7, absent: 5 },
];

const attendanceList = [
  { name: "Olivia Mason", id: "EMP-0234", role: "Marketing", subRole: "Executive Marketing", date: "19 Jun 2035", model: "Hybrid", in: "08:55 AM", out: "05:05 PM", duration: "8h 10m", overtime: "10m", status: "On-Time", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Ethan Ray", id: "EMP-0178", role: "UI Designer", subRole: "Product Design", date: "19 Jun 2035", model: "Remote", in: "09:14 AM", out: "05:20 PM", duration: "8h 6m", overtime: "6m", status: "Late", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Lina Armand", id: "EMP-0312", role: "Lab Analyst", subRole: "R&D", date: "19 Jun 2035", model: "On-Site", in: "— — —", out: "", duration: "—", overtime: "—", status: "On Leave", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Jacob Yuen", id: "EMP-0115", role: "Site Supervisor", subRole: "Operations", date: "19 Jun 2035", model: "On-Site", in: "— — —", out: "", duration: "—", overtime: "—", status: "Absent", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Mia Torres", id: "EMP-0289", role: "HR Officer", subRole: "Human Resources", date: "19 Jun 2035", model: "Hybrid", in: "08:59 AM", out: "05:10 PM", duration: "8h 11m", overtime: "11m", status: "On-Time", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Sara Kim", id: "EMP-0356", role: "Customer Support", subRole: "Customer Service", date: "19 Jun 2035", model: "On-Site", in: "09:02 AM", out: "05:00 PM", duration: "7h 58m", overtime: "—", status: "Late", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Daniel Cheung", id: "EMP-0291", role: "Compliance Specialist", subRole: "Operations", date: "19 Jun 2035", model: "Remote", in: "08:48 AM", out: "05:00 PM", duration: "8h 12m", overtime: "12m", status: "On-Time", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Anya Rodriguez", id: "EMP-0275", role: "Graphic Designer", subRole: "Marketing", date: "19 Jun 2035", model: "Remote", in: "09:10 AM", out: "05:15 PM", duration: "8h 5m", overtime: "5m", status: "Late", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Kelvin Yu", id: "EMP-0159", role: "Training Coordinator", subRole: "HR", date: "19 Jun 2035", model: "On-Site", in: "08:45 AM", out: "04:50 PM", duration: "8h 5m", overtime: "5m", status: "On-Time", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Farah Nabila", id: "EMP-0320", role: "Customer Experience Lead", subRole: "Customer Service", date: "19 Jun 2035", model: "Hybrid", in: "09:00 AM", out: "05:05 PM", duration: "8h 5m", overtime: "5m", status: "On-Time", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
];

export default function AttendancePage() {
  return (
    <AppLayout 
      title="Attendance"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Attendance" }]}
    >
      <div className="space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
           {/* Present Card */}
           <Card className="lg:col-span-3 h-[195px] flex flex-col p-0 border-none rounded-[16px] bg-white overflow-hidden shadow-sm">
              <div className="bg-[#E4F2D3] p-4">
                 <h3 className="text-[16px] font-bold text-[#203430]">Present</h3>
              </div>
              <div className="flex-1 p-4 flex flex-col justify-end">
                 <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[40px] font-bold text-[#0E4D41] leading-none">93</p>
                        <p className="text-[10px] text-[#63716E] mt-2">Employees</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="bg-[#F7F7F7] px-2 py-1 rounded-[6px] flex items-center gap-1">
                           <span className="text-[16px] font-bold text-brand">+4</span>
                        </div>
                        <p className="text-[10px] text-[#63716E]">vs yesterday</p>
                    </div>
                 </div>
                 <div className="mt-4 flex gap-4 bg-[#F7F7F7] rounded-[8px] p-2">
                    <div className="flex items-center gap-1.5">
                       <span className="text-[16px] font-bold text-[#0E4D41]">82</span>
                       <span className="text-[10px] text-[#63716E]">On-Time</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <span className="text-[16px] font-bold text-[#0E4D41]">11</span>
                       <span className="text-[10px] text-[#63716E]">Late</span>
                    </div>
                 </div>
              </div>
           </Card>

           {/* On Leave Card */}
           <Card className="lg:col-span-4 h-[195px] flex flex-col p-0 border-none rounded-[16px] bg-white overflow-hidden shadow-sm">
              <div className="bg-brand p-4">
                 <h3 className="text-[16px] font-bold text-white">On Leave</h3>
              </div>
              <div className="flex-1 p-4 flex flex-col justify-end">
                 <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[40px] font-bold text-[#0E4D41] leading-none">6</p>
                        <p className="text-[10px] text-[#63716E] mt-2">Employees</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="bg-[#F7F7F7] px-2 py-1 rounded-[6px] flex items-center gap-1">
                           <span className="text-[16px] font-bold text-brand">+1</span>
                        </div>
                        <p className="text-[10px] text-[#63716E]">vs yesterday</p>
                    </div>
                 </div>
                 <div className="mt-4 flex justify-between bg-[#F7F7F7] rounded-[8px] p-2">
                    <div className="flex items-center gap-1.5 shrink-0 px-1 border-r border-[#E5E6E6]">
                       <span className="text-[16px] font-bold text-[#0E4D41]">3</span>
                       <span className="text-[10px] text-[#63716E]">Annual Leave</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 px-1 border-r border-[#E5E6E6]">
                       <span className="text-[16px] font-bold text-[#0E4D41]">2</span>
                       <span className="text-[10px] text-[#63716E]">Sick Leave</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 px-1">
                       <span className="text-[16px] font-bold text-[#0E4D41]">1</span>
                       <span className="text-[10px] text-[#63716E]">Others</span>
                    </div>
                 </div>
              </div>
           </Card>

           {/* Absent Card */}
           <Card className="lg:col-span-2 h-[195px] flex flex-col p-0 border-none rounded-[16px] bg-white overflow-hidden shadow-sm">
              <div className="bg-[#0E4D41] p-4">
                 <h3 className="text-[16px] font-bold text-white">Absent</h3>
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                 <div className="flex flex-col items-center pt-2">
                    <p className="text-[40px] font-bold text-[#0E4D41] leading-none">3</p>
                    <p className="text-[10px] text-[#63716E] mt-2">Employees</p>
                 </div>
                 <div className="flex items-center justify-center gap-2">
                    <div className="bg-[#F7F7F7] px-2 py-1 rounded-[6px]">
                       <span className="text-[16px] font-bold text-[#E63D4B]">+2</span>
                    </div>
                    <p className="text-[10px] text-[#63716E] text-center leading-tight">vs<br/>yesterday</p>
                 </div>
              </div>
           </Card>

           {/* Chart Overview */}
           <Card className="lg:col-span-3 h-[195px] p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex flex-col">
                    <h3 className="text-[16px] font-bold text-[#203430]">Attendance Overview</h3>
                    <div className="mt-2 flex flex-col gap-1.5">
                       <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-[#E4F2D3]" />
                          <span className="text-[12px] text-[#63716E]">Present</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-brand" />
                          <span className="text-[12px] text-[#63716E]">On Leave</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-[#0E4D41]" />
                          <span className="text-[12px] text-[#63716E]">Absent</span>
                       </div>
                    </div>
                 </div>
                 <div className="self-start">
                    <button className="flex items-center gap-2 bg-[#F7F7F7] px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-[#203430]">
                       Last 6 Months <ChevronDown className="h-3 w-3" />
                    </button>
                 </div>
              </div>
              <div className="flex-1 min-h-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceOverviewData} stackOffset="expand">
                       <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#63716E' }} 
                        dy={5}
                       />
                       <Bar dataKey="present" stackId="a" fill="#E4F2D3" radius={[0, 0, 0, 0]} />
                       <Bar dataKey="leave" stackId="a" fill="#35BFA3" radius={[0, 0, 0, 0]} />
                       <Bar dataKey="absent" stackId="a" fill="#0E4D41" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </Card>
        </div>

        {/* Employee Attendance Table */}
        <Card className="border-none rounded-[16px] bg-white shadow-sm overflow-hidden p-0 flex flex-col min-h-[700px]">
           <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
              <h2 className="text-[16px] font-bold text-[#203430]">Employee Attendance</h2>
              <div className="flex flex-wrap items-center gap-3">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#203430]" />
                    <input 
                      type="text" 
                      placeholder="Search employee" 
                      className="pl-10 pr-4 py-2 w-[223px] h-[34px] bg-[#F7F7F7] rounded-[8px] border-none text-[12px] text-[#63716E] outline-none"
                    />
                 </div>
                 <button className="flex items-center gap-2 bg-[#E4F2D3] h-[34px] px-3 rounded-[8px] text-[12px] font-medium text-[#203430]">
                    <Filter className="h-4 w-4" /> Filter <ChevronDown className="h-3 w-3" />
                 </button>
                 <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#63716E]">Sort by:</span>
                    <button className="flex items-center gap-2 bg-[#E4F2D3] h-[34px] px-3 rounded-[8px] text-[12px] font-medium text-[#203430]">
                       Name <ChevronDown className="h-3 w-3" />
                    </button>
                 </div>
              </div>
           </div>

           <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-[#F7F7F7]">
                    <tr>
                       <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                             Name <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                             Job Title <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                             Date <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                             Work Model <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                             Check In - Out <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                             Duration <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                             Overtime <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                             Status <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[#E5E6E6]">
                    {attendanceList.map((e, i) => (
                      <tr key={i} className="hover:bg-[#F7F7F7]/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex items-center gap-3">
                              <img src={e.avatar} className="h-8 w-8 rounded-full object-cover shadow-sm bg-brand" />
                              <div className="flex flex-col">
                                 <span className="text-[11px] font-bold text-[#203430] leading-none">{e.name}</span>
                                 <span className="text-[10px] text-[#63716E] mt-1 uppercase font-bold">{e.id}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-[#203430] leading-none">{e.role}</span>
                              <span className="text-[10px] text-[#63716E] mt-1 font-bold">{e.subRole}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[11px] font-bold text-[#203430]">{e.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex items-center gap-1.5">
                              <div className={cn("h-1.5 w-1.5 rounded-full", e.model === 'Hybrid' ? 'bg-[#E4F2D3]' : e.model === 'Remote' ? 'bg-brand' : 'bg-brand')} />
                              <span className="text-[11px] font-bold text-[#203430]">{e.model}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[11px] font-bold text-[#203430]">{e.in} {e.out ? `— ${e.out}` : ""}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[11px] font-bold text-[#203430]">{e.duration}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[11px] font-bold text-[#203430]">{e.overtime}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <div className={cn(
                             "px-2 py-1 rounded-full text-[11px] font-bold text-center w-fit min-w-[50px]",
                             e.status === 'On-Time' ? "bg-brand text-white" : 
                             e.status === 'Late' ? "bg-[#E4F2D3] text-[#203430]" : 
                             e.status === 'On Leave' ? "bg-[#E5E6E6] text-[#203430]" : "bg-[#0E4D41] text-white"
                           )}>
                              {e.status}
                           </div>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <div className="p-6 border-t border-[#E5E6E6] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                 <span className="text-[14px] text-[#63716E]">Show</span>
                 <button className="flex items-center gap-2 bg-[#F7F7F7] h-[28px] px-3 rounded-[8px] text-[12px] font-bold text-[#203430]">
                    10 <ChevronDown className="h-3 w-3" />
                 </button>
                 <span className="text-[14px] text-[#63716E]">of 102 results</span>
              </div>
              <div className="flex items-center gap-2">
                 <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F5F5F5] text-[#203430] disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
                 <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-brand text-white text-[12px] font-bold">1</button>
                 <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F7F7F7] text-[#203430] text-[12px] font-bold">2</button>
                 <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F7F7F7] text-[#203430] text-[12px] font-bold">3</button>
                 <span className="px-1 text-[12px] text-[#63716E]">...</span>
                 <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F7F7F7] text-[#203430] text-[12px] font-bold">11</button>
                 <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F7F7F7] text-[#203430]"><ChevronRight className="h-4 w-4" /></button>
              </div>
           </div>
        </Card>
      </div>

      <footer className="mt-20 py-8 border-t border-[#E5E6E6] flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
         <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-16">
            <p className="text-[12px] font-bold text-[#203430]">Copyright © 2025 Peterdraw</p>
            <div className="flex gap-6">
               {['Privacy Policy', 'Term and conditions', 'Contact'].map(l => (
                 <a key={l} href="#" className="text-[12px] text-[#63716E] hover:text-brand transition-colors">{l}</a>
               ))}
            </div>
         </div>
         <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
              <Icon key={i} className="h-4 w-4 text-[#63716E] cursor-pointer hover:text-brand" />
            ))}
         </div>
      </footer>
    </AppLayout>
  );
}
