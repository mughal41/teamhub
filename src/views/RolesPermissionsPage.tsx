import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { ShieldCheck, Lock } from "lucide-react";
import {
  ROLE_DEFINITIONS,
  MODULE_LABELS,
  ACCESS_LEVEL_META,
  type ModuleKey,
  type AccessLevel,
} from "../lib/rbac";
import { useAuth } from "../context/AuthContext";
import { cn } from "@/src/lib/utils";

const MODULE_ORDER: ModuleKey[] = [
  "profile",
  "attendance",
  "leave",
  "timesheet",
  "payroll",
  "employees",
  "reports",
  "roles",
  "delete",
];

function AccessBadge({ level }: { level: AccessLevel }) {
  const meta = ACCESS_LEVEL_META[level];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
  );
}

export default function RolesPermissionsPage() {
  const { user, canManage } = useAuth();
  const canEdit = canManage("roles");

  return (
    <AppLayout
      title="User Roles & Permissions"
      breadcrumbs={[
        { label: "Settings", href: "/settings/personal-info" },
        { label: "Roles & Permissions" },
      ]}
    >
      <div className="mx-auto w-full max-w-7xl space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">
              Permission Matrix
            </h2>
            <p className="text-sm text-slate-500 font-medium max-w-2xl">
              Static role-based access for TeamHub. Levels match the product matrix — Full manage,
              Approve, View only, Own data, No access. Backend enforcement can be added later.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-500">
            <Lock className="h-3.5 w-3.5" />
            {canEdit ? "System admin view (static)" : "Read-only matrix"}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(ACCESS_LEVEL_META) as AccessLevel[]).map((level) => (
            <AccessBadge key={level} level={level} />
          ))}
        </div>

        {/* Role cards — matches screenshot layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {ROLE_DEFINITIONS.map((role) => {
            const isCurrent = user?.roleId === role.id;
            return (
              <div
                key={role.id}
                className={cn(
                  "bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col",
                  isCurrent ? "border-[#35BFA3] ring-2 ring-[#35BFA3]/20" : "border-slate-100"
                )}
              >
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-[#35BFA3]" />
                        {role.label}
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                        Scope: {role.scope}
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E4F2D3] text-[#0E4D41]">
                        You
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-5 py-4 space-y-2.5 flex-1">
                  {MODULE_ORDER.map((mod) => (
                    <div
                      key={mod}
                      className="flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="font-medium text-slate-600">{MODULE_LABELS[mod]}</span>
                      <AccessBadge level={role.permissions[mod]} />
                    </div>
                  ))}
                </div>

                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/30 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Functional notes
                  </p>
                  <ul className="space-y-1">
                    {role.notes.map((note) => (
                      <li key={note} className="text-[11px] text-slate-600 font-medium leading-snug">
                        • {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compact table view */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Full matrix table</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50">
                    Module
                  </th>
                  {ROLE_DEFINITIONS.map((r) => (
                    <th
                      key={r.id}
                      className="px-3 py-3 font-bold text-slate-700 whitespace-nowrap"
                    >
                      {r.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MODULE_ORDER.map((mod) => (
                  <tr key={mod} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-700 sticky left-0 bg-white">
                      {MODULE_LABELS[mod]}
                    </td>
                    {ROLE_DEFINITIONS.map((r) => (
                      <td key={r.id} className="px-3 py-3">
                        <AccessBadge level={r.permissions[mod]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
