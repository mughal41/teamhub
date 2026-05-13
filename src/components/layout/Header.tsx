import { Search, Bell, Settings, ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Link } from "react-router-dom";

export function Header({ title, breadcrumbs }: { title: string; breadcrumbs: { label: string; href?: string }[] }) {
  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 px-8 backdrop-blur-md">
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
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
          </button>
        </div>

        <div className="h-10 w-[1px] bg-slate-100" />

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900">Davis Levin</span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">HR Manager</span>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
              alt="User"
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-50"
            />
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
