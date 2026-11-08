import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
    Bars3Icon,
    XMarkIcon,
    ArrowRightOnRectangleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../../../context/AuthContext";
import { useTheme } from "../../../../context/ThemeContext";
import { useBrandingOptional } from "../../../../context/BrandingContext";
import { regionalNavigation } from "./navigation";
import { getManagedCounties } from "../../lib/getManagedCounties";
import { cn } from "../../../../lib/cn";

const FALLBACK_LOGO = "/schoolos2.png";

interface RegionalSidebarProps {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
    }

export default function RegionalSidebar({
    collapsed,
    setCollapsed,
    }: RegionalSidebarProps) {
    const { currentUser, logout } = useAuth();
    const { isDark } = useTheme();
    const branding = useBrandingOptional();
    const primary = branding?.primary ?? "#0B5FFF";
    const logoUrl = branding?.logoUrl ?? null;
    const counties = getManagedCounties(currentUser);

    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
        document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    return (
        <>
        <div
            className={cn(
            "fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition lg:hidden",
            mobileOpen
                ? "visible opacity-100"
                : "invisible pointer-events-none opacity-0",
            )}
            onClick={() => setMobileOpen(false)}
            aria-hidden
        />

        <aside
            className={cn(
            "fixed inset-y-0 left-0 z-40 flex flex-col border-r shadow-xl transition-all duration-300",
            collapsed ? "w-19" : "w-60",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            isDark
                ? "border-slate-700 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-900",
            )}
        >
            <div
            className={cn(
                "flex h-14 shrink-0 items-center justify-between border-b px-3",
                isDark ? "border-slate-700" : "border-slate-200",
            )}
            >
            <div className="flex min-w-0 items-center gap-2.5 overflow-hidden">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                <img
                    src={logoUrl || FALLBACK_LOGO}
                    alt="SchoolOS"
                    className="h-full w-full object-contain p-0.5"
                    onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_LOGO;
                    }}
                />
                </div>
                <div
                className={cn(
                    "overflow-hidden whitespace-nowrap transition-all",
                    collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                )}
                >
                <p className="text-sm font-bold leading-tight">SchoolOS</p>
                <p
                    className={cn(
                    "text-[11px]",
                    isDark ? "text-slate-400" : "text-slate-500",
                    )}
                >
                    Regional Admin
                </p>
                </div>
            </div>
            <button
                type="button"
                className="hidden h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 lg:flex dark:hover:bg-slate-800"
                onClick={() => setCollapsed(!collapsed)}
                aria-label="Toggle sidebar"
            >
                {collapsed ? (
                <ChevronRightIcon className="h-4 w-4" />
                ) : (
                <ChevronLeftIcon className="h-4 w-4" />
                )}
            </button>
            <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 lg:hidden"
                onClick={() => setMobileOpen(false)}
                aria-label="Close"
            >
                <XMarkIcon className="h-4 w-4" />
            </button>
            </div>

            {!collapsed && counties.length > 0 && (
            <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Your counties
                </p>
                <p className="mt-0.5 truncate text-xs font-medium text-slate-600 dark:text-slate-300">
                {counties.join(", ")}
                </p>
            </div>
            )}

            <nav className="flex-1 space-y-4 overflow-y-auto px-2.5 py-3">
            {regionalNavigation.map((group) => (
                <div key={group.section}>
                {!collapsed && (
                    <p
                    className={cn(
                        "mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-wider",
                        isDark ? "text-slate-500" : "text-slate-400",
                    )}
                    >
                    {group.section}
                    </p>
                )}
                <div className="space-y-0.5">
                    {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path.endsWith("dashboard")}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                            cn(
                            "relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition",
                            collapsed && "justify-center px-2",
                            isActive
                                ? isDark
                                ? "text-white"
                                : "text-slate-900"
                                : isDark
                                ? "text-slate-300 hover:bg-slate-800"
                                : "text-slate-600 hover:bg-slate-100",
                            )
                        }
                        style={({ isActive }) =>
                            isActive
                            ? {
                                backgroundColor: isDark
                                    ? `${primary}28`
                                    : `${primary}14`,
                                color: isDark ? undefined : primary,
                                }
                            : undefined
                        }
                        >
                        {({ isActive }) => (
                            <>
                            <Icon className="h-4.5 w-4.5 shrink-0" />
                            <span
                                className={cn(
                                "truncate transition-all",
                                collapsed ? "w-0 opacity-0" : "opacity-100",
                                )}
                            >
                                {item.label}
                            </span>
                            {!collapsed && isActive && (
                                <span
                                className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full"
                                style={{ backgroundColor: primary }}
                                />
                            )}
                            </>
                        )}
                        </NavLink>
                    );
                    })}
                </div>
                </div>
            ))}
            </nav>

            <div
            className={cn(
                "shrink-0 space-y-1.5 border-t p-2.5",
                isDark ? "border-slate-700" : "border-slate-200",
            )}
            >
            <div
                className={cn(
                "flex items-center gap-2.5 rounded-lg p-1.5",
                collapsed && "justify-center",
                )}
            >
                <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: primary }}
                >
                {(currentUser?.first_name || currentUser?.login_id || "R")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                {!collapsed && (
                <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">
                    {currentUser?.first_name || "Regional"}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                    {currentUser?.login_id}
                    </p>
                </div>
                )}
            </div>
            <button
                type="button"
                onClick={() => logout()}
                className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40",
                collapsed && "justify-center",
                )}
            >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                {!collapsed && <span>Sign out</span>}
            </button>
            </div>
        </aside>

        {!mobileOpen && (
            <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-2xl lg:hidden"
            style={{ backgroundColor: primary }}
            aria-label="Open menu"
            >
            <Bars3Icon className="h-6 w-6" />
            </button>
        )}
        </>
    );
}
