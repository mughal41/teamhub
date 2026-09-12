import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { getEmployeesForUser } from "@/src/lib/permissions";
import { getCollection, saveCollection } from "@/src/lib/db";
import { Button } from "@/src/components/ui/Button";
import { Star, LineChart } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface TeamReview {
  employeeId: string;
  reliability: number;
  punctuality: number;
  taskCompletion: number;
  behavior: number;
  feedback: string;
  updatedAt: string;
  reviewerName: string;
}

const REVIEW_KEY = "db_manager_reviews";

function avg(r: TeamReview) {
  return (
    (r.reliability + r.punctuality + r.taskCompletion + r.behavior) / 4
  ).toFixed(1);
}

export default function ManagerPerformancePage() {
  const { user } = useAuth();
  const team = getEmployeesForUser(user);
  const [reviews, setReviews] = React.useState<TeamReview[]>(() =>
    getCollection<TeamReview[]>(REVIEW_KEY, [])
  );
  const [activeId, setActiveId] = React.useState(team[0]?.id || "");
  const [form, setForm] = React.useState({
    reliability: 4,
    punctuality: 4,
    taskCompletion: 4,
    behavior: 4,
    feedback: "",
  });
  const [savedMsg, setSavedMsg] = React.useState("");

  const active = team.find((e) => e.id === activeId) || team[0];

  React.useEffect(() => {
    if (!active) return;
    const existing = reviews.find((r) => r.employeeId === active.id);
    if (existing) {
      setForm({
        reliability: existing.reliability,
        punctuality: existing.punctuality,
        taskCompletion: existing.taskCompletion,
        behavior: existing.behavior,
        feedback: existing.feedback,
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
  }, [activeId, active, reviews]);

  const saveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!active || !user) return;
    const nextReview: TeamReview = {
      employeeId: active.id,
      ...form,
      updatedAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      reviewerName: user.name,
    };
    const next = [...reviews.filter((r) => r.employeeId !== active.id), nextReview];
    setReviews(next);
    saveCollection(REVIEW_KEY, next);
    setSavedMsg(`Review saved for ${active.name}.`);
    setTimeout(() => setSavedMsg(""), 2500);
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
        step={0.1}
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
                      : "border-[#E4E4E1] bg-white hover:border-slate-200"
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

          <div className="lg:col-span-3 rounded-2xl border border-[#E4E4E1] bg-white p-6">
            {!active ? (
              <p className="py-16 text-center text-sm text-slate-400">No team members to review.</p>
            ) : (
              <form className="space-y-5" onSubmit={saveReview}>
                <div className="flex items-center gap-4 border-b border-[#E4E4E1] pb-5">
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
                  <Button type="submit" className="font-bold">
                    Save Review
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
