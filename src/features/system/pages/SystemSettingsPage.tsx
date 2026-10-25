// src/features/system/pages/SystemSettingsPage.tsx
import { PageHeader } from "../../../components/ui";
import { useAuth } from "../../../context/AuthContext";
import { AccountSection } from "./settings/AccountSection";
import { AppearanceSection } from "./settings/AppearanceSection";
import { SecuritySection } from "./settings/SecuritySection";
import { SystemInfoSection } from "./settings/SystemInfoSection";
import { NotificationSection } from "./settings/NotificationSection";
import { isSystemRoot } from "./settings/isSystemRoot";
import { PlatformBrandingSection } from "./settings/platform/PlatformBrandingSection";
import { PlatformModeSection } from "./settings/platform/PlatformModeSection";
import { PlatformBannerSection } from "./settings/platform/PlatformBannerSection";

export default function SystemSettingsPage() {
  const { currentUser } = useAuth();
  const root = isSystemRoot(currentUser);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description={
          root
            ? "Personal preferences and platform branding controls."
            : "Account, security, appearance, and notifications."
        }
      />

      {root && (
        <div className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Platform (System Root)
          </h2>
          <div className="grid gap-6 xl:grid-cols-2">
            <PlatformBrandingSection />
            <PlatformModeSection />
            <PlatformBannerSection />
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Your preferences
        </h2>
        <div className="grid gap-6 xl:grid-cols-2">
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
