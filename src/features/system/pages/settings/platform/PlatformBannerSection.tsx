// src/features/system/pages/settings/platform/PlatformBannerSection.tsx
import { useEffect, useState } from "react";
import { MegaphoneIcon } from "@heroicons/react/24/outline";
import { Button, Input, Select, useToast } from "../../../../../components/ui";
import {
  BANNER_LEVEL_OPTIONS,
  type BannerLevel,
} from "../../../../../api/branding";
import { normalizeError } from "../../../../../api/client";
import { SettingsSection } from "../SettingsSection";
import { useSystemBranding } from "./useSystemBranding";
import { cn } from "../../../../../lib/cn";

export function PlatformBannerSection() {
  const { branding, loading, saving, save } = useSystemBranding(true);
  const { success, error: toastError } = useToast();

  const [enabled, setEnabled] = useState(false);
  const [text, setText] = useState("");
  const [level, setLevel] = useState<BannerLevel>("info");
  const [dismissible, setDismissible] = useState(true);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!branding) return;
    setEnabled(branding.banner_enabled);
    setText(branding.banner_text || "");
    setLevel(branding.banner_level || "info");
    setDismissible(branding.banner_dismissible);
    setUrl(branding.banner_url || "");
  }, [branding]);

  async function handleSave() {
    try {
      await save({
        banner_enabled: enabled,
        banner_text: text,
        banner_level: level,
        banner_dismissible: dismissible,
        banner_url: url,
      });
      success("Global banner updated");
    } catch (err) {
      toastError(normalizeError(err).message);
    }
  }

  if (loading && !branding) {
    return (
      <SettingsSection icon={MegaphoneIcon} title="Global banner">
        <p className="text-sm text-slate-500">Loading…</p>
      </SettingsSection>
    );
  }

  const levelStyles: Record<BannerLevel, string> = {
    info: "border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-100",
    success:
      "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100",
    warning:
      "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-100",
    danger:
      "border-red-300 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-900/30 dark:text-red-100",
  };

  return (
    <SettingsSection
      icon={MegaphoneIcon}
      title="Global banner"
      description="One notice across all tenants. Use for exams, maintenance, or emergencies."
    >
      <div className="space-y-4">
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            disabled={saving}
            className="h-4 w-4 rounded border-slate-300 text-blue-600"
          />
          <span className="font-medium text-slate-800 dark:text-slate-200">
            Banner enabled
          </span>
        </label>

        <Select
          label="Level"
          options={BANNER_LEVEL_OPTIONS}
          value={level}
          onChange={(e) => setLevel(e.target.value as BannerLevel)}
          disabled={saving}
        />

        <Input
          label="Message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={saving}
          placeholder="National examination window is active. Limit non-essential changes."
        />

        <Input
          label="Link URL (optional)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={saving}
          placeholder="https://…"
        />

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={dismissible}
            onChange={(e) => setDismissible(e.target.checked)}
            disabled={saving}
            className="h-4 w-4 rounded border-slate-300 text-blue-600"
          />
          <span className="text-slate-700 dark:text-slate-300">
            Users can dismiss
          </span>
        </label>

        {enabled && text && (
          <div
            className={cn(
              "rounded-lg border px-3 py-2 text-sm",
              levelStyles[level],
            )}
          >
            {text}
          </div>
        )}

        <Button size="sm" loading={saving} onClick={handleSave}>
          Save banner
        </Button>
      </div>
    </SettingsSection>
  );
}
