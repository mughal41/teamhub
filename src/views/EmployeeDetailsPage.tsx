import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/LayoutAddons";
import {
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  FileText,
  TrendingUp,
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Twitter,
  Linkedin,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { cn } from "@/src/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeeByIdApi, Employee as ApiEmployee } from "../lib/api/employees";

const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

export default function EmployeeDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [employee, setEmployee] = React.useState<ApiEmployee | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    getEmployeeByIdApi(id)
      .then((data) => {
        setEmployee(data);
      })
      .catch((err) => {
        setError(err.message || "Failed to load employee details.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <AppLayout
        title="Employee Details"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Employees", href: "/employees" },
          { label: "Employee Details" },
        ]}
      >
        <div className="flex flex-col items-center justify-center p-20 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-sm font-semibold text-[#203430]">Loading employee profile from backend...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !employee) {
    return (
      <AppLayout
        title="Employee Details"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Employees", href: "/employees" },
          { label: "Employee Details" },
        ]}
      >
        <div className="flex flex-col items-center justify-center p-20 space-y-3 bg-white rounded-2xl border border-slate-100">
          <h3 className="text-base font-bold text-rose-600">Failed to Load Profile</h3>
          <p className="text-xs text-slate-500">{error || "Employee record not found."}</p>
          <button
            onClick={() => navigate("/employees")}
            className="px-4 py-2 bg-brand text-white text-xs font-bold rounded-xl"
          >
            Back to Employee Roster
          </button>
        </div>
      </AppLayout>
    );
  }

  // Safe JSON helper to handle stringified API responses or nulls
  const parseJson = (val: any, fallback: any) => {
    if (!val) return fallback;
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return fallback;
      }
    }
    return val;
  };

  const rawLeaveStats = parseJson(employee.leave_stats, null);
  const leaveStats = Array.isArray(rawLeaveStats) && rawLeaveStats.length > 0
    ? rawLeaveStats
    : [
        { label: "All Leaves", val: "12", total: "20", color: "#0E4D41", unit: "Days" },
        { label: "Annual Leaves", val: "8", total: "15", color: "#35BFA3", unit: "Days" },
        { label: "Casual Leaves", val: "4", total: "24", color: "#35BFA3", unit: "Hours" },
        { label: "Sick Leaves", val: "1", total: "4", color: "#35BFA3", unit: "Days" },
      ];

  const rawPerf = parseJson(employee.performance_overview, null);
  const performanceOverview = rawPerf && Array.isArray(rawPerf.monthly_scores)
    ? rawPerf
    : {
        percentage: 94.00,
        trend: "+3.20%",
        trend_desc: "Live Score",
        monthly_scores: [
          { month: "Jan", score: 75 },
          { month: "Feb", score: 78 },
          { month: "Mar", score: 82 },
          { month: "Apr", score: 80 },
          { month: "May", score: 85 },
          { month: "Jun", score: 88 },
          { month: "Jul", score: 89 },
          { month: "Aug", score: 91 },
          { month: "Sept", score: 94 },
          { month: "Oct", score: 92 },
          { month: "Nov", score: 95 },
          { month: "Dec", score: 96 },
        ],
      };

  const rawHours = parseJson(employee.hours_logged, null);
  const hoursLogged = rawHours && Array.isArray(rawHours.daily_data)
    ? rawHours
    : {
        total_weekly: "38 h 15 m",
        daily_data: [
          { day: "M", hours: 8 },
          { day: "Tue", hours: 7.5 },
          { day: "W", hours: 4 },
          { day: "Thu", hours: 8 },
          { day: "F", hours: 7 },
          { day: "Sat", hours: 0 },
          { day: "Sun", hours: 0 },
        ],
      };

  const rawDocs = parseJson(employee.documents, null);
  const empDocs = Array.isArray(rawDocs) && rawDocs.length > 0
    ? rawDocs
    : [
        { name: "Employment_Contract.pdf", size: "1.45 MB", type: "PDF" },
        { name: "Tax_Registration.pdf", size: "895 KB", type: "PDF" },
        { name: "Identification_Passport.pdf", size: "1.27 MB", type: "PDF" },
      ];

  const rawNotes = parseJson(employee.internal_notes, null);
  const empNotes = Array.isArray(rawNotes) && rawNotes.length > 0
    ? rawNotes
    : [
        {
          title: "Onboarding Review",
          date: "15 April 2025",
          text: "Completed initial system setup and team integration successfully. Showing strong technical grasp and high commitment.",
        },
        {
          title: "Performance Appraisal",
          date: "22 May 2025",
          text: "Actively participating in daily standups and collaborating effectively with other team members across departments.",
        },
      ];

  return (
    <AppLayout
      title="Employee Details"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Employees", href: "/employees" },
        { label: employee.name },
      ]}
    >
      <div className="flex flex-col gap-6 xl:flex-row">
        {/* Left Stats Column */}
        <div className="w-full space-y-6 xl:w-[272px] shrink-0">
          {/* Profile Card */}
          <Card className="p-4 flex flex-col items-center text-center bg-white border-none shadow-sm rounded-[16px]">
            <div className="mt-8 mb-6 relative h-[140px] w-[140px] rounded-[24px] bg-[#28C2A9] flex items-center justify-center p-0.5 shadow-sm border border-slate-100/50">
              <img
                src={
                  employee.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
                }
                className="h-full w-full rounded-[22px] object-cover border-2 border-white"
              />
            </div>
            <h2 className="text-xl font-bold text-[#203430] leading-none mb-1.5">
              {employee.name}
            </h2>
            <p className="text-[12px] font-medium text-[#63716E] mb-6">
              {employee.role_title} • {employee.department_name || employee.sub_role || "General"}
            </p>

            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="bg-[#E5E6E6]/60 text-[#203430] text-[10px] font-bold rounded-[8px] px-3 py-1 uppercase tracking-wider">
                {employee.id}
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold rounded-[12px] px-3 py-1 uppercase tracking-wider text-white",
                  employee.status === "Active"
                    ? "bg-[#28C2A9]"
                    : employee.status === "On Leave"
                    ? "bg-[#63716E]"
                    : "bg-[#0E4D41]"
                )}
              >
                {employee.status}
              </span>
            </div>

            <div className="w-full space-y-0 rounded-[16px] overflow-hidden border border-slate-100/80 bg-[#F7F7F7]">
              {[
                { label: "Employment Type", val: employee.employment_type },
                { label: "Work Model", val: employee.work_model },
                { label: "Join Date", val: employee.join_date },
                { label: "Base Salary", val: `$${Number(employee.base_salary).toLocaleString()}` },
              ].map((info, idx) => (
                <div
                  key={info.label}
                  className={cn(
                    "flex justify-between items-center px-4 py-3.5 text-[11px] bg-[#F7F7F7]",
                    idx < 3 && "border-b border-[#E5E6E6]/60"
                  )}
                >
                  <span className="font-semibold text-[#63716E]">{info.label}</span>
                  <span className="font-bold text-[#203430]">{info.val}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between w-full mt-8 mb-4">
              <span className="text-[12px] text-[#63716E] font-medium">Social Media:</span>
              <div className="flex gap-2">
                {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                  <button
                    key={i}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E4F2D3] text-[#0E4D41] hover:bg-brand hover:text-white transition-all shadow-sm"
                  >
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
              <button className="text-slate-300 hover:text-slate-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {[
                { icon: User, label: "Organization", val: employee.organization_name || "Primary Org" },
                { icon: CalendarIcon, label: "Joined Date", val: employee.join_date },
                { icon: Mail, label: "Email Address", val: employee.email || `${employee.name.toLowerCase().replace(/\s+/g, ".")}@teamhub.io` },
                { icon: Phone, label: "Phone Contact", val: employee.phone || "+1 (555) 234-5678" },
                { icon: MapPin, label: "Office Location", val: employee.office_location || "Headquarters, Suite 400" },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F8FCF3] text-brand">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-medium text-[#63716E] tracking-tight">
                      {item.label}
                    </p>
                    <p className="text-[14px] font-bold text-[#203430] leading-tight mt-0.5">
                      {item.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Center Content Column */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Top Metric Cards - Circular Progress */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {leaveStats.map((stat: any) => (
              <Card
                key={stat.label}
                className={cn(
                  "p-4 text-center border-none shadow-sm rounded-[16px] transition-all hover:shadow-md",
                  stat.label === "All Leaves"
                    ? "bg-[#E4F2D3]/35 border border-[#E4F2D3]/60"
                    : "bg-white border border-slate-100/80"
                )}
              >
                <div className="relative inline-flex mb-4">
                  <svg className="h-[94px] w-[94px] -rotate-90">
                    <circle
                      cx="47"
                      cy="47"
                      r="38"
                      stroke={stat.label === "All Leaves" ? "#C6DFAB" : "#E4F2D3"}
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="47"
                      cy="47"
                      r="38"
                      stroke={stat.color || "#35BFA3"}
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray="239"
                      strokeDashoffset={239 * (1 - (Number(stat.val) || 0) / (Number(stat.total) || 1))}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[20px] font-bold text-[#203430]">
                      {stat.val}
                      <span className="text-[#A4ACAB] text-[14px] font-medium">
                        /{stat.total}
                      </span>
                    </span>
                    <span className="text-[9px] font-medium text-[#63716E] uppercase">
                      {stat.unit}
                    </span>
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
                  <span className="text-3xl font-bold text-[#203430]">
                    {performanceOverview.percentage}%
                  </span>
                  <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-[#E4F2D3] text-[11px] font-bold text-brand">
                    <TrendingUp className="h-3 w-3" /> {performanceOverview.trend}
                  </span>
                  <span className="text-[10px] font-medium text-[#63716E] uppercase tracking-wide">
                    {performanceOverview.trend_desc}
                  </span>
                </div>
              </div>
              <button className="flex items-center gap-2 bg-[#F7F7F7] px-3 py-1.5 rounded-lg text-[12px] font-bold text-[#63716E]">
                This Year <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={performanceOverview.monthly_scores}>
                  <defs>
                    <linearGradient id="performGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#35BFA3" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#35BFA3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E6E6" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#63716E" }}
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
                  />
                  <Tooltip />
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
                    <span className="text-[24px] font-bold text-[#203430]">
                      {hoursLogged.total_weekly}
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-1 bg-[#E4F2D3] px-2 py-1 rounded text-[11px] font-bold text-slate-700">
                  This Week <ChevronDown className="h-3 w-3" />
                </button>
              </div>

              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hoursLogged.daily_data}>
                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F7F7F7" />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: "#63716E" }}
                      dy={5}
                    />
                    <YAxis hide />
                    <Bar dataKey="hours" radius={[4, 4, 0, 0]} barSize={20}>
                      {hoursLogged.daily_data.map((d: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 3 ? "#0E4D41" : "#E4F2D3"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4 border-none shadow-sm rounded-[16px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[16px] font-bold text-[#203430]">Documents</h3>
                <button className="text-slate-300">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {empDocs.map((doc: any) => (
                  <div key={doc.name} className="flex items-center gap-3 group cursor-pointer">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E4F2D3] text-[#0E4D41] group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-[#203430] truncate">{doc.name}</p>
                      <p className="text-[12px] font-medium text-[#63716E]">{doc.type || "PDF"} • {doc.size}</p>
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
              <button className="text-slate-300">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {empNotes.map((n: any) => (
                <div key={n.title} className="p-4 rounded-lg bg-[#F8FCF3]">
                  <h4 className="text-[12px] font-bold text-[#203430]">{n.title}</h4>
                  <p className="text-[10px] font-medium text-[#63716E] mb-2">{n.date}</p>
                  <p className="text-[11px] text-[#63716E] leading-relaxed font-medium">
                    {n.text}
                  </p>
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
                <span className="text-[16px] font-bold text-[#203430]">Active Schedule</span>
                <ChevronDown className="h-4 w-4 text-[#63716E]" />
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-[#E4F2D3] rounded-lg text-[#203430]">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="p-2 bg-[#E4F2D3] rounded-lg text-[#203430]">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={`${d}-${i}`} className="text-[11px] font-medium text-[#63716E]">
                  {d}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 text-center gap-y-1">
              {calendarDays.slice(0, 28).map((d) => (
                <span
                  key={d}
                  className={cn(
                    "text-[12px] font-medium py-1 rounded-md cursor-pointer transition-all",
                    d === 15 ? "bg-brand text-white font-bold" : "text-[#203430] hover:bg-slate-50"
                  )}
                >
                  {d}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
