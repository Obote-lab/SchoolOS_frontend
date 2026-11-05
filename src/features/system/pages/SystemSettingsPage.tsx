// src/features/system/pages/SystemSettingsPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserCircleIcon,
  BuildingOffice2Icon,
  SwatchIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { PageHeader } from "../../../components/ui";
import { useAuth } from "../../../context/AuthContext";
import { useBrandingOptional } from "../../../context/BrandingContext";
import { AccountSection } from "./settings/AccountSection";
import { AppearanceSection } from "./settings/AppearanceSection";
import { SecuritySection } from "./settings/SecuritySection";
import { SystemInfoSection } from "./settings/SystemInfoSection";
import { NotificationSection } from "./settings/NotificationSection";
import { isSystemRoot } from "./settings/isSystemRoot";
import { PlatformDefaultsSection } from "./settings/system/PlatformDefaultsSection";
import { SecurityPolicySection } from "./settings/system/SecurityPolicySection";
import { FeatureModulesSection } from "./settings/system/FeatureModulesSection";
import { SupportContactSection } from "./settings/system/SupportContactSection";
import { cn } from "../../../lib/cn";

type TabId = "personal" | "platform";

export default function SystemSettingsPage() {
  const { currentUser } = useAuth();
  const primary = useBrandingOptional()?.primary ?? "#0B5FFF";
  const root = isSystemRoot(currentUser);
  const [tab, setTab] = useState<TabId>("personal");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          title="Settings"
          description={
            root
              ? "Your preferences and platform-wide controls for SchoolOS."
              : "Account, security, appearance, and notifications."
          }
        />
        {root && (
          <Link
            to="/system/branding"
            className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            style={{ backgroundColor: primary }}
          >
            <SwatchIcon className="h-4 w-4" />
            Open branding studio
          </Link>
        )}
      </div>

      {root && (
        <div className="flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/50">
          <TabButton
            active={tab === "personal"}
            onClick={() => setTab("personal")}
            icon={UserCircleIcon}
            label="Personal"
            primary={primary}
          />
          <TabButton
            active={tab === "platform"}
            onClick={() => setTab("platform")}
            icon={BuildingOffice2Icon}
            label="Platform controls"
            primary={primary}
          />
        </div>
      )}

      {(!root || tab === "personal") && (
        <div className="space-y-5">
          <SectionIntro
            title="Your preferences"
            subtitle="Apply only to your account on this device."
          />
          <div className="grid gap-5 xl:grid-cols-2">
            <AccountSection />
            <AppearanceSection />
            <SecuritySection />
            <NotificationSection />
            <SystemInfoSection />
          </div>
        </div>
      )}

      {root && tab === "platform" && (
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-2xl border border-indigo-200/70 bg-linear-to-br from-indigo-50 via-white to-slate-50 p-5 dark:border-indigo-900/40 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 sm:p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-400/15 blur-3xl" />
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  System Root
                </p>
                <h2 className="mt-0.5 text-lg font-semibold text-slate-900 dark:text-white">
                  Platform control centre
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                  Defaults, security posture, module switches, and support
                  contacts. Visual identity lives in Branding.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Chip icon={ShieldCheckIcon} label="National scope" />
                <Chip icon={Cog6ToothIcon} label="Affects all schools" />
              </div>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <PlatformDefaultsSection />
            <SecurityPolicySection />
            <FeatureModulesSection />
            <SupportContactSection />
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  primary,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof UserCircleIcon;
  label: string;
  primary: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:flex-none",
        active
          ? "text-white shadow-sm"
          : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700",
      )}
      style={active ? { backgroundColor: primary } : undefined}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function SectionIntro({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </h2>
      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}

function Chip({
  icon: Icon,
  label,
}: {
  icon: typeof ShieldCheckIcon;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
