import * as React from "react"
import { useState } from "react"
import { AppLayout } from "../components/layout/AppLayout"
import { 
  Bell, 
  Mail, 
  BellRing, 
  Clock, 
  Info, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  RefreshCw,
  HelpCircle,
  FileText
} from "lucide-react"

/*
Notification Settings JSON Data Format Requirement:
-------------------------------------------------+
The Notification Settings page saves configuration state in localStorage under "db_notification_settings" with the following JSON schema:

{
  "frequency": "immediate" | "daily" | "weekly",
  "email": {
    "payroll": boolean,
    "leave": boolean,
    "documents": boolean,
    "announcements": boolean
  },
  "push": {
    "attendance": boolean,
    "messages": boolean,
    "deadlines": boolean
  }
}
*/

export default function NotificationSettingPage() {
  // Read saved data or fall back to standard default states
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("db_notification_settings")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === "object") {
          return {
            frequency: parsed.frequency || "immediate",
            email: {
              payroll: parsed.email?.payroll !== false,
              leave: parsed.email?.leave !== false,
              documents: !!parsed.email?.documents,
              announcements: parsed.email?.announcements !== false,
              ...parsed.email
            },
            push: {
              attendance: parsed.push?.attendance !== false,
              messages: parsed.push?.messages !== false,
              deadlines: parsed.push?.deadlines !== false,
              ...parsed.push
            }
          }
        }
      } catch (err) {
        // Fallback
      }
    }
    // Default system standard initialization state parameters
    return {
      frequency: "immediate" as "immediate" | "daily" | "weekly",
      email: {
        payroll: true,
        leave: true,
        documents: false,
        announcements: true
      },
      push: {
        attendance: true,
        messages: true,
        deadlines: true
      }
    }
  })

  // Destructured state for easy state manipulation inside reactive components
  const [frequency, setFrequency] = useState<"immediate" | "daily" | "weekly">(settings.frequency)
  
  // Email states
  const [emailPayroll, setEmailPayroll] = useState(settings.email.payroll)
  const [emailLeave, setEmailLeave] = useState(settings.email.leave)
  const [emailDocuments, setEmailDocuments] = useState(settings.email.documents)
  const [emailAnnouncements, setEmailAnnouncements] = useState(settings.email.announcements)

  // Push states
  const [pushAttendance, setPushAttendance] = useState(settings.push.attendance)
  const [pushMessages, setPushMessages] = useState(settings.push.messages)
  const [pushDeadlines, setPushDeadlines] = useState(settings.push.deadlines)

  // Activity Status & Interactive Visual Elements loading state
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // Reset and load previous state parameters
  const handleDiscard = () => {
    setFrequency(settings.frequency)
    setEmailPayroll(settings.email.payroll)
    setEmailLeave(settings.email.leave)
    setEmailDocuments(settings.email.documents)
    setEmailAnnouncements(settings.email.announcements)
    setPushAttendance(settings.push.attendance)
    setPushMessages(settings.push.messages)
    setPushDeadlines(settings.push.deadlines)
  }

  // Save updated settings payload with nice visual feedbacks
  const handleSaveChanges = () => {
    setIsSaving(true)
    
    const payload = {
      frequency,
      email: {
        payroll: emailPayroll,
        leave: emailLeave,
        documents: emailDocuments,
        announcements: emailAnnouncements
      },
      push: {
        attendance: pushAttendance,
        messages: pushMessages,
        deadlines: pushDeadlines
      }
    }

    setTimeout(() => {
      localStorage.setItem("db_notification_settings", JSON.stringify(payload))
      setSettings(payload)
      setIsSaving(false)
      setShowToast(true)
      
      // Auto-hide success toast after 3 seconds
      setTimeout(() => {
        setShowToast(false)
      }, 3000)
    }, 1000)
  }

  return (
    <AppLayout
      title="Notification Settings"
      breadcrumbs={[
        { label: "Settings", href: "/settings/personal-info" },
        { label: "Notifications" }
      ]}
    >
      <div className="mx-auto w-full max-w-5xl space-y-8 pb-32 font-sans relative">
        
        {/* Floating Success Toast slides down */}
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-white rounded-full px-6 py-3.5 flex items-center gap-3 shadow-2xl z-[100] transition-transform duration-500 ease-in-out ${showToast ? "translate-y-0" : "-translate-y-[200%]"}`}>
          <CheckCircle2 className="h-5 w-5 text-teal-450 text-teal-400 shrink-0" />
          <p className="text-sm font-semibold tracking-wide">Settings updated successfully</p>
        </div>

        {/* Title Area */}
        <div className="flex flex-col gap-1">
          <p className="text-sm text-slate-500 font-medium">
            Manage how and where you receive alerts and updates.
          </p>
        </div>

        {/* Info Banner containing corporate directives on security */}
        <div className="bg-[#d4e7d8]/30 border border-[#b8cbbd] rounded-2xl p-5 flex items-start gap-4 shadow-3xs">
          <Info className="h-5 w-5 text-brand shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#0f1f16]">Critical Alerts</h4>
            <p className="text-xs text-[#57685d] leading-relaxed font-semibold">
              Some critical system alerts, such as security breaches, password reset confirmations, and mandatory compliance updates, cannot be disabled to ensure account safety.
            </p>
          </div>
        </div>

        {/* Bento/Grid Layout split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT SIDE FREQUENCY SELECTION COLUMN (col-span-4 equivalent) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Frequency Selector Box */}
            <div className="bg-white border border-line p-6 rounded-2xl flex flex-col gap-6">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
                <Clock className="h-4 w-4 text-brand" />
                <span>Frequency</span>
              </h3>

              <div className="flex flex-col gap-4">
                {/* Immediate */}
                <label 
                  onClick={() => setFrequency("immediate")}
                  className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    frequency === "immediate" 
                      ? "border-brand bg-[#d4e7d8]/10" 
                      : "border-line hover:border-slate-200"
                  }`}
                >
                  <input 
                    type="radio" 
                    name="notif_frequency" 
                    checked={frequency === "immediate"}
                    onChange={() => {}}
                    className="w-4 h-4 text-brand focus:ring-brand border-slate-300" 
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Immediate</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Real-time alerts as they happen</p>
                  </div>
                </label>

                {/* Daily Digest */}
                <label 
                  onClick={() => setFrequency("daily")}
                  className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    frequency === "daily" 
                      ? "border-brand bg-[#d4e7d8]/10" 
                      : "border-line hover:border-slate-200"
                  }`}
                >
                  <input 
                    type="radio" 
                    name="notif_frequency" 
                    checked={frequency === "daily"}
                    onChange={() => {}}
                    className="w-4 h-4 text-brand focus:ring-brand border-slate-300" 
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Daily Digest</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Morning summary at 8:00 AM</p>
                  </div>
                </label>

                {/* Weekly Summary */}
                <label 
                  onClick={() => setFrequency("weekly")}
                  className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    frequency === "weekly" 
                      ? "border-brand bg-[#d4e7d8]/10" 
                      : "border-line hover:border-slate-200"
                  }`}
                >
                  <input 
                    type="radio" 
                    name="notif_frequency" 
                    checked={frequency === "weekly"}
                    onChange={() => {}}
                    className="w-4 h-4 text-brand focus:ring-brand border-slate-300" 
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Weekly Summary</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Consolidated report on Fridays</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Visual focus Mode Teaser card */}
            <div className="relative h-48 rounded-2xl overflow-hidden group border border-line bg-teal-900 select-none">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600" 
                alt="HQ Office focus ambience setting" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
              />
              <div className="absolute bottom-4 left-4 z-20 space-y-0.5">
                <span className="flex items-center gap-1 bg-[#d4e7d8] text-brand-dark px-2 py-0.5 rounded text-[9px] font-black w-fit uppercase tracking-wider mb-1">
                  <Sparkles className="h-3 w-3" />
                  Focus Active
                </span>
                <p className="text-white font-bold text-sm">Focus Mode</p>
                <p className="text-white/80 text-[10px] font-semibold">Mute all during active hours</p>
              </div>
            </div>

          </div>

          {/* MAIN TOGGLES COLUMN (col-span-8 equivalent) */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Email Notifications Segment */}
            <section className="bg-white border border-line rounded-2xl overflow-hidden flex flex-col">
              <div className="bg-slate-50/50 px-6 py-4.5 border-b border-line flex items-center gap-3">
                <div className="w-9 h-9 bg-teal-50 text-brand rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Email Notifications</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">Direct mailing dispatch settings</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Payroll toggles */}
                <div className={`p-6 flex items-center justify-between gap-4 transition-colors ${emailPayroll ? "bg-[#d4e7d8]/5" : ""}`}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-800">Payroll Updates</span>
                    <span className="text-[11px] text-slate-400 font-semibold leading-normal">Receive alerts for payslip generation and tax filings.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailPayroll(!emailPayroll)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailPayroll ? "bg-brand" : "bg-slate-200"}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white ring-0 transition duration-200 ease-in-out ${emailPayroll ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                {/* Leave Request Toggle */}
                <div className={`p-6 flex items-center justify-between gap-4 transition-colors ${emailLeave ? "bg-[#d4e7d8]/5" : ""}`}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-800">Leave Request Status</span>
                    <span className="text-[11px] text-slate-400 font-semibold leading-normal">Status changes for your time-off applications.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailLeave(!emailLeave)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailLeave ? "bg-brand" : "bg-slate-200"}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white ring-0 transition duration-200 ease-in-out ${emailLeave ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                {/* New Documents */}
                <div className={`p-6 flex items-center justify-between gap-4 transition-colors ${emailDocuments ? "bg-[#d4e7d8]/5" : ""}`}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-800">New Documents</span>
                    <span className="text-[11px] text-slate-400 font-semibold leading-normal">Alerts when HR uploads contracts or policies for review.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailDocuments(!emailDocuments)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailDocuments ? "bg-brand" : "bg-slate-200"}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white ring-0 transition duration-200 ease-in-out ${emailDocuments ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                {/* System Announcements */}
                <div className={`p-6 flex items-center justify-between gap-4 transition-colors ${emailAnnouncements ? "bg-[#d4e7d8]/5" : ""}`}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-800">System Announcements</span>
                    <span className="text-[11px] text-slate-400 font-semibold leading-normal">Maintenance schedules and new feature releases.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailAnnouncements(!emailAnnouncements)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailAnnouncements ? "bg-brand" : "bg-slate-200"}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white ring-0 transition duration-200 ease-in-out ${emailAnnouncements ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* Push Notifications Segment */}
            <section className="bg-white border border-line rounded-2xl overflow-hidden flex flex-col">
              <div className="bg-slate-50/50 px-6 py-4.5 border-b border-line flex items-center gap-3">
                <div className="w-9 h-9 bg-teal-50 text-brand rounded-xl flex items-center justify-center shrink-0">
                  <BellRing className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Push Notifications (Browser/App)</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider font-sans">Active interactive browser feeds</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Attendance Reminders */}
                <div className={`p-6 flex items-center justify-between gap-4 transition-colors ${pushAttendance ? "bg-[#d4e7d8]/5" : ""}`}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-800">Attendance Reminders</span>
                    <span className="text-[11px] text-slate-400 font-semibold leading-normal">Reminders for clock-in and clock-out daily.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPushAttendance(!pushAttendance)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${pushAttendance ? "bg-brand" : "bg-slate-200"}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white ring-0 transition duration-200 ease-in-out ${pushAttendance ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                {/* Team Messages */}
                <div className={`p-6 flex items-center justify-between gap-4 transition-colors ${pushMessages ? "bg-[#d4e7d8]/5" : ""}`}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-800">Team Messages</span>
                    <span className="text-[11px] text-slate-400 font-semibold leading-normal">Direct messages and mentions from team members.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPushMessages(!pushMessages)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${pushMessages ? "bg-brand" : "bg-slate-200"}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white ring-0 transition duration-200 ease-in-out ${pushMessages ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                {/* Task Deadlines */}
                <div className={`p-6 flex items-center justify-between gap-4 transition-colors ${pushDeadlines ? "bg-[#d4e7d8]/5" : ""}`}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-800">Task Deadlines</span>
                    <span className="text-[11px] text-slate-400 font-semibold leading-normal">Approaching due dates for assigned activities.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPushDeadlines(!pushDeadlines)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${pushDeadlines ? "bg-brand" : "bg-slate-200"}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white ring-0 transition duration-200 ease-in-out ${pushDeadlines ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>
              </div>
            </section>

          </div>

        </div>

        {/* Floating Footer Action panel */}
        <footer className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white/95 backdrop-blur-md border-t border-line p-4.5 flex justify-end gap-3.5 z-40 shadow-xl">
          <button 
            type="button"
            onClick={handleDiscard}
            className="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-650 hover:text-slate-900 transition-colors font-bold text-xs select-none cursor-pointer"
          >
            Discard
          </button>
          
          <button 
            type="button"
            id="saveBtn"
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-8 py-2.5 rounded-xl bg-brand hover:bg-brand-dark hover:opacity-90 text-white transition-all text-xs font-bold shadow-md shadow-brand/10 select-none flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </footer>

      </div>
    </AppLayout>
  )
}
