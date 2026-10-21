import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  UsersIcon,
  MagnifyingGlassIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";

import {
  PageHeader,
  Button,
  Input,
  Select,
  Badge,
  DataTable,
  useToast,
  type Column,
} from "../../../components/ui";
import usersAPI, { type User } from "../../../api/users";
import { normalizeError } from "../../../api/client";

type StatusFilter = "" | "active" | "inactive" | "locked";

export default function UsersPage() {
  const { success, error: toastError } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");

  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: {
        search?: string;
        is_active?: boolean;
      } = {};

      if (search.trim()) params.search = search.trim();
      if (status === "active") params.is_active = true;
      if (status === "inactive") params.is_active = false;

      const { data } = await usersAPI.list(params);
      let rows = Array.isArray(data) ? data : (data.results ?? []);

      // Client-side locked filter (backend may not expose it on list)
      if (status === "locked") {
        rows = rows.filter((u) => u.is_locked);
      }

      setUsers(rows);
    } catch (err) {
      setError(normalizeError(err).message);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(), 350);
    return () => clearTimeout(t);
  }, [search, status]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLockToggle(user: User) {
    setActionId(user.id);
    try {
      if (user.is_locked) {
        await usersAPI.unlock(user.id);
        success(`${user.full_name || user.login_id} unlocked`);
      } else {
        await usersAPI.lock(user.id, { hours: 24 });
        success(`${user.full_name || user.login_id} locked for 24h`);
      }
      await fetchUsers();
    } catch (err) {
      toastError(normalizeError(err).message);
    } finally {
      setActionId(null);
    }
  }

  function primaryRole(user: User): string {
    const primary = user.roles?.find((r) => r.is_primary_role && r.is_active);
    if (primary) return primary.role_name;
    const any = user.roles?.find((r) => r.is_active);
    return any?.role_name || "—";
  }

  function schoolName(user: User): string | null {
    const withSchool = user.roles?.find((r) => r.school_name);
    return withSchool?.school_name ?? null;
  }

  const columns: Column<User>[] = [
    {
      key: "user",
      header: "User",
      cell: (u) => (
        <div className="flex items-center gap-3">
          {u.profile_picture ? (
            <img
              src={u.profile_picture}
              alt=""
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {(u.first_name || u.login_id || "?").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900 dark:text-white">
              {u.full_name || `${u.first_name} ${u.last_name}`.trim() || "—"}
            </p>
            <p className="truncate font-mono text-xs text-slate-500 dark:text-slate-400">
              {u.login_id}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      hideOnMobile: true,
      cell: (u) => (
        <div className="text-sm">
          <p className="text-slate-700 dark:text-slate-300">{u.email || "—"}</p>
          {u.phone && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {u.phone}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (u) => (
        <div>
          <p className="text-sm text-slate-800 dark:text-slate-200">
            {primaryRole(u)}
          </p>
          {schoolName(u) && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {schoolName(u)}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (u) => (
        <div className="flex flex-wrap gap-1.5">
          {u.is_locked ? (
            <Badge variant="danger" dot>
              Locked
            </Badge>
          ) : u.is_active ? (
            <Badge variant="success" dot>
              Active
            </Badge>
          ) : (
            <Badge variant="neutral" dot>
              Inactive
            </Badge>
          )}
          {!u.is_verified && <Badge variant="warning">Unverified</Badge>}
        </div>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      hideOnMobile: true,
      cell: (u) => (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {formatDate(u.date_joined)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (u) => (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            loading={actionId === u.id}
            onClick={() => handleLockToggle(u)}
            title={u.is_locked ? "Unlock account" : "Lock account"}
          >
            {u.is_locked ? (
              <>
                <LockOpenIcon className="h-4 w-4" />
                Unlock
              </>
            ) : (
              <>
                <LockClosedIcon className="h-4 w-4" />
                Lock
              </>
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="All accounts across the SchoolOS platform."
      />
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search by name, login ID, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            options={[
              { value: "", label: "All statuses" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "locked", label: "Locked" },
            ]}
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          />
        </div>
        {(search || status) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setStatus("");
            }}
          >
            Clear
          </Button>
        )}
      </div>
      {/* on DataTable */}
      <DataTable
        columns={columns}
        data={users}
        rowKey={(u) => u.id}
        onRowClick={(u) => navigate(`/system/users/${u.id}`)}
        loading={loading}
        error={error}
        emptyTitle="No users found"
        emptyDescription="Try adjusting filters, or onboard a school to create principals."
        emptyIcon={<UsersIcon className="h-6 w-6" />}
      />
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}
