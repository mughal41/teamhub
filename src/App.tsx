import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DashboardPage from "./views/DashboardPage";
import RecruitmentPage from "./views/RecruitmentPage";
import EmployeeListPage from "./views/EmployeeListPage";
import EmployeeDetailsPage from "./views/EmployeeDetailsPage";
import LeaveManagementPage from "./views/LeaveManagementPage";
import PayrollPage from "./views/PayrollPage";
import AttendancePage from "./views/AttendancePage";
import PerformancePage from "./views/PerformancePage";
import InboxPage from "./views/InboxPage";
import CalendarPage from "./views/CalendarPage";
import AddEmployeePage from "./views/AddEmployeePage";
import LoginPage from "./views/LoginPage";
import SignupPage from "./views/SignupPage";
import PersonalInformationPage from "./views/PersonalInformationPage";
import SecurityPrivacyPage from "./views/SecurityPrivacyPage";
import NotificationsPage from "./views/NotificationsPage";
import NotificationSettingPage from "./views/NotificationSettingPage";
import PersonalDocumentsPage from "./views/PersonalDocumentsPage";
import RolesPermissionsPage from "./views/RolesPermissionsPage";
import OrganizationProfilePage from "./views/OrganizationProfilePage";
import BillingPage from "./views/BillingPage";
import { initDB } from "./lib/db";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#28C2A9] border-t-transparent" />
          <p className="text-sm font-semibold text-slate-500">Authenticating session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  React.useEffect(() => {
    // Standard simulation database tables initialization
    initDB();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Operational Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <InboxPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <EmployeeListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/new"
            element={
              <ProtectedRoute>
                <AddEmployeePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/:id"
            element={
              <ProtectedRoute>
                <EmployeeDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance"
            element={
              <ProtectedRoute>
                <PerformancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll"
            element={
              <ProtectedRoute>
                <PayrollPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave"
            element={
              <ProtectedRoute>
                <LeaveManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruitment"
            element={
              <ProtectedRoute>
                <RecruitmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/personal-info"
            element={
              <ProtectedRoute>
                <PersonalInformationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/personal-documents"
            element={
              <ProtectedRoute>
                <PersonalDocumentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/security"
            element={
              <ProtectedRoute>
                <SecurityPrivacyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/notifications"
            element={
              <ProtectedRoute>
                <NotificationSettingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/roles"
            element={
              <ProtectedRoute>
                <RolesPermissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/organization"
            element={
              <ProtectedRoute>
                <OrganizationProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/billing"
            element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
