import * as React from "react";
import { AppLayout } from "@/src/components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import { getEmployeesForUser } from "@/src/lib/permissions";
import { Search, Users, Eye } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function MyTeamPage() {
  const { user } = useAuth();
  const team = getEmployeesForUser(user);
  const [search, setSearch] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const filtered = team.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.dept.toLowerCase().includes(search.toLowerCase())
  );

  const selected = team.find((e) => e.id === selectedId) || filtered[0] || null;

  return (
    <AppLayout
      title="My Team"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "My Team" }]}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              View-only list of employees who report to you. Salary and role edits are Admin-only.
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search team member..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#28C2A9] focus:ring-1 focus:ring-[#28C2A9] sm:w-72"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#28C2A9]/15 text-[#0E4D41]">
              <Users className="h-4 w-4" />
            </div>
            <p className="text-sm text-slate-500">Team size</p>
            <p className="text-2xl font-bold text-slate-900">{team.length}</p>
          </div>
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm text-slate-500">Active</p>
            <p className="text-2xl font-bold text-slate-900">
              {team.filter((e) => e.status === "Active").length}
            </p>
          </div>
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm text-slate-500">On leave / away</p>
            <p className="text-2xl font-bold text-slate-900">
              {team.filter((e) => e.status !== "Active").length}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-2xl border border-[#E4E4E1] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left bg-white">
                <thead>
                  <tr className="border-b border-[#E4E4E1] bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3">Employee</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">View</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">
                        No team members found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((emp) => (
                      <tr
                        key={emp.id}
                        className={cn(
                          "border-b border-slate-50 hover:bg-slate-50/80 cursor-pointer",
                          selected?.id === emp.id && "bg-[#28C2A9]/5"
                        )}
                        onClick={() => setSelectedId(emp.id)}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img src={emp.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{emp.name}</p>
                              <p className="text-xs text-slate-400">{emp.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <p>{emp.role}</p>
                          <p className="text-xs text-slate-400">{emp.dept}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {emp.type}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-xs font-bold",
                              emp.status === "Active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            )}
                          >
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Eye className="ml-auto h-4 w-4 text-slate-400" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-[#E4E4E1] bg-white p-6">
            {selected ? (
              <div className="space-y-5">
                <div className="text-center">
                  <img
                    src={selected.avatar}
                    alt=""
                    className="mx-auto h-24 w-24 rounded-2xl object-cover ring-4 ring-[#28C2A9]/20"
                  />
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{selected.name}</h3>
                  <p className="text-sm text-[#0E4D41] font-semibold">{selected.role}</p>
                  <p className="text-xs text-slate-400 mt-1">{selected.id}</p>
                </div>
                <div className="space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Department</span>
                    <span className="font-semibold text-slate-800 text-right">{selected.dept}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Work model</span>
                    <span className="font-semibold text-slate-800">{selected.model}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Join date</span>
                    <span className="font-semibold text-slate-800">{selected.joinDate}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Status</span>
                    <span className="font-semibold text-slate-800">{selected.status}</span>
                  </div>
                </div>
                <p className="rounded-xl border border-dashed border-slate-200 px-3 py-3 text-center text-xs text-slate-400">
                  Read-only profile. Contact HR/Admin to update salary, role, or department.
                </p>
              </div>
            ) : (
              <p className="py-16 text-center text-sm text-slate-400">Select a team member</p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
