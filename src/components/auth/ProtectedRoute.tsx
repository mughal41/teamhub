import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShieldOff } from "lucide-react";
import { AppLayout } from "../layout/AppLayout";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isReady, canAccessPath, user } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 rounded-full border-2 border-[#35BFA3] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!canAccessPath(location.pathname)) {
    return (
      <AppLayout title="Access Denied" breadcrumbs={[{ label: "Restricted" }]}>
        <div className="mx-auto max-w-lg mt-16 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center">
            <ShieldOff className="h-8 w-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">No access for this role</h2>
          <p className="text-sm text-slate-500">
            Your current role (<span className="font-semibold text-slate-700">{user?.roleLabel}</span>){" "}
            cannot open this page. Switch role from the profile menu or go back to the dashboard.
          </p>
          <a
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#35BFA3] px-5 text-sm font-bold text-white hover:bg-[#2da88f]"
          >
            Back to Dashboard
          </a>
        </div>
      </AppLayout>
    );
  }

  return <>{children}</>;
}

/** Redirect authenticated users away from login/signup */
export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 rounded-full border-2 border-[#35BFA3] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
