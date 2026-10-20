import { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Spinner } from "./Spinner";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
    key: string;
    header: string;
    cell: (row: T) => ReactNode;
    className?: string;
    hideOnMobile?: boolean;
    }

export interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    rowKey: (row: T) => string;
    loading?: boolean;
    error?: string | null;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyAction?: ReactNode;
    emptyIcon?: ReactNode;
    onRowClick?: (row: T) => void;
    className?: string;
    }

export function DataTable<T>({
    columns,
    data,
    rowKey,
    loading = false,
    error = null,
    emptyTitle = "No results",
    emptyDescription,
    emptyAction,
    emptyIcon,
    onRowClick,
    className,
    }: DataTableProps<T>) {
    if (loading) {
        return (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16 dark:border-slate-700 dark:bg-slate-800/50">
            <Spinner size="lg" className="text-blue-600" />
        </div>
        );
    }

    if (error) {
        return (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-800 dark:bg-red-950/30">
            <p className="text-sm font-medium text-red-700 dark:text-red-300">
            {error}
            </p>
        </div>
        );
    }

    if (data.length === 0) {
        return (
        <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
        />
        );
    }

    return (
        <div
        className={cn(
            "overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50",
            className,
        )}
        >
        <div className="overflow-x-auto">
            <table className="w-full min-w-160 text-left text-sm">
            <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                {columns.map((col) => (
                    <th
                    key={col.key}
                    className={cn(
                        "whitespace-nowrap px-4 py-3 font-medium text-slate-600 dark:text-slate-300",
                        col.hideOnMobile && "hidden sm:table-cell",
                        col.className,
                    )}
                    >
                    {col.header}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {data.map((row) => (
                <tr
                    key={rowKey(row)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                    "transition-colors",
                    onRowClick &&
                        "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/40",
                    )}
                >
                    {columns.map((col) => (
                    <td
                        key={col.key}
                        className={cn(
                        "px-4 py-3 text-slate-700 dark:text-slate-200",
                        col.hideOnMobile && "hidden sm:table-cell",
                        col.className,
                        )}
                    >
                        {col.cell(row)}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
}
