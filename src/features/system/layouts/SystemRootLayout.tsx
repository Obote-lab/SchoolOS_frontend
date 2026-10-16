import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function SystemRootLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-slate-100">
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main content area */}
        <div
            className={`flex-1 flex flex-col transition-all duration-600 ${
            collapsed ? "lg:pl-20" : "lg:pl-64"
            }`}
        >
            {/* Navbar */}
            <Navbar collapsed={collapsed} />

            {/* Dashboard content */}
            <main className="flex-1 p-4 sm:p-6">
            <Outlet />
            </main>

            {/* Footer */}
            <Footer collapsed={collapsed} />
        </div>
        </div>
    );
    }
