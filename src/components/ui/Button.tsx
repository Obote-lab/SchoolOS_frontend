import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/cn";
import { Spinner } from "./Spinner";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/30 dark:bg-blue-600 dark:hover:bg-blue-500",
    secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400/30 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
    outline:
        "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 focus:ring-slate-400/30 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800",
    ghost:
        "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400/30 dark:text-slate-300 dark:hover:bg-slate-800",
    danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/30 dark:bg-red-600 dark:hover:bg-red-500",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
        className,
        variant = "primary",
        size = "md",
        loading = false,
        fullWidth = false,
        disabled,
        children,
        ...props
    },
    ref,
    ) => {
        return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={cn(
            "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-900",
            "disabled:cursor-not-allowed disabled:opacity-60",
            variantStyles[variant],
            sizeStyles[size],
            fullWidth && "w-full",
            className,
            )}
            {...props}
        >
            {loading && <Spinner size="sm" className="text-current" />}
            {children}
        </button>
        );
    },
    );

Button.displayName = "Button";
