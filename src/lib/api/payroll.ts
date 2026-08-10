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

export interface PayrollRecord {
  id: string;
  employee: string;
  employee_id: string;
  employee_name: string;
  employee_avatar: string | null;
  employee_role: string;
  department_name: string | null;
  organization: string;
  pay_period: string;
  base_salary: string | number;
  allowance: string | number;
  overtime_pay: string | number;
  incentives: string | number;
  deductions: string | number;
  total_net_pay: string | number;
  status: string;
  payment_date: string | null;
  created_at: string;
}

export async function getPayrollRecordsApi(params?: {
  period?: string;
  status?: string;
}): Promise<PayrollRecord[]> {
  const url = new URL(`${API_BASE_URL}/payroll/`);
  if (params?.period && params.period !== "All") url.searchParams.append("period", params.period);
  if (params?.status && params.status !== "All") url.searchParams.append("status", params.status);

  const res = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch payroll records.");
  return res.json();
}

export async function processPayrollApi(payrollIds?: string[]): Promise<{ processed_count: number; status: string }> {
  const res = await fetch(`${API_BASE_URL}/payroll/process/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ ids: payrollIds || [] }),
  });
  if (!res.ok) throw new Error("Failed to process payroll.");
  return res.json();
}

export async function updatePayrollStatusApi(
  id: string,
  status: "Paid" | "Pending" | "Draft"
): Promise<PayrollRecord> {
  const res = await fetch(`${API_BASE_URL}/payroll/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update payroll status.");
  return res.json();
}
