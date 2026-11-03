// // src/features/system/pages/SystemDashboard.tsx
// import { ArrowPathIcon } from "@heroicons/react/24/outline";
// import { useAuth } from "../../../context/AuthContext";
// import { useBrandingOptional } from "../../../context/BrandingContext";
// import { Button, Spinner } from "../../../components/ui";
// import { useDashboardData } from "./dashboard/useDashboardData";
// import { KpiGrid } from "./dashboard/KpiGrid";
// import { SchoolsByCountyBar } from "./dashboard/SchoolsByCountyBar";
// import { SchoolTypeDonut } from "./dashboard/SchoolTypeDonut";
// import { ActiveMixPie } from "./dashboard/ActiveMixPie";
// import { UserGrowthArea } from "./dashboard/UserGrowthArea";
// import { EnrollmentTrendLine } from "./dashboard/EnrollmentTrendLine";
// import { OnboardingFunnel } from "./dashboard/OnboardingFunnel";
// import { HealthRadar } from "./dashboard/HealthRadar";
// import { StackedCategoryBar } from "./dashboard/StackedCategoryBar";
// import { ActivityHeatmap } from "./dashboard/ActivityHeatmap";
// import { RecentActivityFeed } from "./dashboard/RecentActivityFeed";
// import { QuickActions } from "./dashboard/QuickActions";

// export default function SystemDashboard() {
//   const { currentUser } = useAuth();
//   const branding = useBrandingOptional();
//   const primary = branding?.primary ?? "#0B5FFF";
//   const { data, loading, error, reload } = useDashboardData();

//   if (loading && !data) {
//     return (
//       <div className="flex min-h-[40vh] items-center justify-center">
//         <Spinner size="lg" style={{ color: primary }} />
//       </div>
//     );
//   }

//   if (error && !data) {
//     return (
//       <div className="mx-auto max-w-md space-y-3 py-16 text-center">
//         <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
//         <Button onClick={reload}>Retry</Button>
//       </div>
//     );
//   }

//   if (!data) return null;

//   return (
//     <div className="space-y-5 sm:space-y-6">
//       {/* Page header */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
//         <div className="min-w-0">
//           <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
//             Overview
//           </p>
//           <h1 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
//             System dashboard
//           </h1>
//           <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
//             Welcome back
//             {currentUser?.first_name ? `, ${currentUser.first_name}` : ""}.
//             Schools, users, and platform health at a glance.
//           </p>
//         </div>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={reload}
//           disabled={loading}
//           className="shrink-0 self-start sm:self-auto"
//         >
//           <ArrowPathIcon
//             className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
//           />
//           Refresh
//         </Button>
//       </div>

//       <KpiGrid summary={data.summary} />

//       {/* County + type — 2 cols from sm, wider on xl+ */}
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
//         <div className="sm:col-span-2 xl:col-span-2 2xl:col-span-3">
//           <SchoolsByCountyBar data={data.byCounty} />
//         </div>
//         <SchoolTypeDonut data={data.byType} />
//       </div>

//       {/* Trends — 2 on sm, 3 on xl */}
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
//         <UserGrowthArea data={data.userGrowth} />
//         <EnrollmentTrendLine data={data.enrollmentTrend} />
//         <div className="sm:col-span-2 xl:col-span-1">
//           <ActiveMixPie data={data.activeMix} />
//         </div>
//       </div>

//       {/* Funnel + health — always 2 from sm up */}
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5">
//         <OnboardingFunnel data={data.onboardingFunnel} />
//         <HealthRadar data={data.healthRadar} />
//       </div>

//       {/* Stacked + quick actions */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
//         <div className="sm:col-span-2 xl:col-span-2">
//           <StackedCategoryBar data={data.categoryStack} />
//         </div>
//         <QuickActions />
//       </div>

//       {/* Activity */}
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5">
//         <ActivityHeatmap data={data.activityHeat} />
//         <RecentActivityFeed users={data.recentUsers} />
//       </div>

//       <p className="pb-2 text-center text-xs text-slate-400 dark:text-slate-500">
//         Last updated {data.lastUpdated.toLocaleString()}
//       </p>
//     </div>
//   );
// }

















// src/features/system/pages/SystemDashboard.tsx
import { ArrowPathIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useBrandingOptional } from "../../../context/BrandingContext";
import { Button, Spinner } from "../../../components/ui";
import { useDashboardData } from "./dashboard/useDashboardData";
import { KpiGrid } from "./dashboard/KpiGrid";
import { QuickActions } from "./dashboard/QuickActions";
import { RecentActivityFeed } from "./dashboard/RecentActivityFeed";

export default function SystemDashboard() {
  const { currentUser } = useAuth();
  const primary = useBrandingOptional()?.primary ?? "#0B5FFF";
  const { data, loading, error, reload } = useDashboardData();

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

  if (!data) return null;

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Overview
          </p>
          <h1 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            System dashboard
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Welcome back
            {currentUser?.first_name ? `, ${currentUser.first_name}` : ""}.
            Snapshot of the platform — full charts live under Analytics.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/system/analytics"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
            style={{ backgroundColor: primary }}
          >
            <ChartBarIcon className="h-4 w-4" />
            View full analytics
          </Link>
          <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
            <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <KpiGrid summary={data.summary} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        <QuickActions />
        <div className="sm:col-span-1 xl:col-span-2">
          <RecentActivityFeed users={data.recentUsers} />
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-800/40">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Need deeper charts?
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            County breakdowns, growth series, funnels, and activity heatmap.
          </p>
        </div>
        <Link
          to="/system/analytics"
          className="text-sm font-medium transition hover:opacity-80"
          style={{ color: primary }}
        >
          Open analytics →
        </Link>
      </div>

      <p className="pb-1 text-center text-xs text-slate-400 dark:text-slate-500">
        Last updated {data.lastUpdated.toLocaleString()}
      </p>
    </div>
  );
}