import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { getCollection } from "@/src/lib/db";
import { Button } from "@/src/components/ui/Button";
import { Calendar as CalendarIcon, Clock, MapPin, Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";

type EventType = "Work" | "Leave" | "1:1" | "Holiday";

type PersonalEvent = {
  id: string | number;
  title: string;
  day: number;
  time: string;
  type: EventType;
  location: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABEL = "June 2035";

function mapScheduleEvents(): PersonalEvent[] {
  const rows = getCollection<any[]>("db_schedules", []);
  const allowed = new Set(["Work", "Leave", "1:1", "Holiday", "Team", "Review"]);
  return rows.map((ev) => {
    const raw = String(ev.type || ev.category || "Work");
    let type: EventType = "Work";
    if (raw === "Leave") type = "Leave";
    else if (raw === "1:1") type = "1:1";
    else if (raw === "Holiday") type = "Holiday";
    else if (allowed.has(raw)) type = raw === "Team" || raw === "Review" ? "Work" : (raw as EventType);
    return {
      id: ev.id ?? `ev-${ev.day}-${ev.title}`,
      title: String(ev.title || "Untitled"),
      day: Number(ev.day || 1),
      time: String(ev.time || "09:00 AM"),
      type,
      location: String(ev.location || ev.loc || "TBD"),
    };
  });
}

export default function EmployeeCalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = React.useState<PersonalEvent[]>(() => mapScheduleEvents());
  const [selectedDay, setSelectedDay] = React.useState(21);
  const [title, setTitle] = React.useState("");
  const [time, setTime] = React.useState("09:00 AM");
  const [type, setType] = React.useState<EventType>("Work");
  const [location, setLocation] = React.useState("Personal");
  const [savedMsg, setSavedMsg] = React.useState("");

  React.useEffect(() => {
    void (async () => {
      try {
        const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
        await syncCollectionsFromApi();
      } catch {
        // keep cached
      }
      setEvents(mapScheduleEvents());
    })();
    const onUpdate = () => setEvents(mapScheduleEvents());
    window.addEventListener("db_updated", onUpdate);
    return () => window.removeEventListener("db_updated", onUpdate);
  }, []);

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

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    void (async () => {
      try {
        const { createCalendarEvent } = await import("@/src/lib/api/modules");
        const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
        await createCalendarEvent({
          title: title.trim(),
          type: type === "Work" ? "Team" : type,
          day: selectedDay,
          month: 6,
          year: 2035,
          time,
          location: location.trim() || "TBD",
          withWhom: user?.name || "Me",
          visibility: "personal",
        });
        await syncCollectionsFromApi();
        setEvents(mapScheduleEvents());
      } catch {
        setEvents((prev) => [
          ...prev,
          {
            id: `ev-${Date.now()}`,
            title: title.trim(),
            day: selectedDay,
            time,
            type,
            location: location.trim() || "TBD",
          },
        ]);
      }
      setTitle("");
      setSavedMsg("Event saved.");
      window.setTimeout(() => setSavedMsg(""), 2000);
    })();
  };

  return (
    <AppLayout
      title="Calendar"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Calendar" }]}
    >
      <div className="w-full space-y-6">
        <div className="admin-panel p-5">
          <p className="text-sm text-slate-500">
            Personal schedule for {user?.name || "you"} — meetings, leave, and company holidays.
          </p>
        </div>

        {savedMsg ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {savedMsg}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-5">
          <div className="admin-panel p-6 xl:col-span-3">
            <div className="mb-4 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-[#28C2A9]" />
              <h3 className="font-bold text-slate-900">{MONTH_LABEL}</h3>
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

          <div className="space-y-6 xl:col-span-2">
            <div className="admin-panel p-6">
              <h3 className="font-bold text-slate-900">Agenda · {selectedDay} Jun</h3>
              <div className="mt-4 space-y-3">
                {dayEvents.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-400">No events this day</p>
                ) : (
                  dayEvents.map((ev) => (
                    <div key={ev.id} className="rounded-xl border border-line p-4">
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

            <form onSubmit={addEvent} className="admin-panel space-y-3 p-6">
              <h3 className="flex items-center gap-2 font-bold text-slate-900">
                <Plus className="h-4 w-4 text-[#28C2A9]" />
                Add personal event
              </h3>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="h-10 w-full rounded-xl border border-line bg-[#F3F3F0] px-3 text-sm outline-none focus:border-[#28C2A9] focus:bg-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Time"
                  className="h-10 rounded-xl border border-line bg-[#F3F3F0] px-3 text-sm outline-none focus:border-[#28C2A9] focus:bg-white"
                />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as EventType)}
                  className="h-10 rounded-xl border border-line bg-[#F3F3F0] px-3 text-sm outline-none focus:border-[#28C2A9] focus:bg-white"
                >
                  <option value="Work">Work</option>
                  <option value="1:1">1:1</option>
                  <option value="Leave">Leave</option>
                  <option value="Holiday">Holiday</option>
                </select>
              </div>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="h-10 w-full rounded-xl border border-line bg-[#F3F3F0] px-3 text-sm outline-none focus:border-[#28C2A9] focus:bg-white"
              />
              <Button type="submit" className="w-full">
                Save for {selectedDay} Jun
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
