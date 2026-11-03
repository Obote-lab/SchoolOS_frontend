// src/features/system/pages/dashboard/ChartCard.tsx
import type { ReactNode } from "react";
import { cn } from "../../../../lib/cn";

export function ChartCard({
  title,
  subtitle,
  action,
  children,
  className,
  compact,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/50",
        compact ? "p-3.5 sm:p-4" : "p-4 sm:p-5",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-start justify-between gap-2",
          compact ? "mb-3" : "mb-4",
        )}
      >
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      <div className="min-h-50 flex-1">{children}</div>
    </section>
  );
}
