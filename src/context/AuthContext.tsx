import * as React from "react";
import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import {
  type AccessRole,
  type PublicAuthUser,
  loadSession,
  saveSession,
  clearSession,
} from "../lib/auth";
import {
  apiLogin,
  apiRegister,
  apiMe,
  apiUpdateProfile,
  apiChangePassword,
  apiLogout,
  syncCollectionsFromApi,
} from "../lib/api/auth";
import { getAccessToken } from "../lib/api/client";

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
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicAuthUser | null>(() => loadSession());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const token = getAccessToken();
      if (!token) {
        if (!cancelled) setIsLoading(false);
        return;
      }
      try {
        const me = await apiMe();
        if (cancelled) return;
        saveSession(me);
        setUser(me);
        await syncCollectionsFromApi();
      } catch {
        if (!cancelled) {
          apiLogout();
          clearSession();
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const next = await apiLogin(email, password);
    saveSession(next);
    setUser(next);
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      organizationName: string
    ) => {
      const next = await apiRegister({
        email,
        password,
        firstName,
        lastName,
        organizationName,
      });
      saveSession(next);
      setUser(next);
    },
    []
  );

  const logout = useCallback(async () => {
    apiLogout();
    clearSession();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<Pick<PublicAuthUser, "name" | "avatar" | "roleTitle">>) => {
      const next = await apiUpdateProfile(patch);
      saveSession(next);
      setUser(next);
    },
    []
  );

  const changePassword = useCallback(async (currentPassword: string, nextPassword: string) => {
    await apiChangePassword(currentPassword, nextPassword);
  }, []);

  const refreshData = useCallback(async () => {
    await syncCollectionsFromApi();
  }, []);

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
      refreshData,
    }),
    [
      user,
      isLoading,
      accessRole,
      hasRole,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      refreshData,
    ]
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
