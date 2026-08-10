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

export interface AttendanceRecord {
  id: string;
  employee: string;
  employee_name: string;
  employee_avatar: string | null;
  employee_role: string;
  department_name: string | null;
  organization: string;
  date: string;
  work_model: string;
  clock_in: string | null;
  clock_out: string | null;
  duration_minutes: number;
  overtime_minutes: number;
  status: string;
  correction_requests_count: number;
  comment: string;
  forwarded_status: string;
  hr_approval_status: string;
  created_at: string;
}

export async function getAttendanceApi(params?: {
  date?: string;
  status?: string;
  model?: string;
}): Promise<AttendanceRecord[]> {
  const url = new URL(`${API_BASE_URL}/attendance/`);
  if (params?.date) url.searchParams.append("date", params.date);
  if (params?.status && params.status !== "All") url.searchParams.append("status", params.status);
  if (params?.model && params.model !== "All") url.searchParams.append("model", params.model);

  const res = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch attendance records.");
  return res.json();
}

export async function clockInApi(): Promise<AttendanceRecord> {
  const res = await fetch(`${API_BASE_URL}/attendance/clock-in/`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to clock in.");
  return res.json();
}

export async function clockOutApi(): Promise<AttendanceRecord> {
  const res = await fetch(`${API_BASE_URL}/attendance/clock-out/`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to clock out.");
  return res.json();
}

export async function updateAttendanceApprovalApi(
  id: string,
  payload: { hr_approval_status?: string; forwarded_status?: string }
): Promise<AttendanceRecord> {
  const res = await fetch(`${API_BASE_URL}/attendance/${id}/approval/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update approval status.");
  return res.json();
}
