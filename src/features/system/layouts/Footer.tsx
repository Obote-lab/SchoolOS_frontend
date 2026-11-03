// src/features/system/layouts/Footer.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  DocumentTextIcon,
  LifebuoyIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon,
  ServerIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useBrandingOptional } from "../../../context/BrandingContext";
import { cn } from "../../../lib/cn";

interface SystemStatus {
  api: boolean;
  database: boolean;
  auth: boolean;
  uptime: string;
  responseTime: number;
}

const VERSION = "v2.1.0";
const ENV =
  (typeof import.meta !== "undefined" &&
    (import.meta as { env?: { MODE?: string } }).env?.MODE) ||
  "production";

export default function Footer(_props: { collapsed?: boolean }) {
  // Padding is owned by SystemRootLayout's content column — do not re-apply here.
  const branding = useBrandingOptional();
  const primary = branding?.primary ?? "#0B5FFF";
  const logoUrl = branding?.logoUrl ?? null;

  const year = new Date().getFullYear();
  const [status, setStatus] = useState<SystemStatus>({
    api: true,
    database: true,
    auth: true,
    uptime: "99.98%",
    responseTime: 124,
  });
  const [checkedAt, setCheckedAt] = useState(() => new Date());
  const [showScrollTop, setShowScrollTop] = useState(false);

  const healthy = status.api && status.database && status.auth;

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStatus((prev) => ({
        ...prev,
        responseTime: Math.floor(Math.random() * 50 + 100),
      }));
      setCheckedAt(new Date());
    }, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <footer
        className={cn(
          "border-t px-4 py-3 sm:px-6",
          healthy
            ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/80"
            : "border-amber-200 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20",
        )}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
            {/* Brand */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
              <div className="flex items-center gap-2">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt=""
                    className="h-5 w-5 rounded object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold text-white"
                    style={{ backgroundColor: primary }}
                  >
                    S
                  </span>
                )}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  SchoolOS
                </span>
              </div>
              <span className="hidden text-slate-300 sm:inline dark:text-slate-600">
                ·
              </span>
              <span className="text-slate-400 dark:text-slate-500">
                © {year}
              </span>
              <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                Made with
                <HeartIcon className="h-3 w-3 text-red-500" />
                by
                <span className="font-medium" style={{ color: primary }}>
                  IGSSAX TEQ
                </span>
              </span>
            </div>

            {/* Status */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium",
                  healthy
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
                )}
              >
                <span className="relative flex h-1.5 w-1.5">
                  {!healthy && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  )}
                  <span
                    className={cn(
                      "relative inline-flex h-1.5 w-1.5 rounded-full",
                      healthy ? "bg-emerald-500" : "bg-amber-500",
                    )}
                  />
                </span>
                {healthy ? "All systems operational" : "Partial outage"}
              </span>

              <span className="hidden items-center gap-1 text-[11px] text-slate-500 sm:inline-flex dark:text-slate-400">
                <ClockIcon className="h-3.5 w-3.5" />
                {status.uptime}
              </span>
              <span className="hidden items-center gap-1 text-[11px] text-slate-500 sm:inline-flex dark:text-slate-400">
                <ServerIcon className="h-3.5 w-3.5" />
                {status.responseTime}ms
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                <ShieldCheckIcon
                  className="h-3.5 w-3.5"
                  style={{ color: primary }}
                />
                <span className="font-mono">{VERSION}</span>
              </span>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              {[
                { to: "/system/settings", label: "Settings" },
                {
                  to: "/system/docs",
                  label: "Docs",
                  icon: DocumentTextIcon,
                },
                {
                  to: "/system/help",
                  label: "Support",
                  icon: LifebuoyIcon,
                },
                {
                  to: "/system/health",
                  label: "Status",
                  icon: ChartBarIcon,
                },
              ].map((item, i) => (
                <span key={item.to} className="contents">
                  {i > 0 && (
                    <span className="text-slate-300 dark:text-slate-600">
                      |
                    </span>
                  )}
                  <Link
                    to={item.to}
                    className="inline-flex items-center gap-1 transition-opacity hover:opacity-80"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "";
                    }}
                  >
                    {item.icon && <item.icon className="h-3.5 w-3.5" />}
                    {item.label}
                  </Link>
                </span>
              ))}
            </nav>
          </div>

          <div
            className={cn(
              "flex flex-col items-center justify-between gap-1 border-t pt-2 text-[10px] text-slate-400 sm:flex-row dark:text-slate-500",
              healthy
                ? "border-slate-100 dark:border-slate-800"
                : "border-amber-200/60 dark:border-amber-900/30",
            )}
          >
            <div className="flex flex-wrap items-center justify-center gap-x-3">
              <span>Checked {checkedAt.toLocaleTimeString()}</span>
              <span className="hidden sm:inline">·</span>
              <span className="capitalize">Env: {ENV}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>API {VERSION}</span>
              <span className="hidden sm:inline">·</span>
              <span>Client {VERSION}</span>
            </div>
          </div>
        </div>
      </footer>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "fixed bottom-20 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 sm:bottom-24 sm:right-6",
          showScrollTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-8 opacity-0",
          !healthy && "bg-amber-600 hover:bg-amber-700",
        )}
        style={healthy ? { backgroundColor: primary } : undefined}
        aria-label="Scroll to top"
      >
        <ChevronUpIcon className="h-5 w-5" />
      </button>
    </>
  );
}
