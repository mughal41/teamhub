import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { getCollection } from "@/src/lib/db";
import { LineChart, Star } from "lucide-react";

type TeamReview = {
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
};

function avg(r: TeamReview) {
  return (
    (Number(r.reliability) + Number(r.punctuality) + Number(r.taskCompletion) + Number(r.behavior)) /
    4
  ).toFixed(1);
}

export default function EmployeePerformancePage() {
  const { user } = useAuth();
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    void (async () => {
      try {
        const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
        await syncCollectionsFromApi();
      } catch {
        // keep cached
      }
      setTick((n) => n + 1);
    })();
    const onUpdate = () => setTick((n) => n + 1);
    window.addEventListener("db_updated", onUpdate);
    return () => window.removeEventListener("db_updated", onUpdate);
  }, []);

  const reviews = React.useMemo(() => {
    const primary = getCollection<TeamReview[]>("db_manager_team_reviews", []);
    const fallback = getCollection<TeamReview[]>("db_manager_reviews", []);
    return (primary.length ? primary : fallback).map((r) => ({
      ...r,
      reliability: Number(r.reliability || 0),
      punctuality: Number(r.punctuality || 0),
      taskCompletion: Number(r.taskCompletion || 0),
      behavior: Number(r.behavior || 0),
    }));
  }, [tick]);

  const mine = reviews.filter((r) => r.employeeId === user?.employeeId);
  const latest = mine[0]; // API orders by -updated_at

  const review = latest || {
    reliability: 0,
    punctuality: 0,
    taskCompletion: 0,
    behavior: 0,
    feedback: "No performance review has been shared yet.",
    updatedAt: "—",
    reviewerName: "—",
  };
  const score = latest ? avg(latest) : "—";
  const updatedLabel = latest?.updatedAt || latest?.updated_at || "—";

  return (
    <AppLayout
      title="My Performance"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "My Performance" }]}
    >
      <div className="w-full space-y-6">
        <div className="admin-panel p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Performance overview</h2>
              <p className="mt-1 text-sm text-slate-500">
                Scores shared by your manager. This view is read-only.
              </p>
            </div>
            <div className="rounded-2xl bg-[#28C2A9] px-5 py-4 text-white">
              <p className="text-sm text-white/80">Overall score</p>
              <p className="text-3xl font-bold">{score}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Reliability", value: review.reliability },
            { label: "Punctuality", value: review.punctuality },
            { label: "Task completion", value: review.taskCompletion },
            { label: "Behavior", value: review.behavior },
          ].map((item) => (
            <div key={item.label} className="admin-panel p-5">
              <p className="text-sm text-slate-500">{item.label}</p>
              <div className="mt-3 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < item.value ? "fill-[#28C2A9] text-[#28C2A9]" : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {latest ? `${item.value}/5` : "—"}
              </p>
            </div>
          ))}
        </div>

        <div className="admin-panel p-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F2D3] text-[#0E4D41]">
              <LineChart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Manager feedback</h3>
              <p className="text-xs text-slate-500">
                From {review.reviewerName} · {updatedLabel}
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">{review.feedback}</p>
        </div>
      </div>
    </AppLayout>
  );
}
