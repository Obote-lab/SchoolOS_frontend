// src/features/regional/layouts/RegionalLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import RegionalSidebar from "./sidebar/RegionalSidebar";
import { cn } from "../../../lib/cn";

export default function RegionalLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <RegionalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div
            className={cn(
            "flex min-h-screen flex-col transition-all duration-300",
            collapsed ? "lg:pl-19" : "lg:pl-60",
            )}
        >
            <header className="sticky top-0 z-20 flex h-14 items-center border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Regional portal
            </p>
            </header>
            <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
            <Outlet />
            </main>
            <footer className="border-t border-slate-200 px-4 py-3 text-center text-[11px] text-slate-400 dark:border-slate-800">
            SchoolOS · Regional Admin
            </footer>
        </div>
        </div>
    );
}
