import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { getDefaultRoute } from "../../lib/getDefaultRoute";

type LocationState = {
    from?: {
        pathname: string;
    };
    };

    export function LoginPage() {
    const { login, isAuthenticated, loading: authLoading } = useAuth();
    const { theme, setTheme, isDark } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as LocationState | null)?.from?.pathname || "/";

    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    if (!authLoading && isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
        const { user, mustChangePassword } = await login({
            login_id: loginId.trim(),
            password,
        });

        if (mustChangePassword) {
            navigate("/change-password", { replace: true });
            return;
        }

        const destination = getDefaultRoute(user);
        navigate(destination, { replace: true });
        } catch (err: unknown) {
        const msg =
            err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Login failed. Check your login ID and password.";
        setError(msg);
        } finally {
        setSubmitting(false);
        }
    }

    return (
        <div
        className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-200 ${
            isDark ? "bg-slate-900" : "bg-slate-50"
        }`}
        >
        <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
            <img
                src="/schoolos2.png"
                alt="SchoolOS Logo"
                className="mx-auto h-20 w-20 rounded-lg shadow-md object-cover"
            />
            <h1
                className={`mt-4 text-2xl font-bold transition-colors duration-200 ${
                isDark ? "text-white" : "text-slate-900"
                }`}
            >
                SchoolOS
            </h1>
            <p
                className={`mt-2 text-sm transition-colors duration-200 ${
                isDark ? "text-slate-400" : "text-slate-500"
                }`}
            >
                Sign in to your school account
            </p>
            </div>

            {/* Card */}
            <div
            className={`rounded-2xl border shadow-md p-6 sm:p-8 transition-colors duration-200 ${
                isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-slate-200"
            }`}
            >
            <h2
                className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
                isDark ? "text-white" : "text-slate-900"
                }`}
            >
                Welcome back
            </h2>
            <p
                className={`text-sm mb-6 transition-colors duration-200 ${
                isDark ? "text-slate-400" : "text-slate-500"
                }`}
            >
                Enter your credentials to continue.
            </p>

            {error && (
                <div
                role="alert"
                className={`mb-5 rounded-lg border px-4 py-3 text-sm transition-colors duration-200 ${
                    isDark
                    ? "border-red-800 bg-red-900/30 text-red-400"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
                >
                {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Login ID */}
                <div>
                <label
                    className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                >
                    Login ID
                </label>
                <input
                    id="loginId"
                    name="login_id"
                    type="text"
                    autoComplete="username"
                    placeholder="e.g. NBS-R8L-2PW"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    disabled={submitting}
                    required
                    className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition disabled:cursor-not-allowed ${
                    isDark
                        ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-800"
                        : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100"
                    }`}
                />
                </div>

                {/* Password with toggle */}
                <div>
                <label
                    className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                >
                    Password
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
                    className={`w-full rounded-lg border px-4 py-3 pr-10 text-sm outline-none transition disabled:cursor-not-allowed ${
                        isDark
                        ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-800"
                        : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100"
                    }`}
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-3 flex items-center transition-colors ${
                        isDark
                        ? "text-slate-400 hover:text-slate-300"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
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
                <button
                type="submit"
                disabled={submitting || !loginId.trim() || !password}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                    </span>
                ) : (
                    "Sign in"
                )}
                </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
                <p
                className={`text-xs transition-colors duration-200 ${
                    isDark ? "text-slate-500" : "text-slate-400"
                }`}
                >
                Powered By <span className="text-blue-500 font-bold">IGSSAX</span>{" "}
                <span className="text-green-500 font-bold">TEQ</span>
                </p>
            </div>
            </div>
        </div>
        </div>
    );
}

export default LoginPage;
