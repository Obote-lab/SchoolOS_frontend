// src/features/system/pages/settings/SettingsSection.tsx
import type { ReactNode } from "react";
import type { ComponentType, SVGProps } from "react";
import { cn } from "../../../../lib/cn";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: IconType;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 sm:p-6",
        className,
      )}
    >
      <div className="mb-1 flex items-center gap-2">
        <Icon className="h-5 w-5 shrink-0 text-slate-400" />
        <h2 className="font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>
      {description && (
        <p className="mb-4 ml-7 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      <div className={description ? "ml-0 sm:ml-7" : "mt-4"}>{children}</div>
    </section>
  );
}

export function SettingsRow({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <dt className="shrink-0 text-slate-500 dark:text-slate-400">{label}</dt>
      <dd
        className={cn(
          "text-right font-medium text-slate-900 dark:text-white",
          mono && "font-mono text-xs font-normal",
          !value && "font-normal text-slate-400",
        )}
      >
        {value || "—"}
      </dd>
    </div>
  );
}
