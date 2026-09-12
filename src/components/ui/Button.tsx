import * as React from "react"
import { cn } from "@/src/lib/utils"

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'outline' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: "bg-brand hover:bg-brand-dark text-white shadow-sm",
      secondary: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
      outline: "border border-[#E4E4E1] bg-white hover:bg-[#F3F3F0] text-slate-700",
      ghost: "hover:bg-[#F3F3F0] text-slate-600",
    }
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
