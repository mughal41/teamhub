import * as React from "react";
import { X, CheckCircle, Edit, Calendar, AlertCircle } from "lucide-react";
import { Employee, PayStructure, EmployeeCompensationOverride } from "../../lib/db";
import { cn } from "../../lib/utils";

export interface EmployeeOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  structure: PayStructure | null;
  existingOverride?: EmployeeCompensationOverride | null;
  onSaveOverride: (override: EmployeeCompensationOverride) => void;
}

export function EmployeeOverrideModal({
  isOpen,
  onClose,
  employee,
  structure,
  existingOverride,
  onSaveOverride,
}: EmployeeOverrideModalProps) {
  if (!isOpen || !employee || !structure) return null;

  const [baseSalary, setBaseSalary] = React.useState<number>(
    existingOverride?.baseSalaryOverride || 3000
  );
  const [componentOverrides, setComponentOverrides] = React.useState<
    { componentId: string; overrideAmount: number; reason: string; effectiveDate: string }[]
  >(existingOverride?.componentOverrides || []);
  const [customNotes, setCustomNotes] = React.useState(existingOverride?.customNotes || "");
  const [validationError, setValidationError] = React.useState<string | null>(null);

  // Manage individual component override values
  const getOverrideValue = (compId: string, defaultVal: number = 0) => {
    const found = componentOverrides.find((c) => c.componentId === compId);
    return found ? found.overrideAmount : defaultVal;
  };

  const handleUpdateComponent = (compId: string, amount: number, reason: string) => {
    setComponentOverrides((prev) => {
      const filtered = prev.filter((c) => c.componentId !== compId);
      if (amount <= 0 && !reason) return filtered;
      return [
        ...filtered,
        {
          componentId: compId,
          overrideAmount: amount,
          reason: reason || "Contractual amendment",
          effectiveDate: "01 Jan 2035",
        },
      ];
    });
  };

  const handleSave = () => {
    if (baseSalary <= 0) {
      setValidationError("Please specify a valid base salary rate.");
      return;
    }
    onSaveOverride({
      employeeId: employee.id,
      structureId: structure.id,
      baseSalaryOverride: baseSalary,
      componentOverrides,
      customNotes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#161c1a]/60 backdrop-blur-[3px] z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-[620px] max-h-[90vh] rounded-[16px] shadow-2xl flex flex-col overflow-hidden border border-[#EBECEB] my-auto select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#EBECEB] flex items-center justify-between shrink-0 bg-white">
          <div className="min-w-0">
            <h3 className="text-[17px] font-bold text-[#203430] tracking-[-0.03em] leading-none">
              Customize Compensation
            </h3>
            <p className="text-xs text-[#63716E] mt-1 truncate">
              Individual override for <strong>{employee.name}</strong> ({employee.id})
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

        {/* Employee Strip */}
        <div className="px-5 py-2.5 bg-[#F7F7F7] border-b border-[#EBECEB] flex items-center justify-between text-xs text-[#63716E]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#203430]">Assigned Structure:</span>
            <span className="bg-white px-2 py-0.5 rounded border border-[#EBECEB] text-[#0E4D41] font-bold">
              {structure.name}
            </span>
          </div>
          <span>Dept: {employee.dept}</span>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-left flex-1">
          {validationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Individual Base Salary */}
          <div className="bg-white border border-[#EBECEB] rounded-xl p-3.5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#203430] block">
                  Contractual Base Salary ($)
                </span>
                <span className="text-[10px] text-[#63716E]">
                  Individual gross monthly baseline
                </span>
              </div>
              <input
                type="number"
                value={baseSalary}
                onChange={(e) => setBaseSalary(parseFloat(e.target.value) || 0)}
                className="w-28 h-8 px-2.5 text-right font-bold text-xs bg-[#F7F7F7] border border-[#EBECEB] rounded-lg focus:border-[#35BFA3] outline-none"
              />
            </div>
          </div>

          {/* Component Overrides */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider">
              Allowance Overrides & Waivers
            </p>

            <div className="space-y-2">
              {structure.earnings
                .filter((c) => c.id !== "comp-base")
                .map((comp) => {
                  const currentVal = getOverrideValue(comp.id, comp.defaultAmount || 0);
                  const isOverridden = componentOverrides.some(
                    (c) => c.componentId === comp.id
                  );

                  return (
                    <div
                      key={comp.id}
                      className={cn(
                        "p-3 rounded-xl border transition-all text-xs space-y-2",
                        isOverridden
                          ? "bg-[#E4F2D3]/30 border-[#35BFA3]/50"
                          : "bg-white border-[#EBECEB]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#203430]">{comp.name}</span>
                            {isOverridden && (
                              <span className="text-[9px] bg-[#E4F2D3] text-[#0E4D41] font-bold px-1.5 py-0.2 rounded">
                                Customized
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#63716E]">
                            Standard template: ${comp.defaultAmount || 0}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#63716E]">Amount: $</span>
                          <input
                            type="number"
                            value={currentVal}
                            onChange={(e) =>
                              handleUpdateComponent(
                                comp.id,
                                parseFloat(e.target.value) || 0,
                                "Contractual adjustment"
                              )
                            }
                            className="w-20 h-7 px-2 text-right text-xs bg-[#F7F7F7] border border-[#EBECEB] rounded-md outline-none focus:border-[#35BFA3]"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Reason / Notes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block">
              Authorization Justification / Contract Notes
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Senior promotion tier allowance amendment approved by HR Director."
              className="w-full p-2.5 text-xs bg-[#F7F7F7] border border-[#EBECEB] rounded-xl outline-none focus:border-[#35BFA3] resize-none"
            />
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
            onClick={handleSave}
            className="h-9 px-5 rounded-xl text-xs font-bold text-white bg-[#35BFA3] hover:bg-[#28C2A9] transition-colors shadow-2xs cursor-pointer"
          >
            Save Overrides
          </button>
        </div>
      </div>
    </div>
  );
}
