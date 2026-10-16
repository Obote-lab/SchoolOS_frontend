import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import usersAPI from "../../api/users";
import { useAuth } from "../../context/AuthContext";

export default function ChangePasswordPage() {
    const { refreshUser } = useAuth();
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
        setError("New passwords do not match.");
        return;
        }

        setSubmitting(true);
        try {
        await usersAPI.changePassword({
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
        });

        // Refresh user so must_change_password flag is cleared
        await refreshUser();
        navigate("/", { replace: true });
        } catch (err: any) {
        setError(err?.message || "Failed to change password.");
        } finally {
        setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-md p-8">
            <h1 className="text-xl font-bold text-slate-900 mb-2">
            Change your password
            </h1>
            <p className="text-sm text-slate-500 mb-6">
            You must set a new password before continuing.
            </p>

            {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                Current password
                </label>
                <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                New password
                </label>
                <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm new password
                </label>
                <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
                {submitting ? "Updating..." : "Update password"}
            </button>
            </form>
        </div>
        </div>
    );
}
