import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ChartCard } from "./ChartCard";
import type { NameValue } from "./types";

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
];

export function SchoolTypeDonut({ data }: { data: NameValue[] }) {
  return (
    <ChartCard title="School types" subtitle="Distribution by school type">
      {data.length === 0 ? (
        <div className="flex h-55 items-center justify-center text-sm text-slate-400">
          No type data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
