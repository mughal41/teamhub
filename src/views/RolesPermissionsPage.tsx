import * as React from "react"
import { useState } from "react"
import { AppLayout } from "../components/layout/AppLayout"
import { 
  Users, 
  ShieldAlert, 
  ShieldCheck, 
  Calendar, 
  Plus, 
  Search, 
  SlidersHorizontal,
  X,
  Trash2,
  Lock,
  Edit2,
  Copy,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

// Initial roles data structure aligned perfectly with user screens & mockups
const INITIAL_ROLES = [
  { 
    id: 1, 
    name: "Full Admin", 
    description: "Unrestricted system access to all modules and configurations.", 
    count: 5, 
    lastModified: "Oct 20, 2023", 
    status: "Active", 
    immutable: true, 
    members: ["Alex Carter", "Sarah Jenkins", "Diana Prince", "David Miller", "Bruce Wayne"],
    dotColor: "bg-[#006b5f]",
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAVRd4Iq_I8LSKlrMpwjM-R4XN2aNOl4l7fi08VXC3eL3bKL0BVDPXER8FYpDvBVRbcEf2yU5_fq_s2mcQ7Vkg2dostP_SVs2aMAr6FZHXqfiUwEp8aa7sbePXQbo0vlC7EHuKTX3_04WsmsAobNIxB8JPfr5sCTPy2fGaR5TgNNw51eyu2eR72QzUSZ130XUBBSRoXE5I7hSQQ7DJyrZ25wAZ0vdZQ4Qiw208ZGtCRqF8_lihL2uZC19FNH7bAWVs1iHrTr4FKUnQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBtbJsYTukWQTdHbfCMfwAIXoG5VfIQlhG79gHVnMkK7yqRGDlEsIdH0VvC0aabx6wt2F549ZY6voaa0aubn53A5lykZ6u2b79UB4gFA3vgQdJo4NKZBmki3uKR4AVUPQnFJimqPJqJo_-aTccU0tzBhTsmSAyoMuvIJsYfhXabm679GQCyB0GBZAMg5byb4dwj4mIq9UCN88xRMlo0HHvH014arJuGOgiQdnGCc5sk7SSMQ41H_MIMNb824bllupgAtBqchCHg"
    ],
    permissions: {
      viewEmp: true,
      editEmp: true,
      editPayroll: true,
      viewFinance: true,
      manageSchedules: true,
      viewAnalytics: true,
      exportReports: true,
      salaryAccess: true,
      bankDetails: true,
      securityPolicies: true,
      globalSettings: true
    }
  },
  { 
    id: 2, 
    name: "HR Manager", 
    description: "Manages employee records, leave requests, and recruiting.", 
    count: 15, 
    lastModified: "Oct 18, 2023", 
    status: "Active", 
    immutable: false, 
    members: ["Toby Flenderson", "Holly Flax", "Angela Martin"],
    dotColor: "bg-[#516257]",
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuABYF0DvZb3wA0KiV_nH36kHyDt6IQBdHRTQwk4WqzDPO-F7Jxl5fCEoeQwa1LPvuRupvgeJqboEQDvKO5mGmBfOvngVGY5C4NHLKggMEiF2pA7kHNaiX9aFOg-Z4TU_Rot85HgUeUUlY_abcn80vZyg5hAROf4MpMKDsI1JVJoz7vWlOeqAocahT2fHbn8lePSkgjiSIeuXzqYFhUFajS8iJgnl-oRdLrecKBOksOYK3TuzbPpSL1wmZ6Dn3BUuAHl8EI6OhmuGfg"
    ],
    permissions: {
      viewEmp: true,
      editEmp: true,
      editPayroll: false,
      viewFinance: false,
      manageSchedules: true,
      viewAnalytics: true,
      exportReports: false,
      salaryAccess: false,
      bankDetails: false,
      securityPolicies: false,
      globalSettings: false
    }
  },
  { 
    id: 3, 
    name: "Finance Lead", 
    description: "Access to payroll, tax documents, and financial reporting.", 
    count: 2, 
    lastModified: "Oct 12, 2023", 
    status: "Active", 
    immutable: false, 
    members: ["Kevin Malone", "Oscar Martinez"],
    dotColor: "bg-[#615e54]",
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1zqRN9lWYeyM9g2ASNSqaVYTwBCnWMKLnxx-Y7pyzaNch0rsD-EuCmE_pZHyySwvsAvpXoHuvDNKkLucoGGyMeD7W2b4AeALgCAmWCBFIDBvM2Eu69pWD_aqf3IZtSS3iOdqdh9SwHgbJmMs3HoTw5AD1ZTx_ytRWTHyjU1zDrhw25kNxO-4DyrCRlIy4kV-w2sfXyeMSagUEEW2QLJx8HDbmlFjtQG0skusGBwNZEWDpezT4se5YvQICYIXml8eIHdDtoFB25pM",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB1eJlMIAdCzei-cm3iULjXPmMFZn3RhndL8ZToiUJGeuuPeqrNOiwra0u2MTVQf4f4M1fPJR5YDXBnurGqcpnRrN8ZeNgGifls3hw9G4qTS1zRqH5GFRJgK_SQjJBfhtnkctMJgLgpP2D9us3SR6weI6n2QIv8Q1hTKvi3irOSGVHfqtTl4jWr0GApVPL3R_q2JXeVt-xGpc0Kr6TTPNZWTbsGvlAd5haakgORO6dDkw779FfIumEDi_xU2SR5H_xAKdsqvTJGCAY"
    ],
    permissions: {
      viewEmp: true,
      editEmp: false,
      editPayroll: true,
      viewFinance: true,
      manageSchedules: false,
      viewAnalytics: true,
      exportReports: true,
      salaryAccess: true,
      bankDetails: true,
      securityPolicies: false,
      globalSettings: false
    }
  },
  { 
    id: 4, 
    name: "Department Head", 
    description: "Limited management access for specific department members.", 
    count: 42, 
    lastModified: "Sep 30, 2023", 
    status: "Active", 
    immutable: false, 
    members: [],
    dotColor: "bg-[#6c7a76]",
    avatars: [],
    permissions: {
      viewEmp: true,
      editEmp: false,
      editPayroll: false,
      viewFinance: false,
      manageSchedules: true,
      viewAnalytics: true,
      exportReports: false,
      salaryAccess: false,
      bankDetails: false,
      securityPolicies: false,
      globalSettings: false
    }
  },
  { 
    id: 5, 
    name: "Employee", 
    description: "Self-service access to own profile, payslips, and training.", 
    count: 1224, 
    lastModified: "Jan 05, 2023", 
    status: "Active", 
    immutable: true, 
    members: [],
    dotColor: "bg-[#bbc9c5]",
    avatars: [],
    permissions: {
      viewEmp: true,
      editEmp: false,
      editPayroll: false,
      viewFinance: false,
      manageSchedules: false,
      viewAnalytics: false,
      exportReports: false,
      salaryAccess: false,
      bankDetails: false,
      securityPolicies: false,
      globalSettings: false
    }
  }
]

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState(INITIAL_ROLES)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all") // all, Active, Inactive
  const [minUsersAssigned, setMinUsersAssigned] = useState(0)
  
  // Custom states
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Edit / Details sliding drawer state
  const [activeEditRole, setActiveEditRole] = useState<typeof INITIAL_ROLES[0] | null>(null)
  const [tempPermissions, setTempPermissions] = useState<any>(null)

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDesc, setNewRoleDesc] = useState("")
  const [newPermissions, setNewPermissions] = useState({
    viewEmp: true,
    editEmp: false,
    editPayroll: false,
    viewFinance: false,
    manageSchedules: true
  })

  // Delete Modal State
  const [roleToDelete, setRoleToDelete] = useState<typeof INITIAL_ROLES[0] | null>(null)
  const [replacementRoleId, setReplacementRoleId] = useState("")

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 4500)
  }

  // Handle Create Role Action
  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoleName.trim()) {
      alert("Role Name is required.")
      return
    }

    const createdRole = {
      id: Date.now(),
      name: newRoleName,
      description: newRoleDesc || "Custom operational group authorization permissions profile",
      count: 0,
      lastModified: "Just now",
      status: "Active",
      immutable: false,
      members: [],
      dotColor: "bg-slate-400",
      avatars: [],
      permissions: {
        viewEmp: newPermissions.viewEmp,
        editEmp: newPermissions.editEmp,
        editPayroll: newPermissions.editPayroll,
        viewFinance: newPermissions.viewFinance,
        manageSchedules: newPermissions.manageSchedules,
        viewAnalytics: false,
        exportReports: false,
        salaryAccess: false,
        bankDetails: false,
        securityPolicies: false,
        globalSettings: false
      }
    }

    setRoles([...roles, createdRole])
    setIsCreateModalOpen(false)
    setNewRoleName("")
    setNewRoleDesc("")
    setNewPermissions({
      viewEmp: true,
      editEmp: false,
      editPayroll: false,
      viewFinance: false,
      manageSchedules: true
    })
    triggerToast(`Role "${createdRole.name}" created successfully with custom authorization scopes!`)
  }

  // Handle Select All inside Create Role Modal
  const handleSelectAllNew = () => {
    const allChecked = Object.values(newPermissions).every(v => v === true)
    setNewPermissions({
      viewEmp: !allChecked,
      editEmp: !allChecked,
      editPayroll: !allChecked,
      viewFinance: !allChecked,
      manageSchedules: !allChecked
    })
  }

  // Initiate Edit Drawer loading details
  const openEditDrawer = (role: typeof INITIAL_ROLES[0]) => {
    setActiveEditRole(role)
    setTempPermissions({ ...role.permissions })
  }

  // Save permission edit changes inside detail drawer
  const saveDrawerPerms = () => {
    if (!activeEditRole) return
    setRoles(roles.map(r => {
      if (r.id === activeEditRole.id) {
        return {
          ...r,
          permissions: { ...tempPermissions },
          lastModified: "Just now"
        }
      }
      return r
    }))
    setActiveEditRole(null)
    triggerToast(`Custom security profiles saved for "${activeEditRole.name}" successfully!`)
  }

  // Handle Duplicate / Clone action
  const cloneRole = (role: typeof INITIAL_ROLES[0]) => {
    const cloned = {
      ...role,
      id: Date.now(),
      name: `${role.name} (Copy)`,
      count: 0,
      members: [],
      avatars: [],
      lastModified: "Just now",
      immutable: false
    }
    setRoles([...roles, cloned])
    triggerToast(`Cloned security definition profile "${role.name}" successfully.`)
  }

  // Handle Delete Role Confirm and Reassign
  const handleDeleteConfirm = () => {
    if (!roleToDelete) return
    
    // If members assigned, require reassignment selection
    if (roleToDelete.count > 0 && !replacementRoleId) {
      alert("Please select a replacement role to safely migrate assigned employees.")
      return
    }

    const replacementRole = roles.find(r => r.id === Number(replacementRoleId))

    // Reassign logic in state
    let updatedRoles = roles.map(r => {
      if (r.id === Number(replacementRoleId)) {
        return {
          ...r,
          count: r.count + roleToDelete.count,
          members: [...r.members, ...roleToDelete.members]
        }
      }
      return r
    })

    // Filter out deleted role
    updatedRoles = updatedRoles.filter(r => r.id !== roleToDelete.id)
    setRoles(updatedRoles)
    
    const msg = roleToDelete.count > 0 
      ? `Deleted "${roleToDelete.name}" role. Migrated ${roleToDelete.count} employees safely to "${replacementRole?.name}".`
      : `Deleted "${roleToDelete.name}" successfully.`

    setRoleToDelete(null)
    setReplacementRoleId("")
    triggerToast(msg)
  }

  // Filter roles list
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          role.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || role.status === selectedStatus
    const matchesMinUsers = role.count >= minUsersAssigned
    return matchesSearch && matchesStatus && matchesMinUsers
  })

  return (
    <AppLayout
      title="User Roles & Permissions"
      breadcrumbs={[
        { label: "Settings", href: "/settings/personal-info" },
        { label: "Roles & Permissions" }
      ]}
    >
      <div className="mx-auto w-full max-w-7xl space-y-8 pb-12 animate-fade-in duration-300">
        
        {/* Floating Success Toast */}
        {toastMessage && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-white shadow-2xl rounded-xl px-5 py-4 flex items-center gap-3 z-50 animate-fade-in text-sm">
            <CheckCircle2 className="h-5.5 w-5.5 text-emerald-400" />
            <p className="font-semibold tracking-wide">{toastMessage}</p>
          </div>
        )}

        {/* Page Description Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">User Roles & Permissions</h2>
            <p className="text-sm text-slate-500 font-medium">
              Define and manage access levels, functional permissions, and administrative roles across the entire enterprise ecosystem.
            </p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-[#006b5f] hover:bg-[#005047] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-teal-700/10 transition-all shrink-0 active:scale-95"
          >
            <Plus className="h-4.5 w-4.5" />
            Create New Role
          </button>
        </div>

        {/* Bento Stats Grid Layout precisely matching visual mockup */}
        <div className="grid grid-cols-1 gap-6 max-w-xs">
          
          {/* Stats Card: Active Roles */}
          <div className="bg-white p-5 rounded-2xl flex items-center gap-4.5 border border-line shadow-xs">
            <div className="w-12 h-12 bg-[#F3F3F0] border border-line rounded-xl flex items-center justify-center shrink-0 shadow-3xs text-slate-500">
              <ShieldAlert className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-slate-450 text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Roles</p>
              <h4 className="text-3xl font-black text-slate-800 mt-0.5">{roles.filter(r => r.status === "Active").length}</h4>
            </div>
          </div>

        </div>

        {/* Roles Table Container Card (Pristine layout with search and filter parameters) */}
        <section className="bg-white rounded-2xl border border-line overflow-hidden flex flex-col">
          
          {/* Header row of list */}
          <div className="p-6 border-b border-slate-55 border-line/85 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4.5 bg-slate-50/10">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-slate-900">Role Definitions</h3>
              <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                {roles.length} Total
              </span>
            </div>
            
            {/* Quick action buttons next to headcount tag */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button 
                onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
                className={`px-3.5 py-2 border rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs ${isFilterPopoverOpen ? "bg-teal-50 border-teal-500/30 text-[#006b5f]" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"}`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </button>
              <button 
                onClick={() => triggerToast("Roles authorization layout exported successfully in spreadsheet format!")}
                className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-3xs transition-all"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {/* Quick Realtime Search input */}
          <div className="px-6 py-4 border-b border-line flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search definitions by role name or description keywords..."
                className="w-full bg-slate-50 hover:bg-slate-100/55 focus:bg-white border border-slate-200 focus:border-[#006b5f] rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all"
              />
            </div>
            
            {/* Advanced fast filters tabs */}
            <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0 text-xs font-bold">
              <button 
                onClick={() => setSelectedStatus("all")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${selectedStatus === "all" ? "bg-white text-slate-800 shadow-3xs font-extrabold" : "text-slate-500 hover:text-slate-800"}`}
              >
                All
              </button>
              <button 
                onClick={() => setSelectedStatus("Active")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${selectedStatus === "Active" ? "bg-white text-slate-800 shadow-3xs font-extrabold" : "text-slate-500 hover:text-slate-800"}`}
              >
                Active
              </button>
              <button 
                onClick={() => setSelectedStatus("Inactive")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${selectedStatus === "Inactive" ? "bg-white text-slate-800 shadow-3xs font-extrabold" : "text-slate-500 hover:text-slate-800"}`}
              >
                Inactive
              </button>
            </div>
          </div>

          {/* Dynamic slider filter panel */}
          {isFilterPopoverOpen && (
            <div className="p-6 bg-slate-50 border-b border-line flex flex-col md:flex-row gap-6 items-start animate-fade-in duration-200">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Minimum Assigned Members in Role</span>
                  <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-3xs font-sans font-bold text-[#006b5f]">{minUsersAssigned} Members</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  value={minUsersAssigned}
                  onChange={(e) => setMinUsersAssigned(Number(e.target.value))}
                  className="w-full accent-[#006b5f] cursor-pointer focus:ring-0"
                />
              </div>
              <div className="shrink-0 flex gap-3 pt-4 md:pt-6">
                <button 
                  onClick={() => {
                    setMinUsersAssigned(0);
                    setSearchTerm("");
                    setSelectedStatus("all");
                  }}
                  className="px-3.5 py-2 border border-slate-250 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 shadow-3xs"
                >
                  Clear Filters
                </button>
                <button 
                  onClick={() => setIsFilterPopoverOpen(false)}
                  className="px-3.5 py-2 bg-[#006b5f] text-white rounded-xl text-xs font-bold hover:bg-[#005047]"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Interactive Core Table Grid */}
          <div className="overflow-x-auto whitespace-nowrap">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50 border-b border-line font-extrabold uppercase tracking-wider text-[10px] text-slate-400">
                  <th className="px-6 py-3.5">Role Name</th>
                  <th className="px-6 py-3.5">Description</th>
                  <th className="px-6 py-3.5">Users Assigned</th>
                  <th className="px-6 py-3.5">Last Modified</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-405 text-slate-400 font-medium">
                      No configured roles match your filtering conditions.
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((role) => (
                    <tr 
                      key={role.id} 
                      onClick={() => openEditDrawer(role)}
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    >
                      {/* Name Column with Dot */}
                      <td className="px-6 py-4.5 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${role.dotColor || "bg-slate-400"}`} />
                          <div className="flex items-center gap-1.5">
                            {role.immutable && <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
                            <span>{role.name}</span>
                          </div>
                        </div>
                      </td>

                      {/* Description Panel */}
                      <td className="px-6 py-4.5 text-slate-500 font-medium max-w-sm overflow-hidden text-ellipsis">
                        {role.description}
                      </td>

                      {/* Avatars Overlaps */}
                      <td className="px-6 py-4.5" onClick={(e) => e.stopPropagation()}>
                        {role.count === 1224 ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#d4e7d8] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#57685d] font-sans shrink-0">
                              1K+
                            </div>
                            <span className="text-xs text-slate-500 font-bold font-mono">1,224 members</span>
                          </div>
                        ) : role.count === 42 ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#d4e7d8] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#57685d] font-sans shrink-0">
                              42
                            </div>
                            <span className="text-xs text-slate-500 font-bold font-mono">42 members</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3.5">
                            <div className="flex -space-x-2">
                              {role.avatars && role.avatars.length > 0 ? (
                                role.avatars.map((ava, idx) => (
                                  <img 
                                    key={idx} 
                                    src={ava} 
                                    className="w-7 h-7 rounded-full border-2 border-white pointer-events-none shadow-3xs object-cover" 
                                  />
                                ))
                              ) : (
                                <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-150 flex items-center justify-center text-[9px] font-bold text-slate-405 uppercase shrink-0">
                                  {role.name.slice(0, 2)}
                                </div>
                              )}
                              
                              {/* Extra members badge custom aligned according to mockup */}
                              {role.count > 2 && (
                                <div className="w-7 h-7 rounded-full border-2 border-white bg-[#d4e7d8] flex items-center justify-center text-[10px] font-bold text-[#57685d] shadow-3xs shrink-0 font-sans">
                                  +{role.count - role.avatars.length}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 font-bold font-mono">{role.count} standard members</span>
                          </div>
                        )}
                      </td>

                      {/* Mod dates */}
                      <td className="px-6 py-4.5 text-xs text-slate-450 font-semibold font-mono">
                        {role.lastModified || "Oct 20, 2023"}
                      </td>

                      {/* Status Badges */}
                      <td className="px-6 py-4.5">
                        <span className="px-3 py-1 bg-[#d4e7d8] text-[#57685d] text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                          {role.status}
                        </span>
                      </td>

                      {/* Hover action selectors */}
                      <td className="px-6 py-4.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1 opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openEditDrawer(role)}
                            className="p-1.5 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors cursor-pointer text-slate-400"
                            title="Edit Permissions"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => cloneRole(role)}
                            className="p-1.5 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors cursor-pointer text-slate-400"
                            title="Duplicate Role"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button 
                            disabled={role.immutable}
                            onClick={() => {
                              setRoleToDelete(role)
                              setReplacementRoleId("")
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer text-slate-400 ${role.immutable ? "opacity-10 pointer-events-none" : "hover:bg-rose-50 hover:text-rose-600"}`}
                            title="Delete Security Profile"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Simple Pagination Footer from mockup */}
          <div className="p-4 bg-slate-50 flex items-center justify-between border-t border-line text-xs">
            <span className="text-slate-400 font-bold font-sans">Showing 5 of {roles.length} roles</span>
            <div className="flex gap-1">
              <button className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-450 rounded-lg cursor-pointer">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-[#006b5f] text-white rounded font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-slate-600 font-semibold rounded">2</button>
              <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-slate-600 font-semibold rounded">3</button>
              <button className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-450 rounded-lg cursor-pointer">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </section>

      </div>

      {/* -------------------- DETAIL PERMISSIONS SLIDE OUT PANEL -------------------- */}
      {activeEditRole && tempPermissions && (
        <>
          {/* Panel Backdrop */}
          <div 
            onClick={() => setActiveEditRole(null)}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 transition-opacity"
          />

          {/* Sliding drawer right precisely aligned based on slide-out simulator */}
          <div className="fixed top-0 right-0 w-[500px] h-screen bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-350 ease-in-out border-l border-slate-200 animate-slide-in-right">
            
            {/* Header section with closing handles */}
            <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Role: {activeEditRole.name}</h3>
                <p className="text-xs text-slate-450 text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Modify module-level access bounds</p>
              </div>
              <button 
                onClick={() => setActiveEditRole(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-150 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors shadow-3xs cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable list of permissions switches based on category bento mocks */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Category 1: Dashboard Access */}
              <div className="p-4 bg-amber-50/10 border border-amber-500/20 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-slate-850">
                  <ShieldCheck className="h-5 w-5 text-[#006b5f]" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Dashboard Access</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 bg-white border border-line rounded-lg shadow-3xs">
                    <span className="text-xs font-bold text-slate-700">View Analytics</span>
                    <button 
                      onClick={() => setTempPermissions({ ...tempPermissions, viewAnalytics: !tempPermissions.viewAnalytics })}
                      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${tempPermissions.viewAnalytics ? "bg-[#006b5f]" : "bg-slate-300"}`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${tempPermissions.viewAnalytics ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-white border border-line rounded-lg shadow-3xs">
                    <span className="text-xs font-bold text-slate-700">Export Reports</span>
                    <button 
                      onClick={() => setTempPermissions({ ...tempPermissions, exportReports: !tempPermissions.exportReports })}
                      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${tempPermissions.exportReports ? "bg-[#006b5f]" : "bg-slate-300"}`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${tempPermissions.exportReports ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Category 2: Employee Records checks */}
              <div className="p-4 bg-emerald-50/10 border border-emerald-500/20 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#006b5f]" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Employee Records</h4>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <label className="p-3.5 bg-white border border-line rounded-xl flex items-center gap-2.5 shadow-3xs cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={tempPermissions.viewEmp}
                      onChange={(e) => setTempPermissions({ ...tempPermissions, viewEmp: e.target.checked })}
                      className="rounded text-[#006b5f] focus:ring-teal-500 h-4 w-4" 
                    />
                    <span className="text-xs font-bold text-slate-600">View Details</span>
                  </label>
                  <label className="p-3.5 bg-white border border-line rounded-xl flex items-center gap-2.5 shadow-3xs cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={tempPermissions.editEmp}
                      onChange={(e) => setTempPermissions({ ...tempPermissions, editEmp: e.target.checked })}
                      className="rounded text-[#006b5f] focus:ring-teal-500 h-4 w-4" 
                    />
                    <span className="text-xs font-bold text-slate-600">Create New</span>
                  </label>
                </div>
              </div>

              {/* Category 3: Financial payroll */}
              <div className="p-4 bg-teal-50/10 border border-teal-500/20 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#006b5f]" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Financial & Payroll</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 bg-white border border-line rounded-lg shadow-3xs">
                    <div className="leading-snug">
                      <span className="text-xs font-bold text-slate-700">Salary Access</span>
                      <p className="text-[10px] text-slate-400 font-medium">View and modify salary levels</p>
                    </div>
                    <button 
                      onClick={() => setTempPermissions({ ...tempPermissions, salaryAccess: !tempPermissions.salaryAccess })}
                      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${tempPermissions.salaryAccess ? "bg-[#006b5f]" : "bg-slate-300"}`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${tempPermissions.salaryAccess ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-white border border-line rounded-lg shadow-3xs">
                    <div className="leading-snug">
                      <span className="text-xs font-bold text-slate-700">Bank Details</span>
                      <p className="text-[10px] text-slate-400 font-medium">View sensitive corporate banking info</p>
                    </div>
                    <button 
                      onClick={() => setTempPermissions({ ...tempPermissions, bankDetails: !tempPermissions.bankDetails })}
                      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${tempPermissions.bankDetails ? "bg-[#006b5f]" : "bg-slate-300"}`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${tempPermissions.bankDetails ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Category 4: System settings */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#006b5f]" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">System Configuration</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 bg-white border border-line rounded-lg shadow-3xs">
                    <span className="text-xs font-bold text-slate-700">Security Policies</span>
                    <button 
                      onClick={() => setTempPermissions({ ...tempPermissions, securityPolicies: !tempPermissions.securityPolicies })}
                      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${tempPermissions.securityPolicies ? "bg-[#006b5f]" : "bg-slate-300"}`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${tempPermissions.securityPolicies ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-white border border-line rounded-lg shadow-3xs">
                    <span className="text-xs font-bold text-slate-700">Global Settings</span>
                    <button 
                      onClick={() => setTempPermissions({ ...tempPermissions, globalSettings: !tempPermissions.globalSettings })}
                      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${tempPermissions.globalSettings ? "bg-[#006b5f]" : "bg-slate-300"}`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${tempPermissions.globalSettings ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Save Controls Footer */}
            <div className="p-6 bg-slate-55 border-t border-slate-150-variant border-slate-200 bg-slate-50 flex items-center gap-4.5">
              <button 
                onClick={saveDrawerPerms}
                className="flex-1 py-3 bg-[#006b5f] text-white font-bold rounded-lg hover:bg-[#005047] hover:shadow-lg transition-all active:opacity-90 cursor-pointer shadow-md text-xs text-center"
              >
                Save Changes
              </button>
              <button 
                onClick={() => setActiveEditRole(null)}
                className="flex-1 py-3 border border-slate-200 font-bold bg-white rounded-lg hover:bg-slate-100 text-slate-700 text-xs text-center cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </>
      )}

      {/* -------------------- CREATE NEW ROLE MODAL Overlay (SCREEN 45) -------------------- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 p-4">
          
          {/* Modal Container */}
          <div className="bg-white w-full max-w-[640px] rounded-lg shadow-xl overflow-hidden flex flex-col animate-scale-up z-10 max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-200 flex items-center justify-between bg-slate-10/5 bg-slate-50/30">
              <div className="flex flex-col">
                <h2 className="text-lg font-black text-slate-950">Create New Role</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Define access levels and functional permissions for staff.</p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body scrollable */}
            <form onSubmit={handleCreateRole} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Role Title block */}
              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role Name</label>
                <input 
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Senior Operations Manager"
                  className="w-full h-11 px-4 rounded-lg border border-slate-205 focus:border-[#006b5f] border-slate-300 outline-none transition-all text-sm font-medium text-slate-800 bg-white"
                />
              </div>

              {/* Description block */}
              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea 
                  rows={2.5}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Briefly describe the responsibilities of this role..."
                  className="w-full p-3.5 rounded-lg border border-slate-205 focus:border-[#006b5f] border-slate-300 outline-none transition-all text-sm font-medium text-slate-800 bg-white resize-none"
                />
              </div>

              {/* Functional permissions list nested as mockup */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <h3 className="font-bold text-slate-800 uppercase tracking-widest text-[11px]">Functional Permissions</h3>
                  <button 
                    type="button"
                    onClick={handleSelectAllNew}
                    className="text-[#006b5f] font-bold hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                </div>

                {/* Sub category modules */}
                <div className="space-y-4">
                  
                  {/* Category 1: EMPLOYEE MANAGEMENT */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-3xs">
                    <div className="bg-[#F3F3F0] px-4 py-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      Employee Management
                    </div>
                    <div className="divide-y divide-slate-100">
                      
                      {/* item 1 */}
                      <label className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors select-none">
                        <div className="flex flex-col gap-0.5 max-w-[80%]">
                          <span className="text-xs font-bold text-slate-800">View Employees</span>
                          <span className="text-[10px] text-slate-400 font-medium leading-relaxed">Allow viewing of basic employee profiles and directory information.</span>
                        </div>
                        <input 
                          type="checkbox"
                          checked={newPermissions.viewEmp}
                          onChange={(e) => setNewPermissions({ ...newPermissions, viewEmp: e.target.checked })}
                          className="w-5 h-5 rounded border-slate-300 text-[#006b5f] focus:ring-[#006b5f] cursor-pointer"
                        />
                      </label>

                      {/* item 2 */}
                      <label className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors select-none">
                        <div className="flex flex-col gap-0.5 max-w-[80%]">
                          <span className="text-xs font-bold text-slate-800">Edit Employee Records</span>
                          <span className="text-[10px] text-slate-400 font-medium leading-relaxed">Update contact info, performance reviews, and status.</span>
                        </div>
                        <input 
                          type="checkbox"
                          checked={newPermissions.editEmp}
                          onChange={(e) => setNewPermissions({ ...newPermissions, editEmp: e.target.checked })}
                          className="w-5 h-5 rounded border-slate-300 text-[#006b5f] focus:ring-[#006b5f] cursor-pointer"
                        />
                      </label>

                    </div>
                  </div>

                  {/* Category 2: FINANCE & PAYROLL */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-3xs">
                    <div className="bg-[#F3F3F0] px-4 py-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      Finance & Payroll
                    </div>
                    <div className="divide-y divide-slate-100">
                      
                      {/* item 1 */}
                      <label className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors select-none">
                        <div className="flex flex-col gap-0.5 max-w-[80%]">
                          <span className="text-xs font-bold text-slate-800">Edit Payroll</span>
                          <span className="text-[10px] text-slate-400 font-medium leading-relaxed">Modify salary details, bonuses, and tax withholding information.</span>
                        </div>
                        <input 
                          type="checkbox"
                          checked={newPermissions.editPayroll}
                          onChange={(e) => setNewPermissions({ ...newPermissions, editPayroll: e.target.checked })}
                          className="w-5 h-5 rounded border-slate-300 text-[#006b5f] focus:ring-[#006b5f] cursor-pointer"
                        />
                      </label>

                      {/* item 2 */}
                      <label className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors select-none">
                        <div className="flex flex-col gap-0.5 max-w-[80%]">
                          <span className="text-xs font-bold text-slate-800">View Financial Reports</span>
                          <span className="text-[10px] text-slate-400 font-medium leading-relaxed">Access company-wide payroll and expense reporting dashboards.</span>
                        </div>
                        <input 
                          type="checkbox"
                          checked={newPermissions.viewFinance}
                          onChange={(e) => setNewPermissions({ ...newPermissions, viewFinance: e.target.checked })}
                          className="w-5 h-5 rounded border-slate-300 text-[#006b5f] focus:ring-[#006b5f] cursor-pointer"
                        />
                      </label>

                    </div>
                  </div>

                  {/* Category 3: SCHEDULE MANAGEMENT */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-3xs">
                    <div className="bg-[#F3F3F0] px-4 py-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      Schedule Management
                    </div>
                    <div className="divide-y divide-slate-100">
                      
                      {/* item 1 */}
                      <label className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors select-none">
                        <div className="flex flex-col gap-0.5 max-w-[80%]">
                          <span className="text-xs font-bold text-slate-800">Manage Schedules</span>
                          <span className="text-[10px] text-slate-400 font-medium leading-relaxed">Create and assign shifts, approve time-off requests.</span>
                        </div>
                        <input 
                          type="checkbox"
                          checked={newPermissions.manageSchedules}
                          onChange={(e) => setNewPermissions({ ...newPermissions, manageSchedules: e.target.checked })}
                          className="w-5 h-5 rounded border-slate-300 text-[#006b5f] focus:ring-[#006b5f] cursor-pointer"
                        />
                      </label>

                    </div>
                  </div>

                </div>
              </div>

              {/* Action Buttons Footer exactly styled */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50 -mx-6 -mb-6 p-4">
                <button 
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 h-10 border border-[#006b5f] text-[#006b5f] hover:bg-[#006b5f]/5 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 h-10 bg-[#006b5f] text-white hover:bg-[#005047] font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Create Role
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* -------------------- SAFELY REMOVE PROFILE MODAL WITH EMPS MIGRATION DROPDOWN -------------------- */}
      {roleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setRoleToDelete(null)}
            className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs transition-opacity"
          />

          <div className="relative bg-white w-full max-w-lg rounded-2xl border border-line shadow-2xl overflow-hidden animate-scale-up z-10 flex flex-col">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-rose-50 flex justify-between items-center bg-rose-50/20">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Delete Role Security Profile</h3>
                  <p className="text-[10px] text-rose-700 font-bold uppercase tracking-wider mt-0.5">Sovereignty safety warning</p>
                </div>
              </div>
              <button 
                onClick={() => setRoleToDelete(null)}
                className="w-8 h-8 rounded-lg hover:bg-rose-100/55 text-slate-400 hover:text-slate-850 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Warning body */}
            <div className="p-6 space-y-5">
              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 text-rose-900 text-xs sm:text-sm font-medium leading-relaxed">
                <p>
                  You are about to permanently delete the <strong className="font-bold text-rose-950">"{roleToDelete.name}"</strong> security profile.
                </p>
                {roleToDelete.count > 0 && (
                  <p className="mt-2 text-xs font-bold text-rose-800">
                    ⚠️ {roleToDelete.count} employees are currently assigned to this role. You MUST select a replacement role below to migrate these users safely before this profile can be removed.
                  </p>
                )}
              </div>

              {/* Members check */}
              {roleToDelete.count > 0 && roleToDelete.members.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Members ({roleToDelete.count})</h4>
                  <div className="max-h-32 overflow-y-auto border border-slate-150-variant border-line bg-slate-50/50 p-3 rounded-xl divide-y divide-slate-100">
                    {roleToDelete.members.map((member, i) => (
                      <div key={i} className="py-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <div className="w-5.5 h-5.5 rounded-full bg-[#d4e7d8] flex items-center justify-center text-[8px] font-extrabold text-[#57685d]">
                          {member.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span>{member}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Migrating lists dropdown */}
              {roleToDelete.count > 0 && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Replacement Security Role</label>
                  <select 
                    value={replacementRoleId}
                    onChange={(e) => setReplacementRoleId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 focus:border-[#006b5f] rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all shadow-3xs"
                    required
                  >
                    <option value="">Select a replacement role...</option>
                    {roles
                      .filter(r => r.id !== roleToDelete.id)
                      .map(r => (
                        <option key={r.id} value={r.id}>{r.name} ({r.count} users)</option>
                      ))
                    }
                  </select>
                </div>
              )}

              {/* Footers controls */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-line bg-slate-50 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl">
                <button 
                  type="button" 
                  onClick={() => setRoleToDelete(null)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all h-10 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-6 h-10 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center"
                >
                  Confirm Deletion
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </AppLayout>
  )
}
