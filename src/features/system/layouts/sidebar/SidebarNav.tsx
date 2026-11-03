import { navigation } from "./navigation";
import { SidebarNavItem } from "./SidebarNavItem";
import { cn } from "../../../../lib/cn";

interface SidebarNavProps {
    collapsed: boolean;
    isDark: boolean;
    primary: string;
    onNavigate?: () => void;
}

export function SidebarNav({
    collapsed,
    isDark,
    primary,
    onNavigate,
    }: SidebarNavProps) {
    return (
        <nav className="flex-1 space-y-4 overflow-y-auto px-2.5 py-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        {navigation.map((group) => (
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
                {group.items.map((item) => (
                <SidebarNavItem
                    key={`${group.section}-${item.path}-${item.label}`}
                    item={item}
                    collapsed={collapsed}
                    isDark={isDark}
                    primary={primary}
                    onNavigate={onNavigate}
                />
                ))}
            </div>
            </div>
        ))}
        </nav>
    );
}
