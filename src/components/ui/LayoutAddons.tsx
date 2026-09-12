import * as React from "react"
import { cn } from "@/src/lib/utils"

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E4E4E1] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function Badge({ 
  className, 
  variant = 'default', 
  children,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'success' | 'warning' | 'error' | 'info' }) {
  const variants = {
    default: "bg-[#F3F3F0] text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    error: "bg-rose-100 text-rose-700",
    info: "bg-sky-100 text-sky-700",
  }
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors cursor-default",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
