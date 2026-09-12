import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card, Badge } from "../components/ui/LayoutAddons";
import { Button } from "../components/ui/Button";
import {
  Search,
  Settings,
  Bell,
  ChevronDown,
  Plus,
  Filter as FilterIcon,
  Calendar as CalendarIcon,
  X,
  Layers,
  Handshake,
  UserCog,
  Users,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Clock,
  MapPin,
  FileText,
  Trash2,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { getCollection } from "../lib/db";

/**
 * @typedef {Object} CalendarEvent
 * @property {number} day - Integer day number in the current active month (e.g. 1 to 31)
 * @property {string} title - Full descriptive title of the calendar item/event
 * @property {string} category - Classification of the agenda item ("Talent Acquisition" | "Internal" | "Employee Development" | "Workplace Engagement")
 * @property {string} time - Human readable clock time (e.g., "10:00 AM")
 * @property {string} loc - Location descriptors or online URLs (e.g., "Zoom" | "Room A")
 * @property {string} note - Optional brief details/recap on this agenda task
 * @property {string} color - Optional custom Tailwind style indicators for rendering highlights
 * @property {boolean} isCurrent - Flagged for immediate focus/highlighting
 *
 * @api_response_format {CalendarEvent[]}
 * @endpoint GET `/api/calendar/events` - Retrieves a list of calendar events matching this schema representation.
 * @endpoint POST `/api/calendar/events` - Inserts a new agenda target event into the team calendar database.
 */

export default function CalendarPage() {
  const [events, setEvents] = React.useState<any[]>(() => {
    const rows = getCollection<any[]>("db_schedules", []);
    return rows.map((ev) => {
      const detailsColor = "bg-emerald-50 text-emerald-700 border-l-emerald-400";
      return {
        ...ev,
        category: ev.category || ev.type || "Internal",
        loc: ev.loc || ev.location || "HR Department HQ",
        note: ev.note || ev.withWhom || "No notes provided.",
        color: ev.color || detailsColor,
      };
    });
  });
  React.useEffect(() => {
    const reload = () => {
      const rows = getCollection<any[]>("db_schedules", []);
      setEvents(
        rows.map((ev) => ({
          ...ev,
          category: ev.category || ev.type || "Internal",
          loc: ev.loc || ev.location || "HR Department HQ",
          note: ev.note || ev.withWhom || "No notes provided.",
          color: ev.color || "bg-emerald-50 text-emerald-700 border-l-emerald-400",
        })),
      );
    };
    void (async () => {
      try {
        const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
        await syncCollectionsFromApi();
      } catch {
        // ignore
      }
      reload();
    })();
    window.addEventListener("db_updated", reload);
    return () => window.removeEventListener("db_updated", reload);
  }, []);
  const [selectedDay, setSelectedDay] = React.useState<number>(21);
  const [isNewAgendaOpen, setIsNewAgendaOpen] = React.useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

  // Edit Agenda Modal states
  const [isEditAgendaOpen, setIsEditAgendaOpen] = React.useState(false);
  const [isEditDatePickerOpen, setIsEditDatePickerOpen] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<any | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editCategory, setEditCategory] = React.useState("Talent Acquisition");
  const [editTime, setEditTime] = React.useState("09:00 AM");
  const [editLocation, setEditLocation] = React.useState("");
  const [editNote, setEditNote] = React.useState("");
  const [editDay, setEditDay] = React.useState<number>(21);

  // Dynamic Categories State
  const [categories, setCategories] = React.useState([
    {
      id: "1",
      name: "Talent Acquisition",
      colorScheme: "green",
      isActive: true,
    },
    {
      id: "2",
      name: "Employee Development",
      colorScheme: "amber",
      isActive: true,
    },
    {
      id: "3",
      name: "Workplace Engagement",
      colorScheme: "slate",
      isActive: true,
    },
    { id: "4", name: "Internal", colorScheme: "slate", isActive: true },
  ]);

  // Management UI states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [newCatName, setNewCatName] = React.useState("");
  const [newCatColor, setNewCatColor] = React.useState<
    "green" | "amber" | "slate" | "blue" | "rose"
  >("green");
  const [categoryError, setCategoryError] = React.useState("");

  // New Agenda Form States
  const [newTitle, setNewTitle] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("Talent Acquisition");
  const [newTime, setNewTime] = React.useState("09:00 AM");
  const [newLocation, setNewLocation] = React.useState("");
  const [newNote, setNewNote] = React.useState("");
  const [newDay, setNewDay] = React.useState<number>(21);

  // Sync form day with selection
  React.useEffect(() => {
    setNewDay(selectedDay);
  }, [selectedDay]);

  // Align select option with active categories
  React.useEffect(() => {
    const activeCats = categories.filter((c) => c.isActive);
    if (activeCats.length > 0) {
      const isValid = activeCats.some((c) => c.name === newCategory);
      if (!isValid) {
        setNewCategory(activeCats[0].name);
      }
    }
  }, [categories, newCategory]);

  const getCategoryCardDetails = (categoryName: string) => {
    const cat = categories.find((c) => c.name === categoryName);
    const scheme = cat?.colorScheme || "slate";
    switch (scheme) {
      case "green":
        return {
          bgColor: "bg-[#E4F2D3]",
          tagBg: "bg-white",
          textColor: "text-[#0E4D41]",
          borderClass: "border-l-[#35BFA3]",
          eventBg: "bg-emerald-50 text-emerald-700",
        };
      case "amber":
        return {
          bgColor: "bg-[#FDF5DF]",
          tagBg: "bg-white",
          textColor: "text-amber-800",
          borderClass: "border-l-amber-500",
          eventBg: "bg-amber-50 text-amber-700",
        };
      case "blue":
        return {
          bgColor: "bg-[#E0F2FE]", // bg-sky-100
          tagBg: "bg-white",
          textColor: "text-[#0369A1]", // text-sky-700
          borderClass: "border-l-[#38BDF8]", // sky-400
          eventBg: "bg-[#F0F9FF] text-[#0369A1]",
        };
      case "rose":
        return {
          bgColor: "bg-[#FFE4E6]", // bg-rose-100
          tagBg: "bg-white",
          textColor: "text-[#BE123C]", // text-rose-700
          borderClass: "border-l-[#FB7185]", // rose-400
          eventBg: "bg-[#FFF1F2] text-[#BE123C]",
        };
      case "slate":
      default:
        return {
          bgColor: "bg-[#F3F3F0]/60",
          tagBg: "bg-slate-50",
          textColor: "text-slate-700",
          borderClass: "border-l-slate-300",
          eventBg: "bg-slate-50 text-slate-600",
        };
    }
  };

  const handleCreateAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const details = getCategoryCardDetails(newCategory);
    const color = `${details.eventBg} ${details.borderClass}`;

    const newEvent = {
      id: `evt-${Date.now()}`,
      day: newDay,
      title: newTitle,
      category: newCategory,
      time: newTime,
      loc: newLocation || "HR Department HQ",
      note: newNote || "No notes provided.",
      color: color,
    };

    void (async () => {
      try {
        const { createCalendarEvent } = await import("@/src/lib/api/modules");
        const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
        await createCalendarEvent({
          title: newTitle,
          type: newCategory,
          day: newDay,
          month: 6,
          year: 2035,
          time: newTime,
          location: newLocation || "HR Department HQ",
          withWhom: newNote || "",
          visibility: "Company",
        });
        await syncCollectionsFromApi();
        const rows = getCollection<any[]>("db_schedules", []);
        setEvents(
          rows.map((ev) => ({
            ...ev,
            category: ev.category || ev.type || "Internal",
            loc: ev.loc || ev.location || "HR Department HQ",
            note: ev.note || ev.withWhom || "No notes provided.",
            color: ev.color || color,
          })),
        );
      } catch {
        setEvents((prev) => [...prev, newEvent]);
      }
      setSelectedDay(newDay);
      setNewTitle("");
      setNewLocation("");
      setNewNote("");
      setNewTime("09:00 AM");
      setIsNewAgendaOpen(false);
    })();
  };

  const handleOpenEditModal = (event: any) => {
    setEditingEvent(event);
    setEditTitle(event.title);
    setEditCategory(event.category);
    setEditTime(event.time);
    setEditLocation(event.loc === "HR Department HQ" ? "" : event.loc || "");
    setEditNote(event.note === "No notes provided." ? "" : event.note || "");
    setEditDay(event.day);
    setIsEditDatePickerOpen(false);
    setIsEditAgendaOpen(true);
  };

  const handleSaveEditedAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editTitle.trim()) return;

    const details = getCategoryCardDetails(editCategory);
    const color = `${details.eventBg} ${details.borderClass}`;

    void (async () => {
      const payload = {
        title: editTitle,
        type: editCategory,
        category: editCategory,
        time: editTime,
        location: editLocation || "HR Department HQ",
        withWhom: editNote || "No notes provided.",
        day: editDay,
      };
      if (typeof editingEvent.id === "number") {
        try {
          const { updateCalendarEvent } = await import("@/src/lib/api/modules");
          const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
          await updateCalendarEvent(editingEvent.id, payload);
          await syncCollectionsFromApi();
          const rows = getCollection<any[]>("db_schedules", []);
          setEvents(
            rows.map((ev) => ({
              ...ev,
              category: ev.category || ev.type || "Internal",
              loc: ev.loc || ev.location || "HR Department HQ",
              note: ev.note || ev.withWhom || "No notes provided.",
              color: ev.color || color,
            })),
          );
          setIsEditAgendaOpen(false);
          setEditingEvent(null);
          return;
        } catch {
          // local
        }
      }
      setEvents((prev) =>
        prev.map((evt) => {
          if (evt.id === editingEvent.id) {
            return {
              ...evt,
              title: editTitle,
              category: editCategory,
              time: editTime,
              loc: editLocation || "HR Department HQ",
              note: editNote || "No notes provided.",
              day: editDay,
              color: color,
            };
          }
          return evt;
        }),
      );
      setIsEditAgendaOpen(false);
      setEditingEvent(null);
    })();
  };

  const handleDeleteAgenda = () => {
    if (!editingEvent) return;
    void (async () => {
      if (typeof editingEvent.id === "number") {
        try {
          const { deleteCalendarEvent } = await import("@/src/lib/api/modules");
          const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
          await deleteCalendarEvent(editingEvent.id);
          await syncCollectionsFromApi();
          const rows = getCollection<any[]>("db_schedules", []);
          setEvents(
            rows.map((ev) => ({
              ...ev,
              category: ev.category || ev.type || "Internal",
              loc: ev.loc || ev.location || "HR Department HQ",
              note: ev.note || ev.withWhom || "No notes provided.",
              color: ev.color || "bg-emerald-50 text-emerald-700 border-l-emerald-400",
            })),
          );
          setIsEditAgendaOpen(false);
          setEditingEvent(null);
          return;
        } catch {
          // local
        }
      }
      setEvents((prev) => prev.filter((evt) => evt.id !== editingEvent.id));
      setIsEditAgendaOpen(false);
      setEditingEvent(null);
    })();
  };

  const selectedDayEvents = events.filter((e) => e.day === selectedDay);

  return (
    <AppLayout
      title="Calendar"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Calendar" }]}
    >
      <div className="space-y-6">
        {/* Dynamic Modal Dialog */}
        {isNewAgendaOpen && (
          <div className="fixed inset-0 bg-[#203430]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative gap-4 flex flex-col shadow-2xl border border-line animate-slide-up">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-brand" />
                  <h3 className="text-base font-bold text-[#203430]">
                    Create Calendar Agenda
                  </h3>
                </div>
                <button
                  onClick={() => setIsNewAgendaOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAgenda} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#203430]">
                    Agenda Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Q3 Strategic Planning Session"
                    className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-brand text-[#203430] placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Custom Date Picker UX */}
                  <div className="space-y-1 relative">
                    <label className="text-[11px] font-bold text-[#203430] block">
                      Day of June 2035 *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                      className="w-full flex items-center justify-between text-xs h-9 px-3 border border-slate-200 rounded-lg bg-white hover:border-[#0E4D41] focus:outline-none focus:border-[#0E4D41] text-[#203430] font-medium transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <CalendarIcon className="h-3.5 w-3.5 text-[#0E4D41]" />
                        June {newDay}, 2035
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </button>

                    {isDatePickerOpen && (
                      <div className="absolute top-12 left-0 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 w-[260px] animate-fade-in border-slate-200">
                        <div className="flex items-center justify-between mb-2 pb-1 border-b border-line">
                          <span className="text-[11px] font-bold text-[#0E4D41]">
                            Select June 2035 Day
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDatePickerOpen(false);
                            }}
                            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-slate-50 transition-all"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-[#63716E] mb-1">
                          {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
                            <span
                              key={`${d}-${idx}`}
                              className="uppercase text-[8px]"
                            >
                              {d}
                            </span>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center">
                          {/* June 2035 starts on a Friday (5 empty slots) */}
                          {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={`empty-${i}`} className="h-6 w-6" />
                          ))}
                          {Array.from({ length: 30 }, (_, i) => i + 1).map(
                            (day) => {
                              const isSelected = day === newDay;
                              const isToday = day === 21;
                              const dayEvents = events.filter(
                                (e) => e.day === day,
                              );
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNewDay(day);
                                    setIsDatePickerOpen(false);
                                  }}
                                  className={cn(
                                    "h-6 w-6 text-[10px] font-bold rounded-lg flex items-center justify-center transition-colors relative",
                                    isSelected
                                      ? "bg-[#0E4D41] text-white"
                                      : "text-[#203430] hover:bg-slate-100",
                                    isToday && !isSelected
                                      ? "border border-[#0E4D41]"
                                      : "",
                                  )}
                                >
                                  {day}
                                  {dayEvents.length > 0 && !isSelected && (
                                    <span className="absolute bottom-[2px] h-1 w-1 bg-[#35BFA3] rounded-full" />
                                  )}
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category Selection with "+ Add New" on top right */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-[#203430]">
                        Category *
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="text-[9px] font-bold text-[#0E4D41] hover:text-[#203430] bg-[#E4F2D3] hover:bg-[#d5eebe] px-1.5 py-0.5 rounded transition-all select-none"
                      >
                        + Add New
                      </button>
                    </div>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full text-xs h-9 px-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-brand text-[#203430]"
                    >
                      {categories
                        .filter((c) => c.isActive)
                        .map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#203430]">
                      Time *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="e.g. 10:00 AM"
                      className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-brand text-[#203430]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#203430]">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Conference Room 3B"
                      className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-brand text-[#203430]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#203430]">
                    Agenda Notes
                  </label>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Brief objective notes, guidelines or meeting details..."
                    rows={3}
                    className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-brand text-[#203430] placeholder:text-slate-400 resize-none"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsNewAgendaOpen(false)}
                    className="h-9 px-4 rounded-lg text-xs font-bold text-[#63716E] hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="h-9 px-4 text-xs font-bold bg-[#0E4D41] hover:bg-[#203430] text-white select-none"
                  >
                    Save Agenda
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Agenda Modal Dialog */}
        {isEditAgendaOpen && editingEvent && (
          <div className="fixed inset-0 bg-[#203430]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative gap-4 flex flex-col shadow-2xl border border-line animate-slide-up">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-[#0E4D41]" />
                  <h3 className="text-base font-bold text-[#203430]">
                    Edit Calendar Agenda
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditAgendaOpen(false);
                    setEditingEvent(null);
                  }}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={handleSaveEditedAgenda}
                className="space-y-4 pt-2"
              >
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#203430]">
                    Agenda Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="e.g. Q3 Strategic Planning Session"
                    className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-brand text-[#203430] placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Custom Date Picker UX for Edit */}
                  <div className="space-y-1 relative">
                    <label className="text-[11px] font-bold text-[#203430] block">
                      Day of June 2035 *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setIsEditDatePickerOpen(!isEditDatePickerOpen)
                      }
                      className="w-full flex items-center justify-between text-xs h-9 px-3 border border-slate-200 rounded-lg bg-white hover:border-[#0E4D41] focus:outline-none focus:border-[#0E4D41] text-[#203430] font-medium transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <CalendarIcon className="h-3.5 w-3.5 text-[#0E4D41]" />
                        June {editDay}, 2035
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </button>

                    {isEditDatePickerOpen && (
                      <div className="absolute top-12 left-0 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 w-[260px] animate-fade-in border-slate-200">
                        <div className="flex items-center justify-between mb-2 pb-1 border-b border-line">
                          <span className="text-[11px] font-bold text-[#0E4D41]">
                            Select June 2035 Day
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditDatePickerOpen(false);
                            }}
                            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-slate-50 transition-all"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-[#63716E] mb-1">
                          {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
                            <span
                              key={`${d}-${idx}`}
                              className="uppercase text-[8px]"
                            >
                              {d}
                            </span>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center">
                          {/* June 2035 starts on a Friday (5 empty slots) */}
                          {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={`empty-${i}`} className="h-6 w-6" />
                          ))}
                          {Array.from({ length: 30 }, (_, i) => i + 1).map(
                            (day) => {
                              const isSelected = day === editDay;
                              const isToday = day === 21;
                              const dayEvents = events.filter(
                                (e) =>
                                  e.day === day && e.id !== editingEvent.id,
                              );
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditDay(day);
                                    setIsEditDatePickerOpen(false);
                                  }}
                                  className={cn(
                                    "h-6 w-6 text-[10px] font-bold rounded-lg flex items-center justify-center transition-colors relative",
                                    isSelected
                                      ? "bg-[#0E4D41] text-white"
                                      : "text-[#203430] hover:bg-slate-100",
                                    isToday && !isSelected
                                      ? "border border-[#0E4D41]"
                                      : "",
                                  )}
                                >
                                  {day}
                                  {dayEvents.length > 0 && !isSelected && (
                                    <span className="absolute bottom-[2px] h-1 w-1 bg-[#35BFA3] rounded-full" />
                                  )}
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category Selection for Edit */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-[#203430]">
                        Category *
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="text-[9px] font-bold text-[#0E4D41] hover:text-[#203430] bg-[#E4F2D3] hover:bg-[#d5eebe] px-1.5 py-0.5 rounded transition-all select-none"
                      >
                        + Add New
                      </button>
                    </div>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full text-xs h-9 px-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0E4D41] text-[#203430]"
                    >
                      {categories
                        .filter((c) => c.isActive)
                        .map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#203430]">
                      Time *
                    </label>
                    <input
                      type="text"
                      required
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                      placeholder="e.g. 10:00 AM"
                      className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0E4D41] text-[#203430]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#203430]">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder="e.g. Conference Room 3B"
                      className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0E4D41] text-[#203430]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#203430]">
                    Agenda Notes
                  </label>
                  <textarea
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="Brief objective notes, guidelines or meeting details..."
                    rows={3}
                    className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0E4D41] text-[#203430] placeholder:text-slate-400 resize-none"
                  />
                </div>

                <div className="flex gap-2 justify-between pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={handleDeleteAgenda}
                    className="h-9 px-3 rounded-lg text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors flex items-center gap-1.5 border border-rose-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditAgendaOpen(false);
                        setEditingEvent(null);
                      }}
                      className="h-9 px-4 rounded-lg text-xs font-bold text-[#63716E] hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      className="h-9 px-4 text-xs font-bold bg-[#0E4D41] hover:bg-[#203430] text-white select-none"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Category Management Sub-Modal */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 bg-[#203430]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative gap-4 flex flex-col shadow-2xl border border-slate-150 animate-slide-up">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[#0E4D41]" />
                  <h3 className="text-sm font-bold text-[#203430]">
                    Manage Agenda Categories
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    setCategoryError("");
                  }}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {categoryError && (
                <div className="text-xs bg-red-50 text-red-600 px-3 py-2 rounded-lg font-medium border border-red-100 animate-fade-in text-left">
                  {categoryError}
                </div>
              )}

              {/* Form to Add New Category */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-line space-y-3">
                <p className="text-[11px] font-bold text-[#203430] uppercase tracking-wider text-left">
                  Create New Category
                </p>
                <div className="flex flex-col gap-2.5">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => {
                      setNewCatName(e.target.value);
                      if (categoryError) setCategoryError("");
                    }}
                    placeholder="Category Name... e.g. Design Feedback"
                    className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0E4D41] text-[#203430]"
                  />

                  {/* Quick Color Picker */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#63716E]">
                      Choose Theme Color
                    </span>
                    <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200">
                      {(
                        ["green", "amber", "blue", "rose", "slate"] as const
                      ).map((color) => {
                        const isActive = newCatColor === color;
                        let bgClass = "bg-[#0E4D41]";
                        if (color === "amber") bgClass = "bg-amber-500";
                        else if (color === "blue") bgClass = "bg-sky-400";
                        else if (color === "rose") bgClass = "bg-rose-500";
                        else if (color === "slate") bgClass = "bg-slate-400";

                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => {
                              setNewCatColor(color);
                              if (categoryError) setCategoryError("");
                            }}
                            className={cn(
                              "h-5 w-5 rounded-full border border-black/5 transition-all relative flex items-center justify-center",
                              bgClass,
                              isActive
                                ? "ring-2 ring-offset-1 ring-[#0E4D41] scale-110"
                                : "opacity-80 hover:opacity-100",
                            )}
                            title={`${color} theme`}
                          >
                            {isActive && (
                              <span className="h-1.5 w-1.5 bg-white rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCatName.trim()) {
                        setCategoryError("Please enter a category name.");
                        return;
                      }
                      // Avoid duplicates
                      if (
                        categories.some(
                          (c) =>
                            c.name.toLowerCase() ===
                            newCatName.trim().toLowerCase(),
                        )
                      ) {
                        setCategoryError(
                          "A category with this name already exists!",
                        );
                        return;
                      }
                      const newCatItem = {
                        id: String(Date.now()),
                        name: newCatName.trim(),
                        colorScheme: newCatColor,
                        isActive: true,
                      };
                      setCategories((prev) => [...prev, newCatItem]);
                      setNewCatName("");
                      setCategoryError("");
                    }}
                    className="text-[10px] font-bold bg-[#0E4D41] hover:bg-[#1a5b4f] text-white px-3 py-1.5 rounded-lg transition-all"
                  >
                    + Create Category
                  </button>
                </div>
              </div>

              {/* Category List with Delete & Toggle & Color Dot */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                <p className="text-[11px] font-bold text-[#63716E] text-left uppercase tracking-wider">
                  Existing Categories
                </p>
                {categories.map((cat) => {
                  const details = getCategoryCardDetails(cat.name);
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-line bg-white hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-3 w-3 rounded-full border border-black/5",
                            details.bgColor,
                          )}
                        />
                        <span
                          className={cn(
                            "text-xs font-bold transition-all text-left",
                            cat.isActive
                              ? "text-[#203430]"
                              : "text-slate-400 line-through font-normal",
                          )}
                        >
                          {cat.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Toggle active / inactive */}
                        <button
                          type="button"
                          onClick={() => {
                            setCategories((prev) =>
                              prev.map((c) =>
                                c.id === cat.id
                                  ? { ...c, isActive: !c.isActive }
                                  : c,
                              ),
                            );
                            setCategoryError("");
                          }}
                          className={cn(
                            "text-[9px] px-2 py-1 rounded-md font-bold transition-all border",
                            cat.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200",
                          )}
                          title={
                            cat.isActive
                              ? "Deactivate Category"
                              : "Activate Category"
                          }
                        >
                          {cat.isActive ? "Active" : "Disabled"}
                        </button>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => {
                            // Enforce at least 1 active category
                            const activeCatsLeft = categories.filter(
                              (c) => c.id !== cat.id && c.isActive,
                            );
                            if (activeCatsLeft.length === 0) {
                              setCategoryError(
                                "You must have at least one active category in the workspace!",
                              );
                              return;
                            }
                            setCategories((prev) =>
                              prev.filter((c) => c.id !== cat.id),
                            );
                            setCategoryError("");
                          }}
                          className="p-1 px-1.5 rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                          title="Remove Category"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    setCategoryError("");
                  }}
                  className="px-4 py-2 bg-[#0E4D41] text-white rounded-lg text-xs font-bold hover:bg-[#1a5b4f] transition-colors text-center"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="flex items-center gap-3 bg-[#E4F2D3] border-none p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0E4D41] text-white">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <span className="text-xs font-medium text-[#63716E]">
                Total All
                <br />
                Schedules
              </span>
              <span className="text-2xl font-bold text-[#203430]">
                {events.length}
              </span>
            </div>
          </Card>

          {[
            {
              label: "Talent Acquisition",
              val: events.filter((e) => e.category === "Talent Acquisition")
                .length,
              icon: Handshake,
            },
            {
              label: "Employee Development",
              val: events.filter((e) => e.category === "Employee Development")
                .length,
              icon: UserCog,
            },
            {
              label: "Workplace Engagement",
              val: events.filter(
                (e) =>
                  e.category === "Workplace Engagement" ||
                  e.category === "Internal",
              ).length,
              icon: Users,
            },
          ].map((stat) => (
            <Card key={stat.label} className="flex items-center gap-3 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-brand">
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-xs font-medium text-[#63716E] leading-tight">
                  {stat.label.split(" ")[0]}
                  <br />
                  {stat.label.split(" ")[1] || "Engagement"}
                </span>
                <span className="text-2xl font-bold text-[#203430]">
                  {stat.val}
                </span>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Filter Sidebar */}
          <Card className="w-full shrink-0 border-r border-line lg:w-[200px] bg-white p-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-[#203430]">Filter</h3>
              <button className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-[#203430]">Agenda</p>
                <div className="space-y-3">
                  {[
                    "Recruitment",
                    "Interview Schedules",
                    "Onboarding Session",
                    "Training Programs",
                    "Coaching Sessions",
                    "Performance Review",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-3 w-3 rounded-[3px] border-brand text-brand ring-0 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-[10px] font-medium text-[#63716E] group-hover:text-slate-900 transition-colors">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                <p className="text-[11px] font-bold text-[#203430]">Category</p>
                <div className="space-y-3">
                  {categories.map((cat) => {
                    const details = getCategoryCardDetails(cat.name);
                    return (
                      <div
                        key={cat.id}
                        className={cn(
                          "flex items-center gap-2 transition-opacity",
                          !cat.isActive && "opacity-45",
                        )}
                      >
                        <div
                          className={cn(
                            "h-2.5 w-2.5 rounded-[2px] border border-black/5",
                            details.bgColor,
                          )}
                        />
                        <span className="text-[10px] font-medium text-[#63716E]">
                          {cat.name}
                        </span>
                        {!cat.isActive && (
                          <span className="text-[8px] text-slate-400 font-bold scale-90 px-1 bg-slate-100 rounded ml-auto">
                            disabled
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Calendar Grid Area */}
          <Card className="flex-1 p-4 bg-white overflow-hidden">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center gap-2 group cursor-pointer text-left">
                <h2 className="text-lg font-bold text-[#1E1E20]">June 2035</h2>
                <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-brand transition-colors" />
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 bg-[#E4F2D3] px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-700">
                  <FilterIcon className="h-3.5 w-3.5" /> Filter{" "}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button className="flex items-center gap-2 bg-[#E4F2D3] px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-700">
                  <CalendarIcon className="h-3.5 w-3.5" /> Month{" "}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <Button
                  onClick={() => setIsNewAgendaOpen(true)}
                  className="h-8 gap-1 px-3 text-[11px] font-bold shadow-lg shadow-brand/20"
                >
                  <Plus className="h-3.5 w-3.5" /> New Agenda
                </Button>
              </div>
            </div>

            <div className="border-t border-line">
              <div className="grid grid-cols-7 border-b border-line">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="py-2.5 text-center text-[11px] font-bold text-[#203430] uppercase tracking-wider"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              <div className="grid grid-cols-7 border-l border-slate-50">
                {/* Empty cells for previous month */}
                {[27, 28, 29, 30, 31].map((d) => (
                  <div
                    key={d}
                    className="h-32 border-r border-b border-slate-50 bg-[#F3F3F0] p-2 flex flex-col items-end"
                  >
                    <span className="text-[11px] font-medium text-[#A4ACAB]">
                      {d}
                    </span>
                  </div>
                ))}

                {/* June cells */}
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  const cellEvents = events.filter((e) => e.day === day);
                  const isSelected = day === selectedDay;
                  const isToday = day === 21;

                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        "h-32 border-r border-b border-slate-50 p-1.5 flex flex-col gap-1 overflow-hidden transition-all hover:bg-slate-50/50 cursor-pointer text-left",
                        isSelected
                          ? "bg-white ring-2 ring-[#0E4D41] z-10"
                          : "",
                      )}
                    >
                      <div className="flex justify-between items-start mb-0.5">
                        <span
                          className={cn(
                            "text-[11px] font-bold w-full text-right",
                            isSelected ? "text-[#0E4D41]" : "text-[#203430]",
                          )}
                        >
                          {day}
                        </span>
                      </div>

                      <div className="space-y-1 overflow-y-auto hidden-scrollbar flex-1">
                        {cellEvents.map((evt, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "p-1.5 rounded-sm border-l-2 text-[8px] font-bold leading-tight transition-all hover:scale-[1.02]",
                              evt.color,
                            )}
                          >
                            <p className="line-clamp-2">{evt.title}</p>
                            {evt.time && (
                              <p className="mt-0.5 text-[7px] opacity-70">
                                {evt.time}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Details Sidebar */}
          <Card className="w-full shrink-0 lg:w-[240px] bg-white p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#203430]">
                Details Schedule
              </h3>
            </div>
            <p className="text-[10px] font-medium text-[#63716E] mb-4 text-left">
              {selectedDay} June 2035
            </p>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-1">
              {selectedDayEvents.length === 0 ? (
                <div className="py-8 px-4 text-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center space-y-2">
                  <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border border-line text-slate-300">
                    <Plus className="h-4 w-4" />
                  </div>
                  <p className="text-[10px] font-bold text-[#203430] mt-1">No Events Scheduled</p>
                  <p className="text-[9px] text-[#63716E] leading-normal max-w-[180px] mx-auto">There are no operational bookings or team meetings scheduled for June {selectedDay}.</p>
                  <button
                    onClick={() => {
                      setNewDay(selectedDay);
                      setIsNewAgendaOpen(true);
                    }}
                    className="text-[10px] font-bold text-[#0E4D41] hover:underline flex items-center gap-1 mt-2 bg-transparent border-none cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> New Calendar Event
                  </button>
                </div>
              ) : (
                selectedDayEvents.map((item, i) => {
                  const cardConfig = getCategoryCardDetails(item.category);
                  return (
                    <div
                      key={item.id || i}
                      className={cn(
                        "p-4 rounded-lg flex flex-col gap-4 border-l-2 transition-all text-left relative animate-fade-in group",
                        cardConfig.bgColor,
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2 flex-1 min-w-0">
                          <div
                            className={cn(
                              "inline-flex px-2 py-0.5 rounded text-[9px] font-bold",
                              cardConfig.tagBg,
                              cardConfig.textColor,
                            )}
                          >
                            {item.category}
                          </div>
                          <h4 className="text-xs font-bold text-[#203430] leading-tight text-left break-words">
                            {item.title}
                          </h4>
                        </div>
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="px-2.5 py-1 text-[10px] font-bold text-[#0E4D41] bg-white hover:bg-[#E4F2D3] border border-slate-200/60 rounded shadow-xs cursor-pointer select-none transition-colors active:scale-95 shrink-0"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="space-y-1.5 border-t border-line/40 pt-2 text-left">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-[#63716E]">Time</span>
                          <span className="font-bold text-[#203430]">
                            {item.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-[#63716E]">Location</span>
                          <span className="font-bold text-[#203430] text-right truncate max-w-[120px]">
                            {item.loc || "HQ"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 text-[10px] pt-1 text-left">
                          <span className="text-[#63716E] font-medium">
                            Note
                          </span>
                          <span className="font-normal text-[#203430] leading-normal text-left">
                            {item.note || "No details provided."}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pt-8 border-t border-line mb-8">
          <div className="flex items-center gap-6">
            <p className="text-[11px] text-[#203430] font-bold">
              Copyright © 2025 Peterdraw
            </p>
            <div className="flex gap-4">
              {["Privacy Policy", "Term and conditions", "Contact"].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-[11px] text-[#63716E] font-medium hover:text-brand transition-colors"
                  >
                    {link}
                  </a>
                ),
              )}
            </div>
          </div>
          <div className="flex gap-3">
            {[Facebook, Twitter, Instagram, Youtube, Linkedin].map(
              (Icon, i) => (
                <button
                  key={i}
                  className="text-[#63716E] hover:text-brand transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
