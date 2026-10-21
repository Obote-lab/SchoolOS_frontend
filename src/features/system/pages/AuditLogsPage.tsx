// src/features/system/pages/AuditLogsPage.tsx
import { useCallback, useEffect, useState } from "react";
import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import {
  PageHeader,
  Button,
  Input,
  Select,
  Badge,
  DataTable,
  type Column,
} from "../../../components/ui";
import complianceAPI, { type AuditLog } from "../../../api/compliance";
import { normalizeError } from "../../../api/client";

const ACTION_OPTIONS = [
  { value: "", label: "All actions" },
  { value: "CREATE", label: "Create" },
  { value: "UPDATE", label: "Update" },
  { value: "DELETE", label: "Delete" },
  { value: "LOGIN", label: "Login" },
  { value: "LOGOUT", label: "Logout" },
  { value: "VIEW", label: "View" },
  { value: "EXPORT", label: "Export" },
];

function actionVariant(
  action: string,
): "success" | "warning" | "danger" | "info" | "neutral" {
  const a = action.toUpperCase();
  if (a.includes("CREATE") || a.includes("LOGIN")) return "success";
  if (a.includes("DELETE")) return "danger";
  if (a.includes("UPDATE") || a.includes("EXPORT")) return "warning";
  if (a.includes("VIEW") || a.includes("LOGOUT")) return "info";
  return "neutral";
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [actionType, setActionType] = useState("");
  const [summary, setSummary] = useState<{
    total: number;
    today: number;
  } | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: {
        search?: string;
        action_type?: string;
      } = {};
      if (search.trim()) params.search = search.trim();
      if (actionType) params.action_type = actionType;

      const [{ data }, summaryRes] = await Promise.all([
        complianceAPI.listAuditLogs(params),
        complianceAPI.getAuditSummary().catch(() => null),
      ]);

      const rows = Array.isArray(data) ? data : (data.results ?? []);
      setLogs(rows);

      if (summaryRes?.data) {
        setSummary({
          total: summaryRes.data.total_actions ?? 0,
          today: summaryRes.data.today_actions ?? 0,
        });
      }
    } catch (err) {
      setError(normalizeError(err).message);
    } finally {
      setLoading(false);
    }
  }, [search, actionType]);

  useEffect(() => {
    fetchLogs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = setTimeout(() => fetchLogs(), 350);
    return () => clearTimeout(t);
  }, [search, actionType]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns: Column<AuditLog>[] = [
    {
      key: "time",
      header: "When",
      cell: (row) => (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {formatDateTime(row.timestamp)}
        </span>
      ),
    },
    {
      key: "actor",
      header: "Actor",
      cell: (row) => (
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {row.user_name || "System"}
          </p>
          {row.user_role && (
            <p className="text-xs text-slate-500">{row.user_role}</p>
          )}
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      cell: (row) => (
        <Badge variant={actionVariant(row.action_type)}>
          {row.action_type}
        </Badge>
      ),
    },
    {
      key: "target",
      header: "Target",
      hideOnMobile: true,
      cell: (row) => (
        <div className="text-sm">
          <p className="text-slate-800 dark:text-slate-200">
            {row.model_name || "—"}
          </p>
          {row.reason && (
            <p className="truncate text-xs text-slate-500">{row.reason}</p>
          )}
        </div>
      ),
    },
    {
      key: "school",
      header: "School",
      hideOnMobile: true,
      cell: (row) => (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {row.school_name || "—"}
        </span>
      ),
    },
    {
      key: "ip",
      header: "IP",
      hideOnMobile: true,
      cell: (row) => (
        <span className="font-mono text-xs text-slate-500">
          {row.user_ip || "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Track important actions across the SchoolOS platform."
      />

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-xs font-medium text-slate-500">Total events</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {summary.total.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-xs font-medium text-slate-500">Today</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {summary.today.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search by user, model, IP, reason…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            options={ACTION_OPTIONS}
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
          />
        </div>
        {(search || actionType) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setActionType("");
            }}
          >
            Clear
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={logs}
        rowKey={(r) => r.id}
        loading={loading}
        error={error}
        emptyTitle="No audit events"
        emptyDescription="Actions across the platform will appear here."
        emptyIcon={<ClipboardDocumentListIcon className="h-6 w-6" />}
      />
    </div>
  );
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}
