// src/features/system/pages/settings/platform/PlatformBrandingSection.tsx
import { useEffect, useState } from "react";
import { SwatchIcon } from "@heroicons/react/24/outline";
import { Button, Input, useToast } from "../../../../../components/ui";
import { SettingsSection } from "../SettingsSection";
import { useSystemBranding } from "./useSystemBranding";
import type { ColourTokens } from "../../../../../api/branding";
import { normalizeError } from "../../../../../api/client";

const TOKEN_KEYS: { key: keyof ColourTokens; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "accent", label: "Accent" },
  { key: "success", label: "Success" },
  { key: "warning", label: "Warning" },
  { key: "danger", label: "Danger" },
];

export function PlatformBrandingSection() {
  const { branding, loading, saving, error, save, upload } =
    useSystemBranding(true);
  const { success, error: toastError } = useToast();

  const [tokens, setTokens] = useState<ColourTokens>({});

  useEffect(() => {
    if (branding?.colour_tokens) {
      setTokens({ ...branding.colour_tokens });
    }
  }, [branding]);

  async function handleSaveColours() {
    try {
      await save({ colour_tokens: tokens });
      success("Platform colours updated");
    } catch (err) {
      toastError(normalizeError(err).message);
    }
  }

  async function handleLogo(
    field: "logo_light" | "logo_dark" | "logo_square" | "favicon",
    file: File | null,
  ) {
    if (!file) return;
    try {
      await upload({ [field]: file });
      success("Logo updated");
    } catch (err) {
      toastError(normalizeError(err).message);
    }
  }

  if (loading && !branding) {
    return (
      <SettingsSection icon={SwatchIcon} title="Platform branding">
        <p className="text-sm text-slate-500">Loading branding…</p>
      </SettingsSection>
    );
  }

  return (
    <SettingsSection
      icon={SwatchIcon}
      title="Platform branding"
      description="System logos and default colours. Schools inherit these when they have not set their own."
    >
      {error && (
        <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Logos */}
      <div className="mb-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Logos
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <LogoSlot
            label="Primary (light)"
            hint="Main system logo"
            url={branding?.logo_light}
            onFile={(f) => handleLogo("logo_light", f)}
            disabled={saving}
          />
          <LogoSlot
            label="Primary (dark)"
            hint="Dark mode variant"
            url={branding?.logo_dark}
            onFile={(f) => handleLogo("logo_dark", f)}
            disabled={saving}
          />
          <LogoSlot
            label="Secondary / fallback"
            hint="Used when a school has no logo"
            url={branding?.logo_square}
            onFile={(f) => handleLogo("logo_square", f)}
            disabled={saving}
          />
          <LogoSlot
            label="Favicon"
            hint="Browser tab icon"
            url={branding?.favicon}
            onFile={(f) => handleLogo("favicon", f)}
            disabled={saving}
          />
        </div>
      </div>

      {/* Colours */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Default colours
        </p>
        <p className="text-xs text-slate-500">
          Schools without their own main/secondary colours use these tokens for
          buttons, spinners, and chrome.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {TOKEN_KEYS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 text-sm">
              <input
                type="color"
                value={normalizeHex(tokens[key])}
                onChange={(e) =>
                  setTokens((t) => ({ ...t, [key]: e.target.value }))
                }
                className="h-9 w-12 cursor-pointer rounded border border-slate-200 bg-transparent p-0.5 dark:border-slate-600"
                disabled={saving}
              />
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-slate-800 dark:text-slate-200">
                  {label}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {tokens[key] || "—"}
                </span>
              </span>
            </label>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <span
            className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium text-white"
            style={{ backgroundColor: normalizeHex(tokens.primary) }}
          >
            Primary button
          </span>
          <span
            className="inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium"
            style={{
              borderColor: normalizeHex(tokens.secondary),
              color: normalizeHex(tokens.secondary),
            }}
          >
            Secondary
          </span>
          <span
            className="inline-flex h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-transparent"
            style={{ borderTopColor: normalizeHex(tokens.primary) }}
          />
        </div>
        <Button size="sm" loading={saving} onClick={handleSaveColours}>
          Save colours
        </Button>
      </div>
    </SettingsSection>
  );
}

function normalizeHex(value?: string) {
  if (!value || !/^#?[0-9a-fA-F]{6}$/.test(value.replace("#", ""))) {
    return "#0B5FFF";
  }
  return value.startsWith("#") ? value : `#${value}`;
}

function LogoSlot({
  label,
  hint,
  url,
  onFile,
  disabled,
}: {
  label: string;
  hint: string;
  url?: string | null;
  onFile: (file: File | null) => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
      <p className="text-sm font-medium text-slate-900 dark:text-white">
        {label}
      </p>
      <p className="text-xs text-slate-500">{hint}</p>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-800">
          {url ? (
            <img
              src={url}
              alt=""
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <span className="text-[10px] text-slate-400">None</span>
          )}
        </div>
        <Input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon"
          disabled={disabled}
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}
