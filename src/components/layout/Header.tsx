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
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "@/src/context/AuthContext";
import { ThemeToggle } from "@/src/components/ui/ThemeToggle";

export function Header({ title, breadcrumbs }: { title: string; breadcrumbs: { label: string; href?: string }[] }) {
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isOpenNotifications, setIsOpenNotifications] = useState(false);
  const [flyoutCategory, setFlyoutCategory] = useState<"all" | "payroll" | "system">("all");
  const [workspaceNotice, setWorkspaceNotice] = useState(false);

  const { user, logout, accessRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = accessRole === "admin";

  // Close flyouts on route change so overlays never block the sidebar/content
  React.useEffect(() => {
    setIsOpenSettings(false);
    setIsOpenProfile(false);
    setIsOpenNotifications(false);
  }, [location.pathname]);

  const goTo = (path: string) => {
    setIsOpenSettings(false);
    setIsOpenProfile(false);
    setIsOpenNotifications(false);
    navigate(path);
  };

  const displayName = user?.name || "TeamHub User";
  const displayRole = user?.roleTitle || "User";
  const displayEmail = user?.email || "";
  const displayAvatar =
    user?.avatar ||
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

  // Notifications expect an array of feeds stored in localStorage under 'db_notifications'
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
    return [];
  });

  return (
    <>
    {workspaceNotice ? (
      <div className="fixed right-6 top-24 z-[90] rounded-xl border border-[#E4E4E1] bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-lg">
        Only one workspace is available in this demo.
      </div>
    ) : null}
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-[#E4E4E1] bg-white px-8">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          {breadcrumbs.map((crumb, i) => (
            <div key={crumb.label} className="flex items-center gap-2">
              {crumb.href ? (
                <Link to={crumb.href} className="text-[#28C2A9] hover:underline font-bold transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-500 font-bold">{crumb.label}</span>
              )}
              {i < breadcrumbs.length - 1 && <span className="text-slate-300">/</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything"
            className="h-10 w-80 rounded-full border border-[#E4E4E1] bg-[#F3F3F0] pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#28C2A9] focus:bg-white focus:ring-1 focus:ring-[#28C2A9]"
          />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Settings Trigger & Dropdown */}
          <div className="relative">
            <button
              id="settings-trigger"
              onClick={() => {
                setIsOpenSettings(!isOpenSettings);
                setIsOpenProfile(false);
              }}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-[#63716E] hover:bg-slate-50 hover:text-slate-800 transition-colors relative z-50",
                isOpenSettings && "bg-[#28C2A9]/10 text-[#0e4d41]"
              )}
            >
              <Settings className="h-5 w-5" />
            </button>

            {isOpenSettings && (
              <>
                {/* Overlay to dim backdrop and intercept clicks */}
                <div 
                  className="fixed inset-0 z-30 bg-slate-900/10 backdrop-blur-[1px] cursor-default" 
                  onClick={() => setIsOpenSettings(false)}
                />
                
                {/* Settings Dropdown Card */}
                <div 
                  id="settings-dropdown"
                  className="absolute right-[-80px] sm:right-0 top-12 z-50 w-[290px] xs:w-[320px] sm:w-[520px] max-w-[calc(100vw-32px)] rounded-2xl border border-[#E4E4E1] bg-white py-5 px-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right scale-100"
                >
                  <div className="px-3 pb-3 mb-2 border-b border-[#E4E4E1]">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Workspace Settings</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <button 
                      type="button"
                      onClick={() => goTo("/settings/personal-info")}
                      className="group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl hover:bg-brand/5 text-left transition-all w-full"
                    >
                      <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-brand/10 text-slate-500 group-hover:text-brand-dark transition-colors shrink-0">
                        <Settings className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Personal Information</p>
                      </div>
                    </button>

                    {isAdmin && (
                    <button 
                      type="button"
                      onClick={() => goTo("/settings/organization")}
                      className="group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl hover:bg-brand/5 text-left transition-all w-full"
                    >
                      <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-brand/10 text-slate-500 group-hover:text-brand-dark transition-colors shrink-0">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Organization Profile</p>
                      </div>
                    </button>
                    )}

                    <button 
                      type="button"
                      onClick={() => goTo("/settings/security")}
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
                      type="button"
                      onClick={() => goTo("/settings/notifications")}
                      className="group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl hover:bg-brand/5 text-left transition-all w-full"
                    >
                      <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-brand/10 text-slate-500 group-hover:text-brand-dark transition-colors shrink-0">
                        <BellRing className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Notifications</p>
                      </div>
                    </button>

                    {isAdmin && (
                    <button 
                      type="button"
                      onClick={() => goTo("/settings/roles")}
                      className="group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl hover:bg-brand/5 text-left transition-all w-full"
                    >
                      <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-brand/10 text-slate-500 group-hover:text-brand-dark transition-colors shrink-0">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Roles & Permissions</p>
                      </div>
                    </button>
                    )}

                    {isAdmin && (
                    <button 
                      type="button"
                      onClick={() => goTo("/settings/integrations")}
                      className="group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl hover:bg-brand/5 text-left transition-all w-full"
                    >
                      <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-brand/10 text-slate-500 group-hover:text-brand-dark transition-colors shrink-0">
                        <Cpu className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">API & Integrations</p>
                      </div>
                    </button>
                    )}
                  </div>
                  {isAdmin && (
                  <div className="mt-4 pt-3 border-t border-[#E4E4E1] flex justify-center">
                    <button 
                      type="button"
                      onClick={() => goTo("/settings/billing")}
                      className="text-xs font-bold text-brand-dark hover:underline tracking-wide"
                    >
                      Manage Billing & Subscription
                    </button>
                  </div>
                  )}
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
                "relative flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-[#63716E] hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer z-50",
                isOpenNotifications && "bg-[#28C2A9]/10 text-[#0e4d41]"
              )}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border border-white bg-[#28C2A9]" />
            </button>

            {isOpenNotifications && (
              <>
                {/* Overlay backdrop layer to click and dismiss */}
                <div 
                  className="fixed inset-0 z-30 bg-slate-900/10 backdrop-blur-[1px] cursor-default" 
                  onClick={() => setIsOpenNotifications(false)}
                />

                {/* Dropdown Container */}
                <div 
                  id="notification-dropdown"
                  className="absolute right-0 top-12 z-50 w-[320px] xs:w-[360px] sm:w-[400px] max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl border border-[#E4E4E1] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right transform"
                >
                  {/* Header */}
                  <div className="px-5 py-4 flex items-center justify-between border-b border-[#E4E4E1] bg-white">
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
                                  <img src={item.avatar} className="w-8 h-8 rounded-full border border-[#E4E4E1] object-cover" alt="Avatar" />
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
                  <div className="p-3 text-center bg-slate-50/50 border-t border-[#E4E4E1]">
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
            <div className="relative">
              <img
                src={displayAvatar}
                alt={`${displayName} portrait`}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100"
              />
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div className="flex flex-col items-start hidden sm:flex leading-tight">
              <span className="text-sm font-bold text-slate-900">
                {displayName}
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                {displayRole}
              </span>
            </div>
          </button>

          {isOpenProfile && (
            <>
              {/* Overlay for profile dropdown */}
              <div 
                className="fixed inset-0 z-30 bg-slate-900/10 backdrop-blur-[1px] cursor-default" 
                onClick={() => setIsOpenProfile(false)}
              />

              {/* Profile Dropdown menu card */}
              <div 
                id="profile-dropdown"
                className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-[#E4E4E1] bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {/* Header profile panel */}
                <div className="p-5 bg-slate-50/50 flex flex-col items-center text-center border-b border-[#E4E4E1]">
                  <div className="relative mb-3">
                    <img 
                      src={displayAvatar}
                      alt="User avatar" 
                      className="w-20 h-20 rounded-full border-2 border-brand object-cover" 
                    />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-brand-dark border-2 border-white rounded-full flex items-center justify-center">
                      <span className="text-[10px] text-white font-bold">✓</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">
                    {displayName}
                  </h3>
                  <p className="text-brand-dark font-semibold text-xs mt-0.5">
                    {displayRole}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {displayEmail}
                  </p>
                </div>

                {/* List items */}
                <div className="p-2 space-y-0.5">
                  <button 
                    type="button"
                    onClick={() => goTo("/settings/personal-info")}
                    className="flex items-center gap-3.5 w-full px-4.5 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors font-medium text-sm text-slate-600 hover:text-slate-900"
                  >
                    <User className="h-4.5 w-4.5 text-slate-400" />
                    <span>Personal Information</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => goTo("/settings/security")}
                    className="flex items-center justify-between w-full px-4.5 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors font-medium text-sm text-slate-600 hover:text-slate-900"
                  >
                    <div className="flex items-center gap-3.5">
                      <Settings className="h-4.5 w-4.5 text-slate-400" />
                      <span>Account Settings</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>

                  <button 
                    type="button"
                    onClick={() => goTo("/settings/personal-documents")}
                    className="flex items-center gap-3.5 w-full px-4.5 py-2.5 rounded-xl hover:bg-[#F3F3F0] text-left transition-colors font-medium text-sm text-slate-600 hover:text-slate-900"
                  >
                    <FileText className="h-4.5 w-4.5 text-slate-400" />
                    <span>Personal Documents</span>
                  </button>

                  <div className="h-px bg-[#E4E4E1] my-1" />

                  <button 
                    type="button"
                    onClick={() => {
                      setIsOpenProfile(false);
                      setWorkspaceNotice(true);
                      window.setTimeout(() => setWorkspaceNotice(false), 2500);
                    }}
                    className="flex items-center gap-3.5 w-full px-4.5 py-2.5 rounded-xl hover:bg-[#F3F3F0] text-left transition-colors font-medium text-sm text-slate-600 hover:text-slate-900"
                  >
                    <RefreshCw className="h-4.5 w-4.5 text-slate-400" />
                    <span>Switch Workspace</span>
                  </button>

                  <button 
                    type="button"
                    onClick={async () => {
                      setIsOpenProfile(false);
                      await logout();
                      navigate("/login", { replace: true });
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
    </>
  );
}
