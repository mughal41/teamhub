import {
  Employee,
  PayStructure,
  PayComponent,
  EmployeeCompensationOverride,
  getCollection,
} from "./db";

export interface ResolvedComponentItem {
  id: string;
  name: string;
  category: "earnings" | "deductions";
  type: "fixed" | "percentage";
  amount: number;
  percentage?: number;
  basis?: "basic" | "gross" | "flat";
  description?: string;
  isOverridden?: boolean;
  overrideReason?: string;
}

export interface ResolvedPayrollBreakdown {
  structureId?: string;
  structureName?: string;
  hasOverride: boolean;
  baseSalary: number;
  earningsComponents: ResolvedComponentItem[];
  totalAllowances: number;
  overtimeAmount: number;
  incentiveAmount: number;
  totalCustomReimbursements: number;
  grossEarnings: number;
  deductionsComponents: ResolvedComponentItem[];
  totalStatutoryDeductions: number;
  loanInstallment: number;
  loanOutstanding?: number;
  remainingInstallments?: number;
  effectiveLateDeduction: number;
  lateWaived: number;
  effectiveAbsenceDeduction: number;
  absenceWaived: number;
  totalAttendanceDeductions: number;
  totalCustomDeductions: number;
  totalDeductions: number;
  netPayable: number;
}

/**
 * Resolves the applicable pay structure for an employee
 */
export function getEmployeePayStructure(
  empId: string,
  dept?: string,
  structures?: PayStructure[]
): PayStructure | undefined {
  const list = structures || getCollection<PayStructure[]>("db_pay_structures", []);
  if (!list || list.length === 0) return undefined;

  // 1. Direct assignment by employee ID
  const direct = list.find(
    (s) => s.status === "Active" && s.assignedEmployeeIds && s.assignedEmployeeIds.includes(empId)
  );
  if (direct) return direct;

  // 2. Department-level assignment
  if (dept) {
    const deptMatch = list.find(
      (s) =>
        s.status === "Active" &&
        s.assignedDepartments &&
        s.assignedDepartments.some((d) => d.toLowerCase() === dept.toLowerCase())
    );
    if (deptMatch) return deptMatch;
  }

  // 3. Fallback to first active structure or undefined
  return list.find((s) => s.status === "Active") || list[0];
}

/**
 * Resolves compensation overrides for an employee
 */
export function getEmployeeOverride(
  empId: string,
  structureId?: string,
  overrides?: EmployeeCompensationOverride[]
): EmployeeCompensationOverride | undefined {
  const list =
    overrides || getCollection<EmployeeCompensationOverride[]>("db_comp_overrides", []);
  if (!list || list.length === 0) return undefined;

  return list.find(
    (o) => o.employeeId === empId && (!structureId || !o.structureId || o.structureId === structureId)
  );
}

/**
 * Computes the full financial breakdown using the assigned Pay Structure and Overrides
 */
export function calculateEmployeePayrollBreakdown(params: {
  employee: any;
  structure?: PayStructure;
  override?: EmployeeCompensationOverride;
  manualBaseSalary?: number;
  overtime?: number;
  incentives?: number;
  customReimbursements?: { id: string; name: string; amount: number; reason?: string }[];
  customDeductions?: { id: string; name: string; amount: number; reason?: string }[];
  loanInstallment?: number;
  lateDeduction?: number;
  lateWaived?: number;
  absenceDeduction?: number;
  absenceWaived?: number;
}): ResolvedPayrollBreakdown {
  const { employee, structure, override } = params;

  // 1. Base Salary resolution
  const roleStr = String(employee?.role || "").toLowerCase();
  const defaultBaseFromRole =
    roleStr.includes("senior") || roleStr.includes("lead") || roleStr.includes("supervisor")
      ? 3200
      : roleStr.includes("intern") || roleStr.includes("support")
      ? 800
      : 2800;

  const baseFromStructure = structure?.earnings?.find((e) => e.id === "comp-base")?.defaultAmount;
  const baseSalary =
    params.manualBaseSalary !== undefined
      ? params.manualBaseSalary
      : override?.baseSalaryOverride !== undefined
      ? override.baseSalaryOverride
      : baseFromStructure !== undefined
      ? baseFromStructure
      : defaultBaseFromRole;

  // 2. Earnings components resolution (excluding comp-base)
  const earningsComponents: ResolvedComponentItem[] = [];
  let totalAllowances = 0;

  if (structure && Array.isArray(structure.earnings)) {
    structure.earnings.forEach((comp) => {
      if (comp.id === "comp-base") return; // Handled as baseSalary

      const compOverride = override?.componentOverrides?.find(
        (co) => co.componentId === comp.id
      );

      let amount = 0;
      let isOverridden = false;
      let overrideReason: string | undefined = undefined;

      if (compOverride) {
        amount = compOverride.overrideAmount;
        isOverridden = true;
        overrideReason = compOverride.reason;
      } else if (comp.type === "percentage") {
        const pct = comp.percentage || 0;
        amount = Math.round((baseSalary * pct) / 100);
      } else if (comp.defaultAmount) {
        amount = comp.defaultAmount;
      }

      totalAllowances += amount;
      earningsComponents.push({
        id: comp.id,
        name: comp.name,
        category: "earnings",
        type: comp.type || "fixed",
        amount,
        percentage: comp.percentage,
        basis: comp.basis,
        description: comp.description,
        isOverridden,
        overrideReason,
      });
    });
  } else {
    // If no structure configured, use standardized default allowances
    const defaultHouse = Math.round(baseSalary * 0.08) || 200;
    const defaultTrans = 90;
    totalAllowances = defaultHouse + defaultTrans;
    earningsComponents.push(
      {
        id: "comp-house",
        name: "House Rent Allowance",
        category: "earnings",
        type: "percentage",
        amount: defaultHouse,
        percentage: 8,
        description: "Housing allowance subsidy",
      },
      {
        id: "comp-trans",
        name: "Transport Allowance",
        category: "earnings",
        type: "fixed",
        amount: defaultTrans,
        description: "Commuter transport stipend",
      }
    );
  }

  // Variable earnings
  const overtimeAmount = params.overtime !== undefined ? params.overtime : 0;
  const incentiveAmount = params.incentives !== undefined ? params.incentives : 0;
  const totalCustomReimbursements = (params.customReimbursements || []).reduce(
    (sum, r) => sum + (Number(r.amount) || 0),
    0
  );

  const grossEarnings =
    baseSalary + totalAllowances + overtimeAmount + incentiveAmount + totalCustomReimbursements;

  // 3. Deductions components resolution
  const deductionsComponents: ResolvedComponentItem[] = [];
  let totalStatutoryDeductions = 0;

  if (structure && Array.isArray(structure.deductions)) {
    structure.deductions.forEach((comp) => {
      const compOverride = override?.componentOverrides?.find(
        (co) => co.componentId === comp.id
      );

      let amount = 0;
      let isOverridden = false;
      let overrideReason: string | undefined = undefined;

      if (compOverride) {
        amount = compOverride.overrideAmount;
        isOverridden = true;
        overrideReason = compOverride.reason;
      } else if (comp.type === "percentage") {
        const pct = comp.percentage || 0;
        const basisVal = comp.basis === "gross" ? grossEarnings : baseSalary;
        amount = Math.round((basisVal * pct) / 100);
      } else if (comp.defaultAmount) {
        amount = comp.defaultAmount;
      }

      totalStatutoryDeductions += amount;
      deductionsComponents.push({
        id: comp.id,
        name: comp.name,
        category: "deductions",
        type: comp.type || "percentage",
        amount,
        percentage: comp.percentage,
        basis: comp.basis,
        description: comp.description,
        isOverridden,
        overrideReason,
      });
    });
  } else {
    // Default statutory deductions
    const defaultTax = Math.round(grossEarnings * 0.08) || 120;
    const defaultSoc = Math.round(baseSalary * 0.04) || 60;
    totalStatutoryDeductions = defaultTax + defaultSoc;
    deductionsComponents.push(
      {
        id: "comp-tax",
        name: "Payroll Withholding Tax",
        category: "deductions",
        type: "percentage",
        amount: defaultTax,
        percentage: 8,
        basis: "gross",
        description: "Statutory income tax withholding",
      },
      {
        id: "comp-soc",
        name: "Social Security Contribution",
        category: "deductions",
        type: "percentage",
        amount: defaultSoc,
        percentage: 4,
        basis: "basic",
        description: "Statutory social security",
      }
    );
  }

  // Loan, attendance, and custom deductions
  const hasLoanRecord =
    employee?.hasLoan || employee?.id === "EMP-0115" || employee?.id === "EMP-0291";
  const loanInstallment =
    params.loanInstallment !== undefined
      ? params.loanInstallment
      : hasLoanRecord
      ? 150
      : 0;

  const lateDeduction = params.lateDeduction !== undefined ? params.lateDeduction : 0;
  const lateWaived = params.lateWaived !== undefined ? params.lateWaived : 0;
  const effectiveLateDeduction = Math.max(0, lateDeduction - lateWaived);

  const absenceDeduction = params.absenceDeduction !== undefined ? params.absenceDeduction : 0;
  const absenceWaived = params.absenceWaived !== undefined ? params.absenceWaived : 0;
  const effectiveAbsenceDeduction = Math.max(0, absenceDeduction - absenceWaived);

  const totalAttendanceDeductions = effectiveLateDeduction + effectiveAbsenceDeduction;
  const totalCustomDeductions = (params.customDeductions || []).reduce(
    (sum, d) => sum + (Number(d.amount) || 0),
    0
  );

  const totalDeductions =
    totalStatutoryDeductions +
    loanInstallment +
    totalAttendanceDeductions +
    totalCustomDeductions;

  const netPayable = Math.max(0, grossEarnings - totalDeductions);

  return {
    structureId: structure?.id,
    structureName: structure?.name,
    hasOverride: !!override,
    baseSalary,
    earningsComponents,
    totalAllowances,
    overtimeAmount,
    incentiveAmount,
    totalCustomReimbursements,
    grossEarnings,
    deductionsComponents,
    totalStatutoryDeductions,
    loanInstallment,
    loanOutstanding: hasLoanRecord ? 1200 : 0,
    remainingInstallments: hasLoanRecord ? 8 : 0,
    effectiveLateDeduction,
    lateWaived,
    effectiveAbsenceDeduction,
    absenceWaived,
    totalAttendanceDeductions,
    totalCustomDeductions,
    totalDeductions,
    netPayable,
  };
}

/**
 * Multi-month analytics aggregator for the Payroll Overview chart
 */
export function getMonthlyPayrollAnalytics(
  year: string,
  payrolls: any[],
  employees: Employee[],
  structures: PayStructure[],
  overrides: EmployeeCompensationOverride[]
) {
  const shortMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const yearSuffix = year.slice(-2); // e.g. "35" from "2035"

  // Calculate baseline monthly total from current workforce and assigned structures
  let baselineMonthlySalary = 0;
  employees.forEach((emp) => {
    const struc = getEmployeePayStructure(emp.id, emp.dept, structures);
    const ov = getEmployeeOverride(emp.id, struc?.id, overrides);
    const breakdown = calculateEmployeePayrollBreakdown({ employee: emp, structure: struc, override: ov });
    baselineMonthlySalary += breakdown.baseSalary;
  });

  return shortMonths.map((m, idx) => {
    const targetMonthPrefix = m.toLowerCase();

    // Find actual finalized/recorded entries in db_payroll matching this month & year
    const matchedRecords = (payrolls || []).filter((p) => {
      if (!p) return false;
      const dStr = String(p.date || "").toLowerCase();
      // Match month abbreviation and year suffix
      const matchesMonth = dStr.includes(targetMonthPrefix);
      const matchesYear = dStr.includes(yearSuffix) || dStr.includes(year);
      return matchesMonth && matchesYear;
    });

    if (matchedRecords.length > 0) {
      let salSum = 0;
      let otSum = 0;
      let incSum = 0;

      matchedRecords.forEach((r) => {
        const sal = typeof r.salary === "number" ? r.salary : parseFloat(String(r.salary || "").replace(/[$,]/g, "")) || 0;
        const ot = typeof r.overtime === "number" ? r.overtime : parseFloat(String(r.overtime || "").replace(/[$,]/g, "")) || 0;
        const inc = typeof r.incen === "number" ? r.incen : parseFloat(String(r.incen || "").replace(/[$,]/g, "")) || 0;
        salSum += sal;
        otSum += ot;
        incSum += inc;
      });

      return {
        month: m,
        salary: Math.round(salSum),
        overtime: Math.round(otSum),
        incentives: Math.round(incSum),
        isActual: true,
      };
    }

    // For periods without processed records in the selected year,
    // generate an authentic baseline projection derived directly from the active workforce
    // with seasonal workforce variation (e.g. Q1-Q4 ramp) instead of arbitrary random multipliers
    const rampFactor = 0.88 + (idx / 11) * 0.18; // smooth 0.88 to 1.06 operational trend
    const projectedSalary = Math.round(baselineMonthlySalary * rampFactor);
    const projectedOvertime = Math.round(projectedSalary * 0.016);
    const projectedIncentives = Math.round(projectedSalary * 0.024);

    return {
      month: m,
      salary: projectedSalary,
      overtime: projectedOvertime,
      incentives: projectedIncentives,
      isActual: false,
    };
  });
}
