// src/features/system/pages/settings/platform/PlatformModeSection.tsx
import { useEffect, useState } from "react";
import {
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  ShieldExclamationIcon,
  CalendarDaysIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, useToast } from "../../../../../components/ui";
import { type PlatformMode } from "../../../../../api/branding";
import { normalizeError } from "../../../../../api/client";
import { SettingsSection } from "../SettingsSection";
import { useSystemBranding } from "./useSystemBranding";
import { cn } from "../../../../../lib/cn";

const MODE_CARDS: {
  value: PlatformMode;
  label: string;
  description: string;
  icon: typeof BoltIcon;
  tone: string;
}[] = [
  {
    value: "normal",
    label: "Normal",
    description: "Standard operations",
    icon: CheckCircleIcon,
    tone: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200",
  },
  {
    value: "exam_season",
    label: "Exam season",
    description: "KCSE / national exams",
    icon: AcademicCapIcon,
    tone: "border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-700 dark:bg-violet-950/40 dark:text-violet-200",
  },
  {
    value: "maintenance",
    label: "Maintenance",
    description: "Planned downtime",
    icon: WrenchScrewdriverIcon,
    tone: "border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200",
  },
  {
    value: "emergency",
    label: "Emergency",
    description: "Urgent platform notice",
    icon: ShieldExclamationIcon,
    tone: "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200",
  },
  {
    value: "opening_season",
    label: "Opening",
    description: "Term start",
    icon: CalendarDaysIcon,
    tone: "border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-700 dark:bg-sky-950/40 dark:text-sky-200",
  },
  {
    value: "closing_season",
    label: "Closing",
    description: "Term end",
    icon: FlagIcon,
    tone: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200",
  },
  {
    value: "campaign",
    label: "Campaign",
    description: "Awareness drive",
    icon: BoltIcon,
    tone: "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-800 dark:border-fuchsia-700 dark:bg-fuchsia-950/40 dark:text-fuchsia-200",
  },
  {
    value: "national_holiday",
    label: "Holiday",
    description: "National holiday",
    icon: ExclamationTriangleIcon,
    tone: "border-orange-300 bg-orange-50 text-orange-900 dark:border-orange-700 dark:bg-orange-950/40 dark:text-orange-200",
  },
];

export function PlatformModeSection() {
  const { branding, loading, saving, save } = useSystemBranding(true);
  const { success, error: toastError } = useToast();

  const [mode, setMode] = useState<PlatformMode>("normal");
  const [modeLabel, setModeLabel] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (branding) {
      setMode(branding.mode);
      setModeLabel(branding.mode_label || "");
      setDirty(false);
    }
  }, [branding]);

  async function handleSave() {
    if (mode !== "normal" && mode !== branding?.mode) {
      const ok = window.confirm(
        `Switch the whole platform to “${mode}”? This can affect banners and visuals for every school.`,
      );
      if (!ok) return;
    }
    try {
      await save({ mode, mode_label: modeLabel });
      setDirty(false);
      success("Platform mode updated");
    } catch (err) {
      toastError(normalizeError(err).message);
    }
  }

  if (loading && !branding) {
    return (
      <SettingsSection icon={BoltIcon} title="Platform mode">
        <p className="text-sm text-slate-500">Loading…</p>
      </SettingsSection>
    );
  }

  const active = MODE_CARDS.find((m) => m.value === mode) ?? MODE_CARDS[0];

  return (
    <SettingsSection
      icon={BoltIcon}
      title="Platform mode"
      description="Operational mode for the entire platform. Affects banners and optional visual overrides."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {MODE_CARDS.map((card) => {
            const Icon = card.icon;
            const selected = mode === card.value;
            return (
              <button
                key={card.value}
                type="button"
                disabled={saving}
                onClick={() => {
                  setMode(card.value);
                  setDirty(true);
                }}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-xl border px-2.5 py-2.5 text-left transition",
                  selected
                    ? cn(card.tone, "ring-2 ring-offset-1 ring-current/30")
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:bg-slate-800",
                )}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-80" />
                <span className="text-xs font-semibold leading-tight">
                  {card.label}
                </span>
                <span className="text-[10px] leading-tight opacity-70">
                  {card.description}
                </span>
              </button>
            );
          })}
        </div>

        <Input
          label="Custom label (optional)"
          value={modeLabel}
          onChange={(e) => {
            setModeLabel(e.target.value);
            setDirty(true);
          }}
          placeholder="e.g. KCSE 2026 examination window"
          disabled={saving}
          hint="Shown next to the mode in banners and system chrome"
        />

        <div className="flex flex-wrap items-center gap-3">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
              active.tone,
            )}
          >
            <active.icon className="h-3.5 w-3.5" />
            Active: {active.label}
            {modeLabel ? ` · ${modeLabel}` : ""}
          </div>
          <Button
            size="sm"
            loading={saving}
            disabled={!dirty}
            onClick={handleSave}
          >
            Apply mode
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
}
