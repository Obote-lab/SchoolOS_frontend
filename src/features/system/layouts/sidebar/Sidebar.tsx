// src/features/system/layouts/sidebar/Sidebar.tsx
import { useEffect, useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../../context/AuthContext";
import { useTheme } from "../../../../context/ThemeContext";
import { useBrandingOptional } from "../../../../context/BrandingContext";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNav } from "./SidebarNav";
import { SidebarFooter } from "./SidebarFooter";
import { cn } from "../../../../lib/cn";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (val: boolean) => void;
    mobileOpen?: boolean;
    onMobileOpenChange?: (open: boolean) => void;
}

export default function Sidebar({
    collapsed,
    setCollapsed,
    mobileOpen: mobileOpenProp,
    onMobileOpenChange,
    }: SidebarProps) {
    const { currentUser, logout } = useAuth();
    const { isDark } = useTheme();
    const branding = useBrandingOptional();

    const primary = branding?.primary ?? "#0B5FFF";
    const logoUrl = branding?.logoUrl ?? null;

    const [internalMobileOpen, setInternalMobileOpen] = useState(false);
    const mobileOpen = mobileOpenProp ?? internalMobileOpen;
    const setMobileOpen = onMobileOpenChange ?? setInternalMobileOpen;

    useEffect(() => {
        if (mobileOpen) {
        document.body.style.overflow = "hidden";
        } else {
        document.body.style.overflow = "";
        }
        return () => {
        document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    async function handleLogout() {
        await logout();
        setMobileOpen(false);
    }

    return (
        <>
        <div
            className={cn(
            "fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-all duration-300 lg:hidden",
            mobileOpen
                ? "visible opacity-100"
                : "invisible pointer-events-none opacity-0",
            )}
            onClick={() => setMobileOpen(false)}
            aria-hidden
        />

        <aside
            className={cn(
            "fixed inset-y-0 left-0 z-40 flex flex-col border-r shadow-xl transition-all duration-300 ease-in-out",
            collapsed ? "w-19" : "w-60",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            isDark
                ? "border-slate-700 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-900",
            )}
        >
            <SidebarHeader
            collapsed={collapsed}
            isDark={isDark}
            logoUrl={logoUrl}
            onToggleCollapse={() => setCollapsed(!collapsed)}
            onCloseMobile={() => setMobileOpen(false)}
            />

            <SidebarNav
            collapsed={collapsed}
            isDark={isDark}
            primary={primary}
            onNavigate={() => setMobileOpen(false)}
            />

            <SidebarFooter
            collapsed={collapsed}
            isDark={isDark}
            primary={primary}
            firstName={currentUser?.first_name}
            loginId={currentUser?.login_id}
            profilePicture={currentUser?.profile_picture}
            onExpand={() => setCollapsed(false)}
            onLogout={handleLogout}
            />
        </aside>

        {!mobileOpen && (
            <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-2xl transition hover:scale-105 active:scale-95 lg:hidden"
            style={{ backgroundColor: primary }}
            aria-label="Open menu"
            >
            <Bars3Icon className="h-6 w-6" />
            </button>
        )}
        </>
    );
}
