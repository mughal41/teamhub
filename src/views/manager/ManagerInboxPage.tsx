import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { getEmployeesForUser } from "@/src/lib/permissions";
import { getCollection, saveCollection } from "@/src/lib/db";
import { Button } from "@/src/components/ui/Button";
import { Mail, Plus, Search, Send, Star, Inbox as InboxIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface TeamMessage {
  id: string | number;
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

function mapEmails(myEmployeeId: string): TeamMessage[] {
  const rows = getCollection<any[]>("db_emails", []);
  return rows.map((m, idx) => ({
    id: m.id ?? idx,
    fromId: String(m.fromId || (m.category === "Sent" ? myEmployeeId : "")),
    fromName: String(m.fromName || m.sender || "TeamHub"),
    fromAvatar: String(
      m.fromAvatar ||
        m.avatar ||
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
    ),
    subject: String(m.subject || m.title || "(No Subject)"),
    preview: String(m.preview || m.snippet || ""),
    body: String(m.body || m.preview || ""),
    time: String(m.time || "Today"),
    unread: Boolean(m.unread),
    starred: Boolean(m.starred),
  }));
}

export default function ManagerInboxPage() {
  const { user } = useAuth();
  const myEmployeeId = user?.employeeId || "";
  const displayName = user?.name || "Manager";
  const displayAvatar =
    user?.avatar ||
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
  const [tick, setTick] = React.useState(0);
  const team = React.useMemo(() => getEmployeesForUser(user), [user, tick]);

  const [folder, setFolder] = React.useState<"Inbox" | "Starred" | "Sent">("Inbox");
  const [messages, setMessages] = React.useState<TeamMessage[]>(() => mapEmails(myEmployeeId));
  const [selectedId, setSelectedId] = React.useState<string | number | null>(null);
  const [search, setSearch] = React.useState("");
  const [reply, setReply] = React.useState("");
  const [showCompose, setShowCompose] = React.useState(false);
  const [composeTo, setComposeTo] = React.useState("");
  const [composeSubject, setComposeSubject] = React.useState("");
  const [composeBody, setComposeBody] = React.useState("");
  const [toast, setToast] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const reload = React.useCallback(async (activeFolder = folder) => {
    try {
      const { listMessages } = await import("@/src/lib/api/modules");
      const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
      if (activeFolder === "Sent") {
        const sent = await listMessages("Sent");
        saveCollection(
          "db_emails",
          (sent as any[]).map((m, idx) => ({
            id: m.id ?? idx,
            fromId: myEmployeeId,
            sender: displayName,
            fromName: displayName,
            fromAvatar: displayAvatar,
            subject: m.subject,
            preview: m.preview,
            title: m.subject,
            snippet: m.preview,
            body: m.body,
            time: m.time,
            unread: false,
            starred: m.starred,
            avatar: displayAvatar,
            category: "Sent",
          }))
        );
      } else {
        await syncCollectionsFromApi();
      }
    } catch {
      // keep local
    }
    const next = mapEmails(myEmployeeId);
    setMessages(next);
    setTick((n) => n + 1);
    if (next.length && selectedId == null) setSelectedId(next[0].id);
  }, [folder, myEmployeeId, displayName, displayAvatar, selectedId]);

  React.useEffect(() => {
    void reload("Inbox");
    const onUpdate = () => setMessages(mapEmails(myEmployeeId));
    window.addEventListener("db_updated", onUpdate);
    return () => window.removeEventListener("db_updated", onUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (team.length > 0 && !composeTo) {
      const withEmail = team.find((t) => t.email) || team[0];
      setComposeTo(withEmail.id);
    }
  }, [team, composeTo]);

  React.useEffect(() => {
    void reload(folder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  const selected = messages.find((m) => m.id === selectedId) || messages[0];

  const filtered = messages.filter((m) => {
    if (folder === "Starred" && !m.starred) return false;
    if (folder === "Sent" && m.fromId && myEmployeeId && m.fromId !== myEmployeeId) return false;
    if (folder === "Inbox" && m.fromId && myEmployeeId && m.fromId === myEmployeeId) return false;
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      m.fromName.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.preview.toLowerCase().includes(q)
    );
  });

  const unreadCount = messages.filter((m) => m.unread && m.fromId !== myEmployeeId).length;

  const openMessage = (id: string | number) => {
    setSelectedId(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)));
  };

  const toggleStar = (id: string | number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    );
  };

  const resolveRecipientEmail = (employeeCode: string) => {
    const member = team.find((t) => t.id === employeeCode);
    if (member?.email) return member.email;
    const guess = `${String(member?.name || "team")
      .toLowerCase()
      .replace(/\s+/g, ".")}@teamhub.corp`;
    return guess;
  };

  const sendReply = () => {
    if (!reply.trim() || !selected) return;
    void (async () => {
      setSending(true);
      try {
        const { sendMessage } = await import("@/src/lib/api/modules");
        // Reply to original sender when possible via team email lookup by name
        const member = team.find((t) => t.name === selected.fromName);
        const toEmail = member?.email || resolveRecipientEmail(member?.id || composeTo);
        await sendMessage({
          toEmail,
          subject: selected.subject.startsWith("Re:") ? selected.subject : `Re: ${selected.subject}`,
          body: reply.trim(),
        });
        await reload("Sent");
        setFolder("Sent");
        setToast("Reply sent.");
        setReply("");
      } catch (err) {
        setToast(err instanceof Error ? err.message : "Could not send reply.");
      } finally {
        setSending(false);
        window.setTimeout(() => setToast(""), 2200);
      }
    })();
  };

  const sendNew = (e: React.FormEvent) => {
    e.preventDefault();
    const member = team.find((t) => t.id === composeTo);
    if (!member || !composeSubject.trim() || !composeBody.trim()) return;
    void (async () => {
      setSending(true);
      try {
        const { sendMessage } = await import("@/src/lib/api/modules");
        await sendMessage({
          toEmail: resolveRecipientEmail(member.id),
          subject: composeSubject.trim(),
          body: composeBody.trim(),
        });
        await reload("Sent");
        setFolder("Sent");
        setComposeSubject("");
        setComposeBody("");
        setShowCompose(false);
        setToast(`Message sent to ${member.name}.`);
      } catch (err) {
        setToast(err instanceof Error ? err.message : "Could not send message.");
      } finally {
        setSending(false);
        window.setTimeout(() => setToast(""), 2200);
      }
    })();
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

        <div className="grid min-h-[620px] gap-5 lg:grid-cols-12">
          <div className="lg:col-span-2 admin-panel p-4">
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
                  {
                    id: "Sent" as const,
                    icon: Send,
                    count: messages.filter((m) => m.fromId === myEmployeeId).length,
                  },
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

          <div className="lg:col-span-4 flex flex-col overflow-hidden admin-panel p-0">
            <div className="border-b border-line p-3">
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

          <div className="lg:col-span-6 flex flex-col admin-panel p-0">
            {selected ? (
              <>
                <div className="flex items-center gap-3 border-b border-line px-5 py-4">
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
                <div className="border-t border-line p-4">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={3}
                    placeholder="Write a reply to your team member..."
                    className="mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
                  />
                  <Button type="button" onClick={sendReply} className="gap-2 font-bold" disabled={sending}>
                    <Send className="h-4 w-4" /> {sending ? "Sending..." : "Send Message"}
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
            <div className="w-full max-w-lg admin-panel p-6 shadow-2xl">
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
                          {m.email ? ` (${m.email})` : ""}
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
                <Button type="submit" className="w-full gap-2 font-bold" disabled={team.length === 0 || sending}>
                  <Send className="h-4 w-4" /> {sending ? "Sending..." : "Send"}
                </Button>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
