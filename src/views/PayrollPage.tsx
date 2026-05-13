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
  Download,
  CircleDollarSign,
  HandCoins,
  Clock,
  Banknote,
  CheckCircle,
  FileText
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area
} from "recharts";
import { cn } from "@/src/lib/utils";

const payrollOverviewData = [
  { month: 'Jan', salary: 150, overtime: 40, incentives: 80 },
  { month: 'Feb', salary: 180, overtime: 45, incentives: 70 },
  { month: 'Mar', salary: 160, overtime: 50, incentives: 75 },
  { month: 'Apr', salary: 140, overtime: 55, incentives: 90 },
  { month: 'May', salary: 220, overtime: 60, incentives: 85 },
  { month: 'Jun', salary: 260, overtime: 65, incentives: 95 },
  { month: 'Jul', salary: 240, overtime: 70, incentives: 100 },
  { month: 'Aug', salary: 280, overtime: 75, incentives: 110 },
  { month: 'Sep', salary: 300, overtime: 80, incentives: 105 },
  { month: 'Oct', salary: 400, overtime: 85, incentives: 115 },
  { month: 'Nov', salary: 420, overtime: 90, incentives: 120 },
  { month: 'Dec', salary: 380, overtime: 95, incentives: 125 },
];

const payrollList = [
  { name: "Olivia Mason", id: "EMP-0234", role: "Marketing", subRole: "Executive Marketing", date: "28 Jun 35", salary: "$3,200", allowance: "$300", overtime: "$60", incen: "$150", deduct: "$120", total: "$3,590", status: "Paid", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Ethan Ray", id: "EMP-0178", role: "UI Designer", subRole: "Product Design", date: "28 Jun 35", salary: "$3,100", allowance: "$280", overtime: "$50", incen: "$100", deduct: "$130", total: "$3,400", status: "Paid", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Mia Torres", id: "EMP-0289", role: "HR Officer", subRole: "Human Resources", date: "28 Jun 35", salary: "$3,200", allowance: "$300", overtime: "$65", incen: "$120", deduct: "$110", total: "$3,575", status: "Paid", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Daniel Cheung", id: "EMP-0291", role: "Compliance Specialist", subRole: "Operations", date: "28 Jun 35", salary: "$2,900", allowance: "$250", overtime: "$45", incen: "$80", deduct: "$100", total: "$3,175", status: "Paid", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Farah Nabila", id: "EMP-0320", role: "Customer Experience Lead", subRole: "Customer Service", date: "28 Jun 35", salary: "$3,000", allowance: "$270", overtime: "$55", incen: "$90", deduct: "$125", total: "$3,290", status: "Paid", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Lina Armand", id: "EMP-0312", role: "Lab Analyst", subRole: "R&D", date: "28 Jun 35", salary: "$2,000", allowance: "$150", overtime: "—", incen: "$60", deduct: "$90", total: "$2,120", status: "Paid", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Jacob Yuen", id: "EMP-0115", role: "Site Supervisor", subRole: "Operations", date: "28 Jun 35", salary: "$3,300", allowance: "$320", overtime: "$70", incen: "$110", deduct: "$140", total: "$3,660", status: "Paid", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Sara Kim", id: "EMP-0356", role: "Customer Support", subRole: "Customer Service", date: "28 Jun 35", salary: "$800", allowance: "$50", overtime: "—", incen: "—", deduct: "$20", total: "$830", status: "Paid", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Anya Rodriguez", id: "EMP-0275", role: "Graphic Designer", subRole: "Marketing", date: "28 Jun 35", salary: "$2,200", allowance: "$180", overtime: "$40", incen: "$70", deduct: "$85", total: "$2,405", status: "Paid", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Kelvin Yu", id: "EMP-0159", role: "Training Coordinator", subRole: "HR", date: "28 Jun 35", salary: "$2,500", allowance: "$200", overtime: "$55", incen: "$100", deduct: "$100", total: "$2,755", status: "Paid", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
];

function SegmentedProgressBar({ distribution }: { distribution: { color: string, percentage: number }[] }) {
  const segments = 60;
  return (
    <div className="flex gap-[2px] w-full h-[42px]">
      {Array.from({ length: segments }).map((_, i) => {
        const threshold = (i / segments) * 100;
        let activeColor = '#E5E6E6';
        let cumulative = 0;
        for (const item of distribution) {
          cumulative += item.percentage;
          if (threshold < cumulative) {
            activeColor = item.color;
            break;
          }
        }
        return (
          <div 
            key={i} 
            className="flex-1 rounded-[2px]"
            style={{ backgroundColor: activeColor }}
          />
        );
      })}
    </div>
  );
}

export default function PayrollPage() {
  return (
    <AppLayout 
      title="Payroll" 
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Payroll" }]}
    >
      <div className="space-y-5">
        {/* Summary Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
           {[
             { label: 'Total Salary', val: '$352,000', change: '+5.4%', trend: 'up', icon: CircleDollarSign, iconColor: '#35BFA3' },
             { label: 'Total Allowances', val: '$15,000', change: '+3.6%', icon: HandCoins, iconColor: '#35BFA3' },
             { label: 'Total Overtime', val: '$4,800', change: '+2.3%', icon: Clock, iconColor: '#35BFA3' },
             { label: 'Total Incentives', val: '$6,500', change: '+4.9%', icon: Banknote, iconColor: '#35BFA3' },
           ].map(stat => (
             <Card key={stat.label} className="p-4 border-none rounded-[16px] bg-white shadow-sm flex items-center justify-between">
                <div className="space-y-2">
                   <p className="text-[12px] text-[#63716E]">{stat.label}</p>
                   <p className="text-[28px] font-bold text-[#203430] leading-none">{stat.val}</p>
                   <div className="flex items-center gap-1">
                      <div className="bg-[#E4F2D3] px-1.5 py-0.5 rounded-[10px] flex items-center">
                         <span className="text-[11px] font-bold text-[#0E4D41]">{stat.change}</span>
                      </div>
                      <span className="text-[10px] text-[#63716E]">from May</span>
                   </div>
                </div>
                <div className="h-[60px] w-[60px] bg-[#F7F7F7] rounded-[8px] flex items-center justify-center">
                   <stat.icon className="h-8 w-8" style={{ color: stat.iconColor }} />
                </div>
             </Card>
           ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
           {/* Payroll Overview Card */}
           <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col min-h-[277px]">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[16px] font-bold text-[#203430]">Payroll Overview</h3>
                 <button className="flex items-center gap-2 bg-[#F7F7F7] px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-[#203430]">
                    Last Year <ChevronDown className="h-3 w-3" />
                 </button>
              </div>
              <div className="flex gap-6 mb-4">
                 {[
                   { label: 'Salary', color: '#35BFA3' },
                   { label: 'Overtime', color: '#0E4D41' },
                   { label: 'Incentives', color: '#F8C947' },
                 ].map(l => (
                   <div key={l.label} className="flex items-center gap-1.5">
                      <div className="h-[4px] w-3 rounded-full" style={{ backgroundColor: l.color }} />
                      <span className="text-[12px] text-[#63716E]">{l.label}</span>
                   </div>
                 ))}
              </div>
              <div className="flex-1 min-h-0">
                 <ResponsiveContainer width="100%" height={163}>
                    <LineChart data={payrollOverviewData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F7F7F7" />
                       <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#63716E' }} 
                        dy={10}
                       />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#63716E' }} />
                       <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(14, 77, 65, 0.1)' }}
                        itemStyle={{ fontSize: '10px' }}
                        labelStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                       />
                       <Line type="monotone" dataKey="salary" stroke="#35BFA3" strokeWidth={2} dot={false} />
                       <Line type="monotone" dataKey="overtime" stroke="#0E4D41" strokeWidth={2} dot={false} />
                       <Line type="monotone" dataKey="incentives" stroke="#F8C947" strokeWidth={2} dot={false} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           {/* Payroll Breakdown Card */}
           <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col min-h-[277px]">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[16px] font-bold text-[#203430]">Payroll Breakdown</h3>
                 <button className="flex items-center gap-2 bg-[#F7F7F7] px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-[#203430]">
                    This Month <ChevronDown className="h-3 w-3" />
                 </button>
              </div>
              <div className="mb-5">
                 <p className="text-[24px] font-bold text-[#203430]">$378,300 <span className="text-[11px] font-normal text-[#63716E] ml-1 uppercase">Total Pay This Month</span></p>
              </div>

              <div className="mb-6">
                 <SegmentedProgressBar distribution={[
                   { percentage: 89, color: '#35BFA3' },
                   { percentage: 4, color: '#0E4D41' },
                   { percentage: 2, color: '#F8C947' },
                   { percentage: 3, color: '#A4ACAB' },
                   { percentage: 2, color: '#E5E6E6' },
                 ]} />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                 {[
                   { label: 'Salary', percentage: '89.0%', amount: '$352,000', color: '#35BFA3' },
                   { label: 'Allowances', percentage: '3.8%', amount: '$15,000', color: '#0E4D41' },
                   { label: 'Deductions', percentage: '4.0%', amount: '$16,200', color: '#A4ACAB' },
                   { label: 'Incentives', percentage: '2.0%', amount: '$7,900', color: '#F8C947' },
                   { label: 'Overtime', percentage: '1.2%', amount: '$4,800', color: '#0E4D41' },
                 ].map(item => (
                    <div key={item.label} className="flex gap-2">
                       <div className="h-2.5 w-2.5 rounded-[2px] mt-1 shrink-0" style={{ backgroundColor: item.color }} />
                       <div className="flex flex-col">
                          <p className="text-[12px] font-bold text-[#203430]">{item.label} — <span className="text-[#63716E] font-normal">{item.percentage}</span></p>
                          <p className="text-[12px] text-[#63716E]">{item.amount}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </Card>
        </div>

        {/* Table Card */}
        <Card className="border-none rounded-[16px] bg-white shadow-sm overflow-hidden p-0 flex flex-col min-h-[708px]">
           <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
              <h2 className="text-[16px] font-bold text-[#203430]">Payroll List</h2>
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
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Name <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Job Title <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Date <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Salary <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Allowances <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Overtime <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Incen. <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Deduct. <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Total <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Status <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Payslip <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[#E5E6E6]">
                    {payrollList.map((e, i) => (
                      <tr key={i} className="hover:bg-[#F7F7F7]/50 transition-colors group">
                        <td className="px-6 py-3 whitespace-nowrap">
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
                              <span className="text-[10px] text-[#63716E] mt-1 font-bold whitespace-nowrap">{e.subRole}</span>
                           </div>
                        </td>
                        <td className="px-6 py-3 text-[11px] font-bold text-[#203430] whitespace-nowrap uppercase tracking-tighter">{e.date}</td>
                        <td className="px-6 py-3 text-[11px] font-bold text-[#203430]">{e.salary}</td>
                        <td className="px-6 py-3 text-[11px] font-bold text-[#63716E]">{e.allowance}</td>
                        <td className="px-6 py-3 text-[11px] font-bold text-[#63716E]">{e.overtime}</td>
                        <td className="px-6 py-3 text-[11px] font-bold text-[#63716E]">{e.incen}</td>
                        <td className="px-6 py-3 text-[11px] font-bold text-[#63716E]">{e.deduct}</td>
                        <td className="px-6 py-3 text-[11px] font-bold text-[#0E4D41] whitespace-nowrap">{e.total}</td>
                        <td className="px-6 py-3">
                           <div className="flex items-center gap-1 bg-brand px-2 py-1 rounded-[12px] w-fit min-w-[49px]">
                              <CheckCircle className="h-3 w-3 text-white" />
                              <span className="text-[11px] text-white">Paid</span>
                           </div>
                        </td>
                        <td className="px-6 py-3">
                           <button className="flex items-center gap-2 bg-[#E4F2D3] h-[24px] px-2 rounded-[6px] text-[11px] font-medium text-[#203430] whitespace-nowrap hover:bg-brand hover:text-white transition-all">
                              <FileText className="h-3 w-3" /> Download
                           </button>
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
