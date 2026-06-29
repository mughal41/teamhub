import * as React from "react"
import { useState } from "react"
import { AppLayout } from "../components/layout/AppLayout"
import { 
  Shield, 
  Lock, 
  Key, 
  Smartphone, 
  Laptop, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  X, 
  Check, 
  Info,
  ChevronRight,
  Globe
} from "lucide-react"

/*
Security & Privacy JSON Data Format Requirement:
-----------------------------------------------+
The Security & Privacy settings page expects information feeds in the following JSON format.
You can read/write these elements to and from localStorage under "db_security_parameters" to save configuration state.

{
  "activeDevices": [
    {
      "id": 1,
      "name": "MacBook Pro 16\"",
      "os": "macOS Sonoma",
      "location": "San Francisco, CA",
      "lastActive": "Just now",
      "type": "laptop"
    },
    {
      "id": 2,
      "name": "iPhone 15 Pro",
      "os": "iOS 17",
      "location": "London, UK",
      "lastActive": "2h ago",
      "type": "phone"
    }
  ],
  "loginHistory": [
    {
      "device": "MacBook Pro 16\" (macOS Sonoma)",
      "location": "San Francisco, USA",
      "time": "5 mins ago",
      "status": "SUCCESS"
    },
    {
      "device": "Chrome on Windows 11",
      "location": "Beijing, CN",
      "time": "Yesterday, 10:14 PM",
      "status": "FAILED ATTEMPT"
    }
  ],
  "securityConfig": {
    "isTwoFactorActive": true,
    "profileVisibility": true,
    "dataSharing": false
  }
}
*/

export interface ActiveDevice {
  id: number
  name: string
  os: string
  location: string
  lastActive: string
  type: "laptop" | "phone"
}

export interface LoginHistoryItem {
  device: string
  location: string
  time: string
  status: "SUCCESS" | "FAILED ATTEMPT"
}

export default function SecurityPrivacyPage() {
  // Read saved data or fall back to empty states
  const [securityData, setSecurityData] = useState(() => {
    const saved = localStorage.getItem("db_security_parameters")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (err) {
        // fallback
      }
    }
    return {
      activeDevices: [] as ActiveDevice[], // Cleared empty state by default
      loginHistory: [] as LoginHistoryItem[], // Cleared empty state by default
      securityConfig: {
        isTwoFactorActive: false,
        profileVisibility: false,
        dataSharing: false
      }
    }
  })

  // Destructure state values
  const [activeDevices, setActiveDevices] = useState<ActiveDevice[]>(securityData.activeDevices)
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>(securityData.loginHistory)
  const [isTwoFactorActive, setIsTwoFactorActive] = useState(securityData.securityConfig.isTwoFactorActive)
  const [profileVisibility, setProfileVisibility] = useState(securityData.securityConfig.profileVisibility)
  const [dataSharing, setDataSharing] = useState(securityData.securityConfig.dataSharing)

  // Password reset dialogue modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [currentPass, setCurrentPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Toast notifications feedback
  const [successMsg, setSuccessMsg] = useState("")

  // Save general parameters changes
  const saveSecurityParameters = (updatedDevices = activeDevices, updatedHistory = loginHistory, tfa = isTwoFactorActive, vis = profileVisibility, ds = dataSharing) => {
    const payload = {
      activeDevices: updatedDevices,
      loginHistory: updatedHistory,
      securityConfig: {
        isTwoFactorActive: tfa,
        profileVisibility: vis,
        dataSharing: ds
      }
    }
    localStorage.setItem("db_security_parameters", JSON.stringify(payload))
    setSecurityData(payload)
  }

  // Password rules validation logic
  const hasLength = newPass.length >= 8
  const hasUpper = /[A-Z]/.test(newPass)
  const hasSpecial = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPass)

  let strengthScore = 0
  if (newPass.length > 0) {
    if (hasLength) strengthScore++
    if (hasUpper) strengthScore++
    if (hasSpecial) strengthScore++
    if (newPass.length > 12) strengthScore++
  }

  const getStrengthText = () => {
    if (!newPass) return "Enter password details"
    if (strengthScore <= 1) return "Weak Level"
    if (strengthScore === 2) return "Moderate Level"
    if (strengthScore === 3) return "Strong Level"
    return "Ultra Secure Strength"
  }

  const getStrengthColor = (index: number) => {
    if (index >= strengthScore) return "bg-slate-100"
    if (strengthScore <= 1) return "bg-rose-500"
    if (strengthScore === 2) return "bg-amber-400"
    if (strengthScore === 3) return "bg-teal-500"
    return "bg-emerald-500"
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPass || !newPass || !confirmPass) {
      alert("Please enter current, new and confirmed passwords.")
      return
    }
    if (!(hasLength && hasUpper && hasSpecial)) {
      alert("The entered password leaves out key security requirements.")
      return
    }
    if (newPass !== confirmPass) {
      alert("Passwords do not match. Please verify confirmed entry.")
      return
    }
    
    setSuccessMsg("Password credentials successfully updated!")
    setIsPasswordModalOpen(false)
    setCurrentPass("")
    setNewPass("")
    setConfirmPass("")
    
    setTimeout(() => {
      setSuccessMsg("")
    }, 4000)
  }

  const unlinkDevice = (id: number, name: string) => {
    if (confirm(`Are you sure you want to unlink and log out from ${name}?`)) {
      const filtered = activeDevices.filter(d => d.id !== id)
      setActiveDevices(filtered)
      saveSecurityParameters(filtered)
      setSuccessMsg(`Terminated session securely for ${name}.`)
      setTimeout(() => setSuccessMsg(""), 3000)
    }
  }

  // Toggle Two-factor authentication security layer state
  const handleToggle2FA = () => {
    const nextState = !isTwoFactorActive
    setIsTwoFactorActive(nextState)
    saveSecurityParameters(activeDevices, loginHistory, nextState)
    setSuccessMsg(`Two-Factor Authentication is now ${nextState ? "activated" : "deactivated"}.`)
    setTimeout(() => setSuccessMsg(""), 3500)
  }

  // Toggle internal directory profiles visibility switch
  const handleToggleVisibility = () => {
    const nextState = !profileVisibility
    setProfileVisibility(nextState)
    saveSecurityParameters(activeDevices, loginHistory, isTwoFactorActive, nextState)
    setSuccessMsg(`Organizational profile visibility updated.`)
    setTimeout(() => setSuccessMsg(""), 3000)
  }

  // Toggle telemetry metadata diagnostics collection share state
  const handleToggleDataSharing = () => {
    const nextState = !dataSharing
    setDataSharing(nextState)
    saveSecurityParameters(activeDevices, loginHistory, isTwoFactorActive, profileVisibility, nextState)
    setSuccessMsg(`Diagnostic sharing preferences saved!`)
    setTimeout(() => setSuccessMsg(""), 3000)
  }

  // Quick generator to test connected devices or restore sample logs
  const generateSampleSecurityLogs = () => {
    const sampleDevices: ActiveDevice[] = [
      { id: 101, name: "MacBook Pro 16\"", os: "macOS Sonoma", location: "San Francisco, CA", lastActive: "Just now", type: "laptop" },
      { id: 102, name: "iPhone 15 Pro Max", os: "iOS 17.4", location: "San Francisco, CA", lastActive: "1 hour ago", type: "phone" }
    ]
    const sampleHistory: LoginHistoryItem[] = [
      { device: "MacBook Pro 16\" (macOS Sonoma)", location: "San Francisco, USA", time: "Just now", status: "SUCCESS" },
      { device: "iPhone 15 Pro Max", location: "San Francisco, USA", time: "1 hour ago", status: "SUCCESS" },
      { device: "Safari on iPad Pro", location: "Zurich, CH", time: "May 28, 2026", status: "FAILED ATTEMPT" }
    ]
    setActiveDevices(sampleDevices)
    setLoginHistory(sampleHistory)
    saveSecurityParameters(sampleDevices, sampleHistory)
    setSuccessMsg("Generated placeholder security credentials for local browser review!")
    setTimeout(() => setSuccessMsg(""), 3500)
  }

  return (
    <AppLayout
      title="Security & Privacy"
      breadcrumbs={[
        { label: "Settings", href: "/settings/personal-info" },
        { label: "Security & Privacy" }
      ]}
    >
      <div className="mx-auto w-full max-w-7xl space-y-8">
        
        {/* Banner Alert Toast */}
        {successMsg && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl shadow-sm transition-all duration-300">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-semibold">{successMsg}</p>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <p className="text-sm text-slate-500 font-medium font-sans">
            Configure secure verification methods, terminal logging history, and active session devices parameters.
          </p>
        </div>

        {/* Grid split of details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {/* Column span 2: Authentication settings */}
          <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-50">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
                <Shield className="h-5.5 w-5.5 text-brand" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">Authentication Standards</h3>
                <p className="text-xs text-slate-400 font-medium">Protect and cycle verification login passwords</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Reset Password details */}
              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Credentials</span>
                    <h4 className="text-sm font-bold text-slate-800 mt-0.5">Primary Password</h4>
                    <p className="text-xs text-slate-500 mt-1">Please keep password parameters secure</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="text-xs font-bold text-[#006b5f] hover:text-[#005047] transition-all border border-slate-200 hover:border-brand/40 bg-white shadow-xs rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-slate-50"
                  >
                    Change Password
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span>Device state: <strong className="text-emerald-600 font-bold">Standard security status</strong></span>
                </div>
              </div>

              {/* 2FA Section */}
              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between gap-4">
                <div className="flex justify-between items-start font-sans">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TFA Option</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide ${isTwoFactorActive ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-150 text-slate-500 border border-slate-200"}`}>
                        {isTwoFactorActive ? "ENABLED" : "DISABLED"}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mt-0.5">Two-Factor Authentication</h4>
                    <p className="text-xs text-slate-500 mt-1">Verify sign-ins with an extra OTP pass code</p>
                  </div>
                  <button 
                    type="button"
                    onClick={handleToggle2FA}
                    className={`text-xs font-bold transition-all px-3 py-1.5 rounded-lg border shadow-xs cursor-pointer ${isTwoFactorActive ? "border-rose-100 text-rose-600 hover:bg-rose-50/50" : "border-teal-200 text-[#006b5f] bg-teal-50/20 hover:bg-teal-50"}`}
                  >
                    {isTwoFactorActive ? "Disable" : "Enable"}
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-normal font-semibold">
                  Two-factor authentication adds an extra layer of security, double-checking that only validated members possess administrative privileges.
                </p>
              </div>

            </div>
          </section>

          {/* Privacy controls side panel */}
          <section className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-6 shadow-sm">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-50">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                <Shield className="h-5.5 w-5.5 text-indigo-650" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">Privacy Control Settings</h3>
                <p className="text-xs text-slate-400 font-medium">Verify shared parameters boundaries</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-5">
              
              {/* Directory search toggle */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                <div className="flex flex-col gap-0.5 max-w-[75%]">
                  <span className="text-sm font-bold text-slate-800 font-sans">System Search Index</span>
                  <span className="text-xs text-slate-405 text-slate-400 leading-normal font-medium">Render profile tags in organizational rosters directories searches</span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleVisibility}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${profileVisibility ? "bg-brand" : "bg-slate-200"}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${profileVisibility ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>

              {/* Data sharing toggle */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                <div className="flex flex-col gap-0.5 max-w-[75%]">
                  <span className="text-sm font-bold text-slate-800 font-sans">Diagnostics Analytics</span>
                  <span className="text-xs text-slate-400 leading-normal font-medium">Transmit diagnostic payload settings to improve security features performance</span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleDataSharing}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${dataSharing ? "bg-brand" : "bg-slate-200"}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${dataSharing ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>

              <div className="pt-2 text-xs font-sans">
                <a 
                  href="#gdpr" 
                  onClick={(e) => { e.preventDefault(); alert("Rendering GDPR / Regulatory Legal frameworks statement."); }}
                  className="flex items-center gap-1.5 font-bold text-[#006b5f] hover:text-[#005047] hover:underline"
                >
                  <Shield className="h-4 w-4" />
                  Read Data Privacy Declarations
                </a>
              </div>

            </div>
          </section>

        </div>

        {/* Saved Session connected devices */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-50 flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Laptop className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">Connected Active Sessions</h3>
                <p className="text-xs text-slate-400 font-medium font-sans">Manage systems authorized to use database administrative panels</p>
              </div>
            </div>
            {activeDevices.length === 0 && (
              <button 
                type="button"
                onClick={generateSampleSecurityLogs}
                className="text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl px-4 py-2 cursor-pointer transition-colors"
              >
                Restore Placeholder Workspace Feeds
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeDevices.length === 0 ? (
              <div id="active-devices-empty-state" className="col-span-2 py-10 px-6 text-center border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl flex flex-col items-center justify-center gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Laptop className="w-5 L-5 hover:scale-105" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-700 text-sm">No connected computers found</h4>
                  <p className="text-xs text-slate-400 max-w-sm font-semibold leading-relaxed">
                    Local active devices memory list contains no sessions records at present.
                  </p>
                </div>
              </div>
            ) : (
              activeDevices.map((dev) => (
                <div 
                  key={dev.id} 
                  className="flex items-center justify-between p-4.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-500">
                      {dev.type === "laptop" ? <Laptop className="h-5.5 w-5.5 text-indigo-600" /> : <Smartphone className="h-5.5 w-5.5 text-teal-600" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{dev.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">Active: {dev.lastActive} • {dev.location} • {dev.os}</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => unlinkDevice(dev.id, dev.name)}
                    className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-rose-100 transition-all shrink-0 cursor-pointer"
                  >
                    UNLINK
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Security / Login logs grid history table */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col font-sans">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                <span className="font-bold text-sm">🕒</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">Account Login Ledger Logs</h3>
                <p className="text-xs text-slate-400 font-medium">Verify login history tracking list parameters</p>
              </div>
            </div>
            {loginHistory.length > 0 && (
              <button 
                type="button"
                onClick={() => { alert("Exporting security CSV parameters. Transfer protocols are verified."); }}
                className="text-xs font-bold text-slate-700 hover:text-brand-dark hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 cursor-pointer transition-colors"
              >
                Download Account Safety Reports
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4">Verification Terminal Agent</th>
                  <th className="px-6 py-4">IP Coordinates / City</th>
                  <th className="px-6 py-4">Timestamp Feed</th>
                  <th className="px-6 py-4 text-center">Safety State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                {loginHistory.length === 0 ? (
                  <tr>
                    <td colSpan={4} id="history-empty-state" className="px-6 py-12 text-center text-slate-400 font-semibold font-sans">
                      No security login historical indicators saved.
                    </td>
                  </tr>
                ) : (
                  loginHistory.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3.5 font-bold text-slate-800">
                        {row.device.toLowerCase().includes("phone") ? (
                          <Smartphone className="h-4.5 w-4.5 text-slate-400" />
                        ) : (
                          <Laptop className="h-4.5 w-4.5 text-slate-400" />
                        )}
                        <span>{row.device}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-semibold">{row.location}</td>
                      <td className="px-6 py-4 text-slate-400 font-semibold text-xs">{row.time}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border ${
                          row.status === "SUCCESS" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : "bg-rose-50 text-rose-700 border-rose-100 animate-pulse"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${row.status === "SUCCESS" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Dangerous state deactivation action trigger */}
        <section className="bg-rose-50/45 rounded-2xl border border-rose-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-950 flex items-center gap-1.5 font-sans">
              <AlertTriangle className="h-4.5 w-4.5 text-rose-650" />
              Safety Parameter Zero-out
            </h4>
            <p className="text-xs text-rose-800 opacity-90 font-semibold">
              Force-wipe diagnostic cookies registry settings, terminate active tokens lists, and zero out local browser configurations profiles.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => {
              if (confirm("This cycle will flush database session structures. Do you wish to continue?")) {
                localStorage.removeItem("db_security_parameters")
                setActiveDevices([])
                setLoginHistory([])
                setIsTwoFactorActive(false)
                setSuccessMsg("System records wiped! Local data profiles reset.")
                setTimeout(() => setSuccessMsg(""), 3500)
              }
            }}
            className="text-white hover:bg-rose-700 bg-rose-600 shadow-sm p-2.5 rounded-xl font-bold font-sans text-xs cursor-pointer transition-all active:scale-95"
          >
            Flush Diagnostic Cache
          </button>
        </section>

      </div>

      {/* CHANGE PASSWORD DIALOG MODAL (SCREEN 1) */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          
          <div 
            onClick={() => setIsPasswordModalOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
          />

          <div className="relative bg-white w-full max-w-lg rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 flex flex-col">
            
            <div className="px-6 py-4.5 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">Change Password</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Maintain profile privacy security</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="p-6 space-y-5">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-550 uppercase tracking-widest text-slate-400">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrent ? "text" : "password"} 
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter current safety password"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none pr-11 transition-all"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-550 uppercase tracking-widest text-slate-400">New Password</label>
                <div className="relative">
                  <input 
                    type={showNew ? "text" : "password"} 
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Enter new complex password"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none pr-11 transition-all"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
                  >
                    {showNew ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>

                {newPass && (
                  <div className="pt-2">
                    <div className="flex gap-1.5 h-1">
                      <div className={`flex-1 rounded-full transition-colors duration-300 ${getStrengthColor(0)}`} />
                      <div className={`flex-1 rounded-full transition-colors duration-300 ${getStrengthColor(1)}`} />
                      <div className={`flex-1 rounded-full transition-colors duration-300 ${getStrengthColor(2)}`} />
                      <div className={`flex-1 rounded-full transition-colors duration-300 ${getStrengthColor(3)}`} />
                    </div>
                    <p className="text-[11px] font-bold text-slate-700 mt-1.5 flex justify-between items-center">
                      <span>Verification index complexity rating:</span>
                      <span className={`font-black ${strengthScore <= 1 ? "text-rose-500" : strengthScore === 2 ? "text-amber-500" : "text-emerald-600"}`}>
                        {getStrengthText()}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-550 uppercase tracking-widest text-slate-400">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirm ? "text" : "password"} 
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Verify new complex password"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 pr-11 transition-all outline-none"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col gap-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complexity Parameters Check</h4>
                <ul className="flex flex-col gap-2">
                  <li className={`flex items-center gap-2.5 text-xs font-semibold ${hasLength ? "text-slate-600" : "text-slate-400"}`}>
                    <div className={`w-4 h-4 flex items-center justify-center rounded-full border transition-all ${hasLength ? "bg-teal-50 border-brand text-brand-dark" : "border-slate-300 text-transparent"}`}>
                      {hasLength ? <Check className="h-3 w-3 text-brand" /> : <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />}
                    </div>
                    <span>At least 8 parameters characters length</span>
                  </li>

                  <li className={`flex items-center gap-2.5 text-xs font-semibold ${hasUpper ? "text-slate-600" : "text-slate-400"}`}>
                    <div className={`w-4 h-4 flex items-center justify-center rounded-full border transition-all ${hasUpper ? "bg-teal-50 border-brand text-brand-dark" : "border-slate-300 text-transparent"}`}>
                      {hasUpper ? <Check className="h-3 w-3 text-brand" /> : <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />}
                    </div>
                    <span>At least one casing uppercase letter</span>
                  </li>

                  <li className={`flex items-center gap-2.5 text-xs font-semibold ${hasSpecial ? "text-slate-600" : "text-slate-400"}`}>
                    <div className={`w-4 h-4 flex items-center justify-center rounded-full border transition-all ${hasSpecial ? "bg-teal-50 border-brand text-brand-dark" : "border-slate-300 text-transparent"}`}>
                      {hasSpecial ? <Check className="h-3 w-3 text-brand" /> : <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />}
                    </div>
                    <span>At least one numerical integer or special code mark</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-end gap-3.5 pt-5 border-t border-slate-100 bg-slate-50/50 -mx-6 -mb-6 px-6 py-4.5 rounded-b-2xl">
                <button 
                  type="button" 
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 text-sm font-bold bg-[#006b5f] hover:bg-[#005047] text-white rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                >
                  Update Profile Password
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </AppLayout>
  )
}
