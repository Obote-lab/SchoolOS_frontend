// src/features/system/pages/settings/AccountSection.tsx
import { Link } from "react-router-dom";
import { UserIcon } from "@heroicons/react/24/outline";
import { Badge } from "../../../../components/ui";
import { useAuth } from "../../../../context/AuthContext";
import { SettingsSection, SettingsRow } from "./SettingsSection";

export function AccountSection() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <SettingsSection icon={UserIcon} title="Your account">
        <p className="text-sm text-slate-500">Not signed in.</p>
      </SettingsSection>
    );
  }

  const primaryRole =
    currentUser.roles?.find((r) => r.is_primary_role && r.is_active) ||
    currentUser.roles?.find((r) => r.is_active);

  return (
    <SettingsSection
      icon={UserIcon}
      title="Your account"
      description="Identity and contact details for this session."
    >
      <div className="mb-4 flex items-center gap-3">
        {currentUser.profile_picture ? (
          <img
            src={currentUser.profile_picture}
            alt=""
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
            {(currentUser.first_name || currentUser.login_id || "?")
              .charAt(0)
              .toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900 dark:text-white">
            {currentUser.full_name ||
              `${currentUser.first_name} ${currentUser.last_name}`.trim() ||
              "—"}
          </p>
          <p className="font-mono text-xs text-slate-500">
            {currentUser.login_id}
          </p>
        </div>
      </div>

      <dl className="divide-y divide-slate-100 dark:divide-slate-700">
        <SettingsRow label="Email" value={currentUser.email} />
        <SettingsRow label="Phone" value={currentUser.phone} />
        <SettingsRow label="Role" value={primaryRole?.role_name || "—"} />
        <SettingsRow
          label="County"
          value={
            [currentUser.sub_county, currentUser.county]
              .filter(Boolean)
              .join(", ") || currentUser.county
          }
        />
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {currentUser.is_verified ? (
          <Badge variant="success" dot>
            Verified
          </Badge>
        ) : (
          <Badge variant="warning" dot>
            Unverified
          </Badge>
        )}
        {currentUser.is_active ? (
          <Badge variant="success" dot>
            Active
          </Badge>
        ) : (
          <Badge variant="neutral" dot>
            Inactive
          </Badge>
        )}
      </div>

      <div className="mt-5">
        <Link
          to="/change-password"
          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Change password
        </Link>
      </div>
    </SettingsSection>
  );
}
