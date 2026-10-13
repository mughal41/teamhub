import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import {
  getCollection,
  saveCollection,
  PayStructure,
  Employee,
  EmployeeCompensationOverride,
} from "../lib/db";
import {
  Layers,
  Search,
  Plus,
  Edit,
  CheckCircle,
  Building,
  Users,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Percent,
  Sliders,
  DollarSign,
  ArrowLeft,
  X,
  Check,
} from "lucide-react";
import { Card } from "../components/ui/LayoutAddons";
import { cn } from "../lib/utils";
import { AssignStructureModal } from "../components/payroll/AssignStructureModal";
import { EmployeeOverrideModal } from "../components/payroll/EmployeeOverrideModal";
import { PayStructureEditor } from "../components/payroll/PayStructureEditor";

export default function PayStructuresPage() {
  const navigate = useNavigate();

  const [structures, setStructures] = React.useState<PayStructure[]>(() =>
    getCollection<PayStructure[]>("db_pay_structures", [])
  );
  const [employees] = React.useState<Employee[]>(() =>
    getCollection<Employee[]>("db_employees", [])
  );
  const [overrides, setOverrides] = React.useState<EmployeeCompensationOverride[]>(() =>
    getCollection<EmployeeCompensationOverride[]>("db_comp_overrides", [])
  );

  const [selectedStructureId, setSelectedStructureId] = React.useState<string>(
    structures[0]?.id || "STRUC-001"
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const [editorMode, setEditorMode] = React.useState<"create" | "edit" | null>(null);
  const [justCreatedStructure, setJustCreatedStructure] = React.useState<PayStructure | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Modal controls
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = React.useState(false);
  const [selectedEmployeeForOverride, setSelectedEmployeeForOverride] = React.useState<Employee | null>(null);

  // Synchronize DB updates
  React.useEffect(() => {
    const handleDbUpdate = () => {
      setStructures(getCollection<PayStructure[]>("db_pay_structures", []));
      setOverrides(getCollection<EmployeeCompensationOverride[]>("db_comp_overrides", []));
    };
    window.addEventListener("db_updated", handleDbUpdate);
    window.addEventListener("storage", handleDbUpdate);
    return () => {
      window.removeEventListener("db_updated", handleDbUpdate);
      window.removeEventListener("storage", handleDbUpdate);
    };
  }, []);

  const selectedStructure =
    structures.find((s) => s.id === selectedStructureId) || structures[0] || null;

  // Filter structures list
  const filteredStructures = (structures || []).filter((s) => {
    if (!s) return false;
    const q = (searchTerm || "").toLowerCase();
    const name = String(s.name || "").toLowerCase();
    const scope = String(s.applicableScope || "").toLowerCase();
    return name.includes(q) || scope.includes(q);
  });

  // Assigned employees for the currently selected structure
  const assignedEmployees = React.useMemo(() => {
    if (!selectedStructure || !Array.isArray(selectedStructure.assignedEmployeeIds)) return [];
    return (employees || []).filter((e) => e?.id && selectedStructure.assignedEmployeeIds.includes(e.id));
  }, [selectedStructure, employees]);

  // Handler: Apply assignment
  const handleApplyAssignment = (
    structureId: string,
    assignedEmployeeIds: string[],
    assignedDepartments: string[],
    effectiveDate: string
  ) => {
    const updated = structures.map((s) =>
      s.id === structureId
        ? {
            ...s,
            assignedEmployeeIds,
            assignedDepartments,
            effectiveDate,
          }
        : s
    );
    saveCollection("db_pay_structures", updated);
    setStructures(updated);
  };

  // Handler: Save employee override
  const handleSaveOverride = (newOverride: EmployeeCompensationOverride) => {
    const currentList = getCollection<EmployeeCompensationOverride[]>("db_comp_overrides", []);
    const filtered = currentList.filter(
      (o) => !(o.employeeId === newOverride.employeeId && o.structureId === newOverride.structureId)
    );
    const updated = [...filtered, newOverride];
    saveCollection("db_comp_overrides", updated);
    setOverrides(updated);
  };

  // Handler: Save newly created pay structure from shared editor
  const handleSaveNewStructure = (newStructure: PayStructure) => {
    const currentStructures = getCollection<PayStructure[]>("db_pay_structures", []);
    const updated = [...currentStructures, newStructure];
    saveCollection("db_pay_structures", updated);
    setStructures(updated);
    setSelectedStructureId(newStructure.id);
    setEditorMode(null);
    setJustCreatedStructure(newStructure);
    showToast("Pay structure created.");
  };

  // Handler: Save updated pay structure from shared editor
  const handleSaveUpdatedStructure = (updatedStructure: PayStructure) => {
    const currentStructures = getCollection<PayStructure[]>("db_pay_structures", []);
    const updatedList = currentStructures.map((s) =>
      s.id === updatedStructure.id ? updatedStructure : s
    );
    saveCollection("db_pay_structures", updatedList);
    setStructures(updatedList);
    setEditorMode(null);
    showToast(`Pay structure "${updatedStructure.name}" updated successfully.`);
  };

  return (
    <AppLayout
      title="Pay Structures"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Payroll", href: "/payroll" },
        { label: "Pay Structures" },
      ]}
    >
      <div className="space-y-5 text-left relative">
        {/* Real-time Interactive Toast Indicator */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 bg-[#203430] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#35BFA3] animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle className="h-4 w-4 text-[#35BFA3]" />
            <span className="text-[13px] font-semibold">{toast}</span>
          </div>
        )}
        {/* Top Back / Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate("/payroll")}
              className="p-1.5 rounded-lg border border-[#EBECEB] bg-white text-[#63716E] hover:text-[#203430] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
              title="Return to Payroll Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h2 className="text-[18px] font-bold text-[#203430] tracking-[-0.03em] leading-tight">
                Pay Structures
              </h2>
              <p className="text-xs text-[#63716E]">
                Manage reusable salary and benefit structures.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditorMode("create");
                setJustCreatedStructure(null);
              }}
              className="h-[34px] px-3.5 bg-[#35BFA3] hover:bg-[#28C2A9] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Structure</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            TWO-AREA WORKBENCH LAYOUT: LEFT DIRECTORY & RIGHT SELECTED DETAILS / EDITOR
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* -----------------------------------------------------------------------
              LEFT AREA — STRUCTURE DIRECTORY (Col 1-4)
              ----------------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-3">
            <Card className="p-3.5 border border-[#EBECEB] rounded-[16px] bg-white shadow-2xs space-y-3">
              {/* Directory Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#63716E]" />
                <input
                  type="text"
                  placeholder="Search structures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 text-xs bg-[#F7F7F7] border border-[#EBECEB] rounded-lg outline-none focus:border-[#35BFA3]"
                />
              </div>

              {/* Directory List */}
              <div className="space-y-1.5">
                {filteredStructures.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#63716E]">
                    No pay structures found.
                  </div>
                ) : (
                  filteredStructures.map((struc) => {
                    const isSelected = selectedStructure?.id === struc.id;
                    const assignedCount = struc.assignedEmployeeIds?.length || 0;

                    return (
                      <div
                        key={struc.id}
                        onClick={() => {
                          setSelectedStructureId(struc.id);
                          setEditorMode(null);
                          setJustCreatedStructure(null);
                        }}
                        className={cn(
                          "p-3 rounded-xl border text-left cursor-pointer transition-all",
                          isSelected
                            ? "bg-[#E4F2D3]/50 border-[#35BFA3] shadow-2xs"
                            : "bg-white border-[#EBECEB] hover:bg-[#F7F7F7]"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={cn(
                              "text-xs font-bold leading-tight",
                              isSelected ? "text-[#0E4D41]" : "text-[#203430]"
                            )}
                          >
                            {struc.name}
                          </span>
                          <span className="text-[10px] font-bold bg-[#E4F2D3] text-[#0E4D41] px-1.5 py-0.2 rounded-full">
                            {struc.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#63716E] line-clamp-1 mb-2">
                          {struc.description}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-[#63716E]">
                          <span className="flex items-center gap-1 font-medium">
                            <Users className="h-3 w-3 text-[#35BFA3]" />
                            {assignedCount} Assigned Staff
                          </span>
                          <span>Scope: {struc.applicableScope}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* -----------------------------------------------------------------------
              RIGHT AREA — SELECTED STRUCTURE DETAILS OR CREATE/EDIT WORKBENCH (Col 5-12)
              ----------------------------------------------------------------------- */}
          <div className="lg:col-span-8 space-y-4">
            {editorMode === "create" ? (
              <PayStructureEditor
                mode="create"
                initialStructure={null}
                availableDepartments={Array.from(new Set((employees || []).map((e) => e.dept).filter(Boolean)))}
                onSave={handleSaveNewStructure}
                onCancel={() => setEditorMode(null)}
              />
            ) : editorMode === "edit" && selectedStructure ? (
              <PayStructureEditor
                mode="edit"
                initialStructure={selectedStructure}
                assignedEmployeesCount={assignedEmployees.length}
                availableDepartments={Array.from(new Set((employees || []).map((e) => e.dept).filter(Boolean)))}
                onSave={handleSaveUpdatedStructure}
                onCancel={() => setEditorMode(null)}
              />
            ) : !selectedStructure ? (
              <div className="p-8 text-center text-xs text-[#63716E] bg-white rounded-xl border border-[#EBECEB]">
                No structure selected. Click <strong>Create Structure</strong> to configure a new pay structure.
              </div>
            ) : (
              <>
                {/* Optional Quick Assignment Prompt Banner if just created */}
                {justCreatedStructure?.id === selectedStructure.id && (
                  <div className="p-3.5 bg-[#E4F2D3]/60 border border-[#35BFA3]/40 rounded-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-in fade-in text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[#0E4D41] shrink-0" />
                      <div>
                        <span className="font-bold text-[#0E4D41]">Pay structure created successfully.</span>
                        <p className="text-[11px] text-[#63716E]">
                          Would you like to assign eligible employees to this structure now?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setJustCreatedStructure(null);
                          setIsAssignModalOpen(true);
                        }}
                        className="h-7 px-3 bg-[#0E4D41] hover:bg-[#165a4e] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <Users className="h-3 w-3" />
                        <span>Assign Employees</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setJustCreatedStructure(null)}
                        className="text-[11px] text-[#63716E] hover:text-[#203430] px-2 py-1"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                <Card className="p-5 border border-[#EBECEB] rounded-[16px] bg-white shadow-2xs space-y-5">
                  {/* Structure Header & Metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBECEB] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[17px] font-bold text-[#203430] tracking-[-0.03em]">
                          {selectedStructure.name}
                        </h3>
                        <span className="text-[10px] font-bold bg-[#0E4D41] text-white px-2 py-0.5 rounded-full">
                          {selectedStructure.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#63716E] mt-1 max-w-xl">
                        {selectedStructure.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditorMode("edit")}
                        className="h-8 px-3 rounded-lg text-xs font-bold border border-[#EBECEB] bg-white text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Edit className="h-3.5 w-3.5 text-[#63716E]" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAssignModalOpen(true)}
                        className="h-8 px-3 rounded-lg text-xs font-bold bg-[#0E4D41] text-white hover:bg-[#165a4e] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>Assign Structure</span>
                      </button>
                    </div>
                  </div>

                {/* Scope & Date Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-[#F7F7F7] rounded-xl border border-[#EBECEB] text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-[#63716E] uppercase block">
                      Target Pay Scope
                    </span>
                    <span className="font-semibold text-[#203430]">
                      {selectedStructure.applicableScope}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#63716E] uppercase block">
                      Effective Date
                    </span>
                    <span className="font-semibold text-[#203430]">
                      {selectedStructure.effectiveDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#63716E] uppercase block">
                      Enrolled Workforce
                    </span>
                    <span className="font-semibold text-[#0E4D41]">
                      {selectedStructure.assignedEmployeeIds.length} Staff Members
                    </span>
                  </div>
                </div>

                {/* Earnings Components */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#35BFA3]" />
                      <h4 className="text-xs font-bold text-[#203430] uppercase tracking-wider">
                        Configured Earnings Components
                      </h4>
                    </div>
                    <span className="text-[11px] text-[#63716E]">
                      {selectedStructure.earnings.length} Components
                    </span>
                  </div>

                  <div className="border border-[#EBECEB] rounded-xl overflow-hidden divide-y divide-[#EBECEB]">
                    {selectedStructure.earnings.map((comp) => (
                      <div
                        key={comp.id}
                        className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#203430]">{comp.name}</span>
                            {comp.type === "percentage" && (
                              <span className="bg-[#E4F2D3] text-[#0E4D41] text-[10px] font-bold px-1.5 py-0.2 rounded">
                                {comp.percentage}% of Basic
                              </span>
                            )}
                            {comp.allowOverride && (
                              <span className="bg-[#F7F7F7] text-[#63716E] text-[10px] font-medium px-1.5 py-0.2 rounded border border-[#EBECEB]">
                                Individual Override Allowed
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#63716E] mt-0.5">{comp.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-bold text-[#0E4D41]">
                            {comp.defaultAmount ? `$${comp.defaultAmount}` : "Based on Contract"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recurring Deductions Components */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      <h4 className="text-xs font-bold text-[#203430] uppercase tracking-wider">
                        Configured Recurring Deductions
                      </h4>
                    </div>
                    <span className="text-[11px] text-[#63716E]">
                      {selectedStructure.deductions.length} Components
                    </span>
                  </div>

                  <div className="border border-[#EBECEB] rounded-xl overflow-hidden divide-y divide-[#EBECEB]">
                    {selectedStructure.deductions.map((comp) => (
                      <div
                        key={comp.id}
                        className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#203430]">{comp.name}</span>
                            {comp.type === "percentage" && (
                              <span className="bg-red-50 text-red-700 text-[10px] font-bold px-1.5 py-0.2 rounded border border-red-200">
                                {comp.percentage}% Statutory
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#63716E] mt-0.5">{comp.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-semibold text-red-500">
                            {comp.percentage ? `${comp.percentage}% Rate` : "Scheduled"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assigned Employees & Customization Action */}
                <div className="space-y-2 pt-2 border-t border-[#EBECEB]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#203430] uppercase tracking-wider">
                      Assigned Workforce ({assignedEmployees.length})
                    </h4>
                    <span className="text-[11px] text-[#63716E]">
                      Click employee to review or customize overrides
                    </span>
                  </div>

                  {assignedEmployees.length === 0 ? (
                    <div className="p-4 bg-[#F7F7F7] rounded-xl text-center text-xs text-[#63716E] border border-dashed border-[#EBECEB]">
                      No employees currently assigned to this structure. Click <strong>Assign Structure</strong> to enroll staff.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {assignedEmployees.map((emp) => {
                        const hasOverride = overrides.some(
                          (o) => o.employeeId === emp.id && o.structureId === selectedStructure.id
                        );

                        return (
                          <div
                            key={emp.id}
                            className="p-2.5 bg-[#F7F7F7] rounded-xl border border-[#EBECEB] flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={emp.avatar}
                                alt={emp.name}
                                className="h-7 w-7 rounded-full object-cover shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-[#203430] truncate">{emp.name}</span>
                                  {hasOverride && (
                                    <span className="text-[9px] bg-[#E4F2D3] text-[#0E4D41] font-bold px-1.5 py-0.2 rounded">
                                      Customized
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-[#63716E] truncate block">
                                  {emp.id} · {emp.dept}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedEmployeeForOverride(emp);
                                setIsOverrideModalOpen(true);
                              }}
                              className="text-[11px] font-bold text-[#0E4D41] hover:text-[#35BFA3] bg-white border border-[#EBECEB] px-2 py-1 rounded-md shrink-0 cursor-pointer shadow-2xs"
                            >
                              Customize
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

        {/* Modal: Assign Structure */}
        <AssignStructureModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          structure={selectedStructure}
          employees={employees}
          onApplyAssignment={handleApplyAssignment}
        />

        {/* Modal: Employee Override */}
        <EmployeeOverrideModal
          isOpen={isOverrideModalOpen}
          onClose={() => setIsOverrideModalOpen(false)}
          employee={selectedEmployeeForOverride}
          structure={selectedStructure}
          existingOverride={
            overrides.find(
              (o) =>
                o.employeeId === selectedEmployeeForOverride?.id &&
                o.structureId === selectedStructure?.id
            ) || null
          }
          onSaveOverride={handleSaveOverride}
        />
      </div>
    </AppLayout>
  );
}
