const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname || "localhost";
    return `http://${hostname}:8000/api/v1`;
  }
  return "http://localhost:8000/api/v1";
};

const API_BASE_URL = getApiBaseUrl();

export interface UserPermissions {
  view_dashboard: boolean;
  manage_employees: boolean;
  manage_attendance: boolean;
  approve_leaves: boolean;
  manage_payroll: boolean;
  manage_recruitment: boolean;
  manage_settings: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  organization: string | null;
  organization_name: string | null;
  role: string | null;
  role_name: string | null;
  permissions: UserPermissions;
  two_factor_enabled: boolean;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: UserProfile;
}

export interface RegisterResponse {
  message: string;
  tokens: AuthTokens;
  user: UserProfile;
}

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || data.non_field_errors?.[0] || "Invalid credentials. Please try again.");
  }

  return data;
}

export async function registerApi(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  organizationName: string
): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      organization_name: organizationName,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.email?.[0] || data.password?.[0] || data.detail || "Registration failed. Please check your inputs.";
    throw new Error(errorMsg);
  }

  return data;
}

export async function getMeApi(accessToken: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/auth/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error("Session expired. Please log in again.");
  }

  return data;
}

export async function logoutApi(accessToken: string, refreshToken: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
  } catch (err) {
    // Ignore error on logout teardown
  }
}
