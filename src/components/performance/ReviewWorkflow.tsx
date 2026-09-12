import * as React from "react";
import { 
  ArrowLeft, 
  ChevronRight, 
  Code, 
  Users, 
  Clock, 
  Send, 
  Save, 
  ClipboardSignature, 
  History, 
  Lock, 
  Check, 
  AlertCircle, 
  Info, 
  BookOpen, 
  Activity, 
  CheckSquare, 
  ShieldCheck,
  Award,
  Milestone
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ReviewWorkflowProps {
  employee: {
    id: string;
    name: string;
    role: string;
    subRole: string;
    avatar: string;
    score: number;
    teamwork: number;
    quality: number;
    problem: number;
    time: number;
    lastMonthly?: string;
    lastQuarterly?: string;
    lastAnnual?: string;
  };
  selectedPeriod: "monthly" | "quarterly" | "annual";
  onCancel: () => void;
  onPublishSuccess: (updatedEmployee: any) => void;
}

export function ReviewWorkflow({ employee, selectedPeriod, onCancel, onPublishSuccess }: ReviewWorkflowProps) {
  const [activePhase, setActivePhase] = React.useState<1 | 2 | 3>(1); // 1: Lead, 2: Manager, 3: HR
  const [isPublishing, setIsPublishing] = React.useState(false);

  // Phase 1 Form State
  const [techRating, setTechRating] = React.useState<number>(4);
  const [collabRating, setCollabRating] = React.useState<number>(3);
  const [timeRating, setTimeRating] = React.useState<number>(4);
  const [techComment, setTechComment] = React.useState<string>(
    `Great work on the frontend structure. Component reuse speeded up designs by 15%.`
  );
  const [collabComment, setCollabComment] = React.useState<string>("");
  const [timeComment, setTimeComment] = React.useState<string>("");

  // Phase 2 Form State
  const [stratRating, setStratRating] = React.useState<number>(4);
  const [stakeRating, setStakeRating] = React.useState<number>(4);
  const [budgetRating, setBudgetRating] = React.useState<number>(3);
  const [stratComment, setStratComment] = React.useState<string>("");
  const [stakeComment, setStakeComment] = React.useState<string>("");
  const [budgetComment, setBudgetComment] = React.useState<string>("");

  // Phase 3 Form State
  const [orgRating, setOrgRating] = React.useState<number>(4);
  const [ethicsRating, setEthicsRating] = React.useState<number>(5);
  const [pdpRating, setPdpRating] = React.useState<number>(4);
  const [orgComment, setOrgComment] = React.useState<string>("");
  const [ethicsComment, setEthicsComment] = React.useState<string>("");
  const [skillTrackVerified, setSkillTrackVerified] = React.useState<boolean>(true);
  const [certApproved, setCertApproved] = React.useState<boolean>(true);
  const [finalRatingDropdown, setFinalRatingDropdown] = React.useState<string>("Exceeds Expectations");

  // Multi-Phase Points Mathematics
  const leadAvg = (techRating + collabRating + timeRating) / 3;
  const managerAvg = (stratRating + stakeRating + budgetRating) / 3;
  const hrAvg = (orgRating + ethicsRating + pdpRating) / 3;

  // Final point translation logic: Lead is 40% (max 40), Manager is 30% (max 30), HR is 30% (max 30)
  const leadPoints = leadAvg * 8; // (avg / 5) * 40
  const managerPoints = managerAvg * 6; // (avg / 5) * 30
  const hrPoints = hrAvg * 6; // (avg / 5) * 30
  
  const finalConsolidatedScore = Math.min(100, Math.round(leadPoints + managerPoints + hrPoints));

  // Determine current timeline label
  const assessmentTitle = selectedPeriod === "monthly" 
    ? "Monthly Touchpoint Review" 
    : selectedPeriod === "quarterly" 
    ? "Quarterly Performance Audit" 
    : "Comprehensive Annual Review";

  const cyclePeriodLabel = selectedPeriod === "monthly" ? "May 2026" : selectedPeriod === "quarterly" ? "Q2 2026" : "H1 2026";

  const handleSaveDraft = () => {
    alert("Draft successfully autosaved in memory.");
  };

  const handlePublish = () => {
    setIsPublishing(true);
    
    // Simulate real system calculation and publishing latencies
    setTimeout(() => {
      setIsPublishing(false);
      
      const updatedEmployee = {
        ...employee,
        score: finalConsolidatedScore,
        teamwork: parseFloat(((employee.teamwork + collabRating + stakeRating) / 3).toFixed(1)),
        quality: parseFloat(((employee.quality + techRating + budgetRating) / 3).toFixed(1)),
        problem: parseFloat(((employee.problem + stratRating) / 2).toFixed(1)),
        time: parseFloat(((employee.time + timeRating + budgetRating) / 3).toFixed(1)),
        lastMonthly: selectedPeriod === "monthly" ? "2026-06-03" : employee.lastMonthly,
        lastQuarterly: selectedPeriod === "quarterly" ? "2026-06-03" : employee.lastQuarterly,
        lastAnnual: selectedPeriod === "annual" ? "2026-06-03" : employee.lastAnnual,
      };

      onPublishSuccess(updatedEmployee);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn p-2 sm:p-4 max-w-7xl mx-auto" id="review-workflow-workspace">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-[#63716E] mb-2 font-semibold">
            <span>PERFORMANCE</span>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="uppercase">{selectedPeriod} REVIEW CYCLE</span>
          </nav>
          <div className="flex items-center gap-3">
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#203430] tracking-tight">
              {activePhase === 1 && "Team Lead Review: "}
              {activePhase === 2 && "Manager Review: "}
              {activePhase === 3 && "HR Final Review: "}
              {employee.name}
            </h2>
          </div>
          <p className="text-sm text-[#63716E] font-medium mt-1">{employee.role} • {employee.subRole}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="bg-white border border-[#E4E4E1] text-[#203430] px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-55 transition-all cursor-pointer h-11 flex items-center justify-center gap-1.5 shadow-sm"
          >
            ← Back to List
          </button>
          
          {activePhase === 3 ? (
            <button 
              type="button"
              disabled={isPublishing}
              onClick={handlePublish}
              className="bg-[#006b5f] hover:bg-[#005047] disabled:bg-[#006b5f]/50 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer h-11 flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  Publishing...
                </>
              ) : (
                <>
                  Publish & Close
                  <Send className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          ) : (
            <button 
              type="button"
              onClick={() => setActivePhase((prev) => (prev + 1) as any)}
              className="bg-[#006b5f] hover:bg-[#005047] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer h-11 flex items-center justify-center gap-1.5"
            >
              Next Milestone Step →
            </button>
          )}
        </div>
      </div>

      {/* 1. Workflow Progress Tracker Card */}
      <section className="bg-white border border-[#E4E4E1] p-6 rounded-2xl shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 relative">
          {/* Main Progress Line Underlay */}
          <div className="absolute left-[18px] right-[18px] top-[18px] h-1 bg-slate-100 -z-0 hidden sm:block" />
          <div 
            className="absolute left-[18px] top-[18px] h-1 bg-[#006b5f] -z-0 hidden sm:block transition-all duration-500" 
            style={{ width: activePhase === 1 ? "0%" : activePhase === 2 ? "50%" : "100%" }}
          />

          {/* Step 1: Lead Review */}
          <button 
            type="button"
            onClick={() => setActivePhase(1)}
            className="relative z-10 flex flex-row sm:flex-col items-center gap-3 text-left sm:text-center w-full sm:w-auto cursor-pointer"
          >
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all border-2",
              activePhase >= 1 
                ? "bg-[#006b5f] text-white border-[#006b5f]" 
                : "bg-white text-slate-400 border-slate-200"
            )}>
              {activePhase > 1 ? <Check className="h-4 w-4 stroke-[3px]" /> : "1"}
            </div>
            <div>
              <p className={cn("text-xs font-black", activePhase === 1 ? "text-[#006b5f]" : "text-[#203430]")}>Team Lead Review</p>
              <p className="text-[10px] text-[#63716E] mt-0.5 leading-none font-medium">{activePhase > 1 ? "Completed" : "Active Stage"}</p>
            </div>
          </button>

          {/* Step 2: Manager Review */}
          <button 
            type="button"
            onClick={() => setActivePhase(2)}
            className="relative z-10 flex flex-row sm:flex-col items-center gap-3 text-left sm:text-center w-full sm:w-auto cursor-pointer"
          >
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all border-2",
              activePhase >= 2 
                ? "bg-[#006b5f] text-white border-[#006b5f]" 
                : "bg-white text-slate-400 border-slate-200"
            )}>
              {activePhase > 2 ? <Check className="h-4 w-4 stroke-[3px]" /> : "2"}
            </div>
            <div>
              <p className={cn("text-xs font-black", activePhase === 2 ? "text-[#006b5f]" : "text-[#203430]")}>Manager Review</p>
              <p className="text-[10px] text-[#63716E] mt-0.5 leading-none font-medium">
                {activePhase > 2 ? "Completed" : activePhase === 2 ? "Active Stage" : "Upcoming"}
              </p>
            </div>
          </button>

          {/* Step 3: HR compliance Final Review */}
          <button 
            type="button"
            onClick={() => setActivePhase(3)}
            className="relative z-10 flex flex-row sm:flex-col items-center gap-3 text-left sm:text-center w-full sm:w-auto cursor-pointer"
          >
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all border-2",
              activePhase === 3 
                ? "bg-white text-[#006b5f] border-4 border-[#006b5f] ring-4 ring-[#E4F2D3]" 
                : "bg-white text-slate-400 border-slate-200"
            )}>
              3
            </div>
            <div>
              <p className={cn("text-xs font-black", activePhase === 3 ? "text-[#006b5f]" : "text-[#203430]")}>HR Final Review</p>
              <p className="text-[10px] text-[#63716E] mt-0.5 leading-none font-medium">{activePhase === 3 ? "Active Phase" : "Upcoming"}</p>
            </div>
          </button>
        </div>
      </section>

      {/* Main Grid: KPIs on Left, Points/Breakdown on Right */}
      <div className="grid grid-cols-12 gap-6 items-start">
        
        {/* Left Hand: Interactive Review Forms */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          {/* Header Banner */}
          <section className="bg-white rounded-2xl p-6 border border-[#E4E4E1] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <img 
                alt={employee.name} 
                className="w-16 h-16 rounded-xl object-cover border-2 border-[#E4E4E1] shrink-0 bg-brand" 
                src={employee.avatar} 
              />
              <div>
                <h4 className="font-extrabold text-[#203430] text-lg leading-tight">{employee.name}</h4>
                <p className="text-[#63716E] text-xs font-medium mt-1">{assessmentTitle} • Period: {cyclePeriodLabel}</p>
              </div>
            </div>
            
            <div className="bg-[#E4F2D3] text-[#0E4D41] px-4 py-2 rounded-xl text-center shrink-0 border border-[#0E4D41]/10">
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Status</span>
              <p className="font-extrabold text-sm mt-0.5 whitespace-nowrap">Review In Progress</p>
            </div>
          </section>

          {/* PHASE 1 FORM WORKSPACE: TEAM LEAD ASSESSMENT */}
          {activePhase === 1 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-sans text-lg font-black text-[#203430] flex items-center gap-2">
                  <ClipboardSignature className="text-[#006b5f] h-5 w-5" />
                  Performance Indicators (Phase 1)
                </h3>
                <span className="text-xs text-[#63716E] italic">All metrics are required *</span>
              </div>

              {/* KPI 1: Technical Execution */}
              <div className="bg-white border border-[#E4E4E1] rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E4F2D3] text-[#006b5f] flex items-center justify-center shrink-0">
                        <Code className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#203430]">Technical Execution *</h4>
                        <p className="text-xs text-[#63716E] font-medium leading-relaxed mt-0.5">Code modularity, design-to-code fidelity, and bug leakage ratios.</p>
                      </div>
                    </div>

                    {/* Score Buttons */}
                    <div className="flex items-center self-start gap-1 bg-slate-50 p-1.5 rounded-xl border border-[#E4E4E1]">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setTechRating(val)}
                          className={cn(
                            "w-9 h-9 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center",
                            techRating === val 
                              ? "bg-[#006b5f] text-white shadow-md scale-102" 
                              : "hover:bg-white text-[#203430] hover:shadow-sm"
                          )}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea 
                    value={techComment}
                    onChange={(e) => setTechComment(e.target.value)}
                    className="w-full bg-slate-50 p-3.5 border border-slate-150 rounded-xl text-xs sm:text-sm focus:border-[#006b5f] focus:ring-1 focus:ring-[#006b5f] outline-none transition-all h-24 resize-none leading-relaxed text-[#203430]"
                    placeholder="Provide detailed technical execution examples or milestone comments..."
                  />
                </div>
              </div>

              {/* KPI 2: Collaboration */}
              <div className="bg-white border border-[#E4E4E1] rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E4F2D3] text-[#006b5f] flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#203430]">Collaboration *</h4>
                        <p className="text-xs text-[#63716E] font-medium leading-relaxed mt-0.5">Cross-departmental alignment, designer mentoring, and open communication with stakeholders.</p>
                      </div>
                    </div>

                    {/* Score Buttons */}
                    <div className="flex items-center self-start gap-1 bg-slate-50 p-1.5 rounded-xl border border-[#E4E4E1]">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setCollabRating(val)}
                          className={cn(
                            "w-9 h-9 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center",
                            collabRating === val 
                              ? "bg-[#006b5f] text-white shadow-md scale-102" 
                              : "hover:bg-white text-[#203430]"
                          )}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea 
                    value={collabComment}
                    onChange={(e) => setCollabComment(e.target.value)}
                    className="w-full bg-slate-50 p-3.5 border border-slate-150 rounded-xl text-xs sm:text-sm focus:border-[#006b5f] focus:ring-1 focus:ring-[#006b5f] outline-none transition-all h-24 resize-none leading-relaxed text-[#203430]"
                    placeholder="Describe stakeholder cooperation or team feedback logs for this cycle..."
                  />
                </div>
              </div>

              {/* KPI 3: Timeliness */}
              <div className="bg-white border border-[#E4E4E1] rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E4F2D3] text-[#006b5f] flex items-center justify-center shrink-0">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#203430]">Timeliness & Predictive Handoff *</h4>
                        <p className="text-xs text-[#63716E] font-medium leading-relaxed mt-0.5">Sprint task completion speed, overall meeting attendance rhythm and delivery dates adherence.</p>
                      </div>
                    </div>

                    {/* Score Buttons */}
                    <div className="flex items-center self-start gap-1 bg-slate-50 p-1.5 rounded-xl border border-[#E4E4E1]">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setTimeRating(val)}
                          className={cn(
                            "w-9 h-9 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center",
                            timeRating === val 
                              ? "bg-[#006b5f] text-white shadow-md scale-102" 
                              : "hover:bg-white text-[#203430]"
                          )}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea 
                    value={timeComment}
                    onChange={(e) => setTimeComment(e.target.value)}
                    className="w-full bg-slate-50 p-3.5 border border-slate-150 rounded-xl text-xs sm:text-sm focus:border-[#006b5f] focus:ring-1 focus:ring-[#006b5f] outline-none transition-all h-24 resize-none leading-relaxed text-[#203430]"
                    placeholder="Note timeliness deliverables deviations or exceptional speed records..."
                  />
                </div>
              </div>
            </section>
          )}

          {/* PHASE 2 FORM WORKSPACE: DEPARTMENT MANAGER ASSESSMENT */}
          {activePhase === 2 && (
            <section className="space-y-6">
              {/* Completed Team Lead Review Summary (Read-Only Detail Block accordion) */}
              <details open className="group bg-[#E4F2D3]/20 border border-[#E4F2D3] rounded-2xl overflow-hidden shadow-sm">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E4F2D3] rounded-xl flex items-center justify-center text-[#0E4D41] shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#0E4D41]">Lead Summary: Marcus Vance</h4>
                      <p className="text-xs text-[#57685d] font-bold mt-0.5">Calculated Overall Rating: {leadAvg.toFixed(1)} / 5.0</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#006b5f] group-open:rotate-90 transition-transform" />
                </summary>
                
                <div className="px-6 pb-6 text-sm text-[#203430] border-t border-[#E4F2D3]/45 pt-4 space-y-4 bg-slate-50/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-[#E4E4E1]">
                      <p className="text-[10px] text-[#63716E] font-black uppercase tracking-wider mb-1">Observed Strengths</p>
                      <p className="text-xs text-[#203430] leading-relaxed font-medium">Consistently crafts top quality UI blueprints. Exceptional digital execution speed.</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-[#E4E4E1]">
                      <p className="text-[10px] text-[#63716E] font-black uppercase tracking-wider mb-1">Growth Actions</p>
                      <p className="text-xs text-[#203430] leading-relaxed font-medium">Could coordinate core framework handoffs earlier to expedite final deliverables verification.</p>
                    </div>
                  </div>
                  <blockquote className="border-l-4 border-[#006b5f] pl-4 italic text-xs sm:text-sm text-[#63716E] leading-relaxed py-1">
                    "{techComment || 'Delivering high quality React systems with superb attention to design details.'}" — Marcus V., Team Lead
                  </blockquote>
                </div>
              </details>

              <div className="flex items-center gap-2 mb-2">
                <Milestone className="text-[#006b5f] h-5 w-5" />
                <h3 className="font-sans text-lg font-black text-[#203430]">Manager Core Competencies (Phase 2)</h3>
              </div>

              {/* KPI 1: Strategic Leadership */}
              <div className="bg-white border border-[#E4E4E1] rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E4F2D3] text-[#006b5f] flex items-center justify-center shrink-0">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#203430]">Strategic Leadership</h4>
                        <p className="text-xs text-[#63716E] font-medium leading-relaxed mt-0.5">Ability to align teamwork goals with corporate OKRs and inspire colleagues.</p>
                      </div>
                    </div>

                    <div className="flex items-center self-start gap-1 bg-slate-50 p-1.5 rounded-xl border border-[#E4E4E1]">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setStratRating(val)}
                          className={cn(
                            "w-9 h-9 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center",
                            stratRating === val ? "bg-[#006b5f] text-white shadow-md" : "hover:bg-white text-[#203430]"
                          )}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea 
                    value={stratComment}
                    onChange={(e) => setStratComment(e.target.value)}
                    className="w-full bg-slate-50 p-3.5 border border-slate-150 rounded-xl text-xs sm:text-sm focus:border-[#006b5f] outline-none transition-all h-24 resize-none leading-relaxed text-[#203430]"
                    placeholder="Provide specific details of strategic leadership impact..."
                  />
                </div>
              </div>

              {/* KPI 2: Stakeholder Management */}
              <div className="bg-white border border-[#E4E4E1] rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E4F2D3] text-[#006b5f] flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#203430]">Stakeholder Management</h4>
                        <p className="text-xs text-[#63716E] font-medium leading-relaxed mt-0.5">Efficacy in communicating goals milestones, expectation bounds, and resolving cross-conflicts.</p>
                      </div>
                    </div>

                    <div className="flex items-center self-start gap-1 bg-slate-50 p-1.5 rounded-xl border border-[#E4E4E1]">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setStakeRating(val)}
                          className={cn(
                            "w-9 h-9 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center",
                            stakeRating === val ? "bg-[#006b5f] text-white shadow-md" : "hover:bg-white text-[#203430]"
                          )}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea 
                    value={stakeComment}
                    onChange={(e) => setStakeComment(e.target.value)}
                    className="w-full bg-slate-50 p-3.5 border border-slate-150 rounded-xl text-xs sm:text-sm focus:border-[#006b5f] outline-none transition-all h-24 resize-none leading-relaxed text-[#203430]"
                    placeholder="Detail impact on client relationships and multi-department alignment..."
                  />
                </div>
              </div>

              {/* KPI 3: Budget Adherence */}
              <div className="bg-white border border-[#E4E4E1] rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E4F2D3] text-[#006b5f] flex items-center justify-center shrink-0">
                        <CheckSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#203430]">Resource Efficiency & Budgeting</h4>
                        <p className="text-xs text-[#63716E] font-medium leading-relaxed mt-0.5">Optimizing operational expenses, tool spend, and sprint planning accuracies.</p>
                      </div>
                    </div>

                    <div className="flex items-center self-start gap-1 bg-slate-50 p-1.5 rounded-xl border border-[#E4E4E1]">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setBudgetRating(val)}
                          className={cn(
                            "w-9 h-9 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center",
                            budgetRating === val ? "bg-[#006b5f] text-white shadow-md" : "hover:bg-white text-[#203430]"
                          )}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea 
                    value={budgetComment}
                    onChange={(e) => setBudgetComment(e.target.value)}
                    className="w-full bg-slate-50 p-3.5 border border-slate-150 rounded-xl text-xs sm:text-sm focus:border-[#006b5f] outline-none transition-all h-24 resize-none leading-relaxed text-[#203430]"
                    placeholder="Describe specific resource conservation achievements or alignment bounds..."
                  />
                </div>
              </div>
            </section>
          )}

          {/* PHASE 3 FORM WORKSPACE: HR ALIGNMENT & COMPLIANCE */}
          {activePhase === 3 && (
            <section className="space-y-6">
              {/* Summaries Split columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <article className="bg-[#E4F2D3]/15 border border-[#E4F2D3]/70 p-5 rounded-2xl shadow-sm">
                  <h4 className="text-xs font-black text-[#0E4D41] uppercase tracking-wide mb-3 flex items-center gap-1.5 border-b border-[#0E4D41]/5 pb-2">
                    <ShieldCheck className="h-4 w-4" />
                    Team Lead Summary
                  </h4>
                  <p className="text-xs text-[#63716E] leading-relaxed font-semibold italic">"Exceptional code output. Design modularity was stellar for frontend refactoring. Highly predictable delivery timeline compliance."</p>
                  <p className="text-[11px] font-black text-[#006b5f] mt-3">Overall Lead Rating: {leadAvg.toFixed(1)} / 5.0</p>
                </article>

                <article className="bg-[#006b5f]/5 border border-[#006b5f]/10 p-5 rounded-2xl shadow-sm">
                  <h4 className="text-xs font-black text-[#006b5f] uppercase tracking-wide mb-3 flex items-center gap-1.5 border-b border-[#006b5f]/5 pb-2">
                    <Users className="h-4 w-4" />
                    Manager Summary
                  </h4>
                  <p className="text-xs text-[#63716E] leading-relaxed font-semibold italic">"Strong performance during customer-facing alignment reviews. Demonstrated solid leadership logic and client confidence."</p>
                  <p className="text-[11px] font-black text-[#006b5f] mt-3">Overall Manager Rating: {managerAvg.toFixed(1)} / 5.0</p>
                </article>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="text-[#006b5f] h-5 w-5" />
                <h3 className="font-sans text-lg font-black text-[#203430]">HR Compliance & Values Assessment</h3>
              </div>

              {/* HR KPI 1: Org Alignment */}
              <div className="bg-white border border-[#E4E4E1] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-[#203430]">Organizational Alignment</h4>
                    <p className="text-xs text-[#63716E] font-medium leading-relaxed mt-0.5">Adherence to corporate culture values, team mentoring acts, and long-term targets.</p>
                  </div>

                  <div className="flex gap-1 bg-slate-50 p-1.5 rounded-xl border border-[#E4E4E1] shrink-0">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setOrgRating(val)}
                        className={cn(
                          "w-9 h-9 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center",
                          orgRating === val ? "bg-[#006b5f] text-white shadow-md animate-popIn" : "hover:bg-white text-[#203430]"
                        )}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea 
                  value={orgComment}
                  onChange={(e) => setOrgComment(e.target.value)}
                  className="w-full bg-slate-50 p-3.5 border border-slate-150 rounded-xl text-xs sm:text-sm focus:border-[#006b5f] outline-none transition-all h-20 resize-none leading-relaxed text-[#203430]"
                  placeholder="Record alignment reviews notes..."
                />
              </div>

              {/* HR KPI 2: Ethics Assessment */}
              <div className="bg-white border border-[#E4E4E1] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-[#203430]">Compliance & Ethical Adherence</h4>
                    <p className="text-xs text-[#63716E] font-medium leading-relaxed mt-0.5">Prompt completion of state certifications, standard compliance checks, and team safety rules.</p>
                  </div>

                  <div className="flex gap-1 bg-slate-50 p-1.5 rounded-xl border border-[#E4E4E1] shrink-0">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setEthicsRating(val)}
                        className={cn(
                          "w-9 h-9 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center",
                          ethicsRating === val ? "bg-[#006b5f] text-white shadow-md" : "hover:bg-white text-[#203430]"
                        )}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea 
                  value={ethicsComment}
                  onChange={(e) => setEthicsComment(e.target.value)}
                  className="w-full bg-slate-50 p-3.5 border border-slate-150 rounded-xl text-xs sm:text-sm focus:border-[#006b5f] outline-none transition-all h-20 resize-none leading-relaxed text-[#203430]"
                  placeholder="Compliance remarks..."
                />
              </div>

              {/* Professional Development Panel */}
              <div className="bg-white border border-[#E4E4E1] rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                  <h4 className="font-bold text-sm text-[#203430]">Compliance Development Checkpoints</h4>
                  <p className="text-xs text-[#63716E] mt-0.5">Review verified upskilling paths and certification logs.</p>
                </div>

                <div className="flex flex-wrap gap-6 pt-1">
                  <label className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#203430] cursor-pointer selection:bg-transparent select-none">
                    <input 
                      type="checkbox" 
                      checked={skillTrackVerified} 
                      onChange={(e) => setSkillTrackVerified(e.target.checked)}
                      className="w-5 h-5 rounded text-[#006b5f] border-slate-300 focus:ring-[#006b5f]" 
                    />
                    Upskilling Path Verified
                  </label>

                  <label className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#203430] cursor-pointer selection:bg-transparent select-none">
                    <input 
                      type="checkbox" 
                      checked={certApproved} 
                      onChange={(e) => setCertApproved(e.target.checked)}
                      className="w-5 h-5 rounded text-[#006b5f] border-slate-300 focus:ring-[#006b5f]" 
                    />
                    Compliance Certification Approved
                  </label>
                </div>
              </div>

              {/* Overall Rating Selection Dropdown */}
              <div className="bg-white border border-[#E4E4E1] rounded-2xl p-6 shadow-sm">
                <label className="text-xs font-black text-[#203430] uppercase tracking-wider block mb-2">Final Overall performance Rating</label>
                <select 
                  value={finalRatingDropdown} 
                  onChange={(e) => setFinalRatingDropdown(e.target.value)}
                  className="w-full max-w-sm border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-[#203430] bg-[#F3F3F0] focus:ring-1 focus:ring-[#006b5f]"
                >
                  <option value="Exceptional Performance">Exceptional Performance</option>
                  <option value="Exceeds Expectations">Exceeds Expectations</option>
                  <option value="Meets All Expectations">Meets All Expectations</option>
                  <option value="Meets Some Expectations">Meets Some Expectations</option>
                  <option value="Below Corporate Benchmarks">Below Corporate Benchmarks</option>
                </select>
              </div>
            </section>
          )}

        </div>

        {/* Right Hand: Point Breakdown & Stakeholder summary Sidebars */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Real-time scoring display card */}
          {activePhase === 1 && (
            <div className="bg-[#006b5f] text-white p-6 rounded-2xl shadow-md space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#E4F2D3]">Lead Overall Score</h4>
                <Activity className="h-5 w-5 text-[#E4F2D3]" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black">{leadAvg.toFixed(1)}</span>
                <span className="text-[#E4F2D3] text-sm font-bold">/ 5.0</span>
              </div>

              <div className="pt-4 border-t border-[#0E4D41]/40 flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold text-[#E4F2D3]">
                  <span>Score Band</span>
                  <span className="font-extrabold">
                    {leadAvg >= 4.5 ? "Outstanding" : leadAvg >= 3.8 ? "Exceeds Expectations" : "Meets Expectations"}
                  </span>
                </div>
                <div className="w-full bg-[#0E4D41]/35 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full shadow-md" style={{ width: `${leadAvg * 20}%` }} />
                </div>
              </div>
            </div>
          )}

          {activePhase === 2 && (
            <div className="bg-white border border-[#E4E4E1] rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#DFF2E3] p-5 border-b border-[#E4E4E1]">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#0E4D41] flex items-center gap-2">
                  <Info className="h-4.5 w-4.5" />
                  Scoring Real-time Summary
                </h4>
              </div>

              <div className="p-5 space-y-5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-[#63716E] font-black uppercase tracking-wider">Team Lead Score</p>
                    <p className="font-extrabold text-xl font-sans mt-0.5 text-[#203430]">{leadAvg.toFixed(1)} <span className="text-xs text-[#63716E]">/ 5</span></p>
                  </div>
                  <div className="w-10 h-10 bg-[#E4F2D3] rounded-full flex items-center justify-center text-[#0E4D41]">
                    <Check className="h-5 w-5" />
                  </div>
                </div>

                <hr className="border-[#E4E4E1]" />

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-[#63716E] font-black uppercase tracking-wider">Manager Score</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <p className="font-extrabold text-xl font-sans text-[#006b5f]">{managerAvg.toFixed(1)}</p>
                      <span className="text-[9px] bg-[#E4F2D3] border border-[#006b5f]/10 text-[#006b5f] font-black uppercase tracking-wider px-1.5 py-0.5 rounded animate-pulse">
                        Calculating
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-[#006b5f]/5 rounded-full flex items-center justify-center text-[#006b5f]">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-[#006b5f]/5 p-3.5 border border-[#006b5f]/10 rounded-xl text-[11px] leading-relaxed text-[#63716E] italic">
                  Note: The overall performance result is a weighted sum average: Manager review parameters are weighted at 60%, and Team Lead ratings weight at 40%.
                </div>
              </div>
            </div>
          )}

          {activePhase === 3 && (
            <div className="bg-[#006b5f] text-white p-6 rounded-2xl shadow-xl relative overflow-hidden space-y-6">
              <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-[#0E4D41]/35 rounded-full blur-2xl pointer-events-none" />

              <h4 className="text-xs font-black uppercase tracking-wider text-[#E4F2D3] flex items-center gap-1.5 border-b border-[#0E4D41]/30 pb-3">
                <Activity className="h-4 w-4" />
                Consolidated Performance Score
              </h4>

              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black tracking-tight">{finalConsolidatedScore}</span>
                <span className="text-xl text-[#E4F2D3] opacity-70">/ 100</span>
              </div>

              <div className="bg-[#0E4D41]/30 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold border border-white/5">
                <Award className="h-4 w-4 text-[#E4F2D3]" />
                Top 5% of department designer track
              </div>

              <div className="space-y-4 pt-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#E4F2D3]">Consolidated Breakdown</p>
                <div className="space-y-3 font-medium text-xs">
                  <div>
                    <div className="flex justify-between mb-1 text-white/90">
                      <span>Team Lead Review (40%)</span>
                      <span className="font-extrabold">{leadPoints.toFixed(0)} pts</span>
                    </div>
                    <div className="w-full bg-[#0E4D41]/40 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#E4F2D3] rounded-full shadow-sm animate-width" style={{ width: `${leadAvg * 20}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-white/90">
                      <span>Manager Review (30%)</span>
                      <span className="font-extrabold">{managerPoints.toFixed(0)} pts</span>
                    </div>
                    <div className="w-full bg-[#0E4D41]/40 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full shadow-sm animate-width" style={{ width: `${managerAvg * 20}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-white/90">
                      <span>HR compliance (30%)</span>
                      <span className="font-extrabold">{hrPoints.toFixed(0)} pts</span>
                    </div>
                    <div className="w-full bg-[#0E4D41]/40 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#E4F2D3] rounded-full shadow-sm animate-width" style={{ width: `${hrAvg * 20}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Review Stakeholders Card Tracker */}
          <div className="bg-white border border-[#E4E4E1] rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-[#203430] uppercase tracking-wider">Assessment Stakeholders</h4>
            
            <div className="space-y-4">
              {/* Leader */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img 
                    alt="Marcus Vance" 
                    className="w-10 h-10 rounded-full object-cover shadow-sm" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0zIqi-zsFTrXqe0PfGcbmyJfq1799KSOK01T8dyek77_qTDg8FLGYh-CxZH4IZGUnW4ZKJfzn4IvL3lSwXSom3BKZ_gCHIYwV6caFIlqezgvh07EqS4mIxqb1tafLsD9IEMb7QrbM3kBO2-nEVeg5WadGpc2rsyLz_zR-nWV80I2ksDA1r3UrpewK9lAcRmljDzvHVCm7VmUC5ho4VRERqMRmi-YVYhmaU2e-KxVYa7gz_clifjBvqxhWveG22Ltr3cMsF2ULgkY" 
                  />
                  <div>
                    <p className="text-xs font-black text-[#203430]">Marcus Vance</p>
                    <p className="text-[10px] text-[#63716E] font-medium leading-none mt-1">Team Lead</p>
                  </div>
                </div>
                <span className="text-[#006b5f] font-black text-[10px] uppercase tracking-wide">Approved</span>
              </div>

              {/* Manager */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F3F3F0] text-[#203430] font-black text-xs flex items-center justify-center">
                    AC
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#203430]">Alex Chen</p>
                    <p className="text-[10px] text-[#63716E] font-medium leading-none mt-1">Dept. Manager</p>
                  </div>
                </div>
                <span className={cn(
                  "font-black text-[10px] uppercase tracking-wide",
                  activePhase >= 2 ? "text-[#006b5f]" : "text-slate-400"
                )}>
                  {activePhase >= 2 ? "Reviewing" : "Waiting"}
                </span>
              </div>

              {/* HRBP */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#203430]">HR Business VP</p>
                    <p className="text-[10px] text-[#63716E] font-medium leading-none mt-1">Unassigned</p>
                  </div>
                </div>
                <span className={cn(
                  "font-black text-[10px] uppercase tracking-wide",
                  activePhase === 3 ? "text-[#006b5f]" : "text-slate-400"
                )}>
                  {activePhase === 3 ? "Reviewing" : "Waiting"}
                </span>
              </div>
            </div>
          </div>

          {/* Rating Guideline Info Panel */}
          <div className="bg-[#E4F2D3]/20 border border-[#E4F2D3]/60 p-5 rounded-2xl">
            <h4 className="text-xs font-black text-[#203430] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <BookOpen className="h-4.5 w-4.5 text-[#006b5f]" />
              Standard Score Scale
            </h4>
            <ul className="space-y-2 mt-1.5">
              <li className="text-xs flex items-start gap-2 text-[#63716E]">
                <span className="font-extrabold text-[#203430] shrink-0">5:</span>
                Excellent. Consistently exceeds expectations.
              </li>
              <li className="text-xs flex items-start gap-2 text-[#63716E]">
                <span className="font-extrabold text-[#203430] shrink-[#0E4D41]">4:</span>
                Exceeds Expectations. Frequently delivers above blueprints.
              </li>
              <li className="text-xs flex items-start gap-2 text-[#63716E]">
                <span className="font-extrabold text-[#203430] shrink-0">3:</span>
                Meets Expectations. High quality reliable outputs.
              </li>
            </ul>
          </div>

        </aside>
      </div>

      {/* Sticky footer actions with save/draft confirmations */}
      <footer className="mt-8 bg-white border border-[#E4E4E1] rounded-2xl p-5 flex justify-between items-center shadow-sm">
        <span className="text-xs text-[#63716E] flex items-center gap-1.5 font-semibold">
          <Check className="h-4 w-4 text-[#006b5f]" />
          Review progress saved locally
        </span>
        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={handleSaveDraft}
            className="border border-[#E4E4E1] hover:bg-slate-50 text-[#203430] font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
          >
            Save Draft
          </button>
        </div>
      </footer>
    </div>
  );
}
