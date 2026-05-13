import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/LayoutAddons";
import { 
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal,
  Calendar as CalendarIcon,
  CheckCircle,
  X,
  Umbrella,
  Stethoscope,
  Briefcase,
  Users,
  Smile,
  Palmtree
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell
} from "recharts";
import { cn } from "@/src/lib/utils";

const leaveOverviewData = [
  { day: 'Mon', count: 4 },
  { day: 'Tue', count: 6 },
  { day: 'Wed', count: 5 },
  { day: 'Thu', count: 7 },
  { day: 'Fri', count: 6 },
];

const leaveDistribution = [
  { name: 'Annual Leave', value: 3, percentage: 50, color: '#0E4D41' },
  { name: 'Sick Leave', value: 2, percentage: 33.3, color: '#35BFA3' },
  { name: 'Other Leaves', value: 1, percentage: 16.7, color: '#E4F2D3' },
  { name: 'Casual Leave', value: 0, percentage: 0, color: '#E5E6E6' },
];

const employeeLeaves = [
  { name: "Lina Armand", type: "Sick Leave", period: "20-22 June 2035", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Jacob Yuen", type: "Annual Leave", period: "17-21 June 2035", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Anya Rodriguez", type: "Other Leave", period: "19 June 2035", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
];

const leaveActivity = [
  { name: "Lina Armand", id: "EMP-0312", role: "Lab Analyst", dept: "R&D", type: "Sick Leave", submit: "18 Jun 2035", period: "20-22 June 2035", duration: "3 Days", reason: "Doctor's note attached", status: "Approved", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Jacob Yuen", id: "EMP-0115", role: "Site Supervisor", dept: "Operations", type: "Annual Leave", submit: "10 Jun 2035", period: "17-21 June 2035", duration: "5 Days", reason: "Family trip", status: "Approved", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Anya Rodriguez", id: "EMP-0275", role: "Graphic Designer", dept: "Marketing", type: "Other Leave", submit: "17 Jun 2035", period: "19 Jun 2035", duration: "1 Day", reason: "Personal matter", status: "Pending", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Olivia Mason", id: "EMP-0234", role: "Marketing", dept: "Executive Marketing", type: "Annual Leave", submit: "02 Jun 2035", period: "05-07 June 2035", duration: "3 Days", reason: "Conference attendance", status: "Approved", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Sara Kim", id: "EMP-0356", role: "Customer Support", dept: "Customer Service", type: "Sick Leave", submit: "14 Jun 2035", period: "15-16 Jun 2035", duration: "2 Days", reason: "Fever", status: "Approved", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Daniel Cheung", id: "EMP-0291", role: "Compliance Specialist", dept: "Operations", type: "Annual Leave", submit: "01 Jun 2035", period: "10-12 Jun 2035", duration: "3 Days", reason: "Holiday", status: "Pending", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Mia Torres", id: "EMP-0289", role: "HR Officer", dept: "Human Resources", type: "Annual Leave", submit: "06 Jun 2035", period: "09-10 Jun 2035", duration: "2 Days", reason: "Personal retreat", status: "Approved", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Ethan Ray", id: "EMP-0178", role: "UI Designer", dept: "Product Design", type: "Casual Leave", submit: "05 Jun 2035", period: "07 Jun 2035", duration: "1 Day", reason: "—", status: "Rejected", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Farah Nabila", id: "EMP-0320", role: "Customer Experience Lead", dept: "Customer Service", type: "Sick Leave", submit: "11 Jun 2035", period: "12 Jun 2035", duration: "1 Day", reason: "Headache", status: "Approved", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Kelvin Yu", id: "EMP-0159", role: "Training Coordinator", dept: "HR", type: "Other Leave", submit: "13 Jun 2035", period: "14 Jun 2035", duration: "1 Day", reason: "Volunteer program", status: "Rejected", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
];

const PIE_COLORS = ['#0E4D41', '#35BFA3', '#E4F2D3', '#E5E6E6'];

export default function LeaveManagementPage() {
  return (
    <AppLayout 
      title="Leave Management" 
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Leave Management" }]}
    >
      <div className="space-y-5">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
           <Card className="p-4 border-none rounded-[16px] bg-[#E4F2D3] shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                 <div className="h-6 w-6 rounded-full bg-brand flex items-center justify-center text-white">
                    <CalendarIcon className="h-4 w-4" />
                 </div>
                 <span className="text-[11px] text-[#63716E]">Total On Leave (Today)</span>
              </div>
              <div className="flex items-baseline gap-2">
                 <span className="text-[40px] font-bold text-[#0E4D41] leading-none">6</span>
                 <span className="text-[12px] text-[#0E4D41]">Employees</span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                 <div className="bg-white px-1.5 py-0.5 rounded-[10px]">
                    <span className="text-[11px] font-bold text-[#0E4D41]">4.7%</span>
                 </div>
                 <span className="text-[10px] text-[#63716E]">from total employee</span>
              </div>
           </Card>

           {[
             { label: 'Annual Leave', val: '3', percentage: '50%', color: '#35BFA3', icon: Umbrella },
             { label: 'Sick Leave', val: '2', percentage: '33.3%', color: '#35BFA3', icon: Stethoscope },
             { label: 'Other Leaves', val: '1', percentage: '16.7%', color: '#35BFA3', icon: Palmtree },
           ].map(stat => (
             <Card key={stat.label} className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                   <div className="h-6 w-6 rounded-full bg-[#F7F7F7] flex items-center justify-center">
                      <stat.icon className="h-4 w-15 text-brand" />
                   </div>
                   <span className="text-[11px] text-[#63716E]">{stat.label}</span>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-[40px] font-bold text-[#0E4D41] leading-none">{stat.val}</span>
                   <span className="text-[12px] text-[#63716E]">Employees</span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                   <div className="bg-[#E4F2D3] px-1.5 py-0.5 rounded-[10px]">
                      <span className="text-[11px] font-bold text-[#0E4D41]">{stat.percentage}</span>
                   </div>
                   <span className="text-[10px] text-[#63716E]">of total leave</span>
                </div>
             </Card>
           ))}
        </div>

        {/* Middle row: Overview, Calendar, Leaves, Types */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
           {/* Leave Overview */}
           <Card className="xl:col-span-3 p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col h-[294px]">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[16px] font-bold text-[#203430]">Leave Overview</h3>
                 <button className="flex items-center gap-2 bg-[#F7F7F7] px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-[#203430]">
                    This Week <ChevronDown className="h-3 w-3" />
                 </button>
              </div>
              <div className="flex-1 min-h-0">
                 <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={leaveOverviewData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                       <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#E4F2D3" stopOpacity={0.8}/>
                             <stop offset="95%" stopColor="#E4F2D3" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#63716E' }} 
                        dy={10}
                       />
                       <YAxis hide />
                       <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(14, 77, 65, 0.1)' }}
                        itemStyle={{ fontSize: '10px' }}
                        labelStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                       />
                       <Area type="monotone" dataKey="count" stroke="#35BFA3" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           {/* Calendar and Employee Leaves/Types */}
           <Card className="xl:col-span-6 p-4 border-none rounded-[16px] bg-white shadow-sm flex h-[294px] gap-8">
              {/* Calendar Section */}
              <div className="flex-1 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                       <span className="text-[18px] font-bold text-[#203430]">June 2035</span>
                       <ChevronDown className="h-4 w-4 text-[#63716E]" />
                    </div>
                    <div className="flex gap-2">
                       <button className="p-2 bg-[#E4F2D3] rounded-[8px] text-[#203430] hover:bg-brand hover:text-white transition-all"><ChevronLeft className="h-4 w-4" /></button>
                       <button className="p-2 bg-[#E4F2D3] rounded-[8px] text-[#203430] hover:bg-brand hover:text-white transition-all"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                 </div>
                 <div className="grid grid-cols-7 gap-y-2 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                       <span key={`${d}-${i}`} className="text-[14px] text-[#63716E] mb-2">{d}</span>
                    ))}
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                       const isToday = day === 7;
                       const isPublic = [1, 15].includes(day);
                       const isLeave = [17, 18, 19, 20, 21, 22].includes(day);
                       return (
                        <div key={day} className="h-7 w-7 mx-auto relative flex items-center justify-center">
                           <div className={cn(
                             "h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-medium z-10",
                             isToday ? "bg-[#E63D4B] text-white" : 
                             isLeave ? "bg-[#35BFA3] text-white" :
                             isPublic ? "bg-[#203430] text-white" : "text-[#203430]"
                           )}>
                              {day}
                           </div>
                        </div>
                       );
                    })}
                 </div>
                 <div className="flex gap-4 pt-2">
                    <div className="flex items-center gap-1.5">
                       <div className="h-3 w-3 rounded-full bg-brand" />
                       <span className="text-[11px] text-[#63716E]">Leave</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <div className="h-3 w-3 rounded-full bg-[#E63D4B]" />
                       <span className="text-[11px] text-[#63716E]">Public Holiday</span>
                    </div>
                 </div>
              </div>

              <div className="w-px bg-[#E5E6E6]"></div>

              {/* Employee Leaves List */}
              <div className="flex-1 space-y-4 flex flex-col">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-bold text-[#203430]">Employee Leaves</h3>
                    <button><MoreHorizontal className="h-4 w-4 text-[#63716E]" /></button>
                 </div>
                 <div className="flex-1 space-y-2 min-h-0 overflow-y-auto">
                    {employeeLeaves.map(e => (
                       <div key={e.name} className="flex items-center gap-3 p-3 bg-[#F7F7F7] rounded-[12px]">
                          <img src={e.avatar} className="h-8 w-8 rounded-full object-cover" />
                          <div className="flex-1 min-w-0">
                             <p className="text-[14px] font-bold text-[#203430] leading-none mb-1">{e.name}</p>
                             <div className="flex items-center gap-1">
                                <span className="text-[11px] font-medium text-brand">{e.type}</span>
                                <span className="text-[11px] text-[#A4ACAB]">|</span>
                                <span className="text-[11px] text-[#63716E] truncate">{e.period}</span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </Card>

           {/* Leave Types Donut */}
           <Card className="xl:col-span-3 p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col h-[460px]">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-[16px] font-bold text-[#203430]">Leave Types</h3>
                 <button><MoreHorizontal className="h-4 w-4 text-[#63716E]" /></button>
              </div>
              <div className="relative flex-1 flex items-center justify-center">
                 <PieChart width={198} height={198}>
                    <Pie
                      data={leaveDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {leaveDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                 </PieChart>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[40px] font-bold text-[#0E4D41] leading-none">6</span>
                    <span className="text-[11px] text-[#63716E]">Employees</span>
                 </div>
              </div>
              <div className="mt-4 space-y-3">
                 {leaveDistribution.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className="bg-[#0E4D41] h-6 w-12 rounded-[4px] flex items-center justify-center" style={{ backgroundColor: item.color === '#E5E6E6' ? '#E5E6E6' : PIN_COLORS_MAP[i] }}>
                             <span className={cn("text-[11px] font-medium", i === 0 ? "text-white" : "text-[#203430]")}>{item.percentage}%</span>
                          </div>
                          <span className="text-[12px] font-medium text-[#203430]">{item.name}</span>
                       </div>
                       <span className="text-[12px] text-[#63716E]">{item.value} employee</span>
                    </div>
                 ))}
              </div>
           </Card>
        </div>

        {/* Leave Activity Table Card */}
        <Card className="border-none rounded-[16px] bg-white shadow-sm overflow-hidden p-0 flex flex-col min-h-[708px]">
           <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
              <h2 className="text-[16px] font-bold text-[#203430]">Leave Activity</h2>
              <div className="flex flex-wrap items-center gap-3">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#203430]" />
                    <input 
                      type="text" 
                      placeholder="Search employee, ID, etc" 
                      className="pl-10 pr-4 py-2 w-[223px] h-[34px] bg-[#F7F7F7] rounded-[8px] border-none text-[12px] text-[#63716E] outline-none"
                    />
                 </div>
                 <button className="flex items-center gap-2 bg-[#E4F2D3] h-[34px] px-3 rounded-[8px] text-[12px] font-medium text-[#203430]">
                    <Filter className="h-4 w-4" /> Filter <ChevronDown className="h-3 w-3" />
                 </button>
              </div>
           </div>

           <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-[#F7F7F7]">
                    <tr>
                       <th className="px-6 py-3 w-10">
                          <div className="h-3 w-3 rounded-[3px] border border-brand bg-brand flex items-center justify-center">
                             <div className="h-[1px] w-1.5 bg-white" />
                          </div>
                       </th>
                       <th className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Name <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Job Title <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Type <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Submit Date <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Period <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Duration <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Reason <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Status <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[#E5E6E6]">
                    {leaveActivity.map((e, i) => (
                      <tr key={i} className={cn("hover:bg-[#F7F7F7]/50 transition-colors group", i === 2 ? "bg-[#F8FCF3]" : "bg-white")}>
                        <td className="px-6 py-3">
                           <div className={cn("h-3 w-3 rounded-[3px] border", i===2 ? "bg-brand border-brand flex items-center justify-center" : "bg-[#F7F7F7] border-[#E5E6E6]")}>
                              {i===2 && <div className="h-[1px] w-1.5 bg-white" />}
                           </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                           <div className="flex items-center gap-3">
                              <img src={e.avatar} className="h-8 w-8 rounded-full object-cover shadow-sm bg-brand" />
                              <div className="flex flex-col">
                                 <span className="text-[11px] font-bold text-[#203430] leading-none whitespace-nowrap">{e.name}</span>
                                 <span className="text-[10px] text-[#63716E] mt-1 uppercase font-bold">{e.id}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-3">
                           <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-[#203430] leading-none whitespace-nowrap">{e.role}</span>
                              <span className="text-[10px] text-[#63716E] mt-1 font-bold whitespace-nowrap">{e.dept}</span>
                           </div>
                        </td>
                        <td className="px-6 py-3 text-[11px] font-bold text-[#203430]">{e.type}</td>
                        <td className="px-6 py-3 text-[11px] font-bold text-[#63716E]">{e.submit}</td>
                        <td className="px-6 py-3 text-[11px] font-bold text-[#203430]">{e.period}</td>
                        <td className="px-6 py-3 text-[11px] font-bold text-[#203430]">{e.duration}</td>
                        <td className="px-6 py-3">
                           <div className="min-w-[120px] max-w-[200px] p-2 bg-[#F7F7F7] rounded-[4px]">
                              <span className="text-[10px] text-[#203430]">{e.reason}</span>
                           </div>
                        </td>
                        <td className="px-6 py-3">
                           {e.status === 'Approved' ? (
                             <div className="flex items-center gap-1 bg-brand px-2 py-1 rounded-[12px] w-fit">
                                <CheckCircle className="h-3 w-3 text-white" />
                                <span className="text-[11px] text-white">Approved</span>
                             </div>
                           ) : e.status === 'Rejected' ? (
                             <div className="flex items-center gap-1 bg-[#E63D4B] px-2 py-1 rounded-[12px] w-fit">
                                <X className="h-3 w-3 text-white" />
                                <span className="text-[11px] text-white">Rejected</span>
                             </div>
                           ) : (
                             <div className="flex items-center gap-1">
                                <button className="flex items-center gap-1 bg-[#E4F2D3] px-2 py-1 rounded-[12px] hover:bg-brand group/btn transition-all">
                                   <CheckCircle className="h-3 w-3 text-[#203430] group-hover/btn:text-white" />
                                   <span className="text-[11px] text-[#203430] group-hover/btn:text-white">Approve</span>
                                </button>
                                <button className="p-1 bg-[#E4F2D3] rounded-full hover:bg-[#E63D4B] group/btn2 transition-all">
                                   <X className="h-3 w-3 text-[#203430] group-hover/btn2:text-white" />
                                </button>
                             </div>
                           )}
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
                 <a key={l} href="#" className="text-[12px] text-[#63716E] hover:text-brand transition-colors whitespace-nowrap">{l}</a>
               ))}
            </div>
         </div>
      </footer>
    </AppLayout>
  );
}

const PIN_COLORS_MAP: Record<number, string> = {
  0: '#0E4D41',
  1: '#35BFA3',
  2: '#E4F2D3',
  3: '#E5E6E6'
};
