import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../lib/cn";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastItem {
    id: string;
    message: string;
    variant: ToastVariant;
    duration: number;
    }

interface ToastContextValue {
    toast: (
        message: string,
        options?: { variant?: ToastVariant; duration?: number },
    ) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
    }

const ToastContext = createContext<ToastContextValue | null>(null);

let toastIdCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const remove = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const add = useCallback(
        (message: string, variant: ToastVariant = "info", duration = 4000) => {
        const id = String(++toastIdCounter);
        setToasts((prev) => [...prev, { id, message, variant, duration }]);
        },
        [],
    );

    const value: ToastContextValue = {
        toast: (message, opts) =>
        add(message, opts?.variant ?? "info", opts?.duration ?? 4000),
        success: (message) => add(message, "success"),
        error: (message) => add(message, "error", 6000),
        warning: (message) => add(message, "warning"),
        info: (message) => add(message, "info"),
    };

    return (
        <ToastContext.Provider value={value}>
        {children}
        <div
            aria-live="polite"
            className="pointer-events-none fixed bottom-4 right-4 z-100 flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
        >
            {toasts.map((t) => (
            <ToastCard key={t.id} item={t} onDismiss={() => remove(t.id)} />
            ))}
        </div>
        </ToastContext.Provider>
    );
    }

    export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}

const variantConfig: Record<
    ToastVariant,
    { icon: typeof CheckCircleIcon; bg: string }
    > = {
    success: {
        icon: CheckCircleIcon,
        bg: "border-emerald-200 dark:border-emerald-800",
    },
    error: {
        icon: XCircleIcon,
        bg: "border-red-200 dark:border-red-800",
    },
    warning: {
        icon: ExclamationTriangleIcon,
        bg: "border-amber-200 dark:border-amber-800",
    },
    info: {
        icon: InformationCircleIcon,
        bg: "border-blue-200 dark:border-blue-800",
    },
};

function ToastCard({
    item,
    onDismiss,
    }: {
    item: ToastItem;
    onDismiss: () => void;
    }) {
    const config = variantConfig[item.variant];
    const Icon = config.icon;

    useEffect(() => {
        if (item.duration <= 0) return;
        const timer = setTimeout(onDismiss, item.duration);
        return () => clearTimeout(timer);
    }, [item.duration, onDismiss]);

    return (
        <div
        className={cn(
            "pointer-events-auto flex items-start gap-3 overflow-hidden rounded-xl border bg-white p-4 shadow-lg dark:bg-slate-800",
            config.bg,
        )}
        >
        <Icon
            className={cn(
            "mt-0.5 h-5 w-5 shrink-0",
            item.variant === "success" && "text-emerald-500",
            item.variant === "error" && "text-red-500",
            item.variant === "warning" && "text-amber-500",
            item.variant === "info" && "text-blue-500",
            )}
        />

        <p className="flex-1 text-sm text-slate-800 dark:text-slate-100">
            {item.message}
        </p>

        <button
            type="button"
            onClick={onDismiss}
            className="rounded p-0.5 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Dismiss"
        >
            <XMarkIcon className="h-4 w-4" />
        </button>
        </div>
    );
    }
