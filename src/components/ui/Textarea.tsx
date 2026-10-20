import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, hint, id, disabled, ...props }, ref) => {
        const textareaId = id || props.name;

        return (
        <div className="w-full">
            {label && (
            <label
                htmlFor={textareaId}
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
                {label}
                {props.required && <span className="ml-0.5 text-red-500">*</span>}
            </label>
            )}

            <textarea
            ref={ref}
            id={textareaId}
            disabled={disabled}
            className={cn(
                "w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition",
                "placeholder:text-slate-400 min-h-24 resize-y",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                "disabled:cursor-not-allowed disabled:opacity-60",
                error
                ? "border-red-400 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500/20 dark:border-red-700 dark:bg-red-950/30 dark:text-red-200"
                : "border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white",
                "disabled:bg-slate-100 dark:disabled:bg-slate-900",
                className,
            )}
            {...props}
            />

            {error && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {error}
            </p>
            )}
            {!error && hint && (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                {hint}
            </p>
            )}
        </div>
        );
    },
);

Textarea.displayName = "Textarea";
