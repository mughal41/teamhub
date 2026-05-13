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
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
