import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./features/auth/LoginPage";
import { AuthProvider } from "./context/AuthContext";

import SystemRootLayout from "./features/system/layouts/SystemRootLayout";
import SystemDashboard from "./features/system/pages/SystemDashboard";
import SchoolsPage from "./features/system/pages/SchoolsPage";
import SchoolDetailPage from "./features/system/pages/SchoolDetailPage";
import UsersPage from "./features/system/pages/UsersPage";
import UserDetailPage from "./features/system/pages/UserDetailPage";
import AdministratorsPage from "./features/system/pages/AdministratorsPage";
import AdministratorDetailPage from "./features/system/pages/AdministratorDetailPage";
import RegionsPage from "./features/system/pages/RegionsPage";
import AuditLogsPage from "./features/system/pages/AuditLogsPage";
import SystemSettingsPage from "./features/system/pages/SystemSettingsPage";
import ChangePasswordPage from "./features/auth/ChangePasswordPage";

import AnalyticsPage from "./features/system/pages/analytics/AnalyticsPage";
import BrandingPage from "./features/system/pages/branding/BrandingPage";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          <Route
            path="/system"
            element={
              <ProtectedRoute>
                <SystemRootLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SystemDashboard />} />
            <Route path="schools" element={<SchoolsPage />} />
            <Route path="schools/:id" element={<SchoolDetailPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:id" element={<UserDetailPage />} />
            <Route path="administrators" element={<AdministratorsPage />} />
            <Route path="administrators/:id" element={<AdministratorDetailPage />}/>
            <Route path="regions" element={<RegionsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="branding" element={<BrandingPage />} />
            <Route path="settings" element={<SystemSettingsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/system" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
