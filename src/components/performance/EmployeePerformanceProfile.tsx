import * as React from "react";
import { 
  ArrowLeft, 
  ChevronRight, 
  Award, 
  TrendingUp, 
  Calendar, 
  Users, 
  CheckCircle2, 
  MapPin, 
  Info,
  Layers,
  Sparkles,
  MessageSquare,
  Bookmark
} from "lucide-react";

interface EmployeePerformanceProfileProps {
  employee: {
    name: string;
    id: string;
    role: string;
    subRole: string;
    avatar: string;
    score: number;
    teamwork: number;
    quality: number;
    problem: number;
    time: number;
  };
  onBack: () => void;
}

export function EmployeePerformanceProfile({ employee, onBack }: EmployeePerformanceProfileProps) {
  // Dynamically compute rating out of 5 based on their 100 pt score scale
  const overallRating = (employee.score / 20).toFixed(1);
  const percentileText = employee.score >= 90 ? "Top 5%" : employee.score >= 80 ? "Top 15%" : "Top 30%";
  const statusBadge = employee.score >= 90 ? "Exceeds Expectations" : employee.score >= 80 ? "Meets All Expectations" : "Fully Achieving";

  return (
    <div className="space-y-6 animate-fadeIn p-2 sm:p-4 max-w-7xl mx-auto" id="previous-reports-screen">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#63716E]">
        <span className="hover:text-[#006b5f] transition-colors cursor-pointer" onClick={onBack}>Dashboard</span>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <span className="hover:text-[#006b5f] transition-colors cursor-pointer" onClick={onBack}>Performance</span>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <span className="text-[#006b5f] font-bold">{employee.name}</span>
      </div>

      {/* Profile Header Card */}
      <section className="bg-white border border-[#E5E6E6] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start shadow-sm relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute right-0 top-0 w-24 h-24 bg-[#E4F2D3]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative shrink-0 mx-auto md:mx-0">
          <img 
            alt={employee.name} 
            className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-md bg-brand" 
            src={employee.avatar} 
          />
          <div className="absolute -bottom-2 -right-2 bg-[#006b5f] text-white w-8 h-8 rounded-xl flex items-center justify-center border-4 border-white shadow-sm">
            <CheckCircle2 className="h-4.5 w-4.5 fill-current" />
          </div>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1.5">
                <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#203430] tracking-tight">{employee.name}</h2>
                <span className="px-3 py-1 bg-[#E4F2D3] text-[#0E4D41] text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-full border border-[#0E4D41]/10">
                  {statusBadge}
                </span>
              </div>
              <p className="text-[#63716E] text-sm font-medium">{employee.role} • {employee.id}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-2 lg:pt-0 border-t border-slate-50 lg:border-t-0 text-left">
              <div>
                <p className="text-[10px] text-[#63716E] font-extrabold uppercase tracking-widest mb-1">Department</p>
                <p className="text-13px font-bold text-[#203430]">{employee.subRole}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#63716E] font-extrabold uppercase tracking-widest mb-1">Location</p>
                <p className="text-13px font-bold text-[#203430] whitespace-nowrap">London • UK</p>
              </div>
              <div>
                <p className="text-[10px] text-[#63716E] font-extrabold uppercase tracking-widest mb-1">Cycle</p>
                <p className="text-13px font-bold text-[#203430]">H1 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Snapshot on Left, Competencies on Right */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Hand: Performance Snapshot (KPIs) */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-[#E5E6E6] rounded-2xl p-6 space-y-6 flex flex-col shadow-sm">
          <h3 className="font-sans text-sm font-black text-[#203430] flex items-center gap-2 border-b border-slate-50 pb-3">
            <TrendingUp className="text-[#006b5f] h-5 w-5" />
            Performance Snapshot
          </h3>
          
          <div className="flex-grow space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col">
              <p className="text-[10px] text-[#63716E] font-extrabold uppercase tracking-wide mb-1.5">Overall Rating</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#203430]">{overallRating}</span>
                <span className="text-[#63716E] text-sm">/ 5.0</span>
              </div>
              <p className="text-[#006b5f] font-extrabold text-xs mt-2 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" />
                +2.4% from last quarter
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col">
              <p className="text-[10px] text-[#63716E] font-extrabold uppercase tracking-wide mb-1.5">Percentile Rank</p>
              <span className="text-3xl font-extrabold text-[#006b5f]">{percentileText}</span>
              <p className="text-[#63716E] text-xs mt-1.5 font-medium">Relative to {employee.subRole} average</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-11 h-11 bg-[#E4F2D3] text-[#0E4D41] rounded-xl flex flex-col items-center justify-center font-bold shrink-0">
                <span className="text-[9px] font-black leading-none uppercase">SEP</span>
                <span className="text-sm font-extrabold leading-none mt-1">14</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#203430] truncate">Annual Appraisal</p>
                <p className="text-[11px] text-[#63716E] font-medium mt-0.5">24 days remaining</p>
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={onBack}
            className="w-full bg-[#006b5f] hover:bg-[#005047] text-white rounded-xl py-3.5 font-bold text-sm transition-all focus:ring-4 focus:ring-[#006b5f]/15 cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Right Hand: Competency Matrix (Expanded full row width layout) */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-[#E5E6E6] rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-4 mb-6">
            <h3 className="font-sans text-sm font-black text-[#203430] flex items-center gap-2">
              <Layers className="text-[#006b5f] h-5 w-5" />
              Core Competency Matrix
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#006b5f]" />
                <span className="text-[#63716E] font-medium">{employee.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[#63716E] rounded-full" />
                <span className="text-[#63716E] font-medium">Team Avg</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {/* Competency 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold items-baseline">
                <span className="text-[#203430] uppercase tracking-wide text-[10px]">Technical Expertise</span>
                <span className="text-[#006b5f] font-extrabold">{employee.quality} <span className="text-[#63716E] font-normal">/ 5.0</span></span>
              </div>
              <div className="relative h-2 bg-slate-100 rounded-full w-full overflow-visible">
                <div className="h-full bg-[#E4F2D3] rounded-full" style={{ width: `${employee.quality * 20}%` }} />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#63716E] z-10 hover:scale-x-150 transition-transform" 
                  style={{ left: "82%" }} 
                  title="Team Avg: 4.1" 
                />
              </div>
            </div>

            {/* Competency 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold items-baseline">
                <span className="text-[#203430] uppercase tracking-wide text-[10px]">Strategic Leadership</span>
                <span className="text-[#006b5f] font-extrabold">{((employee.problem + employee.quality) / 2).toFixed(1)} <span className="text-[#63716E] font-normal">/ 5.0</span></span>
              </div>
              <div className="relative h-2 bg-slate-100 rounded-full w-full overflow-visible">
                <div className="h-full bg-[#E4F2D3] rounded-full" style={{ width: "84%" }} />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#63716E] z-10" 
                  style={{ left: "78%" }} 
                  title="Team Avg: 3.9" 
                />
              </div>
            </div>

            {/* Competency 3 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold items-baseline">
                <span className="text-[#203430] uppercase tracking-wide text-[10px]">Stakeholder Management</span>
                <span className="text-[#006b5f] font-extrabold">{employee.teamwork} <span className="text-[#63716E] font-normal">/ 5.0</span></span>
              </div>
              <div className="relative h-2 bg-slate-100 rounded-full w-full overflow-visible">
                <div className="h-full bg-[#E4F2D3] rounded-full" style={{ width: `${employee.teamwork * 20}%` }} />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#63716E] z-10" 
                  style={{ left: "85%" }} 
                  title="Team Avg: 4.2" 
                />
              </div>
            </div>

            {/* Competency 4 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold items-baseline">
                <span className="text-[#203430] uppercase tracking-wide text-[10px]">Analytical Thinking</span>
                <span className="text-[#006b5f] font-extrabold">{employee.problem} <span className="text-[#63716E] font-normal">/ 5.0</span></span>
              </div>
              <div className="relative h-2 bg-slate-100 rounded-full w-full overflow-visible">
                <div className="h-full bg-[#E4F2D3] rounded-full" style={{ width: `${employee.problem * 20}%` }} />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#63716E] z-10" 
                  style={{ left: "88%" }} 
                  title="Team Avg: 4.4" 
                />
              </div>
            </div>

            {/* Competency 5 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold items-baseline">
                <span className="text-[#203430] uppercase tracking-wide text-[10px]">Adaptability</span>
                <span className="text-[#006b5f] font-extrabold">{employee.time} <span className="text-[#63716E] font-normal">/ 5.0</span></span>
              </div>
              <div className="relative h-2 bg-slate-100 rounded-full w-full overflow-visible">
                <div className="h-full bg-[#E4F2D3] rounded-full" style={{ width: `${employee.time * 20}%` }} />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#63716E] z-10" 
                  style={{ left: "80%" }} 
                  title="Team Avg: 4.0" 
                />
              </div>
            </div>

            {/* Competency 6 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold items-baseline">
                <span className="text-[#203430] uppercase tracking-wide text-[10px]">Project Execution</span>
                <span className="text-[#006b5f] font-extrabold">{((employee.quality + employee.time) / 2).toFixed(1)} <span className="text-[#63716E] font-normal">/ 5.0</span></span>
              </div>
              <div className="relative h-2 bg-slate-100 rounded-full w-full overflow-visible">
                <div className="h-full bg-[#E4F2D3] rounded-full" style={{ width: "92%" }} />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#63716E] z-10" 
                  style={{ left: "84%" }} 
                  title="Team Avg: 4.2" 
                />
              </div>
            </div>
          </div>

          {/* Expert Quote Summary */}
          <div className="mt-8 p-4 bg-[#006b5f]/5 rounded-xl border border-[#006b5f]/10 flex items-start gap-3">
            <Info className="h-5 w-5 text-[#006b5f] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#203430] leading-relaxed">
              <span className="font-extrabold text-[#006b5f]">Analyst Insight:</span> {employee.name}'s performance remains significantly above the peer benchmark in cross-functional coordination. Strategic expansion of direct responsibilities is recommended.
            </p>
          </div>
        </div>
      </div>

      {/* Full Rows: 360-Degree Feedback Summary */}
      <section className="bg-white border border-[#E5E6E6] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
          <h3 className="font-sans text-sm font-black text-[#203430] flex items-center gap-2">
            <Users className="text-[#006b5f] h-5 w-5" />
            360-Degree Feedback Summary
          </h3>
          <span className="text-xs font-bold text-[#006b5f] hover:underline cursor-pointer">View Detailed Feedbacks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50/75 p-4 rounded-xl border border-slate-100 text-center">
            <p className="text-[10px] text-[#63716E] font-extrabold uppercase tracking-widest mb-1">Peers Feedback</p>
            <p className="text-2xl font-black text-[#203430]">4.8 <span className="text-xs font-medium text-[#63716E]">/ 5</span></p>
            <span className="inline-flex mt-1 text-[10px] items-center gap-1 font-bold text-[#006b5f]">"Highly Reliable"</span>
          </div>

          <div className="bg-slate-50/75 p-4 rounded-xl border border-slate-100 text-center">
            <p className="text-[10px] text-[#63716E] font-extrabold uppercase tracking-widest mb-1">Manager Rating</p>
            <p className="text-2xl font-black text-[#203430]">4.9 <span className="text-xs font-medium text-[#63716E]">/ 5</span></p>
            <span className="inline-flex mt-1 text-[10px] items-center gap-1 font-bold text-[#006b5f]">"Strategic Asset"</span>
          </div>

          <div className="bg-slate-50/75 p-4 rounded-xl border border-slate-100 text-center">
            <p className="text-[10px] text-[#63716E] font-extrabold uppercase tracking-widest mb-1">Direct Reports</p>
            <p className="text-2xl font-black text-[#203430]">4.6 <span className="text-xs font-medium text-[#63716E]">/ 5</span></p>
            <span className="inline-flex mt-1 text-[10px] items-center gap-1 font-bold text-[#006b5f]">"Strong Mentor"</span>
          </div>
        </div>

        {/* Detailed peer feedbacks columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100/70 border-l-4 border-l-[#006b5f]">
            <div className="flex items-center gap-3 mb-2.5">
              <img 
                alt="Marcus Thorne" 
                className="w-8 h-8 rounded-full object-cover shadow-sm" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfJRwzCOJgUt0vGOS59-6YQfDjHrrxbXh9euyvIYmhT1-qD8YceeW6zzhhSX86Qk54T0RZSTF6L5EoBIxNrl34pWLDdDtxLulxktGQDZQx02jDgpcL_hOVn8ZWn_hxm3WDfBegEmrH6SASHM4hRVJGo1EwfOhiTUNOhGfrn7PsHd4XN384-yJ4r0JOsZdl1ae01WJbBn4K6wvhvWblh9zzXeQvQA_1Ck9BQUgPoxMiaTWZ82TwkX9b1CTUgWRh8EMVriHhsoSuhF8" 
              />
              <div>
                <p className="text-xs font-extrabold text-[#203430]">Marcus Thorne</p>
                <p className="text-[10px] text-[#63716E] font-medium leading-none mt-1">Marketing Director</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#63716E] italic leading-relaxed">
              "{employee.name} consistently delivers excellent product outputs ahead of standard sprint cycles. Her user-centered execution was a key driver of our Q2 accomplishments."
            </p>
          </div>

          <div className="bg-slate-50/40 p-4 rounded-xl border border-slate-100/70 border-l-4 border-l-[#A4ACAB]">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E5E6E6] text-[#203430] font-black text-xs flex items-center justify-center shadow-sm">
                AL
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#203430]">Aria Lee</p>
                <p className="text-[10px] text-[#63716E] font-medium leading-none mt-1">Content Strategist</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#63716E] italic leading-relaxed">
              "An extremely helpful colleague who always takes the extra minute to advise team members. Her systematic design workflows dramatically upgraded our velocity."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
