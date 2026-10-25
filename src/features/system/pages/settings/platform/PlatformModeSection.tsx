// src/features/system/pages/settings/platform/PlatformModeSection.tsx
import { useEffect, useState } from "react";
import { BoltIcon } from "@heroicons/react/24/outline";
import { Button, Input, Select, useToast } from "../../../../../components/ui";
import {
  PLATFORM_MODE_OPTIONS,
  type PlatformMode,
} from "../../../../../api/branding";
import { normalizeError } from "../../../../../api/client";
import { SettingsSection } from "../SettingsSection";
import { useSystemBranding } from "./useSystemBranding";

export function PlatformModeSection() {
  const { branding, loading, saving, save } = useSystemBranding(true);
  const { success, error: toastError } = useToast();

  const [mode, setMode] = useState<PlatformMode>("normal");
  const [modeLabel, setModeLabel] = useState("");

  useEffect(() => {
    if (branding) {
      setMode(branding.mode);
      setModeLabel(branding.mode_label || "");
    }
  }, [branding]);

  async function handleSave() {
    if (mode !== "normal") {
      const ok = window.confirm(
        `Switch platform mode to "${mode}"? This can affect banners and visuals for all schools.`,
      );
      if (!ok) return;
    }
    try {
      await save({ mode, mode_label: modeLabel });
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

  return (
    <SettingsSection
      icon={BoltIcon}
      title="Platform mode"
      description="Operational mode for the whole platform (exam season, maintenance, emergencies)."
    >
      <div className="space-y-4">
        <Select
          label="Mode"
          options={PLATFORM_MODE_OPTIONS}
          value={mode}
          onChange={(e) => setMode(e.target.value as PlatformMode)}
          disabled={saving}
        />
        <Input
          label="Mode label (optional)"
          value={modeLabel}
          onChange={(e) => setModeLabel(e.target.value)}
          placeholder="e.g. KCSE 2026 examination window"
          disabled={saving}
          hint="Shown in banners while this mode is active"
        />
        <Button size="sm" loading={saving} onClick={handleSave}>
          Apply mode
        </Button>
      </div>
    </SettingsSection>
  );
}
