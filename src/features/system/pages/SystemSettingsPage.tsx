// src/features/system/pages/SystemSettingsPage.tsx
import { PageHeader } from "../../../components/ui";
import { AccountSection } from "./settings/AccountSection";
import { AppearanceSection } from "./settings/AppearanceSection";
import { SecuritySection } from "./settings/SecuritySection";
import { SystemInfoSection } from "./settings/SystemInfoSection";
import { NotificationSection } from "./settings/NotificationSection";

export default function SystemSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Account, security, appearance, and platform information."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <AccountSection />
        <AppearanceSection />
        <SecuritySection />
        <NotificationSection />
        <SystemInfoSection />
      </div>
    </div>
  );
}
