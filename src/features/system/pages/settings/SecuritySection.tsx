// src/features/system/pages/settings/SecuritySection.tsx
import { Link } from "react-router-dom";
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../../../context/AuthContext";
import { SettingsSection } from "./SettingsSection";

function StatusLine({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {ok ? (
        <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-500" />
      ) : (
        <ExclamationTriangleIcon className="h-4 w-4 shrink-0 text-amber-500" />
      )}
      <span className="text-slate-700 dark:text-slate-300">{label}</span>
    </li>
  );
}

function formatDateTime(value?: string | null) {
  if (!value) return "Never";
  try {
    return new Date(value).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export function SecuritySection() {
  const { currentUser, logout } = useAuth();

  return (
    <SettingsSection
      icon={ShieldCheckIcon}
      title="Security"
      description="Session and account protection status."
    >
      <ul className="space-y-2">
        <StatusLine
          ok={!!currentUser?.is_active}
          label={
            currentUser?.is_active ? "Account is active" : "Account is inactive"
          }
        />
        <StatusLine
          ok={!currentUser?.is_locked}
          label={
            currentUser?.is_locked
              ? "Account is locked"
              : "Account is not locked"
          }
        />
        <StatusLine
          ok={!!currentUser?.is_verified}
          label={
            currentUser?.is_verified
              ? "Account is verified"
              : "Account is not verified"
          }
        />
        <StatusLine
          ok={!!currentUser?.can_login}
          label={
            currentUser?.can_login ? "Login is allowed" : "Login is blocked"
          }
        />
      </ul>

      <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-900/40">
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Last login</span>
          <span className="text-slate-800 dark:text-slate-200">
            {formatDateTime(currentUser?.last_login)}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Password changed</span>
          <span className="text-slate-800 dark:text-slate-200">
            {formatDateTime(currentUser?.last_password_change)}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to="/change-password"
          className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Update password
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Sign out
        </button>
      </div>
    </SettingsSection>
  );
}
