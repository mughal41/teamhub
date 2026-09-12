// Dedicated client-side unified simulation database utilizing localStorage.
// This allows all pages to load, save, modify, and synchronize state perfectly in real-time.

export interface Employee {
  id: string;
  name: string;
  role: string;
  dept: string;
  type: string;
  model: string;
  status: string;
  avatar: string;
  joinDate: string;
  /** Reports-to employee id (e.g. EMP-0100). Null/undefined = no manager. */
  managerId?: string | null;
}

export interface AttendanceRecord {
  id: string;
  name: string;
  role: string;
  subRole: string;
  dept: string;
  date: string;
  model: string;
  in: string;
  out: string;
  duration: string;
  overtime: string;
  status: string; // "On-Time" | "Late" | "Absent" | "On Leave"
  avatar: string;
  correctionRequestsThisMonth: number;
  comment: string;
  forwardedTo: string;
  forwardedStatus: string; // "None" | "Pending" | "Approved" | "Rejected"
  hrApprovalStatus: string; // "None" | "Pending" | "Approved" | "Rejected"
}

export interface LeaveActivityItem {
  id: string;
  name: string;
  role: string;
  dept: string;
  type: string;
  submit: string;
  period: string;
  duration: string;
  reason: string;
  status: string;
  avatar: string;
  remainingQuota: number;
  totalQuota: number;
  sickLeavesRemaining: number;
  casualLeavesRemaining: number;
  annualLeavesRemaining: number;
  otherLeavesRemaining: number;
  startDate: string;
  endDate: string;
  forwardedTo: string;
  forwardedStatus?: string;
  comment: string;
}

export interface PayrollItem {
  id: string;
  name: string;
  role: string;
  subRole: string;
  date: string;
  salary: string;
  allowance: string;
  overtime: string;
  incen: string;
  deduct: string;
  total: string;
  status: string; // "Paid" | "Pending" | "Draft"
  avatar: string;
}

export interface InvoiceItem {
  id: string;
  date: string;
  amount: string;
  status: string;
}

export interface PaymentMethod {
  id: number;
  type: string;
  last4: string;
  expiry: string;
  holder: string;
  isDefault: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  description: string;
  employeeCount: number;
  status: "Active" | "Inactive";
  createdAt: string;
}

export const initialDepartments: Department[] = [
  {
    id: "DEPT-001",
    name: "Human Resources",
    code: "HR",
    headName: "Davis Levin",
    description: "People operations, policies, and workforce planning",
    employeeCount: 2,
    status: "Active",
    createdAt: "12 Jan 2032",
  },
  {
    id: "DEPT-002",
    name: "Marketing",
    code: "MKT",
    headName: "Marcus Brody",
    description: "Brand, campaigns, and go-to-market programs",
    employeeCount: 3,
    status: "Active",
    createdAt: "03 Mar 2032",
  },
  {
    id: "DEPT-003",
    name: "Product Design",
    code: "PD",
    headName: "Ethan Ray",
    description: "Product UI/UX and design systems",
    employeeCount: 2,
    status: "Active",
    createdAt: "18 May 2032",
  },
  {
    id: "DEPT-004",
    name: "Operations",
    code: "OPS",
    headName: "Jacob Yuen",
    description: "Site operations and compliance",
    employeeCount: 2,
    status: "Active",
    createdAt: "09 Aug 2032",
  },
  {
    id: "DEPT-005",
    name: "R&D",
    code: "RND",
    headName: "Lina Armand",
    description: "Research labs and product experimentation",
    employeeCount: 1,
    status: "Active",
    createdAt: "22 Sep 2032",
  },
  {
    id: "DEPT-006",
    name: "Customer Service",
    code: "CS",
    headName: "Farah Nabila",
    description: "Support, CX, and customer success",
    employeeCount: 2,
    status: "Active",
    createdAt: "14 Feb 2033",
  },
];

// Initial default seed datasets
export const initialEmployees: Employee[] = [
  {
    id: "EMP-0100",
    name: "Marcus Brody",
    role: "Marketing & Sales Manager",
    dept: "Marketing",
    type: "Full-Time",
    model: "Hybrid",
    status: "Active",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    joinDate: "01 Feb 2031",
    managerId: null,
  },
  {
    id: "EMP-0234",
    name: "Olivia Mason",
    role: "Marketing Executive",
    dept: "Marketing",
    type: "Full-Time",
    model: "Hybrid",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    joinDate: "12 Jan 2034",
    managerId: "EMP-0100",
  },
  {
    id: "EMP-0178",
    name: "Ethan Ray",
    role: "UI Designer",
    dept: "Product Design",
    type: "Full-Time",
    model: "Remote",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    joinDate: "03 Mar 2033",
    managerId: "EMP-0100",
  },
  {
    id: "EMP-0275",
    name: "Anya Rodriguez",
    role: "Graphic Designer",
    dept: "Marketing",
    type: "Freelance",
    model: "Remote",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    joinDate: "06 Apr 2035",
    managerId: "EMP-0100",
  },
  {
    id: "EMP-0401",
    name: "Nora Chen",
    role: "Content Specialist",
    dept: "Marketing",
    type: "Full-Time",
    model: "On-Site",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    joinDate: "15 Jan 2035",
    managerId: "EMP-0100",
  },
  {
    id: "EMP-0312",
    name: "Lina Armand",
    role: "Lab Analyst",
    dept: "R&D",
    type: "Part-Time",
    model: "On-Site",
    status: "On Leave",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    joinDate: "22 Jul 2034",
    managerId: null,
  },
  {
    id: "EMP-0115",
    name: "Jacob Yuen",
    role: "Site Supervisor",
    dept: "Operations",
    type: "Full-Time",
    model: "On-Site",
    status: "Absent",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    joinDate: "05 Sep 2032",
    managerId: null,
  },
  {
    id: "EMP-0289",
    name: "Mia Torres",
    role: "HR Officer",
    dept: "Human Resources",
    type: "Full-Time",
    model: "Hybrid",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    joinDate: "14 Feb 2033",
    managerId: null,
  },
  {
    id: "EMP-0356",
    name: "Sara Kim",
    role: "Customer Support",
    dept: "Customer Service",
    type: "Internship",
    model: "On-Site",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    joinDate: "10 May 2035",
    managerId: null,
  },
  {
    id: "EMP-0291",
    name: "Daniel Cheung",
    role: "Compliance Specialist",
    dept: "Operations",
    type: "Full-Time",
    model: "Remote",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    joinDate: "19 Nov 2033",
    managerId: null,
  },
  {
    id: "EMP-0159",
    name: "Kelvin Yu",
    role: "Training Coordinator",
    dept: "HR",
    type: "Part-Time",
    model: "On-Site",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    joinDate: "27 Jun 2032",
    managerId: null,
  },
  {
    id: "EMP-0320",
    name: "Farah Nabila",
    role: "Customer Experience Lead",
    dept: "Customer Service",
    type: "Full-Time",
    model: "Hybrid",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    joinDate: "08 Aug 2034",
    managerId: null,
  },
];

export const initialAttendance: AttendanceRecord[] = [
  {
    id: "EMP-0234",
    name: "Olivia Mason",
    role: "Marketing Executive",
    subRole: "Marketing",
    dept: "Marketing",
    date: "19 Jun 2035",
    model: "On-Site",
    in: "08:55 AM",
    out: "05:05 PM",
    duration: "8h 10m",
    overtime: "10m",
    status: "On-Time",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    correctionRequestsThisMonth: 0,
    comment: "",
    forwardedTo: "",
    forwardedStatus: "None",
    hrApprovalStatus: "Approved"
  },
  {
    id: "EMP-0178",
    name: "Ethan Ray",
    role: "UI/UX Designer",
    subRole: "Product Design",
    dept: "Product Design",
    date: "19 Jun 2035",
    model: "Remote",
    in: "09:14 AM",
    out: "05:20 PM",
    duration: "8h 06m",
    overtime: "6m",
    status: "Late",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    correctionRequestsThisMonth: 1,
    comment: "Stuck in severe traffic block on central highway.",
    forwardedTo: "Marcus Brody",
    forwardedStatus: "Pending",
    hrApprovalStatus: "Pending"
  },
  {
    id: "EMP-0312",
    name: "Lina Armand",
    role: "Lab Analyst",
    subRole: "R&D",
    dept: "R&D",
    date: "19 Jun 2035",
    model: "On-Site",
    in: "--",
    out: "--",
    duration: "0h",
    overtime: "--",
    status: "On Leave",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    correctionRequestsThisMonth: 0,
    comment: "",
    forwardedTo: "",
    forwardedStatus: "None",
    hrApprovalStatus: "Approved"
  },
  {
    id: "EMP-0115",
    name: "Jacob Yuen",
    role: "Site Supervisor",
    subRole: "Operations",
    dept: "Operations",
    date: "19 Jun 2035",
    model: "On-Site",
    in: "--",
    out: "--",
    duration: "0h",
    overtime: "--",
    status: "Absent",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    correctionRequestsThisMonth: 0,
    comment: "Biometric swipe out of boundary line limit logs.",
    forwardedTo: "",
    forwardedStatus: "None",
    hrApprovalStatus: "None"
  },
  {
    id: "EMP-0289",
    name: "Mia Torres",
    role: "HR Officer",
    subRole: "Human Resources",
    dept: "Human Resources",
    date: "19 Jun 2035",
    model: "Hybrid",
    in: "08:59 AM",
    out: "05:10 PM",
    duration: "8h 11m",
    overtime: "11m",
    status: "On-Time",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    correctionRequestsThisMonth: 0,
    comment: "",
    forwardedTo: "",
    forwardedStatus: "None",
    hrApprovalStatus: "Approved"
  },
  {
    id: "EMP-0275",
    name: "Anya Rodriguez",
    role: "Graphic Designer",
    subRole: "Marketing",
    dept: "Marketing",
    date: "19 Jun 2035",
    model: "Remote",
    in: "09:02 AM",
    out: "05:12 PM",
    duration: "8h 10m",
    overtime: "10m",
    status: "On-Time",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    correctionRequestsThisMonth: 0,
    comment: "",
    forwardedTo: "",
    forwardedStatus: "None",
    hrApprovalStatus: "Approved"
  },
  {
    id: "EMP-0401",
    name: "Nora Chen",
    role: "Content Specialist",
    subRole: "Marketing",
    dept: "Marketing",
    date: "19 Jun 2035",
    model: "On-Site",
    in: "09:20 AM",
    out: "05:30 PM",
    duration: "8h 10m",
    overtime: "10m",
    status: "Late",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    correctionRequestsThisMonth: 1,
    comment: "Transit delay",
    forwardedTo: "Marcus Brody",
    forwardedStatus: "Pending",
    hrApprovalStatus: "Pending"
  }
];

export const initialLeaves: LeaveActivityItem[] = [
  {
    id: "EMP-0234",
    name: "Olivia Mason",
    role: "Marketing Executive",
    dept: "Marketing",
    type: "Annual Leave",
    submit: "18 Jun 2035",
    period: "25-27 June 2035",
    duration: "3 Days",
    reason: "Family wedding out of town",
    status: "Pending",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    remainingQuota: 14,
    totalQuota: 20,
    sickLeavesRemaining: 5,
    casualLeavesRemaining: 3,
    annualLeavesRemaining: 14,
    otherLeavesRemaining: 2,
    startDate: "2035-06-25",
    endDate: "2035-06-27",
    forwardedTo: "Marcus Brody",
    forwardedStatus: "Pending",
    comment: "",
  },
  {
    id: "EMP-0178",
    name: "Ethan Ray",
    role: "UI Designer",
    dept: "Product Design",
    type: "Sick Leave",
    submit: "19 Jun 2035",
    period: "20 Jun 2035",
    duration: "1 Day",
    reason: "Fever and recovery",
    status: "Pending",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    remainingQuota: 4,
    totalQuota: 10,
    sickLeavesRemaining: 4,
    casualLeavesRemaining: 3,
    annualLeavesRemaining: 12,
    otherLeavesRemaining: 2,
    startDate: "2035-06-20",
    endDate: "2035-06-20",
    forwardedTo: "Marcus Brody",
    forwardedStatus: "Pending",
    comment: "",
  },
  {
    id: "EMP-0275",
    name: "Anya Rodriguez",
    role: "Graphic Designer",
    dept: "Marketing",
    type: "Other Leave",
    submit: "17 Jun 2035",
    period: "19 Jun 2035",
    duration: "1 Day",
    reason: "Personal matter",
    status: "Pending",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    remainingQuota: 5,
    totalQuota: 20,
    sickLeavesRemaining: 4,
    casualLeavesRemaining: 1,
    annualLeavesRemaining: 4,
    otherLeavesRemaining: 2,
    startDate: "2035-06-19",
    endDate: "2035-06-19",
    forwardedTo: "Marcus Brody",
    forwardedStatus: "Pending",
    comment: "",
  },
  {
    id: "EMP-0312",
    name: "Lina Armand",
    role: "Lab Analyst",
    dept: "R&D",
    type: "Sick Leave",
    submit: "18 Jun 2035",
    period: "20-22 June 2035",
    duration: "3 Days",
    reason: "Doctor's note attached",
    status: "Approved",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    remainingQuota: 4,
    totalQuota: 20,
    sickLeavesRemaining: 4,
    casualLeavesRemaining: 3,
    annualLeavesRemaining: 10,
    otherLeavesRemaining: 3,
    startDate: "2035-06-20",
    endDate: "2035-06-22",
    forwardedTo: "",
    forwardedStatus: "None",
    comment: "Recommended to rest secondary recovery.",
  },
  {
    id: "EMP-0115",
    name: "Jacob Yuen",
    role: "Site Supervisor",
    dept: "Operations",
    type: "Annual Leave",
    submit: "10 Jun 2035",
    period: "17-21 June 2035",
    duration: "5 Days",
    reason: "Family trip",
    status: "Approved",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    remainingQuota: 12,
    totalQuota: 20,
    sickLeavesRemaining: 5,
    casualLeavesRemaining: 4,
    annualLeavesRemaining: 12,
    otherLeavesRemaining: 5,
    startDate: "2035-06-17",
    endDate: "2035-06-21",
    forwardedTo: "",
    forwardedStatus: "None",
    comment: "Have a safe holiday travel trip supervisors.",
  },
];

export const initialPayroll: PayrollItem[] = [
  {
    name: "Olivia Mason",
    id: "EMP-0234",
    role: "Marketing Executive",
    subRole: "Marketing",
    date: "28 Jun 35",
    salary: "$3,200",
    allowance: "$300",
    overtime: "$60",
    incen: "$150",
    deduct: "$120",
    total: "$3,590",
    status: "Paid",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
  },
  {
    name: "Ethan Ray",
    id: "EMP-0178",
    role: "UI/UX Designer",
    subRole: "Product Design",
    date: "28 Jun 35",
    salary: "$3,100",
    allowance: "$280",
    overtime: "$50",
    incen: "$100",
    deduct: "$130",
    total: "$3,400",
    status: "Paid",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
  },
  {
    name: "Mia Torres",
    id: "EMP-0289",
    role: "HR Officer",
    subRole: "Human Resources",
    date: "28 Jun 35",
    salary: "$3,200",
    allowance: "$300",
    overtime: "$65",
    incen: "$120",
    deduct: "$110",
    total: "$3,575",
    status: "Pending",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
  },
  {
    id: "EMP-0291",
    name: "Daniel Cheung",
    role: "Compliance Specialist",
    subRole: "Operations",
    date: "28 Jun 35",
    salary: "$2,900",
    allowance: "$250",
    overtime: "$45",
    incen: "$80",
    deduct: "$100",
    total: "$3,175",
    status: "Draft",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
  }
];

export const initialInvoices: InvoiceItem[] = [
  { id: "INV-2025-1042", date: "May 24, 2025", amount: "$99.00", status: "Paid" },
  { id: "INV-2025-0988", date: "Apr 24, 2025", amount: "$99.00", status: "Paid" },
  { id: "INV-2025-0811", date: "Mar 24, 2025", amount: "$99.00", status: "Paid" },
  { id: "INV-2025-0720", date: "Feb 24, 2025", amount: "$124.00", status: "Paid" }
];

export const initialPaymentMethods: PaymentMethod[] = [
  { id: 1, type: "visa", last4: "4242", expiry: "12/27", holder: "Sarah Jenkins", isDefault: true },
  { id: 2, type: "mastercard", last4: "8890", expiry: "09/26", holder: "Sarah Jenkins", isDefault: false }
];

// Initialize all collections database into localStorage helper
export function initDB(force = false) {
  if (force || !localStorage.getItem("db_initialized")) {
    localStorage.setItem("db_employees", JSON.stringify(initialEmployees));
    localStorage.setItem("db_departments", JSON.stringify(initialDepartments));
    localStorage.setItem("db_attendance", JSON.stringify(initialAttendance));
    localStorage.setItem("db_leaves", JSON.stringify(initialLeaves));
    localStorage.setItem("db_payroll", JSON.stringify(initialPayroll));
    localStorage.setItem("db_invoices", JSON.stringify(initialInvoices));
    localStorage.setItem("db_payment_methods", JSON.stringify(initialPaymentMethods));
    localStorage.setItem("db_schedules", JSON.stringify([]));
    localStorage.setItem("db_tasks", JSON.stringify([]));
    localStorage.setItem("db_activities", JSON.stringify([]));
    localStorage.setItem("db_satisfaction", JSON.stringify([]));
    localStorage.setItem("db_pending_reviews", JSON.stringify([]));
    localStorage.setItem("db_current_plan", "pro");
    localStorage.setItem("db_custom_alerts", JSON.stringify([]));
    localStorage.setItem("db_initialized", "true");
  }

  // Programmatic migration to clear historical cached entries from previous revisions on loaded web browsers
  if (!localStorage.getItem("db_clear_v6")) {
    localStorage.setItem("db_employees", JSON.stringify(initialEmployees));
    localStorage.setItem("db_payroll", JSON.stringify([]));
    localStorage.setItem("db_attendance", JSON.stringify([]));
    localStorage.setItem("db_leaves", JSON.stringify([]));
    localStorage.setItem("db_clear_v6", "true");
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("db_updated"));
  }

  // Admin panel seed: restore demo attendance/leave/payroll + departments for a full static Admin experience
  if (!localStorage.getItem("db_admin_seed_v1")) {
    localStorage.setItem("db_employees", JSON.stringify(initialEmployees));
    localStorage.setItem("db_departments", JSON.stringify(initialDepartments));
    localStorage.setItem("db_attendance", JSON.stringify(initialAttendance));
    localStorage.setItem("db_leaves", JSON.stringify(initialLeaves));
    localStorage.setItem("db_payroll", JSON.stringify(initialPayroll));
    localStorage.setItem("db_invoices", JSON.stringify(initialInvoices));
    localStorage.setItem("db_payment_methods", JSON.stringify(initialPaymentMethods));
    localStorage.setItem("db_admin_seed_v1", "true");
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("db_updated"));
  }

  if (!localStorage.getItem("db_departments")) {
    localStorage.setItem("db_departments", JSON.stringify(initialDepartments));
  }

  // Manager panel: refresh employees with managerId hierarchy + team leave/attendance
  if (!localStorage.getItem("db_manager_seed_v1")) {
    localStorage.setItem("db_employees", JSON.stringify(initialEmployees));
    localStorage.setItem("db_attendance", JSON.stringify(initialAttendance));
    localStorage.setItem("db_leaves", JSON.stringify(initialLeaves));
    localStorage.setItem("db_manager_seed_v1", "true");
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("db_updated"));
  }
}

// Low-level reactive helper getter-setters
export function getCollection<T>(key: string, defaultVal: T): T {
  const data = localStorage.getItem(key);
  if (!data) return defaultVal;
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    return defaultVal;
  }
}

export function saveCollection<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
  // Use a dedicated event only — do not fake the browser `storage` event
  // (that caused cascading refreshes / freezes across mounted listeners).
  window.dispatchEvent(new Event("db_updated"));
}
