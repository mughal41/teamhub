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

export interface JobPosting {
  id: string;
  organization: string;
  title: string;
  department: string | null;
  department_name: string | null;
  location: string;
  job_type: string;
  status: string;
  applicants_count: number;
  created_at: string;
}

export interface Applicant {
  id: string;
  organization: string;
  job_posting: string;
  job_title: string;
  name: string;
  email: string;
  stage: string;
  rating: number;
  applied_date: string;
}

export async function getJobPostingsApi(params?: { status?: string }): Promise<JobPosting[]> {
  const url = new URL(`${API_BASE_URL}/recruitment/jobs/`);
  if (params?.status && params.status !== "All") url.searchParams.append("status", params.status);

  const res = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch job postings.");
  return res.json();
}

export async function createJobPostingApi(data: {
  title: string;
  department?: string;
  location?: string;
  job_type?: string;
  status?: string;
}): Promise<JobPosting> {
  const res = await fetch(`${API_BASE_URL}/recruitment/jobs/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create job posting.");
  return res.json();
}

export async function getApplicantsApi(params?: { stage?: string; job_id?: string }): Promise<Applicant[]> {
  const url = new URL(`${API_BASE_URL}/recruitment/applicants/`);
  if (params?.stage && params.stage !== "All") url.searchParams.append("stage", params.stage);
  if (params?.job_id) url.searchParams.append("job_id", params.job_id);

  const res = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch applicants.");
  return res.json();
}

export async function updateApplicantStageApi(
  id: string,
  stage: "Applied" | "Screening" | "Interview" | "Offered" | "Rejected"
): Promise<Applicant> {
  const res = await fetch(`${API_BASE_URL}/recruitment/applicants/${id}/stage/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ stage }),
  });
  if (!res.ok) throw new Error("Failed to update applicant stage.");
  return res.json();
}
