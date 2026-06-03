import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import RolesPermissionsPage from "./views/RolesPermissionsPage";
import OrganizationProfilePage from "./views/OrganizationProfilePage";
import BillingPage from "./views/BillingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route path="/" element={<DashboardPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/employees" element={<EmployeeListPage />} />
        <Route path="/employees/new" element={<AddEmployeePage />} />
        <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/payroll" element={<PayrollPage />} />
        <Route path="/leave" element={<LeaveManagementPage />} />
        <Route path="/recruitment" element={<RecruitmentPage />} />
        <Route path="/settings/personal-info" element={<PersonalInformationPage />} />
        <Route path="/settings/security" element={<SecurityPrivacyPage />} />
        <Route path="/settings/notifications" element={<NotificationsPage />} />
        <Route path="/settings/roles" element={<RolesPermissionsPage />} />
        <Route path="/settings/organization" element={<OrganizationProfilePage />} />
        <Route path="/settings/billing" element={<BillingPage />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
