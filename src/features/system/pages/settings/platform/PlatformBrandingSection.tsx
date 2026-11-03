// src/features/system/pages/settings/platform/PlatformBrandingSection.tsx
import { useEffect, useRef, useState } from "react";
import {
  PhotoIcon,
  SwatchIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { Button, useToast } from "../../../../../components/ui";
import { SettingsSection } from "../SettingsSection";
import { useSystemBranding } from "./useSystemBranding";
import type { ColourTokens } from "../../../../../api/branding";
import { normalizeError } from "../../../../../api/client";
import { useBranding } from "../../../../../context/BrandingContext";
import { cn } from "../../../../../lib/cn";

const TOKEN_KEYS: { key: keyof ColourTokens; label: string; hint: string }[] = [
  { key: "primary", label: "Primary", hint: "Buttons, links, focus rings" },
  { key: "secondary", label: "Secondary", hint: "Secondary actions, text" },
  { key: "accent", label: "Accent", hint: "Highlights and badges" },
  { key: "success", label: "Success", hint: "Confirmations" },
  { key: "warning", label: "Warning", hint: "Cautions" },
  { key: "danger", label: "Danger", hint: "Destructive actions" },
];

export function PlatformBrandingSection() {
  const { branding, loading, saving, error, save, upload } =
    useSystemBranding(true);
  const { reload: reloadResolved } = useBranding();
  const { success, error: toastError } = useToast();
  const [tokens, setTokens] = useState<ColourTokens>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (branding?.colour_tokens) {
      setTokens({ ...branding.colour_tokens });
      setDirty(false);
    }
  }, [branding]);

  async function handleSaveColours() {
    try {
      await save({ colour_tokens: tokens });
      await reloadResolved();
      setDirty(false);
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
      await reloadResolved();
      success("Logo updated");
    } catch (err) {
      toastError(normalizeError(err).message);
    }
  }

  function updateToken(key: keyof ColourTokens, value: string) {
    setTokens((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  if (loading && !branding) {
    return (
      <SettingsSection icon={SwatchIcon} title="Platform branding">
        <p className="text-sm text-slate-500">Loading branding…</p>
      </SettingsSection>
    );
  }

  const primary = normalizeHex(tokens.primary);

  return (
    <SettingsSection
      icon={SwatchIcon}
      title="Platform branding"
      description="System logos and default colour tokens. Schools inherit these when they have not set their own."
    >
      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {/* Logos */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Logos
          </p>
          <span className="text-xs text-slate-400">PNG, SVG, WebP, ICO</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <LogoSlot
            label="Light mode"
            hint="Primary logo"
            url={branding?.logo_light}
            onFile={(f) => handleLogo("logo_light", f)}
            disabled={saving}
          />
          <LogoSlot
            label="Dark mode"
            hint="Inverted / light logo"
            url={branding?.logo_dark}
            onFile={(f) => handleLogo("logo_dark", f)}
            disabled={saving}
          />
          <LogoSlot
            label="Square / mark"
            hint="Fallback & social"
            url={branding?.logo_square}
            onFile={(f) => handleLogo("logo_square", f)}
            disabled={saving}
          />
          <LogoSlot
            label="Favicon"
            hint="Browser tab"
            url={branding?.favicon}
            onFile={(f) => handleLogo("favicon", f)}
            disabled={saving}
            compact
          />
        </div>
      </div>

      {/* Colours */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Default colours
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Used for buttons, focus rings and chrome when a school has no
              custom palette.
            </p>
          </div>
          {dirty && (
            <Button size="sm" loading={saving} onClick={handleSaveColours}>
              Save colours
            </Button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOKEN_KEYS.map(({ key, label, hint }) => (
            <ColorTokenRow
              key={key}
              label={label}
              hint={hint}
              value={tokens[key] || ""}
              onChange={(v) => updateToken(key, v)}
              disabled={saving}
            />
          ))}
        </div>

        {/* Live preview strip */}
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/50">
          <span className="text-xs font-medium text-slate-500">Preview</span>
          <button
            type="button"
            className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
            style={{ backgroundColor: primary }}
          >
            Primary button
          </button>
          <button
            type="button"
            className="rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition"
            style={{
              borderColor: normalizeHex(tokens.secondary),
              color: normalizeHex(tokens.secondary),
            }}
          >
            Secondary
          </button>
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white"
            style={{ backgroundColor: normalizeHex(tokens.accent) }}
          >
            Accent
          </span>
          <span
            className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-200"
            style={{ borderTopColor: primary }}
          />
          {!dirty && (
            <span className="ml-auto text-xs text-slate-400">
              Change a colour to enable save
            </span>
          )}
        </div>
      </div>
    </SettingsSection>
  );
}

function normalizeHex(value?: string) {
  if (!value) return "#0B5FFF";
  const cleaned = value.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return "#0B5FFF";
  return `#${cleaned}`;
}

function ColorTokenRow({
  label,
  hint,
  value,
  onChange,
  disabled,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const hex = normalizeHex(value);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900/40">
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 shadow-inner transition hover:ring-2 hover:ring-offset-1 dark:border-slate-600"
        style={{ backgroundColor: hex }}
        title="Pick colour"
      >
        <input
          ref={inputRef}
          type="color"
          value={hex}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {label}
        </p>
        <p className="truncate text-xs text-slate-500">{hint}</p>
      </div>
      <input
        type="text"
        value={value || ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#0B5FFF"
        className="w-22 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
      />
    </div>
  );
}

function LogoSlot({
  label,
  hint,
  url,
  onFile,
  disabled,
  compact,
}: {
  label: string;
  hint: string;
  url?: string | null;
  onFile: (file: File | null) => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        "group relative flex flex-col items-center rounded-xl border-2 border-dashed p-3 transition",
        dragging
          ? "border-indigo-400 bg-indigo-50/80 dark:border-indigo-500 dark:bg-indigo-950/30"
          : "border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-slate-600",
      )}
    >
      <div
        className={cn(
          "mb-2 flex items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-900",
          compact ? "h-12 w-12" : "h-16 w-full max-w-32",
        )}
      >
        {url ? (
          <img
            src={url}
            alt=""
            className="max-h-full max-w-full object-contain p-1"
          />
        ) : (
          <PhotoIcon className="h-6 w-6 text-slate-300 dark:text-slate-600" />
        )}
      </div>
      <p className="text-center text-xs font-medium text-slate-800 dark:text-slate-200">
        {label}
      </p>
      <p className="mb-2 text-center text-[11px] text-slate-500">{hint}</p>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600 dark:hover:bg-slate-700"
      >
        <ArrowUpTrayIcon className="h-3.5 w-3.5" />
        {url ? "Replace" : "Upload"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon"
        className="hidden"
        disabled={disabled}
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
