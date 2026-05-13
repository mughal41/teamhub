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
  ArrowUpRight
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { cn } from "@/src/lib/utils";

const teamPerformanceData = [
  { month: 'Jan', marketing: 40, product: 30, hr: 20, ops: 25 },
  { month: 'Feb', marketing: 45, product: 35, hr: 25, ops: 22 },
  { month: 'Mar', marketing: 50, product: 40, hr: 30, ops: 28 },
  { month: 'Apr', marketing: 48, product: 38, hr: 28, ops: 32 },
  { month: 'May', marketing: 55, product: 45, hr: 35, ops: 40 },
  { month: 'Jun', marketing: 60, product: 50, hr: 40, ops: 45 },
];

const categoryPerformance = [
  { name: 'Team Work', score: 4.5, max: 5, percentage: 90, color: '#35BFA3' },
  { name: 'Work Quality', score: 4.3, max: 5, percentage: 86, color: '#0E4D41' },
  { name: 'Problem-Solving', score: 4.1, max: 5, percentage: 82, color: '#A4ACAB' },
  { name: 'Time Management', score: 3.8, max: 5, percentage: 76, color: '#F8C947' },
];

const employeePerformanceList = [
  { name: "Olivia Mason", id: "EMP-0234", role: "Marketing", subRole: "Executive Marketing", teamwork: 4.7, quality: 4.6, problem: 4.4, time: 4.4, score: 92, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Ethan Ray", id: "EMP-0178", role: "UI Designer", subRole: "Product Design", teamwork: 4.6, quality: 4.5, problem: 4.4, time: 4.3, score: 90, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Lina Armand", id: "EMP-0312", role: "Lab Analyst", subRole: "R&D", teamwork: 4.2, quality: 4.0, problem: 4.1, time: 3.5, score: 81, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Jacob Yuen", id: "EMP-0115", role: "Site Supervisor", subRole: "Operations", teamwork: 4.1, quality: 4.2, problem: 4.0, time: 3.6, score: 80, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Mia Torres", id: "EMP-0289", role: "HR Officer", subRole: "Human Resources", teamwork: 4.6, quality: 4.5, problem: 4.4, time: 4.3, score: 89, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Farah Nabila", id: "EMP-0267", role: "Customer Experience Lead", subRole: "Support", teamwork: 4.5, quality: 4.3, problem: 4.2, time: 4.0, score: 88, avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Daniel Cheung", id: "EMP-0351", role: "Compliance Specialist", subRole: "Legal", teamwork: 4.4, quality: 4.2, problem: 4.3, time: 3.9, score: 87, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
];

const topPerformers = [
  { name: "Olivia Mason", role: "Marketing Executive", score: 92, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Ethan Ray", role: "UI Designer", score: 90, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Mia Torres", role: "HR Officer", score: 89, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Farah Nabila", role: "Customer Experience Lead", score: 88, avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Daniel Cheung", role: "Compliance Specialist", score: 87, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
];

const alerts = [
  { name: "Anya Rodriguez", role: "Freelance Graphic...", text: "Low on-time rate for deliverables, below 70% for the month.", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Lina Armand", role: "Lab Analyst", text: "Multiple overdue task submissions this quarter.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Sara Kim", role: "Customer Support Intern", text: "Frequently submits reports past deadline.", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
];

const pieData = [
  { name: 'Score', value: 87 },
  { name: 'Remaining', value: 13 },
];

const PIE_COLORS = ['#0E4D41', '#E4F2D3'];

function ProgressBar({ percentage, color }: { percentage: number, color: string }) {
  return (
    <div className="flex gap-[2px] w-full h-6 rounded-[4px] overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => {
        const threshold = (i / 50) * 100;
        const isActive = threshold < percentage;
        return (
          <div 
            key={i} 
            className="flex-1 rounded-[1px]"
            style={{ backgroundColor: isActive ? color : '#E5E6E6' }}
          />
        );
      })}
    </div>
  );
}

export default function PerformancePage() {
  return (
    <AppLayout 
      title="Performance" 
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Performance" }]}
    >
      <div className="flex flex-col xl:flex-row gap-5">
        {/* Main Content Area */}
        <div className="flex-1 space-y-5">
          {/* Top Charts Row */}
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Team Performance Card */}
            <Card className="flex-1 min-h-[314px] p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-[16px] font-bold text-[#203430]">Team Performance</h3>
                 <button className="flex items-center gap-2 bg-[#F7F7F7] px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-[#203430]">
                    Last Year <ChevronDown className="h-3 w-3" />
                 </button>
              </div>
              <div className="flex-1 min-h-0">
                 <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={teamPerformanceData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                       <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#63716E' }} 
                        dy={10}
                       />
                       <Bar dataKey="marketing" stackId="a" fill="#E4F2D3" radius={[0, 0, 0, 0]} />
                       <Bar dataKey="product" stackId="a" fill="#35BFA3" radius={[0, 0, 0, 0]} />
                       <Bar dataKey="hr" stackId="a" fill="#0E4D41" radius={[0, 0, 0, 0]} />
                       <Bar dataKey="ops" stackId="a" fill="#E5E6E6" radius={[4, 4, 0, 0]} barSize={24} />
                    </BarChart>
                 </ResponsiveContainer>
                 <div className="mt-8 flex flex-wrap justify-between gap-2 px-2">
                    <div className="flex flex-col items-center gap-1">
                       <div className="h-1 w-6 rounded-full bg-[#E4F2D3]" />
                       <span className="text-[9px] text-[#63716E]">Marketing</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                       <div className="h-1 w-6 rounded-full bg-[#35BFA3]" />
                       <span className="text-[9px] text-[#63716E]">Product Design</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                       <div className="h-1 w-6 rounded-full bg-[#0E4D41]" />
                       <span className="text-[9px] text-[#63716E]">Human Resources</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                       <div className="h-1 w-6 rounded-full bg-[#E5E6E6]" />
                       <span className="text-[9px] text-[#63716E]">Operations</span>
                    </div>
                 </div>
              </div>
            </Card>

            {/* Performance by Category Card */}
            <Card className="lg:w-[466px] min-h-[314px] p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col uppercase tracking-tight">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-[16px] font-bold text-[#203430] normal-case">Performance by Category</h3>
                 <button className="flex items-center gap-2 bg-[#E4F2D3] px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-[#203430] normal-case">
                    This Month <ChevronDown className="h-3 w-3" />
                 </button>
              </div>
              <div className="space-y-4">
                 {categoryPerformance.map(cat => (
                    <div key={cat.name} className="space-y-2">
                       <div className="flex justify-between items-baseline">
                          <span className="text-[11px] font-medium text-[#203430]">{cat.name}</span>
                          <div className="flex items-center gap-1">
                             <span className="text-[11px] font-bold text-[#203430]">{cat.score}</span>
                             <span className="text-[11px] text-[#63716E]">/5</span>
                             <span className="text-[12px] text-[#E5E6E6] mx-1">|</span>
                             <span className="text-[11px] font-bold text-[#203430]">{cat.percentage}%</span>
                          </div>
                       </div>
                       <ProgressBar percentage={cat.percentage} color={cat.color} />
                    </div>
                 ))}
              </div>
            </Card>
          </div>

          {/* Employee Performance Table Card */}
          <Card className="border-none rounded-[16px] bg-white shadow-sm overflow-hidden p-0 flex flex-col min-h-[568px]">
             <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
                <h2 className="text-[16px] font-bold text-[#203430]">Employee Performance</h2>
                <div className="flex flex-wrap items-center gap-3">
                   <button className="flex items-center gap-2 bg-[#E4F2D3] h-[34px] px-3 rounded-[8px] text-[12px] font-medium text-[#203430]">
                      This Month <ChevronDown className="h-3 w-3" />
                   </button>
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
                               Teamwork <ArrowUpDown className="h-3 w-3" />
                            </div>
                         </th>
                         <th className="px-6 py-3">
                            <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                               Work Quality <ArrowUpDown className="h-3 w-3" />
                            </div>
                         </th>
                         <th className="px-6 py-3">
                            <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                               Problem Solving <ArrowUpDown className="h-3 w-3" />
                            </div>
                         </th>
                         <th className="px-6 py-3">
                            <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                               Time Management <ArrowUpDown className="h-3 w-3" />
                            </div>
                         </th>
                         <th className="px-6 py-3">
                            <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap text-brand">
                               Score <ArrowUpDown className="h-3 w-3" />
                            </div>
                         </th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#E5E6E6]">
                      {employeePerformanceList.map((e, i) => (
                        <tr key={i} className="hover:bg-[#F7F7F7]/50 transition-colors group h-[57px]">
                          <td className="px-6 py-2 whitespace-nowrap">
                             <div className="flex items-center gap-3">
                                <img src={e.avatar} className="h-8 w-8 rounded-full object-cover shadow-sm bg-brand" />
                                <div className="flex flex-col">
                                   <span className="text-[11px] font-bold text-[#203430] leading-none whitespace-nowrap">{e.name}</span>
                                   <span className="text-[10px] text-[#63716E] mt-1 uppercase font-bold">{e.id}</span>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                             <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-[#203430] leading-none whitespace-nowrap">{e.role}</span>
                                <span className="text-[10px] text-[#63716E] mt-1 font-bold">{e.subRole}</span>
                             </div>
                          </td>
                          <td className="px-6 py-2 text-center text-[11px] font-medium text-[#203430]">{e.teamwork}</td>
                          <td className="px-6 py-2 text-center text-[11px] font-medium text-[#203430]">{e.quality}</td>
                          <td className="px-6 py-2 text-center text-[11px] font-medium text-[#203430]">{e.problem}</td>
                          <td className="px-6 py-2 text-center text-[11px] font-medium text-[#203430]">{e.time}</td>
                          <td className="px-6 py-2 text-center text-[11px] font-bold text-[#0E4D41]">{e.score}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>

             <div className="p-6 border-t border-[#E5E6E6] flex flex-col sm:flex-row items-center justify-between gap-6 mt-auto">
                <div className="flex items-center gap-3">
                   <span className="text-[14px] text-[#63716E]">Show</span>
                   <button className="flex items-center gap-2 bg-[#F7F7F7] h-[28px] px-3 rounded-[8px] text-[12px] font-bold text-[#203430]">
                      7 <ChevronDown className="h-3 w-3" />
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
                   <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F7F7F7] text-[#203430] text-brand hover:bg-brand hover:text-white transition-colors"><ChevronRight className="h-4 w-4" /></button>
                </div>
             </div>
          </Card>
        </div>

        {/* Right Sidebar Area */}
        <div className="xl:w-[292px] space-y-5">
           {/* Average Performance Gauge */}
           <Card className="h-[216px] p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2">
                 <h3 className="text-[16px] font-bold text-[#203430]">Average Performance</h3>
                 <button><MoreHorizontal className="h-4 w-4 text-[#63716E]" /></button>
              </div>
              <div className="relative flex-1 w-full flex items-center justify-center">
                 <ResponsiveContainer width={189} height={118}>
                    <PieChart>
                       <Pie
                        data={pieData}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                       >
                         {pieData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                         ))}
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute top-[60%] flex flex-col items-center">
                    <span className="text-[11px] text-[#63716E]">Total Score</span>
                    <span className="text-[28px] font-bold text-[#0E4D41] leading-none">87%</span>
                    <div className="mt-1 flex items-center gap-1 bg-[#E4F2D3] px-1.5 py-0.5 rounded-[6px]">
                       <ArrowUpRight className="h-3 w-3 text-[#0E4D41]" />
                       <span className="text-[11px] font-bold text-[#0E4D41]">4.7%</span>
                    </div>
                 </div>
              </div>
           </Card>

           {/* Top Performers Card */}
           <Card className="min-h-[394px] p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col">
              <div className="w-full flex items-center justify-between mb-4">
                 <h3 className="text-[16px] font-bold text-[#203430]">Top Performers</h3>
                 <button><MoreHorizontal className="h-4 w-4 text-[#63716E]" /></button>
              </div>
              <div className="flex-1 space-y-4">
                 {topPerformers.map((p, i) => (
                    <React.Fragment key={p.name}>
                       {i > 0 && <div className="border-t border-[#E5E6E6]" />}
                       <div className="flex items-center gap-3 py-2">
                          <img src={p.avatar} className="h-8 w-8 rounded-full object-cover shadow-sm bg-brand" />
                          <div className="flex-1 min-w-0">
                             <p className="text-[14px] font-medium text-[#203430] truncate">{p.name}</p>
                             <p className="text-[12px] text-[#63716E] truncate">{p.role}</p>
                          </div>
                          <div className="flex items-baseline">
                             <span className="text-[14px] font-bold text-[#0E4D41]">{p.score}</span>
                             <span className="text-[10px] text-[#63716E]">/100</span>
                          </div>
                       </div>
                    </React.Fragment>
                 ))}
              </div>
           </Card>

           {/* Time Management Alerts */}
           <Card className="min-h-[252px] p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col">
              <div className="w-full flex items-center justify-between mb-4">
                 <h3 className="text-[16px] font-bold text-[#203430]">Time Management Alerts</h3>
                 <button><MoreHorizontal className="h-4 w-4 text-[#63716E]" /></button>
              </div>
              <div className="flex-1 space-y-4">
                 {alerts.map((a, i) => (
                    <React.Fragment key={a.name}>
                       {i > 0 && <div className="border-t border-[#E5E6E6]" />}
                       <div className="flex gap-3.5 py-1">
                          <div className="relative shrink-0">
                             <img src={a.avatar} className="h-8 w-8 rounded-full object-cover shadow-sm" />
                             <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-[#E63D4B] rounded-full border-2 border-white" />
                          </div>
                          <div className="flex-1">
                             <div className="flex items-baseline gap-1">
                                <span className="text-[12px] font-bold text-[#203430]">{a.name}</span>
                                <span className="text-[12px] text-[#E5E6E6]">|</span>
                                <span className="text-[12px] text-[#203430] truncate max-w-[100px]">{a.role}</span>
                             </div>
                             <p className="text-[10px] text-[#63716E] mt-0.5 leading-tight">{a.text}</p>
                          </div>
                       </div>
                    </React.Fragment>
                 ))}
              </div>
           </Card>
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
      </footer>
    </AppLayout>
  );
}
