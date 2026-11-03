// src/features/system/pages/branding/BrandingPage.tsx
import { Navigate } from "react-router-dom";
import { PageHeader } from "../../../../components/ui";
import { useAuth } from "../../../../context/AuthContext";
import { isSystemRoot } from "../settings/isSystemRoot";
import { PlatformBrandingSection } from "../settings/platform/PlatformBrandingSection";
import { PlatformModeSection } from "../settings/platform/PlatformModeSection";
import { PlatformBannerSection } from "../settings/platform/PlatformBannerSection";

export default function BrandingPage() {
    const { currentUser } = useAuth();
    const root = isSystemRoot(currentUser);

    if (!root) {
        return <Navigate to="/system/settings" replace />;
    }

    return (
        <div className="space-y-6">
        <PageHeader
            title="Platform branding"
            description="System logos, default colours, operational mode, and the global banner. Schools inherit these when they have not set their own."
        />

        <section className="relative overflow-hidden rounded-2xl border border-indigo-200/80 bg-linear-to-br from-indigo-50/80 via-white to-slate-50 p-5 shadow-sm dark:border-indigo-900/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 sm:p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/10" />
            <div className="relative space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                System Root only
            </p>
            <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                Changes apply platform-wide via resolved branding. Login, sidebar,
                and chrome pick up logos and primary colour after save.
            </p>
            </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-2">
            <div className="xl:col-span-2">
            <PlatformBrandingSection />
            </div>
            <PlatformModeSection />
            <PlatformBannerSection />
        </div>
        </div>
    );
}
