import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useTheme, type ThemeMode } from "@/src/context/ThemeContext";

const OPTIONS: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { mode, resolved, setMode, toggle } = useTheme();
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        title={`Theme: ${mode} (${resolved})`}
        aria-label="Theme options"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onDoubleClick={(e) => {
          e.preventDefault();
          toggle();
          setOpen(false);
        }}
        className={cn(
          "relative z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#63716E] transition-colors hover:bg-slate-50 hover:text-slate-800",
          open && "border-[#28C2A9]/40 bg-[#28C2A9]/10 text-[#0e4d41]"
        )}
      >
        {resolved === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-[80] w-44 overflow-hidden rounded-2xl border border-[#E4E4E1] bg-white py-1.5 shadow-2xl">
          <p className="px-3 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Appearance
          </p>
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = mode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setMode(opt.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm font-semibold transition-colors",
                  active
                    ? "bg-[#28C2A9]/12 text-[#0E4D41]"
                    : "text-slate-600 hover:bg-[#F3F3F0]"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{opt.label}</span>
                {active ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#28C2A9]" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
