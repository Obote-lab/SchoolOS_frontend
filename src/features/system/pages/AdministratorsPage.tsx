// src/features/system/pages/AdministratorsPage.tsx
import { useCallback, useEffect, useState } from "react";
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
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
import CreateRegionalAdminModal from "./administrators/CreateRegionalAdminModal"
import { useNavigate } from "react-router-dom";


const ADMIN_ROLE_NAMES = new Set([
  "Regional Admin",
  "County Admin",
  "System Root",
]);

type RoleFilter = "" | "Regional Admin" | "County Admin" | "System Root";

function isPlatformAdmin(user: User): boolean {
  return (user.roles ?? []).some(
    (r) => r.is_active && ADMIN_ROLE_NAMES.has(r.role_name),
  );
}

function primaryAdminRole(user: User): string {
  const match = (user.roles ?? []).find(
    (r) => r.is_active && ADMIN_ROLE_NAMES.has(r.role_name),
  );
  return match?.role_name ?? "—";
}

export default function AdministratorsPage() {
  const { success, error: toastError } = useToast();


  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("");
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { search?: string } = {};
      if (search.trim()) params.search = search.trim();

      const { data } = await usersAPI.list(params);
      let rows = Array.isArray(data) ? data : (data.results ?? []);

      // Keep only platform admins
      rows = rows.filter(isPlatformAdmin);

      if (roleFilter) {
        rows = rows.filter((u) =>
          (u.roles ?? []).some(
            (r) => r.is_active && r.role_name === roleFilter,
          ),
        );
      }

      setAdmins(rows);
    } catch (err) {
      setError(normalizeError(err).message);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    fetchAdmins();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = setTimeout(() => fetchAdmins(), 350);
    return () => clearTimeout(t);
  }, [search, roleFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns: Column<User>[] = [
    {
      key: "user",
      header: "Administrator",
      cell: (u) => (
        <div className="flex items-center gap-3">
          {u.profile_picture ? (
            <img
              src={u.profile_picture}
              alt=""
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
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
      key: "role",
      header: "Role",
      cell: (u) => (
        <Badge
          variant={
            primaryAdminRole(u) === "System Root"
              ? "purple"
              : primaryAdminRole(u) === "Regional Admin"
                ? "info"
                : "neutral"
          }
        >
          {primaryAdminRole(u)}
        </Badge>
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
      key: "status",
      header: "Status",
      cell: (u) =>
        u.is_locked ? (
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
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrators"
        description="Platform operators who manage counties and schools."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon className="h-4 w-4" />
            Add Regional Admin
          </Button>
        }
      />
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
        <div className="w-full sm:w-48">
          <Select
            options={[
              { value: "", label: "All admin roles" },
              { value: "Regional Admin", label: "Regional Admin" },
              { value: "County Admin", label: "County Admin" },
              { value: "System Root", label: "System Root" },
            ]}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          />
        </div>
        {(search || roleFilter) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setRoleFilter("");
            }}
          >
            Clear
          </Button>
        )}
      </div>
     
      <DataTable
        columns={columns}
        data={admins}
        rowKey={(u) => u.id}
        loading={loading}
        error={error}
        onRowClick={(u) => navigate(`/system/administrators/${u.id}`)}
        emptyTitle="No administrators yet"
        emptyDescription="Create a regional admin to manage schools by county."
        emptyIcon={<UserGroupIcon className="h-6 w-6" />}
        emptyAction={
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon className="h-4 w-4" />
            Add Regional Admin
          </Button>
        }
      />
      <CreateRegionalAdminModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          fetchAdmins();
          success("Regional admin created");
        }}
        onError={(msg) => toastError(msg)}
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
