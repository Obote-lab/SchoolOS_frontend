import { PageHeader } from "../../../components/ui";
import { useBrandingOptional } from "../../../context/BrandingContext";

export default function RegionalComingSoon({
    title,
    description,
    }: {
    title: string;
    description: string;
    }) {
    const primary = useBrandingOptional()?.primary ?? "#0B5FFF";
    return (
        <div className="space-y-6">
        <PageHeader title={title} description={description} />
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800/40">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Coming in the next regional phase
            </p>
            <p className="mt-2 text-sm text-slate-500">
            This surface is routed and ready to fill with county-scoped data.
            </p>
            <p className="mt-4 text-xs font-medium" style={{ color: primary }}>
            SchoolOS Regional R0
            </p>
        </div>
        </div>
    );
}
