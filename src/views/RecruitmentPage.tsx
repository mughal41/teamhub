import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/LayoutAddons";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  ChevronDown,
  Plus,
  Briefcase,
  Users,
  UserCheck,
  CheckCircle2,
  X,
  Star,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import {
  getJobPostingsApi,
  getApplicantsApi,
  createJobPostingApi,
  updateApplicantStageApi,
  JobPosting,
  Applicant,
} from "../lib/api/recruitment";

export default function RecruitmentPage() {
  const [jobPostings, setJobPostings] = React.useState<JobPosting[]>([]);
  const [applicants, setApplicants] = React.useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"jobs" | "applicants">("jobs");

  // Job Creator Modal State
  const [isAddJobModalOpen, setIsAddJobModalOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newLocation, setNewLocation] = React.useState("San Francisco, CA");
  const [newType, setNewType] = React.useState("Full-Time");

  const fetchData = React.useCallback(() => {
    setIsLoading(true);
    Promise.all([getJobPostingsApi(), getApplicantsApi()])
      .then(([jobs, apps]) => {
        setJobPostings(jobs);
        setApplicants(apps);
      })
      .catch((err) => console.error("Error fetching recruitment data:", err))
      .finally(() => setIsLoading(false));
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateJob = async () => {
    if (!newTitle.trim()) return;
    try {
      await createJobPostingApi({
        title: newTitle,
        location: newLocation,
        job_type: newType,
        status: "Active",
      });
      fetchData();
      setIsAddJobModalOpen(false);
      setNewTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStage = async (id: string, stage: "Applied" | "Screening" | "Interview" | "Offered" | "Rejected") => {
    try {
      await updateApplicantStageApi(id, stage);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppLayout
      title="Recruitment & Hiring Pipeline"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Recruitment" }]}
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-brand" />
              <span className="text-xs font-bold text-slate-500">Active Job Postings</span>
            </div>
            <p className="text-2xl font-extrabold text-[#203430]">{jobPostings.length} <span className="text-xs font-normal text-slate-400">Open Roles</span></p>
          </Card>
          <Card className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-500">Total Applicants</span>
            </div>
            <p className="text-2xl font-extrabold text-[#203430]">{applicants.length} <span className="text-xs font-normal text-slate-400">Candidates</span></p>
          </Card>
          <Card className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-500">Interviews Scheduled</span>
            </div>
            <p className="text-2xl font-extrabold text-[#203430]">
              {applicants.filter((a) => a.stage === "Interview").length} <span className="text-xs font-normal text-slate-400">Active</span>
            </p>
          </Card>
        </div>

        {/* Action Header & Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("jobs")}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl transition-all",
                activeTab === "jobs" ? "bg-brand text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              Job Openings ({jobPostings.length})
            </button>
            <button
              onClick={() => setActiveTab("applicants")}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl transition-all",
                activeTab === "applicants" ? "bg-brand text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              Applicant Pipeline ({applicants.length})
            </button>
          </div>

          {activeTab === "jobs" && (
            <button
              onClick={() => setIsAddJobModalOpen(true)}
              className="px-4 py-2 bg-brand text-white text-xs font-bold rounded-xl hover:bg-[#0E4D41] transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Post New Job
            </button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-3 bg-white rounded-2xl border border-slate-100">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <p className="text-sm font-semibold text-[#203430]">Loading recruitment pipeline from backend...</p>
          </div>
        ) : activeTab === "jobs" ? (
          <Card className="p-4 border-none shadow-sm rounded-2xl bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <th className="pb-3 px-3">Job Title</th>
                    <th className="pb-3 px-3">Department</th>
                    <th className="pb-3 px-3">Location</th>
                    <th className="pb-3 px-3">Type</th>
                    <th className="pb-3 px-3">Applicants</th>
                    <th className="pb-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {jobPostings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                        No active job postings found.
                      </td>
                    </tr>
                  ) : (
                    jobPostings.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-3 font-bold text-[#203430]">{job.title}</td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{job.department_name || "General"}</td>
                        <td className="py-3 px-3 font-medium text-slate-600">{job.location}</td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{job.job_type}</td>
                        <td className="py-3 px-3 font-extrabold text-brand">{job.applicants_count} candidates</td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {job.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="p-4 border-none shadow-sm rounded-2xl bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <th className="pb-3 px-3">Candidate</th>
                    <th className="pb-3 px-3">Applied Job</th>
                    <th className="pb-3 px-3">Email</th>
                    <th className="pb-3 px-3">Rating</th>
                    <th className="pb-3 px-3">Pipeline Stage</th>
                    <th className="pb-3 px-3 text-right">Advance Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {applicants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                        No candidates in recruitment pipeline.
                      </td>
                    </tr>
                  ) : (
                    applicants.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-3 font-bold text-[#203430]">{app.name}</td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{app.job_title}</td>
                        <td className="py-3 px-3 font-medium text-slate-600">{app.email}</td>
                        <td className="py-3 px-3">
                          <span className="font-extrabold text-amber-600 flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {app.rating}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              app.stage === "Offered"
                                ? "bg-emerald-100 text-emerald-800"
                                : app.stage === "Interview"
                                ? "bg-blue-100 text-blue-800"
                                : app.stage === "Screening"
                                ? "bg-purple-100 text-purple-800"
                                : app.stage === "Rejected"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            )}
                          >
                            {app.stage}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <select
                            value={app.stage}
                            onChange={(e) => handleUpdateStage(app.id, e.target.value as any)}
                            className="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-semibold text-[#203430] bg-white"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Screening">Screening</option>
                            <option value="Interview">Interview</option>
                            <option value="Offered">Offered</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Modal for New Job Posting */}
        {isAddJobModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-bold text-[#203430]">Post New Job Opening</h3>
                <button onClick={() => setIsAddJobModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Architect"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Employment Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-semibold text-[#203430]"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  onClick={() => setIsAddJobModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateJob}
                  className="px-4 py-2 text-xs font-bold text-white bg-brand hover:bg-[#0E4D41] rounded-xl shadow-sm"
                >
                  Publish Job
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
