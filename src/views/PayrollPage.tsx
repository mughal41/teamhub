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
  FileText,
  X,
  Plus,
  Trash2,
  Info,
  Calendar,
  Send,
  Edit,
  RotateCcw,
  Check,
  AlertCircle,
  CreditCard,
  User,
  Activity,
  Award
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

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
  { name: "Mia Torres", id: "EMP-0289", role: "HR Officer", subRole: "Human Resources", date: "28 Jun 35", salary: "$3,200", allowance: "$300", overtime: "$65", incen: "$120", deduct: "$110", total: "$3,575", status: "Pending", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Daniel Cheung", id: "EMP-0291", role: "Compliance Specialist", subRole: "Operations", date: "28 Jun 35", salary: "$2,900", allowance: "$250", overtime: "$45", incen: "$80", deduct: "$100", total: "$3,175", status: "Draft", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Farah Nabila", id: "EMP-0320", role: "Customer Experience Lead", subRole: "Customer Service", date: "28 Jun 35", salary: "$3,000", allowance: "$270", overtime: "$55", incen: "$90", deduct: "$125", total: "$3,290", status: "Paid", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Lina Armand", id: "EMP-0312", role: "Lab Analyst", subRole: "R&D", date: "28 Jun 35", salary: "$2,000", allowance: "$150", overtime: "—", incen: "$60", deduct: "$90", total: "$2,120", status: "Pending", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Jacob Yuen", id: "EMP-0115", role: "Site Supervisor", subRole: "Operations", date: "28 Jun 35", salary: "$3,300", allowance: "$320", overtime: "$70", incen: "$110", deduct: "$140", total: "$3,660", status: "Paid", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Sara Kim", id: "EMP-0356", role: "Customer Support", subRole: "Customer Service", date: "28 Jun 35", salary: "$800", allowance: "$50", overtime: "—", incen: "—", deduct: "$20", total: "$830", status: "Draft", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Anya Rodriguez", id: "EMP-0275", role: "Graphic Designer", subRole: "Marketing", date: "28 Jun 35", salary: "$2,200", allowance: "$180", overtime: "$40", incen: "$70", deduct: "$85", total: "$2,405", status: "Paid", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Kelvin Yu", id: "EMP-0159", role: "Training Coordinator", subRole: "HR", date: "28 Jun 35", salary: "$2,500", allowance: "$200", overtime: "$55", incen: "$100", deduct: "$100", total: "$2,755", status: "Paid", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
];

function SegmentedProgressBar({ distribution }: { distribution: { color: string, percentage: number }[] }) {
  const segments = 60;
  return (
    <div className="flex gap-[2px] w-full h-[41px]">
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
  const [payrolls, setPayrolls] = React.useState(payrollList);
  const [selectedEmployee, setSelectedEmployee] = React.useState<typeof payrollList[0] | null>(null);
  const [showModal, setShowModal] = React.useState<"none" | "finalize" | "detail">("none");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);

  // Finalize payroll editable form states
  const [editBaseSalary, setEditBaseSalary] = React.useState(0);
  const [editHousing, setEditHousing] = React.useState(500);
  const [editTransport, setEditTransport] = React.useState(150);
  const [editEOBI, setEditEOBI] = React.useState(100);
  const [editLoan, setEditLoan] = React.useState(200);

  // Custom rows
  const [customEarnings, setCustomEarnings] = React.useState<{ id: string; name: string; value: number; desc: string }[]>([]);
  const [customDeductions, setCustomDeductions] = React.useState<{ id: string; name: string; value: number; desc: string }[]>([]);

  // Custom new item creator states
  const [newEarningName, setNewEarningName] = React.useState("");
  const [newEarningVal, setNewEarningVal] = React.useState("");
  const [newEarningDesc, setNewEarningDesc] = React.useState("");
  const [showAddEarningForm, setShowAddEarningForm] = React.useState(false);

  const [newDeductionName, setNewDeductionName] = React.useState("");
  const [newDeductionVal, setNewDeductionVal] = React.useState("");
  const [newDeductionDesc, setNewDeductionDesc] = React.useState("");
  const [showAddDeductionForm, setShowAddDeductionForm] = React.useState(false);

  const [adminRemarks, setAdminRemarks] = React.useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(prev => prev === msg ? null : prev);
    }, 4500);
  };

  const handleEmployeeClick = (employee: typeof payrollList[0]) => {
    setSelectedEmployee(employee);
    if (employee.status === "Paid") {
      setShowModal("detail");
    } else {
      const baseSal = parseFloat(employee.salary.replace(/[$,]/g, "")) || 0;
      const allowVal = parseFloat(employee.allowance.replace(/[$,]/g, "")) || 0;
      
      setEditBaseSalary(baseSal);
      setEditHousing(allowVal > 0 ? Math.round(allowVal * 0.7) : 500);
      setEditTransport(allowVal > 0 ? Math.round(allowVal * 0.3) : 150);
      
      const deductVal = parseFloat(employee.deduct.replace(/[$,]/g, "")) || 0;
      setEditEOBI(deductVal > 0 ? Math.round(deductVal * 0.35) : 100);
      setEditLoan(deductVal > 0 ? Math.round(deductVal * 0.65) : 200);
      
      const incVal = parseFloat(employee.incen.replace(/[$,]/g, "")) || 0;
      setCustomEarnings(incVal > 0 ? [{ id: "inc_" + Date.now(), name: "Performance Incentive", value: incVal, desc: "Standard Commendation" }] : []);
      setCustomDeductions([]);
      setAdminRemarks("");
      
      setShowAddEarningForm(false);
      setShowAddDeductionForm(false);
      setShowModal("finalize");
    }
  };

  const handleReset = () => {
    if (!selectedEmployee) return;
    const allowVal = parseFloat(selectedEmployee.allowance.replace(/[$,]/g, "")) || 0;
    setEditHousing(allowVal > 0 ? Math.round(allowVal * 0.7) : 500);
    setEditTransport(allowVal > 0 ? Math.round(allowVal * 0.3) : 150);
    
    const deductVal = parseFloat(selectedEmployee.deduct.replace(/[$,]/g, "")) || 0;
    setEditEOBI(deductVal > 0 ? Math.round(deductVal * 0.35) : 100);
    setEditLoan(deductVal > 0 ? Math.round(deductVal * 0.65) : 200);
    
    const incVal = parseFloat(selectedEmployee.incen.replace(/[$,]/g, "")) || 0;
    setCustomEarnings(incVal > 0 ? [{ id: "inc_" + Date.now(), name: "Performance Incentive", value: incVal, desc: "Standard Commendation" }] : []);
    setCustomDeductions([]);
    setAdminRemarks("");
    showToast("Calculations reset to default values.");
  };

  const handleSaveDraft = () => {
    if (!selectedEmployee) return;
    setPayrolls(prev => prev.map(p => p.id === selectedEmployee.id ? { ...p, status: "Draft" } : p));
    setShowModal("none");
    showToast(`Payroll for ${selectedEmployee.name} saved as Draft.`);
  };

  const handleFinalizeAndPay = () => {
    if (!selectedEmployee) return;
    const fedTax = Math.round(editBaseSalary * 0.15);
    const totEarn = editBaseSalary + editHousing + editTransport + customEarnings.reduce((acc, curr) => acc + curr.value, 0);
    const totDed = fedTax + editEOBI + editLoan + customDeductions.reduce((acc, curr) => acc + curr.value, 0);
    const finalNet = totEarn - totDed;
    
    setPayrolls(prev => prev.map(p => p.id === selectedEmployee.id ? { 
      ...p, 
      status: "Paid",
      allowance: `$${(editHousing + editTransport).toLocaleString()}`,
      deduct: `$${(totDed).toLocaleString()}`,
      total: `$${finalNet.toLocaleString()}`
    } : p));
    setShowModal("none");
    showToast(`Payroll for ${selectedEmployee.name} is now Paid!`);
  };

  const addCustomEarningItem = () => {
    const valueNum = parseFloat(newEarningVal) || 0;
    if (!newEarningName.trim() || valueNum <= 0) {
      showToast("Please provide element name and positive amount");
      return;
    }
    setCustomEarnings(prev => [
      ...prev,
      {
        id: "earn_" + Date.now(),
        name: newEarningName,
        value: valueNum,
        desc: newEarningDesc || "Custom Allowance"
      }
    ]);
    setNewEarningName("");
    setNewEarningVal("");
    setNewEarningDesc("");
    setShowAddEarningForm(false);
  };

  const addCustomDeductionItem = () => {
    const valueNum = parseFloat(newDeductionVal) || 0;
    if (!newDeductionName.trim() || valueNum <= 0) {
      showToast("Please provide deduction name and positive amount");
      return;
    }
    setCustomDeductions(prev => [
      ...prev,
      {
        id: "ded_" + Date.now(),
        name: newDeductionName,
        value: valueNum,
        desc: newDeductionDesc || "Custom Deduction"
      }
    ]);
    setNewDeductionName("");
    setNewDeductionVal("");
    setNewDeductionDesc("");
    setShowAddDeductionForm(false);
  };

  // Real time calculation variables
  const fedTax = Math.round(editBaseSalary * 0.15);
  const totalEarnings = editBaseSalary + editHousing + editTransport + customEarnings.reduce((acc, curr) => acc + curr.value, 0);
  const totalDeductions = fedTax + editEOBI + editLoan + customDeductions.reduce((acc, curr) => acc + curr.value, 0);
  const netPay = totalEarnings - totalDeductions;
  
  const takeHomePercentage = totalEarnings > 0 ? Math.round((netPay / totalEarnings) * 100) : 0;

  // Filter list
  const filteredPayrolls = payrolls.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.subRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout 
      title="Payroll" 
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Payroll" }]}
    >
      <div className="space-y-5 relative">
        {/* Real-time Interactive Toast Indicator */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 bg-[#203430] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-brand animate-bounce">
            <CheckCircle className="h-5 w-5 text-brand animate-pulse" />
            <span className="text-[13px] font-semibold">{toast}</span>
          </div>
        )}

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

               <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-left">
                  {[
                    { label: 'Salary', percentage: '89.0%', amount: '$352,000', color: '#35BFA3' },
                    { label: 'Allowances', percentage: '3.8%', amount: '$15,000', color: '#0E4D41' },
                    { label: 'Deductions', percentage: '4.0%', amount: '$16,200', color: '#A4ACAB' },
                    { label: 'Incentives', percentage: '2.0%', amount: '$7,900', color: '#F8C947' },
                    { label: 'Overtime', percentage: '1.2%', amount: '$4,800', color: '#0E4D41' },
                  ].map(item => (
                     <div key={item.label} className="flex gap-2 text-left">
                        <div className="h-2.5 w-2.5 rounded-[2px] mt-1 shrink-0" style={{ backgroundColor: item.color }} />
                        <div className="flex flex-col text-left">
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
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       placeholder="Search employee, ID, etc" 
                       className="pl-10 pr-4 py-2 w-[223px] h-[34px] bg-[#F7F7F7] rounded-[8px] border-none text-[12px] text-[#63716E] outline-none focus:ring-1 focus:ring-brand"
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
                     {filteredPayrolls.map((e) => (
                       <tr 
                         key={e.id} 
                         onClick={() => handleEmployeeClick(e)}
                         className="hover:bg-[#F7F7F7]/80 transition-colors group cursor-pointer text-left"
                       >
                         <td className="px-6 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-3 text-left">
                               <img src={e.avatar} className="h-8 w-8 rounded-full object-cover shadow-sm bg-brand" />
                               <div className="flex flex-col text-left">
                                  <span className="text-[11px] font-bold text-[#203430] leading-none whitespace-nowrap group-hover:text-brand">{e.name}</span>
                                  <span className="text-[10px] text-[#63716E] mt-1 uppercase font-bold">{e.id}</span>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-3 text-left">
                            <div className="flex flex-col text-left">
                               <span className="text-[11px] font-bold text-[#203430] leading-none whitespace-nowrap">{e.role}</span>
                               <span className="text-[10px] text-[#63716E] mt-1 font-bold whitespace-nowrap">{e.subRole}</span>
                            </div>
                         </td>
                         <td className="px-6 py-3 text-[11px] font-bold text-[#203430] whitespace-nowrap uppercase tracking-tighter text-left">{e.date}</td>
                         <td className="px-6 py-3 text-[11px] font-bold text-[#203430] text-left">{e.salary}</td>
                         <td className="px-6 py-3 text-[11px] font-bold text-[#63716E] text-left">{e.allowance}</td>
                         <td className="px-6 py-3 text-[11px] font-bold text-[#63716E] text-left">{e.overtime}</td>
                         <td className="px-6 py-3 text-[11px] font-bold text-[#63716E] text-left">{e.incen}</td>
                         <td className="px-6 py-3 text-[11px] font-bold text-[#63716E] text-left">{e.deduct}</td>
                         <td className="px-6 py-3 text-[11px] font-bold text-[#0E4D41] whitespace-nowrap text-left">{e.total}</td>
                         <td className="px-6 py-3 text-left">
                            {e.status === "Paid" && (
                              <div className="flex items-center gap-1 bg-brand px-2 py-1 rounded-[12px] w-fit min-w-[49px]">
                                 <CheckCircle className="h-3 w-3 text-white" />
                                 <span className="text-[11px] text-white">Paid</span>
                              </div>
                            )}
                            {e.status === "Pending" && (
                              <div className="flex items-center gap-1 bg-[#F8C947] px-2 py-1 rounded-[12px] w-fit min-w-[49px]">
                                 <Clock className="h-3 w-3 text-white" />
                                 <span className="text-[11px] text-white">Pending</span>
                              </div>
                            )}
                            {e.status === "Draft" && (
                              <div className="flex items-center gap-1 bg-[#A4ACAB] px-2 py-1 rounded-[12px] w-fit min-w-[49px]">
                                 <FileText className="h-3 w-3 text-white" />
                                 <span className="text-[11px] text-white">Draft</span>
                              </div>
                            )}
                         </td>
                         <td className="px-6 py-3 text-left" onClick={(event) => event.stopPropagation()}>
                            <button 
                              onClick={() => {
                                showToast(`Downloading payslip for ${e.name}...`);
                              }}
                              className="flex items-center gap-2 bg-[#E4F2D3] h-[24px] px-2 rounded-[6px] text-[11px] font-medium text-[#203430] whitespace-nowrap hover:bg-brand hover:text-white transition-all"
                            >
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
                  <span className="text-[14px] text-[#63716E]">of {filteredPayrolls.length} results</span>
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

      {/* ----------------- FINALIZE PAYROLL MODAL ----------------- */}
      {showModal === "finalize" && selectedEmployee && (
        <div className="fixed inset-0 bg-[#161c1a]/60 backdrop-blur-[4px] z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl h-[85vh] max-h-[850px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E6E6] animate-in fade-in zoom-in-95 duration-200 text-left">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E5E6E6] flex justify-between items-center bg-[#F8F9FA]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E4F2D3] flex items-center justify-center text-[#0E4D41]">
                  <Check className="h-6 w-6 text-[#0E4D41]" />
                </div>
                <div className="text-left">
                  <h3 className="text-[18px] font-bold text-[#203430] leading-snug">Finalize Payroll</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#35BFA3] animate-pulse"></span>
                    <span className="text-[10px] text-[#63716E] uppercase tracking-wider font-bold">
                      Status: {selectedEmployee.status === "Pending" ? "Reviewing Pending" : "Reviewing Draft"}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowModal("none")}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F5] text-[#203430] transition-colors"
                id="close_modal_button_finalize"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Main */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden text-left bg-white">
              {/* Left Column - Scrollable Form */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 text-left">
                
                {/* 1. Employee Profile Summary header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#F8F9FA] p-4 rounded-xl border border-[#E5E6E6]">
                  <img 
                    alt="Employee Avatar" 
                    className="h-14 w-14 rounded-full object-cover border-2 border-brand/20 shadow-sm shrink-0" 
                    src={selectedEmployee.avatar} 
                  />
                  <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="text-left">
                      <p className="text-[10px] text-[#63716E] uppercase font-bold">Employee Name</p>
                      <p className="text-[13px] font-bold text-[#203430]">{selectedEmployee.name}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-[#63716E] uppercase font-bold">Employee ID</p>
                      <p className="text-[13px] font-bold text-[#203430]">{selectedEmployee.id}</p>
                    </div>
                    <div className="col-span-2 lg:col-span-1 text-left">
                      <p className="text-[10px] text-[#63716E] uppercase font-bold">Job Title / Role</p>
                      <p className="text-[13px] font-bold text-[#203430]">{selectedEmployee.role}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 mt-3 sm:mt-0">
                    <p className="text-[10px] text-[#63716E] uppercase font-bold">Standard Base Salary</p>
                    <p className="text-[20px] font-bold text-[#0E4D41]">{selectedEmployee.salary}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
                  {/* Earnings Panel */}
                  <div className="space-y-4 text-left">
                    <div className="flex justify-between items-center pb-2 border-b border-[#E5E6E6]">
                      <h4 className="text-[13px] font-bold text-brand flex items-center gap-1.5">
                        <Plus className="h-4 w-4 text-brand" />
                        Earnings & Allowances
                      </h4>
                      <button 
                        onClick={() => setShowAddEarningForm(!showAddEarningForm)}
                        className="text-[10px] font-bold text-brand hover:underline uppercase tracking-tight"
                      >
                        + Add Custom
                      </button>
                    </div>

                    {/* Custom Add Earning Mini Panel */}
                    {showAddEarningForm && (
                      <div className="p-3 bg-brand/5 rounded-lg border border-brand/20 space-y-2 animate-in slide-in-from-top-2 duration-300">
                        <div className="text-[11px] font-bold text-[#203430]">Add Custom Inflow / Incentive</div>
                        <input 
                          type="text" 
                          placeholder="Allowance Title (e.g. Performance Bonus)" 
                          value={newEarningName}
                          onChange={(e) => setNewEarningName(e.target.value)}
                          className="w-full text-[12px] bg-white border border-[#E5E6E6] rounded-md px-2 py-1 focus:ring-1 focus:ring-brand focus:border-brand"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="number" 
                            placeholder="Amount ($)" 
                            value={newEarningVal}
                            onChange={(e) => setNewEarningVal(e.target.value)}
                            className="text-[12px] bg-white border border-[#E5E6E6] rounded-md px-2 py-1 focus:ring-1 focus:ring-brand focus:border-brand"
                          />
                          <input 
                            type="text" 
                            placeholder="Description (optional)" 
                            value={newEarningDesc}
                            onChange={(e) => setNewEarningDesc(e.target.value)}
                            className="text-[12px] bg-white border border-[#E5E6E6] rounded-md px-2 py-1 focus:ring-1 focus:ring-brand focus:border-brand"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button 
                            onClick={() => setShowAddEarningForm(false)} 
                            className="px-2 py-1 text-[11px] font-medium text-[#63716E] bg-[#F7F7F7] rounded hover:bg-slate-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={addCustomEarningItem} 
                            className="px-2 py-1 text-[11px] font-medium text-white bg-brand rounded hover:opacity-95 transition-all"
                          >
                            Add Earning
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 text-left">
                      {/* Fixed Base Salary Row */}
                      <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-xl border border-[#E5E6E6]">
                        <div className="text-left">
                          <p className="text-[12px] font-bold text-[#203430]">Base Salary</p>
                          <p className="text-[10px] text-[#63716E] italic">Standard Monthly Pay</p>
                        </div>
                        <span className="text-[13px] font-black text-[#203430]">${editBaseSalary.toLocaleString()}</span>
                      </div>

                      {/* Housing Allowance Editable Row */}
                      <div className="flex items-center justify-between p-3 bg-brand/5 rounded-xl border border-brand/10 text-left">
                        <div className="text-left">
                          <p className="text-[12px] font-bold text-[#203430]">Housing Allowance</p>
                          <p className="text-[10px] text-[#63716E] italic">Housing & Lodging Support</p>
                        </div>
                        <div className="flex items-center gap-1 bg-white border border-[#E5E6E6] px-2 py-1 rounded-lg">
                          <span className="text-[12px] font-bold text-brand">$</span>
                          <input 
                            type="number" 
                            value={editHousing} 
                            onChange={(e) => setEditHousing(Math.max(0, parseInt(e.target.value) || 0))} 
                            className="w-16 text-right font-bold text-[12px] text-brand border-none p-0 focus:ring-0 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Transport Allowance Editable Row */}
                      <div className="flex items-center justify-between p-3 bg-brand/5 rounded-xl border border-brand/10 text-left">
                        <div className="text-left">
                          <p className="text-[12px] font-bold text-[#203430]">Transport Allowance</p>
                          <p className="text-[10px] text-[#63716E] italic">Monthly Fuel & Commute</p>
                        </div>
                        <div className="flex items-center gap-1 bg-white border border-[#E5E6E6] px-2 py-1 rounded-lg">
                          <span className="text-[12px] font-bold text-brand">$</span>
                          <input 
                            type="number" 
                            value={editTransport} 
                            onChange={(e) => setEditTransport(Math.max(0, parseInt(e.target.value) || 0))} 
                            className="w-16 text-right font-bold text-[12px] text-brand border-none p-0 focus:ring-0 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Custom Earnings List */}
                      {customEarnings.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200 animate-in slide-in-from-top-2 duration-300">
                          <div className="flex-1 text-left">
                            <p className="text-[12px] font-bold text-[#203430]">{item.name}</p>
                            <p className="text-[10px] text-[#63716E]">{item.desc}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[12px] font-bold text-brand">${item.value.toLocaleString()}</span>
                            <button 
                              onClick={() => setCustomEarnings(prev => prev.filter(c => c.id !== item.id))} 
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deductions Panel */}
                  <div className="space-y-4 text-left">
                    <div className="flex justify-between items-center pb-2 border-b border-[#E5E6E6]">
                      <h4 className="text-[13px] font-bold text-red-600 flex items-center gap-1.5">
                        <Trash2 className="h-4 w-4 text-red-600" />
                        Deductions (Outflow)
                      </h4>
                      <button 
                        onClick={() => setShowAddDeductionForm(!showAddDeductionForm)}
                        className="text-[10px] font-bold text-red-600 hover:underline uppercase tracking-tight"
                      >
                        + Add Custom
                      </button>
                    </div>

                    {/* Custom Add Deduction Mini Panel */}
                    {showAddDeductionForm && (
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200 space-y-2 animate-in slide-in-from-top-2 duration-300">
                        <div className="text-[11px] font-bold text-[#203430]">Add Custom Deduction</div>
                        <input 
                          type="text" 
                          placeholder="Deduction Title (e.g. Health Premium)" 
                          value={newDeductionName}
                          onChange={(e) => setNewDeductionName(e.target.value)}
                          className="w-full text-[12px] bg-white border border-[#E5E6E6] rounded-md px-2 py-1 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="number" 
                            placeholder="Amount ($)" 
                            value={newDeductionVal}
                            onChange={(e) => setNewDeductionVal(e.target.value)}
                            className="text-[12px] bg-white border border-[#E5E6E6] rounded-md px-2 py-1 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                          />
                          <input 
                            type="text" 
                            placeholder="Description (optional)" 
                            value={newDeductionDesc}
                            onChange={(e) => setNewDeductionDesc(e.target.value)}
                            className="text-[12px] bg-white border border-[#E5E6E6] rounded-md px-2 py-1 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button 
                            onClick={() => setShowAddDeductionForm(false)} 
                            className="px-2 py-1 text-[11px] font-medium text-[#63716E] bg-slate-100 rounded hover:bg-slate-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={addCustomDeductionItem} 
                            className="px-2 py-1 text-[11px] font-medium text-white bg-red-600 rounded hover:opacity-95 transition-all"
                          >
                            Add Deduction
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 text-left">
                      {/* Fixed Federal Tax Row */}
                      <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-xl border border-[#E5E6E6] text-left">
                        <div className="text-left">
                          <p className="text-[12px] font-bold text-[#203430]">Federal Tax (PAYE)</p>
                          <p className="text-[10px] text-[#63716E] italic">Calculated Bracket (15%)</p>
                        </div>
                        <span className="text-[13px] font-black text-red-600">-${fedTax.toLocaleString()}</span>
                      </div>

                      {/* EOBI Contributions */}
                      <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100 text-left">
                        <div className="text-left">
                          <p className="text-[12px] font-bold text-[#203430]">EOBI Pension Fund</p>
                          <p className="text-[10px] text-[#63716E] italic">Social & Pension Recovery</p>
                        </div>
                        <div className="flex items-center gap-1 bg-white border border-[#E5E6E6] px-2 py-1 rounded-lg">
                          <span className="text-[12px] font-bold text-red-600">$</span>
                          <input 
                            type="number" 
                            value={editEOBI} 
                            onChange={(e) => setEditEOBI(Math.max(0, parseInt(e.target.value) || 0))} 
                            className="w-16 text-right font-bold text-[12px] text-red-600 border-none p-0 focus:ring-0 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Loan Recovery */}
                      <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100 text-left">
                        <div className="text-left">
                          <p className="text-[12px] font-bold text-[#203430]">Loan Recovery</p>
                          <p className="text-[10px] text-[#63716E] italic">Staff Cash Loan Compensation</p>
                        </div>
                        <div className="flex items-center gap-1 bg-white border border-[#E5E6E6] px-2 py-1 rounded-lg">
                          <span className="text-[12px] font-bold text-red-600">$</span>
                          <input 
                            type="number" 
                            value={editLoan} 
                            onChange={(e) => setEditLoan(Math.max(0, parseInt(e.target.value) || 0))} 
                            className="w-16 text-right font-bold text-[12px] text-red-600 border-none p-0 focus:ring-0 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Custom Deductions List */}
                      {customDeductions.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200 animate-in slide-in-from-top-2 duration-300">
                          <div className="flex-1 text-left">
                            <p className="text-[12px] font-bold text-[#203430]">{item.name}</p>
                            <p className="text-[10px] text-[#63716E]">{item.desc}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[12px] font-bold text-red-600">-${item.value.toLocaleString()}</span>
                            <button 
                              onClick={() => setCustomDeductions(prev => prev.filter(c => c.id !== item.id))} 
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Admin Remarks Textarea */}
                <div className="space-y-2 pt-2 text-left">
                  <h4 className="text-[12px] font-bold text-[#203430]">Admin Remarks</h4>
                  <textarea 
                    placeholder="Provide any remarks regarding this finalization..." 
                    className="w-full h-24 text-[13px] bg-slate-50 border border-[#E5E6E6] rounded-xl p-3 focus:ring-1 focus:ring-brand focus:border-brand resize-none"
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                  />
                </div>
              </div>

              {/* Right Summary Column */}
              <div className="w-full md:w-80 bg-[#F8F9FA] border-t md:border-t-0 md:border-l border-[#E5E6E6] p-6 flex flex-col justify-between overflow-y-auto text-left">
                <div className="space-y-6 text-left">
                  <div>
                    <h4 className="text-[11px] font-bold text-[#63716E] tracking-widest uppercase mb-4">
                      Payroll Summary
                    </h4>
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-[#63716E]">Gross Earnings</span>
                        <span className="font-bold text-[#203430]">${totalEarnings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-[#63716E]">Total Deductions</span>
                        <span className="font-bold text-red-600">-${totalDeductions.toLocaleString()}</span>
                      </div>
                      <div className="pt-3 border-t border-[#E5E6E6] flex justify-between items-end text-left">
                        <div className="flex-1 text-left">
                          <p className="text-[11px] font-bold text-brand uppercase tracking-wider">Net Payable Pay</p>
                          <p className="text-[26px] font-black text-[#0E4D41] leading-tight">
                            ${netPay >= 0 ? netPay.toLocaleString() : "0"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#E5E6E6] space-y-3 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-[#63716E] uppercase">Net Ratio</span>
                      <Info className="h-3.5 w-3.5 text-[#63716E]" />
                    </div>
                    {/* Visual Segment bar */}
                    <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-[#35BFA3] rounded-l" style={{ width: `${takeHomePercentage}%` }}></div>
                      <div className="h-full bg-red-400" style={{ width: `${100 - takeHomePercentage}%` }}></div>
                    </div>
                    <p className="text-[10px] text-[#63716E] leading-normal font-medium">
                      {takeHomePercentage}% of earnings represents take-home pay after tax brackets and adjustments.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <button 
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold text-[#63716E] hover:text-[#203430] bg-white border border-[#E5E6E6] rounded-xl uppercase transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Calculation
                  </button>
                  <button 
                    onClick={handleSaveDraft}
                    className="w-full py-3 bg-[#E5E6E6] text-[#203430] font-bold rounded-xl text-[12px] uppercase hover:bg-slate-300 transition-colors"
                  >
                    Save Draft
                  </button>
                  <button 
                    onClick={handleFinalizeAndPay}
                    className="w-full py-3.5 bg-brand text-white font-bold rounded-xl text-[12px] uppercase shadow-lg shadow-brand/10 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Finalize & Pay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- PAYROLL DETAILS MODAL ----------------- */}
      {showModal === "detail" && selectedEmployee && (
        <div className="fixed inset-0 bg-[#161c1a]/60 backdrop-blur-[4px] z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[85vh] max-h-[800px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E6E6] animate-in fade-in zoom-in-95 duration-200 text-left">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E5E6E6] flex justify-between items-center bg-[#F8F9FA]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-[#0E4D41]">
                  <CircleDollarSign className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-[18px] font-bold text-[#203430]">Payroll Details</h3>
              </div>
              <button 
                onClick={() => setShowModal("none")}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F5] text-[#203430] transition-colors"
                id="close_modal_button_detail"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left bg-white">
              {/* Employee Summary & Status Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="md:col-span-2 flex items-center gap-4 p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E6E6] text-left">
                  <img 
                    className="w-16 h-16 rounded-full object-cover border-2 border-brand/20 shadow-sm shrink-0" 
                    src={selectedEmployee.avatar} 
                    alt={selectedEmployee.name} 
                  />
                  <div className="text-left">
                    <h3 className="text-[16px] font-bold text-[#203430]">{selectedEmployee.name}</h3>
                    <p className="text-[12px] text-[#63716E]">ID: {selectedEmployee.id} • {selectedEmployee.role}</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#E4F2D3] text-[#0E4D41] rounded-[10px] text-[10px] font-bold">
                      <Calendar className="h-3.5 w-3.5 text-[#0E4D41]" />
                      June 1, 2035 - June 30, 2035
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center md:items-end p-4 rounded-xl bg-orange-50/10 border border-brand/10 text-left">
                  <span className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider">Payment Status</span>
                  <div className="flex items-center gap-1 mt-1 text-brand font-bold text-[16px]">
                    <CheckCircle className="h-4.5 w-4.5 text-brand" />
                    Paid
                  </div>
                  <p className="text-[11px] text-[#63716E] mt-1">Processed on 28th {selectedEmployee.date}</p>
                </div>
              </div>

              {/* Financial breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                
                {/* Earnings breakdown card */}
                <div className="bg-white border border-[#E5E6E6] rounded-xl overflow-hidden shadow-sm text-left">
                  <div className="bg-[#F8F9FA] px-4 py-3 border-b border-[#E5E6E6] flex justify-between items-center">
                    <span className="text-[12px] font-bold text-[#203430]">Earnings & Inflow</span>
                    <Plus className="h-4 w-4 text-brand" />
                  </div>
                  <div className="p-4 space-y-3 text-left">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#63716E]">Base Salary</span>
                      <span className="font-bold text-[#203430]">{selectedEmployee.salary}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#63716E]">Housing Allowance (Estimated)</span>
                      <span className="font-bold text-[#203430]">
                        ${Math.round((parseFloat(selectedEmployee.allowance.replace(/[$,]/g, "")) || 0) * 0.7).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#63716E]">Transport Allowance (Estimated)</span>
                      <span className="font-bold text-[#203430]">
                        ${Math.round((parseFloat(selectedEmployee.allowance.replace(/[$,]/g, "")) || 0) * 0.3).toLocaleString()}
                      </span>
                    </div>
                    {selectedEmployee.incen !== "—" && (
                      <div className="flex justify-between text-[12px]">
                        <span className="text-[#63716E]">Performance incentives</span>
                        <span className="font-bold text-brand">{selectedEmployee.incen}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-[#E5E6E6] flex justify-between text-[12px] font-bold">
                      <span className="text-[#203430]">Total Gross Earnings</span>
                      <span className="text-[#0E4D41]">
                        ${(
                          (parseFloat(selectedEmployee.salary.replace(/[$,]/g, "")) || 0) +
                          (parseFloat(selectedEmployee.allowance.replace(/[$,]/g, "")) || 0) +
                          (selectedEmployee.incen !== "—" ? parseFloat(selectedEmployee.incen.replace(/[$,]/g, "")) || 0 : 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deductions card */}
                <div className="bg-white border border-[#E5E6E6] rounded-xl overflow-hidden shadow-sm text-left">
                  <div className="bg-[#F8F9FA] px-4 py-3 border-b border-[#E5E6E6] flex justify-between items-center">
                    <span className="text-[12px] font-bold text-[#203430]">Deductions & Outflow</span>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="p-4 space-y-3 text-left">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#63716E]">Federal Bracket Tax (15%)</span>
                      <span className="font-bold text-[#203430]">
                        -${Math.round((parseFloat(selectedEmployee.salary.replace(/[$,]/g, "")) || 0) * 0.15).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#63716E]">Health Premium & Contribution</span>
                      <span className="font-bold text-[#203430]">
                        -${Math.round((parseFloat(selectedEmployee.deduct.replace(/[$,]/g, "")) || 0) * 0.35).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#63716E]">Social Security Bracket contribution</span>
                      <span className="font-bold text-[#203430]">
                        -${Math.round((parseFloat(selectedEmployee.deduct.replace(/[$,]/g, "")) || 0) * 0.65).toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-[#E5E6E6] flex justify-between text-[12px] font-bold">
                      <span className="text-[#203430]">Total Deductions</span>
                      <span className="text-red-600">
                        -${(
                          Math.round((parseFloat(selectedEmployee.salary.replace(/[$,]/g, "")) || 0) * 0.15) +
                          (parseFloat(selectedEmployee.deduct.replace(/[$,]/g, "")) || 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Payable Highlight banner */}
              <div className="bg-[#203430] text-white rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 text-left border border-brand/20">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Final Paid Amount</p>
                  <h4 className="text-[24px] font-black mt-1 text-[#35BFA3]">Net Compensation: {selectedEmployee.total}</h4>
                </div>
                <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-xl border border-white/20 text-left">
                  <div className="text-right">
                    <p className="text-[9px] uppercase font-bold opacity-75">Disbursement Account</p>
                    <p className="text-[12px] font-semibold">**** 4920 (Chase corporate)</p>
                  </div>
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Additional Specs Bento grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
                <div className="md:col-span-1 p-3 bg-slate-50 border border-[#E5E6E6] rounded-xl flex flex-col items-center justify-center text-center">
                  <Clock className="h-5 w-5 text-brand mb-1" />
                  <p className="text-[10px] text-[#63716E] uppercase font-semibold">Working Days</p>
                  <p className="font-bold text-[14px] text-[#203430]">22 Days</p>
                </div>
                <div className="md:col-span-1 p-3 bg-slate-50 border border-[#E5E6E6] rounded-xl flex flex-col items-center justify-center text-center">
                  <Activity className="h-5 w-5 text-brand mb-1" />
                  <p className="text-[10px] text-[#63716E] uppercase font-semibold">Overtime logged</p>
                  <p className="font-bold text-[14px] text-[#203430]">{selectedEmployee.overtime !== "—" ? selectedEmployee.overtime : "0 Hours"}</p>
                </div>
                <div className="md:col-span-2 p-3 bg-[#E4F2D3]/30 border border-brand/10 rounded-xl flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-[#63716E] uppercase font-semibold">Admin Remarks & Notes</p>
                    <p className="text-[11px] text-[#203430] leading-tight">Monthly compensation finalized. Commendation applied for active performance in design delivery.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#E5E6E6] bg-[#F8F9FA] flex flex-col sm:flex-row justify-between items-center gap-3 text-left">
              <div className="flex gap-2 w-full sm:w-auto text-left">
                <button 
                  onClick={() => showToast(`Payslip downloaded for ${selectedEmployee.name}`)}
                  className="px-4 py-2 bg-brand text-white font-bold text-[12px] rounded-lg flex items-center justify-center gap-1.5 hover:bg-brand/90 transition-all w-full sm:w-auto cursor-pointer"
                >
                  <Download className="h-4 w-4" /> Download Paid Invoice
                </button>
                <button 
                  onClick={() => {
                    setShowModal("none");
                    showToast(`Going to edit profile of ${selectedEmployee.name}`);
                  }}
                  className="px-4 py-2 border border-[#E5E6E6] bg-white text-[#203430] font-bold text-[12px] rounded-lg flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-all w-full sm:w-auto cursor-pointer"
                >
                  <Edit className="h-4 w-4" /> Go to Edit Profile
                </button>
              </div>
              <button 
                onClick={() => setShowModal("none")} 
                className="px-4 py-2 text-[12px] font-bold text-[#63716E] hover:text-[#203430] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
