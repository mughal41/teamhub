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
  Download,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import {
  getLeaveQuotasApi,
  getLeaveRequestsApi,
  createLeaveRequestApi,
  updateLeaveStatusApi,
  LeaveQuota,
  LeaveRequest as ApiLeaveRequest,
} from "../lib/api/leaves";

export interface LeaveActivityItem {
  record_id: string;
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
}

export default function LeaveManagementPage() {
  const [activities, setActivitiesState] = React.useState<LeaveActivityItem[]>([]);
  const [quotas, setQuotasState] = React.useState<LeaveQuota[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchLeaveData = React.useCallback(() => {
    setIsLoading(true);
    Promise.all([getLeaveQuotasApi(), getLeaveRequestsApi()])
      .then(([quotaData, requestData]) => {
        setQuotasState(quotaData);
        const mapped = requestData.map((req) => ({
          record_id: req.id,
          name: req.employee_name || "Employee",
          id: req.employee_id || req.employee,
          role: req.employee_role || "Staff Member",
          dept: req.department_name || "General",
          type: req.leave_type,
          submit: new Date(req.created_at).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          period: `${req.start_date} to ${req.end_date}`,
          duration: `${req.duration_days} Day${req.duration_days > 1 ? "s" : ""}`,
          reason: req.reason || "No reason specified",
          status: req.status,
          avatar: req.employee_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
        }));
        setActivitiesState(mapped);
      })
      .catch((err) => console.error("Error fetching leave data:", err))
      .finally(() => setIsLoading(false));
  }, []);

  React.useEffect(() => {
    fetchLeaveData();
  }, [fetchLeaveData]);

  // Modal / Application state
  const [isAddLeaveModalOpen, setIsAddLeaveModalOpen] = React.useState(false);
  const [createLeaveType, setCreateLeaveType] = React.useState("Annual Leave");
  const [createLeaveReason, setCreateLeaveReason] = React.useState("");
  const [startDate, setStartDate] = React.useState("2026-08-15");
  const [endDate, setEndDate] = React.useState("2026-08-17");

  // Search & Filter
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState("All");

  const filteredActivities = React.useMemo(() => {
    return activities.filter((act) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = act.name.toLowerCase().includes(q) || act.id.toLowerCase().includes(q) || act.role.toLowerCase().includes(q);
      const matchType = filterType === "All" || act.type === filterType;
      return matchSearch && matchType;
    });
  }, [activities, searchQuery, filterType]);

  const handleUpdateStatus = async (recordId: string, newStatus: "Approved" | "Rejected") => {
    try {
      await updateLeaveStatusApi(recordId, newStatus);
      fetchLeaveData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmSubmitLeave = async () => {
    try {
      await createLeaveRequestApi({
        leave_type: createLeaveType,
        start_date: startDate,
        end_date: endDate,
        duration_days: 3,
        reason: createLeaveReason || "Personal Leave",
      });
      fetchLeaveData();
      setIsAddLeaveModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const activeQuota = quotas[0] || {
    annual_total: 15,
    annual_remaining: 8,
    sick_total: 10,
    sick_remaining: 9,
    casual_total: 12,
    casual_remaining: 8,
    other_total: 5,
    other_remaining: 5,
  };

  return (
    <AppLayout
      title="Leave Management"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Leave Management" },
      ]}
    >
      <div className="space-y-6">
        {/* Quota Header Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Umbrella className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-500">Annual Leave Quota</span>
            </div>
            <p className="text-2xl font-extrabold text-[#203430]">{activeQuota.annual_remaining} <span className="text-xs font-normal text-slate-400">/ {activeQuota.annual_total} Days</span></p>
          </Card>
          <Card className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-500">Sick Leave Quota</span>
            </div>
            <p className="text-2xl font-extrabold text-[#203430]">{activeQuota.sick_remaining} <span className="text-xs font-normal text-slate-400">/ {activeQuota.sick_total} Days</span></p>
          </Card>
          <Card className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Smile className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-500">Casual Leave Quota</span>
            </div>
            <p className="text-2xl font-extrabold text-[#203430]">{activeQuota.casual_remaining} <span className="text-xs font-normal text-slate-400">/ {activeQuota.casual_total} Days</span></p>
          </Card>
          <Card className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Palmtree className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-bold text-slate-500">Other Leave Quota</span>
            </div>
            <p className="text-2xl font-extrabold text-[#203430]">{activeQuota.other_remaining} <span className="text-xs font-normal text-slate-400">/ {activeQuota.other_total} Days</span></p>
          </Card>
        </div>

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[#203430]">Leave Applications Timeline</h2>
            <p className="text-xs text-[#63716E]">Review and manage employee leave requests</p>
          </div>
          <button
            onClick={() => setIsAddLeaveModalOpen(true)}
            className="px-4 py-2 bg-brand text-white text-xs font-bold rounded-xl hover:bg-[#0E4D41] transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Apply For Leave
          </button>
        </div>

        {/* Requests Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-3 bg-white rounded-2xl border border-slate-100">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <p className="text-sm font-semibold text-[#203430]">Loading leave timeline from backend...</p>
          </div>
        ) : (
          <Card className="p-4 border-none shadow-sm rounded-2xl bg-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 w-full max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff name or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-brand"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Leave Type:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold text-[#203430]"
                >
                  <option value="All">All Types</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Other Leave">Other Leave</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <th className="pb-3 px-3">Employee</th>
                    <th className="pb-3 px-3">Type</th>
                    <th className="pb-3 px-3">Period Range</th>
                    <th className="pb-3 px-3">Duration</th>
                    <th className="pb-3 px-3">Reason</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredActivities.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                        No leave applications found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredActivities.map((act) => (
                      <tr key={act.record_id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img src={act.avatar} className="h-8 w-8 rounded-full object-cover border" />
                            <div>
                              <p className="font-bold text-[#203430]">{act.name}</p>
                              <p className="text-[10px] text-slate-400">{act.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{act.type}</td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{act.period}</td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{act.duration}</td>
                        <td className="py-3 px-3 font-medium text-slate-600 max-w-xs truncate">{act.reason}</td>
                        <td className="py-3 px-3">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              act.status === "Approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : act.status === "Pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            )}
                          >
                            {act.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {act.status === "Pending" ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleUpdateStatus(act.record_id, "Approved")}
                                className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition-all"
                                title="Approve Leave"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(act.record_id, "Rejected")}
                                className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-lg transition-all"
                                title="Reject Leave"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-400">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Apply Leave Modal */}
        {isAddLeaveModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-bold text-[#203430]">Submit Leave Application</h3>
                <button onClick={() => setIsAddLeaveModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Leave Type</label>
                  <select
                    value={createLeaveType}
                    onChange={(e) => setCreateLeaveType(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-semibold text-[#203430]"
                  >
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Other Leave">Other Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reason / Justification</label>
                  <textarea
                    rows={3}
                    value={createLeaveReason}
                    onChange={(e) => setCreateLeaveReason(e.target.value)}
                    placeholder="Enter reason for leave request..."
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  onClick={() => setIsAddLeaveModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubmitLeave}
                  className="px-4 py-2 text-xs font-bold text-white bg-brand hover:bg-[#0E4D41] rounded-xl shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
