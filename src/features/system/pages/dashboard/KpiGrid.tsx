import {
  BuildingOfficeIcon,
  AcademicCapIcon,
  UsersIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import type { DashboardSummary } from "./types";
import { cn } from "../../../../lib/cn";

export function KpiGrid({ summary }: { summary: DashboardSummary }) {
  const activePct =
    summary.total_schools > 0
      ? Math.round((summary.active_schools / summary.total_schools) * 100)
      : 0;

  const items = [
    {
      label: "Total schools",
      value: summary.total_schools.toLocaleString(),
      hint: "Registered on platform",
      icon: BuildingOfficeIcon,
      color: "blue",
    },
    {
      label: "Active schools",
      value: summary.active_schools.toLocaleString(),
      hint: `${activePct}% of registered`,
      icon: AcademicCapIcon,
      color: "emerald",
    },
    {
      label: "Total users",
      value: summary.total_users.toLocaleString(),
      hint: "All roles",
      icon: UsersIcon,
      color: "violet",
    },
    {
      label: "Platform pulse",
      value: summary.total_schools ? "Healthy" : "Warming up",
      hint: "Operational status",
      icon: CheckCircleIcon,
      color: "amber",
    },
  ] as const;

  const styles = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    violet:
      "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50"
        >
          <div className="flex items-center gap-3">
            <div className={cn("rounded-xl p-2.5", styles[item.color])}>
              <item.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">{item.label}</p>
              <p className="truncate text-xl font-bold text-slate-900 dark:text-white">
                {item.value}
              </p>
              <p className="truncate text-xs text-slate-400">{item.hint}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
