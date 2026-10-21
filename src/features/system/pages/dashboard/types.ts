// src/features/system/pages/dashboard/types.ts
import type { User } from "../../../../api/users";
import type { SchoolListItem } from "../../../../api/schools";

export interface DashboardSummary {
  total_users: number;
  total_schools: number;
  active_schools: number;
}

export interface NameValue {
  name: string;
  value: number;
}

export interface TimedPoint {
  label: string;
  value: number;
  secondary?: number;
}

export interface StackedPoint {
  name: string;
  public: number;
  private: number;
  other: number;
}

export interface DashboardModel {
  summary: DashboardSummary;
  recentUsers: User[];
  schools: SchoolListItem[];
  byCounty: NameValue[];
  byType: NameValue[];
  activeMix: NameValue[];
  userGrowth: TimedPoint[];
  enrollmentTrend: TimedPoint[];
  onboardingFunnel: NameValue[];
  healthRadar: NameValue[];
  categoryStack: StackedPoint[];
  activityHeat: { day: string; hour: number; value: number }[];
  lastUpdated: Date;
}
