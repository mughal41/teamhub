import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { getCollection, saveCollection } from "../lib/db";
import { Card } from "../components/ui/LayoutAddons";
import {
  Calendar as CalendarIcon,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  ArrowUpRight,
  Star,
  ArrowUpDown,
  Plus,
  CheckCircle2,
  AlertCircle,
  Users,
  FileText,
  RefreshCw,
  X,
  Check,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { TeamHubDatePicker } from "../components/ui/DatePicker";
import { useAuth } from "../context/AuthContext";
import { filterByRoleScope } from "../lib/roleScope";
import { RoleScopeBanner } from "../components/auth/RoleScopeBanner";

// Days of week for Heatmap
const heatmapDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const satisfactionSub = [
  { label: "Compensation & Benefits", score: "4.5/5", percentage: 78 },
  { label: "Work Culture", score: "4.3/5", percentage: 74 },
  { label: "Work-Life Balance", score: "4.1/5", percentage: 71 },
  { label: "Career Growth Opportunities", score: "3.9/5", percentage: 68 },
];

// Heatmap Matrix Generator based on timeframe filter
const getAttendanceHeatmap = (timeframe: string) => {
  if (timeframe === "This Week") {
    return [
      { time: "8:00 AM", cells: ["#0E4D41", "#35BFA3", "#0E4D41", "#35BFA3", "#0E4D41"] },
      { time: "8:30 AM", cells: ["#35BFA3", "#35BFA3", "#E4F2D3", "#0E4D41", "#35BFA3"] },
      { time: "9:00 AM", cells: ["#E4F2D3", "#35BFA3", "#E4F2D3", "#35BFA3", "#E4F2D3"] },
      { time: "9:30 AM", cells: ["#E4F2D3", "#E4F2D3", "#F7F7F7", "#E4F2D3", "#F7F7F7"] },
      { time: "10:00 AM", cells: ["#F7F7F7", "#E4F2D3", "#F7F7F7", "#F7F7F7", "#F7F7F7"] },
      { time: "10:30 AM", cells: ["#F7F7F7", "#F7F7F7", "#F7F7F7", "#F7F7F7", "#F7F7F7"] },
    ];
  }
  if (timeframe === "Last Month") {
    return [
      { time: "8:00 AM", cells: ["#0E4D41", "#0E4D41", "#35BFA3", "#0E4D41", "#0E4D41"] },
      { time: "8:30 AM", cells: ["#0E4D41", "#35BFA3", "#35BFA3", "#35BFA3", "#0E4D41"] },
      { time: "9:00 AM", cells: ["#35BFA3", "#35BFA3", "#35BFA3", "#35BFA3", "#35BFA3"] },
      { time: "9:30 AM", cells: ["#E4F2D3", "#E4F2D3", "#E4F2D3", "#E4F2D3", "#E4F2D3"] },
      { time: "10:00 AM", cells: ["#E4F2D3", "#F7F7F7", "#E4F2D3", "#F7F7F7", "#E4F2D3"] },
      { time: "10:30 AM", cells: ["#F7F7F7", "#F7F7F7", "#F7F7F7", "#F7F7F7", "#F7F7F7"] },
    ];
  }
  // Default: This Month
  return [
    { time: "8:00 AM", cells: ["#0E4D41", "#0E4D41", "#0E4D41", "#0E4D41", "#0E4D41"] },
    { time: "8:30 AM", cells: ["#E4F2D3", "#35BFA3", "#0E4D41", "#0E4D41", "#0E4D41"] },
    { time: "9:00 AM", cells: ["#E4F2D3", "#35BFA3", "#0E4D41", "#35BFA3", "#35BFA3"] },
    { time: "9:30 AM", cells: ["#E4F2D3", "#E4F2D3", "#35BFA3", "#E4F2D3", "#E4F2D3"] },
    { time: "10:00 AM", cells: ["#F7F7F7", "#E4F2D3", "#E4F2D3", "#E4F2D3", "#F7F7F7"] },
    { time: "10:30 AM", cells: ["#F7F7F7", "#F7F7F7", "#E4F2D3", "#F7F7F7", "#F7F7F7"] },
  ];
};

// Team performance datasets per timeframe selector
const getTeamPerfData = (timeframe: string) => {
  if (timeframe === "This Year") {
    return [
      { name: "Q1", value: 68 },
      { name: "Q2", value: 82 },
      { name: "Q3", value: 91.5 },
      { name: "Q4", value: 88 },
    ];
  }
  if (timeframe === "Last 30 Days") {
    return [
      { name: "W1", value: 75 },
      { name: "W2", value: 82 },
      { name: "W3", value: 88 },
      { name: "W4", value: 95.2 },
    ];
  }
  // Default: Last 6 Months
  return [
    { name: "Jan", value: 50 },
    { name: "Feb", value: 60 },
    { name: "Mar", value: 65 },
    { name: "Apr", value: 85 },
    { name: "May", value: 95.2 },
    { name: "Jun", value: 78 },
  ];
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, canAccessNav, canView, canManage, canApprove } = useAuth();

  const [toastText, setToastText] = React.useState<string | null>(null);

  // Active Popovers for '...' buttons
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);

  // Timeframe Selectors
  const [attendanceTimeframe, setAttendanceTimeframe] = React.useState("This Month");
  const [showAttendanceTimeframeMenu, setShowAttendanceTimeframeMenu] = React.useState(false);

  const [teamPerfTimeframe, setTeamPerfTimeframe] = React.useState("Last 6 Months");
  const [showTeamPerfTimeframeMenu, setShowTeamPerfTimeframeMenu] = React.useState(false);

  const [empAttendanceTimeframe, setEmpAttendanceTimeframe] = React.useState("This Month");
  const [showEmpAttendanceMenu, setShowEmpAttendanceMenu] = React.useState(false);

  // Calendar & Schedule Month & Day Selection
  const [calendarYear, setCalendarYear] = React.useState(2026);
  const [calendarMonth, setCalendarMonth] = React.useState(9); // 0 = Jan, 9 = Oct
  const [showMonthMenu, setShowMonthMenu] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState(8);
  const [showDayPickerMenu, setShowDayPickerMenu] = React.useState(false);

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  // DB State collections (raw) — then role-scoped below
  const [schedulesList, setSchedulesList] = React.useState<any[]>([]);
  const [employeesRaw, setEmployeesList] = React.useState<any[]>([]);
  const [attendanceRaw, setAttendance] = React.useState<any[]>([]);
  const [leavesRaw, setLeavesList] = React.useState<any[]>([]);
  const [applicantsList, setApplicantsList] = React.useState<any[]>([]);
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [activities, setActivities] = React.useState<any[]>([]);
  const [satisfactionData, setSatisfactionData] = React.useState<any[]>([]);

  const employeesList = React.useMemo(
    () =>
      user && canView("employees")
        ? filterByRoleScope(employeesRaw, user.roleId, "employees")
        : user
          ? []
          : employeesRaw,
    [employeesRaw, user, canView]
  );
  const attendance = React.useMemo(
    () =>
      user && canView("attendance")
        ? filterByRoleScope(attendanceRaw, user.roleId, "attendance")
        : user
          ? []
          : attendanceRaw,
    [attendanceRaw, user, canView]
  );
  const leavesList = React.useMemo(
    () =>
      user && canView("leave")
        ? filterByRoleScope(leavesRaw, user.roleId, "leave")
        : user
          ? []
          : leavesRaw,
    [leavesRaw, user, canView]
  );

  // Add event form modal inside card
  const [showAddEvent, setShowAddEvent] = React.useState(false);
  const [newEventTitle, setNewEventTitle] = React.useState("");
  const [newEventCategory, setNewEventCategory] = React.useState("Employee Development");
  const [newEventLocation, setNewEventLocation] = React.useState("Remote / Zoom");
  const [newEventTime, setNewEventTime] = React.useState("11:00 AM");

  // Table Pagination State for Employee Attendance
  const [attendancePage, setAttendancePage] = React.useState(1);
  const pageSize = 5;

  // Load real data from DB
  const loadDashboardData = React.useCallback(() => {
    const emps = getCollection<any[]>("db_employees", []);
    const atts = getCollection<any[]>("db_attendance", []);
    const leaves = getCollection<any[]>("db_leaves", []);
    const schedulesFromDb = getCollection<any[]>("db_schedules", []);
    const tasksFromDb = getCollection<any[]>("db_tasks", []);
    const activitiesFromDb = getCollection<any[]>("db_activities", []);
    const applicantsFromDb = getCollection<any[]>("db_applicants", []);
    const satisfactionFromDb = getCollection<any[]>("db_satisfaction", []);

    setEmployeesList(emps);
    setAttendance(atts);
    setLeavesList(leaves);
    setApplicantsList(applicantsFromDb);
    setSchedulesList(schedulesFromDb);
    setTasks(tasksFromDb);
    setActivities(activitiesFromDb);
    setSatisfactionData(satisfactionFromDb);
  }, []);

  React.useEffect(() => {
    loadDashboardData();
    window.addEventListener("db_updated", loadDashboardData);
    window.addEventListener("storage", loadDashboardData);
    return () => {
      window.removeEventListener("db_updated", loadDashboardData);
      window.removeEventListener("storage", loadDashboardData);
    };
  }, [loadDashboardData]);

  // Derived Real Statistics
  const employeesCount = employeesList.length;
  
  const onTimeOrLateCount = attendance.filter(
    (a) => a.status === "On-Time" || a.status === "Late"
  ).length;
  const overallAttendanceVal = attendance.length
    ? Math.round((onTimeOrLateCount / attendance.length) * 100)
    : 0;

  const pendingLeavesCount = leavesList.filter((l) => l.status === "Pending").length;
  const applicantsCount = applicantsList.length;

  // Calculate Employment Status Breakdown from Real Employee DB
  const fullTimeCount = employeesList.filter((e) => e.type === "Full-Time" || !e.type).length;
  const partTimeCount = employeesList.filter((e) => e.type === "Part-Time").length;
  const freelanceCount = employeesList.filter((e) => e.type === "Freelance" || e.type === "Contractor").length;
  const internCount = employeesList.filter((e) => e.type === "Intern" || e.type === "Internship").length;

  const ftPct = employeesCount ? Math.round((fullTimeCount / employeesCount) * 100) : 0;
  const ptPct = employeesCount ? Math.round((partTimeCount / employeesCount) * 100) : 0;
  const flPct = employeesCount ? Math.round((freelanceCount / employeesCount) * 100) : 0;
  const inPct = employeesCount ? Math.max(0, 100 - (ftPct + ptPct + flPct)) : 0;

  // Handler to Seed Sample DB Data for Testing
  const handleSeedData = () => {
    saveCollection("db_employees", [
      { id: "EMP-0234", name: "Olivia Mason", job: "Marketing", dept: "Executive Marketing", type: "Full-Time", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
      { id: "EMP-0178", name: "Ethan Ray", job: "UI Designer", dept: "Product Design", type: "Part-Time", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
      { id: "EMP-0312", name: "Lina Armand", job: "Lab Analyst", dept: "R&D", type: "Freelance", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
      { id: "EMP-0115", name: "Jacob Yuen", job: "Site Supervisor", dept: "Operations", type: "Full-Time", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
      { id: "EMP-0289", name: "Mia Torres", job: "HR Officer", dept: "Human Resources", type: "Full-Time", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
      { id: "EMP-0412", name: "Marcus Vance", job: "Lead Developer", dept: "Engineering", type: "Full-Time", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
      { id: "EMP-0523", name: "Sophia Chen", job: "QA Engineer", dept: "Quality Assurance", type: "Part-Time", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
      { id: "EMP-0189", name: "David Miller", job: "Accountant", dept: "Finance", type: "Intern", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
    ]);

    saveCollection("db_attendance", [
      { name: "Olivia Mason", id: "EMP-0234", job: "Marketing", dept: "Executive Marketing", date: "19 Jun 2035", in: "08:55 AM", out: "05:05 PM", status: "On-Time", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
      { name: "Ethan Ray", id: "EMP-0178", job: "UI Designer", dept: "Product Design", date: "19 Jun 2035", in: "09:14 AM", out: "05:20 PM", status: "Late", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
      { name: "Lina Armand", id: "EMP-0312", job: "Lab Analyst", dept: "R&D", date: "19 Jun 2035", in: "—", out: "—", status: "On Leave", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
      { name: "Jacob Yuen", id: "EMP-0115", job: "Site Supervisor", dept: "Operations", date: "19 Jun 2035", in: "—", out: "—", status: "Absent", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
      { name: "Mia Torres", id: "EMP-0289", job: "HR Officer", dept: "Human Resources", date: "19 Jun 2035", in: "08:59 AM", out: "05:10 PM", status: "On-Time", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
      { name: "Marcus Vance", id: "EMP-0412", job: "Lead Developer", dept: "Engineering", date: "19 Jun 2035", in: "08:50 AM", out: "05:15 PM", status: "On-Time", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
    ]);

    saveCollection("db_schedules", [
      { day: 21, time: "09:00 AM", title: "Interview – Product Designer Candidate", category: "Talent Acquisition", location: "Meeting Room C", users: ["https://i.pravatar.cc/150?u=1", "https://i.pravatar.cc/150?u=2"], extra: "+3" },
      { day: 21, time: "01:00 PM", title: "Mid-Year Performance Review – Design Dept", category: "Employee Development", location: "Notion Review Sheet", users: ["https://i.pravatar.cc/150?u=4", "https://i.pravatar.cc/150?u=5"], extra: "+21" },
      { day: 21, time: "03:00 PM", title: "Quarterly Policy Review Meeting", category: "Workplace Engagement", location: "Conference Room 1A", users: ["https://i.pravatar.cc/150?u=7", "https://i.pravatar.cc/150?u=8"], extra: "+2" },
      { day: 20, time: "10:00 AM", title: "Engineering Sync", category: "Employee Development", location: "Zoom", users: ["https://i.pravatar.cc/150?u=9"], extra: "" },
    ]);

    saveCollection("db_tasks", [
      { title: "Complete pre-session survey for Leadership Track session", category: "Employee Development", date: "28 June 2035", completed: false },
      { title: "Join Remote Work Compliance Briefing", category: "Workplace Engagement", date: "24 June 2035", completed: false },
      { title: "Prepare Q3 recruitment planning materials", category: "Talent Acquisition", date: "23 June 2035", completed: true },
    ]);

    saveCollection("db_activities", [
      { name: "Mia Torres", action: "approved 2 pending leave requests", time: "10:32 AM", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
      { name: "Ethan Ray", action: "updated his emergency contact details", time: "09:45 AM", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
      { name: "Jacob Yuen", action: "marked absent automatically due to no check-in", time: "09:15 AM", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
    ]);

    saveCollection("db_satisfaction", satisfactionSub);
    saveCollection("db_leaves", [{ id: "LV-1", name: "Lina Armand", status: "Pending" }]);
    saveCollection("db_applicants", [{ id: "APP-1", name: "Candidate A" }]);

    window.dispatchEvent(new Event("db_updated"));
    setToastText("Seeded sample database records!");
    setTimeout(() => setToastText(null), 3000);
  };

  const handleClearData = () => {
    saveCollection("db_employees", []);
    saveCollection("db_attendance", []);
    saveCollection("db_schedules", []);
    saveCollection("db_tasks", []);
    saveCollection("db_activities", []);
    saveCollection("db_satisfaction", []);
    saveCollection("db_leaves", []);
    saveCollection("db_applicants", []);

    window.dispatchEvent(new Event("db_updated"));
    setToastText("Cleared database. Showing empty states.");
    setTimeout(() => setToastText(null), 3000);
  };

  const handleToggleTask = (index: number) => {
    const updated = tasks.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t));
    setTasks(updated);
    saveCollection("db_tasks", updated);
  };

  const handleAddScheduleEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const updated = [
      ...schedulesList,
      {
        time: newEventTime,
        title: newEventTitle,
        category: newEventCategory,
        location: newEventLocation,
        type: "meeting",
        users: [
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
        ],
        extra: "+1",
        day: selectedDay,
      },
    ];
    setSchedulesList(updated);
    saveCollection("db_schedules", updated);
    setNewEventTitle("");
    setShowAddEvent(false);
    setToastText(`Scheduled event for ${selectedDay} June!`);
    setTimeout(() => setToastText(null), 3000);
  };

  // Pagination for Employee Attendance
  const totalAttendancePages = Math.ceil(attendance.length / pageSize) || 1;
  const currentAttendanceRows = attendance.slice(
    (attendancePage - 1) * pageSize,
    attendancePage * pageSize
  );

  // Schedules for the selected date
  const selectedDaySchedules = schedulesList.filter((s) => Number(s.day) === Number(selectedDay));

  return (
    <AppLayout title="Dashboard" breadcrumbs={[]}>
      <div className="space-y-5">
        {/* Greeting Header & Global DB Admin Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[14px] text-[#63716E]">
              Hello {user?.name?.split(" ")[0] ?? "there"}!
            </p>
            <h1 className="text-[20px] font-bold text-[#203430] tracking-tight">
              Good Morning
            </h1>
            <p className="text-[12px] text-slate-500 font-medium mt-0.5">
              Viewing as <span className="text-[#0E4D41] font-bold">{user?.roleLabel}</span>
            </p>
          </div>
          {canManage("roles") && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSeedData}
                className="text-[11px] font-semibold bg-[#E4F2D3] text-[#0E4D41] hover:bg-[#d8ebc3] px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors"
              >
                Seed Sample Data
              </button>
              <button
                onClick={handleClearData}
                className="text-[11px] font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors"
              >
                Clear DB
              </button>
            </div>
          )}
        </div>

        <RoleScopeBanner module={canView("employees") ? "employees" : canView("attendance") ? "attendance" : "profile"} />

        {/* Top Summary Row - KPI Cards filtered by role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            canView("employees") && {
              id: "employees",
              label: "Total Employees",
              val: employeesCount.toString(),
              unit: employeesCount === 1 ? "Employee" : "Employees",
              sub: employeesCount > 0 ? "You're part of a growing team!" : "No active employees registered.",
              actions: [
                ...(canManage("employees")
                  ? [{ label: "Register New Hire", act: () => navigate("/employees/new") }]
                  : []),
                { label: "View Personnel Directory", act: () => navigate("/employees") },
              ],
            },
            canView("attendance") && {
              id: "attendance",
              label: "Attendance",
              val: attendance.length > 0 ? `${overallAttendanceVal}%` : "0%",
              unit: attendance.length > 0 ? "Present – Reconciled logs" : "No attendance logs",
              sub: attendance.length > 0 ? "Attendance logs reconciled" : "No attendance records available.",
              actions: [
                { label: "Launch Attendance Workspace", act: () => navigate("/attendance") },
              ],
            },
            canView("leave") && {
              id: "leaves",
              label: "Leave Requests",
              val: pendingLeavesCount.toString(),
              unit: canApprove("leave")
                ? pendingLeavesCount === 1
                  ? "Pending Review"
                  : "Pending Requests"
                : "Your leave status",
              sub: canApprove("leave")
                ? pendingLeavesCount > 0
                  ? `${pendingLeavesCount} request(s) awaiting approval`
                  : "No pending leave requests."
                : "Showing your leave records only.",
              actions: [
                {
                  label: canApprove("leave") ? "Manage Leave Approvals" : "My Leave",
                  act: () => navigate("/leave"),
                },
              ],
            },
            canAccessNav("recruitment") && {
              id: "applicants",
              label: "Job Applicants",
              val: applicantsCount > 0 ? `+${applicantsCount}` : "0",
              unit: applicantsCount === 1 ? "Applicant" : "Applicants",
              sub: applicantsCount > 0 ? `${applicantsCount} candidates in pipeline` : "No job applicants recorded.",
              actions: [
                { label: "Launch Recruiting Pipeline", act: () => navigate("/recruitment") },
              ],
            },
          ]
            .filter(Boolean)
            .map((stat: any) => (
            <Card
              key={stat.label}
              className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-between h-[144px]"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#63716E]">
                    {stat.label}
                  </span>
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenu(activeMenu === stat.id ? null : stat.id)
                      }
                      className="p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
                    >
                      <MoreHorizontal className="h-4 w-4 text-[#A4ACAB]" />
                    </button>
                    {activeMenu === stat.id && (
                      <>
                        <div
                          className="fixed inset-0 z-[199]"
                          onClick={() => setActiveMenu(null)}
                        />
                        <div className="absolute right-0 top-7 z-[200] w-52 bg-white rounded-xl shadow-lg border border-[#E5E6E6] py-1.5 text-left animate-in fade-in duration-100">
                          {stat.actions.map((act, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                act.act();
                                setActiveMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-[11px] text-[#203430] hover:bg-slate-50 font-semibold transition-colors cursor-pointer border-none bg-transparent"
                            >
                              {act.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] font-bold text-[#203430] leading-none">
                    {stat.val}
                  </span>
                  <span className="text-[10px] text-[#63716E] truncate">
                    {stat.unit}
                  </span>
                </div>
              </div>
              <div className="bg-[#E4F2D3] p-2.5 rounded-[10px]">
                <p className="text-[11px] text-[#0E4D41] font-medium leading-tight truncate">
                  {stat.sub}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Layout Grid matching exact Figma 1214px equal height columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left + Middle Column Group (8/12 cols ~758px) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* Top Sub-row: 746px height */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-auto md:h-[746px]">
              {/* Calendar & Schedules Combined Card - 746px height */}
              <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-between h-[746px]">
                {/* Top Section: Month Calendar View */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowMonthMenu(!showMonthMenu)}
                        className="flex items-center gap-1.5 cursor-pointer hover:bg-[#F7F7F7] px-2 py-1 rounded-[8px] transition-colors border-none bg-transparent"
                      >
                        <span className="text-[18px] font-bold text-[#203430]">
                          {MONTH_NAMES[calendarMonth]} {calendarYear}
                        </span>
                        <ChevronDown className="h-4 w-4 text-[#63716E]" />
                      </button>

                      {showMonthMenu && (
                        <>
                          <div
                            className="fixed inset-0 z-[199]"
                            onClick={() => setShowMonthMenu(false)}
                          />
                          <div className="absolute left-0 top-9 z-[200] w-60 bg-white rounded-2xl shadow-xl border border-[#E5E6E6] p-3 text-left animate-in fade-in duration-100">
                            {/* Year Selector Bar */}
                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E6E6]">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCalendarYear((y) => y - 1);
                                }}
                                className="p-1 rounded-lg hover:bg-slate-100 text-[#203430] border-none bg-transparent cursor-pointer transition-colors"
                                title="Previous Year"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </button>
                              <span className="text-[13px] font-bold text-[#203430]">
                                {calendarYear}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCalendarYear((y) => y + 1);
                                }}
                                className="p-1 rounded-lg hover:bg-slate-100 text-[#203430] border-none bg-transparent cursor-pointer transition-colors"
                                title="Next Year"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>

                            {/* 12 Months Grid */}
                            <div className="grid grid-cols-3 gap-1.5">
                              {MONTH_NAMES.map((mName, mIdx) => (
                                <button
                                  key={mName}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCalendarMonth(mIdx);
                                    setShowMonthMenu(false);
                                  }}
                                  className={cn(
                                    "py-1.5 px-2 rounded-lg text-xs font-semibold cursor-pointer border-none transition-all text-center",
                                    calendarMonth === mIdx
                                      ? "bg-[#35BFA3] text-white font-bold shadow-sm"
                                      : "bg-[#F7F7F7] text-[#203430] hover:bg-slate-200"
                                  )}
                                >
                                  {mName.slice(0, 3)}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={handlePrevMonth}
                        className="p-1.5 rounded-lg bg-[#E4F2D3] hover:bg-[#d8ebc3] text-[#203430] cursor-pointer transition-colors border-none"
                        title="Previous Month"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className="p-1.5 rounded-lg bg-[#E4F2D3] hover:bg-[#d8ebc3] text-[#203430] cursor-pointer transition-colors border-none"
                        title="Next Month"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-y-1.5 text-center">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <span
                        key={`${d}-${i}`}
                        className="text-[12px] font-normal text-[#63716E] py-1"
                      >
                        {d}
                      </span>
                    ))}
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                      // Fix Bug 2: ONLY highlight dates if there are ACTUAL schedule events on that date!
                      const hasEvent = schedulesList.some((s) => Number(s.day) === day);
                      const isSelected = day === selectedDay;

                      return (
                        <div
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className="h-8 w-8 mx-auto flex items-center justify-center relative cursor-pointer"
                        >
                          <div
                            className={cn(
                              "h-7 w-7 rounded-full flex items-center justify-center text-[13px] font-medium transition-all",
                              isSelected
                                ? "bg-[#35BFA3] text-white font-bold ring-2 ring-[#0E4D41]/20"
                                : hasEvent
                                  ? "bg-[#0E4D41] text-white font-bold"
                                  : "text-[#203430] hover:bg-[#F7F7F7]"
                            )}
                          >
                            {day}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Single Card Separator Line */}
                <div className="border-t border-[#F7F7F7] my-2" />

                {/* Bottom Section: Schedules List */}
                <div className="space-y-3 flex-1 flex flex-col justify-start">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-semibold text-[#203430]">
                      Schedules
                    </h3>
                    <div className="flex items-center gap-1.5 relative">
                      <button
                        type="button"
                        onClick={() => setShowAddEvent(!showAddEvent)}
                        className="text-[10px] bg-[#E4F2D3] hover:bg-[#d8ebc3] text-[#0E4D41] font-bold px-2 py-1 rounded-[8px] cursor-pointer transition-colors border-none"
                      >
                        + Add Event
                      </button>

                      <TeamHubDatePicker
                        mode="date"
                        year={calendarYear}
                        month={calendarMonth}
                        day={selectedDay}
                        buttonClassName="px-2.5 py-1 text-[12px]"
                        onChange={({ year: y, month: m, day: d }) => {
                          setCalendarYear(y);
                          setCalendarMonth(m);
                          setSelectedDay(d);
                        }}
                      />
                    </div>
                  </div>

                  {showAddEvent && (
                    <form
                      onSubmit={handleAddScheduleEvent}
                      className="bg-[#F7F7F7] p-2.5 rounded-xl border border-[#E5E6E6] space-y-2 text-left animate-in slide-in-from-top-2 duration-150"
                    >
                      <input
                        type="text"
                        placeholder="Event Title..."
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        className="w-full text-xs font-semibold p-2 bg-white rounded-lg border border-[#E5E6E6] outline-none"
                        required
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Time (e.g. 11:00 AM)"
                          value={newEventTime}
                          onChange={(e) => setNewEventTime(e.target.value)}
                          className="w-1/2 text-xs p-2 bg-white rounded-lg border border-[#E5E6E6]"
                        />
                        <input
                          type="text"
                          placeholder="Location"
                          value={newEventLocation}
                          onChange={(e) => setNewEventLocation(e.target.value)}
                          className="w-1/2 text-xs p-2 bg-white rounded-lg border border-[#E5E6E6]"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <select
                          value={newEventCategory}
                          onChange={(e) => setNewEventCategory(e.target.value)}
                          className="text-[10px] bg-white border border-[#E5E6E6] p-1 rounded font-bold"
                        >
                          <option value="Employee Development">Development</option>
                          <option value="Talent Acquisition">Recruiting</option>
                          <option value="Workplace Engagement">Engagement</option>
                        </select>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setShowAddEvent(false)}
                            className="text-[10px] font-bold px-2 py-1 rounded hover:bg-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="text-[10px] font-bold bg-[#35BFA3] text-white px-2.5 py-1 rounded hover:bg-[#28A38B] cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Fix Bug 3: Empty State positioned directly at top under header */}
                  <div className="space-y-2.5 mt-2">
                    {selectedDaySchedules.length === 0 ? (
                      <div className="py-6 px-4 text-center border border-dashed border-[#E5E6E6] rounded-xl flex flex-col items-center justify-center space-y-1.5 bg-[#F7F7F7]/50">
                        <p className="text-[12px] font-bold text-[#63716E]">
                          No Schedules for {selectedDay} {MONTH_NAMES[calendarMonth]}
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowAddEvent(true)}
                          className="text-[11px] text-[#35BFA3] font-bold hover:underline cursor-pointer border-none bg-transparent"
                        >
                          + Add New Schedule
                        </button>
                      </div>
                    ) : (
                      selectedDaySchedules.map((s, idx) => (
                        <div key={idx} className="bg-[#F7F7F7] p-3 rounded-[10px] space-y-1.5">
                          <div>
                            <p className="text-[11px] font-medium text-[#35BFA3]">
                              {s.category}
                            </p>
                            <h4 className="text-[13px] font-semibold text-[#203430] leading-snug">
                              {s.title}
                            </h4>
                          </div>
                          <div className="flex items-center justify-between pt-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-[#E4F2D3] text-[#0E4D41] text-[10px] font-medium px-2 py-0.5 rounded-[6px]">
                                {s.location}
                              </span>
                              <span className="text-[11px] text-[#63716E]">
                                {s.time}
                              </span>
                            </div>
                            <div className="flex -space-x-1.5 items-center">
                              {s.users?.map((u: string, i: number) => (
                                <img
                                  key={i}
                                  src={u}
                                  className="h-5 w-5 rounded-full border border-white shrink-0 object-cover"
                                  alt="Avatar"
                                />
                              ))}
                              {s.extra && (
                                <div className="h-5 w-5 rounded-full bg-[#0E4D41] text-white border border-white flex items-center justify-center text-[8px] font-normal shrink-0">
                                  {s.extra}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>

              {/* Attendance Report + Employee Satisfaction Stack - 746px total height */}
              <div className="flex flex-col gap-5 h-[746px]">
                {/* Attendance Report Heatmap Card - 300px height */}
                <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-between h-[300px]">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[16px] font-semibold text-[#203430]">
                      Attendance Report
                    </h3>
                    <TeamHubDatePicker
                      mode="hybrid"
                      label={attendanceTimeframe}
                      presets={["This Month", "Last Month", "This Week"]}
                      onPresetSelect={(p) => setAttendanceTimeframe(p)}
                      onChange={({ label: l }) => setAttendanceTimeframe(l)}
                      icon={false}
                      buttonClassName="bg-[#E4F2D3] hover:bg-[#d8ebc3] text-[#0E4D41] text-[12px] px-3 py-1 font-medium"
                    />
                  </div>

                  {attendance.length === 0 ? (
                    <div className="py-6 px-3 text-center border border-dashed border-[#E5E6E6] rounded-xl flex flex-col items-center justify-center space-y-1.5 bg-[#F7F7F7]/40 my-auto">
                      <Clock className="h-5 w-5 text-[#63716E]/70" />
                      <p className="text-[12px] font-bold text-[#203430]">
                        No Attendance Data Recorded
                      </p>
                      <p className="text-[10px] text-[#63716E] max-w-xs leading-relaxed">
                        Heatmap and timecard analytics will generate as employees log daily check-ins.
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate("/attendance")}
                        className="text-[10px] bg-[#35BFA3] text-white font-bold px-3 py-1 rounded-[6px] hover:bg-[#28A38B] cursor-pointer border-none shadow-sm"
                      >
                        Manage Attendance
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[24px] font-semibold text-[#203430]">
                            {overallAttendanceVal}%
                          </span>
                          <span className="bg-[#E4F2D3] text-[#0E4D41] text-[11px] font-medium px-1.5 py-0.5 rounded-[8px] flex items-center gap-0.5">
                            <ArrowUpRight className="h-3 w-3 text-[#35BFA3]" /> +1.54%
                          </span>
                        </div>
                        <p className="text-[11px] text-[#63716E]">
                          Attendance Rate ({attendanceTimeframe})
                        </p>
                      </div>

                      {/* Heatmap Chart Grid */}
                      <div className="space-y-1.5">
                        {getAttendanceHeatmap(attendanceTimeframe).map((row, rIdx) => (
                          <div key={rIdx} className="flex items-center gap-2">
                            <span className="w-12 text-right text-[10px] text-[#63716E] font-normal shrink-0">
                              {row.time}
                            </span>
                            <div className="grid grid-cols-5 gap-1.5 flex-1">
                              {row.cells.map((color, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="h-[18px] rounded-[5px] transition-transform hover:scale-105 cursor-pointer"
                                  style={{ backgroundColor: color }}
                                  title={`${heatmapDays[cIdx]} ${row.time}`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                        {/* Heatmap X-Axis Day Labels */}
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="w-12 shrink-0" />
                          <div className="grid grid-cols-5 gap-1.5 flex-1 text-center">
                            {heatmapDays.map((day) => (
                              <span key={day} className="text-[10px] text-[#63716E] font-normal">
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Card>

                {/* Employee Satisfaction Card - 426px height */}
                <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-between h-[426px]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-semibold text-[#203430]">
                      Employee Satisfaction
                    </h3>

                    {/* Fix Bug 4: Menu button ... in Employee Satisfaction */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveMenu(activeMenu === "satisfaction" ? null : "satisfaction")}
                        className="text-[#363B3F] hover:bg-slate-100 p-1 rounded-lg border-none bg-transparent cursor-pointer"
                      >
                        <MoreHorizontal className="h-5 w-5 text-[#363B3F]" />
                      </button>
                      {activeMenu === "satisfaction" && (
                        <>
                          <div
                            className="fixed inset-0 z-[199]"
                            onClick={() => setActiveMenu(null)}
                          />
                          <div className="absolute right-0 top-7 z-[200] w-48 bg-white rounded-xl shadow-lg border border-[#E5E6E6] py-1 text-left animate-in fade-in duration-100">
                            <button
                              onClick={() => {
                                navigate("/performance");
                                setActiveMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-[11px] text-[#203430] hover:bg-slate-50 font-semibold cursor-pointer border-none bg-transparent"
                            >
                              View All Feedback
                            </button>
                            <button
                              onClick={() => {
                                setToastText("Launched Survey Form!");
                                setActiveMenu(null);
                                setTimeout(() => setToastText(null), 3000);
                              }}
                              className="w-full text-left px-4 py-2 text-[11px] text-[#203430] hover:bg-slate-50 font-semibold cursor-pointer border-none bg-transparent"
                            >
                              Launch Survey
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Fix Bug 4: Real / Empty state for Employee Satisfaction */}
                  {satisfactionData.length === 0 ? (
                    <div className="py-8 px-4 text-center border border-dashed border-[#E5E6E6] rounded-xl flex flex-col items-center justify-center space-y-2 bg-[#F7F7F7]/40 my-auto">
                      <FileText className="h-6 w-6 text-[#63716E]/70" />
                      <p className="text-[13px] font-bold text-[#203430]">
                        No Pulse Survey Responses Recorded
                      </p>
                      <p className="text-[10px] text-[#63716E] max-w-xs leading-relaxed">
                        Quantitative satisfaction metrics will populate after launching an employee pulse survey.
                      </p>
                      <button
                        type="button"
                        onClick={handleSeedData}
                        className="text-[11px] bg-[#35BFA3] text-white font-bold px-3.5 py-1.5 rounded-[8px] hover:bg-[#28A38B] cursor-pointer border-none mt-1 shadow-sm"
                      >
                        Launch Pulse Survey
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Main Gauge Arc Display */}
                      {(() => {
                        const overallSatisfactionVal = satisfactionData.length
                          ? Math.round(
                              satisfactionData.reduce((acc: number, curr: any) => acc + (Number(curr.percentage) || 70), 0) /
                                satisfactionData.length
                            )
                          : 73;

                        const pct = Math.min(100, Math.max(0, overallSatisfactionVal));
                        const rad = Math.PI * (1 - pct / 100);
                        const cx = 80, cy = 80, r = 60;
                        const arcX = cx + r * Math.cos(rad);
                        const arcY = cy - r * Math.sin(rad);
                        const needleLen = 46;
                        const needleX = cx + needleLen * Math.cos(rad);
                        const needleY = cy - needleLen * Math.sin(rad);

                        return (
                          <>
                            <div className="flex items-center justify-center my-1">
                              <div className="relative w-44 h-22 flex items-end justify-center">
                                <svg className="w-44 h-22 overflow-visible" viewBox="0 0 160 90">
                                  {/* Background arc */}
                                  <path
                                    d="M 20 80 A 60 60 0 0 1 140 80"
                                    fill="none"
                                    stroke="#E4F2D3"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                  />
                                  {/* Active value arc */}
                                  {pct > 0 && (
                                    <path
                                      d={`M 20 80 A 60 60 0 0 1 ${arcX} ${arcY}`}
                                      fill="none"
                                      stroke="#35BFA3"
                                      strokeWidth="12"
                                      strokeLinecap="round"
                                    />
                                  )}
                                  {/* Needle line */}
                                  <line
                                    x1={cx}
                                    y1={cy}
                                    x2={needleX}
                                    y2={needleY}
                                    stroke="#0E4D41"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                  />
                                  <circle cx={cx} cy={cy} r="6" fill="#0E4D41" />
                                </svg>
                              </div>
                            </div>

                            <div className="text-center -mt-1 mb-2">
                              <div className="flex items-baseline justify-center gap-1">
                                <span className="text-[18px] font-bold text-[#203430]">
                                  {overallSatisfactionVal}%
                                </span>
                              </div>
                              <p className="text-[12px] text-[#63716E]">
                                Employee Satisfied
                              </p>
                              <div className="flex items-center justify-center gap-1 mt-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3.5 w-3.5 fill-[#F8C947] text-[#F8C947]"
                                  />
                                ))}
                                <span className="text-[13px] font-semibold text-[#203430] ml-1">
                                  4.2/5
                                </span>
                              </div>
                            </div>
                          </>
                        );
                      })()}

                      {/* Light Green Banner */}
                      <div className="bg-[#E4F2D3] p-2 rounded-[8px] text-center">
                        <p className="text-[11px] text-[#63716E]">
                          That's an{" "}
                          <span className="font-bold text-[#0E4D41]">
                            increase of 6%
                          </span>{" "}
                          from last month
                        </p>
                      </div>

                      {/* Sub-breakdown rows */}
                      <div className="space-y-2.5">
                        {satisfactionData.map((s) => (
                          <div
                            key={s.label}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="text-[12px] font-bold text-[#203430] leading-none">
                                {s.label}
                              </p>
                              <p className="text-[11px] text-[#63716E] mt-0.5">
                                {s.percentage}% Satisfaction
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, ratingIdx) => (
                                  <Star
                                    key={ratingIdx}
                                    className="h-3 w-3 fill-[#F8C947] text-[#F8C947]"
                                  />
                                ))}
                              </div>
                              <span className="text-[12px] font-bold text-[#203430]">
                                {s.score}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </Card>
              </div>
            </div>

            {/* Bottom Sub-row: Employee Attendance Table Card - 448px height */}
            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-between h-[448px]">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold text-[#203430]">
                  Employee Attendance
                </h3>

                {/* Timeframe Selector & Menu button for Employee Attendance */}
                <div className="relative flex items-center gap-2">
                  <TeamHubDatePicker
                    mode="hybrid"
                    label={empAttendanceTimeframe}
                    presets={["This Month", "Last Month", "This Week", "All Time"]}
                    onPresetSelect={(p) => setEmpAttendanceTimeframe(p)}
                    onChange={({ label: l }) => setEmpAttendanceTimeframe(l)}
                    icon={false}
                    buttonClassName="bg-[#E4F2D3] hover:bg-[#d8ebc3] text-[#0E4D41] text-[12px] px-3 py-1.5 font-medium"
                  />

                  <button
                    type="button"
                    onClick={() => setActiveMenu(activeMenu === "attendanceTable" ? null : "attendanceTable")}
                    className="p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <MoreHorizontal className="h-4 w-4 text-[#A4ACAB]" />
                  </button>

                  {activeMenu === "attendanceTable" && (
                    <>
                      <div
                        className="fixed inset-0 z-[199]"
                        onClick={() => setActiveMenu(null)}
                      />
                      <div className="absolute right-0 top-7 z-[200] w-48 bg-white rounded-xl shadow-lg border border-[#E5E6E6] py-1 text-left animate-in fade-in duration-100">
                        <button
                          onClick={() => {
                            navigate("/attendance");
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 text-[11px] text-[#203430] hover:bg-slate-50 font-semibold cursor-pointer border-none bg-transparent"
                        >
                          View Attendance Workspace
                        </button>
                        <button
                          onClick={handleSeedData}
                          className="w-full text-left px-4 py-2 text-[11px] text-[#203430] hover:bg-slate-50 font-semibold cursor-pointer border-none bg-transparent"
                        >
                          Seed Records
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Numbers Summary Row with Dividers */}
              <div className="flex items-center gap-6 py-1 border-b border-[#E5E6E6] pb-3">
                <div className="flex items-center gap-2 pr-6 border-r border-[#E5E6E6]">
                  <span className="text-[28px] font-bold text-[#203430]">
                    {attendance.filter((a) => a.status === "On-Time").length}
                  </span>
                  <span className="text-[11px] text-[#63716E]">On-Time</span>
                </div>
                <div className="flex items-center gap-2 pr-6 border-r border-[#E5E6E6]">
                  <span className="text-[28px] font-bold text-[#203430]">
                    {attendance.filter((a) => a.status === "Late").length}
                  </span>
                  <span className="text-[11px] text-[#63716E]">Late</span>
                </div>
                <div className="flex items-center gap-2 pr-6 border-r border-[#E5E6E6]">
                  <span className="text-[28px] font-bold text-[#203430]">
                    {attendance.filter((a) => a.status === "On Leave").length}
                  </span>
                  <span className="text-[11px] text-[#63716E]">On Leave</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[28px] font-bold text-[#203430]">
                    {attendance.filter((a) => a.status === "Absent").length}
                  </span>
                  <span className="text-[11px] text-[#63716E]">Absent</span>
                </div>
              </div>

              {/* Fix Bug 7: Real / Empty state for Employee Attendance */}
              {attendance.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-[#E5E6E6] rounded-xl flex flex-col items-center justify-center space-y-2 bg-[#F7F7F7]/30 my-auto">
                  <AlertCircle className="h-8 w-8 text-[#A4ACAB]" />
                  <p className="text-[12px] font-bold text-[#203430]">
                    No attendance records available for this period
                  </p>
                  <button
                    type="button"
                    onClick={handleSeedData}
                    className="text-[10px] bg-[#35BFA3] text-white font-bold px-3 py-1.5 rounded-[6px] hover:bg-[#28A38B] cursor-pointer border-none mt-1"
                  >
                    Seed Attendance Records
                  </button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                      <thead className="bg-[#F7F7F7] rounded-[8px]">
                        <tr className="text-[10px] text-[#63716E] font-normal">
                          <th className="px-3 py-2">
                            <span className="flex items-center gap-1">Name <ArrowUpDown className="h-3 w-3" /></span>
                          </th>
                          <th className="px-3 py-2">
                            <span className="flex items-center gap-1">Job Title <ArrowUpDown className="h-3 w-3" /></span>
                          </th>
                          <th className="px-3 py-2">
                            <span className="flex items-center gap-1">Date <ArrowUpDown className="h-3 w-3" /></span>
                          </th>
                          <th className="px-3 py-2">
                            <span className="flex items-center gap-1">Check In <ArrowUpDown className="h-3 w-3" /></span>
                          </th>
                          <th className="px-3 py-2">
                            <span className="flex items-center gap-1">Check Out <ArrowUpDown className="h-3 w-3" /></span>
                          </th>
                          <th className="px-3 py-2">
                            <span className="flex items-center gap-1">Status <ArrowUpDown className="h-3 w-3" /></span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E6E6]">
                        {currentAttendanceRows.map((a, i) => (
                          <tr key={i} className="h-[48px] hover:bg-[#F7F7F7]/50 transition-colors">
                            <td className="px-3 py-1">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={a.avatar}
                                  className="h-8 w-8 rounded-full object-cover shrink-0"
                                  alt={a.name}
                                />
                                <div>
                                  <p className="text-[11px] font-medium text-[#203430]">
                                    {a.name}
                                  </p>
                                  <p className="text-[10px] text-[#63716E]">
                                    {a.id}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-1">
                              <div>
                                <p className="text-[11px] font-medium text-[#203430]">
                                  {a.job}
                                </p>
                                <p className="text-[10px] text-[#757575]">
                                  {a.dept}
                                </p>
                              </div>
                            </td>
                            <td className="px-3 py-1 text-[11px] text-[#203430]">
                              {a.date}
                            </td>
                            <td className="px-3 py-1 text-[11px] text-[#203430]">
                              {a.in}
                            </td>
                            <td className="px-3 py-1 text-[11px] text-[#203430]">
                              {a.out}
                            </td>
                            <td className="px-3 py-1">
                              <span
                                className={cn(
                                  "inline-flex items-center justify-center px-2.5 py-0.5 rounded-[9px] text-[11px] font-normal",
                                  a.status === "On-Time"
                                    ? "bg-[#35BFA3] text-white"
                                    : a.status === "Late"
                                      ? "bg-[#E4F2D3] text-[#203430]"
                                      : a.status === "On Leave"
                                        ? "bg-[#E5E6E6] text-[#203430]"
                                        : "bg-[#0E4D41] text-white"
                                )}
                              >
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Pagination Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E6E6]">
                    <p className="text-[11px] text-[#63716E]">
                      Showing{" "}
                      <span className="font-semibold text-[#203430]">
                        {(attendancePage - 1) * pageSize + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-[#203430]">
                        {Math.min(attendancePage * pageSize, attendance.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-[#203430]">
                        {attendance.length}
                      </span>{" "}
                      employees
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setAttendancePage(Math.max(1, attendancePage - 1))}
                        disabled={attendancePage === 1}
                        className="p-1.5 rounded-[8px] bg-[#F7F7F7] text-[#203430] disabled:opacity-40 cursor-pointer border-none"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {Array.from({ length: totalAttendancePages }, (_, pIdx) => pIdx + 1).map(
                        (pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setAttendancePage(pageNum)}
                            className={cn(
                              "h-7 w-7 rounded-[8px] text-[11px] font-bold transition-colors cursor-pointer border-none",
                              attendancePage === pageNum
                                ? "bg-[#35BFA3] text-white"
                                : "bg-[#F7F7F7] text-[#203430] hover:bg-slate-200"
                            )}
                          >
                            {pageNum}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => setAttendancePage(Math.min(totalAttendancePages, attendancePage + 1))}
                        disabled={attendancePage === totalAttendancePages}
                        className="p-1.5 rounded-[8px] bg-[#F7F7F7] text-[#203430] disabled:opacity-40 cursor-pointer border-none"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Right Column Group (4/12 cols ~369px) - 1214px total height */}
          <div className="lg:col-span-4 flex flex-col gap-5 h-auto lg:h-[1214px]">
            {/* Team Performance Card - 300px height */}
            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-between h-[300px]">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold text-[#203430]">
                  Team Performance
                </h3>

                <TeamHubDatePicker
                  mode="hybrid"
                  label={teamPerfTimeframe}
                  presets={["Last 6 Months", "This Year", "Last 30 Days"]}
                  onPresetSelect={(p) => setTeamPerfTimeframe(p)}
                  onChange={({ label: l }) => setTeamPerfTimeframe(l)}
                  icon={false}
                  buttonClassName="bg-[#E4F2D3] hover:bg-[#d8ebc3] text-[#0E4D41] text-[12px] px-3 py-1.5 font-medium"
                />
              </div>

              {employeesList.length === 0 ? (
                <div className="py-8 px-4 text-center border border-dashed border-[#E5E6E6] rounded-xl flex flex-col items-center justify-center space-y-2 bg-[#F7F7F7]/40 my-auto">
                  <Users className="h-6 w-6 text-[#63716E]/70" />
                  <p className="text-[13px] font-bold text-[#203430]">
                    No Performance Metrics Available
                  </p>
                  <p className="text-[10px] text-[#63716E] max-w-xs leading-relaxed">
                    Team performance analytics will generate as employee appraisals and evaluations are recorded.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/performance")}
                    className="text-[11px] bg-[#35BFA3] text-white font-bold px-3.5 py-1.5 rounded-[8px] hover:bg-[#28A38B] cursor-pointer border-none mt-1 shadow-sm"
                  >
                    Conduct Review
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <span className="text-[24px] font-semibold text-[#203430]">
                      89.52%
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="bg-[#E4F2D3] text-[#0E4D41] text-[11px] font-medium px-1.5 py-0.5 rounded-[8px] flex items-center gap-0.5">
                        <ArrowUpRight className="h-3 w-3 text-[#35BFA3]" /> +3.84%
                      </span>
                      <span className="text-[11px] text-[#63716E]">
                        Increased vs last week
                      </span>
                    </div>
                  </div>

                  {/* Fix Bug 1: Chart Blue Border bug fixed using outline-none and tabIndex={-1} */}
                  <div className="h-[150px] w-full relative pt-2 focus:outline-none outline-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={getTeamPerfData(teamPerfTimeframe)}
                        margin={{ top: 30, right: 10, left: -20, bottom: 0 }}
                        style={{ outline: "none" }}
                      >
                        <defs>
                          <linearGradient id="colorPerfGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#35BFA3" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#E4F2D3" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <YAxis
                          domain={[0, 100]}
                          ticks={[0, 25, 50, 75, 100]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 9, fill: "#63716E" }}
                          tickFormatter={(val) => `${val}%`}
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: "#63716E" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#35BFA3"
                          strokeWidth={2}
                          fill="url(#colorPerfGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>

                    {/* Active Callout Overlay */}
                    <div className="absolute right-[18%] top-0 flex flex-col items-center pointer-events-none">
                      <div className="bg-white px-2 py-0.5 rounded-[6px] shadow-md border border-[#E5E6E6] text-center">
                        <p className="text-[8px] text-[#63716E]">May 2035</p>
                        <p className="text-[11px] font-bold text-[#0E4D41]">95.2%</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-[#35BFA3] ring-4 ring-[#35BFA3]/30 my-0.5" />
                      <div className="w-0.5 h-16 border-r border-dashed border-[#A4ACAB]" />
                    </div>
                  </div>
                </>
              )}
            </Card>

            {/* Employment Status Card - 283px height */}
            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-between h-[283px]">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold text-[#203430]">
                  Employment Status
                </h3>

                {/* Menu ... button for Employment Status */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveMenu(activeMenu === "empStatus" ? null : "empStatus")}
                    className="text-[#363B3F] hover:bg-slate-100 p-1 rounded-lg border-none bg-transparent cursor-pointer"
                  >
                    <MoreHorizontal className="h-5 w-5 text-[#363B3F]" />
                  </button>
                  {activeMenu === "empStatus" && (
                    <>
                      <div
                        className="fixed inset-0 z-[199]"
                        onClick={() => setActiveMenu(null)}
                      />
                      <div className="absolute right-0 top-7 z-[200] w-48 bg-white rounded-xl shadow-lg border border-[#E5E6E6] py-1 text-left animate-in fade-in duration-100">
                        <button
                          onClick={() => {
                            navigate("/employees");
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 text-[11px] text-[#203430] hover:bg-slate-50 font-semibold cursor-pointer border-none bg-transparent"
                        >
                          View Employee Roster
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[24px] font-semibold text-[#203430]">
                  {employeesCount}
                </span>
                <span className="text-[11px] text-[#63716E] ml-1.5">
                  Employees
                </span>
              </div>

              {/* Multi-segment Status Progress Bar */}
              <div className="h-2.5 w-full flex bg-[#F7F7F7] rounded-full overflow-hidden">
                <div className="h-full bg-[#0E4D41]" style={{ width: `${ftPct}%` }} />
                <div className="h-full bg-[#35BFA3]" style={{ width: `${ptPct}%` }} />
                <div className="h-full bg-[#E4F2D3]" style={{ width: `${flPct}%` }} />
                <div className="h-full bg-[#A4ACAB]" style={{ width: `${inPct}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-[#63716E] -mt-2">
                <span>0%</span>
                <span>100%</span>
              </div>

              {/* 2x2 Legend Grid */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                {[
                  {
                    label: "Full-Time",
                    pct: `${ftPct}%`,
                    emp: `${fullTimeCount} Employees`,
                    color: "bg-[#0E4D41]",
                  },
                  {
                    label: "Part-Time",
                    pct: `${ptPct}%`,
                    emp: `${partTimeCount} Employees`,
                    color: "bg-[#35BFA3]",
                  },
                  {
                    label: "Freelance",
                    pct: `${flPct}%`,
                    emp: `${freelanceCount} Employees`,
                    color: "bg-[#E4F2D3]",
                  },
                  {
                    label: "Internship",
                    pct: `${inPct}%`,
                    emp: `${internCount} Employees`,
                    color: "bg-[#A4ACAB]",
                  },
                ].map((item) => (
                  <div key={item.label} className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <div className={cn("h-2 w-2 rounded-full", item.color)} />
                      <span className="text-[12px] font-semibold text-[#203430]">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#63716E] pl-3.5">
                      <span className="font-bold">{item.pct}</span> – {item.emp}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tasks Card - 308px height */}
            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-between h-[308px]">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold text-[#203430]">
                  Tasks
                </h3>

                {/* Menu ... button for Tasks */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveMenu(activeMenu === "tasksMenu" ? null : "tasksMenu")}
                    className="text-[#363B3F] hover:bg-slate-100 p-1 rounded-lg border-none bg-transparent cursor-pointer"
                  >
                    <MoreHorizontal className="h-5 w-5 text-[#363B3F]" />
                  </button>
                  {activeMenu === "tasksMenu" && (
                    <>
                      <div
                        className="fixed inset-0 z-[199]"
                        onClick={() => setActiveMenu(null)}
                      />
                      <div className="absolute right-0 top-7 z-[200] w-48 bg-white rounded-xl shadow-lg border border-[#E5E6E6] py-1 text-left animate-in fade-in duration-100">
                        <button
                          onClick={() => {
                            setTasks([]);
                            saveCollection("db_tasks", []);
                            setActiveMenu(null);
                            setToastText("Cleared all tasks!");
                            setTimeout(() => setToastText(null), 3000);
                          }}
                          className="w-full text-left px-4 py-2 text-[11px] text-red-600 hover:bg-slate-50 font-semibold cursor-pointer border-none bg-transparent"
                        >
                          Clear Tasks List
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {tasks.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-[#E5E6E6] rounded-xl flex flex-col items-center justify-center space-y-1 bg-[#F7F7F7]/30 my-auto">
                  <CheckCircle2 className="h-7 w-7 text-[#35BFA3]" />
                  <p className="text-[12px] font-bold text-[#203430]">
                    You're all caught up!
                  </p>
                  <p className="text-[10px] text-[#63716E]">
                    No outstanding tasks found.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 divide-y divide-[#E5E6E6] flex-1 flex flex-col justify-around">
                  {tasks.map((task, i) => (
                    <div key={i} className="flex gap-3 items-start pt-2.5 first:pt-0">
                      <button
                        type="button"
                        onClick={() => handleToggleTask(i)}
                        className="mt-0.5 flex-shrink-0 cursor-pointer border-none bg-transparent p-0"
                      >
                        {task.completed ? (
                          <div className="h-4 w-4 rounded-[4px] bg-[#35BFA3] text-white flex items-center justify-center text-[10px]">
                            ✓
                          </div>
                        ) : (
                          <div className="h-4 w-4 rounded-[4px] border border-[#E5E6E6] bg-[#F7F7F7]" />
                        )}
                      </button>
                      <div className="space-y-1.5 flex-grow">
                        <p
                          className={cn(
                            "text-[12px] leading-snug",
                            task.completed
                              ? "text-[#63716E] line-through"
                              : "text-[#203430] font-normal"
                          )}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="bg-[#E4F2D3] text-[#0E4D41] text-[11px] font-medium px-2 py-0.5 rounded-[6px]">
                            {task.category}
                          </span>
                          <span className="bg-[#F7F7F7] text-[#63716E] text-[11px] font-medium px-2 py-0.5 rounded-[6px]">
                            {task.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Activities Card - 263px height */}
            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-between h-[263px]">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold text-[#203430]">
                  Recent Activities
                </h3>

                {/* Menu ... button for Recent Activities */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveMenu(activeMenu === "activitiesMenu" ? null : "activitiesMenu")}
                    className="text-[#363B3F] hover:bg-slate-100 p-1 rounded-lg border-none bg-transparent cursor-pointer"
                  >
                    <MoreHorizontal className="h-5 w-5 text-[#363B3F]" />
                  </button>
                  {activeMenu === "activitiesMenu" && (
                    <>
                      <div
                        className="fixed inset-0 z-[199]"
                        onClick={() => setActiveMenu(null)}
                      />
                      <div className="absolute right-0 top-7 z-[200] w-48 bg-white rounded-xl shadow-lg border border-[#E5E6E6] py-1 text-left animate-in fade-in duration-100">
                        <button
                          onClick={() => {
                            setActivities([]);
                            saveCollection("db_activities", []);
                            setActiveMenu(null);
                            setToastText("Cleared activity log!");
                            setTimeout(() => setToastText(null), 3000);
                          }}
                          className="w-full text-left px-4 py-2 text-[11px] text-red-600 hover:bg-slate-50 font-semibold cursor-pointer border-none bg-transparent"
                        >
                          Clear Activity Log
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Fix Bug 7: Real / Empty state for Recent Activities */}
              {activities.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-[#E5E6E6] rounded-xl flex flex-col items-center justify-center space-y-1 bg-[#F7F7F7]/30 my-auto">
                  <Clock className="h-7 w-7 text-[#A4ACAB]" />
                  <p className="text-[12px] font-bold text-[#203430]">
                    No recent activity to display
                  </p>
                  <p className="text-[10px] text-[#63716E]">
                    Actions performed in the system will log here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 flex-1 flex flex-col justify-around">
                  {activities.map((activity, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <img
                        src={activity.avatar}
                        className="h-8 w-8 rounded-full shrink-0 object-cover"
                        alt={activity.name}
                      />
                      <div className="space-y-0.5">
                        <p className="text-[12px] leading-snug text-[#203430]">
                          <span className="font-bold">{activity.name}</span>{" "}
                          <span>{activity.action}</span>
                        </p>
                        <p className="text-[10px] text-[#63716E]">
                          19 June 2035 – {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Footer Legal & Links */}
      <footer className="mt-8 py-4 border-t border-[#E5E6E6] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[12px] font-bold text-[#203430]">
          Copyright © 2025 Peterdraw
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-[12px] text-[#63716E] hover:text-[#35BFA3] transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-[12px] text-[#63716E] hover:text-[#35BFA3] transition-colors">
            Term and conditions
          </a>
          <a href="#" className="text-[12px] text-[#63716E] hover:text-[#35BFA3] transition-colors">
            Contact
          </a>
        </div>
      </footer>

      {/* Dynamic Toast */}
      {toastText && (
        <div className="fixed bottom-6 right-6 z-[2000] bg-[#203430] text-white px-5 py-3.5 rounded-[12px] shadow-2xl flex items-center gap-3 border border-white/10 animate-[slideUp_0.3s_ease-out]">
          <div className="h-6 w-6 bg-[#35BFA3] rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
            ✓
          </div>
          <p className="text-[12px] font-bold leading-tight">{toastText}</p>
        </div>
      )}
    </AppLayout>
  );
}
