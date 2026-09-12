import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { Mail, Search, Star, Inbox as InboxIcon, Send } from "lucide-react";
import { cn } from "@/src/lib/utils";

type Message = {
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
};

const seed: Message[] = [
  {
    id: "m1",
    fromId: "EMP-0100",
    fromName: "Marcus Brody",
    fromAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    subject: "Q3 campaign kickoff notes",
    preview: "Sharing the briefing deck for next week's launch...",
    body: "Hi Olivia,\n\nSharing the briefing deck for next week's launch. Please review section 2 before Thursday.\n\nMarcus",
    time: "10:24 AM",
    unread: true,
    starred: true,
  },
  {
    id: "m2",
    fromId: "hr",
    fromName: "HR Desk",
    fromAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    subject: "Leave policy reminder",
    preview: "Friendly reminder to submit leave at least 3 days ahead...",
    body: "Hello,\n\nFriendly reminder to submit leave at least 3 days ahead for planned absences.\n\nHR Team",
    time: "Yesterday",
    unread: false,
    starred: false,
  },
  {
    id: "m3",
    fromId: "EMP-0275",
    fromName: "Anya Rodriguez",
    fromAvatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    subject: "Asset files ready",
    preview: "Brand illustration pack for Q3 campaign is uploaded...",
    body: "Hi Olivia,\n\nBrand illustration pack for Q3 campaign is uploaded to the shared drive.\n\nAnya",
    time: "Mon",
    unread: false,
    starred: false,
  },
];

export default function EmployeeInboxPage() {
  const { user } = useAuth();
  const [folder, setFolder] = React.useState<"Inbox" | "Starred">("Inbox");
  const [messages, setMessages] = React.useState(seed);
  const [selectedId, setSelectedId] = React.useState("m1");
  const [search, setSearch] = React.useState("");
  const [reply, setReply] = React.useState("");
  const [toast, setToast] = React.useState("");

  const selected = messages.find((m) => m.id === selectedId) || messages[0];
  const filtered = messages.filter((m) => {
    if (folder === "Starred" && !m.starred) return false;
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      m.fromName.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.preview.toLowerCase().includes(q)
    );
  });

  const unread = messages.filter((m) => m.unread).length;

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
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:col-span-2">
            {[
              { id: "Inbox" as const, icon: InboxIcon, count: unread },
              { id: "Starred" as const, icon: Star, count: messages.filter((m) => m.starred).length },
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

          <div className="overflow-hidden rounded-2xl border border-[#E4E4E1] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:col-span-4">
            <div className="border-b border-[#E4E4E1] p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search mail"
                  className="h-10 w-full rounded-xl border border-[#E4E4E1] bg-[#F3F3F0] pl-9 pr-3 text-sm outline-none focus:border-[#28C2A9] focus:bg-white"
                />
              </div>
            </div>
            <div className="max-h-[560px] overflow-y-auto">
              {filtered.map((m) => (
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
                    "flex w-full gap-3 border-b border-[#E4E4E1] px-4 py-3 text-left hover:bg-[#F3F3F0]",
                    selectedId === m.id && "bg-[#E4F2D3]/40"
                  )}
                >
                  <img src={m.fromAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn("truncate text-sm", m.unread ? "font-bold text-slate-900" : "font-medium text-slate-700")}>
                        {m.fromName}
                      </p>
                      <span className="shrink-0 text-[10px] text-slate-400">{m.time}</span>
                    </div>
                    <p className="truncate text-xs font-semibold text-slate-800">{m.subject}</p>
                    <p className="truncate text-xs text-slate-500">{m.preview}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:col-span-6">
            {!selected ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-slate-400">
                <Mail className="mb-2 h-8 w-8" />
                Select a message
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-start justify-between gap-3 border-b border-[#E4E4E1] pb-4">
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
                <div className="mt-6 border-t border-[#E4E4E1] pt-4">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={3}
                    placeholder="Write a reply..."
                    className="w-full rounded-xl border border-[#E4E4E1] px-3 py-2 text-sm outline-none focus:border-[#28C2A9]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!reply.trim()) return;
                      setReply("");
                      setToast("Reply sent.");
                      window.setTimeout(() => setToast(""), 2000);
                    }}
                    className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-[#28C2A9] px-4 text-sm font-bold text-white hover:bg-[#209f8a]"
                  >
                    <Send className="h-4 w-4" />
                    Send reply
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
