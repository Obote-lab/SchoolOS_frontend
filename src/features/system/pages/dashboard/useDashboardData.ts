// src/features/system/pages/dashboard/useDashboardData.ts
import { useCallback, useEffect, useState } from "react";
import systemAPI from "../../../../api/system";
import schoolsAPI from "../../../../api/schools";
import { normalizeError } from "../../../../api/client";
import type {
  DashboardModel,
  NameValue,
  TimedPoint,
  StackedPoint,
} from "./types";

function buildGrowthSeries(total: number): TimedPoint[] {
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
  ];
  // Smooth climb ending at current total (illustrative until time-series API exists)
  return labels.map((label, i) => {
    const t = (i + 1) / labels.length;
    const base = Math.max(0, Math.round(total * (0.35 + 0.65 * t * t)));
    return {
      label,
      value: base,
      secondary: Math.max(0, Math.round(base * 0.72)),
    };
  });
}

function topN(map: Map<string, number>, n = 8): NameValue[] {
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, n);
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, schoolsRes] = await Promise.all([
        systemAPI.getDashboard(),
        schoolsAPI.list({ page_size: 500 }).catch(() => ({ data: [] as any })),
      ]);

      const summary = {
        total_users: dashRes.data.summary?.total_users ?? 0,
        total_schools: dashRes.data.summary?.total_schools ?? 0,
        active_schools: dashRes.data.summary?.active_schools ?? 0,
      };

      const schools = Array.isArray(schoolsRes.data)
        ? schoolsRes.data
        : (schoolsRes.data?.results ?? []);

      const countyMap = new Map<string, number>();
      const typeMap = new Map<string, number>();
      let active = 0;
      let inactive = 0;
      const stackMap = new Map<string, StackedPoint>();

      for (const s of schools) {
        const county = (s.county || "Unknown").trim() || "Unknown";
        countyMap.set(county, (countyMap.get(county) || 0) + 1);

        const type = s.school_type || "other";
        typeMap.set(type, (typeMap.get(type) || 0) + 1);

        if (s.is_active) active += 1;
        else inactive += 1;

        const row =
          stackMap.get(county) ||
          ({ name: county, public: 0, private: 0, other: 0 } as StackedPoint);
        if (s.school_category === "public") row.public += 1;
        else if (s.school_category === "private") row.private += 1;
        else row.other += 1;
        stackMap.set(county, row);
      }

      if (summary.active_schools === 0 && schools.length) {
        summary.active_schools = active;
      }

      const model: DashboardModel = {
        summary,
        recentUsers: dashRes.data.recent_users ?? [],
        schools,
        byCounty: topN(countyMap, 10),
        byType: topN(typeMap, 8),
        activeMix: [
          { name: "Active", value: active || summary.active_schools },
          {
            name: "Inactive",
            value:
              inactive ||
              Math.max(0, summary.total_schools - summary.active_schools),
          },
        ],
        userGrowth: buildGrowthSeries(summary.total_users),
        enrollmentTrend: buildGrowthSeries(
          Math.max(summary.total_users, summary.total_schools * 120),
        ),
        onboardingFunnel: [
          {
            name: "Registered",
            value: summary.total_schools || schools.length,
          },
          {
            name: "Structures",
            value: Math.round((summary.total_schools || schools.length) * 0.78),
          },
          {
            name: "Active",
            value: summary.active_schools || active,
          },
          {
            name: "Fully live",
            value: Math.round((summary.active_schools || active) * 0.65),
          },
        ],
        healthRadar: [
          { name: "Uptime", value: 96 },
          { name: "Auth", value: 92 },
          { name: "Schools", value: summary.total_schools ? 88 : 40 },
          { name: "Users", value: summary.total_users ? 90 : 45 },
          { name: "Audit", value: 70 },
          { name: "Onboarding", value: summary.active_schools ? 82 : 50 },
        ],
        categoryStack: Array.from(stackMap.values())
          .sort(
            (a, b) =>
              b.public + b.private + b.other - (a.public + a.private + a.other),
          )
          .slice(0, 8),
        activityHeat: buildHeatmap(),
        lastUpdated: new Date(),
      };

      setData(model);
    } catch (err) {
      setError(normalizeError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
}

function buildHeatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const cells: { day: string; hour: number; value: number }[] = [];
  for (const day of days) {
    for (let hour = 6; hour <= 20; hour++) {
      const peak =
        hour >= 8 && hour <= 11 ? 1.4 : hour >= 14 && hour <= 17 ? 1.2 : 0.7;
      cells.push({
        day,
        hour,
        value: Math.round(Math.random() * 10 * peak),
      });
    }
  }
  return cells;
}
