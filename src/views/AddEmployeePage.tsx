import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { getCollection, saveCollection } from "../lib/db";
import { Card, Badge } from "../components/ui/LayoutAddons";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { 
  ArrowLeft,
  Check,
  Search,
  Settings,
  Bell,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Upload,
  Calendar as CalendarIcon,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

// List of Supported Countries for Phone Number Inputs
const COUNTRIES = [
  { code: "+62", name: "Indonesia", flagEmoji: "🇮🇩" },
  { code: "+92", name: "Pakistan", flagEmoji: "🇵🇰" },
  { code: "+91", name: "India", flagEmoji: "🇮🇳" },
  { code: "+41", name: "Switzerland", flagEmoji: "🇨🇭" },
  { code: "+1", name: "United States", flagEmoji: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flagEmoji: "🇬🇧" },
  { code: "+65", name: "Singapore", flagEmoji: "🇸🇬" },
  { code: "+61", name: "Australia", flagEmoji: "🇦🇺" },
];

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("id");
  const [step, setStep] = React.useState(1);

  // Toast State
  const [alertText, setAlertText] = React.useState<string | null>(null);
  const showToast = (msg: string) => {
    setAlertText(msg);
    setTimeout(() => setAlertText(null), 3000);
  };

  // Step 1 Form States
  const [empName, setEmpName] = React.useState("Niko Pradana");
  const [empBirthDate, setEmpBirthDate] = React.useState("12 August 1995");
  const [empGender, setEmpGender] = React.useState("Male");
  const [empEmail, setEmpEmail] = React.useState("niko.pradana@company.com");
  const [empPhone, setEmpPhone] = React.useState("813 7788 2244");
  const [empAddress, setEmpAddress] = React.useState("221B Baker Street, London, NW1 6XE");
  const [empEmergencyName, setEmpEmergencyName] = React.useState("Sarah Thompson");
  const [empEmergencyPhone, setEmpEmergencyPhone] = React.useState("813 9900 1122");

  // Phone Country Code Pickers State
  const [empPhoneCountry, setEmpPhoneCountry] = React.useState("+62");
  const [empEmergencyPhoneCountry, setEmpEmergencyPhoneCountry] = React.useState("+62");
  const [showPhoneDropdown, setShowPhoneDropdown] = React.useState(false);
  const [showEmergencyDropdown, setShowEmergencyDropdown] = React.useState(false);

  // Form Validation State
  const [errorsZone, setErrorsZone] = React.useState<Record<string, string>>({});

  // Dynamic Country Code Recognition Handler on typed/pasted numbers
  const handlePhoneInputChange = (
    value: string, 
    setPhoneVal: React.Dispatch<React.SetStateAction<string>>, 
    setCountryCode: React.Dispatch<React.SetStateAction<string>>
  ) => {
    let trimmed = value.trim();
    if (trimmed.startsWith("+")) {
      const sortedCountries = [...COUNTRIES].sort((a, b) => b.code.length - a.code.length);
      for (const c of sortedCountries) {
        if (trimmed.startsWith(c.code)) {
          setCountryCode(c.code);
          let remaining = trimmed.slice(c.code.length).trim();
          setPhoneVal(remaining);
          showToast(`Auto-detected country: ${c.name} (${c.code})`);
          return;
        }
      }
    }
    setPhoneVal(value);
  };

  // Centralized Validation Checker throughout the Employee onboarding wizard
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!empName.trim()) {
        newErrors.empName = "Full Name is required";
      } else if (empName.trim().length < 3) {
        newErrors.empName = "Full Name must be at least 3 characters";
      }
      
      if (!empBirthDate.trim()) {
        newErrors.empBirthDate = "Date of Birth is required";
      }
      
      if (!empEmail.trim()) {
        newErrors.empEmail = "Email Address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empEmail)) {
        newErrors.empEmail = "Email format is invalid (e.g. niko.pradana@company.com)";
      }
      
      if (!empPhone.trim()) {
        newErrors.empPhone = "Phone Number is required";
      } else if (empPhone.replace(/\D/g, "").length < 6) {
        newErrors.empPhone = "Phone Number must contain at least 6 digits";
      }
      
      if (!empAddress.trim()) {
        newErrors.empAddress = "Mailing address is required";
      }
      
      // Emergency Contact is optional. But if phone is supplied, check its length.
      if (empEmergencyPhone.trim() && empEmergencyPhone.replace(/\D/g, "").length < 6) {
        newErrors.empEmergencyPhone = "Emergency phone must contain at least 6 digits";
      }
    }
    
    if (currentStep === 2) {
      if (!empJoinDate.trim()) {
        newErrors.empJoinDate = "Join date is required";
      }
      
      if (!empSalary.trim()) {
        newErrors.empSalary = "Monthly Salary is required";
      }
      
      // Bank Name is optional
      // Bank Account Number is optional. If supplied, validate it.
      if (empBankAccount.trim() && !/^\d+$/.test(empBankAccount.replace(/\s/g, ""))) {
        newErrors.empBankAccount = "Bank Account number must be digits only";
      }
      
      // Tax ID is optional
    }
    
    if (currentStep === 3) {
      if (!uploadedDocs['id']) {
        newErrors.docs = "ID / Government Document is required for employment compliance before registration";
      }
    }
    
    setErrorsZone(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      showToast(firstError);
      return false;
    }
    return true;
  };

  // Step 2 Form States
  const [empJoinDate, setEmpJoinDate] = React.useState("19 June 2035");
  const [empRole, setEmpRole] = React.useState("IT Support Specialist");
  const [empDept, setEmpDept] = React.useState("Operations");
  const [empType, setEmpType] = React.useState("Full-Time");
  const [empModel, setEmpModel] = React.useState("On-Site");
  const [empSalary, setEmpSalary] = React.useState("$2,800");
  const [empBankName, setEmpBankName] = React.useState("Barclays UK");
  const [empBankAccount, setEmpBankAccount] = React.useState("12345678");
  const [empTaxId, setEmpTaxId] = React.useState("AB123456C");

  // Step 3 Form States
  const [allowanceTrans, setAllowanceTrans] = React.useState(true);
  const [allowanceMeal, setAllowanceMeal] = React.useState(true);
  const [allowanceInternet, setAllowanceInternet] = React.useState(false);

  // Benefits
  const [benefitHealth, setBenefitHealth] = React.useState(true);
  const [benefitLife, setBenefitLife] = React.useState(true);
  const [benefitDevice, setBenefitDevice] = React.useState(true);
  const [benefitTraining, setBenefitTraining] = React.useState(true);
  const [benefitTuition, setBenefitTuition] = React.useState(false);
  const [benefitFitness, setBenefitFitness] = React.useState(true);
  const [benefitMental, setBenefitMental] = React.useState(false);

  // File Documents Upload State
  const [uploadedDocs, setUploadedDocs] = React.useState<Record<string, { name: string, size: string }>>({});

  // Active / Welcome Email Checks
  const [empActive, setEmpActive] = React.useState(true);
  const [empSendEmail, setEmpSendEmail] = React.useState(false);

  React.useEffect(() => {
    if (draftId) {
      const currentList = getCollection<any[]>("db_employees", []);
      const draftEmp = currentList.find(e => e.id === draftId);
      if (draftEmp) {
        if (draftEmp.name !== undefined) setEmpName(draftEmp.name);
        if (draftEmp.birthDate !== undefined) setEmpBirthDate(draftEmp.birthDate);
        if (draftEmp.gender !== undefined) setEmpGender(draftEmp.gender);
        if (draftEmp.email !== undefined) setEmpEmail(draftEmp.email);
        if (draftEmp.phone !== undefined) setEmpPhone(draftEmp.phone);
        if (draftEmp.address !== undefined) setEmpAddress(draftEmp.address);
        if (draftEmp.emergencyName !== undefined) setEmpEmergencyName(draftEmp.emergencyName);
        if (draftEmp.emergencyPhone !== undefined) setEmpEmergencyPhone(draftEmp.emergencyPhone);
        if (draftEmp.phoneCountry !== undefined) setEmpPhoneCountry(draftEmp.phoneCountry);
        if (draftEmp.emergencyPhoneCountry !== undefined) setEmpEmergencyPhoneCountry(draftEmp.emergencyPhoneCountry);
        
        if (draftEmp.joinDate !== undefined) setEmpJoinDate(draftEmp.joinDate);
        if (draftEmp.role !== undefined) setEmpRole(draftEmp.role);
        if (draftEmp.dept !== undefined) setEmpDept(draftEmp.dept);
        if (draftEmp.type !== undefined) setEmpType(draftEmp.type);
        if (draftEmp.model !== undefined) setEmpModel(draftEmp.model);
        if (draftEmp.salary !== undefined) setEmpSalary(draftEmp.salary);
        if (draftEmp.bankName !== undefined) setEmpBankName(draftEmp.bankName);
        if (draftEmp.bankAccount !== undefined) setEmpBankAccount(draftEmp.bankAccount);
        if (draftEmp.taxId !== undefined) setEmpTaxId(draftEmp.taxId);
        
        if (draftEmp.allowanceTrans !== undefined) setAllowanceTrans(draftEmp.allowanceTrans);
        if (draftEmp.allowanceMeal !== undefined) setAllowanceMeal(draftEmp.allowanceMeal);
        if (draftEmp.allowanceInternet !== undefined) setAllowanceInternet(draftEmp.allowanceInternet);
        
        if (draftEmp.benefitHealth !== undefined) setBenefitHealth(draftEmp.benefitHealth);
        if (draftEmp.benefitLife !== undefined) setBenefitLife(draftEmp.benefitLife);
        if (draftEmp.benefitDevice !== undefined) setBenefitDevice(draftEmp.benefitDevice);
        if (draftEmp.benefitTraining !== undefined) setBenefitTraining(draftEmp.benefitTraining);
        if (draftEmp.benefitTuition !== undefined) setBenefitTuition(draftEmp.benefitTuition);
        if (draftEmp.benefitFitness !== undefined) setBenefitFitness(draftEmp.benefitFitness);
        if (draftEmp.benefitMental !== undefined) setBenefitMental(draftEmp.benefitMental);
        
        if (draftEmp.uploadedDocs !== undefined) setUploadedDocs(draftEmp.uploadedDocs);
        if (draftEmp.empActive !== undefined) setEmpActive(draftEmp.empActive);
        if (draftEmp.empSendEmail !== undefined) setEmpSendEmail(draftEmp.empSendEmail);

        showToast("Employee draft loaded successfully. Carry on completing the form!");
      }
    }
  }, [draftId]);

  const steps = [
    { id: 1, label: "Personal & Contact Information", desc: "Personal & Contact Information" },
    { id: 2, label: "Employment & Payroll Details", desc: "Employment & Payroll Details" },
    { id: 3, label: "Allowances, Benefits & Documents", desc: "Allowances, Benefits & Documents" },
  ];

  const handleNext = () => step < 3 && setStep(prev => prev + 1);
  const handlePrev = () => step > 1 && setStep(prev => prev - 1);

  const handleFileUpload = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setUploadedDocs(prev => ({
        ...prev,
        [docId]: {
          name: file.name,
          size: `${sizeMb} MB`
        }
      }));
      showToast(`Document uploaded successfully: ${file.name}`);
    }
  };

  const handleRemoveDoc = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedDocs(prev => {
      const copy = { ...prev };
      delete copy[docId];
      return copy;
    });
    showToast("Document removed");
  };

  const allBenefitsSelected = benefitHealth && benefitLife && benefitDevice && benefitTraining && benefitTuition && benefitFitness && benefitMental;
  const handleSelectAllBenefits = () => {
    const target = !allBenefitsSelected;
    setBenefitHealth(target);
    setBenefitLife(target);
    setBenefitDevice(target);
    setBenefitTraining(target);
    setBenefitTuition(target);
    setBenefitFitness(target);
    setBenefitMental(target);
    showToast(target ? "All benefits selected" : "All benefits deselected");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) {
      return;
    }
    if (step < 3) {
      handleNext();
    } else {
      const currentList = getCollection<any[]>("db_employees", []);
      const targetId = draftId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
      const isUpdating = currentList.some((emp) => emp.id === targetId);

      const resolvedAvatar = isUpdating
        ? currentList.find((emp) => emp.id === targetId)?.avatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
        : Math.random() > 0.5
          ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80";

      const newEmp = {
        id: targetId,
        name: empName,
        birthDate: empBirthDate,
        gender: empGender,
        email: empEmail,
        phone: empPhone,
        address: empAddress,
        emergencyName: empEmergencyName,
        emergencyPhone: empEmergencyPhone,
        phoneCountry: empPhoneCountry,
        emergencyPhoneCountry: empEmergencyPhoneCountry,
        joinDate: empJoinDate,
        role: empRole,
        dept: empDept,
        type: empType,
        model: empModel,
        status: empActive ? "Active" : "Inactive",
        avatar: resolvedAvatar,
        salary: empSalary,
        bankName: empBankName,
        bankAccount: empBankAccount,
        taxId: empTaxId,
        allowanceTrans,
        allowanceMeal,
        allowanceInternet,
        benefitHealth,
        benefitLife,
        benefitDevice,
        benefitTraining,
        benefitTuition,
        benefitFitness,
        benefitMental,
        uploadedDocs,
        empActive,
        empSendEmail,
      };

      try {
        const { createEmployee, updateEmployee } = await import("@/src/lib/api/employees");
        const { syncCollectionsFromApi } = await import("@/src/lib/api/auth");
        const apiPayload = {
          id: targetId,
          name: empName,
          role: empRole,
          dept: empDept,
          type: empType || "Full-Time",
          model: empModel || "Hybrid",
          status: empActive ? "Active" : "Inactive",
          avatar: resolvedAvatar,
          joinDate: empJoinDate,
          salary: empSalary,
        };
        if (isUpdating) {
          await updateEmployee(targetId, apiPayload);
        } else {
          await createEmployee(apiPayload);
        }
        await syncCollectionsFromApi();
      } catch {
        let updatedList;
        const index = currentList.findIndex((emp) => emp.id === targetId);
        if (index !== -1) {
          updatedList = [...currentList];
          updatedList[index] = newEmp;
        } else {
          updatedList = [...currentList, newEmp];
        }
        saveCollection("db_employees", updatedList);
      }

      const currentPayroll = getCollection<any[]>("db_payroll", []);
      const newPayroll = {
        id: targetId,
        name: empName,
        role: empRole,
        subRole: empRole,
        date: "28 Jun 35",
        salary: empSalary,
        allowance: `$${(allowanceTrans ? 100 : 0) + (allowanceMeal ? 50 : 0) + (allowanceInternet ? 50 : 0)}`,
        overtime: "$0",
        incen: "$0",
        deduct: "$0",
        total: empSalary,
        status: "Pending",
        avatar: newEmp.avatar,
      };

      const payrollIndex = currentPayroll.findIndex((p) => p.id === targetId);
      let updatedPayroll;
      if (payrollIndex !== -1) {
        updatedPayroll = [...currentPayroll];
        updatedPayroll[payrollIndex] = newPayroll;
      } else {
        updatedPayroll = [...currentPayroll, newPayroll];
      }
      saveCollection("db_payroll", updatedPayroll);

      window.dispatchEvent(new Event("db_updated"));
      showToast(isUpdating ? "Employee updated successfully!" : "Employee added successfully!");
      setTimeout(() => {
        navigate("/employees");
      }, 1200);
    }
  };

  return (
    <AppLayout 
      title="Add New Employee" 
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Employees", href: "/employees" }, { label: "Add New Employee" }]}
    >
      {/* Main Multi-step Form Container */}
      <Card className="flex flex-col lg:flex-row border border-line rounded-2xl overflow-hidden min-h-[850px] bg-white">
        
        {/* Left Progress Steps Sidebar */}
        <div className="w-full lg:w-[272px] p-8 shrink-0 border-r border-line">
           <h2 className="text-[18px] font-bold text-[#203430]">Register New Employee</h2>
           <p className="text-[11px] text-[#63716E] mt-2 mb-10 leading-relaxed font-medium">
             Enter all required employment details to formally add a new member to your organization.
           </p>

           <div className="space-y-0">
             {steps.map((s, idx) => (
                <div key={s.id} className="relative flex gap-4">
                  {/* Connector Line */}
                  {idx < steps.length - 1 && (
                    <div className={cn(
                      "absolute left-[9px] top-6 w-[1px] h-[calc(100%)]",
                      step > s.id ? "bg-brand" : "bg-[#F3F3F0]"
                    )} />
                  )}

                  {/* Step Indicator */}
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-all z-10",
                      step === s.id ? "border-brand bg-white" : 
                      step > s.id ? "border-brand bg-brand" : "border-line bg-white"
                    )}>
                      {step > s.id ? (
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      ) : step === s.id ? (
                        <div className="h-2 w-2 rounded-full bg-brand" />
                      ) : null}
                    </div>
                  </div>

                  {/* Step Label */}
                  <div className="pb-10">
                    <h4 className={cn(
                      "text-[14px] font-semibold leading-tight",
                      step === s.id ? "text-[#203430]" : "text-[#63716E]"
                    )}>
                      {s.label}
                    </h4>
                  </div>
                </div>
             ))}
           </div>
        </div>

        {/* Right Form Area */}
        <div className="flex-1 p-8 lg:p-16">
          <form onSubmit={handleSubmit} className="max-w-[683px]">
            <div className="mb-8">
              <span className="text-[11px] font-medium text-[#63716E]">Step {step}/3</span>
              <h1 className="text-[16px] font-bold text-[#203430] mt-4">{steps[step-1].label}</h1>
              <p className="text-[12px] text-[#63716E] mt-1 font-medium">Enter the employee's personal details and primary contact information to initiate their HR record</p>
            </div>

            <div className="h-[1px] bg-[#F3F3F0] w-full mb-8" />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {step === 1 && (
                  <>
                    {/* Personal Info Section */}
                    <div className="space-y-4">
                      <h3 className="text-[14px] font-bold text-[#203430]">Personal Info</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Full Name <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            value={empName} 
                            onChange={e => {
                              setEmpName(e.target.value);
                              if (errorsZone.empName) {
                                setErrorsZone(prev => {
                                  const copy = { ...prev };
                                  delete copy.empName;
                                  return copy;
                                });
                              }
                            }} 
                            placeholder="Niko Pradana" 
                            className={cn(
                              "w-full h-[38px] px-3 bg-[#F3F3F0] border rounded-[8px] text-[12px] text-[#203430] outline-none transition-all",
                              errorsZone.empName ? "border-red-500 bg-red-50/20" : "border-transparent focus:border-brand"
                            )} 
                            required 
                          />
                          {errorsZone.empName && (
                            <p className="text-[11px] text-red-500 font-semibold">{errorsZone.empName}</p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Date of Birth <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <input 
                              type="text" 
                              value={empBirthDate} 
                              onChange={e => {
                                setEmpBirthDate(e.target.value);
                                if (errorsZone.empBirthDate) {
                                  setErrorsZone(prev => {
                                    const copy = { ...prev };
                                    delete copy.empBirthDate;
                                    return copy;
                                  });
                                }
                              }} 
                              placeholder="12 August 1995" 
                              className={cn(
                                "w-full h-[38px] px-3 bg-[#F3F3F0] border rounded-[8px] text-[12px] text-[#203430] outline-none transition-all pr-10",
                                errorsZone.empBirthDate ? "border-red-500 bg-red-50/20" : "border-transparent focus:border-brand"
                              )} 
                              required 
                            />
                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#63716E]" />
                          </div>
                          {errorsZone.empBirthDate && (
                            <p className="text-[11px] text-red-500 font-semibold">{errorsZone.empBirthDate}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#63716E]">Gender</label>
                        <div className="flex flex-wrap gap-4">
                          {['Male', 'Female', 'Prefer not to say'].map(g => (
                            <label 
                              key={g} 
                              onClick={() => setEmpGender(g)}
                              className={cn(
                                "flex-1 flex items-center justify-between h-[38px] px-4 rounded-[8px] cursor-pointer transition-all border",
                                g === empGender ? "bg-white border-brand" : "bg-[#F3F3F0] border-transparent hover:bg-slate-50"
                              )}
                            >
                              <span className="text-[12px] text-[#203430]">{g}</span>
                              <div className={cn(
                                "h-4 w-4 rounded-full border flex items-center justify-center",
                                g === empGender ? "border-brand" : "border-line"
                              )}>
                                {g === empGender && <div className="h-2 w-2 rounded-full bg-brand" />}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Contact Info Section */}
                    <div className="space-y-4 pt-4">
                      <h3 className="text-[14px] font-bold text-[#203430]">Contact Info</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Email Address <span className="text-red-500">*</span></label>
                          <input 
                            type="email" 
                            value={empEmail} 
                            onChange={e => {
                              setEmpEmail(e.target.value);
                              if (errorsZone.empEmail) {
                                setErrorsZone(prev => {
                                  const copy = { ...prev };
                                  delete copy.empEmail;
                                  return copy;
                                });
                              }
                            }} 
                            placeholder="niko.pradana@company.com" 
                            className={cn(
                              "w-full h-[38px] px-3 bg-[#F3F3F0] border rounded-[8px] text-[12px] text-[#203430] outline-none transition-all",
                              errorsZone.empEmail ? "border-red-500 bg-red-50/20" : "border-transparent focus:border-brand"
                            )} 
                            required 
                          />
                          {errorsZone.empEmail && (
                            <p className="text-[11px] text-red-500 font-semibold">{errorsZone.empEmail}</p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Phone Number <span className="text-red-500">*</span></label>
                          <div className={cn(
                            "relative flex items-center h-[38px] bg-[#F3F3F0] rounded-[8px] px-3 gap-2 border transition-all",
                            errorsZone.empPhone ? "border-red-500 bg-red-50/10 focus-within:ring-1 focus-within:ring-red-500" : "border-transparent focus-within:border-brand"
                          )}>
                             <div 
                               onClick={() => setShowPhoneDropdown(!showPhoneDropdown)}
                               className="flex items-center gap-1 border-r border-line pr-2 shrink-0 cursor-pointer select-none"
                             >
                               <span className="text-[16px] leading-none" role="img" aria-label="flag">
                                 {COUNTRIES.find(c => c.code === empPhoneCountry)?.flagEmoji || "🇮🇩"}
                               </span>
                               <span className="text-[12px] font-bold text-[#203430]">{empPhoneCountry}</span>
                               <ChevronDown className="h-3 w-3 text-[#203430]" />
                             </div>
                             <input 
                               type="text" 
                               value={empPhone} 
                               onChange={e => {
                                 handlePhoneInputChange(e.target.value, setEmpPhone, setEmpPhoneCountry);
                                 if (errorsZone.empPhone) {
                                   setErrorsZone(prev => {
                                     const copy = { ...prev };
                                     delete copy.empPhone;
                                     return copy;
                                   });
                                 }
                               }} 
                               placeholder="813 7788 2244" 
                               className="w-full h-full bg-transparent text-[12px] text-[#203430] outline-none" 
                               required 
                             />

                             {/* Manual Dropdown Popover */}
                             {showPhoneDropdown && (
                               <>
                                 <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowPhoneDropdown(false)} />
                                 <div className="absolute left-0 top-[40px] z-50 w-[240px] max-h-[200px] overflow-y-auto bg-white border border-line rounded-xl shadow-xl py-1.5">
                                   {COUNTRIES.map(c => (
                                     <button
                                       key={c.code}
                                       type="button"
                                       onClick={() => {
                                         setEmpPhoneCountry(c.code);
                                         setShowPhoneDropdown(false);
                                         showToast(`Selected: ${c.name} (${c.code})`);
                                       }}
                                       className="w-full flex items-center justify-between px-3 py-2 text-[12px] text-left hover:bg-white hover:text-brand transition-colors cursor-pointer"
                                     >
                                       <div className="flex items-center gap-2">
                                         <span className="text-[16px]">{c.flagEmoji}</span>
                                         <span className="font-semibold text-[#203430]">{c.name}</span>
                                       </div>
                                       <span className="text-[#63716E] font-bold">{c.code}</span>
                                     </button>
                                   ))}
                                 </div>
                               </>
                             )}
                          </div>
                          {errorsZone.empPhone && (
                            <p className="text-[11px] text-red-500 font-semibold">{errorsZone.empPhone}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#63716E]">Address <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          value={empAddress} 
                          onChange={e => {
                            setEmpAddress(e.target.value);
                            if (errorsZone.empAddress) {
                              setErrorsZone(prev => {
                                const copy = { ...prev };
                                delete copy.empAddress;
                                return copy;
                              });
                            }
                          }}
                          placeholder="e.g. 221B Baker Street, London, NW1 6XE" 
                          className={cn(
                            "w-full h-[38px] px-3 rounded-[8px] text-[12px] text-[#203430] outline-none transition-all border",
                            errorsZone.empAddress ? "border-red-500 bg-red-50/20" : "border-transparent focus:border-brand bg-[#F3F3F0]"
                          )} 
                          required 
                        />
                        {errorsZone.empAddress && (
                          <p className="text-[11px] text-red-300 font-semibold text-red-500">{errorsZone.empAddress}</p>
                        )}
                      </div>
                    </div>

                    {/* Emergency Contact Section */}
                    <div className="space-y-4 pt-4">
                      <h3 className="text-[14px] font-bold text-[#203430]">Emergency Contact</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Name <span className="text-slate-400 font-normal">(Optional)</span></label>
                          <input 
                            type="text" 
                            value={empEmergencyName} 
                            onChange={e => {
                              setEmpEmergencyName(e.target.value);
                              if (errorsZone.empEmergencyName) {
                                setErrorsZone(prev => {
                                  const copy = { ...prev };
                                  delete copy.empEmergencyName;
                                  return copy;
                                });
                              }
                            }} 
                            placeholder="e.g. Sarah Thompson" 
                            className={cn(
                              "w-full h-[38px] px-3 rounded-[8px] text-[12px] text-[#203430] outline-none transition-all border",
                              errorsZone.empEmergencyName ? "border-red-500 bg-red-50/20" : "border-transparent focus:border-brand bg-[#F3F3F0]"
                            )} 
                          />
                          {errorsZone.empEmergencyName && (
                            <p className="text-[11px] text-red-500 font-semibold">{errorsZone.empEmergencyName}</p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Phone Number <span className="text-slate-400 font-normal">(Optional)</span></label>
                          <div className={cn(
                            "relative flex items-center h-[38px] bg-[#F3F3F0] rounded-[8px] px-3 gap-2 border transition-all",
                            errorsZone.empEmergencyPhone ? "border-red-500 bg-red-50/10 focus-within:ring-1 focus-within:ring-red-500" : "border-transparent focus-within:border-brand"
                          )}>
                             <div 
                               onClick={() => setShowEmergencyDropdown(!showEmergencyDropdown)}
                               className="flex items-center gap-1 border-r border-line pr-2 shrink-0 cursor-pointer select-none"
                             >
                               <span className="text-[16px] leading-none" role="img" aria-label="flag">
                                 {COUNTRIES.find(c => c.code === empEmergencyPhoneCountry)?.flagEmoji || "🇮🇩"}
                               </span>
                               <span className="text-[12px] font-bold text-[#203430]">{empEmergencyPhoneCountry}</span>
                               <ChevronDown className="h-3 w-3 text-[#203430]" />
                             </div>
                             <input 
                               type="text" 
                               value={empEmergencyPhone} 
                               onChange={e => {
                                 handlePhoneInputChange(e.target.value, setEmpEmergencyPhone, setEmpEmergencyPhoneCountry);
                                 if (errorsZone.empEmergencyPhone) {
                                   setErrorsZone(prev => {
                                     const copy = { ...prev };
                                     delete copy.empEmergencyPhone;
                                     return copy;
                                   });
                                 }
                               }} 
                               placeholder="XXX XXXX XXXX" 
                               className="w-full h-full bg-transparent text-[12px] text-[#203430] outline-none" 
                             />

                             {/* Manual Dropdown Popover */}
                             {showEmergencyDropdown && (
                               <>
                                 <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowEmergencyDropdown(false)} />
                                 <div className="absolute left-0 top-[40px] z-50 w-[240px] max-h-[200px] overflow-y-auto bg-white border border-line rounded-xl shadow-xl py-1.5">
                                   {COUNTRIES.map(c => (
                                     <button
                                       key={c.code}
                                       type="button"
                                       onClick={() => {
                                         setEmpEmergencyPhoneCountry(c.code);
                                         setShowEmergencyDropdown(false);
                                         showToast(`Selected: ${c.name} (${c.code})`);
                                       }}
                                       className="w-full flex items-center justify-between px-3 py-2 text-[12px] text-left hover:bg-white hover:text-brand transition-colors cursor-pointer"
                                     >
                                       <div className="flex items-center gap-2">
                                         <span className="text-[16px]">{c.flagEmoji}</span>
                                         <span className="font-semibold text-[#203430]">{c.name}</span>
                                       </div>
                                       <span className="text-[#63716E] font-bold">{c.code}</span>
                                     </button>
                                   ))}
                                 </div>
                               </>
                             )}
                          </div>
                          {errorsZone.empEmergencyPhone && (
                            <p className="text-[11px] text-red-500 font-semibold">{errorsZone.empEmergencyPhone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-[14px] font-bold text-[#203430]">Employment Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Employee ID</label>
                          <div className="relative">
                            <input type="text" value="EMP-0371" disabled className="w-full h-[38px] px-3 bg-[#F3F3F0] rounded-[8px] text-[12px] font-bold text-[#203430] outline-none" />
                            <span className="absolute -bottom-5 left-0 text-[9px] font-medium text-[#63716E]">*Auto-generated</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Join Date <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <input 
                              type="text" 
                              value={empJoinDate} 
                              onChange={e => {
                                setEmpJoinDate(e.target.value);
                                if (errorsZone.empJoinDate) {
                                  setErrorsZone(prev => {
                                    const copy = { ...prev };
                                    delete copy.empJoinDate;
                                    return copy;
                                  });
                                }
                              }} 
                              className={cn(
                                "w-full h-[38px] px-3 bg-[#F3F3F0] border rounded-[8px] text-[12px] text-[#203430] outline-none pr-10 transition-all",
                                errorsZone.empJoinDate ? "border-red-500 bg-red-50/20" : "border-transparent focus:border-brand"
                              )} 
                            />
                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#63716E]" />
                          </div>
                          {errorsZone.empJoinDate && (
                            <p className="text-[11px] text-red-500 font-semibold">{errorsZone.empJoinDate}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Job Title</label>
                          <div className="relative">
                            <select 
                              value={empRole}
                              onChange={e => setEmpRole(e.target.value)} 
                              className="appearance-none w-full h-[38px] px-3 bg-[#F3F3F0] border border-transparent focus:border-brand rounded-[8px] text-[12px] text-[#203430] outline-none pr-8"
                            >
                              <option>IT Support Specialist</option>
                              <option>Software Engineer</option>
                              <option>Marketing & Sales Manager</option>
                              <option>Finance Specialist</option>
                              <option>UX/UI Designer</option>
                              <option>Human Resources Generalist</option>
                              <option>R&D Analyst</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#203430] pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Department</label>
                          <div className="relative">
                            <select 
                              value={empDept}
                              onChange={e => setEmpDept(e.target.value)}
                              className="appearance-none w-full h-[38px] px-3 bg-[#F3F3F0] border border-transparent focus:border-brand rounded-[8px] text-[12px] text-[#203430] outline-none pr-8"
                            >
                              <option>Operations</option>
                              <option>Marketing</option>
                              <option>Finance</option>
                              <option>Engineering</option>
                              <option>Design</option>
                              <option>Human Resources</option>
                              <option>R&D</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#203430] pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Employment Type</label>
                          <div className="relative">
                            <select 
                              value={empType}
                              onChange={e => setEmpType(e.target.value)}
                              className="appearance-none w-full h-[38px] px-3 bg-[#F3F3F0] border border-transparent focus:border-brand rounded-[8px] text-[12px] text-[#203430] outline-none pr-8"
                            >
                              <option>Full-Time</option>
                              <option>Part-Time</option>
                              <option>Contract</option>
                              <option>Internship</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#203430] pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 mt-6">
                        <label className="text-[11px] font-bold text-[#63716E]">Work Model</label>
                        <div className="flex flex-wrap gap-4">
                          {['On-Site', 'Hybrid', 'Remote'].map(m => (
                            <label 
                              key={m} 
                              onClick={() => setEmpModel(m)}
                              className={cn(
                                "flex-1 flex items-center justify-between h-[38px] px-4 rounded-[8px] cursor-pointer transition-all border",
                                m === empModel ? "bg-white border-brand" : "bg-[#F3F3F0] border-transparent hover:bg-slate-50"
                              )}
                            >
                              <span className="text-[12px] text-[#203430]">{m}</span>
                              <div className={cn(
                                "h-4 w-4 rounded-full border flex items-center justify-center",
                                m === empModel ? "border-brand" : "border-line"
                              )}>
                                {m === empModel && <div className="h-2 w-2 rounded-full bg-brand" />}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-8">
                      <h3 className="text-[14px] font-bold text-[#203430]">Payroll Info</h3>
                      <div className="space-y-1.5">
                         <label className="text-[11px] font-bold text-[#63716E]">Salary <span className="text-red-500">*</span></label>
                         <div className="relative">
                            <input 
                              type="text" 
                              value={empSalary}
                              onChange={e => {
                                setEmpSalary(e.target.value);
                                if (errorsZone.empSalary) {
                                  setErrorsZone(prev => {
                                    const copy = { ...prev };
                                    delete copy.empSalary;
                                    return copy;
                                  });
                                }
                              }}
                              placeholder="$2,800" 
                              className={cn(
                                "w-full h-[38px] px-3 bg-[#F3F3F0] border rounded-[8px] text-[12px] text-[#203430] outline-none pr-16 transition-all",
                                errorsZone.empSalary ? "border-red-500 bg-red-50/20" : "border-transparent focus:border-brand"
                              )} 
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#63716E]">/month</span>
                         </div>
                         {errorsZone.empSalary && (
                           <p className="text-[11px] text-red-500 font-semibold">{errorsZone.empSalary}</p>
                         )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Bank Name <span className="text-slate-400 font-normal">(Optional)</span></label>
                          <input 
                            type="text" 
                            value={empBankName}
                            onChange={e => {
                              setEmpBankName(e.target.value);
                              if (errorsZone.empBankName) {
                                setErrorsZone(prev => {
                                  const copy = { ...prev };
                                  delete copy.empBankName;
                                  return copy;
                                });
                              }
                            }}
                            placeholder="e.g. Barclays UK" 
                            className={cn(
                              "w-full h-[38px] px-3 bg-[#F3F3F0] border rounded-[8px] text-[12px] text-[#203430] outline-none transition-all",
                              errorsZone.empBankName ? "border-red-500 bg-red-50/20" : "border-transparent focus:border-brand"
                            )} 
                          />
                          {errorsZone.empBankName && (
                            <p className="text-[11px] text-red-500 font-semibold">{errorsZone.empBankName}</p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Bank Account Number <span className="text-slate-400 font-normal">(Optional)</span></label>
                          <input 
                            type="text" 
                            value={empBankAccount}
                            onChange={e => {
                              setEmpBankAccount(e.target.value);
                              if (errorsZone.empBankAccount) {
                                setErrorsZone(prev => {
                                  const copy = { ...prev };
                                  delete copy.empBankAccount;
                                  return copy;
                                });
                              }
                            }}
                            placeholder="e.g. 12345678" 
                            className={cn(
                              "w-full h-[38px] px-3 bg-[#F3F3F0] border rounded-[8px] text-[12px] text-[#203430] outline-none transition-all",
                              errorsZone.empBankAccount ? "border-red-500 bg-red-50/20" : "border-transparent focus:border-brand"
                            )} 
                          />
                          {errorsZone.empBankAccount && (
                            <p className="text-[11px] text-red-500 font-semibold">{errorsZone.empBankAccount}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Tax Identification Number (NPWP) <span className="text-slate-400 font-normal">(Optional)</span></label>
                          <input 
                            type="text" 
                            value={empTaxId}
                            onChange={e => {
                              setEmpTaxId(e.target.value);
                              if (errorsZone.empTaxId) {
                                setErrorsZone(prev => {
                                  const copy = { ...prev };
                                  delete copy.empTaxId;
                                  return copy;
                                });
                              }
                            }}
                            placeholder="e.g. AB123456C" 
                            className={cn(
                              "w-full h-[38px] px-3 bg-[#F3F3F0] border rounded-[8px] text-[12px] text-[#203430] outline-none transition-all",
                              errorsZone.empTaxId ? "border-red-500 bg-red-50/20" : "border-transparent focus:border-brand"
                            )} 
                          />
                          {errorsZone.empTaxId && (
                            <p className="text-[11px] text-red-500 font-semibold">{errorsZone.empTaxId}</p>
                          )}
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-[14px] font-bold text-[#203430]">Allowances</h3>
                      <div className="flex flex-col gap-3">
                        {[
                          { l: 'Transportation', active: allowanceTrans, act: () => setAllowanceTrans(!allowanceTrans) },
                          { l: 'Meal', active: allowanceMeal, act: () => setAllowanceMeal(!allowanceMeal) },
                          { l: 'Internet (Remote & Hybrid only)', active: allowanceInternet, act: () => setAllowanceInternet(!allowanceInternet) },
                        ].map(a => (
                          <div key={a.l} onClick={a.act} className="flex items-center gap-3 cursor-pointer select-none">
                            <div className={cn("h-4 w-4 rounded-[4px] border flex items-center justify-center transition-all", a.active ? "bg-brand border-brand" : "bg-white border-line")}>
                              {a.active && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                            </div>
                            <span className="text-[12px] text-[#203430] font-medium">{a.l}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <h3 className="text-[14px] font-bold text-[#203430]">Benefits</h3>
                      
                      <div onClick={handleSelectAllBenefits} className="flex items-center gap-3 mb-6 cursor-pointer select-none group">
                        <div className={cn(
                          "h-4 w-4 rounded-[4px] border flex items-center justify-center transition-all",
                          allBenefitsSelected ? "bg-brand border-brand" : "border-line bg-white group-hover:border-brand"
                        )}>
                          {allBenefitsSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-[12px] text-[#203430] font-medium">Select All</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Insurance Column */}
                        <div className="space-y-4">
                           <h4 className="text-[12px] font-bold text-[#63716E]">Insurance</h4>
                           <div className="space-y-3">
                              {[
                                { l: 'Health Insurance', active: benefitHealth, act: () => setBenefitHealth(!benefitHealth) },
                                { l: 'Life Insurance', active: benefitLife, act: () => setBenefitLife(!benefitLife) }
                              ].map(item => (
                                <div key={item.l} onClick={item.act} className="flex items-center gap-3 cursor-pointer select-none">
                                  <div className={cn(
                                    "h-4 w-4 rounded-[4px] border flex items-center justify-center transition-all",
                                    item.active ? "bg-brand border-brand" : "bg-white border-line"
                                  )}>
                                    {item.active && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                                  </div>
                                  <span className="text-[12px] text-[#203430] font-medium">{item.l}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                        {/* Work-Related Column */}
                        <div className="space-y-4">
                           <h4 className="text-[12px] font-bold text-[#63716E]">Work-Related Perks</h4>
                           <div className="space-y-3">
                              <div onClick={() => setBenefitDevice(!benefitDevice)} className="flex items-center gap-3 cursor-pointer select-none">
                                <div className={cn(
                                  "h-4 w-4 rounded-[4px] border flex items-center justify-center transition-all",
                                  benefitDevice ? "bg-brand border-brand" : "bg-white border-line"
                                )}>
                                  {benefitDevice && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                                </div>
                                <span className="text-[12px] text-[#203430] font-medium">Company Device</span>
                              </div>
                           </div>
                        </div>
                        {/* Development Column */}
                        <div className="space-y-4">
                           <h4 className="text-[12px] font-bold text-[#63716E]">Development & Wellness</h4>
                           <div className="space-y-3">
                              {[
                                { l: 'Training Program', active: benefitTraining, act: () => setBenefitTraining(!benefitTraining) },
                                { l: 'Tuition', active: benefitTuition, act: () => setBenefitTuition(!benefitTuition) },
                                { l: 'Fitness Membership', active: benefitFitness, act: () => setBenefitFitness(!benefitFitness) },
                                { l: 'Mental Health Support', active: benefitMental, act: () => setBenefitMental(!benefitMental) }
                              ].map(item => (
                                <div key={item.l} onClick={item.act} className="flex items-center gap-3 cursor-pointer select-none">
                                  <div className={cn("h-4 w-4 rounded-[4px] border flex items-center justify-center transition-all", item.active ? "bg-brand border-brand" : "bg-white border-line")}>
                                    {item.active && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                                  </div>
                                  <span className="text-[12px] text-[#203430] font-medium">{item.l}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-8">
                       <h3 className="text-[14px] font-bold text-[#203430]">Documents</h3>
                       {errorsZone.docs && (
                         <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[12px] font-semibold text-red-600">
                           {errorsZone.docs}
                         </div>
                       )}
                       <div className="space-y-4">
                          {[
                            { id: 'cv', l: 'CV & Portfolio (Optional)' },
                            { id: 'id', l: 'ID / Government Document *' },
                            { id: 'contract', l: 'Contract Agreement (Optional)' },
                            { id: 'offer', l: 'Offer Letter (Optional)' }
                          ].map(doc => {
                            const hasFile = !!uploadedDocs[doc.id];
                            const hasDocError = doc.id === 'id' && errorsZone.docs;
                            return (
                              <div key={doc.id} className="flex flex-col lg:flex-row lg:items-center gap-4">
                                <span className="text-[12px] font-bold text-[#63716E] w-full lg:w-[150px] shrink-0">{doc.l}</span>
                                
                                <input 
                                  type="file" 
                                  id={`file-input-${doc.id}`}
                                  className="hidden" 
                                  onChange={e => handleFileUpload(doc.id, e)} 
                                />

                                <div 
                                  onClick={() => {
                                    document.getElementById(`file-input-${doc.id}`)?.click();
                                  }}
                                  className={cn(
                                    "flex-1 min-h-[61px] border border-dashed rounded-[10px] flex items-center justify-between p-4 cursor-pointer transition-all",
                                    hasFile 
                                      ? "border-[#006b5f]/40 bg-white" 
                                      : hasDocError
                                        ? "border-red-500 bg-red-5/40 hover:bg-red-50/20"
                                        : "border-line bg-[#F3F3F0] hover:bg-white hover:border-brand"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-full text-brand">
                                      {hasFile ? (
                                        <Check className="h-4 w-4 text-[#006b5f]" strokeWidth={3} />
                                      ) : (
                                        <Upload className="h-4 w-4 text-brand" />
                                      )}
                                    </div>
                                    <div className="text-left">
                                      {hasFile ? (
                                        <>
                                          <p className="text-[12px] font-bold text-[#006b5f]">{uploadedDocs[doc.id].name}</p>
                                          <p className="text-[10px] text-[#63716E] font-semibold">{uploadedDocs[doc.id].size}</p>
                                        </>
                                      ) : (
                                        <>
                                          <p className="text-[12px] font-bold text-[#203430]">
                                            <span className="underline">Click to Upload</span> <span className="font-normal text-slate-500">or drag & drop</span>
                                          </p>
                                          <p className="text-[10px] text-[#63716E]">PDF, DOC, PNG, or JPG (max. 10MB)</p>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {hasFile && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleRemoveDoc(doc.id, e)}
                                      className="text-[11px] font-bold text-red-500 hover:text-red-700 bg-white border border-red-200 hover:border-red-300 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                       </div>
                    </div>

                    <div className="pt-10 flex flex-col gap-4">
                        <label className="flex items-center gap-3 cursor-pointer group select-none">
                           <div 
                             onClick={() => setEmpActive(!empActive)} 
                             className="relative w-[34px] h-[18px]"
                           >
                              <div className={cn(
                                "absolute inset-0 rounded-full transition-colors", 
                                empActive ? "bg-brand" : "bg-[#F3F3F0]"
                              )} />
                              <div className={cn(
                                "absolute top-[2px] h-[14px] w-[14px] bg-white rounded-full transition-all",
                                empActive ? "left-[18px]" : "left-[2px]"
                              )} />
                           </div>
                           <span className="text-[12px] font-medium text-[#203430]">Active Employee</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group select-none">
                           <div 
                             onClick={() => setEmpSendEmail(!empSendEmail)} 
                             className="relative w-[34px] h-[18px]"
                           >
                              <div className={cn(
                                "absolute inset-0 rounded-full transition-colors", 
                                empSendEmail ? "bg-brand" : "bg-[#F3F3F0]"
                              )} />
                              <div className={cn(
                                "absolute top-[2px] h-[14px] w-[14px] bg-white rounded-full transition-all",
                                empSendEmail ? "left-[18px]" : "left-[2px]"
                              )} />
                           </div>
                           <span className="text-[12px] font-medium text-[#203430]">Send Welcome Email</span>
                        </label>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-16 flex items-center justify-between">
               <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentList = getCollection<any[]>("db_employees", []);
                      const targetId = draftId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
                      
                      const newEmp = {
                        id: targetId,
                        name: empName || "Draft Employee",
                        birthDate: empBirthDate,
                        gender: empGender,
                        email: empEmail,
                        phone: empPhone,
                        address: empAddress,
                        emergencyName: empEmergencyName,
                        emergencyPhone: empEmergencyPhone,
                        phoneCountry: empPhoneCountry,
                        emergencyPhoneCountry: empEmergencyPhoneCountry,
                        
                        joinDate: empJoinDate,
                        role: empRole,
                        dept: empDept,
                        type: empType,
                        model: empModel,
                        status: "Draft",
                        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
                        salary: empSalary,
                        bankName: empBankName,
                        bankAccount: empBankAccount,
                        taxId: empTaxId,
                        
                        allowanceTrans,
                        allowanceMeal,
                        allowanceInternet,
                        
                        benefitHealth,
                        benefitLife,
                        benefitDevice,
                        benefitTraining,
                        benefitTuition,
                        benefitFitness,
                        benefitMental,
                        
                        uploadedDocs,
                        empActive,
                        empSendEmail
                      };

                      let updatedList;
                      const index = currentList.findIndex(e => e.id === targetId);
                      if (index !== -1) {
                        updatedList = [...currentList];
                        updatedList[index] = newEmp;
                      } else {
                        updatedList = [...currentList, newEmp];
                      }

                      saveCollection("db_employees", updatedList);
                      window.dispatchEvent(new Event("storage"));
                      window.dispatchEvent(new Event("db_updated"));
                      showToast("Employee roster draft saved successfully!");
                      setTimeout(() => navigate('/employees'), 1500);
                    }}
                    className="text-[12px] font-bold text-[#0E4D41] hover:underline cursor-pointer bg-transparent border-none"
                  >
                    Save as Draft
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      if (confirm("Are you sure you want to discard your changes? All unsaved data will be lost.")) {
                        navigate("/employees");
                      }
                    }}
                    className="text-[12px] font-bold text-[#014D41] hover:underline cursor-pointer bg-transparent border-none"
                  >
                    Discard
                  </button>
               </div>
               <div className="flex gap-3">
                  {step > 1 && (
                    <button 
                      type="button" 
                      onClick={handlePrev}
                      className="px-6 h-[34px] bg-[#E4F2D3] text-[#203430] text-[12px] font-bold rounded-[8px] hover:opacity-80"
                    >
                      Previous
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="px-6 h-[34px] bg-brand text-white text-[12px] font-bold rounded-[8px] hover:opacity-90"
                  >
                    {step === 3 ? "Submit" : "Next"}
                  </button>
               </div>
            </div>
          </form>
        </div>
      </Card>

      {/* Dynamic Toast Feedback Overlay */}
      <AnimatePresence>
        {alertText && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="fixed bottom-6 right-6 z-[999] bg-[#203430] text-white text-[12px] font-bold px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 border border-[#006b5f]/40"
          >
            <div className="h-2 w-2 rounded-full bg-brand animate-ping" />
            <span>{alertText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-20 py-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
         <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-16">
            <p className="text-[12px] font-bold text-[#203430]">Copyright © 2025 Peterdraw</p>
            <div className="flex gap-6">
               {['Privacy Policy', 'Term and conditions', 'Contact'].map(l => (
                 <a key={l} href="#" className="text-[12px] text-[#63716E] hover:text-brand transition-colors">{l}</a>
               ))}
            </div>
         </div>
         <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
              <Icon key={i} className="h-4 w-4 text-[#63716E] cursor-pointer hover:text-brand" />
            ))}
         </div>
      </footer>
    </AppLayout>
  );
}

