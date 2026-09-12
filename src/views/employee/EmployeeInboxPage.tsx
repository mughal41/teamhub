import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { getCollection, saveCollection, type Employee } from "@/src/lib/db";
import { Mail, Search, Star, Inbox as InboxIcon, Send } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface InboxMessage {
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

function mapEmails(myEmployeeId: string): InboxMessage[] {
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

export default function EmployeeInboxPage() {
  const { user } = useAuth();
  const myEmployeeId = user?.employeeId || "";
  const displayName = user?.name || "Employee";
  const displayAvatar =
    user?.avatar ||
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

  const [tick, setTick] = React.useState(0);
  const [folder, setFolder] = React.useState<"Inbox" | "Starred" | "Sent">("Inbox");
  const [messages, setMessages] = React.useState<InboxMessage[]>(() => mapEmails(myEmployeeId));
  const [selectedId, setSelectedId] = React.useState<string | number | null>(null);
  const [search, setSearch] = React.useState("");
  const [reply, setReply] = React.useState("");
  const [toast, setToast] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const employees = React.useMemo(
    () => getCollection<Employee[]>("db_employees", []),
    [tick]
  );
  const me = employees.find((e) => e.id === myEmployeeId);
  const manager =
    employees.find((e) => e.id === me?.managerId) ||
    (me?.managerEmail
      ? {
          id: me.managerId || "EMP-0100",
          name: me.managerName || "Manager",
          email: me.managerEmail,
          avatar: me.managerAvatar,
        }
      : null);

  const reload = React.useCallback(
    async (activeFolder = folder) => {
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
    },
    [folder, myEmployeeId, displayName, displayAvatar, selectedId]
  );

  React.useEffect(() => {
    void reload("Inbox");
    const onUpdate = () => setMessages(mapEmails(myEmployeeId));
    window.addEventListener("db_updated", onUpdate);
    return () => window.removeEventListener("db_updated", onUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const unread = messages.filter((m) => m.unread && m.fromId !== myEmployeeId).length;

  const resolveReplyEmail = () => {
    if (manager?.email) return manager.email;
    const byName = employees.find((e) => e.name === selected?.fromName);
    if (byName?.email) return byName.email;
    return "marcus.brody@teamhub.corp";
  };

  const sendReply = () => {
    if (!reply.trim() || !selected) return;
    void (async () => {
      setSending(true);
      try {
        const { sendMessage } = await import("@/src/lib/api/modules");
        await sendMessage({
          toEmail: resolveReplyEmail(),
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

  return (
    <AppLayout
      title="Inbox"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Inbox" }]}
    >
      <div className="w-full space-y-6">
        {toast ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {toast}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="admin-panel p-4 lg:col-span-2">
            {[
              { id: "Inbox" as const, icon: InboxIcon, count: unread },
              {
                id: "Starred" as const,
                icon: Star,
                count: messages.filter((m) => m.starred).length,
              },
              {
                id: "Sent" as const,
                icon: Send,
                count: messages.filter((m) => m.fromId === myEmployeeId).length,
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFolder(item.id)}
                className={cn(
                  "mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold",
                  folder === item.id ? "bg-[#28C2A9] text-white" : "text-slate-600 hover:bg-[#F3F3F0]"
                )}
              >
                <span className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.id}
                </span>
                <span
                  className={cn(
                    "rounded-md px-1.5 text-[10px]",
                    folder === item.id ? "bg-white/20" : "bg-slate-100 text-slate-500"
                  )}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm lg:col-span-4">
            <div className="border-b border-line p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search mail"
                  className="h-10 w-full rounded-xl border border-line bg-[#F3F3F0] pl-9 pr-3 text-sm outline-none focus:border-[#28C2A9] focus:bg-white"
                />
              </div>
            </div>
            <div className="max-h-[560px] overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400">No messages</p>
              ) : (
                filtered.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(m.id);
                      setMessages((prev) =>
                        prev.map((x) => (x.id === m.id ? { ...x, unread: false } : x))
                      );
                    }}
                    className={cn(
                      "flex w-full gap-3 border-b border-line px-4 py-3 text-left hover:bg-[#F3F3F0]",
                      selectedId === m.id && "bg-[#E4F2D3]/40"
                    )}
                  >
                    <img src={m.fromAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
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
                      <p className="truncate text-xs font-semibold text-slate-800">{m.subject}</p>
                      <p className="truncate text-xs text-slate-500">{m.preview}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="admin-panel p-5 lg:col-span-6">
            {!selected ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-slate-400">
                <Mail className="mb-2 h-8 w-8" />
                Select a message
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-start justify-between gap-3 border-b border-line pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selected.subject}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      From {selected.fromName} · to {user?.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setMessages((prev) =>
                        prev.map((m) =>
                          m.id === selected.id ? { ...m, starred: !m.starred } : m
                        )
                      )
                    }
                    className="rounded-lg p-2 hover:bg-[#F3F3F0]"
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        selected.starred ? "fill-amber-400 text-amber-400" : "text-slate-400"
                      )}
                    />
                  </button>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">
                  {selected.body}
                </pre>
                {folder !== "Sent" ? (
                  <div className="mt-6 border-t border-line pt-4">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      rows={3}
                      placeholder="Write a reply..."
                      className="w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-[#28C2A9]"
                    />
                    <button
                      type="button"
                      disabled={sending}
                      onClick={sendReply}
                      className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-[#28C2A9] px-4 text-sm font-bold text-white hover:bg-[#209f8a] disabled:opacity-60"
                    >
                      <Send className="h-4 w-4" />
                      {sending ? "Sending…" : "Send reply"}
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
