import api from "./client";

export type PlatformMode =
  | "normal"
  | "exam_season"
  | "maintenance"
  | "campaign"
  | "emergency"
  | "national_holiday"
  | "opening_season"
  | "half_term"
  | "closing_season"
  | "games_season"
  | "Music_festival";

export type BannerLevel = "info" | "success" | "warning" | "danger";
export type Density = "compact" | "comfortable" | "spacious";

export interface ColourTokens {
  primary?: string;
  primary_foreground?: string;
  secondary?: string;
  secondary_foreground?: string;
  accent?: string;
  accent_foreground?: string;
  success?: string;
  warning?: string;
  danger?: string;
  background?: string;
  surface?: string;
  text_primary?: string;
  text_muted?: string;
  [key: string]: string | undefined;
}

export interface SystemBranding {
  id: string;
  logo_light: string | null;
  logo_dark: string | null;
  logo_square: string | null;
  favicon: string | null;
  mode: PlatformMode;
  mode_label: string;
  mode_logo_light: string | null;
  mode_logo_dark: string | null;
  colour_tokens: ColourTokens;
  mode_colour_overrides: Record<string, string>;
  typography: Record<string, unknown>;
  density: Density;
  border_radius_px: number;
  banner_enabled: boolean;
  banner_text: string;
  banner_level: BannerLevel;
  banner_dismissible: boolean;
  banner_url: string;
  login_background: string | null;
  login_welcome_message: string;
  support_email: string;
  support_phone: string;
  version: number;
  is_active: boolean;
  updated_by: string | null;
  updated_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface SystemBrandingUpdate {
  mode?: PlatformMode;
  mode_label?: string;
  colour_tokens?: ColourTokens;
  density?: Density;
  border_radius_px?: number;
  banner_enabled?: boolean;
  banner_text?: string;
  banner_level?: BannerLevel;
  banner_dismissible?: boolean;
  banner_url?: string;
  login_welcome_message?: string;
  support_email?: string;
  support_phone?: string;
}

export interface ResolvedBranding {
  version: string;
  system_version: number;
  school_version: number | null;
  mode: PlatformMode;
  mode_label: string;
  system_logo: {
    light: string | null;
    dark: string | null;
    square?: string | null;
    favicon?: string | null;
  };
  school_logo: {
    light: string | null;
    dark: string | null;
  } | null;
  tokens: Record<string, string>;
  typography: Record<string, unknown>;
  density: Density;
  border_radius_px: number;
  banner: {
    text: string;
    level: BannerLevel;
    dismissible: boolean;
    url?: string | null;
    source: string;
  } | null;
  login: {
    background: string | null;
    welcome_message: string;
    support_email: string;
    support_phone: string;
  };
  school_id: string | null;
  school_name: string | null;
}

const BASE = "/api/v1/branding";

export const brandingAPI = {
  getResolved: (schoolId?: string) =>
    api.get<ResolvedBranding>(`${BASE}/resolved/`, {
      params: schoolId ? { school_id: schoolId } : undefined,
    }),

  /** Singleton system branding (list returns the solo record). */
  getSystem: () => api.get<SystemBranding>(`${BASE}/system/`),

  updateSystem: (id: string, data: SystemBrandingUpdate) =>
    api.patch<SystemBranding>(`${BASE}/system/${id}/`, data),

  /** Logos require multipart. */
  uploadSystemAssets: (id: string, files: Record<string, File>) => {
    const form = new FormData();
    Object.entries(files).forEach(([key, file]) => {
      if (file) form.append(key, file);
    });
    return api.patch<SystemBranding>(`${BASE}/system/${id}/`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  setMode: (mode: PlatformMode, mode_label?: string) =>
    api.post<SystemBranding>(`${BASE}/system/set-mode/`, {
      mode,
      mode_label: mode_label ?? "",
    }),
};

export default brandingAPI;

export const PLATFORM_MODE_OPTIONS: { value: PlatformMode; label: string }[] = [
  { value: "normal", label: "Normal operations" },
  { value: "exam_season", label: "Exam season" },
  { value: "maintenance", label: "Maintenance" },
  { value: "campaign", label: "Campaign / awareness" },
  { value: "emergency", label: "Emergency" },
  { value: "national_holiday", label: "National holiday" },
  { value: "opening_season", label: "Opening season" },
  { value: "half_term", label: "Half term" },
  { value: "closing_season", label: "Closing season" },
  { value: "games_season", label: "Games season" },
  { value: "Music_festival", label: "Music festival" },
];

export const BANNER_LEVEL_OPTIONS: { value: BannerLevel; label: string }[] = [
  { value: "info", label: "Info" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "danger", label: "Danger" },
];
