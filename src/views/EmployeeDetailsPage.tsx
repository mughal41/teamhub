import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import {
  ArrowLeft,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Linkedin,
  Instagram,
  FileText,
  TrendingUp,
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Download,
  Copy,
  Printer,
  Upload,
  Plus,
  Share2,
  X,
  Edit,
  Clock,
  CheckCircle2,
  Award,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/src/lib/utils";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import {
  getCollection,
  saveCollection,
  initialEmployees,
  Employee,
  AttendanceRecord,
  LeaveActivityItem,
} from "../lib/db";
import { useAuth } from "../context/AuthContext";
import { getVisibleNames, matchesVisibleName } from "../lib/roleScope";

// Social media icon for X
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface PerformanceRecord {
  month: string;
  score: number;
  date?: string;
  notes?: string;
}

interface HoursRecord {
  day: string; // "M" | "T" | "W" | "T" | "F" | "S" | "S"
  time: string; // "8:00"
  fillHeight: string; // "100%"
  isThu?: boolean;
}

interface DocumentItem {
  name: string;
  size: string;
  date?: string;
  status?: string;
}

interface NoteItem {
  title: string;
  date: string;
  desc: string;
}

interface PayrollConfig {
  salary: string;
  allowances: { label: string; amount: number }[];
  benefits: { label: string; amount: number }[];
}

export default function EmployeeDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, canView, canManage } = useAuth();

  // Load employee dynamically from localStorage database
  const [employeeStore, setEmployeeStore] = React.useState<Employee[]>(() => {
    return getCollection<Employee[]>("db_employees", initialEmployees);
  });

  const employee = React.useMemo(() => {
    const found = employeeStore.find((e) => e.id === id);
    if (found) return found;
    return (
      initialEmployees.find((e) => e.id === (id || "EMP-0289")) ||
      initialEmployees.find((e) => e.id === "EMP-0289") ||
      initialEmployees[0]
    );
  }, [employeeStore, id]);

  // Block opening profiles outside role scope (team / company)
  const canOpenThisProfile = React.useMemo(() => {
    if (!user || !canView("employees")) return false;
    const visible = getVisibleNames(user.roleId, "employees");
    return matchesVisibleName(employee?.name, visible);
  }, [user, employee?.name, canView]);

  // Toast message
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Dropdown menus states for "..." buttons
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [activePicker, setActivePicker] = React.useState<string | null>(null);

  // Filter pickers
  const [performanceRange, setPerformanceRange] = React.useState("Last Year");
  const [hoursRange, setHoursRange] = React.useState("This Week");

  // Calendar month state
  const [calendarMonth, setCalendarMonth] = React.useState("June 2035");

  // Default baseline data for smooth presentation matching Screenshot 2 & 4
  const defaultPerformanceData: PerformanceRecord[] = [
    { month: "Jan", score: 70 },
    { month: "Feb", score: 79 },
    { month: "Mar", score: 84 },
    { month: "Apr", score: 74 },
    { month: "May", score: 68 },
    { month: "Jun", score: 64 },
    { month: "Jul", score: 58 },
    { month: "Aug", score: 67 },
    { month: "Sep", score: 80.5 },
    { month: "Oct", score: 74 },
    { month: "Nov", score: 82 },
    { month: "Dec", score: 86.75 },
  ];

  const defaultHoursData: HoursRecord[] = [
    { day: "M", time: "8:00", fillHeight: "100%", isThu: false },
    { day: "T", time: "7:30", fillHeight: "94%", isThu: false },
    { day: "W", time: "4:00", fillHeight: "50%", isThu: false },
    { day: "T", time: "8:00", fillHeight: "100%", isThu: true },
    { day: "F", time: "7:00", fillHeight: "88%", isThu: false },
    { day: "S", time: "0:00", fillHeight: "0%", isThu: false },
    { day: "S", time: "0:00", fillHeight: "0%", isThu: false },
  ];

  const defaultDocuments: DocumentItem[] = [
    { name: "Performance Evaluation...", size: "1.24 MB", status: "Verified" },
    { name: "Contract Agreement.pdf", size: "895 KB", status: "Verified" },
    { name: "Curriculum Vitae.pdf", size: "1.27 MB", status: "Verified" },
    { name: "Portfolio.pdf", size: "3.68 MB", status: "Verified" },
  ];

  const defaultNotes: NoteItem[] = [
    {
      title: "Promotion Feedback",
      date: "10 January 2035",
      desc: "Promoted from HR Assistant to HR Officer due to consistent performance and leadership in onboarding initiatives.",
    },
    {
      title: "Employee Appreciation",
      date: "02 May 2035",
      desc: "Recognized by the Head of HR for successfully leading the Q2 training rollout with a 98% participation rate.",
    },
  ];

  const defaultPayrollConfig: PayrollConfig = {
    salary: employee.id === "EMP-0178" ? "3,100" : "3,200",
    allowances: [
      { label: "Transportation", amount: 120 },
      { label: "Meal", amount: 110 },
      { label: "Internet (Hybrid)", amount: 70 },
    ],
    benefits: [
      { label: "Health Insurance", amount: 120 },
      { label: "Life Insurance", amount: 40 },
      { label: "Company Device", amount: 65 },
      { label: "Training Program", amount: 80 },
      { label: "Fitness Membership", amount: 50 },
    ],
  };

  // Persistent per-employee datasets
  const perfStorageKey = `db_employee_perf_${employee.id}`;
  const hoursStorageKey = `db_employee_hours_${employee.id}`;
  const docsStorageKey = `db_employee_docs_${employee.id}`;
  const notesStorageKey = `db_employee_notes_${employee.id}`;
  const payrollStorageKey = `db_employee_payroll_${employee.id}`;

  const [performanceData, setPerformanceData] = React.useState<PerformanceRecord[]>(() => {
    return getCollection<PerformanceRecord[]>(perfStorageKey, defaultPerformanceData);
  });

  const [hoursData, setHoursData] = React.useState<HoursRecord[]>(() => {
    return getCollection<HoursRecord[]>(hoursStorageKey, defaultHoursData);
  });

  const [documents, setDocuments] = React.useState<DocumentItem[]>(() => {
    return getCollection<DocumentItem[]>(docsStorageKey, defaultDocuments);
  });

  const [notes, setNotes] = React.useState<NoteItem[]>(() => {
    return getCollection<NoteItem[]>(notesStorageKey, defaultNotes);
  });

  const [payrollConfig, setPayrollConfig] = React.useState<PayrollConfig>(() => {
    return getCollection<PayrollConfig>(payrollStorageKey, defaultPayrollConfig);
  });

  // Re-read storage whenever the active employee changes
  React.useEffect(() => {
    setPerformanceData(getCollection<PerformanceRecord[]>(`db_employee_perf_${employee.id}`, defaultPerformanceData));
    setHoursData(getCollection<HoursRecord[]>(`db_employee_hours_${employee.id}`, defaultHoursData));
    setDocuments(getCollection<DocumentItem[]>(`db_employee_docs_${employee.id}`, defaultDocuments));
    setNotes(getCollection<NoteItem[]>(`db_employee_notes_${employee.id}`, defaultNotes));
    setPayrollConfig(getCollection<PayrollConfig>(`db_employee_payroll_${employee.id}`, defaultPayrollConfig));
  }, [employee.id]);

  // Leaves real-time dataset from db_leaves
  const [leavesStore] = React.useState<LeaveActivityItem[]>(() => {
    return getCollection<LeaveActivityItem[]>("db_leaves", []);
  });

  const userLeaves = React.useMemo(() => {
    return leavesStore.filter(
      (l) => l.id === employee.id || l.name?.toLowerCase() === employee.name?.toLowerCase()
    );
  }, [leavesStore, employee]);

  // Attendance real-time dataset from db_attendance
  const [attendanceStore, setAttendanceStore] = React.useState<AttendanceRecord[]>(() => {
    return getCollection<AttendanceRecord[]>("db_attendance", []);
  });

  const userAttendance = React.useMemo(() => {
    return attendanceStore.filter(
      (a) => a.id === employee.id || a.name?.toLowerCase() === employee.name?.toLowerCase()
    );
  }, [attendanceStore, employee]);

  // Modals state
  const [modalType, setModalType] = React.useState<
    | "edit-personal"
    | "add-doc"
    | "add-note"
    | "edit-payroll"
    | "log-performance"
    | "log-hours"
    | "log-attendance"
    | null
  >(null);

  // Form states for modals
  const [editPersonalForm, setEditPersonalForm] = React.useState({
    gender: employee.id === "EMP-0178" ? "Male" : "Female",
    birthDate: "28 March 1993",
    email: employee.email || (employee.id === "EMP-0289" ? "mia.torres@company.com" : `${employee.name.toLowerCase().replace(/\s+/g, ".")}@teamhub.io`),
    phone: employee.phone || (employee.id === "EMP-0289" ? "+62 812-3456-7890" : "+1 (555) 762-3391"),
    address: employee.location || (employee.id === "EMP-0289" ? "Jl. Melati No. 45, Sleman, Yogyakarta, Indonesia" : "Chicago, IL, United States"),
  });

  // Sync personal form when employee changes
  React.useEffect(() => {
    setEditPersonalForm({
      gender: employee.id === "EMP-0178" ? "Male" : "Female",
      birthDate: "28 March 1993",
      email: employee.email || (employee.id === "EMP-0289" ? "mia.torres@company.com" : `${employee.name.toLowerCase().replace(/\s+/g, ".")}@teamhub.io`),
      phone: employee.phone || (employee.id === "EMP-0289" ? "+62 812-3456-7890" : "+1 (555) 762-3391"),
      address: employee.location || (employee.id === "EMP-0289" ? "Jl. Melati No. 45, Sleman, Yogyakarta, Indonesia" : "Chicago, IL, United States"),
    });
  }, [employee]);

  const [newDocForm, setNewDocForm] = React.useState({
    name: "",
    size: "1.2 MB",
  });

  const [newNoteForm, setNewNoteForm] = React.useState({
    title: "",
    desc: "",
  });

  const [newPerfForm, setNewPerfForm] = React.useState({
    month: "Jun",
    score: "85",
    notes: "Quarterly performance evaluation",
  });

  const [newHoursForm, setNewHoursForm] = React.useState({
    day: "M",
    hours: "8",
    minutes: "00",
  });

  const [newAttendanceForm, setNewAttendanceForm] = React.useState({
    day: 19,
    status: "Present", // "Present" | "Late" | "On Leave" | "Absent"
  });

  const [payrollSalary, setPayrollSalary] = React.useState(payrollConfig.salary);

  React.useEffect(() => {
    setPayrollSalary(payrollConfig.salary);
  }, [payrollConfig.salary]);

  // Close menus on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-menu-container]")) {
        setActiveMenu(null);
      }
      if (!target.closest("[data-picker-container]")) {
        setActivePicker(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Performance calculations
  const performanceAverage = React.useMemo(() => {
    if (performanceData.length === 0) return "86.75";
    const lastItem = performanceData[performanceData.length - 1];
    return Number(lastItem.score || 86.75).toFixed(2);
  }, [performanceData]);

  // Hours logged calculations
  const totalLoggedMinutes = React.useMemo(() => {
    if (hoursData.length === 0) return 2070; // 34h 30m
    return hoursData.reduce((acc, curr) => {
      const [h, m] = (curr.time || "0:00").split(":").map(Number);
      return acc + (h || 0) * 60 + (m || 0);
    }, 0);
  }, [hoursData]);

  const formattedTotalHours = React.useMemo(() => {
    const hours = Math.floor(totalLoggedMinutes / 60);
    const mins = totalLoggedMinutes % 60;
    return { hours, mins };
  }, [totalLoggedMinutes]);

  // Calendar cells generation matching Screenshot 1
  const calendarCells = React.useMemo(() => {
    // If real attendance records exist in db_attendance, use them; otherwise use standard shift records
    const hasCustomAttendance = userAttendance.length > 0;

    const baseShiftTypes: Record<number, "present" | "late" | "on-leave" | "absent"> = {
      1: "on-leave",
      4: "late",
      5: "present",
      6: "present",
      7: "present",
      8: "present",
      11: "present",
      12: "present",
      13: "absent",
      14: "present",
      15: "late",
      18: "present",
      19: "present",
      20: "late",
      21: "late",
      22: "present",
      25: "present",
      26: "on-leave",
      28: "late",
      29: "present",
    };

    const cells = [];
    // Previous month trailing muted days (27, 28, 29, 30, 31)
    for (let d = 27; d <= 31; d++) {
      cells.push({ day: d, isMuted: true, type: undefined });
    }
    // Days 1 through 30 for June 2035
    for (let d = 1; d <= 30; d++) {
      let type: "present" | "late" | "on-leave" | "absent" | undefined = undefined;

      if (hasCustomAttendance) {
        const dateStr1 = `${d} Jun 2035`;
        const dateStr2 = `0${d} Jun 2035`;
        const match = userAttendance.find(
          (a) => a.date === dateStr1 || a.date === dateStr2 || a.date?.includes(`${d} Jun`)
        );
        if (match) {
          if (match.status === "On-Time" || match.status === "Present") type = "present";
          else if (match.status === "Late") type = "late";
          else if (match.status === "On Leave") type = "on-leave";
          else if (match.status === "Absent") type = "absent";
        }
      } else {
        type = baseShiftTypes[d];
      }

      cells.push({ day: d, isMuted: false, type });
    }
    return cells;
  }, [userAttendance]);

  // Counts for attendance legend matching Screenshot 1
  const attendanceCounts = React.useMemo(() => {
    let present = 0, late = 0, onLeave = 0, absent = 0;
    calendarCells.forEach((c) => {
      if (!c.isMuted) {
        if (c.type === "present") present++;
        else if (c.type === "late") late++;
        else if (c.type === "on-leave") onLeave++;
        else if (c.type === "absent") absent++;
      }
    });
    return { present, late, onLeave, absent };
  }, [calendarCells]);

  // Leaves metrics matching Screenshot 1
  const leavesStats = React.useMemo(() => {
    const annualTaken = userLeaves
      .filter((l) => l.type?.toLowerCase().includes("annual"))
      .reduce((acc, l) => acc + (parseInt(l.duration) || 1), 0);
    const casualTaken = userLeaves
      .filter((l) => l.type?.toLowerCase().includes("casual"))
      .reduce((acc, l) => acc + (parseInt(l.duration) || 1), 0);
    const sickTaken = userLeaves
      .filter((l) => l.type?.toLowerCase().includes("sick"))
      .reduce((acc, l) => acc + (parseInt(l.duration) || 1), 0);

    return [
      {
        title: "All Leaves",
        val: annualTaken > 0 || casualTaken > 0 || sickTaken > 0 ? annualTaken + casualTaken + sickTaken : 14,
        total: 20,
        unit: "Days",
        color: "#0E4D41",
        bgColor: "bg-[#E4F2D3]",
        strokeColor: "#0E4D41",
        baseStroke: "#FFFFFF",
      },
      {
        title: "Annual Leaves",
        val: annualTaken > 0 ? annualTaken : 10,
        total: 15,
        unit: "Days",
        color: "#0E4D41",
        bgColor: "bg-white",
        strokeColor: "#35BFA3",
        baseStroke: "#E4F2D3",
      },
      {
        title: "Casual Leaves",
        val: casualTaken > 0 ? casualTaken : 8,
        total: 24,
        unit: "Hours",
        color: "#0E4D41",
        bgColor: "bg-white",
        strokeColor: "#35BFA3",
        baseStroke: "#E4F2D3",
      },
      {
        title: "Sick Leaves",
        val: sickTaken > 0 ? sickTaken : 3,
        total: 4,
        unit: "Days",
        color: "#0E4D41",
        bgColor: "bg-white",
        strokeColor: "#35BFA3",
        baseStroke: "#E4F2D3",
      },
    ];
  }, [userLeaves]);

  // Actions handlers
  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = employeeStore.map((emp) =>
      emp.id === employee.id
        ? {
            ...emp,
            email: editPersonalForm.email,
            phone: editPersonalForm.phone,
            location: editPersonalForm.address,
          }
        : emp
    );
    setEmployeeStore(updated);
    saveCollection("db_employees", updated);
    setModalType(null);
    setToastMessage("Personal information updated successfully!");
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocForm.name.trim()) return;
    const docName = newDocForm.name.endsWith(".pdf")
      ? newDocForm.name
      : `${newDocForm.name}.pdf`;
    const updated = [{ name: docName, size: newDocForm.size || "1.2 MB", status: "Verified" }, ...documents];
    setDocuments(updated);
    saveCollection(docsStorageKey, updated);
    setNewDocForm({ name: "", size: "1.2 MB" });
    setModalType(null);
    setToastMessage("Document uploaded successfully!");
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteForm.title.trim()) return;
    const updated = [
      {
        title: newNoteForm.title,
        date: "Today, Just now",
        desc: newNoteForm.desc || "Note added by HR admin.",
      },
      ...notes,
    ];
    setNotes(updated);
    saveCollection(notesStorageKey, updated);
    setNewNoteForm({ title: "", desc: "" });
    setModalType(null);
    setToastMessage("Internal note added successfully!");
  };

  const handleLogPerformance = (e: React.FormEvent) => {
    e.preventDefault();
    const scoreVal = Math.min(100, Math.max(0, parseFloat(newPerfForm.score) || 0));
    const updated = [
      ...performanceData,
      {
        month: newPerfForm.month,
        score: scoreVal,
        notes: newPerfForm.notes,
        date: "June 2035",
      },
    ];
    setPerformanceData(updated);
    saveCollection(perfStorageKey, updated);
    setModalType(null);
    setToastMessage(`Performance score of ${scoreVal}% recorded for ${newPerfForm.month}!`);
  };

  const handleLogHours = (e: React.FormEvent) => {
    e.preventDefault();
    const hrs = Math.max(0, parseInt(newHoursForm.hours) || 0);
    const mins = Math.max(0, parseInt(newHoursForm.minutes) || 0);
    const timeStr = `${hrs}:${mins < 10 ? "0" + mins : mins}`;
    const fillPercent = Math.min(100, Math.round(((hrs * 60 + mins) / 480) * 100));

    const existingIdx = hoursData.findIndex((h) => h.day === newHoursForm.day);
    let updated: HoursRecord[];
    if (existingIdx >= 0) {
      updated = [...hoursData];
      updated[existingIdx] = {
        day: newHoursForm.day,
        time: timeStr,
        fillHeight: `${fillPercent}%`,
        isThu: newHoursForm.day === "T" && existingIdx === 3,
      };
    } else {
      updated = [
        ...hoursData,
        {
          day: newHoursForm.day,
          time: timeStr,
          fillHeight: `${fillPercent}%`,
          isThu: newHoursForm.day === "T",
        },
      ];
    }
    setHoursData(updated);
    saveCollection(hoursStorageKey, updated);
    setModalType(null);
    setToastMessage(`Timesheet updated: ${timeStr} hours logged for ${newHoursForm.day}!`);
  };

  const handleLogAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const day = Number(newAttendanceForm.day);
    const dateStr = `${day} Jun 2035`;
    const newRecord: AttendanceRecord = {
      id: employee.id,
      name: employee.name,
      role: employee.role,
      subRole: employee.role,
      dept: employee.dept,
      date: dateStr,
      model: employee.model || "Hybrid",
      in: newAttendanceForm.status === "Absent" || newAttendanceForm.status === "On Leave" ? "--" : "09:00 AM",
      out: newAttendanceForm.status === "Absent" || newAttendanceForm.status === "On Leave" ? "--" : "05:00 PM",
      duration: newAttendanceForm.status === "Absent" || newAttendanceForm.status === "On Leave" ? "0h" : "8h 00m",
      overtime: "--",
      status: newAttendanceForm.status === "Present" ? "On-Time" : newAttendanceForm.status,
      avatar: employee.avatar,
      correctionRequestsThisMonth: 0,
      comment: "",
      forwardedTo: "",
      forwardedStatus: "None",
      hrApprovalStatus: "Approved",
    };

    const existingIdx = attendanceStore.findIndex(
      (a) =>
        (a.id === employee.id || a.name === employee.name) &&
        (a.date === dateStr || a.date === `0${day} Jun 2035`)
    );

    let updated: AttendanceRecord[];
    if (existingIdx >= 0) {
      updated = [...attendanceStore];
      updated[existingIdx] = newRecord;
    } else {
      updated = [newRecord, ...attendanceStore];
    }

    setAttendanceStore(updated);
    saveCollection("db_attendance", updated);
    setModalType(null);
    setToastMessage(`Attendance for ${dateStr} marked as ${newAttendanceForm.status}!`);
  };

  const handleSavePayroll = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSalary = payrollSalary.replace(/[^0-9.]/g, "") || "3200";
    const newConfig: PayrollConfig = {
      salary: Number(cleanSalary).toLocaleString(),
      allowances: [
        { label: "Transportation", amount: 120 },
        { label: "Meal", amount: 110 },
        { label: "Internet (Hybrid)", amount: 70 },
      ],
      benefits: [
        { label: "Health Insurance", amount: 120 },
        { label: "Life Insurance", amount: 40 },
        { label: "Company Device", amount: 65 },
        { label: "Training Program", amount: 80 },
        { label: "Fitness Membership", amount: 50 },
      ],
    };
    setPayrollConfig(newConfig);
    saveCollection(payrollStorageKey, newConfig);
    setModalType(null);
    setToastMessage("Payroll configured and saved successfully!");
  };

  const totalAllowances = React.useMemo(() => {
    return payrollConfig.allowances.reduce((acc, a) => acc + a.amount, 0);
  }, [payrollConfig.allowances]);

  const totalBenefits = React.useMemo(() => {
    return payrollConfig.benefits.reduce((acc, b) => acc + b.amount, 0);
  }, [payrollConfig.benefits]);

  const totalMonthlyValue = React.useMemo(() => {
    const base = parseInt(payrollConfig.salary.replace(/,/g, "")) || 3200;
    return base + totalAllowances + totalBenefits;
  }, [payrollConfig.salary, totalAllowances, totalBenefits]);

  const canSeeSalary = canView("payroll");
  const canEditEmployee = canManage("employees");

  if (!canOpenThisProfile) {
    return <Navigate to="/employees" replace />;
  }

  return (
    <AppLayout
      title="Employees"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Employees", href: "/employees" },
        { label: "Employee Details" },
      ]}
    >
      <div className="space-y-5">
        {/* Toast Feedback */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0E4D41] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <Check className="h-4 w-4 text-[#35BFA3]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Row */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="h-8 w-8 rounded-lg bg-white border border-[#E5E6E6] flex items-center justify-center text-[#203430] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
            title="Back to employee list"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#203430] leading-tight">
              Employee Details
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] text-[#63716E] mt-0.5">
              <span
                onClick={() => navigate("/")}
                className="text-[#35BFA3] hover:underline cursor-pointer"
              >
                Dashboard
              </span>
              <span>/</span>
              <span
                onClick={() => navigate("/employees")}
                className="text-[#35BFA3] hover:underline cursor-pointer"
              >
                Employees
              </span>
              <span>/</span>
              <span className="text-[#203430] font-medium">Employee Details</span>
            </div>
          </div>
        </div>

        {/* 3-Column Layout: Left (Col-3), Center (Col-6), Right (Col-3)
            Using items-stretch & h-full so all 3 columns align at the bottom with ZERO whitespace gaps */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
          {/* =========================================================================
              LEFT COLUMN: Profile Card & Personal Info Card (fills vertical height)
              ========================================================================= */}
          <div className="xl:col-span-3 flex flex-col gap-5 h-full">
            {/* Employment Info Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#EBECEB] shadow-2xs flex flex-col items-center text-center shrink-0">
              {/* Avatar in Teal Rounded Container */}
              <div className="w-[140px] h-[140px] rounded-2xl bg-[#35BFA3] p-1 flex items-center justify-center overflow-hidden mb-3.5 shadow-2xs">
                <img
                  src={
                    employee.avatar ||
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=200&h=200&q=80"
                  }
                  alt={employee.name}
                  className="w-full h-full rounded-[14px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Name */}
              <h2 className="text-lg font-bold text-[#203430] mb-0.5">
                {employee.name}
              </h2>

              {/* Role & Dept */}
              <p className="text-xs text-[#63716E] mb-3">
                {employee.role} • {employee.dept}
              </p>

              {/* Tag ID & Status */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="px-3 py-1 bg-[#E5E6E6] text-[#203430] text-xs font-semibold rounded-full">
                  {employee.id}
                </span>
                <span
                  className={cn(
                    "px-3 py-1 text-xs font-semibold text-white rounded-full",
                    employee.status === "Active"
                      ? "bg-[#35BFA3]"
                      : employee.status === "On Leave"
                      ? "bg-[#6B7875]"
                      : "bg-[#0E4D41]"
                  )}
                >
                  {employee.status || "Active"}
                </span>
              </div>

              {/* Info Table Box */}
              <div className="w-full bg-[#F7F7F7] rounded-xl overflow-hidden border border-[#E5E6E6]/60 text-xs text-left mb-4">
                <div className="flex justify-between items-center px-3.5 py-3 border-b border-[#E5E6E6]">
                  <span className="text-[#63716E]">Employment Type</span>
                  <span className="font-semibold text-[#203430]">
                    {employee.type || "Full-Time"}
                  </span>
                </div>
                <div className="flex justify-between items-center px-3.5 py-3 border-b border-[#E5E6E6]">
                  <span className="text-[#63716E]">Work Model</span>
                  <span className="font-semibold text-[#203430]">
                    {employee.model || "Hybrid"}
                  </span>
                </div>
                <div className="flex justify-between items-center px-3.5 py-3">
                  <span className="text-[#63716E]">Join Date</span>
                  <span className="font-semibold text-[#203430]">
                    {employee.joinDate || "14 February 2033"}
                  </span>
                </div>
              </div>

              {/* Social Media Row */}
              <div className="flex items-center justify-between w-full pt-1 text-xs text-[#63716E]">
                <span>Social Media:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`https://linkedin.com/in/${employee.name.toLowerCase().replace(/\s+/g, "")}`);
                      setToastMessage("LinkedIn profile link copied!");
                    }}
                    className="h-7 w-7 rounded-lg bg-[#E4F2D3] text-[#203430] hover:bg-[#d9edc3] flex items-center justify-center transition-colors cursor-pointer"
                    title="LinkedIn"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`https://x.com/${employee.name.toLowerCase().replace(/\s+/g, "")}`);
                      setToastMessage("X handle copied!");
                    }}
                    className="h-7 w-7 rounded-lg bg-[#E4F2D3] text-[#203430] hover:bg-[#d9edc3] flex items-center justify-center transition-colors cursor-pointer"
                    title="X"
                  >
                    <XLogo className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`https://instagram.com/${employee.name.toLowerCase().replace(/\s+/g, "")}`);
                      setToastMessage("Instagram link copied!");
                    }}
                    className="h-7 w-7 rounded-lg bg-[#E4F2D3] text-[#203430] hover:bg-[#d9edc3] flex items-center justify-center transition-colors cursor-pointer"
                    title="Instagram"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Personal Info Card (FLEX-1: fills bottom with ZERO empty space, perfectly aligning with center and right columns) */}
            <div className="bg-white rounded-2xl p-5 border border-[#EBECEB] shadow-2xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 relative" data-menu-container>
                  <h3 className="text-base font-bold text-[#203430]">Personal Info</h3>
                  <button
                    type="button"
                    onClick={() => setActiveMenu(activeMenu === "personal" ? null : "personal")}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
                    title="More actions"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {/* Dropdown menu */}
                  {activeMenu === "personal" && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in zoom-in-95">
                      {canEditEmployee && (
                      <button
                        type="button"
                        onClick={() => {
                          setModalType("edit-personal");
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-2 cursor-pointer"
                      >
                        <Edit className="h-3.5 w-3.5 text-slate-400" />
                        <span>Edit Personal Info</span>
                      </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `Email: ${editPersonalForm.email}\nPhone: ${editPersonalForm.phone}\nAddress: ${editPersonalForm.address}`
                          );
                          setActiveMenu(null);
                          setToastMessage("Contact details copied to clipboard!");
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-2 cursor-pointer"
                      >
                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                        <span>Copy Contact Info</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          window.print();
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-2 cursor-pointer"
                      >
                        <Printer className="h-3.5 w-3.5 text-slate-400" />
                        <span>Print Profile</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Gender */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#F8FCF3] text-[#35BFA3] flex items-center justify-center shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#63716E]">Gender</p>
                      <p className="text-sm font-semibold text-[#203430]">
                        {editPersonalForm.gender}
                      </p>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#F8FCF3] text-[#35BFA3] flex items-center justify-center shrink-0">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#63716E]">Date of Birth</p>
                      <p className="text-sm font-semibold text-[#203430]">
                        {editPersonalForm.birthDate}
                      </p>
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#F8FCF3] text-[#35BFA3] flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#63716E]">Email Address</p>
                      <p className="text-sm font-semibold text-[#203430] truncate">
                        {editPersonalForm.email}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#F8FCF3] text-[#35BFA3] flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#63716E]">Phone</p>
                      <p className="text-sm font-semibold text-[#203430]">
                        {editPersonalForm.phone}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#F8FCF3] text-[#35BFA3] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#63716E]">Address</p>
                      <p className="text-sm font-semibold text-[#203430] leading-snug">
                        {editPersonalForm.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Identity & Compliance Verification Block: Eliminates empty space cleanly */}
              <div className="pt-4 mt-4 border-t border-[#EBECEB] flex items-center justify-between text-[11px] text-[#63716E]">
                <div className="flex items-center gap-1.5 font-medium text-[#0E4D41]">
                  <ShieldCheck className="h-4 w-4 text-[#35BFA3]" />
                  <span>HR Ledger Verified</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#E4F2D3] text-[#0E4D41] text-[10px] font-bold">
                  Active Profile
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              CENTER COLUMN: Leaves, Performance, Hours Logged, Documents, Notes
              ========================================================================= */}
          <div className="xl:col-span-6 flex flex-col gap-5 min-w-0 h-full justify-between">
            {/* Top Leaves Metrics (4 Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {leavesStats.map((item) => (
                <div
                  key={item.title}
                  className={cn(
                    "rounded-2xl p-4 flex flex-col items-center text-center border border-[#EBECEB] shadow-2xs transition-all",
                    item.bgColor
                  )}
                >
                  <p className="text-xs font-semibold text-[#203430] mb-3">
                    {item.title}
                  </p>

                  {/* Circular Gauge */}
                  <div className="relative w-20 h-20 mb-1 flex items-center justify-center">
                    <svg className="w-20 h-20 -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke={item.baseStroke}
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke={item.strokeColor}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={201}
                        strokeDashoffset={201 * (1 - Math.min(1, item.val / item.total))}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="flex items-baseline">
                        <span className="text-lg font-bold text-[#0E4D41]">
                          {item.val}
                        </span>
                        <span className="text-[11px] font-normal text-[#63716E]">
                          /{item.total}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#63716E] -mt-0.5">
                        {item.unit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Overview (Stepped Area Chart matching Screenshot 2) */}
            <div className="bg-white rounded-2xl p-5 border border-[#EBECEB] shadow-2xs">
              <div className="flex items-center justify-between mb-4 relative" data-picker-container>
                <h3 className="text-base font-bold text-[#203430]">
                  Performance Overview
                </h3>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActivePicker(activePicker === "perf" ? null : "perf")}
                      className="h-8 px-3 rounded-lg bg-[#E4F2D3] text-[#203430] text-xs font-medium flex items-center gap-1.5 hover:bg-[#d9edc3] cursor-pointer"
                    >
                      <span>{performanceRange}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-[#203430]" />
                    </button>

                    {activePicker === "perf" && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-50 animate-in fade-in">
                        {["Last Year", "This Year", "Last 6 Months"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setPerformanceRange(opt);
                              setActivePicker(null);
                            }}
                            className={cn(
                              "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer",
                              performanceRange === opt
                                ? "bg-[#E4F2D3] text-[#0E4D41] font-bold"
                                : "text-[#203430] hover:bg-slate-50"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* "..." Action Menu */}
                  <div className="relative" data-menu-container>
                    <button
                      type="button"
                      onClick={() => setActiveMenu(activeMenu === "perf-menu" ? null : "perf-menu")}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
                      title="Performance options"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {activeMenu === "perf-menu" && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in">
                        <button
                          type="button"
                          onClick={() => {
                            setModalType("log-performance");
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-2 cursor-pointer"
                        >
                          <Award className="h-3.5 w-3.5 text-slate-400" />
                          <span>Log Evaluation Score</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenu(null);
                            setToastMessage("Performance evaluation report exported!");
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-2 cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5 text-slate-400" />
                          <span>Export Report</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Big Score & Trend matching Screenshot 2 */}
              <div className="mb-4">
                <div className="text-2xl font-bold text-[#203430] mb-1">
                  {performanceAverage}%
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded-md bg-[#E4F2D3] text-[#0E4D41] text-[11px] font-bold flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> +2.05%
                  </span>
                  <span className="text-xs text-[#63716E]">
                    Increased by last year
                  </span>
                </div>
              </div>

              {/* Stepped Area Chart */}
              <div className="h-[155px] w-full relative">
                {/* September Tooltip Badge & Dot on the step line */}
                <div className="absolute right-[22%] top-[34px] -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                  <div className="bg-white px-2.5 py-1 rounded-lg shadow-md border border-slate-100/90 text-center">
                    <p className="text-[9px] text-[#63716E]">Sept 2035</p>
                    <p className="text-xs font-bold text-[#0E4D41]">80.5%</p>
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full bg-[#35BFA3] border-2 border-white shadow-xs -mt-1" />
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="stepGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#35BFA3" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#35BFA3" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F0F1F0"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#63716E" }}
                      dy={5}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: "#63716E" }}
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                      tickFormatter={(v) => `${v}%`}
                      width={32}
                    />
                    <Area
                      type="stepAfter"
                      dataKey="score"
                      stroke="#0E4D41"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#stepGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 3: Hours Logged & Documents (Equal height, tight bounds, ZERO dead space) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
              {/* Hours Logged Card matching Screenshot 2 & 3 */}
              <div className="bg-white rounded-2xl p-5 border border-[#EBECEB] shadow-2xs flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-2 relative" data-picker-container>
                    <h3 className="text-base font-bold text-[#203430]">
                      Hours Logged
                    </h3>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActivePicker(activePicker === "hours" ? null : "hours")}
                          className="h-8 px-3 rounded-lg bg-[#E4F2D3] text-[#203430] text-xs font-medium flex items-center gap-1.5 hover:bg-[#d9edc3] cursor-pointer"
                        >
                          <span>{hoursRange}</span>
                          <ChevronDown className="h-3.5 w-3.5 text-[#203430]" />
                        </button>

                        {activePicker === "hours" && (
                          <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-50 animate-in fade-in">
                            {["This Week", "Last Week", "This Month"].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  setHoursRange(opt);
                                  setActivePicker(null);
                                }}
                                className={cn(
                                  "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer",
                                  hoursRange === opt
                                    ? "bg-[#E4F2D3] text-[#0E4D41] font-bold"
                                    : "text-[#203430] hover:bg-slate-50"
                                )}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* "..." Action Menu */}
                      <div className="relative" data-menu-container>
                        <button
                          type="button"
                          onClick={() => setActiveMenu(activeMenu === "hours-menu" ? null : "hours-menu")}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
                          title="Hours options"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {activeMenu === "hours-menu" && (
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in">
                            <button
                              type="button"
                              onClick={() => {
                                setModalType("log-hours");
                                setActiveMenu(null);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-2 cursor-pointer"
                            >
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              <span>Log Work Hours</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenu(null);
                                setToastMessage("Timesheet exported to CSV!");
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-2 cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5 text-slate-400" />
                              <span>Export Timesheet</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-2xl font-bold text-[#203430]">
                      {formattedTotalHours.hours}
                    </span>
                    <span className="text-xs text-[#63716E] ml-1 mr-2">h</span>
                    <span className="text-2xl font-bold text-[#203430]">
                      {formattedTotalHours.mins}
                    </span>
                    <span className="text-xs text-[#63716E] ml-1">m</span>
                  </div>
                </div>

                {/* Progress Pillars matching Screenshot 3 & 2 */}
                <div className="flex items-end justify-between gap-2 sm:gap-2.5 h-[160px] pt-1">
                  {hoursData.map((d, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setNewHoursForm((prev) => ({ ...prev, day: d.day }));
                        setModalType("log-hours");
                      }}
                      className="flex-1 flex flex-col items-center justify-end h-full gap-1.5 cursor-pointer group"
                      title={`Click to adjust hours for ${d.day}`}
                    >
                      <span
                        className={cn(
                          "text-[10px]",
                          d.isThu
                            ? "font-bold text-[#0E4D41]"
                            : "font-normal text-[#63716E]"
                        )}
                      >
                        {d.time}
                      </span>

                      <div className="w-full bg-[#E4F2D3] rounded-md h-[115px] relative overflow-hidden flex flex-col justify-end group-hover:opacity-90">
                        <div
                          className={cn(
                            "w-full rounded-md transition-all duration-300",
                            d.isThu ? "bg-[#0E4D41]" : "bg-[#35BFA3]"
                          )}
                          style={{ height: d.fillHeight }}
                        />
                      </div>

                      <span className="text-xs text-[#63716E] font-medium">
                        {d.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents Card matching Screenshot 2 */}
              <div className="bg-white rounded-2xl p-5 border border-[#EBECEB] shadow-2xs flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3.5 relative" data-menu-container>
                    <h3 className="text-base font-bold text-[#203430]">Documents</h3>

                    <button
                      type="button"
                      onClick={() => setActiveMenu(activeMenu === "docs" ? null : "docs")}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
                      title="More documents"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {/* Popover menu */}
                    {activeMenu === "docs" && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in">
                        <button
                          type="button"
                          onClick={() => {
                            setModalType("add-doc");
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-2 cursor-pointer"
                        >
                          <Upload className="h-3.5 w-3.5 text-slate-400" />
                          <span>Upload Document</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenu(null);
                            setToastMessage(`Downloading archive with ${documents.length} files (.zip)...`);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-2 cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5 text-slate-400" />
                          <span>Download All (ZIP)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setActiveMenu(null);
                            setToastMessage("Document share link copied to clipboard!");
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-2 cursor-pointer"
                        >
                          <Share2 className="h-3.5 w-3.5 text-slate-400" />
                          <span>Share Documents</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {documents.slice(0, 4).map((doc) => (
                      <div
                        key={doc.name}
                        onClick={() => setToastMessage(`Opening ${doc.name}...`)}
                        className="flex items-center gap-3 p-1 rounded-xl hover:bg-[#F7F7F7] transition-colors cursor-pointer group"
                      >
                        <div className="h-10 w-10 rounded-lg bg-[#E4F2D3] text-[#0E4D41] flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#203430] group-hover:text-[#35BFA3] transition-colors truncate">
                            {doc.name}
                          </p>
                          <p className="text-[10px] text-[#63716E]">
                            PDF • {doc.size}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setModalType("add-doc")}
                    className="text-[11px] font-semibold text-[#35BFA3] hover:underline cursor-pointer"
                  >
                    + Upload New File
                  </button>
                </div>
              </div>
            </div>

            {/* Internal Notes Card matching Screenshot 2 */}
            <div className="bg-white rounded-2xl p-5 border border-[#EBECEB] shadow-2xs">
              <div className="flex items-center justify-between mb-3.5 relative" data-menu-container>
                <h3 className="text-base font-bold text-[#203430]">
                  Internal Notes
                </h3>

                <button
                  type="button"
                  onClick={() => setActiveMenu(activeMenu === "notes" ? null : "notes")}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
                  title="More notes options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {/* Popover menu */}
                {activeMenu === "notes" && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in">
                    <button
                      type="button"
                      onClick={() => {
                        setModalType("add-note");
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5 text-slate-400" />
                      <span>Add New Note</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMenu(null);
                        setToastMessage("Exported notes to file!");
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-400" />
                      <span>Export Notes</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 2 Note Cards side by side matching Screenshot 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {notes.slice(0, 2).map((n, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-[#F8FCF3] border border-[#E9F3E3] text-xs flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-[#203430] mb-0.5">{n.title}</h4>
                      <p className="text-[9px] text-[#63716E] mb-2">{n.date}</p>
                      <p className="text-[11px] text-[#63716E] leading-relaxed">
                        {n.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: Attendance Calendar & Payroll Summary (fills vertical height)
              ========================================================================= */}
          <div className="xl:col-span-3 flex flex-col gap-5 h-full">
            {/* Calendar Card matching Screenshot 1 */}
            <div className="bg-white rounded-2xl p-5 border border-[#EBECEB] shadow-2xs shrink-0">
              {/* Month Picker Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 font-bold text-[#203430] text-sm">
                  <span>{calendarMonth}</span>
                  <ChevronDown className="h-4 w-4 text-[#63716E]" />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCalendarMonth(calendarMonth === "June 2035" ? "May 2035" : "June 2035");
                      setToastMessage("Navigated to previous month");
                    }}
                    className="h-8 w-8 rounded-lg bg-[#E4F2D3] text-[#203430] hover:bg-[#d9edc3] flex items-center justify-center transition-colors cursor-pointer"
                    title="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalendarMonth(calendarMonth === "June 2035" ? "July 2035" : "June 2035");
                      setToastMessage("Navigated to next month");
                    }}
                    className="h-8 w-8 rounded-lg bg-[#E4F2D3] text-[#203430] hover:bg-[#d9edc3] flex items-center justify-center transition-colors cursor-pointer"
                    title="Next month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* Calendar "..." Menu */}
                  <div className="relative" data-menu-container>
                    <button
                      type="button"
                      onClick={() => setActiveMenu(activeMenu === "cal-menu" ? null : "cal-menu")}
                      className="h-8 w-8 rounded-lg bg-white border border-[#E5E6E6] text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Attendance options"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {activeMenu === "cal-menu" && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in">
                        <button
                          type="button"
                          onClick={() => {
                            setModalType("log-attendance");
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-2 cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5 text-slate-400" />
                          <span>Mark Attendance Day</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenu(null);
                            setToastMessage("Attendance log exported!");
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-2 cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5 text-slate-400" />
                          <span>Export Month Log</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Day of Week Labels */}
              <div className="grid grid-cols-7 text-center text-xs text-[#63716E] mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <span key={i} className="py-1 font-medium">
                    {d}
                  </span>
                ))}
              </div>

              {/* Calendar Grid with Continuous Square Cells matching Screenshot 1 */}
              <div className="grid grid-cols-7 text-center gap-[2px] text-xs">
                {calendarCells.map((cell, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!cell.isMuted) {
                        setNewAttendanceForm((prev) => ({ ...prev, day: cell.day }));
                        setModalType("log-attendance");
                      }
                    }}
                    className={cn(
                      "h-8 w-8 mx-auto flex items-center justify-center font-medium text-xs transition-colors rounded-sm cursor-pointer",
                      cell.isMuted && "text-[#A4ACAB] hover:bg-slate-50 cursor-default",
                      !cell.isMuted && !cell.type && "text-[#203430] hover:bg-[#F7F7F7]",
                      cell.type === "on-leave" && "bg-[#0E4D41] text-white font-bold hover:bg-[#0c4036]",
                      cell.type === "late" && "bg-[#35BFA3] text-white font-bold hover:bg-[#2fa890]",
                      cell.type === "present" && "bg-[#E4F2D3] text-[#203430] font-bold hover:bg-[#d8e8c5]",
                      cell.type === "absent" && "bg-[#E5E6E6] text-[#203430] font-bold hover:bg-[#d5d7d7]"
                    )}
                    title={
                      !cell.isMuted
                        ? `Click to edit attendance for June ${cell.day}`
                        : undefined
                    }
                  >
                    {cell.day}
                  </button>
                ))}
              </div>

              {/* Legend with vertical indicator bars matching Screenshot 1 */}
              <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-[#EBECEB] text-left">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-6 rounded-full bg-[#E4F2D3]" />
                  <div>
                    <p className="text-[10px] text-[#63716E]">Present</p>
                    <p className="text-xs font-bold text-[#203430]">{attendanceCounts.present}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-6 rounded-full bg-[#35BFA3]" />
                  <div>
                    <p className="text-[10px] text-[#63716E]">Late</p>
                    <p className="text-xs font-bold text-[#203430]">{attendanceCounts.late}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-6 rounded-full bg-[#0E4D41]" />
                  <div>
                    <p className="text-[10px] text-[#63716E]">On Leave</p>
                    <p className="text-xs font-bold text-[#203430]">{attendanceCounts.onLeave}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-6 rounded-full bg-[#E5E6E6]" />
                  <div>
                    <p className="text-[10px] text-[#63716E]">Absent</p>
                    <p className="text-xs font-bold text-[#203430]">{attendanceCounts.absent}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payroll Summary — only if role can view payroll/salary */}
            {canSeeSalary ? (
            <div className="bg-white rounded-2xl p-5 border border-[#EBECEB] shadow-2xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3.5 relative" data-menu-container>
                  <h3 className="text-base font-bold text-[#203430]">
                    Payroll Summary
                  </h3>

                  <button
                    type="button"
                    onClick={() => setActiveMenu(activeMenu === "payroll" ? null : "payroll")}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Payroll options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {/* Popover menu */}
                  {activeMenu === "payroll" && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in">
                      {canManage("payroll") && (
                        <button
                          type="button"
                          onClick={() => {
                            setModalType("edit-payroll");
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-2 cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5 text-slate-400" />
                          <span>Adjust Base Salary</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenu(null);
                          setToastMessage("Generating Payslip PDF for June 2035...");
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-2 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5 text-slate-400" />
                        <span>Download Payslip (PDF)</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="rounded-xl overflow-hidden border border-[#EBECEB] text-xs">
                  {/* Header Row */}
                  <div className="bg-[#F7F7F7] px-3.5 py-2.5 flex justify-between items-center text-[10px] text-[#63716E]">
                    <span>Description</span>
                    <div className="text-right">
                      <span>Amount</span>
                      <span className="block text-[8px] text-[#A4ACAB]">USD/month</span>
                    </div>
                  </div>

                  {/* Base Salary */}
                  <div className="px-3.5 py-2.5 flex justify-between items-center border-b border-[#EBECEB] bg-white font-bold text-[#203430]">
                    <span>Base Salary</span>
                    <span>${payrollConfig.salary}</span>
                  </div>

                  {/* Allowances Section */}
                  <div className="px-3.5 py-1.5 bg-[#FBFBFB] text-[10px] font-bold text-[#63716E] uppercase tracking-wider border-b border-[#EBECEB]">
                    Allowances
                  </div>
                  {payrollConfig.allowances.map((a, i) => (
                    <div
                      key={i}
                      className="px-3.5 py-2 flex justify-between text-[#63716E] border-b border-[#EBECEB] bg-white"
                    >
                      <span>{a.label}</span>
                      <span className="font-bold text-[#203430]">${a.amount}</span>
                    </div>
                  ))}

                  {/* Benefits Section */}
                  <div className="px-3.5 py-1.5 bg-[#FBFBFB] text-[10px] font-bold text-[#63716E] uppercase tracking-wider border-b border-[#EBECEB]">
                    Benefits
                  </div>
                  {payrollConfig.benefits.map((b, i) => (
                    <div
                      key={i}
                      className="px-3.5 py-2 flex justify-between text-[#63716E] border-b border-[#EBECEB] bg-white"
                    >
                      <span>{b.label}</span>
                      <span className="font-bold text-[#203430]">${b.amount}</span>
                    </div>
                  ))}

                  {/* Total Monthly Value */}
                  <div className="px-3.5 py-3 flex justify-between items-center bg-[#F7F7F7] font-bold text-[#203430]">
                    <span>Total Monthly Value</span>
                    <span className="text-sm font-extrabold text-[#203430]">
                      ${totalMonthlyValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status footer for payroll schedule */}
              <div className="pt-3.5 mt-3 border-t border-[#EBECEB] flex items-center justify-between text-[11px] text-[#63716E]">
                <span>Pay Cycle: June 2035</span>
                <span className="font-semibold text-[#0E4D41]">Disbursement Ready</span>
              </div>
            </div>
            ) : (
            <div className="bg-white rounded-2xl p-5 border border-[#EBECEB] shadow-2xs flex-1 flex flex-col items-center justify-center text-center gap-2">
              <ShieldCheck className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-bold text-slate-700">Salary hidden</p>
              <p className="text-xs text-slate-500 max-w-[220px]">
                Your role does not include payroll / salary access for this profile.
              </p>
            </div>
            )}
          </div>
        </div>

        {/* Footer Row matching Screenshot 4 */}
        <div className="pt-6 border-t border-[#EBECEB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#63716E]">
          <div className="flex items-center gap-4">
            <span className="font-bold text-[#203430]">
              Copyright © 2025 Peterdraw
            </span>
            <span
              onClick={() => setToastMessage("Privacy Policy opened.")}
              className="hover:text-[#203430] cursor-pointer"
            >
              Privacy Policy
            </span>
            <span
              onClick={() => setToastMessage("Terms & Conditions opened.")}
              className="hover:text-[#203430] cursor-pointer"
            >
              Term and conditions
            </span>
            <span
              onClick={() => setToastMessage("Contact support: support@teamhub.io")}
              className="hover:text-[#203430] cursor-pointer"
            >
              Contact
            </span>
          </div>

          <div className="flex items-center gap-3 text-[#63716E]">
            <span
              onClick={() => setToastMessage("Facebook link copied.")}
              className="h-6 w-6 rounded-full hover:text-[#203430] flex items-center justify-center cursor-pointer font-bold"
            >
              f
            </span>
            <span
              onClick={() => setToastMessage("X handle copied.")}
              className="hover:text-[#203430] cursor-pointer"
            >
              <XLogo className="h-3 w-3" />
            </span>
            <span
              onClick={() => setToastMessage("Instagram link copied.")}
              className="hover:text-[#203430] cursor-pointer"
            >
              <Instagram className="h-3.5 w-3.5" />
            </span>
            <span
              onClick={() => setToastMessage("YouTube channel copied.")}
              className="hover:text-[#203430] cursor-pointer font-bold text-[10px]"
            >
              yt
            </span>
            <span
              onClick={() => setToastMessage("LinkedIn page copied.")}
              className="hover:text-[#203430] cursor-pointer"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        {/* =========================================================================
            INTERACTIVE MODALS FOR "..." ACTIONS
            ========================================================================= */}
        {modalType && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md p-5 text-left">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-sm text-[#203430]">
                  {modalType === "edit-personal" && "Edit Personal Information"}
                  {modalType === "add-doc" && "Upload Document"}
                  {modalType === "add-note" && "Add Internal Note"}
                  {modalType === "edit-payroll" && "Adjust Base Salary"}
                  {modalType === "log-performance" && "Log Evaluation Score"}
                  {modalType === "log-hours" && "Log Work Timesheet Hours"}
                  {modalType === "log-attendance" && "Mark Attendance Record"}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Edit Personal Info Form */}
              {modalType === "edit-personal" && (
                <form onSubmit={handleSavePersonal} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-[#63716E] block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={editPersonalForm.phone}
                      onChange={(e) =>
                        setEditPersonalForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      className="w-full h-9 px-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#63716E] block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editPersonalForm.email}
                      onChange={(e) =>
                        setEditPersonalForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="w-full h-9 px-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#63716E] block mb-1">
                      Address
                    </label>
                    <textarea
                      rows={2}
                      value={editPersonalForm.address}
                      onChange={(e) =>
                        setEditPersonalForm((f) => ({ ...f, address: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className="px-3.5 py-2 rounded-xl border border-[#E5E6E6] hover:bg-slate-50 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#35BFA3] hover:bg-[#28C2A9] text-white font-bold cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* Upload Document Form */}
              {modalType === "add-doc" && (
                <form onSubmit={handleAddDocument} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-[#63716E] block mb-1">
                      Document Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Employment Contract 2035"
                      value={newDocForm.name}
                      onChange={(e) =>
                        setNewDocForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full h-9 px-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#63716E] block mb-1">
                      File Size
                    </label>
                    <input
                      type="text"
                      value={newDocForm.size}
                      onChange={(e) =>
                        setNewDocForm((f) => ({ ...f, size: e.target.value }))
                      }
                      className="w-full h-9 px-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className="px-3.5 py-2 rounded-xl border border-[#E5E6E6] hover:bg-slate-50 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#35BFA3] hover:bg-[#28C2A9] text-white font-bold cursor-pointer"
                    >
                      Upload File
                    </button>
                  </div>
                </form>
              )}

              {/* Add Internal Note Form */}
              {modalType === "add-note" && (
                <form onSubmit={handleAddNote} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-[#63716E] block mb-1">
                      Note Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Q3 Performance Check-in"
                      value={newNoteForm.title}
                      onChange={(e) =>
                        setNewNoteForm((f) => ({ ...f, title: e.target.value }))
                      }
                      className="w-full h-9 px-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#63716E] block mb-1">
                      Note Details
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Write evaluation or administrative notes here..."
                      value={newNoteForm.desc}
                      onChange={(e) =>
                        setNewNoteForm((f) => ({ ...f, desc: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none resize-none"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className="px-3.5 py-2 rounded-xl border border-[#E5E6E6] hover:bg-slate-50 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#35BFA3] hover:bg-[#28C2A9] text-white font-bold cursor-pointer"
                    >
                      Add Note
                    </button>
                  </div>
                </form>
              )}

              {/* Log Performance Evaluation Form */}
              {modalType === "log-performance" && (
                <form onSubmit={handleLogPerformance} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-[#63716E] block mb-1">
                      Month / Period
                    </label>
                    <select
                      value={newPerfForm.month}
                      onChange={(e) => setNewPerfForm((f) => ({ ...f, month: e.target.value }))}
                      className="w-full h-9 px-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none bg-white font-medium"
                    >
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                        (m) => (
                          <option key={m} value={m}>
                            {m} 2035
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#63716E] block mb-1">
                      Evaluation Score (0% - 100%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={newPerfForm.score}
                      onChange={(e) => setNewPerfForm((f) => ({ ...f, score: e.target.value }))}
                      className="w-full h-9 px-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#63716E] block mb-1">
                      Evaluation Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Exceeded Q2 project deliverables"
                      value={newPerfForm.notes}
                      onChange={(e) => setNewPerfForm((f) => ({ ...f, notes: e.target.value }))}
                      className="w-full h-9 px-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className="px-3.5 py-2 rounded-xl border border-[#E5E6E6] hover:bg-slate-50 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#35BFA3] hover:bg-[#28C2A9] text-white font-bold cursor-pointer"
                    >
                      Record Score
                    </button>
                  </div>
                </form>
              )}

              {/* Log Working Hours Form */}
              {modalType === "log-hours" && (
                <form onSubmit={handleLogHours} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-[#63716E] block mb-1">
                      Day of Week
                    </label>
                    <select
                      value={newHoursForm.day}
                      onChange={(e) => setNewHoursForm((f) => ({ ...f, day: e.target.value }))}
                      className="w-full h-9 px-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none bg-white font-medium"
                    >
                      <option value="M">Monday (M)</option>
                      <option value="T">Tuesday (T)</option>
                      <option value="W">Wednesday (W)</option>
                      <option value="T">Thursday (T)</option>
                      <option value="F">Friday (F)</option>
                      <option value="S">Saturday (S)</option>
                      <option value="S">Sunday (S)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[#63716E] block mb-1">
                        Hours
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={newHoursForm.hours}
                        onChange={(e) => setNewHoursForm((f) => ({ ...f, hours: e.target.value }))}
                        className="w-full h-9 px-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[#63716E] block mb-1">
                        Minutes
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        step="15"
                        value={newHoursForm.minutes}
                        onChange={(e) => setNewHoursForm((f) => ({ ...f, minutes: e.target.value }))}
                        className="w-full h-9 px-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none font-bold"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className="px-3.5 py-2 rounded-xl border border-[#E5E6E6] hover:bg-slate-50 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#35BFA3] hover:bg-[#28C2A9] text-white font-bold cursor-pointer"
                    >
                      Save Timesheet
                    </button>
                  </div>
                </form>
              )}

              {/* Mark Attendance Day Form */}
              {modalType === "log-attendance" && (
                <form onSubmit={handleLogAttendance} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-[#63716E] block mb-1">
                      Day of Month (June 2035)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={newAttendanceForm.day}
                      onChange={(e) => setNewAttendanceForm((f) => ({ ...f, day: Number(e.target.value) }))}
                      className="w-full h-9 px-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#63716E] block mb-1">
                      Attendance Status
                    </label>
                    <select
                      value={newAttendanceForm.status}
                      onChange={(e) => setNewAttendanceForm((f) => ({ ...f, status: e.target.value }))}
                      className="w-full h-9 px-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none bg-white font-medium"
                    >
                      <option value="Present">Present (Light Green)</option>
                      <option value="Late">Late (Teal)</option>
                      <option value="On Leave">On Leave (Dark Green)</option>
                      <option value="Absent">Absent (Light Gray)</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className="px-3.5 py-2 rounded-xl border border-[#E5E6E6] hover:bg-slate-50 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#35BFA3] hover:bg-[#28C2A9] text-white font-bold cursor-pointer"
                    >
                      Save Attendance
                    </button>
                  </div>
                </form>
              )}

              {/* Adjust Payroll Salary */}
              {modalType === "edit-payroll" && (
                <form onSubmit={handleSavePayroll} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-[#63716E] block mb-1">
                      Base Salary (USD/month)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3,200"
                      value={payrollSalary}
                      onChange={(e) => setPayrollSalary(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-[#E5E6E6] focus:border-[#35BFA3] outline-none font-bold"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-[#63716E]">
                    Standard monthly allowances ($300 total) and corporate benefits ($355 total) will be automatically calculated.
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className="px-3.5 py-2 rounded-xl border border-[#E5E6E6] hover:bg-slate-50 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#35BFA3] hover:bg-[#28C2A9] text-white font-bold cursor-pointer"
                    >
                      Save Salary Adjustment
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
