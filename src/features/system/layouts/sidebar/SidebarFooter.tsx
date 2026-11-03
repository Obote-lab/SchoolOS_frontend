import { useRef, useState } from "react";
import {
    ArrowRightOnRectangleIcon,
    SunIcon,
    MoonIcon,
    ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../../../../context/ThemeContext";
import { useClickOutside } from "../navbar/useClickOutside";
import { cn } from "../../../../lib/cn";

interface SidebarFooterProps {
    collapsed: boolean;
    isDark: boolean;
    primary: string;
    firstName?: string | null;
    loginId?: string | null;
    profilePicture?: string | null;
    onExpand: () => void;
    onLogout: () => void;
}

export function SidebarFooter({
    collapsed,
    isDark,
    primary,
    firstName,
    loginId,
    profilePicture,
    onExpand,
    onLogout,
    }: SidebarFooterProps) {
    const { theme, setTheme } = useTheme();
    const [themeOpen, setThemeOpen] = useState(false);
    const themeRef = useRef<HTMLDivElement>(null);

    useClickOutside(themeRef, themeOpen, () => setThemeOpen(false));

    const initial =
        firstName?.charAt(0)?.toUpperCase() ||
        loginId?.charAt(0)?.toUpperCase() ||
        "S";

    return (
        <div
        className={cn(
            "shrink-0 space-y-1.5 border-t p-2.5",
            isDark ? "border-slate-700" : "border-slate-200",
        )}
        >
        <button
            type="button"
            onClick={onExpand}
            className={cn(
            "flex w-full items-center gap-2.5 rounded-lg p-1.5 transition-colors",
            collapsed && "justify-center",
            isDark ? "hover:bg-slate-800" : "hover:bg-slate-100",
            )}
        >
            {profilePicture ? (
            <img
                src={profilePicture}
                alt=""
                className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
            ) : (
            <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: primary }}
            >
                {initial}
            </div>
            )}
            <div
            className={cn(
                "min-w-0 overflow-hidden text-left transition-all duration-200",
                collapsed
                ? "w-0 scale-95 opacity-0"
                : "w-auto scale-100 opacity-100",
            )}
            >
            <p className="truncate text-[13px] font-semibold">
                {firstName || "System"}
            </p>
            <p
                className={cn(
                "truncate text-[11px]",
                isDark ? "text-slate-400" : "text-slate-500",
                )}
            >
                {loginId || "SYSTEM"}
            </p>
            </div>
        </button>

        {!collapsed && (
            <div className="relative" ref={themeRef}>
            <button
                type="button"
                onClick={() => setThemeOpen((v) => !v)}
                className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors",
                isDark
                    ? "text-slate-300 hover:bg-slate-800"
                    : "text-slate-600 hover:bg-slate-100",
                )}
            >
                {isDark ? (
                <MoonIcon className="h-4 w-4" />
                ) : (
                <SunIcon className="h-4 w-4" />
                )}
                <span>Theme</span>
                <span className="ml-auto text-[11px] opacity-50">
                {theme === "dark"
                    ? "Dark"
                    : theme === "light"
                    ? "Light"
                    : "System"}
                </span>
            </button>

            {themeOpen && (
                <div
                className={cn(
                    "absolute bottom-full left-0 mb-1 w-full overflow-hidden rounded-lg border py-1 shadow-xl",
                    isDark
                    ? "border-slate-700 bg-slate-800"
                    : "border-slate-200 bg-white",
                )}
                >
                {(
                    [
                    { value: "light" as const, icon: SunIcon, label: "Light" },
                    { value: "dark" as const, icon: MoonIcon, label: "Dark" },
                    {
                        value: "system" as const,
                        icon: ComputerDesktopIcon,
                        label: "System",
                    },
                    ] as const
                ).map((opt) => {
                    const Icon = opt.icon;
                    const active = theme === opt.value;
                    return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                        setTheme(opt.value);
                        setThemeOpen(false);
                        }}
                        className={cn(
                        "flex w-full items-center gap-2.5 px-2.5 py-1.5 text-[13px] transition-colors",
                        active
                            ? isDark
                            ? "bg-white/5"
                            : "bg-slate-50"
                            : isDark
                            ? "text-slate-300 hover:bg-slate-700"
                            : "text-slate-600 hover:bg-slate-50",
                        )}
                        style={active ? { color: primary } : undefined}
                    >
                        <Icon className="h-4 w-4" />
                        {opt.label}
                        {active && (
                        <span className="ml-auto" style={{ color: primary }}>
                            ✓
                        </span>
                        )}
                    </button>
                    );
                })}
                </div>
            )}
            </div>
        )}

        <button
            type="button"
            onClick={onLogout}
            className={cn(
            "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
            collapsed && "justify-center",
            isDark
                ? "text-red-400 hover:bg-red-950/50 hover:text-red-300"
                : "text-red-600 hover:bg-red-50 hover:text-red-700",
            )}
        >
            <ArrowRightOnRectangleIcon className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
            <span
            className={cn(
                "overflow-hidden whitespace-nowrap transition-all duration-200",
                collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
            )}
            >
            Sign out
            </span>
        </button>
        </div>
    );
    }
