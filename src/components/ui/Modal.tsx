import { ReactNode, useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "../../lib/cn";

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
    persistent?: boolean;
}

const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
};

export function Modal({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    size = "md",
    persistent = false,
}: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

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
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
        <div
            ref={overlayRef}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
            onClick={() => {
            if (!persistent) onClose();
            }}
            aria-hidden
        />

        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            className={cn(
            "relative z-10 flex w-full flex-col rounded-t-2xl bg-white shadow-xl dark:bg-slate-800 sm:rounded-2xl",
            "max-h-[90vh]",
            sizeStyles[size],
            )}
        >
            {(title || !persistent) && (
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                <div>
                {title && (
                    <h2
                    id="modal-title"
                    className="text-lg font-semibold text-slate-900 dark:text-white"
                    >
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
            )}

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
