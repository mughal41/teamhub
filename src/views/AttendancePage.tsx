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
  Loader2,
} from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";
import { cn } from "@/src/lib/utils";
import {
  getAttendanceApi,
  clockInApi,
  clockOutApi,
  updateAttendanceApprovalApi,
  AttendanceRecord as ApiAttendanceRecord,
} from "../lib/api/attendance";

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

  const [isLoading, setIsLoading] = React.useState(true);
  const [records, setRecordsState] = React.useState<any[]>([]);

  const fetchAttendanceRecords = React.useCallback(() => {
    setIsLoading(true);
    getAttendanceApi()
      .then((data) => {
        const mapped = data.map((r) => ({
          record_id: r.id,
          id: r.employee,
          name: r.employee_name || "Employee",
          role: r.employee_role || "Staff Member",
          subRole: r.department_name || "General",
          date: r.date,
          model: r.work_model,
          in: r.clock_in || "09:00 AM",
          out: r.clock_out || "05:00 PM",
          duration: `${Math.floor(r.duration_minutes / 60)}h ${r.duration_minutes % 60}m`,
          overtime: `${r.overtime_minutes}m`,
          status: r.status,
          avatar: r.employee_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
          correctionRequestsThisMonth: r.correction_requests_count || 0,
          comment: r.comment || "",
          forwardedTo: "",
          forwardedStatus: r.forwarded_status,
          hrApprovalStatus: r.hr_approval_status,
        }));
        setRecordsState(mapped);
      })
      .catch((err) => {
        console.error("Attendance fetch error:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    fetchAttendanceRecords();
  }, [fetchAttendanceRecords]);

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

  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("Name");

  // Modal State
  const [selectedRequest, setSelectedRequest] = React.useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);

  // Apply Attendance Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);
  const [applyComment, setApplyComment] = React.useState("");

  const handleClockIn = async () => {
    try {
      await clockInApi();
      fetchAttendanceRecords();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClockOut = async () => {
    try {
      await clockOutApi();
      fetchAttendanceRecords();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (rec: any, statusType: "Approved" | "Rejected") => {
    if (!rec || !rec.record_id) return;
    try {
      await updateAttendanceApprovalApi(rec.record_id, {
        hr_approval_status: statusType,
        forwarded_status: statusType,
      });
      fetchAttendanceRecords();
      setIsDetailModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered records
  const filteredRecords = React.useMemo(() => {
    return records.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.role.toLowerCase().includes(q);
      const matchStatus = filterStatus === "All" || r.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [records, searchQuery, filterStatus]);

  return (
    <AppLayout
      title="Attendance Management"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Attendance" },
      ]}
    >
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[#203430]">Daily Operations Punch Clock</h2>
            <p className="text-xs text-[#63716E]">Track timesheets, shift completions, and approval workflows</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClockIn}
              className="px-4 py-2 bg-brand text-white text-xs font-bold rounded-xl hover:bg-[#0E4D41] transition-all shadow-sm flex items-center gap-2"
            >
              <Clock className="h-4 w-4" /> Clock In (Now)
            </button>
            <button
              onClick={handleClockOut}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-all shadow-sm flex items-center gap-2"
            >
              <Clock className="h-4 w-4" /> Clock Out
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-3 bg-white rounded-2xl border border-slate-100">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <p className="text-sm font-semibold text-[#203430]">Loading live timesheets from backend...</p>
          </div>
        ) : (
          <Card className="p-4 border-none shadow-sm rounded-2xl bg-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 w-full max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff name, EMP ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-brand"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-500">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold text-[#203430]"
                >
                  <option value="All">All Statuses</option>
                  <option value="On-Time">On-Time</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>

            {/* Attendance Roster Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <th className="pb-3 px-3">Employee</th>
                    <th className="pb-3 px-3">Work Model</th>
                    <th className="pb-3 px-3">Clock In</th>
                    <th className="pb-3 px-3">Clock Out</th>
                    <th className="pb-3 px-3">Duration</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Approval</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                        No attendance records match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => (
                      <tr key={r.record_id || r.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img src={r.avatar} className="h-8 w-8 rounded-full object-cover border" />
                            <div>
                              <p className="font-bold text-[#203430]">{r.name}</p>
                              <p className="text-[10px] text-slate-400">{r.id} • {r.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{r.model}</td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{r.in}</td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{r.out}</td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{r.duration}</td>
                        <td className="py-3 px-3">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              r.status === "On-Time"
                                ? "bg-emerald-100 text-emerald-800"
                                : r.status === "Late"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            )}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(r, "Approved")}
                              className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition-all"
                              title="Approve Record"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleApprove(r, "Rejected")}
                              className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-lg transition-all"
                              title="Reject Record"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
