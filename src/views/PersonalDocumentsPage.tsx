import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import {
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Download,
  Trash2,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Search,
  X,
  Lock,
  Database,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

type DocStatus = "Verified" | "Pending Verification" | "Expiring Soon";
type DocType = "Contracts" | "Tax & Financial" | "Certifications" | "Identification";

type DocumentItem = {
  id: string;
  name: string;
  type: DocType;
  tag: string;
  date: string;
  status: DocStatus;
  sizeMB: number;
  internalOnly?: boolean;
};

type ActivityItem = {
  id: string;
  action: string;
  time: string;
  icon: "verified" | "upload" | "trash" | "download";
};

function docsKey(userId: string) {
  return `db_personal_documents:${userId}`;
}
function activityKey(userId: string) {
  return `db_personal_documents_activity:${userId}`;
}

function seedDocs(): DocumentItem[] {
  return [
    {
      id: "doc-1",
      name: "Employment_Agreement_2024.pdf",
      type: "Contracts",
      tag: "Legal",
      date: "Jan 12, 2024",
      status: "Verified",
      sizeMB: 1.2,
      internalOnly: true,
    },
    {
      id: "doc-2",
      name: "Passport_ID_Scan.jpg",
      type: "Identification",
      tag: "ID",
      date: "May 05, 2024",
      status: "Pending Verification",
      sizeMB: 2.4,
    },
    {
      id: "doc-3",
      name: "Work_Visa_2024.pdf",
      type: "Contracts",
      tag: "Legal",
      date: "Exp. Jul 20, 2026",
      status: "Expiring Soon",
      sizeMB: 0.8,
      internalOnly: true,
    },
    {
      id: "doc-4",
      name: "Tax_Declaration_Q1.xlsx",
      type: "Tax & Financial",
      tag: "Tax",
      date: "Apr 15, 2024",
      status: "Verified",
      sizeMB: 0.4,
    },
  ];
}

function seedActivity(): ActivityItem[] {
  return [
    { id: "a1", action: "Employment agreement verified by HR", time: "2 days ago", icon: "verified" },
    { id: "a2", action: "Passport scan uploaded", time: "1 week ago", icon: "upload" },
  ];
}

function loadDocs(userId: string): DocumentItem[] {
  const raw = localStorage.getItem(docsKey(userId));
  if (!raw) {
    const seeded = seedDocs();
    localStorage.setItem(docsKey(userId), JSON.stringify(seeded));
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedDocs();
  } catch {
    return seedDocs();
  }
}

function loadActivity(userId: string): ActivityItem[] {
  const raw = localStorage.getItem(activityKey(userId));
  if (!raw) {
    const seeded = seedActivity();
    localStorage.setItem(activityKey(userId), JSON.stringify(seeded));
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedActivity();
  } catch {
    return seedActivity();
  }
}

function formatSize(mb: number) {
  if (mb < 1) return `${Math.round(mb * 1024)} KB`;
  return `${mb.toFixed(1)} MB`;
}

function iconFor(name: string) {
  if (/\.(png|jpg|jpeg|webp)$/i.test(name)) return ImageIcon;
  if (/\.(xlsx|xls|csv)$/i.test(name)) return FileSpreadsheet;
  return FileText;
}

export default function PersonalDocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = React.useState<DocumentItem[]>(() =>
    user ? loadDocs(user.id) : []
  );
  const [activities, setActivities] = React.useState<ActivityItem[]>(() =>
    user ? loadActivity(user.id) : []
  );
  const [tab, setTab] = React.useState<"All" | DocType>("All");
  const [statusFilter, setStatusFilter] = React.useState<"All" | DocStatus>("All");
  const [search, setSearch] = React.useState("");
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [toast, setToast] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<DocType>("Contracts");
  const [internalOnly, setInternalOnly] = React.useState(false);
  const [pendingFile, setPendingFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (!user) return;
    setDocuments(loadDocs(user.id));
    setActivities(loadActivity(user.id));
  }, [user?.id]);

  const persistDocs = (next: DocumentItem[]) => {
    setDocuments(next);
    if (user) localStorage.setItem(docsKey(user.id), JSON.stringify(next));
  };

  const persistActivity = (next: ActivityItem[]) => {
    setActivities(next);
    if (user) localStorage.setItem(activityKey(user.id), JSON.stringify(next));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2400);
  };

  const pushActivity = (action: string, icon: ActivityItem["icon"]) => {
    const next = [
      { id: `a-${Date.now()}`, action, time: "Just now", icon },
      ...activities,
    ].slice(0, 8);
    persistActivity(next);
  };

  const filtered = documents.filter((doc) => {
    if (tab !== "All" && doc.type !== tab) return false;
    if (statusFilter !== "All" && doc.status !== statusFilter) return false;
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.tag.toLowerCase().includes(q) ||
      doc.type.toLowerCase().includes(q)
    );
  });

  const usedMB = documents.reduce((sum, d) => sum + d.sizeMB, 0);
  const limitMB = 50;
  const usedPct = Math.min(100, Math.round((usedMB / limitMB) * 100));

  const downloadDoc = (doc: DocumentItem) => {
    const blob = new Blob(
      [`TeamHub document stub\nName: ${doc.name}\nOwner: ${user?.name || "User"}\n`],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name.replace(/\.[^.]+$/, "") + ".txt";
    a.click();
    URL.revokeObjectURL(url);
    pushActivity(`Downloaded ${doc.name}`, "download");
    showToast(`Downloaded ${doc.name}`);
  };

  const deleteDoc = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    persistDocs(documents.filter((d) => d.id !== id));
    if (doc) {
      pushActivity(`Deleted ${doc.name}`, "trash");
      showToast("Document removed.");
    }
  };

  const cycleStatus = (id: string) => {
    const order: DocStatus[] = ["Pending Verification", "Verified", "Expiring Soon"];
    persistDocs(
      documents.map((d) => {
        if (d.id !== id) return d;
        const next = order[(order.indexOf(d.status) + 1) % order.length];
        return { ...d, status: next };
      })
    );
    showToast("Document status updated.");
  };

  const acceptFile = (file: File | null) => {
    if (!file) return;
    setPendingFile(file);
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, "").replace(/_/g, " "));
  };

  const commitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingFile || !title.trim()) {
      showToast("Choose a file and enter a title.");
      return;
    }
    const sizeMB = Math.max(0.1, Number((pendingFile.size / (1024 * 1024)).toFixed(2)));
    const nextDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: pendingFile.name,
      type: category,
      tag: category === "Tax & Financial" ? "Tax" : category === "Identification" ? "ID" : "Personal",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Pending Verification",
      sizeMB,
      internalOnly,
    };
    persistDocs([nextDoc, ...documents]);
    pushActivity(`Uploaded ${pendingFile.name}`, "upload");
    setUploadOpen(false);
    setPendingFile(null);
    setTitle("");
    setInternalOnly(false);
    setCategory("Contracts");
    showToast("Document uploaded to your vault.");
  };

  const statusStyle = (status: DocStatus) => {
    if (status === "Verified") return "bg-emerald-50 text-emerald-700";
    if (status === "Expiring Soon") return "bg-amber-50 text-amber-700";
    return "bg-sky-50 text-sky-700";
  };

  return (
    <AppLayout
      title="Personal Documents"
      breadcrumbs={[{ label: "Settings" }, { label: "Personal Documents" }]}
    >
      <div className="w-full space-y-6">
        {toast ? (
          <div className="fixed right-6 top-24 z-[80] flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-800 shadow-lg">
            <CheckCircle2 className="h-4 w-4" />
            {toast}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 admin-panel p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Your personal document vault for {user?.name || "your account"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Upload contracts, IDs, and tax files. HR can verify sensitive items.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#28C2A9] px-4 text-sm font-bold text-white hover:bg-[#209f8a]"
          >
            <Plus className="h-4 w-4" />
            Upload document
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="admin-panel p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search documents"
                    className="h-11 w-full rounded-xl border border-line bg-white pl-10 pr-3 text-sm outline-none focus:border-[#28C2A9]"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="h-11 rounded-xl border border-line bg-[#F3F3F0] px-3 text-sm font-semibold text-slate-700"
                >
                  <option value="All">All statuses</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending Verification">Pending</option>
                  <option value="Expiring Soon">Expiring soon</option>
                </select>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(["All", "Contracts", "Tax & Financial", "Certifications", "Identification"] as const).map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTab(item)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                        tab === item
                          ? "bg-[#28C2A9] text-white"
                          : "bg-[#F3F3F0] text-slate-600 hover:bg-[#E4E4E1]"
                      )}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center">
                  <FileText className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                  <p className="font-semibold text-slate-800">No documents found</p>
                  <p className="mt-1 text-sm text-slate-500">Try another filter or upload a new file.</p>
                </div>
              ) : (
                filtered.map((doc) => {
                  const Icon = iconFor(doc.name);
                  return (
                    <div
                      key={doc.id}
                      className="rounded-2xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3F3F0] text-slate-600">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{doc.name}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {doc.type} · {doc.tag} · {doc.date} · {formatSize(doc.sizeMB)}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className={cn("rounded-md px-2 py-1 text-[11px] font-bold", statusStyle(doc.status))}>
                                {doc.status}
                              </span>
                              {doc.internalOnly ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-[#E4F2D3] px-2 py-1 text-[11px] font-bold text-[#0E4D41]">
                                  <Lock className="h-3 w-3" />
                                  Internal only
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => cycleStatus(doc.id)}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-semibold text-slate-700 hover:bg-[#F3F3F0]"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Status
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadDoc(doc)}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-semibold text-slate-700 hover:bg-[#F3F3F0]"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteDoc(doc.id)}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="admin-panel p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F2D3] text-[#0E4D41]">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900">Storage</h3>
              <p className="mt-1 text-sm text-slate-500">
                {formatSize(usedMB)} of {limitMB} MB used
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F3F3F0]">
                <div className="h-full rounded-full bg-[#28C2A9]" style={{ width: `${usedPct}%` }} />
              </div>
              {usedPct > 80 ? (
                <p className="mt-3 text-xs font-medium text-amber-700">
                  You’re nearing your personal vault limit. Remove old files to free space.
                </p>
              ) : (
                <p className="mt-3 text-xs text-slate-500">Plenty of space remaining for new uploads.</p>
              )}
            </div>

            <div className="admin-panel p-5">
              <h3 className="font-bold text-slate-900">Recent activity</h3>
              <div className="mt-4 space-y-3">
                {activities.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3F3F0] text-slate-600">
                      {item.icon === "verified" ? (
                        <ShieldCheck className="h-4 w-4" />
                      ) : item.icon === "trash" ? (
                        <Trash2 className="h-4 w-4" />
                      ) : item.icon === "download" ? (
                        <Download className="h-4 w-4" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.action}</p>
                      <p className="text-xs text-slate-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-panel p-5">
              <div className="mb-2 flex items-center gap-2 text-amber-700">
                <AlertTriangle className="h-4 w-4" />
                <h3 className="font-bold">Tip</h3>
              </div>
              <p className="text-sm text-slate-500">
                Mark sensitive files as internal-only so they’re flagged for HR review before wider
                access.
              </p>
            </div>
          </div>
        </div>
      </div>

      {uploadOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 p-4">
          <form
            onSubmit={commitUpload}
            className="w-full max-w-lg admin-panel p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Upload document</h3>
              <button type="button" onClick={() => setUploadOpen(false)} className="rounded-lg p-1.5 hover:bg-[#F3F3F0]">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <label
              onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                acceptFile(e.dataTransfer.files?.[0] || null);
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center",
                dragActive ? "border-[#28C2A9] bg-[#E4F2D3]/40" : "border-line bg-[#F3F3F0]"
              )}
            >
              <Upload className="mb-2 h-7 w-7 text-[#28C2A9]" />
              <p className="text-sm font-semibold text-slate-800">
                {pendingFile ? pendingFile.name : "Drop a file or click to browse"}
              </p>
              <p className="mt-1 text-xs text-slate-500">PDF, images, or spreadsheets</p>
              <input
                type="file"
                className="hidden"
                onChange={(e) => acceptFile(e.target.files?.[0] || null)}
              />
            </label>

            <div className="mt-4 space-y-3">
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-[#28C2A9]"
                  required
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DocType)}
                  className="h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-[#28C2A9]"
                >
                  <option value="Contracts">Contracts</option>
                  <option value="Tax & Financial">Tax & Financial</option>
                  <option value="Certifications">Certifications</option>
                  <option value="Identification">Identification</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={internalOnly}
                  onChange={(e) => setInternalOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-line text-[#28C2A9]"
                />
                Mark as internal only
              </label>
            </div>

            <button
              type="submit"
              className="mt-5 h-11 w-full rounded-xl bg-[#28C2A9] text-sm font-bold text-white hover:bg-[#209f8a]"
            >
              Add to vault
            </button>
          </form>
        </div>
      ) : null}
    </AppLayout>
  );
}
