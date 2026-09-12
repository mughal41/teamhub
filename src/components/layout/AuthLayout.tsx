import * as React from "react"
import { ShieldCheck } from "lucide-react"
import { ThemeToggle } from "@/src/components/ui/ThemeToggle"

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="relative flex min-h-screen">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      {/* Left side: branding/imagery */}
      <div className="auth-bg relative hidden w-1/2 flex-col justify-between p-16 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white uppercase italic">TeamHub</span>
        </div>
        
        <div className="max-w-md">
          <h1 className="mb-4 text-5xl font-bold leading-tight text-white">
            Welcome to <br /> TeamHub
          </h1>
          <p className="text-lg text-emerald-50 opacity-90">
            Manage your HR tasks smarter, faster, and easier — all in one place
          </p>
        </div>
        
        <div className="text-sm font-medium text-white/60">
          © 2026 TeamHub HR Solutions. All rights reserved.
        </div>
      </div>

      {/* Right side: content */}
      <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
               <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                <path d="M12 3v18" />
                <path d="M4.5 7.5L12 12l7.5-4.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
