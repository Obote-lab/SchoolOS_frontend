import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, authStatus, refreshUser } = useAuth();

  const location = useLocation();

  const [retrying, setRetrying] = useState(false);

  /* LOADING  */

  if (authStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400"
          role="status"
          aria-label="Checking authentication"
        />
      </div>
    );
  }

  /*  | TEMPORARY SERVER / NETWORK FAILURE  */

  if (authStatus === "unavailable") {
    const handleRetry = async () => {
      try {
        setRetrying(true);
        await refreshUser();
      } finally {
        setRetrying(false);
      }
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <span className="text-2xl">!</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Unable to verify your session
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            We couldn't connect to the SchoolOS server to verify your account.
            Your saved login credentials have not been cleared.
          </p>

          <button
            type="button"
            onClick={handleRetry}
            disabled={retrying}
            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {retrying ? "Checking session..." : "Try again"}
          </button>
        </div>
      </div>
    );
  }

  /*
  | UNAUTHENTICATED
  */

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  /*
  | AUTHENTICATED  */

  return <>{children}</>;
}
