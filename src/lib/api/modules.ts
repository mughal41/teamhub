import { apiRequest, unwrapList } from "./client";

type ListPayload<T = Record<string, unknown>> = T[] | { results: T[] };

export async function listLeaves() {
  return unwrapList(await apiRequest<ListPayload>("/leaves/"));
}

export async function createLeave(payload: Record<string, unknown>) {
  return apiRequest("/leaves/", { method: "POST", body: payload });
}

export async function decideLeave(leaveId: number, status: "Approved" | "Rejected", comment?: string) {
  return apiRequest(`/leaves/${leaveId}/decide/`, {
    method: "PATCH",
    body: { status, comment },
  });
}

export async function listAttendance() {
  return unwrapList(await apiRequest<ListPayload>("/attendance/records/"));
}

export async function createAttendance(payload: Record<string, unknown>) {
  return apiRequest("/attendance/records/", { method: "POST", body: payload });
}

export async function clockAttendance(type: "in" | "out") {
  return apiRequest("/attendance/clock/", { method: "POST", body: { type } });
}

export async function createAttendanceCorrection(payload: {
  date: string;
  clockIn: string;
  clockOut: string;
  reason: string;
}) {
  return apiRequest("/attendance/corrections/", { method: "POST", body: payload });
}

export async function updateAttendance(recordId: number, payload: Record<string, unknown>) {
  return apiRequest(`/attendance/records/${recordId}/`, { method: "PATCH", body: payload });
}

export async function decideCorrection(id: number, status: "Approved" | "Rejected") {
  return apiRequest(`/attendance/corrections/${id}/`, {
    method: "PATCH",
    body: { status },
  });
}

export async function listPayroll() {
  return unwrapList(await apiRequest<ListPayload>("/payroll/"));
}

export async function updatePayslip(payslipId: number, payload: Record<string, unknown>) {
  return apiRequest(`/payroll/${payslipId}/`, { method: "PATCH", body: payload });
}

export async function listPerformance() {
  return unwrapList(await apiRequest<ListPayload>("/performance/"));
}

export async function upsertPerformance(payload: Record<string, unknown>, id?: number) {
  if (id) {
    return apiRequest(`/performance/${id}/`, { method: "PATCH", body: payload });
  }
  return apiRequest("/performance/", { method: "POST", body: payload });
}

export async function listCalendarEvents() {
  return unwrapList(await apiRequest<ListPayload>("/calendar/events/"));
}

export async function createCalendarEvent(payload: Record<string, unknown>) {
  return apiRequest("/calendar/events/", { method: "POST", body: payload });
}

export async function updateCalendarEvent(id: number, payload: Record<string, unknown>) {
  return apiRequest(`/calendar/events/${id}/`, { method: "PATCH", body: payload });
}

export async function deleteCalendarEvent(id: number) {
  await apiRequest(`/calendar/events/${id}/`, { method: "DELETE" });
}

export async function listMessages(folder = "Inbox") {
  return unwrapList(
    await apiRequest<ListPayload>(`/inbox/messages/?folder=${encodeURIComponent(folder)}`)
  );
}

export async function sendMessage(payload: {
  toEmail: string;
  subject: string;
  body: string;
}) {
  return apiRequest("/inbox/messages/", { method: "POST", body: payload });
}

export async function listNotifications() {
  return unwrapList(await apiRequest<ListPayload>("/inbox/notifications/"));
}

export async function listJobs() {
  return unwrapList(await apiRequest<ListPayload>("/recruitment/jobs/"));
}

export async function listCandidates() {
  return unwrapList(await apiRequest<ListPayload>("/recruitment/candidates/"));
}

export async function createJob(payload: Record<string, unknown>) {
  return apiRequest("/recruitment/jobs/", { method: "POST", body: payload });
}

export async function createCandidate(payload: Record<string, unknown>) {
  return apiRequest("/recruitment/candidates/", { method: "POST", body: payload });
}
