import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./features/auth/LoginPage";
import { AuthProvider } from "./context/AuthContext";

import SystemRootLayout from "./features/system/layouts/SystemRootLayout";
import SystemDashboard from "./features/system/pages/SystemDashboard";
import SchoolsPage from "./features/system/pages/SchoolsPage";
import SchoolDetailPage from "./features/system/pages/SchoolDetailPage";
import UsersPage from "./features/system/pages/UsersPage";
import AdministratorsPage from "./features/system/pages/AdministratorsPage";
import AdministratorDetailPage from "./features/system/pages/administrators/CreateRegionalAdminModal";
import RegionsPage from "./features/system/pages/RegionsPage";
import AuditLogsPage from "./features/system/pages/AuditLogsPage";
import SystemSettingsPage from "./features/system/pages/SystemSettingsPage";
import ChangePasswordPage from "./features/auth/ChangePasswordPage";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected System Root */}
          <Route
            path="/system"
            element={
              <ProtectedRoute>
                <SystemRootLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={<Navigate to="/system/dashboard" replace />}
            />

            <Route path="dashboard" element={<SystemDashboard />} />

            <Route path="schools" element={<SchoolsPage />} />

            <Route path="schools/:id" element={<SchoolDetailPage />} />

            <Route path="users" element={<UsersPage />} />

            <Route path="administrators" element={<AdministratorsPage />} />

            <Route path="administrators/:id" element={<AdministratorDetailPage />}/>

            <Route path="regions" element={<RegionsPage />} />

            <Route path="audit-logs" element={<AuditLogsPage />} />

            <Route path="settings" element={<SystemSettingsPage />} />
          </Route>

          {/* Unknown routes */}
          <Route path="*" element={<Navigate to="/system" replace />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
