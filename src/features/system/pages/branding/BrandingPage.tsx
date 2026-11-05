// src/features/system/pages/branding/BrandingPage.tsx
import { Link } from "react-router-dom";
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
        return (
        <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
            <PageHeader
            title="Platform branding"
            description="This area is limited to System Root operators."
            />
            <p className="text-sm text-slate-600 dark:text-slate-400">
            Your account is signed in, but it does not currently resolve as{" "}
            <strong>System Root</strong>. Check that an active role named{" "}
            <code className="rounded bg-slate-100 px-1 text-xs dark:bg-slate-800">
                System Root
            </code>{" "}
            is assigned (or that the user is a superuser).
            </p>
            <p className="text-xs text-slate-400">
            Roles on this session:{" "}
            {(currentUser?.roles ?? [])
                .map((r) => `${r.role_name}${r.is_active ? "" : " (inactive)"}`)
                .join(", ") || "none"}
            </p>
            <Link
            to="/system/settings"
            className="inline-flex text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
            Go to Settings
            </Link>
        </div>
        );
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
