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

export interface LeaveQuota {
  id: string;
  employee: string;
  employee_name: string;
  year: number;
  annual_total: number;
  annual_remaining: number;
  sick_total: number;
  sick_remaining: number;
  casual_total: number;
  casual_remaining: number;
  other_total: number;
  other_remaining: number;
}

export interface LeaveRequest {
  id: string;
  employee: string;
  employee_id: string;
  employee_name: string;
  employee_avatar: string | null;
  employee_role: string;
  department_name: string | null;
  organization: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  reason: string;
  status: string;
  created_at: string;
}

export async function getLeaveQuotasApi(): Promise<LeaveQuota[]> {
  const res = await fetch(`${API_BASE_URL}/leaves/quotas/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch leave quotas.");
  return res.json();
}

export async function getLeaveRequestsApi(params?: {
  type?: string;
  status?: string;
}): Promise<LeaveRequest[]> {
  const url = new URL(`${API_BASE_URL}/leaves/`);
  if (params?.type && params.type !== "All") url.searchParams.append("type", params.type);
  if (params?.status && params.status !== "All") url.searchParams.append("status", params.status);

  const res = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch leave requests.");
  return res.json();
}

export async function createLeaveRequestApi(payload: {
  leave_type: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  reason: string;
}): Promise<LeaveRequest> {
  const res = await fetch(`${API_BASE_URL}/leaves/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to submit leave request.");
  return res.json();
}

export async function updateLeaveStatusApi(
  id: string,
  status: "Approved" | "Rejected"
): Promise<LeaveRequest> {
  const res = await fetch(`${API_BASE_URL}/leaves/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update leave status.");
  return res.json();
}
