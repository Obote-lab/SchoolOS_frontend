// src/features/system/pages/SystemDashboard.tsx
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../context/AuthContext";
import { Button, Spinner } from "../../../components/ui";
import { useDashboardData } from "./dashboard/useDashboardData";
import { KpiGrid } from "./dashboard/KpiGrid";
import { SchoolsByCountyBar } from "./dashboard/SchoolsByCountyBar";
import { SchoolTypeDonut } from "./dashboard/SchoolTypeDonut";
import { ActiveMixPie } from "./dashboard/ActiveMixPie";
import { UserGrowthArea } from "./dashboard/UserGrowthArea";
import { EnrollmentTrendLine } from "./dashboard/EnrollmentTrendLine";
import { OnboardingFunnel } from "./dashboard/OnboardingFunnel";
import { HealthRadar } from "./dashboard/HealthRadar";
import { StackedCategoryBar } from "./dashboard/StackedCategoryBar";
import { ActivityHeatmap } from "./dashboard/ActivityHeatmap";
import { RecentActivityFeed } from "./dashboard/RecentActivityFeed";
import { QuickActions } from "./dashboard/QuickActions";

export default function SystemDashboard() {
  const { currentUser } = useAuth();
  const { data, loading, error, reload } = useDashboardData();

  if (loading && !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" className="text-blue-600" />
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

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            System dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Welcome back
            {currentUser?.first_name ? `, ${currentUser.first_name}` : ""}.
            Platform overview across schools, users, and health.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
          <ArrowPathIcon
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <KpiGrid summary={data.summary} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SchoolsByCountyBar data={data.byCounty} />
        </div>
        <SchoolTypeDonut data={data.byType} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <UserGrowthArea data={data.userGrowth} />
        <EnrollmentTrendLine data={data.enrollmentTrend} />
        <ActiveMixPie data={data.activeMix} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <OnboardingFunnel data={data.onboardingFunnel} />
        <HealthRadar data={data.healthRadar} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <StackedCategoryBar data={data.categoryStack} />
        </div>
        <QuickActions />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityHeatmap data={data.activityHeat} />
        <RecentActivityFeed users={data.recentUsers} />
      </div>

      <p className="text-center text-xs text-slate-400">
        Last updated {data.lastUpdated.toLocaleString()}
      </p>
    </div>
  );
}
