import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { GuestRoute, ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppShell } from "./components/layout/AppLayout";
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
import DepartmentsPage from "./views/DepartmentsPage";
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
import ApiIntegrationsPage from "./views/ApiIntegrationsPage";
import ManagerDashboardPage from "./views/manager/ManagerDashboardPage";
import MyTeamPage from "./views/manager/MyTeamPage";
import ManagerAttendancePage from "./views/manager/ManagerAttendancePage";
import ManagerLeaveApprovalsPage from "./views/manager/ManagerLeaveApprovalsPage";
import ManagerPerformancePage from "./views/manager/ManagerPerformancePage";
import ManagerCalendarPage from "./views/manager/ManagerCalendarPage";
import ManagerInboxPage from "./views/manager/ManagerInboxPage";
import EmployeeDashboardPage from "./views/employee/EmployeeDashboardPage";
import EmployeeAttendancePage from "./views/employee/EmployeeAttendancePage";
import EmployeeLeavePage from "./views/employee/EmployeeLeavePage";
import EmployeePerformancePage from "./views/employee/EmployeePerformancePage";
import EmployeePayslipPage from "./views/employee/EmployeePayslipPage";
import EmployeeCalendarPage from "./views/employee/EmployeeCalendarPage";
import EmployeeInboxPage from "./views/employee/EmployeeInboxPage";
import { initDB } from "./lib/db";

function HomePage() {
  const { accessRole } = useAuth();
  if (accessRole === "admin") return <DashboardPage />;
  if (accessRole === "manager") return <ManagerDashboardPage />;
  if (accessRole === "employee") return <EmployeeDashboardPage />;
  return <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute roles={["admin"]}>{children}</ProtectedRoute>;
}

function ManagerRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute roles={["manager"]}>{children}</ProtectedRoute>;
}

function StaffRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute roles={["admin", "manager", "employee"]}>{children}</ProtectedRoute>;
}

function AttendanceByRole() {
  const { accessRole } = useAuth();
  if (accessRole === "manager") return <ManagerAttendancePage />;
  if (accessRole === "employee") return <EmployeeAttendancePage />;
  return <AttendancePage />;
}

function PerformanceByRole() {
  const { accessRole } = useAuth();
  if (accessRole === "manager") return <ManagerPerformancePage />;
  if (accessRole === "employee") return <EmployeePerformancePage />;
  return <PerformancePage />;
}

function LeaveByRole() {
  const { accessRole } = useAuth();
  if (accessRole === "manager") return <ManagerLeaveApprovalsPage />;
  if (accessRole === "employee") return <EmployeeLeavePage />;
  return <LeaveManagementPage />;
}

function CalendarByRole() {
  const { accessRole } = useAuth();
  if (accessRole === "manager") return <Navigate to="/manager/calendar" replace />;
  if (accessRole === "employee") return <EmployeeCalendarPage />;
  return <CalendarPage />;
}

function InboxByRole() {
  const { accessRole } = useAuth();
  if (accessRole === "manager") return <Navigate to="/manager/inbox" replace />;
  if (accessRole === "employee") return <EmployeeInboxPage />;
  return <InboxPage />;
}

function PayrollByRole() {
  const { accessRole } = useAuth();
  if (accessRole === "employee") return <EmployeePayslipPage />;
  return <PayrollPage />;
}

export default function App() {
  React.useEffect(() => {
    initDB();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <SignupPage />
                </GuestRoute>
              }
            />

            {/* Persistent chrome — sidebar/header stay mounted across navigations */}
            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<HomePage />} />

              <Route path="my-team" element={<ManagerRoute><MyTeamPage /></ManagerRoute>} />
              <Route
                path="manager/calendar"
                element={
                  <ManagerRoute>
                    <ManagerCalendarPage />
                  </ManagerRoute>
                }
              />
              <Route
                path="manager/inbox"
                element={
                  <ManagerRoute>
                    <ManagerInboxPage />
                  </ManagerRoute>
                }
              />

              <Route path="inbox" element={<StaffRoute><InboxByRole /></StaffRoute>} />
              <Route path="calendar" element={<StaffRoute><CalendarByRole /></StaffRoute>} />
              <Route path="attendance" element={<StaffRoute><AttendanceByRole /></StaffRoute>} />
              <Route path="performance" element={<StaffRoute><PerformanceByRole /></StaffRoute>} />
              <Route path="leave" element={<StaffRoute><LeaveByRole /></StaffRoute>} />
              <Route
                path="payroll"
                element={
                  <ProtectedRoute roles={["admin", "employee"]}>
                    <PayrollByRole />
                  </ProtectedRoute>
                }
              />

              <Route path="employees" element={<AdminRoute><EmployeeListPage /></AdminRoute>} />
              <Route path="employees/new" element={<AdminRoute><AddEmployeePage /></AdminRoute>} />
              <Route path="employees/:id" element={<AdminRoute><EmployeeDetailsPage /></AdminRoute>} />
              <Route path="departments" element={<AdminRoute><DepartmentsPage /></AdminRoute>} />
              <Route path="recruitment" element={<AdminRoute><RecruitmentPage /></AdminRoute>} />

              <Route path="settings/personal-info" element={<PersonalInformationPage />} />
              <Route path="settings/personal-documents" element={<PersonalDocumentsPage />} />
              <Route path="settings/security" element={<SecurityPrivacyPage />} />
              <Route path="settings/notifications" element={<NotificationSettingPage />} />
              <Route path="notifications" element={<NotificationsPage />} />

              <Route path="settings/roles" element={<AdminRoute><RolesPermissionsPage /></AdminRoute>} />
              <Route path="settings/organization" element={<AdminRoute><OrganizationProfilePage /></AdminRoute>} />
              <Route path="settings/billing" element={<AdminRoute><BillingPage /></AdminRoute>} />
              <Route path="settings/integrations" element={<AdminRoute><ApiIntegrationsPage /></AdminRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
