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
  Maximize2,
  Users,
  Check
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { getCollection, saveCollection } from "../lib/db";

const labels = [
  { color: "bg-[#35BFA3]", label: "HR" },
  { color: "bg-[#0E4D41]", label: "Leave Requests" },
  { color: "bg-[#A4ACAB]", label: "Interview" },
  { color: "bg-[#F8C947]", label: "Admin Notes" },
];

export default function InboxPage() {
  const [search, setSearch] = React.useState("");
  const [currentCategory, setCurrentCategory] = React.useState("Inbox");
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState("");

  // Compose Modal States
  const [isComposeOpen, setIsComposeOpen] = React.useState(false);
  const [composeTo, setComposeTo] = React.useState<any[]>([
    { type: "department", name: "Design Team" },
    { 
      type: "individual", 
      name: "Sarah Miller", 
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdauNIl8MVXJpumTHXW5TGhMLO1eQ9xD900Y3PYQELlEp3ZcPMn0rV6L6R1Wsnkf-z0EgBHsE9va_DcSSCJdP693qf3yGNP-SliLtxWIwoSABOODNohszWYqCUcBGqVg_i7F9qAuKJvcogimQvXmA5eXa-7Gnvs9Z7H4iPzOm22eh7TZZBpNWxK7HIoawayUCOkDXx6-CnfF3GXjUQb5sAUnVQOBdAH8IlqRFWYjkQiGJ_LAmpTTTYJP7gtK2aOJzMbba3LI4rajM" 
    }
  ]);
  const [recipientInput, setRecipientInput] = React.useState("");
  const [showRecipientSuggestions, setShowRecipientSuggestions] = React.useState(false);
  const [composeSubject, setComposeSubject] = React.useState("Project Update: Q3 Design System Sync");
  const [composeBody, setComposeBody] = React.useState(
    "Hello Team,\n\nI wanted to share direct previews of our Q3 design systems synchronization. The guidelines, layouts, assets, and component assets have been loaded for responsive review.\n\nPlease find the attached PDFs and design screens below.\n\nBest,\nMe"
  );
  
  const [composeAttachments, setComposeAttachments] = React.useState<any[]>([
    { 
      id: "attachment-1", 
      name: "Project_Specs.pdf", 
      size: "1.2 MB", 
      type: "PDF Document" 
    },
    { 
      id: "attachment-2", 
      name: "mockup_v2.jpg", 
      size: "450 KB", 
      type: "Image File", 
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRq0fxhXqPVg5r7sePMEuXFT47rM4sHkPmADnq8kyHD1tAa4dfaP_smCoKPaQ44vGnxSpJkbQveInbXWtgSXMubESYzWoeeF36QbkcJa7jJVbFTngNIbQhrEJ2rXeJnWBb3nfm7360LroFfdMDmGDeCyzztOjLYUxkm5AHs1CgFDTw6ipkBeHYKGzMIe3JVov8bbjrA08p4OroS6tBNdN65165L0fxRjhQ5bP7l_0DNcXcdHaNshsw3w3wwsYLp2S9PpqCgyBkvTQ" 
    }
  ]);
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [composeSendStatus, setComposeSendStatus] = React.useState<"idle" | "sending" | "sent">("idle");
  const [showScheduleMenu, setShowScheduleMenu] = React.useState(false);
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [selectedTextColor, setSelectedTextColor] = React.useState("#203430");

  const [toasts, setToasts] = React.useState<Array<{ id: number, message: string }>>([]);
  const showToast = (message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const composeFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleComposeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files).map((f: File, index) => {
      const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
      const isImg = f.type.startsWith("image/");
      return {
        id: `custom-attach-${Date.now()}-${index}`,
        name: f.name,
        size: `${sizeMB} MB`,
        type: isImg ? "Image File" : "Attachment File",
        avatar: isImg ? URL.createObjectURL(f) : undefined
      };
    });
    setComposeAttachments(prev => [...prev, ...fileList]);
    showToast(`Added ${fileList.length} attachment(s)`);
  };

  const availableCandidates = [
    { type: "individual", name: "Olivia Mason", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", email: "olivia.mason@company.com" },
    { type: "individual", name: "Ethan Ray", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", email: "ethan.ray@company.com" },
    { type: "individual", name: "Mia Torres", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", email: "mia.torres@company.com" },
    { type: "individual", name: "Lina Armand", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", email: "lina.armand@company.com" },
    { type: "individual", name: "Daniel Cheung", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", email: "daniel.cheung@company.com" },
    { type: "individual", name: "Farah Nabila", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80", email: "farah.nabila@company.com" },
    { type: "department", name: "Marketing Team", email: "marketing-list@company.com" },
    { type: "department", name: "HR Operations", email: "hr-list@company.com" },
    { type: "department", name: "Engineering Team", email: "engineering-list@company.com" },
    { type: "department", name: "Product Design", email: "design-list@company.com" },
  ];

  const filteredSuggestions = availableCandidates.filter(c => {
    const alreadyAdded = composeTo.some(added => added.name.toLowerCase() === c.name.toLowerCase());
    if (alreadyAdded) return false;
    if (!recipientInput) return true;
    return c.name.toLowerCase().includes(recipientInput.toLowerCase()) || 
           (c.email && c.email.toLowerCase().includes(recipientInput.toLowerCase()));
  });

  const handleCloseOrSaveDraft = () => {
    // Generate draft email
    const newDraft = {
      id: Date.now(),
      sender: "Draft Correspondence",
      initials: "DR",
      label: "bg-[#F8C947]",
      tagName: "Admin Notes",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "Today",
      title: composeSubject || "(No Subject)",
      snippet: composeBody.substring(0, 70) + "...",
      body: composeBody,
      category: "Drafts",
      starred: false,
      unread: false
    };
    setEmailsStore(prev => [newDraft, ...prev]);
    setIsComposeOpen(false);
    showToast("Message saved as draft in Drafts folder.");
  };

  const handleComposeSend = () => {
    if (composeTo.length === 0) {
      showToast("Please add at least one recipient.");
      return;
    }
    setComposeSendStatus("sending");
    
    setTimeout(() => {
      // Build sent email
      const newSentMail = {
        id: Date.now(),
        sender: "Me (User)",
        initials: "ME",
        label: "bg-[#35BFA3]",
        tagName: "HR",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: "Today",
        title: composeSubject || "(No Subject)",
        snippet: composeBody.substring(0, 70) + "...",
        body: `To: ${composeTo.map(r => r.name).join(", ")}\n\n${composeBody}`,
        category: "Sent",
        starred: false,
        unread: false
      };
      
      setEmailsStore(prev => [newSentMail, ...prev]);
      setComposeSendStatus("sent");
      
      setTimeout(() => {
        setIsComposeOpen(false);
        setComposeSendStatus("idle");
        // Reset state values
        setComposeSubject("Project Update: Q3 Design System Sync");
        setComposeBody(
          "Hello Team,\n\nI wanted to share direct previews of our Q3 design systems synchronization. The guidelines, layouts, assets, and component assets have been loaded for responsive review.\n\nPlease find the attached PDFs and design screens below.\n\nBest,\nMe"
        );
        setComposeTo([
          { type: "department", name: "Design Team" },
          { 
            type: "individual", 
            name: "Sarah Miller", 
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdauNIl8MVXJpumTHXW5TGhMLO1eQ9xD900Y3PYQELlEp3ZcPMn0rV6L6R1Wsnkf-z0EgBHsE9va_DcSSCJdP693qf3yGNP-SliLtxWIwoSABOODNohszWYqCUcBGqVg_i7F9qAuKJvcogimQvXmA5eXa-7Gnvs9Z7H4iPzOm22eh7TZZBpNWxK7HIoawayUCOkDXx6-CnfF3GXjUQb5sAUnVQOBdAH8IlqRFWYjkQiGJ_LAmpTTTYJP7gtK2aOJzMbba3LI4rajM" 
          }
        ]);
        setComposeAttachments([
          { id: "attachment-1", name: "Project_Specs.pdf", size: "1.2 MB", type: "PDF Document" },
          { id: "attachment-2", name: "mockup_v2.jpg", size: "450 KB", type: "Image File", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRq0fxhXqPVg5r7sePMEuXFT47rM4sHkPmADnq8kyHD1tAa4dfaP_smCoKPaQ44vGnxSpJkbQveInbXWtgSXMubESYzWoeeF36QbkcJa7jJVbFTngNIbQhrEJ2rXeJnWBb3nfm7360LroFfdMDmGDeCyzztOjLYUxkm5AHs1CgFDTw6ipkBeHYKGzMIe3JVov8bbjrA08p4OroS6tBNdN65165L0fxRjhQ5bP7l_0DNcXcdHaNshsw3w3wwsYLp2S9PpqCgyBkvTQ" }
        ]);
        
        showToast("Message sent successfully!");
        setCurrentCategory("Sent");
        setActiveEmailId(newSentMail.id);
      }, 800);
    }, 1500);
  };

  const [emailsStore, setEmailsStoreState] = React.useState<any[]>(() => {
    return getCollection<any[]>("db_emails", []);
  });

  const setEmailsStore = (update: any[] | ((prev: any[]) => any[])) => {
    if (typeof update === "function") {
      setEmailsStoreState((prev) => {
        const next = update(prev);
        saveCollection("db_emails", next);
        return next;
      });
    } else {
      saveCollection("db_emails", update);
      setEmailsStoreState(update);
    }
  };

  React.useEffect(() => {
    const handleDbUpdate = () => {
      setEmailsStoreState(getCollection<any[]>("db_emails", []));
    };
    window.addEventListener("storage", handleDbUpdate);
    window.addEventListener("db_updated", handleDbUpdate);
    return () => {
      window.removeEventListener("storage", handleDbUpdate);
      window.removeEventListener("db_updated", handleDbUpdate);
    };
  }, []);

  const handleSeedDemo = () => {
    const demoEmails = [
      { 
        id: 1,
        sender: "Olivia Mason", 
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
        label: "bg-[#0E4D41]",
        tagName: "Leave Requests",
        time: "10:24 AM",
        title: "Leave Request Approval",
        snippet: "Hi, I'd like to follow up on my annual leave request for next month, from July 15 to July 1...",
        body: "Hi there,\n\nI'm following up on my annual leaves request for July 15th to July 19th. \n\nThe system shows my application as pending review, and I wanted to confirm if any further medical or personal documents are required from my end.\n\nLet me know if there are operational constraints during this sprint.\n\nThank you!\n\nBest regards,\nOlivia Mason",
        category: "Inbox",
        starred: false,
        unread: true,
        date: "19 Jun"
      },
      { 
        id: 2,
        sender: "Ethan Ray", 
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
        label: "bg-[#F8C947]",
        tagName: "Admin Notes",
        time: "09:40 AM",
        title: "Updated Contact Info",
        snippet: "Just a quick heads-up that I've updated my emergency contact details on my profile. Kin...",
        body: "Hello Team,\n\nI'm writing to confirm that I've successfully updated my active address parameters and updated primary telephone verification details on my profile dashboard.\n\nEverything is set in case there are important internal messages needed.\n\nSincerely,\nEthan Ray",
        category: "Inbox",
        starred: true,
        unread: true,
        date: "19 Jun"
      },
      { 
        id: 3,
        sender: "Lina Armand", 
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
        label: "bg-[#0E4D41]",
        tagName: "Leave Requests",
        time: "04:59 PM",
        title: "Medical Leave Submission",
        snippet: "I've attached my doctor's note for the requested medical leave from June 20 to Jun...",
        body: "Hi HR,\n\nAttached is my medical clearance document following my clinic checkup yesterday. I am requesting medical excuse leaves for the dates from June 20 to June 24.\n\nThank you for assisting in stamping this approved!\n\nWarm regards,\nLina",
        category: "Inbox",
        starred: false,
        unread: false,
        date: "Yesterday"
      }
    ];
    setEmailsStore(demoEmails);
    setActiveEmailId(1);
    window.dispatchEvent(new Event("db_updated"));
  };

  const filteredEmails = emailsStore.filter(e => {
    const senderMatch = e.sender ? e.sender.toLowerCase() : "";
    const titleMatch = e.title ? e.title.toLowerCase() : "";
    const snippetMatch = e.snippet ? e.snippet.toLowerCase() : "";
    const query = search.toLowerCase();

    const matchesSearch = senderMatch.includes(query) || 
                          titleMatch.includes(query) ||
                          snippetMatch.includes(query);
    
    let matchesCategory = true;
    if (currentCategory === "Starred") {
       matchesCategory = !!e.starred;
    } else if (currentCategory === "Sent") {
       matchesCategory = e.category === "Sent";
    } else if (currentCategory === "Drafts") {
       matchesCategory = e.category === "Drafts";
    } else if (currentCategory === "Spam") {
       matchesCategory = e.category === "Spam";
    } else if (currentCategory === "Trash") {
       matchesCategory = e.category === "Trash";
    } else {
       matchesCategory = !e.category || e.category === "Inbox";
    }
    
    let matchesLabel = true;
    if (selectedLabel) {
       const labelColorMap: Record<string, string> = {
         "HR": "bg-[#35BFA3]",
         "Leave Requests": "bg-[#0E4D41]",
         "Interview": "bg-[#A4ACAB]",
         "Admin Notes": "bg-[#F8C947]"
       };
       matchesLabel = e.label === labelColorMap[selectedLabel];
    }
    
    return matchesSearch && matchesCategory && matchesLabel;
  });

  const [activeEmailId, setActiveEmailId] = React.useState<number | null>(1);
  const activeEmail = filteredEmails.find(e => e.id === activeEmailId) || filteredEmails[0] || null;

  const unreadInboxCount = emailsStore.filter(e => (!e.category || e.category === "Inbox") && e.unread).length;
  const starredCount = emailsStore.filter(e => e.starred).length;
  const sentCount = emailsStore.filter(e => e.category === "Sent").length;
  const draftsCount = emailsStore.filter(e => e.category === "Drafts").length;
  const spamCount = emailsStore.filter(e => e.category === "Spam").length;

  const dynamicInboxCategories = [
    { icon: InboxIcon, label: "Inbox", count: unreadInboxCount },
    { icon: Star, label: "Starred", count: starredCount },
    { icon: Send, label: "Sent", count: sentCount },
    { icon: FileText, label: "Drafts", count: draftsCount },
    { icon: AlertOctagon, label: "Spam", count: spamCount },
    { icon: Trash2, label: "Trash" },
  ];

  const handleSendMessage = () => {
    if (!replyText.trim()) return;
    const newMail = {
      id: Date.now(),
      sender: "Me (User)",
      initials: "ME",
      label: "bg-[#35BFA3]",
      tagName: "HR",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "Today",
      title: activeEmail ? `Re: ${activeEmail.title}` : "New Message",
      snippet: replyText.substring(0, 70) + "...",
      body: replyText,
      category: "Sent",
      starred: false,
      unread: false
    };
    setEmailsStore([...emailsStore, newMail]);
    setReplyText("");
    setCurrentCategory("Sent");
    setActiveEmailId(newMail.id);
    window.dispatchEvent(new Event("db_updated"));
  };

  return (
    <AppLayout 
      title="Inbox" 
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Inbox" }]}
    >
      <div className="flex gap-6 h-[calc(100vh-140px)] min-h-[872px]">
        {/* Page Internal Sidebar */}
        <div className="w-[195px] flex flex-col gap-4">
           <button 
             onClick={() => {
               setIsComposeOpen(true);
             }}
             className="w-full bg-brand h-[44px] rounded-[12px] flex items-center justify-center gap-2 text-white font-semibold hover:bg-[#005047] transition-colors shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
           >
              <Plus className="h-5 w-5" /> New Message
           </button>

           <div className="space-y-1">
              {dynamicInboxCategories.map(cat => {
                 const isActive = cat.label === currentCategory && !selectedLabel;
                 return (
                    <button 
                     key={cat.label} 
                     onClick={() => {
                       setCurrentCategory(cat.label);
                       setSelectedLabel(null);
                     }}
                     className={cn(
                       "w-full h-11 flex items-center px-3.5 gap-2.5 rounded-[12px] transition-all group text-left",
                       isActive ? "bg-white text-[#203430] shadow-sm font-bold" : "text-[#63716E] hover:bg-white/50"
                     )}
                    >
                       <cat.icon className={cn("h-5 w-5 transition-colors shrink-0", isActive ? "text-[#203430]" : "text-[#63716E] group-hover:text-[#203430]")} />
                       <span className="text-[14px] font-medium flex-1 truncate">{cat.label}</span>
                       {!!cat.count && (
                         <div className={cn("h-6 w-6 rounded-full flex items-center justify-center", isActive ? "bg-brand" : "bg-white border border-[#E5E6E6]")}>
                            <span className={cn("text-[11px] font-bold", isActive ? "text-white" : "text-[#63716E]")}>{cat.count}</span>
                         </div>
                       )}
                    </button>
                 );
              })}
           </div>

           <div className="pt-4 mt-auto">
              <h4 className="text-[14px] font-bold text-[#203430] mb-4 px-1">Label</h4>
              <div className="space-y-1">
                 {labels.map(l => {
                    const isActive = selectedLabel === l.label;
                    return (
                       <button 
                         key={l.label} 
                         onClick={() => {
                           setSelectedLabel(isActive ? null : l.label);
                         }}
                         className={cn(
                           "w-full h-11 flex items-center px-3.5 gap-2.5 rounded-[12px] hover:bg-white/50 group transition-all text-left",
                           isActive ? "bg-white text-[#203430] font-bold shadow-sm" : ""
                         )}
                       >
                          <Tag className={cn("h-5 w-5 fill-current shrink-0", l.color.replace('bg-', 'text-'))} />
                          <span className="text-[14px] font-medium text-[#63716E] group-hover:text-[#203430] truncate flex-1">{l.label}</span>
                       </button>
                    );
                 })}
              </div>
           </div>
        </div>

        {/* Email List Column */}
        <Card className="flex-1 w-[385px] border-none rounded-[16px] bg-white shadow-sm flex flex-col p-4 gap-4 min-w-[320px]">
           <div className="flex gap-2.5">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#203430]" />
                 <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search email" 
                  className="w-full h-10 pl-10 pr-4 bg-[#F7F7F7] rounded-[10px] outline-none text-[14px] text-[#63716E]"
                 />
              </div>
              <button 
                onClick={() => {
                  setSearch("");
                  setSelectedLabel(null);
                  setCurrentCategory("Inbox");
                }}
                className="h-10 w-10 flex items-center justify-center bg-[#E4F2D3] rounded-[10px] text-[#203430] hover:bg-brand hover:text-white transition-all"
                title="Reset Filters"
              >
                 <SlidersHorizontal className="h-5 w-5" />
              </button>
           </div>

           <div className="flex-1 overflow-y-auto space-y-0.5 pr-2 custom-scrollbar">
              {filteredEmails.length === 0 ? (
                <div className="py-12 px-4 text-center flex flex-col items-center justify-center h-full gap-3">
                  <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                    <InboxIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#203430]">No emails found</h4>
                    <p className="text-[11px] text-[#63716E] max-w-[190px] mt-1 leading-normal mx-auto">
                      {emailsStore.length === 0 
                        ? "This mailbox holds no logs. Activate test emails to explore full interactions."
                        : "No matching criteria. Click the reset icon to clear criteria filters."}
                    </p>
                  </div>
                </div>
              ) : (
                filteredEmails.map(e => (
                   <button 
                    key={e.id}
                    onClick={() => {
                      setActiveEmailId(e.id);
                      if (e.unread) {
                        setEmailsStore(emailsStore.map(mail => 
                          mail.id === e.id ? { ...mail, unread: false } : mail
                        ));
                        window.dispatchEvent(new Event("db_updated"));
                      }
                    }}
                    className={cn(
                      "w-full p-4 flex gap-4 rounded-[8px] transition-all text-left relative",
                      e.id === activeEmailId ? "bg-[#F8FCF3]" : "bg-white border-b border-[#E5E6E6] last:border-none",
                      e.unread && "border-l-[3px] border-l-[#0E4D41]"
                    )}
                   >
                      {e.avatar ? (
                        <img src={e.avatar} className="h-10 w-10 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-[#0E4D41] flex items-center justify-center shrink-0 text-white font-medium">
                           {e.initials || (e.sender ? e.sender.substring(0, 2).toUpperCase() : "EM")}
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-1.5">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 min-w-0">
                               <span className={cn("text-[14px] truncate text-[#203430]", e.unread ? "font-bold" : "font-medium")}>
                                 {e.sender}
                               </span>
                               <Tag className={cn("h-3 w-3 fill-current shrink-0", e.label ? e.label.replace('bg-', 'text-') : "text-gray-400")} />
                            </div>
                            <span className="text-[11px] text-[#63716E] shrink-0 font-medium">{e.time}</span>
                         </div>
                         <h4 className={cn("text-[13px] leading-none text-[#203430] truncate", e.unread ? "font-bold" : "font-normal")}>
                           {e.title}
                         </h4>
                         <div className="flex items-end gap-2">
                            <p className="text-[12px] text-[#63716E] line-clamp-2 leading-[1.3] flex-1">{e.snippet}</p>
                            <button
                              onClick={(evt) => {
                                evt.stopPropagation();
                                setEmailsStore(emailsStore.map(mail => 
                                  mail.id === e.id ? { ...mail, starred: !mail.starred } : mail
                                ));
                                window.dispatchEvent(new Event("db_updated"));
                              }}
                              className="p-1 hover:bg-slate-100 rounded shrink-0 text-slate-400 hover:text-[#F8C947]"
                            >
                              <Star className={cn("h-3.5 w-3.5", e.starred ? "fill-[#F8C947] text-[#F8C947]" : "text-[#A4ACAB]")} />
                            </button>
                         </div>
                      </div>
                   </button>
                ))
              )}
           </div>
        </Card>

        {/* Email Detail View Column */}
        <div className="flex-[1.5] w-[543px] border-l border-[#E5E6E6] bg-white rounded-r-[16px] lg:rounded-[16px] shadow-sm flex flex-col p-4 min-w-0">
           {!activeEmail ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/40 border border-dashed border-slate-200 rounded-[12px]">
                 <FileText className="h-10 w-10 text-slate-300 mb-3" />
                 <h3 className="text-[14px] font-bold text-[#203430]">No Message Selected</h3>
                 <p className="text-[11px] text-[#63716E] max-w-[245px] mt-1.5 leading-relaxed mx-auto">
                    Select a correspondence log from the feeds to explore attachments, read message threads, and reply in real time.
                 </p>
              </div>
           ) : (
             <>
               {/* Detail Header */}
               <div className="bg-[#F7F7F7] rounded-[10px] p-2 flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                     {[ArrowLeft, Archive, Trash2, Printer, MoreHorizontal].map((Icon, i) => (
                        <button 
                          key={i} 
                          onClick={() => {
                            if (Icon === Trash2) {
                              setEmailsStore(emailsStore.filter(mail => mail.id !== activeEmail.id));
                              setActiveEmailId(null);
                              window.dispatchEvent(new Event("db_updated"));
                            }
                          }}
                          className="h-[22px] px-2 flex items-center justify-center text-[#63716E] hover:text-[#203430] rounded hover:bg-slate-100 transition-colors"
                        >
                           <Icon className="h-4 w-4" />
                        </button>
                     ))}
                  </div>
                  <div className="flex items-center gap-2 pr-2">
                     <span className="text-[12px] text-[#63716E]">
                       {filteredEmails.indexOf(activeEmail) + 1} of {filteredEmails.length}
                     </span>
                     <button 
                       disabled={filteredEmails.indexOf(activeEmail) <= 0}
                       onClick={() => {
                         const prevIndex = filteredEmails.indexOf(activeEmail) - 1;
                         if (prevIndex >= 0) setActiveEmailId(filteredEmails[prevIndex].id);
                       }}
                       className="h-7 w-7 flex items-center justify-center bg-white rounded-[8px] border border-[#E5E6E6] hover:bg-[#F7F7F7] disabled:opacity-50"
                     >
                        <ChevronLeft className="h-4 w-4" />
                     </button>
                     <button 
                       disabled={filteredEmails.indexOf(activeEmail) >= filteredEmails.length - 1}
                       onClick={() => {
                         const nextIndex = filteredEmails.indexOf(activeEmail) + 1;
                         if (nextIndex < filteredEmails.length) setActiveEmailId(filteredEmails[nextIndex].id);
                       }}
                       className="h-7 w-7 flex items-center justify-center bg-white rounded-[8px] border border-[#E5E6E6] hover:bg-[#F7F7F7] disabled:opacity-50"
                     >
                        <ChevronRight className="h-4 w-4" />
                     </button>
                  </div>
               </div>

               {/* Detail Content Area */}
               <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <img 
                          src={activeEmail.avatar || `https://ui-avatars.com/api/?name=${activeEmail.sender}&background=0E4D41&color=fff`} 
                          className="h-9 w-9 rounded-full object-cover shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                           <p className="text-[14px] font-bold text-[#203430] leading-none mb-1">{activeEmail.sender}</p>
                           <p className="text-[12px] text-[#63716E] leading-none shrink-0">{activeEmail.sender?.toLowerCase().replace(/\s/g, '.')}@company.com</p>
                        </div>
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        <span className="text-[11px] text-[#777779] font-medium">{activeEmail.date || "Today"} – {activeEmail.time}</span>
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

                  <h2 className="text-[16px] sm:text-[18px] font-bold text-[#1E1E20] mb-5">{activeEmail.title}</h2>
                  
                  <div className="space-y-4 text-[12px] sm:text-[13px] text-[#434345] leading-relaxed">
                     {activeEmail.body ? (
                       activeEmail.body.split("\n").map((para: string, i: number) => (
                         <p key={i}>{para}</p>
                       ))
                     ) : (
                       <>
                         <p>Hi there,</p>
                         <p>{activeEmail.snippet}</p>
                         <p>Please review this conversation update. Let me know if further attachments or context are required.</p>
                         <p>Best regards,</p>
                         <p className="font-bold pt-2">– {activeEmail.sender?.split(' ')[0] || "Team Member"}</p>
                       </>
                     )}
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
                              <X 
                                onClick={() => setActiveEmailId(null)}
                                className="h-3.5 w-3.5 text-[#203430] cursor-pointer" 
                              />
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="text-[14px] text-[#63716E] cursor-pointer">Cc</span>
                           <span className="text-[14px] text-[#63716E] cursor-pointer">Bcc</span>
                           <Maximize2 className="h-4 w-4 text-[#63716E] cursor-pointer" />
                        </div>
                     </div>

                     {/* Format Bar */}
                     <div className="bg-[#F7F7F7] h-[38px] rounded-[8px] flex items-center px-3 gap-3 overflow-x-auto min-w-0">
                        <RotateCcw className="h-4 w-4 text-[#A4ACAB] cursor-pointer shrink-0" />
                        <RotateCw className="h-4 w-4 text-[#A4ACAB] cursor-pointer shrink-0" />
                        <div className="w-px h-5 bg-[#E5E6E6] shrink-0" />
                        <div className="flex items-center gap-1.5 cursor-pointer shrink-0">
                           <span className="text-[12px] font-bold">Sans Serif</span>
                           <ChevronDown className="h-3 w-3" />
                        </div>
                        <div className="w-px h-5 bg-[#E5E6E6] shrink-0" />
                        <div className="flex items-center gap-1.5 cursor-pointer shrink-0">
                           <Type className="h-4 w-4" />
                           <ChevronDown className="h-3 w-3" />
                        </div>
                        <div className="w-px h-5 bg-[#E5E6E6] shrink-0" />
                        <div className="flex items-center gap-3 shrink-0">
                           <Bold className="h-4 w-4 text-[#203430] cursor-pointer" />
                           <Italic className="h-4 w-4 text-[#203430] cursor-pointer" />
                           <Underline className="h-4 w-4 text-[#203430] cursor-pointer" />
                        </div>
                        <div className="w-px h-5 bg-[#E5E6E6] shrink-0" />
                        <AlignLeft className="h-4 w-4 text-[#203430] cursor-pointer shrink-0" />
                        <ListOrdered className="h-4 w-4 text-[#203430] cursor-pointer shrink-0" />
                        <div className="w-px h-5 bg-[#E5E6E6] shrink-0" />
                        <ChevronDown className="h-4 w-4 text-[#203430] cursor-pointer shrink-0" />
                     </div>

                     <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your response here..." 
                      className="flex-1 w-full bg-transparent outline-none resize-none text-[14px] text-[#203430] placeholder:text-[#A4ACAB]"
                     />
                  </div>

                  {/* Bottom Send Bar */}
                  <div className="bg-[#F7F7F7] p-4 flex items-center justify-between border-t border-[#E5E6E6]">
                     <div className="flex gap-4 items-center">
                        <div className="flex overflow-hidden rounded-[8px] shrink-0">
                           <button 
                             onClick={handleSendMessage}
                             className="bg-brand hover:bg-[#005047] text-white px-3 py-1.5 text-[12px] font-bold flex items-center gap-2 transition-all"
                           >
                              Send Message
                           </button>
                           <div className="w-px bg-white/20" />
                           <button className="bg-brand text-white px-2 py-1.5 flex items-center justify-center hover:bg-[#005047]">
                              <ChevronDown className="h-4 w-4" />
                           </button>
                        </div>
                        <div className="flex gap-4">
                           {[Paperclip, Smile, Image].map((Icon, i) => (
                              <Icon key={i} className="h-5 w-5 text-[#63716E] cursor-pointer hover:text-brand shrink-0" />
                           ))}
                        </div>
                     </div>
                     <button
                       onClick={() => setReplyText("")}
                       className="p-1 hover:bg-slate-100 rounded shrink-0 transition-colors"
                       title="Discard Draft"
                     >
                       <Trash2 className="h-5 w-5 text-[#63716E] hover:text-red-500 shrink-0" />
                     </button>
                  </div>
               </div>
             </>
           )}
        </div>
      </div>

      <footer className="mt-10 py-8 border-t border-[#E5E6E6] flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
         <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-16 font-sans">
            <p className="text-[12px] font-bold text-[#203430]">Copyright © 2025 Peterdraw</p>
            <div className="flex gap-6">
               {['Privacy Policy', 'Term and conditions', 'Contact'].map(l => (
                 <a key={l} href="#" className="text-[12px] text-[#63716E] hover:text-brand transition-colors whitespace-nowrap">{l}</a>
               ))}
            </div>
         </div>
      </footer>

      {/* Hidden file input for attachments */}
      <input 
        type="file"
        id="compose-hidden-file-input"
        ref={composeFileInputRef}
        onChange={handleComposeFileUpload}
        className="hidden"
        multiple
      />

      {/* High Fidelity Interactive Compose Modal Overlay */}
      {isComposeOpen && (
        <div 
          id="compose-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60 transition-all cursor-default"
        >
          {/* Main Modal Box */}
          <div 
            id="compose-modal-card"
            className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] border border-[#bbc9c5]/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <header 
              id="compose-modal-header"
              className="flex items-center justify-between px-6 py-4 border-b border-[#edeeef] bg-[#f8f9fa] shrink-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-[#006b5f]/10 text-[#006b5f] rounded-lg flex items-center justify-center">
                  <span className="font-bold text-[18px]">💬</span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#191c1d] leading-none">New Message</h2>
                  <p className="text-[11px] text-[#3d4946] font-medium uppercase tracking-wider mt-1">Direct Message</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  id="compose-header-minimize"
                  onClick={() => {
                    setIsComposeOpen(false);
                    showToast("Draft minimized. Click New Message to resume.");
                  }}
                  className="text-[#3d4946] hover:bg-[#e7e8e9] hover:text-[#191c1d] h-10 w-10 rounded-xl transition-all flex items-center justify-center border-none bg-transparent" 
                  title="Minimize"
                  type="button"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>
                <button 
                  id="compose-header-close"
                  onClick={handleCloseOrSaveDraft}
                  className="text-[#3d4946] hover:bg-red-50 hover:text-[#ba1a1a] h-10 w-10 rounded-xl transition-all flex items-center justify-center border-none bg-transparent" 
                  title="Close"
                  type="button"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </header>

            {/* Scrollable Input and Editor Canvas */}
            <div 
              id="compose-modal-body"
              className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6"
            >
              {/* Recipients Row */}
              <div id="compose-recipient-block" className="space-y-1.5 relative">
                <div className="flex items-center justify-between">
                  <label id="compose-field-to" className="text-[13px] font-bold text-slate-500">To</label>
                  <div className="flex gap-4 text-[11px] font-semibold text-[#006b5f] uppercase tracking-wider cursor-pointer select-none">
                    <span onClick={() => showToast("Cc container toggled.")} className="hover:underline">Add Cc</span>
                    <span onClick={() => showToast("Bcc container toggled.")} className="hover:underline">Add Bcc</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 p-2 border-b border-[#bbc9c5]/60 focus-within:border-[#006b5f] transition-all min-h-[48px]">
                  {/* Selected Group/Department Selection Chip */}
                  {composeTo.map((rec, i) => (
                    <div 
                      key={i} 
                      id={`compose-chip-${rec.name.replace(/\s+/g, '-').toLowerCase()}`}
                      className={cn(
                        "group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all select-none",
                        rec.type === "department" 
                          ? "bg-[#006b5f]/5 border border-[#006b5f]/20 text-[#006b5f]" 
                          : "bg-[#e7e8e9] text-[#191c1d]"
                      )}
                    >
                      {rec.type === "department" ? (
                        <Users className="h-3.5 w-3.5" />
                      ) : rec.avatar ? (
                        <img 
                          src={rec.avatar} 
                          alt={rec.name} 
                          className="h-4.5 w-4.5 rounded-full object-cover border border-white shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-4.5 w-4.5 rounded-full bg-slate-300 flex items-center justify-center font-bold text-[9px] text-[#191c1d] shrink-0">
                          {rec.name.substring(0, 1).toUpperCase()}
                        </div>
                      )}
                      <span>{rec.name}</span>
                      <button 
                        onClick={() => {
                          setComposeTo(prev => prev.filter((_, idx) => idx !== i));
                          showToast(`Recipient removed: ${rec.name}`);
                        }}
                        className="ml-1 opacity-60 hover:opacity-100 transition-opacity border-none bg-transparent"
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  <input 
                    type="text"
                    id="compose-recipient-typeahead"
                    value={recipientInput}
                    onChange={(e) => {
                      setRecipientInput(e.target.value);
                      setShowRecipientSuggestions(true);
                    }}
                    onFocus={() => setShowRecipientSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && recipientInput.trim()) {
                        setComposeTo(prev => [...prev, { type: "individual", name: recipientInput.trim() }]);
                        setRecipientInput("");
                        setShowRecipientSuggestions(false);
                        showToast(`Added: ${recipientInput.trim()}`);
                      }
                    }}
                    className="flex-1 min-w-[120px] bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 p-0 outline-none" 
                    placeholder="Type a name or email address..."
                  />
                </div>

                {/* Intelligent dropdown matches popup */}
                {showRecipientSuggestions && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowRecipientSuggestions(false)} />
                    <div 
                      id="compose-suggestions-list"
                      className="absolute left-0 right-0 top-full mt-1.5 z-20 max-h-[220px] overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 custom-scrollbar animate-in slide-in-from-top-2 duration-150"
                    >
                      {filteredSuggestions.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-slate-400 text-center select-none font-medium">
                          No team members found for &quot;{recipientInput}&quot;
                        </div>
                      ) : (
                        <div className="px-2 py-1 space-y-0.5">
                          <span className="block px-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">Suggested Contacts</span>
                          {filteredSuggestions.map((opt, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setComposeTo(prev => [...prev, opt]);
                                setRecipientInput("");
                                setShowRecipientSuggestions(false);
                                showToast(`Added recipient: ${opt.name}`);
                              }}
                              className="w-full flex items-center gap-3 px-2.5 py-1.5 hover:bg-[#006b5f]/5 rounded-lg transition-colors text-left"
                            >
                              {opt.type === "department" ? (
                                <div className="h-7 w-7 rounded-lg bg-[#006b5f]/10 text-[#006b5f] flex items-center justify-center shrink-0">
                                  <Users className="h-4 w-4" />
                                </div>
                              ) : opt.avatar ? (
                                <img src={opt.avatar} className="h-7 w-7 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0 text-xs">
                                  {opt.name.substring(0, 1)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 leading-tight">{opt.name}</p>
                                <p className="text-[10px] text-slate-400 truncate leading-none mt-0.5">{opt.type === "department" ? "All Team Members" : opt.email}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Subject Row */}
              <div id="compose-subject-block" className="space-y-1.5">
                <label id="compose-field-subject" className="text-[13px] font-bold text-slate-500">Subject</label>
                <input 
                  type="text"
                  id="compose-subject-input"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full py-2 border-b border-[#bbc9c5]/60 focus:border-[#006b5f] focus:ring-0 bg-transparent outline-none transition-all text-sm font-bold text-[#191c1d]" 
                  placeholder="Project Update: Q3 Design System Sync" 
                />
              </div>

              {/* Advanced Editor Window with Custom Rich Formatting Bar */}
              <div id="compose-editor-box" className="border border-[#bbc9c5]/50 rounded-xl overflow-hidden flex flex-col bg-white ring-1 ring-black/5 shadow-inner">
                {/* Formatting Bar */}
                <div className="flex items-center flex-wrap gap-1 p-1.5 border-b border-[#edeeef] bg-[#f3f4f5]">
                  <div className="flex items-center gap-0.5 px-1 border-r border-[#bbc9c5]/40 mr-1 shrink-0">
                    <button 
                      id="compose-fmt-bold"
                      onClick={() => setIsBold(!isBold)}
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center transition-colors shrink-0 border-none bg-transparent",
                        isBold ? "bg-slate-200 text-[#006b5f]" : "hover:bg-[#e7e8e9] text-[#3d4946]"
                      )}
                      title="Bold"
                      type="button"
                    >
                      <Bold className="h-4 w-4" />
                    </button>
                    <button 
                      id="compose-fmt-italic"
                      onClick={() => setIsItalic(!isItalic)}
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center transition-colors shrink-0 border-none bg-transparent",
                        isItalic ? "bg-slate-200 text-[#006b5f]" : "hover:bg-[#e7e8e9] text-[#3d4946]"
                      )}
                      title="Italic"
                      type="button"
                    >
                      <Italic className="h-4 w-4" />
                    </button>
                    <button 
                      id="compose-fmt-underline"
                      onClick={() => setIsUnderline(!isUnderline)}
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center transition-colors shrink-0 border-none bg-transparent",
                        isUnderline ? "bg-slate-200 text-[#006b5f]" : "hover:bg-[#e7e8e9] text-[#3d4946]"
                      )}
                      title="Underline"
                      type="button"
                    >
                      <Underline className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-0.5 px-1 border-r border-[#bbc9c5]/40 mr-1 shrink-0">
                    <button 
                      id="compose-fmt-bullets"
                      onClick={() => {
                        setComposeBody(prev => prev + "\n• ");
                        showToast("Added bullet point");
                      }}
                      className="h-8 w-8 hover:bg-[#e7e8e9] rounded-lg text-[#3d4946] flex items-center justify-center transition-colors shrink-0 border-none bg-transparent" 
                      title="Bullet List"
                      type="button"
                    >
                      <ListOrdered className="h-4 w-4 rotate-180" />
                    </button>
                    <button 
                      id="compose-fmt-numbers"
                      onClick={() => {
                        setComposeBody(prev => prev + "\n1. ");
                        showToast("Added numbered line");
                      }}
                      className="h-8 w-8 hover:bg-[#e7e8e9] rounded-lg text-[#3d4946] flex items-center justify-center transition-colors shrink-0 border-none bg-transparent" 
                      title="Numbered List"
                      type="button"
                    >
                      <ListOrdered className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-0.5 px-1 border-r border-[#bbc9c5]/40 mr-1 shrink-0">
                    <button 
                      id="compose-fmt-code"
                      onClick={() => {
                        setComposeBody(prev => prev + "\n`code` ");
                        showToast("Code block template added");
                      }}
                      className="h-8 w-8 hover:bg-[#e7e8e9] rounded-lg text-[#3d4946] flex items-center justify-center transition-colors shrink-0 border-none bg-transparent" 
                      title="Code Block"
                      type="button"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button 
                      id="compose-fmt-quote"
                      onClick={() => {
                        setComposeBody(prev => prev + "\n> ");
                        showToast("Blockquote added");
                      }}
                      className="h-8 w-8 hover:bg-[#e7e8e9] rounded-lg text-[#3d4946] flex items-center justify-center transition-colors shrink-0 border-none bg-transparent" 
                      title="Quote"
                      type="button"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-0.5 px-1 shrink-0">
                    <button 
                      id="compose-fmt-link"
                      onClick={() => {
                        const url = prompt("Enter the destination link address URL:");
                        if (url) {
                          setComposeBody(prev => prev + ` [Link](${url})`);
                          showToast("Markdown link inserted");
                        }
                      }}
                      className="h-8 w-8 hover:bg-[#e7e8e9] rounded-lg text-[#3d4946] flex items-center justify-center transition-colors shrink-0 border-none bg-transparent" 
                      title="Insert Link"
                      type="button"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                    <button 
                      id="compose-fmt-image"
                      onClick={() => composeFileInputRef.current?.click()}
                      className="h-8 w-8 hover:bg-[#e7e8e9] rounded-lg text-[#3d4946] flex items-center justify-center transition-colors shrink-0 border-none bg-transparent" 
                      title="Add Image"
                      type="button"
                    >
                      <Image className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex-1" />

                  {/* Dynamic Color Selector */}
                  <div className="relative shrink-0 pr-1">
                    <button 
                      id="compose-fmt-color"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center transition-colors shrink-0 border-none bg-transparent",
                        selectedTextColor !== "#203430" ? "bg-emerald-100 text-emerald-800" : "text-[#3d4946] hover:bg-[#e7e8e9]"
                      )}
                      title="Text Formatting Colors"
                      type="button"
                    >
                      <Type className="h-4 w-4" />
                    </button>

                    {showColorPicker && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setShowColorPicker(false)} />
                        <div 
                          id="compose-font-color-picker"
                          className="absolute right-0 top-9.5 z-40 bg-white border border-slate-200 rounded-xl shadow-xl px-3 py-2.5 flex flex-col gap-2 min-w-[150px]"
                        >
                          <span className="text-[10px] font-bold text-slate-400 uppercase select-none leading-none">Text Palette</span>
                          <div className="grid grid-cols-4 gap-2">
                            {["#191c1d", "#006b5f", "#ba1a1a", "#516257", "#d97706", "#2563eb", "#7c3aed", "#ec4899"].map((colorHex) => (
                              <button 
                                key={colorHex}
                                onClick={() => {
                                  setSelectedTextColor(colorHex);
                                  setShowColorPicker(false);
                                  showToast(`Aesthetic font color changed!`);
                                }}
                                className="h-5 w-5 rounded-full border border-slate-100 shrink-0 cursor-pointer hover:scale-110 duration-75"
                                style={{ backgroundColor: colorHex }}
                                type="button"
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Body Canvas Textarea */}
                <textarea 
                  id="compose-body-textarea"
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  style={{
                    fontWeight: isBold ? "bold" : "normal",
                    fontStyle: isItalic ? "italic" : "normal",
                    textDecoration: isUnderline ? "underline" : "none",
                    color: selectedTextColor
                  }}
                  className="w-full h-36 md:h-44 p-4 bg-white text-xs leading-relaxed border-none focus:ring-0 resize-none placeholder:text-[#bbc9c5] font-sans tracking-wide leading-relaxed outline-none" 
                  placeholder="Write your message here..."
                />
              </div>

              {/* Seeded & Native File Attachments List */}
              <div id="compose-attachments-list" className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-bold text-[#191c1d]/75">Attachments ({composeAttachments.length})</label>
                  <button 
                    id="compose-add-attachment-btn"
                    onClick={() => composeFileInputRef.current?.click()}
                    className="text-xs font-semibold text-[#006b5f] hover:text-[#004941] transition-colors flex items-center gap-1 border-none bg-transparent outline-none"
                    type="button"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add File</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                  {composeAttachments.map((fRecord) => (
                    <div 
                      key={fRecord.id} 
                      id={`compose-file-${fRecord.id}`}
                      className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-white hover:border-[#bbc9c5] transition-all group"
                    >
                      {fRecord.avatar ? (
                        <div className="size-9 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-[#bbc9c5]/30">
                          <img src={fRecord.avatar} alt={fRecord.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ) : (
                        <div className="size-9 bg-red-50 text-red-500 rounded-lg flex items-center justify-center shrink-0 font-bold">
                          PDF
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#191c1d] truncate">{fRecord.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{fRecord.size} • {fRecord.type}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setComposeAttachments(prev => prev.filter(a => a.id !== fRecord.id));
                          showToast(`Removed attachment: ${fRecord.name}`);
                        }}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-7 w-7 rounded-lg flex items-center justify-center transition-all border-none bg-transparent"
                        type="button"
                        title="Remove file attribute"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <footer 
              id="compose-modal-footer"
              className="px-6 py-4 border-t border-[#edeeef] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-[#f8f9fa] shrink-0"
            >
              <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                <button 
                  id="compose-attach-bottom"
                  onClick={() => composeFileInputRef.current?.click()}
                  className="size-10 hover:bg-[#e7e8e9] hover:text-[#191c1d] rounded-xl text-[#3d4946] flex items-center justify-center transition-all border-none bg-transparent shrink-0" 
                  title="Attach Files"
                  type="button"
                >
                  <Paperclip className="h-4.5 w-4.5" />
                </button>
                <button 
                  id="compose-emoji-bottom"
                  onClick={() => showToast("Emoji panel toggled")}
                  className="size-10 hover:bg-[#e7e8e9] hover:text-[#191c1d] rounded-xl text-[#3d4946] flex items-center justify-center transition-all border-none bg-transparent shrink-0" 
                  title="Insert Emoji"
                  type="button"
                >
                  <Smile className="h-4.5 w-4.5" />
                </button>
                <button 
                  id="compose-options-bottom"
                  onClick={() => showToast("Draft saved internally.")}
                  className="size-10 hover:bg-[#e7e8e9] hover:text-[#191c1d] rounded-xl text-[#3d4946] flex items-center justify-center transition-all border-none bg-transparent shrink-0" 
                  title="More Options"
                  type="button"
                >
                  <MoreVertical className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 flex-1">
                <div className="hidden md:flex text-[11px] font-medium text-slate-400 items-center gap-1.5 select-none font-mono">
                  <span className="size-1.5 rounded-full bg-[#006b5f]/40 animate-pulse"></span>
                  Last saved at 10:42 AM
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    id="compose-action-discard"
                    onClick={() => {
                      setIsComposeOpen(false);
                      showToast("Composition draft closed without updates.");
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100 border-none bg-transparent"
                    type="button"
                  >
                    Discard
                  </button>

                  <div className="flex items-stretch shadow-md rounded-xl overflow-hidden relative bg-[#006b5f]">
                    <button 
                      id="compose-action-send"
                      onClick={handleComposeSend}
                      disabled={composeSendStatus !== "idle"}
                      className={cn(
                        "text-white pl-5 pr-4 py-2 font-bold text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2 border-none shrink-0 cursor-pointer select-none",
                        composeSendStatus === "sending" 
                          ? "bg-slate-500" 
                          : composeSendStatus === "sent" 
                            ? "bg-[#35BFA3]" 
                            : "bg-[#006b5f]"
                      )}
                      type="button"
                    >
                      {composeSendStatus === "sending" ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Sending...</span>
                        </>
                      ) : composeSendStatus === "sent" ? (
                        <>
                          <span>Sent!</span>
                        </>
                      ) : (
                        <>
                          <span>Send</span>
                          <Send className="h-3 w-3 rotate-[-15deg]" />
                        </>
                      )}
                    </button>

                    <div className="w-[1.5px] bg-white/20"></div>

                    <button 
                      id="compose-action-schedule"
                      onClick={() => setShowScheduleMenu(!showScheduleMenu)}
                      disabled={composeSendStatus !== "idle"}
                      className="bg-[#006b5f] hover:brightness-110 text-white px-2 py-2 flex items-center justify-center transition-all border-none outline-none"
                      title="Schedule send"
                      type="button"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>

                    {/* Schedule Dropdown Menu Popup */}
                    {showScheduleMenu && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setShowScheduleMenu(false)} />
                        <div 
                          id="compose-schedule-popover"
                          className="absolute right-0 bottom-full mb-1.5 z-40 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[210px] animate-in slide-in-from-bottom-2 duration-150"
                        >
                          <span className="block px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase select-none">Delivery options</span>
                          {[
                            { label: "Tomorrow morning", time: "9:00 AM" },
                            { label: "Monday morning", time: "8:00 AM" },
                            { label: "Tomorrow afternoon", time: "1:00 PM" }
                          ].map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setShowScheduleMenu(false);
                                showToast(`Message scheduled for ${item.label} (${item.time})`);
                              }}
                              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-700 hover:bg-[#F8FCF3] hover:text-[#006b5f] transition-all text-left border-none bg-transparent"
                            >
                              <span>{item.label}</span>
                              <span className="text-[9px] text-[#3d4946] font-semibold">{item.time}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}

      {/* Floating Interactive Toast Container */}
      <div 
        id="compose-toast-container" 
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
      >
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            id={`toast-elem-${toast.id}`}
            className="pointer-events-auto bg-[#191c1d] text-[#ffffff] px-4 py-3 rounded-xl shadow-xl border border-slate-750/30 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-3 fade-in duration-200 min-w-[280px]"
          >
            <span className="text-[12px] font-semibold tracking-wide font-sans leading-relaxed">{toast.message}</span>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-slate-400 hover:text-white shrink-0 bg-transparent border-none outline-none cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
