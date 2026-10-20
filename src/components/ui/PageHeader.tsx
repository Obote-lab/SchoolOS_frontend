import { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    breadcrumbs?: ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    description,
    actions,
    breadcrumbs,
    className,
}: PageHeaderProps) {
    return (
        <div className={cn("mb-6", className)}>
        {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
            </h1>
            {description && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {description}
                </p>
            )}
            </div>

            {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
            )}
        </div>
        </div>
    );
}
