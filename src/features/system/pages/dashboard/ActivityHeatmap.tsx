import { useMemo } from "react";
import { ChartCard } from "./ChartCard";
import type { DashboardModel } from "./types";
import { cn } from "../../../../lib/cn";

export function ActivityHeatmap({
  data,
}: {
  data: DashboardModel["activityHeat"];
}) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 15 }, (_, i) => i + 6); // 6–20

  const max = useMemo(() => Math.max(1, ...data.map((d) => d.value)), [data]);

  function cell(day: string, hour: number) {
    return data.find((d) => d.day === day && d.hour === hour)?.value ?? 0;
  }

  function intensity(v: number) {
    const t = v / max;
    if (t === 0) return "bg-slate-100 dark:bg-slate-800";
    if (t < 0.25) return "bg-blue-100 dark:bg-blue-900/40";
    if (t < 0.5) return "bg-blue-300 dark:bg-blue-700/60";
    if (t < 0.75) return "bg-blue-500 dark:bg-blue-500";
    return "bg-blue-700 dark:bg-blue-400";
  }

  return (
    <ChartCard
      title="Activity heatmap"
      subtitle="Relative platform activity by day & hour"
    >
      <div className="overflow-x-auto">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `40px repeat(${hours.length}, minmax(18px, 1fr))`,
          }}
        >
          <div />
          {hours.map((h) => (
            <div key={h} className="text-center text-[10px] text-slate-400">
              {h}
            </div>
          ))}
          {days.map((day) => (
            <div key={day} className="contents">
              <div className="flex items-center text-[11px] text-slate-500">
                {day}
              </div>
              {hours.map((hour) => {
                const v = cell(day, hour);
                return (
                  <div
                    key={`${day}-${hour}`}
                    title={`${day} ${hour}:00 — ${v}`}
                    className={cn("aspect-square rounded-sm", intensity(v))}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
