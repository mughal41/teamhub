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

export default function SecurityPrivacyPage() {
  // Passwords
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [currentPass, setCurrentPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // 2FA state
  const [isTwoFactorActive, setIsTwoFactorActive] = useState(true)

  // Privacy states
  const [profileVisibility, setProfileVisibility] = useState(true)
  const [dataSharing, setDataSharing] = useState(false)

  // Success alert
  const [successMsg, setSuccessMsg] = useState("")

  // Unlinked connected devices state
  const [activeDevices, setActiveDevices] = useState([
    { id: 1, name: "MacBook Pro 16\"", os: "Sonoma", location: "San Francisco, CA", lastActive: "Just now", type: "laptop" },
    { id: 2, name: "iPhone 15 Pro", os: "iOS 17", location: "San Francisco, CA", lastActive: "2 hours ago", type: "phone" }
  ])

  // Login history
  const [loginHistory, setLoginHistory] = useState([
    { device: "MacBook Pro 16\" (Sonoma)", location: "San Francisco, USA", time: "2 mins ago", status: "SUCCESS" },
    { device: "iPhone 15 Pro", location: "San Francisco, USA", time: "Today, 09:42 AM", status: "SUCCESS" },
    { device: "Chrome (Windows 11)", location: "Chicago, USA", time: "Yesterday, 11:20 PM", status: "FAILED ATTEMPT" }
  ])

  // Validation rules for new password
  const hasLength = newPass.length >= 8
  const hasUpper = /[A-Z]/.test(newPass)
  const hasSpecial = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPass)

  // Calculate strength score (0-4)
  let strengthScore = 0
  if (newPass.length > 0) {
    if (hasLength) strengthScore++
    if (hasUpper) strengthScore++
    if (hasSpecial) strengthScore++
    if (newPass.length > 12) strengthScore++
  }

  const getStrengthText = () => {
    if (!newPass) return "Enter a new password"
    if (strengthScore <= 1) return "Very Weak"
    if (strengthScore === 2) return "Weak"
    if (strengthScore === 3) return "Good"
    return "Strong"
  }

  const getStrengthColor = (index: number) => {
    if (index >= strengthScore) return "bg-slate-100"
    if (strengthScore <= 1) return "bg-rose-500"
    if (strengthScore === 2) return "bg-amber-500"
    if (strengthScore === 3) return "bg-teal-500"
    return "bg-emerald-500"
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPass || !newPass || !confirmPass) {
      alert("Please fill in all password fields.")
      return
    }
    if (!(hasLength && hasUpper && hasSpecial)) {
      alert("Password does not meet all security requirements.")
      return
    }
    if (newPass !== confirmPass) {
      alert("New password and confirm password do not match.")
      return
    }
    
    // Simulate API save
    setSuccessMsg("Your password has been successfully updated!")
    setIsPasswordModalOpen(false)
    setCurrentPass("")
    setNewPass("")
    setConfirmPass("")
    
    setTimeout(() => {
      setSuccessMsg("")
    }, 4000)
  }

  const unlinkDevice = (id: number, name: string) => {
    if (confirm(`Are you sure you want to unlink ${name}?`)) {
      setActiveDevices(activeDevices.filter(d => d.id !== id))
      setSuccessMsg(`Unlinked ${name} successfully.`)
      setTimeout(() => setSuccessMsg(""), 3000)
    }
  }

  return (
    <AppLayout
      title="Security & Privacy"
      breadcrumbs={[
        { label: "Settings", href: "/settings/personal-info" },
        { label: "Security & Privacy" }
      ]}
    >
      <div className="mx-auto w-full max-w-7xl space-y-8 animate-fade-in duration-300">
        
        {/* Banner Alert */}
        {successMsg && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl shadow-sm transition-all duration-300">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-semibold">{successMsg}</p>
          </div>
        )}

        {/* Top Description bar */}
        <div className="flex flex-col gap-1">
          <p className="text-sm text-slate-500 font-medium">
            Manage your account security, login history, and data privacy preferences.
          </p>
        </div>

        {/* Bento Grid: Authentication & Privacy Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {/* Authentication Section (Span 2) */}
          <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-50">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
                <Shield className="h-5.5 w-5.5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Authentication</h3>
                <p className="text-xs text-slate-400 font-medium">Protect your personal dashboard credentials</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Password status */}
              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Credential</span>
                    <h4 className="text-sm font-bold text-slate-800 mt-0.5">Password</h4>
                    <p className="text-xs text-slate-500 mt-1">Last changed 3 months ago</p>
                  </div>
                  <button 
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="text-xs font-bold text-brand hover:text-brand-dark transition-colors border border-slate-200 hover:border-brand/40 bg-white shadow-xs rounded-lg px-2.5 py-1.5"
                  >
                    Change Password
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span>Password strength: <strong className="text-emerald-600 font-bold">Strong</strong></span>
                </div>
              </div>

              {/* Card 2: 2FA */}
              <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Security</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide ${isTwoFactorActive ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-100 text-slate-500"}`}>
                        {isTwoFactorActive ? "ACTIVE" : "DISABLED"}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mt-0.5">Two-Factor Authentication</h4>
                    <p className="text-xs text-slate-500 mt-1">Verify signups via Email / Mobile device App</p>
                  </div>
                  <button 
                    onClick={() => setIsTwoFactorActive(!isTwoFactorActive)}
                    className={`text-xs font-bold transition-all px-3 py-1.5 rounded-lg border shadow-xs ${isTwoFactorActive ? "border-rose-100 text-rose-600 hover:bg-rose-50/50" : "border-teal-200 text-teal-700 bg-teal-50/20 hover:bg-teal-50"}`}
                  >
                    {isTwoFactorActive ? "Disable" : "Enable"}
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Add an extra layer of protection to your account by requiring an OTP code during signup.
                </p>
              </div>

            </div>
          </section>

          {/* Privacy Settings Section (Span 1) */}
          <section className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-6 shadow-sm">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-50">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                <Shield className="h-5.5 w-5.5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Privacy Controls</h3>
                <p className="text-xs text-slate-400 font-medium">Configure data visibility levels</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-5">
              
              {/* Profile Visibility Switch */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                <div className="flex flex-col gap-0.5 max-w-[75%]">
                  <span className="text-sm font-bold text-slate-800">Profile Visibility</span>
                  <span className="text-xs text-slate-400 leading-normal">Allow other employees within organization to view your status</span>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileVisibility(!profileVisibility)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${profileVisibility ? "bg-brand" : "bg-slate-200"}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${profileVisibility ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>

              {/* Data Sharing Switch */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                <div className="flex flex-col gap-0.5 max-w-[75%]">
                  <span className="text-sm font-bold text-slate-800">Data Sharing</span>
                  <span className="text-xs text-slate-400 leading-normal">Share anonymous diagnostic and usage metadata to improve app</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDataSharing(!dataSharing)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${dataSharing ? "bg-brand" : "bg-slate-200"}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${dataSharing ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>

              {/* Policy document link */}
              <div className="pt-2 text-xs">
                <a 
                  href="#privacy-policy" 
                  onClick={(e) => { e.preventDefault(); alert("Displaying GDPR / Privacy Policy declaration."); }} 
                  className="flex items-center gap-1.5 font-bold text-brand hover:text-brand-dark hover:underline"
                >
                  <Shield className="h-4 w-4" />
                  Read Privacy Policy Overview
                </a>
              </div>

            </div>
          </section>

        </div>

        {/* Recent Login History Section */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                <span className="font-bold text-sm">🕒</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Login History</h3>
                <p className="text-xs text-slate-400 font-medium">Verify login device list logs to ensure audit safety</p>
              </div>
            </div>
            <button 
              onClick={() => { alert("Usage diagnostics logs requested. Standard audit PDF will download shortly."); }}
              className="text-xs font-bold text-slate-700 hover:text-brand-dark hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
            >
              Download Detailed Log
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-outline-variant/60">
                  <th className="px-6 py-4">Device</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {loginHistory.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3.5 text-sm font-semibold text-slate-800">
                      {row.device.toLowerCase().includes("phone") ? (
                        <Smartphone className="h-4.5 w-4.5 text-slate-400" />
                      ) : (
                        <Laptop className="h-4.5 w-4.5 text-slate-400" />
                      )}
                      <span>{row.device}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{row.location}</td>
                    <td className="px-6 py-4 text-sm text-slate-400 font-medium">{row.time}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                        row.status === "SUCCESS" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-rose-50 text-rose-700 border-rose-100 animate-pulse"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.status === "SUCCESS" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Connected Devices Details Card */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-55 bg-indigo-50/50 text-indigo-700 flex items-center justify-center shrink-0">
              <Laptop className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Connected Devices</h3>
              <p className="text-xs text-slate-400 font-medium">You are currently signed into these computer devices</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeDevices.length === 0 ? (
              <div className="col-span-12 p-8 text-center border border-slate-100 bg-slate-50 text-slate-400 rounded-xl text-sm font-medium">
                No active connected devices.
              </div>
            ) : (
              activeDevices.map((dev) => (
                <div 
                  key={dev.id} 
                  className="flex items-center justify-between p-4.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-brand/20 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-500">
                      {dev.type === "laptop" ? <Laptop className="h-5.5 w-5.5 text-brand" /> : <Smartphone className="h-5.5 w-5.5 text-indigo-600" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{dev.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">Active: {dev.lastActive} • {dev.location} • {dev.os}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => unlinkDevice(dev.id, dev.name)}
                    className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-rose-100 transition-all shrink-0"
                  >
                    UNLINK
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Dangerous zone: Deactivate Account */}
        <section className="bg-rose-50/40 rounded-2xl border border-rose-100/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-950 flex items-center gap-1.5">
              <AlertTriangle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
              Deactivate Account
            </h4>
            <p className="text-xs text-rose-800 opacity-90 font-medium">
              Permanently delete your personal profile, credentials settings, and wipe associated TeamHub HRMS history data.
            </p>
          </div>
          <button 
            onClick={() => {
              if (confirm("WARNING: This will permanently wipe your account and logout. Are you absolutely sure?")) {
                alert("Account deactivated. Logging out...");
                window.location.href = "/login";
              }
            }}
            className="text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl shadow-xs shrink-0 transition-colors"
          >
            Deactivate
          </button>
        </section>

      </div>

      {/* CHANGE PASSWORD DIALOG MODAL (SCREEN 1) */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <div 
            onClick={() => setIsPasswordModalOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Card */}
          <div className="relative bg-white w-full max-w-lg rounded-2xl border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10 flex flex-col">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Change Password</h3>
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Account protection update</p>
              </div>
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Form */}
            <form onSubmit={handleUpdatePassword} className="p-6 space-y-5">
              
              {/* Current Password Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrent ? "text" : "password"} 
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none pr-11 transition-all"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold"
                  >
                    {showCurrent ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">New Password</label>
                <div className="relative">
                  <input 
                    type={showNew ? "text" : "password"} 
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none pr-11 transition-all"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold"
                  >
                    {showNew ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>

                {/* Strength Meter lines dynamic */}
                {newPass && (
                  <div className="pt-2">
                    <div className="flex gap-1.5 h-1">
                      <div className={`flex-1 rounded-full transition-colors duration-300 ${getStrengthColor(0)}`} />
                      <div className={`flex-1 rounded-full transition-colors duration-300 ${getStrengthColor(1)}`} />
                      <div className={`flex-1 rounded-full transition-colors duration-300 ${getStrengthColor(2)}`} />
                      <div className={`flex-1 rounded-full transition-colors duration-300 ${getStrengthColor(3)}`} />
                    </div>
                    <p className="text-[11px] font-bold text-slate-700 mt-1.5 flex justify-between items-center">
                      <span>Password rating:</span>
                      <span className={`font-extrabold ${strengthScore <= 1 ? "text-rose-650 text-rose-500" : strengthScore === 2 ? "text-amber-500" : "text-emerald-500"}`}>
                        {getStrengthText()}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirm ? "text" : "password"} 
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-medium text-slate-800 pr-11 transition-all"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold"
                  >
                    {showConfirm ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Security Checklist Requirements Box */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col gap-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Security Requirements</h4>
                <ul className="flex flex-col gap-2">
                  
                  {/* Length */}
                  <li className={`flex items-center gap-2.5 text-xs font-semibold ${hasLength ? "text-slate-500" : "text-slate-400"}`}>
                    <div className={`w-4 h-4 flex items-center justify-center rounded-full border transition-all ${hasLength ? "bg-brand/10 border-brand text-brand" : "border-slate-300 text-transparent"}`}>
                      {hasLength ? <Check className="h-3 w-3 text-brand" /> : <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />}
                    </div>
                    <span>At least 8 characters</span>
                  </li>

                  {/* Uppercase */}
                  <li className={`flex items-center gap-2.5 text-xs font-semibold ${hasUpper ? "text-slate-500" : "text-slate-400"}`}>
                    <div className={`w-4 h-4 flex items-center justify-center rounded-full border transition-all ${hasUpper ? "bg-brand/10 border-brand text-brand" : "border-slate-300 text-transparent"}`}>
                      {hasUpper ? <Check className="h-3 w-3 text-brand" /> : <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />}
                    </div>
                    <span>One uppercase letter</span>
                  </li>

                  {/* Special character / Number */}
                  <li className={`flex items-center gap-2.5 text-xs font-semibold ${hasSpecial ? "text-slate-500" : "text-slate-400"}`}>
                    <div className={`w-4 h-4 flex items-center justify-center rounded-full border transition-all ${hasSpecial ? "bg-brand/10 border-brand text-brand" : "border-slate-300 text-transparent"}`}>
                      {hasSpecial ? <Check className="h-3 w-3 text-brand" /> : <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />}
                    </div>
                    <span>One number or special character</span>
                  </li>

                </ul>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-end gap-3.5 pt-5 border-t border-slate-100 bg-slate-50/50 -mx-6 -mb-6 px-6 py-4.5 rounded-b-2xl">
                <button 
                  type="button" 
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 text-sm font-bold bg-brand text-white hover:bg-brand-dark rounded-xl shadow-md cursor-pointer transition-all"
                >
                  Update Password
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </AppLayout>
  )
}
