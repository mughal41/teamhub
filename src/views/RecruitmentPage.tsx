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
  Briefcase,
  Monitor,
  Users,
  CheckCircle,
  X,
  FileText,
  MessageSquare,
  UserCheck,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  MapPin,
  Clock
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, LineChart, Line, Cell
} from "recharts";
import { cn } from "@/src/lib/utils";

const applicationData = [
  { month: 'Jan', count: 110 },
  { month: 'Feb', count: 100 },
  { month: 'Mar', count: 130 },
  { month: 'Apr', count: 115 },
  { month: 'May', count: 140 },
  { month: 'Jun', count: 145 },
];

const deptData = [
  { name: 'Human Resources', count: 19 },
  { name: 'Marketing', count: 27 },
  { name: 'Product Design', count: 31 },
  { name: 'R&D', count: 22 },
  { name: 'Operations', count: 28 },
  { name: 'Customer Service', count: 19 },
];

const resources = [
  { label: 'Job Portal', percentage: 57.5, val: 84 },
  { label: 'Company Website', percentage: 20.5, val: 30 },
  { label: 'Employee Referral', percentage: 15.1, val: 22 },
  { label: 'Social Media (LinkedIn)', percentage: 6.9, val: 10 },
];

const schedules = [
  { time: "09:45 AM", title: "Online Test Review", subtitle: "Lala Wijaya • Data Analyst", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { time: "01:00 PM", title: "First Interview", subtitle: "William Hartono • UI Designer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { time: "02:30 PM", title: "HR Interview", subtitle: "Arifin Maulana • Customer Support", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { time: "03:10 PM", title: "Final Interview", subtitle: "Fanny Rizal • Sales Manager", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
];

const applicants = [
  { name: "William Hartono", email: "william.hartono@email.com", job: "UI Designer", subJob: "Product Design", date: "15 Jun 2035", type: "Full-Time", model: "Remote", stage: 2, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Fanny Rizal", email: "fanny.rizal@email.com", job: "Sales Manager", subJob: "Operations", date: "12 Jun 2035", type: "Full-Time", model: "On-Site", stage: 3, avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Lala Wijaya", email: "lala.wijaya@email.com", job: "Data Analyst", subJob: "R&D", date: "14 Jun 2035", type: "Full-Time", model: "Hybrid", stage: 4, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Arifin Maulana", email: "arifin.maulana@email.com", job: "Customer Support", subJob: "Customer Service", date: "13 Jun 2035", type: "Full-Time", model: "On-Site", stage: 2, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Clara Mentari", email: "clara.mentari@email.com", job: "HR Assistant", subJob: "Human Resources", date: "10 Jun 2035", type: "Internship", model: "On-Site", stage: 1, avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
];

export default function RecruitmentPage() {
  return (
    <AppLayout 
      title="Recruitment" 
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Recruitment" }]}
    >
      <div className="space-y-5">
        {/* Top Summary Section */}
        <div className="flex flex-col xl:flex-row gap-5">
           <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Total Applicants Card */}
              <Card className="p-4 border-none rounded-[16px] bg-[#E4F2D3] shadow-sm flex flex-col justify-center relative overflow-hidden">
                 <div className="z-10">
                    <div className="bg-[#0E4D41] h-10 w-10 rounded-lg flex items-center justify-center mb-4 text-white">
                       <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                       <span className="text-[40px] font-bold text-[#203430] leading-none">146</span>
                       <div className="bg-brand px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <span className="text-[11px] font-bold text-white tracking-tighter">+8.2%</span>
                       </div>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[11px] text-[#63716E]">vs last month</span>
                       <span className="text-[11px] text-[#63716E] font-medium mt-2 uppercase tracking-wide">Total Applicants</span>
                    </div>
                 </div>
                 <div className="absolute right-[-10px] top-[-10px] opacity-10">
                    <Users className="h-32 w-32 text-[#0E4D41]" />
                 </div>
              </Card>

              {/* Interviewed Card */}
              <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-center">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-[#F7F7F7] flex items-center justify-center text-brand">
                       <MessageSquare className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] text-[#63716E]">Interviewed</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[40px] font-bold text-[#203430] leading-none">42</span>
                    <div className="bg-[#E4F2D3] px-2 py-1 rounded-[6px] flex flex-col items-center">
                       <span className="text-[12px] font-black text-[#0E4D41]">28.8%</span>
                       <span className="text-[8px] text-[#63716E] uppercase">of applicants</span>
                    </div>
                 </div>
              </Card>

              {/* Hired Card */}
              <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-center">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-[#F7F7F7] flex items-center justify-center text-brand">
                       <UserCheck className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] text-[#63716E]">Hired</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[40px] font-bold text-[#203430] leading-none">12</span>
                    <div className="bg-[#E4F2D3] px-2 py-1 rounded-[6px] flex flex-col items-center">
                       <span className="text-[12px] font-black text-[#0E4D41]">8.2%</span>
                       <span className="text-[8px] text-[#63716E] uppercase">of applicants</span>
                    </div>
                 </div>
              </Card>
           </div>

           {/* Application Line Chart */}
           <Card className="xl:w-[349px] p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[14px] font-bold text-[#203430]">Application</h3>
                 <button className="flex items-center gap-2 bg-[#F7F7F7] px-2 py-1 rounded-[6px] text-[11px] font-medium text-[#203430]">
                    Last 6 Months <ChevronDown className="h-3 w-3" />
                 </button>
              </div>
              <div className="flex-1 min-h-0">
                 <ResponsiveContainer width="100%" height={120}>
                    <AreaChart data={applicationData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                       <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#35BFA3" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#35BFA3" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 9, fill: '#63716E' }} 
                       />
                       <YAxis hide />
                       <Area type="monotone" dataKey="count" stroke="#35BFA3" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} dot={{ r: 3, fill: '#35BFA3', strokeWidth: 0 }} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>
        </div>

        {/* Second Row: Vacancies and Dept Distribution */}
        <div className="flex flex-col xl:flex-row gap-5">
           {/* Current Vacancies Grid */}
           <div className="flex-1 space-y-5">
              <div className="bg-white rounded-[16px] p-5 shadow-sm">
                 <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[16px] font-bold text-[#203430]">Current Vacancies</h2>
                    <button className="flex items-center gap-2 bg-[#E4F2D3] h-8 px-3 rounded-[8px] text-[12px] font-medium text-[#203430]">
                       <Filter className="h-4 w-4" /> Filter <ChevronDown className="h-3 w-3" />
                    </button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "UI Designer", type: "Full-Time", model: "Remote", applicants: 18, color: "text-[#0E4D41]" },
                      { title: "Sales Manager", type: "Full-Time", model: "On-Site", applicants: 15, color: "text-[#0E4D41]" },
                      { title: "HR Assistant", type: "Internship", model: "On-Site", applicants: 10, color: "text-[#0E4D41]" },
                      { title: "Data Analyst", type: "Full-Time", model: "Hybrid", applicants: 22, color: "text-[#0E4D41]" },
                    ].map(job => (
                      <div key={job.title} className="p-4 bg-[#F7F7F7] rounded-[12px] space-y-3">
                         <h3 className={cn("text-[14px] font-bold", job.color)}>{job.title}</h3>
                         <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1">
                               <Briefcase className="h-3.5 w-3.5 text-[#63716E]" />
                               <span className="text-[10px] text-[#63716E] font-medium">{job.type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                               <Monitor className="h-3.5 w-3.5 text-[#63716E]" />
                               <span className="text-[10px] text-[#63716E] font-medium">{job.model}</span>
                            </div>
                            <div className="flex items-center gap-1">
                               <Users className="h-3.5 w-3.5 text-[#63716E]" />
                               <span className="text-[10px] text-[#63716E] font-medium">{job.applicants}</span>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Application by Department Bar Chart */}
           <Card className="xl:w-[349px] p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-[14px] font-bold text-[#203430]">Application by Department</h3>
                 <button><MoreHorizontal className="h-4 w-4 text-[#63716E]" /></button>
              </div>
              <div className="flex-1 min-h-0">
                 <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={deptData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                       <XAxis 
                        hide
                       />
                       <Bar dataKey="count" fill="#35BFA3" radius={[4, 4, 0, 0]} barSize={25}>
                         {deptData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index === 2 ? '#35BFA3' : index === 4 ? '#0E4D41' : '#35BFA3'} opacity={index === 0 || index === 5 ? 0.6 : 1} />
                         ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
                 <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 justify-center">
                    {deptData.map(d => (
                       <div key={d.name} className="flex flex-col items-center">
                          <span className="text-[8px] text-[#63716E] text-center w-12 truncate">{d.name}</span>
                          <span className="text-[10px] font-bold text-[#203430]">{d.count}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </Card>
        </div>

        {/* Third Row: Main Content & Sidebar */}
        <div className="flex flex-col xl:flex-row gap-5">
           {/* Applicants Table Section */}
           <div className="flex-1 flex flex-col space-y-5">
              <Card className="border-none rounded-[16px] bg-white shadow-sm overflow-hidden p-0 flex flex-col min-h-[418px]">
                 <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-[#E5E6E6]">
                    <h2 className="text-[16px] font-bold text-[#203430]">Applicants</h2>
                    <div className="flex flex-wrap gap-1 p-1 bg-[#F7F7F7] rounded-[8px]">
                       {['All', 'Application Received', 'Interview Scheduled', 'Final Interview', 'Test Completed'].map(tab => (
                          <button 
                            key={tab} 
                            className={cn(
                              "px-3 py-1 text-[11px] font-black rounded-[6px] transition-all",
                              tab === 'All' ? "bg-brand text-white" : "text-[#757575] hover:text-[#203430]"
                            )}
                          >
                             {tab === 'All' ? 'All' : tab}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-[#F7F7F7]">
                          <tr>
                             <th className="px-5 py-3 w-10">
                                <div className="h-3 w-3 rounded-[3px] border border-brand bg-brand flex items-center justify-center">
                                   <div className="h-[1px] w-1.5 bg-white" />
                                </div>
                             </th>
                             <th className="px-5 py-3 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">Name <ArrowUpDown className="h-3 w-3 inline ml-1" /></th>
                             <th className="px-5 py-3 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">Job Title <ArrowUpDown className="h-3 w-3 inline ml-1" /></th>
                             <th className="px-5 py-3 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap text-center">Applied Date <ArrowUpDown className="h-3 w-3 inline ml-1" /></th>
                             <th className="px-5 py-3 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap text-center">Application Received <ArrowUpDown className="h-3 w-3 inline ml-1" /></th>
                             <th className="px-5 py-3 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap text-center">Status (Stage) <ArrowUpDown className="h-3 w-3 inline ml-1" /></th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-[#E5E6E6]">
                          {applicants.map((a, i) => (
                             <tr key={i} className={cn("hover:bg-[#F7F7F7]/50 transition-colors h-[60px]", a.name === 'Lala Wijaya' ? "bg-white" : "bg-white")}>
                                <td className="px-5 py-2">
                                   <div className={cn("h-3 w-3 rounded-[3px] border", a.name === 'Anya Rodriguez' ? "bg-brand border-brand flex items-center justify-center" : "bg-[#F7F7F7] border-[#E5E6E6]")}>
                                      {a.name === 'Anya Rodriguez' && <div className="h-[1px] w-1.5 bg-white" />}
                                   </div>
                                </td>
                                <td className="px-5 py-2">
                                   <div className="flex items-center gap-3">
                                      <img src={a.avatar} className="h-8 w-8 rounded-full border border-gray-100 object-cover" />
                                      <div className="flex flex-col">
                                         <span className="text-[11px] font-bold text-[#203430] leading-none">{a.name}</span>
                                         <span className="text-[10px] text-[#63716E] mt-1 font-medium">{a.email}</span>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-5 py-2">
                                   <div className="flex flex-col">
                                      <span className="text-[11px] font-bold text-[#203430] leading-none">{a.job}</span>
                                      <span className="text-[10px] text-[#63716E] mt-1 font-medium">{a.subJob}</span>
                                   </div>
                                </td>
                                <td className="px-5 py-2 text-center">
                                   <span className="text-[11px] font-bold text-[#203430]">{a.date}</span>
                                </td>
                                <td className="px-5 py-2">
                                   <div className="flex items-center justify-center gap-2">
                                      <span className="text-[11px] font-bold text-[#203430] whitespace-nowrap">{a.type}</span>
                                      <div className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                        a.model === 'Remote' ? "bg-[#F7F7F7] text-[#63716E]" : 
                                        a.model === 'Hybrid' ? "bg-[#E4F2D3] text-[#0E4D41]" : "bg-[#0E4D41] text-white"
                                      )}>
                                         {a.model}
                                      </div>
                                   </div>
                                </td>
                                <td className="px-5 py-2">
                                   <div className="flex flex-col items-center gap-2">
                                      <span className="text-[10px] font-medium text-[#63716E]">
                                         {a.stage === 1 ? "Application Received" : 
                                          a.stage === 2 ? "Interview Scheduled" :
                                          a.stage === 3 ? "Final Interview" :
                                          a.stage === 4 ? "Test Completed" : "Hired"}
                                      </span>
                                      <div className="flex gap-1">
                                         {[1, 2, 3, 4, 5].map(s => (
                                            <div 
                                              key={s} 
                                              className={cn(
                                                "h-4 w-5 flex items-center justify-center text-[8px] font-bold rounded-[2px]",
                                                s <= a.stage ? "bg-brand text-white" : "bg-[#F7F7F7] text-[#A4ACAB]"
                                              )}
                                            >
                                               {s}
                                            </div>
                                         ))}
                                      </div>
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>

                 <div className="p-5 border-t border-[#E5E6E6] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                       <span className="text-[14px] text-[#63716E]">Show</span>
                       <button className="flex items-center gap-2 bg-[#F7F7F7] h-[28px] px-3 rounded-[8px] text-[12px] font-bold text-[#203430]">
                          7 <ChevronDown className="h-3 w-3" />
                       </button>
                       <span className="text-[14px] text-[#63716E]">of 102 results</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F5F5F5] text-[#203430] opacity-50 cursor-not-allowed"><ChevronLeft className="h-4 w-4" /></button>
                       <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-brand text-white text-[12px] font-bold">1</button>
                       <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F7F7F7] text-[#203430] text-[12px] font-bold">2</button>
                       <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F7F7F7] text-[#203430] text-[12px] font-bold">3</button>
                       <span className="px-1 text-[12px] text-[#63716E]">...</span>
                       <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F7F7F7] text-[#203430] text-[12px] font-bold">11</button>
                       <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F7F7F7] text-[#203430] hover:bg-brand hover:text-white transition-all"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                 </div>
              </Card>
           </div>

           {/* Right Sidebar Section */}
           <div className="xl:w-[272px] space-y-5">
              {/* Applicant Resources Card */}
              <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm space-y-4">
                 <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[14px] font-bold text-[#203430]">Applicant Resources</h3>
                    <button><MoreHorizontal className="h-4 w-4 text-[#63716E]" /></button>
                 </div>
                 <div className="space-y-6 relative h-[180px]">
                    {/* Vertical Grid Lines BG */}
                    <div className="absolute inset-0 flex justify-between px-2 pt-8 pointer-events-none opacity-50">
                       <div className="w-[1px] h-full border-l border-dashed border-[#E5E6E6]" />
                       <div className="w-[1px] h-full border-l border-dashed border-[#E5E6E6]" />
                       <div className="w-[1px] h-full border-l border-dashed border-[#E5E6E6]" />
                       <div className="w-[1px] h-full border-l border-dashed border-[#E5E6E6]" />
                    </div>
                    {resources.map(res => (
                       <div key={res.label} className="space-y-1 relative z-10">
                          <div className="flex justify-between items-baseline">
                             <span className="text-[11px] font-bold text-[#203430]">{res.label}</span>
                             <div className="flex items-center gap-1.5 translate-x-1">
                                <span className="text-[11px] text-[#63716E]">{res.percentage}%</span>
                                <div className="h-2.5 w-px bg-[#E5E6E6]" />
                                <span className="text-[11px] font-bold text-[#203430]">{res.val}</span>
                             </div>
                          </div>
                          <div className="h-2.5 w-full bg-[#E5E6E6] rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-[#35BFA3] rounded-full"
                                style={{ width: `${res.percentage}%`, backgroundColor: res.label === 'Job Portal' ? '#0E4D41' : '#35BFA3' }}
                             />
                          </div>
                       </div>
                    ))}
                    <div className="flex justify-between px-2 pt-2">
                       {['0', '25', '50', '75', '100'].map(v => (
                          <span key={v} className="text-[9px] text-[#63716E]">{v}</span>
                       ))}
                    </div>
                 </div>
              </Card>

              {/* Schedules Card */}
              <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] font-bold text-[#203430]">Schedules</h3>
                    <button><MoreHorizontal className="h-4 w-4 text-[#63716E]" /></button>
                 </div>
                 
                 {/* Mini Calendar View */}
                 <div className="bg-[#F7F7F7] rounded-[12px] p-3 mb-4">
                    <div className="flex items-center justify-between mb-3">
                       <button className="bg-white p-1 rounded-[6px] shadow-sm"><ChevronLeft className="h-3 w-3" /></button>
                       <span className="text-[12px] font-bold text-[#203430]">June 2035</span>
                       <button className="bg-white p-1 rounded-[6px] shadow-sm"><ChevronRight className="h-3 w-3" /></button>
                    </div>
                    <div className="grid grid-cols-7 text-center gap-1">
                       {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={`${d}-${i}`} className="text-[8px] text-[#63716E]">{d}</span>)}
                       {[17, 18, 19, 20, 21, 22, 23].map(d => (
                          <div key={d} className={cn(
                            "h-7 w-6 mx-auto flex items-center justify-center rounded-[6px] text-[10px] font-bold",
                            d === 20 ? "bg-brand text-white" : "text-[#203430]"
                          )}>
                             {d}
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Vertical List */}
                 <div className="space-y-4">
                    {schedules.map((s, idx) => (
                       <div key={idx} className="flex gap-3">
                          <div className="flex flex-col items-center">
                             <div className="h-2 w-2 rounded-full border-2 border-brand bg-white" />
                             {idx !== schedules.length - 1 && <div className="w-px flex-1 bg-[#E5E6E6] my-1" />}
                          </div>
                          <div className="flex-1 bg-[#E4F2D3]/30 border-l border-brand p-3 rounded-r-[12px] rounded-bl-[12px]">
                             <span className="text-[9px] font-medium text-brand">{s.time}</span>
                             <h4 className="text-[12px] font-bold text-[#203430] mt-0.5">{s.title}</h4>
                             <p className="text-[10px] text-[#63716E] mt-0.5">{s.subtitle}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </Card>
           </div>
        </div>
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
         <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
              <Icon key={i} className="h-4 w-4 text-[#63716E] cursor-pointer hover:text-brand" />
            ))}
         </div>
      </footer>
    </AppLayout>
  );
}
