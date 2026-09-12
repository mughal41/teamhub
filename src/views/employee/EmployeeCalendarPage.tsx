import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { cn } from "@/src/lib/utils";

type EventType = "Work" | "Leave" | "1:1" | "Holiday";

type PersonalEvent = {
  id: string;
  title: string;
  day: number;
  time: string;
  type: EventType;
  location: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function EmployeeCalendarPage() {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = React.useState(21);
  const [events] = React.useState<PersonalEvent[]>([
    {
      id: "e1",
      title: "Team standup",
      day: 20,
      time: "09:30 AM",
      type: "Work",
      location: "Marketing Hub",
    },
    {
      id: "e2",
      title: `1:1 with Marcus`,
      day: 21,
      time: "02:00 PM",
      type: "1:1",
      location: "Zoom",
    },
    {
      id: "e3",
      title: "Campaign review",
      day: 22,
      time: "11:00 AM",
      type: "Work",
      location: "Meeting Room B",
    },
    {
      id: "e4",
      title: "Company holiday",
      day: 24,
      time: "All day",
      type: "Holiday",
      location: "—",
    },
  ]);

  const startOffset = 6;
  const daysInMonth = 30;
  const cells = Array.from({ length: startOffset + daysInMonth }, (_, i) =>
    i < startOffset ? null : i - startOffset + 1
  );
  const dayEvents = events.filter((e) => e.day === selectedDay);

  const typeStyle = (t: EventType) => {
    switch (t) {
      case "Work":
        return "bg-[#28C2A9]/15 text-[#0E4D41]";
      case "1:1":
        return "bg-sky-50 text-sky-700";
      case "Leave":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <AppLayout
      title="Calendar"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Calendar" }]}
    >
      <div className="w-full space-y-6">
        <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <p className="text-sm text-slate-500">
            Personal schedule for {user?.name || "you"} — meetings, leave, and company holidays.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-5">
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:col-span-3">
            <div className="mb-4 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-[#28C2A9]" />
              <h3 className="font-bold text-slate-900">June 2035</h3>
            </div>
            <div className="mb-2 grid grid-cols-7 gap-2">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-[11px] font-bold uppercase text-slate-400">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {cells.map((day, idx) => {
                if (day == null) return <div key={`e-${idx}`} className="min-h-[64px]" />;
                const has = events.some((e) => e.day === day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "min-h-[64px] rounded-xl border p-2 text-left transition",
                      selectedDay === day
                        ? "border-[#28C2A9] bg-[#E4F2D3]/50"
                        : "border-transparent hover:bg-[#F3F3F0]"
                    )}
                  >
                    <span className="text-sm font-semibold text-slate-800">{day}</span>
                    {has ? <span className="mt-2 block h-1.5 w-1.5 rounded-full bg-[#28C2A9]" /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:col-span-2">
            <h3 className="font-bold text-slate-900">Agenda · {selectedDay} Jun</h3>
            <div className="mt-4 space-y-3">
              {dayEvents.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">No events this day</p>
              ) : (
                dayEvents.map((ev) => (
                  <div key={ev.id} className="rounded-xl border border-[#E4E4E1] p-4">
                    <span className={cn("rounded-md px-2 py-1 text-[11px] font-bold", typeStyle(ev.type))}>
                      {ev.type}
                    </span>
                    <p className="mt-2 font-semibold text-slate-900">{ev.title}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      {ev.time}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {ev.location}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
