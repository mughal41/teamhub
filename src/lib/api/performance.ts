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

export interface PerformanceReview {
  id: string;
  employee: string;
  employee_id: string;
  employee_name: string;
  employee_avatar: string | null;
  employee_role: string;
  department_name: string | null;
  organization: string;
  reviewer_name: string;
  review_cycle: string;
  rating: number;
  goals_completed: number;
  total_goals: number;
  feedback: string;
  status: string;
  created_at: string;
}

export async function getPerformanceReviewsApi(params?: {
  cycle?: string;
  status?: string;
}): Promise<PerformanceReview[]> {
  const url = new URL(`${API_BASE_URL}/performance/`);
  if (params?.cycle && params.cycle !== "All") url.searchParams.append("cycle", params.cycle);
  if (params?.status && params.status !== "All") url.searchParams.append("status", params.status);

  const res = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch performance reviews.");
  return res.json();
}

export async function updateReviewStatusApi(
  id: string,
  status: "Pending" | "Submitted" | "Approved"
): Promise<PerformanceReview> {
  const res = await fetch(`${API_BASE_URL}/performance/${id}/status/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update review status.");
  return res.json();
}

export async function createPerformanceReviewApi(data: {
  employee: string;
  reviewer_name?: string;
  review_cycle?: string;
  rating: number;
  goals_completed: number;
  total_goals: number;
  feedback: string;
}): Promise<PerformanceReview> {
  const res = await fetch(`${API_BASE_URL}/performance/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create performance review.");
  return res.json();
}
