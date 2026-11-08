import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isRegionalAdmin } from "../features/regional/lib/isRegionalAdmin";
import { isSystemRoot } from "../features/system/pages/settings/isSystemRoot";
import { getDefaultRoute } from "../lib/getDefaultRoute";
import { Spinner } from "./ui";

export function RegionalProtectedRoute({
    children,
    }: {
    children: React.ReactNode;
    }) {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
        <div className="flex min-h-screen items-center justify-center">
            <Spinner size="lg" />
        </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (isRegionalAdmin(currentUser) || isSystemRoot(currentUser)) {
        return <>{children}</>;
    }

    return <Navigate to={getDefaultRoute(currentUser)} replace />;
    }
