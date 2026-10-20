import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    EyeIcon,
    EyeSlashIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

import usersAPI from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import { getDefaultRoute } from "../../lib/getDefaultRoute";
import { Button } from "../../components/ui";
import { cn } from "../../lib/cn";

export default function ChangePasswordPage() {
    const { currentUser, refreshUser } = useAuth();
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Lightweight client-side checks (backend still owns real rules)
    const checks = useMemo(
        () => ({
        minLength: newPassword.length >= 8,
        hasLetter: /[a-zA-Z]/.test(newPassword),
        hasNumber: /\d/.test(newPassword),
        matches: newPassword.length > 0 && newPassword === confirmPassword,
        differentFromOld:
            newPassword.length > 0 && oldPassword.length > 0
            ? newPassword !== oldPassword
            : true,
        }),
        [newPassword, confirmPassword, oldPassword],
    );

    const canSubmit =
        oldPassword.length > 0 &&
        checks.minLength &&
        checks.matches &&
        checks.differentFromOld &&
        !submitting;

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
        setError("New passwords do not match.");
        return;
        }

        if (newPassword === oldPassword) {
        setError("New password must be different from your current password.");
        return;
        }

        setSubmitting(true);
        try {
        await usersAPI.changePassword({
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
        });

        // Refresh so must_change_password is cleared
        await refreshUser();

        // Land on the right portal for this user
        const destination = currentUser ? getDefaultRoute(currentUser) : "/";
        navigate(destination, { replace: true });
        } catch (err: unknown) {
        const msg =
            err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Failed to change password.";
        setError(msg);
        } finally {
        setSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 transition-colors dark:bg-slate-900">
        <div className="w-full max-w-md">
            {/* Logo / branding */}
            <div className="mb-8 text-center">
            <img
                src="/schoolos2.png"
                alt="SchoolOS Logo"
                className="mx-auto h-16 w-16 rounded-lg object-cover shadow-md"
            />
            <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                SchoolOS
            </h1>
            </div>

            {/* Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-colors dark:border-slate-700 dark:bg-slate-800 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Change your password
            </h2>
            <p className="mt-1 mb-6 text-sm text-slate-500 dark:text-slate-400">
                You must set a new password before continuing.
            </p>

            {error && (
                <div
                role="alert"
                className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
                >
                {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Current password */}
                <PasswordField
                id="oldPassword"
                label="Current password"
                value={oldPassword}
                onChange={setOldPassword}
                show={showOld}
                onToggle={() => setShowOld((v) => !v)}
                disabled={submitting}
                autoComplete="current-password"
                autoFocus
                />

                {/* New password */}
                <PasswordField
                id="newPassword"
                label="New password"
                value={newPassword}
                onChange={setNewPassword}
                show={showNew}
                onToggle={() => setShowNew((v) => !v)}
                disabled={submitting}
                autoComplete="new-password"
                minLength={8}
                />

                {/* Confirm */}
                <PasswordField
                id="confirmPassword"
                label="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showConfirm}
                onToggle={() => setShowConfirm((v) => !v)}
                disabled={submitting}
                autoComplete="new-password"
                />

                {/* Live requirements */}
                {newPassword.length > 0 && (
                <ul className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-600 dark:bg-slate-900/40">
                    <Requirement
                    met={checks.minLength}
                    label="At least 8 characters"
                    />
                    <Requirement met={checks.hasLetter} label="Contains a letter" />
                    <Requirement met={checks.hasNumber} label="Contains a number" />
                    <Requirement
                    met={checks.differentFromOld}
                    label="Different from current password"
                    />
                    <Requirement met={checks.matches} label="Passwords match" />
                </ul>
                )}

                <Button
                type="submit"
                fullWidth
                size="lg"
                loading={submitting}
                disabled={!canSubmit}
                >
                {submitting ? "Updating..." : "Update password"}
                </Button>
            </form>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
            Powered by <span className="font-bold text-blue-500">IGSSAX</span>{" "}
            <span className="font-bold text-green-500">TEQ</span>
            </p>
        </div>
        </div>
    );
    }

/* ------------------------------------------------------------------ */
/*  Local helpers (keep in this file — only used here)                 */
/* ------------------------------------------------------------------ */

function PasswordField({
    id,
    label,
    value,
    onChange,
    show,
    onToggle,
    disabled,
    autoComplete,
    minLength,
    autoFocus,
    }: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggle: () => void;
    disabled?: boolean;
    autoComplete?: string;
    minLength?: number;
    autoFocus?: boolean;
    }) {
    return (
        <div className="w-full">
        <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
            {label}
            <span className="ml-0.5 text-red-500">*</span>
        </label>
        <div className="relative">
            <input
            id={id}
            name={id}
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            required
            minLength={minLength}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            className={cn(
                "w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm outline-none transition",
                "placeholder:text-slate-400",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                "disabled:cursor-not-allowed disabled:opacity-60",
                "border-slate-300 bg-white text-slate-900",
                "dark:border-slate-600 dark:bg-slate-800 dark:text-white",
                "disabled:bg-slate-100 dark:disabled:bg-slate-900",
            )}
            />
            <button
            type="button"
            onClick={onToggle}
            tabIndex={-1}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
            aria-label={show ? "Hide password" : "Show password"}
            >
            {show ? (
                <EyeSlashIcon className="h-5 w-5" />
            ) : (
                <EyeIcon className="h-5 w-5" />
            )}
            </button>
        </div>
        </div>
    );
}

function Requirement({ met, label }: { met: boolean; label: string }) {
    return (
        <li className="flex items-center gap-2 text-xs">
        {met ? (
            <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-500" />
        ) : (
            <XCircleIcon className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
        )}
        <span
            className={cn(
            met
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-slate-500 dark:text-slate-400",
            )}
        >
            {label}
        </span>
        </li>
    );
}
