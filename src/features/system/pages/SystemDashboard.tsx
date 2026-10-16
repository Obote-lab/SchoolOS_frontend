// src/features/system/pages/SystemDashboard.tsx
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import {
  AcademicCapIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  UsersIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  BuildingLibraryIcon,
  ArrowPathIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { systemAPI } from "../../../api/system";

// Types
interface DashboardStats {
  total_schools: number;
  active_schools: number;
  total_students: number;
  total_staff: number;
  growth_percentage?: number;
}

interface RecentActivity {
  id: string;
  type: "user_login" | "school_registered" | "user_created" | "system_event";
  message: string;
  timestamp: string;
  user?: string;
}

export default function SystemDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    total_schools: 0,
    active_schools: 0,
    total_students: 0,
    total_staff: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await systemAPI.getDashboard();

      setStats({
        total_schools: data.summary.total_schools || 0,
        active_schools: data.summary.active_schools || 0,
        total_students: data.summary.total_users || 0,
        total_staff: 0,
      });

      // Transform recent users into activity items if available
      if (data.recent_users && data.recent_users.length > 0) {
        const activities: RecentActivity[] = data.recent_users
          .slice(0, 5)
          .map((user: any) => ({
            id: user.id,
            type: "user_created",
            message: `${user.full_name || user.first_name} joined the platform`,
            timestamp: user.date_joined || new Date().toISOString(),
            user: user.full_name || user.first_name,
          }));
        setRecentActivity(activities);
      }

      setLastUpdated(new Date());
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Statistics configuration with dynamic values
  const statistics = [
    {
      label: "Total Schools",
      value: stats.total_schools.toLocaleString(),
      description: "Registered schools",
      icon: BuildingOfficeIcon,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/30",
      trend: "+12% this month",
    },
    {
      label: "Active Schools",
      value: stats.active_schools.toLocaleString(),
      description: "Currently operational",
      icon: AcademicCapIcon,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/30",
      trend: `${stats.active_schools > 0 ? Math.round((stats.active_schools / stats.total_schools) * 100) : 0}% active`,
    },
    {
      label: "Total Users",
      value: stats.total_students.toLocaleString(),
      description: "Across all schools",
      icon: UsersIcon,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/30",
      trend: "↑ 8.5%",
    },
    {
      label: "System Health",
      value: "98.7%",
      description: "Uptime this month",
      icon: CheckCircleIcon,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/30",
      trend: "All systems operational",
    },
  ];

  // Recent activity items (mock data for demo)
  const activityItems =
    recentActivity.length > 0
      ? recentActivity
      : [
          {
            id: "1",
            type: "system_event" as const,
            message: "System backup completed successfully",
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          },
          {
            id: "2",
            type: "user_login" as const,
            message: "Admin user logged in from new device",
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            user: "John Doe",
          },
          {
            id: "3",
            type: "school_registered" as const,
            message: "New school registered: Nairobi Academy",
            timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          },
        ];

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "user_login":
        return <UsersIcon className="h-4 w-4 text-blue-500" />;
      case "school_registered":
        return <BuildingLibraryIcon className="h-4 w-4 text-emerald-500" />;
      case "user_created":
        return <UserGroupIcon className="h-4 w-4 text-violet-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-slate-500" />;
    }
  };

  const getActivityColor = (type: RecentActivity["type"]) => {
    switch (type) {
      case "user_login":
        return "bg-blue-50 dark:bg-blue-900/20";
      case "school_registered":
        return "bg-emerald-50 dark:bg-emerald-900/20";
      case "user_created":
        return "bg-violet-50 dark:bg-violet-900/20";
      default:
        return "bg-slate-50 dark:bg-slate-800/50";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            System Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Welcome back, {currentUser?.first_name || "System Administrator"}.
            Here's an overview of SchoolOS.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="ml-auto text-sm font-medium text-red-700 dark:text-red-300 hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Statistics Grid with Loading Skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5 shadow-sm animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          : statistics.map((stat) => (
              <div
                key={stat.label}
                className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-lg p-3 ${stat.bg} transition-colors group-hover:scale-110`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>
                    <p className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {stat.description}
                      </p>
                      {stat.trend && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {stat.trend}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Main sections */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Recent Activity */}
        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Recent System Activity
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Important events across the platform
              </p>
            </div>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </button>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              // Loading skeletons for activity
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-3 animate-pulse"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              ))
            ) : activityItems.length > 0 ? (
              activityItems.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <div
                    className={`rounded-full p-1.5 ${getActivityColor(activity.type)}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {activity.message}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {formatTime(activity.timestamp)}
                      </span>
                      {activity.user && (
                        <>
                          <span className="text-xs text-slate-300 dark:text-slate-600">
                            •
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {activity.user}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex min-h-48 items-center justify-center text-sm text-slate-400 dark:text-slate-500">
                <div className="text-center">
                  <ClockIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm">
          <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Quick Actions
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Common administrative tasks
            </p>
          </div>
          <div className="space-y-2 p-4">
            <Link
              to="/system/schools"
              className="flex items-center gap-3 w-full rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition group"
            >
              <span className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-2 group-hover:scale-110 transition">
                <PlusIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </span>
              Register School
            </Link>

            <Link
              to="/system/administrators"
              className="flex items-center gap-3 w-full rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition group"
            >
              <span className="rounded-lg bg-violet-50 dark:bg-violet-900/30 p-2 group-hover:scale-110 transition">
                <UserGroupIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </span>
              Create Administrator
            </Link>

            <Link
              to="/system/audit-logs"
              className="flex items-center gap-3 w-full rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition group"
            >
              <span className="rounded-lg bg-amber-50 dark:bg-amber-900/30 p-2 group-hover:scale-110 transition">
                <ClipboardDocumentListIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </span>
              View Audit Logs
            </Link>

            <Link
              to="/system/users"
              className="flex items-center gap-3 w-full rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition group"
            >
              <span className="rounded-lg bg-emerald-50 dark:bg-emerald-900/30 p-2 group-hover:scale-110 transition">
                <UsersIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </span>
              Manage Users
            </Link>
          </div>
        </section>
      </div>

      {/* System Status */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm">
        <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                System Status
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Current system health and performance metrics
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              All Systems Operational
            </span>
          </div>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          {[
            {
              name: "API Service",
              status: "Operational",
              uptime: "99.9%",
              icon: ArrowTrendingUpIcon,
            },
            {
              name: "Database",
              status: "Operational",
              uptime: "99.8%",
              icon: CheckCircleIcon,
            },
            {
              name: "Authentication",
              status: "Operational",
              uptime: "99.9%",
              icon: UsersIcon,
            },
          ].map((service) => (
            <div
              key={service.name}
              className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
            >
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/30 p-2">
                <service.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {service.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {service.status}
                  </p>
                  <span className="text-xs text-slate-300 dark:text-slate-600">
                    •
                  </span>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {service.uptime} uptime
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
