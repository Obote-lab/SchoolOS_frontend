// src/features/system/pages/SystemSettingsPage.tsx
import { Link } from "react-router-dom";
import { PageHeader } from "../../../components/ui";
import { useAuth } from "../../../context/AuthContext";
import { AccountSection } from "./settings/AccountSection";
import { AppearanceSection } from "./settings/AppearanceSection";
import { SecuritySection } from "./settings/SecuritySection";
import { SystemInfoSection } from "./settings/SystemInfoSection";
import { NotificationSection } from "./settings/NotificationSection";
import { isSystemRoot } from "./settings/isSystemRoot";

export default function SystemSettingsPage() {
  const { currentUser } = useAuth();
  const root = isSystemRoot(currentUser);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Account, security, appearance, and notifications."
      />

      {root && (
        <p className="rounded-xl border border-indigo-200 bg-indigo-50/80 px-4 py-3 text-sm text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-200">
          Platform logos, colours, mode and banner are managed under{" "}
          <Link
            to="/system/branding"
            className="font-semibold underline-offset-2 hover:underline"
          >
            Branding
          </Link>
          .
        </p>
      )}

      <div className="space-y-5">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Your preferences
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Apply only to your account on this device.
          </p>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <AccountSection />
          <AppearanceSection />
          <SecuritySection />
          <NotificationSection />
          <SystemInfoSection />
        </div>
      </div>
    </div>
  );
}
