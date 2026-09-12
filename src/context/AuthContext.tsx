import * as React from "react";
import { createContext, useContext, useState, useMemo, useCallback } from "react";
import {
  type AccessRole,
  type PublicAuthUser,
  authenticate,
  registerUser,
  loadSession,
  saveSession,
  clearSession,
  updateUserProfile,
  changeUserPassword,
} from "../lib/auth";

export type { AccessRole };

interface AuthContextType {
  user: PublicAuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessRole: AccessRole | null;
  hasRole: (...roles: AccessRole[]) => boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    organizationName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (
    patch: Partial<Pick<PublicAuthUser, "name" | "avatar" | "roleTitle">>
  ) => Promise<void>;
  changePassword: (currentPassword: string, nextPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicAuthUser | null>(() => loadSession());
  const [isLoading] = useState(false);

  const login = async (email: string, password: string) => {
    const next = authenticate(email, password);
    if (!next) {
      throw new Error("Invalid credentials. Please try again.");
    }
    saveSession(next);
    setUser(next);
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    organizationName: string
  ) => {
    const result = registerUser({
      email,
      password,
      firstName,
      lastName,
      organizationName,
    });
    if ("error" in result) {
      throw new Error(result.error);
    }
    saveSession(result.user);
    setUser(result.user);
  };

  const logout = async () => {
    clearSession();
    setUser(null);
  };

  const updateProfile = async (
    patch: Partial<Pick<PublicAuthUser, "name" | "avatar" | "roleTitle">>
  ) => {
    if (!user) throw new Error("Not signed in.");
    const next = updateUserProfile(user.id, patch);
    if (!next) throw new Error("Could not update profile.");
    setUser(next);
  };

  const changePassword = async (currentPassword: string, nextPassword: string) => {
    if (!user) throw new Error("Not signed in.");
    const result = changeUserPassword(user.id, currentPassword, nextPassword);
    if ("error" in result) throw new Error(result.error);
  };

  const accessRole = user?.accessRole ?? null;

  const hasRole = useCallback(
    (...roles: AccessRole[]) => {
      if (!accessRole) return false;
      return roles.includes(accessRole);
    },
    [accessRole]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      accessRole,
      hasRole,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
    }),
    [user, isLoading, accessRole, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
