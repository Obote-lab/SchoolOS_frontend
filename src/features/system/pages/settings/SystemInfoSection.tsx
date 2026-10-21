// src/features/system/pages/settings/SystemInfoSection.tsx
import { ServerIcon } from "@heroicons/react/24/outline";
import { Badge } from "../../../../components/ui";
import { SettingsSection, SettingsRow } from "./SettingsSection";

const CLIENT_VERSION = "0.2.0";
const ENV =
  (import.meta.env.MODE === "production" && "Production") ||
  (import.meta.env.MODE === "development" && "Development") ||
  import.meta.env.MODE;

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
    /\/$/,
    "",
  ) || "http://127.0.0.1:8000";

export function SystemInfoSection() {
  return (
    <SettingsSection
      icon={ServerIcon}
      title="System"
      description="Client build and API connection."
    >
      <dl className="divide-y divide-slate-100 dark:divide-slate-700">
        <SettingsRow label="Platform" value="SchoolOS" />
        <SettingsRow label="Client version" value={CLIENT_VERSION} mono />
        <div className="flex items-center justify-between gap-4 py-2 text-sm">
          <dt className="text-slate-500 dark:text-slate-400">Environment</dt>
          <dd>
            <Badge variant={ENV === "Production" ? "success" : "info"}>
              {ENV}
            </Badge>
          </dd>
        </div>
        <SettingsRow label="API base" value={API_BASE} mono />
      </dl>
    </SettingsSection>
  );
}
