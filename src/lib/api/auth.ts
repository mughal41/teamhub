import type { AccessRole, PublicAuthUser } from "@/src/lib/auth";
import { apiRequest, saveTokens, clearTokens } from "./client";
import { saveCollection } from "@/src/lib/db";
import { listDepartments } from "./departments";
import { listEmployees } from "./employees";
import {
  listAttendance,
  listCalendarEvents,
  listCandidates,
  listJobs,
  listLeaves,
  listMessages,
  listNotifications,
  listPayroll,
  listPerformance,
} from "./modules";

export type ApiUser = {
  id: number | string;
  email: string;
  name: string;
  accessRole: AccessRole;
  employeeId: string;
  roleTitle: string;
  avatar: string;
};

export type AuthResponse = {
  user: ApiUser;
  tokens: { access: string; refresh: string };
};

export function toPublicUser(user: ApiUser): PublicAuthUser {
  return {
    id: String(user.id),
    email: user.email,
    name: user.name,
    accessRole: user.accessRole,
    employeeId: user.employeeId || "",
    roleTitle: user.roleTitle || "",
    avatar: user.avatar || "",
  };
}

export async function apiLogin(email: string, password: string): Promise<PublicAuthUser> {
  const data = await apiRequest<AuthResponse>("/auth/login/", {
    method: "POST",
    auth: false,
    body: { email, password },
  });
  saveTokens(data.tokens);
  const user = toPublicUser(data.user);
  await syncCollectionsFromApi();
  return user;
}

export async function apiRegister(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
}): Promise<PublicAuthUser> {
  const data = await apiRequest<AuthResponse>("/auth/register/", {
    method: "POST",
    auth: false,
    body: input,
  });
  saveTokens(data.tokens);
  const user = toPublicUser(data.user);
  await syncCollectionsFromApi();
  return user;
}

export async function apiMe(): Promise<PublicAuthUser> {
  const data = await apiRequest<ApiUser>("/auth/me/");
  return toPublicUser(data);
}

export async function apiUpdateProfile(
  patch: Partial<Pick<PublicAuthUser, "name" | "avatar" | "roleTitle">>
): Promise<PublicAuthUser> {
  const data = await apiRequest<ApiUser>("/auth/me/", {
    method: "PATCH",
    body: patch,
  });
  return toPublicUser(data);
}

export async function apiChangePassword(currentPassword: string, nextPassword: string) {
  await apiRequest<{ ok: boolean }>("/auth/change-password/", {
    method: "POST",
    body: { currentPassword, nextPassword },
  });
}

export function apiLogout() {
  clearTokens();
}

/** Pull role-scoped backend data into localStorage so Admin/Manager/Employee pages stay filled. */
export async function syncCollectionsFromApi() {
  try {
    const [
      employees,
      leaves,
      attendance,
      payroll,
      departments,
      performance,
      events,
      messages,
      notifications,
      jobs,
      candidates,
    ] = await Promise.all([
      listEmployees().catch(() => []),
      listLeaves().catch(() => []),
      listAttendance().catch(() => []),
      listPayroll().catch(() => []),
      listDepartments().catch(() => []),
      listPerformance().catch(() => []),
      listCalendarEvents().catch(() => []),
      listMessages("Inbox").catch(() => []),
      listNotifications().catch(() => []),
      listJobs().catch(() => []),
      listCandidates().catch(() => []),
    ]);

    saveCollection("db_leaves", leaves);
    saveCollection("db_attendance", attendance);
    saveCollection("db_payroll", payroll);
    saveCollection(
      "db_departments",
      departments.map((d) => ({
        ...d,
        employeeCount: (d as { employeeCount?: number }).employeeCount ?? 0,
      }))
    );
    saveCollection("db_manager_reviews", performance);
    // Flatten latest performance scores onto employees for Admin Performance page
    const byEmployee = new Map<string, Record<string, unknown>>();
    for (const review of performance as Record<string, unknown>[]) {
      const code = String(review.employeeId || "");
      if (!code) continue;
      byEmployee.set(code, {
        teamwork: Number(review.behavior || 0),
        quality: Number(review.reliability || 0),
        problem: Number(review.taskCompletion || 0),
        time: Number(review.punctuality || 0),
        score: Math.round(Number(review.average || 0) * 20),
        feedback: review.feedback,
        reviewId: review.id,
        lastMonthly: review.updated_at,
      });
    }
    saveCollection(
      "db_employees",
      (employees as Record<string, unknown>[]).map((emp) => {
        const scores = byEmployee.get(String(emp.id || ""));
        return scores ? { ...emp, ...scores } : emp;
      })
    );
    saveCollection(
      "db_schedules",
      (events as Record<string, unknown>[]).map((ev) => ({
        ...ev,
        category: ev.category || ev.type || "Meeting",
        loc: ev.loc || ev.location || "",
        note: ev.note || ev.withWhom || "",
      }))
    );
    saveCollection(
      "db_emails",
      messages.map((m: Record<string, unknown>, idx: number) => ({
        id: m.id ?? idx,
        fromId: m.fromId,
        sender: m.fromName || "TeamHub",
        fromName: m.fromName || "TeamHub",
        fromAvatar: m.fromAvatar,
        email: "",
        subject: m.subject,
        preview: m.preview,
        title: m.subject || "(No Subject)",
        snippet: m.preview || "",
        body: m.body,
        time: m.time,
        date: "Today",
        unread: m.unread,
        starred: m.starred,
        avatar: m.fromAvatar,
        label: "bg-[#35BFA3]",
        tagName: "HR",
        category: "Inbox",
        initials: String(m.fromName || "TH")
          .split(" ")
          .map((part) => part[0] || "")
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      }))
    );
    // Keep employee performance page in sync with manager reviews key
    saveCollection("db_manager_team_reviews", performance);
    saveCollection("db_notifications", notifications);
    saveCollection("db_jobs", jobs);
    saveCollection("db_candidates", candidates);
    saveCollection("db_applicants", candidates);
  } catch {
    // Keep UI usable even if sync partially fails
  }
}
