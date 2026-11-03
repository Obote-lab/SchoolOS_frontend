import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    BellIcon,
    ShieldCheckIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../../../../context/ThemeContext";
import { useBrandingOptional } from "../../../../context/BrandingContext";
import { useClickOutside } from "./useClickOutside";
import type { Notification } from "./types";
import { cn } from "../../../../lib/cn";

const INITIAL: Notification[] = [
    {
        id: "1",
        title: "New School Registered",
        message: "Nairobi Academy has been registered successfully",
        time: "2 minutes ago",
        read: false,
        type: "success",
    },
    {
        id: "2",
        title: "System Update",
        message: "Version 2.1.0 has been deployed successfully",
        time: "1 hour ago",
        read: false,
        type: "info",
    },
    {
        id: "3",
        title: "Security Alert",
        message: "Multiple failed login attempts detected",
        time: "3 hours ago",
        read: true,
        type: "warning",
    },
    {
        id: "4",
        title: "User Report Ready",
        message: "Monthly user activity report is ready for download",
        time: "5 hours ago",
        read: true,
        type: "info",
    },
];

function typeStyles(type: Notification["type"], isDark: boolean) {
    switch (type) {
        case "success":
        return isDark
            ? "bg-emerald-900/30 text-emerald-400"
            : "bg-emerald-50 text-emerald-600";
        case "warning":
        return isDark
            ? "bg-amber-900/30 text-amber-400"
            : "bg-amber-50 text-amber-600";
        case "error":
        return isDark ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-600";
        default:
        return isDark
            ? "bg-slate-700/50 text-slate-300"
            : "bg-slate-100 text-slate-600";
    }
}

export function NotificationsDropdown() {
    const { isDark } = useTheme();
    const branding = useBrandingOptional();
    const primary = branding?.primary ?? "#0B5FFF";

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<Notification[]>(INITIAL);
    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, open, () => setOpen(false));

    const unread = items.filter((n) => !n.read).length;

    function markAllRead() {
        setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    }

    function markOne(id: string) {
        setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
    }

    return (
        <div className="relative" ref={ref}>
        <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
            "relative rounded-lg p-2 transition-colors",
            isDark
                ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
            open && (isDark ? "bg-slate-800" : "bg-slate-100"),
            )}
            aria-label="Notifications"
        >
            <BellIcon className="h-5 w-5" />
            {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
                {unread > 9 ? "9+" : unread}
            </span>
            )}
        </button>

        {open && (
            <div
            className={cn(
                "absolute right-0 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border shadow-2xl",
                "animate-in fade-in slide-in-from-top-2 duration-200",
                isDark
                ? "border-slate-700 bg-slate-800 shadow-black/40"
                : "border-slate-200 bg-white shadow-slate-200/60",
            )}
            >
            <div
                className={cn(
                "flex items-center justify-between border-b px-4 py-3",
                isDark ? "border-slate-700" : "border-slate-100",
                )}
            >
                <h3
                className={cn(
                    "text-sm font-semibold",
                    isDark ? "text-white" : "text-slate-900",
                )}
                >
                Notifications
                </h3>
                <div className="flex items-center gap-2">
                {unread > 0 && (
                    <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs font-medium transition-opacity hover:opacity-80"
                    style={{ color: primary }}
                    >
                    Mark all read
                    </button>
                )}
                <span
                    className={cn(
                    "text-xs",
                    isDark ? "text-slate-500" : "text-slate-400",
                    )}
                >
                    {unread} unread
                </span>
                </div>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                {items.length === 0 ? (
                <div className="py-10 text-center">
                    <BellIcon className="mx-auto h-8 w-8 opacity-30" />
                    <p
                    className={cn(
                        "mt-2 text-sm",
                        isDark ? "text-slate-400" : "text-slate-500",
                    )}
                    >
                    No notifications
                    </p>
                </div>
                ) : (
                items.map((n) => (
                    <button
                    key={n.id}
                    type="button"
                    onClick={() => markOne(n.id)}
                    className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                        isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50",
                        !n.read && (isDark ? "bg-slate-700/25" : "bg-slate-50"),
                    )}
                    >
                    <span
                        className={cn(
                        "mt-0.5 rounded-lg p-1.5",
                        typeStyles(n.type, isDark),
                        )}
                    >
                        {n.type === "success" ? (
                        <ShieldCheckIcon className="h-4 w-4" />
                        ) : n.type === "warning" ? (
                        <ClockIcon className="h-4 w-4" />
                        ) : (
                        <BellIcon className="h-4 w-4" />
                        )}
                    </span>
                    <span className="min-w-0 flex-1">
                        <span
                        className={cn(
                            "block text-sm font-medium",
                            isDark ? "text-white" : "text-slate-900",
                        )}
                        >
                        {n.title}
                        </span>
                        <span
                        className={cn(
                            "mt-0.5 block text-xs",
                            isDark ? "text-slate-400" : "text-slate-500",
                        )}
                        >
                        {n.message}
                        </span>
                        <span
                        className={cn(
                            "mt-1 block text-[10px]",
                            isDark ? "text-slate-500" : "text-slate-400",
                        )}
                        >
                        {n.time}
                        </span>
                    </span>
                    {!n.read && (
                        <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: primary }}
                        />
                    )}
                    </button>
                ))
                )}
            </div>

            <div
                className={cn(
                "border-t px-4 py-2 text-center",
                isDark ? "border-slate-700" : "border-slate-100",
                )}
            >
                <Link
                to="/system/audit-logs"
                onClick={() => setOpen(false)}
                className="text-xs font-medium transition-opacity hover:opacity-80"
                style={{ color: primary }}
                >
                View all activity
                </Link>
            </div>
            </div>
        )}
        </div>
    );
}
