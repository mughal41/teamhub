import * as React from "react";
import {
  X,
  Printer,
  Download,
  Building,
  CheckCircle,
  FileText,
  ShieldCheck,
  Calendar,
  Layers,
  Sliders,
  DollarSign,
  ArrowRight,
  CreditCard,
  User,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { TeamHubIcon } from "../ui/TeamHubLogo";
import {
  getEmployeePayStructure,
  getEmployeeOverride,
  calculateEmployeePayrollBreakdown,
  ResolvedPayrollBreakdown,
} from "../../lib/payrollResolver";

export interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
  period: string; // e.g. "June 2035"
}

// Convert dollar number to standard English words
function numberToWords(num: number): string {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (num === 0) return "Zero Dollars Only";
  const numInt = Math.floor(num);

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 !== 0 ? " " + inWords(n % 100) : "")
      );
    if (n < 1000000)
      return (
        inWords(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 !== 0 ? " " + inWords(n % 1000) : "")
      );
    return "";
  }

  return inWords(numInt) + " Dollars Only";
}

export function PayslipModal({ isOpen, onClose, employee, period }: PayslipModalProps) {
  if (!isOpen || !employee) return null;

  // Resolve breakdown from stored record or dynamically from assigned structure
  const parseNum = (val: any) => {
    if (!val || val === "—") return 0;
    if (typeof val === "number") return val;
    return parseFloat(String(val).replace(/[$,]/g, "")) || 0;
  };

  const struc = getEmployeePayStructure(employee.id, employee.subRole || employee.dept);
  const override = getEmployeeOverride(employee.id, struc?.id);

  const initialSalary = parseNum(employee.salary);
  const initialAllow = parseNum(employee.allowance);
  const initialOt = parseNum(employee.overtime);
  const initialInc = parseNum(employee.incen);
  const initialDed = parseNum(employee.deduct);

  const breakdown: ResolvedPayrollBreakdown = React.useMemo(() => {
    return calculateEmployeePayrollBreakdown({
      employee,
      structure: struc,
      override,
      manualBaseSalary: initialSalary > 0 ? initialSalary : undefined,
      overtime: initialOt,
      incentives: initialInc,
      lateDeduction: Math.round(initialDed * 0.4) || 25,
      absenceDeduction: Math.round(initialDed * 0.6) || 45,
    });
  }, [employee, struc, override, initialSalary, initialOt, initialInc, initialDed]);

  const payslipRefId = `PAY-${(period || "2035-06").replace(/\s+/g, "-")}-${employee.id}`;
  const issueDate = employee.date || `28 ${(period || "Jun").slice(0, 3)} 35`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-[#161c1a]/70 backdrop-blur-[4px] z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 print:p-0 print:bg-white">
      <div
        className="bg-white w-full max-w-[820px] max-h-[92vh] rounded-[16px] shadow-2xl flex flex-col overflow-hidden border border-[#EBECEB] my-auto select-none print:shadow-none print:border-none print:max-h-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="px-5 py-3 border-b border-[#EBECEB] flex items-center justify-between shrink-0 bg-white print:hidden">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#E4F2D3] flex items-center justify-center text-[#0E4D41]">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#203430] leading-none">
                Salary Payslip
              </h3>
              <p className="text-[10px] text-[#63716E] mt-0.5">
                Ref: {payslipRefId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="h-8 px-3 rounded-[8px] bg-[#E4F2D3] hover:bg-[#d8ecbe] text-[#0E4D41] text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print official copy"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#63716E] hover:text-[#203430] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Payslip Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-left flex-1 bg-white print:p-0">
          {/* Official Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b-2 border-[#203430] gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <TeamHubIcon size={24} color="#35BFA3" className="shrink-0" />
                <span className="text-[18px] font-bold text-[#203430] tracking-tight">
                  TeamHub HRMS
                </span>
              </div>
              <p className="text-[11px] text-[#63716E]">
                Enterprise Corporate Payroll & Human Resources
              </p>
              <p className="text-[10px] text-[#63716E]">
                100 Innovation Blvd, Suite 400 · Austin, TX 78701
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#0E4D41] bg-[#E4F2D3] px-2.5 py-0.5 rounded-full">
                CONFIDENTIAL PAYSLIP
              </span>
              <p className="text-[14px] font-bold text-[#203430]">
                Pay Period: {period}
              </p>
              <p className="text-[11px] text-[#63716E]">
                Disbursement Date: <strong>{issueDate}</strong>
              </p>
              <p className="text-[10px] text-[#63716E]">
                Reference: <span className="font-mono">{payslipRefId}</span>
              </p>
            </div>
          </div>

          {/* Employee Information & Assignment Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl bg-[#F7F7F7] border border-[#EBECEB] text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-[#63716E] uppercase tracking-wider">
                Employee
              </span>
              <p className="font-bold text-[#203430] text-[13px]">{employee.name}</p>
              <p className="text-[11px] text-[#63716E]">ID: {employee.id}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-[#63716E] uppercase tracking-wider">
                Position & Dept
              </span>
              <p className="font-semibold text-[#203430]">{employee.role}</p>
              <p className="text-[11px] text-[#63716E]">
                {employee.subRole || employee.dept || "Corporate"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-[#63716E] uppercase tracking-wider">
                Pay Structure
              </span>
              <p className="font-semibold text-[#0E4D41] flex items-center gap-1">
                <Layers className="h-3 w-3 text-[#35BFA3]" />
                <span className="truncate">{breakdown.structureName || "Standard Staff"}</span>
              </p>
              <p className="text-[10px] text-[#63716E]">
                {breakdown.structureId || "STRUC-001"}
                {breakdown.hasOverride && " · Override Active"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-[#63716E] uppercase tracking-wider">
                Disbursement
              </span>
              <p className="font-semibold text-[#203430] flex items-center gap-1">
                <CreditCard className="h-3 w-3 text-[#35BFA3]" />
                <span>Direct Deposit (ACH)</span>
              </p>
              <p className="text-[10px] text-[#63716E]">Status: {employee.status || "Paid"}</p>
            </div>
          </div>

          {/* Two-Column Side-by-Side Breakdown: Earnings vs Deductions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* LEFT: Itemized Earnings */}
            <div className="rounded-xl border border-[#EBECEB] overflow-hidden">
              <div className="bg-[#E4F2D3]/60 px-4 py-2.5 border-b border-[#EBECEB] flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#0E4D41] uppercase tracking-wider">
                  Gross Earnings Components
                </span>
                <span className="text-[11px] font-bold text-[#0E4D41]">Amount ($)</span>
              </div>
              <div className="divide-y divide-[#F7F7F7] text-xs">
                {/* Basic Salary */}
                <div className="px-4 py-2 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#203430]">Basic Salary</span>
                    <p className="text-[10px] text-[#63716E]">
                      Standard monthly rate gross
                      {breakdown.hasOverride && " (Contractual Override)"}
                    </p>
                  </div>
                  <span className="font-bold text-[#203430]">
                    ${breakdown.baseSalary.toLocaleString()}
                  </span>
                </div>

                {/* Configured Structure Allowances */}
                {breakdown.earningsComponents.map((comp) => (
                  <div key={comp.id} className="px-4 py-2 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-[#203430]">{comp.name}</span>
                      <p className="text-[10px] text-[#63716E]">
                        {comp.type === "percentage"
                          ? `${comp.percentage}% of basic`
                          : comp.description || "Recurring allowance"}
                        {comp.isOverridden && " · Special allowance"}
                      </p>
                    </div>
                    <span className="font-semibold text-[#203430]">
                      ${comp.amount.toLocaleString()}
                    </span>
                  </div>
                ))}

                {/* Overtime */}
                {breakdown.overtimeAmount > 0 && (
                  <div className="px-4 py-2 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-[#203430]">Approved Overtime</span>
                      <p className="text-[10px] text-[#63716E]">Biometric clocking hours</p>
                    </div>
                    <span className="font-semibold text-[#203430]">
                      +${breakdown.overtimeAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Incentives */}
                {breakdown.incentiveAmount > 0 && (
                  <div className="px-4 py-2 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-[#203430]">Performance Incentive</span>
                      <p className="text-[10px] text-[#63716E]">KPI award distribution</p>
                    </div>
                    <span className="font-semibold text-[#35BFA3]">
                      +${breakdown.incentiveAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Custom Reimbursements */}
                {breakdown.totalCustomReimbursements > 0 && (
                  <div className="px-4 py-2 flex items-center justify-between bg-[#F7F7F7]">
                    <div>
                      <span className="font-medium text-[#203430]">Expense Claims</span>
                      <p className="text-[10px] text-[#63716E]">Corporate expense approvals</p>
                    </div>
                    <span className="font-semibold text-[#0E4D41]">
                      +${breakdown.totalCustomReimbursements.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Total Gross Earnings */}
                <div className="px-4 py-2.5 bg-[#FAFAFA] flex items-center justify-between border-t border-[#EBECEB]">
                  <span className="font-bold text-[#203430]">Total Gross Earnings</span>
                  <span className="font-bold text-[#0E4D41] text-[13px]">
                    ${breakdown.grossEarnings.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: Itemized Deductions */}
            <div className="rounded-xl border border-[#EBECEB] overflow-hidden">
              <div className="bg-red-50/70 px-4 py-2.5 border-b border-[#EBECEB] flex items-center justify-between">
                <span className="text-[12px] font-bold text-red-700 uppercase tracking-wider">
                  Deductions & Withholdings
                </span>
                <span className="text-[11px] font-bold text-red-700">Amount ($)</span>
              </div>
              <div className="divide-y divide-[#F7F7F7] text-xs">
                {/* Configured Statutory Deductions */}
                {breakdown.deductionsComponents.map((comp) => (
                  <div key={comp.id} className="px-4 py-2 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-[#203430]">{comp.name}</span>
                      <p className="text-[10px] text-[#63716E]">
                        {comp.percentage
                          ? `${comp.percentage}% statutory withholding`
                          : comp.description || "Statutory contribution"}
                      </p>
                    </div>
                    <span className="font-semibold text-red-500">
                      -${comp.amount.toLocaleString()}
                    </span>
                  </div>
                ))}

                {/* Loan Installment */}
                {breakdown.loanInstallment > 0 && (
                  <div className="px-4 py-2 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-[#203430]">Employee Loan Repayment</span>
                      <p className="text-[10px] text-[#63716E]">Scheduled loan recovery</p>
                    </div>
                    <span className="font-semibold text-red-500">
                      -${breakdown.loanInstallment.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Late Arrival Penalty */}
                {breakdown.effectiveLateDeduction > 0 && (
                  <div className="px-4 py-2 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-[#203430]">Late Arrival Penalty</span>
                      <p className="text-[10px] text-[#63716E]">
                        Biometric clocking logs
                        {breakdown.lateWaived > 0 && ` ($${breakdown.lateWaived} waived)`}
                      </p>
                    </div>
                    <span className="font-semibold text-red-500">
                      -${breakdown.effectiveLateDeduction.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Unpaid Absence */}
                {breakdown.effectiveAbsenceDeduction > 0 && (
                  <div className="px-4 py-2 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-[#203430]">Unpaid Absence Deduction</span>
                      <p className="text-[10px] text-[#63716E]">
                        Unapproved leave record
                        {breakdown.absenceWaived > 0 && ` ($${breakdown.absenceWaived} waived)`}
                      </p>
                    </div>
                    <span className="font-semibold text-red-500">
                      -${breakdown.effectiveAbsenceDeduction.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Custom Deductions */}
                {breakdown.totalCustomDeductions > 0 && (
                  <div className="px-4 py-2 flex items-center justify-between bg-[#F7F7F7]">
                    <div>
                      <span className="font-medium text-[#203430]">Authorized Recoveries</span>
                      <p className="text-[10px] text-[#63716E]">Custom corporate withholding</p>
                    </div>
                    <span className="font-semibold text-red-500">
                      -${breakdown.totalCustomDeductions.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Total Deductions */}
                <div className="px-4 py-2.5 bg-[#FAFAFA] flex items-center justify-between border-t border-[#EBECEB]">
                  <span className="font-bold text-[#203430]">Total Deductions</span>
                  <span className="font-bold text-red-600 text-[13px]">
                    -${breakdown.totalDeductions.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* NET DISBURSEMENT HIGHLIGHT BANNER */}
          <div className="bg-[#E4F2D3] border-2 border-[#35BFA3] rounded-[16px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <ShieldCheck className="h-4 w-4 text-[#0E4D41]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0E4D41]">
                  Official Net Disbursed Compensation
                </span>
              </div>
              <p className="text-xs text-[#203430] italic">
                "{numberToWords(breakdown.netPayable)}"
              </p>
              <p className="text-[10px] text-[#63716E]">
                Gross (${breakdown.grossEarnings.toLocaleString()}) - Deductions ($
                {breakdown.totalDeductions.toLocaleString()})
              </p>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[11px] font-semibold text-[#63716E] block mb-0.5">
                NET PAYABLE AMOUNT:
              </span>
              <span className="text-[32px] font-extrabold text-[#0E4D41] leading-none tracking-tight">
                ${breakdown.netPayable.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Signatures & Verification Strip */}
          <div className="pt-6 border-t border-[#EBECEB] grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-[#63716E]">
            <div>
              <p className="font-semibold text-[#203430]">Authorized Payroll Officer</p>
              <div className="mt-8 border-b border-dashed border-[#A4ACAB] w-48" />
              <p className="text-[10px] text-[#63716E] mt-1">
                Sarah Jenkins · Head of HR & Payroll
              </p>
            </div>

            <div className="sm:text-right">
              <p className="font-semibold text-[#203430]">System Verification</p>
              <p className="text-[10px] text-[#63716E] mt-2">
                Digitally verified by TeamHub HRMS Security Subsystem
              </p>
              <p className="text-[10px] font-mono text-[#35BFA3] mt-0.5">
                HASH: {payslipRefId}-VERIFIED-OK
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions (Hidden during print) */}
        <div className="px-5 py-3 border-t border-[#EBECEB] bg-[#F7F7F7] flex items-center justify-between gap-3 shrink-0 print:hidden">
          <p className="text-[11px] text-[#63716E]">
            TeamHub HRMS · Confidential financial payslip document
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="h-8 px-4 rounded-[8px] text-[12px] font-bold text-[#0E4D41] bg-[#E4F2D3] hover:bg-[#d8ecbe] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-4 rounded-[8px] text-[12px] font-medium text-white bg-[#203430] hover:bg-[#162522] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
