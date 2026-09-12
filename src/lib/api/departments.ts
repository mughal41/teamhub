import { apiRequest, unwrapList } from "./client";
import type { Department } from "@/src/lib/db";

export async function listDepartments() {
  return unwrapList(await apiRequest<Department[] | { results: Department[] }>("/departments/"));
}

export async function createDepartment(payload: {
  name: string;
  code?: string;
  headName?: string;
  description?: string;
  status?: string;
  employeeCount?: number;
}) {
  return apiRequest<Department>("/departments/", { method: "POST", body: payload });
}

export async function updateDepartment(
  pk: number,
  payload: Partial<{
    name: string;
    code: string;
    headName: string;
    description: string;
    status: string;
    employeeCount: number;
  }>
) {
  return apiRequest<Department>(`/departments/${pk}/`, { method: "PATCH", body: payload });
}

export async function deleteDepartment(pk: number) {
  await apiRequest(`/departments/${pk}/`, { method: "DELETE" });
}
