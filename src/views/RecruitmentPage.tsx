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
  Briefcase,
  Monitor,
  Users,
  CheckCircle,
  X,
  FileText,
  MessageSquare,
  UserCheck,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  MapPin,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { cn } from "@/src/lib/utils";
import { getCollection, saveCollection } from "../lib/db";

/*
 * EXPECTED JSON SCHEMA / RECORD FORMAT FOR RECRUITMENT DATABASE MODULE CORES:
 *
 * 1. Candidates Store (db_candidates)
 * Type: Array<ApplicantProfile>
 * Schema structure:
 * [
 *   {
 *     "id": "CAN-0043",                      // String: Unique application operational reference identifier
 *     "name": "Anya Rodriguez",              // String: Full legal name of candidate
 *     "email": "anya.rodriguez@domain.com",  // String: Primary email correspondence address
 *     "job": "Lead UI/UX Architect",         // String: Designation title for the candidate applied position
 *     "subJob": "Product Design",            // String: Organizational unit / department name Grouping (e.g., "Product Design", "Marketing", "R&D", "Human Resources", "Operations", "Customer Service")
 *     "date": "15 Jun 2035",                 // String: Display application registration date
 *     "type": "Full-Time",                   // String: Work arrangements ("Full-Time", "Part-Time", "Internship")
 *     "model": "Hybrid",                     // String: Baseline operational mode ("Remote", "Hybrid", "On-Site")
 *     "stage": 3,                            // Number: Funnel tracker stage index:
 *                                            //   1: Application Received, 2: Interview Scheduled,
 *                                            //   3: Final Interview, 4: Test Completed, 5: Hired
 *     "avatar": "https://images.unsplash...", // String: Valid profile image photograph URL
 *     "source": "LinkedIn"                   // String: Referral / acquisition medium ("Job Portal", "Company Website", "Employee Referral", "Social Media (LinkedIn)")
 *   }
 * ]
 *
 * 2. Active Vacancies Store (db_jobs)
 * Type: Array<JobProfile>
 * Schema structure:
 * [
 *   {
 *     "title": "Lead UI/UX Architect",       // String: Role name designation
 *     "type": "Full-Time",                   // String: Format ("Full-Time", "Part-Time")
 *     "model": "Hybrid",                     // String: Environment ("Remote", "Hybrid", "On-Site")
 *     "applicants": "14 Applicants",         // String: Descriptive counters label
 *     "color": "text-[#0E4D41]"              // String: Visual representation theme color classes
 *   }
 * ]
 *
 * 3. Bookings Schedules Store (db_schedules)
 * Type: Array<InterviewSchedule>
 * Schema structure:
 * [
 *   {
 *     "time": "10:30 AM - 11:30 AM",         // String: Absolute timing window representation
 *     "title": "Technical Assessment",        // String: Event category description
 *     "subtitle": "Anya Rodriguez (UI UX)",  // String: Short context synopsis details
 *     "avatar": "https://images.unsplash..."// String: Thumbnail photo URL
 *   }
 * ]
 */

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  const [applicantListStore, setApplicantListStoreState] = React.useState<any[]>(() => {
    return getCollection<any[]>("db_candidates", []);
  });

  const setApplicantListStore = (update: any[] | ((prev: any[]) => any[])) => {
    if (typeof update === "function") {
      setApplicantListStoreState((prev) => {
        const next = update(prev);
        saveCollection("db_candidates", next);
        return next;
      });
    } else {
      saveCollection("db_candidates", update);
      setApplicantListStoreState(update);
    }
  };

  const [jobsList, setJobsListState] = React.useState<any[]>(() => {
    return getCollection<any[]>("db_jobs", []);
  });

  const [schedulesStore, setSchedulesStoreState] = React.useState<any[]>(() => {
    return getCollection<any[]>("db_schedules", []);
  });

  React.useEffect(() => {
    const handleDbUpdate = () => {
      setApplicantListStoreState(getCollection<any[]>("db_candidates", []));
      setJobsListState(getCollection<any[]>("db_jobs", []));
      setSchedulesStoreState(getCollection<any[]>("db_schedules", []));
    };

    window.addEventListener("storage", handleDbUpdate);
    window.addEventListener("db_updated", handleDbUpdate);

    return () => {
      window.removeEventListener("storage", handleDbUpdate);
      window.removeEventListener("db_updated", handleDbUpdate);
    };
  }, []);

  const filteredApplicants = applicantListStore.filter((a) => {
    const nameMatch = a.name ? a.name.toLowerCase() : "";
    const jobMatch = a.job ? a.job.toLowerCase() : "";
    const emailMatch = a.email ? a.email.toLowerCase() : "";
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      nameMatch.includes(query) ||
      jobMatch.includes(query) ||
      emailMatch.includes(query);

    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Application Received" && a.stage === 1) ||
      (activeTab === "Interview Scheduled" && a.stage === 2) ||
      (activeTab === "Final Interview" && a.stage === 3) ||
      (activeTab === "Test Completed" && a.stage === 4);
    return matchesSearch && matchesTab;
  });

  // Calculate dynamic KPIs from live core database metrics
  const totalApplicants = applicantListStore.length;
  const interviewedCount = applicantListStore.filter((a) => a.stage >= 2 && a.stage !== 5).length;
  const hiredCount = applicantListStore.filter((a) => a.stage === 5).length;

  const interviewedPct = totalApplicants > 0 ? ((interviewedCount / totalApplicants) * 100).toFixed(1) : "0.0";
  const hiredPct = totalApplicants > 0 ? ((hiredCount / totalApplicants) * 100).toFixed(1) : "0.0";

  const dynamicApplicationData = React.useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts: Record<string, number> = {};
    months.forEach((m) => { counts[m] = 0; });

    applicantListStore.forEach((a) => {
      if (a.date) {
        const parts = String(a.date).split(" ");
        if (parts.length >= 2) {
          const mon = parts[1].substring(0, 3);
          const formattedMonth = mon.charAt(0).toUpperCase() + mon.slice(1).toLowerCase();
          if (counts[formattedMonth] !== undefined) {
            counts[formattedMonth]++;
          }
        }
      }
    });

    return months.map((m) => ({ month: m, count: counts[m] }));
  }, [applicantListStore]);

  const dynamicDeptData = React.useMemo(() => {
    const departments = [
      { name: "Human Resources", count: 0 },
      { name: "Marketing", count: 0 },
      { name: "Product Design", count: 0 },
      { name: "R&D", count: 0 },
      { name: "Operations", count: 0 },
      { name: "Customer Service", count: 0 },
    ];

    applicantListStore.forEach((a) => {
      const deptName = a.subJob || a.dept || "";
      const found = departments.find((d) => d.name.toLowerCase() === deptName.toLowerCase());
      if (found) {
        found.count++;
      } else {
        const subMatch = departments.find((d) =>
          deptName.toLowerCase().includes(d.name.toLowerCase()) ||
          d.name.toLowerCase().includes(deptName.toLowerCase())
        );
        if (subMatch) {
          subMatch.count++;
        }
      }
    });

    return departments;
  }, [applicantListStore]);

  const dynamicResourcesData = React.useMemo(() => {
    const sources = [
      { label: "Job Portal", count: 0 },
      { label: "Company Website", count: 0 },
      { label: "Employee Referral", count: 0 },
      { label: "Social Media (LinkedIn)", count: 0 },
    ];

    applicantListStore.forEach((a) => {
      const sourceVal = a.source || "Job Portal";
      const found = sources.find((s) => s.label.toLowerCase() === sourceVal.toLowerCase());
      if (found) {
        found.count++;
      } else {
        const matched = sources.find((s) =>
          sourceVal.toLowerCase().includes(s.label.toLowerCase().replace(" (linkedin)", ""))
        );
        if (matched) {
          matched.count++;
        } else {
          sources[0].count++;
        }
      }
    });

    return sources.map((s) => ({
      label: s.label,
      percentage: totalApplicants > 0 ? Math.round((s.count / totalApplicants) * 100) : 0,
      val: s.count,
    }));
  }, [applicantListStore, totalApplicants]);
  return (
    <AppLayout
      title="Recruitment"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Recruitment" },
      ]}
    >
      <div className="space-y-5">
        {/* Top Summary Section */}
        <div className="flex flex-col xl:flex-row gap-5">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Total Applicants Card */}
            <Card className="p-4 border-none rounded-[16px] bg-[#E4F2D3] shadow-sm flex flex-col justify-center relative overflow-hidden">
              <div className="z-10">
                <div className="bg-[#0E4D41] h-10 w-10 rounded-lg flex items-center justify-center mb-4 text-white">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[40px] font-bold text-[#203430] leading-none">
                    {totalApplicants}
                  </span>
                  <div className="bg-brand px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <span className="text-[11px] font-bold text-white tracking-tighter">
                      {totalApplicants > 0 ? "+4.8%" : "0.0%"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#63716E]">
                    vs last month
                  </span>
                  <span className="text-[11px] text-[#63716E] font-medium mt-2 uppercase tracking-wide">
                    Total Applicants
                  </span>
                </div>
              </div>
              <div className="absolute right-[-10px] top-[-10px] opacity-10">
                <Users className="h-32 w-32 text-[#0E4D41]" />
              </div>
            </Card>

            {/* Interviewed Card */}
            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-[#F7F7F7] flex items-center justify-center text-brand">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <span className="text-[11px] text-[#63716E]">Interviewed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[40px] font-bold text-[#203430] leading-none">
                  {interviewedCount}
                </span>
                <div className="bg-[#E4F2D3] px-2 py-1 rounded-[6px] flex flex-col items-center">
                  <span className="text-[12px] font-black text-[#0E4D41]">
                    {interviewedPct}%
                  </span>
                  <span className="text-[8px] text-[#63716E] uppercase">
                    of applicants
                  </span>
                </div>
              </div>
            </Card>

            {/* Hired Card */}
            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-[#F7F7F7] flex items-center justify-center text-brand">
                  <UserCheck className="h-6 w-6" />
                </div>
                <span className="text-[11px] text-[#63716E]">Hired</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[40px] font-bold text-[#203430] leading-none">
                  {hiredCount}
                </span>
                <div className="bg-[#E4F2D3] px-2 py-1 rounded-[6px] flex flex-col items-center">
                  <span className="text-[12px] font-black text-[#0E4D41]">
                    {hiredPct}%
                  </span>
                  <span className="text-[8px] text-[#63716E] uppercase">
                    of applicants
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Application Line Chart */}
          <Card className="xl:w-[349px] p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col min-h-[196px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-bold text-[#203430]">
                Application
              </h3>
              <button className="flex items-center gap-2 bg-[#F7F7F7] px-2 py-1 rounded-[6px] text-[11px] font-medium text-[#203430]">
                Last 12 Months <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <div className="flex-1 min-h-0 flex flex-col justify-center">
              {totalApplicants === 0 ? (
                <div className="py-4 text-center flex flex-col items-center justify-center h-full">
                  <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-2">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h4 className="text-[11px] font-bold text-[#203430]">
                    No Application Trends
                  </h4>
                  <p className="text-[9px] text-[#63716E] max-w-[190px] mt-0.5 leading-relaxed">
                    Once candidates submit resources, real-time monthly stats map here.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart
                    data={dynamicApplicationData}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#35BFA3" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#35BFA3" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: "#63716E" }}
                    />
                    <YAxis hide />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#35BFA3"
                      fillOpacity={1}
                      fill="url(#colorCount)"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#35BFA3", strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>

        {/* Second Row: Vacancies and Dept Distribution */}
        <div className="flex flex-col xl:flex-row gap-5">
          {/* Current Vacancies Grid */}
          <div className="flex-1 space-y-5">
            <div className="bg-white rounded-[16px] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-bold text-[#203430]">
                  Current Vacancies
                </h2>
                <button className="flex items-center gap-2 bg-[#E4F2D3] h-8 px-3 rounded-[8px] text-[12px] font-medium text-[#203430]">
                  <Filter className="h-4 w-4" /> Filter{" "}
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobsList.length === 0 ? (
                  <div className="col-span-2 p-8 text-center bg-slate-50 border border-slate-100 rounded-[12px] flex flex-col items-center justify-center space-y-2">
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-slate-200 text-slate-400">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <h4 className="text-[11px] font-bold text-[#203430] mt-1">
                      No Active Vacancies Listed
                    </h4>
                    <p className="text-[9px] text-slate-500 leading-relaxed max-w-sm mx-auto">
                      All organizational hiring requirements have been fulfilled. Connect with internal systems to post new vacancies.
                    </p>
                  </div>
                ) : (
                  jobsList.map((job) => (
                    <div
                      key={job.title}
                      className="p-4 bg-[#F7F7F7] rounded-[12px] space-y-3"
                    >
                      <h3 className={cn("text-[14px] font-bold", job.color)}>
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5 text-[#63716E]" />
                          <span className="text-[10px] text-[#63716E] font-medium">
                            {job.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Monitor className="h-3.5 w-3.5 text-[#63716E]" />
                          <span className="text-[10px] text-[#63716E] font-medium">
                            {job.model}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-[#63716E]" />
                          <span className="text-[10px] text-[#63716E] font-medium">
                            {job.applicants}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Application by Department Bar Chart */}
          <Card className="xl:w-[349px] p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col min-h-[230px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold text-[#203430]">
                Application by Department
              </h3>
              <button>
                <MoreHorizontal className="h-4 w-4 text-[#63716E]" />
              </button>
            </div>
            <div className="flex-1 min-h-0 flex flex-col justify-center">
              {totalApplicants === 0 ? (
                <div className="py-6 text-center flex flex-col items-center justify-center h-full">
                  <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-2">
                    <Users className="h-4 w-4" />
                  </div>
                  <h4 className="text-[11px] font-bold text-[#203430]">
                    No Departmental Data
                  </h4>
                  <p className="text-[9px] text-[#63716E] max-w-[190px] mt-0.5 leading-relaxed">
                    Resumes are automatically indexed by operational unit once submitted.
                  </p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart
                      data={dynamicDeptData}
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                      <XAxis hide />
                      <Bar
                        dataKey="count"
                        fill="#35BFA3"
                        radius={[4, 4, 0, 0]}
                        barSize={25}
                      >
                        {dynamicDeptData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === 2
                                ? "#35BFA3"
                                : index === 4
                                  ? "#0E4D41"
                                  : "#35BFA3"
                            }
                            opacity={index === 0 || index === 5 ? 0.6 : 1}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 justify-center">
                    {dynamicDeptData.map((d) => (
                      <div key={d.name} className="flex flex-col items-center">
                        <span className="text-[8px] text-[#63716E] text-center w-12 truncate">
                          {d.name}
                        </span>
                        <span className="text-[10px] font-bold text-[#203430]">
                          {d.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Third Row: Main Content & Sidebar */}
        <div className="flex flex-col xl:flex-row gap-5">
          {/* Applicants Table Section */}
          <div className="flex-1 flex flex-col space-y-5">
            <Card className="border-none rounded-[16px] bg-white shadow-sm overflow-hidden p-0 flex flex-col min-h-[418px]">
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-[#E5E6E6]">
                <div className="flex items-center gap-3">
                  <h2 className="text-[16px] font-bold text-[#203430]">
                    Applicants
                  </h2>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#A4ACAB]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search candidates..."
                      className="pl-8 pr-2.5 py-1 text-[11px] bg-[#F7F7F7] border-none rounded-[8px] text-[#203430] placeholder-[#A4ACAB] focus:ring-1 focus:ring-brand focus:bg-white transition-all w-44 outline-none font-medium"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 p-1 bg-[#F7F7F7] rounded-[8px]">
                  {[
                    "All",
                    "Application Received",
                    "Interview Scheduled",
                    "Final Interview",
                    "Test Completed",
                  ].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "px-3 py-1 text-[11px] font-black rounded-[6px] transition-all cursor-pointer border-none",
                        tab === activeTab
                          ? "bg-[#203430] text-white shadow-sm"
                          : "text-[#757575] hover:text-[#203430]",
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#F7F7F7]">
                    <tr>
                      <th className="px-5 py-3 w-10">
                        <div className="h-3 w-3 rounded-[3px] border border-brand bg-brand flex items-center justify-center">
                          <div className="h-[1px] w-1.5 bg-white" />
                        </div>
                      </th>
                      <th className="px-5 py-3 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                        Name <ArrowUpDown className="h-3 w-3 inline ml-1" />
                      </th>
                      <th className="px-5 py-3 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap">
                        Job Title{" "}
                        <ArrowUpDown className="h-3 w-3 inline ml-1" />
                      </th>
                      <th className="px-5 py-3 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap text-center">
                        Applied Date{" "}
                        <ArrowUpDown className="h-3 w-3 inline ml-1" />
                      </th>
                      <th className="px-5 py-3 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap text-center">
                        Application Received{" "}
                        <ArrowUpDown className="h-3 w-3 inline ml-1" />
                      </th>
                      <th className="px-5 py-3 text-[10px] font-black text-[#63716E] uppercase whitespace-nowrap text-center">
                        Status (Stage){" "}
                        <ArrowUpDown className="h-3 w-3 inline ml-1" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E6E6]">
                    {filteredApplicants.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-16 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-sm text-slate-400 mx-auto">
                              <Users className="h-4 w-4" />
                            </div>
                            <p className="text-[12px] font-bold text-[#203430] mt-1">
                              No Active Job Candidates Listed
                            </p>
                            <p className="text-[10px] text-[#63716E] max-w-sm mx-auto leading-relaxed">
                              There are currently no processing resumes or recruitment workflows in the queue.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredApplicants.map((a, i) => (
                        <tr
                          key={i}
                          className={cn(
                            "hover:bg-[#F7F7F7]/50 transition-colors h-[60px]",
                            a.name === "Lala Wijaya" ? "bg-white" : "bg-white",
                          )}
                        >
                          <td className="px-5 py-2">
                            <div
                              className={cn(
                                "h-3 w-3 rounded-[3px] border",
                                a.name === "Anya Rodriguez"
                                  ? "bg-brand border-brand flex items-center justify-center"
                                  : "bg-[#F7F7F7] border-[#E5E6E6]",
                              )}
                            >
                              {a.name === "Anya Rodriguez" && (
                                <div className="h-[1px] w-1.5 bg-white" />
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={a.avatar}
                                className="h-8 w-8 rounded-full border border-gray-100 object-cover"
                              />
                              <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-[#203430] leading-none">
                                  {a.name}
                                </span>
                                <span className="text-[10px] text-[#63716E] mt-1 font-medium">
                                  {a.email}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-2">
                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-[#203430] leading-none">
                                {a.job}
                              </span>
                              <span className="text-[10px] text-[#63716E] mt-1 font-medium">
                                {a.subJob}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-2 text-center">
                            <span className="text-[11px] font-bold text-[#203430]">
                              {a.date}
                            </span>
                          </td>
                          <td className="px-5 py-2">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-[11px] font-bold text-[#203430] whitespace-nowrap">
                                {a.type}
                              </span>
                              <div
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                  a.model === "Remote"
                                    ? "bg-[#F7F7F7] text-[#63716E]"
                                    : a.model === "Hybrid"
                                      ? "bg-[#E4F2D3] text-[#0E4D41]"
                                      : "bg-[#0E4D41] text-white",
                                )}
                              >
                                {a.model}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-2">
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-[10px] font-medium text-[#63716E]">
                                {a.stage === 1
                                  ? "Application Received"
                                  : a.stage === 2
                                    ? "Interview Scheduled"
                                    : a.stage === 3
                                      ? "Final Interview"
                                      : a.stage === 4
                                        ? "Test Completed"
                                        : "Hired"}
                              </span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <div
                                    key={s}
                                    className={cn(
                                      "h-4 w-5 flex items-center justify-center text-[8px] font-bold rounded-[2px]",
                                      s <= a.stage
                                        ? "bg-brand text-white"
                                        : "bg-[#F7F7F7] text-[#A4ACAB]",
                                    )}
                                  >
                                    {s}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-5 border-t border-[#E5E6E6] flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-[14px] text-[#63716E]">Show</span>
                  <button className="flex items-center gap-2 bg-[#F7F7F7] h-[28px] px-3 rounded-[8px] text-[12px] font-bold text-[#203430]">
                    7 <ChevronDown className="h-3 w-3" />
                  </button>
                  <span className="text-[14px] text-[#63716E]">
                    of 102 results
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F5F5F5] text-[#203430] opacity-50 cursor-not-allowed">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-brand text-white text-[12px] font-bold">
                    1
                  </button>
                  <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F7F7F7] text-[#203430] text-[12px] font-bold">
                    2
                  </button>
                  <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F7F7F7] text-[#203430] text-[12px] font-bold">
                    3
                  </button>
                  <span className="px-1 text-[12px] text-[#63716E]">...</span>
                  <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F7F7F7] text-[#203430] text-[12px] font-bold">
                    11
                  </button>
                  <button className="h-7 w-7 flex items-center justify-center rounded-[8px] bg-[#F7F7F7] text-[#203430] hover:bg-brand hover:text-white transition-all">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Sidebar Section */}
          <div className="xl:w-[272px] space-y-5">
            {/* Applicant Resources Card */}
            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm space-y-4 min-h-[250px]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[14px] font-bold text-[#203430]">
                  Applicant Resources
                </h3>
                <button>
                  <MoreHorizontal className="h-4 w-4 text-[#63716E]" />
                </button>
              </div>
              <div className="relative h-[180px] flex flex-col justify-center">
                {totalApplicants === 0 ? (
                  <div className="py-6 text-center flex flex-col items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-2">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <h4 className="text-[11px] font-bold text-[#203430]">
                      No Acquisition Sources
                    </h4>
                    <p className="text-[9px] text-[#63716E] max-w-[190px] mt-0.5 leading-relaxed">
                      Referral channels and job portals will map dynamically upon sign-ups.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 relative h-full">
                    {/* Vertical Grid Lines BG */}
                    <div className="absolute inset-0 flex justify-between px-2 pt-8 pointer-events-none opacity-50">
                      <div className="w-[1px] h-full border-l border-dashed border-[#E5E6E6]" />
                      <div className="w-[1px] h-[80%] border-l border-dashed border-[#E5E6E6]" />
                      <div className="w-[1px] h-[80%] border-l border-dashed border-[#E5E6E6]" />
                      <div className="w-[1px] h-[80%] border-l border-dashed border-[#E5E6E6]" />
                    </div>
                    {dynamicResourcesData.map((res) => (
                      <div key={res.label} className="space-y-1 relative z-10">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[11px] font-bold text-[#203430]">
                            {res.label}
                          </span>
                          <div className="flex items-center gap-1.5 translate-x-1">
                            <span className="text-[11px] text-[#63716E]">
                              {res.percentage}%
                            </span>
                            <div className="h-2.5 w-px bg-[#E5E6E6]" />
                            <span className="text-[11px] font-bold text-[#203430]">
                              {res.val}
                            </span>
                          </div>
                        </div>
                        <div className="h-2.5 w-full bg-[#E5E6E6] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#35BFA3] rounded-full"
                            style={{
                              width: `${res.percentage}%`,
                              backgroundColor:
                                res.label === "Job Portal" ? "#0E4D41" : "#35BFA3",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between px-2 pt-2 absolute bottom-0 left-0 right-0">
                      {["0", "25", "50", "75", "100"].map((v) => (
                        <span key={v} className="text-[9px] text-[#63716E]">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Schedules Card */}
            <Card className="p-4 border-none rounded-[16px] bg-white shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-[#203430]">
                  Schedules
                </h3>
                <button>
                  <MoreHorizontal className="h-4 w-4 text-[#63716E]" />
                </button>
              </div>

              {/* Mini Calendar View */}
              <div className="bg-[#F7F7F7] rounded-[12px] p-3 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <button className="bg-white p-1 rounded-[6px] shadow-sm">
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <span className="text-[12px] font-bold text-[#203430]">
                    June 2035
                  </span>
                  <button className="bg-white p-1 rounded-[6px] shadow-sm">
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="grid grid-cols-7 text-center gap-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <span
                      key={`${d}-${i}`}
                      className="text-[8px] text-[#63716E]"
                    >
                      {d}
                    </span>
                  ))}
                  {[17, 18, 19, 20, 21, 22, 23].map((d) => (
                    <div
                      key={d}
                      className={cn(
                        "h-7 w-6 mx-auto flex items-center justify-center rounded-[6px] text-[10px] font-bold",
                        d === 20 ? "bg-brand text-white" : "text-[#203430]",
                      )}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vertical List */}
              <div className="space-y-4">
                {schedulesStore.length === 0 ? (
                  <div className="py-8 text-center text-[10px] text-slate-400">
                    No interviews scheduled today.
                  </div>
                ) : (
                  schedulesStore.map((s, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full border-2 border-brand bg-white" />
                        {idx !== schedulesStore.length - 1 && (
                          <div className="w-px flex-1 bg-[#E5E6E6] my-1" />
                        )}
                      </div>
                      <div className="flex-1 bg-[#E4F2D3]/30 border-l border-brand p-3 rounded-r-[12px] rounded-bl-[12px]">
                        <span className="text-[9px] font-medium text-brand">
                          {s.time}
                        </span>
                        <h4 className="text-[12px] font-bold text-[#203430] mt-0.5">
                          {s.title}
                        </h4>
                        <p className="text-[10px] text-[#63716E] mt-0.5">
                          {s.subtitle}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <footer className="mt-20 py-8 border-t border-[#E5E6E6] flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
        <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-16">
          <p className="text-[12px] font-bold text-[#203430]">
            Copyright © 2025 Peterdraw
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Term and conditions", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[12px] text-[#63716E] hover:text-brand transition-colors whitespace-nowrap"
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
    </AppLayout>
  );
}
