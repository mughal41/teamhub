import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { getCollection, saveCollection } from "../lib/db";
import { Card, Badge } from "../components/ui/LayoutAddons";
import { getDashboardStatsApi } from "../lib/api/employees";
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
  MessageSquare,
} from "lucide-react";
import {
  LineChart,
  Line,
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
  PieChart,
  Pie,
} from "recharts";
import { cn, useCurrency } from "../lib/utils";
import { useNavigate } from "react-router-dom";

const attendanceData = [
  { day: "Mon", onTime: 80, late: 12, leave: 5, absent: 3 },
  { day: "Tue", onTime: 75, late: 15, leave: 7, absent: 3 },
  { day: "Wed", onTime: 82, late: 10, leave: 6, absent: 2 },
  { day: "Thu", onTime: 70, late: 20, leave: 5, absent: 5 },
  { day: "Fri", onTime: 85, late: 8, leave: 4, absent: 3 },
];

const teamPerfData = [
  { name: "Jan", value: 65, active: false },
  { name: "Feb", value: 72, active: false },
  { name: "Mar", value: 68, active: false },
  { name: "Apr", value: 85, active: false },
  { name: "May", value: 95.2, active: true },
  { name: "Jun", value: 75, active: false },
];

const attendanceList = [
  {
    name: "Olivia Mason",
    id: "EMP-0234",
    job: "Marketing",
    dept: "Executive Marketing",
    date: "19 Jun 2035",
    in: "08:55 AM",
    out: "05:05 PM",
    status: "On-Time",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
  },
  {
    name: "Ethan Ray",
    id: "EMP-0178",
    job: "UI Designer",
    dept: "Product Design",
    date: "19 Jun 2035",
    in: "09:14 AM",
    out: "05:20 PM",
    status: "Late",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
  },
  {
    name: "Lina Armand",
    id: "EMP-0312",
    job: "Lab Analyst",
    dept: "R&D",
    date: "19 Jun 2035",
    in: "--",
    out: "--",
    status: "On Leave",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
  },
  {
    name: "Jacob Yuen",
    id: "EMP-0115",
    job: "Site Supervisor",
    dept: "Operations",
    date: "19 Jun 2035",
    in: "--",
    out: "--",
    status: "Absent",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
  },
  {
    name: "Mia Torres",
    id: "EMP-0289",
    job: "HR Officer",
    dept: "Human Resources",
    date: "19 Jun 2035",
    in: "08:59 AM",
    out: "05:10 PM",
    status: "On-Time",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
  },
];

const schedules = [
  {
    time: "09:00 AM",
    title: "Interview – Product Designer Candidate",
    category: "Talent Acquisition",
    location: "Meeting Room C",
    type: "interview",
    users: [
      "https://i.pravatar.cc/150?u=1",
      "https://i.pravatar.cc/150?u=2",
      "https://i.pravatar.cc/150?u=3",
    ],
    extra: "+3",
  },
  {
    time: "01:00 PM",
    title: "Mid-Year Performance Review – Design Dept",
    category: "Employee Development",
    location: "Notion Review Sheet",
    type: "review",
    users: [
      "https://i.pravatar.cc/150?u=4",
      "https://i.pravatar.cc/150?u=5",
      "https://i.pravatar.cc/150?u=6",
    ],
    extra: "+21",
  },
  {
    time: "03:00 PM",
    title: "Quarterly Policy Review Meeting",
    category: "Workplace Engagement",
    location: "Conference Room 1A",
    type: "meeting",
    users: [
      "https://i.pravatar.cc/150?u=7",
      "https://i.pravatar.cc/150?u=8",
      "https://i.pravatar.cc/150?u=9",
    ],
    extra: "+2",
  },
];

const taskList = [
  {
    title: "Complete pre-session survey for Leadership Track session",
    category: "Employee Development",
    date: "26 June 2035",
    completed: false,
  },
  {
    title: "Join Remote Work Compliance Briefing",
    category: "Workplace Engagement",
    date: "24 June 2035",
    completed: false,
  },
  {
    title: "Prepare Q3 recruitment planning materials",
    category: "Talent Acquisition",
    date: "23 June 2035",
    completed: true,
  },
];

const recentActivities = [
  {
    name: "Mia Torres",
    action: "approved 2 pending leave requests",
    time: "10:32 AM",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
  },
  {
    name: "Ethan Ray",
    action: "updated his emergency contact details",
    time: "09:45 AM",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
  },
  {
    name: "Jacob Yuen",
    action: "marked absent automatically due to no check-in",
    time: "09:15 AM",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
  },
];

const satisfactionSub = [
  { label: "Compensation & Benefits", score: "4.5/5", percentage: 78 },
  { label: "Work Culture", score: "4.3/5", percentage: 74 },
  { label: "Work-Life Balance", score: "4.1/5", percentage: 71 },
  { label: "Career Growth Opportunities", score: "3.9/5", percentage: 68 },
];

export default function DashboardPage() {
  const currency = useCurrency();
  const navigate = useNavigate();

  const [pendingPayrolls, setPendingPayrolls] = React.useState<any[]>([]);
  const [approvedCount, setApprovedCount] = React.useState(0);
  const [toastText, setToastText] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadDashboard = () => {
      getDashboardStatsApi()
        .then((stats) => {
          setEmployeesCount(stats.total_employees);
          setOverallAttendanceVal(stats.overall_attendance_pct);
          setLeaveRequestsCount(stats.pending_leaves_count);
          if (stats.total_applicants_count !== undefined) {
            setApplicantsCount(stats.total_applicants_count);
          }
        })
        .catch((err) => console.error("Error fetching live dashboard stats:", err));

      const emps = getCollection<any[]>("db_employees", []);
      const atts = getCollection<any[]>("db_attendance", []);
      const pay = getCollection<any[]>("db_payroll", []);
      const leaves = getCollection<any[]>("db_leaves", []);
      const schedulesFromDb = getCollection<any[]>("db_schedules", []);
      const tasksFromDb = getCollection<any[]>("db_tasks", []);
      const activitiesFromDb = getCollection<any[]>("db_activities", []);
      const satisfactionFromDb = getCollection<any[]>("db_satisfaction", []);
      const reviewsFromDb = getCollection<any[]>("db_pending_reviews", []);
      const approvedReviewsCount = Number(localStorage.getItem("db_approved_reviews_count") || "0");
      const applicantsFromDb = getCollection<any[]>("db_applicants", []);
      
      setAttendance(atts);
      setApplicantsCount(applicantsFromDb.length);
      
      const pendingPay = pay.filter(p => p.status === "Pending");
      setPendingPayrolls(pendingPay.map(p => ({
        id: p.id,
        name: p.name,
        role: p.role,
        dept: p.dept || p.subRole || "Operations",
        amount: p.salary,
        reason: `Basic Salary + ${p.allowance || "$150"} Allowance`,
        avatar: p.avatar
      })));

      const approvedPay = pay.filter(p => p.status === "Paid");
      setApprovedCount(approvedPay.length);
      
      setSchedulesList(schedulesFromDb);
      setTasks(tasksFromDb);
      setActivities(activitiesFromDb);
      
      if (satisfactionFromDb.length > 0) {
        setSatisfactionScore(4.2);
        setSatisfactionPercent(73);
        setSatisfactionList(satisfactionFromDb);
      } else {
        setSatisfactionScore(0);
        setSatisfactionPercent(0);
        setSatisfactionList([]);
      }

      setPendingReviews(reviewsFromDb);
      setReviewStats({
        assigned: reviewsFromDb.length + approvedReviewsCount,
        pending: reviewsFromDb.length,
        approved: approvedReviewsCount,
      });
    };

    loadDashboard();
    window.addEventListener("db_updated", loadDashboard);
    window.addEventListener("storage", loadDashboard);
    return () => {
      window.removeEventListener("db_updated", loadDashboard);
      window.removeEventListener("storage", loadDashboard);
    };
  }, []);

  // Popover menus state
  const [perfMenuOpen, setPerfMenuOpen] = React.useState(false);
  const [payrollMenuOpen, setPayrollMenuOpen] = React.useState(false);
  const [activeStatMenu, setActiveStatMenu] = React.useState<string | null>(
    null,
  );
  const [satisfactionMenuOpen, setSatisfactionMenuOpen] = React.useState(false);
  const [attendanceChartRange, setAttendanceChartRange] = React.useState<
    "This Month" | "Last Month" | "This Week"
  >("This Month");
  const [attendanceTableRange, setAttendanceTableRange] = React.useState<
    "This Month" | "Today" | "Yesterday"
  >("This Month");

  // Dynamic Dashboard States for Interactive Actions & Empty States
  const [selectedDay, setSelectedDay] = React.useState(21);
  const [schedulesList, setSchedulesList] = React.useState<any[]>([]);
  const [currentMonthIndex, setCurrentMonthIndex] = React.useState(1); // 1 = June 2035
  const months = ["May 2035", "June 2035", "July 2035"];
  const [showMonthDropdown, setShowMonthDropdown] = React.useState(false);

  // Dynamic top summary raw stats
  const [employeesCount, setEmployeesCount] = React.useState(0);
  const [overallAttendanceVal, setOverallAttendanceVal] = React.useState(0);
  const [leaveRequestsCount, setLeaveRequestsCount] = React.useState(0);
  const [applicantsCount, setApplicantsCount] = React.useState(0);

  // Custom new event form controls
  const [showAddEvent, setShowAddEvent] = React.useState(false);
  const [newEventTitle, setNewEventTitle] = React.useState("");
  const [newEventCategory, setNewEventCategory] = React.useState(
    "Employee Development",
  );
  const [newEventLocation, setNewEventLocation] =
    React.useState("Remote / Zoom");
  const [newEventTime, setNewEventTime] = React.useState("11:00 AM");

  const [tasks, setTasks] = React.useState<any[]>([]);
  const [showAddTask, setShowAddTask] = React.useState(false);
  const [newTaskTitle, setNewTaskTitle] = React.useState("");
  const [newTaskCategory, setNewTaskCategory] = React.useState(
    "Employee Development",
  );

  const [activities, setActivities] = React.useState<any[]>([]);
  const [attendance, setAttendance] = React.useState<any[]>([]);
  const [attendanceSearch, setAttendanceSearch] = React.useState("");
  const [attendanceStatusFilter, setAttendanceStatusFilter] =
    React.useState("All");

  // Satisfaction metrics
  const [satisfactionScore, setSatisfactionScore] = React.useState(0);
  const [satisfactionPercent, setSatisfactionPercent] = React.useState(0);
  const [satisfactionList, setSatisfactionList] = React.useState<any[]>([]);

  // Pending Performance Reviews List with Interactive Complete Status
  const [pendingReviews, setPendingReviews] = React.useState<any[]>([]);
  const [reviewStats, setReviewStats] = React.useState({
    assigned: 0,
    pending: 0,
    approved: 0,
  });

  const handleSeedAll = () => {
    setPendingPayrolls([
      {
        id: "PAY-104",
        name: "Lina Armand",
        role: "Lab Analyst",
        dept: "R&D",
        amount: "$3,450",
        reason: "Basic Salary + $250 Allowance",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      },
      {
        id: "PAY-105",
        name: "Ethan Ray",
        role: "UI Designer",
        dept: "Product Design",
        amount: "$4,120",
        reason: "Basic Salary + $180 Overtime",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      },
      {
        id: "PAY-106",
        name: "Jacob Yuen",
        role: "Site Supervisor",
        dept: "Operations",
        amount: "$3,890",
        reason: "Basic Salary",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      },
    ]);
    setApprovedCount(14);
    setSchedulesList(schedules);
    setEmployeesCount(128);
    setOverallAttendanceVal(92);
    setLeaveRequestsCount(1);
    setApplicantsCount(37);
    setTasks(taskList);
    setActivities(recentActivities);
    setAttendance(attendanceList);
    setSatisfactionScore(4.2);
    setSatisfactionPercent(73);
    setSatisfactionList(satisfactionSub);
    setPendingReviews([
      {
        id: "REV-101",
        name: "Olivia Mason",
        role: "Quarterly Audit",
        date: "Today",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      },
      {
        id: "REV-102",
        name: "Ethan Ray",
        role: "Monthly touchpoint",
        date: "2 days",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      },
    ]);
    setReviewStats({ assigned: 6, pending: 2, approved: 4 });
    setToastText("Successfully seeded all system dashboards!");
    setTimeout(() => setToastText(null), 3000);
  };

  const handleClearAll = () => {
    setPendingPayrolls([]);
    setApprovedCount(0);
    setSchedulesList([]);
    setEmployeesCount(0);
    setOverallAttendanceVal(0);
    setLeaveRequestsCount(0);
    setApplicantsCount(0);
    setTasks([]);
    setActivities([]);
    setAttendance([]);
    setSatisfactionScore(0);
    setSatisfactionPercent(0);
    setSatisfactionList([]);
    setPendingReviews([]);
    setReviewStats({ assigned: 0, pending: 0, approved: 0 });
    setToastText("Dashboard database cleared!");
    setTimeout(() => setToastText(null), 3000);
  };

  const handleApprovePayroll = (id: string, name: string) => {
    // Modify status in db_payroll
    const currentPayroll = getCollection<any[]>("db_payroll", []);
    const updated = currentPayroll.map(p => p.id === id ? { ...p, status: "Paid" } : p);
    saveCollection("db_payroll", updated);

    // Dispatch database update event immediately
    window.dispatchEvent(new Event("db_updated"));

    setPendingPayrolls((prev) => prev.filter((p) => p.id !== id));
    setApprovedCount((prev) => prev + 1);

    // Add real-time activity when a user takes action!
    const timeStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setActivities((prev) => [
      {
        name: "You (Davis)",
        action: `approved payroll case ${id} for ${name}`,
        time: timeStr,
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      },
      ...prev,
    ]);

    setToastText(`Successfully approved payroll case for ${name}!`);
    setTimeout(() => {
      setToastText(null);
    }, 3000);
  };

  const handleApproveFeedbackAction = (id: string, name: string) => {
    const currentReviews = getCollection<any[]>("db_pending_reviews", []);
    const updatedReviews = currentReviews.filter((r) => r.id !== id);
    saveCollection("db_pending_reviews", updatedReviews);

    const approvedReviewsCount = Number(localStorage.getItem("db_approved_reviews_count") || "0");
    localStorage.setItem("db_approved_reviews_count", String(approvedReviewsCount + 1));

    const timeStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    
    const logs = getCollection<any[]>("db_activities", []);
    const updatedLogs = [
      {
        name: "You (Davis)",
        action: `completed performance audit review for ${name}`,
        time: timeStr,
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      },
      ...logs,
    ];
    saveCollection("db_activities", updatedLogs);

    setToastText(`Approved and signed off performance audit for ${name}!`);
    setTimeout(() => {
      setToastText(null);
    }, 3000);
  };

  const handleToggleTask = (index: number) => {
    const list = getCollection<any[]>("db_tasks", []);
    const updated = list.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t));
    saveCollection("db_tasks", updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const list = getCollection<any[]>("db_tasks", []);
    const updated = [
      ...list,
      {
        title: newTaskTitle,
        category: newTaskCategory,
        date: "Today",
        completed: false,
      },
    ];
    saveCollection("db_tasks", updated);
    setNewTaskTitle("");
    setShowAddTask(false);
    setToastText("Successfully added task!");
    setTimeout(() => setToastText(null), 3000);
  };

  const handleAddScheduleEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const current = getCollection<any[]>("db_schedules", []);
    const updated = [
      ...current,
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
    saveCollection("db_schedules", updated);
    setNewEventTitle("");
    setShowAddEvent(false);
    setToastText("Successfully scheduled event!");
    setTimeout(() => setToastText(null), 3000);
  };

  const handleClearActivities = () => {
    saveCollection("db_activities", []);
    setToastText("Recent activities feed cleared.");
    setTimeout(() => setToastText(null), 3000);
  };

  const handleResetActivities = () => {
    saveCollection("db_activities", []); // Default stays empty!
    setToastText("Activities feed cleared (no dummy entries).");
    setTimeout(() => setToastText(null), 3000);
  };

  const handleResetPayroll = () => {
    setPendingPayrolls([
      {
        id: "PAY-104",
        name: "Lina Armand",
        role: "Lab Analyst",
        dept: "R&D",
        amount: "$3,450",
        reason: "Basic Salary + $250 Allowance",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      },
      {
        id: "PAY-105",
        name: "Ethan Ray",
        role: "UI Designer",
        dept: "Product Design",
        amount: "$4,120",
        reason: "Basic Salary + $180 Overtime",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      },
      {
        id: "PAY-106",
        name: "Jacob Yuen",
        role: "Site Supervisor",
        dept: "Operations",
        amount: "$3,890",
        reason: "Basic Salary",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      },
    ]);
    setToastText("Payroll approvals queue refilled!");
    setTimeout(() => setToastText(null), 3000);
  };

  return (
    <AppLayout title="Dashboard" breadcrumbs={[]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <p className="text-[14px] text-[#63716E]">Hello Davis!</p>
            <h1 className="text-[20px] font-semibold text-[#203430]">
              Good Morning
            </h1>
          </div>

        </div>

        {/* Top Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              id: "employees",
              label: "Total Employees",
              val: employeesCount.toString(),
              sub:
                employeesCount > 0
                  ? "Manage active employee roster and profiles."
                  : "No employees registered. Get started here.",
              subColor: "text-[#0E4D41]",
              bgColor: "bg-white",
              actions: [
                {
                  label: "Register New Hire",
                  act: () => {
                    navigate("/employees/new");
                  },
                },
                {
                  label: "View Personnel Directory",
                  act: () => {
                    navigate("/employees");
                  },
                },
                {
                  label: "Manage Staff Documents",
                  act: () => {
                    navigate("/settings/personal-documents");
                  },
                },
                {
                  label: "Configure Roles & Permissions",
                  act: () => {
                    navigate("/settings/roles");
                  },
                },
              ],
            },
            {
              id: "attendance",
              label: "Attendance",
              val: `${overallAttendanceVal}%`,
              trend: "+1.54%",
              items:
                overallAttendanceVal > 0
                  ? "3 Days Off, 1 Late Arrival"
                  : "No attendance logs",
              sub:
                overallAttendanceVal > 0
                  ? "Reconciled timesheets and shift roster logs."
                  : "Attendance logged is 0%. Inspect details.",
              subColor: "text-[#0E4D41]",
              bgColor: "bg-white",
              actions: [
                {
                  label: "Launch Attendance Workspace",
                  act: () => {
                    navigate("/attendance");
                  },
                },
                {
                  label: "Reconcile Active Shift Calendar",
                  act: () => {
                    navigate("/calendar");
                  },
                },
              ],
            },
            {
              id: "leaves",
              label: "Leave Requests",
              val: leaveRequestsCount.toString(),
              items:
                leaveRequestsCount > 0
                  ? `${leaveRequestsCount} Pending Review`
                  : "No pending requests",
              sub:
                leaveRequestsCount > 0
                  ? "Pending HR authorization required."
                  : "All leave requests settled!",
              subColor: "text-[#0E4D41]",
              bgColor: "bg-white",
              actions: [
                {
                  label: "Manage Leave Approvals",
                  act: () => {
                    navigate("/leave");
                  },
                },
                {
                  label: "Synchronize Leave Calendar",
                  act: () => {
                    navigate("/calendar");
                  },
                },
              ],
            },
            {
              id: "applicants",
              label: "Job Applicants",
              val: applicantsCount > 0 ? `+${applicantsCount}` : "0",
              sub:
                applicantsCount > 0
                  ? `Your team has ${applicantsCount} active applicants`
                  : "No current applicants listed.",
              subColor: "text-[#0E4D41]",
              bgColor: "bg-white",
              actions: [
                {
                  label: "Launch Recruiting Pipeline",
                  act: () => {
                    navigate("/recruitment");
                  },
                },
                {
                  label: "Audit Sourced Applications",
                  act: () => {
                    navigate("/recruitment");
                  },
                },
              ],
            },
          ].map((stat) => (
            <Card
              key={stat.label}
              className={cn(
                "p-4 border-none rounded-[16px] shadow-sm flex flex-col justify-between",
                stat.bgColor,
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#63716E]">
                    {stat.label}
                  </span>
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveStatMenu(activeStatMenu === stat.id ? null : stat.id)
                      }
                      className="p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
                    >
                      <MoreHorizontal className="h-4 w-4 text-[#A4ACAB]" />
                    </button>
                    {activeStatMenu === stat.id && (
                      <>
                        <div
                          className="fixed inset-0 z-[199]"
                          onClick={() => setActiveStatMenu(null)}
                        />
                        <div className="absolute right-0 top-7 z-[200] w-52 bg-white rounded-xl shadow-lg border border-[#E5E6E6] py-1.5 text-left animate-in fade-in duration-100">
                          {stat.actions.map((act, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                act.act();
                                setActiveStatMenu(null);
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
                  {stat.trend && (
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-bold text-[#35BFA3]">
                        {stat.trend}
                      </span>
                    </div>
                  )}
                  {stat.label === "Attendance" && (
                    <span className="text-[10px] text-[#63716E]">Present</span>
                  )}
                  {stat.items && (
                    <span className="text-[10px] text-[#63716E]">
                      {" "}
                      – {stat.items}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 bg-[#E4F2D3]/30 p-2 rounded-[8px]">
                <p className="text-[11px] font-medium text-[#63716E] leading-tight">
                  {stat.sub}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Triple Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Column 1: Calendar & Schedules (3/12) */}
          <div className="lg:col-span-3 space-y-5">
            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm hover:border-slate-200 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div 
                  onClick={() => navigate("/calendar")} 
                  className="flex items-center gap-1 group cursor-pointer hover:text-[#006b5f]"
                >
                  <span className="text-[18px] font-bold text-[#203430] group-hover:text-[#006b5f] transition-colors">
                    June 2035
                  </span>
                  <ChevronDown className="h-4 w-4 text-[#63716E] group-hover:text-[#006b5f] transition-colors" />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate("/calendar")} 
                    className="text-[11px] font-bold text-[#006b5f] bg-[#E4F2D3]/40 px-2 py-1 rounded-lg hover:bg-[#006b5f] hover:text-white transition-all h-8 flex items-center justify-center border-none cursor-pointer"
                  >
                    View Calendar
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-y-2 text-center">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <span
                    key={`${d}-${i}`}
                    className="text-[12px] font-bold text-[#63716E] mb-2"
                  >
                    {d}
                  </span>
                ))}
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  const isSelected = day === selectedDay;
                  const isPublic = [1, 4, 14, 25, 29].includes(day);
                  const isToday = day === 20; // current day match
                  return (
                    <div
                      key={day}
                      onClick={() => navigate("/calendar")}
                      className="h-8 w-8 mx-auto flex items-center justify-center relative hover:scale-105 transition-transform"
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-medium transition-all group cursor-pointer",
                          isSelected
                            ? "bg-[#203430] text-white shadow-lg"
                            : isToday
                              ? "bg-brand text-white"
                              : isPublic
                                ? "bg-[#E4F2D3] text-[#0E4D41]"
                                : "text-[#203430] hover:bg-[#F7F7F7]",
                        )}
                      >
                        {day}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-bold text-[#203430]">
                  Schedules
                </h3>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowAddEvent(!showAddEvent)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 font-bold px-2 py-1 rounded-[6px] text-[#203430] cursor-pointer transition-colors"
                  >
                    + Add Event
                  </button>
                  <span className="flex items-center gap-1 bg-[#E4F2D3] px-2.5 py-1 rounded-[6px] text-[11px] font-bold text-[#0E4D41]">
                    <CalendarIcon className="h-3 w-3 text-[#35BFA3]" />{" "}
                    {selectedDay} Jun
                  </span>
                </div>
              </div>

              {showAddEvent && (
                <form
                  onSubmit={handleAddScheduleEvent}
                  className="bg-[#F7F7F7] p-3 rounded-xl mb-4 border border-[#E5E6E6] space-y-2.5 text-left animate-in slide-in-from-top-2 duration-150"
                >
                  <p className="text-[9px] font-black uppercase text-[#63716E]">
                    Schedule New Event
                  </p>
                  <input
                    type="text"
                    placeholder="Event/Interview Title"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="w-full text-xs font-semibold p-2 bg-white rounded-lg border border-[#E5E6E6] outline-none focus:border-brand"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Time (e.g. 11:00 AM)"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      className="w-1/2 text-xs font-semibold p-2 bg-white rounded-lg border border-[#E5E6E6] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={newEventLocation}
                      onChange={(e) => setNewEventLocation(e.target.value)}
                      className="w-1/2 text-xs font-semibold p-2 bg-white rounded-lg border border-[#E5E6E6] outline-none"
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
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowAddEvent(false)}
                        className="text-[10px] font-bold px-2 py-1 hover:bg-slate-200 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="text-[10px] font-bold bg-[#006b5f] text-white px-2.5 py-1 rounded hover:bg-[#005047] cursor-pointer"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {(() => {
                  const daySchedules = schedulesList.filter((s) => {
                    const sDay =
                      (s as any).day !== undefined ? (s as any).day : 21;
                    return sDay === selectedDay;
                  });

                  if (daySchedules.length === 0) {
                    return (
                      <div className="py-6 px-4 text-center border border-dashed border-[#E5E6E6] rounded-xl flex flex-col items-center justify-center space-y-2 bg-[#F7F7F7]/10">
                        <CalendarIcon className="h-6 w-6 text-[#A4ACAB]" />
                        <p className="text-[12px] font-bold text-[#63716E]">
                          Empty Schedule Slot
                        </p>
                        <p className="text-[10px] text-[#A4ACAB] max-w-xs leading-normal">
                          No operations scheduled for June {selectedDay}.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowAddEvent(true)}
                          className="text-[10px] bg-[#006b5f] text-white font-black px-2.5 py-1.5 mt-1 rounded-[6px] hover:bg-[#005047] cursor-pointer"
                          authorize-button="true"
                        >
                          Create Event
                        </button>
                      </div>
                    );
                  }

                  return daySchedules.map((s, idx) => (
                    <div key={idx} className="space-y-2 group">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-[#35BFA3] uppercase tracking-wider">
                          {s.category}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const current = getCollection<any[]>("db_schedules", []);
                            const updated = current.filter((item) => item.title !== s.title);
                            saveCollection("db_schedules", updated);
                            setToastText(`Cancelled event: ${s.title}`);
                            setTimeout(() => setToastText(null), 3000);
                          }}
                          className="hidden group-hover:block text-[10px] text-red-500 hover:underline transition-all cursor-pointer font-bold"
                          title="Cancel event"
                        >
                          Remove
                        </button>
                      </div>
                      <h4 className="text-[13px] font-bold text-[#203430] leading-tight">
                        {s.title}
                      </h4>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <div className="bg-[#E4F2D3] px-2 py-1 rounded-[6px]">
                            <span className="text-[10px] font-bold text-[#0E4D41]">
                              {s.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-[#63716E]">
                            <Clock className="h-3 w-3" /> {s.time}
                          </div>
                        </div>
                        <div className="flex -space-x-1.5">
                          {s.users.map((u, i) => (
                            <img
                              key={i}
                              src={u}
                              className="h-5 w-5 rounded-full border border-white shrink-0 object-cover"
                            />
                          ))}
                          {s.extra && (
                            <div className="h-5 w-5 rounded-full bg-[#0E4D41] border border-white flex items-center justify-center shrink-0">
                              <span className="text-[8px] text-white font-bold">
                                {s.extra}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {idx !== daySchedules.length - 1 && (
                        <div className="h-px bg-[#E5E6E6] mt-4" />
                      )}
                    </div>
                  ));
                })()}
              </div>
            </Card>

            {/* Performance Reviews Pending & Approved Tracker */}
            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4 relative">
                <div>
                  <h3 className="text-[16px] font-bold text-[#203430]">
                    Performance Reviews
                  </h3>
                  <span className="text-[10px] uppercase font-black tracking-wider text-brand">
                    Assigned to Me
                  </span>
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
                      <div
                        className="fixed inset-0 z-[199]"
                        onClick={() => setPerfMenuOpen(false)}
                      />
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
                            setToastText(
                              "Initiated performance audit CSV export!",
                            );
                            setTimeout(() => setToastText(null), 3000);
                          }}
                          className="w-full text-left px-4 py-2 text-[12px] text-[#203430] hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                        >
                          Export Records
                        </button>
                        <button
                          onClick={() => {
                            setPerfMenuOpen(false);
                            setToastText(
                              "Metrics successfully synced with HR engine.",
                            );
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
                  <p className="text-[10px] text-[#63716E] font-medium leading-none">
                    Assigned
                  </p>
                  <p className="text-[16px] font-bold text-[#203430] mt-1.5">
                    {reviewStats.assigned}
                  </p>
                </div>
                <div className="text-center border-x border-[#E5E6E6]">
                  <p className="text-[10px] text-amber-600 font-medium leading-none">
                    Pending
                  </p>
                  <p className="text-[16px] font-bold text-amber-600 mt-1.5">
                    {reviewStats.pending}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#35BFA3] font-medium leading-none">
                    Approved
                  </p>
                  <p className="text-[16px] font-bold text-[#35BFA3] mt-1.5">
                    {reviewStats.approved}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] font-black uppercase text-[#63716E] tracking-wider mb-1">
                  Pending Feedback Action
                </p>

                {pendingReviews.length === 0 ? (
                  <div className="py-6 text-center border border-dashed border-[#E5E6E6] rounded-xl flex flex-col items-center justify-center space-y-1 bg-[#F7F7F7]/25">
                    <CheckCircle2 className="h-6 w-6 text-[#35BFA3]" />
                    <p className="text-xs font-bold text-[#63716E]">
                      All caught up!
                    </p>
                    <p className="text-[9px] text-[#A4ACAB]">
                      No pending performance reviews to sign off.
                    </p>
                  </div>
                ) : (
                  pendingReviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex items-center justify-between p-2 rounded-[8px] bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-all duration-150"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={review.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"}
                          className="h-[28px] w-[28px] rounded-full object-cover shrink-0"
                          alt={review.name}
                        />
                        <div>
                          <p className="text-[12px] font-bold text-[#203430] leading-none text-left">
                            {review.name}
                          </p>
                          <p className="text-[10px] text-[#63716E] mt-0.5 font-medium leading-none text-left">
                            {review.role || "Quarterly Audit"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] bg-slate-100 font-bold px-1.5 py-0.5 rounded text-[#203430]">
                          {review.date || "Today"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleApproveFeedbackAction(review.id, review.name)}
                          className="text-[9px] bg-[#35BFA3] hover:bg-[#2da990] text-white font-black px-2 py-1 rounded-[6px] transition-all cursor-pointer h-7 flex items-center justify-center"
                        >
                          Sign-off
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Column 2: Charts & Large Stats & List (6/12) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm overflow-visible hover:border-slate-200 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 
                    onClick={() => navigate("/attendance")}
                    className="text-[14px] font-bold text-[#203430] hover:text-[#006b5f] transition-colors cursor-pointer"
                  >
                    Attendance Report
                  </h3>
                  <button 
                    onClick={() => navigate("/attendance")}
                    className="flex items-center gap-1.5 bg-[#F7F7F7] hover:bg-slate-100 px-2.5 py-1.5 rounded-[10px] text-[11px] font-medium text-[#006b5f] transition-all border-none cursor-pointer"
                  >
                    Timesheets →
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[24px] font-bold text-[#203430]">
                    {overallAttendanceVal}%
                  </span>
                  {overallAttendanceVal > 0 && (
                    <div className="flex items-center gap-1 bg-[#E4F2D3] px-1.5 py-0.5 rounded-[4px]">
                      <TrendingUp className="h-3 w-3 text-[#35BFA3]" />
                      <span className="text-[10px] font-bold text-[#0E4D41]">
                        +1.54%
                      </span>
                    </div>
                  )}
                </div>
                {attendance.length === 0 ? (
                  <div className="h-[140px] w-full mt-2 flex flex-col items-center justify-center text-center space-y-2 bg-[#F7F7F7]/25 border border-dashed border-[#E5E6E6] rounded-[12px] p-3">
                    <AlertCircle className="h-6 w-6 text-[#A4ACAB]" />
                    <p className="text-[11px] font-bold text-[#63716E]">
                      No active logs recorded
                    </p>
                    <p className="text-[9px] text-[#A4ACAB]">
                      Biometric check-ins generate weekly statistics.
                    </p>
                  </div>
                ) : (
                  <div className="h-[140px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceData} barGap={4}>
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: "#63716E" }}
                          dy={10}
                        />
                        <Bar
                          dataKey="onTime"
                          fill="#0E4D41"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="late"
                          fill="#35BFA3"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="leave"
                          fill="#E4F2D3"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="absent"
                          fill="#E5E6E6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>

              <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col hover:border-slate-200 transition-all">
                <div className="flex justify-between items-center mb-2">
                  <h3 
                    onClick={() => navigate("/performance")}
                    className="text-[14px] font-bold text-[#203430] hover:text-[#006b5f] cursor-pointer transition-colors"
                  >
                    Employee Satisfaction
                  </h3>
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      onClick={() =>
                        setSatisfactionMenuOpen(!satisfactionMenuOpen)
                      }
                      className="p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
                    >
                      <MoreHorizontal className="h-4 w-4 text-[#A4ACAB]" />
                    </button>
                    {satisfactionMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-[199]"
                          onClick={() => setSatisfactionMenuOpen(false)}
                        />
                        <div className="absolute right-0 top-7 z-[200] w-56 bg-white rounded-xl shadow-lg border border-[#E5E6E6] py-1.5 text-left animate-in fade-in duration-100">
                          {[
                            {
                              label: "Open Performance Directory",
                              act: () => {
                                navigate("/performance");
                              },
                            },
                            {
                              label: "Analyze Sentiment Reviews",
                              act: () => {
                                navigate("/performance");
                              },
                            },
                          ].map((element, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                element.act();
                                setSatisfactionMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 text-[11px] text-[#203430] hover:bg-[#F7F7F7] font-semibold transition-colors cursor-pointer border-none bg-transparent"
                            >
                              {element.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {satisfactionPercent === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2 bg-[#F7F7F7]/25 border border-dashed border-[#E5E6E6] rounded-[12px] my-3">
                    <Star className="h-6 w-6 text-[#A4ACAB]" />
                    <p className="text-[11px] font-bold text-[#63716E]">
                      No survey responses
                    </p>
                    <p className="text-[9px] text-[#A4ACAB]">
                      Running the quarterly feedback loop will show reviews and statistics here.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 flex flex-col items-center justify-center relative">
                      <div className="relative h-[120px] w-full flex items-center justify-center">
                        <PieChart width={200} height={120}>
                          <Pie
                            data={[
                              { value: satisfactionPercent },
                              { value: Math.max(0, 100 - satisfactionPercent) },
                            ]}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={0}
                            // code support
                            dataKey="value"
                          >
                            <Cell
                              fill={satisfactionPercent > 0 ? "#35BFA3" : "#E5E6E6"}
                            />
                            <Cell fill="#E4F2D3" />
                          </Pie>
                        </PieChart>
                        <div className="absolute bottom-0 flex flex-col items-center">
                          <span className="text-[24px] font-bold text-[#203430]">
                            {satisfactionPercent}%
                          </span>
                          <span className="text-[10px] text-[#63716E]">
                            Employee Satisfied
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3.5 w-3.5",
                              i < Math.round(satisfactionScore)
                                ? "fill-[#F8C947] text-[#F8C947]"
                                : "text-[#E5E6E6] fill-[#E5E6E6]",
                            )}
                          />
                        ))}
                        <span className="text-[11px] font-bold text-[#203430] ml-1">
                          {satisfactionScore.toFixed(1)}/5
                        </span>
                      </div>
                      <div className="mt-4 w-full bg-[#E4F2D3] p-1.5 rounded-[8px] text-center">
                        <p className="text-[10px] text-[#63716E]">
                          That's an{" "}
                          <span className="font-bold text-[#0E4D41]">
                            increase of 6%
                          </span>{" "}
                          from last month
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {satisfactionList.map((s) => (
                        <div
                          key={s.label}
                          className="flex items-center justify-between"
                        >
                          <span className="text-[10px] text-[#63716E]">
                            {s.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, ratingIdx) => (
                                <Star
                                  key={ratingIdx}
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    ratingIdx < Math.round(s.score)
                                      ? "fill-[#F8C947] text-[#F8C947]"
                                      : "text-[#E5E6E6] fill-[#E5E6E6]"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-[#203430]">
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

            <Card className="p-0 border-none rounded-[16px] bg-white shadow-sm overflow-hidden flex flex-col hover:border-slate-200 transition-all">
              <div 
                onClick={() => navigate("/attendance")}
                className="p-4 flex items-center justify-between border-b border-[#E5E6E6] cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-[16px] font-bold text-[#203430] hover:text-[#006b5f]">
                  Employee Attendance
                </h3>
                <span className="text-[11px] font-bold text-[#006b5f] flex items-center gap-1">
                  View Roster Logs →
                </span>
              </div>
              <div className="flex p-4 gap-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] font-bold text-[#203430]">
                    {attendance.filter(a => a.status === "On-Time").length}
                  </span>
                  <span className="text-[11px] text-[#63716E]">On-Time</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] font-bold text-[#203430]">
                    {attendance.filter(a => a.status === "Late").length}
                  </span>
                  <span className="text-[11px] text-[#63716E]">Late</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] font-bold text-[#203430]">
                    {attendance.filter(a => a.status === "On Leave" || a.status === "Leave").length}
                  </span>
                  <span className="text-[11px] text-[#63716E]">On Leave</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] font-bold text-[#203430]">
                    {attendance.filter(a => a.status === "Absent").length}
                  </span>
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
                      <th className="px-4 py-2 text-center whitespace-nowrap">
                        Check In
                      </th>
                      <th className="px-4 py-2 text-center whitespace-nowrap">
                        Check Out
                      </th>
                      <th className="px-4 py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E6E6]">
                    {attendance.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-16 text-center text-[11px] font-bold text-slate-400"
                        >
                          No check-in or attendance records found for this period.
                        </td>
                      </tr>
                    ) : (
                      attendance.map((a, i) => (
                        <tr
                          key={i}
                          className="hover:bg-[#F7F7F7]/50 transition-colors h-[54px]"
                        >
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={a.avatar}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                              <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-[#203430] leading-none">
                                  {a.name}
                                </span>
                                <span className="text-[10px] text-[#63716E] mt-1">
                                  {a.id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-[#203430] leading-none">
                                {a.job}
                              </span>
                              <span className="text-[10px] text-[#63716E] mt-1">
                                {a.dept}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-[11px] font-bold text-[#203430]">
                            {a.date}
                          </td>
                          <td className="px-4 py-2 text-[11px] font-bold text-[#203430] text-center">
                            {a.in}
                          </td>
                          <td className="px-4 py-2 text-[11px] font-bold text-[#203430] text-center">
                            {a.out}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <div
                              className={cn(
                                "inline-flex items-center px-2 py-1 rounded-[12px] text-[10px] font-bold",
                                a.status === "On-Time"
                                  ? "bg-[#E4F2D3] text-[#35BFA3]"
                                  : a.status === "Late"
                                    ? "bg-[#FFEFEF] text-[#E63D4B]"
                                    : a.status === "On Leave"
                                      ? "bg-[#F7F7F7] text-[#63716E]"
                                      : "bg-[#203430] text-white",
                              )}
                            >
                              {a.status}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Employee Payroll Approvals Pending Cases */}
            <Card className="p-0 border-none rounded-[16px] bg-white shadow-sm overflow-hidden flex flex-col mb-5">
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E6E6]">
                <div>
                  <h3 className="text-[16px] font-bold text-[#203430]">
                    Payroll Approvals Queue
                  </h3>
                  <p className="text-[11px] text-[#63716E] mt-0.5 font-medium">
                    Authorizations assigned to you for monthly payroll release
                  </p>
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
                        <div
                          className="fixed inset-0 z-[199]"
                          onClick={() => setPayrollMenuOpen(false)}
                        />
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
                              setToastText(
                                "Initiated export of payroll register CSV!",
                              );
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
                              setToastText(
                                "Payroll authorization queue reloaded.",
                              );
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
                    <span className="text-[20px] font-bold text-[#203430]">
                      {pendingPayrolls.length}
                    </span>
                    <span className="text-[10px] text-[#63716E] font-semibold">
                      Cases Required
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 border-l border-[#E5E6E6] pl-6">
                    <span className="text-[20px] font-bold text-[#35BFA3]">
                      {approvedCount}
                    </span>
                    <span className="text-[10px] text-[#63716E] font-semibold">
                      Approved (Month)
                    </span>
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
                    <h4 className="font-bold text-[14px] text-[#203430]">
                      All Payroll Instances Signed Off
                    </h4>
                    <p className="text-[11px] max-w-sm mx-auto font-medium">
                      You have completed all pending payroll approvals for this
                      development cycle.
                    </p>
                  </div>
                )}
                {pendingPayrolls.length > 0 &&
                  pendingPayrolls.map((payroll) => (
                    <div
                      key={payroll.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F7F7F7]/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={payroll.avatar}
                          className="h-10 w-10 rounded-full object-cover shrink-0"
                          alt={payroll.name}
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[12px] font-bold text-[#203430]">
                              {payroll.name}
                            </span>
                            <span className="text-[10px] bg-slate-150 text-slate-600 px-1.5 py-0.5 rounded font-black tracking-wider uppercase text-[8px]">
                              {payroll.id}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#63716E] mt-0.5 font-semibold">
                            {payroll.role} • {payroll.dept}
                          </p>
                          <p className="text-[10px] text-[#A4ACAB] mt-1 font-medium">
                            {payroll.reason.includes("$250")
                              ? `Basic Salary + ${currency.format(250)} Allowance`
                              : payroll.reason.includes("$180")
                                ? `Basic Salary + ${currency.format(180)} Overtime`
                                : payroll.reason}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 justify-between sm:justify-start">
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] text-[#63716E] font-medium leading-none">
                            Net Amount
                          </p>
                          <p className="text-[14px] font-black text-[#203430] mt-1">
                            {currency.format(payroll.amount)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleApprovePayroll(payroll.id, payroll.name)
                          }
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
            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col hover:border-slate-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 
                  onClick={() => navigate("/performance")}
                  className="text-[14px] font-bold text-[#203430] hover:text-[#006b5f] cursor-pointer transition-colors"
                >
                  Team Performance
                </h3>
                <button 
                  onClick={() => navigate("/performance")}
                  className="flex items-center gap-1 bg-[#F7F7F7] hover:bg-slate-100 px-2.5 py-1.5 rounded-[8px] text-[11px] font-bold text-[#006b5f] transition-all border-none cursor-pointer"
                >
                  Details →
                </button>
              </div>
              {employeesCount === 0 ? (
                <div className="h-[180px] w-full flex flex-col items-center justify-center text-center space-y-2 bg-[#F7F7F7]/25 border border-dashed border-[#E5E6E6] rounded-[12px] p-3">
                  <TrendingUp className="h-6 w-6 text-[#A4ACAB]" />
                  <p className="text-[11px] font-bold text-[#63716E]">
                    No tracking data
                  </p>
                  <p className="text-[9px] text-[#A4ACAB]">
                    Add employees to begin tracking team performance metrics and audits.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <span className="text-[24px] font-bold text-[#203430]">
                      89.52%
                    </span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-[#35BFA3]" />
                      <span className="text-[11px] font-bold text-[#35BFA3]">
                        +3.84%
                      </span>
                      <span className="text-[10px] text-[#63716E]">
                        increased vs last week
                      </span>
                    </div>
                  </div>
                  <div className="h-[120px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={teamPerfData}>
                        <defs>
                          <linearGradient
                            id="colorPerf"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#35BFA3"
                              stopOpacity={0.1}
                            />
                            <stop
                              offset="95%"
                              stopColor="#35BFA3"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#35BFA3"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorPerf)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    {/* Tooltip Overlay */}
                    <div className="absolute right-4 top-2 bg-white px-2 py-1 rounded-[6px] shadow-lg border border-[#E5E6E6] flex flex-col items-center">
                      <span className="text-[8px] text-[#63716E]">May 2035</span>
                      <span className="text-[11px] font-bold text-[#203430]">
                        95.2%
                      </span>
                      <div className="absolute bottom-[-10px] w-1 h-12 bg-[#D1D5DB]/30 -z-10" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    {["0%", "25%", "50%", "75%", "100%"].map((v) => (
                      <span key={v} className="text-[9px] text-[#63716E]">
                        {v}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </Card>

            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm hover:border-slate-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 
                  onClick={() => navigate("/employees")}
                  className="text-[14px] font-bold text-[#203430] hover:text-[#006b5f] cursor-pointer transition-colors"
                >
                  Employment Status
                </h3>
                <button 
                  onClick={() => navigate("/employees")}
                  className="text-[11px] font-bold text-[#006b5f] hover:underline border-none bg-transparent cursor-pointer"
                >
                  Directory →
                </button>
              </div>
              {(() => {
                const emps = getCollection<any[]>("db_employees", []);
                const totalEmps = emps.length;
                if (totalEmps === 0) {
                  return (
                    <div className="py-8 text-center border border-dashed border-[#E5E6E6] rounded-xl flex flex-col items-center justify-center space-y-1.5">
                      <Users className="h-6 w-6 text-brand" />
                      <span className="text-xs font-bold text-[#63716E]">Empty employee roster</span>
                      <span className="text-[9px] text-[#A4ACAB]">Add new hires to categorize contract models.</span>
                    </div>
                  );
                }

                const ftCount = emps.filter(e => e.type === "Full-Time" || !e.type).length;
                const ptCount = emps.filter(e => e.type === "Part-Time").length;
                const flCount = emps.filter(e => e.type === "Freelance" || e.type === "Contractor").length;
                const inCount = emps.filter(e => e.type === "Intern" || e.type === "Internship").length;

                const ftPct = totalEmps ? Math.round((ftCount / totalEmps) * 100) : 0;
                const ptPct = totalEmps ? Math.round((ptCount / totalEmps) * 100) : 0;
                const flPct = totalEmps ? Math.round((flCount / totalEmps) * 100) : 0;
                const inPct = totalEmps ? Math.max(0, 100 - (ftPct + ptPct + flPct)) : 0;

                return (
                  <div 
                    onClick={() => navigate("/employees")}
                    className="space-y-4 cursor-pointer hover:bg-slate-50/40 rounded-xl p-1 transition-colors"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-[24px] font-bold text-[#203430]">
                        {totalEmps}
                      </span>
                      <span className="text-[11px] text-[#63716E]">Employees</span>
                    </div>
                    <div className="h-2.5 w-full flex bg-[#F7F7F7] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0E4D41]"
                        style={{ width: `${ftPct}%` }}
                      />
                      <div
                        className="h-full bg-[#35BFA3]"
                        style={{ width: `${ptPct}%` }}
                      />
                      <div
                        className="h-full bg-[#E4F2D3]"
                        style={{ width: `${flPct}%` }}
                      />
                      <div
                        className="h-full bg-[#E5E6E6]"
                        style={{ width: `${inPct}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          label: "Full-Time",
                          val: `${ftPct}%`,
                          emp: `${ftCount} ${ftCount === 1 ? 'Employee' : 'Employees'}`,
                          color: "bg-[#0E4D41]",
                        },
                        {
                          label: "Part-Time",
                          val: `${ptPct}%`,
                          emp: `${ptCount} ${ptCount === 1 ? 'Employee' : 'Employees'}`,
                          color: "bg-[#35BFA3]",
                        },
                        {
                          label: "Freelance",
                          val: `${flPct}%`,
                          emp: `${flCount} ${flCount === 1 ? 'Employee' : 'Employees'}`,
                          color: "bg-[#E4F2D3]",
                        },
                        {
                          label: "Internship",
                          val: `${inPct}%`,
                          emp: `${inCount} ${inCount === 1 ? 'Employee' : 'Employees'}`,
                          color: "bg-[#E5E6E6]",
                        },
                      ].map((item) => (
                        <div key={item.label} className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <div
                              className={cn("h-2 w-2 rounded-full", item.color)}
                            />
                            <span className="text-[11px] font-bold text-[#203430]">
                              {item.label}
                            </span>
                          </div>
                          <p className="text-[9px] text-[#63716E]">
                            <span className="font-bold">{item.val}</span> –{" "}
                            {item.emp}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </Card>

            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-[#203430]">Tasks</h3>
                <div className="flex items-center gap-1.5 animate-in fade-in">
                  <button
                    type="button"
                    onClick={() => setShowAddTask(!showAddTask)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 font-bold px-2 py-1 rounded cursor-pointer text-[#203430]"
                  >
                    + Add Task
                  </button>
                  <button
                    onClick={() => {
                      saveCollection("db_tasks", []);
                      setToastText("All tasks cleared!");
                      setTimeout(() => setToastText(null), 3000);
                    }}
                    className="text-[10px] text-red-500 hover:underline font-bold cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {showAddTask && (
                <form
                  onSubmit={handleAddTask}
                  className="bg-[#F7F7F7] p-2.5 rounded-xl mb-4 border border-[#E5E6E6] space-y-2 text-left animate-in slide-in-from-top-2 duration-150"
                >
                  <input
                    type="text"
                    placeholder="Task Description..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full text-xs font-semibold p-2 bg-white rounded-lg border border-[#E5E6E6] outline-none"
                    required
                  />
                  <div className="flex items-center justify-between">
                    <select
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                      className="text-[9px] bg-white border border-[#E5E6E6] p-1 rounded font-bold outline-none"
                    >
                      <option value="Employee Development">Development</option>
                      <option value="Talent Acquisition">Recruiting</option>
                      <option value="Workplace Engagement">Engagement</option>
                    </select>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setShowAddTask(false)}
                        className="text-[9px] font-bold px-2 py-1 rounded hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="text-[9px] font-bold bg-[#006b5f] text-white px-2 py-1 rounded hover:bg-[#005047] cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="py-6 text-center border border-dashed border-[#E5E6E6] rounded-xl flex flex-col items-center justify-center space-y-1 bg-[#F7F7F7]/25">
                    <CheckSquare className="h-6 w-6 text-brand" />
                    <p className="text-xs font-bold text-[#63716E]">
                      All caught up!
                    </p>
                    <p className="text-[10px] text-[#A4ACAB]">
                      You have no pending HR tasks.
                    </p>
                  </div>
                ) : (
                  tasks.map((task, i) => (
                    <div
                      key={i}
                      className="flex gap-3 items-start group animate-in fade-in duration-100"
                    >
                      <button
                        onClick={() => handleToggleTask(i)}
                        className={cn(
                          "mt-1 flex-shrink-0 transition-colors cursor-pointer",
                          task.completed
                            ? "text-brand"
                            : "text-[#E5E6E6] hover:text-brand",
                        )}
                      >
                        {task.completed ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                      <div className="space-y-2 flex-grow">
                        <p
                          className={cn(
                            "text-[12px] leading-tight",
                            task.completed
                              ? "text-[#A4ACAB] line-through font-medium"
                              : "text-[#203430] font-medium",
                          )}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[9px] font-bold",
                                task.category === "Employee Development"
                                  ? "bg-[#FFEFEF] text-[#E63D4B]"
                                  : task.category === "Workplace Engagement"
                                    ? "bg-[#F7F7F7] text-[#63716E]"
                                    : "bg-[#E4F2D3] text-[#0E4D41]",
                              )}
                            >
                              {task.category}
                            </span>
                            <span className="text-[9px] text-[#63716E] font-medium">
                              {task.date}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const current = getCollection<any[]>("db_tasks", []);
                              const updated = current.filter((_, idx) => idx !== i);
                              saveCollection("db_tasks", updated);
                              setToastText("Task removed!");
                              setTimeout(() => setToastText(null), 3000);
                            }}
                            className="hidden group-hover:block text-[10px] text-red-500 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-[#203430]">
                  Recent Activities
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearActivities}
                    className="text-[10px] text-[#63716E] hover:text-red-500 font-bold transition-colors cursor-pointer border-none bg-transparent"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleResetActivities}
                    className="text-[10px] text-brand hover:underline font-bold transition-colors cursor-pointer border-none bg-transparent"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                {activities.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-[#E5E6E6] rounded-xl flex flex-col items-center justify-center space-y-1">
                    <p className="text-xs font-bold text-[#63716E]">
                      No recent activity
                    </p>
                    <p className="text-[10px] text-[#A4ACAB]">
                      Actions taken on this page will append logs here
                      dynamically!
                    </p>
                  </div>
                ) : (
                  activities.map((activity, i) => (
                    <div
                      key={i}
                      className="flex gap-3 animate-in fade-in duration-300"
                    >
                      <img
                        src={activity.avatar}
                        className="h-8 w-8 rounded-full shrink-0 object-cover"
                      />
                      <div className="space-y-1 flex-grow">
                        <p className="text-[11px] leading-snug">
                          <span className="font-bold text-[#203430]">
                            {activity.name}
                          </span>{" "}
                          <span className="text-[#63716E]">
                            {activity.action}
                          </span>
                        </p>
                        <p className="text-[9px] text-[#A4ACAB] font-bold">
                          19 June 2035 – {activity.time}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActivities((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          );
                        }}
                        className="text-[10px] text-slate-300 hover:text-red-500 cursor-pointer self-start"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <footer className="mt-10 py-8 border-t border-[#E5E6E6] flex items-center justify-between">
        <p className="text-[12px] font-bold text-[#203430]">
          Copyright © 2025 Peterdraw
        </p>
        <div className="flex gap-6">
          {["Privacy Policy", "Term and conditions", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-[12px] text-[#63716E] hover:text-brand transition-colors"
            >
              {l}
            </a>
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
            <p className="text-[10px] text-[#A4ACAB]">
              The payroll authorization queue has updated dynamically.
            </p>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
