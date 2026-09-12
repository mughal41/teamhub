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
  updatedAt: string;
  reviewerName: string;
};

function avg(r: TeamReview) {
  return ((r.reliability + r.punctuality + r.taskCompletion + r.behavior) / 4).toFixed(1);
}

export default function EmployeePerformancePage() {
  const { user } = useAuth();
  const reviews = getCollection<TeamReview[]>("db_manager_team_reviews", []);
  const mine = reviews.filter((r) => r.employeeId === user?.employeeId);
  const latest = mine[mine.length - 1];

  const fallback = {
    reliability: 4,
    punctuality: 4,
    taskCompletion: 4,
    behavior: 5,
    feedback: "Consistent delivery and strong collaboration with the marketing team.",
    updatedAt: "15 May 2035",
    reviewerName: "Marcus Brody",
  };

  const review = latest || fallback;
  const score = latest ? avg(latest) : "4.2";

  return (
    <AppLayout
      title="My Performance"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "My Performance" }]}
    >
      <div className="w-full space-y-6">
        <div className="rounded-2xl border border-[#E4E4E1] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
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

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Reliability", value: review.reliability },
            { label: "Punctuality", value: review.punctuality },
            { label: "Task completion", value: review.taskCompletion },
            { label: "Behavior", value: review.behavior },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
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
              <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}/5</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[#E4E4E1] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F2D3] text-[#0E4D41]">
              <LineChart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Manager feedback</h3>
              <p className="text-xs text-slate-500">
                From {review.reviewerName} · {review.updatedAt}
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">{review.feedback}</p>
        </div>
      </div>
    </AppLayout>
  );
}
