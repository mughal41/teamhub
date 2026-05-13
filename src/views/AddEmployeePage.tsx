import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
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

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);

  const steps = [
    { id: 1, label: "Personal & Contact Information", desc: "Personal & Contact Information" },
    { id: 2, label: "Employment & Payroll Details", desc: "Employment & Payroll Details" },
    { id: 3, label: "Allowances, Benefits & Documents", desc: "Allowances, Benefits & Documents" },
  ];

  const handleNext = () => step < 3 && setStep(prev => prev + 1);
  const handlePrev = () => step > 1 && setStep(prev => prev - 1);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) handleNext();
    else navigate('/employees');
  };

  return (
    <AppLayout 
      title="Add New Employee" 
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Employees", href: "/employees" }, { label: "Add New Employee" }]}
    >
      {/* Main Multi-step Form Container */}
      <Card className="flex flex-col lg:flex-row border-none shadow-sm rounded-[16px] overflow-hidden min-h-[850px] bg-white">
        
        {/* Left Progress Steps Sidebar */}
        <div className="w-full lg:w-[272px] p-8 shrink-0 border-r border-[#E5E6E6]">
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
                      step > s.id ? "bg-brand" : "bg-[#E5E6E6]"
                    )} />
                  )}

                  {/* Step Indicator */}
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-all z-10",
                      step === s.id ? "border-brand bg-white" : 
                      step > s.id ? "border-brand bg-brand" : "border-[#E5E6E6] bg-white"
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

            <div className="h-[1px] bg-[#E5E6E6] w-full mb-8" />

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
                          <label className="text-[11px] font-bold text-[#63716E]">Full Name</label>
                          <input type="text" placeholder="Niko Pradana" className="w-full h-[38px] px-3 bg-[#F7F7F7] rounded-[8px] text-[12px] text-[#203430] outline-none" required />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Date of Birth</label>
                          <div className="relative">
                            <input type="text" placeholder="12 August 1995" className="w-full h-[38px] px-3 bg-[#F7F7F7] rounded-[8px] text-[12px] text-[#203430] outline-none" required />
                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#63716E]" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#63716E]">Gender</label>
                        <div className="flex flex-wrap gap-4">
                          {['Male', 'Female', 'Prefer not to say'].map(g => (
                            <label key={g} className={cn(
                              "flex-1 flex items-center justify-between h-[38px] px-4 rounded-[8px] cursor-pointer transition-all border",
                              g === 'Male' ? "bg-[#F8FCF3] border-brand" : "bg-[#F7F7F7] border-transparent"
                            )}>
                              <span className="text-[12px] text-[#203430]">{g}</span>
                              <div className={cn(
                                "h-4 w-4 rounded-full border flex items-center justify-center",
                                g === 'Male' ? "border-brand" : "border-[#E5E6E6]"
                              )}>
                                {g === 'Male' && <div className="h-2 w-2 rounded-full bg-brand" />}
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
                          <label className="text-[11px] font-bold text-[#63716E]">Email Address</label>
                          <input type="email" placeholder="niko.pradana@company.com" className="w-full h-[38px] px-3 bg-[#F7F7F7] rounded-[8px] text-[12px] text-[#203430] outline-none" required />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Phone Number</label>
                          <div className="flex items-center h-[38px] bg-[#F7F7F7] rounded-[8px] px-3 gap-2">
                             <div className="flex items-center gap-1 border-r border-[#E5E6E6] pr-2 shrink-0 cursor-pointer">
                               <div className="w-5 h-3 bg-red-500 rounded-sm" /> {/* Mock Flag */}
                               <span className="text-[12px] text-[#203430]">+62</span>
                               <ChevronDown className="h-3 w-3 text-[#203430]" />
                             </div>
                             <input type="text" placeholder="813 7788 2244" className="w-full h-full bg-transparent text-[12px] text-[#203430] outline-none" required />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#63716E]">Address</label>
                        <input type="text" placeholder="e.g. 221B Baker Street, London, NW1 6XE" className="w-full h-[38px] px-3 bg-[#FAEFF0] border border-[#E63D4B] rounded-[8px] text-[12px] text-[#203430] outline-none" required />
                        <p className="text-[11px] text-[#E63D4B] mt-1 font-medium">Please provide a valid mailing address</p>
                      </div>
                    </div>

                    {/* Emergency Contact Section */}
                    <div className="space-y-4 pt-4">
                      <h3 className="text-[14px] font-bold text-[#203430]">Emergency Contact</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Name</label>
                          <input type="text" placeholder="e.g. Sarah Thompson" className="w-full h-[38px] px-3 bg-[#FAEFF0] border border-[#E63D4B] rounded-[8px] text-[12px] text-[#203430] outline-none" />
                          <p className="text-[11px] text-[#E63D4B] mt-1 font-medium">Emergency contact name is required</p>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Phone Number</label>
                          <div className="flex items-center h-[38px] bg-[#F7F7F7] rounded-[8px] px-3 gap-2">
                             <div className="flex items-center gap-1 border-r border-[#E5E6E6] pr-2 shrink-0 cursor-pointer">
                               <div className="w-5 h-3 bg-red-500 rounded-sm" />
                               <span className="text-[12px] text-[#203430]">+62</span>
                               <ChevronDown className="h-3 w-3 text-[#203430]" />
                             </div>
                             <input type="text" placeholder="XXX XXXX XXXX" className="w-full h-full bg-transparent text-[12px] text-[#203430] outline-none" />
                          </div>
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
                            <input type="text" value="EMP-0371" disabled className="w-full h-[38px] px-3 bg-[#E5E6E6] rounded-[8px] text-[12px] font-bold text-[#203430] outline-none" />
                            <span className="absolute -bottom-5 left-0 text-[9px] font-medium text-[#63716E]">*Auto-generated</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Join Date</label>
                          <div className="relative">
                            <input type="text" value="19 June 2035" className="w-full h-[38px] px-3 bg-[#F7F7F7] rounded-[8px] text-[12px] text-[#203430] outline-none shadow-sm" />
                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#63716E]" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Job Title</label>
                          <div className="relative">
                            <select className="appearance-none w-full h-[38px] px-3 bg-[#F7F7F7] rounded-[8px] text-[12px] text-[#203430] outline-none pr-8">
                              <option>IT Support Specialist</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#203430]" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Department</label>
                          <div className="relative">
                            <select className="appearance-none w-full h-[38px] px-3 bg-[#F7F7F7] rounded-[8px] text-[12px] text-[#203430] outline-none pr-8">
                              <option>Operations</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#203430]" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Employment Type</label>
                          <div className="relative">
                            <select className="appearance-none w-full h-[38px] px-3 bg-[#F7F7F7] rounded-[8px] text-[12px] text-[#203430] outline-none pr-8">
                              <option>Full-Time</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#203430]" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 mt-6">
                        <label className="text-[11px] font-bold text-[#63716E]">Work Model</label>
                        <div className="flex flex-wrap gap-4">
                          {['On-Site', 'Hybrid', 'Remote'].map(m => (
                            <label key={m} className={cn(
                              "flex-1 flex items-center justify-between h-[38px] px-4 rounded-[8px] cursor-pointer transition-all border",
                              m === 'On-Site' ? "bg-[#F8FCF3] border-brand" : "bg-[#F7F7F7] border-transparent"
                            )}>
                              <span className="text-[12px] text-[#203430]">{m}</span>
                              <div className={cn(
                                "h-4 w-4 rounded-full border flex items-center justify-center",
                                m === 'On-Site' ? "border-brand" : "border-[#E5E6E6]"
                              )}>
                                {m === 'On-Site' && <div className="h-2 w-2 rounded-full bg-brand" />}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-8">
                      <h3 className="text-[14px] font-bold text-[#203430]">Payroll Info</h3>
                      <div className="space-y-1.5">
                         <label className="text-[11px] font-bold text-[#63716E]">Salary</label>
                         <div className="relative">
                            <input type="text" placeholder="$2,800" className="w-full h-[38px] px-3 bg-[#F7F7F7] rounded-[8px] text-[12px] text-[#203430] outline-none" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#63716E]">/month</span>
                         </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Bank Name</label>
                          <input type="text" placeholder="e.g. Barclays UK" className="w-full h-[38px] px-3 bg-[#F7F7F7] rounded-[8px] text-[12px] text-[#203430] outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Bank Account Number</label>
                          <div className="relative">
                            <input type="text" placeholder="e.g. 12345678" className="w-full h-[38px] px-3 bg-[#F7F7F7] rounded-[8px] text-[12px] text-[#203430] outline-none" />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#203430]" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#63716E]">Tax Identification Number (NPWP)</label>
                          <input type="text" placeholder="e.g. AB123456C" className="w-full h-[38px] px-3 bg-[#F7F7F7] rounded-[8px] text-[12px] text-[#203430] outline-none" />
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
                          { l: 'Transportation', active: true },
                          { l: 'Meal', active: true },
                          { l: 'Internet (Remote & Hybrid only)', active: false },
                        ].map(a => (
                          <div key={a.l} className="flex items-center gap-3">
                            <div className={cn("h-4 w-4 rounded-[4px] border flex items-center justify-center transition-all", a.active ? "bg-brand border-brand" : "bg-[#F7F7F7] border-[#E5E6E6]")}>
                              {a.active && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                            </div>
                            <span className="text-[12px] text-[#203430] font-medium">{a.l}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <h3 className="text-[14px] font-bold text-[#203430]">Benefits</h3>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-4 w-4 rounded-[4px] border border-[#E5E6E6] bg-white" />
                        <span className="text-[12px] text-[#203430] font-medium">Select All</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Insurance Column */}
                        <div className="space-y-4">
                           <h4 className="text-[12px] font-bold text-[#63716E]">Insurance</h4>
                           <div className="space-y-3">
                              {['Health Insurance', 'Life Insurance'].map(item => (
                                <div key={item} className="flex items-center gap-3">
                                  <div className="h-4 w-4 rounded-[4px] border border-brand bg-brand flex items-center justify-center">
                                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                                  </div>
                                  <span className="text-[12px] text-[#203430] font-medium">{item}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                        {/* Work-Related Column */}
                        <div className="space-y-4">
                           <h4 className="text-[12px] font-bold text-[#63716E]">Work-Related Perks</h4>
                           <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="h-4 w-4 rounded-[4px] border border-brand bg-brand flex items-center justify-center">
                                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
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
                                { l: 'Training Program', active: true },
                                { l: 'Tuition', active: false },
                                { l: 'Fitness Membership', active: true },
                                { l: 'Mental Health Support', active: false }
                              ].map(item => (
                                <div key={item.l} className="flex items-center gap-3">
                                  <div className={cn("h-4 w-4 rounded-[4px] border flex items-center justify-center transition-all", item.active ? "bg-brand border-brand" : "bg-white border-[#E5E6E6]")}>
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
                       <div className="space-y-4">
                          {[
                            { l: 'CV & Portfolio (If Any)', width: '188px' },
                            { l: 'ID', width: '12px' },
                            { l: 'Contract Agreement', width: '112px' },
                            { l: 'Offer Letter', width: '63px' }
                          ].map(doc => (
                            <div key={doc.l} className="flex flex-col lg:flex-row lg:items-center gap-4">
                              <span className="text-[12px] font-bold text-[#63716E] w-full lg:w-[150px] shrink-0">{doc.l}</span>
                              <div className="flex-1 h-[61px] border border-dashed border-[#E5E6E6] bg-[#F7F7F7] rounded-[10px] flex items-center justify-center gap-3 cursor-pointer hover:bg-[#F8FCF3] hover:border-brand transition-all">
                                <div className="p-2 bg-white rounded-full">
                                  <Upload className="h-4 w-4 text-brand" />
                                </div>
                                <div className="text-center">
                                  <p className="text-[12px] font-bold text-[#203430]"><span className="underline">Click to Upload</span> <span className="font-normal">or drag & drop</span></p>
                                  <p className="text-[10px] text-[#63716E]">PDF, DOC, PNG, or JPG (max. 2.5 MB)</p>
                                </div>
                              </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="pt-10 flex flex-col gap-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <div className="relative w-[34px] h-[18px]">
                              <input type="checkbox" className="hidden" defaultChecked />
                              <div className="absolute inset-0 bg-brand rounded-full transition-colors" />
                              <div className="absolute left-[18px] top-[2px] h-[14px] w-[14px] bg-white rounded-full shadow-sm transition-all" />
                           </div>
                           <span className="text-[12px] font-medium text-[#203430]">Active Employee</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <div className="relative w-[34px] h-[18px]">
                              <input type="checkbox" className="hidden" />
                              <div className="absolute inset-0 bg-[#E5E6E6] rounded-full transition-colors" />
                              <div className="absolute left-[2px] top-[2px] h-[14px] w-[14px] bg-white rounded-full shadow-sm transition-all" />
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
                  <button type="button" className="text-[12px] font-bold text-[#0E4D41] hover:underline">Save as Draft</button>
                  <button type="button" className="text-[12px] font-bold text-[#0E4D41] hover:underline">Discard</button>
               </div>
               <div className="flex gap-3">
                  {step > 1 && (
                    <button 
                      type="button" 
                      onClick={handlePrev}
                      className="px-6 h-[34px] bg-[#E4F2D3] text-[#203430] text-[12px] font-bold rounded-[8px] hover:opacity-80 shadow-sm"
                    >
                      Previous
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="px-6 h-[34px] bg-brand text-white text-[12px] font-bold rounded-[8px] hover:opacity-90 shadow-sm"
                  >
                    {step === 3 ? "Submit" : "Next"}
                  </button>
               </div>
            </div>
          </form>
        </div>
      </Card>

      <footer className="mt-20 py-8 border-t border-[#E5E6E6] flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
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

