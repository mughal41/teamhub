const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname || "localhost";
    return `http://${hostname}:8000/api/v1`;
  }
  return "http://localhost:8000/api/v1";
};

const API_BASE_URL = getApiBaseUrl();

function getAuthHeaders() {
  const token = localStorage.getItem("teamhub_access_token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export interface DashboardStats {
  total_employees: number;
  overall_attendance_pct: number;
  pending_leaves_count: number;
  pending_payrolls_count: number;
  avg_performance_rating?: number;
  active_jobs_count?: number;
  total_applicants_count?: number;
  interviews_count?: number;
}

export async function getDashboardStatsApi(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE_URL}/employees/dashboard-stats/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard stats.");
  return res.json();
}

export interface Department {
  id: string;
  name: string;
  head_employee_id: string | null;
  employee_count: number;
  created_at: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface LeaveStat {
  label: string;
  val: string | number;
  total: string | number;
  color: string;
  unit: string;
}

export interface PerformanceOverview {
  percentage: number;
  trend: string;
  trend_desc: string;
  monthly_scores: Array<{ month: string; score: number }>;
}

export interface HoursLogged {
  total_weekly: string;
  daily_data: Array<{ day: string; hours: number }>;
}

export interface DocumentItem {
  name: string;
  size: string;
  type: string;
}

export interface InternalNote {
  title: string;
  date: string;
  text: string;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export interface Employee {
  id: string;
  name: string;
  role_title: string;
  sub_role: string;
  department: string | null;
  department_name: string | null;
  organization: string | null;
  organization_name: string | null;
  employment_type: string;
  work_model: string;
  status: string;
  avatar: string | null;
  join_date: string;
  base_salary: string | number;
  birth_date?: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  office_location?: string;
  social_links?: SocialLinks;
  emergency_contacts?: EmergencyContact[];
  leave_stats?: LeaveStat[];
  performance_overview?: PerformanceOverview;
  hours_logged?: HoursLogged;
  documents?: DocumentItem[];
  internal_notes?: InternalNote[];
  created_at: string;
}

export async function getDepartmentsApi(): Promise<Department[]> {
  const res = await fetch(`${API_BASE_URL}/departments/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch departments.");
  return res.json();
}

export async function createDepartmentApi(name: string): Promise<Department> {
  const res = await fetch(`${API_BASE_URL}/departments/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create department.");
  return res.json();
}

export async function getEmployeesApi(params?: {
  q?: string;
  dept?: string;
  model?: string;
  status?: string;
}): Promise<Employee[]> {
  const url = new URL(`${API_BASE_URL}/employees/`);
  if (params?.q) url.searchParams.append("q", params.q);
  if (params?.dept && params.dept !== "All") url.searchParams.append("dept", params.dept);
  if (params?.model && params.model !== "All") url.searchParams.append("model", params.model);
  if (params?.status && params.status !== "All") url.searchParams.append("status", params.status);

  const res = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch employee roster.");
  return res.json();
}

export async function getEmployeeByIdApi(id: string): Promise<Employee> {
  const res = await fetch(`${API_BASE_URL}/employees/${id}/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch employee profile.");
  return res.json();
}

export async function createEmployeeApi(payload: {
  name: string;
  role_title: string;
  sub_role?: string;
  department_id?: string | null;
  employment_type?: string;
  work_model?: string;
  status?: string;
  base_salary?: number;
  avatar?: string;
}): Promise<Employee> {
  const res = await fetch(`${API_BASE_URL}/employees/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to create employee profile.");
  }
  return res.json();
}

export async function updateEmployeeApi(id: string, payload: Partial<Employee>): Promise<Employee> {
  const res = await fetch(`${API_BASE_URL}/employees/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update employee.");
  return res.json();
}

export async function deleteEmployeeApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/employees/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete employee.");
}
