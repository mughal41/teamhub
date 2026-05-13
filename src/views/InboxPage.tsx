import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card, Badge as UIButton } from "../components/ui/LayoutAddons";
import { 
  Plus, 
  Inbox as InboxIcon, 
  Star, 
  Send, 
  FileText, 
  AlertOctagon, 
  Trash2, 
  Tag, 
  Search, 
  SlidersHorizontal,
  ArrowLeft,
  Archive,
  Printer,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  RotateCw,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  ListOrdered,
  Paperclip,
  Smile,
  Image,
  MoreVertical,
  Reply,
  Forward,
  X,
  Maximize2
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const inboxCategories = [
  { icon: InboxIcon, label: "Inbox", count: 10, active: true },
  { icon: Star, label: "Starred", count: 3 },
  { icon: Send, label: "Sent", count: 5 },
  { icon: FileText, label: "Drafts", count: 2 },
  { icon: AlertOctagon, label: "Spam", count: 1 },
  { icon: Trash2, label: "Trash" },
];

const labels = [
  { color: "bg-[#35BFA3]", label: "HR" },
  { color: "bg-[#0E4D41]", label: "Leave Requests" },
  { color: "bg-[#A4ACAB]", label: "Interview" },
  { color: "bg-[#F8C947]", label: "Admin Notes" },
];

const emails = [
  { 
    id: 1,
    sender: "Olivia Mason", 
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    label: "bg-[#0E4D41]",
    time: "10:24 AM",
    title: "Leave Request Approval",
    snippet: "Hi, I'd like to follow up on my annual leave request for next month, from July 15 to July 1...",
    active: true,
    starred: false,
    date: "19 Jun"
  },
  { 
    id: 2,
    sender: "Ethan Ray", 
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    label: "bg-[#F8C947]",
    time: "09:40 AM",
    title: "Updated Contact Info",
    snippet: "Just a quick heads-up that I've updated my emergency contact details on my profile. Kin...",
    starred: true,
    date: "19 Jun"
  },
  { 
    id: 3,
    sender: "Lina Armand", 
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    label: "bg-[#0E4D41]",
    time: "04:59 PM",
    title: "Medical Leave Submission",
    snippet: "I've attached my doctor's note for the requested medical leave from June 20 to Jun...",
    starred: false,
    date: "Yesterday"
  },
  { 
    id: 4,
    sender: "HR Department", 
    initials: "HR",
    label: "bg-gray-400",
    time: "03:11 PM",
    title: "Performance Review Reminder",
    snippet: "A reminder to complete your self-assessment form as part of the performance review cycle...",
    starred: true,
    date: "Yesterday"
  },
  { 
    id: 5,
    sender: "Jacob Yuen", 
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    label: "bg-[#35BFA3]",
    time: "09:25 AM",
    title: "Attendance Clarification",
    snippet: "Just wanted to clarify my absence earlier today. I experienced a personal emergency a...",
    starred: false,
    date: "Yesterday"
  },
  { 
    id: 6,
    sender: "System Notification", 
    initials: "SN",
    label: "bg-[#F8C947]",
    time: "06:00 PM",
    title: "Password Expiry Alert",
    snippet: "Your current password will expire in 5 days. To maintain account security, please reset it via...",
    starred: false,
    date: "Yesterday"
  },
  { 
    id: 7,
    sender: "Mia Torres", 
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    label: "bg-[#35BFA3]",
    time: "Yesterday",
    title: "Leave Policy Update",
    snippet: "Please review the newly updated 2035 leave policy document. It includes important updat...",
    starred: false,
    date: "Yesterday"
  },
];

export default function InboxPage() {
  const [activeEmailId, setActiveEmailId] = React.useState(1);
  const activeEmail = emails.find(e => e.id === activeEmailId) || emails[0];

  return (
    <AppLayout 
      title="Inbox" 
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Inbox" }]}
    >
      <div className="flex gap-6 h-[calc(100vh-140px)] min-h-[872px]">
        {/* Page Internal Sidebar */}
        <div className="w-[195px] flex flex-col gap-4">
           <button className="w-full bg-brand h-[44px] rounded-[12px] flex items-center justify-center gap-2 text-white font-semibold">
              <Plus className="h-5 w-5" /> New Message
           </button>

           <div className="space-y-1">
              {inboxCategories.map(cat => (
                 <button 
                  key={cat.label} 
                  className={cn(
                    "w-full h-11 flex items-center px-3.5 gap-2.5 rounded-[12px] transition-all group",
                    cat.active ? "bg-white text-[#203430] shadow-sm" : "text-[#63716E] hover:bg-white/50"
                  )}
                 >
                    <cat.icon className={cn("h-5 w-5 transition-colors", cat.active ? "text-[#203430]" : "text-[#63716E] group-hover:text-[#203430]")} />
                    <span className={cn("text-[14px] font-medium flex-1 text-left", cat.active ? "text-[#203430]" : "text-[#63716E]")}>{cat.label}</span>
                    {cat.count && (
                      <div className={cn("h-6 w-6 rounded-full flex items-center justify-center", cat.active ? "bg-brand" : "bg-white")}>
                         <span className={cn("text-[12px]", cat.active ? "text-white" : "text-[#63716E]")}>{cat.count}</span>
                      </div>
                    )}
                 </button>
              ))}
           </div>

           <div className="pt-4 mt-auto">
              <h4 className="text-[14px] font-bold text-[#203430] mb-4 px-1">Label</h4>
              <div className="space-y-1">
                 {labels.map(l => (
                    <button key={l.label} className="w-full h-11 flex items-center px-3.5 gap-2.5 rounded-[12px] hover:bg-white/50 group transition-all">
                       <Tag className={cn("h-5 w-5 fill-current", l.color.replace('bg-', 'text-'))} />
                       <span className="text-[14px] font-medium text-[#63716E] group-hover:text-[#203430]">{l.label}</span>
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Email List Column */}
        <Card className="flex-1 w-[385px] border-none rounded-[16px] bg-white shadow-sm flex flex-col p-4 gap-4">
           <div className="flex gap-2.5">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#203430]" />
                 <input 
                  type="text" 
                  placeholder="Search email" 
                  className="w-full h-10 pl-10 pr-4 bg-[#F7F7F7] rounded-[10px] outline-none text-[14px] text-[#63716E]"
                 />
              </div>
              <button className="h-10 w-10 flex items-center justify-center bg-[#E4F2D3] rounded-[10px] text-[#203430] hover:bg-brand hover:text-white transition-all">
                 <SlidersHorizontal className="h-5 w-5" />
              </button>
           </div>

           <div className="flex-1 overflow-y-auto space-y-0.5 pr-2 custom-scrollbar">
              {emails.map(e => (
                 <button 
                  key={e.id}
                  onClick={() => setActiveEmailId(e.id)}
                  className={cn(
                    "w-full p-4 flex gap-4 rounded-[8px] transition-all text-left",
                    e.id === activeEmailId ? "bg-[#F8FCF3]" : "bg-white border-b border-[#E5E6E6] last:border-none"
                  )}
                 >
                    {e.avatar ? (
                      <img src={e.avatar} className="h-10 w-10 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-[#0E4D41] flex items-center justify-center shrink-0 text-white font-medium">
                         {e.initials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0 space-y-1.5">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                             <span className="text-[14px] font-bold text-[#203430] truncate">{e.sender}</span>
                             <Tag className={cn("h-3.5 w-3.5 fill-current", e.label.replace('bg-', 'text-'))} />
                          </div>
                          <span className="text-[11px] text-[#63716E] shrink-0 font-medium">{e.time}</span>
                       </div>
                       <h4 className="text-[14px] font-bold text-[#203430] leading-none">{e.title}</h4>
                       <div className="flex items-end gap-2">
                          <p className="text-[12px] text-[#63716E] line-clamp-2 leading-[1.3] flex-1">{e.snippet}</p>
                          <Star className={cn("h-3.5 w-3.5 shrink-0", e.starred ? "fill-[#F8C947] text-[#F8C947]" : "text-[#A4ACAB]")} />
                       </div>
                    </div>
                 </button>
              ))}
           </div>
        </Card>

        {/* Email Detail View Column */}
        <div className="flex-[1.5] w-[543px] border-l border-[#E5E6E6] bg-white rounded-r-[16px] lg:rounded-[16px] shadow-sm flex flex-col p-4 min-w-0">
           {/* Detail Header */}
           <div className="bg-[#F7F7F7] rounded-[10px] p-2 flex items-center justify-between mb-4">
              <div className="flex gap-2">
                 {[ArrowLeft, Archive, Trash2, Printer, MoreHorizontal].map((Icon, i) => (
                    <button key={i} className="h-[22px] px-2 flex items-center justify-center text-[#63716E] hover:text-[#203430]">
                       <Icon className="h-4 w-4" />
                    </button>
                 ))}
              </div>
              <div className="flex items-center gap-2 pr-2">
                 <span className="text-[12px] text-[#63716E]">1 from 36</span>
                 <button className="h-7 w-7 flex items-center justify-center bg-white rounded-[8px] border border-[#E5E6E6] hover:bg-[#F7F7F7]"><ChevronLeft className="h-4 w-4" /></button>
                 <button className="h-7 w-7 flex items-center justify-center bg-white rounded-[8px] border border-[#E5E6E6] hover:bg-[#F7F7F7]"><ChevronRight className="h-4 w-4" /></button>
              </div>
           </div>

           {/* Detail Content Area */}
           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <img src={activeEmail.avatar || `https://ui-avatars.com/api/?name=${activeEmail.sender}&background=0E4D41&color=fff`} className="h-9 w-9 rounded-full object-cover" />
                    <div>
                       <p className="text-[14px] font-bold text-[#203430] leading-none mb-1">{activeEmail.sender}</p>
                       <p className="text-[12px] text-[#63716E] leading-none shrink-0">{activeEmail.sender.toLowerCase().replace(' ', '.')}@company.com</p>
                    </div>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                    <span className="text-[11px] text-[#777779] font-medium">{activeEmail.date} – {activeEmail.time}</span>
                    <div className="flex gap-2">
                       <button className="flex items-center gap-1.5 bg-[#F7F7F7] h-6 px-2 rounded-[8px] group hover:bg-[#203430] transition-all">
                          <Reply className="h-3 w-3 text-[#203430] group-hover:text-white" />
                          <span className="text-[11px] font-bold text-[#203430] group-hover:text-white">Reply</span>
                       </button>
                       <button className="flex items-center gap-1.5 bg-[#F7F7F7] h-6 px-2 rounded-[8px] group hover:bg-[#203430] transition-all">
                          <Forward className="h-3 w-3 text-[#203430] group-hover:text-white" />
                          <span className="text-[11px] font-bold text-[#203430] group-hover:text-white">Forward</span>
                       </button>
                    </div>
                 </div>
              </div>

              <div className="h-px bg-[#E5E6E6] mb-5" />

              <h2 className="text-[18px] font-bold text-[#1E1E20] mb-5">{activeEmail.title}</h2>
              
              <div className="space-y-4 text-[12px] text-[#434345] leading-relaxed">
                 <p>Hi there,</p>
                 <p>I'd like to follow up on my annual leave request for the dates 15–19 July.</p>
                 <p>The request is still marked as pending, and I wanted to confirm if any additional documents are needed.</p>
                 <p>Please let me know if you need anything else from my side.</p>
                 <p>Thanks so much!</p>
                 <p className="font-bold pt-2">– {activeEmail.sender?.split(' ')[0]}</p>
              </div>
           </div>

           {/* Composition/Reply Section */}
           <div className="mt-4 border border-[#E5E6E6] rounded-[16px] overflow-hidden flex flex-col min-h-[298px]">
              <div className="p-4 flex-1 flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span className="text-[14px] text-[#63716E]">To:</span>
                       <div className="bg-[#F7F7F7] rounded-[4px] px-1.5 py-1 flex items-center gap-2">
                          <span className="text-[14px] font-bold text-[#203430]">{activeEmail.sender}</span>
                          <X className="h-3.5 w-3.5 text-[#203430] cursor-pointer" />
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-[14px] text-[#63716E] cursor-pointer">Cc</span>
                       <span className="text-[14px] text-[#63716E] cursor-pointer">Bcc</span>
                       <Maximize2 className="h-4 w-4 text-[#63716E] cursor-pointer" />
                    </div>
                 </div>

                 {/* Format Bar */}
                 <div className="bg-[#F7F7F7] h-[38px] rounded-[8px] flex items-center px-3 gap-3">
                    <RotateCcw className="h-4 w-4 text-[#A4ACAB] cursor-pointer" />
                    <RotateCw className="h-4 w-4 text-[#A4ACAB] cursor-pointer" />
                    <div className="w-px h-5 bg-[#E5E6E6]" />
                    <div className="flex items-center gap-1.5 cursor-pointer">
                       <span className="text-[12px] font-bold">Sans Serif</span>
                       <ChevronDown className="h-3 w-3" />
                    </div>
                    <div className="w-px h-5 bg-[#E5E6E6]" />
                    <div className="flex items-center gap-1.5 cursor-pointer">
                       <Type className="h-4 w-4" />
                       <ChevronDown className="h-3 w-3" />
                    </div>
                    <div className="w-px h-5 bg-[#E5E6E6]" />
                    <div className="flex items-center gap-3">
                       <Bold className="h-4 w-4 text-[#203430] cursor-pointer" />
                       <Italic className="h-4 w-4 text-[#203430] cursor-pointer" />
                       <Underline className="h-4 w-4 text-[#203430] cursor-pointer" />
                    </div>
                    <div className="w-px h-5 bg-[#E5E6E6]" />
                    <AlignLeft className="h-4 w-4 text-[#203430] cursor-pointer" />
                    <ListOrdered className="h-4 w-4 text-[#203430] cursor-pointer" />
                    <div className="w-px h-5 bg-[#E5E6E6]" />
                    <ChevronDown className="h-4 w-4 text-[#203430] cursor-pointer" />
                 </div>

                 <textarea 
                  placeholder="Type something.." 
                  className="flex-1 w-full bg-transparent outline-none resize-none text-[14px] text-[#203430] placeholder:text-[#A4ACAB]"
                 />
              </div>

              {/* Bottom Send Bar */}
              <div className="bg-[#F7F7F7] p-4 flex items-center justify-between border-t border-[#E5E6E6]">
                 <div className="flex gap-4 items-center">
                    <div className="flex overflow-hidden rounded-[8px]">
                       <button className="bg-brand text-white px-3 py-1.5 text-[12px] font-bold flex items-center gap-2">
                          Send Message
                       </button>
                       <div className="w-px bg-white/20" />
                       <button className="bg-brand text-white px-2 py-1.5 flex items-center justify-center">
                          <ChevronDown className="h-4 w-4" />
                       </button>
                    </div>
                    <div className="flex gap-4">
                       {[Paperclip, Smile, Image].map((Icon, i) => (
                          <Icon key={i} className="h-5 w-5 text-[#63716E] cursor-pointer hover:text-brand" />
                       ))}
                    </div>
                 </div>
                 <Trash2 className="h-5 w-5 text-[#63716E] cursor-pointer hover:text-red-500" />
              </div>
           </div>
        </div>
      </div>

      <footer className="mt-10 py-8 border-t border-[#E5E6E6] flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
         <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-16">
            <p className="text-[12px] font-bold text-[#203430]">Copyright © 2025 Peterdraw</p>
            <div className="flex gap-6">
               {['Privacy Policy', 'Term and conditions', 'Contact'].map(l => (
                 <a key={l} href="#" className="text-[12px] text-[#63716E] hover:text-brand transition-colors whitespace-nowrap">{l}</a>
               ))}
            </div>
         </div>
      </footer>
    </AppLayout>
  );
}
