import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter as FilterIcon,
  Calendar as CalendarIcon,
  X,
  Layers,
  Handshake,
  UserCog,
  Users,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Clock,
  MapPin,
  FileText,
  Trash2,
  CheckCircle2,
  Sparkles,
  Check,
  CheckSquare,
  Edit3,
  ExternalLink,
  Video,
  Building2,
  Flag,
  Share2,
  SlidersHorizontal,
  UserPlus,
  Tag,
  ChevronsUpDown,
  Phone,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { getCollection, saveCollection } from "../lib/db";

export interface Attendee {
  name: string;
  role: string;
  avatar: string;
  dept?: string;
  email?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface CalendarEvent {
  id: string;
  day: number;
  month: number; // 0-indexed (5 = June)
  year: number;
  title: string;
  category: "Talent Acquisition" | "Employee Development" | "Workplace Engagement" | string;
  time: string;
  endTime?: string;
  loc: string;
  note: string;
  priority?: "Low" | "Medium" | "High" | "Urgent";
  status?: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  attendees?: Attendee[];
  checklist?: ChecklistItem[];
  meetingType?: "Zoom Meeting" | "Google Meet" | "On-site / Office" | "Face to Face" | "Phone Call" | string;
  meetingLink?: string;
  keyPoints?: string[];
}

interface CategoryConfig {
  id: string;
  name: string;
  colorScheme: "green" | "amber" | "slate" | "blue" | "rose" | "violet";
  isActive: boolean;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const INITIAL_CATEGORIES: CategoryConfig[] = [
  { id: "1", name: "Talent Acquisition", colorScheme: "green", isActive: true },
  { id: "2", name: "Employee Development", colorScheme: "amber", isActive: true },
  { id: "3", name: "Workplace Engagement", colorScheme: "slate", isActive: true },
];

const AGENDA_FILTERS = [
  "Recruitment",
  "Interview Schedules",
  "Onboarding Session",
  "Training Programs",
  "Coaching Sessions",
  "Performance Review",
  "Company Events",
  "Policies Deadlines",
  "Leave Schedules",
];

// Exact seed data matching Screenshot 1 (June 2035)
const DEFAULT_SCHEDULES_JUNE_2035: CalendarEvent[] = [
  {
    id: "evt-jun-01",
    day: 1,
    month: 5,
    year: 2035,
    title: "Onboarding Session – New Hires Batch 3",
    category: "Talent Acquisition",
    time: "10:00 AM",
    endTime: "11:30 AM",
    loc: "Training Room A",
    note: "Welcome session, IT setup, and employee handbook walkthrough for cohort 3.",
    priority: "High",
    status: "Scheduled",
    attendees: [
      { name: "Mia Torres", role: "HR Officer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", dept: "Human Resources" }
    ],
    checklist: [{ id: "c1", text: "Distribute welcome kits", done: true }]
  },
  {
    id: "evt-jun-05a",
    day: 5,
    month: 5,
    year: 2035,
    title: "Interview – Product Designer Candidate",
    category: "Talent Acquisition",
    time: "09:00 AM",
    endTime: "10:00 AM",
    loc: "Meeting Room C",
    note: "Portfolio review and interaction challenge with lead designers.",
    priority: "High",
    status: "Scheduled",
    attendees: [
      { name: "Ethan Ray", role: "UI Designer", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", dept: "Design" }
    ]
  },
  {
    id: "evt-jun-05b",
    day: 5,
    month: 5,
    year: 2035,
    title: "Quarterly Policy Review Meeting",
    category: "Workplace Engagement",
    time: "03:00 PM",
    endTime: "04:00 PM",
    loc: "Conference Room 1A",
    note: "Review remote policy updates and benefit enhancements.",
    priority: "Medium",
    status: "Scheduled",
    attendees: [
      { name: "Davis Levin", role: "HR Manager", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXcgEFuMNH2WfVpKSkgHkLECe1-hlQ0L9nl5ENytbZVUEW86K5l0_mna02bcC9tmRPbl-07SmLI5j_1r3ZHvrMBH6CD4kB-_5E-T2OAl45cTJ1qmSS_yuJ3xk82VJF17FliOHCnrOl_Q2p-mxWY0neh_xUDCcG4Qk1iJw5FWsQ8G6lPDt2cLc6wkE08FjkhU0qVbP3iVxOoM2oFtk1KBpMk_hkLr1VsbXccQdVkOlnRpK30VI7QYYr3xzhv_6-w2MHnuh5pjbwFSw", dept: "Human Resources" }
    ]
  },
  {
    id: "evt-jun-07",
    day: 7,
    month: 5,
    year: 2035,
    title: "Team Communication Workshop",
    category: "Employee Development",
    time: "02:00 PM",
    endTime: "03:30 PM",
    loc: "Auditorium #1",
    note: "Interactive cross-functional collaboration workshop with engineering and design.",
    priority: "Medium",
    status: "Scheduled"
  },
  {
    id: "evt-jun-13",
    day: 13,
    month: 5,
    year: 2035,
    title: "Performance Review Check-in – Marketing Team",
    category: "Employee Development",
    time: "01:00 PM",
    endTime: "02:00 PM",
    loc: "Meeting Room B",
    note: "Mid-year targets check-in and KPI progress review.",
    priority: "High",
    status: "Scheduled"
  },
  {
    id: "evt-jun-15",
    day: 15,
    month: 5,
    year: 2035,
    title: "Recruitment Planning – Q3 Targets",
    category: "Talent Acquisition",
    time: "11:00 AM",
    endTime: "12:00 PM",
    loc: "Boardroom",
    note: "Headcount forecast and executive approvals for Q3 tech hiring.",
    priority: "Medium",
    status: "Scheduled"
  },
  {
    id: "evt-jun-18",
    day: 18,
    month: 5,
    year: 2035,
    title: "Remote Work Compliance Briefing",
    category: "Workplace Engagement",
    time: "09:30 AM",
    endTime: "10:30 AM",
    loc: "Zoom Virtual",
    note: "Mandatory security and compliance refresher for distributed teams.",
    priority: "Medium",
    status: "Scheduled",
    meetingType: "Zoom Meeting",
    meetingLink: "https://zoom.us/j/84920491823",
    keyPoints: [
      "Review updated SOC-2 security protocols",
      "VPN compliance for remote staff",
      "Confidential data handling guidelines"
    ]
  },
  {
    id: "evt-jun-21a",
    day: 21,
    month: 5,
    year: 2035,
    title: "New Recruit Introduction",
    category: "Talent Acquisition",
    time: "09:00 AM",
    endTime: "10:00 AM",
    loc: "HR Room 2B",
    note: "Prepare welcome kits and ID cards",
    priority: "High",
    status: "Scheduled",
    meetingType: "On-site / Office",
    keyPoints: [
      "Welcome kit & office badge distribution",
      "Team buddy introductions across departments",
      "IT equipment checklist & laptop setup"
    ],
    attendees: [
      { name: "Mia Torres", role: "HR Officer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", dept: "Human Resources" },
      { name: "Olivia Mason", role: "Marketing Executive", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", dept: "Marketing" }
    ],
    checklist: [
      { id: "c1", text: "Prepare welcome badges", done: true },
      { id: "c2", text: "Assign mentor buddy", done: false }
    ]
  },
  {
    id: "evt-jun-21b",
    day: 21,
    month: 5,
    year: 2035,
    title: "Personal Growth Session – Leadership Track",
    category: "Employee Development",
    time: "02:00 PM",
    endTime: "03:30 PM",
    loc: "Zoom Virtual",
    note: "Attendees must complete pre-session survey",
    priority: "Medium",
    status: "Scheduled",
    meetingType: "Zoom Meeting",
    meetingLink: "https://zoom.us/j/93481230114",
    keyPoints: [
      "Review 360-degree leadership evaluation results",
      "Career progression ladder & executive mentorship",
      "Personal development plan milestones"
    ],
    attendees: [
      { name: "Marcus Vance", role: "Lead Developer", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", dept: "Engineering" }
    ]
  },
  {
    id: "evt-jun-23",
    day: 23,
    month: 5,
    year: 2035,
    title: "Upskilling Program: Advanced Excel",
    category: "Employee Development",
    time: "03:30 PM",
    endTime: "05:00 PM",
    loc: "Lab 3",
    note: "Financial modeling and automated macro formulas.",
    priority: "Low",
    status: "Scheduled"
  },
  {
    id: "evt-jun-27",
    day: 27,
    month: 5,
    year: 2035,
    title: "Final Interview – Sales Manager",
    category: "Talent Acquisition",
    time: "10:00 AM",
    endTime: "11:00 AM",
    loc: "Executive Suite",
    note: "Compensation offer discussion and executive sign-off.",
    priority: "Urgent",
    status: "Scheduled"
  },
  {
    id: "evt-jun-29",
    day: 29,
    month: 5,
    year: 2035,
    title: "Internal Team-Building Event",
    category: "Workplace Engagement",
    time: "08:00 AM",
    endTime: "10:00 AM",
    loc: "Company Courtyard",
    note: "Breakfast social, team quiz, and quarterly milestone celebrations.",
    priority: "Medium",
    status: "Scheduled"
  }
];

// Exact Figma Style Mapping
export const getEventTheme = (category: string) => {
  const norm = category.toLowerCase();
  if (norm.includes("talent") || norm.includes("recruit") || norm.includes("hire") || norm.includes("interview") || norm.includes("onboard")) {
    return {
      cardBg: "bg-[#E4F2D3]",
      tagBg: "bg-[#F8FCF3]",
      dotColor: "bg-[#35BFA3]",
      borderHighlight: "border-[#35BFA3]",
      textColor: "text-[#203430]",
    };
  }
  if (norm.includes("develop") || norm.includes("growth") || norm.includes("coaching") || norm.includes("training") || norm.includes("review") || norm.includes("upskilling")) {
    return {
      cardBg: "bg-[#FDF5DF]",
      tagBg: "bg-white",
      dotColor: "bg-[#0E4D41]",
      borderHighlight: "border-[#0E4D41]",
      textColor: "text-[#203430]",
    };
  }
  return {
    cardBg: "bg-[#E5E6E6]",
    tagBg: "bg-white",
    dotColor: "bg-[#A4ACAB]",
    borderHighlight: "border-[#A4ACAB]",
    textColor: "text-[#203430]",
  };
};

/* =========================================================================
   CUSTOM DAY OF MONTH PICKER (MATCHES TEAMHUB DESIGN)
   ========================================================================= */
interface CustomDayPickerProps {
  value: number;
  onChange: (day: number) => void;
  daysInMonth: number;
  month: number;
  year: number;
  events?: CalendarEvent[];
}

function CustomDayPicker({ value, onChange, daysInMonth, month, year, events = [] }: CustomDayPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // Find which days have events
  const daysWithEvents = React.useMemo(() => {
    const set = new Set<number>();
    events.forEach((ev) => {
      if ((ev.month === undefined || ev.month === month) && (ev.year === undefined || ev.year === year)) {
        set.add(ev.day);
      }
    });
    return set;
  }, [events, month, year]);

  return (
    <div className="relative text-left" ref={containerRef}>
      <label className="block text-[12px] font-semibold text-[#203430] mb-1">
        Day of Month
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-xs h-9 px-3 bg-white border border-[#E5E6E6] hover:border-[#35BFA3] rounded-xl flex items-center justify-between transition-colors focus:outline-none focus:border-[#35BFA3] cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-3.5 w-3.5 text-[#0E4D41]" />
          <span className="font-semibold text-[#203430]">
            Day {value}, {MONTH_NAMES[month]} {year}
          </span>
        </div>
        <ChevronDown className={cn("h-3.5 w-3.5 text-[#63716E] transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 bg-white border border-[#E5E6E6] rounded-2xl shadow-xl p-3 w-64 animate-fade-in text-left">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E6E6]">
            <span className="text-xs font-bold text-[#0E4D41]">
              {MONTH_NAMES[month]} {year}
            </span>
            <span className="text-[10px] text-[#63716E]">Select Day</span>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d, i) => (
              <span key={i} className="text-[10px] font-bold text-[#63716E] py-0.5">
                {d}
              </span>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-7 w-7" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = value === day;
              const hasEvents = daysWithEvents.has(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    onChange(day);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "h-7 w-7 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer relative",
                    isSelected
                      ? "bg-[#0E4D41] text-white shadow-2xs font-bold"
                      : "text-[#203430] hover:bg-[#E4F2D3] hover:text-[#0E4D41]"
                  )}
                >
                  <span className="leading-none">{day}</span>
                  {hasEvents && !isSelected && (
                    <span className="h-1 w-1 bg-[#35BFA3] rounded-full mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-[#E5E6E6] flex justify-between items-center text-[11px]">
            <span className="text-[#63716E] text-[10px] flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-[#35BFA3] rounded-full inline-block" /> Has agenda
            </span>
            <button
              type="button"
              onClick={() => {
                onChange(new Date().getDate() <= daysInMonth ? new Date().getDate() : 1);
                setIsOpen(false);
              }}
              className="font-semibold text-[#0E4D41] hover:underline cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   CUSTOM UNIFIED START & END TIME RANGE PICKER (SINGLE POPUP / PICKER)
   ========================================================================= */
interface CustomTimeRangePickerProps {
  startTime: string;
  endTime: string;
  onChange: (startTime: string, endTime: string) => void;
}

const COMMON_TIME_PRESETS = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM",
];

const QUICK_RANGE_PRESETS = [
  { label: "Morning (09:00 - 10:00 AM)", start: "09:00 AM", end: "10:00 AM" },
  { label: "Midday (11:00 AM - 12:00 PM)", start: "11:00 AM", end: "12:00 PM" },
  { label: "Early Afternoon (01:00 - 02:00 PM)", start: "01:00 PM", end: "02:00 PM" },
  { label: "Late Afternoon (03:00 - 04:00 PM)", start: "03:00 PM", end: "04:00 PM" },
  { label: "30 Min Quick Sync", start: "10:00 AM", end: "10:30 AM" },
  { label: "2 Hour Workshop", start: "02:00 PM", end: "04:00 PM" },
];

function parseTimeString(timeStr: string) {
  const match = (timeStr || "").trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    let hourNum = parseInt(match[1], 10);
    if (hourNum < 1) hourNum = 1;
    if (hourNum > 12) hourNum = 12;
    return {
      hour: hourNum.toString().padStart(2, "0"),
      minute: match[2],
      period: match[3].toUpperCase(),
    };
  }
  return { hour: "09", minute: "00", period: "AM" };
}

function timeToMinutes(timeStr: string): number {
  const parsed = parseTimeString(timeStr);
  let h = parseInt(parsed.hour, 10);
  const m = parseInt(parsed.minute, 10);
  if (parsed.period === "PM" && h !== 12) h += 12;
  if (parsed.period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function formatDuration(startStr: string, endStr: string): string {
  const startMin = timeToMinutes(startStr);
  const endMin = timeToMinutes(endStr);
  let diff = endMin - startMin;
  if (diff < 0) diff += 24 * 60; // overnight
  if (diff === 0) return "0 mins";
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  if (hours > 0 && mins > 0) return `${hours} hr ${mins} mins`;
  if (hours > 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
  return `${mins} mins`;
}

function CustomTimeRangePicker({
  startTime,
  endTime,
  onChange,
}: CustomTimeRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = React.useState<"start" | "end">("start");

  // Local draft state while open
  const startParsed = parseTimeString(startTime || "09:00 AM");
  const endParsed = parseTimeString(endTime || "10:00 AM");

  const [draftStartHour, setDraftStartHour] = React.useState(startParsed.hour);
  const [draftStartMin, setDraftStartMin] = React.useState(startParsed.minute);
  const [draftStartPeriod, setDraftStartPeriod] = React.useState(startParsed.period);

  const [draftEndHour, setDraftEndHour] = React.useState(endParsed.hour);
  const [draftEndMin, setDraftEndMin] = React.useState(endParsed.minute);
  const [draftEndPeriod, setDraftEndPeriod] = React.useState(endParsed.period);

  // Sync draft when props change
  React.useEffect(() => {
    const s = parseTimeString(startTime || "09:00 AM");
    setDraftStartHour(s.hour);
    setDraftStartMin(s.minute);
    setDraftStartPeriod(s.period);

    const e = parseTimeString(endTime || "10:00 AM");
    setDraftEndHour(e.hour);
    setDraftEndMin(e.minute);
    setDraftEndPeriod(e.period);
  }, [startTime, endTime]);

  // Click outside to close and apply
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const currentFormattedStart = `${draftStartHour}:${draftStartMin} ${draftStartPeriod}`;
  const currentFormattedEnd = `${draftEndHour}:${draftEndMin} ${draftEndPeriod}`;
  const durationText = formatDuration(currentFormattedStart, currentFormattedEnd);

  const handleApply = () => {
    onChange(currentFormattedStart, currentFormattedEnd);
    setIsOpen(false);
  };

  const handleQuickDuration = (minutes: number) => {
    const startMin = timeToMinutes(currentFormattedStart);
    const endMin = (startMin + minutes) % (24 * 60);
    let h = Math.floor(endMin / 60);
    const m = endMin % 60;
    const period = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    const newEndStr = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
    const parsed = parseTimeString(newEndStr);
    setDraftEndHour(parsed.hour);
    setDraftEndMin(parsed.minute);
    setDraftEndPeriod(parsed.period);
  };

  return (
    <div className="relative text-left w-full" ref={containerRef}>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-[12px] font-semibold text-[#203430]">
          Time Range (Start & End)
        </label>
        <span className="text-[10px] font-semibold text-[#0E4D41] bg-[#E4F2D3] px-2 py-0.5 rounded-full">
          {formatDuration(startTime, endTime)}
        </span>
      </div>

      {/* Main Single Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full text-xs h-9 px-3 bg-white border rounded-xl flex items-center justify-between transition-all focus:outline-none cursor-pointer",
          isOpen
            ? "border-[#35BFA3] ring-2 ring-[#35BFA3]/20 shadow-xs"
            : "border-[#E5E6E6] hover:border-[#35BFA3]"
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Clock className="h-3.5 w-3.5 text-[#0E4D41] shrink-0" />
          <div className="flex items-center gap-1.5 font-semibold text-[#203430] truncate">
            <span className="text-[#0E4D41]">{startTime || "09:00 AM"}</span>
            <span className="text-[#A4ACAB] font-normal">→</span>
            <span className="text-[#0E4D41]">{endTime || "10:00 AM"}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-1">
          <span className="text-[10px] text-[#63716E] hidden sm:inline bg-[#F7F7F7] px-1.5 py-0.5 rounded-md border border-[#E5E6E6]">
            Change
          </span>
          <ChevronDown
            className={cn("h-3.5 w-3.5 text-[#63716E] transition-transform duration-200", isOpen && "rotate-180")}
          />
        </div>
      </button>

      {/* Unified Single Popup */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto right-0 top-full mt-2 z-50 bg-white border border-[#E5E6E6] rounded-2xl shadow-2xl p-4 w-full sm:w-[360px] animate-fade-in text-left">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#E5E6E6]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#E4F2D3] text-[#0E4D41]">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0E4D41]">Select Meeting Time</h4>
                <p className="text-[10px] text-[#63716E]">Configure start, end & duration in one place</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#63716E] hover:text-[#203430] p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Dual Time Tabs / Selector Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F7F7] rounded-xl mb-3 border border-[#E5E6E6]">
            <button
              type="button"
              onClick={() => setActiveTab("start")}
              className={cn(
                "py-2 px-3 rounded-lg text-left transition-all cursor-pointer flex flex-col",
                activeTab === "start"
                  ? "bg-white text-[#0E4D41] shadow-xs border border-[#35BFA3]/40"
                  : "text-[#63716E] hover:text-[#203430]"
              )}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#63716E]">Start Time</span>
              <span className="text-sm font-extrabold text-[#0E4D41]">{currentFormattedStart}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("end")}
              className={cn(
                "py-2 px-3 rounded-lg text-left transition-all cursor-pointer flex flex-col",
                activeTab === "end"
                  ? "bg-white text-[#0E4D41] shadow-xs border border-[#35BFA3]/40"
                  : "text-[#63716E] hover:text-[#203430]"
              )}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#63716E]">End Time</span>
              <span className="text-sm font-extrabold text-[#0E4D41]">{currentFormattedEnd}</span>
            </button>
          </div>

          {/* Active Tab Time Adjustment Controls */}
          <div className="bg-[#F8FCF3] border border-[#35BFA3]/30 p-3 rounded-xl mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#0E4D41]">
                Adjusting: <span className="underline decoration-[#35BFA3]">{activeTab === "start" ? "Start Time" : "End Time"}</span>
              </span>
              <span className="text-[10px] text-[#63716E]">
                {activeTab === "start" ? currentFormattedStart : currentFormattedEnd}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              {/* Hour Select */}
              <div>
                <span className="text-[10px] font-semibold text-[#63716E] block mb-1 text-center">Hour</span>
                <select
                  value={activeTab === "start" ? draftStartHour : draftEndHour}
                  onChange={(e) => {
                    if (activeTab === "start") setDraftStartHour(e.target.value);
                    else setDraftEndHour(e.target.value);
                  }}
                  className="w-full text-xs font-bold text-[#203430] bg-white border border-[#E5E6E6] rounded-lg py-1.5 px-1 text-center focus:outline-none focus:border-[#35BFA3] cursor-pointer"
                >
                  {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Minute Select */}
              <div>
                <span className="text-[10px] font-semibold text-[#63716E] block mb-1 text-center">Minute</span>
                <select
                  value={activeTab === "start" ? draftStartMin : draftEndMin}
                  onChange={(e) => {
                    if (activeTab === "start") setDraftStartMin(e.target.value);
                    else setDraftEndMin(e.target.value);
                  }}
                  className="w-full text-xs font-bold text-[#203430] bg-white border border-[#E5E6E6] rounded-lg py-1.5 px-1 text-center focus:outline-none focus:border-[#35BFA3] cursor-pointer"
                >
                  {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* AM / PM Toggle */}
              <div>
                <span className="text-[10px] font-semibold text-[#63716E] block mb-1 text-center">AM / PM</span>
                <div className="flex rounded-lg border border-[#E5E6E6] overflow-hidden bg-white">
                  {["AM", "PM"].map((p) => {
                    const isSelected = activeTab === "start" ? draftStartPeriod === p : draftEndPeriod === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          if (activeTab === "start") setDraftStartPeriod(p);
                          else setDraftEndPeriod(p);
                        }}
                        className={cn(
                          "flex-1 text-[11px] font-bold py-1.5 transition-colors cursor-pointer",
                          isSelected ? "bg-[#0E4D41] text-white" : "text-[#63716E] hover:bg-slate-50"
                        )}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Duration Extenders */}
          <div className="mb-3">
            <span className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider block mb-1.5">
              Quick Set Duration from Start:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "+15m", mins: 15 },
                { label: "+30m", mins: 30 },
                { label: "+45m", mins: 45 },
                { label: "+1h", mins: 60 },
                { label: "+1.5h", mins: 90 },
                { label: "+2h", mins: 120 },
              ].map((dur) => (
                <button
                  key={dur.label}
                  type="button"
                  onClick={() => handleQuickDuration(dur.mins)}
                  className="text-[10px] font-bold px-2 py-1 bg-white hover:bg-[#E4F2D3] text-[#0E4D41] border border-[#E5E6E6] hover:border-[#35BFA3] rounded-lg transition-colors cursor-pointer"
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Meeting Slots */}
          <div className="mb-3">
            <span className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider block mb-1.5">
              Standard Presets:
            </span>
            <div className="grid grid-cols-2 gap-1.5 max-h-24 overflow-y-auto custom-scrollbar pr-0.5">
              {QUICK_RANGE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    const sp = parseTimeString(preset.start);
                    const ep = parseTimeString(preset.end);
                    setDraftStartHour(sp.hour);
                    setDraftStartMin(sp.minute);
                    setDraftStartPeriod(sp.period);
                    setDraftEndHour(ep.hour);
                    setDraftEndMin(ep.minute);
                    setDraftEndPeriod(ep.period);
                  }}
                  className="text-[10px] text-left p-1.5 rounded-lg border border-[#E5E6E6] hover:border-[#35BFA3] bg-[#F7F7F7] hover:bg-[#E4F2D3] transition-colors truncate cursor-pointer"
                >
                  <span className="font-semibold text-[#203430] block truncate">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer with Summary and Apply Action */}
          <div className="pt-2.5 border-t border-[#E5E6E6] flex items-center justify-between gap-2">
            <div className="leading-tight">
              <span className="text-[10px] text-[#63716E] block">Calculated Total</span>
              <span className="text-xs font-bold text-[#0E4D41]">{durationText}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-[#63716E] hover:text-[#203430] rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#0E4D41] hover:bg-[#1a5d50] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Apply Time</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   INLINE ALWAYS-IN-DISPLAY ATTENDEE PICKER (NO HIDDEN POPOVER)
   ========================================================= */
interface InlineAttendeePickerProps {
  employees: any[];
  selectedAttendees: Attendee[];
  onChange: (attendees: Attendee[]) => void;
}

function InlineAttendeePicker({ employees, selectedAttendees, onChange }: InlineAttendeePickerProps) {
  const [search, setSearch] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState("All");

  const allDirectory: Attendee[] = React.useMemo(() => {
    const list: Attendee[] = [];
    employees.forEach((emp) => {
      list.push({
        name: emp.name,
        role: emp.role || emp.job || emp.title || "Team Member",
        avatar: emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=35BFA3&color=fff`,
        dept: emp.dept || emp.department || "General Staff",
        email: emp.email || `${emp.name.toLowerCase().replace(/\s+/g, ".")}@teamhub.io`,
      });
    });
    return list;
  }, [employees]);

  const departments = React.useMemo(() => {
    const depts = new Set<string>();
    allDirectory.forEach((d) => d.dept && depts.add(d.dept));
    return ["All", ...Array.from(depts)];
  }, [allDirectory]);

  const filteredList = React.useMemo(() => {
    return allDirectory.filter((item) => {
      if (selectedDept !== "All" && item.dept !== selectedDept) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.role.toLowerCase().includes(q) || (item.dept && item.dept.toLowerCase().includes(q));
      }
      return true;
    });
  }, [allDirectory, selectedDept, search]);

  const toggleAttendee = (att: Attendee) => {
    const exists = selectedAttendees.some((a) => a.name === att.name);
    if (exists) {
      onChange(selectedAttendees.filter((a) => a.name !== att.name));
    } else {
      onChange([...selectedAttendees, att]);
    }
  };

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-semibold text-[#203430] flex items-center gap-1.5">
          <span>Select Attendees</span>
          <span className="text-[10px] font-bold text-[#0E4D41] bg-[#E4F2D3] px-2 py-0.5 rounded-full">
            {selectedAttendees.length} selected
          </span>
        </label>
        {selectedAttendees.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[10px] font-semibold text-rose-600 hover:underline cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Selected Attendees Chips - Always in display */}
      {selectedAttendees.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-[#F8FCF3] border border-[#35BFA3]/30 rounded-xl max-h-24 overflow-y-auto custom-scrollbar">
          {selectedAttendees.map((att) => (
            <span
              key={att.name}
              className="inline-flex items-center gap-1.5 pl-1.5 pr-1 py-0.5 bg-white border border-[#E5E6E6] rounded-lg text-[10px] font-medium text-[#203430] shadow-2xs"
            >
              <img src={att.avatar} alt={att.name} className="h-4 w-4 rounded-full object-cover" />
              <span>{att.name}</span>
              <button
                type="button"
                onClick={() => onChange(selectedAttendees.filter((a) => a.name !== att.name))}
                className="hover:text-red-500 text-slate-400 p-0.5 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Embedded Directory Container - Always in display */}
      <div className="border border-[#E5E6E6] rounded-xl p-2.5 bg-white space-y-2">
        {/* Search */}
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search directory by name, role or dept..."
            className="w-full text-xs h-8 pl-8 pr-3 border border-[#E5E6E6] rounded-lg focus:outline-none focus:border-[#35BFA3] bg-[#F7F7F7]/60"
          />
        </div>

        {/* Dept filter pills */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar py-0.5">
          {departments.slice(0, 6).map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDept(dept)}
              className={cn(
                "px-2 py-0.5 rounded text-[9px] font-semibold shrink-0 transition-colors cursor-pointer",
                selectedDept === dept ? "bg-[#0E4D41] text-white" : "bg-[#F7F7F7] text-[#63716E] hover:bg-slate-200"
              )}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Directory List */}
        <div className="space-y-1 overflow-y-auto max-h-36 custom-scrollbar pr-1">
          {filteredList.length === 0 ? (
            <div className="py-3 text-center">
              <p className="text-[11px] text-[#63716E]">No matching employees</p>
              {search.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    const customAtt: Attendee = {
                      name: search.trim(),
                      role: "Guest / Attendee",
                      dept: "External",
                      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(search.trim())}&background=35BFA3&color=fff`,
                      email: `${search.toLowerCase().replace(/\s+/g, ".")}@guest.com`,
                    };
                    toggleAttendee(customAtt);
                    setSearch("");
                  }}
                  className="mt-1.5 text-[10px] font-semibold text-[#0E4D41] bg-[#E4F2D3] hover:bg-[#d8ebc3] px-2.5 py-1 rounded-lg cursor-pointer inline-flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Add "{search.trim()}" as Guest Attendee
                </button>
              )}
            </div>
          ) : (
            filteredList.slice(0, 50).map((att) => {
              const isSelected = selectedAttendees.some((a) => a.name === att.name);
              return (
                <div
                  key={att.name}
                  onClick={() => toggleAttendee(att)}
                  className={cn(
                    "flex items-center justify-between p-1.5 rounded-lg border text-xs cursor-pointer select-none transition-colors",
                    isSelected ? "bg-[#F8FCF3] border-[#35BFA3]" : "border-transparent hover:bg-[#F7F7F7]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <img src={att.avatar} alt={att.name} className="h-5 w-5 rounded-full object-cover shrink-0" />
                    <div>
                      <div className="font-semibold text-[#203430] leading-tight text-[11px]">{att.name}</div>
                      <div className="text-[9px] text-[#63716E]">{att.role} • {att.dept}</div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "h-4 w-4 rounded flex items-center justify-center border transition-colors shrink-0",
                      isSelected ? "bg-[#35BFA3] border-[#35BFA3] text-white" : "border-slate-300"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MEETING FORMAT / TYPE PICKER (ZOOM, GOOGLE MEET, ON-SITE, FACE-TO-FACE)
   ========================================================================= */
const MEETING_FORMAT_OPTIONS = [
  { id: "Zoom Meeting", label: "Zoom", icon: Video, desc: "Virtual meeting via Zoom" },
  { id: "Google Meet", label: "Google Meet", icon: Video, desc: "Video call via Google Meet" },
  { id: "On-site / Office", label: "On-site", icon: Building2, desc: "Physical conference room" },
  { id: "Face to Face", label: "Face-to-Face", icon: Handshake, desc: "In-person 1-on-1 session" },
  { id: "Phone Call", label: "Phone", icon: Phone, desc: "Direct voice call briefing" },
];

/* =========================================================================
   KEY POINTS & AGENDA BULLET POINTS EDITOR
   ========================================================================= */
interface KeyPointsEditorProps {
  keyPoints: string[];
  onChange: (points: string[]) => void;
}

function KeyPointsEditor({ keyPoints, onChange }: KeyPointsEditorProps) {
  const [pointInput, setPointInput] = React.useState("");

  const addPoint = (text: string) => {
    const val = text.trim();
    if (!val) return;
    onChange([...keyPoints, val]);
    setPointInput("");
  };

  const removePoint = (idx: number) => {
    onChange(keyPoints.filter((_, i) => i !== idx));
  };

  const suggestions = [
    "Review candidate portfolio & background",
    "Quarterly OKR review & milestones",
    "Discuss remote work policy updates",
    "Open Q&A & action items assignment",
  ];

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-semibold text-[#203430]">
          Key Discussion Points & Agenda Items
        </label>
        <span className="text-[10px] font-medium text-[#63716E]">
          {keyPoints.length} points
        </span>
      </div>

      {/* Existing Bullet Points */}
      {keyPoints.length > 0 && (
        <div className="space-y-1.5 p-2 bg-[#F8FCF3] border border-[#35BFA3]/30 rounded-xl max-h-32 overflow-y-auto custom-scrollbar">
          {keyPoints.map((pt, idx) => (
            <div key={idx} className="flex items-start justify-between gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-[#E5E6E6] text-xs">
              <div className="flex items-start gap-2 flex-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#35BFA3] shrink-0 mt-1.5" />
                <span className="text-[#203430] font-medium leading-tight">{pt}</span>
              </div>
              <button
                type="button"
                onClick={() => removePoint(idx)}
                className="text-slate-400 hover:text-red-500 p-0.5 cursor-pointer shrink-0"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={pointInput}
          onChange={(e) => setPointInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addPoint(pointInput);
            }
          }}
          placeholder="Add key point or discussion topic (press Enter)..."
          className="flex-1 text-xs h-8 px-3 border border-[#E5E6E6] rounded-xl focus:outline-none focus:border-[#35BFA3] bg-white"
        />
        <button
          type="button"
          onClick={() => addPoint(pointInput)}
          className="px-3 h-8 text-[11px] font-semibold bg-[#E4F2D3] text-[#0E4D41] hover:bg-[#d8ebc3] rounded-xl transition-colors cursor-pointer shrink-0"
        >
          + Add Point
        </button>
      </div>

      {/* Suggested Quick Points */}
      <div className="flex flex-wrap gap-1 pt-0.5">
        <span className="text-[9px] font-semibold text-[#63716E] self-center mr-1">Suggested:</span>
        {suggestions.map((sug, i) => (
          <button
            key={i}
            type="button"
            onClick={() => addPoint(sug)}
            className="text-[9px] text-[#0E4D41] bg-[#F7F7F7] hover:bg-[#E4F2D3] px-2 py-0.5 rounded-md transition-colors cursor-pointer"
          >
            + {sug.slice(0, 22)}...
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN CALENDAR PAGE COMPONENT (MATCHING SCREENSHOT 1 PIXEL-FOR-PIXEL)
   ========================================================================= */
export default function CalendarPage() {
  // Calendar Month & Year State (Defaults to June 2035 from Screenshot 1)
  const [calendarYear, setCalendarYear] = React.useState(2035);
  const [calendarMonth, setCalendarMonth] = React.useState(5); // 0 = Jan, 5 = June
  const [showMonthMenu, setShowMonthMenu] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<number>(21);

  // Filter column collapsible state (User explicitly praised: "i like the filte collapsing u did there")
  const [isFilterCollapsed, setIsFilterCollapsed] = React.useState(false);

  // Filter States
  const [selectedAgendaTypes, setSelectedAgendaTypes] = React.useState<string[]>([...AGENDA_FILTERS]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([
    "Talent Acquisition",
    "Employee Development",
    "Workplace Engagement"
  ]);

  // Database State
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);
  const [employees, setEmployees] = React.useState<any[]>([]);

  // Detailed Entry View (ClickUp-style) Modal
  const [detailEvent, setDetailEvent] = React.useState<CalendarEvent | null>(null);

  // New Agenda Modal State
  const [isNewAgendaOpen, setIsNewAgendaOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("Talent Acquisition");
  const [newDay, setNewDay] = React.useState<number>(21);
  const [newTime, setNewTime] = React.useState("09:00 AM");
  const [newEndTime, setNewEndTime] = React.useState("10:00 AM");
  const [newLocation, setNewLocation] = React.useState("HR Room 2B");
  const [newNote, setNewNote] = React.useState("");
  const [newAttendees, setNewAttendees] = React.useState<Attendee[]>([]);
  const [newMeetingType, setNewMeetingType] = React.useState<string>("Zoom Meeting");
  const [newMeetingLink, setNewMeetingLink] = React.useState<string>("");
  const [newKeyPoints, setNewKeyPoints] = React.useState<string[]>([
    "Review candidate portfolio & background",
    "Discuss remote work requirements & compensation"
  ]);

  // Custom Category One-Time Generator State
  const [isCustomCategoryMode, setIsCustomCategoryMode] = React.useState(false);
  const [customCatName, setCustomCatName] = React.useState("");

  // Edit Agenda Modal State
  const [isEditAgendaOpen, setIsEditAgendaOpen] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<CalendarEvent | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editCategory, setEditCategory] = React.useState("Talent Acquisition");
  const [editDay, setEditDay] = React.useState<number>(21);
  const [editTime, setEditTime] = React.useState("09:00 AM");
  const [editEndTime, setEditEndTime] = React.useState("10:00 AM");
  const [editLocation, setEditLocation] = React.useState("");
  const [editNote, setEditNote] = React.useState("");
  const [editAttendees, setEditAttendees] = React.useState<Attendee[]>([]);
  const [editMeetingType, setEditMeetingType] = React.useState<string>("Zoom Meeting");
  const [editMeetingLink, setEditMeetingLink] = React.useState<string>("");
  const [editKeyPoints, setEditKeyPoints] = React.useState<string[]>([]);

  // Toast State
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load calendar database records
  const loadCalendarData = React.useCallback(() => {
    const stored = getCollection<any[]>("db_schedules_v2", []);
    const emps = getCollection<any[]>("db_employees", []);
    setEmployees(emps);

    if (stored && stored.length > 0) {
      const merged = stored.map((st) => {
        const seed = DEFAULT_SCHEDULES_JUNE_2035.find((d) => d.id === st.id);
        if (seed) {
          return {
            ...seed,
            ...st,
            meetingType: st.meetingType || seed.meetingType,
            meetingLink: st.meetingLink || seed.meetingLink,
            keyPoints: st.keyPoints || seed.keyPoints,
          };
        }
        return st;
      });
      setEvents(merged);
    } else {
      saveCollection("db_schedules_v2", DEFAULT_SCHEDULES_JUNE_2035);
      setEvents(DEFAULT_SCHEDULES_JUNE_2035);
    }
  }, []);

  React.useEffect(() => {
    loadCalendarData();
    window.addEventListener("db_updated", loadCalendarData);
    window.addEventListener("storage", loadCalendarData);
    return () => {
      window.removeEventListener("db_updated", loadCalendarData);
      window.removeEventListener("storage", loadCalendarData);
    };
  }, [loadCalendarData]);

  // Calendar Date Math
  const daysInMonth = React.useMemo(() => {
    return new Date(calendarYear, calendarMonth + 1, 0).getDate();
  }, [calendarYear, calendarMonth]);

  const firstDayOfWeek = React.useMemo(() => {
    return new Date(calendarYear, calendarMonth, 1).getDay();
  }, [calendarYear, calendarMonth]);

  const prevMonthDaysCount = React.useMemo(() => {
    return new Date(calendarYear, calendarMonth, 0).getDate();
  }, [calendarYear, calendarMonth]);

  const prevMonthDays = React.useMemo(() => {
    return Array.from({ length: firstDayOfWeek }, (_, i) => {
      return prevMonthDaysCount - firstDayOfWeek + i + 1;
    });
  }, [firstDayOfWeek, prevMonthDaysCount]);

  const currentMonthDays = React.useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  const totalCells = prevMonthDays.length + currentMonthDays.length;
  const nextMonthCellsCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const nextMonthDays = React.useMemo(() => {
    return Array.from({ length: nextMonthCellsCount }, (_, i) => i + 1);
  }, [nextMonthCellsCount]);

  // Filtered Events
  const filteredEvents = React.useMemo(() => {
    return events.filter((evt) => {
      const monthMatch = evt.month === undefined || (evt.month === calendarMonth && evt.year === calendarYear);
      if (!monthMatch) return false;

      if (selectedCategories.length > 0 && !selectedCategories.some((c) => c.toLowerCase() === evt.category.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [events, calendarMonth, calendarYear, selectedCategories]);

  // Events on selected day (Displayed in Details Schedule on right)
  const selectedDayEvents = React.useMemo(() => {
    return filteredEvents.filter((e) => e.day === selectedDay);
  }, [filteredEvents, selectedDay]);

  // Dynamic Stats
  const totalMonthEvents = React.useMemo(() => {
    return events.filter((e) => e.month === undefined || (e.month === calendarMonth && e.year === calendarYear));
  }, [events, calendarMonth, calendarYear]);

  const talentAcqCount = React.useMemo(() => {
    return totalMonthEvents.filter((e) => e.category.toLowerCase().includes("talent")).length;
  }, [totalMonthEvents]);

  const empDevCount = React.useMemo(() => {
    return totalMonthEvents.filter((e) => e.category.toLowerCase().includes("development")).length;
  }, [totalMonthEvents]);

  const workplaceCount = React.useMemo(() => {
    return totalMonthEvents.filter((e) => e.category.toLowerCase().includes("workplace")).length;
  }, [totalMonthEvents]);

  // Persist helper
  const persistEvents = (updated: CalendarEvent[]) => {
    setEvents(updated);
    saveCollection("db_schedules_v2", updated);
  };

  // Create New Agenda
  const handleCreateAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const chosenCategory = isCustomCategoryMode && customCatName.trim() ? customCatName.trim() : newCategory;

    const newEvent: CalendarEvent = {
      id: `evt-${Date.now()}`,
      day: newDay,
      month: calendarMonth,
      year: calendarYear,
      title: newTitle.trim(),
      category: chosenCategory,
      time: newTime,
      endTime: newEndTime,
      loc: newLocation.trim() || (newMeetingType.includes("Zoom") ? "Zoom Virtual" : "HR Room 2B"),
      note: newNote.trim() || "No notes provided.",
      priority: "Medium",
      status: "Scheduled",
      attendees: newAttendees,
      meetingType: newMeetingType,
      meetingLink: newMeetingLink.trim(),
      keyPoints: newKeyPoints.filter((k) => k.trim().length > 0),
      checklist: [{ id: "c1", text: "Prepare agenda briefing", done: false }]
    };

    const updated = [...events, newEvent];
    persistEvents(updated);
    setSelectedDay(newDay);

    // Reset Form
    setNewTitle("");
    setNewNote("");
    setNewLocation("HR Room 2B");
    setNewAttendees([]);
    setNewMeetingType("Zoom Meeting");
    setNewMeetingLink("");
    setNewKeyPoints([
      "Review candidate portfolio & background",
      "Discuss remote work requirements & compensation"
    ]);
    setIsCustomCategoryMode(false);
    setCustomCatName("");
    setIsNewAgendaOpen(false);

    showToast(`Agenda "${newEvent.title}" scheduled!`);
  };

  // Open Edit Modal
  const handleOpenEdit = (evt: CalendarEvent) => {
    setEditingEvent(evt);
    setEditTitle(evt.title);
    setEditCategory(evt.category);
    setEditDay(evt.day);
    setEditTime(evt.time);
    setEditEndTime(evt.endTime || "10:00 AM");
    setEditLocation(evt.loc);
    setEditNote(evt.note);
    setEditAttendees(evt.attendees || []);
    setEditMeetingType(evt.meetingType || (evt.loc.toLowerCase().includes("zoom") ? "Zoom Meeting" : "On-site / Office"));
    setEditMeetingLink(evt.meetingLink || "");
    setEditKeyPoints(evt.keyPoints || []);
    setIsEditAgendaOpen(true);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editTitle.trim()) return;

    const updated = events.map((item) => {
      if (item.id === editingEvent.id) {
        return {
          ...item,
          title: editTitle.trim(),
          category: editCategory,
          day: editDay,
          time: editTime,
          endTime: editEndTime,
          loc: editLocation.trim(),
          note: editNote.trim(),
          attendees: editAttendees,
          meetingType: editMeetingType,
          meetingLink: editMeetingLink.trim(),
          keyPoints: editKeyPoints.filter((k) => k.trim().length > 0),
        };
      }
      return item;
    });

    persistEvents(updated);
    setIsEditAgendaOpen(false);
    setEditingEvent(null);
    showToast("Agenda updated successfully!");
  };

  // Delete Agenda
  const handleDeleteAgenda = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    persistEvents(updated);
    if (detailEvent && detailEvent.id === id) setDetailEvent(null);
    if (isEditAgendaOpen && editingEvent && editingEvent.id === id) {
      setIsEditAgendaOpen(false);
      setEditingEvent(null);
    }
    showToast("Agenda removed.");
  };

  return (
    <AppLayout title="Calendar" breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Calendar" }]}>
      <div className="space-y-5 text-left">
        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[300] bg-[#0E4D41] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-[#35BFA3] text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 text-[#35BFA3]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. TOP SUMMARY CARDS ROW - EXACT FIGMA MATCH */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total All Schedules */}
          <div className="bg-[#E4F2D3] rounded-[16px] p-4 flex items-center justify-between h-[68px]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[8px] bg-[#0E4D41] flex items-center justify-center text-white shrink-0">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <span className="text-[12px] text-[#63716E] leading-[130%] font-normal">
                Total All
                <br />
                Schedules
              </span>
            </div>
            <span className="text-[28px] font-bold text-[#203430] tracking-[-0.04em]">
              {totalMonthEvents.length}
            </span>
          </div>

          {/* Card 2: Talent Acquisition */}
          <div className="bg-white border border-[#E5E6E6] rounded-[16px] p-4 flex items-center justify-between h-[68px]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[8px] bg-[#F7F7F7] flex items-center justify-center text-[#35BFA3] shrink-0">
                <Handshake className="h-5 w-5" />
              </div>
              <span className="text-[12px] text-[#63716E] leading-[130%] font-normal">
                Talent
                <br />
                Acquisition
              </span>
            </div>
            <span className="text-[28px] font-bold text-[#203430] tracking-[-0.04em]">
              {talentAcqCount}
            </span>
          </div>

          {/* Card 3: Employee Development */}
          <div className="bg-white border border-[#E5E6E6] rounded-[16px] p-4 flex items-center justify-between h-[68px]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[8px] bg-[#F7F7F7] flex items-center justify-center text-[#35BFA3] shrink-0">
                <UserCog className="h-5 w-5" />
              </div>
              <span className="text-[12px] text-[#63716E] leading-[130%] font-normal">
                Employee
                <br />
                Development
              </span>
            </div>
            <span className="text-[28px] font-bold text-[#203430] tracking-[-0.04em]">
              {empDevCount}
            </span>
          </div>

          {/* Card 4: Workplace Engagement */}
          <div className="bg-white border border-[#E5E6E6] rounded-[16px] p-4 flex items-center justify-between h-[68px]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[8px] bg-[#F7F7F7] flex items-center justify-center text-[#35BFA3] shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-[12px] text-[#63716E] leading-[130%] font-normal">
                Workplace
                <br />
                Engagement
              </span>
            </div>
            <span className="text-[28px] font-bold text-[#203430] tracking-[-0.04em]">
              {workplaceCount}
            </span>
          </div>
        </div>

        {/* 2. MAIN CALENDAR CONTAINER CARD - EXACT FIGMA THREE-SECTION LAYOUT */}
        <div className="bg-white rounded-[16px] border border-[#E5E6E6] flex flex-col lg:flex-row overflow-hidden min-h-[800px]">
          {/* SECTION 1: FILTER SIDEBAR (COLLAPSIBLE AS PRAISED BY USER) */}
          {!isFilterCollapsed ? (
            <div className="w-full lg:w-[175px] shrink-0 border-b lg:border-b-0 lg:border-r border-[#E5E6E6] p-4 flex flex-col gap-4 text-left">
              {/* Filter Header with Close/Collapse Icon */}
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-[16px] font-semibold text-[#203430] tracking-[-0.04em]">
                  Filter
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFilterCollapsed(true)}
                  className="p-1 rounded text-[#203430] hover:bg-[#F7F7F7] cursor-pointer"
                  title="Collapse Filter"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Agenda Checkbox Group */}
              <div className="space-y-3.5">
                <h4 className="text-[14px] font-medium text-[#203430]">
                  Agenda
                </h4>
                <div className="space-y-3.5">
                  {AGENDA_FILTERS.map((item) => {
                    const isChecked = selectedAgendaTypes.includes(item);
                    return (
                      <label
                        key={item}
                        className="flex items-center gap-2 cursor-pointer select-none group"
                      >
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            if (isChecked) {
                              setSelectedAgendaTypes(selectedAgendaTypes.filter((t) => t !== item));
                            } else {
                              setSelectedAgendaTypes([...selectedAgendaTypes, item]);
                            }
                          }}
                          className={cn(
                            "w-3 h-3 rounded-[3px] flex items-center justify-center shrink-0 border transition-colors",
                            isChecked
                              ? "bg-[#35BFA3] border-[#35BFA3] text-white"
                              : "border-[#A4ACAB] bg-white"
                          )}
                        >
                          {isChecked && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </div>
                        <span className="text-[12px] text-[#63716E] group-hover:text-[#203430] truncate">
                          {item}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Category Color Tag Group */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-[14px] font-medium text-[#203430]">
                  Category
                </h4>
                <div className="space-y-2.5">
                  {[
                    { name: "Talent Acquisition", color: "bg-[#E4F2D3]" },
                    { name: "Employee Development", color: "bg-[#FDF5DF]" },
                    { name: "Workplace Engagement", color: "bg-[#E5E6E6]" },
                  ].map((cat) => {
                    const isChecked = selectedCategories.includes(cat.name);
                    return (
                      <div
                        key={cat.name}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedCategories(selectedCategories.filter((c) => c !== cat.name));
                          } else {
                            setSelectedCategories([...selectedCategories, cat.name]);
                          }
                        }}
                        className="flex items-center gap-2 cursor-pointer select-none"
                      >
                        <span className={cn("w-2.5 h-2.5 rounded-[2px] shrink-0", cat.color)} />
                        <span className={cn("text-[12px] truncate", isChecked ? "text-[#63716E] font-normal" : "text-[#A4ACAB] line-through")}>
                          {cat.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Collapsed Filter Rail */
            <div className="hidden lg:flex flex-col items-center py-4 px-2 border-r border-[#E5E6E6] bg-white">
              <button
                type="button"
                onClick={() => setIsFilterCollapsed(false)}
                className="p-1.5 rounded-lg bg-[#E4F2D3] hover:bg-[#d8ebc3] text-[#203430] cursor-pointer"
                title="Expand Filter"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
              <span className="text-[10px] font-bold text-[#63716E] [writing-mode:vertical-rl] rotate-180 mt-4 tracking-wider">
                FILTER
              </span>
            </div>
          )}

          {/* SECTION 2: CENTER CALENDAR GRID - EXACT FIGMA MATCH */}
          <div className="flex-1 min-w-0 p-4 flex flex-col border-b lg:border-b-0 lg:border-r border-[#E5E6E6]">
            {/* Toolbar Header */}
            <div className="flex items-center justify-between pb-4 gap-2 flex-wrap">
              {/* Month & Caret */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMonthMenu(!showMonthMenu)}
                  className="flex items-center gap-1 text-[18px] font-semibold text-[#1E1E20] tracking-[-0.04em] hover:opacity-80 cursor-pointer"
                >
                  <span>{MONTH_NAMES[calendarMonth]} {calendarYear}</span>
                  <ChevronDown className="h-4 w-4 text-[#777779]" />
                </button>

                {showMonthMenu && (
                  <>
                    <div className="fixed inset-0 z-[199]" onClick={() => setShowMonthMenu(false)} />
                    <div className="absolute left-0 top-8 z-[200] w-60 bg-white rounded-xl shadow-xl border border-[#E5E6E6] p-3 animate-in fade-in">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E6E6]">
                        <button
                          type="button"
                          onClick={() => setCalendarYear((y) => y - 1)}
                          className="p-1 rounded hover:bg-slate-100"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-xs font-bold text-[#203430]">{calendarYear}</span>
                        <button
                          type="button"
                          onClick={() => setCalendarYear((y) => y + 1)}
                          className="p-1 rounded hover:bg-slate-100"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {MONTH_NAMES.map((m, idx) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              setCalendarMonth(idx);
                              setShowMonthMenu(false);
                            }}
                            className={cn(
                              "py-1 text-[11px] rounded font-medium",
                              calendarMonth === idx ? "bg-[#35BFA3] text-white font-bold" : "hover:bg-slate-100 text-[#203430]"
                            )}
                          >
                            {m.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Exact 3 Buttons from Figma Specs: Filter, Month, + New Agenda */}
              <div className="flex items-center gap-2.5">
                {/* 1. Filter Button */}
                <button
                  type="button"
                  onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
                  className="h-[34px] px-3 bg-[#E4F2D3] hover:bg-[#d8ebc3] rounded-[8px] text-[12px] font-medium text-[#203430] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FilterIcon className="h-4 w-4 text-[#203430]" />
                  <span>Filter</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#203430]" />
                </button>

                {/* 2. Month Button */}
                <button
                  type="button"
                  onClick={() => setShowMonthMenu(!showMonthMenu)}
                  className="h-[34px] px-3 bg-[#E4F2D3] hover:bg-[#d8ebc3] rounded-[8px] text-[12px] font-medium text-[#203430] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CalendarIcon className="h-4 w-4 text-[#203430]" />
                  <span>Month</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#203430]" />
                </button>

                {/* 3. + New Agenda Button */}
                <button
                  type="button"
                  onClick={() => {
                    setNewDay(selectedDay);
                    setIsNewAgendaOpen(true);
                  }}
                  className="h-[34px] px-3.5 bg-[#35BFA3] hover:bg-[#2da38b] text-white rounded-[8px] text-[12px] font-medium flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-white" />
                  <span>New Agenda</span>
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-[#E5E6E6] text-center pb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-[12px] font-medium text-[#203430]">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Cells Grid - Exact Figma Specs */}
            <div className="grid grid-cols-7 flex-1 border-collapse">
              {/* Prev Month Days */}
              {prevMonthDays.map((d) => (
                <div
                  key={`prev-${d}`}
                  className="min-h-[110px] p-1.5 border-r border-b border-[#E5E6E6] bg-[#F7F7F7] flex flex-col items-end"
                >
                  <span className="text-[12px] font-medium text-[#A4ACAB]">{d}</span>
                </div>
              ))}

              {/* Current Month Active Days */}
              {currentMonthDays.map((day) => {
                const dayEvents = filteredEvents.filter((e) => e.day === day);
                const isSelected = day === selectedDay;

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "min-h-[110px] p-1.5 border-r border-b border-[#E5E6E6] flex flex-col transition-all cursor-pointer relative",
                      isSelected
                        ? "bg-[#F8FCF3] border border-[#35BFA3] rounded-[6px] z-10"
                        : "bg-white hover:bg-slate-50/50"
                    )}
                  >
                    {/* Date Number Top-Right */}
                    <div className="flex justify-end mb-1">
                      <span
                        className={cn(
                          "text-[12px]",
                          isSelected
                            ? "text-[#35BFA3] font-bold"
                            : "text-[#203430] font-medium"
                        )}
                      >
                        {day}
                      </span>
                    </div>

                    {/* Exact Card Design from Screenshot 1 */}
                    <div className="space-y-1 flex-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((evt) => {
                        const theme = getEventTheme(evt.category);
                        return (
                          <div
                            key={evt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDay(day);
                              setDetailEvent(evt);
                            }}
                            className={cn(
                              "rounded-[4px] p-1.5 flex flex-col justify-between transition-all hover:opacity-90 shadow-2xs cursor-pointer",
                              theme.cardBg
                            )}
                          >
                            {/* Category Header */}
                            <div className="text-[9px] text-[#63716E] font-normal truncate">
                              {evt.category}
                            </div>
                            {/* Event Title */}
                            <div className="text-[10px] font-semibold text-[#203430] leading-[130%] line-clamp-1 my-0.5">
                              {evt.title}
                            </div>
                            {/* Footer: Time & Category Dot */}
                            <div className="flex items-center justify-between mt-0.5">
                              <span className="text-[8px] text-[#63716E] font-normal">
                                {evt.time}
                              </span>
                              <span className={cn("w-2 h-2 rounded-full shrink-0", theme.dotColor)} />
                            </div>
                          </div>
                        );
                      })}

                      {dayEvents.length > 2 && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDay(day);
                          }}
                          className="text-[9px] font-medium text-[#0E4D41] bg-[#E4F2D3] hover:bg-[#d8ebc3] rounded px-1.5 py-0.5 text-center cursor-pointer transition-colors shadow-2xs"
                        >
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Next Month Days */}
              {nextMonthDays.map((d) => (
                <div
                  key={`next-${d}`}
                  className="min-h-[110px] p-1.5 border-r border-b border-[#E5E6E6] bg-[#F7F7F7] flex flex-col items-end"
                >
                  <span className="text-[12px] font-medium text-[#A4ACAB]">{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: DETAILS SCHEDULE RIGHT PANEL - EXACT FIGMA MATCH */}
          <div className="w-full lg:w-[232px] shrink-0 p-4 flex flex-col gap-4 text-left bg-white">
            {/* Header */}
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-[16px] font-semibold text-[#203430] tracking-[-0.04em]">
                  Details Schedule
                </h3>
                <p className="text-[11px] text-[#63716E]">
                  {selectedDay} {MONTH_NAMES[calendarMonth]} {calendarYear}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDay(0)}
                className="p-1 rounded text-[#363B3F] hover:bg-slate-100 cursor-pointer"
                title="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List of Details Schedule Cards */}
            <div className="space-y-4 overflow-y-auto max-h-[660px] custom-scrollbar pr-0.5 flex-1">
              {selectedDayEvents.length === 0 ? (
                <div className="py-12 px-3 text-center rounded-xl border border-dashed border-[#E5E6E6] bg-[#F7F7F7]/60">
                  <p className="text-[12px] font-medium text-[#203430]">
                    No events on {selectedDay} {MONTH_NAMES[calendarMonth].slice(0, 3)}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setNewDay(selectedDay);
                      setIsNewAgendaOpen(true);
                    }}
                    className="text-[11px] font-semibold text-[#0E4D41] hover:underline mt-2 block mx-auto cursor-pointer"
                  >
                    + Add New Agenda
                  </button>
                </div>
              ) : (
                selectedDayEvents.map((evt) => {
                  const theme = getEventTheme(evt.category);
                  return (
                    <div
                      key={evt.id}
                      onClick={() => setDetailEvent(evt)}
                      className={cn(
                        "rounded-[8px] p-4 flex flex-col gap-4 shadow-2xs transition-all hover:shadow-xs cursor-pointer text-left relative",
                        theme.cardBg
                      )}
                    >
                      {/* Top: Category Tag & Title */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={cn(
                              "inline-block px-1.5 py-0.5 rounded-[4px] text-[12px] font-medium text-[#63716E]",
                              theme.tagBg
                            )}
                          >
                            {evt.category}
                          </span>
                          {evt.meetingType && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10px] font-semibold bg-white/80 text-[#0E4D41] border border-black/5">
                              {evt.meetingType.includes("Zoom") ? (
                                <Video className="h-3 w-3 text-[#35BFA3]" />
                              ) : evt.meetingType.includes("Google") ? (
                                <Video className="h-3 w-3 text-[#35BFA3]" />
                              ) : evt.meetingType.includes("Office") || evt.meetingType.includes("site") ? (
                                <Building2 className="h-3 w-3 text-[#0E4D41]" />
                              ) : (
                                <Handshake className="h-3 w-3 text-[#0E4D41]" />
                              )}
                              {evt.meetingType}
                            </span>
                          )}
                        </div>
                        <h4 className="text-[16px] font-semibold text-[#203430] leading-[120%] tracking-[-0.04em]">
                          {evt.title}
                        </h4>
                      </div>

                      {/* Middle: Details Table Rows */}
                      <div className="space-y-1.5 pt-1 text-[12px]">
                        <div className="flex items-start">
                          <span className="w-16 text-[#63716E] font-normal shrink-0">Time</span>
                          <span className="text-[#203430] font-medium truncate">{evt.time}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-16 text-[#63716E] font-normal shrink-0">Location</span>
                          <span className="text-[#203430] font-medium truncate">{evt.loc}</span>
                        </div>
                        {evt.keyPoints && evt.keyPoints.length > 0 && (
                          <div className="flex items-start">
                            <span className="w-16 text-[#63716E] font-normal shrink-0">Agenda</span>
                            <span className="text-[#0E4D41] font-semibold truncate">
                              {evt.keyPoints.length} Key Points
                            </span>
                          </div>
                        )}
                        {evt.attendees && evt.attendees.length > 0 && (
                          <div className="flex items-center">
                            <span className="w-16 text-[#63716E] font-normal shrink-0">Team</span>
                            <div className="flex items-center -space-x-1.5">
                              {evt.attendees.slice(0, 3).map((a, i) => (
                                <img
                                  key={i}
                                  src={a.avatar}
                                  alt={a.name}
                                  title={`${a.name} (${a.role})`}
                                  className="h-4 w-4 rounded-full ring-1 ring-white object-cover"
                                />
                              ))}
                              {evt.attendees.length > 3 && (
                                <span className="text-[9px] text-[#63716E] pl-2 font-medium">
                                  +{evt.attendees.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="flex items-start">
                          <span className="w-16 text-[#63716E] font-normal shrink-0">Note</span>
                          <span className="text-[#203430] font-medium line-clamp-2 leading-snug">{evt.note}</span>
                        </div>
                      </div>

                      {/* Bottom Edit Action */}
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(evt);
                          }}
                          className="text-[11px] font-semibold text-[#0E4D41] hover:underline cursor-pointer"
                        >
                          Edit Details →
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 3. NEW AGENDA MODAL - ENHANCED DETAILS, INLINE ATTENDEES & BESPOKE PICKERS */}
        {isNewAgendaOpen && (
          <div className="fixed inset-0 bg-[#203430]/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden text-left flex flex-col max-h-[92vh]">
              {/* Header */}
              <div className="px-6 py-4 bg-[#E4F2D3] border-b border-[#35BFA3]/20 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0E4D41]">Create New Agenda</h3>
                  <p className="text-[11px] text-[#63716E]">Schedule team meetings, 1-on-1s, or interviews</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewAgendaOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-white/60 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAgenda} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#203430]">Agenda Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Q3 Performance Review or Tech Lead Interview"
                    className="w-full text-xs h-9 px-3 border border-[#E5E6E6] rounded-xl focus:outline-none focus:border-[#35BFA3]"
                  />
                </div>

                {/* Category Selector with Custom One-Time Option */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-semibold text-[#203430]">Category</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomCategoryMode(!isCustomCategoryMode)}
                      className="text-[10px] font-semibold text-[#0E4D41] hover:underline cursor-pointer"
                    >
                      {isCustomCategoryMode ? "← Choose Standard" : "+ Custom One-Time Category"}
                    </button>
                  </div>

                  {isCustomCategoryMode ? (
                    <input
                      type="text"
                      autoFocus
                      required
                      placeholder="Type custom category name (e.g. Executive Sync)..."
                      value={customCatName}
                      onChange={(e) => setCustomCatName(e.target.value)}
                      className="w-full text-xs h-9 px-3 border border-[#35BFA3] rounded-xl focus:outline-none bg-[#F8FCF3]"
                    />
                  ) : (
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full text-xs h-9 px-2 bg-white border border-[#E5E6E6] rounded-xl focus:outline-none focus:border-[#35BFA3]"
                    >
                      <option value="Talent Acquisition">Talent Acquisition</option>
                      <option value="Employee Development">Employee Development</option>
                      <option value="Workplace Engagement">Workplace Engagement</option>
                    </select>
                  )}
                </div>

                {/* Meeting Format / Type Selector */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-[#203430]">Meeting Format & Platform</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {MEETING_FORMAT_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = newMeetingType === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setNewMeetingType(opt.id);
                            if (opt.id.includes("Zoom") && !newLocation.trim()) {
                              setNewLocation("Zoom Virtual");
                            } else if (opt.id.includes("Google") && !newLocation.trim()) {
                              setNewLocation("Google Meet");
                            } else if (opt.id.includes("Office") && !newLocation.trim()) {
                              setNewLocation("Conference Room 1A");
                            }
                          }}
                          className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer",
                            isSelected
                              ? "bg-[#E4F2D3] border-[#35BFA3] text-[#0E4D41] shadow-2xs font-semibold ring-1 ring-[#35BFA3]"
                              : "bg-white border-[#E5E6E6] text-[#63716E] hover:bg-[#F7F7F7]"
                          )}
                        >
                          <Icon className={cn("h-4 w-4 mb-1", isSelected ? "text-[#0E4D41]" : "text-[#63716E]")} />
                          <span className="text-[11px] leading-tight">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Virtual Meeting Link (Conditional) */}
                {(newMeetingType.includes("Zoom") || newMeetingType.includes("Google") || newMeetingType.includes("Virtual")) && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-[12px] font-semibold text-[#203430] flex items-center gap-1.5">
                      <LinkIcon className="h-3.5 w-3.5 text-[#35BFA3]" />
                      <span>Virtual Meeting Link / URL</span>
                    </label>
                    <input
                      type="url"
                      value={newMeetingLink}
                      onChange={(e) => setNewMeetingLink(e.target.value)}
                      placeholder="e.g. https://zoom.us/j/9384729103 or meet.google.com/xyz"
                      className="w-full text-xs h-9 px-3 border border-[#E5E6E6] rounded-xl focus:outline-none focus:border-[#35BFA3] bg-[#F8FCF3]/50"
                    />
                  </div>
                )}

                {/* Custom Date & Time Range Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CustomDayPicker
                    value={newDay}
                    onChange={setNewDay}
                    daysInMonth={daysInMonth}
                    month={calendarMonth}
                    year={calendarYear}
                    events={events}
                  />
                  <CustomTimeRangePicker
                    startTime={newTime}
                    endTime={newEndTime}
                    onChange={(st, et) => {
                      setNewTime(st);
                      setNewEndTime(et);
                    }}
                  />
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#203430]">Location / Room</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. HR Room 2B / Zoom Virtual / Executive Suite"
                    className="w-full text-xs h-9 px-3 border border-[#E5E6E6] rounded-xl focus:outline-none focus:border-[#35BFA3]"
                  />
                </div>

                {/* Scalable & Inline Attendee Picker (Always In Display) */}
                <InlineAttendeePicker
                  employees={employees}
                  selectedAttendees={newAttendees}
                  onChange={(atts) => setNewAttendees(atts)}
                />

                {/* Enhanced Details: Key Discussion Points & Agenda Items */}
                <KeyPointsEditor
                  keyPoints={newKeyPoints}
                  onChange={setNewKeyPoints}
                />

                {/* Note */}
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#203430]">Notes & Briefing Instructions</label>
                  <textarea
                    rows={2}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Provide meeting summary, preparation notes..."
                    className="w-full text-xs p-2.5 border border-[#E5E6E6] rounded-xl focus:outline-none focus:border-[#35BFA3] resize-none"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E6E6]">
                  <button
                    type="button"
                    onClick={() => setIsNewAgendaOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#63716E] hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-[#35BFA3] hover:bg-[#2da38b] text-white rounded-xl shadow-2xs cursor-pointer"
                  >
                    Schedule Agenda
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. EDIT AGENDA MODAL */}
        {isEditAgendaOpen && editingEvent && (
          <div className="fixed inset-0 bg-[#203430]/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden text-left flex flex-col max-h-[92vh]">
              <div className="px-6 py-4 bg-[#E4F2D3] border-b border-[#35BFA3]/20 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0E4D41]">Edit Calendar Agenda</h3>
                  <p className="text-[11px] text-[#63716E]">Modify agenda schedule, format, and details</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditAgendaOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-white/60 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#203430]">Title *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-xs h-9 px-3 border border-[#E5E6E6] rounded-xl focus:outline-none focus:border-[#35BFA3]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#203430]">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full text-xs h-9 px-2 bg-white border border-[#E5E6E6] rounded-xl focus:outline-none focus:border-[#35BFA3]"
                  >
                    <option value="Talent Acquisition">Talent Acquisition</option>
                    <option value="Employee Development">Employee Development</option>
                    <option value="Workplace Engagement">Workplace Engagement</option>
                  </select>
                </div>

                {/* Meeting Format / Type Selector */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-[#203430]">Meeting Format & Platform</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {MEETING_FORMAT_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = editMeetingType === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setEditMeetingType(opt.id)}
                          className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer",
                            isSelected
                              ? "bg-[#E4F2D3] border-[#35BFA3] text-[#0E4D41] shadow-2xs font-semibold ring-1 ring-[#35BFA3]"
                              : "bg-white border-[#E5E6E6] text-[#63716E] hover:bg-[#F7F7F7]"
                          )}
                        >
                          <Icon className={cn("h-4 w-4 mb-1", isSelected ? "text-[#0E4D41]" : "text-[#63716E]")} />
                          <span className="text-[11px] leading-tight">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Virtual Meeting Link */}
                {(editMeetingType.includes("Zoom") || editMeetingType.includes("Google") || editMeetingType.includes("Virtual")) && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-[12px] font-semibold text-[#203430] flex items-center gap-1.5">
                      <LinkIcon className="h-3.5 w-3.5 text-[#35BFA3]" />
                      <span>Virtual Meeting Link / URL</span>
                    </label>
                    <input
                      type="url"
                      value={editMeetingLink}
                      onChange={(e) => setEditMeetingLink(e.target.value)}
                      placeholder="e.g. https://zoom.us/j/9384729103"
                      className="w-full text-xs h-9 px-3 border border-[#E5E6E6] rounded-xl focus:outline-none focus:border-[#35BFA3] bg-[#F8FCF3]/50"
                    />
                  </div>
                )}

                {/* Custom Pickers for Day & Unified Time Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CustomDayPicker
                    value={editDay}
                    onChange={setEditDay}
                    daysInMonth={daysInMonth}
                    month={calendarMonth}
                    year={calendarYear}
                    events={events}
                  />
                  <CustomTimeRangePicker
                    startTime={editTime}
                    endTime={editEndTime}
                    onChange={(st, et) => {
                      setEditTime(st);
                      setEditEndTime(et);
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#203430]">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full text-xs h-9 px-3 border border-[#E5E6E6] rounded-xl focus:outline-none focus:border-[#35BFA3]"
                  />
                </div>

                {/* Inline Attendee Picker in Edit Modal */}
                <InlineAttendeePicker
                  employees={employees}
                  selectedAttendees={editAttendees}
                  onChange={setEditAttendees}
                />

                {/* Key Points in Edit Modal */}
                <KeyPointsEditor
                  keyPoints={editKeyPoints}
                  onChange={setEditKeyPoints}
                />

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#203430]">Notes & Instructions</label>
                  <textarea
                    rows={2}
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#E5E6E6] rounded-xl focus:outline-none focus:border-[#35BFA3] resize-none"
                  />
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#E5E6E6]">
                  <button
                    type="button"
                    onClick={() => handleDeleteAgenda(editingEvent.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 cursor-pointer"
                  >
                    Delete
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditAgendaOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-[#63716E] hover:bg-slate-100 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold bg-[#35BFA3] text-white rounded-xl shadow-2xs hover:bg-[#2da38b] cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 5. CLICKUP DETAIL MODAL (WHEN EVENT IS CLICKED) */}
        {detailEvent && (
          <div className="fixed inset-0 bg-[#203430]/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden text-left flex flex-col max-h-[92vh]">
              {/* Header */}
              <div className="p-5 bg-[#E4F2D3] border-b border-[#35BFA3]/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#0E4D41] uppercase tracking-wider">
                      {detailEvent.category}
                    </span>
                    {detailEvent.meetingType && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#0E4D41] shadow-2xs">
                        {detailEvent.meetingType.includes("Zoom") ? (
                          <Video className="h-3 w-3 text-[#35BFA3]" />
                        ) : detailEvent.meetingType.includes("Office") || detailEvent.meetingType.includes("site") ? (
                          <Building2 className="h-3 w-3 text-[#0E4D41]" />
                        ) : (
                          <Handshake className="h-3 w-3 text-[#0E4D41]" />
                        )}
                        {detailEvent.meetingType}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[#203430] leading-tight mt-1">
                    {detailEvent.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailEvent(null)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-white/60 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 text-xs overflow-y-auto custom-scrollbar flex-1">
                {/* Time & Date */}
                <div className="flex items-center gap-2 text-[#63716E]">
                  <Clock className="h-4 w-4 text-[#35BFA3] shrink-0" />
                  <span className="font-semibold text-[#203430]">
                    {detailEvent.time} {detailEvent.endTime ? `– ${detailEvent.endTime}` : ""}
                  </span>
                  <span>•</span>
                  <span>{detailEvent.day} {MONTH_NAMES[calendarMonth]} {calendarYear}</span>
                </div>

                {/* Location & Meeting Link */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[#63716E]">
                    <MapPin className="h-4 w-4 text-[#35BFA3] shrink-0" />
                    <span className="font-semibold text-[#203430]">{detailEvent.loc}</span>
                  </div>
                  {detailEvent.meetingLink && (
                    <a
                      href={detailEvent.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0E4D41] hover:bg-[#166534] text-white rounded-lg text-[11px] font-semibold transition-colors shadow-2xs"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Join Meeting</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {/* Key Discussion Points & Agenda Bullet Points */}
                {detailEvent.keyPoints && detailEvent.keyPoints.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-[#0E4D41] uppercase tracking-wider block">
                      Agenda & Key Points ({detailEvent.keyPoints.length})
                    </span>
                    <div className="space-y-1.5 bg-[#F8FCF3] border border-[#35BFA3]/30 p-3 rounded-xl">
                      {detailEvent.keyPoints.map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#35BFA3] shrink-0 mt-1.5" />
                          <span className="text-[#203430] font-medium leading-relaxed">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attendees */}
                {detailEvent.attendees && detailEvent.attendees.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-[#0E4D41] uppercase tracking-wider block">
                      Attendees ({detailEvent.attendees.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#F7F7F7] p-2.5 rounded-xl max-h-36 overflow-y-auto custom-scrollbar">
                      {detailEvent.attendees.map((att, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-[#E5E6E6]">
                          <img src={att.avatar} alt={att.name} className="h-6 w-6 rounded-full object-cover" />
                          <div className="truncate">
                            <div className="font-semibold text-[#203430] text-[11px] truncate">{att.name}</div>
                            <div className="text-[9px] text-[#63716E] truncate">{att.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Note */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block">
                    Notes
                  </span>
                  <div className="p-3 bg-[#F7F7F7] rounded-xl text-[#203430] leading-relaxed">
                    {detailEvent.note || "No notes provided."}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-[#E5E6E6]">
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteAgenda(detailEvent.id);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 cursor-pointer"
                  >
                    Delete
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenEdit(detailEvent);
                        setDetailEvent(null);
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-[#E4F2D3] text-[#0E4D41] rounded-lg hover:bg-[#d8ebc3] cursor-pointer"
                    >
                      Edit Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetailEvent(null)}
                      className="px-4 py-1.5 text-xs font-semibold bg-[#0E4D41] text-white rounded-lg cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. FOOTER - EXACT FIGMA MATCH */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-6 border-t border-[#E5E6E6] mb-6">
          <div className="flex items-center gap-6">
            <p className="text-[12px] text-[#203430] font-bold">
              Copyright © 2025 Peterdraw
            </p>
            <div className="flex gap-4">
              {["Privacy Policy", "Term and conditions", "Contact"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[12px] text-[#63716E] hover:text-[#0E4D41] transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
              <button
                key={i}
                type="button"
                className="text-[#63716E] hover:text-[#0E4D41] transition-colors cursor-pointer"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
