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
  TrendingUp,
  Award,
  CheckCircle2,
  X,
  Star,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import {
  getPerformanceReviewsApi,
  updateReviewStatusApi,
  PerformanceReview as ApiPerformanceReview,
} from "../lib/api/performance";

export default function PerformancePage() {
  const [reviews, setReviewsState] = React.useState<ApiPerformanceReview[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchPerformanceData = React.useCallback(() => {
    setIsLoading(true);
    getPerformanceReviewsApi()
      .then((data) => setReviewsState(data))
      .catch((err) => console.error("Error fetching performance reviews:", err))
      .finally(() => setIsLoading(false));
  }, []);

  React.useEffect(() => {
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  const handleUpdateStatus = async (id: string, newStatus: "Approved" | "Pending" | "Submitted") => {
    try {
      await updateReviewStatusApi(id, newStatus);
      fetchPerformanceData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredReviews = React.useMemo(() => {
    return reviews.filter(
      (r) =>
        r.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.employee_role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.review_cycle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reviews, searchTerm]);

  const avgRating = React.useMemo(() => {
    if (reviews.length === 0) return "0.0";
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <AppLayout
      title="Performance Management"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Performance" }]}
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-slate-500">Average Performance Rating</span>
            </div>
            <p className="text-2xl font-extrabold text-[#203430]">{avgRating} <span className="text-xs font-normal text-slate-400">/ 5.0</span></p>
          </Card>
          <Card className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-brand" />
              <span className="text-xs font-bold text-slate-500">Active Review Cycle</span>
            </div>
            <p className="text-2xl font-extrabold text-[#203430]">Mid-Year 2026</p>
          </Card>
          <Card className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-500">Reviews Submitted</span>
            </div>
            <p className="text-2xl font-extrabold text-[#203430]">{reviews.length} <span className="text-xs font-normal text-slate-400">Records</span></p>
          </Card>
        </div>

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[#203430]">Employee Performance Reviews</h2>
            <p className="text-xs text-[#63716E]">Track quarterly appraisals, competency ratings, and approval decisions</p>
          </div>
        </div>

        {/* Reviews Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-3 bg-white rounded-2xl border border-slate-100">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <p className="text-sm font-semibold text-[#203430]">Loading performance evaluations from backend...</p>
          </div>
        ) : (
          <Card className="p-4 border-none shadow-sm rounded-2xl bg-white">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff name or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <th className="pb-3 px-3">Employee</th>
                    <th className="pb-3 px-3">Cycle</th>
                    <th className="pb-3 px-3">Reviewer</th>
                    <th className="pb-3 px-3">Goals</th>
                    <th className="pb-3 px-3">Rating</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredReviews.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                        No performance records found.
                      </td>
                    </tr>
                  ) : (
                    filteredReviews.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img src={r.employee_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"} className="h-8 w-8 rounded-full object-cover border" />
                            <div>
                              <p className="font-bold text-[#203430]">{r.employee_name || "Employee"}</p>
                              <p className="text-[10px] text-slate-400">{r.employee_role || "Staff"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{r.review_cycle}</td>
                        <td className="py-3 px-3 font-medium text-slate-600">{r.reviewer_name}</td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{r.goals_completed} / {r.total_goals}</td>
                        <td className="py-3 px-3">
                          <span className="font-extrabold text-amber-600 flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {r.rating}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              r.status === "Approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : r.status === "Submitted"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            )}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {r.status !== "Approved" ? (
                            <button
                              onClick={() => handleUpdateStatus(r.id, "Approved")}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition-all font-bold text-[11px]"
                            >
                              Approve Review
                            </button>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-end gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Approved
                            </span>
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
      </div>
    </AppLayout>
  );
}
