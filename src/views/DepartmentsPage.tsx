import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { getCollection, saveCollection, type Department, type Employee } from "../lib/db";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Search,
  Plus,
  Building2,
  Users,
  UserCog,
  Pencil,
  Trash2,
  X,
  Briefcase,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function DepartmentsPage() {
  const [departments, setDepartments] = React.useState<Department[]>(() =>
    getCollection<Department[]>("db_departments", [])
  );
  const [employees] = React.useState<Employee[]>(() =>
    getCollection<Employee[]>("db_employees", [])
  );
  const [search, setSearch] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Department | null>(null);
  const [form, setForm] = React.useState({
    name: "",
    code: "",
    headName: "",
    description: "",
    status: "Active" as Department["status"],
  });
  const [error, setError] = React.useState("");

  const sync = (next: Department[]) => {
    setDepartments(next);
    saveCollection("db_departments", next);
  };

  const headcount = (deptName: string) =>
    employees.filter((e) => e.dept.toLowerCase() === deptName.toLowerCase()).length;

  const enriched = departments.map((d) => ({
    ...d,
    liveCount: headcount(d.name) || d.employeeCount,
  }));

  const filtered = enriched.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.headName.toLowerCase().includes(search.toLowerCase())
  );

  const totalHeadcount = enriched.reduce((sum, d) => sum + d.liveCount, 0);
  const activeCount = enriched.filter((d) => d.status === "Active").length;

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", code: "", headName: "", description: "", status: "Active" });
    setError("");
    setModalOpen(true);
  };

  const openEdit = (dept: Department) => {
    setEditing(dept);
    setForm({
      name: dept.name,
      code: dept.code,
      headName: dept.headName,
      description: dept.description,
      status: dept.status,
    });
    setError("");
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.code.trim()) {
      setError("Department name and code are required.");
      return;
    }
    const duplicate = departments.some(
      (d) =>
        d.id !== editing?.id &&
        (d.name.toLowerCase() === form.name.trim().toLowerCase() ||
          d.code.toLowerCase() === form.code.trim().toLowerCase())
    );
    if (duplicate) {
      setError("A department with this name or code already exists.");
      return;
    }

    if (editing) {
      sync(
        departments.map((d) =>
          d.id === editing.id
            ? {
                ...d,
                name: form.name.trim(),
                code: form.code.trim().toUpperCase(),
                headName: form.headName.trim() || "Unassigned",
                description: form.description.trim(),
                status: form.status,
                employeeCount: headcount(form.name.trim()) || d.employeeCount,
              }
            : d
        )
      );
    } else {
      const newDept: Department = {
        id: `DEPT-${String(departments.length + 1).padStart(3, "0")}`,
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        headName: form.headName.trim() || "Unassigned",
        description: form.description.trim(),
        employeeCount: headcount(form.name.trim()),
        status: form.status,
        createdAt: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };
      sync([...departments, newDept]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this department? Employees keep their current department label.")) return;
    sync(departments.filter((d) => d.id !== id));
  };

  return (
    <AppLayout
      title="Departments"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Departments" },
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-[#28C2A9] p-5 text-white">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Building2 className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-white/80">Total Departments</p>
            <p className="mt-1 text-3xl font-bold">{departments.length}</p>
          </div>
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F2D3] text-[#0E4D41]">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">Assigned Employees</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{totalHeadcount}</p>
          </div>
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Briefcase className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">Active Departments</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{activeCount}</p>
          </div>
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
              <UserCog className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">Heads Assigned</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">
              {enriched.filter((d) => d.headName && d.headName !== "Unassigned").length}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Department Directory</h2>
              <p className="text-sm text-slate-500">Create, edit, and organize company departments</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search department..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#28C2A9] focus:ring-1 focus:ring-[#28C2A9] sm:w-64"
                />
              </div>
              <Button onClick={openCreate} className="h-10 gap-2 font-bold">
                <Plus className="h-4 w-4" />
                Add Department
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left bg-white">
              <thead>
                <tr className="border-b border-[#E4E4E1] text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-4">Code</th>
                  <th className="pb-3 pr-4">Department</th>
                  <th className="pb-3 pr-4">Head</th>
                  <th className="pb-3 pr-4">Employees</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Created</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-slate-400">
                      No departments found. Add your first department to get started.
                    </td>
                  </tr>
                ) : (
                  filtered.map((dept) => (
                    <tr key={dept.id} className="border-b border-slate-50 hover:bg-slate-50/80">
                      <td className="py-4 pr-4 text-sm font-bold text-[#0E4D41]">{dept.code}</td>
                      <td className="py-4 pr-4">
                        <p className="text-sm font-semibold text-slate-900">{dept.name}</p>
                        <p className="mt-0.5 max-w-xs truncate text-xs text-slate-400">
                          {dept.description || "No description"}
                        </p>
                      </td>
                      <td className="py-4 pr-4 text-sm text-slate-700">{dept.headName}</td>
                      <td className="py-4 pr-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F2D3] px-2.5 py-1 text-xs font-bold text-[#0E4D41]">
                          <Users className="h-3 w-3" />
                          {dept.liveCount}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-bold",
                            dept.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          )}
                        >
                          {dept.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-sm text-slate-500">{dept.createdAt}</td>
                      <td className="py-4 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(dept)}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-[#28C2A9]/10 hover:text-[#28C2A9]"
                            aria-label="Edit department"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(dept.id)}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                            aria-label="Delete department"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-lg rounded-2xl border border-[#E4E4E1] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {editing ? "Edit Department" : "Add Department"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSave}>
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {error}
                </div>
              )}
              <Input
                label="Department Name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Product Design"
              />
              <Input
                label="Department Code"
                required
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                placeholder="e.g. PD"
              />
              <Input
                label="Department Head"
                value={form.headName}
                onChange={(e) => setForm((f) => ({ ...f, headName: e.target.value }))}
                placeholder="e.g. Ethan Ray"
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Short description of this department"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value as Department["status"] }))
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="font-bold">
                  {editing ? "Save Changes" : "Create Department"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
