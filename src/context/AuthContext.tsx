import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  loginApi,
  registerApi,
  getMeApi,
  logoutApi,
} from "../lib/api/auth";

interface AuthContextType {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    organizationName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("teamhub_access_token")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("teamhub_refresh_token")
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore authenticated session on initial load
  useEffect(() => {
    async function restoreSession() {
      const storedAccess = localStorage.getItem("teamhub_access_token");
      if (storedAccess) {
        try {
          const profile = await getMeApi(storedAccess);
          setUser(profile);
          setAccessToken(storedAccess);
        } catch (err) {
          // Token expired or invalid
          localStorage.removeItem("teamhub_access_token");
          localStorage.removeItem("teamhub_refresh_token");
          setAccessToken(null);
          setRefreshToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginApi(email, password);
    setAccessToken(res.access);
    setRefreshToken(res.refresh);
    setUser(res.user);
    localStorage.setItem("teamhub_access_token", res.access);
    localStorage.setItem("teamhub_refresh_token", res.refresh);
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    organizationName: string
  ) => {
    const res = await registerApi(
      email,
      password,
      firstName,
      lastName,
      organizationName
    );
    setAccessToken(res.tokens.access);
    setRefreshToken(res.tokens.refresh);
    setUser(res.user);
    localStorage.setItem("teamhub_access_token", res.tokens.access);
    localStorage.setItem("teamhub_refresh_token", res.tokens.refresh);
  };

  const logout = async () => {
    if (accessToken && refreshToken) {
      await logoutApi(accessToken, refreshToken);
    }
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("teamhub_access_token");
    localStorage.removeItem("teamhub_refresh_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
