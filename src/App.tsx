import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./features/auth/LoginPage";

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

import { RegionalProtectedRoute } from "./components/RegionalProtectedRoute";
import RegionalLayout from "./features/regional/layouts/RegionalLayout";
import RegionalDashboard from "./features/regional/pages/RegionalDashboard";
import RegionalSettingsPage from "./features/regional/pages/RegionalSettingsPage";
import RegionalComingSoon from "./features/regional/pages/RegionalComingSoon";

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          {/* ===== System Root ===== */}
          <Route path="/system"element={<ProtectedRoute><SystemRootLayout /> </ProtectedRoute> }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SystemDashboard />} />
            <Route path="schools" element={<SchoolsPage />} />
            <Route path="schools/:id" element={<SchoolDetailPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:id" element={<UserDetailPage />} />
            <Route path="administrators" element={<AdministratorsPage />} />
            <Route path="administrators/:id"element={<AdministratorDetailPage />}/>
            <Route path="regions" element={<RegionsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="branding" element={<BrandingPage />} />
            <Route path="settings" element={<SystemSettingsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>

          {/* Regional Admin (SIBLING of /system, not child) */}
          <Route
            path="/regional"
            element={
              <RegionalProtectedRoute>
                <RegionalLayout />
              </RegionalProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<RegionalDashboard />} />
            <Route
              path="schools"
              element={
                <RegionalComingSoon
                  title="Schools"
                  description="Schools in your managed counties."
                />
              }
            />
            <Route
              path="principals"
              element={
                <RegionalComingSoon
                  title="Principals"
                  description="School admins in your counties."
                />
              }
            />
            <Route
              path="analytics"
              element={
                <RegionalComingSoon
                  title="Analytics"
                  description="County-scoped trends."
                />
              }
            />
            <Route path="settings" element={<RegionalSettingsPage />} />
            <Route  path="help" element={<RegionalComingSoon title="Help" description="Regional operator guides." /> } />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
  );
}