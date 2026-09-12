import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { getEmployeesForUser } from "@/src/lib/permissions";
import { Button } from "@/src/components/ui/Button";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Video,
  MapPin,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

type EventType = "Team" | "1:1" | "Review" | "Holiday";

interface TeamEvent {
  id: string;
  title: string;
  day: number;
  time: string;
  type: EventType;
  withWhom: string;
  location: string;
}

const MONTH_LABEL = "June 2035";
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildSeedEvents(teamNames: string[]): TeamEvent[] {
  const first = teamNames[0] || "Team member";
  const second = teamNames[1] || first;
  return [
    {
      id: "ev-1",
      title: "Weekly Team Sync",
      day: 20,
      time: "10:00 AM",
      type: "Team",
      withWhom: "Full team",
      location: "Meeting Room A",
    },
    {
      id: "ev-2",
      title: `1:1 with ${first}`,
      day: 21,
      time: "02:00 PM",
      type: "1:1",
      withWhom: first,
      location: "Zoom",
    },
    {
      id: "ev-3",
      title: "Performance Check-in",
      day: 22,
      time: "11:30 AM",
      type: "Review",
      withWhom: second,
      location: "HR Room 02",
    },
    {
      id: "ev-4",
      title: "Company Holiday — Mid-Year Break",
      day: 24,
      time: "All day",
      type: "Holiday",
      withWhom: "Company-wide",
      location: "—",
    },
    {
      id: "ev-5",
      title: "Campaign Planning",
      day: 25,
      time: "09:30 AM",
      type: "Team",
      withWhom: "Full team",
      location: "Marketing Hub",
    },
  ];
}

export default function ManagerCalendarPage() {
  const { user } = useAuth();
  const team = React.useMemo(() => getEmployeesForUser(user), [user]);
  const teamNames = team.map((t) => t.name);

  const [events, setEvents] = React.useState<TeamEvent[]>(() => buildSeedEvents(teamNames));
  const [selectedDay, setSelectedDay] = React.useState(21);
  const [title, setTitle] = React.useState("");
  const [withWhom, setWithWhom] = React.useState(teamNames[0] || "Full team");
  const [time, setTime] = React.useState("09:00 AM");
  const [type, setType] = React.useState<EventType>("Team");
  const [location, setLocation] = React.useState("Meeting Room A");
  const [savedMsg, setSavedMsg] = React.useState("");

  // June 2035 starts on Saturday
  const startOffset = 6;
  const daysInMonth = 30;
  const cells = Array.from({ length: startOffset + daysInMonth }, (_, i) => {
    if (i < startOffset) return null;
    return i - startOffset + 1;
  });

  const dayEvents = events.filter((e) => e.day === selectedDay);

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setEvents((prev) => [
      {
        id: `ev-${Date.now()}`,
        title: title.trim(),
        day: selectedDay,
        time,
        type,
        withWhom,
        location: location.trim() || "TBD",
      },
      ...prev,
    ]);
    setTitle("");
    setSavedMsg("Agenda added to your team calendar.");
    window.setTimeout(() => setSavedMsg(""), 2200);
  };

  const typeStyle = (t: EventType) => {
    switch (t) {
      case "Team":
        return "bg-[#28C2A9]/15 text-[#0E4D41]";
      case "1:1":
        return "bg-sky-50 text-sky-700";
      case "Review":
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
      <div className="space-y-6">
        {savedMsg ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {savedMsg}
          </div>
        ) : null}

        <p className="text-sm text-slate-500">
          Your schedule plus team meetings, 1:1s, reviews, and company holidays.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-[#28C2A9] p-5 text-white">
            <p className="text-sm text-white/80">All schedules</p>
            <p className="mt-1 text-3xl font-bold">{events.length}</p>
          </div>
          <div className="rounded-2xl bg-[#E4F2D3] p-5 text-[#0E4D41]">
            <p className="text-sm opacity-80">Team meetings</p>
            <p className="mt-1 text-3xl font-bold">
              {events.filter((e) => e.type === "Team").length}
            </p>
          </div>
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm text-slate-500">1:1s</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">
              {events.filter((e) => e.type === "1:1").length}
            </p>
          </div>
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm text-slate-500">Reviews</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">
              {events.filter((e) => e.type === "Review").length}
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-5">
          <div className="xl:col-span-3 rounded-2xl border border-[#E4E4E1] bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-[#28C2A9]" />
                <h3 className="font-bold text-slate-900">{MONTH_LABEL}</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-2 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="min-h-[72px] rounded-xl bg-slate-50/40" />;
                }
                const hasEvents = events.some((e) => e.day === day);
                const isSelected = selectedDay === day;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "min-h-[72px] rounded-xl border p-2 text-left transition",
                      isSelected
                        ? "border-[#28C2A9] bg-[#28C2A9]/10"
                        : "border-transparent hover:bg-slate-50"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                        isSelected ? "bg-[#28C2A9] text-white" : "text-slate-700"
                      )}
                    >
                      {day}
                    </span>
                    {hasEvents ? (
                      <div className="mt-1 flex gap-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#28C2A9]" />
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="xl:col-span-2 space-y-6">
            <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h3 className="mb-1 font-bold text-slate-900">Details Schedule</h3>
              <p className="mb-4 text-xs text-slate-400">
                {selectedDay} {MONTH_LABEL}
              </p>
              <div className="space-y-3">
                {dayEvents.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-400">No events on this day.</p>
                ) : (
                  dayEvents.map((ev) => (
                    <div key={ev.id} className="rounded-xl border border-[#E4E4E1] bg-slate-50/60 p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{ev.title}</p>
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", typeStyle(ev.type))}>
                          {ev.type}
                        </span>
                      </div>
                      <p className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5" /> {ev.time}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <Users className="h-3.5 w-3.5" /> {ev.withWhom}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        {ev.location.toLowerCase().includes("zoom") ? (
                          <Video className="h-3.5 w-3.5" />
                        ) : (
                          <MapPin className="h-3.5 w-3.5" />
                        )}
                        {ev.location}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h3 className="mb-4 font-bold text-slate-900">Add team agenda</h3>
              <form className="space-y-3" onSubmit={addEvent}>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Agenda title"
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-brand"
                />
                <select
                  value={withWhom}
                  onChange={(e) => setWithWhom(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-brand"
                >
                  <option>Full team</option>
                  {teamNames.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-brand"
                  />
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as EventType)}
                    className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-brand"
                  >
                    <option>Team</option>
                    <option>1:1</option>
                    <option>Review</option>
                    <option>Holiday</option>
                  </select>
                </div>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-brand"
                />
                <Button type="submit" className="w-full gap-2 font-bold">
                  <Plus className="h-4 w-4" /> Add to {selectedDay} Jun
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
