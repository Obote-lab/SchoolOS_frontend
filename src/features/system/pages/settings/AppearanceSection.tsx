// src/features/system/pages/settings/AppearanceSection.tsx
import {
  PaintBrushIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../../../../context/ThemeContext";
import { SettingsSection } from "./SettingsSection";
import { cn } from "../../../../lib/cn";

const OPTIONS = [
  { value: "light" as const, label: "Light", icon: SunIcon },
  { value: "dark" as const, label: "Dark", icon: MoonIcon },
  { value: "system" as const, label: "System", icon: ComputerDesktopIcon },
];

export function AppearanceSection() {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <SettingsSection
      icon={PaintBrushIcon}
      title="Appearance"
      description="Theme is stored on this device only."
    >
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium transition",
                active
                  ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800",
              )}
            >
              <Icon className="h-5 w-5" />
              {opt.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Currently rendering:{" "}
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {isDark ? "Dark" : "Light"}
        </span>
        {theme === "system" ? " (from system preference)" : ""}
      </p>
    </SettingsSection>
  );
}
