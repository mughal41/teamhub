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
  Calendar as CalendarIcon,
  CheckCircle,
  X,
  Umbrella,
  Stethoscope,
  Briefcase,
  Users,
  Smile,
  Palmtree,
  UserCheck,
  Clock,
  Edit2,
  MessageSquare,
  CheckCircle2,
  Plus,
  Download
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell
} from "recharts";
import { cn } from "@/src/lib/utils";

export interface LeaveActivityItem {
  name: string;
  id: string;
  role: string;
  dept: string;
  type: string;
  submit: string;
  period: string;
  duration: string;
  reason: string;
  status: string;
  avatar: string;
  remainingQuota?: number;
  totalQuota?: number;
  sickLeavesRemaining?: number;
  casualLeavesRemaining?: number;
  annualLeavesRemaining?: number;
  otherLeavesRemaining?: number;
  startDate?: string;
  endDate?: string;
  forwardedTo?: string;
  forwardedStatus?: 'Pending' | 'Approved' | 'Rejected';
  comment?: string;
}

const managersList = [
  { name: "Marcus Aurelius", role: "Product Director" },
  { name: "Jane Doe", role: "HR Lead" },
  { name: "John Smith", role: "Operations Head" },
];

const leaveOverviewData = [
  { day: 'Mon', count: 4 },
  { day: 'Tue', count: 6 },
  { day: 'Wed', count: 5 },
  { day: 'Thu', count: 7 },
  { day: 'Fri', count: 6 },
];

const leaveDistribution = [
  { name: 'Annual Leave', value: 3, percentage: 50, color: '#0E4D41' },
  { name: 'Sick Leave', value: 2, percentage: 33.3, color: '#35BFA3' },
  { name: 'Other Leaves', value: 1, percentage: 16.7, color: '#E4F2D3' },
  { name: 'Casual Leave', value: 0, percentage: 0, color: '#E5E6E6' },
];

const employeeLeaves = [
  { name: "Lina Armand", type: "Sick Leave", period: "20-22 June 2035", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Jacob Yuen", type: "Annual Leave", period: "17-21 June 2035", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Anya Rodriguez", type: "Other Leave", period: "19 June 2035", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
];

const leaveActivity = [
  { name: "Lina Armand", id: "EMP-0312", role: "Lab Analyst", dept: "R&D", type: "Sick Leave", submit: "18 Jun 2035", period: "20-22 June 2035", duration: "3 Days", reason: "Doctor's note attached", status: "Approved", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Jacob Yuen", id: "EMP-0115", role: "Site Supervisor", dept: "Operations", type: "Annual Leave", submit: "10 Jun 2035", period: "17-21 June 2035", duration: "5 Days", reason: "Family trip", status: "Approved", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Anya Rodriguez", id: "EMP-0275", role: "Graphic Designer", dept: "Marketing", type: "Other Leave", submit: "17 Jun 2035", period: "19 Jun 2035", duration: "1 Day", reason: "Personal matter", status: "Pending", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Olivia Mason", id: "EMP-0234", role: "Marketing", dept: "Executive Marketing", type: "Annual Leave", submit: "02 Jun 2035", period: "05-07 June 2035", duration: "3 Days", reason: "Conference attendance", status: "Approved", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Sara Kim", id: "EMP-0356", role: "Customer Support", dept: "Customer Service", type: "Sick Leave", submit: "14 Jun 2035", period: "15-16 Jun 2035", duration: "2 Days", reason: "Fever", status: "Approved", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Daniel Cheung", id: "EMP-0291", role: "Compliance Specialist", dept: "Operations", type: "Annual Leave", submit: "01 Jun 2035", period: "10-12 Jun 2035", duration: "3 Days", reason: "Holiday", status: "Pending", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Mia Torres", id: "EMP-0289", role: "HR Officer", dept: "Human Resources", type: "Annual Leave", submit: "06 Jun 2035", period: "09-10 Jun 2035", duration: "2 Days", reason: "Personal retreat", status: "Approved", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Ethan Ray", id: "EMP-0178", role: "UI Designer", dept: "Product Design", type: "Casual Leave", submit: "05 Jun 2035", period: "07 Jun 2035", duration: "1 Day", reason: "—", status: "Rejected", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Farah Nabila", id: "EMP-0320", role: "Customer Experience Lead", dept: "Customer Service", type: "Sick Leave", submit: "11 Jun 2035", period: "12 Jun 2035", duration: "1 Day", reason: "Headache", status: "Approved", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
  { name: "Kelvin Yu", id: "EMP-0159", role: "Training Coordinator", dept: "HR", type: "Other Leave", submit: "13 Jun 2035", period: "14 Jun 2035", duration: "1 Day", reason: "Volunteer program", status: "Rejected", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
];

const PIE_COLORS = ['#0E4D41', '#35BFA3', '#E4F2D3', '#E5E6E6'];

export default function LeaveManagementPage() {
  // Active states for Leave Activity List
  const [activities, setActivities] = React.useState<LeaveActivityItem[]>(() => 
    leaveActivity.map((activity, index) => {
      const sickLeavesRemaining = [2, 5, 4, 8, 3, 6, 4, 7, 1, 5][index % 10];
      const casualLeavesRemaining = [3, 4, 1, 5, 2, 4, 3, 2, 2, 4][index % 10];
      const annualLeavesRemaining = [8, 12, 4, 15, 6, 13, 10, 7, 5, 11][index % 10];
      const otherLeavesRemaining = [3, 5, 2, 4, 2, 3, 4, 2, 1, 4][index % 10];

      // Let's set start and end dates formatted as YYYY-MM-DD
      let startDate = "2035-06-15";
      let endDate = "2035-06-17";
      if (activity.period.includes("20-22 June")) {
        startDate = "2035-06-20";
        endDate = "2035-06-22";
      } else if (activity.period.includes("17-21 June")) {
        startDate = "2035-06-17";
        endDate = "2035-06-21";
      } else if (activity.period.includes("19 June") || activity.period.includes("19 Jun")) {
        startDate = "2035-06-19";
        endDate = "2035-06-19";
      } else if (activity.period.includes("05-07 June")) {
        startDate = "2035-06-05";
        endDate = "2035-06-07";
      } else if (activity.period.includes("15-16 Jun")) {
        startDate = "2035-06-15";
        endDate = "2035-06-16";
      } else if (activity.period.includes("10-12 Jun")) {
        startDate = "2035-06-10";
        endDate = "2035-06-12";
      } else if (activity.period.includes("09-10 Jun")) {
        startDate = "2035-06-09";
        endDate = "2035-06-10";
      } else if (activity.period.includes("07 Jun")) {
        startDate = "2035-06-07";
        endDate = "2035-06-07";
      } else if (activity.period.includes("12 Jun")) {
        startDate = "2035-06-12";
        endDate = "2035-06-12";
      } else if (activity.period.includes("14 Jun")) {
        startDate = "2035-06-14";
        endDate = "2035-06-14";
      }

      return {
        ...activity,
        remainingQuota: annualLeavesRemaining,
        totalQuota: 20,
        sickLeavesRemaining,
        casualLeavesRemaining,
        annualLeavesRemaining,
        otherLeavesRemaining,
        startDate,
        endDate,
        forwardedTo: "",
        forwardedStatus: undefined,
        comment: ""
      };
    })
  );

  const [userRole, setUserRole] = React.useState<"HR" | "Employee">(() => {
    return (localStorage.getItem("viewing-role") as "HR" | "Employee") || "HR";
  });

  React.useEffect(() => {
    const handleStorageChange = () => {
      const current = (localStorage.getItem("viewing-role") as "HR" | "Employee") || "HR";
      setUserRole(current);
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("roleChanged", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("roleChanged", handleStorageChange);
    };
  }, []);

  const changeUserRole = (role: "HR" | "Employee") => {
    localStorage.setItem("viewing-role", role);
    setUserRole(role);
    window.dispatchEvent(new Event("roleChanged"));
    showToast(`Session role context switched to: ${role === 'HR' ? 'HR / Admin' : 'Regular Employee'}`, 'info');
  };

  const [selectedActivity, setSelectedActivity] = React.useState<LeaveActivityItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  
  // Custom states for modal switching & Create/Edit requests (matching design screenshots)
  const [modalSubMode, setModalSubMode] = React.useState<'details' | 'approval'>('details');
  const [createLeaveType, setCreateLeaveType] = React.useState("Annual Leave");
  const [createLeaveReason, setCreateLeaveReason] = React.useState("");
  const [createStartDay, setCreateStartDay] = React.useState<number>(12);
  const [createEndDay, setCreateEndDay] = React.useState<number>(14);
  const [createStartTime, setCreateStartTime] = React.useState("09:00 AM");
  const [createEndTime, setCreateEndTime] = React.useState("06:00 PM");
  const [createAttachments, setCreateAttachments] = React.useState<Array<{ name: string; size: string }>>([
    { name: "medical_report_signed.pdf", size: "1.4 MB" }
  ]);
  const [isFileDragging, setIsFileDragging] = React.useState(false);
  const [isEditingExisting, setIsEditingExisting] = React.useState(false);
  const [editRequestOriginalId, setEditRequestOriginalId] = React.useState<string>("");
  
  // Modal Fields
  const [editType, setEditType] = React.useState("");
  const [editPeriod, setEditPeriod] = React.useState("");
  const [editDuration, setEditDuration] = React.useState("");
  const [editReason, setEditReason] = React.useState("");
  
  // Read-only individual category quotas for the currently selected employee in detail view
  const [sickLeavesRemaining, setSickLeavesRemaining] = React.useState(5);
  const [casualLeavesRemaining, setCasualLeavesRemaining] = React.useState(3);
  const [annualLeavesRemaining, setAnnualLeavesRemaining] = React.useState(10);
  const [otherLeavesRemaining, setOtherLeavesRemaining] = React.useState(2);

  // Calendar dates for period range selection
  const [startDate, setStartDate] = React.useState("2035-06-20");
  const [endDate, setEndDate] = React.useState("2035-06-22");

  const [forwardTo, setForwardTo] = React.useState("");
  const [commentText, setCommentText] = React.useState("");

  // Search/Filter states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState("All");
  const [filterStatus, setFilterStatus] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("Name");

  // Floating notification toast state
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToast(current => current?.message === message ? null : current);
    }, 4000);
  };

  // Interactive drop down controls
  const [isOverviewMenuOpen, setIsOverviewMenuOpen] = React.useState(false);
  const [overviewRange, setOverviewRange] = React.useState<"This Week" | "This Month" | "This Year">("This Week");

  const [isCalendarMenuOpen, setIsCalendarMenuOpen] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<number>(7);
  const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = React.useState(false);
  const [holidayDayInput, setHolidayDayInput] = React.useState<string>("18");
  const [holidayNameInput, setHolidayNameInput] = React.useState<string>("Corporate Field Day");
  const [publicHolidays, setPublicHolidays] = React.useState<Array<{ day: number; name: string }>>([
    { day: 1, name: "International Labors Day" },
    { day: 15, name: "Mid-Year Festival" }
  ]);

  const [isEmpLeavesMenuOpen, setIsEmpLeavesMenuOpen] = React.useState(false);
  const [isAddLeaveModalOpen, setIsAddLeaveModalOpen] = React.useState(false);

  // New manual leave request fields
  const [newLeaveName, setNewLeaveName] = React.useState("");
  const [newLeaveID, setNewLeaveID] = React.useState("");
  const [newLeaveRole, setNewLeaveRole] = React.useState("");
  const [newLeaveDept, setNewLeaveDept] = React.useState("");
  const [newLeaveType, setNewLeaveType] = React.useState("Annual Leave");
  const [newLeaveStart, setNewLeaveStart] = React.useState("2035-06-25");
  const [newLeaveEnd, setNewLeaveEnd] = React.useState("2035-06-27");
  const [newLeaveReason, setNewLeaveReason] = React.useState("");

  const [isTypesMenuOpen, setIsTypesMenuOpen] = React.useState(false);
  const [isAllotmentModalOpen, setIsAllotmentModalOpen] = React.useState(false);
  
  // Custom yearly allotments state
  const [allotmentSick, setAllotmentSick] = React.useState(15);
  const [allotmentCasual, setAllotmentCasual] = React.useState(10);
  const [allotmentAnnual, setAllotmentAnnual] = React.useState(20);
  const [allotmentOther, setAllotmentOther] = React.useState(15);

  const statsApprovedCount = React.useMemo(() => {
    const approved = activities.filter(act => act.status === "Approved");
    const annual = approved.filter(act => act.type === "Annual Leave").length;
    const sick = approved.filter(act => act.type === "Sick Leave").length;
    const other = approved.filter(act => act.type === "Other Leave").length;
    const casual = approved.filter(act => act.type === "Casual Leave").length;
    const totalToday = activities.filter(act => {
      if (act.status !== "Approved") return false;
      return "2035-06-07" >= (act.startDate || "") && "2035-06-07" <= (act.endDate || "");
    }).length;

    return { annual, sick, other, casual, totalToday, totalApproved: approved.length };
  }, [activities]);

  const selectedTypeBalance = React.useMemo(() => {
    switch (createLeaveType) {
      case "Annual Leave":
        return { balance: "12.5 Days", progress: 62.5, type: "Annual" };
      case "Sick Leave":
        return { balance: "5.0 Days", progress: 100, type: "Sick" };
      case "Casual Leave":
        return { balance: "2.0 Days", progress: 25, type: "Casual" };
      case "Other Leave":
      default:
        return { balance: "3.5 Days", progress: 35, type: "Other" };
    }
  }, [createLeaveType]);

  const leaveDistributionData = React.useMemo(() => {
    const approved = activities.filter(act => act.status === "Approved");
    const totalApproved = approved.length || 1; 

    const annual = approved.filter(act => act.type === "Annual Leave").length;
    const sick = approved.filter(act => act.type === "Sick Leave").length;
    const casual = approved.filter(act => act.type === "Casual Leave").length;
    const other = approved.filter(act => act.type === "Other Leave").length;

    return [
      { name: 'Annual Leave', value: annual, percentage: Math.round((annual / totalApproved) * 100), color: '#0E4D41' },
      { name: 'Sick Leave', value: sick, percentage: Math.round((sick / totalApproved) * 100), color: '#35BFA3' },
      { name: 'Other Leaves', value: other, percentage: Math.round((other / totalApproved) * 100), color: '#E4F2D3' },
      { name: 'Casual Leave', value: casual, percentage: Math.round((casual / totalApproved) * 100), color: '#E5E6E6' },
    ];
  }, [activities]);

  const dynamicOverviewData = React.useMemo(() => {
    if (overviewRange === "This Week") {
      return [
        { day: 'Mon', count: 4 },
        { day: 'Tue', count: 6 },
        { day: 'Wed', count: statsApprovedCount.totalToday + 3 },
        { day: 'Thu', count: 7 },
        { day: 'Fri', count: 6 },
      ];
    } else if (overviewRange === "This Month") {
      return [
        { day: 'Wk 1', count: 12 },
        { day: 'Wk 2', count: 15 },
        { day: 'Wk 3', count: statsApprovedCount.totalApproved + 10 },
        { day: 'Wk 4', count: 9 },
      ];
    } else {
      return [
        { day: 'Jan', count: 22 },
        { day: 'Feb', count: 18 },
        { day: 'Mar', count: 30 },
        { day: 'Apr', count: 14 },
        { day: 'May', count: 25 },
        { day: 'Jun', count: statsApprovedCount.totalApproved + 20 },
        { day: 'Jul', count: 10 },
        { day: 'Aug', count: 12 },
        { day: 'Sep', count: 15 },
        { day: 'Oct', count: 8 },
        { day: 'Nov', count: 20 },
        { day: 'Dec', count: 18 },
      ];
    }
  }, [overviewRange, statsApprovedCount]);

  const dynamicEmployeeLeavesAtSelectedDay = React.useMemo(() => {
    const dayStr = selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
    const dateStr = `2035-06-${dayStr}`;
    const results = activities.filter(act => {
      if (act.status !== "Approved") return false;
      if (!act.startDate || !act.endDate) return false;
      return dateStr >= act.startDate && dateStr <= act.endDate;
    });
    
    if (results.length === 0) {
      return activities.filter(act => act.status === "Approved").slice(0, 3);
    }
    return results;
  }, [activities, selectedDay]);

  // Automatically compute period string & duration whenever raw calendar dates change
  React.useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const finalDays = diffDays > 0 ? diffDays : 1;
        setEditDuration(`${finalDays} Day${finalDays > 1 ? "s" : ""}`);
        
        // Format period string cleanly (e.g. "20 Jun 2035 to 22 Jun 2035" or "19 Jun 2035")
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        const startStr = start.toLocaleDateString('en-US', options);
        const endStr = end.toLocaleDateString('en-US', options);
        
        if (startDate === endDate) {
          setEditPeriod(startStr);
        } else {
          setEditPeriod(`${startStr} to ${endStr}`);
        }
      }
    }
  }, [startDate, endDate]);

  // Filtered and sorted activities
  const filteredActivities = React.useMemo(() => {
    return activities.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.dept && item.dept.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = filterType === "All" || item.type === filterType;
      const matchesStatus = filterStatus === "All" || item.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [activities, searchQuery, filterType, filterStatus]);

  const sortedActivities = React.useMemo(() => {
    return [...filteredActivities].sort((a, b) => {
      if (sortBy === "Name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "Submit Date") {
        return new Date(b.submit).getTime() - new Date(a.submit).getTime();
      } else if (sortBy === "Duration") {
        const durA = parseInt(a.duration) || 0;
        const durB = parseInt(b.duration) || 0;
        return durB - durA;
      }
      return 0;
    });
  }, [filteredActivities, sortBy]);

  // Modal Handlers
  const handleOpenDetailsModal = (activity: LeaveActivityItem) => {
    setSelectedActivity(activity);
    setEditType(activity.type);
    setEditPeriod(activity.period);
    setEditDuration(activity.duration);
    setEditReason(activity.reason);
    
    // Assign specific quotas (read-only)
    setSickLeavesRemaining(activity.sickLeavesRemaining ?? 5);
    setCasualLeavesRemaining(activity.casualLeavesRemaining ?? 3);
    setAnnualLeavesRemaining(activity.annualLeavesRemaining ?? 10);
    setOtherLeavesRemaining(activity.otherLeavesRemaining ?? 2);

    // Date range inputs mapping
    setStartDate(activity.startDate ?? "2035-06-20");
    setEndDate(activity.endDate ?? "2035-06-22");

    setForwardTo(activity.forwardedTo ?? "");
    setCommentText(activity.comment ?? "");
    setIsEditing(false); // ALWAYS open modal as read-only initially!
    setModalSubMode(userRole === 'HR' && activity.status === 'Pending' ? 'approval' : 'details');
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedActivity(null);
    setIsDetailModalOpen(false);
  };

  const handleForwardRequest = () => {
    if (!selectedActivity || !forwardTo) return;
    setActivities(prev => prev.map(item => {
      if (item.id === selectedActivity.id) {
        return {
          ...item,
          forwardedTo: forwardTo,
          forwardedStatus: 'Pending',
          comment: commentText || item.comment
        };
      }
      return item;
    }));
    setSelectedActivity(prev => prev ? {
      ...prev,
      forwardedTo: forwardTo,
      forwardedStatus: 'Pending',
      comment: commentText || prev.comment
    } : null);
  };

  const handleSimulateManagerApproval = () => {
    if (!selectedActivity) return;
    setActivities(prev => prev.map(item => {
      if (item.id === selectedActivity.id) {
        return {
          ...item,
          forwardedStatus: 'Approved',
          comment: "Manager approved leave request for intermediate flow. Ready for HR action."
        };
      }
      return item;
    }));
    setSelectedActivity(prev => prev ? {
      ...prev,
      forwardedStatus: 'Approved',
      comment: "Manager approved leave request for intermediate flow. Ready for HR action."
    } : null);
  };

  const handleUpdateStatus = (newStatus: 'Approved' | 'Rejected') => {
    if (!selectedActivity) return;
    setActivities(prev => prev.map(item => {
      if (item.id === selectedActivity.id) {
        return {
          ...item,
          status: newStatus,
          type: editType,
          period: editPeriod,
          duration: editDuration,
          reason: editReason,
          startDate,
          endDate,
          comment: commentText || item.comment
        };
      }
      return item;
    }));
    setIsDetailModalOpen(false);
    setSelectedActivity(null);
  };

  const handleSaveDrafts = () => {
    if (!selectedActivity) return;
    setActivities(prev => prev.map(item => {
      if (item.id === selectedActivity.id) {
        return {
          ...item,
          type: editType,
          period: editPeriod,
          duration: editDuration,
          reason: editReason,
          startDate,
          endDate,
          comment: commentText || item.comment
        };
      }
      return item;
    }));
    setIsDetailModalOpen(false);
    setSelectedActivity(null);
  };

  return (
    <AppLayout 
      title="Leave Management" 
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Leave Management" }]}
    >
      <div className="space-y-5">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
           <Card className="p-4 border-none rounded-[16px] bg-[#E4F2D3] shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                 <div className="h-6 w-6 rounded-full bg-brand flex items-center justify-center text-white">
                    <CalendarIcon className="h-4 w-4" />
                 </div>
                 <span className="text-[11px] text-[#63716E]">Total On Leave (Today)</span>
              </div>
              <div className="flex items-baseline gap-2">
                 <span className="text-[40px] font-bold text-[#0E4D41] leading-none">
                   {statsApprovedCount.totalToday || 6}
                 </span>
                 <span className="text-[12px] text-[#0E4D41]">Employees</span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                 <div className="bg-white px-1.5 py-0.5 rounded-[10px]">
                    <span className="text-[11px] font-bold text-[#0E4D41]">
                      {Math.round(((statsApprovedCount.totalToday || 6) / 128) * 1000) / 10}%
                    </span>
                 </div>
                 <span className="text-[10px] text-[#63716E]">of total workforce (128)</span>
              </div>
           </Card>

           {[
             { label: 'Annual Leave', val: statsApprovedCount.annual, percentage: statsApprovedCount.totalApproved ? `${Math.round((statsApprovedCount.annual / statsApprovedCount.totalApproved) * 100)}%` : '50%', icon: Umbrella },
             { label: 'Sick Leave', val: statsApprovedCount.sick, percentage: statsApprovedCount.totalApproved ? `${Math.round((statsApprovedCount.sick / statsApprovedCount.totalApproved) * 100)}%` : '33%', icon: Stethoscope },
             { label: 'Other Leaves', val: statsApprovedCount.other + statsApprovedCount.casual, percentage: statsApprovedCount.totalApproved ? `${Math.round(((statsApprovedCount.other + statsApprovedCount.casual) / statsApprovedCount.totalApproved) * 100)}%` : '17%', icon: Palmtree },
           ].map(stat => (
             <Card key={stat.label} className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                   <div className="h-6 w-6 rounded-full bg-[#F7F7F7] flex items-center justify-center">
                      <stat.icon className="h-4 w-4 text-brand" />
                   </div>
                   <span className="text-[11px] text-[#63716E]">{stat.label}</span>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-[40px] font-bold text-[#0E4D41] leading-none">{stat.val}</span>
                   <span className="text-[12px] text-[#63716E]">Employees</span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                   <div className="bg-[#E4F2D3] px-1.5 py-0.5 rounded-[10px]">
                      <span className="text-[11px] font-bold text-[#0E4D41]">{stat.percentage}</span>
                   </div>
                   <span className="text-[10px] text-[#63716E]">of current active logs</span>
                </div>
             </Card>
           ))}
        </div>

        {/* Middle row: Overview, Calendar, Leaves, Types with custom proportional columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">
           {/* 1. Leave Overview */}
           <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col h-[320px] md:col-span-1 xl:col-span-4">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[16px] font-bold text-[#203430]">Leave Overview</h3>
                 <div className="relative">
                    <button 
                      onClick={() => setIsOverviewMenuOpen(!isOverviewMenuOpen)}
                      className="flex items-center gap-1.5 bg-[#F7F7F7] hover:bg-[#E5E6E6]/60 transition-all px-3 py-1.5 rounded-[8px] text-[12px] font-extrabold text-[#203430] border border-slate-200/40"
                    >
                       {overviewRange} <ChevronDown className="h-3.5 w-3.5 text-[#63716E]" />
                    </button>
                    {isOverviewMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setIsOverviewMenuOpen(false)} />
                        <ul className="absolute right-0 mt-1 w-36 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-30 text-[11px] font-bold text-slate-700">
                          {["This Week", "This Month", "This Year"].map((range) => (
                            <li 
                              key={range}
                              className={cn(
                                "px-3 py-2 hover:bg-[#E4F2D3] hover:text-[#0E4D41] cursor-pointer transition-colors",
                                overviewRange === range && "bg-[#E4F2D3] text-[#0E4D41]"
                              )}
                              onClick={() => {
                                setOverviewRange(range as any);
                                setIsOverviewMenuOpen(false);
                                showToast(`Overview switched to ${range}`);
                              }}
                            >
                              {range}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                 </div>
              </div>
              <div className="flex-1 min-h-0">
                 <ResponsiveContainer width="100%" height={236}>
                    <AreaChart data={dynamicOverviewData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                       <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#E4F2D3" stopOpacity={0.8}/>
                             <stop offset="95%" stopColor="#E4F2D3" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#63716E' }} 
                        dy={10}
                       />
                       <YAxis hide />
                       <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(14, 77, 65, 0.1)' }}
                        itemStyle={{ fontSize: '10px' }}
                        labelStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                       />
                       <Area type="monotone" dataKey="count" stroke="#35BFA3" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           {/* Calendar and Employee Leaves/Types */}
           <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col h-[320px] justify-between md:col-span-1 xl:col-span-3">
              {/* Calendar Section */}
              <div className="flex-1 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                       <span className="text-[18px] font-bold text-[#203430]">June 2035</span>
                       <ChevronDown className="h-4 w-4 text-[#63716E]" />
                    </div>
                    <div className="flex gap-2">
                       <button className="p-2 bg-[#E4F2D3] rounded-[8px] text-[#203430] hover:bg-brand hover:text-white transition-all"><ChevronLeft className="h-4 w-4" /></button>
                       <button className="p-2 bg-[#E4F2D3] rounded-[8px] text-[#203430] hover:bg-brand hover:text-white transition-all"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                 </div>
                 <div className="grid grid-cols-7 gap-y-2 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                       <span key={`${d}-${i}`} className="text-[14px] text-[#63716E] mb-2">{d}</span>
                    ))}
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                       const isToday = day === 7;
                       const isPublic = [1, 15].includes(day);
                       const isLeave = [17, 18, 19, 20, 21, 22].includes(day); const isSelected = day === selectedDay;
                       return (
                        <button key={day} onClick={() => { setSelectedDay(day); showToast(`Viewing active leaves for June ${day}`); }} className="h-6 w-6 mx-auto relative flex items-center justify-center cursor-pointer transition-all hover:scale-105">
                           <div className={cn(
                             "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-semibold z-10 transition-all", isSelected ? "ring-2 ring-brand ring-offset-1 font-bold scale-110" : "",
                             isToday ? "bg-[#E63D4B] text-white" : 
                             isLeave ? "bg-[#35BFA3] text-white" :
                             isPublic ? "bg-[#203430] text-white" : "text-[#203430]"
                           )}>
                              {day}
                           </div>
                        </button>
                       );
                    })}
                 </div>
                 <div className="flex gap-4 pt-2">
                    <div className="flex items-center gap-1.5">
                       <div className="h-3 w-3 rounded-full bg-brand" />
                       <span className="text-[11px] text-[#63716E]">Leave</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <div className="h-3 w-3 rounded-full bg-[#E63D4B]" />
                       <span className="text-[11px] text-[#63716E]">Public Holiday</span>
                    </div>
                 </div>
              </div>

              </Card>

            {/* 3. Employee Leaves Card */}
            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col h-[320px] md:col-span-1 xl:col-span-3">

              {/* Employee Leaves List */}
              <div className="flex-1 space-y-4 flex flex-col">
                 <div className="flex items-center justify-between font-bold">
                    <div>
                       <h3 className="text-[15px] font-black text-[#203430]">Employee Leaves</h3>
                       <p className="text-[9px] text-[#63716E] font-medium leading-none mt-1">Viewing June {selectedDay}</p>
                    </div>
                    <div className="relative">
                       <button 
                         onClick={() => setIsEmpLeavesMenuOpen(!isEmpLeavesMenuOpen)}
                         className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                         title="Employee Leaves Actions"
                       >
                         <MoreHorizontal className="h-4 w-4 text-[#63716E]" />
                       </button>
                       {isEmpLeavesMenuOpen && (
                         <>
                           <div className="fixed inset-0 z-20" onClick={() => setIsEmpLeavesMenuOpen(false)} />
                           <ul className="absolute right-0 mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-30 text-[11px] font-bold text-slate-700">
                             <li 
                               className="px-3.5 py-2 hover:bg-[#E4F2D3] hover:text-[#0E4D41] cursor-pointer flex items-center gap-2 transition-colors"
                               onClick={() => {
                                 setIsEmpLeavesMenuOpen(false);
                                 setIsAddLeaveModalOpen(true);
                               }}
                             >
                               <Plus className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                               Request New Leave
                             </li>
                             <li 
                               className="px-3.5 py-2 hover:bg-[#E4F2D3] hover:text-[#0E4D41] cursor-pointer flex items-center gap-2 transition-colors"
                               onClick={() => {
                                 setIsEmpLeavesMenuOpen(false);
                                 showToast("Spreadsheet compiled! Downloaded leave_log_june2035.xlsx.");
                               }}
                             >
                               <Download className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                               Export Leaves Excel
                             </li>
                             <li 
                               className="px-3.5 py-2 hover:bg-[#E4F2D3] hover:text-[#0E4D41] cursor-pointer flex items-center gap-2 transition-colors"
                               onClick={() => {
                                 setIsEmpLeavesMenuOpen(false);
                                 setActivities(prev => prev.map(item => item.status === 'Pending' ? { ...item, status: 'Approved' } : item));
                                 showToast("All pending leave applications approved concurrently!");
                               }}
                             >
                               <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                               Bulk Approve Pending
                             </li>
                           </ul>
                         </>
                       )}
                    </div>
                 </div>
                 <div className="flex-1 space-y-1.5 min-h-0 overflow-y-auto">
                    {dynamicEmployeeLeavesAtSelectedDay.length > 0 ? (
                      dynamicEmployeeLeavesAtSelectedDay.map((e, index) => (
                         <div 
                            key={e.id + '-' + index} 
                            className="flex items-center gap-2.5 p-2 bg-[#F7F7F7] hover:bg-[#E4F2D3]/20 transition-all rounded-[10px] border border-slate-100/55 cursor-pointer" 
                            onClick={() => handleOpenDetailsModal(e)}
                         >
                            <img src={e.avatar} className="h-7 w-7 rounded-full object-cover shrink-0 border border-emerald-500/20" referrerPolicy="no-referrer" />
                            <div className="flex-1 min-w-0">
                               <p className="text-[11px] font-extrabold text-[#203430] leading-none mb-1 truncate">{e.name}</p>
                               <div className="flex items-center gap-1 flex-wrap">
                                  <span className="text-[9px] font-bold text-teal-800 bg-[#E4F2D3] px-1 rounded">{e.type}</span>
                                  <span className="text-[9px] text-[#63716E] truncate">{e.duration} ({e.period})</span>
                                </div>
                            </div>
                         </div>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                         <span className="text-[11px] text-[#63716E] font-medium font-mono">No active leaves today</span>
                      </div>
                    )}
                 </div>
              </div>
           </Card>

           {/* Leave Types Donut */}
           <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col h-[320px] justify-between md:col-span-1 xl:col-span-2">
              <div className="flex items-center justify-between">
                 <h3 className="text-[16px] font-bold text-[#203430]">Leave Types</h3>
                 <div className="relative">
                    <button 
                      onClick={() => setIsTypesMenuOpen(!isTypesMenuOpen)}
                      className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4 text-[#63716E]" />
                    </button>
                    {isTypesMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setIsTypesMenuOpen(false)} />
                        <ul className="absolute right-0 mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-30 text-[11px] font-bold text-slate-700">
                          <li 
                            className="px-3.5 py-2 hover:bg-[#E4F2D3] hover:text-[#0E4D41] cursor-pointer flex items-center gap-2 transition-colors"
                            onClick={() => {
                              setIsTypesMenuOpen(false);
                              setIsAllotmentModalOpen(true);
                            }}
                          >
                            <svg className="h-3.5 w-3.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Edit Yearly Allotments
                          </li>
                          <li 
                            className="px-3.5 py-2 hover:bg-[#E4F2D3] hover:text-[#0E4D41] cursor-pointer flex items-center gap-2 transition-colors"
                            onClick={() => {
                              setIsTypesMenuOpen(false);
                              showToast("Leave distribution summary downloaded successfully.");
                            }}
                          >
                            <Download className="h-3.5 w-3.5 text-indigo-500" />
                            Download Distribution RP
                          </li>
                        </ul>
                      </>
                    )}
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="relative shrink-0 flex items-center justify-center">
                    <PieChart width={110} height={110}>
                       <Pie
                         data={leaveDistributionData}
                         cx="50%"
                         cy="50%"
                         innerRadius={36}
                         outerRadius={50}
                         paddingAngle={3}
                         dataKey="value"
                         stroke="none"
                       >
                         {leaveDistributionData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                         ))}
                       </Pie>
                    </PieChart>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-[18px] font-black text-[#0E4D41] leading-none">
                         {statsApprovedCount.totalApproved || 6}
                       </span>
                       <span className="text-[8px] text-[#63716E] font-bold">Approved</span>
                    </div>
                 </div>
                 <div className="flex-1 space-y-1 text-[11px] font-bold min-w-0">
                    {leaveDistributionData.slice(0, 4).map((item, i) => (
                       <div key={item.name} className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                             <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                             <span className="text-[#203430] truncate text-[10px]">{item.name}</span>
                          </div>
                          <span className="text-[#63716E] shrink-0 text-[10px]">{item.percentage}%</span>
                       </div>
                    ))}
                 </div>
              </div>
           </Card>
        </div>

        {/* Leave Activity Table Card */}
        <Card className="border-none rounded-[16px] bg-white shadow-sm overflow-hidden p-0 flex flex-col min-h-[708px]">
           <div className="p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-50">
              <div>
                 <h2 className="text-[16px] font-bold text-[#203430]">Leave Activity</h2>
                 <p className="text-[11px] text-[#63716E] mt-1">Click on any row to open the details modal (Approve, Reject, Comment, Forward, or edit Leave request details)</p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
                 <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#63716E]" />
                    <input 
                      type="text" 
                      placeholder="Search employee, ID, role..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-1.5 w-full sm:w-[200px] h-[34px] bg-[#F7F7F7] hover:bg-[#E5E6E6]/40 text-[#203430] placeholder:text-[#63716E]/70 rounded-[8px] text-[12px] font-medium outline-none transition-colors border border-transparent focus:border-[#0E4D41]/30"
                    />
                 </div>
                 
                 <div className="grid grid-cols-3 gap-2 w-full sm:w-auto text-[11px] font-bold">
                    <div className="flex items-center gap-1 bg-[#E4F2D3] hover:bg-[#d4eab6] transition-colors rounded-[8px] h-[34px] px-2 border border-emerald-500/10">
                       <span className="text-[9px] font-black text-emerald-800 uppercase shrink-0">Type</span>
                       <select
                         value={filterType}
                         onChange={e => setFilterType(e.target.value)}
                         className="bg-transparent text-[#203430] outline-none border-none cursor-pointer w-full text-center"
                       >
                         <option value="All">All</option>
                         <option value="Sick Leave">Sick</option>
                         <option value="Annual Leave">Annual</option>
                         <option value="Casual Leave">Casual</option>
                         <option value="Other Leave">Other</option>
                       </select>
                    </div>

                    <div className="flex items-center gap-1 bg-[#E4F2D3] hover:bg-[#d4eab6] transition-colors rounded-[8px] h-[34px] px-2 border border-emerald-500/10">
                       <span className="text-[9px] font-black text-emerald-800 uppercase shrink-0">Status</span>
                       <select
                         value={filterStatus}
                         onChange={e => setFilterStatus(e.target.value)}
                         className="bg-transparent text-[#203430] outline-none border-none cursor-pointer w-full text-center"
                       >
                         <option value="All">All</option>
                         <option value="Approved">Approved</option>
                         <option value="Pending">Pending</option>
                         <option value="Rejected">Rejected</option>
                       </select>
                    </div>

                    <div className="flex items-center gap-1 bg-[#E4F2D3] hover:bg-[#d4eab6] transition-colors rounded-[8px] h-[34px] px-2 border border-emerald-500/10">
                       <span className="text-[9px] font-black text-emerald-800 uppercase shrink-0">Sort</span>
                       <select
                         value={sortBy}
                         onChange={e => setSortBy(e.target.value)}
                         className="bg-transparent text-[#203430] outline-none border-none cursor-pointer w-full text-center"
                       >
                         <option value="Name">Name</option>
                         <option value="Submit Date">Date</option>
                         <option value="Duration">Duration</option>
                       </select>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-[#F7F7F7]">
                    <tr>
                       <th className="px-6 py-3 w-10">
                          <div className="h-3 w-3 rounded-[3px] border border-brand bg-brand flex items-center justify-center">
                             <div className="h-[1px] w-1.5 bg-white" />
                          </div>
                       </th>
                       <th className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Name <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Job Title <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Type <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Submit Date <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Period <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Duration <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Reason <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                       <th className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-[#63716E] uppercase">
                             Status <ArrowUpDown className="h-3 w-3" />
                          </div>
                       </th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[#E5E6E6]">
                    {sortedActivities.map((e, i) => (
                      <tr 
                        key={e.id + i} 
                        onClick={() => handleOpenDetailsModal(e)}
                        className={cn(
                          "hover:bg-[#F7F7F7]/70 cursor-pointer transition-colors group", 
                          e.status === 'Approved' ? "bg-emerald-50/10" : e.status === 'Rejected' ? "bg-rose-50/10" : "bg-white"
                        )}
                        title="Click to view full detail, forward, or edit"
                      >
                        <td className="px-6 py-3" onClick={ev => ev.stopPropagation()}>
                           <div className={cn("h-3 w-3 rounded-[3px] border", e.status === 'Approved' ? "bg-brand border-brand flex items-center justify-center" : "bg-[#F7F7F7] border-[#E5E6E6]")}>
                              {e.status === 'Approved' && <div className="h-[1px] w-1.5 bg-white" />}
                           </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                           <div className="flex items-center gap-3">
                              <img src={e.avatar} className="h-8 w-8 rounded-full object-cover shadow-sm bg-brand" referrerPolicy="no-referrer" />
                              <div className="flex flex-col">
                                 <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-bold text-[#203430] leading-none">{e.name}</span>
                                    {e.comment && (
                                       <MessageSquare className="h-3 w-3 text-brand animate-bounce" title={`Remarks: "${e.comment}"`} />
                                    )}
                                 </div>
                                 <span className="text-[10px] text-[#63716E] mt-1 font-bold flex items-center gap-1">
                                    {e.id}
                                    {e.remainingQuota !== undefined && (
                                      <span className="text-[9px] bg-emerald-50 text-emerald-800 px-1 py-0.2 rounded font-extrabold ml-1">
                                        Quota: {e.remainingQuota}/{e.totalQuota}D
                                      </span>
                                    )}
                                 </span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-3">
                           <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-[#203430] leading-none whitespace-nowrap">{e.role}</span>
                              <span className="text-[10px] text-[#63716E] mt-1 font-bold whitespace-nowrap">{e.dept}</span>
                           </div>
                        </td>
                        <td className="px-6 py-3 text-[11px] font-bold text-[#203430]">{e.type}</td>
                        <td className="px-6 py-3 text-[11px] font-bold text-[#63716E]">{e.submit}</td>
                        <td className="px-6 py-3 text-[11px] font-bold text-[#203430]">{e.period}</td>
                        <td className="px-6 py-3 text-[11px] font-bold text-[#203430]">{e.duration}</td>
                        <td className="px-6 py-3">
                           <div className="min-w-[120px] max-w-[200px] p-2 bg-[#F7F7F7] rounded-[4px]">
                              <span className="text-[10px] text-[#203430] truncate block">{e.reason}</span>
                           </div>
                        </td>
                        <td className="px-6 py-3" onClick={ev => ev.stopPropagation()}>
                           {e.status === 'Approved' ? (
                             <div className="flex items-center gap-1 bg-brand px-2 py-1 rounded-[12px] w-fit">
                                <CheckCircle className="h-3 w-3 text-white" />
                                <span className="text-[11px] text-white">Approved</span>
                             </div>
                           ) : e.status === 'Rejected' ? (
                             <div className="flex items-center gap-1 bg-[#E63D4B] px-2 py-1 rounded-[12px] w-fit">
                                <X className="h-3 w-3 text-white" />
                                <span className="text-[11px] text-white">Rejected</span>
                             </div>
                           ) : e.forwardedTo ? (
                             <div className="flex flex-col gap-1">
                                <span className="text-[9px] bg-amber-50 text-amber-800 font-extrabold px-1.5 py-0.5 rounded border border-amber-200 uppercase tracking-tight text-center">
                                   Forwarded
                                </span>
                                <span className="text-[9px] text-[#63716E] font-medium text-center">
                                   To: {e.forwardedTo} ({e.forwardedStatus || 'Pending'})
                                </span>
                                <button 
                                   onClick={() => handleOpenDetailsModal(e)} 
                                   className="text-[10px] text-teal-800 hover:underline font-extrabold text-center block mt-0.5"
                                >
                                   View Decision
                                </button>
                             </div>
                           ) : (
                             <div className="flex items-center gap-1.5">
                                <button 
                                   onClick={() => {
                                     setActivities(prev => prev.map(item => item.id === e.id ? { ...item, status: 'Approved' } : item));
                                   }}
                                   className="flex items-center gap-1 bg-[#E4F2D3] px-2 py-1 rounded-[12px] hover:bg-brand group/btn transition-all"
                                   title="Quick Approve"
                                >
                                   <CheckCircle className="h-3 w-3 text-[#203430] group-hover/btn:text-white" />
                                   <span className="text-[11px] text-[#203430] group-hover/btn:text-white">Approve</span>
                                </button>
                                <button 
                                   onClick={() => {
                                     setActivities(prev => prev.map(item => item.id === e.id ? { ...item, status: 'Rejected' } : item));
                                   }}
                                   className="p-1 bg-[#E4F2D3] rounded-full hover:bg-[#E63D4B] group/btn2 transition-all"
                                   title="Quick Reject"
                                >
                                   <X className="h-3 w-3 text-[#203430] group-hover/btn2:text-white" />
                                </button>
                             </div>
                           )}
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

      {/* Leave detail view & approval switcher modal */}
      {isDetailModalOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm" id="leaveDetailModal">
          <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Leave Application Review</h3>
                <p className="text-xs text-slate-500 font-medium">Verify employee quota and process leave request</p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Employee Quick Info Card */}
              <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60">
                <img 
                  src={selectedActivity.avatar} 
                  alt={selectedActivity.name} 
                  className="h-12 w-12 rounded-lg object-cover border border-slate-200/80 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{selectedActivity.name}</h4>
                    <span className="text-[10px] font-mono tracking-wider text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded font-bold uppercase">{selectedActivity.id}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{selectedActivity.role} • {selectedActivity.dept || "Marketing Team"}</p>
                </div>
              </div>

              {/* Leave Detail Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50/20 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Leave Type</span>
                  <span className="text-xs font-semibold text-slate-800">{selectedActivity.type}</span>
                </div>
                <div className="bg-slate-50/20 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Total Duration</span>
                  <span className="text-xs font-semibold text-slate-800">{selectedActivity.duration}</span>
                </div>
                <div className="bg-slate-50/20 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Period Details</span>
                  <span className="text-xs font-semibold text-slate-800">{selectedActivity.period}</span>
                </div>
                <div className="bg-slate-50/20 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Request Status</span>
                  <div>
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider shadow-none",
                      selectedActivity.status === 'Approved' ? "bg-emerald-50 border-emerald-150 text-emerald-800" :
                      selectedActivity.status === 'Rejected' ? "bg-rose-50 border-rose-150 text-rose-700" :
                      "bg-amber-50 border-amber-150 text-amber-800"
                    )}>
                      {selectedActivity.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Leave Reason Card */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Application Reason</span>
                <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-650 font-medium leading-relaxed italic">
                    "{selectedActivity.reason || "Personal matter"}"
                  </p>
                </div>
              </div>

              {/* Current Quota Balances Card */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Available Balance Quotas</span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-200/40 flex flex-col">
                    <span className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase mb-1">Casual</span>
                    <p className="text-sm font-bold text-slate-800 leading-none">
                      {selectedActivity.casualLeavesRemaining ?? 2} <span className="text-slate-400 font-normal text-[10px]">/ 8D</span>
                    </p>
                  </div>
                  <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-200/40 flex flex-col">
                    <span className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase mb-1">Sick</span>
                    <p className="text-sm font-bold text-slate-800 leading-none">
                      {selectedActivity.sickLeavesRemaining ?? 5} <span className="text-slate-400 font-normal text-[10px]">/ 5D</span>
                    </p>
                  </div>
                  <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-200/40 flex flex-col">
                    <span className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase mb-1">Annual</span>
                    <p className="text-sm font-bold text-slate-800 leading-none">
                      {selectedActivity.annualLeavesRemaining ?? 10} <span className="text-slate-400 font-normal text-[10px]">/ 20D</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Comment Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Decision Remarks / Notes</label>
                <textarea 
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Type any reason, note, or comment regarding your review..."
                  className="w-full h-18 bg-white border border-slate-200 focus:border-slate-350 focus:ring-1 focus:ring-slate-300 rounded-xl p-3 text-xs font-medium outline-none resize-none transition-all"
                />
              </div>

              {/* Forward manager select list */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Delegate review (optional)</label>
                <div className="relative">
                  <select 
                    value={forwardTo}
                    onChange={e => setForwardTo(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-slate-350 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Choose manager to forward...</option>
                    {managersList.map(m => (
                      <option key={m.name} value={m.name}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {selectedActivity.forwardedTo && (
                <div className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200/60 p-3 rounded-xl flex items-center justify-between">
                  <span>
                    Forwarded to manager <strong>{selectedActivity.forwardedTo}</strong> (Status: <strong>{selectedActivity.forwardedStatus || 'Pending'}</strong>)
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Actions footer with high-fidelity side-by-side design */}
            <div className="p-4.5 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3 shrink-0">
              <button 
                onClick={() => {
                  handleUpdateStatus('Rejected');
                  showToast(`Rejected leave request for ${selectedActivity.name}.`, 'error');
                }}
                className="py-2.5 border border-rose-200 bg-white text-rose-600 font-semibold text-xs rounded-xl hover:bg-rose-50 transition-colors cursor-pointer text-center"
              >
                Reject Request
              </button>
              <button 
                onClick={() => {
                  if (forwardTo && selectedActivity.forwardedStatus !== 'Approved') {
                    handleForwardRequest();
                    showToast(`Forwarded review to ${forwardTo}!`);
                  } else {
                    handleUpdateStatus('Approved');
                    showToast(`Approved leave application of ${selectedActivity.name}!`, 'success');
                  }
                }}
                className="py-2.5 bg-brand hover:opacity-95 text-white font-semibold text-xs rounded-xl transition-all shadow-sm cursor-pointer text-center"
              >
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREENSHOT 3: Create / Edit Leave Request Modal */}
      {isAddLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" id="createLeaveRequestModal">
          <div className="bg-white w-full max-w-[840px] rounded-[24px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-md bg-teal-50 text-teal-850 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-teal-750 font-black" />
                </div>
                <h3 className="text-[17px] font-black text-[#203430]">
                  {isEditingExisting ? "Edit Leave Request" : "Create Leave Request"}
                </h3>
              </div>
              <button 
                onClick={() => setIsAddLeaveModalOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Split Grid Content: Left for forms/allotments, Right for calendar date ranges */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column: Form settings and Balance Pill (Span 6) */}
              <div className="md:col-span-6 space-y-6">
                
                {/* Leave Type Selector dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#63716E] tracking-wider uppercase block">Leave Type</label>
                  <div className="relative">
                    <select 
                      value={createLeaveType}
                      onChange={e => setCreateLeaveType(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-teal-500 rounded-xl py-2.5 px-3 text-[12px] font-bold text-[#203430] outline-none appearance-none cursor-pointer"
                    >
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Other Leave">Other Leave</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Available Balance Pill card matching Screenshot 3 perfectly */}
                <div className="border border-slate-100 rounded-xl p-5 bg-gradient-to-br from-emerald-50/10 to-teal-50/20 shadow-sm space-y-3.5 relative">
                  <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-505">
                    <span className="uppercase text-[9px] tracking-wider text-[#63716E]">Available Balance</span>
                    <span className="text-[10px] text-[#63716E] font-medium">Resets on Jan 1, 2035</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-teal-850 leading-none mb-2">{selectedTypeBalance.balance}</h2>
                    {/* Teal styling custom slider scale matching design layout */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-700 h-2 rounded-full transition-all duration-300" style={{ width: `${selectedTypeBalance.progress}%` }} />
                    </div>
                  </div>
                </div>

                {/* Reason for Leave editor */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#63716E] tracking-wider uppercase block">Reason for Leave</label>
                  <textarea 
                    value={createLeaveReason}
                    onChange={e => setCreateLeaveReason(e.target.value)}
                    placeholder="Briefly describe the purpose of your leave..."
                    className="w-full h-[116px] bg-white border border-slate-200 focus:border-teal-500 rounded-xl p-3.5 text-[11px] outline-none resize-none"
                  />
                </div>
              </div>

              {/* Right Column: Interactive June 2035 date selection and calendar (Span 6) */}
              <div className="md:col-span-6 space-y-5">
                
                {/* Date range picker heading and calendar frame layout */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-[#63716E] tracking-wider uppercase block">Date Range</span>
                  <div className="border border-slate-150 rounded-xl p-4 bg-[#FDFDFD] shadow-sm flex flex-col">
                    {/* Month selector line */}
                    <div className="flex items-center justify-between border-b pb-2.5 mb-2.5 border-slate-100/50">
                      <span className="text-[13px] font-black text-[#203430]">June 2035</span>
                      <div className="flex gap-1.5">
                        <button type="button" className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronLeft className="h-4.5 w-4.5" /></button>
                        <button type="button" className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronRight className="h-4.5 w-4.5" /></button>
                      </div>
                    </div>

                    {/* Week Header matching 'M T W T F S S' of mock screenshot */}
                    <div className="grid grid-cols-7 text-center text-[10px] font-black text-[#63716E]/75 mb-1 leading-none uppercase">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((w, index) => (
                        <div key={`${w}-${index}`} className="py-1">{w}</div>
                      ))}
                    </div>

                    {/* Month Days list starting June Friday */}
                    <div className="grid grid-cols-7 gap-y-1 gap-x-1 justify-items-center">
                      {(() => {
                        const days = [];
                        // June 2035 starts on Friday (idx 4 of 'M T W T F S S' Mon=0, Fri=4)
                        for (let i = 0; i < 4; i++) {
                          days.push(<div key={`blank-${i}`} />);
                        }
                        for (let d = 1; d <= 30; d++) {
                          const isStart = d === createStartDay;
                          const isEnd = d === createEndDay;
                          const inRange = d >= Math.min(createStartDay, createEndDay) && d <= Math.max(createStartDay, createEndDay);
                          
                          days.push(
                            <button
                              key={`day-cell-${d}`}
                              type="button"
                              onClick={() => {
                                if (createStartDay === createEndDay) {
                                  if (d < createStartDay) {
                                    setCreateStartDay(d);
                                  } else {
                                    setCreateEndDay(d);
                                  }
                                } else {
                                  setCreateStartDay(d);
                                  setCreateEndDay(d);
                                }
                              }}
                              className={cn(
                                "h-8 w-8 text-[11px] font-black rounded-lg flex items-center justify-center transition-all",
                                isStart || isEnd
                                  ? "bg-[#0E4D41] text-white shadow-sm font-black rounded-full"
                                  : inRange
                                  ? "bg-[#E4F2D3] text-[#0E4D41] hover:bg-[#d6ecb9]"
                                  : "text-[#203430] hover:bg-slate-100 rounded-full"
                              )}
                            >
                              {d}
                            </button>
                          );
                        }
                        return days;
                      })()}
                    </div>

                    {/* Dynamic Selected Date Summary matching Screenshot 3 in bottom of picker */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100/50 flex items-center justify-between text-[11px] font-extrabold text-[#0E4D41]">
                      <span>Selected: <span className="font-semibold text-slate-850">Jun {Math.min(createStartDay, createEndDay)} - Jun {Math.max(createStartDay, createEndDay)}</span></span>
                      <span className="bg-[#E4F2D3] text-teal-900 border border-emerald-500/10 px-2 py-0.5 rounded-full font-black">
                        {Math.max(createStartDay, createEndDay) - Math.min(createStartDay, createEndDay) + 1} Days
                      </span>
                    </div>
                  </div>
                </div>

                {/* START and END TIME Side-by-side components */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#63716E] tracking-wider uppercase block">Start Time</label>
                    <div className="relative">
                      <select 
                        value={createStartTime}
                        onChange={e => setCreateStartTime(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-teal-500 rounded-xl py-2 px-3 text-[11px] font-bold text-[#203430] outline-none appearance-none cursor-pointer"
                      >
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="01:00 PM">01:00 PM</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#63716E] tracking-wider uppercase block">End Time</label>
                    <div className="relative">
                      <select 
                        value={createEndTime}
                        onChange={e => setCreateEndTime(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-teal-500 rounded-xl py-2 px-3 text-[11px] font-bold text-[#203430] outline-none appearance-none cursor-pointer"
                      >
                        <option value="06:00 PM">06:00 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="01:00 PM">01:00 PM</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ATTACHMENTS draggable dropzone area from Screenshot 3 */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[10px] font-black text-[#63716E] tracking-wider uppercase block">Attachments</label>
                  <div 
                    onClick={() => {
                      // Click simulate upload file
                      const randomId = Math.floor(Math.random() * 100);
                      setCreateAttachments(prev => [
                        ...prev, 
                        { name: `supporting_doc_ref_${randomId}.pdf`, size: "1.2 MB" }
                      ]);
                      showToast("Attached mock supporting document.");
                    }}
                    onDragOver={(e) => { e.preventDefault(); setIsFileDragging(true); }}
                    onDragLeave={() => setIsFileDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsFileDragging(false);
                      setCreateAttachments(prev => [
                        ...prev, 
                        { name: "uploaded_statement.png", size: "840 KB" }
                      ]);
                      showToast("Document drag & dropped loaded successfully!");
                    }}
                    className={cn(
                      "border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors",
                      isFileDragging 
                        ? "border-teal-500 bg-teal-50/20" 
                        : "border-slate-200 hover:border-slate-300 bg-slate-50/10 hover:bg-slate-50/40"
                    )}
                  >
                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-[#63716E] mb-2 shadow-sm">
                      <svg className="h-4.5 w-4.5 text-slate-550" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    </div>
                    <span className="text-[11px] font-bold text-[#203430]">Click to upload or drag & drop</span>
                    <span className="text-[9px] text-[#63716E] mt-0.5 font-medium block">PDF, PNG, JPG (Max 5MB)</span>
                  </div>

                  {/* List attached files */}
                  {createAttachments.length > 0 && (
                    <div className="space-y-1 mt-2.5">
                      {createAttachments.map((f, idx) => (
                        <div key={`${f.name}-${idx}`} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-150/40 rounded-lg text-[10.5px] font-bold text-[#203430]">
                          <span className="flex items-center gap-1.5 truncate"><svg className="h-3.5 w-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg> {f.name} <span className="text-slate-400 font-medium font-mono text-[9px]">({f.size})</span></span>
                          <button 
                            type="button" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCreateAttachments(prev => prev.filter((_, i) => i !== idx));
                              showToast("Document attachment removed.");
                            }}
                            className="text-rose-500 hover:text-rose-700 p-0.5 hover:bg-rose-100/30 rounded"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit & Cancel buttons */}
            <div className="p-5 border-t border-slate-100 bg-[#F7F7F7] flex items-center justify-end gap-3 rounded-b-[24px]">
              <button 
                type="button"
                onClick={() => setIsAddLeaveModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-750 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => {
                  // Final submission action
                  const formatPeriod = `${Math.min(createStartDay, createEndDay)}-${Math.max(createStartDay, createEndDay)} June 2035`;
                  const formatDuration = `${Math.max(createStartDay, createEndDay) - Math.min(createStartDay, createEndDay) + 1} Day${(Math.max(createStartDay, createEndDay) - Math.min(createStartDay, createEndDay) > 0) ? "s" : ""}`;
                  const customStartDate = `2035-06-${Math.min(createStartDay, createEndDay).toString().padStart(2, '0')}`;
                  const customEndDate = `2035-06-${Math.max(createStartDay, createEndDay).toString().padStart(2, '0')}`;

                  if (isEditingExisting && editRequestOriginalId) {
                    // Update main state database entries
                    setActivities(prev => prev.map(a => {
                      if (a.id === editRequestOriginalId) {
                        return {
                          ...a,
                          type: createLeaveType,
                          reason: createLeaveReason,
                          period: formatPeriod,
                          duration: formatDuration,
                          startDate: customStartDate,
                          endDate: customEndDate,
                          casualLeavesRemaining: createLeaveType === "Casual Leave" ? 1 : 2,
                          sickLeavesRemaining: createLeaveType === "Sick Leave" ? 4 : 5,
                          annualLeavesRemaining: createLeaveType === "Annual Leave" ? 9 : 10,
                        };
                      }
                      return a;
                    }));
                    showToast(`Leave request modifications stored!`);
                  } else {
                    // Create beautiful custom employee leaf entry (Screenshot 3 Flow)
                    const formatId = `EMP-0${Math.floor(Math.random() * 200) + 200}`;
                    const newEntry: LeaveActivityItem = {
                      name: "Anya Rodriguez",
                      id: formatId,
                      role: "Graphic Designer",
                      dept: "Marketing",
                      type: createLeaveType,
                      submit: "01 Jun 2035",
                      period: formatPeriod,
                      duration: formatDuration,
                      reason: createLeaveReason || "Personal matter",
                      status: "Pending",
                      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
                      startDate: customStartDate,
                      endDate: customEndDate,
                      casualLeavesRemaining: 2,
                      sickLeavesRemaining: 5,
                      annualLeavesRemaining: 10,
                      otherLeavesRemaining: 3,
                    };
                    setActivities(prev => [newEntry, ...prev]);
                    showToast(`Create request submitted successfully for Anya Rodriguez!`, 'success');
                  }

                  setIsAddLeaveModalOpen(false);
                }}
                className="px-6 py-2.5 bg-[#006352] hover:bg-[#004D40] text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                Submit Request <svg className="h-3.5 w-3.5 text-white transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

const PIN_COLORS_MAP: Record<number, string> = {
  0: '#0E4D41',
  1: '#35BFA3',
  2: '#E4F2D3',
  3: '#E5E6E6'
};
