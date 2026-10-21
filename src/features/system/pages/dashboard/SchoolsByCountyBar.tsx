import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChartCard } from "./ChartCard";
import type { NameValue } from "./types";

export function SchoolsByCountyBar({ data }: { data: NameValue[] }) {
  return (
    <ChartCard
      title="Schools by county"
      subtitle="Top counties by registered schools"
    >
      {data.length === 0 ? (
        <Empty />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
            <Tooltip />
            <Bar
              dataKey="value"
              name="Schools"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

function Empty() {
  return (
    <div className="flex h-55 items-center justify-center text-sm text-slate-400">
      No school data yet
    </div>
  );
}
