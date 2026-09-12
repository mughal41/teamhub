import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { getEmployeesForUser } from "@/src/lib/permissions";
import { Button } from "@/src/components/ui/Button";
import { Mail, Plus, Search, Send, Star, Inbox as InboxIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface TeamMessage {
  id: string;
  fromId: string;
  fromName: string;
  fromAvatar: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  unread: boolean;
  starred: boolean;
}

function seedMessages(): TeamMessage[] {
  return [
    {
      id: "m1",
      fromId: "EMP-0234",
      fromName: "Olivia Mason",
      fromAvatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      subject: "Leave request follow-up",
      preview: "Hi Marcus, just confirming my leave dates for the wedding...",
      body: "Hi Marcus,\n\nJust confirming my leave dates for the family wedding (25-27 June). Please let me know if you need coverage notes for the campaign handoff.\n\nThanks,\nOlivia",
      time: "10:24 AM",
      unread: true,
      starred: true,
    },
    {
      id: "m2",
      fromId: "EMP-0178",
      fromName: "Ethan Ray",
      fromAvatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      subject: "Design review ready",
      preview: "The homepage redesign mocks are ready for your feedback...",
      body: "Hi Marcus,\n\nThe homepage redesign mocks are ready for your feedback. I have shared the Figma link in the team folder.\n\nBest,\nEthan",
      time: "Yesterday",
      unread: true,
      starred: false,
    },
    {
      id: "m3",
      fromId: "EMP-0401",
      fromName: "Nora Chen",
      fromAvatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      subject: "Content calendar update",
      preview: "Updated June social calendar attached for approval...",
      body: "Hi Marcus,\n\nUpdated June social calendar attached for approval. Please flag any posts that need legal review.\n\nNora",
      time: "Mon",
      unread: false,
      starred: false,
    },
    {
      id: "m4",
      fromId: "EMP-0275",
      fromName: "Anya Rodriguez",
      fromAvatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
      subject: "Asset pack delivery",
      preview: "Brand illustration pack for Q3 campaign is uploaded...",
      body: "Hi Marcus,\n\nBrand illustration pack for Q3 campaign is uploaded to the shared drive. Ready for your review when you have a moment.\n\nAnya",
      time: "Sun",
      unread: false,
      starred: false,
    },
  ];
}

export default function ManagerInboxPage() {
  const { user } = useAuth();
  const myEmployeeId = user?.employeeId || "EMP-0100";
  const displayName = user?.name || "Manager";
  const displayAvatar =
    user?.avatar ||
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
  const team = React.useMemo(() => getEmployeesForUser(user), [user]);

  const [folder, setFolder] = React.useState<"Inbox" | "Starred" | "Sent">("Inbox");
  const [messages, setMessages] = React.useState<TeamMessage[]>(seedMessages);
  const [selectedId, setSelectedId] = React.useState("m1");
  const [search, setSearch] = React.useState("");
  const [reply, setReply] = React.useState("");
  const [showCompose, setShowCompose] = React.useState(false);
  const [composeTo, setComposeTo] = React.useState("");
  const [composeSubject, setComposeSubject] = React.useState("");
  const [composeBody, setComposeBody] = React.useState("");
  const [toast, setToast] = React.useState("");

  React.useEffect(() => {
    if (team.length > 0 && !composeTo) {
      setComposeTo(team[0].id);
    }
  }, [team, composeTo]);

  const selected = messages.find((m) => m.id === selectedId) || messages[0];

  const filtered = messages.filter((m) => {
    if (folder === "Starred" && !m.starred) return false;
    if (folder === "Sent" && m.fromId !== myEmployeeId) return false;
    if (folder === "Inbox" && m.fromId === myEmployeeId) return false;
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      m.fromName.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.preview.toLowerCase().includes(q)
    );
  });

  const unreadCount = messages.filter((m) => m.unread && m.fromId !== myEmployeeId).length;

  const openMessage = (id: string) => {
    setSelectedId(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)));
  };

  const toggleStar = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    );
  };

  const sendReply = () => {
    if (!reply.trim()) return;
    setToast("Reply sent to your team member.");
    setReply("");
    window.setTimeout(() => setToast(""), 2200);
  };

  const sendNew = (e: React.FormEvent) => {
    e.preventDefault();
    const member = team.find((t) => t.id === composeTo);
    if (!member || !user || !composeSubject.trim() || !composeBody.trim()) return;

    const msg: TeamMessage = {
      id: `m-${Date.now()}`,
      fromId: myEmployeeId,
      fromName: displayName,
      fromAvatar: displayAvatar,
      subject: composeSubject.trim(),
      preview: composeBody.trim().slice(0, 80),
      body: composeBody.trim(),
      time: "Just now",
      unread: false,
      starred: false,
    };
    setMessages((prev) => [msg, ...prev]);
    setSelectedId(msg.id);
    setFolder("Sent");
    setComposeSubject("");
    setComposeBody("");
    setShowCompose(false);
    setToast(`Message sent to ${member.name}.`);
    window.setTimeout(() => setToast(""), 2200);
  };

  return (
    <AppLayout
      title="Inbox"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Inbox" }]}
    >
      <div className="space-y-4">
        {toast ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {toast}
          </div>
        ) : null}

        <p className="text-sm text-slate-500">
          Team messaging only — conversations with your direct reports.
        </p>

        <div className="grid min-h-[620px] gap-4 lg:grid-cols-12">
          {/* Folders */}
          <div className="lg:col-span-2 rounded-2xl border border-[#E4E4E1] bg-white p-4">
            <Button
              type="button"
              className="mb-4 h-10 w-full gap-2 font-bold"
              onClick={() => setShowCompose(true)}
            >
              <Plus className="h-4 w-4" /> New Message
            </Button>
            <div className="space-y-1">
              {(
                [
                  { id: "Inbox" as const, icon: InboxIcon, count: unreadCount },
                  { id: "Starred" as const, icon: Star, count: messages.filter((m) => m.starred).length },
                  { id: "Sent" as const, icon: Send, count: messages.filter((m) => m.fromId === myEmployeeId).length },
                ]
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFolder(item.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    folder === item.id
                      ? "bg-[#28C2A9] text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.id}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[10px] font-bold",
                      folder === item.id ? "bg-white/20" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Message list */}
          <div className="lg:col-span-4 flex flex-col overflow-hidden rounded-2xl border border-[#E4E4E1] bg-white">
            <div className="border-b border-[#E4E4E1] p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search team messages..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#28C2A9]"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-4 py-12 text-center text-sm text-slate-400">No messages in this folder.</p>
              ) : (
                filtered.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => openMessage(m.id)}
                    className={cn(
                      "flex w-full gap-3 border-b border-slate-50 px-4 py-3 text-left hover:bg-slate-50",
                      selected?.id === m.id && "border-l-2 border-l-[#28C2A9] bg-[#28C2A9]/5"
                    )}
                  >
                    <img src={m.fromAvatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={cn(
                            "truncate text-sm",
                            m.unread ? "font-bold text-slate-900" : "font-medium text-slate-700"
                          )}
                        >
                          {m.fromName}
                        </p>
                        <span className="shrink-0 text-[10px] text-slate-400">{m.time}</span>
                      </div>
                      <p className="truncate text-xs font-semibold text-slate-600">{m.subject}</p>
                      <p className="truncate text-xs text-slate-400">{m.preview}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Reading pane */}
          <div className="lg:col-span-6 flex flex-col rounded-2xl border border-[#E4E4E1] bg-white">
            {selected ? (
              <>
                <div className="flex items-center gap-3 border-b border-[#E4E4E1] px-5 py-4">
                  <img
                    src={selected.fromAvatar}
                    alt=""
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{selected.fromName}</p>
                    <p className="truncate text-xs text-slate-500">{selected.subject}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleStar(selected.id)}
                    className="rounded-lg p-2 hover:bg-slate-50"
                    aria-label="Star message"
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        selected.starred ? "fill-amber-400 text-amber-400" : "text-slate-400"
                      )}
                    />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {selected.body}
                  </p>
                </div>
                <div className="border-t border-[#E4E4E1] p-4">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={3}
                    placeholder="Write a reply to your team member..."
                    className="mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
                  />
                  <Button type="button" onClick={sendReply} className="gap-2 font-bold">
                    <Send className="h-4 w-4" /> Send Message
                  </Button>
                </div>
              </>
            ) : (
              <div className="m-auto flex flex-col items-center text-slate-400">
                <Mail className="mb-2 h-8 w-8" />
                <p className="text-sm">Select a message</p>
              </div>
            )}
          </div>
        </div>

        {showCompose ? (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[1px]">
            <div className="w-full max-w-lg rounded-2xl border border-[#E4E4E1] bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">New team message</h3>
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
              <form className="space-y-3" onSubmit={sendNew}>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">To</label>
                  <select
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-brand"
                  >
                    {team.length === 0 ? (
                      <option value="">No team members</option>
                    ) : (
                      team.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Subject</label>
                  <input
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Message</label>
                  <textarea
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    required
                    rows={5}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <Button type="submit" className="w-full gap-2 font-bold" disabled={team.length === 0}>
                  <Send className="h-4 w-4" /> Send
                </Button>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
