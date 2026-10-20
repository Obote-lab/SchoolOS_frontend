import { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type BadgeVariant =
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    size?: "sm" | "md";
    dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    success:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    warning:
        "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    danger: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    info: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
    neutral: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

const dotColors: Record<BadgeVariant, string> = {
    default: "bg-blue-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-sky-500",
    neutral: "bg-slate-400",
};

export function Badge({
    className,
    variant = "default",
    size = "sm",
    dot = false,
    children,
    ...props
    }: BadgeProps) {
    return (
        <span
        className={cn(
            "inline-flex items-center gap-1.5 rounded-full font-medium",
            size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
            variantStyles[variant],
            className,
        )}
        {...props}
        >
        {dot && (
            <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[variant])} />
        )}
        {children}
        </span>
    );
}
