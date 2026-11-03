// src/features/system/pages/settings/platform/PlatformBannerSection.tsx
import { useEffect, useState } from "react";
import {
  MegaphoneIcon,
  XMarkIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Select, useToast } from "../../../../../components/ui";
import {
  BANNER_LEVEL_OPTIONS,
  type BannerLevel,
} from "../../../../../api/branding";
import { normalizeError } from "../../../../../api/client";
import { SettingsSection } from "../SettingsSection";
import { useSystemBranding } from "./useSystemBranding";
import { cn } from "../../../../../lib/cn";

const levelStyles: Record<
  BannerLevel,
  { bar: string; text: string; pill: string }
> = {
  info: {
    bar: "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/50",
    text: "text-blue-900 dark:text-blue-100",
    pill: "bg-blue-600 text-white",
  },
  success: {
    bar: "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/50",
    text: "text-emerald-900 dark:text-emerald-100",
    pill: "bg-emerald-600 text-white",
  },
  warning: {
    bar: "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/50",
    text: "text-amber-950 dark:text-amber-100",
    pill: "bg-amber-500 text-white",
  },
  danger: {
    bar: "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/50",
    text: "text-red-900 dark:text-red-100",
    pill: "bg-red-600 text-white",
  },
};

export function PlatformBannerSection() {
  const { branding, loading, saving, save } = useSystemBranding(true);
  const { success, error: toastError } = useToast();

  const [enabled, setEnabled] = useState(false);
  const [text, setText] = useState("");
  const [level, setLevel] = useState<BannerLevel>("info");
  const [dismissible, setDismissible] = useState(true);
  const [url, setUrl] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!branding) return;
    setEnabled(branding.banner_enabled);
    setText(branding.banner_text || "");
    setLevel(branding.banner_level || "info");
    setDismissible(branding.banner_dismissible);
    setUrl(branding.banner_url || "");
    setDirty(false);
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
      setDirty(false);
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

  const styles = levelStyles[level];

  return (
    <SettingsSection
      icon={MegaphoneIcon}
      title="Global banner"
      description="One notice across every school. Ideal for exams, maintenance or emergencies."
    >
      <div className="space-y-4">
        {/* Enable toggle */}
        <button
          type="button"
          disabled={saving}
          onClick={() => {
            setEnabled((v) => !v);
            setDirty(true);
          }}
          className={cn(
            "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition",
            enabled
              ? "border-indigo-300 bg-indigo-50/80 dark:border-indigo-700 dark:bg-indigo-950/30"
              : "border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/40",
          )}
        >
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Banner {enabled ? "on" : "off"}
            </p>
            <p className="text-xs text-slate-500">
              {enabled
                ? "Visible to all authenticated users"
                : "Hidden across the platform"}
            </p>
          </div>
          <span
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition",
              enabled ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600",
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white shadow transition",
                enabled ? "translate-x-6" : "translate-x-1",
              )}
            />
          </span>
        </button>

        <Select
          label="Level"
          options={BANNER_LEVEL_OPTIONS}
          value={level}
          onChange={(e) => {
            setLevel(e.target.value as BannerLevel);
            setDirty(true);
          }}
          disabled={saving || !enabled}
        />

        <Input
          label="Message"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setDirty(true);
          }}
          disabled={saving || !enabled}
          placeholder="National examination window is active. Limit non-essential changes."
        />

        <Input
          label="Link URL (optional)"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setDirty(true);
          }}
          disabled={saving || !enabled}
          placeholder="https://…"
        />

        <label
          className={cn(
            "flex items-center gap-3 text-sm",
            (!enabled || saving) && "opacity-60",
          )}
        >
          <input
            type="checkbox"
            checked={dismissible}
            onChange={(e) => {
              setDismissible(e.target.checked);
              setDirty(true);
            }}
            disabled={saving || !enabled}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-slate-700 dark:text-slate-300">
            Users can dismiss this banner
          </span>
        </label>

        {/* Live preview */}
        <div>
          <p className="mb-1.5 text-xs font-medium text-slate-500">
            Live preview
          </p>
          {enabled && text ? (
            <div
              className={cn(
                "flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm",
                styles.bar,
                styles.text,
              )}
            >
              <span
                className={cn(
                  "mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  styles.pill,
                )}
              >
                {level}
              </span>
              <div className="min-w-0 flex-1">
                <p className="leading-snug">{text}</p>
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium underline opacity-80"
                  >
                    <LinkIcon className="h-3 w-3" />
                    Learn more
                  </a>
                )}
              </div>
              {dismissible && (
                <button
                  type="button"
                  className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
                  aria-label="Dismiss"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400 dark:border-slate-700">
              {enabled
                ? "Enter a message to preview the banner"
                : "Banner is off — turn it on to preview"}
            </div>
          )}
        </div>

        <Button
          size="sm"
          loading={saving}
          disabled={!dirty}
          onClick={handleSave}
        >
          Save banner
        </Button>
      </div>
    </SettingsSection>
  );
}
