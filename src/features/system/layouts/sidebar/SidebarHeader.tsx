import {
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../../../lib/cn";

const FALLBACK_LOGO = "/schoolos2.png";

interface SidebarHeaderProps {
    collapsed: boolean;
    isDark: boolean;
    logoUrl: string | null;
    onToggleCollapse: () => void;
    onCloseMobile: () => void;
    }

export function SidebarHeader({
    collapsed,
    isDark,
    logoUrl,
    onToggleCollapse,
    onCloseMobile,
    }: SidebarHeaderProps) {
    return (
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
                "overflow-hidden whitespace-nowrap transition-all duration-200",
                collapsed
                ? "w-0 scale-95 opacity-0"
                : "w-auto scale-100 opacity-100",
            )}
            >
            <p className="text-sm font-bold leading-tight tracking-tight">
                SchoolOS
            </p>
            <p
                className={cn(
                "text-[11px]",
                isDark ? "text-slate-400" : "text-slate-500",
                )}
            >
                System Root
            </p>
            </div>
        </div>

        <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
            "hidden h-7 w-7 items-center justify-center rounded-md transition-colors lg:flex",
            isDark
                ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                : "text-slate-400 hover:bg-slate-100 hover:text-slate-900",
            )}
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
            onClick={onCloseMobile}
            className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md transition-colors lg:hidden",
            isDark
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-400 hover:bg-slate-100",
            )}
            aria-label="Close menu"
        >
            <XMarkIcon className="h-4 w-4" />
        </button>
        </div>
    );
}
