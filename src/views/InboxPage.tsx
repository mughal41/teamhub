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
  Check,
  Loader2,
  Code,
  Quote,
  Strikethrough,
  Table,
  AlignRight,
  AlignCenter,
  PanelLeftClose,
  PanelLeftOpen,
  Clock,
  Copy,
  FileDown,
  CheckCheck
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [currentCategory, setCurrentCategory] = React.useState("Inbox");
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState("");

  // Compose Modal States
  const [isComposeOpen, setIsComposeOpen] = React.useState(false);
  const [composeModalMode, setComposeModalMode] = React.useState<"new" | "reply" | "forward">("new");
  const [composeTo, setComposeTo] = React.useState<any[]>([]);
  const [recipientInput, setRecipientInput] = React.useState("");
  const [showRecipientSuggestions, setShowRecipientSuggestions] = React.useState(false);
  const [composeSubject, setComposeSubject] = React.useState("");
  const [composeBody, setComposeBody] = React.useState("");
  const [composeAttachments, setComposeAttachments] = React.useState<any[]>([]);
  
  // Font & Typography States for Compose Modal
  const [composeFontFamily, setComposeFontFamily] = React.useState("Sans Serif");
  const [composeFontSize, setComposeFontSize] = React.useState("Normal");
  const [showComposeFontMenu, setShowComposeFontMenu] = React.useState(false);
  const [showComposeFontSizeMenu, setShowComposeFontSizeMenu] = React.useState(false);
  const [composeHistory, setComposeHistory] = React.useState<string[]>([""]);
  const [composeHistoryIndex, setComposeHistoryIndex] = React.useState(0);

  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [textAlign, setTextAlign] = React.useState<"left" | "center" | "right">("left");
  const [composeSendStatus, setComposeSendStatus] = React.useState<"idle" | "sending" | "sent">("idle");
  const [showScheduleMenu, setShowScheduleMenu] = React.useState(false);
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [selectedTextColor, setSelectedTextColor] = React.useState("#203430");

  // CC & BCC States
  const [showCc, setShowCc] = React.useState(false);
  const [showBcc, setShowBcc] = React.useState(false);
  const [composeCc, setComposeCc] = React.useState<any[]>([]);
  const [composeBcc, setComposeBcc] = React.useState<any[]>([]);
  const [ccInput, setCcInput] = React.useState("");
  const [bccInput, setBccInput] = React.useState("");
  const [showCcSuggestions, setShowCcSuggestions] = React.useState(false);
  const [showBccSuggestions, setShowBccSuggestions] = React.useState(false);

  // Popover States
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [showMoreOptions, setShowMoreOptions] = React.useState(false);
  const [showMoreFormatMenu, setShowMoreFormatMenu] = React.useState(false);
  const [showEditorSearch, setShowEditorSearch] = React.useState(false);
  const [editorSearchQuery, setEditorSearchQuery] = React.useState("");
  const [isHighPriority, setIsHighPriority] = React.useState(false);
  const [showFilterPopover, setShowFilterPopover] = React.useState(false);
  const [filterReadStatus, setFilterReadStatus] = React.useState<"all" | "unread" | "starred">("all");

  const [toasts, setToasts] = React.useState<Array<{ id: number, message: string }>>([]);
  const showToast = (message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const composeFileInputRef = React.useRef<HTMLInputElement | null>(null);
  const composeImageInputRef = React.useRef<HTMLInputElement | null>(null);

  const resetComposeModalState = () => {
    setComposeTo([]);
    setRecipientInput("");
    setShowRecipientSuggestions(false);
    setComposeSubject("");
    setComposeBody("");
    setComposeAttachments([]);
    setComposeCc([]);
    setComposeBcc([]);
    setCcInput("");
    setBccInput("");
    setShowCc(false);
    setShowBcc(false);
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setTextAlign("left");
    setComposeFontFamily("Sans Serif");
    setComposeFontSize("Normal");
    setSelectedTextColor("#203430");
    setIsHighPriority(false);
    setComposeSendStatus("idle");
    setShowScheduleMenu(false);
    setShowEmojiPicker(false);
    setShowMoreOptions(false);
    setShowMoreFormatMenu(false);
    setShowComposeFontMenu(false);
    setShowComposeFontSizeMenu(false);
    setComposeHistory([""]);
    setComposeHistoryIndex(0);
  };

  const handleOpenNewMessage = () => {
    resetComposeModalState();
    setComposeModalMode("new");
    setIsComposeOpen(true);
  };

  const handleCloseComposeModal = (isDiscard = false) => {
    setIsComposeOpen(false);
    resetComposeModalState();
    if (isDiscard) {
      showToast("Draft discarded.");
    }
  };

  const handleComposeUndo = () => {
    if (composeHistoryIndex > 0) {
      const newIdx = composeHistoryIndex - 1;
      setComposeHistoryIndex(newIdx);
      setComposeBody(composeHistory[newIdx]);
      showToast("Undone");
    } else {
      showToast("Nothing to undo");
    }
  };

  const handleComposeRedo = () => {
    if (composeHistoryIndex < composeHistory.length - 1) {
      const newIdx = composeHistoryIndex + 1;
      setComposeHistoryIndex(newIdx);
      setComposeBody(composeHistory[newIdx]);
      showToast("Redone");
    } else {
      showToast("Nothing to redo");
    }
  };

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

  const handleComposeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files).map((f: File, index) => {
      const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
      return {
        id: `custom-img-${Date.now()}-${index}`,
        name: f.name,
        size: `${sizeMB} MB`,
        type: "Image File",
        avatar: URL.createObjectURL(f)
      };
    });
    setComposeAttachments(prev => [...prev, ...fileList]);
    showToast(`Added ${fileList.length} image(s)`);
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
    const alreadyAdded = composeTo.some(added => added.name?.toLowerCase() === c.name.toLowerCase());
    if (alreadyAdded) return false;
    if (!recipientInput) return true;
    return c.name.toLowerCase().includes(recipientInput.toLowerCase()) || 
           (c.email && c.email.toLowerCase().includes(recipientInput.toLowerCase()));
  });

  const handleSaveAsDraft = () => {
    if (!composeBody.trim() && !composeSubject.trim() && composeAttachments.length === 0) {
      showToast("Draft is empty, nothing to save.");
      return;
    }
    const newDraft = {
      id: Date.now(),
      sender: "Draft Correspondence",
      initials: "DR",
      label: "bg-[#F8C947]",
      tagName: "Admin Notes",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "Today",
      title: composeSubject || "(No Subject)",
      snippet: composeBody.substring(0, 70) + (composeBody.length > 70 ? "..." : ""),
      body: composeBody,
      category: "Drafts",
      starred: false,
      unread: false,
      attachments: [...composeAttachments]
    };
    setEmailsStore(prev => [newDraft, ...prev]);
    setIsComposeOpen(false);
    resetComposeModalState();
    showToast("Message saved as draft in Drafts folder.");
    window.dispatchEvent(new Event("db_updated"));
  };

  const handleComposeSend = () => {
    if (composeTo.length === 0) {
      showToast("Please add at least one recipient.");
      return;
    }
    if (!composeBody.trim() && composeAttachments.length === 0) {
      showToast("Please write a message or add an attachment.");
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
        snippet: composeBody.substring(0, 70) + (composeBody.length > 70 ? "..." : ""),
        body: `To: ${composeTo.map(r => r.name).join(", ")}\n\n${composeBody}`,
        category: "Sent",
        starred: false,
        unread: false,
        attachments: [...composeAttachments]
      };
      
      setEmailsStore(prev => [newSentMail, ...prev]);
      setComposeSendStatus("sent");
      showToast("Message sent successfully!");
      
      setTimeout(() => {
        setIsComposeOpen(false);
        resetComposeModalState();
        setCurrentCategory("Sent");
        setActiveEmailId(newSentMail.id);
        window.dispatchEvent(new Event("db_updated"));
      }, 700);
    }, 900);
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

    let matchesReadStatus = true;
    if (filterReadStatus === "unread") matchesReadStatus = !!e.unread;
    if (filterReadStatus === "starred") matchesReadStatus = !!e.starred;
    
    return matchesSearch && matchesCategory && matchesLabel && matchesReadStatus;
  });

  const [activeEmailId, setActiveEmailId] = React.useState<number | null>(1);
  const activeEmail = filteredEmails.find(e => e.id === activeEmailId) || filteredEmails[0] || null;

  // Detail View & Inline Reply States
  const replyInputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const replyFileInputRef = React.useRef<HTMLInputElement | null>(null);
  const replyImageInputRef = React.useRef<HTMLInputElement | null>(null);
  const replySectionRef = React.useRef<HTMLDivElement | null>(null);

  const [showDetailMoreMenu, setShowDetailMoreMenu] = React.useState(false);
  const [showReplyCc, setShowReplyCc] = React.useState(false);
  const [showReplyBcc, setShowReplyBcc] = React.useState(false);
  const [replyCc, setReplyCc] = React.useState<string[]>([]);
  const [replyBcc, setReplyBcc] = React.useState<string[]>([]);
  const [replyCcInput, setReplyCcInput] = React.useState("");
  const [replyBccInput, setReplyBccInput] = React.useState("");
  const [replyAttachments, setReplyAttachments] = React.useState<any[]>([]);
  const [replySendStatus, setReplySendStatus] = React.useState<"idle" | "sending" | "sent">("idle");
  const [showReplyScheduleMenu, setShowReplyScheduleMenu] = React.useState(false);
  const [showReplyEmojiPicker, setShowReplyEmojiPicker] = React.useState(false);
  const [showReplyMoreFormat, setShowReplyMoreFormat] = React.useState(false);
  const [showReplyFontMenu, setShowReplyFontMenu] = React.useState(false);
  const [showReplyFontSizeMenu, setShowReplyFontSizeMenu] = React.useState(false);
  const [replyFontFamily, setReplyFontFamily] = React.useState("Sans Serif");
  const [replyFontSize, setReplyFontSize] = React.useState("Normal");
  const [isReplyBold, setIsReplyBold] = React.useState(false);
  const [isReplyItalic, setIsReplyItalic] = React.useState(false);
  const [isReplyUnderline, setIsReplyUnderline] = React.useState(false);
  const [replyTextAlign, setReplyTextAlign] = React.useState<"left" | "center" | "right">("left");
  const [replyHistory, setReplyHistory] = React.useState<string[]>([""]);
  const [replyHistoryIndex, setReplyHistoryIndex] = React.useState(0);

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

  const handleReplyClick = () => {
    if (!activeEmail) return;
    replySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setTimeout(() => {
      replyInputRef.current?.focus();
    }, 150);
    showToast(`Replying to ${activeEmail.sender}`);
  };

  const handleForwardClick = () => {
    if (!activeEmail) return;
    resetComposeModalState();
    setComposeModalMode("forward");
    setComposeSubject(`Fwd: ${activeEmail.title.replace(/^Fwd:\s*/i, "")}`);
    setComposeTo([]);
    const senderEmail = `${activeEmail.sender?.toLowerCase().replace(/\s+/g, ".")}@company.com`;
    const forwardedText = `\n\n---------- Forwarded message ---------\nFrom: ${activeEmail.sender} <${senderEmail}>\nDate: ${activeEmail.date || "Today"}, ${activeEmail.time}\nSubject: ${activeEmail.title}\nTo: Me\n\n${activeEmail.body || activeEmail.snippet}`;
    setComposeBody(forwardedText);
    setComposeHistory([forwardedText]);
    setComposeHistoryIndex(0);
    if (activeEmail.attachments && activeEmail.attachments.length > 0) {
      setComposeAttachments([...activeEmail.attachments]);
    }
    setIsComposeOpen(true);
    showToast("Forwarding message: select recipient(s)");
  };

  const handleArchiveEmail = () => {
    if (!activeEmail) return;
    setEmailsStore(prev => prev.map(m => m.id === activeEmail.id ? { ...m, category: "Archive" } : m));
    showToast("Conversation archived");
    window.dispatchEvent(new Event("db_updated"));
    const remaining = filteredEmails.filter(e => e.id !== activeEmail.id);
    setActiveEmailId(remaining.length > 0 ? remaining[0].id : null);
  };

  const handleDeleteEmail = () => {
    if (!activeEmail) return;
    if (activeEmail.category === "Trash") {
      setEmailsStore(prev => prev.filter(m => m.id !== activeEmail.id));
      showToast("Message permanently deleted");
    } else {
      setEmailsStore(prev => prev.map(m => m.id === activeEmail.id ? { ...m, category: "Trash" } : m));
      showToast("Message moved to Trash");
    }
    window.dispatchEvent(new Event("db_updated"));
    const remaining = filteredEmails.filter(e => e.id !== activeEmail.id);
    setActiveEmailId(remaining.length > 0 ? remaining[0].id : null);
  };

  const handlePrintEmail = () => {
    if (!activeEmail) return;
    showToast("Preparing document for printing...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleExportText = () => {
    if (!activeEmail) return;
    const senderEmail = `${activeEmail.sender?.toLowerCase().replace(/\s+/g, ".")}@company.com`;
    const content = `Subject: ${activeEmail.title}\nFrom: ${activeEmail.sender} <${senderEmail}>\nDate: ${activeEmail.date || "Today"} at ${activeEmail.time}\nCategory: ${activeEmail.category || "Inbox"}\n\n${activeEmail.body || activeEmail.snippet}${
      activeEmail.replies && activeEmail.replies.length > 0
        ? `\n\n--- Responses (${activeEmail.replies.length}) ---\n` +
          activeEmail.replies.map((r: any) => `\n[${r.sender} - ${r.date || "Today"} ${r.time}]\n${r.text}\n`).join("")
        : ""
    }`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(activeEmail.title || "email").replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Email exported as text file");
    setShowDetailMoreMenu(false);
  };

  const handleExpandReplyToCompose = () => {
    if (!activeEmail) return;
    resetComposeModalState();
    setComposeModalMode("reply");
    setComposeTo([{
      type: "individual",
      name: activeEmail.sender,
      email: `${activeEmail.sender?.toLowerCase().replace(/\s+/g, ".")}@company.com`,
      avatar: activeEmail.avatar
    }]);
    if (showReplyCc && replyCc.length > 0) {
      setShowCc(true);
      setComposeCc(replyCc.map(c => typeof c === 'string' ? { name: c } : c));
    }
    if (showReplyBcc && replyBcc.length > 0) {
      setShowBcc(true);
      setComposeBcc(replyBcc.map(b => typeof b === 'string' ? { name: b } : b));
    }
    setComposeSubject(activeEmail.title.startsWith("Re:") ? activeEmail.title : `Re: ${activeEmail.title}`);
    setComposeBody(replyText || "");
    setComposeHistory([replyText || ""]);
    setComposeHistoryIndex(0);
    if (replyAttachments.length > 0) {
      setComposeAttachments([...replyAttachments]);
    }
    setIsBold(isReplyBold);
    setIsItalic(isReplyItalic);
    setIsUnderline(isReplyUnderline);
    setTextAlign(replyTextAlign);
    setComposeFontFamily(replyFontFamily);
    setComposeFontSize(replyFontSize);
    setIsComposeOpen(true);
    showToast("Expanded reply into composer modal");
  };

  const handleReplyFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files).map((f: File, index) => {
      const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
      const isImg = f.type.startsWith("image/");
      return {
        id: `reply-attach-${Date.now()}-${index}`,
        name: f.name,
        size: `${sizeMB} MB`,
        type: isImg ? "Image File" : "Attachment File",
        avatar: isImg ? URL.createObjectURL(f) : undefined
      };
    });
    setReplyAttachments(prev => [...prev, ...fileList]);
    showToast(`Added ${fileList.length} attachment(s) to response`);
  };

  const handleReplyUndo = () => {
    if (replyHistoryIndex > 0) {
      const newIndex = replyHistoryIndex - 1;
      setReplyHistoryIndex(newIndex);
      setReplyText(replyHistory[newIndex]);
      showToast("Undone");
    } else {
      showToast("Nothing to undo");
    }
  };

  const handleReplyRedo = () => {
    if (replyHistoryIndex < replyHistory.length - 1) {
      const newIndex = replyHistoryIndex + 1;
      setReplyHistoryIndex(newIndex);
      setReplyText(replyHistory[newIndex]);
      showToast("Redone");
    } else {
      showToast("Nothing to redo");
    }
  };

  const handleSendMessage = () => {
    if (!replyText.trim() && replyAttachments.length === 0) {
      showToast("Please enter a response before sending.");
      return;
    }
    if (!activeEmail) return;

    setReplySendStatus("sending");

    setTimeout(() => {
      const newReply = {
        id: Date.now(),
        sender: "Me (You)",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: "Today",
        text: replyText,
        attachments: [...replyAttachments]
      };

      const updatedStore = emailsStore.map(mail => {
        if (mail.id === activeEmail.id) {
          const currentReplies = mail.replies || [];
          return {
            ...mail,
            replies: [...currentReplies, newReply]
          };
        }
        return mail;
      });

      const sentMailRecord = {
        id: Date.now() + 1,
        sender: "Me (You)",
        initials: "ME",
        label: activeEmail.label || "bg-[#35BFA3]",
        tagName: activeEmail.tagName || "HR",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: "Today",
        title: activeEmail.title.startsWith("Re:") ? activeEmail.title : `Re: ${activeEmail.title}`,
        snippet: replyText.substring(0, 70) + (replyText.length > 70 ? "..." : ""),
        body: replyText,
        category: "Sent",
        starred: false,
        unread: false,
        attachments: [...replyAttachments]
      };

      setEmailsStore([sentMailRecord, ...updatedStore]);
      setReplySendStatus("sent");
      showToast(`Reply sent to ${activeEmail.sender}!`);
      window.dispatchEvent(new Event("db_updated"));

      setTimeout(() => {
        setReplyText("");
        setReplyAttachments([]);
        setReplySendStatus("idle");
        setShowReplyCc(false);
        setShowReplyBcc(false);
        setReplyCc([]);
        setReplyBcc([]);
      }, 700);
    }, 900);
  };

  return (
    <AppLayout 
      title="Inbox" 
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Inbox" }]}
    >
      <div className="flex gap-6 h-[calc(100vh-140px)] min-h-[872px]">
        {/* Page Internal Sidebar */}
        <div className={cn(
          "flex flex-col gap-3 transition-all duration-300 ease-in-out shrink-0",
          isSidebarCollapsed ? "w-[60px]" : "w-[195px]"
        )}>
           {/* Sidebar Collapse/Expand Header Toggle */}
           <div className="flex items-center justify-between px-1.5 py-0.5">
             {!isSidebarCollapsed && (
               <span className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider">Mailboxes</span>
             )}
             <button
               type="button"
               onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
               className={cn(
                 "p-1.5 rounded-lg text-[#63716E] hover:text-[#203430] hover:bg-white/70 transition-all cursor-pointer",
                 isSidebarCollapsed && "mx-auto"
               )}
               title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
             >
               {isSidebarCollapsed ? <PanelLeftOpen className="h-5 w-5 text-[#006b5f]" /> : <PanelLeftClose className="h-5 w-5" />}
             </button>
           </div>

           <button 
             onClick={handleOpenNewMessage}
             className={cn(
               "bg-brand h-[44px] rounded-[12px] flex items-center justify-center text-white font-semibold hover:bg-[#005047] transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] duration-150 overflow-hidden cursor-pointer",
               isSidebarCollapsed ? "w-[44px] self-center p-0" : "w-full gap-2 px-3.5"
             )}
             title={isSidebarCollapsed ? "New Message" : undefined}
           >
              <Plus className="h-5 w-5 shrink-0" /> 
              {!isSidebarCollapsed && <span className="truncate">New Message</span>}
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
                     title={isSidebarCollapsed ? `${cat.label}${cat.count ? ` (${cat.count})` : ''}` : undefined}
                     className={cn(
                       "h-11 flex items-center gap-2.5 rounded-[12px] transition-all group text-left relative cursor-pointer",
                       isSidebarCollapsed ? "w-[44px] justify-center px-0 mx-auto" : "w-full px-3.5",
                       isActive ? "bg-white text-[#203430] shadow-sm font-bold" : "text-[#63716E] hover:bg-white/50"
                     )}
                    >
                       <cat.icon className={cn("h-5 w-5 transition-colors shrink-0", isActive ? "text-[#203430]" : "text-[#63716E] group-hover:text-[#203430]")} />
                       {!isSidebarCollapsed && (
                         <>
                           <span className="text-[14px] font-medium flex-1 truncate">{cat.label}</span>
                           {!!cat.count && (
                             <div className={cn("h-6 w-6 rounded-full flex items-center justify-center shrink-0", isActive ? "bg-brand" : "bg-white border border-[#E5E6E6]")}>
                                <span className={cn("text-[11px] font-bold", isActive ? "text-white" : "text-[#63716E]")}>{cat.count}</span>
                             </div>
                           )}
                         </>
                       )}
                       {isSidebarCollapsed && !!cat.count && (
                         <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#F7F7F7]">
                           {cat.count}
                         </span>
                       )}
                    </button>
                 );
              })}
           </div>

           <div className={cn("pt-3 mt-auto", isSidebarCollapsed && "flex flex-col items-center")}>
              {!isSidebarCollapsed ? (
                <h4 className="text-[14px] font-bold text-[#203430] mb-3 px-1">Label</h4>
              ) : (
                <div className="h-px w-8 bg-[#bbc9c5]/40 mb-3" />
              )}
              <div className="space-y-1 w-full">
                 {labels.map(l => {
                    const isActive = selectedLabel === l.label;
                    return (
                       <button 
                         key={l.label} 
                         onClick={() => {
                           setSelectedLabel(isActive ? null : l.label);
                         }}
                         title={isSidebarCollapsed ? l.label : undefined}
                         className={cn(
                           "h-11 flex items-center gap-2.5 rounded-[12px] hover:bg-white/50 group transition-all text-left cursor-pointer",
                           isSidebarCollapsed ? "w-[44px] justify-center px-0 mx-auto" : "w-full px-3.5",
                           isActive ? "bg-white text-[#203430] font-bold shadow-sm" : ""
                         )}
                       >
                          <Tag className={cn("h-5 w-5 fill-current shrink-0", l.color.replace('bg-', 'text-'))} />
                          {!isSidebarCollapsed && (
                            <span className="text-[14px] font-medium text-[#63716E] group-hover:text-[#203430] truncate flex-1">{l.label}</span>
                          )}
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
                  className="w-full h-10 pl-10 pr-4 bg-[#F7F7F7] rounded-[10px] outline-none text-[14px] text-[#63716E] focus:bg-white focus:ring-1 focus:ring-[#006b5f]/30 transition-all"
                 />
              </div>

              {/* Filter Button & Anchor */}
              <div className="relative shrink-0">
                <button 
                  type="button"
                  onClick={() => setShowFilterPopover(!showFilterPopover)}
                  className={cn(
                    "h-10 w-10 flex items-center justify-center rounded-[10px] transition-all cursor-pointer border-none shadow-xs",
                    showFilterPopover || filterReadStatus !== "all" || selectedLabel
                      ? "bg-[#006b5f] text-white shadow-sm ring-2 ring-[#006b5f]/20"
                      : "bg-[#E4F2D3] text-[#203430] hover:bg-brand hover:text-white"
                  )}
                  title="Filter Messages"
                >
                   <SlidersHorizontal className="h-5 w-5" />
                </button>

                {/* Premium Filter Popover */}
                {showFilterPopover && (
                  <>
                    <div 
                      className="fixed inset-0 z-30 bg-transparent cursor-default" 
                      onClick={() => setShowFilterPopover(false)} 
                    />
                    <div className="absolute right-0 top-full mt-2.5 z-40 w-76 bg-white border border-[#bbc9c5]/50 rounded-2xl shadow-2xl shadow-[#203430]/15 p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                      {/* Anchored Caret / Arrow */}
                      <div className="absolute -top-1.5 right-3.5 w-3 h-3 bg-white border-t border-l border-[#bbc9c5]/50 rotate-45 rounded-[2px]" />

                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#E4F2D3] flex items-center justify-center text-[#006b5f]">
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs font-bold text-[#203430]">
                            Filter Messages
                          </span>
                          {(filterReadStatus !== "all" || selectedLabel) && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#006b5f]/10 text-[#006b5f]">
                              Active
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowFilterPopover(false)}
                          className="h-6 w-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Status Filter: Segmented Control */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider block">
                          Message Status
                        </label>
                        <div className="bg-[#F4F6F5] p-1 rounded-xl grid grid-cols-3 gap-1">
                          {[
                            { id: "all", label: "All" },
                            { id: "unread", label: "Unread" },
                            { id: "starred", label: "Starred" }
                          ].map((st) => {
                            const isSelected = filterReadStatus === st.id;
                            return (
                              <button
                                key={st.id}
                                type="button"
                                onClick={() => setFilterReadStatus(st.id as any)}
                                className={cn(
                                  "py-1.5 px-2 rounded-lg text-xs font-medium cursor-pointer border-none transition-all text-center",
                                  isSelected
                                    ? "bg-white text-[#203430] font-bold shadow-xs"
                                    : "text-[#63716E] hover:text-[#203430]"
                                )}
                              >
                                {st.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tag / Label Filter: Elegant Wrapped Chips */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider block">
                          Tag / Label
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedLabel(null)}
                            className={cn(
                              "px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-all flex items-center gap-1.5",
                              !selectedLabel
                                ? "bg-[#006b5f]/10 border-[#006b5f] text-[#006b5f] font-bold shadow-xs"
                                : "bg-white border-slate-200 text-[#63716E] hover:border-[#bbc9c5] hover:text-[#203430]"
                            )}
                          >
                            All Labels
                          </button>
                          {labels.map((lbl) => {
                            const isSelected = selectedLabel === lbl.label;
                            return (
                              <button
                                key={lbl.label}
                                type="button"
                                onClick={() => setSelectedLabel(isSelected ? null : lbl.label)}
                                className={cn(
                                  "px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-all flex items-center gap-1.5",
                                  isSelected
                                    ? "bg-[#006b5f]/10 border-[#006b5f] text-[#006b5f] font-bold shadow-xs"
                                    : "bg-white border-slate-200 text-[#63716E] hover:border-[#bbc9c5] hover:text-[#203430]"
                                )}
                              >
                                <span className={cn("w-2 h-2 rounded-full shrink-0", lbl.color)} />
                                <span>{lbl.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSearch("");
                            setSelectedLabel(null);
                            setFilterReadStatus("all");
                            showToast("Filters reset to default");
                          }}
                          className="text-xs font-semibold text-[#63716E] hover:text-[#203430] border-none bg-transparent cursor-pointer transition-colors"
                        >
                          Reset Filters
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowFilterPopover(false);
                            showToast("Filters applied");
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-brand hover:bg-[#005047] text-white text-xs font-semibold shadow-xs cursor-pointer transition-all"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
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
               <div className="bg-[#F7F7F7] rounded-[10px] p-2 flex items-center justify-between mb-4 relative">
                  <div className="flex items-center gap-1">
                     <button 
                       type="button"
                       onClick={() => setActiveEmailId(null)}
                       className="h-7 w-7 flex items-center justify-center text-[#63716E] hover:text-[#203430] rounded-lg hover:bg-white transition-colors"
                       title="Back to email list / Deselect"
                     >
                        <ArrowLeft className="h-4 w-4" />
                     </button>
                     <button 
                       type="button"
                       onClick={handleArchiveEmail}
                       className="h-7 w-7 flex items-center justify-center text-[#63716E] hover:text-[#203430] rounded-lg hover:bg-white transition-colors"
                       title="Archive conversation"
                     >
                        <Archive className="h-4 w-4" />
                     </button>
                     <button 
                       type="button"
                       onClick={handleDeleteEmail}
                       className="h-7 w-7 flex items-center justify-center text-[#63716E] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                       title="Move to Trash"
                     >
                        <Trash2 className="h-4 w-4" />
                     </button>
                     <button 
                       type="button"
                       onClick={handlePrintEmail}
                       className="h-7 w-7 flex items-center justify-center text-[#63716E] hover:text-[#203430] rounded-lg hover:bg-white transition-colors"
                       title="Print conversation"
                     >
                        <Printer className="h-4 w-4" />
                     </button>
                     <div className="relative">
                       <button 
                         type="button"
                         onClick={() => setShowDetailMoreMenu(!showDetailMoreMenu)}
                         className={cn(
                           "h-7 w-7 flex items-center justify-center text-[#63716E] hover:text-[#203430] rounded-lg hover:bg-white transition-colors",
                           showDetailMoreMenu && "bg-white text-[#203430] shadow-xs"
                         )}
                         title="More options"
                       >
                          <MoreHorizontal className="h-4 w-4" />
                       </button>

                       {/* More Options Dropdown Menu */}
                       {showDetailMoreMenu && (
                         <>
                           <div 
                             className="fixed inset-0 z-20 cursor-default" 
                             onClick={() => setShowDetailMoreMenu(false)} 
                           />
                           <div className="absolute left-0 top-8 z-30 bg-white border border-[#E5E6E6] rounded-xl shadow-xl py-1.5 w-52 animate-in fade-in zoom-in-95 duration-150 text-left">
                             <button
                               type="button"
                               onClick={() => {
                                 setEmailsStore(prev => prev.map(m => m.id === activeEmail.id ? { ...m, unread: true } : m));
                                 showToast("Marked as unread");
                                 setShowDetailMoreMenu(false);
                                 setActiveEmailId(null);
                               }}
                               className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-xs text-[#203430] font-medium"
                             >
                               <FileText className="h-3.5 w-3.5 text-[#63716E]" /> Mark as unread
                             </button>
                             <button
                               type="button"
                               onClick={() => {
                                 setEmailsStore(prev => prev.map(m => m.id === activeEmail.id ? { ...m, starred: !m.starred } : m));
                                 showToast(activeEmail.starred ? "Removed from Starred" : "Starred conversation");
                                 setShowDetailMoreMenu(false);
                               }}
                               className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-xs text-[#203430] font-medium"
                             >
                               <Star className={cn("h-3.5 w-3.5", activeEmail.starred ? "text-[#F8C947] fill-[#F8C947]" : "text-[#63716E]")} />
                               {activeEmail.starred ? "Unstar conversation" : "Star conversation"}
                             </button>
                             <button
                               type="button"
                               onClick={() => {
                                 setEmailsStore(prev => prev.map(m => m.id === activeEmail.id ? { ...m, category: "Spam" } : m));
                                 showToast("Reported and moved to Spam");
                                 setShowDetailMoreMenu(false);
                                 const remaining = filteredEmails.filter(e => e.id !== activeEmail.id);
                                 setActiveEmailId(remaining.length > 0 ? remaining[0].id : null);
                               }}
                               className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-xs text-[#203430] font-medium"
                             >
                               <AlertOctagon className="h-3.5 w-3.5 text-[#63716E]" /> Report as Spam
                             </button>
                             <div className="h-px bg-[#E5E6E6] my-1" />
                             <div className="px-3 py-1 text-[10px] font-bold text-[#63716E] uppercase tracking-wider">Change Label</div>
                             {labels.map(l => (
                               <button
                                 key={l.label}
                                 type="button"
                                 onClick={() => {
                                   setEmailsStore(prev => prev.map(m => m.id === activeEmail.id ? { ...m, label: l.color, tagName: l.label } : m));
                                   showToast(`Label set to "${l.label}"`);
                                   setShowDetailMoreMenu(false);
                                 }}
                                 className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-xs text-[#203430]"
                               >
                                 <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", l.color)} />
                                 <span>{l.label}</span>
                               </button>
                             ))}
                             <div className="h-px bg-[#E5E6E6] my-1" />
                             <button
                               type="button"
                               onClick={handleExportText}
                               className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-xs text-[#203430] font-medium"
                             >
                               <FileDown className="h-3.5 w-3.5 text-[#63716E]" /> Export as Text (.txt)
                             </button>
                             <button
                               type="button"
                               onClick={() => {
                                 navigator.clipboard.writeText(activeEmail.title);
                                 showToast("Subject copied to clipboard");
                                 setShowDetailMoreMenu(false);
                               }}
                               className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-xs text-[#203430] font-medium"
                             >
                               <Copy className="h-3.5 w-3.5 text-[#63716E]" /> Copy Subject
                             </button>
                           </div>
                         </>
                       )}
                     </div>
                  </div>
                  <div className="flex items-center gap-2 pr-1">
                     <span className="text-[12px] text-[#63716E] font-medium">
                       {filteredEmails.indexOf(activeEmail) + 1} of {filteredEmails.length}
                     </span>
                     <button 
                       type="button"
                       disabled={filteredEmails.indexOf(activeEmail) <= 0}
                       onClick={() => {
                         const prevIndex = filteredEmails.indexOf(activeEmail) - 1;
                         if (prevIndex >= 0) setActiveEmailId(filteredEmails[prevIndex].id);
                       }}
                       className="h-7 w-7 flex items-center justify-center bg-white rounded-[8px] border border-[#E5E6E6] hover:bg-[#F7F7F7] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shadow-2xs transition-all"
                       title="Previous message"
                     >
                        <ChevronLeft className="h-4 w-4" />
                     </button>
                     <button 
                       type="button"
                       disabled={filteredEmails.indexOf(activeEmail) >= filteredEmails.length - 1}
                       onClick={() => {
                         const nextIndex = filteredEmails.indexOf(activeEmail) + 1;
                         if (nextIndex < filteredEmails.length) setActiveEmailId(filteredEmails[nextIndex].id);
                       }}
                       className="h-7 w-7 flex items-center justify-center bg-white rounded-[8px] border border-[#E5E6E6] hover:bg-[#F7F7F7] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shadow-2xs transition-all"
                       title="Next message"
                     >
                        <ChevronRight className="h-4 w-4" />
                     </button>
                  </div>
               </div>

               {/* Detail Content Area */}
               <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="flex items-center justify-between mb-5">
                     <div className="flex items-center gap-3">
                        <img 
                          src={activeEmail.avatar || `https://ui-avatars.com/api/?name=${activeEmail.sender}&background=0E4D41&color=fff`} 
                          className="h-9 w-9 rounded-full object-cover shrink-0 ring-1 ring-black/5" 
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
                           <button 
                             type="button"
                             onClick={handleReplyClick}
                             className="flex items-center gap-1.5 bg-[#F7F7F7] h-6 px-2.5 rounded-[8px] group hover:bg-[#006b5f] transition-all cursor-pointer shadow-2xs"
                             title="Reply to message"
                           >
                              <Reply className="h-3 w-3 text-[#203430] group-hover:text-white transition-colors" />
                              <span className="text-[11px] font-bold text-[#203430] group-hover:text-white transition-colors">Reply</span>
                           </button>
                           <button 
                             type="button"
                             onClick={handleForwardClick}
                             className="flex items-center gap-1.5 bg-[#F7F7F7] h-6 px-2.5 rounded-[8px] group hover:bg-[#006b5f] transition-all cursor-pointer shadow-2xs"
                             title="Forward message"
                           >
                              <Forward className="h-3 w-3 text-[#203430] group-hover:text-white transition-colors" />
                              <span className="text-[11px] font-bold text-[#203430] group-hover:text-white transition-colors">Forward</span>
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="h-px bg-[#E5E6E6] mb-5" />

                  <h2 className="text-[16px] sm:text-[18px] font-bold text-[#1E1E20] mb-5">{activeEmail.title}</h2>
                  
                  {/* Message body paragraphs */}
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

                  {/* Thread History Responses */}
                  {activeEmail.replies && activeEmail.replies.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-[#E5E6E6] space-y-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider">
                          Thread Responses ({activeEmail.replies.length})
                        </span>
                        <div className="h-px bg-[#E5E6E6] flex-1" />
                      </div>
                      {activeEmail.replies.map((reply: any, rIdx: number) => (
                        <div key={reply.id || rIdx} className="bg-[#F8FCF3] border border-[#006b5f]/15 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="h-7 w-7 rounded-full bg-[#006b5f] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                ME
                              </div>
                              <div>
                                <p className="text-[12px] font-bold text-[#203430] leading-none">{reply.sender}</p>
                                <p className="text-[10px] text-[#63716E] mt-0.5">{reply.date || "Today"} at {reply.time}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-[#006b5f] bg-[#006b5f]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCheck className="h-3 w-3" /> Sent
                            </span>
                          </div>
                          <p className="text-[12px] text-[#203430] whitespace-pre-wrap leading-relaxed pl-9">
                            {reply.text}
                          </p>
                          {reply.attachments && reply.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 pl-9 pt-1">
                              {reply.attachments.map((att: any, aIdx: number) => (
                                <span key={aIdx} className="text-[11px] bg-white border border-[#E5E6E6] rounded-md px-2 py-1 flex items-center gap-1.5 text-slate-700">
                                  <Paperclip className="h-3 w-3 text-[#006b5f]" />
                                  <span className="font-medium truncate max-w-[120px]">{att.name}</span>
                                  <span className="text-[10px] text-slate-400">({att.size})</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
               </div>

               {/* Composition / Inline Reply Section */}
               <div 
                 ref={replySectionRef}
                 className="mt-4 border border-[#E5E6E6] rounded-[16px] overflow-hidden flex flex-col min-h-[298px] bg-white shadow-2xs relative"
               >
                  <div className="p-4 flex-1 flex flex-col gap-3">
                     {/* Header: To, Cc, Bcc, Maximize */}
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <span className="text-[14px] text-[#63716E] font-medium">To:</span>
                           <div className="bg-[#F7F7F7] rounded-[6px] px-2 py-1 flex items-center gap-2 border border-[#E5E6E6]/60">
                              <span className="text-[13px] font-bold text-[#203430]">{activeEmail.sender}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  showToast("Recipient cleared. You can also click Forward to choose custom recipients.");
                                }}
                                className="text-[#63716E] hover:text-[#203430] p-0.5 cursor-pointer rounded"
                                title="Change recipient"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <button
                             type="button"
                             onClick={() => setShowReplyCc(!showReplyCc)}
                             className={cn(
                               "text-[13px] font-semibold transition-colors cursor-pointer",
                               showReplyCc ? "text-[#006b5f] font-bold underline" : "text-[#63716E] hover:text-[#203430]"
                             )}
                           >
                             Cc
                           </button>
                           <button
                             type="button"
                             onClick={() => setShowReplyBcc(!showReplyBcc)}
                             className={cn(
                               "text-[13px] font-semibold transition-colors cursor-pointer",
                               showReplyBcc ? "text-[#006b5f] font-bold underline" : "text-[#63716E] hover:text-[#203430]"
                             )}
                           >
                             Bcc
                           </button>
                           <button
                             type="button"
                             onClick={handleExpandReplyToCompose}
                             className="text-[#63716E] hover:text-[#006b5f] p-1 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                             title="Expand into full composer"
                           >
                             <Maximize2 className="h-4 w-4" />
                           </button>
                        </div>
                     </div>

                     {/* CC Row */}
                     {showReplyCc && (
                       <div className="flex items-center gap-2 py-1 px-2 bg-slate-50/70 rounded-lg border border-slate-200/60 animate-in fade-in duration-150">
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cc:</span>
                         <div className="flex flex-wrap items-center gap-1.5 flex-1">
                           {replyCc.map((email, idx) => (
                             <span key={idx} className="bg-white border border-slate-200 text-xs px-2 py-0.5 rounded-md flex items-center gap-1 text-slate-700">
                               {email}
                               <button type="button" onClick={() => setReplyCc(prev => prev.filter((_, i) => i !== idx))} className="hover:text-red-500">
                                 <X className="h-3 w-3" />
                               </button>
                             </span>
                           ))}
                           <input 
                             type="text"
                             value={replyCcInput}
                             onChange={(e) => setReplyCcInput(e.target.value)}
                             onKeyDown={(e) => {
                               if (e.key === "Enter" && replyCcInput.trim()) {
                                 e.preventDefault();
                                 setReplyCc(prev => [...prev, replyCcInput.trim()]);
                                 setReplyCcInput("");
                               }
                             }}
                             placeholder="Type Cc and press Enter..."
                             className="text-xs bg-transparent border-none outline-none flex-1 min-w-[120px]"
                           />
                         </div>
                       </div>
                     )}

                     {/* BCC Row */}
                     {showReplyBcc && (
                       <div className="flex items-center gap-2 py-1 px-2 bg-slate-50/70 rounded-lg border border-slate-200/60 animate-in fade-in duration-150">
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bcc:</span>
                         <div className="flex flex-wrap items-center gap-1.5 flex-1">
                           {replyBcc.map((email, idx) => (
                             <span key={idx} className="bg-white border border-slate-200 text-xs px-2 py-0.5 rounded-md flex items-center gap-1 text-slate-700">
                               {email}
                               <button type="button" onClick={() => setReplyBcc(prev => prev.filter((_, i) => i !== idx))} className="hover:text-red-500">
                                 <X className="h-3 w-3" />
                               </button>
                             </span>
                           ))}
                           <input 
                             type="text"
                             value={replyBccInput}
                             onChange={(e) => setReplyBccInput(e.target.value)}
                             onKeyDown={(e) => {
                               if (e.key === "Enter" && replyBccInput.trim()) {
                                 e.preventDefault();
                                 setReplyBcc(prev => [...prev, replyBccInput.trim()]);
                                 setReplyBccInput("");
                               }
                             }}
                             placeholder="Type Bcc and press Enter..."
                             className="text-xs bg-transparent border-none outline-none flex-1 min-w-[120px]"
                           />
                         </div>
                       </div>
                     )}

                     {/* Format Bar */}
                     <div className="bg-[#F7F7F7] h-[38px] rounded-[8px] flex items-center px-3 gap-2 sm:gap-3 overflow-x-auto min-w-0 relative">
                        <button 
                          type="button"
                          onClick={handleReplyUndo}
                          className="h-6 w-6 flex items-center justify-center text-[#A4ACAB] hover:text-[#203430] hover:bg-white rounded transition-colors shrink-0"
                          title="Undo"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={handleReplyRedo}
                          className="h-6 w-6 flex items-center justify-center text-[#A4ACAB] hover:text-[#203430] hover:bg-white rounded transition-colors shrink-0"
                          title="Redo"
                        >
                          <RotateCw className="h-4 w-4" />
                        </button>
                        <div className="w-px h-5 bg-[#E5E6E6] shrink-0" />

                        {/* Font Family Selector */}
                        <div className="relative shrink-0">
                          <button 
                            type="button"
                            onClick={() => setShowReplyFontMenu(!showReplyFontMenu)}
                            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white text-[12px] font-bold text-[#203430] transition-colors cursor-pointer"
                          >
                             <span>{replyFontFamily}</span>
                             <ChevronDown className="h-3 w-3" />
                          </button>
                          {showReplyFontMenu && (
                            <>
                              <div className="fixed inset-0 z-20" onClick={() => setShowReplyFontMenu(false)} />
                              <div className="absolute left-0 top-8 z-30 bg-white border border-[#E5E6E6] rounded-lg shadow-lg py-1 w-32 animate-in fade-in duration-100">
                                {["Sans Serif", "Serif", "Monospace", "Arial"].map(font => (
                                  <button
                                    key={font}
                                    type="button"
                                    onClick={() => {
                                      setReplyFontFamily(font);
                                      setShowReplyFontMenu(false);
                                    }}
                                    className={cn(
                                      "w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-slate-50",
                                      replyFontFamily === font ? "font-bold text-[#006b5f]" : "text-slate-700"
                                    )}
                                  >
                                    {font}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        <div className="w-px h-5 bg-[#E5E6E6] shrink-0" />

                        {/* Font Size Selector */}
                        <div className="relative shrink-0">
                          <button 
                            type="button"
                            onClick={() => setShowReplyFontSizeMenu(!showReplyFontSizeMenu)}
                            className="flex items-center gap-1 px-1.5 py-1 rounded hover:bg-white text-[12px] font-bold text-[#203430] transition-colors cursor-pointer"
                            title="Font Size"
                          >
                             <Type className="h-4 w-4" />
                             <span className="text-[11px] font-medium">{replyFontSize}</span>
                             <ChevronDown className="h-3 w-3" />
                          </button>
                          {showReplyFontSizeMenu && (
                            <>
                              <div className="fixed inset-0 z-20" onClick={() => setShowReplyFontSizeMenu(false)} />
                              <div className="absolute left-0 top-8 z-30 bg-white border border-[#E5E6E6] rounded-lg shadow-lg py-1 w-28 animate-in fade-in duration-100">
                                {["Small", "Normal", "Large", "Huge"].map(sz => (
                                  <button
                                    key={sz}
                                    type="button"
                                    onClick={() => {
                                      setReplyFontSize(sz);
                                      setShowReplyFontSizeMenu(false);
                                    }}
                                    className={cn(
                                      "w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-slate-50",
                                      replyFontSize === sz ? "font-bold text-[#006b5f]" : "text-slate-700"
                                    )}
                                  >
                                    {sz}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        <div className="w-px h-5 bg-[#E5E6E6] shrink-0" />

                        {/* Formatting Toggles */}
                        <div className="flex items-center gap-1 shrink-0">
                           <button 
                             type="button"
                             onClick={() => setIsReplyBold(!isReplyBold)}
                             className={cn(
                               "h-6 w-6 rounded flex items-center justify-center transition-colors cursor-pointer",
                               isReplyBold ? "bg-[#006b5f] text-white" : "text-[#203430] hover:bg-white"
                             )}
                             title="Bold"
                           >
                             <Bold className="h-3.5 w-3.5" />
                           </button>
                           <button 
                             type="button"
                             onClick={() => setIsReplyItalic(!isReplyItalic)}
                             className={cn(
                               "h-6 w-6 rounded flex items-center justify-center transition-colors cursor-pointer",
                               isReplyItalic ? "bg-[#006b5f] text-white" : "text-[#203430] hover:bg-white"
                             )}
                             title="Italic"
                           >
                             <Italic className="h-3.5 w-3.5" />
                           </button>
                           <button 
                             type="button"
                             onClick={() => setIsReplyUnderline(!isReplyUnderline)}
                             className={cn(
                               "h-6 w-6 rounded flex items-center justify-center transition-colors cursor-pointer",
                               isReplyUnderline ? "bg-[#006b5f] text-white" : "text-[#203430] hover:bg-white"
                             )}
                             title="Underline"
                           >
                             <Underline className="h-3.5 w-3.5" />
                           </button>
                        </div>

                        <div className="w-px h-5 bg-[#E5E6E6] shrink-0" />

                        {/* Alignment */}
                        <button 
                          type="button"
                          onClick={() => {
                            const next = replyTextAlign === "left" ? "center" : replyTextAlign === "center" ? "right" : "left";
                            setReplyTextAlign(next);
                            showToast(`Aligned ${next}`);
                          }}
                          className="h-6 w-6 rounded flex items-center justify-center text-[#203430] hover:bg-white transition-colors cursor-pointer shrink-0"
                          title={`Align: ${replyTextAlign}`}
                        >
                          {replyTextAlign === "center" ? (
                            <AlignCenter className="h-3.5 w-3.5" />
                          ) : replyTextAlign === "right" ? (
                            <AlignRight className="h-3.5 w-3.5" />
                          ) : (
                            <AlignLeft className="h-3.5 w-3.5" />
                          )}
                        </button>

                        {/* List bullets */}
                        <button 
                          type="button"
                          onClick={() => {
                            setReplyText(prev => prev + (prev.endsWith("\n") || !prev ? "• " : "\n• "));
                            replyInputRef.current?.focus();
                          }}
                          className="h-6 w-6 rounded flex items-center justify-center text-[#203430] hover:bg-white transition-colors cursor-pointer shrink-0"
                          title="Bullet list"
                        >
                          <ListOrdered className="h-3.5 w-3.5" />
                        </button>

                        <div className="w-px h-5 bg-[#E5E6E6] shrink-0" />

                        {/* Extended Format Menu */}
                        <div className="relative shrink-0">
                          <button 
                            type="button"
                            onClick={() => setShowReplyMoreFormat(!showReplyMoreFormat)}
                            className="h-6 w-6 rounded flex items-center justify-center text-[#203430] hover:bg-white transition-colors cursor-pointer"
                            title="More formatting"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                          {showReplyMoreFormat && (
                            <>
                              <div className="fixed inset-0 z-20" onClick={() => setShowReplyMoreFormat(false)} />
                              <div className="absolute right-0 top-8 z-30 bg-white border border-[#E5E6E6] rounded-lg shadow-lg py-1 w-36 animate-in fade-in duration-100 text-left">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplyText(prev => prev + "\n> ");
                                    setShowReplyMoreFormat(false);
                                    replyInputRef.current?.focus();
                                  }}
                                  className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Quote className="h-3 w-3" /> Quote
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplyText(prev => prev + "\n```\n// code snippet\n```\n");
                                    setShowReplyMoreFormat(false);
                                    replyInputRef.current?.focus();
                                  }}
                                  className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Code className="h-3 w-3" /> Code Block
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsReplyBold(false);
                                    setIsReplyItalic(false);
                                    setIsReplyUnderline(false);
                                    setReplyTextAlign("left");
                                    setReplyFontFamily("Sans Serif");
                                    setReplyFontSize("Normal");
                                    setShowReplyMoreFormat(false);
                                    showToast("Formatting cleared");
                                  }}
                                  className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50"
                                >
                                  Clear formatting
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                     </div>

                     {/* Textarea */}
                     <textarea 
                       ref={replyInputRef}
                       value={replyText}
                       onChange={(e) => {
                         const val = e.target.value;
                         setReplyText(val);
                         setReplyHistory(prev => [...prev.slice(0, replyHistoryIndex + 1), val]);
                         setReplyHistoryIndex(prev => prev + 1);
                       }}
                       placeholder={`Type your response to ${activeEmail.sender}...`} 
                       style={{
                         fontFamily: replyFontFamily === "Serif" ? "Georgia, serif" : replyFontFamily === "Monospace" ? "Courier New, monospace" : "inherit",
                         fontWeight: isReplyBold ? "bold" : "normal",
                         fontStyle: isReplyItalic ? "italic" : "normal",
                         textDecoration: isReplyUnderline ? "underline" : "none",
                         textAlign: replyTextAlign,
                         fontSize: replyFontSize === "Small" ? "12px" : replyFontSize === "Large" ? "16px" : replyFontSize === "Huge" ? "18px" : "14px",
                       }}
                       className="flex-1 w-full bg-transparent outline-none resize-none text-[#203430] placeholder:text-[#A4ACAB] min-h-[90px] leading-relaxed transition-all"
                     />

                     {/* Reply Attachments Preview */}
                     {replyAttachments.length > 0 && (
                       <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E5E6E6]/60">
                         {replyAttachments.map((att, aIdx) => (
                           <div key={att.id || aIdx} className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-2 text-xs">
                             <Paperclip className="h-3.5 w-3.5 text-[#006b5f]" />
                             <span className="font-medium text-slate-800 truncate max-w-[130px]">{att.name}</span>
                             <span className="text-[10px] text-slate-400">({att.size})</span>
                             <button
                               type="button"
                               onClick={() => setReplyAttachments(prev => prev.filter((_, i) => i !== aIdx))}
                               className="text-slate-400 hover:text-red-500 ml-1 cursor-pointer"
                             >
                               <X className="h-3 w-3" />
                             </button>
                           </div>
                         ))}
                       </div>
                     )}
                  </div>

                  {/* Bottom Send Bar */}
                  <div className="bg-[#F7F7F7] p-3 sm:p-4 flex items-center justify-between border-t border-[#E5E6E6] relative">
                     <div className="flex gap-3 sm:gap-4 items-center">
                        {/* Send Button Group */}
                        <div className="flex overflow-hidden rounded-[8px] shrink-0 shadow-2xs relative">
                           <button 
                             type="button"
                             disabled={replySendStatus !== "idle"}
                             onClick={handleSendMessage}
                             className={cn(
                               "px-3.5 py-1.5 text-[12px] font-bold flex items-center gap-2 transition-all cursor-pointer",
                               replySendStatus === "sending" && "bg-slate-400 text-white cursor-not-allowed",
                               replySendStatus === "sent" && "bg-[#006b5f] text-white",
                               replySendStatus === "idle" && "bg-brand hover:bg-[#005047] text-white"
                             )}
                           >
                              {replySendStatus === "sending" ? (
                                <>
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  <span>Sending...</span>
                                </>
                              ) : replySendStatus === "sent" ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Sent!</span>
                                </>
                              ) : (
                                <span>Send Message</span>
                              )}
                           </button>
                           <div className="w-px bg-white/20" />
                           <button 
                             type="button"
                             disabled={replySendStatus !== "idle"}
                             onClick={() => setShowReplyScheduleMenu(!showReplyScheduleMenu)}
                             className="bg-brand text-white px-2 py-1.5 flex items-center justify-center hover:bg-[#005047] transition-colors cursor-pointer"
                             title="Schedule Send"
                           >
                              <ChevronDown className="h-4 w-4" />
                           </button>

                           {/* Schedule Send Dropdown */}
                           {showReplyScheduleMenu && (
                             <>
                               <div className="fixed inset-0 z-20" onClick={() => setShowReplyScheduleMenu(false)} />
                               <div className="absolute left-0 bottom-11 z-30 bg-white border border-[#E5E6E6] rounded-xl shadow-xl py-2 w-56 animate-in fade-in zoom-in-95 duration-150 text-left">
                                 <div className="px-3 py-1.5 border-b border-[#E5E6E6] flex items-center gap-2 text-[11px] font-bold text-[#63716E] uppercase tracking-wider">
                                   <Clock className="h-3.5 w-3.5 text-[#006b5f]" /> Schedule Send
                                 </div>
                                 {[
                                   { label: "Tomorrow morning", time: "8:00 AM" },
                                   { label: "Tomorrow afternoon", time: "1:00 PM" },
                                   { label: "Monday morning", time: "8:00 AM" },
                                   { label: "Custom time...", time: "Select time" },
                                 ].map((item, idx) => (
                                   <button
                                     key={idx}
                                     type="button"
                                     onClick={() => {
                                       showToast(`Reply scheduled for ${item.label} (${item.time})`);
                                       setShowReplyScheduleMenu(false);
                                       setReplyText("");
                                       setReplyAttachments([]);
                                     }}
                                     className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs transition-colors cursor-pointer"
                                   >
                                     <span className="font-medium text-[#203430]">{item.label}</span>
                                     <span className="text-[10px] text-[#63716E]">{item.time}</span>
                                   </button>
                                 ))}
                               </div>
                             </>
                           )}
                        </div>

                        {/* Media and Emoji Actions */}
                        <div className="flex items-center gap-3 relative">
                           <button
                             type="button"
                             onClick={() => replyFileInputRef.current?.click()}
                             className="text-[#63716E] hover:text-[#006b5f] transition-colors cursor-pointer p-1 rounded hover:bg-white"
                             title="Attach File"
                           >
                             <Paperclip className="h-5 w-5 shrink-0" />
                           </button>
                           <button
                             type="button"
                             onClick={() => setShowReplyEmojiPicker(!showReplyEmojiPicker)}
                             className={cn(
                               "text-[#63716E] hover:text-[#006b5f] transition-colors cursor-pointer p-1 rounded hover:bg-white",
                               showReplyEmojiPicker && "text-[#006b5f] bg-white"
                             )}
                             title="Insert Emoji"
                           >
                             <Smile className="h-5 w-5 shrink-0" />
                           </button>
                           <button
                             type="button"
                             onClick={() => replyImageInputRef.current?.click()}
                             className="text-[#63716E] hover:text-[#006b5f] transition-colors cursor-pointer p-1 rounded hover:bg-white"
                             title="Attach Image"
                           >
                             <Image className="h-5 w-5 shrink-0" />
                           </button>

                           {/* Emoji Picker Popover */}
                           {showReplyEmojiPicker && (
                             <>
                               <div className="fixed inset-0 z-20" onClick={() => setShowReplyEmojiPicker(false)} />
                               <div className="absolute left-6 bottom-11 z-30 bg-white border border-[#E5E6E6] rounded-xl shadow-xl p-3 w-64 animate-in fade-in zoom-in-95 duration-150">
                                 <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E6E6]">
                                   <span className="text-[12px] font-bold text-[#203430]">Insert Emoji</span>
                                   <button 
                                     type="button"
                                     onClick={() => setShowReplyEmojiPicker(false)}
                                     className="text-[#63716E] hover:text-[#203430] p-0.5 rounded hover:bg-slate-100"
                                   >
                                     <X className="h-3.5 w-3.5" />
                                   </button>
                                 </div>
                                 <div className="grid grid-cols-6 gap-1.5 text-lg">
                                   {["👍", "🙌", "😊", "✅", "💼", "🚀", "❤️", "👏", "🎉", "📝", "📅", "🤝", "🔥", "💡", "⚡", "✨", "📌", "⭐"].map(emoji => (
                                     <button
                                       key={emoji}
                                       type="button"
                                       onClick={() => {
                                         setReplyText(prev => prev + emoji);
                                         setShowReplyEmojiPicker(false);
                                         replyInputRef.current?.focus();
                                       }}
                                       className="h-8 w-8 flex items-center justify-center hover:bg-slate-100 rounded cursor-pointer transition-colors"
                                     >
                                       {emoji}
                                     </button>
                                   ))}
                                 </div>
                               </div>
                             </>
                           )}
                        </div>
                     </div>

                     {/* Discard Draft Button */}
                     <button
                       type="button"
                       onClick={() => {
                         if (!replyText && replyAttachments.length === 0) return;
                         setReplyText("");
                         setReplyAttachments([]);
                         setShowReplyCc(false);
                         setShowReplyBcc(false);
                         setReplyCc([]);
                         setReplyBcc([]);
                         showToast("Draft response discarded");
                       }}
                       className="p-1.5 hover:bg-slate-200/60 rounded-lg shrink-0 transition-colors cursor-pointer"
                       title="Discard Response Draft"
                     >
                       <Trash2 className="h-4.5 w-4.5 text-[#63716E] hover:text-red-500 transition-colors shrink-0" />
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
      <input 
        type="file"
        id="compose-hidden-image-input"
        ref={composeImageInputRef}
        accept="image/*"
        onChange={handleComposeImageUpload}
        className="hidden"
        multiple
      />
      <input 
        type="file"
        id="reply-hidden-file-input"
        ref={replyFileInputRef}
        onChange={handleReplyFileUpload}
        className="hidden"
        multiple
      />
      <input 
        type="file"
        id="reply-hidden-image-input"
        ref={replyImageInputRef}
        accept="image/*"
        onChange={handleReplyFileUpload}
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
                  <h2 className="text-base font-bold text-[#191c1d] leading-none">
                    {composeModalMode === "reply" ? "Reply to Message" : composeModalMode === "forward" ? "Forward Message" : "New Message"}
                  </h2>
                  <p className="text-[11px] text-[#3d4946] font-medium uppercase tracking-wider mt-1">
                    {composeModalMode === "reply" ? "Direct Reply" : composeModalMode === "forward" ? "Forward Correspondence" : "Direct Message"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  id="compose-header-minimize"
                  onClick={() => {
                    setIsComposeOpen(false);
                    showToast("Draft minimized. Click New Message to resume.");
                  }}
                  className="text-[#3d4946] hover:bg-[#e7e8e9] hover:text-[#191c1d] h-10 w-10 rounded-xl transition-all flex items-center justify-center border-none bg-transparent cursor-pointer" 
                  title="Minimize"
                  type="button"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>
                <button 
                  id="compose-header-close"
                  onClick={() => handleCloseComposeModal(false)}
                  className="text-[#3d4946] hover:bg-red-50 hover:text-[#ba1a1a] h-10 w-10 rounded-xl transition-all flex items-center justify-center border-none bg-transparent cursor-pointer" 
                  title="Close & Discard"
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
              <div id="compose-recipient-block" className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <label id="compose-field-to" className="text-[13px] font-bold text-slate-500">To</label>
                  <div className="flex gap-3 text-[11px] font-semibold text-[#006b5f] uppercase tracking-wider select-none">
                    <button
                      type="button"
                      onClick={() => setShowCc(!showCc)}
                      className={cn(
                        "hover:underline border-none bg-transparent cursor-pointer font-bold transition-colors",
                        showCc ? "text-[#006b5f] underline" : "text-slate-500 hover:text-[#006b5f]"
                      )}
                    >
                      {showCc ? "— Hide Cc" : "+ Add Cc"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBcc(!showBcc)}
                      className={cn(
                        "hover:underline border-none bg-transparent cursor-pointer font-bold transition-colors",
                        showBcc ? "text-[#006b5f] underline" : "text-slate-500 hover:text-[#006b5f]"
                      )}
                    >
                      {showBcc ? "— Hide Bcc" : "+ Add Bcc"}
                    </button>
                  </div>
                </div>

                {/* To input field with chips */}
                <div className="flex flex-wrap items-center gap-2 p-2 border-b border-[#bbc9c5]/60 focus-within:border-[#006b5f] transition-all min-h-[48px]">
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
                        className="ml-1 opacity-60 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer"
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
                              className="w-full flex items-center gap-3 px-2.5 py-1.5 hover:bg-[#006b5f]/5 rounded-lg transition-colors text-left border-none bg-transparent cursor-pointer"
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

                {/* CC Input Row */}
                {showCc && (
                  <div className="space-y-1 pt-1 animate-in fade-in duration-150">
                    <label className="text-[12px] font-bold text-slate-500">Cc</label>
                    <div className="flex flex-wrap items-center gap-2 p-2 border-b border-[#bbc9c5]/60 focus-within:border-[#006b5f] transition-all min-h-[40px] bg-slate-50/50 rounded-lg">
                      {composeCc.map((rec, i) => (
                        <div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200 text-xs font-semibold text-slate-700">
                          <span>{rec.name}</span>
                          <button
                            type="button"
                            onClick={() => setComposeCc(prev => prev.filter((_, idx) => idx !== i))}
                            className="hover:text-red-500 border-none bg-transparent cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <input
                        type="text"
                        value={ccInput}
                        onChange={(e) => setCcInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && ccInput.trim()) {
                            setComposeCc(prev => [...prev, { name: ccInput.trim() }]);
                            setCcInput("");
                            showToast(`Added Cc: ${ccInput.trim()}`);
                          }
                        }}
                        placeholder="Type Cc recipient and press Enter..."
                        className="flex-1 min-w-[150px] bg-transparent border-none focus:ring-0 text-xs text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* BCC Input Row */}
                {showBcc && (
                  <div className="space-y-1 pt-1 animate-in fade-in duration-150">
                    <label className="text-[12px] font-bold text-slate-500">Bcc</label>
                    <div className="flex flex-wrap items-center gap-2 p-2 border-b border-[#bbc9c5]/60 focus-within:border-[#006b5f] transition-all min-h-[40px] bg-slate-50/50 rounded-lg">
                      {composeBcc.map((rec, i) => (
                        <div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200 text-xs font-semibold text-slate-700">
                          <span>{rec.name}</span>
                          <button
                            type="button"
                            onClick={() => setComposeBcc(prev => prev.filter((_, idx) => idx !== i))}
                            className="hover:text-red-500 border-none bg-transparent cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <input
                        type="text"
                        value={bccInput}
                        onChange={(e) => setBccInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && bccInput.trim()) {
                            setComposeBcc(prev => [...prev, { name: bccInput.trim() }]);
                            setBccInput("");
                            showToast(`Added Bcc: ${bccInput.trim()}`);
                          }
                        }}
                        placeholder="Type Bcc recipient and press Enter..."
                        className="flex-1 min-w-[150px] bg-transparent border-none focus:ring-0 text-xs text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Subject Row */}
              <div id="compose-subject-block" className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label id="compose-field-subject" className="text-[13px] font-bold text-slate-500">Subject</label>
                  {isHighPriority && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertOctagon className="h-3 w-3" /> High Priority
                    </span>
                  )}
                </div>
                <input 
                  type="text"
                  id="compose-subject-input"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full py-2 border-b border-[#bbc9c5]/60 focus:border-[#006b5f] focus:ring-0 bg-transparent outline-none transition-all text-sm font-bold text-[#191c1d]" 
                  placeholder="Enter subject..." 
                />
              </div>

              {/* Advanced Editor Window with Custom Rich Formatting Bar - Matching Inline Reply */}
              <div id="compose-editor-box" className="border border-[#bbc9c5]/50 rounded-xl overflow-hidden flex flex-col bg-white ring-1 ring-black/5 shadow-2xs">
                {/* Formatting Bar */}
                <div className="bg-[#F7F7F7] h-[38px] border-b border-[#E5E6E6] flex items-center px-3 gap-2 sm:gap-3 overflow-x-auto min-w-0 relative">
                  <button 
                    type="button"
                    onClick={handleComposeUndo}
                    className="h-6 w-6 flex items-center justify-center text-[#A4ACAB] hover:text-[#203430] hover:bg-white rounded transition-colors shrink-0 cursor-pointer"
                    title="Undo"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={handleComposeRedo}
                    className="h-6 w-6 flex items-center justify-center text-[#A4ACAB] hover:text-[#203430] hover:bg-white rounded transition-colors shrink-0 cursor-pointer"
                    title="Redo"
                  >
                    <RotateCw className="h-4 w-4" />
                  </button>
                  <div className="w-px h-5 bg-[#E5E6E6] shrink-0" />

                  {/* Font Family Selector */}
                  <div className="relative shrink-0">
                    <button 
                      type="button"
                      onClick={() => setShowComposeFontMenu(!showComposeFontMenu)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white text-[12px] font-bold text-[#203430] transition-colors cursor-pointer"
                    >
                      <span>{composeFontFamily}</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    {showComposeFontMenu && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setShowComposeFontMenu(false)} />
                        <div className="absolute left-0 top-8 z-30 bg-white border border-[#E5E6E6] rounded-lg shadow-lg py-1 w-32 animate-in fade-in duration-100">
                          {["Sans Serif", "Serif", "Monospace", "Arial"].map(font => (
                            <button
                              key={font}
                              type="button"
                              onClick={() => {
                                setComposeFontFamily(font);
                                setShowComposeFontMenu(false);
                              }}
                              className={cn(
                                "w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-slate-50 cursor-pointer",
                                composeFontFamily === font ? "font-bold text-[#006b5f]" : "text-slate-700"
                              )}
                            >
                              {font}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="w-px h-5 bg-[#E5E6E6] shrink-0" />

                  {/* Font Size Selector */}
                  <div className="relative shrink-0">
                    <button 
                      type="button"
                      onClick={() => setShowComposeFontSizeMenu(!showComposeFontSizeMenu)}
                      className="flex items-center gap-1 px-1.5 py-1 rounded hover:bg-white text-[12px] font-bold text-[#203430] transition-colors cursor-pointer"
                      title="Font Size"
                    >
                      <Type className="h-4 w-4" />
                      <span className="text-[11px] font-medium">{composeFontSize}</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    {showComposeFontSizeMenu && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setShowComposeFontSizeMenu(false)} />
                        <div className="absolute left-0 top-8 z-30 bg-white border border-[#E5E6E6] rounded-lg shadow-lg py-1 w-28 animate-in fade-in duration-100">
                          {["Small", "Normal", "Large", "Huge"].map(sz => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => {
                                setComposeFontSize(sz);
                                setShowComposeFontSizeMenu(false);
                              }}
                              className={cn(
                                "w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-slate-50 cursor-pointer",
                                composeFontSize === sz ? "font-bold text-[#006b5f]" : "text-slate-700"
                              )}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="w-px h-5 bg-[#E5E6E6] shrink-0" />

                  {/* Formatting Toggles */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      type="button"
                      onClick={() => setIsBold(!isBold)}
                      className={cn(
                        "h-6 w-6 rounded flex items-center justify-center transition-colors cursor-pointer",
                        isBold ? "bg-[#006b5f] text-white" : "text-[#203430] hover:bg-white"
                      )}
                      title="Bold"
                    >
                      <Bold className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsItalic(!isItalic)}
                      className={cn(
                        "h-6 w-6 rounded flex items-center justify-center transition-colors cursor-pointer",
                        isItalic ? "bg-[#006b5f] text-white" : "text-[#203430] hover:bg-white"
                      )}
                      title="Italic"
                    >
                      <Italic className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsUnderline(!isUnderline)}
                      className={cn(
                        "h-6 w-6 rounded flex items-center justify-center transition-colors cursor-pointer",
                        isUnderline ? "bg-[#006b5f] text-white" : "text-[#203430] hover:bg-white"
                      )}
                      title="Underline"
                    >
                      <Underline className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="w-px h-5 bg-[#E5E6E6] shrink-0" />

                  {/* Alignment */}
                  <button 
                    type="button"
                    onClick={() => {
                      const next = textAlign === "left" ? "center" : textAlign === "center" ? "right" : "left";
                      setTextAlign(next);
                      showToast(`Aligned ${next}`);
                    }}
                    className="h-6 w-6 rounded flex items-center justify-center text-[#203430] hover:bg-white transition-colors cursor-pointer shrink-0"
                    title={`Align: ${textAlign}`}
                  >
                    {textAlign === "center" ? (
                      <AlignCenter className="h-3.5 w-3.5" />
                    ) : textAlign === "right" ? (
                      <AlignRight className="h-3.5 w-3.5" />
                    ) : (
                      <AlignLeft className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {/* List bullets */}
                  <button 
                    type="button"
                    onClick={() => {
                      setComposeBody(prev => prev + (prev.endsWith("\n") || !prev ? "• " : "\n• "));
                    }}
                    className="h-6 w-6 rounded flex items-center justify-center text-[#203430] hover:bg-white transition-colors cursor-pointer shrink-0"
                    title="Bullet list"
                  >
                    <ListOrdered className="h-3.5 w-3.5" />
                  </button>

                  <div className="w-px h-5 bg-[#E5E6E6] shrink-0" />

                  {/* Extended Format Menu */}
                  <div className="relative shrink-0">
                    <button 
                      type="button"
                      onClick={() => setShowMoreFormatMenu(!showMoreFormatMenu)}
                      className="h-6 w-6 rounded flex items-center justify-center text-[#203430] hover:bg-white transition-colors cursor-pointer"
                      title="More formatting"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    {showMoreFormatMenu && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setShowMoreFormatMenu(false)} />
                        <div className="absolute right-0 top-8 z-30 bg-white border border-[#E5E6E6] rounded-lg shadow-lg py-1 w-44 animate-in fade-in duration-100 text-left">
                          <button
                            type="button"
                            onClick={() => {
                              setComposeBody(prev => prev + "\n> ");
                              setShowMoreFormatMenu(false);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Quote className="h-3 w-3" /> Quote
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setComposeBody(prev => prev + "\n```\n// code snippet\n```\n");
                              setShowMoreFormatMenu(false);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Code className="h-3 w-3" /> Code Block
                          </button>
                          <div className="px-3 py-1.5 border-t border-slate-100">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Color</span>
                            <div className="flex gap-1.5">
                              {["#203430", "#006b5f", "#ba1a1a", "#d97706", "#2563eb", "#7c3aed"].map(col => (
                                <button
                                  key={col}
                                  type="button"
                                  onClick={() => {
                                    setSelectedTextColor(col);
                                    setShowMoreFormatMenu(false);
                                  }}
                                  className="h-4 w-4 rounded-full border border-slate-200 cursor-pointer hover:scale-110"
                                  style={{ backgroundColor: col }}
                                />
                              ))}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setIsBold(false);
                              setIsItalic(false);
                              setIsUnderline(false);
                              setTextAlign("left");
                              setComposeFontFamily("Sans Serif");
                              setComposeFontSize("Normal");
                              setSelectedTextColor("#203430");
                              setShowMoreFormatMenu(false);
                              showToast("Formatting cleared");
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 border-t border-slate-100 cursor-pointer"
                          >
                            Clear formatting
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Body Canvas Textarea */}
                <textarea 
                  id="compose-body-textarea"
                  value={composeBody}
                  onChange={(e) => {
                    const val = e.target.value;
                    setComposeBody(val);
                    setComposeHistory(prev => [...prev.slice(0, composeHistoryIndex + 1), val]);
                    setComposeHistoryIndex(prev => prev + 1);
                  }}
                  style={{
                    fontFamily: composeFontFamily === "Serif" ? "Georgia, serif" : composeFontFamily === "Monospace" ? "Courier New, monospace" : "inherit",
                    fontSize: composeFontSize === "Small" ? "12px" : composeFontSize === "Large" ? "16px" : composeFontSize === "Huge" ? "18px" : "14px",
                    fontWeight: isBold ? "bold" : "normal",
                    fontStyle: isItalic ? "italic" : "normal",
                    textDecoration: isUnderline ? "underline" : "none",
                    textAlign: textAlign,
                    color: selectedTextColor
                  }}
                  className="w-full h-36 md:h-44 p-4 bg-white text-xs leading-relaxed border-none focus:ring-0 resize-none placeholder:text-[#bbc9c5] tracking-wide outline-none" 
                  placeholder="Write your message here..."
                />
              </div>

              {/* Attachments List */}
              {composeAttachments.length > 0 && (
                <div id="compose-attachments-list" className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-bold text-[#191c1d]/75">Attachments ({composeAttachments.length})</label>
                    <button 
                      id="compose-add-attachment-btn"
                      onClick={() => composeFileInputRef.current?.click()}
                      className="text-xs font-semibold text-[#006b5f] hover:text-[#004941] transition-colors flex items-center gap-1 border-none bg-transparent outline-none cursor-pointer"
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
                          <div className="size-9 bg-red-50 text-red-500 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs">
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
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-7 w-7 rounded-lg flex items-center justify-center transition-all border-none bg-transparent cursor-pointer"
                          type="button"
                          title="Remove attachment"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer - Matching Inline Reply Styling */}
            <footer 
              id="compose-modal-footer"
              className="bg-[#F7F7F7] p-3 sm:p-4 flex items-center justify-between border-t border-[#E5E6E6] relative rounded-b-2xl shrink-0"
            >
              <div className="flex gap-3 sm:gap-4 items-center">
                {/* Send Button Group */}
                <div className="flex overflow-hidden rounded-[8px] shrink-0 shadow-2xs relative">
                  <button 
                    id="compose-action-send"
                    type="button"
                    disabled={composeSendStatus !== "idle"}
                    onClick={handleComposeSend}
                    className={cn(
                      "px-3.5 py-1.5 text-[12px] font-bold flex items-center gap-2 transition-all cursor-pointer select-none",
                      composeSendStatus === "sending" && "bg-slate-400 text-white cursor-not-allowed",
                      composeSendStatus === "sent" && "bg-[#006b5f] text-white",
                      composeSendStatus === "idle" && "bg-brand hover:bg-[#005047] text-white"
                    )}
                  >
                    {composeSendStatus === "sending" ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : composeSendStatus === "sent" ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Sent!</span>
                      </>
                    ) : (
                      <span>Send Message</span>
                    )}
                  </button>
                  <div className="w-px bg-white/20" />
                  <button 
                    type="button"
                    disabled={composeSendStatus !== "idle"}
                    onClick={() => setShowScheduleMenu(!showScheduleMenu)}
                    className="bg-brand text-white px-2 py-1.5 flex items-center justify-center hover:bg-[#005047] transition-colors cursor-pointer"
                    title="Schedule Send"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* Schedule Send Dropdown */}
                  {showScheduleMenu && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setShowScheduleMenu(false)} />
                      <div className="absolute left-0 bottom-11 z-30 bg-white border border-[#E5E6E6] rounded-xl shadow-xl py-2 w-56 animate-in fade-in zoom-in-95 duration-150 text-left">
                        <div className="px-3 py-1.5 border-b border-[#E5E6E6] flex items-center gap-2 text-[11px] font-bold text-[#63716E] uppercase tracking-wider">
                          <Clock className="h-3.5 w-3.5 text-[#006b5f]" /> Schedule Send
                        </div>
                        {[
                          { label: "Tomorrow morning", time: "8:00 AM" },
                          { label: "Tomorrow afternoon", time: "1:00 PM" },
                          { label: "Monday morning", time: "8:00 AM" },
                          { label: "Custom time...", time: "Select time" },
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              showToast(`Message scheduled for ${item.label} (${item.time})`);
                              setShowScheduleMenu(false);
                              handleCloseComposeModal(false);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs transition-colors cursor-pointer"
                          >
                            <span className="font-medium text-[#203430]">{item.label}</span>
                            <span className="text-[10px] text-[#63716E]">{item.time}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Media and Emoji Actions */}
                <div className="flex items-center gap-3 relative">
                  <button
                    id="compose-attach-bottom"
                    type="button"
                    onClick={() => composeFileInputRef.current?.click()}
                    className="text-[#63716E] hover:text-[#006b5f] transition-colors cursor-pointer p-1 rounded hover:bg-white"
                    title="Attach File"
                  >
                    <Paperclip className="h-5 w-5 shrink-0" />
                  </button>
                  <button
                    id="compose-emoji-bottom"
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={cn(
                      "text-[#63716E] hover:text-[#006b5f] transition-colors cursor-pointer p-1 rounded hover:bg-white",
                      showEmojiPicker && "text-[#006b5f] bg-white"
                    )}
                    title="Insert Emoji"
                  >
                    <Smile className="h-5 w-5 shrink-0" />
                  </button>
                  <button
                    id="compose-image-bottom"
                    type="button"
                    onClick={() => composeImageInputRef.current?.click()}
                    className="text-[#63716E] hover:text-[#006b5f] transition-colors cursor-pointer p-1 rounded hover:bg-white"
                    title="Attach Image"
                  >
                    <Image className="h-5 w-5 shrink-0" />
                  </button>

                  {/* More Options */}
                  <div className="relative">
                    <button
                      id="compose-options-bottom"
                      type="button"
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      className={cn(
                        "text-[#63716E] hover:text-[#006b5f] transition-colors cursor-pointer p-1 rounded hover:bg-white",
                        showMoreOptions && "text-[#006b5f] bg-white"
                      )}
                      title="More options"
                    >
                      <MoreVertical className="h-5 w-5 shrink-0" />
                    </button>

                    {showMoreOptions && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setShowMoreOptions(false)} />
                        <div className="absolute left-0 bottom-11 z-30 bg-white border border-[#E5E6E6] rounded-xl shadow-xl py-1.5 min-w-[200px] animate-in fade-in duration-100 text-left">
                          <button
                            type="button"
                            onClick={() => {
                              setIsHighPriority(!isHighPriority);
                              setShowMoreOptions(false);
                              showToast(isHighPriority ? "Priority normalized" : "Flagged as High Priority");
                            }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#203430] hover:bg-[#F8FCF3] hover:text-[#006b5f] border-none bg-transparent cursor-pointer transition-colors"
                          >
                            <AlertOctagon className="h-4 w-4 text-[#006b5f]" />
                            <span>{isHighPriority ? "Remove High Priority" : "Mark High Priority"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowMoreOptions(false);
                              handleSaveAsDraft();
                            }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#203430] hover:bg-[#F8FCF3] hover:text-[#006b5f] border-none bg-transparent cursor-pointer transition-colors"
                          >
                            <FileText className="h-4 w-4 text-[#006b5f]" />
                            <span>Save as Draft</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowMoreOptions(false);
                              setComposeBody(prev => prev + "\n\nBest regards,\nTeamHub HR Operations");
                              showToast("Inserted team signature");
                            }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#203430] hover:bg-[#F8FCF3] hover:text-[#006b5f] border-none bg-transparent cursor-pointer transition-colors"
                          >
                            <Users className="h-4 w-4 text-[#006b5f]" />
                            <span>Insert Team Signature</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Emoji Picker Popover */}
                  {showEmojiPicker && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setShowEmojiPicker(false)} />
                      <div className="absolute left-6 bottom-11 z-30 bg-white border border-[#E5E6E6] rounded-xl shadow-xl p-3 w-64 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E6E6]">
                          <span className="text-[12px] font-bold text-[#203430]">Insert Emoji</span>
                          <button 
                            type="button"
                            onClick={() => setShowEmojiPicker(false)}
                            className="text-[#63716E] hover:text-[#203430] p-0.5 rounded hover:bg-slate-100 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-6 gap-1.5 text-lg">
                          {["👍", "🙌", "😊", "✅", "💼", "🚀", "❤️", "👏", "🎉", "📝", "📅", "🤝", "🔥", "💡", "⚡", "✨", "📌", "⭐"].map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setComposeBody(prev => prev + emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="h-8 w-8 flex items-center justify-center hover:bg-slate-100 rounded cursor-pointer transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Discard Draft Button */}
              <button
                id="compose-action-discard"
                type="button"
                onClick={() => handleCloseComposeModal(true)}
                className="p-1.5 hover:bg-slate-200/60 rounded-lg shrink-0 transition-colors cursor-pointer"
                title="Discard Draft"
              >
                <Trash2 className="h-4.5 w-4.5 text-[#63716E] hover:text-red-500 transition-colors shrink-0" />
              </button>
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
