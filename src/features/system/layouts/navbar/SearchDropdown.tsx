import { FormEvent, useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../../../context/ThemeContext";
import { useClickOutside } from "./useClickOutside";
import { cn } from "../../../../lib/cn";

interface SearchDropdownProps {
    primary: string;
}

export function SearchDropdown({ primary }: SearchDropdownProps) {
    const { isDark } = useTheme();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, open, () => {
        setOpen(false);
        setQuery("");
    });

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            setOpen(true);
        }
        if (e.key === "Escape" && open) {
            setOpen(false);
            setQuery("");
        }
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!query.trim()) return;
        console.log("Search:", query);
        setOpen(false);
        setQuery("");
    }

    return (
        <div className="relative" ref={ref}>
        <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
            "rounded-lg p-2 transition-colors",
            isDark
                ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
            open && (isDark ? "bg-slate-800" : "bg-slate-100"),
            )}
            aria-label="Search"
            title="Search (Ctrl+K)"
        >
            <MagnifyingGlassIcon className="h-5 w-5" />
        </button>

        {open && (
            <div
            className={cn(
                "absolute right-0 mt-2 w-[min(100vw-2rem,24rem)] overflow-hidden rounded-xl border shadow-2xl",
                "animate-in fade-in slide-in-from-top-2 duration-200",
                isDark
                ? "border-slate-700 bg-slate-800 shadow-black/40"
                : "border-slate-200 bg-white shadow-slate-200/60",
            )}
            >
            <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2">
                <MagnifyingGlassIcon className="ml-2 h-5 w-5 shrink-0 text-slate-400" />
                <input
                type="search"
                placeholder="Search schools, users, settings…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className={cn(
                    "min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none",
                    isDark
                    ? "text-white placeholder:text-slate-500"
                    : "text-slate-900 placeholder:text-slate-400",
                )}
                />
                <button
                type="button"
                onClick={() => {
                    setOpen(false);
                    setQuery("");
                }}
                className={cn(
                    "rounded-lg p-1.5 transition-colors",
                    isDark ? "hover:bg-slate-700" : "hover:bg-slate-100",
                )}
                aria-label="Close search"
                >
                <XMarkIcon className="h-4 w-4 text-slate-400" />
                </button>
            </form>
            <div
                className={cn(
                "border-t px-4 py-2 text-[11px]",
                isDark
                    ? "border-slate-700 text-slate-500"
                    : "border-slate-100 text-slate-400",
                )}
            >
                <kbd
                className={cn(
                    "rounded px-1.5 py-0.5 font-mono text-[10px]",
                    isDark ? "bg-slate-700" : "bg-slate-100",
                )}
                >
                ↵
                </kbd>
                <span className="ml-1.5">to search</span>
                <span className="mx-2 opacity-40">·</span>
                <kbd
                className={cn(
                    "rounded px-1.5 py-0.5 font-mono text-[10px]",
                    isDark ? "bg-slate-700" : "bg-slate-100",
                )}
                >
                esc
                </kbd>
                <span className="ml-1.5">to close</span>
            </div>
            </div>
        )}
        </div>
    );
}
