import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/LayoutAddons";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Settings,
  Bell,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  ArrowUpDown,
  X,
  CheckCircle2,
  XCircle,
  MessageSquare,
  CornerUpRight,
  Send,
  AlertCircle,
  Edit2,
  Clock,
  ArrowRight,
  UserCheck,
  Check,
  Briefcase,
} from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";
import { cn } from "@/src/lib/utils";
import { getCollection, saveCollection } from "../lib/db";

/**
 * @typedef {Object} AttendanceRecord
 * @property {string} name - Legal Full Name of employee
 * @property {string} id - Certified Employee ID Ledger (e.g. "EMP-0234")
 * @property {string} role - General role department (e.g., "Marketing")
 * @property {string} subRole - Micro professional niche title
 * @property {string} date - Record check date (e.g., "19 Jun 2035")
 * @property {string} model - Attendance work channel ("Hybrid" | "Remote" | "On-Site")
 * @property {string} in - Clock-in raw time stamp (e.g., "08:55 AM")
 * @property {string} out - Clock-out raw time stamp (e.g., "05:05 PM")
 * @property {string} duration - Hour tracking duration metric (e.g. "8h 10m")
 * @property {string} overtime - Flagged extra-work offset duration metric
 * @property {string} status - Dynamic classification ("On-Time" | "Late" | "Absent" | "On Leave")
 * @property {string} avatar - Public photoreal image url hook
 * @property {number} correctionRequestsThisMonth - Number of self-submitted backfills/adjustments
 * @property {string} comment - Explanation notes for manual reviews
 * @property {string} forwardedTo - Destination processing officer name
 * @property {string} forwardedStatus - Forward state status ("None" | "Pending" | "Approved" | "Rejected")
 * @property {string} hrApprovalStatus - Approval state status ("None" | "Pending" | "Approved" | "Rejected")
 *
 * @api_response_format {AttendanceRecord[]}
 * @endpoint GET `/api/attendance` - Pulls a JSON array collection conforming to this schema representation.
 * @endpoint PUT `/api/attendance` - Modifies approval/forwarding indicators of specific attendance keys.
 */

const managersList = [
  { name: "Marcus Brody", role: "Marketing & Sales Manager" },
  { name: "Sophia Chen", role: "Lead UI/UX Architect" },
  { name: "Zara Patel", role: "Operations Director" },
  { name: "Leila Vance", role: "HR Senior Supervisor" },
  { name: "David Vance", role: "Customer Support Head" },
];

export default function AttendancePage() {
  const [userRole, setUserRole] = React.useState<"HR" | "Employee">(() => {
    return (localStorage.getItem("viewing-role") as "HR" | "Employee") || "HR";
  });

  React.useEffect(() => {
    const handleStorageChange = () => {
      const current =
        (localStorage.getItem("viewing-role") as "HR" | "Employee") || "HR";
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
  };

  /*
   * EXPECTED JSON SCHEMA / RECORD FORMAT FOR THE ATTENDANCE DATABASE STORE (db_attendance):
   * [
   *   {
   *     "id": "EMP-0234",                     // String: Staff operational ID (e.g. "EMP-XXXX")
   *     "name": "Olivia Mason",               // String: Full legal name of the employee
   *     "role": "Marketing Executive",       // String: Department division alignment / job title
   *     "subRole": "Marketing",              // String: Sub-title or professional niche description
   *     "dept": "Marketing",                // String: Department category name
   *     "date": "19 Jun 2035",               // String: Work shift/attendance date recorded
   *     "model": "On-Site",                  // String: Working style ("On-Site" | "Remote" | "Hybrid")
   *     "in": "08:55 AM",                    // String: Timestamps of raw clock-in
   *     "out": "05:05 PM",                   // String: Timestamps of raw clock-out
   *     "duration": "8h 10m",                // String: Summed working duration
   *     "overtime": "10m",                   // String: Overtime duration
   *     "status": "On-Time",                 // String: State indicator ("On-Time" | "Late" | "Absent" | "On Leave")
   *     "avatar": "https://images.unsplash...",// String: HTTPS photoreal public profile profile URL
   *     "correctionRequestsThisMonth": 0,    // Number: Manual adjustment logs submitted count
   *     "comment": "",                       // String: Supervisor evaluation notes / reasons
   *     "forwardedTo": "",                   // String: Designated supervisor full name
   *     "forwardedStatus": "None",           // String: Manager review ("None" | "Pending" | "Approved" | "Rejected")
   *     "hrApprovalStatus": "Approved"        // String: HR state ("None" | "Pending" | "Approved" | "Rejected")
   *   }
   * ]
   */
  const [records, setRecordsState] = React.useState<any[]>(() => {
    return getCollection<any[]>("db_attendance", []);
  });

  // Dynamically group and map records for the analytics overview chart
  const chartData = React.useMemo(() => {
    if (records.length === 0) return [];
    const groups: { [key: string]: { present: number; leave: number; absent: number } } = {};
    records.slice(0, 15).forEach((r) => {
      const d = r.date || "Today";
      if (!groups[d]) {
        groups[d] = { present: 0, leave: 0, absent: 0 };
      }
      if (r.status === "On-Time" || r.status === "Late") {
        groups[d].present++;
      } else if (r.status === "On Leave") {
        groups[d].leave++;
      } else {
        groups[d].absent++;
      }
    });
    return Object.keys(groups).map((date) => ({
      month: date,
      present: groups[date].present,
      leave: groups[date].leave,
      absent: groups[date].absent,
    }));
  }, [records]);

  const setRecords = (update: any[] | ((prev: any[]) => any[])) => {
    if (typeof update === "function") {
      setRecordsState((prev) => {
        const next = update(prev);
        saveCollection("db_attendance", next);
        return next;
      });
    } else {
      setRecordsState(update);
      saveCollection("db_attendance", update);
    }
  };

  React.useEffect(() => {
    const handleDbUpdate = () => {
      setRecordsState(getCollection<any[]>("db_attendance", []));
    };
    window.addEventListener("db_updated", handleDbUpdate);
    window.addEventListener("storage", handleDbUpdate);
    return () => {
      window.removeEventListener("db_updated", handleDbUpdate);
      window.removeEventListener("storage", handleDbUpdate);
    };
  }, []);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("Name");

  // Modal State
  const [selectedRequest, setSelectedRequest] = React.useState<any | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);

  // Apply Attendance Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);
  const [applyName, setApplyName] = React.useState("");
  const [applyID, setApplyID] = React.useState("");
  const [applyRole, setApplyRole] = React.useState("");
  const [applySubRole, setApplySubRole] = React.useState("");
  const [applyDate, setApplyDate] = React.useState("20 Jun 2035");
  const [applyModel, setApplyModel] = React.useState("Hybrid");
  const [applyIn, setApplyIn] = React.useState("09:00 AM");
  const [applyOut, setApplyOut] = React.useState("06:00 PM");
  const [applyComment, setApplyComment] = React.useState("");

  const employeesList = React.useMemo(() => {
    const list = getCollection<any[]>("db_employees", []);
    if (list.length > 0) return list;
    const seen = new Set();
    const unique: any[] = [];
    records.forEach((r) => {
      if (r && r.id && !seen.has(r.id)) {
        seen.add(r.id);
        unique.push({
          id: r.id,
          name: r.name,
          role: r.role,
          subRole: r.subRole,
          avatar: r.avatar,
        });
      }
    });
    return unique;
  }, [records]);

  const handleApplyAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName || !applyID) return;

    let duration = "9h 0m";
    let status = "On-Time";
    let overtime = "1h 0m";

    if (applyIn && applyOut) {
      const matchIn = applyIn.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
      const matchOut = applyOut.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
      if (matchIn && matchOut) {
        const hour = parseInt(matchIn[1]);
        const isPm = matchIn[3].toUpperCase() === "PM";
        const totalInMin =
          (hour === 12 ? (isPm ? 12 : 0) : hour + (isPm ? 12 : 0)) * 60 +
          parseInt(matchIn[2]);

        const outHour = parseInt(matchOut[1]);
        const isOutPm = matchOut[3].toUpperCase() === "PM";
        const totalOutMin =
          (outHour === 12
            ? isOutPm
              ? 12
              : 0
            : outHour + (isOutPm ? 12 : 0)) *
            60 +
          parseInt(matchOut[2]);

        if (totalInMin > 9 * 60) {
          status = "Late";
        }

        const diffMin = totalOutMin - totalInMin;
        if (diffMin > 0) {
          const h = Math.floor(diffMin / 60);
          const m = diffMin % 60;
          duration = `${h}h ${m}m`;

          if (diffMin > 480) {
            const overMin = diffMin - 480;
            const oh = Math.floor(overMin / 60);
            const om = overMin % 60;
            overtime = oh > 0 ? `${oh}h ${om}m` : `${om}m`;
          } else {
            overtime = "—";
          }
        }
      }
    }

    const matchedEmp = employeesList.find((emp) => emp.id === applyID);
    const avatar = matchedEmp?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${applyID}`;

    const newRecord = {
      id: applyID,
      name: applyName,
      role: applyRole || "Executive",
      subRole: applySubRole || "Staff",
      dept: applyRole || "Operations",
      date: applyDate,
      model: applyModel,
      in: applyIn,
      out: applyOut,
      duration,
      overtime,
      status,
      avatar,
      correctionRequestsThisMonth: 0,
      comment: applyComment,
      forwardedTo: "",
      forwardedStatus: "None",
      hrApprovalStatus: "Approved",
    };

    setRecords((prev) => [newRecord, ...prev]);
    setIsApplyModalOpen(false);
  };

  // Modal Editing Draft States
  const [commentText, setCommentText] = React.useState("");
  const [forwardTo, setForwardTo] = React.useState("");
  const [editIn, setEditIn] = React.useState("");
  const [editOut, setEditOut] = React.useState("");
  const [isForwardDropdownOpen, setIsForwardDropdownOpen] =
    React.useState(false);

  const handleOpenDetailsModal = (record: any) => {
    setSelectedRequest(record);
    setCommentText(record.comment || "");
    setForwardTo(record.forwardedTo || "");
    setEditIn(record.in || "— — —");
    setEditOut(record.out || "");
    setIsForwardDropdownOpen(false);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRequest(null);
  };

  const handleUpdateStatus = (newStatus: "Approved" | "Rejected") => {
    if (!selectedRequest) return;
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === selectedRequest.id
          ? { ...rec, hrApprovalStatus: newStatus }
          : rec,
      ),
    );
    setSelectedRequest((prev) =>
      prev ? { ...prev, hrApprovalStatus: newStatus } : null,
    );
  };

  const handleSaveDrafts = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    // Calculate new status and durations based on edited times
    let newStatus = selectedRequest.status;
    let duration = selectedRequest.duration;
    let overtime = selectedRequest.overtime;

    if (editIn && editIn !== "— — —" && editIn !== "—") {
      // Check if late (e.g. after 09:00 AM)
      const matchIn = editIn.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
      if (matchIn) {
        const hour = parseInt(matchIn[1]);
        const isPm = matchIn[3].toUpperCase() === "PM";
        const totalInMin =
          (hour === 12 ? (isPm ? 12 : 0) : hour + (isPm ? 12 : 0)) * 60 +
          parseInt(matchIn[2]);

        if (totalInMin > 9 * 60) {
          newStatus = "Late";
        } else {
          newStatus = "On-Time";
        }

        // Calculate simple mock duration if Check-Out is set
        if (editOut && editOut !== "" && editOut !== "—") {
          const matchOut = editOut.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
          if (matchOut) {
            const outHour = parseInt(matchOut[1]);
            const isOutPm = matchOut[3].toUpperCase() === "PM";
            const totalOutMin =
              (outHour === 12
                ? isOutPm
                  ? 12
                  : 0
                : outHour + (isOutPm ? 12 : 0)) *
                60 +
              parseInt(matchOut[2]);

            const diffMin = totalOutMin - totalInMin;
            if (diffMin > 0) {
              const h = Math.floor(diffMin / 60);
              const m = diffMin % 60;
              duration = `${h}h ${m}m`;

              // Standard 8 hour workday
              if (diffMin > 480) {
                const overMin = diffMin - 480;
                overtime = `${overMin}m`;
              } else {
                overtime = "—";
              }
            }
          }
        }
      }
    } else {
      newStatus =
        selectedRequest.status === "On-Time" ||
        selectedRequest.status === "Late"
          ? "Absent"
          : selectedRequest.status;
      duration = "—";
      overtime = "—";
    }

    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === selectedRequest.id) {
          return {
            ...rec,
            in: editIn,
            out: editOut,
            comment: commentText,
            forwardedTo: forwardTo,
            forwardedStatus:
              forwardTo && forwardTo !== rec.forwardedTo
                ? "Pending"
                : rec.forwardedStatus,
            status: newStatus,
            duration,
            overtime,
          };
        }
        return rec;
      }),
    );

    // Update active modal display
    setSelectedRequest((prev) =>
      prev
        ? {
            ...prev,
            in: editIn,
            out: editOut,
            comment: commentText,
            forwardedTo: forwardTo,
            forwardedStatus:
              forwardTo && forwardTo !== prev.forwardedTo
                ? "Pending"
                : prev.forwardedStatus,
            status: newStatus,
            duration,
            overtime,
          }
        : null,
    );
  };

  const handleForwardRequest = (managerName: string) => {
    if (!selectedRequest) return;
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === selectedRequest.id
          ? { ...rec, forwardedTo: managerName, forwardedStatus: "Pending" }
          : rec,
      ),
    );
    setSelectedRequest((prev) =>
      prev
        ? { ...prev, forwardedTo: managerName, forwardedStatus: "Pending" }
        : null,
    );
    setForwardTo(managerName);
    setIsForwardDropdownOpen(false);
  };

  const handleSimulateManagerApproval = () => {
    if (!selectedRequest) return;
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === selectedRequest.id
          ? { ...rec, forwardedStatus: "Approved" }
          : rec,
      ),
    );
    setSelectedRequest((prev) =>
      prev ? { ...prev, forwardedStatus: "Approved" } : null,
    );
  };

  // Filter & Sort Logic
  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "All" || rec.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Sort logic sorting records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortBy === "Name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "Status") {
      return a.status.localeCompare(b.status);
    } else if (sortBy === "Date") {
      return a.date.localeCompare(b.date);
    }
    return 0;
  });

  // Dynamic statistics calculations based directly on live DB records
  const onTimeCount = records.filter((r) => r.status === "On-Time").length;
  const lateCount = records.filter((r) => r.status === "Late").length;
  const presentCount = onTimeCount + lateCount;
  const leaveCount = records.filter((r) => r.status === "On Leave").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;

  return (
    <AppLayout
      title="Attendance"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Attendance" }]}
    >
      <div className="space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Present Card */}
          <Card className="lg:col-span-3 h-[195px] flex flex-col p-0 border border-[#E6E6E4] rounded-[16px] bg-white overflow-hidden">
            <div className="bg-[#E4F2D3] p-4">
              <h3 className="text-[16px] font-bold text-[#203430]">Present</h3>
            </div>
            <div className="flex-1 p-4 flex flex-col justify-end">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[40px] font-bold text-[#0E4D41] leading-none">
                    {presentCount}
                  </p>
                  <p className="text-[10px] text-[#63716E] mt-2">Employees</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="bg-white border border-[#E6E6E4] px-2 py-1 rounded-[6px] flex items-center gap-1">
                    <span className="text-[16px] font-bold text-brand">+4</span>
                  </div>
                  <p className="text-[10px] text-[#63716E]">vs yesterday</p>
                </div>
              </div>
              <div className="mt-4 flex gap-4 bg-white border border-[#E6E6E4] rounded-[8px] p-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[16px] font-bold text-[#0E4D41]">
                    {onTimeCount}
                  </span>
                  <span className="text-[10px] text-[#63716E]">On-Time</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[16px] font-bold text-[#0E4D41]">
                    {lateCount}
                  </span>
                  <span className="text-[10px] text-[#63716E]">Late</span>
                </div>
              </div>
            </div>
          </Card>

          {/* On Leave Card */}
          <Card className="lg:col-span-4 h-[195px] flex flex-col p-0 border border-[#E6E6E4] rounded-[16px] bg-white overflow-hidden">
            <div className="bg-brand p-4">
              <h3 className="text-[16px] font-bold text-white">On Leave</h3>
            </div>
            <div className="flex-1 p-4 flex flex-col justify-end">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[40px] font-bold text-[#0E4D41] leading-none">
                    {leaveCount}
                  </p>
                  <p className="text-[10px] text-[#63716E] mt-2">Employees</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="bg-white border border-[#E6E6E4] px-2 py-1 rounded-[6px] flex items-center gap-1">
                    <span className="text-[16px] font-bold text-brand">+1</span>
                  </div>
                  <p className="text-[10px] text-[#63716E]">vs yesterday</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between bg-white border border-[#E6E6E4] rounded-[8px] p-2">
                <div className="flex items-center gap-1.5 shrink-0 px-1 border-r border-[#E4E4E1]">
                  <span className="text-[16px] font-bold text-[#0E4D41]">
                    {getCollection<any[]>("db_leaves", []).filter(l => l.type === "Annual Leave" && l.status === "Approved").length}
                  </span>
                  <span className="text-[10px] text-[#63716E]">
                    Annual Leave
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 px-1 border-r border-[#E4E4E1]">
                  <span className="text-[16px] font-bold text-[#0E4D41]">
                    {getCollection<any[]>("db_leaves", []).filter(l => l.type === "Sick Leave" && l.status === "Approved").length}
                  </span>
                  <span className="text-[10px] text-[#63716E]">Sick Leave</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 px-1">
                  <span className="text-[16px] font-bold text-[#0E4D41]">
                    {getCollection<any[]>("db_leaves", []).filter(l => l.type !== "Annual Leave" && l.type !== "Sick Leave" && l.status === "Approved").length}
                  </span>
                  <span className="text-[10px] text-[#63716E]">Others</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Absent Card */}
          <Card className="lg:col-span-2 h-[195px] flex flex-col p-0 border border-[#E6E6E4] rounded-[16px] bg-white overflow-hidden">
            <div className="bg-[#0E4D41] p-4">
              <h3 className="text-[16px] font-bold text-white">Absent</h3>
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div className="flex flex-col items-center pt-2">
                <p className="text-[40px] font-bold text-[#0E4D41] leading-none">
                  {absentCount}
                </p>
                <p className="text-[10px] text-[#63716E] mt-2">Employees</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="bg-white border border-[#E6E6E4] px-2 py-1 rounded-[6px]">
                  <span className="text-[16px] font-bold text-[#E63D4B]">
                    +2
                  </span>
                </div>
                <p className="text-[10px] text-[#63716E] text-center leading-tight">
                  vs
                  <br />
                  yesterday
                </p>
              </div>
            </div>
          </Card>

          {/* Chart Overview */}
          <Card className="lg:col-span-3 h-[195px] p-4 border border-[#E6E6E4] rounded-[16px] bg-white flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <h3 className="text-[16px] font-bold text-[#203430]">
                  Attendance Overview
                </h3>
                <div className="mt-2 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#E4F2D3]" />
                    <span className="text-[12px] text-[#63716E]">Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-brand" />
                    <span className="text-[12px] text-[#63716E]">On Leave</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#0E4D41]" />
                    <span className="text-[12px] text-[#63716E]">Absent</span>
                  </div>
                </div>
              </div>
              <div className="self-start">
                <button className="flex items-center gap-2 bg-white border border-[#E6E6E4] px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-[#203430]">
                  Last 6 Months <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </div>
            {records.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-3 border border-dashed border-[#E4E4E1] rounded-[12px] min-h-[100px] gap-1">
                <Clock className="h-5 w-5 text-[#63716E]/40" />
                <p className="text-[10px] font-bold text-[#203430]">No Attendance Stats</p>
                <p className="text-[9px] text-[#63716E]">Charts will populate once employees check in.</p>
              </div>
            ) : (
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} stackOffset="expand">
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#63716E" }}
                      dy={5}
                    />
                    <Bar
                      dataKey="present"
                      stackId="a"
                      fill="#E4F2D3"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="leave"
                      stackId="a"
                      fill="#35BFA3"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="absent"
                      stackId="a"
                      fill="#0E4D41"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>

        {/* Employee Attendance Table */}
        <Card className="border border-[#E6E6E4] rounded-[16px] bg-white overflow-hidden p-0 flex flex-col min-h-[700px]">
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-50">
            <div>
              <h2 className="text-[16px] font-bold text-[#203430]">
                Employee Attendance
              </h2>
              <p className="text-[11px] text-[#63716E] mt-1">
                Click on any row to open the details modal (Approve, Reject,
                Comment, Forward, or Edit Check-In/Out times)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#63716E]" />
                <input
                  type="text"
                  placeholder="Search employee, ID, role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 w-[210px] h-[34px] bg-white hover:bg-[#F3F3F0]/40 text-[#203430] placeholder:text-[#63716E]/70 rounded-[8px] text-[12px] font-medium outline-none transition-colors border border-transparent focus:border-[#0E4D41]/30"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#63716E]">
                  Status:
                </span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[#E4F2D3] text-[#203430] h-[34px] px-2.5 rounded-[8px] text-[12px] font-bold outline-none border-none cursor-pointer hover:bg-[#d4eab6] transition-colors"
                >
                  <option value="All">All Statuses</option>
                  <option value="On-Time">On-Time</option>
                  <option value="Late">Late</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#63716E]">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#E4F2D3] text-[#203430] h-[34px] px-2.5 rounded-[8px] text-[12px] font-bold outline-none border-none cursor-pointer hover:bg-[#d4eab6] transition-colors"
                >
                  <option value="Name">Name</option>
                  <option value="Status">Status</option>
                  <option value="Date">Date</option>
                </select>
              </div>

              <button
                onClick={() => {
                  if (employeesList.length > 0) {
                    const first = employeesList[0];
                    setApplyName(first.name);
                    setApplyID(first.id);
                    setApplyRole(first.role || "");
                    setApplySubRole(first.subRole || "");
                  } else {
                    setApplyName("");
                    setApplyID("");
                    setApplyRole("");
                    setApplySubRole("");
                  }
                  setApplyDate("20 Jun 2035");
                  setApplyModel("Hybrid");
                  setApplyIn("09:00 AM");
                  setApplyOut("06:00 PM");
                  setApplyComment("");
                  setIsApplyModalOpen(true);
                }}
                className="bg-[#0E4D41] text-white text-[12px] font-bold h-[34px] px-4 rounded-[8px] hover:bg-[#0E4D41]/90 flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Clock className="h-4 w-4" /> Apply Attendance
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse bg-white">
              <thead className="bg-[#F3F3F0]">
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
                      Date <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                      Work Model <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                      Check In - Out <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                      Duration <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                      Overtime <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="flex items-center gap-1 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                      Status <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E6E6]">
                {sortedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="h-10 w-10 bg-slate-50 border border-[#E4E4E1] rounded-full flex items-center justify-center text-slate-400 mx-auto">
                          <Check className="h-4 w-4" />
                        </div>
                        <p className="text-[12px] font-bold text-[#203430] mt-1">
                          No Attendance Logs Found
                        </p>
                        <p className="text-[10px] text-[#63716E] max-w-sm mx-auto leading-relaxed">
                          Your staff check-in register is currently empty. Connect an API endpoint or synchronize with active biometric logs to populate rosters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedRecords.map((e, i) => (
                    <tr
                      key={e.id || i}
                      onClick={() => handleOpenDetailsModal(e)}
                      className="hover:bg-[#F3F3F0]/70 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={e.avatar}
                            className="h-8 w-8 rounded-full object-cover bg-brand"
                          />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] font-bold text-[#203430] leading-none group-hover:text-brand transition-colors">
                                {e.name}
                              </span>
                              {e.hrApprovalStatus !== "Pending" && (
                                <span
                                  className={cn(
                                    "text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-95",
                                    e.hrApprovalStatus === "Approved"
                                      ? "bg-[#E4F2D3] text-[#0E4D41]"
                                      : "bg-rose-100 text-rose-700",
                                  )}
                                >
                                  {e.hrApprovalStatus}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#63716E] mt-1 uppercase font-bold">
                              {e.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-[#203430] leading-none">
                            {e.role}
                          </span>
                          <span className="text-[10px] text-[#63716E] mt-1 font-bold">
                            {e.subRole}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[11px] font-bold text-[#203430]">
                        {e.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              e.model === "Hybrid"
                                ? "bg-[#E4F2D3]"
                                : e.model === "Remote"
                                  ? "bg-brand"
                                  : "bg-brand",
                            )}
                          />
                          <span className="text-[11px] font-bold text-[#203430]">
                            {e.model}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[11px] font-bold text-[#203430]">
                        {e.in} {e.out ? `— ${e.out}` : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[11px] font-bold text-[#203430]">
                        {e.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[11px] font-bold text-[#203430]">
                        {e.overtime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={cn(
                            "px-2 py-1 rounded-full text-[11px] font-bold text-center w-fit min-w-[50px]",
                            e.status === "On-Time"
                              ? "bg-brand text-white"
                              : e.status === "Late"
                                ? "bg-[#E4F2D3] text-[#203430]"
                                : e.status === "On Leave"
                                  ? "bg-[#F3F3F0] text-[#203430]"
                                  : "bg-[#0E4D41] text-white",
                          )}
                        >
                          <div className="flex items-center gap-1.5 justify-center">
                            <span>{e.status}</span>
                            {e.forwardedStatus === "Pending" && (
                              <span
                                className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse shrink-0"
                                title={`Pending manager approval: ${e.forwardedTo}`}
                              />
                            )}
                            {e.forwardedStatus === "Approved" && (
                              <span
                                className="h-1.5 w-1.5 rounded bg-emerald-400 shrink-0"
                                title={`Approved by manager: ${e.forwardedTo}`}
                              />
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-[#E4E4E1] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-[#63716E]">Show</span>
              <button className="flex items-center gap-2 bg-white border border-[#E6E6E4] h-[28px] px-3 rounded-[8px] text-[12px] font-bold text-[#203430] cursor-not-allowed" disabled>
                10 <ChevronDown className="h-3 w-3" />
              </button>
              <span className="text-[14px] text-[#63716E]">of {sortedRecords.length} results</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F3F3F0] text-[#203430] disabled:opacity-50" disabled>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-brand text-white text-[12px] font-bold">
                1
              </button>
              <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-white border border-[#E6E6E4] text-[#203430] text-[12px] font-bold cursor-not-allowed" disabled>
                2
              </button>
              <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-white border border-[#E6E6E4] text-[#203430] text-[12px] font-bold cursor-not-allowed" disabled>
                3
              </button>
              <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-white border border-[#E6E6E4] text-[#203430] cursor-not-allowed" disabled>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>
      </div>

      <footer className="mt-20 py-8 border-t border-[#E4E4E1] flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
        <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-16">
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
        </div>
        <div className="flex gap-4">
          {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
            <Icon
              key={i}
              className="h-4 w-4 text-[#63716E] cursor-pointer hover:text-brand"
            />
          ))}
        </div>
      </footer>

      {/* Attendance correction & detail approval modal */}
      {isDetailModalOpen && selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm"
          id="attendanceDetailModal"
        >
          <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-xl border border-[#E4E4E1] flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-[#E4E4E1] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Attendance Timesheet Correction
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Verify employee logs and approve timesheet correction request
                </p>
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
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Employee Quick Info Badge */}
              <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60">
                <img
                  src={selectedRequest.avatar}
                  alt={selectedRequest.name}
                  className="h-12 w-12 rounded-lg object-cover border border-slate-200/80 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {selectedRequest.name}
                    </h4>
                    <span className="text-[10px] font-mono tracking-wider text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded font-bold uppercase">
                      {selectedRequest.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {selectedRequest.role} — {selectedRequest.subRole}
                  </p>
                </div>
              </div>

              {/* Attendance Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50/20 p-3 rounded-xl border border-[#E4E4E1]">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">
                    Target Work Date
                  </span>
                  <span className="text-xs font-semibold text-slate-800">
                    {selectedRequest.date || "Today"}
                  </span>
                </div>
                <div className="bg-slate-50/20 p-3 rounded-xl border border-[#E4E4E1]">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">
                    Working Model
                  </span>
                  <span className="text-xs font-semibold text-slate-800 capitalize">
                    {selectedRequest.model || "Hybrid"}
                  </span>
                </div>
              </div>

              {/* Editable Times Section */}
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                    Adjustment Parameters
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium font-mono">
                    Input corrected times
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 block">
                      Check-In
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-250 focus:border-slate-350 focus:ring-1 focus:ring-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none transition-all"
                      placeholder="e.g. 08:30"
                      value={editIn}
                      onChange={(e) => setEditIn(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 block">
                      Check-Out
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-250 focus:border-slate-350 focus:ring-1 focus:ring-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none transition-all"
                      placeholder="e.g. 17:30"
                      value={editOut}
                      onChange={(e) => setEditOut(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Delegate / Forward Manager Select Option */}
              <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Forward for Preliminary Review
                  </span>
                  {selectedRequest.forwardedTo && (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100/50">
                      Currently:{" "}
                      {selectedRequest.forwardedStatus === "Approved"
                        ? "Approved"
                        : "Pending"}
                    </span>
                  )}
                </div>

                <div className="flex gap-2.5">
                  <select
                    className="flex-1 bg-white border border-slate-200 focus:border-slate-350 rounded-xl py-1.5 px-3 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                    value={forwardTo}
                    onChange={(e) => setForwardTo(e.target.value)}
                  >
                    <option value="">Choose manager or supervisor...</option>
                    {managersList.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleForwardRequest(forwardTo)}
                    disabled={!forwardTo}
                    className="bg-brand text-white text-xs font-semibold px-4 py-1.5 rounded-xl hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap transition-all"
                  >
                    Forward
                  </button>
                </div>

                {selectedRequest.forwardedTo ? (
                  <div className="text-xs text-slate-600 flex items-center justify-between bg-white border border-slate-150 p-2.5 rounded-xl">
                    <span>
                      Forwarded to{" "}
                      <strong>{selectedRequest.forwardedTo}</strong> (
                      {selectedRequest.forwardedStatus || "Pending"})
                    </span>
                    {selectedRequest.forwardedStatus === "Pending" && (
                      <button
                        onClick={handleSimulateManagerApproval}
                        className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 font-extrabold hover:bg-emerald-100 transition-all cursor-pointer"
                        title="Simulate manager approval action"
                      >
                        Simulate Approval
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400">
                    Optionally delegate this request to the respective head of
                    department for review before final human resources action.
                  </p>
                )}
              </div>

              {/* Comment field block */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Decision Remarks / Notes
                </span>
                <textarea
                  className="w-full bg-white border border-slate-200 focus:border-slate-350 focus:ring-1 focus:ring-slate-300 rounded-xl p-3 text-xs font-medium outline-none min-h-[60px] resize-none transition-all"
                  placeholder="e.g. Approved check-in correction as confirmed by department logs..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                {selectedRequest.comment && (
                  <div className="bg-slate-50 border border-[#E4E4E1] p-2.5 rounded-lg flex items-start gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-650 leading-relaxed">
                      <strong className="font-semibold">Original Note:</strong>{" "}
                      "{selectedRequest.comment}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions Footer */}
            <div className="p-4 bg-slate-50 border-t border-[#E4E4E1] flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={handleSaveDrafts}
                className="bg-white border border-slate-200 hover:bg-slate-150 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
                title="Saves adjusted check in - out draft times"
              >
                Save Draft
              </button>

              <div className="flex gap-2.5">
                <button
                  onClick={() => handleUpdateStatus("Rejected")}
                  className="bg-white border border-rose-250 text-rose-600 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-rose-50 cursor-pointer transition-colors"
                  title="Reject this attendance log request"
                >
                  Reject Correction
                </button>
                <button
                  onClick={() => handleUpdateStatus("Approved")}
                  className="bg-brand text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-95 flex items-center gap-1 cursor-pointer transition-all"
                  title="Approve times and apply changes to log"
                >
                  Approve Correction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isApplyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm"
          id="applyAttendanceModal"
        >
          <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-xl border border-[#E4E4E1] flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#E4E4E1] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-[#E4F2D3] flex items-center justify-center">
                  <Clock className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 leading-none">
                    Apply Attendance
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Log manual attendance or check-in backfill
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
                title="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleApplyAttendanceSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Employee Selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">
                  Employee
                </label>
                <select
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                  value={applyID}
                  onChange={(e) => {
                    const empId = e.target.value;
                    setApplyID(empId);
                    const matched = employeesList.find((emp) => emp.id === empId);
                    if (matched) {
                      setApplyName(matched.name);
                      setApplyRole(matched.role || "");
                      setApplySubRole(matched.subRole || "");
                    }
                  }}
                >
                  <option value="">Select Employee...</option>
                  {employeesList.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.id}) — {emp.role || "Staff"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Readonly/derived ID & Role */}
              {applyID && (
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200/40 text-xs text-slate-600">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Role</span>
                    <span className="font-semibold text-slate-700">{applyRole} {applySubRole && `— ${applySubRole}`}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Employee ID</span>
                    <span className="font-semibold font-mono text-slate-700">{applyID}</span>
                  </div>
                </div>
              )}

              {/* Date Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">
                  Work Date
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 focus:ring-1 focus:ring-brand rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
                  placeholder="e.g. 20 Jun 2035"
                  value={applyDate}
                  onChange={(e) => setApplyDate(e.target.value)}
                />
              </div>

              {/* Work Model Selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">
                  Work Model
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Hybrid", "Remote", "On-Site"].map((model) => (
                    <button
                      type="button"
                      key={model}
                      onClick={() => setApplyModel(model)}
                      className={cn(
                        "py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer",
                        applyModel === model
                          ? "bg-brand text-white border-brand"
                          : "bg-slate-50 text-slate-700 border-slate-250 hover:bg-slate-100"
                      )}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              {/* Times */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">
                    Check-In Time
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 focus:ring-1 focus:ring-brand rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
                    placeholder="e.g. 09:00 AM"
                    value={applyIn}
                    onChange={(e) => setApplyIn(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">
                    Check-Out Time
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 focus:ring-1 focus:ring-brand rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
                    placeholder="e.g. 06:00 PM"
                    value={applyOut}
                    onChange={(e) => setApplyOut(e.target.value)}
                  />
                </div>
              </div>

              {/* Description / Comment */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">
                  Reason / Remarks
                </label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 focus:ring-1 focus:ring-brand rounded-xl p-3 text-xs font-medium outline-none min-h-[80px] resize-none transition-all"
                  placeholder="Reason for backfill or manual entry..."
                  value={applyComment}
                  onChange={(e) => setApplyComment(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#E4E4E1] flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0E4D41] text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0E4D41]/90 cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" /> Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
