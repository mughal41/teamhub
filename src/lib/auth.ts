export type AccessRole = "admin" | "manager" | "employee";

export type AuthUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  accessRole: AccessRole;
  employeeId: string;
  roleTitle: string;
  avatar: string;
};

export type PublicAuthUser = Omit<AuthUser, "password">;

const SESSION_KEY = "teamhub_session_user";
const DEMO_PASSWORD = "TeamHub@123";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

const SEED_USERS: AuthUser[] = [
  {
    id: "usr-admin-1",
    email: "davis.levin@teamhub.corp",
    password: DEMO_PASSWORD,
    name: "Davis Levin",
    accessRole: "admin",
    employeeId: "EMP-0001",
    roleTitle: "HR Admin",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "usr-mgr-1",
    email: "marcus.brody@teamhub.corp",
    password: DEMO_PASSWORD,
    name: "Marcus Brody",
    accessRole: "manager",
    employeeId: "EMP-0100",
    roleTitle: "Marketing Manager",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "usr-emp-1",
    email: "olivia.chen@teamhub.corp",
    password: DEMO_PASSWORD,
    name: "Olivia Mason",
    accessRole: "employee",
    employeeId: "EMP-0234",
    roleTitle: "Marketing Executive",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

function loadUsers(): AuthUser[] {
  const raw = localStorage.getItem("teamhub_auth_users");
  if (!raw) {
    localStorage.setItem("teamhub_auth_users", JSON.stringify(SEED_USERS));
    return [...SEED_USERS];
  }
  try {
    const parsed = JSON.parse(raw) as AuthUser[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...SEED_USERS];
  } catch {
    return [...SEED_USERS];
  }
}

function saveUsers(users: AuthUser[]) {
  localStorage.setItem("teamhub_auth_users", JSON.stringify(users));
}

export function toPublicUser(user: AuthUser): PublicAuthUser {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

export function authenticate(email: string, password: string): PublicAuthUser | null {
  const users = loadUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
  return found ? toPublicUser(found) : null;
}

export function registerUser(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
}): { user: PublicAuthUser } | { error: string } {
  const users = loadUsers();
  const email = input.email.trim().toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === email)) {
    return { error: "An account with this email already exists." };
  }

  const user: AuthUser = {
    id: `usr-${Date.now()}`,
    email,
    password: input.password,
    name: `${input.firstName.trim()} ${input.lastName.trim()}`.trim(),
    accessRole: "employee",
    employeeId: `EMP-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    roleTitle: `${input.organizationName.trim() || "TeamHub"} Member`,
    avatar: DEFAULT_AVATAR,
  };

  users.push(user);
  saveUsers(users);
  return { user: toPublicUser(user) };
}

export function loadSession(): PublicAuthUser | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<PublicAuthUser> & {
      first_name?: string;
      last_name?: string;
      avatar_url?: string | null;
      role_name?: string | null;
    };

    // Normalize legacy / incomplete session shapes
    const email = parsed.email || "";
    const seed = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const name =
      parsed.name ||
      [parsed.first_name, parsed.last_name].filter(Boolean).join(" ").trim() ||
      seed?.name ||
      "TeamHub User";
    const accessRole =
      parsed.accessRole ||
      seed?.accessRole ||
      (String(parsed.role_name || parsed.roleTitle || "").toLowerCase().includes("manager")
        ? "manager"
        : String(parsed.role_name || parsed.roleTitle || "").toLowerCase().includes("admin") ||
            String(parsed.role_name || "").toLowerCase().includes("hr")
          ? "admin"
          : "employee");

    const normalized: PublicAuthUser = {
      id: parsed.id || seed?.id || `usr-${Date.now()}`,
      email: email || seed?.email || "",
      name: seed?.name || name,
      accessRole: seed?.accessRole || accessRole,
      employeeId: seed?.employeeId || parsed.employeeId || "EMP-0000",
      roleTitle: seed?.roleTitle || parsed.roleTitle || parsed.role_name || "User",
      avatar: parsed.avatar || parsed.avatar_url || seed?.avatar || DEFAULT_AVATAR,
    };
    saveSession(normalized);
    return normalized;
  } catch {
    return null;
  }
}

export function saveSession(user: PublicAuthUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("teamhub_access_token");
  localStorage.removeItem("teamhub_refresh_token");
}

export function roleLabel(role: AccessRole | null | undefined): string {
  switch (role) {
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "employee":
      return "Employee";
    default:
      return "User";
  }
}

export function updateUserProfile(
  userId: string,
  patch: Partial<Pick<PublicAuthUser, "name" | "avatar" | "roleTitle">>
): PublicAuthUser | null {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return null;
  users[idx] = { ...users[idx], ...patch };
  saveUsers(users);
  const publicUser = toPublicUser(users[idx]);
  const session = loadSession();
  if (session?.id === userId) {
    saveSession(publicUser);
  }
  return publicUser;
}

export function verifyUserPassword(userId: string, password: string): boolean {
  const users = loadUsers();
  const user = users.find((u) => u.id === userId);
  return !!user && user.password === password;
}

export function changeUserPassword(
  userId: string,
  currentPassword: string,
  nextPassword: string
): { ok: true } | { error: string } {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return { error: "User not found." };
  if (users[idx].password !== currentPassword) {
    return { error: "Current password is incorrect." };
  }
  if (nextPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  users[idx] = { ...users[idx], password: nextPassword };
  saveUsers(users);
  return { ok: true };
}

export { DEMO_PASSWORD };
