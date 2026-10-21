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

const COLORS = ["#10b981", "#94a3b8"];

export function ActiveMixPie({ data }: { data: NameValue[] }) {
  return (
    <ChartCard title="Active vs inactive" subtitle="Operational status mix">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
