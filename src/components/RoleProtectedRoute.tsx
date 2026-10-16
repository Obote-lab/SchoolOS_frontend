import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RoleProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[]; // match role_name from backend
    }

    export function RoleProtectedRoute({
    children,
    allowedRoles,
    }: RoleProtectedRouteProps) {
    const { currentUser, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"
            role="status"
            aria-label="Loading"
            />
        </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (
        allowedRoles &&
        !currentUser?.roles.some((r) => allowedRoles.includes(r.role_name))
    ) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
    }
