import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronDownIcon,
    UserIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../../../context/AuthContext";
import { useTheme } from "../../../../context/ThemeContext";
import { useClickOutside } from "./useClickOutside";
import { cn } from "../../../../lib/cn";

interface UserMenuProps {
    primary: string;
}

export function UserMenu({ primary }: UserMenuProps) {
    const { currentUser, logout } = useAuth();
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, open, () => setOpen(false));

    const initial =
        currentUser?.first_name?.charAt(0)?.toUpperCase() ||
        currentUser?.login_id?.charAt(0)?.toUpperCase() ||
        "S";

    function go(path: string) {
        setOpen(false);
        navigate(path);
    }

    return (
        <div className="relative" ref={ref}>
        <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
            "flex items-center gap-2 rounded-lg p-1.5 transition-colors",
            isDark ? "hover:bg-slate-800" : "hover:bg-slate-100",
            open && (isDark ? "bg-slate-800" : "bg-slate-100"),
            )}
        >
            {currentUser?.profile_picture ? (
            <img
                src={currentUser.profile_picture}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
            />
            ) : (
            <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: primary }}
            >
                {initial}
            </div>
            )}

            <div className="hidden text-left sm:block">
            <p
                className={cn(
                "max-w-32 truncate text-sm font-medium",
                isDark ? "text-white" : "text-slate-900",
                )}
            >
                {currentUser?.first_name || "Admin"}
            </p>
            <p
                className={cn(
                "max-w-32 truncate text-xs",
                isDark ? "text-slate-400" : "text-slate-500",
                )}
            >
                {currentUser?.login_id || "SYSTEM"}
            </p>
            </div>

            <ChevronDownIcon
            className={cn(
                "hidden h-4 w-4 transition-transform sm:block",
                open && "rotate-180",
                isDark ? "text-slate-400" : "text-slate-400",
            )}
            />
        </button>

        {open && (
            <div
            className={cn(
                "absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border py-1 shadow-2xl",
                "animate-in fade-in slide-in-from-top-2 duration-200",
                isDark
                ? "border-slate-700 bg-slate-800 shadow-black/40"
                : "border-slate-200 bg-white shadow-slate-200/60",
            )}
            >
            <div
                className={cn(
                "border-b px-4 py-3",
                isDark ? "border-slate-700" : "border-slate-100",
                )}
            >
                <div className="flex items-center gap-3">
                {currentUser?.profile_picture ? (
                    <img
                    src={currentUser.profile_picture}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                    />
                ) : (
                    <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: primary }}
                    >
                    {initial}
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p
                    className={cn(
                        "truncate text-sm font-semibold",
                        isDark ? "text-white" : "text-slate-900",
                    )}
                    >
                    {currentUser?.full_name ||
                        currentUser?.first_name ||
                        "Administrator"}
                    </p>
                    <p
                    className={cn(
                        "truncate text-xs",
                        isDark ? "text-slate-400" : "text-slate-500",
                    )}
                    >
                    {currentUser?.email || currentUser?.login_id}
                    </p>
                </div>
                </div>
            </div>

            <div className="py-1">
                <MenuItem
                icon={UserIcon}
                label="My profile"
                onClick={() => go("/system/profile")}
                isDark={isDark}
                />
                <MenuItem
                icon={Cog6ToothIcon}
                label="Settings"
                onClick={() => go("/system/settings")}
                isDark={isDark}
                />
                <div
                className={cn(
                    "my-1 border-t",
                    isDark ? "border-slate-700" : "border-slate-100",
                )}
                />
                <MenuItem
                icon={QuestionMarkCircleIcon}
                label="Help & docs"
                onClick={() => {
                    setOpen(false);
                    window.open("#", "_blank");
                }}
                isDark={isDark}
                />
                <div
                className={cn(
                    "my-1 border-t",
                    isDark ? "border-slate-700" : "border-slate-100",
                )}
                />
                <button
                type="button"
                onClick={() => {
                    setOpen(false);
                    logout();
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Sign out
                </button>
            </div>
            </div>
        )}
        </div>
    );
}

function MenuItem({
    icon: Icon,
    label,
    onClick,
    isDark,
    }: {
    icon: typeof UserIcon;
    label: string;
    onClick: () => void;
    isDark: boolean;
    }) {
    return (
        <button
        type="button"
        onClick={onClick}
        className={cn(
            "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
            isDark
            ? "text-slate-300 hover:bg-slate-700"
            : "text-slate-600 hover:bg-slate-50",
        )}
        >
        <Icon className="h-4 w-4" />
        {label}
        </button>
    );
}
