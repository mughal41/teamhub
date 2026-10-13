import * as React from "react";
import {
  PayStructure,
  PayComponent,
} from "../../lib/db";
import { cn } from "../../lib/utils";
import {
  X,
  Plus,
  Trash2,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Percent,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  Info,
  Search,
  ChevronDown,
  ChevronUp,
  Edit2,
  Lock,
  Building,
  Users,
  Calendar as CalendarIcon,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Card } from "../ui/LayoutAddons";
import { TeamHubDatePicker } from "../ui/DatePicker";

export interface PayStructureEditorProps {
  mode: "create" | "edit";
  initialStructure?: PayStructure | null;
  assignedEmployeesCount?: number;
  availableDepartments?: string[];
  onSave: (structure: PayStructure) => void;
  onCancel: () => void;
}

// Available catalog of standard earnings components
const EARNINGS_CATALOG = [
  {
    name: "Housing / Rent Allowance",
    description: "Standard residential housing subsidy or accommodation allowance",
    defaultType: "percentage" as const,
    defaultPercentage: 70,
    defaultAmount: 210,
    defaultBasis: "basic" as const,
  },
  {
    name: "Transport Allowance",
    description: "Commuter transport and transit reimbursement stipend",
    defaultType: "fixed" as const,
    defaultAmount: 90,
    defaultPercentage: 0,
    defaultBasis: "basic" as const,
  },
  {
    name: "Fuel Allowance",
    description: "Field transit, vehicle fuel, and mileage allowance",
    defaultType: "fixed" as const,
    defaultAmount: 120,
    defaultPercentage: 0,
    defaultBasis: "basic" as const,
  },
  {
    name: "Medical Allowance",
    description: "Annual outpatient healthcare and wellness stipend",
    defaultType: "fixed" as const,
    defaultAmount: 50,
    defaultPercentage: 0,
    defaultBasis: "basic" as const,
  },
  {
    name: "Meal Allowance",
    description: "Daily food and corporate subsistence subsidy",
    defaultType: "fixed" as const,
    defaultAmount: 80,
    defaultPercentage: 0,
    defaultBasis: "basic" as const,
  },
  {
    name: "Communication Allowance",
    description: "Mobile telephony, internet, and communication stipend",
    defaultType: "fixed" as const,
    defaultAmount: 50,
    defaultPercentage: 0,
    defaultBasis: "basic" as const,
  },
  {
    name: "Overtime Pay",
    description: "Approved extra-hours compensation rate",
    defaultType: "fixed" as const,
    defaultAmount: 0,
    defaultPercentage: 0,
    defaultBasis: "basic" as const,
  },
  {
    name: "Performance Incentive",
    description: "KPI and quarterly achievement bonus stipend",
    defaultType: "fixed" as const,
    defaultAmount: 0,
    defaultPercentage: 0,
    defaultBasis: "basic" as const,
  },
  {
    name: "Bonus",
    description: "Periodic discretionary or contractual bonus",
    defaultType: "fixed" as const,
    defaultAmount: 0,
    defaultPercentage: 0,
    defaultBasis: "basic" as const,
  },
  {
    name: "Remote Work & Internet Stipend",
    description: "Home office and high-speed connectivity subsidy",
    defaultType: "fixed" as const,
    defaultAmount: 75,
    defaultPercentage: 0,
    defaultBasis: "basic" as const,
  },
];

// Available catalog of standard recurring deductions
const DEDUCTIONS_CATALOG = [
  {
    name: "Employee Benefit Contributions",
    description: "Voluntary corporate benefit and welfare fund contribution",
    defaultType: "fixed" as const,
    defaultAmount: 40,
    defaultPercentage: 0,
    defaultBasis: "basic" as const,
  },
  {
    name: "Supplemental Health & Dental Plan",
    description: "Private supplemental healthcare and optical plan coverage",
    defaultType: "fixed" as const,
    defaultAmount: 60,
    defaultPercentage: 0,
    defaultBasis: "basic" as const,
  },
  {
    name: "Voluntary Pension & Retirement Fund",
    description: "Additional employee voluntary provident fund contribution",
    defaultType: "percentage" as const,
    defaultAmount: 0,
    defaultPercentage: 3,
    defaultBasis: "basic" as const,
  },
  {
    name: "Union & Professional Association Dues",
    description: "Authorized professional union membership subscription",
    defaultType: "fixed" as const,
    defaultAmount: 25,
    defaultPercentage: 0,
    defaultBasis: "basic" as const,
  },
  {
    name: "Wellness & Gym Subscription",
    description: "Corporate fitness and gym membership payroll deduction",
    defaultType: "fixed" as const,
    defaultAmount: 30,
    defaultPercentage: 0,
    defaultBasis: "basic" as const,
  },
];

// Dynamic date helper
function getDynamicEffectiveDate(): string {
  const d = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function PayStructureEditor({
  mode,
  initialStructure,
  assignedEmployeesCount = 0,
  availableDepartments = [
    "Executive Marketing",
    "Human Resources",
    "Operations",
    "Customer Service",
    "Product Design",
    "R&D",
  ],
  onSave,
  onCancel,
}: PayStructureEditorProps) {
  // Pristine initial values for change detection
  const isCreate = mode === "create";

  const defaultEffective = React.useMemo(() => {
    return initialStructure?.effectiveDate || getDynamicEffectiveDate();
  }, [initialStructure]);

  const defaultEarnings: PayComponent[] = React.useMemo(() => {
    if (initialStructure?.earnings && initialStructure.earnings.length > 0) {
      return JSON.parse(JSON.stringify(initialStructure.earnings));
    }
    // In Create mode, start with Core Basic Pay component
    return [
      {
        id: "comp-base",
        name: "Basic Pay",
        category: "earnings",
        type: "fixed",
        defaultAmount: 2800,
        isRecurring: true,
        allowOverride: true,
        description: "Employee-specific contractual base salary gross",
      },
    ];
  }, [initialStructure]);

  const defaultDeductions: PayComponent[] = React.useMemo(() => {
    if (initialStructure?.deductions && initialStructure.deductions.length > 0) {
      return JSON.parse(JSON.stringify(initialStructure.deductions));
    }
    // In Create mode, start with standard referenced statutory deductions
    return [
      {
        id: "comp-tax",
        name: "Payroll Income Tax",
        category: "deductions",
        type: "percentage",
        percentage: 8,
        basis: "gross",
        isRecurring: true,
        allowOverride: false,
        description: "Statutory income tax withholding bracket",
      },
      {
        id: "comp-soc",
        name: "Social Security Contribution",
        category: "deductions",
        type: "percentage",
        percentage: 4,
        basis: "basic",
        isRecurring: true,
        allowOverride: false,
        description: "Mandatory social protection insurance",
      },
    ];
  }, [initialStructure]);

  // Form State
  const [name, setName] = React.useState(initialStructure?.name || "");
  const [description, setDescription] = React.useState(initialStructure?.description || "");
  const [effectiveDate, setEffectiveDate] = React.useState(defaultEffective);
  const [status, setStatus] = React.useState<"Active" | "Inactive">(
    initialStructure?.status || "Active"
  );

  // Applicability state (Separate from assignment)
  const [scopeType, setScopeType] = React.useState<string>(() => {
    const existing = initialStructure?.applicableScope || "";
    if (!existing || existing === "All Departments" || existing === "Organization-Wide") {
      return "Organization-Wide";
    }
    if (availableDepartments.includes(existing)) {
      return "Department";
    }
    if (existing.includes("Executive") || existing.includes("Staff") || existing.includes("Group")) {
      return "Pay Group";
    }
    return "Custom";
  });
  const [scopeValue, setScopeValue] = React.useState<string>(
    initialStructure?.applicableScope || "Organization-Wide"
  );

  // Components lists
  const [earnings, setEarnings] = React.useState<PayComponent[]>(defaultEarnings);
  const [deductions, setDeductions] = React.useState<PayComponent[]>(defaultDeductions);

  // Expanded inline component editor IDs (progressive disclosure)
  const [expandedCompIds, setExpandedCompIds] = React.useState<Set<string>>(new Set());

  // Component Catalog Selectors popovers
  const [isEarningsCatalogOpen, setIsEarningsCatalogOpen] = React.useState(false);
  const [earningsSearch, setEarningsSearch] = React.useState("");

  const [isDeductionsCatalogOpen, setIsDeductionsCatalogOpen] = React.useState(false);
  const [deductionsSearch, setDeductionsSearch] = React.useState("");

  // Review modal state & Unsaved changes modal
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  // Track if form is dirty
  const isDirty = React.useMemo(() => {
    if (isCreate) {
      return (
        name.trim().length > 0 ||
        description.trim().length > 0 ||
        earnings.length > 1 ||
        deductions.length > 2 ||
        scopeValue !== "Organization-Wide"
      );
    }
    // Edit mode comparison
    return (
      name !== (initialStructure?.name || "") ||
      description !== (initialStructure?.description || "") ||
      effectiveDate !== (initialStructure?.effectiveDate || "") ||
      status !== (initialStructure?.status || "Active") ||
      scopeValue !== (initialStructure?.applicableScope || "") ||
      JSON.stringify(earnings) !== JSON.stringify(initialStructure?.earnings || []) ||
      JSON.stringify(deductions) !== JSON.stringify(initialStructure?.deductions || [])
    );
  }, [
    isCreate,
    name,
    description,
    effectiveDate,
    status,
    scopeValue,
    earnings,
    deductions,
    initialStructure,
  ]);

  // Toggle inline expansion for progressive disclosure
  const toggleExpand = (id: string) => {
    setExpandedCompIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Safe handlers for Earnings
  const handleUpdateEarning = (id: string, field: keyof PayComponent, val: any) => {
    setEarnings((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
  };

  const handleRemoveEarning = (id: string) => {
    if (id === "comp-base") return; // Protect required Core Basic Pay
    setEarnings((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddEarningFromCatalog = (catalogItem: typeof EARNINGS_CATALOG[0]) => {
    const newId = `comp-earn-${Date.now()}`;
    const newComp: PayComponent = {
      id: newId,
      name: catalogItem.name,
      category: "earnings",
      type: catalogItem.defaultType,
      defaultAmount: catalogItem.defaultAmount,
      percentage: catalogItem.defaultPercentage,
      basis: catalogItem.defaultBasis,
      isRecurring: true,
      allowOverride: true,
      description: catalogItem.description,
    };
    setEarnings((prev) => [...prev, newComp]);
    setExpandedCompIds((prev) => new Set(prev).add(newId));
    setIsEarningsCatalogOpen(false);
    setEarningsSearch("");
  };

  // Safe handlers for Deductions
  const handleUpdateDeduction = (id: string, field: keyof PayComponent, val: any) => {
    setDeductions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
  };

  const handleRemoveDeduction = (id: string) => {
    // Check if it's statutory (tax or soc)
    const target = deductions.find((d) => d.id === id);
    if (target?.id === "comp-tax" || target?.id === "comp-soc") {
      setValidationError("Mandatory statutory deductions are managed by payroll policy and cannot be waived.");
      return;
    }
    setDeductions((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddDeductionFromCatalog = (catalogItem: typeof DEDUCTIONS_CATALOG[0]) => {
    const newId = `comp-deduct-${Date.now()}`;
    const newComp: PayComponent = {
      id: newId,
      name: catalogItem.name,
      category: "deductions",
      type: catalogItem.defaultType,
      defaultAmount: catalogItem.defaultAmount,
      percentage: catalogItem.defaultPercentage,
      basis: catalogItem.defaultBasis,
      isRecurring: true,
      allowOverride: false,
      description: catalogItem.description,
    };
    setDeductions((prev) => [...prev, newComp]);
    setExpandedCompIds((prev) => new Set(prev).add(newId));
    setIsDeductionsCatalogOpen(false);
    setDeductionsSearch("");
  };

  // Validation before review
  const handleOpenReview = () => {
    if (!name.trim()) {
      setValidationError("Structure Name is required.");
      return;
    }
    if (!effectiveDate.trim()) {
      setValidationError("Effective Date is required.");
      return;
    }
    const hasBasePay = earnings.some((e) => e.id === "comp-base" || e.name.toLowerCase().includes("basic"));
    if (!hasBasePay) {
      setValidationError("Structure must include a Basic Pay component.");
      return;
    }

    setValidationError(null);
    setIsReviewModalOpen(true);
  };

  // Cancel button click with unsaved changes confirmation
  const handleCancelClick = () => {
    if (isDirty) {
      setIsDiscardModalOpen(true);
    } else {
      onCancel();
    }
  };

  // Construct final structure payload
  const finalStructurePayload: PayStructure = {
    id: initialStructure?.id || `STRUC-00${Date.now().toString().slice(-3)}`,
    name: name.trim(),
    description: description.trim() || (isCreate ? "Configured organizational pay structure." : ""),
    applicableScope: scopeValue.trim() || "Organization-Wide",
    effectiveDate: effectiveDate.trim(),
    status,
    assignedEmployeeIds: initialStructure?.assignedEmployeeIds || [],
    assignedDepartments: initialStructure?.assignedDepartments || [],
    earnings,
    deductions,
  };

  // Filter catalogs preventing duplicates
  const availableEarningsOptions = EARNINGS_CATALOG.filter(
    (item) =>
      !earnings.some((e) => e.name.toLowerCase() === item.name.toLowerCase()) &&
      item.name.toLowerCase().includes(earningsSearch.toLowerCase())
  );

  const availableDeductionsOptions = DEDUCTIONS_CATALOG.filter(
    (item) =>
      !deductions.some((d) => d.name.toLowerCase() === item.name.toLowerCase()) &&
      item.name.toLowerCase().includes(deductionsSearch.toLowerCase())
  );

  return (
    <div className="space-y-5 text-left">
      <Card className="p-5 border border-[#EBECEB] rounded-[16px] bg-white shadow-2xs space-y-6">
        {/* =========================================================================
            HEADER: Title, Mode Indicator, Cancel & Review Action
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBECEB] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                  isCreate
                    ? "bg-[#35BFA3] text-white"
                    : "bg-[#E4F2D3] text-[#0E4D41]"
                )}
              >
                {isCreate ? "New Structure Configuration" : "Editing Structure Template"}
              </span>
              {!isCreate && initialStructure && (
                <span className="text-xs text-[#63716E]">
                  ID: {initialStructure.id}
                </span>
              )}
            </div>
            <h3 className="text-[19px] font-bold text-[#203430] tracking-[-0.03em] mt-1">
              {isCreate ? "Create Pay Structure" : "Edit Pay Structure"}
            </h3>
            <p className="text-xs text-[#63716E]">
              {isCreate
                ? "Configure compensation components, allowances, recurring deductions, and applicability."
                : "Modify compensation rules, component parameters, and applicability policies."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCancelClick}
              className="h-8.5 px-3.5 rounded-xl text-xs font-semibold border border-[#EBECEB] bg-white text-[#63716E] hover:text-[#203430] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleOpenReview}
              className="h-8.5 px-4 rounded-xl text-xs font-bold bg-[#35BFA3] hover:bg-[#28C2A9] text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isCreate ? "Review Structure" : "Review Changes"}</span>
            </button>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-2 text-xs text-red-700 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{validationError}</span>
            </div>
            <button
              type="button"
              onClick={() => setValidationError(null)}
              className="text-red-500 hover:text-red-800 text-[11px] font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Inactive Status Impact Notice in Edit Mode */}
        {!isCreate && status === "Inactive" && assignedEmployeesCount > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-bold">Deactivation Notice:</span>
              <p className="mt-0.5">
                Marking this structure as Inactive will flag {assignedEmployeesCount} currently enrolled employees during monthly payroll reviews.
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            1. GENERAL DETAILS SECTION
            ========================================================================= */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-1.5">
            <Sliders className="h-4 w-4 text-[#35BFA3]" />
            <h4 className="text-xs font-bold text-[#203430] uppercase tracking-wider">
              1. General Details
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#63716E] uppercase">
                Structure Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Standard Employee"
                className="w-full h-8.5 px-3 bg-[#F7F7F7] border border-[#EBECEB] rounded-xl text-xs text-[#203430] outline-none focus:border-[#35BFA3] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#63716E] uppercase">
                Effective Date <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <TeamHubDatePicker
                  mode="date"
                  label={effectiveDate}
                  align="left"
                  onChange={(val) => setEffectiveDate(val.label)}
                  buttonClassName="w-full h-8.5 justify-start bg-[#F7F7F7] border border-[#EBECEB] text-xs font-semibold text-[#203430] hover:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#63716E] uppercase">
                Description <span className="text-[#63716E]/70 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short summary of compensation model and grade level..."
                className="w-full h-8.5 px-3 bg-[#F7F7F7] border border-[#EBECEB] rounded-xl text-xs text-[#203430] outline-none focus:border-[#35BFA3] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#63716E] uppercase">
                Structure Status
              </label>
              <div className="flex items-center gap-4 h-8.5 px-3 bg-[#F7F7F7] border border-[#EBECEB] rounded-xl">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#203430]">
                  <input
                    type="radio"
                    name="structureStatus"
                    checked={status === "Active"}
                    onChange={() => setStatus("Active")}
                    className="accent-[#35BFA3]"
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#63716E]">
                  <input
                    type="radio"
                    name="structureStatus"
                    checked={status === "Inactive"}
                    onChange={() => setStatus("Inactive")}
                    className="accent-[#35BFA3]"
                  />
                  <span>Inactive</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. EARNINGS & ALLOWANCES SECTION
            ========================================================================= */}
        <div className="space-y-3 pt-3 border-t border-[#EBECEB]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#35BFA3]" />
                <h4 className="text-xs font-bold text-[#203430] uppercase tracking-wider">
                  2. Earnings & Allowances
                </h4>
              </div>
              <p className="text-[11px] text-[#63716E] mt-0.5">
                Configure baseline earnings components and eligible allowance allowances.
              </p>
            </div>

            {/* Add Component Action with Catalog Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsEarningsCatalogOpen(!isEarningsCatalogOpen);
                  setIsDeductionsCatalogOpen(false);
                }}
                className="h-7 px-2.5 rounded-lg text-[11px] font-bold bg-[#E4F2D3] text-[#0E4D41] hover:bg-[#d5ebb8] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>+ Add Component</span>
              </button>

              {/* Earnings Catalog Dropdown */}
              {isEarningsCatalogOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsEarningsCatalogOpen(false)}
                  />
                  <div className="absolute right-0 top-8 z-50 w-72 bg-white rounded-xl shadow-xl border border-[#EBECEB] p-2.5 space-y-2 animate-in fade-in duration-150">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#63716E]" />
                      <input
                        type="text"
                        placeholder="Search allowances..."
                        value={earningsSearch}
                        onChange={(e) => setEarningsSearch(e.target.value)}
                        className="w-full h-7 pl-7 pr-2 text-[11px] bg-[#F7F7F7] border border-[#EBECEB] rounded-lg outline-none focus:border-[#35BFA3]"
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto divide-y divide-[#EBECEB]/50 text-xs">
                      {availableEarningsOptions.length === 0 ? (
                        <div className="p-3 text-center text-[11px] text-[#63716E]">
                          No further allowances available or all already added.
                        </div>
                      ) : (
                        availableEarningsOptions.map((item) => (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => handleAddEarningFromCatalog(item)}
                            className="w-full text-left p-2 hover:bg-[#F7F7F7] rounded-lg transition-colors flex items-center justify-between group"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="font-semibold text-[#203430] text-[11px] block truncate group-hover:text-[#0E4D41]">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-[#63716E] line-clamp-1">
                                {item.description}
                              </span>
                            </div>
                            <Plus className="h-3.5 w-3.5 text-[#35BFA3] shrink-0" />
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Earnings Components List with Progressive Disclosure */}
          <div className="border border-[#EBECEB] rounded-xl overflow-hidden divide-y divide-[#EBECEB]">
            {earnings.map((comp) => {
              const isBasePay = comp.id === "comp-base";
              const isExpanded = expandedCompIds.has(comp.id);

              return (
                <div key={comp.id} className="bg-white">
                  {/* Collapsed Header Row */}
                  <div className="p-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      {isBasePay ? (
                        <span className="w-2 h-2 rounded-full bg-[#0E4D41] shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-[#35BFA3] shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#203430]">{comp.name}</span>
                          {isBasePay && (
                            <span className="bg-[#0E4D41] text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                              Core Component
                            </span>
                          )}
                          <span className="bg-[#F7F7F7] text-[#63716E] text-[10px] font-medium px-2 py-0.5 rounded border border-[#EBECEB]">
                            {comp.type === "percentage"
                              ? `${comp.percentage}% of ${comp.basis === "gross" ? "Gross" : "Basic"}`
                              : comp.defaultAmount
                              ? `Fixed ($${comp.defaultAmount.toLocaleString()})`
                              : "Employee-Specific"}
                          </span>
                          {comp.allowOverride && !isBasePay && (
                            <span className="text-[#0E4D41] text-[9px] font-semibold bg-[#E4F2D3] px-1.5 py-0.2 rounded">
                              Override Allowed
                            </span>
                          )}
                        </div>
                        {comp.description && (
                          <p className="text-[11px] text-[#63716E] mt-0.5 line-clamp-1">
                            {comp.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleExpand(comp.id)}
                        className="h-7 px-2.5 rounded-lg text-[11px] font-semibold border border-[#EBECEB] bg-white text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-1 transition-colors cursor-pointer"
                        title={isExpanded ? "Collapse inline configuration" : "Configure component"}
                      >
                        <Edit2 className="h-3 w-3 text-[#63716E]" />
                        <span>{isExpanded ? "Close" : "Edit"}</span>
                      </button>

                      {!isBasePay && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEarning(comp.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove component"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Expanded Controls (Progressive Disclosure) */}
                  {isExpanded && (
                    <div className="p-3.5 bg-[#F7F7F7] border-t border-[#EBECEB] space-y-3 animate-in fade-in duration-100 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#63716E] uppercase">
                            Calculation Method
                          </label>
                          <div className="flex items-center rounded-lg border border-[#EBECEB] bg-white p-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdateEarning(comp.id, "type", "fixed");
                                if (!comp.defaultAmount) handleUpdateEarning(comp.id, "defaultAmount", 200);
                              }}
                              className={cn(
                                "flex-1 py-1 text-[11px] font-semibold rounded cursor-pointer",
                                comp.type === "fixed" && (comp.defaultAmount ?? 0) > 0
                                  ? "bg-[#0E4D41] text-white"
                                  : "text-[#63716E] hover:text-[#203430]"
                              )}
                            >
                              Fixed Amount ($)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdateEarning(comp.id, "type", "percentage");
                                if (!comp.percentage) handleUpdateEarning(comp.id, "percentage", 10);
                              }}
                              className={cn(
                                "flex-1 py-1 text-[11px] font-semibold rounded cursor-pointer",
                                comp.type === "percentage"
                                  ? "bg-[#0E4D41] text-white"
                                  : "text-[#63716E] hover:text-[#203430]"
                              )}
                            >
                              % Percentage
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdateEarning(comp.id, "type", "fixed");
                                handleUpdateEarning(comp.id, "defaultAmount", 0);
                              }}
                              className={cn(
                                "flex-1 py-1 text-[11px] font-semibold rounded cursor-pointer",
                                comp.type === "fixed" && comp.defaultAmount === 0
                                  ? "bg-[#0E4D41] text-white"
                                  : "text-[#63716E] hover:text-[#203430]"
                              )}
                            >
                              Employee-Specific
                            </button>
                          </div>
                        </div>

                        {/* Amount or Percentage Input */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#63716E] uppercase">
                            {comp.type === "percentage"
                              ? "Rate Percentage (%)"
                              : comp.defaultAmount === 0
                              ? "Value Resolution"
                              : "Default Reference Amount ($)"}
                          </label>

                          {comp.type === "percentage" ? (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 bg-white border border-[#EBECEB] rounded-lg px-2.5 h-8">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={comp.percentage ?? 0}
                                  onChange={(e) =>
                                    handleUpdateEarning(
                                      comp.id,
                                      "percentage",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-16 text-xs font-bold text-[#0E4D41] outline-none"
                                />
                                <span className="text-[11px] font-bold text-[#63716E]">%</span>
                              </div>
                              <select
                                value={comp.basis || "basic"}
                                onChange={(e) =>
                                  handleUpdateEarning(
                                    comp.id,
                                    "basis",
                                    e.target.value as "basic" | "gross"
                                  )
                                }
                                className="h-8 px-2 bg-white border border-[#EBECEB] rounded-lg text-xs text-[#203430] outline-none"
                              >
                                <option value="basic">of Basic Salary</option>
                                <option value="gross">of Gross Total</option>
                              </select>
                            </div>
                          ) : comp.defaultAmount === 0 ? (
                            <div className="h-8 px-2.5 bg-white border border-[#EBECEB] rounded-lg flex items-center text-[11px] text-[#63716E]">
                              Determined by employee's specific contractual compensation
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 bg-white border border-[#EBECEB] rounded-lg px-2.5 h-8">
                              <span className="text-[11px] font-bold text-[#63716E]">$</span>
                              <input
                                type="number"
                                min="0"
                                step="25"
                                value={comp.defaultAmount ?? 0}
                                onChange={(e) =>
                                  handleUpdateEarning(
                                    comp.id,
                                    "defaultAmount",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-28 text-xs font-bold text-[#0E4D41] outline-none"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#63716E] uppercase">
                            Policy Description / Justification
                          </label>
                          <input
                            type="text"
                            value={comp.description || ""}
                            onChange={(e) =>
                              handleUpdateEarning(comp.id, "description", e.target.value)
                            }
                            placeholder="Guidelines for this component..."
                            className="w-full h-8 px-2.5 bg-white border border-[#EBECEB] rounded-lg text-xs outline-none focus:border-[#35BFA3]"
                          />
                        </div>

                        {!isBasePay && (
                          <div className="flex items-center pt-5">
                            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#203430]">
                              <input
                                type="checkbox"
                                checked={!!comp.allowOverride}
                                onChange={(e) =>
                                  handleUpdateEarning(comp.id, "allowOverride", e.target.checked)
                                }
                                className="accent-[#35BFA3] rounded"
                              />
                              <span className="font-semibold">
                                Allow individual employee compensation overrides
                              </span>
                            </label>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => toggleExpand(comp.id)}
                          className="text-[11px] font-bold text-[#0E4D41] hover:underline"
                        >
                          Done Editing
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            3. DEDUCTIONS & POLICIES SECTION
            ========================================================================= */}
        <div className="space-y-3 pt-3 border-t border-[#EBECEB]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <h4 className="text-xs font-bold text-[#203430] uppercase tracking-wider">
                  3. Deductions & Policies
                </h4>
              </div>
              <p className="text-[11px] text-[#63716E] mt-0.5">
                Statutory withholding policies and configured recurring company deductions.
              </p>
            </div>

            {/* Add Deduction Action with Catalog Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsDeductionsCatalogOpen(!isDeductionsCatalogOpen);
                  setIsEarningsCatalogOpen(false);
                }}
                className="h-7 px-2.5 rounded-lg text-[11px] font-bold bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>+ Add Deduction Component</span>
              </button>

              {/* Deductions Catalog Dropdown */}
              {isDeductionsCatalogOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDeductionsCatalogOpen(false)}
                  />
                  <div className="absolute right-0 top-8 z-50 w-72 bg-white rounded-xl shadow-xl border border-[#EBECEB] p-2.5 space-y-2 animate-in fade-in duration-150">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#63716E]" />
                      <input
                        type="text"
                        placeholder="Search company deductions..."
                        value={deductionsSearch}
                        onChange={(e) => setDeductionsSearch(e.target.value)}
                        className="w-full h-7 pl-7 pr-2 text-[11px] bg-[#F7F7F7] border border-[#EBECEB] rounded-lg outline-none focus:border-[#35BFA3]"
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto divide-y divide-[#EBECEB]/50 text-xs">
                      {availableDeductionsOptions.length === 0 ? (
                        <div className="p-3 text-center text-[11px] text-[#63716E]">
                          No further company deductions available.
                        </div>
                      ) : (
                        availableDeductionsOptions.map((item) => (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => handleAddDeductionFromCatalog(item)}
                            className="w-full text-left p-2 hover:bg-[#F7F7F7] rounded-lg transition-colors flex items-center justify-between group"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="font-semibold text-[#203430] text-[11px] block truncate group-hover:text-red-700">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-[#63716E] line-clamp-1">
                                {item.description}
                              </span>
                            </div>
                            <Plus className="h-3.5 w-3.5 text-red-500 shrink-0" />
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Deductions List with Statutory Protection */}
          <div className="border border-[#EBECEB] rounded-xl overflow-hidden divide-y divide-[#EBECEB]">
            {deductions.map((comp) => {
              const isStatutory = comp.id === "comp-tax" || comp.id === "comp-soc";
              const isExpanded = expandedCompIds.has(comp.id);

              return (
                <div key={comp.id} className="bg-white">
                  <div className="p-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#203430]">{comp.name}</span>
                          {isStatutory ? (
                            <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3" />
                              <span>Managed by Payroll Policy</span>
                            </span>
                          ) : (
                            <span className="bg-[#F7F7F7] text-[#63716E] text-[10px] font-medium px-2 py-0.5 rounded border border-[#EBECEB]">
                              Company Recurring Deduction
                            </span>
                          )}
                          <span className="text-red-600 font-semibold text-[11px]">
                            {comp.type === "percentage"
                              ? `${comp.percentage}% Rate`
                              : `$${comp.defaultAmount ?? 0}`}
                          </span>
                        </div>
                        {comp.description && (
                          <p className="text-[11px] text-[#63716E] mt-0.5 line-clamp-1">
                            {comp.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleExpand(comp.id)}
                        className="h-7 px-2.5 rounded-lg text-[11px] font-semibold border border-[#EBECEB] bg-white text-[#203430] hover:bg-[#F7F7F7] flex items-center gap-1 transition-colors cursor-pointer"
                        title={isExpanded ? "Collapse inline configuration" : "Configure component"}
                      >
                        <Edit2 className="h-3 w-3 text-[#63716E]" />
                        <span>{isExpanded ? "Close" : "Edit"}</span>
                      </button>

                      {!isStatutory && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDeduction(comp.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove deduction"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Expanded Controls for Deductions */}
                  {isExpanded && (
                    <div className="p-3.5 bg-[#F7F7F7] border-t border-[#EBECEB] space-y-3 animate-in fade-in duration-100 text-xs">
                      {isStatutory && (
                        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-[11px] text-blue-800">
                          <Lock className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                          <span>
                            This mandatory statutory deduction is referenced by corporate payroll policy. Percentage rates apply automatically based on statutory wage tables.
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#63716E] uppercase">
                            Calculation Type
                          </label>
                          <div className="flex items-center rounded-lg border border-[#EBECEB] bg-white p-0.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateDeduction(comp.id, "type", "percentage")}
                              className={cn(
                                "flex-1 py-1 text-[11px] font-semibold rounded cursor-pointer",
                                comp.type === "percentage"
                                  ? "bg-red-600 text-white"
                                  : "text-[#63716E] hover:text-[#203430]"
                              )}
                            >
                              % Statutory / Rate
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateDeduction(comp.id, "type", "fixed")}
                              className={cn(
                                "flex-1 py-1 text-[11px] font-semibold rounded cursor-pointer",
                                comp.type === "fixed"
                                  ? "bg-red-600 text-white"
                                  : "text-[#63716E] hover:text-[#203430]"
                              )}
                            >
                              Fixed Dollar ($)
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#63716E] uppercase">
                            {comp.type === "percentage" ? "Percentage Rate (%)" : "Monthly Fixed Amount ($)"}
                          </label>

                          {comp.type === "percentage" ? (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 bg-white border border-[#EBECEB] rounded-lg px-2.5 h-8">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={comp.percentage ?? 0}
                                  onChange={(e) =>
                                    handleUpdateDeduction(
                                      comp.id,
                                      "percentage",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-16 text-xs font-bold text-red-600 outline-none"
                                />
                                <span className="text-[11px] font-bold text-[#63716E]">%</span>
                              </div>
                              <select
                                value={comp.basis || "basic"}
                                onChange={(e) =>
                                  handleUpdateDeduction(
                                    comp.id,
                                    "basis",
                                    e.target.value as "basic" | "gross"
                                  )
                                }
                                className="h-8 px-2 bg-white border border-[#EBECEB] rounded-lg text-xs text-[#203430] outline-none"
                              >
                                <option value="basic">of Basic Salary</option>
                                <option value="gross">of Gross Total</option>
                              </select>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 bg-white border border-[#EBECEB] rounded-lg px-2.5 h-8">
                              <span className="text-[11px] font-bold text-[#63716E]">$</span>
                              <input
                                type="number"
                                min="0"
                                step="10"
                                value={comp.defaultAmount ?? 0}
                                onChange={(e) =>
                                  handleUpdateDeduction(
                                    comp.id,
                                    "defaultAmount",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-28 text-xs font-bold text-red-600 outline-none"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#63716E] uppercase">
                          Policy Compliance Notes
                        </label>
                        <input
                          type="text"
                          value={comp.description || ""}
                          onChange={(e) =>
                            handleUpdateDeduction(comp.id, "description", e.target.value)
                          }
                          placeholder="Statutory citation or company deduction policy..."
                          className="w-full h-8 px-2.5 bg-white border border-[#EBECEB] rounded-lg text-xs outline-none focus:border-[#35BFA3]"
                        />
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => toggleExpand(comp.id)}
                          className="text-[11px] font-bold text-[#0E4D41] hover:underline"
                        >
                          Done Editing
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Clarification on Loans and Attendance Deductions */}
          <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#EBECEB] flex items-start gap-2 text-xs text-[#63716E]">
            <Info className="h-4 w-4 text-[#35BFA3] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Employee Loans & Attendance Adjustments:</strong> Installments, loan advances, and period-specific attendance deductions are resolved dynamically during monthly payroll runs rather than hardcoded in shared pay templates.
            </p>
          </div>
        </div>

        {/* =========================================================================
            4. APPLICABILITY (DISTINCT FROM ASSIGNMENT)
            ========================================================================= */}
        <div className="space-y-3 pt-3 border-t border-[#EBECEB]">
          <div className="flex items-center gap-1.5">
            <Building className="h-4 w-4 text-[#35BFA3]" />
            <h4 className="text-xs font-bold text-[#203430] uppercase tracking-wider">
              4. Applicability
            </h4>
          </div>
          <p className="text-[11px] text-[#63716E]">
            Specify the organizational scope eligible for this structure. This defines eligibility and does <em>not</em> automatically assign staff.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#63716E] uppercase">
                Scope Category
              </label>
              <select
                value={scopeType}
                onChange={(e) => {
                  const val = e.target.value;
                  setScopeType(val);
                  if (val === "Organization-Wide") setScopeValue("Organization-Wide");
                  else if (val === "Department") setScopeValue(availableDepartments[0] || "Operations");
                  else if (val === "Pay Group") setScopeValue("Salaried Staff");
                  else setScopeValue("");
                }}
                className="w-full h-8.5 px-3 bg-[#F7F7F7] border border-[#EBECEB] rounded-xl text-xs text-[#203430] outline-none focus:border-[#35BFA3]"
              >
                <option value="Organization-Wide">Organization-Wide (All eligible roles)</option>
                <option value="Department">Department Specific</option>
                <option value="Pay Group">Pay Group / Grade</option>
                <option value="Custom">Custom Target Group...</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#63716E] uppercase">
                Scope Specification
              </label>
              {scopeType === "Department" ? (
                <select
                  value={scopeValue}
                  onChange={(e) => setScopeValue(e.target.value)}
                  className="w-full h-8.5 px-3 bg-[#F7F7F7] border border-[#EBECEB] rounded-xl text-xs text-[#203430] outline-none focus:border-[#35BFA3]"
                >
                  {availableDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      Department: {dept}
                    </option>
                  ))}
                </select>
              ) : scopeType === "Pay Group" ? (
                <select
                  value={scopeValue}
                  onChange={(e) => setScopeValue(e.target.value)}
                  className="w-full h-8.5 px-3 bg-[#F7F7F7] border border-[#EBECEB] rounded-xl text-xs text-[#203430] outline-none focus:border-[#35BFA3]"
                >
                  <option value="Executive Management">Executive Management</option>
                  <option value="Salaried Staff">Salaried Staff</option>
                  <option value="Technical Specialists">Technical Specialists</option>
                  <option value="Field & Operations">Field & Operations</option>
                  <option value="Support & Associates">Support & Associates</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={scopeValue}
                  onChange={(e) => setScopeValue(e.target.value)}
                  placeholder="e.g. Organization-Wide, Product Design & R&D"
                  className="w-full h-8.5 px-3 bg-[#F7F7F7] border border-[#EBECEB] rounded-xl text-xs text-[#203430] outline-none focus:border-[#35BFA3]"
                />
              )}
            </div>
          </div>

          <div className="p-3 bg-[#E4F2D3]/40 border border-[#35BFA3]/30 rounded-xl flex items-center justify-between text-xs text-[#0E4D41]">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0" />
              <span>
                <strong>Assignment Workflow Separation:</strong> Enrolling employees to this pay structure remains an independent next step. Creating or updating this template will not overwrite individual employee compensation.
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM ACTIONS: Cancel & Review
            ========================================================================= */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EBECEB]">
          <button
            type="button"
            onClick={handleCancelClick}
            className="h-9 px-4 rounded-xl text-xs font-semibold text-[#63716E] hover:text-[#203430] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleOpenReview}
            className="h-9 px-5 rounded-xl text-xs font-bold bg-[#35BFA3] hover:bg-[#28C2A9] text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{isCreate ? "Review Structure" : "Review Changes"}</span>
          </button>
        </div>
      </Card>

      {/* =========================================================================
          REVIEW STRUCTURE / REVIEW CHANGES MODAL
          ========================================================================= */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-[#161c1a]/60 backdrop-blur-[3px] z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-[620px] rounded-[16px] shadow-2xl flex flex-col overflow-hidden border border-[#EBECEB] my-auto select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-[#EBECEB] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#35BFA3]" />
                <h3 className="text-[16px] font-bold text-[#203430]">
                  {isCreate ? "Review Pay Structure" : "Review Structure Changes"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#63716E] hover:text-[#203430] hover:bg-[#F7F7F7]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-left max-h-[75vh] overflow-y-auto">
              {/* General Summary */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider block">
                  General Metadata
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 bg-[#F7F7F7] rounded-lg border border-[#EBECEB]">
                    <span className="text-[10px] text-[#63716E] block">Structure Name</span>
                    <span className="font-bold text-[#203430] truncate block">{name}</span>
                  </div>
                  <div className="p-2.5 bg-[#F7F7F7] rounded-lg border border-[#EBECEB]">
                    <span className="text-[10px] text-[#63716E] block">Effective Date</span>
                    <span className="font-bold text-[#203430]">{effectiveDate}</span>
                  </div>
                  <div className="p-2.5 bg-[#F7F7F7] rounded-lg border border-[#EBECEB]">
                    <span className="text-[10px] text-[#63716E] block">Applicability</span>
                    <span className="font-bold text-[#203430] truncate block">{scopeValue}</span>
                  </div>
                  <div className="p-2.5 bg-[#F7F7F7] rounded-lg border border-[#EBECEB]">
                    <span className="text-[10px] text-[#63716E] block">Status</span>
                    <span className="font-bold text-[#0E4D41]">{status}</span>
                  </div>
                </div>
              </div>

              {/* Earnings Breakdown */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider block">
                  Configured Earnings Components ({earnings.length})
                </span>
                <div className="border border-[#EBECEB] rounded-xl overflow-hidden divide-y divide-[#EBECEB]">
                  {earnings.map((e) => (
                    <div key={e.id} className="p-2.5 bg-white flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#203430]">{e.name}</span>
                        {e.description && (
                          <span className="text-[10px] text-[#63716E] ml-2">({e.description})</span>
                        )}
                      </div>
                      <span className="font-semibold text-[#0E4D41]">
                        {e.type === "percentage"
                          ? `${e.percentage}% of ${e.basis === "gross" ? "Gross" : "Basic"}`
                          : e.defaultAmount
                          ? `$${e.defaultAmount.toLocaleString()}`
                          : "Employee-Specific"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deductions Breakdown */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-[#63716E] uppercase tracking-wider block">
                  Configured Deductions & Policies ({deductions.length})
                </span>
                <div className="border border-[#EBECEB] rounded-xl overflow-hidden divide-y divide-[#EBECEB]">
                  {deductions.map((d) => (
                    <div key={d.id} className="p-2.5 bg-white flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#203430]">{d.name}</span>
                        {(d.id === "comp-tax" || d.id === "comp-soc") && (
                          <span className="text-[10px] text-blue-700 ml-1.5 font-medium">
                            [Policy Referenced]
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-red-600">
                        {d.type === "percentage"
                          ? `${d.percentage}% Statutory Rate`
                          : `$${d.defaultAmount ?? 0}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignment Notice */}
              <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#EBECEB] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#63716E] uppercase block">
                    Current Assignment State
                  </span>
                  <span className="font-semibold text-[#203430]">
                    {isCreate
                      ? "Not assigned yet (0 staff members)"
                      : `${assignedEmployeesCount} staff members enrolled`}
                  </span>
                </div>
                <span className="text-[11px] text-[#63716E]">
                  {isCreate
                    ? "Employee assignment available as optional next step."
                    : "Existing employee compensation will be preserved."}
                </span>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-[#EBECEB] bg-[#F7F7F7] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-[#63716E] hover:text-[#203430]"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  onSave(finalStructurePayload);
                  setIsReviewModalOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#35BFA3] hover:bg-[#28C2A9] rounded-xl shadow-2xs flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                <span>{isCreate ? "Create Structure" : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DISCARD CHANGES CONFIRMATION MODAL
          ========================================================================= */}
      {isDiscardModalOpen && (
        <div className="fixed inset-0 bg-[#161c1a]/60 backdrop-blur-[3px] z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-[420px] rounded-[16px] shadow-2xl p-5 border border-[#EBECEB] space-y-4 my-auto select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-[#203430]">Discard Changes?</h4>
                <p className="text-xs text-[#63716E] mt-0.5">
                  Your unsaved changes in this structure editor will be lost.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EBECEB]">
              <button
                type="button"
                onClick={() => setIsDiscardModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#203430] hover:bg-[#F7F7F7] rounded-lg"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDiscardModalOpen(false);
                  onCancel();
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-2xs"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
