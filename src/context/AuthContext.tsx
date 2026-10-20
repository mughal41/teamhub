import * as React from "react";
import {
  type RoleId,
  type ModuleKey,
  type AccessLevel,
  ROLE_DEFINITIONS,
  getAccess,
  can,
  canView,
  canApprove,
  canManage,
  isOwnOnly,
  canAccessNav,
  canAccessPath,
  type NavModule,
} from "../lib/rbac";

const SESSION_KEY = "teamhub_auth_session";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roleId: RoleId;
  roleLabel: string;
  avatar: string;
  title: string;
}

/**
 * Static demo accounts — names match seed employees in db.ts
 * so own/team content filters work on Leave, Attendance, Payroll, etc.
 */
export const DEMO_USERS: AuthUser[] = [
  {
    id: "u-employee",
    name: "Ethan Ray",
    email: "employee@teamhub.corp",
    roleId: "employee",
    roleLabel: "Employee",
    title: "UI Designer",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXcgEFuMNH2WfVpKSkgHkLECe1-hlQ0L9nl5ENytbZVUEW86K5l0_mna02bcC9tmRPbl-07SmLI5j_1r3ZHvrMBH6CD4kB-_5E-T2OAl45cTJ1qmSS_yuJ3xk82VJF17FliOHCnrOl_Q2p-mxWY0neh_xUDCcG4Qk1iJw5FWsQ8G6lPDt2cLc6wkE08FjkhU0qVbP3iVxOoM2oFtk1KBpMk_hkLr1VsbXccQdVkOlnRpK30VI7QYYr3xzhv_6-w2MHnuh5pjbwFSw",
  },
  {
    id: "u-senior",
    name: "Daniel Cheung",
    email: "senior@teamhub.corp",
    roleId: "senior",
    roleLabel: "Senior",
    title: "Senior Developer",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXcgEFuMNH2WfVpKSkgHkLECe1-hlQ0L9nl5ENytbZVUEW86K5l0_mna02bcC9tmRPbl-07SmLI5j_1r3ZHvrMBH6CD4kB-_5E-T2OAl45cTJ1qmSS_yuJ3xk82VJF17FliOHCnrOl_Q2p-mxWY0neh_xUDCcG4Qk1iJw5FWsQ8G6lPDt2cLc6wkE08FjkhU0qVbP3iVxOoM2oFtk1KBpMk_hkLr1VsbXccQdVkOlnRpK30VI7QYYr3xzhv_6-w2MHnuh5pjbwFSw",
  },
  {
    id: "u-lead",
    name: "Sara Kim",
    email: "lead@teamhub.corp",
    roleId: "team_lead",
    roleLabel: "Team lead",
    title: "Engineering Lead",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXcgEFuMNH2WfVpKSkgHkLECe1-hlQ0L9nl5ENytbZVUEW86K5l0_mna02bcC9tmRPbl-07SmLI5j_1r3ZHvrMBH6CD4kB-_5E-T2OAl45cTJ1qmSS_yuJ3xk82VJF17FliOHCnrOl_Q2p-mxWY0neh_xUDCcG4Qk1iJw5FWsQ8G6lPDt2cLc6wkE08FjkhU0qVbP3iVxOoM2oFtk1KBpMk_hkLr1VsbXccQdVkOlnRpK30VI7QYYr3xzhv_6-w2MHnuh5pjbwFSw",
  },
  {
    id: "u-hr",
    name: "Olivia Mason",
    email: "hr@teamhub.corp",
    roleId: "hr_manager",
    roleLabel: "HR manager",
    title: "HR Manager",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXcgEFuMNH2WfVpKSkgHkLECe1-hlQ0L9nl5ENytbZVUEW86K5l0_mna02bcC9tmRPbl-07SmLI5j_1r3ZHvrMBH6CD4kB-_5E-T2OAl45cTJ1qmSS_yuJ3xk82VJF17FliOHCnrOl_Q2p-mxWY0neh_xUDCcG4Qk1iJw5FWsQ8G6lPDt2cLc6wkE08FjkhU0qVbP3iVxOoM2oFtk1KBpMk_hkLr1VsbXccQdVkOlnRpK30VI7QYYr3xzhv_6-w2MHnuh5pjbwFSw",
  },
  {
    id: "u-finance",
    name: "Farah Nabila",
    email: "finance@teamhub.corp",
    roleId: "finance_manager",
    roleLabel: "Finance manager",
    title: "Finance Manager",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXcgEFuMNH2WfVpKSkgHkLECe1-hlQ0L9nl5ENytbZVUEW86K5l0_mna02bcC9tmRPbl-07SmLI5j_1r3ZHvrMBH6CD4kB-_5E-T2OAl45cTJ1qmSS_yuJ3xk82VJF17FliOHCnrOl_Q2p-mxWY0neh_xUDCcG4Qk1iJw5FWsQ8G6lPDt2cLc6wkE08FjkhU0qVbP3iVxOoM2oFtk1KBpMk_hkLr1VsbXccQdVkOlnRpK30VI7QYYr3xzhv_6-w2MHnuh5pjbwFSw",
  },
  {
    id: "u-admin",
    name: "Lina Armand",
    email: "admin@teamhub.corp",
    roleId: "system_admin",
    roleLabel: "System admin",
    title: "System Administrator",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXcgEFuMNH2WfVpKSkgHkLECe1-hlQ0L9nl5ENytbZVUEW86K5l0_mna02bcC9tmRPbl-07SmLI5j_1r3ZHvrMBH6CD4kB-_5E-T2OAl45cTJ1qmSS_yuJ3xk82VJF17FliOHCnrOl_Q2p-mxWY0neh_xUDCcG4Qk1iJw5FWsQ8G6lPDt2cLc6wkE08FjkhU0qVbP3iVxOoM2oFtk1KBpMk_hkLr1VsbXccQdVkOlnRpK30VI7QYYr3xzhv_6-w2MHnuh5pjbwFSw",
  },
];

interface SessionPayload {
  userId: string;
  email: string;
  roleId: RoleId;
  loggedInAt: string;
  rememberMe: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (user: AuthUser, rememberMe?: boolean) => void;
  loginAsRole: (roleId: RoleId, rememberMe?: boolean) => void;
  logout: () => void;
  /** Switch role while staying logged in (demo helper) */
  switchRole: (roleId: RoleId) => void;
  access: (module: ModuleKey) => AccessLevel;
  can: (module: ModuleKey, minLevel?: AccessLevel) => boolean;
  canView: (module: ModuleKey) => boolean;
  canApprove: (module: ModuleKey) => boolean;
  canManage: (module: ModuleKey) => boolean;
  isOwnOnly: (module: ModuleKey) => boolean;
  canAccessNav: (nav: NavModule) => boolean;
  canAccessPath: (pathname: string) => boolean;
  roles: typeof ROLE_DEFINITIONS;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

function readSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionPayload;
    const demo = DEMO_USERS.find(
      (u) => u.id === parsed.userId || u.roleId === parsed.roleId
    );
    if (demo) return demo;
    // Legacy session: map old role strings
    if (parsed.email) {
      const byEmail = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === parsed.email.toLowerCase()
      );
      if (byEmail) return byEmail;
    }
    return DEMO_USERS.find((u) => u.roleId === "hr_manager") ?? null;
  } catch {
    return null;
  }
}

function writeSession(user: AuthUser, rememberMe: boolean) {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    roleId: user.roleId,
    loggedInAt: new Date().toISOString(),
    rememberMe,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  // Keep legacy key in sync for older modals
  localStorage.setItem(
    "hrms_user_role",
    user.roleId === "hr_manager" || user.roleId === "system_admin"
      ? "admin"
      : user.roleId === "team_lead" || user.roleId === "senior"
        ? "supervisor"
        : "employee"
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    setUser(readSession());
    setIsReady(true);
  }, []);

  const login = React.useCallback((next: AuthUser, rememberMe = false) => {
    writeSession(next, rememberMe);
    setUser(next);
  }, []);

  const loginAsRole = React.useCallback(
    (roleId: RoleId, rememberMe = false) => {
      const demo = DEMO_USERS.find((u) => u.roleId === roleId);
      if (demo) login(demo, rememberMe);
    },
    [login]
  );

  const logout = React.useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("hrms_user_role");
    setUser(null);
  }, []);

  const switchRole = React.useCallback(
    (roleId: RoleId) => {
      const demo = DEMO_USERS.find((u) => u.roleId === roleId);
      if (demo && user) {
        writeSession(demo, true);
        setUser(demo);
      }
    },
    [user]
  );

  const roleId = user?.roleId ?? "employee";

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isReady,
      login,
      loginAsRole,
      logout,
      switchRole,
      access: (module) => getAccess(roleId, module),
      can: (module, min) => can(roleId, module, min ?? "view"),
      canView: (module) => canView(roleId, module),
      canApprove: (module) => canApprove(roleId, module),
      canManage: (module) => canManage(roleId, module),
      isOwnOnly: (module) => isOwnOnly(roleId, module),
      canAccessNav: (nav) => canAccessNav(roleId, nav),
      canAccessPath: (pathname) => canAccessPath(roleId, pathname),
      roles: ROLE_DEFINITIONS,
    }),
    [user, isReady, login, loginAsRole, logout, switchRole, roleId]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
