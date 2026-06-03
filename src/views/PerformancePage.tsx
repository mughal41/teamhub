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
  ArrowUpRight,
  History,
  ClipboardSignature,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Award,
  ArrowLeft,
  CheckCircle2,
  X,
  PlusCircle,
  Clock,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { cn } from "@/src/lib/utils";
import { EmployeePerformanceProfile } from "../components/performance/EmployeePerformanceProfile";
import { ReviewWorkflow } from "../components/performance/ReviewWorkflow";

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
  { 
    name: "Olivia Mason", 
    id: "EMP-0234", 
    role: "Senior Product Designer", 
    subRole: "Design Team", 
    teamwork: 4.7, 
    quality: 4.6, 
    problem: 4.4, 
    time: 4.4, 
    score: 92, 
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAluMYQXcNeeCiMOUbSUUIK1ot0Udd7gJW7CJWCc3gP4D7dhE3efeKKWZeCEwNwW2haBxYdjNBW6Ty5OFz4VWIRO4dXBmChpbZ-kZf_9SyMLOB1iWQFE77mg2iQNUvJvYfFvA_yEgOshOFxmNqHA3YvHx67tON3iDJTXj2LArTPOH4O7tLV-hb-rRRK_84DiDBdqLY94ZFzXX8GGnRAqpT9EA2Dr_NhUS_nps-Z0kbEvfloTwM59z-qX3wCiIu1Ne8IGr3GRKAj2tk", 
    lastMonthly: "2026-04-12", // >30 days (Due!)
    lastQuarterly: "2026-05-10", // <90 days
    lastAnnual: "2025-11-20"    // <365 days
  },
  { 
    name: "Ethan Ray", 
    id: "EMP-0178", 
    role: "UI Designer", 
    subRole: "Product Design", 
    teamwork: 4.6, 
    quality: 4.5, 
    problem: 4.4, 
    time: 4.3, 
    score: 90, 
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", 
    lastMonthly: "2026-05-28", // <30 days
    lastQuarterly: "2026-01-15", // >90 days (Due!)
    lastAnnual: "2025-10-05" 
  },
  { 
    name: "Lina Armand", 
    id: "EMP-0312", 
    role: "Lab Analyst", 
    subRole: "R&D", 
    teamwork: 4.2, 
    quality: 4.0, 
    problem: 4.1, 
    time: 3.5, 
    score: 81, 
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", 
    lastMonthly: "2026-05-02", // >30 days (Due!)
    lastQuarterly: "2026-04-10", 
    lastAnnual: "2024-05-15"   // >365 days (Due!)
  },
  { 
    name: "Jacob Yuen", 
    id: "EMP-0115", 
    role: "Site Supervisor", 
    subRole: "Operations", 
    teamwork: 4.1, 
    quality: 4.2, 
    problem: 4.0, 
    time: 3.6, 
    score: 80, 
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", 
    lastMonthly: "2026-05-25", 
    lastQuarterly: "2026-04-18", 
    lastAnnual: "2025-08-11" 
  },
  { 
    name: "Mia Torres", 
    id: "EMP-0289", 
    role: "HR Officer", 
    subRole: "Human Resources", 
    teamwork: 4.6, 
    quality: 4.5, 
    problem: 4.4, 
    time: 4.3, 
    score: 89, 
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", 
    lastMonthly: "2026-04-05", // >30 days (Due!)
    lastQuarterly: "2026-03-12", 
    lastAnnual: "2025-07-22" 
  },
  { 
    name: "Farah Nabila", 
    id: "EMP-0267", 
    role: "Customer Experience Lead", 
    subRole: "Support", 
    teamwork: 4.5, 
    quality: 4.3, 
    problem: 4.2, 
    time: 4.0, 
    score: 88, 
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", 
    lastMonthly: "2026-05-30", 
    lastQuarterly: "2026-05-15", 
    lastAnnual: "2025-06-15" 
  },
  { 
    name: "Daniel Cheung", 
    id: "EMP-0351", 
    role: "Compliance Specialist", 
    subRole: "Legal", 
    teamwork: 4.4, 
    quality: 4.2, 
    problem: 4.3, 
    time: 3.9, 
    score: 87, 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", 
    lastMonthly: "2026-05-29", 
    lastQuarterly: "2026-05-02", 
    lastAnnual: "2025-06-20" 
  },
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
  const [employees, setEmployees] = React.useState(employeePerformanceList);
  const [selectedEmployee, setSelectedEmployee] = React.useState<any | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [modalStep, setModalStep] = React.useState<1 | 2 | 3>(1); // 1: Main Actions, 2: Select Duration, 3: View History
  const [selectedPeriod, setSelectedPeriod] = React.useState<"monthly" | "quarterly" | "annual">("monthly");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [currentView, setCurrentView] = React.useState<"dashboard" | "previous-reports" | "review-workflow">("dashboard");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Automated frontend calendar calculation engine relative to system date 2026-06-03
  const checkOverdueReviews = (emp: any) => {
    const now = new Date("2026-06-03").getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    
    const mDiff = emp.lastMonthly ? (now - new Date(emp.lastMonthly).getTime()) / oneDay : 999;
    const qDiff = emp.lastQuarterly ? (now - new Date(emp.lastQuarterly).getTime()) / oneDay : 999;
    const aDiff = emp.lastAnnual ? (now - new Date(emp.lastAnnual).getTime()) / oneDay : 999;
    
    const monthlyOverdue = mDiff > 30;
    const quarterlyOverdue = qDiff > 90;
    const annualOverdue = aDiff > 365;
    
    return {
      monthly: monthlyOverdue,
      quarterly: quarterlyOverdue,
      annual: annualOverdue,
      hasAny: monthlyOverdue || quarterlyOverdue || annualOverdue,
      mDays: Math.floor(mDiff),
      qDays: Math.floor(qDiff),
      aDays: Math.floor(aDiff)
    };
  };

  // Set default checking logic for the period picker
  React.useEffect(() => {
    if (selectedEmployee) {
      const status = checkOverdueReviews(selectedEmployee);
      if (status.monthly) {
        setSelectedPeriod("monthly");
      } else if (status.quarterly) {
        setSelectedPeriod("quarterly");
      } else if (status.annual) {
        setSelectedPeriod("annual");
      } else {
        setSelectedPeriod("monthly");
      }
    }
  }, [selectedEmployee]);

  const startReviewForEmployee = () => {
    if (!selectedEmployee) return;
    setShowModal(false);
    setCurrentView("review-workflow");
  };

  const mockHistoryData: Record<string, any[]> = {
    "EMP-0234": [
      { id: "h-1", period: "Monthly Review", date: "April 12, 2026", score: "92%", status: "Approved & Signed", lead: "Marcus Vance" },
      { id: "h-2", period: "Quarterly Appraisal", date: "February 10, 2026", score: "89%", status: "Approved & Signed", lead: "Marcus Vance" },
      { id: "h-3", period: "Annual Assessment", date: "November 20, 2025", score: "90%", status: "Archived Record", lead: "Marcus Vance" },
    ],
    "EMP-0178": [
      { id: "h-1", period: "Monthly Review", date: "May 28, 2026", score: "90%", status: "Approved & Signed", lead: "Aria Sterling" },
      { id: "h-2", period: "Monthly Review", date: "April 25, 2026", score: "88%", status: "Approved & Signed", lead: "Aria Sterling" },
      { id: "h-3", period: "Quarterly Appraisal", date: "January 15, 2026", score: "91%", status: "Approved & Signed", lead: "Aria Sterling" },
    ],
    "EMP-0312": [
      { id: "h-1", period: "Monthly Review", date: "May 02, 2026", score: "81%", status: "Approved & Signed", lead: "Dr. Harold Foster" },
      { id: "h-2", period: "Quarterly Appraisal", date: "April 10, 2026", score: "83%", status: "Approved & Signed", lead: "Dr. Harold Foster" },
      { id: "h-3", period: "Annual Assessment", date: "May 15, 2024", score: "79%", status: "Archived Record", lead: "Dr. Harold Foster" },
    ],
    "EMP-0289": [
      { id: "h-1", period: "Monthly Review", date: "April 05, 2026", score: "89%", status: "Approved & Signed", lead: "Sophia Ramirez" },
      { id: "h-2", period: "Quarterly Appraisal", date: "March 12, 2026", score: "87%", status: "Approved & Signed", lead: "Sophia Ramirez" },
    ]
  };

  const getHistoryList = (empId: string) => {
    return mockHistoryData[empId] || [
      { id: "fallback-1", period: "Monthly Review", date: "May 10, 2026", score: "85%", status: "Approved & Signed", lead: "HR Portal Admin" },
      { id: "fallback-2", period: "Quarterly Appraisal", date: "March 05, 2026", score: "84%", status: "Approved & Signed", lead: "HR Portal Admin" }
    ];
  };

  return (
    <AppLayout 
      title="Performance" 
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Performance" }]}
    >
      {/* Dynamic Success Portal Toasts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-white rounded-full px-6 py-3.5 flex items-center gap-3 shadow-2xl z-[1001]"
          >
            <div className="w-5 h-5 rounded-full bg-[#006b5f] flex items-center justify-center shrink-0">
              <Check className="h-3 w-3 text-white" />
            </div>
            <p className="text-xs sm:text-sm font-semibold tracking-wide">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {currentView === "previous-reports" && selectedEmployee ? (
        <EmployeePerformanceProfile
          employee={selectedEmployee}
          onBack={() => {
            setCurrentView("dashboard");
            setSelectedEmployee(null);
          }}
        />
      ) : currentView === "review-workflow" && selectedEmployee ? (
        <ReviewWorkflow
          employee={selectedEmployee}
          selectedPeriod={selectedPeriod}
          onCancel={() => {
            setCurrentView("dashboard");
            setSelectedEmployee(null);
          }}
          onPublishSuccess={(updatedEmployee) => {
            setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
            setCurrentView("dashboard");
            setSelectedEmployee(null);
            showToast(`Successfully published ${selectedPeriod} review cycle for ${updatedEmployee.name}!`);
          }}
        />
      ) : (
        <div className="flex flex-col xl:flex-row gap-5 relative">
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
                <div>
                   <h2 className="text-[16px] font-bold text-[#203430]">Employee Performance</h2>
                   <p className="text-[12px] text-[#63716E] mt-1 font-medium">Select any employee row to verify timeline latency or initiate review actions</p>
                </div>
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
                      {employees.map((e, i) => {
                        const state = checkOverdueReviews(e);
                        return (
                          <tr 
                            key={e.id} 
                            onClick={() => {
                              setSelectedEmployee(e);
                              setModalStep(1);
                              setShowModal(true);
                            }}
                            className="hover:bg-[#F7F7F7] active:bg-[#f2f2f2] transition-colors group h-[64px] cursor-pointer"
                            id={`emrow-${e.id.toLowerCase()}`}
                          >
                            <td className="px-6 py-2 whitespace-nowrap">
                               <div className="flex items-center gap-3">
                                  <img src={e.avatar} className="h-8 w-8 rounded-full object-cover shadow-sm bg-brand" alt={e.name} />
                                  <div className="flex flex-col">
                                     <div className="flex items-center gap-2">
                                        <span className="text-[12px] sm:text-[13px] font-bold text-[#203430] leading-none whitespace-nowrap group-hover:text-brand transition-colors">{e.name}</span>
                                        {state.hasAny && (
                                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-tight shrink-0">
                                             <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                             Due
                                          </span>
                                        )}
                                     </div>
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
                        );
                      })}
                   </tbody>
                </table>
             </div>

             <div className="p-6 border-t border-[#E5E6E6] flex flex-col sm:flex-row items-center justify-between gap-6 mt-auto">
                <div className="flex items-center gap-3">
                   <span className="text-[14px] text-[#63716E]">Show</span>
                   <button className="flex items-center gap-2 bg-[#F7F7F7] h-[28px] px-3 rounded-[8px] text-[12px] font-bold text-[#203430]">
                      7 <ChevronDown className="h-3 w-3" />
                   </button>
                   <span className="text-[14px] text-[#63716E]">of 7 results</span>
                </div>
                <div className="flex items-center gap-2">
                   <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F5F5F5] text-[#203430] disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
                   <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-brand text-white text-[12px] font-bold">1</button>
                   <span className="px-1 text-[12px] text-[#63716E]">...</span>
                   <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F5F5F5] text-[#203430] disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
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
                          <img src={p.avatar} className="h-8 w-8 rounded-full object-cover shadow-sm bg-brand" alt={p.name} />
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
           <Card className="min-h-[252px] p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-between">
              <div>
                 <div className="w-full flex items-center justify-between mb-4">
                    <h3 className="text-[16px] font-bold text-[#203430]">Time Management Alerts</h3>
                    <button><MoreHorizontal className="h-4 w-4 text-[#63716E]" /></button>
                 </div>
                 <div className="space-y-4">
                    {alerts.map((a, i) => (
                       <React.Fragment key={a.name}>
                          {i > 0 && <div className="border-t border-[#E5E6E6]" />}
                          <div className="flex gap-3.5 py-1">
                             <div className="relative shrink-0">
                                <img src={a.avatar} className="h-8 w-8 rounded-full object-cover shadow-sm" alt={a.name} />
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
              </div>
           </Card>
        </div>
      </div>
      )}

      {/* Modern High-Fidelity Performance Initiation Modal Grid Layer */}
      <AnimatePresence>
        {showModal && selectedEmployee && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop Overlay with motion */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            {/* Step 1 & Step 2 Content Modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="bg-white w-full max-w-[600px] rounded-2xl shadow-2xl flex flex-col relative z-50 overflow-hidden border border-slate-100 max-h-[90vh]"
            >
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-50 cursor-pointer hidden sm:block"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {modalStep === 1 && (
                <div id="step-1" className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-6 md:p-8 pb-4">
                    <h1 className="text-xl md:text-2xl font-bold text-[#203430] tracking-tight">Performance Actions</h1>
                    <p className="text-sm text-[#63716E] mt-1.5">Choose an action for {selectedEmployee.name} ({selectedEmployee.id})</p>
                  </div>

                  {/* Employee Profile Mini-Card */}
                  <div className="mx-6 md:mx-8 mb-6 p-4 bg-[#F7F7F7] rounded-xl border border-slate-100 flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#E4F2D3] shrink-0 bg-[#006b5f]/15">
                      <img 
                        alt={`${selectedEmployee.name} Profile`} 
                        className="w-full h-full object-cover" 
                        src={selectedEmployee.avatar} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-[#203430] truncate">{selectedEmployee.name}</h3>
                      <p className="text-xs text-[#63716E] mt-0.5 truncate">{selectedEmployee.role} • {selectedEmployee.subRole}</p>
                    </div>
                    <div className="shrink-0">
                      <span className="bg-[#E4F2D3] text-[#0E4D41] font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border border-[#0E4D41]/10">
                        ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Overdue Review Status warnings */}
                  {(() => {
                    const status = checkOverdueReviews(selectedEmployee);
                    if (status.hasAny) {
                      return (
                        <div className="mx-6 md:mx-8 mb-5 p-3 rounded-xl bg-orange-50/75 border border-orange-200 text-[#7a4100] flex gap-2.5 items-start">
                          <AlertTriangle className="h-4.5 w-4.5 text-orange-600 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-[12px] font-extrabold tracking-tight uppercase">Timing Latency Detected:</h4>
                            <p className="text-[11px] font-medium leading-relaxed mt-0.5">
                              {status.monthly && `Monthly Report is ${status.mDays - 30} days past due. `}
                              {status.quarterly && `Quarterly Appraisal is ${status.qDays - 90} days past due. `}
                              {status.annual && `Annual Review is ${status.aDays - 365} days past due.`}
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Action Cards */}
                  <div className="px-6 md:px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Action 1: Start Review */}
                    <button 
                      type="button"
                      className="group flex flex-col p-5 bg-white border border-slate-150 hover:border-[#006b5f] hover:bg-[#E4F2D3]/10 transition-all text-left rounded-xl cursor-pointer"
                      onClick={() => setModalStep(2)}
                    >
                      <div className="w-10 h-10 mb-4 rounded-xl bg-[#E4F2D3] text-[#0E4D41] flex items-center justify-center group-hover:bg-[#006b5f] group-hover:text-white transition-colors">
                        <ClipboardSignature className="h-5 w-5" />
                      </div>
                      <h4 className="text-[14px] font-bold text-[#203430] mb-1">Start New Performance Review</h4>
                      <p className="text-[12px] text-[#63716E] leading-normal font-medium">Initiate a new evaluation cycle across Lead, Manager, and HR stages.</p>
                    </button>

                    {/* Action 2: View History */}
                    <button 
                      type="button"
                      className="group flex flex-col p-5 bg-white border border-slate-150 hover:border-[#006b5f] hover:bg-[#E4F2D3]/10 transition-all text-left rounded-xl cursor-pointer"
                      onClick={() => {
                        setCurrentView("previous-reports");
                        setShowModal(false);
                      }}
                    >
                      <div className="w-10 h-10 mb-4 rounded-xl bg-slate-100 text-[#006b5f] flex items-center justify-center group-hover:bg-[#006b5f] group-hover:text-white transition-colors">
                        <History className="h-5 w-5" />
                      </div>
                      <h4 className="text-[14px] font-bold text-[#203430] mb-1">View Previous Reports</h4>
                      <p className="text-[12px] text-[#63716E] leading-normal font-medium">Access historical performance data, competency scores, and past feedback archive.</p>
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="px-6 md:px-8 py-4 bg-[#F7F7F7] flex justify-end gap-3 mt-auto border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-[#203430] hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer h-11 flex items-center justify-center"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {modalStep === 2 && (
                <div id="step-2" className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-6 md:p-8 pb-4 border-b border-slate-100">
                    <h1 className="text-xl md:text-2xl font-bold text-[#203430] tracking-tight">Select Review Period</h1>
                    <p className="text-sm text-[#63716E] mt-1.5">Define the evaluation timeline structure for {selectedEmployee.name}.</p>
                  </div>

                  {/* Selection Options */}
                  <div className="p-6 md:p-8 space-y-4 overflow-y-auto max-h-[50vh]">
                    {/* Option: Monthly */}
                    <label className={cn(
                      "relative flex items-center p-4 border rounded-xl cursor-pointer hover:bg-[#F7F7F7] transition-all group focus-within:ring-2 focus-within:ring-[#006b5f]/20",
                      selectedPeriod === "monthly" ? "border-[#006b5f] bg-[#E4F2D3]/10" : "border-slate-150"
                    )}>
                      <input 
                        type="radio" 
                        name="period" 
                        value="monthly"
                        checked={selectedPeriod === "monthly"}
                        onChange={() => setSelectedPeriod("monthly")}
                        className="peer sr-only"
                      />
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center mr-4 group-hover:bg-white transition-colors shrink-0">
                        <Clock className="h-5 w-5 text-[#006b5f]" />
                      </div>
                      <div className="flex-1 pr-6">
                        <span className="font-bold text-[14px] text-[#203430]">Monthly Review</span>
                        <p className="text-[12px] text-[#63716E] mt-0.5 font-medium">For regular monthly talent touchpoints and alignment metrics.</p>
                      </div>
                      <div className="absolute right-4 w-5 h-5 border-2 border-slate-350 rounded-full flex items-center justify-center peer-checked:border-[#006b5f] group-hover:border-[#006b5f] transition-all">
                        {selectedPeriod === "monthly" && <div className="w-2.5 h-2.5 bg-[#006b5f] rounded-full" />}
                      </div>
                    </label>

                    {/* Option: Quarterly */}
                    <label className={cn(
                      "relative flex items-center p-4 border rounded-xl cursor-pointer hover:bg-[#F7F7F7] transition-all group focus-within:ring-2 focus-within:ring-[#006b5f]/20",
                      selectedPeriod === "quarterly" ? "border-[#006b5f] bg-[#E4F2D3]/10" : "border-slate-150"
                    )}>
                      <input 
                        type="radio" 
                        name="period" 
                        value="quarterly"
                        checked={selectedPeriod === "quarterly"}
                        onChange={() => setSelectedPeriod("quarterly")}
                        className="peer sr-only"
                      />
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center mr-4 group-hover:bg-white transition-colors shrink-0">
                        <TrendingUp className="h-5 w-5 text-[#006b5f]" />
                      </div>
                      <div className="flex-1 pr-6">
                        <span className="font-bold text-[14px] text-[#203430]">Quarterly Appraisal</span>
                        <p className="text-[12px] text-[#63716E] mt-0.5 font-medium">Standard quarterly performance milestone and KPI auditing.</p>
                      </div>
                      <div className="absolute right-4 w-5 h-5 border-2 border-slate-350 rounded-full flex items-center justify-center peer-checked:border-[#006b5f] group-hover:border-[#006b5f] transition-all">
                        {selectedPeriod === "quarterly" && <div className="w-2.5 h-2.5 bg-[#006b5f] rounded-full" />}
                      </div>
                    </label>

                    {/* Option: Annual */}
                    <label className={cn(
                      "relative flex items-center p-4 border rounded-xl cursor-pointer hover:bg-[#F7F7F7] transition-all group focus-within:ring-2 focus-within:ring-[#006b5f]/20",
                      selectedPeriod === "annual" ? "border-[#006b5f] bg-[#E4F2D3]/10" : "border-slate-150"
                    )}>
                      <input 
                        type="radio" 
                        name="period" 
                        value="annual"
                        checked={selectedPeriod === "annual"}
                        onChange={() => setSelectedPeriod("annual")}
                        className="peer sr-only"
                      />
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center mr-4 group-hover:bg-white transition-colors shrink-0">
                        <Award className="h-5 w-5 text-[#006b5f]" />
                      </div>
                      <div className="flex-1 pr-6">
                        <span className="font-bold text-[14px] text-[#203430]">Annual Review</span>
                        <p className="text-[12px] text-[#63716E] mt-0.5 font-medium">Comprehensive year-end alignment, bonus audit & salary review.</p>
                      </div>
                      <div className="absolute right-4 w-5 h-5 border-2 border-slate-350 rounded-full flex items-center justify-center peer-checked:border-[#006b5f] group-hover:border-[#006b5f] transition-all">
                        {selectedPeriod === "annual" && <div className="w-2.5 h-2.5 bg-[#006b5f] rounded-full" />}
                      </div>
                    </label>
                  </div>

                  {/* Footer */}
                  <div className="px-6 md:px-8 py-4 bg-[#F7F7F7] flex justify-between items-center mt-auto border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setModalStep(1)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer h-11"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </button>
                    <button 
                      type="button"
                      onClick={startReviewForEmployee}
                      className="bg-[#006b5f] hover:bg-[#005047] text-white font-bold text-xs h-11 px-6 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      <span>Confirm & Start Review</span>
                    </button>
                  </div>
                </div>
              )}

              {modalStep === 3 && (
                <div id="step-3" className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-6 md:p-8 pb-4 border-b border-slate-100">
                    <h1 className="text-xl md:text-2xl font-bold text-[#203430] tracking-tight">Performance History</h1>
                    <p className="text-sm text-[#63716E] mt-1.5">Historical report cards and approval trail logs for {selectedEmployee.name}.</p>
                  </div>

                  {/* History List */}
                  <div className="p-6 md:p-8 space-y-4 overflow-y-auto max-h-[50vh] custom-scrollbar">
                    {getHistoryList(selectedEmployee.id).map((historyItem: any, index: number) => (
                      <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4 hover:bg-slate-100/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-slate-200/50 flex items-center justify-center text-[#0E4D41] shrink-0 font-bold">
                          {historyItem.score}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-[#203430]">{historyItem.period}</span>
                            <span className="text-[11px] font-extrabold text-[#0E4D41] uppercase tracking-wide">{historyItem.status}</span>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-[#63716E]">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 shrink-0" />
                              {historyItem.date}
                            </span>
                            <span>•</span>
                            <span>Lead: {historyItem.lead}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-6 md:px-8 py-4 bg-[#F7F7F7] flex justify-between items-center mt-auto border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setModalStep(1)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer h-11"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-[#203430] hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer h-11 flex items-center justify-center"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
