// src/features/system/pages/analytics/AnalyticsPage.tsx
import { useMemo, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../../context/AuthContext";
import { useBrandingOptional } from "../../../../context/BrandingContext";
import { Button, Spinner, PageHeader } from "../../../../components/ui";
import { useDashboardData } from "../dashboard/useDashboardData";
import { KpiGrid } from "../dashboard/KpiGrid";
import { SchoolsByCountyBar } from "../dashboard/SchoolsByCountyBar";
import { SchoolTypeDonut } from "../dashboard/SchoolTypeDonut";
import { ActiveMixPie } from "../dashboard/ActiveMixPie";
import { UserGrowthArea } from "../dashboard/UserGrowthArea";
import { EnrollmentTrendLine } from "../dashboard/EnrollmentTrendLine";
import { OnboardingFunnel } from "../dashboard/OnboardingFunnel";
import { HealthRadar } from "../dashboard/HealthRadar";
import { StackedCategoryBar } from "../dashboard/StackedCategoryBar";
import { ActivityHeatmap } from "../dashboard/ActivityHeatmap";
import { RecentActivityFeed } from "../dashboard/RecentActivityFeed";
import type { TimedPoint } from "../dashboard/types";
import { cn } from "../../../../lib/cn";

type RangeKey = "7d" | "30d" | "90d" | "ytd" | "all";

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
  { key: "ytd", label: "YTD" },
  { key: "all", label: "All" },
];

function pointLimit(range: RangeKey): number | null {
  switch (range) {
    case "7d":
      return 2;
    case "30d":
      return 2;
    case "90d":
      return 4;
    case "ytd":
      return 12;
    default:
      return null;
  }
}

function sliceSeries(
  data: TimedPoint[] | undefined,
  range: RangeKey,
): TimedPoint[] {
  if (!data?.length) return [];
  const limit = pointLimit(range);
  if (limit == null) return data;
  return data.slice(-limit);
}

function rangeLabel(range: RangeKey) {
  return (
    {
      "7d": "Last 7 days",
      "30d": "Last 30 days",
      "90d": "Last 90 days",
      ytd: "Year to date",
      all: "All time",
    } as const
  )[range];
}

export default function AnalyticsPage() {
  const { currentUser } = useAuth();
  const primary = useBrandingOptional()?.primary ?? "#0B5FFF";
  const { data, loading, error, reload } = useDashboardData();
  const [range, setRange] = useState<RangeKey>("90d");

  const series = useMemo(() => {
    if (!data) return null;
    return {
      userGrowth: sliceSeries(data.userGrowth, range),
      enrollmentTrend: sliceSeries(data.enrollmentTrend, range),
    };
  }, [data, range]);

  if (loading && !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" style={{ color: primary }} />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="mx-auto max-w-md space-y-3 py-16 text-center">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <Button onClick={reload}>Retry</Button>
      </div>
    );
  }

  if (!data || !series) return null;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header + controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <PageHeader
            title="Analytics"
            description={
              currentUser?.first_name
                ? `Platform trends for System Root — hello ${currentUser.first_name}.`
                : "Platform-wide trends across schools, users, and activity."
            }
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/60">
            {RANGES.map((r) => {
              const active = range === r.key;
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRange(r.key)}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
                    active
                      ? "text-white shadow-sm"
                      : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700",
                  )}
                  style={active ? { backgroundColor: primary } : undefined}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={reload}
            disabled={loading}
            className="shrink-0"
          >
            <ArrowPathIcon
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 font-medium text-white"
          style={{ backgroundColor: primary }}
        >
          {rangeLabel(range)}
        </span>
        <span>
          Time series use trailing points for this range. Totals and mix charts
          stay platform-wide.
        </span>
      </div>

      <KpiGrid summary={data.summary} />

      {/* Geography */}
      <section className="space-y-3">
        <SectionLabel
          title="Coverage"
          subtitle="Where schools sit and how types break down"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
          <div className="sm:col-span-2 xl:col-span-2 2xl:col-span-3">
            <SchoolsByCountyBar data={data.byCounty} />
          </div>
          <SchoolTypeDonut data={data.byType} />
        </div>
      </section>

      {/* Growth */}
      <section className="space-y-3">
        <SectionLabel
          title="Growth"
          subtitle={`Accounts and enrolment · ${rangeLabel(range)}`}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          <UserGrowthArea data={series.userGrowth} />
          <EnrollmentTrendLine data={series.enrollmentTrend} />
          <div className="sm:col-span-2 xl:col-span-1">
            <ActiveMixPie data={data.activeMix} />
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="space-y-3">
        <SectionLabel
          title="Pipeline & health"
          subtitle="Onboarding funnel and composite operational scores"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <OnboardingFunnel data={data.onboardingFunnel} />
          <HealthRadar data={data.healthRadar} />
        </div>
      </section>

      {/* Category */}
      <section className="space-y-3">
        <SectionLabel
          title="Category mix"
          subtitle="Public / private / other distribution"
        />
        <StackedCategoryBar data={data.categoryStack} />
      </section>

      {/* Activity */}
      <section className="space-y-3">
        <SectionLabel
          title="Activity"
          subtitle="Heatmap and recent account activity"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <ActivityHeatmap data={data.activityHeat} />
          <RecentActivityFeed users={data.recentUsers} />
        </div>
      </section>

      <p className="pb-2 text-center text-xs text-slate-400 dark:text-slate-500">
        Last updated {data.lastUpdated.toLocaleString()} · Range:{" "}
        {rangeLabel(range)}
      </p>
    </div>
  );
}

function SectionLabel({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="border-b border-slate-100 pb-2 dark:border-slate-800">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}
