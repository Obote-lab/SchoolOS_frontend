import { useState } from "react";
import { NavLink } from "react-router-dom";
import type { NavItem } from "./navigation";
import { cn } from "../../../../lib/cn";

interface SidebarNavItemProps {
    item: NavItem;
    collapsed: boolean;
    isDark: boolean;
    primary: string;
    onNavigate?: () => void;
}

export function SidebarNavItem({
    item,
    collapsed,
    isDark,
    primary,
    onNavigate,
    }: SidebarNavItemProps) {
    const [hovered, setHovered] = useState(false);
    const Icon = item.icon;

    return (
        <NavLink
        to={item.path}
        end={item.path === "/system/dashboard"}
        onClick={onNavigate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={({ isActive }) =>
            cn(
            "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-150",
            collapsed && "justify-center px-2",
            isActive
                ? isDark
                ? "text-white"
                : "text-slate-900"
                : isDark
                ? "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )
        }
        style={({ isActive }) =>
            isActive
            ? {
                backgroundColor: isDark ? `${primary}28` : `${primary}14`,
                color: isDark ? undefined : primary,
                }
            : undefined
        }
        >
        {({ isActive }) => (
            <>
            <div
                className={cn(
                "relative flex items-center justify-center",
                collapsed && "w-full",
                )}
            >
                <Icon
                className={cn(
                    "h-4.5 w-4.5 shrink-0 transition-transform duration-150",
                    (isActive || hovered) && "scale-110",
                )}
                style={isActive && isDark ? { color: primary } : undefined}
                />
                {collapsed && isActive && (
                <span
                    className="absolute -right-0.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: primary }}
                />
                )}
            </div>

            <span
                className={cn(
                "min-w-0 flex-1 truncate transition-all duration-200",
                collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                )}
            >
                {item.label}
            </span>

            {!collapsed && item.badge != null && (
                <span
                className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white"
                style={{ backgroundColor: primary }}
                >
                {item.badge}
                </span>
            )}

            {!collapsed && isActive && (
                <span
                className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full"
                style={{ backgroundColor: primary }}
                />
            )}

            {collapsed && (
                <span
                className={cn(
                    "pointer-events-none absolute left-full z-50 ml-2.5 whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium shadow-lg transition-all duration-150",
                    hovered
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-1 opacity-0",
                    isDark
                    ? "border-slate-700 bg-slate-800 text-white"
                    : "border-slate-200 bg-white text-slate-900",
                )}
                >
                {item.label}
                </span>
            )}
            </>
        )}
        </NavLink>
    );
}
