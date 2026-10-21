import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { ChartCard } from "./ChartCard";
import type { StackedPoint } from "./types";

export function StackedCategoryBar({ data }: { data: StackedPoint[] }) {
  return (
    <ChartCard
      title="Public vs private by county"
      subtitle="Category mix across top counties"
    >
      {data.length === 0 ? (
        <div className="flex h-55 items-center justify-center text-sm text-slate-400">
          No category data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="public"
              stackId="a"
              fill="#3b82f6"
              radius={[0, 0, 0, 0]}
            />
            <Bar dataKey="private" stackId="a" fill="#8b5cf6" />
            <Bar
              dataKey="other"
              stackId="a"
              fill="#94a3b8"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
