import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Button } from "../components/ui/Button";
import { Cpu, Link2, KeyRound, Webhook, CheckCircle2 } from "lucide-react";

const INTEGRATIONS = [
  {
    id: "slack",
    name: "Slack",
    description: "Push leave approvals and attendance alerts to HR channels.",
    status: "Connected" as const,
  },
  {
    id: "google",
    name: "Google Workspace",
    description: "Sync company calendar events and holiday calendars.",
    status: "Connected" as const,
  },
  {
    id: "payroll-bank",
    name: "Bank Payroll Feed",
    description: "Export monthly payslip batches for bank processing.",
    status: "Not connected" as const,
  },
  {
    id: "sso",
    name: "SSO / SAML",
    description: "Enterprise single sign-on for Admin and staff portals.",
    status: "Not connected" as const,
  },
];

export default function ApiIntegrationsPage() {
  return (
    <AppLayout
      title="API & Integrations"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Settings" },
        { label: "API & Integrations" },
      ]}
    >
      <div className="space-y-6">
        <div className="admin-panel p-6">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E4F2D3] text-[#0E4D41]">
              <KeyRound className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900">API Access Keys</h2>
              <p className="mt-1 text-sm text-slate-500">
                Static preview for Admin. Live keys will be issued when the Django backend is connected.
              </p>
            </div>
            <Button className="font-bold" disabled>
              Generate Key
            </Button>
          </div>
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
            <Cpu className="mx-auto mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">No live API keys yet</p>
            <p className="mt-1 text-xs text-slate-400">
              Placeholder for Phase 8 (Django + PostgreSQL)
            </p>
          </div>
        </div>

        <div className="admin-panel p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Webhook className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Integrations</h2>
              <p className="text-sm text-slate-500">Connect TeamHub to your workplace tools</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {INTEGRATIONS.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-line bg-slate-50/50 p-5"
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#28C2A9]">
                    <Link2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900">{item.name}</h3>
                      {item.status === "Connected" && (
                        <CheckCircle2 className="h-4 w-4 text-[#28C2A9]" />
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={
                      item.status === "Connected"
                        ? "text-xs font-bold text-[#0E4D41]"
                        : "text-xs font-bold text-slate-400"
                    }
                  >
                    {item.status}
                  </span>
                  <Button variant="outline" className="h-9 text-xs font-bold">
                    {item.status === "Connected" ? "Manage" : "Connect"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
