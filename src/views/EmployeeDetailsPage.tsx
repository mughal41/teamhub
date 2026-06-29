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
  ChevronRight,
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
import { getCollection, initialEmployees } from "../lib/db";

const hoursData = [
  { day: "M", hours: 8 },
  { day: "Tue", hours: 7.5, label: "T" },
  { day: "W", hours: 4 },
  { day: "Thu", hours: 8, label: "T" },
  { day: "F", hours: 7 },
  { day: "Sat", hours: 0, label: "S" },
  { day: "Sun", hours: 0, label: "S" },
];

const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

export default function EmployeeDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Load employee dynamically from custom local storage database list or fall back to seeded records
  const employee = React.useMemo(() => {
    const list = getCollection<any[]>("db_employees", []);
    const found = list.find((e) => e.id === id);
    if (found) return found;
    return initialEmployees.find((e) => e.id === id) || initialEmployees[2]; // Fallback to Mia Torres (index 2)
  }, [id]);

  const isSeeded = React.useMemo(() => {
    return [
      "EMP-0234",
      "EMP-0178",
      "EMP-0289",
      "EMP-0312",
      "EMP-0115",
      "EMP-0320",
      "EMP-0291",
      "EMP-0356",
      "EMP-0275",
      "EMP-0159",
    ].includes(employee.id);
  }, [employee]);

  // Handle performance metric dynamic scores
  const performanceScore = React.useMemo(() => {
    if (employee.score !== undefined && employee.score !== null) {
      return employee.score;
    }
    const scoreMap: Record<string, number> = {
      "EMP-0234": 94,
      "EMP-0178": 89,
      "EMP-0289": 86,
      "EMP-0312": 72,
    };
    return scoreMap[employee.id];
  }, [employee]);

  const isEvaluated = performanceScore !== undefined;

  const empPerformanceData = React.useMemo(() => {
    if (!isEvaluated) return [];
    const base = performanceScore || 80;
    return [
      { month: "Jan", score: Math.round(base - 11) },
      { month: "Feb", score: Math.round(base - 14) },
      { month: "Mar", score: Math.round(base - 8) },
      { month: "Apr", score: Math.round(base - 12) },
      { month: "May", score: Math.round(base - 10) },
      { month: "Jun", score: Math.round(base - 12) },
      { month: "Jul", score: Math.round(base - 8) },
      { month: "Aug", score: Math.round(base - 6) },
      { month: "Sep", score: Math.round(base - 4) },
      { month: "Oct", score: Math.round(base - 6) },
      { month: "Nov", score: Math.round(base - 3) },
      { month: "Dec", score: Math.round(base) },
    ];
  }, [isEvaluated, performanceScore]);

  // Attendance metrics
  const hoursWeekly = React.useMemo(() => {
    if (isSeeded) {
      if (employee.id === "EMP-0289") return "34 h 30 m";
      return "38 h 15 m";
    }
    return "0 h 00 m";
  }, [employee, isSeeded]);

  const empHoursData = React.useMemo(() => {
    if (isSeeded) {
      return hoursData;
    }
    return [
      { day: "M", hours: 0 },
      { day: "Tue", hours: 0, label: "T" },
      { day: "W", hours: 0 },
      { day: "Thu", hours: 0, label: "T" },
      { day: "F", hours: 0 },
      { day: "Sat", hours: 0, label: "S" },
      { day: "Sun", hours: 0, label: "S" },
    ];
  }, [employee, isSeeded]);

  // Leave dynamic summaries
  const leaveStats = React.useMemo(() => {
    if (isSeeded) {
      if (employee.id === "EMP-0289") {
        return [
          { label: "All Leaves", val: "14", total: "20", color: "#0E4D41" },
          { label: "Annual Leaves", val: "10", total: "15", color: "#35BFA3" },
          { label: "Casual Leaves", val: "8", total: "24", color: "#35BFA3" },
          { label: "Sick Leaves", val: "3", total: "4", color: "#0E4D41" },
        ];
      }
      return [
        { label: "All Leaves", val: "12", total: "20", color: "#0E4D41" },
        { label: "Annual Leaves", val: "8", total: "15", color: "#35BFA3" },
        { label: "Casual Leaves", val: "4", total: "24", color: "#35BFA3" },
        { label: "Sick Leaves", val: "1", total: "4", color: "#0E4D41" },
      ];
    }
    return [
      { label: "All Leaves", val: "0", total: "20", color: "#0E4D41" },
      { label: "Annual Leaves", val: "0", total: "15", color: "#35BFA3" },
      { label: "Casual Leaves", val: "0", total: "24", color: "#35BFA3" },
      { label: "Sick Leaves", val: "0", total: "4", color: "#0E4D41" },
    ];
  }, [employee, isSeeded]);

  // Custom documents uploaded vs defaults
  const docList = React.useMemo(() => {
    const docs = [];
    if (employee.uploadedDocs?.id) {
      docs.push({ name: employee.uploadedDocs.id, size: "1.45 MB" });
    } else if (employee.id === "EMP-0289") {
      docs.push({ name: "ID_Document.pdf", size: "1.45 MB" });
    }
    if (employee.uploadedDocs?.contract) {
      docs.push({ name: employee.uploadedDocs.contract, size: "895 KB" });
    } else if (employee.id === "EMP-0289") {
      docs.push({ name: "Contract Agreement.pdf", size: "895 KB" });
    }
    if (employee.uploadedDocs?.cv) {
      docs.push({ name: employee.uploadedDocs.cv, size: "1.27 MB" });
    } else if (employee.id === "EMP-0289") {
      docs.push({ name: "Curriculum Vitae.pdf", size: "1.27 MB" });
    }
    if (employee.uploadedDocs?.offer) {
      docs.push({ name: employee.uploadedDocs.offer, size: "1.15 MB" });
    }

    if (docs.length === 0) {
      docs.push({ name: "Onboarding_Guidelines.pdf", size: "1.12 MB" });
      docs.push({ name: "Contract Agreement.pdf", size: "895 KB" });
    }
    return docs;
  }, [employee]);

  // Internal log notes entries
  const empNotes = React.useMemo(() => {
    if (isSeeded) {
      if (employee.id === "EMP-0289") {
        return [
          {
            title: "Promotion Feedback",
            date: "10 January 2035",
            text: "Promoted from HR Assistant to HR Officer due to consistent performance and leadership in onboarding initiatives.",
          },
          {
            title: "Employee Appreciation",
            date: "02 May 2035",
            text: "Recognized by the Head of HR for successfully leading the Q2 training rollout with a 98% participation rate.",
          },
        ];
      }
      return [
        {
          title: "Onboarding Review",
          date: "15 April 2035",
          text: "Completed initial system setup and team integration successfully. Showing strong technical grasp and high commitment.",
        },
        {
          title: "Team Integration Feedback",
          date: "22 May 2035",
          text: "Actively participating in daily standups and collaborating effectively with other team members across departments.",
        },
      ];
    }
    return [
      {
        title: "System Access Provisioned",
        date: "Just Now",
        text: "All base credentials, enterprise login tokens, and workspace permissions have been securely provisioned.",
      },
      {
        title: "Onboarding Plan Initiated",
        date: "Just Now",
        text: "The structural onboarding path is underway. The direct supervisor has scheduled a greeting check-in session.",
      },
    ];
  }, [employee, isSeeded]);

  // Currency utility
  const formatCurrency = (val: any) => {
    if (val === undefined || val === null) return "$0";
    const cleaned = String(val).replace(/[^0-9.]/g, "");
    if (!cleaned) return "$0";
    return "$" + Number(cleaned).toLocaleString();
  };

  // Payroll math calculations
  const totalMonthlyValue = React.useMemo(() => {
    const baseSalaryNum =
      parseFloat(String(employee.salary || "3200").replace(/[^0-9.]/g, "")) ||
      0;
    const transNum =
      parseFloat(
        String(employee.allowanceTrans || "120").replace(/[^0-9.]/g, ""),
      ) || 0;
    const mealNum =
      parseFloat(
        String(employee.allowanceMeal || "110").replace(/[^0-9.]/g, ""),
      ) || 0;
    const internetNum =
      parseFloat(
        String(employee.allowanceInternet || "70").replace(/[^0-9.]/g, ""),
      ) || 0;
    const healthNum =
      parseFloat(
        String(employee.benefitHealth || "120").replace(/[^0-9.]/g, ""),
      ) || 0;
    const lifeNum =
      parseFloat(
        String(employee.benefitLife || "40").replace(/[^0-9.]/g, ""),
      ) || 0;
    const deviceNum =
      parseFloat(
        String(employee.benefitDevice || "65").replace(/[^0-9.]/g, ""),
      ) || 0;
    const trainingNum =
      parseFloat(
        String(employee.benefitTraining || "80").replace(/[^0-9.]/g, ""),
      ) || 0;
    const fitnessNum =
      parseFloat(
        String(employee.benefitFitness || "50").replace(/[^0-9.]/g, ""),
      ) || 0;

    return (
      baseSalaryNum +
      transNum +
      mealNum +
      internetNum +
      healthNum +
      lifeNum +
      deviceNum +
      trainingNum +
      fitnessNum
    );
  }, [employee]);

  // Mapping variables to connect component calculations with JSX references
  const performanceData = empPerformanceData;
  const hoursLoggedText = hoursWeekly;
  const empDocs = docList;

  const performanceDetails = React.useMemo(() => {
    if (isSeeded) {
      if (employee.id === "EMP-0289") {
        return {
          percentage: "86.75",
          trend: "+2.05%",
          trendDesc: "Increased by last year",
        };
      }
      return {
        percentage: "89.50",
        trend: "+3.10%",
        trendDesc: "Increased by last year",
      };
    }
    return {
      percentage: "0.00",
      trend: "0.00%",
      trendDesc: "Not evaluated yet",
    };
  }, [employee, isSeeded]);

  const empCalendarClass = (d: number) => {
    if (!isSeeded) {
      if (d === 21)
        return "bg-brand text-white font-bold shadow-md shadow-brand/20";
      return "text-[#203430] hover:bg-slate-50";
    }
    if (d === 21)
      return "bg-brand text-white font-bold shadow-md shadow-brand/20";
    if (d === 20) return "bg-[#0E4D41] text-white";
    if ([23, 27].includes(d)) return "bg-[#35BFA3] text-white";
    if (
      [
        3, 4, 1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22,
        24, 25, 26, 28, 29, 30,
      ].includes(d)
    )
      return "bg-[#E4F2D3]";
    return "text-[#203430] hover:bg-slate-50";
  };

  return (
    <AppLayout
      title="Employee Details"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Employees", href: "/employees" },
        { label: "Employee Details" },
      ]}
    >
      <div className="flex flex-col gap-6 xl:flex-row">
        {/* Left Stats Column */}
        <div className="w-full space-y-6 xl:w-[272px] shrink-0">
          {/* Profile Card */}
          <Card className="p-4 flex flex-col items-center text-center bg-white border-none shadow-sm rounded-[16px]">
            <div className="mt-8 mb-6 relative">
              <img
                src={
                  employee.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
                }
                className="h-[140px] w-[140px] rounded-[16px] object-cover ring-8 ring-[#F8FCF3]"
              />
            </div>
            <h2 className="text-xl font-bold text-[#203430]">
              {employee.name}
            </h2>
            <p className="text-[12px] font-medium text-[#63716E] mb-6">
              {employee.role} • {employee.dept}
            </p>

            <div className="flex items-center justify-center gap-2 mb-8">
              <Badge
                variant="default"
                className="bg-[#E5E6E6] text-[#203430] text-[12px] font-medium rounded-full px-3 py-1 ring-0 border-none"
              >
                {employee.id}
              </Badge>
              <Badge
                variant={employee.status === "Active" ? "success" : "default"}
                className={cn(
                  "text-[12px] font-medium rounded-full px-3 py-1 ring-0 border-none",
                  employee.status === "Active"
                    ? "bg-brand text-white"
                    : "bg-amber-500 text-white",
                )}
              >
                {employee.status || "Active"}
              </Badge>
            </div>

            <div className="w-full space-y-0 rounded-xl overflow-hidden border border-slate-100">
              {[
                { label: "Employment Type", val: employee.type || "Full-Time" },
                { label: "Work Model", val: employee.model || "Hybrid" },
                { label: "Join Date", val: employee.joinDate || "14 Feb 2025" },
              ].map((info, idx) => (
                <div
                  key={info.label}
                  className={cn(
                    "flex justify-between items-center px-4 py-4 text-[12px] bg-[#F7F7F7]",
                    idx < 2 && "border-b border-[#E5E6E6]",
                  )}
                >
                  <span className="font-medium text-[#63716E]">
                    {info.label}
                  </span>
                  <span className="font-bold text-[#203430]">{info.val}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between w-full mt-8 mb-4">
              <span className="text-[12px] text-[#63716E]">Social Media:</span>
              <div className="flex gap-2">
                {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                  <button
                    key={i}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E4F2D3] text-[#203430] hover:bg-brand hover:text-white transition-all shadow-sm"
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
              <h3 className="text-[16px] font-bold text-[#203430]">
                Personal Info
              </h3>
              <button className="text-slate-300 hover:text-slate-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {[
                { icon: User, label: "Gender", val: employee.gender || "Male" },
                {
                  icon: CalendarIcon,
                  label: "Date of Birth",
                  val: employee.birthDate || "15 Jun 1996",
                },
                {
                  icon: Mail,
                  label: "Email Address",
                  val: employee.email || "staff@company.com",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  val: employee.phone
                    ? employee.phoneCountry
                      ? `+${employee.phoneCountry} ${employee.phone}`
                      : employee.phone
                    : "+1 555-0199",
                },
                {
                  icon: MapPin,
                  label: "Address",
                  val: employee.address || "Main Street, Suite 101",
                },
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
        <div className="flex-1 space-y-6">
          {/* Top Metric Cards - Circular Progress */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {leaveStats.map((stat) => (
              <Card
                key={stat.label}
                className="p-4 text-center border-none shadow-sm rounded-[16px]"
              >
                <div className="relative inline-flex mb-4">
                  <svg className="h-[94px] w-[94px] -rotate-90">
                    <circle
                      cx="47"
                      cy="47"
                      r="38"
                      stroke="#E4F2D3"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="47"
                      cy="47"
                      r="38"
                      stroke={stat.color}
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray="239"
                      strokeDashoffset={
                        239 * (1 - parseInt(stat.val) / parseInt(stat.total))
                      }
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
                      Days
                    </span>
                  </div>
                </div>
                <p className="text-[12px] font-bold text-[#203430]">
                  {stat.label}
                </p>
              </Card>
            ))}
          </div>

          {/* Performance Overview */}
          <Card className="p-6 border-none shadow-sm rounded-[16px]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-[16px] font-bold text-[#203430]">
                  Performance Overview
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-bold text-[#203430]">
                    {performanceDetails.percentage}%
                  </span>
                  <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-[#E4F2D3] text-[11px] font-bold text-brand">
                    <TrendingUp className="h-3 w-3" /> {performanceDetails.trend}
                  </span>
                  <span className="text-[10px] font-medium text-[#63716E] uppercase tracking-wide">
                    {performanceDetails.trendDesc}
                  </span>
                </div>
              </div>
              <button className="flex items-center gap-2 bg-[#F7F7F7] px-3 py-1.5 rounded-lg text-[12px] font-bold text-[#63716E]">
                Last Year <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="h-[250px] w-full relative">
              <div className="absolute right-[120px] top-6 bg-white border border-slate-100 rounded-[8px] p-2 shadow-xl z-20 text-center">
                <p className="text-[9px] font-medium text-[#63716E]">
                  Sept 2035
                </p>
                <p className="text-[12px] font-bold text-brand">
                  {performanceData.find((d) => d.month === "Sept")?.score || 0}%
                </p>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border-r border-b border-slate-50 bg-white" />
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient
                      id="performGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#35BFA3" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#35BFA3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E6E6"
                  />
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
                    dot={{
                      r: 4,
                      fill: "#35BFA3",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#0E4D41",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                  <Tooltip
                    cursor={{ stroke: "#35BFA3", strokeWidth: 1 }}
                    content={() => null}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-4 border-none shadow-sm rounded-[16px]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#203430]">
                    Hours Logged
                  </h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-[24px] font-bold text-[#203430]">
                      {hoursLoggedText}
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-1 bg-[#E4F2D3] px-2 py-1 rounded text-[11px] font-bold text-slate-700">
                  This Week <ChevronDown className="h-3 w-3" />
                </button>
              </div>

              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hoursData}>
                    <CartesianGrid
                      strokeDasharray="0"
                      vertical={false}
                      stroke="#F7F7F7"
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: "#63716E" }}
                      tickFormatter={(val) => {
                        if (val === "Tue" || val === "Thu") return "T";
                        if (val === "Sat" || val === "Sun") return "S";
                        return val;
                      }}
                      dy={5}
                    />
                    <YAxis hide />
                    <Bar dataKey="hours" radius={[4, 4, 0, 0]} barSize={20}>
                      {hoursData.map((d, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            (d.day === "Thu" || d.day === "T") && index === 3
                              ? "#0E4D41"
                              : "#E4F2D3"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4 border-none shadow-sm rounded-[16px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[16px] font-bold text-[#203430]">
                  Documents
                </h3>
                <button className="text-slate-300">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {empDocs.map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E4F2D3] text-[#0E4D41] group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-[#203430] truncate">
                        {doc.name}
                      </p>
                      <p className="text-[12px] font-medium text-[#63716E]">
                        PDF • {doc.size}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Internal Notes */}
          <Card className="p-4 border-none shadow-sm rounded-[16px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[16px] font-bold text-[#203430]">
                Internal Notes
              </h3>
              <button className="text-slate-300">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {empNotes.map((n, i) => (
                <div key={n.title} className="p-4 rounded-lg bg-[#F8FCF3]">
                  <h4 className="text-[12px] font-bold text-[#203430]">
                    {n.title}
                  </h4>
                  <p className="text-[10px] font-medium text-[#63716E] mb-2">
                    {n.date}
                  </p>
                  <p className="text-[11px] text-[#63716E] leading-relaxed line-clamp-3 font-medium">
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
                <span className="text-[16px] font-bold text-[#203430]">
                  June 2035
                </span>
                <ChevronDown className="h-4 w-4 text-[#63716E]" />
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-[#E4F2D3] rounded-lg text-[#203430] hover:bg-brand hover:text-white transition-all">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="p-2 bg-[#E4F2D3] rounded-lg text-[#203430] hover:bg-brand hover:text-white transition-all">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span
                  key={`${d}-${i}`}
                  className="text-[11px] font-medium text-[#63716E]"
                >
                  {d}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 text-center gap-y-1">
              {[27, 28, 29, 30, 31].map((d) => (
                <span
                  key={d}
                  className="text-[12px] font-medium text-[#A4ACAB] py-1"
                >
                  {d}
                </span>
              ))}
              {calendarDays.map((d) => (
                <span
                  key={d}
                  className={cn(
                    "text-[12px] font-medium py-1 rounded-md cursor-pointer transition-all",
                    empCalendarClass(d)
                  )}
                >
                  {d}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-y-2 text-[9px] font-medium text-[#63716E]">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-[#0E4D41]" /> Present{" "}
                <span className="text-[#203430] font-bold">
                  {isSeeded ? "13" : "1"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-[#35BFA3]" /> Late{" "}
                <span className="text-[#203430] font-bold">
                  {isSeeded ? "5" : "0"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-[#203430]" /> On Leave{" "}
                <span className="text-[#203430] font-bold">
                  {isSeeded ? "2" : "0"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-[#E5E6E6]" /> Absent{" "}
                <span className="text-[#203430] font-bold">
                  {isSeeded ? "1" : "0"}
                </span>
              </div>
            </div>
          </Card>

          {/* Payroll Summary Card */}
          <Card className="p-4 bg-white border-none shadow-sm rounded-[16px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[16px] font-bold text-[#203430]">
                Payroll Summary
              </h3>
              <button className="text-slate-300">
                <MoreHorizontal className="h-5 w-5" />
              </button>
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
                <span className="text-[14px] font-bold text-[#203430]">
                  Base Salary
                </span>
                <span className="text-[14px] font-bold text-[#203430]">
                  {formatCurrency(employee.salary || "3200")}
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-[10px] font-bold text-[#A4ACAB] uppercase tracking-widest">
                  Allowances
                </p>
                {[
                  {
                    l: "Transportation",
                    v: formatCurrency(employee.allowanceTrans || "120"),
                  },
                  { l: "Meal", v: formatCurrency(employee.allowanceMeal || "110") },
                  {
                    l: "Internet (Hybrid)",
                    v: formatCurrency(employee.allowanceInternet || "70"),
                  },
                ].map((x) => (
                  <div key={x.l} className="flex justify-between text-[12px]">
                    <span className="text-[#63716E] font-medium">{x.l}</span>
                    <span className="text-[#203430] font-bold">{x.v}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-[10px] font-bold text-[#A4ACAB] uppercase tracking-widest">
                  Benefits
                </p>
                {[
                  {
                    l: "Health Insurance",
                    v: formatCurrency(employee.benefitHealth || "120"),
                  },
                  {
                    l: "Life Insurance",
                    v: formatCurrency(employee.benefitLife || "40"),
                  },
                  {
                    l: "Company Device",
                    v: formatCurrency(employee.benefitDevice || "65"),
                  },
                  {
                    l: "Training Program",
                    v: formatCurrency(employee.benefitTraining || "80"),
                  },
                  {
                    l: "Fitness Membership",
                    v: formatCurrency(employee.benefitFitness || "50"),
                  },
                ].map((x) => (
                  <div key={x.l} className="flex justify-between text-[12px]">
                    <span className="text-[#63716E] font-medium">{x.l}</span>
                    <span className="text-[#203430] font-bold">{x.v}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <span className="text-[14px] font-bold text-[#203430]">
                  Total Monthly Value
                </span>
                <span className="text-[16px] font-bold text-brand">
                  {formatCurrency(totalMonthlyValue)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 flex flex-col gap-6 md:flex-row md:items-center md:justify-between py-8 border-t border-slate-100 mb-8 px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-10">
          <p className="text-[12px] text-[#203430] font-bold">
            Copyright © 2025 Peterdraw
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Term and conditions", "Contact"].map(
              (link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[12px] text-[#63716E] font-medium hover:text-brand transition-colors"
                >
                  {link}
                </a>
              ),
            )}
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
            <button
              key={i}
              className="text-[#63716E] hover:text-brand transition-colors"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </footer>
    </AppLayout>
  );
}
