import * as React from "react";
import {
  X,
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  Download,
  Edit,
  DollarSign,
  User,
  ArrowRight,
  ShieldCheck,
  Building,
  CreditCard,
  Briefcase,
  HelpCircle,
  Layers,
  Sliders,
  Printer,
} from "lucide-react";
import { cn } from "../../lib/utils";
import {
  getEmployeePayStructure,
  getEmployeeOverride,
  calculateEmployeePayrollBreakdown,
  ResolvedComponentItem,
} from "../../lib/payrollResolver";
import { PayslipModal } from "./PayslipModal";

export interface CustomAdjustmentItem {
  id: string;
  name: string;
  amount: number;
  reason: string;
  category: "reimbursement" | "deduction";
}

export interface EmployeePayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
  period: string; // e.g. "June 2035"
  onSaveDraft?: (updatedPayroll: any) => void;
  onFinalize?: (updatedPayroll: any) => void;
  onDownloadPayslip?: (employee: any) => void;
}

export function EmployeePayrollModal({
  isOpen,
  onClose,
  employee,
  period = "June 2035",
  onSaveDraft,
  onFinalize,
  onDownloadPayslip,
}: EmployeePayrollModalProps) {
  if (!isOpen || !employee) return null;

  // Determine lifecycle state
  const isPaid = employee.status === "Paid";
  const isProcessed = employee.status === "Processed";
  const isDraft = employee.status === "Draft";
  const isPending = employee.status === "Pending";
  const isNotProcessed = employee.status === "Not Processed";

  // Editable mode: default true for Not Processed / Draft / Pending; read-only for Processed & Paid
  const isFinalizedOrPaid = isPaid || isProcessed;
  const [isEditing, setIsEditing] = React.useState(!isFinalizedOrPaid);
  const [isPayslipOpen, setIsPayslipOpen] = React.useState(false);

  // Helper numeric parse
  const parseNum = (val: any) => {
    if (!val || val === "—") return 0;
    if (typeof val === "number") return val;
    return parseFloat(String(val).replace(/[$,]/g, "")) || 0;
  };

  // Resolve assigned structure & overrides for this employee
  const struc = React.useMemo(() => {
    return getEmployeePayStructure(employee.id, employee.subRole || employee.dept);
  }, [employee.id, employee.subRole, employee.dept]);

  const override = React.useMemo(() => {
    return getEmployeeOverride(employee.id, struc?.id);
  }, [employee.id, struc?.id]);

  // Initial calculation baseline
  const initialSalaryVal = parseNum(employee.salary);
  const initialAllowVal = parseNum(employee.allowance);
  const initialOtVal = parseNum(employee.overtime);
  const initialIncVal = parseNum(employee.incen);
  const initialDedVal = parseNum(employee.deduct);

  const baselineBreakdown = React.useMemo(() => {
    return calculateEmployeePayrollBreakdown({
      employee,
      structure: struc,
      override,
      manualBaseSalary: initialSalaryVal > 0 ? initialSalaryVal : undefined,
      overtime: initialOtVal,
      incentives: initialIncVal,
      lateDeduction: Math.round(initialDedVal * 0.4) || (isNotProcessed ? 25 : 40),
      absenceDeduction: Math.round(initialDedVal * 0.6) || (isNotProcessed ? 45 : 60),
    });
  }, [employee, struc, override, initialSalaryVal, initialOtVal, initialIncVal, initialDedVal, isNotProcessed]);

  // =========================================================================
  // 1. DYNAMIC EARNINGS STATE (Synchronized from assigned Pay Structure)
  // =========================================================================
  const [baseSalary, setBaseSalary] = React.useState<number>(baselineBreakdown.baseSalary);
  const [allowanceItems, setAllowanceItems] = React.useState<ResolvedComponentItem[]>(
    baselineBreakdown.earningsComponents
  );
  const [overtimeAmount, setOvertimeAmount] = React.useState<number>(baselineBreakdown.overtimeAmount);
  const [incentiveAmount, setIncentiveAmount] = React.useState<number>(baselineBreakdown.incentiveAmount);

  // Custom Reimbursements
  const [customReimbursements, setCustomReimbursements] = React.useState<CustomAdjustmentItem[]>([]);
  const [showAddReimbursement, setShowAddReimbursement] = React.useState(false);
  const [newReimbType, setNewReimbType] = React.useState("Travel");
  const [newReimbName, setNewReimbName] = React.useState("");
  const [newReimbAmount, setNewReimbAmount] = React.useState("");
  const [newReimbReason, setNewReimbReason] = React.useState("");

  // =========================================================================
  // 2. DYNAMIC CORPORATE DEDUCTIONS STATE (Synchronized from assigned Pay Structure)
  // =========================================================================
  const [deductionItems, setDeductionItems] = React.useState<ResolvedComponentItem[]>(
    baselineBreakdown.deductionsComponents
  );

  // Employee Loans & Salary Advances
  const hasLoanRecord =
    employee.hasLoan || employee.id === "EMP-0115" || employee.id === "EMP-0291";
  const [loanInstallment, setLoanInstallment] = React.useState<number>(
    baselineBreakdown.loanInstallment
  );
  const [loanAdjustmentReason, setLoanAdjustmentReason] = React.useState("");
  const [showLoanAdjust, setShowLoanAdjust] = React.useState(false);

  // Attendance-Related Deductions
  const [lateDeduction, setLateDeduction] = React.useState<number>(
    baselineBreakdown.effectiveLateDeduction + baselineBreakdown.lateWaived
  );
  const [lateWaived, setLateWaived] = React.useState<number>(baselineBreakdown.lateWaived);
  const [lateWaiverReason, setLateWaiverReason] = React.useState("");
  const [showLateAdjust, setShowLateAdjust] = React.useState(false);

  const [absenceDeduction, setAbsenceDeduction] = React.useState<number>(
    baselineBreakdown.effectiveAbsenceDeduction + baselineBreakdown.absenceWaived
  );
  const [absenceWaived, setAbsenceWaived] = React.useState<number>(baselineBreakdown.absenceWaived);
  const [absenceWaiverReason, setAbsenceWaiverReason] = React.useState("");
  const [showAbsenceAdjust, setShowAbsenceAdjust] = React.useState(false);

  // Custom Deductions
  const [customDeductions, setCustomDeductions] = React.useState<CustomAdjustmentItem[]>([]);
  const [showAddDeduction, setShowAddDeduction] = React.useState(false);
  const [newDeductType, setNewDeductType] = React.useState("Equipment Recovery");
  const [newDeductName, setNewDeductName] = React.useState("");
  const [newDeductAmount, setNewDeductAmount] = React.useState("");
  const [newDeductReason, setNewDeductReason] = React.useState("");

  // Finalization Confirmation State & Feedback
  const [showConfirmFinalize, setShowConfirmFinalize] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  // Re-sync allowances if base salary is updated and percentage components exist
  const handleBaseSalaryChange = (newBase: number) => {
    const validBase = Math.max(0, newBase);
    setBaseSalary(validBase);

    // Update percentage-based allowances
    setAllowanceItems((prev) =>
      prev.map((item) => {
        if (item.type === "percentage" && item.percentage && !item.isOverridden) {
          return {
            ...item,
            amount: Math.round((validBase * item.percentage) / 100),
          };
        }
        return item;
      })
    );
  };

  // Helper update single allowance item
  const handleAllowanceAmountChange = (id: string, newAmt: number) => {
    setAllowanceItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount: Math.max(0, newAmt) } : item))
    );
  };

  // =========================================================================
  // 3. FINANCIAL CALCULATIONS & TOTALS
  // =========================================================================
  const totalStandardAllowances = allowanceItems.reduce((sum, item) => sum + item.amount, 0);
  const totalCustomReimbursements = customReimbursements.reduce((sum, r) => sum + r.amount, 0);

  const grossEarnings =
    baseSalary +
    totalStandardAllowances +
    overtimeAmount +
    incentiveAmount +
    totalCustomReimbursements;

  // Dynamically compute statutory deductions
  const dynamicDeductions = React.useMemo(() => {
    return deductionItems.map((item) => {
      if (item.type === "percentage" && item.percentage && !item.isOverridden) {
        const basisVal = item.basis === "gross" ? grossEarnings : baseSalary;
        return {
          ...item,
          amount: Math.round((basisVal * item.percentage) / 100),
        };
      }
      return item;
    });
  }, [deductionItems, grossEarnings, baseSalary]);

  const totalStatutoryDeductions = dynamicDeductions.reduce((sum, d) => sum + d.amount, 0);
  const effectiveLateDeduction = Math.max(0, lateDeduction - lateWaived);
  const effectiveAbsenceDeduction = Math.max(0, absenceDeduction - absenceWaived);
  const totalAttendanceDeductions = effectiveLateDeduction + effectiveAbsenceDeduction;
  const totalCustomDeductions = customDeductions.reduce((sum, d) => sum + d.amount, 0);

  const totalAllDeductions =
    totalStatutoryDeductions +
    loanInstallment +
    totalAttendanceDeductions +
    totalCustomDeductions;

  const netPayable = Math.max(0, grossEarnings - totalAllDeductions);

  // Handlers
  const handleAddReimbursement = () => {
    const amt = parseFloat(newReimbAmount);
    const title = newReimbName.trim() || `${newReimbType} Reimbursement`;
    if (isNaN(amt) || amt <= 0) {
      setValidationError("Please enter a valid positive reimbursement amount.");
      return;
    }
    setCustomReimbursements((prev) => [
      ...prev,
      {
        id: "reimb_" + Date.now(),
        name: title,
        amount: amt,
        reason: newReimbReason.trim() || "Approved corporate expense claim",
        category: "reimbursement",
      },
    ]);
    setNewReimbName("");
    setNewReimbAmount("");
    setNewReimbReason("");
    setShowAddReimbursement(false);
    setValidationError(null);
  };

  const handleAddDeduction = () => {
    const amt = parseFloat(newDeductAmount);
    const title = newDeductName.trim() || newDeductType;
    if (isNaN(amt) || amt <= 0) {
      setValidationError("Please enter a valid positive deduction amount.");
      return;
    }
    if (!newDeductReason.trim()) {
      setValidationError("A written authorization reason is required for custom deductions.");
      return;
    }
    setCustomDeductions((prev) => [
      ...prev,
      {
        id: "ded_" + Date.now(),
        name: title,
        amount: amt,
        reason: newDeductReason.trim(),
        category: "deduction",
      },
    ]);
    setNewDeductName("");
    setNewDeductAmount("");
    setNewDeductReason("");
    setShowAddDeduction(false);
    setValidationError(null);
  };

  const currentModalRecord = React.useMemo(() => {
    const dateFormatted =
      employee.date && employee.date !== "—"
        ? employee.date
        : `28 ${(period || "Jun").slice(0, 3)} ${(period || "35").slice(-2)}`;

    return {
      ...employee,
      salary: `$${baseSalary.toLocaleString()}`,
      allowance: `$${totalStandardAllowances.toLocaleString()}`,
      overtime: overtimeAmount > 0 ? `$${overtimeAmount.toLocaleString()}` : "—",
      incen: incentiveAmount > 0 ? `$${incentiveAmount.toLocaleString()}` : "—",
      deduct: `$${totalAllDeductions.toLocaleString()}`,
      total: `$${netPayable.toLocaleString()}`,
      date: dateFormatted,
      structureId: struc?.id,
      structureName: struc?.name,
      hasOverride: !!override,
      earningsBreakdown: [
        { id: "comp-base", name: "Basic Salary", amount: baseSalary },
        ...allowanceItems,
        ...(overtimeAmount > 0
          ? [{ id: "overtime", name: "Approved Overtime", amount: overtimeAmount }]
          : []),
        ...(incentiveAmount > 0
          ? [{ id: "incentives", name: "Performance Incentive", amount: incentiveAmount }]
          : []),
        ...customReimbursements,
      ],
      deductionsBreakdown: [
        ...dynamicDeductions,
        ...(loanInstallment > 0
          ? [
              {
                id: "loan",
                name: "Employee Loan Repayment",
                amount: loanInstallment,
                reason: loanAdjustmentReason,
              },
            ]
          : []),
        ...(effectiveLateDeduction > 0
          ? [
              {
                id: "late",
                name: "Late Arrival Penalty",
                amount: effectiveLateDeduction,
                waived: lateWaived,
                reason: lateWaiverReason,
              },
            ]
          : []),
        ...(effectiveAbsenceDeduction > 0
          ? [
              {
                id: "absence",
                name: "Unpaid Absence Deduction",
                amount: effectiveAbsenceDeduction,
                waived: absenceWaived,
                reason: absenceWaiverReason,
              },
            ]
          : []),
        ...customDeductions,
      ],
      netPay: netPayable,
      grossPay: grossEarnings,
    };
  }, [
    employee,
    baseSalary,
    totalStandardAllowances,
    overtimeAmount,
    incentiveAmount,
    totalAllDeductions,
    netPayable,
    period,
    struc,
    override,
    allowanceItems,
    customReimbursements,
    dynamicDeductions,
    loanInstallment,
    loanAdjustmentReason,
    effectiveLateDeduction,
    lateWaived,
    lateWaiverReason,
    effectiveAbsenceDeduction,
    absenceWaived,
    absenceWaiverReason,
    customDeductions,
    grossEarnings,
  ]);

  const handleSaveDraftClick = () => {
    const updated = {
      ...currentModalRecord,
      status: "Draft",
    };
    onSaveDraft?.(updated);
    onClose();
  };

  const handleConfirmFinalizeClick = () => {
    const updated = {
      ...currentModalRecord,
      status: "Processed",
    };
    onFinalize?.(updated);
    setShowConfirmFinalize(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#161c1a]/60 backdrop-blur-[3px] z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
        <div
          className="bg-white w-full max-w-[780px] max-h-[92vh] rounded-[16px] shadow-2xl flex flex-col overflow-hidden border border-[#EBECEB] my-auto select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* =========================================================================
              1. MODAL HEADER
              ========================================================================= */}
          <div className="px-5 py-3.5 border-b border-[#EBECEB] flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <h3 className="text-[17px] font-bold text-[#203430] tracking-[-0.03em] leading-none">
                {isFinalizedOrPaid && !isEditing
                  ? "Payroll Details"
                  : isNotProcessed
                  ? "Process Payroll"
                  : isDraft
                  ? "Continue Payroll (Draft)"
                  : "Review Payroll"}
              </h3>
              <span
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-[8px] leading-tight shrink-0",
                  employee.status === "Paid"
                    ? "bg-[#35BFA3] text-white"
                    : employee.status === "Processed"
                    ? "bg-[#0E4D41] text-white"
                    : employee.status === "Pending"
                    ? "bg-[#F8C947] text-[#203430]"
                    : employee.status === "Draft"
                    ? "bg-[#A4ACAB] text-white"
                    : "bg-[#E5E6E6] text-[#203430]"
                )}
              >
                {employee.status || "Not Processed"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isFinalizedOrPaid && (
                <button
                  type="button"
                  onClick={() => setIsPayslipOpen(true)}
                  className="h-7 px-2.5 rounded-[6px] bg-[#E4F2D3] hover:bg-[#d8ecbe] text-[#0E4D41] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="View formatted official payslip"
                >
                  <FileText className="h-3 w-3 text-[#35BFA3]" />
                  <span>View Payslip</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#63716E] hover:text-[#203430] hover:bg-[#F7F7F7] transition-colors cursor-pointer shrink-0"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Employee Identification Strip */}
          <div className="px-5 py-3 bg-[#F7F7F7] border-b border-[#EBECEB] flex items-center justify-between flex-wrap gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="h-10 w-10 rounded-full object-cover border border-[#28C2A9]/40 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-bold text-[#203430] truncate">
                    {employee.name}
                  </span>
                  <span className="text-[11px] font-semibold text-[#63716E]">
                    {employee.id}
                  </span>
                  {struc?.name && (
                    <span className="text-[10px] bg-[#E4F2D3] text-[#0E4D41] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Layers className="h-2.5 w-2.5 text-[#35BFA3]" />
                      <span>{struc.name}</span>
                    </span>
                  )}
                  {override && (
                    <span className="text-[10px] bg-[#FFF8E7] text-[#B7791F] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#FEEBC8]">
                      <Sliders className="h-2.5 w-2.5 text-[#D69E2E]" />
                      <span>Override Active</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#63716E] truncate">
                  {employee.role || "Staff"} · {employee.subRole || employee.dept || "Corporate"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-[#63716E] bg-white px-2.5 py-1 rounded-[8px] border border-[#EBECEB] flex items-center gap-1.5 shadow-2xs">
                <Calendar className="h-3 w-3 text-[#35BFA3]" />
                <span>{period}</span>
              </span>

              {isFinalizedOrPaid && !isEditing && (
                <span className="text-[11px] font-semibold text-[#0E4D41] bg-[#E4F2D3] px-2.5 py-1 rounded-[8px] flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Finalized</span>
                </span>
              )}
            </div>
          </div>

          {/* =========================================================================
              2. SCROLLABLE FINANCIAL CONTENT
              ========================================================================= */}
          <div className="p-5 overflow-y-auto space-y-4 text-left flex-1">
            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                <span>{validationError}</span>
              </div>
            )}

            {/* ---------------------------------------------------------------------
                SECTION 1: DYNAMIC ITEMIZED EARNINGS
                --------------------------------------------------------------------- */}
            <div className="bg-white rounded-xl border border-[#EBECEB] p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#EBECEB] pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#35BFA3]" />
                  <h4 className="text-[13px] font-bold text-[#203430]">
                    Earnings ({struc?.name || "Corporate Structure"})
                  </h4>
                </div>
                <span className="text-[13px] font-bold text-[#0E4D41]">
                  ${grossEarnings.toLocaleString()}
                </span>
              </div>

              <div className="space-y-1.5 text-[12px]">
                {/* Basic Salary */}
                <div className="flex items-center justify-between py-1 border-b border-[#F7F7F7]">
                  <div>
                    <span className="text-[#203430] font-semibold">Basic Salary</span>
                    <p className="text-[10px] text-[#63716E]">
                      Standard recurring compensation
                      {override?.baseSalaryOverride && " (Contractual Override)"}
                    </p>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[#63716E]">$</span>
                      <input
                        type="number"
                        min="0"
                        value={baseSalary}
                        onChange={(e) => handleBaseSalaryChange(parseFloat(e.target.value) || 0)}
                        className="h-7 w-24 px-2 text-xs font-semibold text-right bg-white border border-[#E5E6E6] focus:border-[#35BFA3] rounded-md outline-none"
                      />
                    </div>
                  ) : (
                    <span className="font-semibold text-[#203430]">
                      ${baseSalary.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Configured Structure Allowances */}
                {allowanceItems.map((comp) => (
                  <div
                    key={comp.id}
                    className="flex items-center justify-between py-1 border-b border-[#F7F7F7]"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#203430] font-medium">{comp.name}</span>
                        {comp.isOverridden && (
                          <span className="text-[9px] bg-[#FFF8E7] text-[#B7791F] px-1.5 py-0.2 rounded font-semibold border border-[#FEEBC8]">
                            Override
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#63716E]">
                        {comp.type === "percentage"
                          ? `${comp.percentage}% of Basic Salary`
                          : comp.description || "Recurring allowance"}
                      </p>
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-[#63716E]">$</span>
                        <input
                          type="number"
                          min="0"
                          value={comp.amount}
                          onChange={(e) =>
                            handleAllowanceAmountChange(comp.id, parseFloat(e.target.value) || 0)
                          }
                          className="h-7 w-20 px-2 text-xs font-medium text-right bg-white border border-[#E5E6E6] focus:border-[#35BFA3] rounded-md outline-none"
                        />
                      </div>
                    ) : (
                      <span className="font-medium text-[#203430]">
                        ${comp.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                ))}

                {/* Overtime */}
                <div className="flex items-center justify-between py-1">
                  <div>
                    <span className="text-[#203430] font-medium">Approved Overtime</span>
                    <p className="text-[10px] text-[#63716E]">Biometric clocking logs</p>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[#63716E]">$</span>
                      <input
                        type="number"
                        min="0"
                        value={overtimeAmount}
                        onChange={(e) =>
                          setOvertimeAmount(Math.max(0, parseFloat(e.target.value) || 0))
                        }
                        className="h-7 w-20 px-2 text-xs font-medium text-right bg-white border border-[#E5E6E6] focus:border-[#35BFA3] rounded-md outline-none"
                      />
                    </div>
                  ) : (
                    <span className="font-medium text-[#203430]">
                      {overtimeAmount > 0 ? `$${overtimeAmount.toLocaleString()}` : "—"}
                    </span>
                  )}
                </div>

                {/* Incentives */}
                <div className="flex items-center justify-between py-1">
                  <div>
                    <span className="text-[#203430] font-medium">Performance Incentive / Bonus</span>
                    <p className="text-[10px] text-[#63716E]">Management award</p>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[#63716E]">$</span>
                      <input
                        type="number"
                        min="0"
                        value={incentiveAmount}
                        onChange={(e) =>
                          setIncentiveAmount(Math.max(0, parseFloat(e.target.value) || 0))
                        }
                        className="h-7 w-20 px-2 text-xs font-medium text-right bg-white border border-[#E5E6E6] focus:border-[#35BFA3] rounded-md outline-none"
                      />
                    </div>
                  ) : (
                    <span className="font-medium text-[#35BFA3]">
                      {incentiveAmount > 0 ? `+$${incentiveAmount.toLocaleString()}` : "—"}
                    </span>
                  )}
                </div>

                {/* Custom Reimbursements */}
                {customReimbursements.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-[#F7F7F7] text-[12px]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-[#203430] truncate">{r.name}</span>
                      {r.reason && (
                        <span className="text-[10px] text-[#63716E] truncate">({r.reason})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-[#0E4D41]">
                        +${r.amount.toLocaleString()}
                      </span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() =>
                            setCustomReimbursements((prev) =>
                              prev.filter((item) => item.id !== r.id)
                            )
                          }
                          className="text-[#A4ACAB] hover:text-red-500 cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Inline Add Reimbursement Action */}
              {isEditing && !showAddReimbursement && (
                <button
                  type="button"
                  onClick={() => setShowAddReimbursement(true)}
                  className="text-[11px] font-bold text-[#0E4D41] hover:text-[#35BFA3] flex items-center gap-1 cursor-pointer pt-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Expense Reimbursement</span>
                </button>
              )}

              {isEditing && showAddReimbursement && (
                <div className="mt-2 p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E6E6] space-y-2.5 animate-in fade-in">
                  <p className="text-[11px] font-bold text-[#203430]">
                    New Expense Reimbursement
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      value={newReimbType}
                      onChange={(e) => setNewReimbType(e.target.value)}
                      className="h-8 px-2 text-xs bg-white rounded-lg border border-[#E5E6E6] focus:border-[#35BFA3] outline-none"
                    >
                      <option value="Travel">Business Travel</option>
                      <option value="Medical">Medical Claim</option>
                      <option value="Fuel">Fuel Expense</option>
                      <option value="Client Meal">Client Meal</option>
                      <option value="Other">Other Expense</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Claim Title (optional)"
                      value={newReimbName}
                      onChange={(e) => setNewReimbName(e.target.value)}
                      className="h-8 px-2.5 text-xs bg-white rounded-lg border border-[#E5E6E6] focus:border-[#35BFA3] outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Amount ($)"
                      value={newReimbAmount}
                      onChange={(e) => setNewReimbAmount(e.target.value)}
                      className="h-8 px-2.5 text-xs bg-white rounded-lg border border-[#E5E6E6] focus:border-[#35BFA3] outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Approval notes / Claim ID"
                    value={newReimbReason}
                    onChange={(e) => setNewReimbReason(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs bg-white rounded-lg border border-[#E5E6E6] focus:border-[#35BFA3] outline-none"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddReimbursement(false)}
                      className="px-2.5 py-1 text-xs text-[#63716E] hover:text-[#203430] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddReimbursement}
                      className="px-3 py-1 text-xs font-bold bg-[#0E4D41] text-white rounded-lg hover:bg-[#1a5b50] cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ---------------------------------------------------------------------
                SECTION 2: DYNAMIC CORPORATE DEDUCTIONS (Taxes, Loans, Attendance, Custom)
                --------------------------------------------------------------------- */}
            <div className="bg-white rounded-xl border border-[#EBECEB] p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#EBECEB] pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <h4 className="text-[13px] font-bold text-[#203430]">Deductions</h4>
                </div>
                <span className="text-[13px] font-bold text-red-600">
                  -${totalAllDeductions.toLocaleString()}
                </span>
              </div>

              {/* Sub-group A: Configured Statutory Deductions */}
              <div className="space-y-1 text-[12px]">
                <p className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider mb-1">
                  Statutory Deductions ({struc?.name || "Corporate Framework"})
                </p>
                {dynamicDeductions.map((comp) => (
                  <div key={comp.id} className="flex items-center justify-between py-0.5">
                    <div>
                      <span className="text-[#63716E]">{comp.name}</span>
                      {comp.percentage && (
                        <span className="text-[10px] text-[#A4ACAB] ml-1">
                          ({comp.percentage}% {comp.basis || "basic"})
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-red-500">
                      -${comp.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Sub-group B: Employee Loans & Salary Advances */}
              {hasLoanRecord && (
                <div className="border border-[#EBECEB] rounded-lg p-2.5 bg-[#FAFAFA] space-y-1.5 text-[12px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#203430]">
                        Employee Loan Repayment
                      </span>
                      <p className="text-[10px] text-[#63716E]">
                        Balance: $1,200 · 8 installments remaining
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-red-500">
                        -${loanInstallment.toLocaleString()}
                      </span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => setShowLoanAdjust(!showLoanAdjust)}
                          className="text-[10px] font-bold text-[#0E4D41] bg-[#E4F2D3] px-2 py-0.5 rounded-[6px] hover:bg-[#d8ecbe] cursor-pointer"
                        >
                          Adjust
                        </button>
                      )}
                    </div>
                  </div>

                  {loanAdjustmentReason && (
                    <p className="text-[10px] text-[#63716E] border-t border-[#EBECEB] pt-1">
                      Adjustment note: {loanAdjustmentReason}
                    </p>
                  )}

                  {showLoanAdjust && isEditing && (
                    <div className="mt-2 pt-2 border-t border-[#EBECEB] space-y-2 animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold text-[#63716E] w-28">
                          Deduction Due ($):
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={loanInstallment}
                          onChange={(e) => {
                            const val = Math.max(0, parseFloat(e.target.value) || 0);
                            setLoanInstallment(val);
                          }}
                          className="h-7 w-24 px-2 text-xs bg-white border border-[#E5E6E6] rounded-md outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setLoanInstallment(0)}
                          className="text-[10px] font-semibold text-[#0E4D41] underline cursor-pointer"
                        >
                          Defer Installment
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Reason for loan installment adjustment"
                        value={loanAdjustmentReason}
                        onChange={(e) => setLoanAdjustmentReason(e.target.value)}
                        className="w-full h-7 px-2 text-xs bg-white border border-[#E5E6E6] rounded-md outline-none"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowLoanAdjust(false)}
                          className="text-[10px] font-bold bg-[#0E4D41] text-white px-2.5 py-0.5 rounded cursor-pointer"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-group C: Attendance-Related Deductions */}
              <div className="space-y-2 text-[12px]">
                <p className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider mb-1">
                  Attendance Penalties & Waivers
                </p>

                {/* Late Arrival Penalty */}
                <div className="border border-[#EBECEB] rounded-lg p-2.5 bg-[#FAFAFA]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#203430]">Late Arrival Penalty</span>
                      <p className="text-[10px] text-[#63716E]">Biometric clocking logs</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-red-500">
                        -${effectiveLateDeduction.toLocaleString()}
                      </span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => setShowLateAdjust(!showLateAdjust)}
                          className="text-[10px] font-bold text-[#0E4D41] bg-[#E4F2D3] px-2 py-0.5 rounded-[6px] hover:bg-[#d8ecbe] cursor-pointer"
                        >
                          Waive / Adjust
                        </button>
                      )}
                    </div>
                  </div>

                  {lateWaived > 0 && (
                    <div className="mt-1.5 text-[10px] text-[#63716E] flex items-center justify-between border-t border-[#EBECEB] pt-1">
                      <span>
                        Original: ${lateDeduction} | Waived:{" "}
                        <strong className="text-[#0E4D41]">${lateWaived}</strong>
                      </span>
                      {lateWaiverReason && <span>Reason: {lateWaiverReason}</span>}
                    </div>
                  )}

                  {showLateAdjust && isEditing && (
                    <div className="mt-2 pt-2 border-t border-[#EBECEB] space-y-2 animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold text-[#63716E] w-24">
                          Waive Amount ($):
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={lateDeduction}
                          value={lateWaived}
                          onChange={(e) => {
                            const val = Math.min(
                              lateDeduction,
                              Math.max(0, parseFloat(e.target.value) || 0)
                            );
                            setLateWaived(val);
                          }}
                          className="h-7 w-24 px-2 text-xs bg-white border border-[#E5E6E6] rounded-md outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setLateWaived(lateDeduction)}
                          className="text-[10px] font-semibold text-[#0E4D41] underline cursor-pointer"
                        >
                          Waive All
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Reason for waiver (e.g. Approved biometric glitch)"
                        value={lateWaiverReason}
                        onChange={(e) => setLateWaiverReason(e.target.value)}
                        className="w-full h-7 px-2 text-xs bg-white border border-[#E5E6E6] rounded-md outline-none"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowLateAdjust(false)}
                          className="text-[10px] font-bold bg-[#0E4D41] text-white px-2.5 py-0.5 rounded cursor-pointer"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Absence Penalty */}
                <div className="border border-[#EBECEB] rounded-lg p-2.5 bg-[#FAFAFA]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#203430]">
                        Unpaid Absence Deduction
                      </span>
                      <p className="text-[10px] text-[#63716E]">Unapproved leave logs</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-red-500">
                        -${effectiveAbsenceDeduction.toLocaleString()}
                      </span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => setShowAbsenceAdjust(!showAbsenceAdjust)}
                          className="text-[10px] font-bold text-[#0E4D41] bg-[#E4F2D3] px-2 py-0.5 rounded-[6px] hover:bg-[#d8ecbe] cursor-pointer"
                        >
                          Waive / Adjust
                        </button>
                      )}
                    </div>
                  </div>

                  {absenceWaived > 0 && (
                    <div className="mt-1.5 text-[10px] text-[#63716E] flex items-center justify-between border-t border-[#EBECEB] pt-1">
                      <span>
                        Original: ${absenceDeduction} | Waived:{" "}
                        <strong className="text-[#0E4D41]">${absenceWaived}</strong>
                      </span>
                      {absenceWaiverReason && <span>Reason: {absenceWaiverReason}</span>}
                    </div>
                  )}

                  {showAbsenceAdjust && isEditing && (
                    <div className="mt-2 pt-2 border-t border-[#EBECEB] space-y-2 animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold text-[#63716E] w-24">
                          Waive Amount ($):
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={absenceDeduction}
                          value={absenceWaived}
                          onChange={(e) => {
                            const val = Math.min(
                              absenceDeduction,
                              Math.max(0, parseFloat(e.target.value) || 0)
                            );
                            setAbsenceWaived(val);
                          }}
                          className="h-7 w-24 px-2 text-xs bg-white border border-[#E5E6E6] rounded-md outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setAbsenceWaived(absenceDeduction)}
                          className="text-[10px] font-semibold text-[#0E4D41] underline cursor-pointer"
                        >
                          Waive All
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Reason for waiver (e.g. Authorized medical emergency)"
                        value={absenceWaiverReason}
                        onChange={(e) => setAbsenceWaiverReason(e.target.value)}
                        className="w-full h-7 px-2 text-xs bg-white border border-[#E5E6E6] rounded-md outline-none"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowAbsenceAdjust(false)}
                          className="text-[10px] font-bold bg-[#0E4D41] text-white px-2.5 py-0.5 rounded cursor-pointer"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Deductions Added */}
              {customDeductions.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-[#F7F7F7] text-[12px]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-[#203430] truncate">{d.name}</span>
                    {d.reason && (
                      <span className="text-[10px] text-[#63716E] truncate">({d.reason})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-red-500">-${d.amount.toLocaleString()}</span>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() =>
                          setCustomDeductions((prev) => prev.filter((item) => item.id !== d.id))
                        }
                        className="text-[#A4ACAB] hover:text-red-500 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Custom Deduction Form */}
              {isEditing && !showAddDeduction && (
                <button
                  type="button"
                  onClick={() => setShowAddDeduction(true)}
                  className="text-[11px] font-bold text-[#0E4D41] hover:text-[#35BFA3] flex items-center gap-1 cursor-pointer pt-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Deduction</span>
                </button>
              )}

              {isEditing && showAddDeduction && (
                <div className="mt-2 p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E6E6] space-y-2.5 animate-in fade-in">
                  <p className="text-[11px] font-bold text-[#203430]">New Authorized Deduction</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      value={newDeductType}
                      onChange={(e) => setNewDeductType(e.target.value)}
                      className="h-8 px-2 text-xs bg-white rounded-lg border border-[#E5E6E6] focus:border-[#35BFA3] outline-none"
                    >
                      <option value="Equipment Recovery">Equipment Recovery</option>
                      <option value="Damage Recovery">Asset Damage Recovery</option>
                      <option value="Salary Advance">Salary Advance</option>
                      <option value="Other Repayment">Other Authorized Repayment</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Custom Name (optional)"
                      value={newDeductName}
                      onChange={(e) => setNewDeductName(e.target.value)}
                      className="h-8 px-2.5 text-xs bg-white rounded-lg border border-[#E5E6E6] focus:border-[#35BFA3] outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Amount ($)"
                      value={newDeductAmount}
                      onChange={(e) => setNewDeductAmount(e.target.value)}
                      className="h-8 px-2.5 text-xs bg-white rounded-lg border border-[#E5E6E6] focus:border-[#35BFA3] outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Mandatory justification / authorization notes"
                    value={newDeductReason}
                    onChange={(e) => setNewDeductReason(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs bg-white rounded-lg border border-[#E5E6E6] focus:border-[#35BFA3] outline-none"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddDeduction(false)}
                      className="px-2.5 py-1 text-xs text-[#63716E] hover:text-[#203430] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddDeduction}
                      className="px-3 py-1 text-xs font-bold bg-[#0E4D41] text-white rounded-lg hover:bg-[#1a5b50] cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ---------------------------------------------------------------------
                SECTION 3: PREMIUM PAYROLL SUMMARY
                --------------------------------------------------------------------- */}
            <div className="bg-[#E4F2D3]/70 rounded-[14px] p-4 border border-[#28C2A9]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 w-full sm:w-auto text-xs">
                <span className="text-[10px] font-bold text-[#0E4D41] uppercase tracking-wider block">
                  Net Payout Calculation
                </span>
                <div className="space-y-0.5 text-[#203430]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#63716E]">Gross Compensation:</span>
                    <strong className="text-[#0E4D41]">${grossEarnings.toLocaleString()}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#63716E]">Total Deductions:</span>
                    <strong className="text-red-600">-${totalAllDeductions.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              <div className="text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                <span className="text-[11px] font-semibold text-[#63716E] sm:mb-0.5">
                  NET PAYABLE:
                </span>
                <span className="text-[28px] font-bold text-[#0E4D41] leading-none tracking-tight">
                  ${netPayable.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              3. FOOTER ACTIONS
              ========================================================================= */}
          <div className="px-5 py-3.5 border-t border-[#EBECEB] bg-[#F7F7F7] flex items-center justify-between gap-3 shrink-0">
            <div>
              {isPaid && (
                <button
                  type="button"
                  onClick={() => setIsPayslipOpen(true)}
                  className="h-9 px-3.5 rounded-[8px] text-[12px] font-medium text-[#203430] bg-[#E4F2D3] hover:bg-[#d8ecbe] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5 text-[#0E4D41]" />
                  <span>View & Download Payslip</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-4 rounded-[8px] text-[12px] font-medium text-[#63716E] hover:text-[#203430] hover:bg-white transition-colors cursor-pointer"
              >
                Close
              </button>

              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={handleSaveDraftClick}
                    className="h-9 px-3.5 rounded-[8px] text-[12px] font-semibold text-[#203430] bg-white border border-[#E5E6E6] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
                  >
                    Save Draft
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowConfirmFinalize(true)}
                    className="h-9 px-4 rounded-[8px] text-[12px] font-bold text-white bg-[#35BFA3] hover:bg-[#28C2A9] active:bg-[#20aa94] transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Finalize Payroll</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Finalization Confirmation Dialog */}
          {showConfirmFinalize && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex items-center justify-center p-6 z-20 animate-in fade-in">
              <div className="max-w-md w-full text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#E4F2D3] text-[#0E4D41] flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6 text-[#0E4D41]" />
                </div>
                <div>
                  <h4 className="text-[17px] font-bold text-[#203430]">Finalize Payroll?</h4>
                  <p className="text-xs text-[#63716E] mt-1">
                    Confirm net compensation disbursement for <strong>{employee.name}</strong> for{" "}
                    <strong>{period}</strong>.
                  </p>
                </div>

                <div className="bg-[#F7F7F7] rounded-xl p-3 text-xs space-y-1.5 text-left border border-[#EBECEB]">
                  <div className="flex justify-between">
                    <span className="text-[#63716E]">Employee ID:</span>
                    <span className="font-semibold text-[#203430]">{employee.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#63716E]">Pay Structure:</span>
                    <span className="font-semibold text-[#0E4D41]">
                      {struc?.name || "Corporate Staff"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#63716E]">Period:</span>
                    <span className="font-semibold text-[#203430]">{period}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#EBECEB] pt-1.5">
                    <span className="font-bold text-[#203430]">Net Payable:</span>
                    <span className="font-bold text-[#0E4D41] text-sm">
                      ${netPayable.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmFinalize(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#63716E] hover:text-[#203430] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmFinalizeClick}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#35BFA3] hover:bg-[#28C2A9] rounded-xl cursor-pointer shadow-xs"
                  >
                    Confirm Finalization
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Payslip Modal for instant inspection */}
      <PayslipModal
        isOpen={isPayslipOpen}
        onClose={() => setIsPayslipOpen(false)}
        employee={currentModalRecord}
        period={period}
      />
    </>
  );
}
