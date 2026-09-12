import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { getPayrollForUser } from "@/src/lib/permissions";
import { CircleDollarSign, Download, CheckCircle2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function EmployeePayslipPage() {
  const { user } = useAuth();
  const [tick, setTick] = React.useState(0);
  const [toast, setToast] = React.useState("");
  const [selectedKey, setSelectedKey] = React.useState<string>("");

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

  const payslips = React.useMemo(() => getPayrollForUser(user), [user, tick]);

  const slipKey = (p: (typeof payslips)[0]) =>
    p.payslipId != null ? `id-${p.payslipId}` : `date-${p.date}-${p.total}`;

  React.useEffect(() => {
    if (!payslips.length) {
      setSelectedKey("");
      return;
    }
    if (!selectedKey || !payslips.some((p) => slipKey(p) === selectedKey)) {
      setSelectedKey(slipKey(payslips[0]));
    }
  }, [payslips, selectedKey]);

  const selected = payslips.find((p) => slipKey(p) === selectedKey) || payslips[0];

  const download = () => {
    if (!selected || !user) return;
    const body = [
      "TeamHub Payslip",
      `Employee: ${user.name}`,
      `ID: ${user.employeeId}`,
      `Period: ${selected.date}`,
      `Salary: ${selected.salary}`,
      `Allowance: ${selected.allowance}`,
      `Overtime: ${selected.overtime}`,
      `Incentive: ${selected.incen}`,
      `Deduction: ${selected.deduct}`,
      `Net: ${selected.total}`,
      `Status: ${selected.status}`,
    ].join("\n");
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payslip-${selected.date.replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("Payslip downloaded.");
    window.setTimeout(() => setToast(""), 2200);
  };

  return (
    <AppLayout
      title="Payslips"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Payslips" }]}
    >
      <div className="w-full space-y-6">
        {toast ? (
          <div className="fixed right-6 top-24 z-[80] flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-800 shadow-lg">
            <CheckCircle2 className="h-4 w-4" />
            {toast}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-1">
            <div className="admin-panel p-5">
              <h3 className="font-bold text-slate-900">Pay periods</h3>
              <div className="mt-4 space-y-2">
                {payslips.length === 0 ? (
                  <p className="py-6 text-center text-sm text-slate-400">No payslips yet</p>
                ) : (
                  payslips.map((p) => {
                    const key = slipKey(p);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedKey(key)}
                        className={cn(
                          "w-full rounded-xl border px-3 py-3 text-left transition",
                          selected && slipKey(selected) === key
                            ? "border-[#28C2A9] bg-[#E4F2D3]/50"
                            : "border-line bg-[#F3F3F0] hover:border-[#28C2A9]"
                        )}
                      >
                        <p className="text-sm font-semibold text-slate-900">{p.date}</p>
                        <p className="text-xs text-slate-500">
                          {p.total} · {p.status}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="admin-panel p-6 lg:col-span-2">
            {!selected ? (
              <div className="py-16 text-center text-slate-400">
                <CircleDollarSign className="mx-auto mb-2 h-8 w-8" />
                No payslip selected
              </div>
            ) : (
              <>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Payslip · {selected.date}</h3>
                    <p className="text-sm text-slate-500">
                      {user?.name} · {user?.employeeId}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={download}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold text-slate-700 hover:bg-[#F3F3F0]"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Basic salary", selected.salary],
                    ["Allowance", selected.allowance],
                    ["Overtime", selected.overtime],
                    ["Incentive", selected.incen],
                    ["Deductions", selected.deduct],
                    ["Net pay", selected.total],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-line bg-[#F3F3F0]/60 px-4 py-3"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {label}
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-line bg-white px-4 py-3 text-sm text-slate-600">
                  Status:{" "}
                  <span
                    className={cn(
                      "font-bold",
                      selected.status === "Paid" ? "text-emerald-700" : "text-amber-700"
                    )}
                  >
                    {selected.status}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
