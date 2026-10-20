import { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
    }: EmptyStateProps) {
    return (
        <div
        className={cn(
            "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-12 text-center dark:border-slate-600 dark:bg-slate-800/30",
            className,
        )}
        >
        {icon && (
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500">
            {icon}
            </div>
        )}
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
        </h3>
        {description && (
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            {description}
            </p>
        )}
        {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
