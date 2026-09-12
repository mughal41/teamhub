import { apiRequest, unwrapList } from "./client";

export type ApiEmployee = {
  id: string;
  name: string;
  role: string;
  dept: string;
  type: string;
  model: string;
  status: string;
  avatar: string;
  joinDate: string;
  managerId?: string | null;
  departmentId?: number | null;
};

export async function listEmployees() {
  return unwrapList(await apiRequest<ApiEmployee[] | { results: ApiEmployee[] }>("/employees/"));
}

export async function getEmployee(code: string) {
  return apiRequest<ApiEmployee>(`/employees/${encodeURIComponent(code)}/`);
}

export async function createEmployee(payload: Partial<ApiEmployee> & { id: string; name: string }) {
  return apiRequest<ApiEmployee>("/employees/", { method: "POST", body: payload });
}

export async function updateEmployee(code: string, payload: Partial<ApiEmployee>) {
  return apiRequest<ApiEmployee>(`/employees/${encodeURIComponent(code)}/`, {
    method: "PATCH",
    body: payload,
  });
}

export async function deleteEmployee(code: string) {
  await apiRequest(`/employees/${encodeURIComponent(code)}/`, { method: "DELETE" });
}
