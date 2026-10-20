import { ReactNode, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "../../lib/cn";

export interface DrawerProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    side?: "right" | "left";
    size?: "sm" | "md" | "lg";
    persistent?: boolean;
}

const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
};

export function Drawer({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    side = "right",
    size = "md",
    persistent = false,
    }: DrawerProps) {
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
        document.body.style.overflow = prev;
        };
    }, [open]);

    useEffect(() => {
        if (!open || persistent) return;
        function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, persistent, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
        <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
            onClick={() => {
            if (!persistent) onClose();
            }}
            aria-hidden
        />

        <div
            role="dialog"
            aria-modal="true"
            className={cn(
            "relative z-10 flex h-full w-full flex-col bg-white shadow-xl dark:bg-slate-800",
            sizeStyles[size],
            side === "right" ? "ml-auto" : "mr-auto",
            )}
        >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
            <div>
                {title && (
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {title}
                </h2>
                )}
                {description && (
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    {description}
                </p>
                )}
            </div>
            {!persistent && (
                <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                aria-label="Close"
                >
                <XMarkIcon className="h-5 w-5" />
                </button>
            )}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

            {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-700">
                {footer}
            </div>
            )}
        </div>
        </div>
    );
    }
