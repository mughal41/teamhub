import * as React from "react";
import { X, Users, Building, AlertTriangle, CheckCircle, Calendar } from "lucide-react";
import { Employee, PayStructure } from "../../lib/db";
import { cn } from "../../lib/utils";

export interface AssignStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  structure: PayStructure | null;
  employees: Employee[];
  onApplyAssignment: (structureId: string, assignedEmployeeIds: string[], assignedDepartments: string[], effectiveDate: string) => void;
}

export function AssignStructureModal({
  isOpen,
  onClose,
  structure,
  employees,
  onApplyAssignment,
}: AssignStructureModalProps) {
  if (!isOpen || !structure) return null;

  const [scopeType, setScopeType] = React.useState<"department" | "employees">("employees");
  const [selectedDept, setSelectedDept] = React.useState<string>("All");
  const [selectedEmpIds, setSelectedEmpIds] = React.useState<string[]>(
    structure.assignedEmployeeIds || []
  );
  const [effectiveDate, setEffectiveDate] = React.useState(structure.effectiveDate || "01 Jan 2035");
  const [searchTerm, setSearchTerm] = React.useState("");

  // Unique departments from actual employee records
  const availableDepts = React.useMemo(() => {
    const set = new Set<string>();
    employees.forEach((e) => {
      if (e.dept) set.add(e.dept);
    });
    return Array.from(set);
  }, [employees]);

  // When scopeType is department, auto-populate selected employees
  const handleDeptSelect = (dept: string) => {
    setSelectedDept(dept);
    if (dept === "All") {
      setSelectedEmpIds(employees.map((e) => e.id));
    } else {
      setSelectedEmpIds(employees.filter((e) => e.dept === dept).map((e) => e.id));
    }
  };

  const handleToggleEmployee = (id: string) => {
    setSelectedEmpIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmpIds.length === employees.length) {
      setSelectedEmpIds([]);
    } else {
      setSelectedEmpIds(employees.map((e) => e.id));
    }
  };

  const filteredEmployees = (employees || []).filter((e) => {
    if (!e) return false;
    const q = (searchTerm || "").toLowerCase();
    const name = String(e.name || "").toLowerCase();
    const id = String(e.id || "").toLowerCase();
    const dept = String(e.dept || "").toLowerCase();
    return name.includes(q) || id.includes(q) || dept.includes(q);
  });

  const handleApply = () => {
    const depts = scopeType === "department" && selectedDept !== "All" ? [selectedDept] : [];
    onApplyAssignment(structure.id, selectedEmpIds, depts, effectiveDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#161c1a]/60 backdrop-blur-[3px] z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-[640px] max-h-[90vh] rounded-[16px] shadow-2xl flex flex-col overflow-hidden border border-[#EBECEB] my-auto select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#EBECEB] flex items-center justify-between shrink-0 bg-white">
          <div>
            <h3 className="text-[17px] font-bold text-[#203430] tracking-[-0.03em] leading-none">
              Assign Pay Structure
            </h3>
            <p className="text-xs text-[#63716E] mt-1">
              Apply <strong>{structure.name}</strong> to eligible workforce members
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#63716E] hover:text-[#203430] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-left flex-1">
          {/* Scope Selector: Department vs Individual Employees */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block">
              Assignment Scope
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScopeType("department")}
                className={cn(
                  "p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer",
                  scopeType === "department"
                    ? "bg-[#E4F2D3]/60 border-[#35BFA3] text-[#0E4D41] font-bold"
                    : "bg-[#F7F7F7] border-[#EBECEB] text-[#203430] hover:bg-[#F0F1F0]"
                )}
              >
                <Building className="h-4 w-4 text-[#35BFA3] shrink-0" />
                <div>
                  <p className="text-xs font-semibold leading-tight">By Department</p>
                  <p className="text-[10px] text-[#63716E] leading-tight">Assign all staff in division</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setScopeType("employees")}
                className={cn(
                  "p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer",
                  scopeType === "employees"
                    ? "bg-[#E4F2D3]/60 border-[#35BFA3] text-[#0E4D41] font-bold"
                    : "bg-[#F7F7F7] border-[#EBECEB] text-[#203430] hover:bg-[#F0F1F0]"
                )}
              >
                <Users className="h-4 w-4 text-[#35BFA3] shrink-0" />
                <div>
                  <p className="text-xs font-semibold leading-tight">Selected Employees</p>
                  <p className="text-[10px] text-[#63716E] leading-tight">Selective person assignment</p>
                </div>
              </button>
            </div>
          </div>

          {/* Department Dropdown if By Department */}
          {scopeType === "department" && (
            <div className="space-y-1.5 animate-in fade-in">
              <label className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block">
                Target Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => handleDeptSelect(e.target.value)}
                className="w-full h-9 px-3 text-xs bg-[#F7F7F7] border border-[#EBECEB] rounded-xl outline-none focus:border-[#35BFA3]"
              >
                <option value="All">All Departments ({employees.length} Staff)</option>
                {availableDepts.map((d) => (
                  <option key={d} value={d}>
                    {d} ({employees.filter((e) => e.dept === d).length} Staff)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Effective Date */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block">
              Effective Date
            </label>
            <div className="flex items-center gap-2 bg-[#F7F7F7] px-3 py-1.5 rounded-xl border border-[#EBECEB]">
              <Calendar className="h-3.5 w-3.5 text-[#35BFA3] shrink-0" />
              <input
                type="text"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                placeholder="e.g. 01 Jan 2035"
                className="bg-transparent text-xs text-[#203430] w-full outline-none font-medium"
              />
            </div>
          </div>

          {/* Employee Selection List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#203430]">
                Assigned Staff ({selectedEmpIds.length} of {employees.length})
              </span>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] font-bold text-[#0E4D41] hover:underline cursor-pointer"
              >
                {selectedEmpIds.length === employees.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            <input
              type="text"
              placeholder="Search staff by name, ID or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 px-3 text-xs bg-[#F7F7F7] rounded-lg border border-[#EBECEB] focus:border-[#35BFA3] outline-none"
            />

            <div className="max-h-48 overflow-y-auto space-y-1.5 border border-[#EBECEB] rounded-xl p-2 bg-white">
              {filteredEmployees.map((emp) => {
                const isSelected = selectedEmpIds.includes(emp.id);
                return (
                  <div
                    key={emp.id}
                    onClick={() => handleToggleEmployee(emp.id)}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs",
                      isSelected ? "bg-[#E4F2D3]/50 text-[#0E4D41]" : "hover:bg-[#F7F7F7] text-[#203430]"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="h-6 w-6 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{emp.name}</p>
                        <p className="text-[10px] text-[#63716E] truncate">
                          {emp.id} · {emp.dept}
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="accent-[#35BFA3] h-3.5 w-3.5 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safety Notice */}
          <div className="bg-[#F7F7F7] rounded-xl p-3 border border-[#EBECEB] flex items-start gap-2.5 text-xs text-[#63716E]">
            <CheckCircle className="h-4 w-4 text-[#35BFA3] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Applying this structure will establish recurring allowance eligibility for assigned staff while preserving individual contractual base salary rates.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#EBECEB] bg-[#F7F7F7] flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-xl text-xs font-semibold text-[#63716E] hover:text-[#203430] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="h-9 px-5 rounded-xl text-xs font-bold text-white bg-[#35BFA3] hover:bg-[#28C2A9] transition-colors shadow-2xs cursor-pointer"
          >
            Apply Structure ({selectedEmpIds.length})
          </button>
        </div>
      </div>
    </div>
  );
}
