import * as React from "react"
import { useState } from "react"
import { AppLayout } from "../components/layout/AppLayout"
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Archive, 
  ChevronRight, 
  Search, 
  Calendar, 
  ShieldAlert, 
  SlidersHorizontal,
  Info,
  Sliders,
  DollarSign, 
  FileText, 
  Settings, 
  Sparkles,
  ArrowRight,
  User,
  ExternalLink,
  ChevronDown
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

/*
NotificationItem JSON Data Format Requirement:
----------------------------------------------
The Notification Center expects an array of alert feeds in the following JSON format.
You can read/write this array to and from the local storage under "db_notifications".

[
  {
    "id": "1",                                         // Unique identifier string
    "title": "October Payslips are now available",     // Header title string of the alert
    "description": "All employee payslips processed.",  // Context details string
    "category": "payroll",                             // Folder category: "payroll" | "requests" | "system" | "billing"
    "time": "2h ago",                                  // Relative human-readable timestamp
    "unread": true,                                    // Boolean state of whether the alert is unread
    "actionText": "View Payslip",                      // Optional text string for call-to-action button
    "iconType": "payroll",                             // Graphic selection enum: "payroll" | "system" | "billing" | "document"
    "avatar": "https://example.com/photo.jpg"          // Optional external profile avatar photo card
  }
]
*/

// Types of notifications used in our HR portal
export interface NotificationItem {
  id: string
  title: string
  description: string
  category: "payroll" | "requests" | "system" | "billing"
  time: string
  unread: boolean
  actionText?: string
  avatar?: string
  iconType?: "payroll" | "system" | "billing" | "document"
}

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "October Payslips are now available",
    description: "All employee payslips for the month of October have been successfully processed and are ready for distribution.",
    category: "payroll",
    time: "2h ago",
    unread: true,
    actionText: "View Payslip",
    iconType: "payroll"
  },
  {
    id: "2",
    title: "Leave Request: Sarah Jenkins",
    description: "Sarah Jenkins has submitted a request for 3 days of annual leave starting November 15th.",
    category: "requests",
    time: "5h ago",
    unread: true,
    actionText: "Review Request",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjQ7rJMF4E2sH0pjYqjjK7gkYlczMjC7pV-7EBlLdEzkPozxtstmQMn2NaKrfRoSCHutk38sA5F_OsAWzOHC0aQrHzc3k4Wpj0FdBPUzJcFONLNlp8eFGv6PsAtww-L7LzczZ_6hakrxuA1QvS-Lg9lOP4qO4qVk0Lv-BbifUGQgs4922Smcnc_0kqoabzM9MtwoqVrltQ0iAkRiYXVbNIoHC6t_aJUD4bv-zu9f9p1YLp6nrnivjQb2H4MWhUPknViNzl5NRlurA"
  },
  {
    id: "3",
    title: "System Maintenance Complete",
    description: "Scheduled database optimization has been completed successfully. No downtime was experienced.",
    category: "system",
    time: "Yesterday",
    unread: false,
    actionText: "View Logs",
    iconType: "system"
  },
  {
    id: "4",
    title: "Contract Renewal: David Miller",
    description: "The employment contract for David Miller has been successfully renewed and signed by all parties.",
    category: "requests",
    time: "Oct 24, 2:15 PM",
    unread: true,
    actionText: "View Document",
    iconType: "document"
  },
  {
    id: "5",
    title: "API Timeout Alert",
    description: "Intermittent API timeout warning detected in the main external CRM integrations module.",
    category: "system",
    time: "Oct 23, 10:44 AM",
    unread: true,
    actionText: "Check Logs",
    iconType: "system"
  },
  {
    id: "6",
    title: "Organization billing renewed",
    description: "Your modern enterprise subscription was commercialized automatically for the upcoming quarter.",
    category: "billing",
    time: "Oct 22, 9:00 AM",
    unread: false,
    iconType: "billing"
  }
];

export default function NotificationsPage() {
  // Empty states applied by default. Initialized to empty array.
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem("db_notifications");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        // Fallback
      }
    }
    return []; // Satisfy empty state by default
  });

  // Automatically save state updates and broadcast reload events
  React.useEffect(() => {
    localStorage.setItem("db_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Synchronize state values from other tabs or actions
  React.useEffect(() => {
    const handleStorageUpdate = () => {
      const saved = localStorage.getItem("db_notifications");
      if (saved) {
        try {
          setNotifications(JSON.parse(saved));
        } catch (e) {}
      }
    };
    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("db_updated", handleStorageUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("db_updated", handleStorageUpdate);
    };
  }, []);

  // Selected notifications for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Category selection filter ('all', 'payroll', 'requests', 'system')
  const [activeCategory, setActiveCategory] = useState<"all" | "payroll" | "requests" | "system">("all")

  // Search keyword input
  const [searchQuery, setSearchQuery] = useState("")

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Quick settings toggles inside the right sidebar
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [desktopPopups, setDesktopPopups] = useState(false)

  // Helper to trigger floating action feedback toast
  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Filter logic based on Category tabs + Search Query
  const filteredNotifications = notifications.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory
    const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesQuery
  })

  // Checkbox interactions
  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const visibleIds = filteredNotifications.map(n => n.id)
      setSelectedIds(visibleIds)
    } else {
      setSelectedIds([])
    }
  }

  // Action methods
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, unread: false })))
    showToast("All notifications successfully marked as read")
  }

  const handleSingleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(item => item.id === id ? { ...item, unread: false } : item))
    showToast("Notification marked as read")
  }

  const handleBulkArchive = () => {
    if (selectedIds.length === 0) return
    setNotifications(prev => prev.filter(item => !selectedIds.includes(item.id)))
    setSelectedIds([])
    showToast("Selected items archived successfully")
  }

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return
    setNotifications(prev => prev.filter(item => !selectedIds.includes(item.id)))
    setSelectedIds([])
    showToast("Selected items deleted permanently")
  }

  const handleActionClick = (title: string) => {
    showToast(`Redirecting to action center for: "${title}"`)
  }

  const handleSetArchivingRules = () => {
    showToast("Smart automation criteria applied successfully!")
  }

  return (
    <AppLayout 
      title="Notification Center" 
      breadcrumbs={[
        { label: "Dashboard", href: "/" }, 
        { label: "Notification Center" }
      ]}
    >
      {/* Visual Workspace Canvas */}
      <div className="mx-auto w-full max-w-[1600px] font-sans pb-20 animate-fade-in duration-200">
        
        {/* Floating Success Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              className="fixed top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-white rounded-full px-6 py-3.5 flex items-center gap-3 shadow-2xl z-[1000]"
            >
              <div className="w-5 h-5 rounded-full bg-[#006b5f] flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 text-white" />
              </div>
              <p className="text-xs sm:text-sm font-semibold tracking-wide">{toastMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer Layout Grid */}
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          
          {/* LEFT COLUMN: Notification List & Advanced Filters (col-span-8 equivalent) */}
          <section className="flex-1 w-full space-y-6">
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-3xs">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Bell className="h-5.5 w-5.5 text-[#006b5f]" />
                  Alert Feeds
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Monitor, filter, and execute action workflows on all team workspace parameters
                </p>
              </div>
              
              <button 
                type="button"
                onClick={handleMarkAllAsRead}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#006b5f] text-white hover:bg-[#005047] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-97"
              >
                <CheckCheck className="h-4.5 w-4.5" />
                <span>Mark all as read</span>
              </button>
            </div>

            {/* Advanced Filters Bar */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-3xs flex flex-col md:flex-row items-center gap-4">
              
              {/* Category tabs */}
              <div className="flex p-1 bg-slate-50 border border-slate-100 rounded-xl w-full md:w-auto shrink-0 space-x-1">
                <button
                  type="button"
                  onClick={() => { setActiveCategory("all"); setSelectedIds([]); }}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === "all" ? "bg-white text-[#006b5f] shadow-2xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveCategory("payroll"); setSelectedIds([]); }}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === "payroll" ? "bg-white text-[#006b5f] shadow-2xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Payroll
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveCategory("requests"); setSelectedIds([]); }}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === "requests" ? "bg-white text-[#006b5f] shadow-2xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Requests
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveCategory("system"); setSelectedIds([]); }}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === "system" ? "bg-white text-[#006b5f] shadow-2xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  System
                </button>
              </div>

              {/* Spacer divider */}
              <div className="hidden md:block h-6 w-px bg-slate-100" />

              {/* Date Filter Simulator */}
              <button 
                type="button"
                onClick={() => showToast("Adjusting custom timeframe metrics")}
                className="flex items-center gap-2 px-3.5 py-2 border border-slate-150 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-all text-xs font-bold cursor-pointer shrink-0 w-full md:w-auto justify-center"
              >
                <Calendar className="h-4 w-4 text-slate-450 text-slate-400" />
                <span>Oct 20 - Oct 27</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* Search text input */}
              <div className="relative w-full flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Filter by title, keywords or employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50/50 pl-10 pr-4 py-2 border border-slate-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#006b5f]/40 outline-none transition-all"
                />
              </div>

            </div>

            {/* Bulk Actions Console */}
            <div className="flex items-center gap-4 bg-white border border-slate-100 px-5 py-3 rounded-2xl w-fit shadow-4xs text-xs font-bold">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="selectAll"
                  onChange={handleSelectAll}
                  checked={filteredNotifications.length > 0 && selectedIds.length === filteredNotifications.length}
                  className="w-4 h-4 rounded border-slate-300 text-[#006b5f] focus:ring-[#006b5f]" 
                />
                <label htmlFor="selectAll" className="text-slate-500 uppercase tracking-wide text-[10px] cursor-pointer">
                  Select All
                </label>
              </div>

              {selectedIds.length > 0 && (
                <>
                  <div className="h-4 w-px bg-slate-100" />
                  
                  <span className="text-slate-400 font-semibold">{selectedIds.length} chosen</span>
                  
                  <button 
                    type="button"
                    onClick={handleBulkArchive}
                    className="text-slate-600 hover:text-[#006b5f] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Archive className="h-4 w-4" />
                    <span>Archive</span>
                  </button>

                  <button 
                    type="button"
                    onClick={handleBulkDelete}
                    className="text-slate-600 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>

            {/* Notifications Feed list structure */}
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[350px]">
                  <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[#006b5f] shadow-3xs">
                    <Bell className="h-6 w-6" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h4 className="font-bold text-slate-800 text-base">No notifications found</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {notifications.length === 0 
                        ? "Your Alert Feed is pristine. No pending security reports, payroll workflows, or leave requests require attention."
                        : "No notifications match your current category selection or search parameters."}
                    </p>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory("all");
                        setSearchQuery("");
                      }}
                      className="px-4 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Clear Active Filters
                    </button>
                  )}
                </div>
              ) : (
                filteredNotifications.map((item) => (
                  <div 
                    key={item.id}
                    className={`bg-white border hover:border-[#006b5f]/30 rounded-2xl p-5 flex gap-4 transition-all shadow-4xs group relative items-start ${
                      item.unread ? "border-[#006b5f]/20 bg-[#d4e7d8]/5" : "border-slate-100 opacity-92"
                    }`}
                  >
                    {/* Item Checkbox */}
                    <div className="pt-1 select-none shrink-0">
                      <input 
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelectOne(item.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[#006b5f] focus:ring-[#006b5f] cursor-pointer"
                      />
                    </div>

                    {/* Left Icon Panel Category Visualizer */}
                    <div className="shrink-0 mt-0.5">
                      {item.avatar ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#d4e7d8]/40 shadow-2xs">
                          <img src={item.avatar} alt="User headshot" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          item.unread 
                            ? "bg-[#006b5f]/10 text-[#006b5f]" 
                            : "bg-slate-100 text-slate-400"
                        }`}>
                          {item.iconType === "payroll" && <DollarSign className="h-5 w-5" />}
                          {item.iconType === "system" && <ShieldAlert className="h-5 w-5" />}
                          {item.iconType === "billing" && <Settings className="h-5 w-5" />}
                          {item.iconType === "document" && <FileText className="h-5 w-5" />}
                          {!item.iconType && <Bell className="h-5 w-5" />}
                        </div>
                      )}
                    </div>

                    {/* Core Content Body */}
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className={`text-sm tracking-tight ${item.unread ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                              {item.category}
                            </span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="text-[10px] font-semibold text-slate-400">{item.time}</span>
                          </div>
                        </div>

                        {/* Unread circle element */}
                        <div className="flex items-center gap-2">
                          {item.unread && (
                            <div className="w-2 h-2 bg-[#006b5f] rounded-full shrink-0 animate-pulse" />
                          )}
                          
                          {/* Quick single dismiss check button */}
                          {item.unread && (
                            <button 
                              type="button"
                              onClick={() => handleSingleMarkAsRead(item.id)}
                              title="Mark as read"
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-50 text-slate-400 hover:text-[#006b5f] rounded-lg transition-all cursor-pointer"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
                        {item.description}
                      </p>

                      {/* Explicit CTA Actions matching screen logic */}
                      {item.actionText && (
                        <div className="flex gap-2 pt-1 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleActionClick(item.title)}
                            className="px-3.5 py-1.5 bg-[#006b5f] hover:bg-[#005047] text-white rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>{item.actionText}</span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSingleMarkAsRead(item.id)}
                            className="px-3.5 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Load More simulator */}
            <div className="pt-2 text-center">
              <button 
                type="button"
                onClick={() => showToast("Older notifications cached successfully in local browser records!")}
                className="text-[#006b5f] font-extrabold text-xs tracking-wider uppercase hover:underline py-4 inline-block cursor-pointer"
              >
                Load more notifications
              </button>
            </div>

          </section>

          {/* RIGHT SIDEBAR: Important alerts & quick toggles (col-span-4 equivalent) */}
          <aside className="w-full xl:w-[340px] shrink-0 space-y-6">
            
            {/* Critical Alerts Console (Important Alerts Section) */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-3xs space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-[#006b5f] shrink-0" />
                <span>Important Alerts</span>
              </h3>

              <div className="space-y-4">
                
                {/* Bug Warning Alert */}
                <div className="p-4 bg-[#d4e7d8]/30 border border-[#b8cbbd] border-l-[4px] border-l-[#006b5f] text-slate-850 rounded-xl shadow-3xs space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Info className="h-4.5 w-4.5 text-[#006b5f] shrink-0" />
                    <span className="font-bold text-xs tracking-tight text-[#0f1f16]">Critical Bug Detected</span>
                  </div>
                  <p className="text-[11px] text-[#57685d] font-bold leading-relaxed">
                    API integration latency bottleneck identified on secure outgoing cycles. Corrective updates are targeted currently.
                  </p>
                  <button 
                    type="button"
                    onClick={() => showToast("Dedicated enterprise support ticket generated automatically!")}
                    className="w-full py-2 bg-[#006b5f] hover:bg-[#005047] text-white rounded-lg font-bold text-[11px] tracking-wide uppercase transition-all shadow-sm shadow-[#006b5f]/10 cursor-pointer text-center"
                  >
                    Contact Tech Support
                  </button>
                </div>

                {/* Profile alert */}
                <div className="p-4 bg-[#e8e2d4]/50 text-slate-800 rounded-xl border-l-[4px] border-[#cbc6b9] shadow-3xs space-y-1.5 border border-slate-100">
                  <div className="flex items-center gap-2 text-[#49473d]">
                    <Sliders className="h-4.5 w-4.5 shrink-0" />
                    <span className="font-bold text-xs">Profile Incomplete</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    Personal telephone verification requires parameters completion prior to enabling critical SMS backup.
                  </p>
                </div>

              </div>
            </div>

            {/* Notification Toggles Console */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-3xs space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-[#006b5f] shrink-0" />
                <span>Notification Toggles</span>
              </h3>

              <div className="space-y-4 pt-1">
                {/* Email Toggles */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Email Alerts</span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-normal mt-0.5">Daily summary & important digests</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => { setEmailAlerts(!emailAlerts); showToast(`Email alerts toggled ${!emailAlerts ? "ON" : "OFF"}`); }}
                    className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailAlerts ? "bg-[#006b5f]" : "bg-slate-200"}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${emailAlerts ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>

                {/* Push Toggle */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Push Notifications</span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-normal mt-0.5">Real-time team tags & messages</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => { setPushNotifications(!pushNotifications); showToast(`Push notifications toggled ${!pushNotifications ? "ON" : "OFF"}`); }}
                    className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${pushNotifications ? "bg-[#006b5f]" : "bg-slate-200"}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${pushNotifications ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>

                {/* Desktop Toggle */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Desktop Popups</span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-normal mt-0.5">In-browser active floating reminders</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => { setDesktopPopups(!desktopPopups); showToast(`Desktop notifications toggled ${!desktopPopups ? "ON" : "OFF"}`); }}
                    className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${desktopPopups ? "bg-[#006b5f]" : "bg-slate-200"}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${desktopPopups ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>

                {/* Chevron divider */}
                <div className="h-px bg-slate-100 my-2" />

                <button 
                  type="button"
                  onClick={() => showToast("Personal configurations redirected!")}
                  className="w-full flex items-center justify-center gap-1 text-[#006b5f] hover:underline font-bold text-xs py-1 cursor-pointer"
                >
                  <span>Manage All Settings</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>

            {/* Clean Inbox? Auto-archiving Promo Card */}
            <div className="bg-[#006b5f] text-white rounded-2xl relative overflow-hidden shadow-md p-6 space-y-4">
              <div className="absolute right-[-24px] bottom-[-24px] opacity-10">
                <Sparkles className="h-36 w-36 rotate-12" />
              </div>

              <div className="relative z-10 space-y-3">
                <h4 className="text-lg font-black tracking-tight leading-none">Clean Inbox?</h4>
                <p className="text-xs leading-normal opacity-90 font-medium">
                  Automate your notification archiving criteria automatically to maintain your focus parameters perfectly.
                </p>
                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={handleSetArchivingRules}
                    className="px-4.5 py-2.5 bg-white text-[#006b5f] rounded-xl font-bold text-xs hover:bg-slate-50 shadow-sm transition-all cursor-pointer active:scale-97"
                  >
                    Set Archiving Rules
                  </button>
                </div>
              </div>
            </div>

          </aside>

        </div>

      </div>
    </AppLayout>
  )
}
