import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card, Badge } from "../components/ui/LayoutAddons";
import { Button } from "../components/ui/Button";
import { 
  ArrowLeft,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Linkedin,
  Twitter,
  Instagram,
  FileText,
  Clock,
  ArrowUpRight,
  TrendingUp,
  User,
  ExternalLink,
  ChevronDown,
  Facebook,
  Youtube,
  Search,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import { cn } from "@/src/lib/utils";
import { useNavigate, useParams } from "react-router-dom";

const performanceData = [
  { month: 'Jan', score: 75 },
  { month: 'Feb', score: 72 },
  { month: 'Mar', score: 78 },
  { month: 'Apr', score: 74 },
  { month: 'May', score: 76 },
  { month: 'Jun', score: 74 },
  { month: 'Jul', score: 78 },
  { month: 'Aug', score: 80 },
  { month: 'Sep', score: 82 },
  { month: 'Oct', score: 80 },
  { month: 'Nov', score: 83 },
  { month: 'Dec', score: 85 },
];

const hoursData = [
  { day: 'M', hours: 8 },
  { day: 'Tue', hours: 7.5, label: 'T' },
  { day: 'W', hours: 4 },
  { day: 'Thu', hours: 8, label: 'T' },
  { day: 'F', hours: 7 },
  { day: 'Sat', hours: 0, label: 'S' },
  { day: 'Sun', hours: 0, label: 'S' },
];

const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

export default function EmployeeDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <AppLayout 
      title="Employee Details" 
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Employees", href: "/employees" }, { label: "Employee Details" }]}
    >
      <div className="flex flex-col gap-6 xl:flex-row">
        
        {/* Left Stats Column */}
        <div className="w-full space-y-6 xl:w-[272px] shrink-0">
           {/* Profile Card */}
           <Card className="p-4 flex flex-col items-center text-center bg-white border-none shadow-sm rounded-[16px]">
              <div className="mt-8 mb-6 relative">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=4&w=400&h=400&q=80" 
                  className="h-[140px] w-[140px] rounded-[16px] object-cover ring-8 ring-[#F8FCF3]"
                />
              </div>
              <h2 className="text-xl font-bold text-[#203430]">Mia Torres</h2>
              <p className="text-[12px] font-medium text-[#63716E] mb-6">HR Officer • Human Resources</p>
              
              <div className="flex items-center justify-center gap-2 mb-8">
                 <Badge variant="default" className="bg-[#E5E6E6] text-[#203430] text-[12px] font-medium rounded-full px-3 py-1 ring-0 border-none">EMP-0289</Badge>
                 <Badge variant="success" className="bg-brand text-white text-[12px] font-medium rounded-full px-3 py-1 ring-0 border-none">Active</Badge>
              </div>

              <div className="w-full space-y-0 rounded-xl overflow-hidden border border-slate-100">
                 {[
                   { label: "Employment Type", val: "Full-Time" },
                   { label: "Work Model", val: "Hybrid" },
                   { label: "Join Date", val: "14 February 2023" },
                 ].map((info, idx) => (
                   <div key={info.label} className={cn("flex justify-between items-center px-4 py-4 text-[12px] bg-[#F7F7F7]", idx < 2 && "border-b border-[#E5E6E6]")}>
                      <span className="font-medium text-[#63716E]">{info.label}</span>
                      <span className="font-bold text-[#203430]">{info.val}</span>
                   </div>
                 ))}
              </div>

              <div className="flex items-center justify-between w-full mt-8 mb-4">
                 <span className="text-[12px] text-[#63716E]">Social Media:</span>
                 <div className="flex gap-2">
                    {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                      <button key={i} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E4F2D3] text-[#203430] hover:bg-brand hover:text-white transition-all shadow-sm">
                        <Icon className="h-4 w-4" />
                      </button>
                    ))}
                 </div>
              </div>
           </Card>

           {/* Personal Info Card */}
           <Card className="p-4 bg-white border-none shadow-sm rounded-[16px]">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-[16px] font-bold text-[#203430]">Personal Info</h3>
                 <button className="text-slate-300 hover:text-slate-600"><MoreHorizontal className="h-5 w-5" /></button>
              </div>
              
              <div className="space-y-6">
                 {[
                   { icon: User, label: "Gender", val: "Female" },
                   { icon: CalendarIcon, label: "Date of Birth", val: "28 March 1993" },
                   { icon: Mail, label: "Email Address", val: "mia.torres@company.com" },
                   { icon: Phone, label: "Phone", val: "+62 812-3456-7890" },
                   { icon: MapPin, label: "Address", val: "Jl. Melati No. 45, Sleman, Yogyakarta, Indonesia" },
                 ].map(item => (
                   <div key={item.label} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F8FCF3] text-brand">
                         <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                         <p className="text-[12px] font-medium text-[#63716E] tracking-tight">{item.label}</p>
                         <p className="text-[14px] font-bold text-[#203430] leading-tight mt-0.5">{item.val}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </Card>
        </div>

        {/* Center Content Column */}
        <div className="flex-1 space-y-6">
           {/* Top Metric Cards - Circular Progress */}
           <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                { label: 'All Leaves', val: '14', total: '20', color: '#0E4D41' },
                { label: 'Annual Leaves', val: '10', total: '15', color: '#35BFA3' },
                { label: 'Casual Leaves', val: '8', total: '24', color: '#35BFA3' },
                { label: 'Sick Leaves', val: '3', total: '4', color: '#0E4D41' },
              ].map(stat => (
                <Card key={stat.label} className="p-4 text-center border-none shadow-sm rounded-[16px]">
                   <div className="relative inline-flex mb-4">
                      <svg className="h-[94px] w-[94px] -rotate-90">
                         <circle cx="47" cy="47" r="38" stroke="#E4F2D3" strokeWidth="6" fill="none" />
                         <circle 
                           cx="47" 
                           cy="47" 
                           r="38" 
                           stroke={stat.color} 
                           strokeWidth="6" 
                           fill="none" 
                           strokeDasharray="239" 
                           strokeDashoffset={239 * (1 - parseInt(stat.val) / parseInt(stat.total))} 
                           strokeLinecap="round"
                         />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-[20px] font-bold text-[#203430]">{stat.val}<span className="text-[#A4ACAB] text-[14px] font-medium">/{stat.total}</span></span>
                         <span className="text-[9px] font-medium text-[#63716E] uppercase">Days</span>
                      </div>
                   </div>
                   <p className="text-[12px] font-bold text-[#203430]">{stat.label}</p>
                </Card>
              ))}
           </div>

           {/* Performance Overview */}
           <Card className="p-6 border-none shadow-sm rounded-[16px]">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h3 className="text-[16px] font-bold text-[#203430]">Performance Overview</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-3xl font-bold text-[#203430]">86.75%</span>
                       <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-[#E4F2D3] text-[11px] font-bold text-brand">
                          <TrendingUp className="h-3 w-3" /> +2.05%
                       </span>
                       <span className="text-[10px] font-medium text-[#63716E] uppercase tracking-wide">Increased by last year</span>
                    </div>
                 </div>
                 <button className="flex items-center gap-2 bg-[#F7F7F7] px-3 py-1.5 rounded-lg text-[12px] font-bold text-[#63716E]">
                    Last Year <ChevronDown className="h-4 w-4" />
                 </button>
              </div>

              <div className="h-[250px] w-full relative">
                 <div className="absolute right-[120px] top-6 bg-white border border-slate-100 rounded-[8px] p-2 shadow-xl z-20 text-center">
                    <p className="text-[9px] font-medium text-[#63716E]">Sept 2035</p>
                    <p className="text-[12px] font-bold text-brand">80.5%</p>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border-r border-b border-slate-50 bg-white" />
                 </div>
                 
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                       <defs>
                          <linearGradient id="performGradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#35BFA3" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#35BFA3" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E6E6" />
                       <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#63716E' }} 
                        dy={10} 
                       />
                       <YAxis hide domain={[0, 100]} />
                       <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#35BFA3" 
                        strokeWidth={2} 
                        fillOpacity={1} 
                        fill="url(#performGradient)" 
                        dot={{ r: 4, fill: "#35BFA3", stroke: "#fff", strokeWidth: 2 }} 
                        activeDot={{ r: 6, fill: "#0E4D41", stroke: "#fff", strokeWidth: 2 }}
                       />
                       <Tooltip cursor={{ stroke: '#35BFA3', strokeWidth: 1 }} content={() => null} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="p-4 border-none shadow-sm rounded-[16px]">
                 <div className="flex items-center justify-between mb-4">
                    <div>
                       <h3 className="text-[16px] font-bold text-[#203430]">Hours Logged</h3>
                       <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-[24px] font-bold text-[#203430]">34 <span className="text-[#63716E] font-normal text-[14px]">h</span> 30 <span className="text-[#63716E] font-normal text-[14px]">m</span></span>
                       </div>
                    </div>
                    <button className="flex items-center gap-1 bg-[#E4F2D3] px-2 py-1 rounded text-[11px] font-bold text-slate-700">
                       This Week <ChevronDown className="h-3 w-3" />
                    </button>
                 </div>
                 
                 <div className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={hoursData}>
                          <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F7F7F7" />
                          <XAxis 
                            dataKey="day" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 9, fill: '#63716E' }} 
                            tickFormatter={(val) => {
                              if (val === 'Tue' || val === 'Thu') return 'T';
                              if (val === 'Sat' || val === 'Sun') return 'S';
                              return val;
                            }}
                            dy={5} 
                          />
                          <YAxis hide />
                          <Bar dataKey="hours" radius={[4, 4, 0, 0]} barSize={20}>
                            {hoursData.map((d, index) => (
                              <Cell key={`cell-${index}`} fill={(d.day === 'Thu' || d.day === 'T') && index === 3 ? '#0E4D41' : '#E4F2D3'} />
                            ))}
                          </Bar>
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </Card>

              <Card className="p-4 border-none shadow-sm rounded-[16px]">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[16px] font-bold text-[#203430]">Documents</h3>
                    <button className="text-slate-300"><MoreHorizontal className="h-5 w-5" /></button>
                 </div>
                 <div className="space-y-4">
                    {[
                      { name: 'Performance Evaluatio...', size: '1.24 MB' },
                      { name: 'Contract Agreement.pdf', size: '895 KB' },
                      { name: 'Curriculum Vitae.pdf', size: '1.27 MB' },
                      { name: 'Portfolio.pdf', size: '3.68 MB' },
                    ].map(doc => (
                      <div key={doc.name} className="flex items-center gap-3 group cursor-pointer">
                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E4F2D3] text-[#0E4D41] group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                            <FileText className="h-5 w-5" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-bold text-[#203430] truncate">{doc.name}</p>
                            <p className="text-[12px] font-medium text-[#63716E]">PDF • {doc.size}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </Card>
           </div>

           {/* Internal Notes */}
           <Card className="p-4 border-none shadow-sm rounded-[16px]">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-[16px] font-bold text-[#203430]">Internal Notes</h3>
                 <button className="text-slate-300"><MoreHorizontal className="h-5 w-5" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   { title: 'Promotion Feedback', date: '10 January 2035', text: 'Promoted from HR Assistant to HR Officer due to consistent performance and leadership in onboarding initiatives.' },
                   { title: 'Employee Appreciation', date: '02 May 2035', text: 'Recognized by the Head of HR for successfully leading the Q2 training rollout with a 98% participation rate.' },
                 ].map((n, i) => (
                   <div key={n.title} className="p-4 rounded-lg bg-[#F8FCF3]">
                      <h4 className="text-[12px] font-bold text-[#203430]">{n.title}</h4>
                      <p className="text-[10px] font-medium text-[#63716E] mb-2">{n.date}</p>
                      <p className="text-[11px] text-[#63716E] leading-relaxed line-clamp-3 font-medium">{n.text}</p>
                   </div>
                 ))}
              </div>
           </Card>
        </div>

        {/* Right Stats Column */}
        <div className="w-full space-y-6 xl:w-[272px] shrink-0">
           {/* Mini Calendar */}
           <Card className="p-4 bg-white border-none shadow-sm rounded-[16px]">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-1 cursor-pointer">
                    <span className="text-[16px] font-bold text-[#203430]">June 2035</span>
                    <ChevronDown className="h-4 w-4 text-[#63716E]" />
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2 bg-[#E4F2D3] rounded-lg text-[#203430] hover:bg-brand hover:text-white transition-all"><ChevronLeft className="h-4 w-4" /></button>
                    <button className="p-2 bg-[#E4F2D3] rounded-lg text-[#203430] hover:bg-brand hover:text-white transition-all"><ChevronRight className="h-4 w-4" /></button>
                 </div>
              </div>
              
              <div className="grid grid-cols-7 text-center mb-2">
                 {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                   <span key={`${d}-${i}`} className="text-[11px] font-medium text-[#63716E]">{d}</span>
                 ))}
              </div>
              <div className="grid grid-cols-7 text-center gap-y-1">
                 {[27, 28, 29, 30, 31].map(d => <span key={d} className="text-[12px] font-medium text-[#A4ACAB] py-1">{d}</span>)}
                 {calendarDays.map(d => (
                   <span 
                    key={d} 
                    className={cn(
                      "text-[12px] font-medium py-1 rounded-md cursor-pointer transition-all",
                      d === 21 ? "bg-brand text-white font-bold shadow-md shadow-brand/20" : d === 20 ? "bg-[#0E4D41] text-white" : "text-[#203430] hover:bg-slate-50",
                      [20, 21, 23, 27].includes(d) && d !== 21 && d!== 20 && "bg-[#35BFA3] text-white",
                      [3, 4, 1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 24, 25, 26, 28, 29, 30].includes(d) && d !== 21 && d !== 20 && "bg-[#E4F2D3]"
                    )}
                   >
                     {d}
                   </span>
                 ))}
              </div>
              
              <div className="mt-6 flex flex-wrap items-center justify-between gap-y-2 text-[9px] font-medium text-[#63716E]">
                  <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-[#0E4D41]" /> Present <span className="text-[#203430] font-bold">13</span></div>
                  <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-[#35BFA3]" /> Late <span className="text-[#203430] font-bold">5</span></div>
                  <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-[#203430]" /> On Leave <span className="text-[#203430] font-bold">2</span></div>
                  <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-[#E5E6E6]" /> Absent <span className="text-[#203430] font-bold">1</span></div>
              </div>
           </Card>

           {/* Payroll Summary Card */}
           <Card className="p-4 bg-white border-none shadow-sm rounded-[16px]">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[16px] font-bold text-[#203430]">Payroll Summary</h3>
                 <button className="text-slate-300"><MoreHorizontal className="h-5 w-5" /></button>
              </div>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-[11px] font-medium text-[#63716E] border-b border-slate-50 pb-2">
                    <span>Description</span>
                    <div className="text-right">
                       <p className="font-bold">Amount</p>
                       <p className="text-[9px]">USD/MONTH</p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#203430]">Base Salary</span>
                    <span className="text-[14px] font-bold text-[#203430]">$3,200</span>
                 </div>

                 <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-bold text-[#A4ACAB] uppercase tracking-widest">Allowances</p>
                    {[
                      { l: 'Transportation', v: '$120' },
                      { l: 'Meal', v: '$110' },
                      { l: 'Internet (Hybrid)', v: '$70' },
                    ].map(x => (
                      <div key={x.l} className="flex justify-between text-[12px]">
                         <span className="text-[#63716E] font-medium">{x.l}</span>
                         <span className="text-[#203430] font-bold">{x.v}</span>
                      </div>
                    ))}
                 </div>

                 <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-bold text-[#A4ACAB] uppercase tracking-widest">Benefits</p>
                    {[
                      { l: 'Health Insurance', v: '$120' },
                      { l: 'Life Insurance', v: '$40' },
                      { l: 'Company Device', v: '$65' },
                      { l: 'Training Program', v: '$80' },
                      { l: 'Fitness Membership', v: '$50' },
                    ].map(x => (
                      <div key={x.l} className="flex justify-between text-[12px]">
                         <span className="text-[#63716E] font-medium">{x.l}</span>
                         <span className="text-[#203430] font-bold">{x.v}</span>
                      </div>
                    ))}
                 </div>

                 <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <span className="text-[14px] font-bold text-[#203430]">Total Monthly Value</span>
                    <span className="text-[16px] font-bold text-brand">$3,855</span>
                 </div>
              </div>
           </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 flex flex-col gap-6 md:flex-row md:items-center md:justify-between py-8 border-t border-slate-100 mb-8 px-4">
         <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-10">
            <p className="text-[12px] text-[#203430] font-bold">Copyright © 2025 Peterdraw</p>
            <div className="flex gap-6">
               {['Privacy Policy', 'Term and conditions', 'Contact'].map(link => (
                 <a key={link} href="#" className="text-[12px] text-[#63716E] font-medium hover:text-brand transition-colors">{link}</a>
               ))}
            </div>
         </div>
         <div className="flex gap-4 items-center">
            {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
              <button key={i} className="text-[#63716E] hover:text-brand transition-colors">
                <Icon className="h-4 w-4" />
              </button>
            ))}
         </div>
      </footer>
    </AppLayout>
  );
}
