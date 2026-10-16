// src/features/system/layouts/Footer.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  DocumentTextIcon,
  LifebuoyIcon,
  ChartBarIcon,
  // ArrowUpIcon,
  ShieldCheckIcon,
  ClockIcon,
  ServerIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

interface SystemStatus {
  api: boolean;
  database: boolean;
  auth: boolean;
  uptime: string;
  responseTime: number;
}

export default function Footer({ collapsed }: { collapsed: boolean }) {
  const [currentYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState<SystemStatus>({
    api: true,
    database: true,
    auth: true,
    uptime: "99.98%",
    responseTime: 124,
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Check scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simulate system status checking
  useEffect(() => {
    const interval = setInterval(() => {
      // In production, this would be an API call
      setStatus((prev) => ({
        ...prev,
        responseTime: Math.floor(Math.random() * 50 + 100),
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer
        className={`
          border-t transition-all duration-500 ease-in-out
          px-4 py-4 sm:px-6
          ${collapsed ? "lg:pl-20" : "lg:pl-64"}
          ${
            status.api && status.database && status.auth
              ? "border-emerald-200 dark:border-emerald-800/30"
              : "border-amber-200 dark:border-amber-800/30"
          }
          ${
            status.api && status.database && status.auth
              ? "bg-white dark:bg-slate-900"
              : "bg-amber-50/50 dark:bg-amber-900/10"
          }
        `}
      >
        <div className="flex flex-col gap-4">
          {/* Main Footer Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Left - Brand & Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">S</span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    SchoolOS
                  </span>
                </div>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-600">
                  •
                </span>
                <span className="text-slate-400 dark:text-slate-500">
                  © {currentYear} All rights reserved
                </span>
              </div>
              <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                Made with{" "}
                <HeartIcon className="h-3 w-3 text-red-500 animate-pulse" /> by
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  IGSSAX TEQ
                </span>
              </span>
            </div>

            {/* Center - System Status */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`
                  inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium
                  transition-all duration-300
                  ${
                    status.api && status.database && status.auth
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }
                `}
                >
                  <span
                    className={`
                    relative flex h-1.5 w-1.5
                    ${status.api && status.database && status.auth ? "" : "animate-pulse"}
                  `}
                  >
                    <span
                      className={`
                      absolute inline-flex h-full w-full rounded-full
                      ${
                        status.api && status.database && status.auth
                          ? "bg-emerald-500"
                          : "bg-amber-500"
                      }
                      ${status.api && status.database && status.auth ? "" : "animate-ping opacity-75"}
                    `}
                    ></span>
                    <span
                      className={`
                      relative inline-flex rounded-full h-1.5 w-1.5
                      ${
                        status.api && status.database && status.auth
                          ? "bg-emerald-500"
                          : "bg-amber-500"
                      }
                    `}
                    ></span>
                  </span>
                  {status.api && status.database && status.auth
                    ? "All Systems Operational"
                    : "Partial System Outage"}
                </span>
              </div>

              {/* Uptime */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <ClockIcon className="h-3.5 w-3.5" />
                <span>Uptime: {status.uptime}</span>
              </div>

              {/* Response Time */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <ServerIcon className="h-3.5 w-3.5" />
                <span>{status.responseTime}ms</span>
              </div>

              {/* Version */}
              <div className="flex items-center gap-1.5 text-xs">
                <ShieldCheckIcon className="h-3.5 w-3.5 text-blue-500" />
                <span className="font-mono text-slate-400 dark:text-slate-500">
                  v2.1.0
                </span>
              </div>
            </div>

            {/* Right - Quick Links */}
            <div className="flex items-center gap-3">
              <Link
                to="/system/settings"
                className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              >
                Settings
              </Link>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <a
                href="#"
                className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <DocumentTextIcon className="h-3.5 w-3.5" />
                Docs
              </a>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <a
                href="#"
                className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <LifebuoyIcon className="h-3.5 w-3.5" />
                Support
              </a>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <a
                href="#"
                className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <ChartBarIcon className="h-3.5 w-3.5" />
                Status
              </a>
            </div>
          </div>

          {/* Bottom Bar - Additional Info */}
          <div
            className={`
            flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t text-[10px]
            ${
              status.api && status.database && status.auth
                ? "border-slate-200 dark:border-slate-700"
                : "border-amber-200 dark:border-amber-800/30"
            }
          `}
          >
            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
              <span>Last checked: {new Date().toLocaleTimeString()}</span>
              <span className="hidden sm:inline">•</span>
              <span>Environment: Production</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
              <span>API: v2.1.0</span>
              <span className="hidden sm:inline">•</span>
              <span>Client: v2.1.0</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`
          fixed bottom-24 right-6 z-40
          flex h-10 w-10 items-center justify-center
          rounded-full shadow-lg transition-all duration-300
          ${
            showScrollTop
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          }
          ${
            status.api && status.database && status.auth
              ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-110"
              : "bg-amber-600 text-white hover:bg-amber-700 hover:scale-110"
          }
        `}
        aria-label="Scroll to top"
      >
        <ChevronUpIcon className="h-5 w-5" />
      </button>
    </>
  );
}
