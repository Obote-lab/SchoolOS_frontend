import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartCard } from "./ChartCard";
import type { NameValue } from "./types";

export function HealthRadar({ data }: { data: NameValue[] }) {
  return (
    <ChartCard
      title="Platform health radar"
      subtitle="Composite operational scores"
    >
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
