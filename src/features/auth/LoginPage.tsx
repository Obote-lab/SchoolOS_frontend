import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  EyeIcon,
  EyeSlashIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useBranding } from "../../context/BrandingContext";
import { getDefaultRoute } from "../../lib/getDefaultRoute";
import { Button, Input, Spinner } from "../../components/ui";
import { cn } from "../../lib/cn";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

const FALLBACK_LOGO = "/schoolos2.png";

export function LoginPage() {
  // All hooks must be called before any conditional return.
  const {
    login,
    isAuthenticated,
    currentUser,
    loading: authLoading,
  } = useAuth();

  const { theme, setTheme } = useTheme();

  const {
    logoUrl,
    primary,
    branding,
    loading: brandingLoading,
  } = useBranding();

  const navigate = useNavigate();
  const location = useLocation();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Preserve the route the user originally wanted to visit.
  const requestedPath = (location.state as LocationState | null)?.from
    ?.pathname;

  // Only allow internal application paths.
  const safeFrom =
    requestedPath &&
    requestedPath.startsWith("/") &&
    !requestedPath.startsWith("//") &&
    !["/login", "/change-password"].includes(requestedPath)
      ? requestedPath
      : null;

  // Show loading while authentication state is being restored.
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Spinner size="lg" style={{ color: primary }} />
      </div>
    );
  }

  // Redirect users who are already authenticated.
  if (isAuthenticated && currentUser) {
    const destination = safeFrom || getDefaultRoute(currentUser);

    return <Navigate to={destination} replace />;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!loginId.trim() || !password || submitting) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const { user, mustChangePassword } = await login({
        login_id: loginId.trim(),
        password,
      });

      // Force users to change temporary passwords.
      if (mustChangePassword) {
        navigate("/change-password", { replace: true });
        return;
      }

      // Return to the requested page or the user's default dashboard.
      const destination = safeFrom || getDefaultRoute(user);

      navigate(destination, { replace: true });
    } catch (err: unknown) {
      let message = "Login failed. Check your login ID and password.";

      if (err instanceof Error && err.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const ThemeIcon =
    theme === "dark"
      ? MoonIcon
      : theme === "light"
        ? SunIcon
        : ComputerDesktopIcon;

  const displayLogo = logoUrl || FALLBACK_LOGO;

  const welcome =
    branding?.login?.welcome_message || "Sign in to your school account";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 transition-colors dark:bg-slate-900">
      {/* Theme switcher */}
      <button
        type="button"
        onClick={cycleTheme}
        className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        aria-label={`Theme: ${theme}. Click to cycle.`}
        title={`Theme: ${theme}`}
      >
        <ThemeIcon className="h-5 w-5" />
      </button>

      <div className="w-full max-w-md">
        {/* SchoolOS branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
            {brandingLoading && !logoUrl ? (
              <Spinner size="sm" style={{ color: primary }} />
            ) : (
              <img
                src={displayLogo}
                alt="SchoolOS"
                className="h-full w-full object-contain p-1.5"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_LOGO;
                }}
              />
            )}
          </div>

          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            SchoolOS
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {welcome}
          </p>
        </div>

        {/* Login form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-colors dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
            Welcome back
          </h2>

          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Enter your credentials to continue.
          </p>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Login ID */}
            <Input
              label="Login ID"
              name="login_id"
              id="loginId"
              type="text"
              autoComplete="username"
              placeholder="e.g. NBS-R8L-2PW"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              disabled={submitting}
              required
              autoFocus
            />

            {/* Password */}
            <div className="w-full">
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
                <span className="ml-0.5 text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  required
                  className={cn(
                    "w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm outline-none transition",
                    "placeholder:text-slate-400",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                    "border-slate-300 bg-white text-slate-900",
                    "dark:border-slate-600 dark:bg-slate-800 dark:text-white",
                    "disabled:bg-slate-100 dark:disabled:bg-slate-900",
                  )}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = primary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${primary}33`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={submitting}
              disabled={!loginId.trim() || !password || submitting}
              style={{
                backgroundColor: primary,
                borderColor: primary,
              }}
              className="text-white hover:opacity-90"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Powered by <span className="font-bold text-blue-500">IGSSAX</span>{" "}
              <span className="font-bold text-green-500">TEQ</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
