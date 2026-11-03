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
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description={
          root
            ? "Personal preferences and platform-wide branding controls."
            : "Account, security, appearance, and notifications."
        }
      />

      {root && (
        <section className="relative overflow-hidden rounded-2xl border border-indigo-200/80 bg-linear-to-br from-indigo-50/80 via-white to-slate-50 p-5 shadow-sm dark:border-indigo-900/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 sm:p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/10" />
          <div className="relative space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Platform
              </p>
              <h2 className="mt-0.5 text-lg font-semibold text-slate-900 dark:text-white">
                System Root controls
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                Logos, default colours, operational mode and the global banner.
                Schools inherit these when they have not set their own branding.
              </p>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <div className="xl:col-span-2">
                <PlatformBrandingSection />
              </div>
              <PlatformModeSection />
              <PlatformBannerSection />
            </div>
          </div>
        </section>
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
