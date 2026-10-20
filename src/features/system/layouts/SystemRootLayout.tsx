import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function SystemRootLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-slate-100 dark:bg-slate-950">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div
            className={`flex flex-1 flex-col transition-all duration-300 ${
            collapsed ? "lg:pl-20" : "lg:pl-64"
            }`}
        >
            <Navbar collapsed={collapsed} />
            <main className="flex-1 p-4 sm:p-6">
            <Outlet />
            </main>
            <Footer collapsed={collapsed} />
        </div>
        </div>
    );
}
