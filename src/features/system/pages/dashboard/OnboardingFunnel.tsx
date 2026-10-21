import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { ChartCard } from "./ChartCard";
import type { NameValue } from "./types";

const COLORS = ["#3b82f6", "#6366f1", "#10b981", "#14b8a6"];

export function OnboardingFunnel({ data }: { data: NameValue[] }) {
  return (
    <ChartCard title="Onboarding funnel" subtitle="School activation pipeline">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-slate-200 dark:stroke-slate-700"
          />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={80}
            tick={{ fontSize: 11 }}
          />
          <Tooltip />
          <Bar dataKey="value" name="Schools" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
