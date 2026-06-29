import * as React from "react"
import { useState } from "react"
import { 
  Search, 
  Bell, 
  Settings, 
  ChevronDown, 
  Building2, 
  Shield, 
  BellRing, 
  Lock, 
  Cpu, 
  User, 
  FileText, 
  RefreshCw, 
  LogOut, 
  ChevronRight 
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Link, useNavigate } from "react-router-dom";

export function Header({ title, breadcrumbs }: { title: string; breadcrumbs: { label: string; href?: string }[] }) {
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isOpenNotifications, setIsOpenNotifications] = useState(false);
  const [flyoutCategory, setFlyoutCategory] = useState<"all" | "payroll" | "system">("all");

  // Notifications expect an array of feeds stored in localStorage under 'db_notifications'
  // with schema: { id: string, title: string, category: string, time: string, unread: boolean, avatar: string }
  const [flyoutNotifications, setFlyoutNotifications] = useState(() => {
    const saved = localStorage.getItem("db_notifications");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (err) {
        // Fallback
      }
    }
    return []; // Clear all hardcoded dummy data by default
  });

  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 px-8 backdrop-blur-md">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          {breadcrumbs.map((crumb, i) => (
            <div key={crumb.label} className="flex items-center gap-2">
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-brand transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-300">{crumb.label}</span>
              )}
              {i < breadcrumbs.length - 1 && <span className="text-slate-200">/</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything"
            className="h-10 w-80 rounded-xl border border-slate-100 bg-slate-50 pl-10 pr-4 text-sm outline-none transition-all focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Settings Trigger & Dropdown */}
          <div className="relative">
            <button
              id="settings-trigger"
              onClick={() => {
                setIsOpenSettings(!isOpenSettings);
                setIsOpenProfile(false);
              }}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors relative z-50",
                isOpenSettings && "bg-brand/10 text-brand-dark"
              )}
            >
              <Settings className="h-5 w-5" />
            </button>

            {isOpenSettings && (
              <>
                {/* Overlay to dim backdrop and intercept clicks */}
                <div 
                  className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[1px] cursor-default" 
                  onClick={() => setIsOpenSettings(false)}
                />
                
                {/* Settings Dropdown Card */}
                <div 
                  id="settings-dropdown"
                  className="absolute right-[-80px] sm:right-0 top-12 z-50 w-[290px] xs:w-[320px] sm:w-[520px] max-w-[calc(100vw-32px)] rounded-2xl border border-slate-100 bg-white py-5 px-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right scale-100"
                >
                  <div className="px-3 pb-3 mb-2 border-b border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Workspace Settings</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <button 
                      onClick={() => {
                        setIsOpenSettings(false);
                        navigate("/settings/personal-info");
                      }}
                      className="group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl hover:bg-brand/5 text-left transition-all w-full"
                    >
                      <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-brand/10 text-slate-500 group-hover:text-brand-dark transition-colors shrink-0">
                        <Settings className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">General Settings</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        setIsOpenSettings(false);
                        navigate("/settings/personal-info");
                      }}
                      className="group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl hover:bg-brand/5 text-left transition-all w-full"
                    >
                      <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-brand/10 text-slate-500 group-hover:text-brand-dark transition-colors shrink-0">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Organization Profile</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        setIsOpenSettings(false);
                        navigate("/settings/personal-info");
                      }}
                      className="group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl hover:bg-brand/5 text-left transition-all w-full"
                    >
                      <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-brand/10 text-slate-500 group-hover:text-brand-dark transition-colors shrink-0">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Security & Privacy</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        setIsOpenSettings(false);
                        navigate("/settings/personal-info");
                      }}
                      className="group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl hover:bg-brand/5 text-left transition-all w-full"
                    >
                      <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-brand/10 text-slate-500 group-hover:text-brand-dark transition-colors shrink-0">
                        <BellRing className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Notifications</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        setIsOpenSettings(false);
                        navigate("/settings/personal-info");
                      }}
                      className="group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl hover:bg-brand/5 text-left transition-all w-full"
                    >
                      <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-brand/10 text-slate-500 group-hover:text-brand-dark transition-colors shrink-0">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Roles & Permissions</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        setIsOpenSettings(false);
                        navigate("/settings/personal-info");
                      }}
                      className="group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl hover:bg-brand/5 text-left transition-all w-full"
                    >
                      <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-brand/10 text-slate-500 group-hover:text-brand-dark transition-colors shrink-0">
                        <Cpu className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">API & Integrations</p>
                      </div>
                    </button>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-center">
                    <button 
                      onClick={() => {
                        setIsOpenSettings(false);
                        navigate("/settings/personal-info");
                      }}
                      className="text-xs font-bold text-brand-dark hover:underline tracking-wide"
                    >
                      Manage Billing & Subscription
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notifications Trigger & Dropdown Flyout */}
          <div className="relative">
            <button
              type="button"
              id="notification-trigger"
              onClick={() => {
                setIsOpenNotifications(!isOpenNotifications);
                setIsOpenSettings(false);
                setIsOpenProfile(false);
              }}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer z-50",
                isOpenNotifications && "bg-brand/10 text-brand-dark"
              )}
            >
              <Bell className="h-5 w-5" />
              {flyoutNotifications.some(n => n.unread) && (
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full border-2 border-white bg-rose-500 animate-pulse" />
              )}
            </button>

            {isOpenNotifications && (
              <>
                {/* Overlay backdrop layer to click and dismiss */}
                <div 
                  className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[1px] cursor-default" 
                  onClick={() => setIsOpenNotifications(false)}
                />

                {/* Dropdown Container */}
                <div 
                  id="notification-dropdown"
                  className="absolute right-0 top-12 z-50 w-[320px] xs:w-[360px] sm:w-[400px] max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right transform"
                >
                  {/* Header */}
                  <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 bg-white">
                    <h2 className="font-bold text-sm text-slate-900">Notifications</h2>
                    <button 
                      type="button"
                      onClick={() => {
                        setFlyoutNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                      }}
                      className="text-[#006b5f] hover:text-[#005047] font-bold text-[11px] tracking-wide cursor-pointer hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>

                  {/* Categories/Tabs in Popover */}
                  <div className="flex px-4 pt-2 border-b border-slate-150 bg-slate-50/40 gap-1">
                    {(["all", "payroll", "system"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setFlyoutCategory(tab)}
                        className={cn(
                          "px-3 pb-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer border-b-2 border-transparent",
                          flyoutCategory === tab 
                            ? "text-[#006b5f] border-[#006b5f] font-extrabold" 
                            : "text-slate-400 hover:text-slate-600 font-semibold"
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* List Items of alerts */}
                  <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                    {flyoutNotifications
                      .filter(n => flyoutCategory === "all" || n.category === flyoutCategory)
                      .length === 0 ? (
                        <div className="p-8 text-center text-slate-400 font-medium text-xs">
                          No alerts in this category.
                        </div>
                      ) : (
                        flyoutNotifications
                          .filter(n => flyoutCategory === "all" || n.category === flyoutCategory)
                          .map((item) => (
                            <div 
                              key={item.id}
                              className={cn(
                                "p-4 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer relative group",
                                item.unread ? "bg-[#d4e7d8]/10" : "bg-white"
                              )}
                              onClick={() => {
                                // Mark single item as read on click
                                setFlyoutNotifications(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
                              }}
                            >
                              {/* Circle indicators of unread state */}
                              {item.unread && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#006b5f] rounded-full shrink-0" />
                              )}

                              {/* Icon or Avatar */}
                              <div className="shrink-0 mt-0.5">
                                {item.avatar ? (
                                  <img src={item.avatar} className="w-8 h-8 rounded-full border border-slate-100 object-cover" alt="Avatar" />
                                ) : (
                                  <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 select-none",
                                    item.category === "payroll" ? "bg-emerald-50 text-[#006b5f]" : "bg-slate-50 text-slate-500"
                                  )}>
                                    <Bell className="h-4 w-4" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-grow pr-4">
                                <p className={cn(
                                  "text-xs leading-snug text-slate-800",
                                  item.unread ? "font-bold" : "font-semibold"
                                )}>
                                  {item.title}
                                </p>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wide font-extrabold inline-block mt-1">
                                  {item.time} • {item.category}
                                </span>
                              </div>
                            </div>
                        ))
                      )}
                  </div>

                  {/* Popover Footer link layout */}
                  <div className="p-3 text-center bg-slate-50/50 border-t border-slate-100">
                    <Link 
                      to="/notifications"
                      onClick={() => setIsOpenNotifications(false)}
                      className="text-[#006b5f] hover:text-[#005047] font-bold text-xs tracking-wider uppercase hover:underline block py-1.5"
                    >
                      View All Notifications
                    </Link>
                  </div>

                </div>
              </>
            )}
          </div>
        </div>

        <div className="h-10 w-[1px] bg-slate-100" />

        {/* Profile Trigger & Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsOpenProfile(!isOpenProfile);
              setIsOpenSettings(false);
            }}
            className={cn(
              "flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition-all relative z-50 focus:outline-none text-left",
              isOpenProfile && "bg-slate-100"
            )}
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-bold text-slate-900">Davis Levin</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">HR Manager</span>
            </div>
            <div className="relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXcgEFuMNH2WfVpKSkgHkLECe1-hlQ0L9nl5ENytbZVUEW86K5l0_mna02bcC9tmRPbl-07SmLI5j_1r3ZHvrMBH6CD4kB-_5E-T2OAl45cTJ1qmSS_yuJ3xk82VJF17FliOHCnrOl_Q2p-mxWY0neh_xUDCcG4Qk1iJw5FWsQ8G6lPDt2cLc6wkE08FjkhU0qVbP3iVxOoM2oFtk1KBpMk_hkLr1VsbXccQdVkOlnRpK30VI7QYYr3xzhv_6-w2MHnuh5pjbwFSw"
                alt="Davis Levin portrait"
                className="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-50"
              />
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>
          </button>

          {isOpenProfile && (
            <>
              {/* Overlay for profile dropdown */}
              <div 
                className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[1px] cursor-default" 
                onClick={() => setIsOpenProfile(false)}
              />

              {/* Profile Dropdown menu card */}
              <div 
                id="profile-dropdown"
                className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-slate-100 bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {/* Header profile panel */}
                <div className="p-5 bg-slate-50/50 flex flex-col items-center text-center border-b border-slate-100">
                  <div className="relative mb-3">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXcgEFuMNH2WfVpKSkgHkLECe1-hlQ0L9nl5ENytbZVUEW86K5l0_mna02bcC9tmRPbl-07SmLI5j_1r3ZHvrMBH6CD4kB-_5E-T2OAl45cTJ1qmSS_yuJ3xk82VJF17FliOHCnrOl_Q2p-mxWY0neh_xUDCcG4Qk1iJw5FWsQ8G6lPDt2cLc6wkE08FjkhU0qVbP3iVxOoM2oFtk1KBpMk_hkLr1VsbXccQdVkOlnRpK30VI7QYYr3xzhv_6-w2MHnuh5pjbwFSw"
                      alt="Davis Levin" 
                      className="w-20 h-20 rounded-full border-2 border-brand object-cover" 
                    />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-brand-dark border-2 border-white rounded-full flex items-center justify-center">
                      <span className="text-[10px] text-white font-bold">✓</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">Davis Levin</h3>
                  <p className="text-brand-dark font-semibold text-xs mt-0.5">HR Manager</p>
                  <p className="text-[11px] text-slate-400 mt-1">davis.levin@teamhub.corp</p>
                </div>

                {/* List items */}
                <div className="p-2 space-y-0.5">
                  <button 
                    onClick={() => {
                      setIsOpenProfile(false);
                      navigate("/settings/personal-info");
                    }}
                    className="flex items-center gap-3.5 w-full px-4.5 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors font-medium text-sm text-slate-600 hover:text-slate-900"
                  >
                    <User className="h-4.5 w-4.5 text-slate-400" />
                    <span>Personal Information</span>
                  </button>

                  <button 
                    onClick={() => {
                      setIsOpenProfile(false);
                      navigate("/settings/personal-info");
                    }}
                    className="flex items-center justify-between w-full px-4.5 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors font-medium text-sm text-slate-600 hover:text-slate-900"
                  >
                    <div className="flex items-center gap-3.5">
                      <Settings className="h-4.5 w-4.5 text-slate-400" />
                      <span>Account Settings</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>

                  <button 
                    onClick={() => {
                      setIsOpenProfile(false);
                      navigate("/settings/personal-documents");
                    }}
                    className="flex items-center gap-3.5 w-full px-4.5 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors font-medium text-sm text-slate-600 hover:text-slate-900"
                  >
                    <FileText className="h-4.5 w-4.5 text-slate-400" />
                    <span>Personal Documents</span>
                  </button>

                  <div className="h-px bg-slate-100 my-1" />

                  <button 
                    onClick={() => {
                      setIsOpenProfile(false);
                    }}
                    className="flex items-center gap-3.5 w-full px-4.5 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors font-medium text-sm text-slate-600 hover:text-slate-900"
                  >
                    <RefreshCw className="h-4.5 w-4.5 text-slate-400" />
                    <span>Switch Workspace</span>
                  </button>

                  <button 
                    onClick={() => {
                      setIsOpenProfile(false);
                      navigate("/login");
                    }}
                    className="flex items-center gap-3.5 w-full px-4.5 py-2.5 rounded-xl hover:bg-rose-50 text-left transition-colors font-bold text-sm text-rose-600 hover:text-rose-700"
                  >
                    <LogOut className="h-4.5 w-4.5 text-rose-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
