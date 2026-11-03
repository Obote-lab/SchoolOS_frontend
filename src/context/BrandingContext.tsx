import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import brandingAPI, { type ResolvedBranding } from "../api/branding";

interface BrandingContextType {
  branding: ResolvedBranding | null;
  loading: boolean;
  /** Best logo for current theme (light/dark aware) */
  logoUrl: string | null;
  /** Square / mark fallback */
  logoSquareUrl: string | null;
  primary: string;
  primaryForeground: string;
  reload: () => Promise<void>;
}

const BrandingContext = createContext<BrandingContextType | null>(null);

const DEFAULT_PRIMARY = "#0B5FFF";
const DEFAULT_PRIMARY_FG = "#FFFFFF";

function applyTokens(
  tokens: Record<string, string> | undefined,
  radiusPx?: number,
) {
  const root = document.documentElement;
  if (!tokens) return;

  for (const [key, value] of Object.entries(tokens)) {
    if (!value) continue;
    const cssKey = key.replace(/_/g, "-");
    root.style.setProperty(`--brand-${cssKey}`, value);
    root.style.setProperty(`--${cssKey}`, value);
  }
  if (typeof radiusPx === "number") {
    root.style.setProperty("--brand-radius", `${radiusPx}px`);
    root.style.setProperty("--radius", `${radiusPx}px`);
  }
}

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<ResolvedBranding | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await brandingAPI.getResolved();
      setBranding(data);
      applyTokens(data.tokens, data.border_radius_px);

      const favicon = data.system_logo?.favicon;
      if (favicon) {
        let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = favicon;
      }
    } catch {
      // Public page or offline — keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const value = useMemo<BrandingContextType>(() => {
    const system = branding?.system_logo;
    const light = system?.light ?? null;
    const dark = system?.dark ?? null;
    const square = system?.square ?? null;

    const logoUrl = (isDark ? dark || light : light || dark) || square || null;

    return {
      branding,
      loading,
      logoUrl,
      logoSquareUrl: square || logoUrl,
      primary: branding?.tokens?.primary || DEFAULT_PRIMARY,
      primaryForeground:
        branding?.tokens?.primary_foreground || DEFAULT_PRIMARY_FG,
      reload,
    };
  }, [branding, loading, isDark, reload]);

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const ctx = useContext(BrandingContext);
  if (!ctx) {
    throw new Error("useBranding must be used within BrandingProvider");
  }
  return ctx;
}

export function useBrandingOptional() {
  return useContext(BrandingContext);
}
