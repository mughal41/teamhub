import * as React from "react"
import { useState, useMemo } from "react"
import { AppLayout } from "../components/layout/AppLayout"
import { 
  FileText, 
  Image as ImageIcon, 
  FileSpreadsheet, 
  Download, 
  Trash2, 
  RefreshCw, 
  Plus, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Upload, 
  Search, 
  X, 
  ChevronDown, 
  Database,
  Grid,
  Lock,
  PlusCircle,
  HelpCircle
} from "lucide-react"

interface DocumentItem {
  id: string
  name: string
  type: "Contracts" | "Tax & Financial" | "Certifications"
  tag: string
  date: string
  status: "Verified" | "Pending Verification" | "Expiring Soon"
  sizeMB: number // size in MB for dynamic storage calculations
}

interface ActivityItem {
  id: string
  action: string
  time: string
  icon: "verified" | "cloud_upload" | "trash"
}

interface QueuedFile {
  id: string
  originalFilename: string
  title: string
  employee: string
  description: string
  tags: string[]
  internalOnly: boolean
  category: "Contracts" | "Tax & Financial" | "Certifications"
}

export default function PersonalDocumentsPage() {
  // Hardcoded initial data synced to local storage
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem("db_personal_documents")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (err) {
        // Fallback
      }
    }
    
    // Initial Seed
    const initial: DocumentItem[] = [
      {
        id: "doc-1",
        name: "Employment_Agreement_2024.pdf",
        type: "Contracts",
        tag: "Legal",
        date: "Jan 12, 2024",
        status: "Verified",
        sizeMB: 840 // representing MBs in stats to scale correctly
      },
      {
        id: "doc-2",
        name: "Passport_ID_Scan.jpg",
        type: "Certifications",
        tag: "Identification",
        date: "May 05, 2024",
        status: "Pending Verification",
        sizeMB: 120
      },
      {
        id: "doc-3",
        name: "Work_Visa_2024.pdf",
        type: "Contracts",
        tag: "Legal",
        date: "Exp. Jul 20, 2024",
        status: "Expiring Soon",
        sizeMB: 60
      },
      {
        id: "doc-4",
        name: "Tax_Declaration_Q1.xlsx",
        type: "Tax & Financial",
        tag: "Tax",
        date: "Apr 15, 2024",
        status: "Verified",
        sizeMB: 240
      }
    ]
    localStorage.setItem("db_personal_documents", JSON.stringify(initial))
    return initial
  })

  // Dynamic Recent Activity Log
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem("db_personal_documents_activity")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (err) {
        // Fallback
      }
    }
    const initial: ActivityItem[] = [
      {
        id: "act-1",
        action: "Contract Verified",
        time: "2 hours ago",
        icon: "verified"
      },
      {
        id: "act-2",
        action: "Tax_Declaration_Q1.xlsx uploaded",
        time: "Yesterday, 4:30 PM",
        icon: "cloud_upload"
      }
    ]
    localStorage.setItem("db_personal_documents_activity", JSON.stringify(initial))
    return initial
  })

  // Toggle state to shift between Explorer Page and new Upload Screen Page
  const [isUploadPageActive, setIsUploadPageActive] = useState(false)

  // Pre-seed & customizable list of Queued Files for the Upload & Manage workspace
  const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([
    {
      id: "q-1",
      originalFilename: "Employment_Contract_Mason_2024.pdf",
      title: "Q1 Employment Contract - Olivia Mason",
      employee: "Olivia Mason",
      description: "Signed permanent contract for the Senior Marketing position starting April 2024.",
      tags: ["Contract", "Legal"],
      internalOnly: true,
      category: "Contracts"
    },
    {
      id: "q-2",
      originalFilename: "Identity_Proof_Verification.jpg",
      title: "Identity Proof Verification",
      employee: "Admin User",
      description: "Government-issued passport copy for identification check.",
      tags: ["ID", "Identification"],
      internalOnly: false,
      category: "Certifications"
    }
  ])

  // New tag addition input fields
  const [activeTagInputId, setActiveTagInputId] = useState<string | null>(null)
  const [newTagText, setNewTagText] = useState("")

  // List of employees for searchable selection dropdown
  const [employeesList] = useState<any[]>(() => {
    const saved = localStorage.getItem("db_employees")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (err) {
        // Fallback
      }
    }
    return [
      { id: "EMP-0419", name: "Olivia Mason", role: "Marketing Executive", dept: "Marketing" },
      { id: "EMP-0420", name: "Alex Rivera", role: "UI/UX Designer", dept: "R&D" },
      { id: "EMP-0421", name: "Liam Carter", role: "Lead Engineer", dept: "R&D" },
      { id: "EMP-0422", name: "Sophia Martinez", role: "HR Specialist", dept: "Human Resources" },
      { id: "EMP-0423", name: "Jackson Davis", role: "DevOps Engineer", dept: "Operations" },
      { id: "EMP-0424", name: "Emma Wilson", role: "Customer Success Officer", dept: "Customer Service" },
      { id: "EMP-0425", name: "Michael Chen", role: "Senior Developer", dept: "R&D" },
      { id: "EMP-0426", name: "Sarah Jenkins", role: "Product Manager", dept: "Product Design" }
    ]
  })

  // State to track active dropdown and search query inside active dropdown
  const [activeEmployeeDropdownId, setActiveEmployeeDropdownId] = useState<string | null>(null)
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("")

  // State parameters
  const [selectedTab, setSelectedTab] = useState<"All Documents" | "Contracts" | "Tax & Financial" | "Certifications">("All Documents")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"All" | "Verified" | "Pending Verification" | "Expiring Soon">("All")
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false)

  // Toast alert parameters
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)

  // Write state modifications back to local storage
  const saveDocsToLocalStorage = (updatedDocs: DocumentItem[]) => {
    localStorage.setItem("db_personal_documents", JSON.stringify(updatedDocs))
    setDocuments(updatedDocs)
  }

  const saveActivitiesToLocalStorage = (updatedActivities: ActivityItem[]) => {
    localStorage.setItem("db_personal_documents_activity", JSON.stringify(updatedActivities))
    setActivities(updatedActivities)
  }

  // Trigger positive toast notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  // File system simulated input click action
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const extension = file.name.split(".").pop()?.toLowerCase() || "pdf"
      const category: "Contracts" | "Tax & Financial" | "Certifications" = 
        ["pdf", "docx", "doc"].includes(extension) ? "Contracts" :
        ["xlsx", "xls", "csv"].includes(extension) ? "Tax & Financial" : "Certifications"

      const newQueued: QueuedFile = {
        id: `q-${Date.now()}`,
        originalFilename: file.name,
        title: file.name.split('.').slice(0, -1).join('.') || file.name,
        employee: "Alex Rivera",
        description: `Imported through browser local folder directory.`,
        tags: [category === "Contracts" ? "Contract" : category === "Tax & Financial" ? "Tax" : "ID"],
        internalOnly: false,
        category: category
      }

      setQueuedFiles(prev => [...prev, newQueued])
      triggerToast(`Successfully added "${file.name}" to queue.`)
    }
  }

  // Handle remove from queue
  const handleRemoveFromQueue = (id: string, name: string) => {
    setQueuedFiles(prev => prev.filter(q => q.id !== id))
    triggerToast(`Removed "${name}" from upload queue.`)
  }

  // Clear all items on the queue
  const handleClearQueue = () => {
    setQueuedFiles([])
    triggerToast("Cleared all files from the queue.")
  }

  // Update specific fields of a queue record
  const updateQueuedField = (id: string, field: keyof QueuedFile, value: any) => {
    setQueuedFiles(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value }
      }
      return item
    }))
  }

  // Interactive tag removal handling
  const removeTag = (id: string, tagToRemove: string) => {
    setQueuedFiles(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, tags: item.tags.filter(t => t !== tagToRemove) }
      }
      return item
    }))
  }

  // Interactive tag addition submission
  const handleAddTagSubmit = (id: string) => {
    if (!newTagText.trim()) {
      setActiveTagInputId(null)
      return
    }
    setQueuedFiles(prev => prev.map(item => {
      if (item.id === id) {
        if (item.tags.includes(newTagText.trim())) return item
        return { ...item, tags: [...item.tags, newTagText.trim()] }
      }
      return item
    }))
    setNewTagText("")
    setActiveTagInputId(null)
    triggerToast("Tag added.")
  }

  // Trigger committing all queued elements to the general vault
  const handleCommitFinishUpload = () => {
    if (queuedFiles.length === 0) {
      triggerToast("No documents currently listed in the upload queue.")
      return
    }

    // Convert keys to standard documents schemas
    const newCommitedDocs: DocumentItem[] = queuedFiles.map(q => {
      const ext = q.originalFilename.split(".").pop() || "pdf"
      // Clean target name
      let finalName = q.title.trim()
      if (!finalName.toLowerCase().endsWith("." + ext)) {
        finalName += "." + ext
      }
      return {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: finalName,
        type: q.category,
        tag: q.tags[0] || (q.category === "Contracts" ? "Legal" : q.category === "Tax & Financial" ? "Tax" : "Identification"),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        status: "Pending Verification",
        sizeMB: q.category === "Contracts" ? 45 : q.category === "Tax & Financial" ? 15 : 10
      }
    })

    const updatedDocuments = [...newCommitedDocs, ...documents]
    saveDocsToLocalStorage(updatedDocuments)

    // Log tracking activities
    const newActivityEvents: ActivityItem[] = queuedFiles.map(q => ({
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      action: `${q.originalFilename} uploaded`,
      time: "Just now",
      icon: "cloud_upload"
    }))

    const updatedActivities = [...newActivityEvents, ...activities]
    saveActivitiesToLocalStorage(updatedActivities)

    // Clear and redirect state
    setQueuedFiles([])
    setIsUploadPageActive(false)
    triggerToast(`Finished! ${newCommitedDocs.length} items logged to Secure Cloud Vault.`)
  }

  // Handle document deletion on main explorer screen
  const handleDeleteDocument = (id: string, name: string) => {
    const updatedDocs = documents.filter(doc => doc.id !== id)
    saveDocsToLocalStorage(updatedDocs)

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      action: `Deleted ${name}`,
      time: "Just now",
      icon: "trash"
    }
    const updatedActivities = [newActivity, ...activities]
    saveActivitiesToLocalStorage(updatedActivities)

    triggerToast(`"${name}" has been deleted.`)
  }

  // Handle simulation download
  const handleDownload = (name: string) => {
    triggerToast(`Initiated secure download for ${name}...`)
  }

  // Handle simulation verification status upgrade
  const handleVerifyToggle = (id: string, name: string) => {
    const updatedDocs = documents.map(doc => {
      if (doc.id === id) {
        const nextStatus = 
          doc.status === "Pending Verification" ? "Verified" :
          doc.status === "Verified" ? "Expiring Soon" : "Pending Verification"
        return {
          ...doc,
          status: nextStatus as any
        }
      }
      return doc
    })
    saveDocsToLocalStorage(updatedDocs)
    triggerToast(`Updated status verify trigger for ${name}.`)
  }

  // Calculate Storage Stats dynamically
  const maxStorageMB = 2000 // 2.0 GB in MBs
  
  const statsByType = useMemo(() => {
    let contracts = 0
    let identification = 0
    let tax = 0

    documents.forEach(doc => {
      if (doc.type === "Contracts") {
        contracts += doc.sizeMB
      } else if (doc.type === "Certifications") {
        identification += doc.sizeMB
      } else if (doc.type === "Tax & Financial") {
        tax += doc.sizeMB
      }
    })

    const total = contracts + identification + tax
    const percentage = Math.min(Math.round((total / maxStorageMB) * 100), 100)

    return {
      contracts,
      identification,
      tax,
      total,
      percentage
    }
  }, [documents])

  // Filters application computation
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Tab category filter
      if (selectedTab !== "All Documents" && doc.type !== selectedTab) {
        return false
      }
      // Status optional filter dropdown
      if (statusFilter !== "All" && doc.status !== statusFilter) {
        return false
      }
      // Text query filter search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return doc.name.toLowerCase().includes(query) || doc.tag.toLowerCase().includes(query)
      }
      return true
    })
  }, [documents, selectedTab, statusFilter, searchQuery])

  // Get icon depending on file format extension name helper
  const getDocumentIcon = (name: string) => {
    const extension = name.split(".").pop()?.toLowerCase() || ""
    if (extension === "pdf") {
      return <FileText className="h-6 w-6 text-rose-500" />
    } else if (["xlsx", "xls", "csv"].includes(extension)) {
      return <FileSpreadsheet className="h-6 w-6 text-teal-600" />
    } else if (["jpg", "jpeg", "png", "webp"].includes(extension)) {
      return <ImageIcon className="h-6 w-6 text-amber-500" />
    }
    return <FileText className="h-6 w-6 text-slate-500" />
  }

  return (
    <AppLayout
      title="Personal Documents"
      breadcrumbs={[
        { label: "Settings", href: "/settings/personal-info" },
        { label: "Personal Documents", href: "/settings/personal-documents" },
        ...(isUploadPageActive ? [{ label: "Upload" }] : [])
      ]}
    >
      <div className="mx-auto w-full max-w-7xl pb-20 font-sans relative">
        
        {/* Banner Alert Toast container */}
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-white rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl z-[150] transition-transform duration-500 ease-in-out ${showToast ? "translate-y-0" : "-translate-y-[200%]"}`}>
          <CheckCircle2 className="h-4.5 w-4.5 text-teal-400 shrink-0" />
          <p className="text-xs font-bold tracking-wide">{toastMessage}</p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SCREEN SECTION 1: UPLOAD PAGE WORKSPACE                       */}
        {/* ------------------------------------------------------------- */}
        {isUploadPageActive ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header section */}
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Upload &amp; Manage Documents</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Add new employee contracts, certifications, or legal documents to the secure portal.</p>
            </div>

            {/* Custom Interactive File Drag Drop Zone with integrated standard HTML input trigger */}
            <section>
              <label 
                htmlFor="file-field-uploader"
                className="block text-center rounded-2xl border-2 border-dashed border-[#006b5f]/40 hover:border-[#006b5f] bg-[#d4e7d8]/10 hover:bg-[#d4e7d8]/20 p-12 transition-all cursor-pointer group py-14"
              >
                <div className="mx-auto w-14 h-14 rounded-full bg-[#006b5f]/10 flex items-center justify-center text-[#006b5f] mb-4 group-hover:scale-105 transition-transform">
                  <Upload className="h-7 w-7" />
                </div>
                <h3 className="text-xs font-extrabold text-slate-800 mb-1">
                  Drag and drop files here or <span className="text-[#006b5f] hover:underline">click to browse</span>
                </h3>
                <p className="text-[10px] text-slate-450 text-slate-400 font-medium font-mono">
                  Supported formats: PDF, DOCX, XLSX, JPG, PNG (Max 50MB per file)
                </p>
                <input 
                  type="file" 
                  id="file-field-uploader" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            </section>

            {/* Live Interactive Queue Management */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Queued Files</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#d4e7d8] text-[#005047] text-[10px] font-black">
                    {queuedFiles.length}
                  </span>
                </div>
                {queuedFiles.length > 0 && (
                  <button 
                    type="button" 
                    onClick={handleClearQueue}
                    className="text-xs font-bold text-[#006b5f] hover:underline hover:text-[#005047] cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {queuedFiles.length === 0 ? (
                <div className="border border-slate-100 rounded-2xl p-8 text-center bg-white">
                  <p className="text-xs text-slate-400 font-medium">No files currently queued. Drag &amp; drop files above to prepare transmission.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {queuedFiles.map((qFile) => (
                    <div 
                      key={qFile.id}
                      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:border-[#006b5f]/20 transition-all"
                    >
                      <div className="flex flex-col md:flex-row gap-5">
                        
                        {/* File Visual Icon Container */}
                        <div className="shrink-0 size-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                          {getDocumentIcon(qFile.originalFilename)}
                        </div>

                        {/* Metadata inputs form layout */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Original Name & Actions row */}
                          <div className="md:col-span-2 flex items-start justify-between">
                            <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Original Filename</p>
                              <p className="text-xs font-semibold text-slate-700">{qFile.originalFilename}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFromQueue(qFile.id, qFile.originalFilename)}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete from Queue"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Editable Document Title input */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Document Title</label>
                            <input 
                              type="text"
                              value={qFile.title}
                              onChange={(e) => updateQueuedField(qFile.id, "title", e.target.value)}
                              className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:bg-white outline-none focus:border-[#006b5f] focus:ring-1 focus:ring-[#006b5f] transition-all"
                            />
                          </div>

                          {/* Searchable Dropdown for Employee Assignment field */}
                          <div className="space-y-1 relative">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Employee Assignment</label>
                            
                            {/* Toggle Button styled precisely like input */}
                            <button
                              type="button"
                              onClick={() => {
                                if (activeEmployeeDropdownId === qFile.id) {
                                  setActiveEmployeeDropdownId(null);
                                } else {
                                  setActiveEmployeeDropdownId(qFile.id);
                                  setEmployeeSearchQuery("");
                                }
                              }}
                              className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold hover:bg-slate-100/50 text-left transition-all flex items-center justify-between outline-none focus:ring-1 focus:ring-[#006b5f] focus:border-[#006b5f]"
                            >
                              <span className={qFile.employee ? "text-slate-800" : "text-slate-400"}>
                                {qFile.employee || "Select an employee..."}
                              </span>
                              <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                            </button>

                            {/* Dropdown Menu Popup */}
                            {activeEmployeeDropdownId === qFile.id && (
                              <>
                                {/* Backdrop to close dropdown on click outside */}
                                <div 
                                  className="fixed inset-0 z-[100]" 
                                  onClick={() => setActiveEmployeeDropdownId(null)}
                                />
                                
                                <div className="absolute left-0 right-0 top-18 z-[110] bg-white border border-slate-150 rounded-xl shadow-xl p-2 flex flex-col gap-2 max-h-56 overflow-y-auto min-w-[200px]">
                                  {/* Filter Input inside dropdown header */}
                                  <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                    <input
                                      type="text"
                                      placeholder="Filter employees..."
                                      value={employeeSearchQuery}
                                      onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                                      className="w-full h-8 bg-slate-50 border border-slate-150 rounded-lg pl-8 pr-2 text-xs font-semibold placeholder-slate-450 outline-none focus:border-[#006b5f] focus:ring-1 focus:ring-[#006b5f] transition-all"
                                      autoFocus
                                    />
                                    {employeeSearchQuery && (
                                      <button 
                                        type="button"
                                        onClick={() => setEmployeeSearchQuery("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    )}
                                  </div>

                                  {/* Employee roster options list */}
                                  <div className="flex flex-col gap-0.5 overflow-y-auto max-h-36">
                                    {(() => {
                                      const filtered = employeesList.filter(emp => 
                                        emp.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
                                        (emp.role && emp.role.toLowerCase().includes(employeeSearchQuery.toLowerCase())) ||
                                        (emp.dept && emp.dept.toLowerCase().includes(employeeSearchQuery.toLowerCase()))
                                      );

                                      if (filtered.length === 0) {
                                        return (
                                          <div className="py-3 text-center text-[10px] text-slate-400 font-bold">
                                            No employees match
                                          </div>
                                        );
                                      }

                                      return filtered.map(emp => (
                                        <button
                                          key={emp.id}
                                          type="button"
                                          onClick={() => {
                                            updateQueuedField(qFile.id, "employee", emp.name);
                                            setActiveEmployeeDropdownId(null);
                                            setEmployeeSearchQuery("");
                                          }}
                                          className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex flex-col gap-0.5 hover:bg-[#d4e7d8]/30 ${
                                            qFile.employee === emp.name 
                                              ? "bg-[#d4e7d8]/20 border-l-2 border-[#006b5f]" 
                                              : ""
                                          }`}
                                        >
                                          <span className="text-xs font-bold text-slate-800">{emp.name}</span>
                                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold leading-none">
                                            <span>{emp.role}</span>
                                            {emp.dept && (
                                              <>
                                                <span>•</span>
                                                <span className="text-[9px] uppercase tracking-wider px-1 py-0.2 bg-slate-100 rounded text-slate-500 font-bold">
                                                  {emp.dept}
                                                </span>
                                              </>
                                            )}
                                          </div>
                                        </button>
                                      ));
                                    })()}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Editable Category */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Storage Category</label>
                            <select 
                              value={qFile.category}
                              onChange={(e) => updateQueuedField(qFile.id, "category", e.target.value)}
                              className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:bg-white outline-none focus:border-[#006b5f] focus:ring-1 focus:ring-[#006b5f] transition-all"
                            >
                              <option value="Contracts">Contracts &amp; legal agreements</option>
                              <option value="Tax & Financial">Tax &amp; financial statements</option>
                              <option value="Certifications">Identification &amp; certifications</option>
                            </select>
                          </div>

                          {/* Editable Description placeholder */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Description / Reference Note</label>
                            <input 
                              type="text"
                              value={qFile.description}
                              onChange={(e) => updateQueuedField(qFile.id, "description", e.target.value)}
                              className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:bg-white outline-none focus:border-[#006b5f] focus:ring-1 focus:ring-[#006b5f] transition-all"
                            />
                          </div>

                          {/* Live interactive tags management */}
                          <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Metadata Tags</label>
                            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-55 border bg-slate-50 border-slate-100 rounded-xl min-h-12">
                              {qFile.tags.map(t => (
                                <span 
                                  key={t}
                                  className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-[#d4e7d8] text-[#005047] px-2 py-1 rounded"
                                >
                                  <span>{t}</span>
                                  <button 
                                    type="button" 
                                    onClick={() => removeTag(qFile.id, t)}
                                    className="hover:bg-[#005047]/10 p-0.5 rounded cursor-pointer"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              ))}

                              {/* Tiny tag creation mode inline */}
                              {activeTagInputId === qFile.id ? (
                                <div className="flex items-center gap-1 bg-white border border-[#006b5f]/30 rounded px-1">
                                  <input 
                                    type="text" 
                                    autoFocus
                                    placeholder="Enter tag..."
                                    value={newTagText}
                                    onChange={e => setNewTagText(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddTagSubmit(qFile.id)}
                                    className="h-6 w-20 text-[10px] font-semibold bg-transparent outline-none border-none p-0 focus:ring-0"
                                  />
                                  <button 
                                    type="button" 
                                    onClick={() => handleAddTagSubmit(qFile.id)}
                                    className="p-1 hover:bg-slate-50 text-[#006b5f] rounded"
                                  >
                                    <CheckCircle2 className="h-3 w-3" />
                                  </button>
                                  <button 
                                    type="button" 
                                    onClick={() => setActiveTagInputId(null)}
                                    className="p-1 hover:bg-slate-50 text-slate-400 rounded"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  type="button"
                                  onClick={() => {
                                    setActiveTagInputId(qFile.id)
                                    setNewTagText("")
                                  }}
                                  className="text-[10px] font-extrabold text-[#006b5f] hover:underline px-2 py-1"
                                >
                                  + Add Tag
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Toggle switch for Internal use only */}
                          <div className="md:col-span-2 pt-2 border-t border-slate-50 flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                              <input 
                                type="checkbox" 
                                checked={qFile.internalOnly}
                                onChange={(e) => updateQueuedField(qFile.id, "internalOnly", e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006b5f] relative"></div>
                              <span className="text-xs font-bold text-slate-700 select-none flex items-center gap-1.5">
                                <Lock className="h-3.5 w-3.5 text-slate-400" />
                                <span>Internal HR Use Only</span>
                              </span>
                            </label>

                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                              Validated
                            </span>
                          </div>

                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Sticky/Fixed view Footer parameters */}
            <footer className="border-t border-slate-100 bg-white/80 p-4.5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Database className="h-4 w-4 text-[#006b5f]" />
                <span>Saving to: <strong className="text-slate-700">Secure Cloud Vault</strong></span>
              </span>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsUploadPageActive(false)}
                  className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleCommitFinishUpload}
                  className="px-6 py-2.5 bg-[#006b5f] hover:bg-[#005047] text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-[#006b5f]/15 cursor-pointer"
                >
                  Finish Upload
                </button>
              </div>
            </footer>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* SCREEN SECTION 2: EXPLORER MAIN LIST                          */
          /* ------------------------------------------------------------- */
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Dashboard Title Panel styled precisely with Tailwind */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Personal Documents</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Manage and access your official employee documentation securely.</p>
              </div>
              
              <div className="flex gap-3">
                {/* Toggle Filters Dropdown click trigger */}
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl font-bold text-xs transition-colors select-none cursor-pointer ${
                      showFiltersDropdown || statusFilter !== "All"
                        ? "border-[#006b5f] bg-[#d4e7d8]/10 text-[#006b5f]" 
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters {statusFilter !== "All" && `(${statusFilter})`}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>

                  {showFiltersDropdown && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowFiltersDropdown(false)} />
                      <div className="absolute right-0 top-12 z-40 w-48 bg-white border border-slate-100 rounded-xl shadow-xl p-2.5 flex flex-col gap-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">Filter by Status</p>
                        {(["All", "Verified", "Pending Verification", "Expiring Soon"] as const).map(status => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => {
                              setStatusFilter(status)
                              setShowFiltersDropdown(false)
                            }}
                            className={`text-left text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                              statusFilter === status 
                                ? "bg-[#d4e7d8]/20 text-[#006b5f] font-bold" 
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Launch Upload View screen button page controller */}
                <button 
                  type="button"
                  onClick={() => setIsUploadPageActive(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#006b5f] hover:bg-[#005047] text-white rounded-xl font-bold text-xs shadow-md shadow-[#006b5f]/10 transition-all select-none cursor-pointer animate-pulse"
                >
                  <Plus className="h-4 w-4" />
                  <span>Upload New</span>
                </button>
              </div>
            </div>

            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Main Documents Grid Col-Span 8 */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Filter tab bar */}
                <div className="flex border-b border-slate-150 bg-white/40 p-1.5 rounded-xl gap-1 overflow-x-auto">
                  {(["All Documents", "Contracts", "Tax & Financial", "Certifications"] as const).map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setSelectedTab(tab)}
                      className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        selectedTab === tab
                          ? "bg-[#006b5f] text-white shadow-sm font-extrabold"
                          : "text-slate-500 hover:text-slate-800 hover:bg-white/60"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Live Search bar inside card container */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search documents by name or file type..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full h-11 bg-white border border-slate-100 rounded-xl pl-11 pr-4 text-xs font-semibold placeholder-slate-400 shadow-3xs outline-none focus:border-[#006b5f] focus:ring-1 focus:ring-[#006b5f] transition-all"
                  />
                  {searchQuery && (
                    <button 
                      type="button" 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>

                {/* Grid display for filtered items */}
                {filteredDocuments.length === 0 ? (
                  <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-700">No documents found</h3>
                    <p className="text-xs text-slate-400 max-w-xs leading-normal">
                      No records match your active filtering parameters or workspace query. Try clearing filters or uploading a new file.
                    </p>
                    {(selectedTab !== "All Documents" || statusFilter !== "All" || searchQuery) && (
                      <button 
                        type="button"
                        onClick={() => {
                          setSelectedTab("All Documents")
                          setStatusFilter("All")
                          setSearchQuery("")
                        }}
                        className="mt-2 text-xs font-extrabold text-[#006b5f] hover:underline cursor-pointer"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredDocuments.map(doc => (
                      <div 
                        key={doc.id}
                        className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-[#006b5f]/40 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex flex-col gap-4 relative group"
                      >
                        {/* Header Controls for each document card */}
                        <div className="flex items-start justify-between">
                          <div className="p-2.5 bg-[#d4e7d8]/30 rounded-xl">
                            {getDocumentIcon(doc.name)}
                          </div>

                          <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            {/* Status tag changer (Interactive verify toggle for testing) */}
                            <button
                              type="button"
                              onClick={() => handleVerifyToggle(doc.id, doc.name)}
                              title="Click to toggle verification status"
                              className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-405 hover:text-[#006b5f] transition-all cursor-pointer"
                            >
                              <RefreshCw className="h-4 w-4 text-slate-400" />
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => handleDownload(doc.name)}
                              className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-405 hover:text-slate-800 transition-all cursor-pointer"
                              title="Download"
                            >
                              <Download className="h-4 w-4 text-slate-400" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteDocument(doc.id, doc.name)}
                              className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-405 hover:text-rose-650 transition-all cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-slate-400 hover:text-rose-500" />
                            </button>
                          </div>
                        </div>

                        {/* Metadata summary */}
                        <div className="space-y-1">
                          <h3 
                            className="font-bold text-xs text-slate-850 truncate select-all" 
                            title={doc.name}
                          >
                            {doc.name}
                          </h3>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="bg-[#d4e7d8]/40 text-[#005047] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                              {doc.tag}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">• {doc.date}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">• {doc.sizeMB >= 100 ? `${(doc.sizeMB / 1000).toFixed(1)} GB` : `${doc.sizeMB} MB`}</span>
                          </div>
                        </div>

                        {/* Verification / Alert tags */}
                        <div className="mt-auto pt-2 border-t border-slate-50 flex items-center gap-2">
                          {doc.status === "Verified" && (
                            <div className="flex items-center gap-1.5 text-[#006b5f]">
                              <CheckCircle2 className="h-4 w-4 text-[#006b5f]" />
                              <span className="text-[10px] font-extrabold tracking-wide">Verified</span>
                            </div>
                          )}
                          
                          {doc.status === "Pending Verification" && (
                            <div className="flex items-center gap-1.5 text-amber-600">
                              <Clock className="h-4 w-4 text-amber-500 animate-pulse" />
                              <span className="text-[10px] font-extrabold tracking-wide">Pending Verification</span>
                            </div>
                          )}

                          {doc.status === "Expiring Soon" && (
                            <div className="flex items-center gap-1.5 text-rose-600">
                              <AlertTriangle className="h-4 w-4 text-rose-500" />
                              <span className="text-[10px] font-extrabold tracking-wide uppercase">Expiring Is Imminent</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Col-Span 4 Sidebar Stats & Info */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Storage Progress Card Panel */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                      <Database className="h-4 w-4 text-[#006b5f]" />
                      <span>Document Storage</span>
                    </h3>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-black tracking-tight text-slate-850">
                        {(statsByType.total / 1000).toFixed(1)}
                      </span>
                      <span className="text-sm font-semibold text-slate-400 ml-1">GB</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      of 2.0 GB used
                    </span>
                  </div>

                  {/* Progress visual bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2 rounded-full bg-slate-50 overflow-hidden relative border border-slate-100">
                      <div 
                        className="h-full bg-[#006b5f] rounded-full transition-all duration-500"
                        style={{ width: `${statsByType.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-end">
                      <span className="text-[10px] font-extrabold text-[#006b5f]">{statsByType.percentage}% allocation</span>
                    </div>
                  </div>

                  {/* Progress Category breakdowns */}
                  <div className="space-y-3.5 pt-2">
                    {/* Contracts & Legal */}
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#006b5f]" />
                        <span>Legal &amp; Contracts</span>
                      </div>
                      <span className="text-slate-800 font-extrabold">
                        {statsByType.contracts >= 1000 ? `${(statsByType.contracts / 1000).toFixed(1)} GB` : `${statsByType.contracts} MB`}
                      </span>
                    </div>

                    {/* Identification */}
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span>Identification Docs</span>
                      </div>
                      <span className="text-slate-800 font-extrabold">
                        {statsByType.identification >= 1000 ? `${(statsByType.identification / 1000).toFixed(1)} GB` : `${statsByType.identification} MB`}
                      </span>
                    </div>

                    {/* Tax & Financial */}
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <span>Tax &amp; Financial</span>
                      </div>
                      <span className="text-slate-800 font-extrabold">
                        {statsByType.tax >= 1000 ? `${(statsByType.tax / 1000).toFixed(1)} GB` : `${statsByType.tax} MB`}
                      </span>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => triggerToast("Pricing & upgrade panel plans are currently locked under developer key settings.")}
                    className="w-full py-2.5 border border-[#006b5f] text-[#006b5f] hover:bg-[#006b5f]/5 rounded-xl font-bold text-xs tracking-wide transition-colors cursor-pointer text-center block"
                  >
                    Manage Storage Subscription
                  </button>
                </div>

                {/* Info Security callout banner container */}
                <div className="p-5 bg-gradient-to-br from-[#d4e7d8]/30 to-[#b8cbbd]/10 border border-[#b8cbbd] rounded-2xl flex gap-3.5 shadow-3xs">
                  <div className="w-10 h-10 rounded-full bg-[#006b5f] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-[#0f1f16] tracking-wide uppercase">Secure Encryption</h4>
                    <p className="text-[11px] text-[#3a4b40] leading-relaxed font-semibold">
                      All documents are fully encrypted using military-grade AES-256 protocols before being written to compliant servers. Access strictly regulated.
                    </p>
                  </div>
                </div>

                {/* Recent activity timeline */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Recent Activity
                  </h3>

                  <div className="divide-y divide-slate-50">
                    {activities.map(act => (
                      <div key={act.id} className="py-3.5 first:pt-0 last:pb-0 flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 select-none">
                          {act.icon === "verified" ? (
                            <CheckCircle2 className="h-4 w-4 text-[#006b5f]" />
                          ) : act.icon === "trash" ? (
                            <Trash2 className="h-4 w-4 text-rose-500" />
                          ) : (
                            <Upload className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-snug">{act.action}</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{act.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </AppLayout>
  )
}
