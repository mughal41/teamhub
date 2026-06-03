import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card, Badge } from "../components/ui/LayoutAddons";
import { 
  Users, 
  Calendar as CalendarIcon, 
  UserCheck, 
  UserPlus, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Star,
  Monitor,
  Phone,
  Video,
  ListTodo,
  CheckSquare,
  Square,
  MessageSquare
} from "lucide-react";
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { cn } from "@/src/lib/utils";

const attendanceData = [
  { day: 'Mon', onTime: 80, late: 12, leave: 5, absent: 3 },
  { day: 'Tue', onTime: 75, late: 15, leave: 7, absent: 3 },
  { day: 'Wed', onTime: 82, late: 10, leave: 6, absent: 2 },
  { day: 'Thu', onTime: 70, late: 20, leave: 5, absent: 5 },
  { day: 'Fri', onTime: 85, late: 8, leave: 4, absent: 3 },
];

const teamPerfData = [
  { name: 'Jan', value: 65, active: false },
  { name: 'Feb', value: 72, active: false },
  { name: 'Mar', value: 68, active: false },
  { name: 'Apr', value: 85, active: false },
  { name: 'May', value: 95.2, active: true },
  { name: 'Jun', value: 75, active: false },
];

const attendanceList = [
  { name: 'Olivia Mason', id: 'EMP-0234', job: 'Marketing', dept: 'Executive Marketing', date: '19 Jun 2035', in: '08:55 AM', out: '05:05 PM', status: 'On-Time', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
  { name: 'Ethan Ray', id: 'EMP-0178', job: 'UI Designer', dept: 'Product Design', date: '19 Jun 2035', in: '09:14 AM', out: '05:20 PM', status: 'Late', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
  { name: 'Lina Armand', id: 'EMP-0312', job: 'Lab Analyst', dept: 'R&D', date: '19 Jun 2035', in: '--', out: '--', status: 'On Leave', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
  { name: 'Jacob Yuen', id: 'EMP-0115', job: 'Site Supervisor', dept: 'Operations', date: '19 Jun 2035', in: '--', out: '--', status: 'Absent', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
  { name: 'Mia Torres', id: 'EMP-0289', job: 'HR Officer', dept: 'Human Resources', date: '19 Jun 2035', in: '08:59 AM', out: '05:10 PM', status: 'On-Time', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
];

const schedules = [
  { time: '09:00 AM', title: 'Interview – Product Designer Candidate', category: 'Talent Acquisition', location: 'Meeting Room C', type: 'interview', users: ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2', 'https://i.pravatar.cc/150?u=3'], extra: '+3' },
  { time: '01:00 PM', title: 'Mid-Year Performance Review – Design Dept', category: 'Employee Development', location: 'Notion Review Sheet', type: 'review', users: ['https://i.pravatar.cc/150?u=4', 'https://i.pravatar.cc/150?u=5', 'https://i.pravatar.cc/150?u=6'], extra: '+21' },
  { time: '03:00 PM', title: 'Quarterly Policy Review Meeting', category: 'Workplace Engagement', location: 'Conference Room 1A', type: 'meeting', users: ['https://i.pravatar.cc/150?u=7', 'https://i.pravatar.cc/150?u=8', 'https://i.pravatar.cc/150?u=9'], extra: '+2' },
];

const taskList = [
  { title: 'Complete pre-session survey for Leadership Track session', category: 'Employee Development', date: '26 June 2035', completed: false },
  { title: 'Join Remote Work Compliance Briefing', category: 'Workplace Engagement', date: '24 June 2035', completed: false },
  { title: 'Prepare Q3 recruitment planning materials', category: 'Talent Acquisition', date: '23 June 2035', completed: true },
];

const recentActivities = [
  { name: 'Mia Torres', action: 'approved 2 pending leave requests', time: '10:32 AM', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
  { name: 'Ethan Ray', action: 'updated his emergency contact details', time: '09:45 AM', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
  { name: 'Jacob Yuen', action: 'marked absent automatically due to no check-in', time: '09:15 AM', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
];

const satisfactionSub = [
  { label: 'Compensation & Benefits', score: '4.5/5', percentage: 78 },
  { label: 'Work Culture', score: '4.3/5', percentage: 74 },
  { label: 'Work-Life Balance', score: '4.1/5', percentage: 71 },
  { label: 'Career Growth Opportunities', score: '3.9/5', percentage: 68 },
];

export default function DashboardPage() {
  const [pendingPayrolls, setPendingPayrolls] = React.useState([
    { id: 'PAY-104', name: 'Lina Armand', role: 'Lab Analyst', dept: 'R&D', amount: '$3,450', reason: 'Basic Salary + $250 Allowance', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
    { id: 'PAY-105', name: 'Ethan Ray', role: 'UI Designer', dept: 'Product Design', amount: '$4,120', reason: 'Basic Salary + $180 Overtime', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
    { id: 'PAY-106', name: 'Jacob Yuen', role: 'Site Supervisor', dept: 'Operations', amount: '$3,890', reason: 'Basic Salary', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
  ]);
  const [approvedCount, setApprovedCount] = React.useState(14);
  const [toastText, setToastText] = React.useState<string | null>(null);
  const [perfMenuOpen, setPerfMenuOpen] = React.useState(false);
  const [payrollMenuOpen, setPayrollMenuOpen] = React.useState(false);

  const handleApprovePayroll = (id: string, name: string) => {
    setPendingPayrolls(prev => prev.filter(p => p.id !== id));
    setApprovedCount(prev => prev + 1);
    setToastText(`Successfully approved payroll case for ${name}!`);
    setTimeout(() => {
      setToastText(null);
    }, 3000);
  };

  return (
    <AppLayout 
      title="Dashboard" 
      breadcrumbs={[]}
    >
      <div className="space-y-6">
        <div>
           <p className="text-[14px] text-[#63716E]">Hello Davis!</p>
           <h1 className="text-[20px] font-bold text-[#203430]">Good Morning</h1>
        </div>

        {/* Top Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
           {[
             { label: 'Total Employees', val: '128', sub: "You're part of a growing team!", subColor: "text-[#0E4D41]", bgColor: "bg-white" },
             { label: 'Attendance', val: '92%', trend: '+1.54%', items: "3 Days Off, 1 Late Arrival", sub: "Your attendance this month is looking solid", subColor: "text-[#0E4D41]", bgColor: "bg-white" },
             { label: 'Leave Requests', val: '1', items: "1 Approved, 1 Pending Review", sub: "You've submitted 2 leave requests this month", subColor: "text-[#0E4D41]", bgColor: "bg-white" },
             { label: 'Job Applicants', val: '+12%', sub: "Your team has 37 new applicants", subColor: "text-[#0E4D41]", bgColor: "bg-white" },
           ].map(stat => (
             <Card key={stat.label} className={cn("p-4 border-none rounded-[16px] shadow-sm flex flex-col justify-between", stat.bgColor)}>
                <div className="space-y-3">
                   <div className="flex items-center justify-between">
                      <span className="text-[14px] text-[#63716E]">{stat.label}</span>
                      <button><MoreHorizontal className="h-4 w-4 text-[#A4ACAB]" /></button>
                   </div>
                   <div className="flex items-baseline gap-2">
                      <span className="text-[28px] font-bold text-[#203430] leading-none">{stat.val}</span>
                      {stat.trend && (
                        <div className="flex items-center gap-1">
                           <span className="text-[11px] font-bold text-[#35BFA3]">{stat.trend}</span>
                        </div>
                      )}
                      {stat.label === 'Attendance' && <span className="text-[10px] text-[#63716E]">Present</span>}
                      {stat.items && <span className="text-[10px] text-[#63716E]"> – {stat.items}</span>}
                   </div>
                </div>
                <div className="mt-4 bg-[#E4F2D3]/30 p-2 rounded-[8px]">
                   <p className="text-[11px] font-medium text-[#63716E] leading-tight">{stat.sub}</p>
                </div>
             </Card>
           ))}
        </div>

        {/* Triple Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
           
           {/* Column 1: Calendar & Schedules (3/12) */}
           <div className="lg:col-span-3 space-y-5">
              <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1 group cursor-pointer">
                       <span className="text-[18px] font-bold text-[#203430]">June 2035</span>
                       <ChevronDown className="h-4 w-4 text-[#63716E]" />
                    </div>
                    <div className="flex gap-2">
                       <button className="h-8 w-8 flex items-center justify-center bg-[#F7F7F7] rounded-[8px] text-[#63716E] hover:bg-brand hover:text-white transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                       <button className="h-8 w-8 flex items-center justify-center bg-[#F7F7F7] rounded-[8px] text-[#63716E] hover:bg-brand hover:text-white transition-colors"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                 </div>
                 <div className="grid grid-cols-7 gap-y-2 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                       <span key={`${d}-${i}`} className="text-[12px] font-bold text-[#63716E] mb-2">{d}</span>
                    ))}
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                       const isSelected = day === 21;
                       const isPublic = [1, 4, 14, 25, 29].includes(day);
                       const isToday = day === 20;
                       return (
                        <div key={day} className="h-8 w-8 mx-auto flex items-center justify-center relative">
                           <div className={cn(
                             "h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-medium transition-all group cursor-pointer",
                             isSelected ? "bg-[#203430] text-white shadow-lg" : 
                             isToday ? "bg-brand text-white" :
                             isPublic ? "bg-[#E4F2D3] text-[#0E4D41]" : "text-[#203430] hover:bg-[#F7F7F7]"
                           )}>
                              {day}
                           </div>
                        </div>
                       );
                    })}
                 </div>
              </Card>

              <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[16px] font-bold text-[#203430]">Schedules</h3>
                    <button className="flex items-center gap-2 bg-[#E4F2D3] px-2 py-1 rounded-[6px] text-[11px] font-bold text-[#203430]">
                       <CalendarIcon className="h-3 w-3" /> 21 Jun <ChevronDown className="h-3 w-3" />
                    </button>
                 </div>
                 <div className="space-y-4">
                    {schedules.map((s, idx) => (
                       <div key={idx} className="space-y-2">
                          <p className="text-[10px] font-bold text-brand uppercase tracking-wider">{s.category}</p>
                          <h4 className="text-[13px] font-bold text-[#203430] leading-tight">{s.title}</h4>
                          <div className="flex items-center justify-between pt-1">
                             <div className="flex items-center gap-2">
                                <div className="bg-[#E4F2D3] px-2 py-1 rounded-[6px]">
                                   <span className="text-[10px] font-bold text-[#0E4D41]">{s.location}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-[#63716E]">
                                   <Clock className="h-3 w-3" /> {s.time}
                                </div>
                             </div>
                             <div className="flex -space-x-2">
                                {s.users.map((u, i) => (
                                   <img key={i} src={u} className="h-5 w-5 rounded-full border border-white" />
                                ))}
                                <div className="h-5 w-5 rounded-full bg-[#0E4D41] border border-white flex items-center justify-center">
                                   <span className="text-[8px] text-white">{s.extra}</span>
                                </div>
                             </div>
                          </div>
                          {idx !== schedules.length - 1 && <div className="h-px bg-[#E5E6E6] mt-4" />}
                       </div>
                    ))}
                 </div>
              </Card>

              {/* Performance Reviews Pending & Approved Tracker */}
              <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col">
                 <div className="flex items-center justify-between mb-4 relative">
                    <div>
                       <h3 className="text-[16px] font-bold text-[#203430]">Performance Reviews</h3>
                       <span className="text-[10px] uppercase font-black tracking-wider text-brand">Assigned to Me</span>
                    </div>
                    <div className="relative">
                       <button 
                          onClick={() => setPerfMenuOpen(!perfMenuOpen)}
                          className="p-1 px-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
                          aria-label="Options"
                       >
                          <MoreHorizontal className="h-4 w-4 text-[#A4ACAB]" />
                       </button>
                       {perfMenuOpen && (
                          <>
                             <div className="fixed inset-0 z-[199]" onClick={() => setPerfMenuOpen(false)} />
                             <div className="absolute right-0 top-7 z-[200] w-48 bg-white rounded-xl shadow-lg border border-[#E5E6E6] py-1.5 animate-in fade-in duration-100">
                                <button 
                                   onClick={() => {
                                      setPerfMenuOpen(false);
                                      setToastText("Opening all Performance Reviews...");
                                      setTimeout(() => setToastText(null), 3000);
                                   }}
                                   className="w-full text-left px-4 py-2 text-[12px] text-[#203430] hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                                >
                                   View All Reviews
                                </button>
                                <button 
                                   onClick={() => {
                                      setPerfMenuOpen(false);
                                      setToastText("Initiated performance audit CSV export!");
                                      setTimeout(() => setToastText(null), 3000);
                                   }}
                                   className="w-full text-left px-4 py-2 text-[12px] text-[#203430] hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                                >
                                   Export Records
                                </button>
                                <button 
                                   onClick={() => {
                                      setPerfMenuOpen(false);
                                      setToastText("Metrics successfully synced with HR engine.");
                                      setTimeout(() => setToastText(null), 3000);
                                   }}
                                   className="w-full text-[12px] text-left px-4 py-2 text-[#203430] hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                                >
                                   Sync Metrics
                                </button>
                             </div>
                          </>
                       )}
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-2 mb-4 bg-[#F7F7F7] p-2.5 rounded-[12px]">
                    <div className="text-center">
                       <p className="text-[10px] text-[#63716E] font-medium leading-none">Assigned</p>
                       <p className="text-[16px] font-bold text-[#203430] mt-1.5">6</p>
                    </div>
                    <div className="text-center border-x border-[#E5E6E6]">
                       <p className="text-[10px] text-amber-600 font-medium leading-none">Pending</p>
                       <p className="text-[16px] font-bold text-amber-600 mt-1.5">2</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] text-[#35BFA3] font-medium leading-none">Approved</p>
                       <p className="text-[16px] font-bold text-[#35BFA3] mt-1.5">4</p>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <p className="text-[11px] font-black uppercase text-[#63716E] tracking-wider mb-1">Pending Feedback Action</p>
                    
                    <div className="flex items-center justify-between p-2 rounded-[8px] bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-colors">
                       <div className="flex items-center gap-2">
                          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" className="h-[28px] w-[28px] rounded-full object-cover shrink-0" alt="Olivia" />
                          <div>
                             <p className="text-[12px] font-bold text-[#203430] leading-none">Olivia Mason</p>
                             <p className="text-[10px] text-[#63716E] mt-0.5 font-medium leading-none">Quarterly Audit</p>
                          </div>
                       </div>
                       <span className="text-[10px] bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full font-bold">Today</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-[8px] bg-[#E4F2D3]/25 border border-[#E4F2D3] hover:bg-[#E4F2D3]/40 transition-colors">
                       <div className="flex items-center gap-2">
                          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" className="h-[28px] w-[28px] rounded-full object-cover shrink-0" alt="Ethan" />
                          <div>
                             <p className="text-[12px] font-bold text-[#203430] leading-none">Ethan Ray</p>
                             <p className="text-[10px] text-[#63716E] mt-0.5 font-medium leading-none">Monthly touchpoint</p>
                          </div>
                       </div>
                       <span className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full font-bold">2 days</span>
                    </div>
                 </div>
              </Card>
           </div>

           {/* Column 2: Charts & Large Stats & List (6/12) */}
           <div className="lg:col-span-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="text-[14px] font-bold text-[#203430]">Attendance Report</h3>
                       <button className="flex items-center gap-2 bg-[#F7F7F7] px-2 py-1 rounded-[6px] text-[11px] font-medium text-[#203430]">
                          This Month <ChevronDown className="h-3 w-3" />
                       </button>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                       <span className="text-[24px] font-bold text-[#203430]">92%</span>
                       <div className="flex items-center gap-1 bg-[#E4F2D3] px-1.5 py-0.5 rounded-[4px]">
                          <TrendingUp className="h-3 w-3 text-[#35BFA3]" />
                          <span className="text-[10px] font-bold text-[#0E4D41]">+1.54%</span>
                       </div>
                    </div>
                    <div className="h-[140px] w-full mt-2">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={attendanceData} barGap={4}>
                             <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#63716E' }} dy={10} />
                             <Bar dataKey="onTime" fill="#0E4D41" radius={[4, 4, 0, 0]} />
                             <Bar dataKey="late" fill="#35BFA3" radius={[4, 4, 0, 0]} />
                             <Bar dataKey="leave" fill="#E4F2D3" radius={[4, 4, 0, 0]} />
                             <Bar dataKey="absent" fill="#E5E6E6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                 </Card>

                 <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                       <h3 className="text-[14px] font-bold text-[#203430]">Employee Satisfaction</h3>
                       <button><MoreHorizontal className="h-4 w-4 text-[#A4ACAB]" /></button>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center relative">
                       <div className="relative h-[120px] w-full flex items-center justify-center">
                          <PieChart width={200} height={120}>
                             <Pie
                               data={[{ value: 73 }, { value: 27 }]}
                               cx="50%"
                               cy="100%"
                               startAngle={180}
                               endAngle={0}
                               innerRadius={60}
                               outerRadius={80}
                               paddingAngle={0}
                               dataKey="value"
                             >
                                <Cell fill="#35BFA3" />
                                <Cell fill="#E4F2D3" />
                             </Pie>
                          </PieChart>
                          <div className="absolute bottom-0 flex flex-col items-center">
                             <span className="text-[24px] font-bold text-[#203430]">73%</span>
                             <span className="text-[10px] text-[#63716E]">Employee Satisfied</span>
                          </div>
                       </div>
                       <div className="mt-2 flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                             <Star key={i} className={cn("h-3.5 w-3.5", i < 4 ? "fill-[#F8C947] text-[#F8C947]" : "text-[#E5E6E6] fill-[#E5E6E6]")} />
                          ))}
                          <span className="text-[11px] font-bold text-[#203430] ml-1">4.2/5</span>
                       </div>
                       <div className="mt-4 w-full bg-[#E4F2D3] p-1.5 rounded-[8px] text-center">
                          <p className="text-[10px] text-[#63716E]">That's an <span className="font-bold text-[#0E4D41]">increase of 6%</span> from last month</p>
                       </div>
                    </div>
                    <div className="mt-4 space-y-2">
                       {satisfactionSub.map(s => (
                          <div key={s.label} className="flex items-center justify-between">
                             <span className="text-[10px] text-[#63716E]">{s.label}</span>
                             <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                   <Star className="h-2.5 w-2.5 fill-[#F8C947] text-[#F8C947]" />
                                   <Star className="h-2.5 w-2.5 fill-[#F8C947] text-[#F8C947]" />
                                   <Star className="h-2.5 w-2.5 fill-[#F8C947] text-[#F8C947]" />
                                </div>
                                <span className="text-[10px] font-bold text-[#203430]">{s.score}</span>
                             </div>
                          </div>
                       ))}
                    </div>
                 </Card>
              </div>

              <Card className="p-0 border-none rounded-[16px] bg-white shadow-sm overflow-hidden flex flex-col">
                 <div className="p-4 flex items-center justify-between border-b border-[#E5E6E6]">
                    <h3 className="text-[16px] font-bold text-[#203430]">Employee Attendance</h3>
                    <button className="flex items-center gap-2 bg-[#F7F7F7] px-2 py-1 rounded-[6px] text-[11px] font-medium text-[#203430]">
                       This Month <ChevronDown className="h-3 w-3" />
                    </button>
                 </div>
                 <div className="flex p-4 gap-8">
                    <div className="flex items-baseline gap-2">
                       <span className="text-[28px] font-bold text-[#203430]">82</span>
                       <span className="text-[11px] text-[#63716E]">On-Time</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                       <span className="text-[28px] font-bold text-[#203430]">11</span>
                       <span className="text-[11px] text-[#63716E]">Late</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                       <span className="text-[28px] font-bold text-[#203430]">6</span>
                       <span className="text-[11px] text-[#63716E]">On Leave</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                       <span className="text-[28px] font-bold text-[#203430]">3</span>
                       <span className="text-[11px] text-[#63716E]">Absent</span>
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-[#F7F7F7]">
                          <tr className="text-[10px] font-black text-[#63716E] uppercase">
                             <th className="px-4 py-2">Name</th>
                             <th className="px-4 py-2">Job Title</th>
                             <th className="px-4 py-2">Date</th>
                             <th className="px-4 py-2 text-center whitespace-nowrap">Check In</th>
                             <th className="px-4 py-2 text-center whitespace-nowrap">Check Out</th>
                             <th className="px-4 py-2 text-right">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-[#E5E6E6]">
                          {attendanceList.map((a, i) => (
                             <tr key={i} className="hover:bg-[#F7F7F7]/50 transition-colors h-[54px]">
                                <td className="px-4 py-2">
                                   <div className="flex items-center gap-2">
                                      <img src={a.avatar} className="h-8 w-8 rounded-full object-cover" />
                                      <div className="flex flex-col">
                                         <span className="text-[11px] font-bold text-[#203430] leading-none">{a.name}</span>
                                         <span className="text-[10px] text-[#63716E] mt-1">{a.id}</span>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-4 py-2">
                                   <div className="flex flex-col">
                                      <span className="text-[11px] font-bold text-[#203430] leading-none">{a.job}</span>
                                      <span className="text-[10px] text-[#63716E] mt-1">{a.dept}</span>
                                   </div>
                                </td>
                                <td className="px-4 py-2 text-[11px] font-bold text-[#203430]">{a.date}</td>
                                <td className="px-4 py-2 text-[11px] font-bold text-[#203430] text-center">{a.in}</td>
                                <td className="px-4 py-2 text-[11px] font-bold text-[#203430] text-center">{a.out}</td>
                                <td className="px-4 py-2 text-right">
                                   <div className={cn(
                                     "inline-flex items-center px-2 py-1 rounded-[12px] text-[10px] font-bold",
                                     a.status === 'On-Time' ? "bg-[#E4F2D3] text-[#35BFA3]" :
                                     a.status === 'Late' ? "bg-[#FFEFEF] text-[#E63D4B]" :
                                     a.status === 'On Leave' ? "bg-[#F7F7F7] text-[#63716E]" : "bg-[#203430] text-white"
                                   )}>
                                      {a.status}
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
               </Card>

               {/* Employee Payroll Approvals Pending Cases */}
               <Card className="p-0 border-none rounded-[16px] bg-white shadow-sm overflow-hidden flex flex-col mb-5">
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E6E6]">
                     <div>
                        <h3 className="text-[16px] font-bold text-[#203430]">Payroll Approvals Queue</h3>
                        <p className="text-[11px] text-[#63716E] mt-0.5 font-medium">Authorizations assigned to you for monthly payroll release</p>
                     </div>
                     <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                        <Badge className="bg-[#FFEFEF] text-[#E63D4B] font-bold border-none text-[11px] w-fit">
                           {pendingPayrolls.length} Pending Approval
                        </Badge>
                        <div className="relative">
                           <button 
                              type="button"
                              onClick={() => setPayrollMenuOpen(!payrollMenuOpen)}
                              className="p-1 px-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
                              aria-label="Payroll options"
                           >
                              <MoreHorizontal className="h-4 w-4 text-[#A4ACAB]" />
                           </button>
                           {payrollMenuOpen && (
                              <>
                                 <div className="fixed inset-0 z-[199]" onClick={() => setPayrollMenuOpen(false)} />
                                 <div className="absolute right-0 top-7 z-[200] w-48 bg-white rounded-xl shadow-lg border border-[#E5E6E6] py-1.5 text-left animate-in fade-in duration-100">
                                    <button 
                                       type="button"
                                       onClick={() => {
                                          setPayrollMenuOpen(false);
                                          setToastText("Opening all payroll statements...");
                                          setTimeout(() => setToastText(null), 3000);
                                       }}
                                       className="w-full text-left px-4 py-2 text-[12px] text-[#203430] hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                                    >
                                       View All Payrolls
                                    </button>
                                    <button 
                                       type="button"
                                       onClick={() => {
                                          setPayrollMenuOpen(false);
                                          setToastText("Initiated export of payroll register CSV!");
                                          setTimeout(() => setToastText(null), 3000);
                                        }}
                                        className="w-full text-left px-4 py-2 text-[12px] text-[#203430] hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                                    >
                                       Export Ledger
                                    </button>
                                    <button 
                                       type="button"
                                       onClick={() => {
                                          setPayrollMenuOpen(false);
                                          setToastText("Payroll authorization queue reloaded.");
                                          setTimeout(() => setToastText(null), 3000);
                                        }}
                                        className="w-full text-left px-4 py-2 text-[12px] text-[#203430] hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                                    >
                                       Refresh Queue
                                    </button>
                                 </div>
                              </>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="p-4 bg-[#F7F7F7]/50 flex flex-wrap gap-4 items-center justify-between border-b border-[#E5E6E6]">
                     <div className="flex gap-6">
                        <div className="flex items-baseline gap-1">
                           <span className="text-[20px] font-bold text-[#203430]">{pendingPayrolls.length}</span>
                           <span className="text-[10px] text-[#63716E] font-semibold">Cases Required</span>
                        </div>
                        <div className="flex items-baseline gap-1 border-l border-[#E5E6E6] pl-6">
                           <span className="text-[20px] font-bold text-[#35BFA3]">{approvedCount}</span>
                           <span className="text-[10px] text-[#63716E] font-semibold">Approved (Month)</span>
                        </div>
                     </div>
                     <div className="text-[11px] font-black uppercase tracking-wider bg-[#E4F2D3]/40 text-[#0E4D41] px-2.5 py-1 rounded-[6px]">
                        Target Date: 5th June
                     </div>
                  </div>

                  <div className="divide-y divide-[#E5E6E6]">
                     {pendingPayrolls.length === 0 && (
                        <div className="p-8 text-center text-[#63716E] space-y-2">
                           <CheckCircle2 className="h-8 w-8 text-[#35BFA3] mx-auto" />
                           <h4 className="font-bold text-[14px] text-[#203430]">All Payroll Instances Signed Off</h4>
                           <p className="text-[11px] max-w-sm mx-auto font-medium">You have completed all pending payroll approvals for this development cycle.</p>
                        </div>
                     )}
                     {pendingPayrolls.length > 0 && pendingPayrolls.map((payroll) => (
                        <div key={payroll.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F7F7F7]/20 transition-colors">
                           <div className="flex items-center gap-3">
                              <img src={payroll.avatar} className="h-10 w-10 rounded-full object-cover shrink-0" alt={payroll.name} />
                              <div>
                                 <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[12px] font-bold text-[#203430]">{payroll.name}</span>
                                    <span className="text-[10px] bg-slate-150 text-slate-600 px-1.5 py-0.5 rounded font-black tracking-wider uppercase text-[8px]">
                                       {payroll.id}
                                    </span>
                                 </div>
                                 <p className="text-[10px] text-[#63716E] mt-0.5 font-semibold">
                                    {payroll.role} • {payroll.dept}
                                 </p>
                                 <p className="text-[10px] text-[#A4ACAB] mt-1 font-medium">{payroll.reason}</p>
                              </div>
                           </div>

                           <div className="flex items-center gap-4 justify-between sm:justify-start">
                              <div className="text-left sm:text-right">
                                 <p className="text-[10px] text-[#63716E] font-medium leading-none">Net Amount</p>
                                 <p className="text-[14px] font-black text-[#203430] mt-1">{payroll.amount}</p>
                              </div>
                              <button 
                                 type="button"
                                 onClick={() => handleApprovePayroll(payroll.id, payroll.name)}
                                 className="bg-[#006b5f] hover:bg-[#005047] text-white font-black text-[11px] px-3.5 py-2 rounded-[8px] transition-all shadow-sm active:scale-95 cursor-pointer h-9 flex items-center justify-center whitespace-nowrap"
                              >
                                 Approve Instance
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </Card>
            </div>

            {/* Column 3: Performance, Resources & Activities (3/12) */}
           <div className="lg:col-span-3 space-y-5">
              <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] font-bold text-[#203430]">Team Performance</h3>
                    <button className="flex items-center gap-2 bg-[#F7F7F7] px-2 py-1 rounded-[6px] text-[11px] font-medium text-[#203430]">
                       Last 6 Months <ChevronDown className="h-3 w-3" />
                    </button>
                 </div>
                 <div className="mb-4">
                    <span className="text-[24px] font-bold text-[#203430]">89.52%</span>
                    <div className="flex items-center gap-1">
                       <TrendingUp className="h-3.5 w-3.5 text-[#35BFA3]" />
                       <span className="text-[11px] font-bold text-[#35BFA3]">+3.84%</span>
                       <span className="text-[10px] text-[#63716E]">increased vs last week</span>
                    </div>
                 </div>
                 <div className="h-[120px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={teamPerfData}>
                          <defs>
                             <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#35BFA3" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#35BFA3" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="value" stroke="#35BFA3" strokeWidth={2} fillOpacity={1} fill="url(#colorPerf)" />
                       </AreaChart>
                    </ResponsiveContainer>
                    {/* Tooltip Overlay */}
                    <div className="absolute right-4 top-2 bg-white px-2 py-1 rounded-[6px] shadow-lg border border-[#E5E6E6] flex flex-col items-center">
                       <span className="text-[8px] text-[#63716E]">May 2035</span>
                       <span className="text-[11px] font-bold text-[#203430]">95.2%</span>
                       <div className="absolute bottom-[-10px] w-1 h-12 bg-[#D1D5DB]/30 -z-10" />
                    </div>
                 </div>
                 <div className="mt-4 flex items-center justify-between">
                    {['0%', '25%', '50%', '75%', '100%'].map(v => (
                       <span key={v} className="text-[9px] text-[#63716E]">{v}</span>
                    ))}
                 </div>
              </Card>

              <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] font-bold text-[#203430]">Employment Status</h3>
                    <button><MoreHorizontal className="h-4 w-4 text-[#A4ACAB]" /></button>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                       <span className="text-[24px] font-bold text-[#203430]">128</span>
                       <span className="text-[11px] text-[#63716E]">Employees</span>
                    </div>
                    <div className="h-2.5 w-full flex bg-[#F7F7F7] rounded-full overflow-hidden">
                       <div className="h-full bg-[#0E4D41]" style={{ width: '68%' }} />
                       <div className="h-full bg-[#35BFA3]" style={{ width: '15%' }} />
                       <div className="h-full bg-[#E4F2D3]" style={{ width: '10%' }} />
                       <div className="h-full bg-[#E5E6E6]" style={{ width: '7%' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       {[
                         { label: 'Full-Time', val: '68%', emp: '87 Employees', color: 'bg-[#0E4D41]' },
                         { label: 'Part-Time', val: '15%', emp: '19 Employees', color: 'bg-[#35BFA3]' },
                         { label: 'Freelance', val: '10%', emp: '13 Employees', color: 'bg-[#E4F2D3]' },
                         { label: 'Internship', val: '7%', emp: '9 Employees', color: 'bg-[#E5E6E6]' },
                       ].map(item => (
                         <div key={item.label} className="space-y-1">
                            <div className="flex items-center gap-1.5">
                               <div className={cn("h-2 w-2 rounded-full", item.color)} />
                               <span className="text-[11px] font-bold text-[#203430]">{item.label}</span>
                            </div>
                            <p className="text-[9px] text-[#63716E]"><span className="font-bold">{item.val}</span> – {item.emp}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </Card>

              <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] font-bold text-[#203430]">Tasks</h3>
                    <button><MoreHorizontal className="h-4 w-4 text-[#A4ACAB]" /></button>
                 </div>
                 <div className="space-y-4">
                    {taskList.map((task, i) => (
                       <div key={i} className="flex gap-3 items-start">
                          <button className={cn("mt-1 flex-shrink-0 transition-colors", task.completed ? "text-brand" : "text-[#E5E6E6]")}>
                             {task.completed ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                          </button>
                          <div className="space-y-2">
                             <p className={cn("text-[12px] leading-tight", task.completed ? "text-[#A4ACAB] line-through" : "text-[#203430]")}>
                                {task.title}
                             </p>
                             <div className="flex items-center gap-2">
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-[9px] font-bold",
                                  task.category === 'Employee Development' ? "bg-[#FFEFEF] text-[#E63D4B]" :
                                  task.category === 'Workplace Engagement' ? "bg-[#F7F7F7] text-[#63716E]" : "bg-[#E4F2D3] text-[#0E4D41]"
                                )}>{task.category}</span>
                                <span className="text-[9px] text-[#63716E]">{task.date}</span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </Card>

              <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] font-bold text-[#203430]">Recent Activities</h3>
                    <button><MoreHorizontal className="h-4 w-4 text-[#A4ACAB]" /></button>
                 </div>
                 <div className="space-y-6">
                    {recentActivities.map((activity, i) => (
                       <div key={i} className="flex gap-3">
                          <img src={activity.avatar} className="h-8 w-8 rounded-full shrink-0" />
                          <div className="space-y-1">
                             <p className="text-[11px] leading-snug">
                                <span className="font-bold text-[#203430]">{activity.name}</span> <span className="text-[#63716E]">{activity.action}</span>
                             </p>
                             <p className="text-[9px] text-[#A4ACAB] font-bold">19 June 2035 – {activity.time}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </Card>
           </div>
        </div>
      </div>

      <footer className="mt-10 py-8 border-t border-[#E5E6E6] flex items-center justify-between">
         <p className="text-[12px] font-bold text-[#203430]">Copyright © 2025 Peterdraw</p>
         <div className="flex gap-6">
            {['Privacy Policy', 'Term and conditions', 'Contact'].map(l => (
              <a key={l} href="#" className="text-[12px] text-[#63716E] hover:text-brand transition-colors">{l}</a>
            ))}
         </div>
      </footer>

      {/* Dynamic Approval Toast */}
      {toastText && (
         <div className="fixed bottom-6 right-6 z-[2000] bg-[#203430] text-white px-5 py-3.5 rounded-[12px] shadow-2xl flex items-center gap-3 border border-white/10 animate-[slideUp_0.3s_ease-out]">
            <div className="h-6 w-6 bg-[#35BFA3] rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
               ✓
            </div>
            <div className="space-y-0.5">
               <p className="text-[12px] font-bold leading-tight">{toastText}</p>
               <p className="text-[10px] text-[#A4ACAB]">The payroll authorization queue has updated dynamically.</p>
            </div>
         </div>
      )}
    </AppLayout>
  );
}
