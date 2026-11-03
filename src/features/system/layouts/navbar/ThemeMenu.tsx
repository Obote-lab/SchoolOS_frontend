import { useRef, useState } from "react";
import {
    SunIcon,
    MoonIcon,
    ComputerDesktopIcon,
    } from "@heroicons/react/24/outline";
import { useTheme } from "../../../../context/ThemeContext";
import { useBrandingOptional } from "../../../../context/BrandingContext";
import { useClickOutside } from "./useClickOutside";
import { cn } from "../../../../lib/cn";

const OPTIONS = [
    { value: "light" as const, icon: SunIcon, label: "Light" },
    { value: "dark" as const, icon: MoonIcon, label: "Dark" },
    { value: "system" as const, icon: ComputerDesktopIcon, label: "System" },
    ];

export function ThemeMenu() {
    const { theme, setTheme, isDark } = useTheme();
    const branding = useBrandingOptional();
    const primary = branding?.primary ?? "#0B5FFF";

    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, open, () => setOpen(false));

    return (
        <div className="relative" ref={ref}>
        <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
            "rounded-lg p-2 transition-colors",
            isDark
                ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
            open && (isDark ? "bg-slate-800" : "bg-slate-100"),
            )}
            aria-label="Toggle theme"
        >
            {isDark ? (
            <MoonIcon className="h-5 w-5" />
            ) : (
            <SunIcon className="h-5 w-5" />
            )}
        </button>

        {open && (
            <div
            className={cn(
                "absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border py-1 shadow-2xl",
                "animate-in fade-in slide-in-from-top-2 duration-200",
                isDark
                ? "border-slate-700 bg-slate-800 shadow-black/40"
                : "border-slate-200 bg-white shadow-slate-200/60",
            )}
            >
            {OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = theme === opt.value;
                return (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                    setTheme(opt.value);
                    setOpen(false);
                    }}
                    className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
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
                    <span className="flex-1 text-left">{opt.label}</span>
                    {active && <span style={{ color: primary }}>✓</span>}
                </button>
                );
            })}
            </div>
        )}
        </div>
    );
}
