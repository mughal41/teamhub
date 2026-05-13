import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card, Badge } from "../components/ui/LayoutAddons";
import { Button } from "../components/ui/Button";
import { 
  Search, 
  Settings, 
  Bell, 
  ChevronDown, 
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
  FileText
} from "lucide-react";
import { cn } from "@/src/lib/utils";

// Mock data for the calendar events
const monthlyEvents = [
  { day: 1, title: "Onboarding Session – New Hires Batch 3", category: "Talent Acquisition", time: "10:00 AM", color: "bg-emerald-50 text-emerald-700 border-l-brand" },
  { day: 5, title: "Interview – Product Designer", category: "Talent Acquisition", time: "09:00 AM", color: "bg-emerald-50 text-emerald-700 border-l-brand" },
  { day: 5, title: "Quarterly Policy Review", category: "Internal", time: "03:00 PM", color: "bg-slate-50 text-slate-600 border-l-slate-300" },
  { day: 7, title: "Team Communication Workshop", category: "Employee Development", time: "02:00 PM", color: "bg-amber-50 text-amber-700 border-l-amber-500" },
  { day: 13, title: "Performance Review Check-in – Marketing Team", category: "Employee Development", time: "01:00 PM", color: "bg-amber-50 text-amber-700 border-l-amber-500" },
  { day: 15, title: "Recruitment Planning – Q3 Targets", category: "Talent Acquisition", time: "11:00 AM", color: "bg-emerald-50 text-emerald-700 border-l-brand" },
  { day: 18, title: "Remote Work Compliance Briefing", category: "Workplace Engagement", time: "09:30 AM", color: "bg-slate-50 text-slate-600 border-l-slate-300" },
  { day: 21, title: "New Recruit Introduction", category: "Talent Acquisition", time: "09:00 AM", isCurrent: true, color: "bg-emerald-50 text-emerald-700 border-l-brand" },
  { day: 21, title: "Personal Growth Session – Leadership Track", category: "Employee Development", isCurrent: true, color: "bg-amber-50 text-amber-700 border-l-amber-500" },
  { day: 22, title: "Upskilling Program: Advanced Excel", category: "Employee Development", time: "03:30 PM", color: "bg-amber-50 text-amber-700 border-l-amber-500" },
  { day: 27, title: "Final Interview – Sales Manager", category: "Talent Acquisition", time: "10:00 AM", color: "bg-emerald-50 text-emerald-700 border-l-brand" },
  { day: 28, title: "Internal Team – Building Event", category: "Workplace Engagement", time: "08:00 AM", color: "bg-slate-50 text-slate-600 border-l-slate-300" },
];

export default function CalendarPage() {
  return (
    <AppLayout 
      title="Calendar" 
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Calendar" }]}
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="flex items-center gap-3 bg-[#E4F2D3] border-none p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0E4D41] text-white">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <span className="text-xs font-medium text-[#63716E]">Total All<br />Schedules</span>
              <span className="text-2xl font-bold text-[#203430]">12</span>
            </div>
          </Card>
          
          {[
            { label: "Talent Acquisition", val: 5, icon: Handshake },
            { label: "Employee Development", val: 4, icon: UserCog },
            { label: "Workplace Engagement", val: 3, icon: Users },
          ].map(stat => (
            <Card key={stat.label} className="flex items-center gap-3 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-brand">
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-xs font-medium text-[#63716E] leading-tight">{stat.label.split(' ')[0]}<br />{stat.label.split(' ')[1]}</span>
                <span className="text-2xl font-bold text-[#203430]">{stat.val}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Filter Sidebar */}
          <Card className="w-full shrink-0 border-r border-slate-100 lg:w-[200px] bg-white p-4">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-[#203430]">Filter</h3>
                <button className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
             </div>

             <div className="space-y-6">
                <div className="space-y-3">
                   <p className="text-[11px] font-bold text-[#203430]">Agenda</p>
                   <div className="space-y-3">
                      {[
                        "Recruitment", "Interview Schedules", "Onboarding Session", 
                        "Training Programs", "Coaching Sessions", "Performance Review"
                      ].map(item => (
                        <label key={item} className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" defaultChecked className="h-3 w-3 rounded-[3px] border-brand text-brand ring-0 focus:ring-0 cursor-pointer" />
                           <span className="text-[10px] font-medium text-[#63716E] group-hover:text-slate-900 transition-colors">{item}</span>
                        </label>
                      ))}
                   </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-50">
                   <p className="text-[11px] font-bold text-[#203430]">Category</p>
                   <div className="space-y-3">
                      {[
                        { label: "Talent Acquisition", color: "bg-[#E4F2D3]" },
                        { label: "Employee Development", color: "bg-[#FDF5DF]" },
                        { label: "Workplace Engagement", color: "bg-[#E5E6E6]" },
                      ].map(cat => (
                        <div key={cat.label} className="flex items-center gap-2">
                           <div className={cn("h-2.5 w-2.5 rounded-[2px]", cat.color)} />
                           <span className="text-[10px] font-medium text-[#63716E]">{cat.label}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </Card>

          {/* Calendar Grid Area */}
          <Card className="flex-1 p-4 bg-white overflow-hidden">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center gap-2 group cursor-pointer">
                 <h2 className="text-lg font-bold text-[#1E1E20]">June 2035</h2>
                 <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-brand transition-colors" />
              </div>

              <div className="flex items-center gap-2">
                 <button className="flex items-center gap-2 bg-[#E4F2D3] px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-700">
                    <FilterIcon className="h-3.5 w-3.5" /> Filter <ChevronDown className="h-3.5 w-3.5" />
                 </button>
                 <button className="flex items-center gap-2 bg-[#E4F2D3] px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-700">
                    <CalendarIcon className="h-3.5 w-3.5" /> Month <ChevronDown className="h-3.5 w-3.5" />
                 </button>
                 <Button className="h-8 gap-1 px-3 text-[11px] font-bold shadow-lg shadow-brand/20">
                    <Plus className="h-3.5 w-3.5" /> New Agenda
                 </Button>
              </div>
            </div>

            <div className="border-t border-slate-100">
              <div className="grid grid-cols-7 border-b border-slate-100">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="py-2.5 text-center text-[11px] font-bold text-[#203430] uppercase tracking-wider">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 border-l border-slate-50">
                 {/* Empty cells for previous month */}
                 {[27, 28, 29, 30, 31].map(d => (
                   <div key={d} className="h-32 border-r border-b border-slate-50 bg-[#F7F7F7] p-2 flex flex-col items-end">
                      <span className="text-[11px] font-medium text-[#A4ACAB]">{d}</span>
                   </div>
                 ))}
                 
                 {/* June cells */}
                 {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                   const cellEvents = monthlyEvents.filter(e => e.day === day);
                   const isToday = day === 21;
                   
                   return (
                     <div 
                      key={day} 
                      className={cn(
                        "h-32 border-r border-b border-slate-50 p-1.5 flex flex-col gap-1 overflow-hidden transition-colors hover:bg-slate-50/50 cursor-pointer",
                        isToday && "bg-[#F8FCF3] ring-1 ring-inset ring-brand z-10"
                      )}
                     >
                        <div className="flex justify-between items-start mb-0.5">
                           <span className={cn("text-[11px] font-bold w-full text-right", isToday ? "text-brand" : "text-[#203430]")}>
                             {day}
                           </span>
                        </div>
                        
                        <div className="space-y-1 overflow-y-auto hidden-scrollbar">
                           {cellEvents.map((evt, idx) => (
                             <div 
                              key={idx} 
                              className={cn(
                                "p-1.5 rounded-sm border-l-2 text-[8px] font-bold leading-tight shadow-sm",
                                evt.color
                              )}
                             >
                                <p className="line-clamp-2">{evt.title}</p>
                                {evt.time && <p className="mt-0.5 text-[7px] opacity-70">{evt.time}</p>}
                             </div>
                           ))}
                        </div>
                     </div>
                   );
                 })}
              </div>
            </div>
          </Card>

          {/* Details Sidebar */}
          <Card className="w-full shrink-0 lg:w-[240px] bg-white p-4">
             <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-[#203430]">Details Schedule</h3>
                <button className="text-slate-400"><X className="h-4 w-4" /></button>
             </div>
             <p className="text-[10px] font-medium text-slate-400 mb-6">21 June 2035</p>

             <div className="space-y-4">
                {[
                  { 
                    tag: "Talent Acquisition", 
                    tagColor: "bg-[#F8FCF3]", 
                    title: "New Recruit Introduction",
                    time: "09:00 AM",
                    loc: "HR Room 2B",
                    note: "Prepare welcome kits and ID cards",
                    color: "bg-[#E4F2D3]"
                  },
                  { 
                    tag: "Employee Development", 
                    tagColor: "bg-white", 
                    title: "Personal Growth Session – Leadership Track",
                    time: "02:00 PM",
                    loc: "Zoom (link shared via email)",
                    note: "Attendees must complete pre-s...",
                    color: "bg-[#FDF5DF]"
                  }
                ].map((item, i) => (
                   <div key={i} className={cn("p-4 rounded-lg flex flex-col gap-4", item.color)}>
                      <div className="space-y-2">
                         <div className={cn("inline-flex px-2 py-0.5 rounded text-[9px] font-bold text-[#63716E]", item.tagColor)}>
                            {item.tag}
                         </div>
                         <h4 className="text-xs font-bold text-[#203430] leading-tight">{item.title}</h4>
                      </div>
                      
                      <div className="space-y-1.5">
                         <div className="flex items-center justify-between text-[10px]">
                            <span className="text-[#63716E]">Time</span>
                            <span className="font-bold text-[#203430]">{item.time}</span>
                         </div>
                         <div className="flex items-center justify-between text-[10px]">
                            <span className="text-[#63716E]">Location</span>
                            <span className="font-bold text-[#203430] text-right truncate max-w-[80px]">{item.loc}</span>
                         </div>
                         <div className="flex flex-col gap-1 text-[10px]">
                            <span className="text-[#63716E]">Note</span>
                            <span className="font-medium text-[#203430] leading-normal">{item.note}</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pt-8 border-t border-slate-100 mb-8">
           <div className="flex items-center gap-6">
              <p className="text-[11px] text-[#203430] font-bold">Copyright © 2025 Peterdraw</p>
              <div className="flex gap-4">
                 {['Privacy Policy', 'Term and conditions', 'Contact'].map(link => (
                   <a key={link} href="#" className="text-[11px] text-[#63716E] font-medium hover:text-brand transition-colors">{link}</a>
                 ))}
              </div>
           </div>
           <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
                <button key={i} className="text-[#63716E] hover:text-brand transition-colors">
                   <Icon className="h-4 w-4" />
                </button>
              ))}
           </div>
        </div>
      </div>
    </AppLayout>
  );
}

