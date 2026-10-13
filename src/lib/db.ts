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
  email?: string;
  phone?: string;
  location?: string;
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
  // Employee reason category & explanation
  reasonCategory?: "Machine Error" | "Power Issue" | "Other" | string;
  // Extended fields for 2-punch and 4-punch attendance correction & 2-stage verification
  requestedIn?: string;
  requestedOut?: string;
  breakOut?: string;
  breakIn?: string;
  requestedBreakOut?: string;
  requestedBreakIn?: string;
  supervisorName?: string;
  supervisorRole?: string;
  supervisorRemark?: string;
  supervisorReviewedAt?: string;
  adminRemark?: string;
  hrReviewedAt?: string;
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
  attachment?: string;
  attachmentName?: string;
  supervisorName?: string;
  supervisorRole?: string;
  supervisorStatus?: "Pending" | "Approved" | "Rejected";
  supervisorComment?: string;
  supervisorTimestamp?: string;
  adminComment?: string;
  adminTimestamp?: string;
  isHalfDay?: boolean;
  paidType?: "Paid" | "Unpaid";
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

export interface PayComponent {
  id: string;
  name: string;
  category: "earnings" | "deductions";
  type: "fixed" | "percentage";
  basis?: "basic" | "gross" | "flat";
  defaultAmount?: number;
  percentage?: number;
  isRecurring: boolean;
  allowOverride: boolean;
  description?: string;
}

export interface PayStructure {
  id: string;
  name: string;
  description: string;
  applicableScope: string; // e.g., "All Departments", "Product & Engineering", "Marketing & Sales", "Operations"
  effectiveDate: string; // e.g., "01 Jan 2035"
  status: "Active" | "Inactive";
  assignedCount?: number;
  assignedEmployeeIds: string[];
  assignedDepartments?: string[];
  earnings: PayComponent[];
  deductions: PayComponent[];
}

export interface EmployeeCompensationOverride {
  employeeId: string;
  structureId: string;
  baseSalaryOverride?: number;
  componentOverrides: {
    componentId: string;
    overrideAmount: number;
    reason: string;
    effectiveDate: string;
  }[];
  customNotes?: string;
}

export const initialPayStructures: PayStructure[] = [
  {
    id: "STRUC-001",
    name: "Standard Corporate Staff",
    description: "Default salary and benefits framework for corporate staff with standard housing and transport allowances.",
    applicableScope: "Executive & Corporate",
    effectiveDate: "01 Jan 2035",
    status: "Active",
    assignedEmployeeIds: ["EMP-0234", "EMP-0289", "EMP-0159"],
    assignedDepartments: ["Executive Marketing", "Human Resources", "HR"],
    earnings: [
      {
        id: "comp-base",
        name: "Basic Salary",
        category: "earnings",
        type: "fixed",
        isRecurring: true,
        allowOverride: true,
        description: "Standard monthly base rate gross"
      },
      {
        id: "comp-house",
        name: "House Rent Allowance",
        category: "earnings",
        type: "percentage",
        basis: "basic",
        percentage: 70,
        defaultAmount: 210,
        isRecurring: true,
        allowOverride: true,
        description: "Housing allowance subsidy"
      },
      {
        id: "comp-trans",
        name: "Transport Allowance",
        category: "earnings",
        type: "fixed",
        defaultAmount: 90,
        isRecurring: true,
        allowOverride: true,
        description: "Commuter transport and transit stipend"
      },
      {
        id: "comp-med",
        name: "Medical Allowance",
        category: "earnings",
        type: "fixed",
        defaultAmount: 50,
        isRecurring: true,
        allowOverride: true,
        description: "Annual outpatient healthcare stipend"
      }
    ],
    deductions: [
      {
        id: "comp-tax",
        name: "Payroll Withholding Tax",
        category: "deductions",
        type: "percentage",
        basis: "gross",
        percentage: 8,
        isRecurring: true,
        allowOverride: false,
        description: "Statutory income tax withholding bracket"
      },
      {
        id: "comp-soc",
        name: "Social Security Contribution",
        category: "deductions",
        type: "percentage",
        basis: "basic",
        percentage: 4,
        isRecurring: true,
        allowOverride: false,
        description: "Statutory social protection and disability insurance"
      },
      {
        id: "comp-ret",
        name: "Retirement & Pension Fund",
        category: "deductions",
        type: "percentage",
        basis: "basic",
        percentage: 3,
        isRecurring: true,
        allowOverride: false,
        description: "Employee pension and retirement provident fund"
      }
    ]
  },
  {
    id: "STRUC-002",
    name: "Design & Product Engineering",
    description: "Compensation structure for product designers and technical developers including remote work stipend.",
    applicableScope: "Product Design & R&D",
    effectiveDate: "01 Jan 2035",
    status: "Active",
    assignedEmployeeIds: ["EMP-0178", "EMP-0312", "EMP-0275"],
    assignedDepartments: ["Product Design", "R&D", "Marketing"],
    earnings: [
      {
        id: "comp-base",
        name: "Basic Salary",
        category: "earnings",
        type: "fixed",
        isRecurring: true,
        allowOverride: true,
        description: "Standard monthly base rate gross"
      },
      {
        id: "comp-house",
        name: "House Rent Allowance",
        category: "earnings",
        type: "percentage",
        basis: "basic",
        percentage: 70,
        defaultAmount: 200,
        isRecurring: true,
        allowOverride: true,
        description: "Housing allowance subsidy"
      },
      {
        id: "comp-trans",
        name: "Remote Work & Connectivity Stipend",
        category: "earnings",
        type: "fixed",
        defaultAmount: 80,
        isRecurring: true,
        allowOverride: true,
        description: "High-speed broadband and home office connectivity"
      }
    ],
    deductions: [
      {
        id: "comp-tax",
        name: "Payroll Withholding Tax",
        category: "deductions",
        type: "percentage",
        basis: "gross",
        percentage: 8,
        isRecurring: true,
        allowOverride: false,
        description: "Statutory income tax withholding bracket"
      },
      {
        id: "comp-soc",
        name: "Social Security Contribution",
        category: "deductions",
        type: "percentage",
        basis: "basic",
        percentage: 4,
        isRecurring: true,
        allowOverride: false,
        description: "Statutory social protection and disability insurance"
      }
    ]
  },
  {
    id: "STRUC-003",
    name: "Operations & Facilities Field Staff",
    description: "Tailored structure for site supervisors and field operations with site travel and meal allowance.",
    applicableScope: "Operations",
    effectiveDate: "01 Feb 2035",
    status: "Active",
    assignedEmployeeIds: ["EMP-0115", "EMP-0291"],
    assignedDepartments: ["Operations"],
    earnings: [
      {
        id: "comp-base",
        name: "Basic Salary",
        category: "earnings",
        type: "fixed",
        isRecurring: true,
        allowOverride: true,
        description: "Standard monthly base rate gross"
      },
      {
        id: "comp-house",
        name: "House Rent Allowance",
        category: "earnings",
        type: "percentage",
        basis: "basic",
        percentage: 65,
        defaultAmount: 220,
        isRecurring: true,
        allowOverride: true,
        description: "Housing allowance subsidy"
      },
      {
        id: "comp-site",
        name: "Site Fuel & Transit Allowance",
        category: "earnings",
        type: "fixed",
        defaultAmount: 100,
        isRecurring: true,
        allowOverride: true,
        description: "Field travel and vehicle reimbursement allowance"
      }
    ],
    deductions: [
      {
        id: "comp-tax",
        name: "Payroll Withholding Tax",
        category: "deductions",
        type: "percentage",
        basis: "gross",
        percentage: 8,
        isRecurring: true,
        allowOverride: false,
        description: "Statutory income tax withholding bracket"
      },
      {
        id: "comp-ret",
        name: "Retirement & Pension Fund",
        category: "deductions",
        type: "percentage",
        basis: "basic",
        percentage: 3,
        isRecurring: true,
        allowOverride: false,
        description: "Employee pension and retirement provident fund"
      }
    ]
  },
  {
    id: "STRUC-004",
    name: "Customer Support & Internship Track",
    description: "Streamlined stipend and benefit structure for customer service associates and interns.",
    applicableScope: "Customer Service",
    effectiveDate: "01 Mar 2035",
    status: "Active",
    assignedEmployeeIds: ["EMP-0356", "EMP-0320"],
    assignedDepartments: ["Customer Service"],
    earnings: [
      {
        id: "comp-base",
        name: "Basic Stipend",
        category: "earnings",
        type: "fixed",
        isRecurring: true,
        allowOverride: true,
        description: "Monthly customer support associate base pay"
      },
      {
        id: "comp-comm",
        name: "Communication & Headset Allowance",
        category: "earnings",
        type: "fixed",
        defaultAmount: 50,
        isRecurring: true,
        allowOverride: true,
        description: "Telephony and communications stipend"
      }
    ],
    deductions: [
      {
        id: "comp-tax",
        name: "Payroll Withholding Tax",
        category: "deductions",
        type: "percentage",
        basis: "gross",
        percentage: 5,
        isRecurring: true,
        allowOverride: false,
        description: "Entry-level tax withholding bracket"
      }
    ]
  }
];

export const initialOverrides: EmployeeCompensationOverride[] = [
  {
    employeeId: "EMP-0178",
    structureId: "STRUC-002",
    baseSalaryOverride: 3100,
    componentOverrides: [
      {
        componentId: "comp-house",
        overrideAmount: 280,
        reason: "Contractual senior designer allowance amendment",
        effectiveDate: "01 Mar 2035"
      }
    ],
    customNotes: "Senior visual styling designer allowance tier approved."
  }
];

// Initial default seed datasets
export const initialEmployees: Employee[] = [
  {
    id: "EMP-0234",
    name: "Olivia Mason",
    role: "Marketing",
    dept: "Executive Marketing",
    type: "Full-Time",
    model: "Hybrid",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    joinDate: "12 Jan 2034",
    email: "olivia.mason@teamhub.io",
    phone: "+1 (555) 234-8901",
    location: "Austin, TX"
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
    email: "ethan.ray@teamhub.io",
    phone: "+1 (555) 312-9844",
    location: "Seattle, WA"
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
    email: "lina.armand@teamhub.io",
    phone: "+1 (555) 872-4410",
    location: "Boston, MA"
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
    email: "jacob.yuen@teamhub.io",
    phone: "+1 (555) 439-0129",
    location: "Denver, CO"
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
    email: "mia.torres@teamhub.io",
    phone: "+1 (555) 762-3391",
    location: "Chicago, IL"
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
    email: "sara.kim@teamhub.io",
    phone: "+1 (555) 914-7723",
    location: "San Jose, CA"
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
    email: "daniel.cheung@teamhub.io",
    phone: "+1 (555) 608-1145",
    location: "Atlanta, GA"
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
    email: "anya.rodriguez@teamhub.io",
    phone: "+1 (555) 521-8890",
    location: "New York, NY"
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
    email: "kelvin.yu@teamhub.io",
    phone: "+1 (555) 347-6612",
    location: "Dallas, TX"
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
    email: "farah.nabila@teamhub.io",
    phone: "+1 (555) 490-2234",
    location: "Austin, TX"
  }
];

export const initialAttendance: AttendanceRecord[] = [
  {
    id: "EMP-0234",
    name: "Olivia Mason",
    role: "Marketing",
    subRole: "Executive Marketing",
    dept: "Executive Marketing",
    date: "19 Jun 2035",
    model: "Hybrid",
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
    role: "UI Designer",
    subRole: "Product Design",
    dept: "Product Design",
    date: "19 Jun 2035",
    model: "Remote",
    in: "09:14 AM",
    out: "05:20 PM",
    duration: "8h 6m",
    overtime: "6m",
    status: "Late",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    correctionRequestsThisMonth: 1,
    reasonCategory: "Machine Error",
    comment: "Biometric scanner was not responding when I arrived. My actual arrival time was 09:00 AM.",
    forwardedTo: "Marcus Brody",
    forwardedStatus: "Pending",
    hrApprovalStatus: "Pending",
    requestedIn: "09:00 AM",
    requestedOut: "05:20 PM",
    breakOut: "01:15 PM",
    breakIn: "02:00 PM",
    requestedBreakOut: "01:00 PM",
    requestedBreakIn: "01:45 PM",
    supervisorName: "Marcus Brody",
    supervisorRole: "Marketing & Sales Manager",
  },
  {
    id: "EMP-0312",
    name: "Lina Armand",
    role: "Lab Analyst",
    subRole: "R&D",
    dept: "R&D",
    date: "19 Jun 2035",
    model: "On-Site",
    in: "–",
    out: "",
    duration: "–",
    overtime: "–",
    status: "On Leave",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    correctionRequestsThisMonth: 0,
    comment: "Approved annual leave.",
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
    in: "–",
    out: "",
    duration: "–",
    overtime: "–",
    status: "Absent",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    correctionRequestsThisMonth: 0,
    comment: "Unexcused absence.",
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
    id: "EMP-0356",
    name: "Sara Kim",
    role: "Customer Support",
    subRole: "Customer Service",
    dept: "Customer Service",
    date: "19 Jun 2035",
    model: "On-Site",
    in: "09:02 AM",
    out: "05:00 PM",
    duration: "7h 58m",
    overtime: "–",
    status: "Late",
    avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    correctionRequestsThisMonth: 0,
    comment: "",
    forwardedTo: "",
    forwardedStatus: "None",
    hrApprovalStatus: "Approved"
  },
  {
    id: "EMP-0291",
    name: "Daniel Cheung",
    role: "Compliance Specialist",
    subRole: "Operations",
    dept: "Operations",
    date: "19 Jun 2035",
    model: "Remote",
    in: "08:48 AM",
    out: "05:00 PM",
    duration: "8h 12m",
    overtime: "12m",
    status: "On-Time",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
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
    in: "09:10 AM",
    out: "05:15 PM",
    duration: "8h 5m",
    overtime: "5m",
    status: "Late",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    correctionRequestsThisMonth: 0,
    comment: "",
    forwardedTo: "",
    forwardedStatus: "None",
    hrApprovalStatus: "Approved"
  },
  {
    id: "EMP-0159",
    name: "Kelvin Yu",
    role: "Training Coordinator",
    subRole: "HR",
    dept: "HR",
    date: "19 Jun 2035",
    model: "On-Site",
    in: "08:45 AM",
    out: "04:50 PM",
    duration: "8h 5m",
    overtime: "–",
    status: "On-Time",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    correctionRequestsThisMonth: 0,
    comment: "",
    forwardedTo: "",
    forwardedStatus: "None",
    hrApprovalStatus: "Approved"
  },
  {
    id: "EMP-0320",
    name: "Farah Nabila",
    role: "Customer Experience Lead",
    subRole: "Customer Service",
    dept: "Customer Service",
    date: "19 Jun 2035",
    model: "Hybrid",
    in: "09:00 AM",
    out: "05:05 PM",
    duration: "8h 5m",
    overtime: "5m",
    status: "On-Time",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    correctionRequestsThisMonth: 0,
    comment: "",
    forwardedTo: "",
    forwardedStatus: "None",
    hrApprovalStatus: "Approved"
  }
];

export const initialLeaves: LeaveActivityItem[] = [
  {
    id: "EMP-0312",
    name: "Lina Armand",
    role: "Lab Analyst",
    dept: "R&D",
    type: "Sick Leave",
    submit: "18 Jun 2035",
    period: "20–22 June 2035",
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
    forwardedTo: "Jane Doe",
    forwardedStatus: "Approved",
    comment: "Medical certificate verified by clinical records.",
    attachment: "https://example.com/medical_armand.pdf",
    attachmentName: "doctor_clearance_note_armand.pdf",
    supervisorName: "Jane Doe",
    supervisorRole: "HR Lead",
    supervisorStatus: "Approved",
    supervisorComment: "Verified diagnosis certificate provided by regional medical center.",
    supervisorTimestamp: "18 Jun 2035, 11:45 AM",
    adminComment: "Final medical leave allowance granted.",
    adminTimestamp: "18 Jun 2035, 02:15 PM",
    paidType: "Paid"
  },
  {
    id: "EMP-0115",
    name: "Jacob Yuen",
    role: "Site Supervisor",
    dept: "Operations",
    type: "Annual Leave",
    submit: "10 Jun 2035",
    period: "17–21 June 2035",
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
    forwardedTo: "John Smith",
    forwardedStatus: "Approved",
    comment: "Have a safe holiday travel trip supervisors.",
    supervisorName: "John Smith",
    supervisorRole: "Operations Head",
    supervisorStatus: "Approved",
    supervisorComment: "Shift delegation confirmed with deputy field supervisor.",
    supervisorTimestamp: "10 Jun 2035, 03:20 PM",
    adminComment: "Approved within standard annual quota.",
    adminTimestamp: "11 Jun 2035, 09:10 AM",
    paidType: "Paid"
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
    forwardedTo: "Marcus Aurelius",
    forwardedStatus: "Approved",
    comment: "",
    supervisorName: "Marcus Aurelius",
    supervisorRole: "Product Director",
    supervisorStatus: "Approved",
    supervisorComment: "Sprint deliverables for June 19 have been rescheduled with the design team.",
    supervisorTimestamp: "17 Jun 2035, 04:40 PM",
    paidType: "Paid"
  },
  {
    id: "EMP-0234",
    name: "Olivia Mason",
    role: "Marketing",
    dept: "Executive Marketing",
    type: "Annual Leave",
    submit: "02 Jun 2035",
    period: "05–07 Jun 2035",
    duration: "3 Days",
    reason: "Conference attendance",
    status: "Approved",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    remainingQuota: 9,
    totalQuota: 20,
    sickLeavesRemaining: 5,
    casualLeavesRemaining: 3,
    annualLeavesRemaining: 9,
    otherLeavesRemaining: 2,
    startDate: "2035-06-05",
    endDate: "2035-06-07",
    forwardedTo: "Jane Doe",
    forwardedStatus: "Approved",
    comment: "Conference pass documentation registered.",
    supervisorName: "Jane Doe",
    supervisorRole: "HR Lead",
    supervisorStatus: "Approved",
    supervisorComment: "Verified executive marketing conference registration pass.",
    supervisorTimestamp: "02 Jun 2035, 01:15 PM",
    adminComment: "Annual professional development leave authorized.",
    adminTimestamp: "03 Jun 2035, 10:00 AM",
    paidType: "Paid"
  },
  {
    id: "EMP-0356",
    name: "Sara Kim",
    role: "Customer Support",
    dept: "Customer Service",
    type: "Sick Leave",
    submit: "14 Jun 2035",
    period: "15–16 Jun 2035",
    duration: "2 Days",
    reason: "Fever",
    status: "Approved",
    avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    remainingQuota: 8,
    totalQuota: 20,
    sickLeavesRemaining: 6,
    casualLeavesRemaining: 2,
    annualLeavesRemaining: 8,
    otherLeavesRemaining: 3,
    startDate: "2035-06-15",
    endDate: "2035-06-16",
    forwardedTo: "Farah Nabila",
    forwardedStatus: "Approved",
    comment: "Rest well and recuperate.",
    supervisorName: "Farah Nabila",
    supervisorRole: "Customer Experience Lead",
    supervisorStatus: "Approved",
    supervisorComment: "Support ticket routing reassigned across morning shift queue.",
    supervisorTimestamp: "14 Jun 2035, 08:30 AM",
    adminComment: "Approved medical leave.",
    adminTimestamp: "14 Jun 2035, 11:00 AM",
    paidType: "Paid"
  },
  {
    id: "EMP-0291",
    name: "Daniel Cheung",
    role: "Compliance Specialist",
    dept: "Operations",
    type: "Annual Leave",
    submit: "01 Jun 2035",
    period: "10–12 Jun 2035",
    duration: "3 Days",
    reason: "Holiday",
    status: "Pending",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    remainingQuota: 11,
    totalQuota: 20,
    sickLeavesRemaining: 5,
    casualLeavesRemaining: 3,
    annualLeavesRemaining: 11,
    otherLeavesRemaining: 2,
    startDate: "2035-06-10",
    endDate: "2035-06-12",
    forwardedTo: "John Smith",
    forwardedStatus: "Pending",
    comment: "",
    supervisorName: "John Smith",
    supervisorRole: "Operations Head",
    supervisorStatus: "Pending",
    supervisorComment: "Confirming coverage for regulatory reporting cycle.",
    paidType: "Paid"
  },
  {
    id: "EMP-0289",
    name: "Mia Torres",
    role: "HR Officer",
    dept: "Human Resources",
    type: "Annual Leave",
    submit: "06 Jun 2035",
    period: "09–10 Jun 2035",
    duration: "2 Days",
    reason: "Personal retreat",
    status: "Approved",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    remainingQuota: 14,
    totalQuota: 20,
    sickLeavesRemaining: 5,
    casualLeavesRemaining: 4,
    annualLeavesRemaining: 14,
    otherLeavesRemaining: 4,
    startDate: "2035-06-09",
    endDate: "2035-06-10",
    forwardedTo: "Jane Doe",
    forwardedStatus: "Approved",
    comment: "Personal leave approved.",
    supervisorName: "Jane Doe",
    supervisorRole: "HR Lead",
    supervisorStatus: "Approved",
    supervisorComment: "HR coverage arranged with Kelvin Yu.",
    supervisorTimestamp: "06 Jun 2035, 05:00 PM",
    adminComment: "Direct administrative sign-off.",
    adminTimestamp: "07 Jun 2035, 09:30 AM",
    paidType: "Paid"
  },
  {
    id: "EMP-0178",
    name: "Ethan Ray",
    role: "UI Designer",
    dept: "Product Design",
    type: "Casual Leave",
    submit: "05 Jun 2035",
    period: "07 Jun 2035",
    duration: "1 Day",
    reason: "—",
    status: "Rejected",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    remainingQuota: 7,
    totalQuota: 20,
    sickLeavesRemaining: 5,
    casualLeavesRemaining: 2,
    annualLeavesRemaining: 7,
    otherLeavesRemaining: 2,
    startDate: "2035-06-07",
    endDate: "2035-06-07",
    forwardedTo: "Marcus Aurelius",
    forwardedStatus: "Rejected",
    comment: "Design sprint freeze day; non-emergency leave cannot be accommodated.",
    supervisorName: "Marcus Aurelius",
    supervisorRole: "Product Director",
    supervisorStatus: "Rejected",
    supervisorComment: "Mandatory all-hands UI review session on June 7.",
    supervisorTimestamp: "05 Jun 2035, 02:15 PM",
    adminComment: "Confirmed supervisor rejection due to operational freeze.",
    adminTimestamp: "06 Jun 2035, 09:00 AM",
    paidType: "Paid"
  },
  {
    id: "EMP-0320",
    name: "Farah Nabila",
    role: "Customer Experience Lead",
    dept: "Customer Service",
    type: "Sick Leave",
    submit: "11 Jun 2035",
    period: "12 Jun 2035",
    duration: "1 Day",
    reason: "Headache",
    status: "Approved",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    remainingQuota: 9,
    totalQuota: 20,
    sickLeavesRemaining: 5,
    casualLeavesRemaining: 3,
    annualLeavesRemaining: 9,
    otherLeavesRemaining: 3,
    startDate: "2035-06-12",
    endDate: "2035-06-12",
    forwardedTo: "Jane Doe",
    forwardedStatus: "Approved",
    comment: "Approved medical single-day exemption.",
    supervisorName: "Jane Doe",
    supervisorRole: "HR Lead",
    supervisorStatus: "Approved",
    supervisorComment: "Notified department early morning.",
    supervisorTimestamp: "11 Jun 2035, 08:15 AM",
    adminComment: "Approved single-day sick leave.",
    adminTimestamp: "11 Jun 2035, 10:30 AM",
    paidType: "Paid"
  },
  {
    id: "EMP-0159",
    name: "Kelvin Yu",
    role: "Training Coordinator",
    dept: "HR",
    type: "Other Leave",
    submit: "13 Jun 2035",
    period: "14 Jun 2035",
    duration: "1 Day",
    reason: "Volunteer program",
    status: "Rejected",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
    remainingQuota: 10,
    totalQuota: 20,
    sickLeavesRemaining: 5,
    casualLeavesRemaining: 3,
    annualLeavesRemaining: 10,
    otherLeavesRemaining: 2,
    startDate: "2035-06-14",
    endDate: "2035-06-14",
    forwardedTo: "Jane Doe",
    forwardedStatus: "Rejected",
    comment: "Quarterly onboarding seminar scheduled on June 14 requires full facilitation.",
    supervisorName: "Jane Doe",
    supervisorRole: "HR Lead",
    supervisorStatus: "Rejected",
    supervisorComment: "Key onboarding workshop requires trainer presence on-site.",
    supervisorTimestamp: "13 Jun 2035, 01:45 PM",
    adminComment: "Endorsed line lead rejection.",
    adminTimestamp: "13 Jun 2035, 04:00 PM",
    paidType: "Unpaid"
  }
];

export const initialPayroll: PayrollItem[] = [
  {
    name: "Olivia Mason",
    id: "EMP-0234",
    role: "Marketing",
    subRole: "Executive Marketing",
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
    role: "UI Designer",
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
    status: "Paid",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
  },
  {
    name: "Daniel Cheung",
    id: "EMP-0291",
    role: "Compliance Specialist",
    subRole: "Operations",
    date: "28 Jun 35",
    salary: "$2,900",
    allowance: "$250",
    overtime: "$45",
    incen: "$80",
    deduct: "$100",
    total: "$3,175",
    status: "Paid",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
  },
  {
    name: "Farah Nabila",
    id: "EMP-0320",
    role: "Customer Experience Lead",
    subRole: "Customer Service",
    date: "28 Jun 35",
    salary: "$3,000",
    allowance: "$270",
    overtime: "$55",
    incen: "$90",
    deduct: "$125",
    total: "$3,290",
    status: "Paid",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
  },
  {
    name: "Lina Armand",
    id: "EMP-0312",
    role: "Lab Analyst",
    subRole: "R&D",
    date: "28 Jun 35",
    salary: "$2,000",
    allowance: "$150",
    overtime: "—",
    incen: "$60",
    deduct: "$90",
    total: "$2,120",
    status: "Paid",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
  },
  {
    name: "Jacob Yuen",
    id: "EMP-0115",
    role: "Site Supervisor",
    subRole: "Operations",
    date: "28 Jun 35",
    salary: "$3,300",
    allowance: "$320",
    overtime: "$70",
    incen: "$110",
    deduct: "$140",
    total: "$3,660",
    status: "Paid",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
  },
  {
    name: "Sara Kim",
    id: "EMP-0356",
    role: "Customer Support",
    subRole: "Customer Service",
    date: "28 Jun 35",
    salary: "$800",
    allowance: "$50",
    overtime: "—",
    incen: "—",
    deduct: "$20",
    total: "$830",
    status: "Paid",
    avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
  },
  {
    name: "Anya Rodriguez",
    id: "EMP-0275",
    role: "Graphic Designer",
    subRole: "Marketing",
    date: "28 Jun 35",
    salary: "$2,200",
    allowance: "$180",
    overtime: "$40",
    incen: "$70",
    deduct: "$85",
    total: "$2,405",
    status: "Paid",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
  },
  {
    name: "Kelvin Yu",
    id: "EMP-0159",
    role: "Training Coordinator",
    subRole: "HR",
    date: "28 Jun 35",
    salary: "$2,500",
    allowance: "$200",
    overtime: "$55",
    incen: "$100",
    deduct: "$100",
    total: "$2,755",
    status: "Paid",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
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
    localStorage.setItem("db_attendance", JSON.stringify(initialAttendance));
    localStorage.setItem("db_leaves", JSON.stringify([]));
    localStorage.setItem("db_payroll", JSON.stringify([]));
    localStorage.setItem("db_invoices", JSON.stringify([]));
    localStorage.setItem("db_payment_methods", JSON.stringify([]));
    localStorage.setItem("db_schedules", JSON.stringify([]));
    localStorage.setItem("db_tasks", JSON.stringify([]));
    localStorage.setItem("db_activities", JSON.stringify([]));
    localStorage.setItem("db_satisfaction", JSON.stringify([]));
    localStorage.setItem("db_pending_reviews", JSON.stringify([]));
    localStorage.setItem("db_currentPlan", "pro");
    localStorage.setItem("db_custom_alerts", JSON.stringify([]));
    localStorage.setItem("db_initialized", "true");
  }

  // Programmatic migration to seed attendance records matching design
  if (!localStorage.getItem("db_attendance_v7")) {
    localStorage.setItem("db_attendance", JSON.stringify(initialAttendance));
    localStorage.setItem("db_attendance_v7", "true");
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("db_updated"));
  }

  // Programmatic migration to seed payroll records matching design
  if (!localStorage.getItem("db_payroll_v1") || JSON.parse(localStorage.getItem("db_payroll") || "[]").length === 0) {
    localStorage.setItem("db_payroll", JSON.stringify(initialPayroll));
    localStorage.setItem("db_payroll_v1", "true");
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("db_updated"));
  }

  // Programmatic migration to seed pay structures and overrides
  if (!localStorage.getItem("db_pay_structures_v1") || JSON.parse(localStorage.getItem("db_pay_structures") || "[]").length === 0) {
    localStorage.setItem("db_pay_structures", JSON.stringify(initialPayStructures));
    localStorage.setItem("db_comp_overrides", JSON.stringify(initialOverrides));
    localStorage.setItem("db_pay_structures_v1", "true");
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("db_updated"));
  }

  // Programmatic migration to seed leaves records matching Figma design
  if (!localStorage.getItem("db_leaves_v4") || JSON.parse(localStorage.getItem("db_leaves") || "[]").length < 8) {
    localStorage.setItem("db_leaves", JSON.stringify(initialLeaves));
    localStorage.setItem("db_leaves_v4", "true");
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
  // Broadcast local storage update
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("db_updated"));
}
