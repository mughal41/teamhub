import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { getEmployeesForUser } from "@/src/lib/permissions";
import { getCollection } from "@/src/lib/db";
import { Button } from "@/src/components/ui/Button";
import { Star, LineChart } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface TeamReview {
  id?: number;
  employeeId: string;
  reliability: number;
  punctuality: number;
  taskCompletion: number;
  behavior: number;
  feedback: string;
  updatedAt?: string;
  updated_at?: string;
  reviewerName: string;
  average?: number;
  period?: string;
}

const REVIEW_KEY = "db_manager_reviews";

function avg(r: TeamReview) {
  return (
    (Number(r.reliability) + Number(r.punctuality) + Number(r.taskCompletion) + Number(r.behavior)) /
    4
  ).toFixed(1);
}

function loadReviews(): TeamReview[] {
  return getCollection<TeamReview[]>(REVIEW_KEY, []).map((r) => ({
    ...r,
    reliability: Number(r.reliability || 0),
    punctuality: Number(r.punctuality || 0),
    taskCompletion: Number(r.taskCompletion || 0),
    behavior: Number(r.behavior || 0),
    reviewerName: r.reviewerName || "",
  }));
}

export default function ManagerPerformancePage() {
  const { user } = useAuth();
  const [teamTick, setTeamTick] = React.useState(0);
  const team = React.useMemo(() => getEmployeesForUser(user), [user, teamTick]);
  const [reviews, setReviews] = React.useState<TeamReview[]>(() => loadReviews());
  const [activeId, setActiveId] = React.useState("");
  const [form, setForm] = React.useState({
    reliability: 4,
    punctuality: 4,
    taskCompletion: 4,
    behavior: 4,
    feedback: "",
  });
  const [savedMsg, setSavedMsg] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    void (async () => {
      try {
        const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
        await syncCollectionsFromApi();
      } catch {
        // keep cached
      }
      setReviews(loadReviews());
      setTeamTick((n) => n + 1);
    })();
    const onUpdate = () => {
      setReviews(loadReviews());
      setTeamTick((n) => n + 1);
    };
    window.addEventListener("db_updated", onUpdate);
    return () => window.removeEventListener("db_updated", onUpdate);
  }, []);

  React.useEffect(() => {
    if (!activeId && team[0]?.id) setActiveId(team[0].id);
  }, [team, activeId]);

  const active = team.find((e) => e.id === activeId) || team[0];

  React.useEffect(() => {
    if (!activeId) return;
    const existing = reviews.find((r) => r.employeeId === activeId);
    if (existing) {
      setForm({
        reliability: existing.reliability,
        punctuality: existing.punctuality,
        taskCompletion: existing.taskCompletion,
        behavior: existing.behavior,
        feedback: existing.feedback || "",
      });
    } else {
      setForm({
        reliability: 4,
        punctuality: 4,
        taskCompletion: 4,
        behavior: 4,
        feedback: "",
      });
    }
  }, [activeId, reviews]);

  const saveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active || !user) return;
    setSaving(true);
    try {
      const { upsertPerformance } = await import("@/src/lib/api/modules");
      const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
      const existing = reviews.find((r) => r.employeeId === active.id);
      const payload = {
        employeeCode: active.id,
        reliability: Math.round(form.reliability),
        punctuality: Math.round(form.punctuality),
        taskCompletion: Math.round(form.taskCompletion),
        behavior: Math.round(form.behavior),
        feedback: form.feedback,
        period: existing?.period || "Q3 2035",
      };
      await upsertPerformance(payload, existing?.id);
      await syncCollectionsFromApi();
      setReviews(loadReviews());
      setSavedMsg(`Review saved for ${active.name}.`);
      setTimeout(() => setSavedMsg(""), 2500);
    } catch (err) {
      setSavedMsg(err instanceof Error ? err.message : "Could not save review.");
      setTimeout(() => setSavedMsg(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const ScoreField = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (n: number) => void;
  }) => (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-sm font-bold text-[#0E4D41]">{value.toFixed(1)} / 5</span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#28C2A9]"
      />
    </div>
  );

  return (
    <AppLayout
      title="Performance"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Performance" }]}
    >
      <div className="space-y-6">
        {savedMsg && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {savedMsg}
          </div>
        )}

        <p className="text-sm text-slate-500">
          Rate and leave feedback for your direct reports. Review cycles are configured by Admin/HR.
        </p>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
              <LineChart className="h-4 w-4 text-[#28C2A9]" /> Team members
            </h3>
            {team.map((emp) => {
              const review = reviews.find((r) => r.employeeId === emp.id);
              return (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => setActiveId(emp.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition",
                    active?.id === emp.id
                      ? "border-[#28C2A9] bg-[#28C2A9]/5"
                      : "border-line bg-white hover:border-slate-200"
                  )}
                >
                  <img src={emp.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{emp.name}</p>
                    <p className="truncate text-xs text-slate-500">{emp.role}</p>
                  </div>
                  {review ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E4F2D3] px-2 py-1 text-[10px] font-bold text-[#0E4D41]">
                      <Star className="h-3 w-3" /> {avg(review)}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">Not rated</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-3 admin-panel p-6">
            {!active ? (
              <p className="py-16 text-center text-sm text-slate-400">No team members to review.</p>
            ) : (
              <form className="space-y-5" onSubmit={(e) => void saveReview(e)}>
                <div className="flex items-center gap-4 border-b border-line pb-5">
                  <img src={active.avatar} alt="" className="h-14 w-14 rounded-2xl object-cover" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{active.name}</h3>
                    <p className="text-sm text-slate-500">
                      {active.role} · {active.id}
                    </p>
                  </div>
                </div>

                <ScoreField
                  label="Reliability"
                  value={form.reliability}
                  onChange={(n) => setForm((f) => ({ ...f, reliability: n }))}
                />
                <ScoreField
                  label="Punctuality"
                  value={form.punctuality}
                  onChange={(n) => setForm((f) => ({ ...f, punctuality: n }))}
                />
                <ScoreField
                  label="Task Completion"
                  value={form.taskCompletion}
                  onChange={(n) => setForm((f) => ({ ...f, taskCompletion: n }))}
                />
                <ScoreField
                  label="Behavior / Collaboration"
                  value={form.behavior}
                  onChange={(n) => setForm((f) => ({ ...f, behavior: n }))}
                />

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Manager feedback</label>
                  <textarea
                    value={form.feedback}
                    onChange={(e) => setForm((f) => ({ ...f, feedback: e.target.value }))}
                    rows={4}
                    placeholder="Share strengths, growth areas, and next goals..."
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-slate-400">
                    Average score:{" "}
                    <span className="font-bold text-[#0E4D41]">
                      {(
                        (form.reliability +
                          form.punctuality +
                          form.taskCompletion +
                          form.behavior) /
                        4
                      ).toFixed(1)}
                    </span>
                  </p>
                  <Button type="submit" className="font-bold" disabled={saving}>
                    {saving ? "Saving..." : "Save Review"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
