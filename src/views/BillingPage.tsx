import * as React from "react"
import { useState } from "react"
import { AppLayout } from "../components/layout/AppLayout"
import { getCollection, saveCollection } from "../lib/db"
import { 
  CreditCard, 
  Sparkles, 
  ArrowUpRight, 
  DownloadCloud, 
  Trash2, 
  Check, 
  Plus, 
  X, 
  CheckCircle2, 
  Activity, 
  Database, 
  Zap,
  Lock,
  ChevronLeft,
  Settings,
  HelpCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  MessageSquare,
  Video,
  Layers,
  ChevronRight,
  ShieldAlert,
  Globe,
  Shield
} from "lucide-react"

/*
Billing & Invoices JSON Data Format Requirement:
-----------------------------------------------+
The Billing and Subscription page expects information feeds organized in the following JSON format.
You can read/write these collections to/from local storage or client state using "db_payment_methods" and "db_invoices".

1. Payment Methods List (db_payment_methods):
[
  {
    "id": "pay_1",
    "cardholder": "Anya Rodriguez",
    "brand": "Visa",
    "last4": "4242",
    "expMonth": "12",
    "expYear": "2027",
    "isDefault": true
  }
]

2. Invoices List (db_invoices):
[
  {
    "id": "INV-2026-001",
    "amount": "299.00",
    "currency": "USD",
    "date": "2026-06-01",
    "status": "PAID",
    "plan": "pro"
  }
]

3. Subscription Plan (db_current_plan):
"basic" | "pro" | "enterprise"
*/

// Define our visual themes & metrics
type SubscriptionPlan = "basic" | "pro" | "enterprise"
type ViewState = "billing" | "usage" | "subscription"

export default function BillingPage() {
  const [activeView, setActiveView] = useState<ViewState>("billing")
  
  const [currentPlan, setCurrentPlanState] = useState<SubscriptionPlan>(() => {
    return (localStorage.getItem("db_current_plan") as SubscriptionPlan) || "pro";
  });

  const setCurrentPlan = (plan: SubscriptionPlan) => {
    setCurrentPlanState(plan);
    localStorage.setItem("db_current_plan", plan);
    // Broadcast
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("db_updated"));
  };

  // Modal toggle for adding card
  const [showAddCardModal, setShowAddCardModal] = useState(false)
  const [showManagePlanModal, setShowManagePlanModal] = useState(false)
  
  // Filter for Usage Report
  const [usagePeriod, setUsagePeriod] = useState<"30" | "7" | "90">("30")
  const [isExporting, setIsExporting] = useState(false)

  // Success message toast
  const [successToast, setSuccessToast] = useState("")

  // Active status of notification alerts (Usage Report Side Widget)
  const [alertApi, setAlertApi] = useState(true)
  const [alertStorage, setAlertStorage] = useState(true)
  
  const [customAlerts, setCustomAlertsState] = useState<string[]>(() => {
    return getCollection<string[]>("db_custom_alerts", ["Memory Capacity Warning", "Biometric Desync Trigger"]);
  });

  const setCustomAlerts = (update: string[] | ((prev: string[]) => string[])) => {
    if (typeof update === "function") {
      setCustomAlertsState((prev) => {
        const next = update(prev);
        saveCollection("db_custom_alerts", next);
        return next;
      });
    } else {
      setCustomAlertsState(update);
      saveCollection("db_custom_alerts", update);
    }
  };

  // Optimization tip status
  const [automationConfigured, setAutomationConfigured] = useState(false)

  // Payment methods list
  const [paymentMethods, setPaymentMethodsState] = useState<any[]>(() => {
    return getCollection<any[]>("db_payment_methods", []);
  });

  const setPaymentMethods = (update: any[] | ((prev: any[]) => any[])) => {
    if (typeof update === "function") {
      setPaymentMethodsState((prev) => {
        const next = update(prev);
        saveCollection("db_payment_methods", next);
        return next;
      });
    } else {
      setPaymentMethodsState(update);
      saveCollection("db_payment_methods", update);
    }
  };

  // Invoices list
  const [invoices, setInvoicesState] = useState<any[]>(() => {
    return getCollection<any[]>("db_invoices", []);
  });

  const setInvoices = (update: any[] | ((prev: any[]) => any[])) => {
    if (typeof update === "function") {
      setInvoicesState((prev) => {
        const next = update(prev);
        saveCollection("db_invoices", next);
        return next;
      });
    } else {
      setInvoicesState(update);
      saveCollection("db_invoices", update);
    }
  };

  // Add Card form state
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCVV, setCardCVV] = useState("")
  const [cardZip, setCardZip] = useState("")
  const [isDefaultCheckbox, setIsDefaultCheckbox] = useState(true)

  // Reactive DB Updates Sync
  React.useEffect(() => {
    const handleDbUpdate = () => {
      setCurrentPlanState((localStorage.getItem("db_current_plan") as SubscriptionPlan) || "pro");
      setCustomAlertsState(getCollection<string[]>("db_custom_alerts", []));
      setPaymentMethodsState(getCollection<any[]>("db_payment_methods", []));
      setInvoicesState(getCollection<any[]>("db_invoices", []));
    };
    window.addEventListener("db_updated", handleDbUpdate);
    window.addEventListener("storage", handleDbUpdate);
    return () => {
      window.removeEventListener("db_updated", handleDbUpdate);
      window.removeEventListener("storage", handleDbUpdate);
    };
  }, []);

  // Dynamically computed metrics based on SubscriptionPlan and Period filter
  const isBasic = currentPlan === "basic"
  const isPro = currentPlan === "pro"
  const isEnterprise = currentPlan === "enterprise"

  const allowedSeats = isBasic ? 50 : isPro ? 250 : 1000
  const activeSeats = getCollection<any[]>("db_employees", []).length || 42

  // Metrics based on period filter (Detailed usage)
  const metricMultiplier = usagePeriod === "7" ? 0.25 : usagePeriod === "90" ? 2.8 : 1.0
  const apiCallVolume = Math.round(412500 * metricMultiplier)
  const storageSize = isEnterprise ? "142.5 GB" : "84.2 GB"
  const storageCap = isBasic ? "50 GB" : isEnterprise ? "500 GB" : "100 GB"
  const storagePercent = isBasic ? 95 : isEnterprise ? 28.5 : 84.2

  const triggerToast = (msg: string) => {
    setSuccessToast(msg)
    setTimeout(() => setSuccessToast(""), 4500)
  }

  // Handle saving new card method
  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cardName || !cardNumber || !cardExpiry || !cardCVV) {
      alert("Please fill in all credit card inputs.")
      return
    }

    const cleanNum = cardNumber.replace(/\s+/g, "")
    const last4 = cleanNum.slice(-4) || "0000"
    const isVisa = cleanNum.startsWith("4")

    const newCard = {
      id: Date.now(),
      type: isVisa ? "visa" : "mastercard",
      last4,
      expiry: cardExpiry,
      holder: cardName,
      isDefault: isDefaultCheckbox
    }

    let updatedMethods = [...paymentMethods]
    if (isDefaultCheckbox) {
      updatedMethods = updatedMethods.map(m => ({ ...m, isDefault: false }))
    }

    setPaymentMethods([...updatedMethods, newCard])
    setShowAddCardModal(false)
    setCardName("")
    setCardNumber("")
    setCardExpiry("")
    setCardCVV("")
    setCardZip("")
    setIsDefaultCheckbox(true)
    triggerToast(`Added ending in •••• ${last4} as safe payment credentials!`)
  }

  const deleteCard = (id: number, last4: string) => {
    if (confirm(`Are you sure you want to remove card ending in •••• ${last4}?`)) {
      const removed = paymentMethods.filter(m => m.id !== id)
      const hasDefault = removed.some(m => m.isDefault)
      if (removed.length > 0 && !hasDefault) {
        removed[0].isDefault = true
      }
      setPaymentMethods(removed)
      triggerToast(`Removed payment ending in •••• ${last4} securely.`)
    }
  }

  const handleSetDefault = (id: number) => {
    setPaymentMethods(paymentMethods.map(m => ({
      ...m,
      isDefault: m.id === id
    })))
    triggerToast("Updated primary default billing credential successfully!")
  }

  const restoreDemoBilling = () => {
    const defaultCards = [
      {
        id: 1,
        type: "visa",
        last4: "4242",
        expiry: "12/28",
        holder: "Anya Rodriguez",
        isDefault: true
      },
      {
        id: 2,
        type: "mastercard",
        last4: "9876",
        expiry: "09/27",
        holder: "Admin Operations",
        isDefault: false
      }
    ];
    const defaultInvoices = [
      {
        id: "INV-2026-001",
        date: "2026-06-01",
        amount: "$99.00",
        status: "Paid"
      },
      {
        id: "INV-2026-002",
        date: "2026-05-01",
        amount: "$99.00",
        status: "Paid"
      }
    ];

    setPaymentMethods(defaultCards);
    setInvoices(defaultInvoices);
    triggerToast("Sample corporate payment credentials and invoice indicators created.");
  };

  const exportReport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      triggerToast("Detailed system usage report exported successfully in Microsoft Excel workbook format!")
    }, 1800)
  }

  const handlePlanChange = (plan: SubscriptionPlan) => {
    if (plan === currentPlan) return;
    
    // Pro-ration messaging
    const planNames = { basic: "TeamHub Basic", pro: "TeamHub Pro", enterprise: "TeamHub Enterprise" }
    const confirmChange = confirm(`Are you sure you want to transition your organization to the ${planNames[plan]} subscription plan? Your billing rate will be pro-rated immediately.`)
    
    if (confirmChange) {
      setCurrentPlan(plan)
      // Append a mock invoice reflecting plan upgrade/downgrade
      const newInvoice = {
        id: `INV-2025-${Math.floor(1000 + Math.random() * 9000)}`,
        date: "Today",
        amount: plan === "basic" ? "$49.00" : plan === "pro" ? "$99.00" : "$0.00 (Invoiced)",
        status: "Paid"
      }
      setInvoices([newInvoice, ...invoices])
      triggerToast(`Subscription level changed to ${planNames[plan]} successfully! Your index dashboards are synchronized.`)
      setActiveView("billing")
    }
  }

  const addNewAlert = () => {
    const title = prompt("Enter alert threshold name (e.g. Memory Breach, Custom Endpoint Capacity):")
    if (title) {
      setCustomAlerts([...customAlerts, title])
      triggerToast(`Added live rule alert: "${title}" threshold watcher activated!`)
    }
  }

  // Dynamic layout titles & breadcrumbs
  const customTitle = activeView === "usage" 
    ? "Detailed Usage Report" 
    : activeView === "subscription" 
      ? "Subscription Pricing" 
      : "Billing & Subscription"

  const customBreadcrumbs = [
    { label: "Settings", href: "/settings/personal-info" },
    { label: "Billing", href: activeView !== "billing" ? "#" : undefined },
    ...(activeView === "usage" ? [{ label: "Usage Report" }] : []),
    ...(activeView === "subscription" ? [{ label: "Change Subscription" }] : [])
  ]

  return (
    <AppLayout
      title={customTitle}
      breadcrumbs={customBreadcrumbs}
    >
      <div className="w-full pb-12 animate-fade-in duration-300 relative">
        
        {/* Floating Success Notification Banner */}
        {successToast && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-white px-5 py-4 rounded-xl flex items-center gap-3.5 z-50 animate-fade-in text-sm shadow-2xl">
            <CheckCircle2 className="h-5.5 w-5.5 text-emerald-400" />
            <p className="font-semibold tracking-wide">{successToast}</p>
          </div>
        )}

        {/* ----------------- PRIMARY BILLING INDEX VIEW ----------------- */}
        {activeView === "billing" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-sm text-slate-500 font-medium font-sans">
                Manage your TeamHub subscription level, billing credits, download invoice statements, and configure secure payment methods.
              </p>
              {paymentMethods.length === 0 && (
                <button
                  type="button"
                  onClick={restoreDemoBilling}
                  className="text-xs font-bold bg-slate-50 hover:bg-slate-100 text-[#006b5f] hover:text-[#005047] border border-slate-200 rounded-xl px-4 py-2 cursor-pointer transition-colors shrink-0"
                >
                  Restore Prototype Billing Logs
                </button>
              )}
            </div>

            {/* Main Grid split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (Span 8) */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* Subscription Card Widget matching user screens */}
                <div className="bg-white rounded-2xl border border-line p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start gap-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full pointer-events-none group-hover:bg-teal-500/10 transition-colors" />
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-extrabold uppercase tracking-wide">
                        {isPro ? "Enterprise Pro" : isBasic ? "TeamHub Basic" : "TeamHub Enterprise"}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">• Active Account</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        {isPro ? "USD $99.00" : isBasic ? "USD $49.00" : "Custom Contracting"} / month
                      </h3>
                      <p className="text-xs text-slate-450 font-medium mt-1">
                        Next subscription renewal cycle executes automatically on <strong className="font-bold text-slate-600">Nov 24, 2025</strong>.
                      </p>
                    </div>

                    {/* Dynamic seat progress bar bar */}
                    <div className="space-y-1.5 max-w-md pt-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-550">
                        <span>Assigned Seats Used</span>
                        <span className="text-slate-800 font-mono font-bold">
                          {activeSeats} / {isEnterprise ? "Unlimited" : `${allowedSeats} Seats`}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-teal-600 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${isEnterprise ? 4 : (activeSeats / allowedSeats) * 100}%` }} 
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {isEnterprise 
                          ? "Unlimited subscription slots available in high-scale organizational directory."
                          : `You have ${allowedSeats - activeSeats} seat slots left. Upgrade subscription level to scale boundaries.`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Pricing action buttons */}
                  <div className="flex sm:flex-col gap-3 shrink-0 self-end sm:self-center w-full sm:w-auto">
                    <button 
                      onClick={() => setShowManagePlanModal(true)}
                      className="flex-1 sm:flex-none px-4.5 py-3 bg-[#006b5f] hover:bg-[#005047] text-white rounded-xl text-xs font-bold text-center transition-all active:scale-95 cursor-pointer"
                    >
                      Manage Plan
                    </button>
                    <button 
                      onClick={() => setActiveView("usage")}
                      className="flex-1 sm:flex-none px-4.5 py-3 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold bg-white text-xs rounded-xl text-center transition-all hover:bg-slate-50 cursor-pointer"
                    >
                      View Detailed Plan Info
                    </button>
                  </div>
                </div>

                {/* Savings payments section */}
                <div className="bg-white rounded-2xl border border-line flex flex-col">
                  <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-550/10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-850 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-[#006b5f]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Saved Payment Methods</h3>
                        <p className="text-xs text-slate-400 font-medium">Manage primary credit cards for recurring invoicing</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowAddCardModal(true)}
                      className="px-3.5 py-2 hover:bg-teal-50 text-[#006b5f] border border-teal-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Card
                    </button>
                  </div>

                  <div className="p-6 divide-y divide-slate-100/80">
                    {paymentMethods.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 font-medium text-xs flex flex-col items-center justify-center gap-2">
                        <CreditCard className="h-8 w-8 text-slate-300 mb-1" />
                        <p>No configured credit cards or payment plans found.</p>
                        <p className="text-[10px] text-slate-450 text-slate-400 max-w-xs font-normal">Add a credit card below to initialize automated trial subscription accounts billing cycles.</p>
                      </div>
                    ) : (
                      paymentMethods.map((method) => (
                        <div key={method.id} className="py-4.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-400 select-none shadow-3xs uppercase tracking-widest font-mono">
                              {method.type === "visa" ? (
                                <span className="text-indigo-800 italic">Visa</span>
                              ) : (
                                <span className="text-amber-700">Mc</span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-slate-800">•••• •••• •••• {method.last4}</p>
                                {method.isDefault && (
                                  <span className="px-2 py-0.5 rounded bg-emerald-550 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-extrabold tracking-wide">PRIMARY DEFAULT</span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Expires {method.expiry} • Holder: {method.holder}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!method.isDefault && (
                              <button 
                                onClick={() => handleSetDefault(method.id)}
                                className="text-xs font-bold text-slate-600 hover:text-[#006b5f] hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-line hover:border-teal-500/30 transition-all cursor-pointer"
                              >
                                Set default
                              </button>
                            )}
                            <button 
                              onClick={() => deleteCard(method.id, method.last4)}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="Remove Credentials"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Ledger Invoice List Table */}
                <div className="bg-white rounded-2xl border border-line overflow-hidden flex flex-col font-sans">
                  <div className="p-6 border-b border-slate-50 bg-slate-50/10">
                    <h3 className="text-base font-bold text-slate-900">Billing & Invoicing History</h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Track and download previous business transaction invoices</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap bg-white">
                      <thead>
                        <tr className="bg-slate-550/10 bg-slate-50 font-bold uppercase tracking-wider text-[10px] text-slate-400 border-b border-line">
                          <th className="px-6 py-4">Invoice ID</th>
                          <th className="px-6 py-4">Transaction Date</th>
                          <th className="px-6 py-4">Charged Amount</th>
                          <th className="px-6 py-4 text-center">Status</th>
                          <th className="px-6 py-4 text-right">PDF Invoice</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/60 text-slate-700 text-sm">
                        {invoices.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                              No configured billing or transaction invoices found.
                            </td>
                          </tr>
                        ) : (
                          invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800">{inv.id}</td>
                            <td className="px-6 py-4 text-slate-500 font-semibold text-xs">{inv.date}</td>
                            <td className="px-6 py-4 font-extrabold text-slate-800 font-mono text-xs">{inv.amount}</td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-50 border border-teal-100 text-teal-800">
                                <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
                                {inv.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => triggerToast(`Invoice ${inv.id} receipt loaded. Initiating secure PDF ledger transmission.`)}
                                className="text-xs font-bold text-[#006b5f] hover:text-[#005047] flex items-center justify-end gap-1.5 ml-auto hover:underline cursor-pointer"
                              >
                                <DownloadCloud className="h-4.5 w-4.5 shrink-0" />
                                Download Receipt
                              </button>
                            </td>
                          </tr>
                        ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Right Column details (Span 4) */}
              <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8">
                
                {/* Billing Address profiles matching screen */}
                <div className="bg-white rounded-2xl border border-line p-6 flex flex-col gap-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-50 pb-2">
                    Billing Profiles
                  </h4>
                  <div className="space-y-4 text-xs font-sans">
                    <div className="space-y-1">
                      <span className="block text-slate-400 font-bold uppercase tracking-wider text-[9px]">Billing Corporate Entity</span>
                      <p className="font-bold text-slate-800">TeamHub Technologies, Inc.</p>
                    </div>
                    <div className="space-y-1 pt-1">
                      <span className="block text-slate-400 font-bold uppercase tracking-wider text-[9px]">Invoicing Address</span>
                      <p className="font-medium text-slate-700 leading-relaxed font-sans">
                        500 Howard Street, Suite 300<br />
                        San Francisco, CA 94105<br />
                        United States of America
                      </p>
                    </div>
                    <div className="space-y-1 pt-1">
                      <span className="block text-slate-400 font-bold uppercase tracking-wider text-[9px]">Tax Registration ID</span>
                      <p className="font-mono font-bold text-slate-800">US-8219-TAX-010</p>
                    </div>
                    <div className="space-y-1 pt-1">
                      <span className="block text-slate-400 font-bold uppercase tracking-wider text-[9px]">Accounts Email Receipt</span>
                      <p className="font-bold text-[#006b5f]">finance-accounts@teamhubtech.io</p>
                    </div>
                  </div>
                </div>

                {/* Secure Payment Shield */}
                <div className="rounded-2xl border border-line bg-[#f8f9fa] p-5 space-y-4 flex flex-col justify-between shadow-3xs">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
                      <Lock className="h-5 w-5 text-[#006b5f]" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-750">Secure Payments Shield</h4>
                      <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                        Purchases are securely synchronized via Stripe cryptographic systems. Zero credit details ever visible.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-150 flex items-center justify-between text-[10px] font-bold text-slate-450 uppercase tracking-wide">
                    <span>PCI-DSS COMPLIANT</span>
                    <span>STRIPE VERIFIED</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ----------------- SUB-SCREEN 1: DETAILED USAGE REPORT ----------------- */}
        {activeView === "usage" && (
          <div className="space-y-8 animate-fade-in duration-200">
            
            {/* Header controls layout */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-line pb-6">
              <div>
                <button 
                  onClick={() => setActiveView("billing")}
                  className="flex items-center text-[#006b5f] hover:text-[#005047] font-bold text-xs gap-1.5 mb-3 hover:-translate-x-1 transition-transform cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Billing Overview
                </button>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Detailed Usage Report</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Monitoring system telemetries, computing volumes, and quota scopes across modules.
                </p>
              </div>
              
              {/* Action toggles */}
              <div className="flex items-center gap-3">
                <div className="relative inline-flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-3xs text-xs font-extrabold text-slate-600">
                  <button 
                    onClick={() => { setUsagePeriod("7"); triggerToast("Telemetry meters updated to showcase Last 7 Days scope.") }}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${usagePeriod === "7" ? "bg-teal-50 text-[#006b5f]" : "hover:text-slate-900"}`}
                  >
                    7 Days
                  </button>
                  <button 
                    onClick={() => { setUsagePeriod("30"); triggerToast("Telemetry meters updated to showcase Last 30 Days scope.") }}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${usagePeriod === "30" ? "bg-teal-50 text-[#006b5f]" : "hover:text-slate-900"}`}
                  >
                    30 Days
                  </button>
                  <button 
                    onClick={() => { setUsagePeriod("90"); triggerToast("Telemetry meters updated to showcase Last 90 Days scope.") }}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${usagePeriod === "90" ? "bg-teal-50 text-[#006b5f]" : "hover:text-slate-900"}`}
                  >
                    90 Days
                  </button>
                </div>

                <button 
                  onClick={exportReport}
                  disabled={isExporting}
                  className="bg-[#006b5f] hover:bg-[#005047] text-white px-4.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isExporting ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Compiling...
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="h-4 w-4" />
                      Export Report
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bento Grid layout of meters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* API requests quota meter */}
              <div className="bg-[#d4e7d8] rounded-2xl p-6 border border-slate-200/40 flex flex-col justify-between group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-[#006b5f] rounded-xl flex items-center justify-center text-white">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1 text-[#004941] bg-[#5cdac7]/20 border border-[#5cdac7]/10 px-2 py-0.5 rounded-full text-[10px] font-black">
                    <TrendingUp className="h-3 w-3" />
                    +5.2%
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">Monthly API Requests</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      {apiCallVolume.toLocaleString()}
                    </span>
                    <span className="text-slate-600 text-xs font-medium">/ 1M calls</span>
                  </div>
                  <div className="w-full bg-slate-900/10 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-[#006b5f] h-full rounded-full transition-all duration-500" style={{ width: `${(apiCallVolume / 1000000) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-600 font-bold mt-2">
                    {((apiCallVolume / 1000000) * 100).toFixed(1)}% usage of monthly quota limits
                  </p>
                </div>
              </div>

              {/* Secure storage usage card */}
              <div className="bg-white rounded-2xl p-6 border border-line flex flex-col justify-between">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-50 border border-line rounded-xl flex items-center justify-center text-[#006b5f] shadow-3xs">
                    <Database className="h-6 w-6" />
                  </div>
                  <div className="text-xs text-slate-500 font-extrabold bg-slate-50 px-2.5 py-0.5 rounded-full border border-line">
                    +1.4 GB / day
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-1">Secure Media Storage</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-800 font-mono font-medium">{storageSize}</span>
                    <span className="text-slate-400 text-xs font-medium">/ {storageCap}</span>
                  </div>
                  <div className="w-full bg-slate-150 bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-[#006b5f] h-full rounded-full transition-all duration-500" style={{ width: `${storagePercent}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-2">
                    Storage usage is nearing active limits ({storagePercent.toFixed(1)}%)
                  </p>
                </div>
              </div>

              {/* Seats monitor details */}
              <div className="bg-white rounded-2xl p-6 border border-line flex flex-col justify-between">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-50 border border-line rounded-xl flex items-center justify-center text-[#006b5f] shadow-3xs">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="text-xs text-[#006b5f] font-extrabold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                    {isEnterprise ? "Unlimited" : `${allowedSeats - activeSeats} Free Slots`}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-1">Active Employee Seats</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-800 font-mono font-medium">{activeSeats}</span>
                    <span className="text-slate-400 text-xs font-medium">/ {isEnterprise ? "No Limit" : `${allowedSeats} seats`}</span>
                  </div>
                  
                  {/* Row of visual block markers inspired by mockup seats container */}
                  <div className="flex gap-0.5 mt-4">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-4.5 flex-1 rounded-sm transition-colors ${
                          i < Math.min(16, Math.floor((activeSeats / allowedSeats) * 16)) 
                            ? "bg-[#006b5f]" 
                            : "bg-slate-150"
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-2">
                    Directory volume growth operating safely within guidelines
                  </p>
                </div>
              </div>

            </div>

            {/* Detailed Analytics line and area charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* API Requests daily volume (Span 8) */}
              <div className="lg:col-span-8 bg-white border border-line p-6 rounded-2xl space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">API Request Volume (Daily Trend)</h3>
                  <div className="flex gap-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#006b5f]" />
                      <span>Success (99.8%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span>Failures (0.2%)</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Chart with SVG path precisely replicating mockups */}
                <div className="h-60 w-full relative flex items-end justify-between border-b border-l border-line px-4 pt-4 pb-1 overflow-hidden" style={{ backgroundImage: "radial-gradient(#e2e8f0 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }}>
                  
                  {/* Left horizontal values */}
                  <div className="absolute left-2 inset-y-4 flex flex-col justify-between text-[9px] font-mono font-bold text-slate-400 pointer-events-none z-0 select-none">
                    <span>50k</span>
                    <span>40k</span>
                    <span>30k</span>
                    <span>20k</span>
                    <span>10k</span>
                  </div>

                  {/* SVG line and shaded gradient */}
                  <svg className="absolute inset-x-4 inset-y-1 w-[calc(100%-2rem)] h-[calc(100%-1.25rem)] pointer-events-none z-10" preserveAspectRatio="none" viewBox="0 0 700 240">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#006b5f" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#006b5f" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Fill */}
                    <path 
                      d="M 0 160 L 50 142 L 100 165 L 150 115 L 200 80 L 250 105 L 300 128 L 350 96 L 400 62 L 450 88 L 500 112 L 550 48 L 600 64 L 650 93 L 700 45 L 700 240 L 0 240 Z" 
                      fill="url(#chartGradient)"
                    />

                    {/* Polyline */}
                    <polyline 
                      points="0,160 50,142 100,165 150,115 200,80 250,105 300,128 350,96 400,62 450,88 500,112 550,48 600,64 650,93 700,45" 
                      fill="none" 
                      stroke="#006b5f" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      className="drop-"
                    />
                  </svg>

                  {/* Display simple dates matching graph intervals */}
                  <div className="absolute bottom-1 inset-x-8 flex justify-between text-[9px] font-mono font-bold text-slate-400 select-none pointer-events-none">
                    <span>May 05</span>
                    <span>May 10</span>
                    <span>May 15</span>
                    <span>May 20</span>
                    <span>May 25</span>
                    <span>May 30</span>
                  </div>
                </div>
              </div>

              {/* Storage projection Growth metric indicator (Span 4) */}
              <div className="lg:col-span-4 bg-white border border-line p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Storage Growth Trend</h3>
                  
                  {/* Mini filled graph mock */}
                  <div className="h-28 w-full bg-slate-50 border border-line rounded-xl relative overflow-hidden mb-4 p-2">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="storageGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3abfad" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#3abfad" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,100 L0,78 C20,72 40,58 60,42 C85,30 100,22 100,22 L100,100 Z" fill="url(#storageGrad)" />
                      <path d="M0,78 C20,72 40,58 60,42 C85,30 100,22 100,22" fill="none" stroke="#2dd4bf" strokeWidth="2.5" />
                    </svg>
                    <div className="absolute top-2 right-2 flex items-center text-[9px] font-bold text-[#0D9488] bg-teal-50 border border-teal-100 px-2 rounded-full leading-normal">
                      Projection Trend
                    </div>
                  </div>

                  <div className="space-y-3 Divide-y divide-slate-100 pt-1 text-xs">
                    <div className="flex justify-between items-center py-2 first:pt-0">
                      <span className="text-slate-550 text-slate-400 font-medium">Daily Storage Rate Increase</span>
                      <span className="font-extrabold text-[#006b5f]">1.42 GB</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-400 font-medium">Projected Remaining Scope</span>
                      <span className="font-extrabold text-slate-800">12 Days</span>
                    </div>
                    <div className="flex justify-between items-center py-2 last:pb-0">
                      <span className="text-slate-400 font-medium">Media Retention Duration</span>
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded text-[10px]">7 Years Vault</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Quota alerts breakdown side array & table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Category table */}
              <div className="lg:col-span-8 bg-white border border-line rounded-2xl overflow-hidden flex flex-col">
                <div className="px-6 py-4.5 border-b border-slate-150 flex justify-between items-center bg-slate-50/10">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Usage Breakdown by Category</h3>
                  <button onClick={() => triggerToast("Fully expanded granular telemetry logs loaded.")} className="text-[#006b5f] hover:text-[#005047] font-bold text-xs hover:underline cursor-pointer">
                    View Granular Logs
                  </button>
                </div>

                <div className="overflow-x-auto whitespace-nowrap">
                  <table className="w-full text-left text-xs font-sans bg-white">
                    <thead className="bg-slate-50 font-bold uppercase tracking-wider text-[10px] text-slate-400 border-b border-line">
                      <tr>
                        <th className="px-6 py-4">Resource Category</th>
                        <th className="px-6 py-4">Units Used (Last {usagePeriod} Days)</th>
                        <th className="px-6 py-4">Sizing Meter</th>
                        <th className="px-6 py-4 text-right">Pro-rated Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/70 text-slate-700">
                      
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4.5 font-bold flex items-center gap-2.5">
                          <Zap className="h-4 w-4 text-[#006b5f]" />
                          <span>Core Portal API Synchronizations</span>
                        </td>
                        <td className="px-6 py-4.5 font-mono font-bold">{Math.round(284120 * metricMultiplier).toLocaleString()}</td>
                        <td className="px-6 py-4.5 text-slate-400 font-semibold">GET/POST Routes</td>
                        <td className="px-6 py-4.5 text-right font-extrabold text-[#006b5f]">
                          $0.00 <span className="text-[9px] font-normal text-slate-450 ml-1">(Incl. Plan)</span>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4.5 font-bold flex items-center gap-2.5">
                          <Activity className="h-4 w-4 text-emerald-500" />
                          <span>External Identity Provider syncs</span>
                        </td>
                        <td className="px-6 py-4.5 font-mono font-bold">{Math.round(92400 * metricMultiplier).toLocaleString()}</td>
                        <td className="px-6 py-4.5 text-slate-400 font-semibold">Metadata Eventsons</td>
                        <td className="px-6 py-4.5 text-right font-extrabold text-[#006b5f]">
                          $0.00 <span className="text-[9px] font-normal text-slate-450 ml-1">(Incl. Plan)</span>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4.5 font-bold flex items-center gap-2.5">
                          <Database className="h-4 w-4 text-indigo-500" />
                          <span>Secured media record documents uploads</span>
                        </td>
                        <td className="px-6 py-4.5 font-mono font-bold">12.5 GB</td>
                        <td className="px-6 py-4.5 text-slate-400 font-semibold">Encrypted S3</td>
                        <td className="px-6 py-4.5 text-right font-extrabold text-slate-800">$14.50</td>
                      </tr>

                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4.5 font-bold flex items-center gap-2.5">
                          <Video className="h-4 w-4 text-amber-500" />
                          <span>Interactive transcript meeting uploads</span>
                        </td>
                        <td className="px-6 py-4.5 font-mono font-bold">450 Hours</td>
                        <td className="px-6 py-4.5 text-slate-400 font-semibold">Transcribed Voice</td>
                        <td className="px-6 py-4.5 text-right font-extrabold text-slate-800">$22.00</td>
                      </tr>

                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4.5 font-bold flex items-center gap-2.5">
                          <Layers className="h-4 w-4 text-teal-500" />
                          <span>Custom generated analytics digests</span>
                        </td>
                        <td className="px-6 py-4.5 font-mono font-bold">38 Charts</td>
                        <td className="px-6 py-4.5 text-slate-400 font-semibold">D3 Exports</td>
                        <td className="px-6 py-4.5 text-right font-extrabold text-[#006b5f]">
                          $0.00 <span className="text-[9px] font-normal text-slate-450 ml-1">(Incl. Plan)</span>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>

              {/* Alerts sidebar widget & tips (Span 4) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Simulated alerts toggle row */}
                <div className="bg-[#e8e2d4] rounded-2xl p-6 border border-[#cbc6b9] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#49473d] text-white flex items-center justify-center rounded-xl">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1d1c13] text-sm leading-normal">System Quota Alerts</h3>
                      <p className="text-[10px] text-[#49473d] font-semibold uppercase tracking-wider">Meters guardrail switches</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#49473d] leading-normal font-medium">
                    Configure notifications when computational limits touch defined boundaries.
                  </p>

                  <div className="space-y-3 pt-2">
                    
                    {/* API toggle */}
                    <div className="flex items-center justify-between p-3.5 bg-white/50 rounded-xl border border-[#cbc6b9]/40">
                      <div>
                        <p className="text-xs font-bold text-slate-800">API capacity (80%)</p>
                        <p className="text-[10px] text-slate-450 text-slate-500 font-semibold uppercase tracking-wider">Email to admin</p>
                      </div>
                      <button 
                        onClick={() => { setAlertApi(!alertApi); triggerToast(`API capacity (80%) rule alert ${!alertApi ? "activated" : "disabled"}!`) }}
                        className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${alertApi ? "bg-[#006b5f]" : "bg-slate-300"}`}
                      >
                        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${alertApi ? "translate-x-5" : ""}`} />
                      </button>
                    </div>

                    {/* Storage toggle */}
                    <div className="flex items-center justify-between p-3.5 bg-white/50 rounded-xl border border-[#cbc6b9]/40">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Storage Critical (90%)</p>
                        <p className="text-[10px] text-slate-450 text-slate-500 font-semibold uppercase tracking-wider">SMS to IT Manager</p>
                      </div>
                      <button 
                        onClick={() => { setAlertStorage(!alertStorage); triggerToast(`Storage critical (90%) rule alert ${!alertStorage ? "activated" : "disabled"}!`) }}
                        className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${alertStorage ? "bg-[#006b5f]" : "bg-slate-300"}`}
                      >
                        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${alertStorage ? "translate-x-5" : ""}`} />
                      </button>
                    </div>

                    {/* Custom alerts live array */}
                    {customAlerts.map((alertItem, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-white/60 rounded-xl border border-[#cbc6b9]/40 animate-fade-in">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{alertItem}</p>
                          <p className="text-[10px] text-slate-450 text-slate-500 font-semibold uppercase tracking-wider">Push alerts rules</p>
                        </div>
                        <button 
                          onClick={() => {
                            setCustomAlerts(customAlerts.filter((_, i) => i !== idx))
                            triggerToast(`Removed active watcher: "${alertItem}"`)
                          }}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    <button 
                      onClick={addNewAlert}
                      className="w-full mt-2 py-3 border-2 border-dashed border-[#49473d]/20 text-[#1d1c13] hover:text-[#006b5f] font-bold text-xs rounded-xl hover:bg-white/30 hover:border-[#006b5f]/50 transition-colors cursor-pointer"
                    >
                      + Add New alert Threshold
                    </button>
                  </div>
                </div>

                {/* Optimization card panel */}
                <div className="bg-white border-2 border-[#5cdac7] rounded-xl p-5 shadow-xs flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Sparkles className="h-5 w-5 text-teal-500 animate-pulse" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#006b5f]">Optimization Advice</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal font-medium">
                    {automationConfigured 
                      ? "Cleanup automation schedule configured successfully. Archival scripts run weekly." 
                      : "Large obsolete document folders detected in \"Cold Archive\". Configure automatic archival to easily reclaim 12.5 GB of secure database quota."
                    }
                  </p>
                  {!automationConfigured ? (
                    <button 
                      onClick={() => { setAutomationConfigured(true); triggerToast("Obsolete media archiving routines activated automatically!") }}
                      className="text-[#006b5f] hover:text-[#005047] font-bold text-xs flex items-center gap-1 group mt-1 cursor-pointer"
                    >
                      Configure Automation
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <span className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider inline-flex items-center gap-1 mt-1">
                      ✓ Automation Active
                    </span>
                  )}
                </div>

              </div>

            </div>

            {/* Mesh banner photo element inspired by provided layout */}
            <div className="mt-8 rounded-2xl overflow-hidden h-64 relative border border-line">
              <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80" 
                alt="HQ Business Workstations Analytics" 
                className="w-full h-full object-cover select-none pointer-events-none brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#006b5f]/95 to-transparent flex flex-col justify-center px-8 sm:px-12 text-white">
                <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-[#5cdac7] mb-2">Enterprise Telemetries</span>
                <h3 className="text-xl sm:text-2xl font-black max-w-sm tracking-tight leading-none">Precision HR Analytics at your fingertips.</h3>
                <p className="text-xs max-w-xs mt-3 opacity-90 font-medium leading-relaxed">
                  Real-time storage capacities, access events logging, and seat growth insights to assist you scale elegantly.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ----------------- SUB-SCREEN 2: CHANGE SUBSCRIPTION (PRICING GRID) ----------------- */}
        {activeView === "subscription" && (
          <div className="space-y-8 animate-fade-in duration-200">
            
            {/* Header section backing controls */}
            <div className="border-b border-line pb-6 flex flex-col gap-2">
              <button 
                onClick={() => setActiveView("billing")}
                className="flex items-center text-[#006b5f] hover:text-[#005047] font-bold text-xs gap-1.5 self-start hover:-translate-x-1 transition-transform cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Billing Accounts
              </button>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Change Subscription</h2>
              <p className="text-sm text-slate-500 font-medium">
                Choose the perfect automated plan match for your organization's administrative scale and operations.
              </p>
            </div>

            {/* 3 Pricing Plans Bento Grid comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
              
              {/* Category card 1: BASIC PLAN */}
              <div 
                className={`bg-white rounded-2xl border p-8 flex flex-col justify-between transition-all hover: ${
                  isBasic 
                    ? "border-2 border-[#006b5f] ring-4 ring-teal-500/10 relative overflow-hidden" 
                    : "border-line"
                }`}
              >
                {isBasic && (
                  <div className="absolute top-0 right-0 bg-[#006b5f] text-white text-[9px] font-black px-4.5 py-1.5 uppercase tracking-widest rounded-bl-xl">
                    Current Plan
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest block mb-2">TeamHub Basic</span>
                    <div className="flex items-baseline mb-2">
                      <span className="text-4xl font-black text-slate-900 font-mono">$49</span>
                      <span className="text-slate-450 font-semibold text-xs ml-1.5">/ month</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Essential automation resources for bootstrap teams managing fundamental payroll & directories.
                    </p>
                  </div>

                  <hr className="border-line" />

                  {/* Checklist of parameters */}
                  <div className="space-y-3.5 text-xs font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-[#006b5f] shrink-0" />
                      <span>Up to 50 active employee slots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-[#006b5f] shrink-0" />
                      <span>Standard reports & PDF exporting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-[#006b5f] shrink-0" />
                      <span>Core Slack Integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-[#006b5f] shrink-0" />
                      <span>24/5 Shared email ticket assistance</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50">
                  <button 
                    disabled={isBasic}
                    onClick={() => handlePlanChange("basic")}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold text-center transition-all ${
                      isBasic 
                        ? "bg-[#d4e7d8] text-[#004941] font-extrabold cursor-default opacity-80" 
                        : "border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-700 active:scale-97 cursor-pointer"
                    }`}
                  >
                    {isBasic ? "Active Subscription" : "Downgrade to Basic"}
                  </button>
                </div>
              </div>

              {/* Category card 2: PRO PLAN (Selected default current plan) */}
              <div 
                className={`bg-white rounded-2xl border p-8 flex flex-col justify-between transition-all hover:shadow-xl relative ${
                  isPro 
                    ? "border-2 border-[#006b5f] ring-4 ring-[#006b5f]/10 shadow-lg transform lg:scale-[1.03]" 
                    : "border-line"
                }`}
              >
                {/* Popular badges on high-conversion item */}
                <div className="absolute top-0 right-0 flex items-center gap-1.5">
                  <span className="bg-teal-500 text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-widest font-mono rounded-bl-xl">
                    POPULAR Choice
                  </span>
                  {isPro && (
                    <span className="bg-[#006b5f] text-white text-[9px] font-black px-3.5 py-1.5 uppercase tracking-widest rounded-bl-xl">
                      Current Plan
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-black uppercase text-[#006b5f] tracking-widest block mb-2">TeamHub Pro</span>
                    <div className="flex items-baseline mb-2">
                      <span className="text-4xl font-black text-slate-900 font-mono">$99</span>
                      <span className="text-slate-450 font-semibold text-xs ml-1.5">/ month</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Advanced reporting dashboards, higher active member caps, and extended database quotas for growing enterprises.
                    </p>
                  </div>

                  <hr className="border-line" />

                  {/* Checklist */}
                  <div className="space-y-3.5 text-xs font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-[#006b5f] shrink-0" />
                      <span className="font-bold text-slate-950">Up to 250 active employee slots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-[#006b5f] shrink-0" />
                      <span className="font-bold text-slate-950">Deep detailed utilization reporting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-[#006b5f] shrink-0" />
                      <span className="font-bold text-slate-950">Advanced integrations & workspace sync</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-[#006b5f] shrink-0" />
                      <span className="font-bold text-slate-950">50 GB Secure document archive vault</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-[#006b5f] shrink-0" />
                      <span className="font-bold text-slate-950">Priority email & live chat assistance (24/7)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50">
                  <button 
                    disabled={isPro}
                    onClick={() => handlePlanChange("pro")}
                    className={`w-full py-4 px-5 rounded-xl text-xs font-black text-center active:scale-97 transition-all ${
                      isPro 
                        ? "bg-[#d4e7d8] text-[#004941] cursor-default opacity-80 shadow-none border-none" 
                        : "bg-[#006b5f] hover:bg-[#005047] text-white cursor-pointer"
                    }`}
                  >
                    {isPro ? "Active Subscription" : "Upgrade to Pro"}
                  </button>
                </div>
              </div>

              {/* Category card 3: ENTERPRISE PLAN */}
              <div 
                className={`bg-white rounded-2xl border p-8 flex flex-col justify-between transition-all hover: ${
                  isEnterprise 
                    ? "border-2 border-[#006b5f] ring-4 ring-teal-500/10 relative overflow-hidden" 
                    : "border-line"
                }`}
              >
                {isEnterprise && (
                  <div className="absolute top-0 right-0 bg-[#006b5f] text-white text-[9px] font-black px-4.5 py-1.5 uppercase tracking-widest rounded-bl-xl">
                    Current Plan
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest block mb-1">TeamHub Enterprise</span>
                    <div className="flex items-baseline mb-2">
                      <span className="text-3xl font-black text-slate-900 font-sans">Contact Sales</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Infinite organizational slots, custom compliance keys gateway, dedicated servers support, and customized SLA.
                    </p>
                  </div>

                  <hr className="border-line" />

                  {/* Checklist */}
                  <div className="space-y-3.5 text-xs font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-[#006b5f] shrink-0" />
                      <span>Unlimited employees directory slots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-[#006b5f] shrink-0" />
                      <span>Sovereign localized cloud storage (500 GB+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-[#006b5f] shrink-0" />
                      <span>Custom API & SAML SSO configuration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-[#006b5f] shrink-0" />
                      <span>Dedicated Account Manager & SLA uptime support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 text-[#006b5f] shrink-0" />
                      <span className="font-bold text-[#0D9488]">Advanced Compliance Vaults</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-150">
                  <button 
                    onClick={() => {
                      alert("Opening corporate portal connection for customized contract quote. Our accounts team will contact you securely in 1 hour.")
                      triggerToast("Enterprise customization request logged with representative account directors.")
                    }}
                    className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold text-center transition-all active:scale-97 cursor-pointer"
                  >
                    Request Enterprise Quote
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom auxiliary terms banner */}
            <footer className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800">Need specific custom quotes?</h4>
                <p className="text-slate-400 mt-0.5 leading-normal font-semibold">
                  We provide volume discounts for high density entities over 1,000 employees.
                </p>
              </div>
              <div className="flex gap-4 font-bold text-[#006b5f]">
                <a href="#tos" onClick={(e) => { e.preventDefault(); alert("Displaying TeamHub Subscription Service Agreement Terms of Service.") }} className="hover:underline">Read Terms of Service</a>
                <span className="text-slate-300">|</span>
                <a href="#refund" onClick={(e) => { e.preventDefault(); alert("TeamHub Pro-rated Refund and Downgrade Policy details.") }} className="hover:underline">Refund Policy Guidelines</a>
              </div>
            </footer>

          </div>
        )}

      </div>

      {/* ----------------- PAYMENT METHOD MODAL (SCREEN 6) ----------------- */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop screen filter click blocker */}
          <div 
            onClick={() => setShowAddCardModal(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
          />

          {/* Modal popup element window */}
          <div className="relative bg-white w-full max-w-md rounded-2xl border border-line shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10 flex flex-col font-sans">
            
            {/* Header layout */}
            <div className="px-6 py-5 border-b border-line bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Add Payment Method</h3>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">Secure payment card setup</p>
              </div>
              <button 
                onClick={() => setShowAddCardModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Input form contents */}
            <form onSubmit={handleAddCardSubmit} className="p-6 space-y-4">
              
              {/* Card holder name check */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Cardholder Name</label>
                <input 
                  type="text" 
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-slate-50 border border-slate-200 hover:border-teal-500/50 focus:border-teal-500 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition-all shadow-3xs"
                  required
                />
              </div>

              {/* Secure Credit Card Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Credit Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                  <input 
                    type="text" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4412"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-teal-500/50 focus:border-teal-500 rounded-xl pl-11 pr-4 py-2.5 text-sm font-bold font-mono text-slate-800 outline-none transition-all shadow-3xs"
                    required
                  />
                </div>
              </div>

              {/* Expiry dates vs CSV row split layout */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* MM/YY expiry */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Expiration (MM/YY)</label>
                  <input 
                    type="text" 
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/27"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-teal-500/50 focus:border-teal-500 rounded-xl px-4 py-2.5 text-sm font-bold font-mono text-slate-800 outline-none shadow-3xs"
                    required
                  />
                </div>

                {/* CVV Security PIN code */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">CVV Security Code</label>
                  <input 
                    type="password" 
                    maxLength={4}
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value)}
                    placeholder="•••"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-teal-500/50 focus:border-teal-500 rounded-xl px-4 py-2.5 text-sm font-bold font-mono text-slate-800 outline-none shadow-3xs"
                    required
                  />
                </div>

              </div>

              {/* ZIP Postal values location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Billing ZIP / Postal Code</label>
                <input 
                  type="text" 
                  value={cardZip}
                  onChange={(e) => setCardZip(e.target.value)}
                  placeholder="94105"
                  className="w-full bg-slate-50 border border-slate-200 hover:border-teal-500/50 focus:border-teal-500 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none shadow-3xs"
                  required
                />
              </div>

              {/* Set Default payment check option label toggle */}
              <label className="flex items-center gap-3 py-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={isDefaultCheckbox}
                  onChange={(e) => setIsDefaultCheckbox(e.target.checked)}
                  className="rounded text-[#006b5f] focus:ring-[#006b5f] h-4.5 w-4.5 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-600">Set as primary default payment credential</span>
              </label>

              {/* Shield validation lock label block */}
              <div className="bg-slate-50 p-4 border border-line rounded-2xl flex items-center gap-3">
                <Lock className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                <p className="text-[11px] text-slate-500 leading-normal font-semibold">
                  PCI-DSS Bank-grade 256-bit encryption safeguards credentials. Zero authorization risk of logs representation.
                </p>
              </div>

              {/* Modals trigger close saving footer buttons row */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-line bg-slate-50/50 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl">
                <button 
                  type="button" 
                  onClick={() => setShowAddCardModal(false)}
                  className="px-4.5 py-2 hover:bg-slate-150 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5.5 py-2 bg-[#006b5f] text-white hover:bg-[#005047] rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save Card
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ----------------- PLAN DETAILS & USAGE MODAL ----------------- */}
      {showManagePlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop screen filter click blocker */}
          <div 
            onClick={() => setShowManagePlanModal(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl border border-line shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10 flex flex-col font-sans">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-line bg-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#006b5f] tracking-tight">Plan Details & Usage</h3>
                <p className="text-xs text-slate-500 font-medium">Review your enterprise subscription and resource consumption</p>
              </div>
              <button 
                onClick={() => setShowManagePlanModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Plan Summary & Features (col-span-12 to col-span-5) */}
                <div className="lg:col-span-5 space-y-6 flex flex-col">
                  {/* Plan Card */}
                  <div className="bg-[#d4e7d8] p-6 rounded-xl border border-[#006b5f]/10 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="bg-[#006b5f] text-white px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest mb-2.5 inline-block">
                          CURRENT PLAN
                        </span>
                        <h4 className="text-2xl font-black text-[#191c1d] tracking-tight leading-none">
                          {isPro ? "Enterprise Pro" : isBasic ? "TeamHub Basic" : "Enterprise Tonal"}
                        </h4>
                      </div>
                      <Shield className="h-8 w-8 text-[#006b5f] shrink-0" />
                    </div>
                    
                    <p className="text-xs font-medium text-[#3a4b40] leading-relaxed mb-6">
                      Comprehensive HR suite for scaling organizations with advanced compliance and global payroll.
                    </p>
                    
                    <div className="flex items-center gap-1.5 text-[#3a4b40] font-bold text-xs mt-auto">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>Next renewal: Nov 24, 2025</span>
                    </div>
                  </div>

                  {/* Included Features List */}
                  <div className="bg-white border border-line rounded-xl p-6 shadow-3xs space-y-4">
                    <h5 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-[#006b5f]" />
                      Included Features
                    </h5>
                    
                    <ul className="space-y-4">
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#006b5f] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Unlimited Employees</p>
                          <p className="text-[10px] text-slate-400 font-semibold leading-normal">No per-seat limitations for your growing team</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#006b5f] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Advanced Analytics</p>
                          <p className="text-[10px] text-slate-400 font-semibold leading-normal">Predictive turnover and labor cost forecasting</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#006b5f] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Full API Access</p>
                          <p className="text-[10px] text-slate-400 font-semibold leading-normal">Integrate with ERP and custom internal tools</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#006b5f] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Priority Support 24/7</p>
                          <p className="text-[10px] text-slate-400 font-semibold leading-normal">Dedicated account manager and tech support</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right Column: Usage Meters (col-span-12 to col-span-7) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white border border-line rounded-xl p-6 shadow-3xs space-y-6">
                    <h5 className="font-bold text-sm text-slate-800">Current Usage</h5>
                    
                    <div className="space-y-5">
                      {/* Meter 1: Active Employees */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-750">Monthly Active Employees</span>
                          <span className="font-extrabold text-[#006b5f]">1,240 <span className="text-slate-400 font-medium">/ Unlimited</span></span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#006b5f] rounded-full transition-all duration-500" style={{ width: "45%" }} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Active seats across all regional departments</p>
                      </div>

                      {/* Meter 2: Secure Doc Storage */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-755">Secure Document Storage</span>
                          <span className="font-extrabold text-[#006b5f]">84.2 GB <span className="text-slate-400 font-medium">/ 100 GB</span></span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#006b5f] rounded-full transition-all duration-500" style={{ width: "84.2%" }} />
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <p className="text-slate-400 font-semibold">Approaching storage limit</p>
                          <button 
                            type="button" 
                            onClick={() => { setShowManagePlanModal(false); triggerToast("Obsoletes archiving routines activated automatically to release space!") }}
                            className="text-[#006b5f] font-extrabold hover:underline"
                          >
                            UPGRADE STORAGE
                          </button>
                        </div>
                      </div>

                      {/* Meter 3: API Calls */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-760">API Calls (Monthly)</span>
                          <span className="font-extrabold text-[#006b5f]">412k <span className="text-slate-400 font-medium">/ 1M</span></span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#006b5f] rounded-full transition-all duration-500" style={{ width: "41.2%" }} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Resets on Nov 24, 2025</p>
                      </div>
                    </div>

                    {/* Additional Perks Bento */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-4 bg-[#e8e2d4]/50 rounded-xl flex flex-col items-center text-center border border-[#cbc6b9]/40">
                        <Shield className="h-5 w-5 text-[#49473d] mb-1.5 shrink-0" />
                        <p className="text-[11px] font-black text-[#1d1c13]">Compliance Vault</p>
                        <p className="text-[10px] text-slate-500 font-semibold leading-normal mt-0.5">Active</p>
                      </div>
                      <div className="p-4 bg-[#d4e7d8]/50 rounded-xl flex flex-col items-center text-center border border-[#bbc9c5]/40">
                        <Globe className="h-5 w-5 text-[#57685d] mb-1.5 shrink-0" />
                        <p className="text-[11px] font-black text-slate-800">Global Taxing</p>
                        <p className="text-[10px] text-slate-500 font-semibold leading-normal mt-0.5">12 Regions</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Billing Info Short Card */}
              <div className="bg-slate-100 border border-slate-200/60 p-4 rounded-xl flex items-center justify-between shadow-3xs">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
                    <CreditCard className="h-5 w-5 text-[#006b5f]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Mastercard ending in 4412</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Default billing method</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => { setShowManagePlanModal(false); setShowAddCardModal(true); }}
                  className="text-[#006b5f] font-bold text-xs hover:underline cursor-pointer"
                >
                  Manage
                </button>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-line bg-white flex justify-end gap-3 rounded-b-2xl">
              <button 
                type="button" 
                onClick={() => setShowManagePlanModal(false)}
                className="px-5 py-2.5 border border-slate-250 hover:border-slate-350 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-3xs hover:shadow-2xs"
              >
                Dismiss
              </button>
              <button 
                type="button" 
                onClick={() => { setShowManagePlanModal(false); setActiveView("subscription"); }}
                className="px-5 py-2.5 bg-[#006b5f] text-white rounded-xl text-xs font-black hover:bg-[#005047] transition-all cursor-pointer shadow-teal-650/10"
              >
                Change Subscription
              </button>
            </div>
          </div>
        </div>
      )}

    </AppLayout>
  )
}
