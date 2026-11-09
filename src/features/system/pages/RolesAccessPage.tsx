import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ShieldCheckIcon,
  LockClosedIcon,
  UsersIcon,
  GlobeAltIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";

import {
  PageHeader,
  Button,
  Input,
  Select,
  Badge,
  DataTable,
  Modal,
  useToast,
  type Column,
} from "../../../components/ui";

import rolesAPI, {
  ROLE_CATEGORIES,
  ACCESS_LEVELS,
  PERMISSION_MODULES,
  PERMISSION_ACTIONS,
  RESOURCE_SCOPES,
  type Role,
  type RolePayload,
  type Permission,
  type PermissionPayload,
  type RoleAssignment,
} from "../../../api/roles";

import usersAPI, { type User } from "../../../api/users";
import schoolsAPI, { type SchoolListItem } from "../../../api/schools";
import { normalizeError } from "../../../api/client";

import type { FormEvent, ReactNode, ElementType } from "react";






/* Types and helpers */

type Tab = "roles" | "permissions" | "assignments" | "scopes";

type SelectOption = {
  value: string;
  label: string;
};

const EMPTY_ROLE: RolePayload = {
  name: "",
  role_category: "administrative",
  permissions_tier: 5,
  description: "",
  default_dashboard: "",
  access_level: "school",
};

const EMPTY_PERMISSION: PermissionPayload = {
  role: "",
  module: "students",
  action: "read",
  resource_scope: "school",
  conditions: {},
  is_allowed: true,
  priority: 1,
};

function labelOf(
  options: readonly { value: string; label: string }[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function getRows<T>(data: T[] | { results?: T[] }): T[] {
  return Array.isArray(data) ? data : (data.results ?? []);
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}

function SectionCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50 ${className}`}
    >
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: ElementType;
}) {
  return (
    <SectionCard className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {value.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Main page                                                                  */
/* -------------------------------------------------------------------------- */

export default function RolesAccessPage() {
  const { success, error: toastError } = useToast();

  /* Data */

  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [assignments, setAssignments] = useState<RoleAssignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<SchoolListItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /* Navigation */

  const [activeTab, setActiveTab] = useState<Tab>("roles");

  /* Filters */

  const [roleSearch, setRoleSearch] = useState("");
  const [roleCategoryFilter, setRoleCategoryFilter] = useState("");
  const [roleAccessFilter, setRoleAccessFilter] = useState("");

  const [permissionRoleFilter, setPermissionRoleFilter] = useState("");
  const [permissionModuleFilter, setPermissionModuleFilter] = useState("");
  const [permissionSearch, setPermissionSearch] = useState("");

  const [assignmentSearch, setAssignmentSearch] = useState("");
  const [assignmentRoleFilter, setAssignmentRoleFilter] = useState("");
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState("");

  /* Role modal */

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleForm, setRoleForm] = useState<RolePayload>(EMPTY_ROLE);

  /* Permission modal */

  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null,
  );
  const [permissionForm, setPermissionForm] =
    useState<PermissionPayload>(EMPTY_PERMISSION);

  /* Assignment modal */

  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    user_id: "",
    role_id: "",
    school_id: "",
    is_primary: true,
  });

  /* ------------------------------------------------------------------------ */
  /* Fetch data                                                               */
  /* ------------------------------------------------------------------------ */

  const fetchData = useCallback(async () => {
    setLoading(true);
    setPageError(null);

    try {
      const [
        roleRows,
        permissionRows,
        assignmentRows,
        userResponse,
        schoolResponse,
      ] = await Promise.all([
        rolesAPI.listRoles(),
        rolesAPI.listPermissions(),
        rolesAPI.listAssignments(),
        usersAPI.list({ page_size: 100 }),
        schoolsAPI.list({ page_size: 100 }),
      ]);

      setRoles(roleRows);
      setPermissions(permissionRows);
      setAssignments(assignmentRows);
      setUsers(getRows(userResponse.data));
      setSchools(getRows(schoolResponse.data));
    } catch (err) {
      const message = normalizeError(err).message;
      setPageError(message);
      toastError(message);
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  /* ------------------------------------------------------------------------ */
  /* Derived data                                                             */
  /* ------------------------------------------------------------------------ */

  const filteredRoles = useMemo(() => {
    const query = roleSearch.trim().toLowerCase();

    return roles.filter((role) => {
      const matchesSearch =
        !query ||
        role.name.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query);

      const matchesCategory =
        !roleCategoryFilter || role.role_category === roleCategoryFilter;

      const matchesAccess =
        !roleAccessFilter || role.access_level === roleAccessFilter;

      return matchesSearch && matchesCategory && matchesAccess;
    });
  }, [roles, roleSearch, roleCategoryFilter, roleAccessFilter]);

  const filteredPermissions = useMemo(() => {
    const query = permissionSearch.trim().toLowerCase();

    return permissions.filter((permission) => {
      const matchesRole =
        !permissionRoleFilter || permission.role === permissionRoleFilter;

      const matchesModule =
        !permissionModuleFilter || permission.module === permissionModuleFilter;

      const matchesSearch =
        !query ||
        permission.role_name.toLowerCase().includes(query) ||
        permission.module.toLowerCase().includes(query) ||
        permission.action.toLowerCase().includes(query);

      return matchesRole && matchesModule && matchesSearch;
    });
  }, [
    permissions,
    permissionRoleFilter,
    permissionModuleFilter,
    permissionSearch,
  ]);

  const filteredAssignments = useMemo(() => {
    const query = assignmentSearch.trim().toLowerCase();

    return assignments.filter((assignment) => {
      const matchesRole =
        !assignmentRoleFilter || assignment.role === assignmentRoleFilter;

      const matchesStatus =
        !assignmentStatusFilter ||
        (assignmentStatusFilter === "active" &&
          assignment.is_active &&
          !assignment.is_expired) ||
        (assignmentStatusFilter === "inactive" && !assignment.is_active) ||
        (assignmentStatusFilter === "expired" && assignment.is_expired);

      const matchesSearch =
        !query ||
        assignment.user_details?.full_name?.toLowerCase().includes(query) ||
        assignment.user_details?.login_id?.toLowerCase().includes(query) ||
        assignment.role_details?.name?.toLowerCase().includes(query) ||
        assignment.school_name?.toLowerCase().includes(query);

      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [
    assignments,
    assignmentSearch,
    assignmentRoleFilter,
    assignmentStatusFilter,
  ]);

  const activeAssignments = assignments.filter(
    (item) => item.is_active && !item.is_expired,
  );

  const allowedPermissions = permissions.filter((item) => item.is_allowed);

  const deniedPermissions = permissions.filter((item) => !item.is_allowed);

  const roleOptions: SelectOption[] = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const userOptions: SelectOption[] = users.map((user) => ({
    value: user.id,
    label: `${user.full_name} (${user.login_id})`,
  }));

  const schoolOptions: SelectOption[] = schools.map((school) => ({
    value: school.id,
    label: school.school_name || school.school_code || school.id,
  }));

  /* ------------------------------------------------------------------------ */
  /* Role actions                                                             */
  /* ------------------------------------------------------------------------ */

  function openCreateRole() {
    setEditingRole(null);
    setRoleForm(EMPTY_ROLE);
    setRoleModalOpen(true);
  }

  function openEditRole(role: Role) {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      role_category: role.role_category,
      permissions_tier: role.permissions_tier,
      description: role.description || "",
      default_dashboard: role.default_dashboard || "",
      access_level: role.access_level,
    });
    setRoleModalOpen(true);
  }

  async function saveRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!roleForm.name.trim()) {
      toastError("Role name is required.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...roleForm,
        name: roleForm.name.trim(),
        permissions_tier: Number(roleForm.permissions_tier),
      };

      if (editingRole) {
        await rolesAPI.updateRole(editingRole.id, payload);
        success("Role updated successfully.");
      } else {
        await rolesAPI.createRole(payload);
        success("Role created successfully.");
      }

      setRoleModalOpen(false);
      await fetchData();
    } catch (err) {
      toastError(normalizeError(err).message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteRole(role: Role) {
    const confirmed = window.confirm(
      `Delete "${role.name}"? This also deletes its permission records and may remove related user assignments because of the backend's cascade relationships.`,
    );

    if (!confirmed) return;

    setDeletingId(role.id);

    try {
      await rolesAPI.deleteRole(role.id);
      success("Role deleted successfully.");
      await fetchData();
    } catch (err) {
      toastError(normalizeError(err).message);
    } finally {
      setDeletingId(null);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Permission actions                                                       */
  /* ------------------------------------------------------------------------ */

  function openCreatePermission() {
    setEditingPermission(null);
    setPermissionForm({
      ...EMPTY_PERMISSION,
      role: permissionRoleFilter || roles[0]?.id || "",
    });
    setPermissionModalOpen(true);
  }

  function openEditPermission(permission: Permission) {
    setEditingPermission(permission);
    setPermissionForm({
      role: permission.role,
      module: permission.module,
      action: permission.action,
      resource_scope: permission.resource_scope,
      conditions: permission.conditions || {},
      is_allowed: permission.is_allowed,
      priority: permission.priority,
    });
    setPermissionModalOpen(true);
  }

  async function savePermission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!permissionForm.role) {
      toastError("Select a role first.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...permissionForm,
        priority: Number(permissionForm.priority),
      };

      if (editingPermission) {
        await rolesAPI.updatePermission(editingPermission.id, payload);
        success("Permission updated successfully.");
      } else {
        await rolesAPI.createPermission(payload);
        success("Permission created successfully.");
      }

      setPermissionModalOpen(false);
      await fetchData();
    } catch (err) {
      toastError(normalizeError(err).message);
    } finally {
      setSaving(false);
    }
  }

  async function deletePermission(permission: Permission) {
    const confirmed = window.confirm(
      `Delete the ${permission.action} permission for ${permission.module} on ${permission.role_name}?`,
    );

    if (!confirmed) return;

    setDeletingId(permission.id);

    try {
      await rolesAPI.deletePermission(permission.id);
      success("Permission deleted.");
      await fetchData();
    } catch (err) {
      toastError(normalizeError(err).message);
    } finally {
      setDeletingId(null);
    }
  }

  /* Assignment actions */

  function openAssignRole() {
    setAssignmentForm({
      user_id: "",
      role_id: roles[0]?.id || "",
      school_id: "",
      is_primary: true,
    });
    setAssignmentModalOpen(true);
  }

  const selectedAssignmentRole = roles.find(
    (role) => role.id === assignmentForm.role_id,
  );

  async function saveAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!assignmentForm.user_id || !assignmentForm.role_id) {
      toastError("Select both a user and a role.");
      return;
    }

    if (
      selectedAssignmentRole?.access_level === "school" &&
      !assignmentForm.school_id
    ) {
      toastError("A school is required for school-level roles.");
      return;
    }

    if (
      selectedAssignmentRole &&
      selectedAssignmentRole.access_level !== "school" &&
      assignmentForm.school_id
    ) {
      toastError("County and national roles must not be assigned to a school.");
      return;
    }

    setSaving(true);

    try {
      await rolesAPI.assignRole({
        user_id: assignmentForm.user_id,
        role_id: assignmentForm.role_id,
        is_primary: assignmentForm.is_primary,
        ...(selectedAssignmentRole?.access_level === "school"
          ? { school_id: assignmentForm.school_id }
          : {}),
      });

      success("Role assigned successfully.");
      setAssignmentModalOpen(false);
      await fetchData();
    } catch (err) {
      toastError(normalizeError(err).message);
    } finally {
      setSaving(false);
    }
  }

  async function revokeAssignment(assignment: RoleAssignment) {
    const confirmed = window.confirm(
      `Revoke ${assignment.role_details?.name} from ${assignment.user_details?.full_name}?`,
    );

    if (!confirmed) return;

    setDeletingId(assignment.id);

    try {
      await rolesAPI.revokeRole({
        assignment_id: assignment.id,
        reason: "Revoked by System Root",
      });

      success("Role assignment revoked.");
      await fetchData();
    } catch (err) {
      toastError(normalizeError(err).message);
    } finally {
      setDeletingId(null);
    }
  }

  async function promoteAssignment(assignment: RoleAssignment) {
    if (assignment.is_primary_role) return;

    const confirmed = window.confirm(
      `Make ${assignment.role_details?.name} the primary role for ${assignment.user_details?.full_name}?`,
    );

    if (!confirmed) return;

    setDeletingId(assignment.id);

    try {
      await rolesAPI.promoteUser({
        user_id: assignment.user,
        new_role_id: assignment.role,
        ...(assignment.school ? { school_id: assignment.school } : {}),
      });

      success("Primary role updated.");
      await fetchData();
    } catch (err) {
      toastError(normalizeError(err).message);
    } finally {
      setDeletingId(null);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Table columns                                                            */
  /* ------------------------------------------------------------------------ */

  const roleColumns: Column<Role>[] = [
    {
      key: "name",
      header: "Role",
      cell: (role) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">
            {role.name}
          </p>
          <p className="mt-0.5 max-w-xs truncate text-xs text-slate-500 dark:text-slate-400">
            {role.description || "No description provided"}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (role) => (
        <Badge variant="info">
          {labelOf(ROLE_CATEGORIES, role.role_category)}
        </Badge>
      ),
    },
    {
      key: "tier",
      header: "Tier",
      cell: (role) => (
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {role.permissions_tier}
        </span>
      ),
    },
    {
      key: "access",
      header: "Access level",
      cell: (role) => (
        <Badge variant="default">
          {labelOf(ACCESS_LEVELS, role.access_level)}
        </Badge>
      ),
    },
    {
      key: "permissions",
      header: "Permissions",
      cell: (role) => (
        <span className="text-slate-600 dark:text-slate-300">
          {permissions.filter((item) => item.role === role.id).length}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (role) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openEditRole(role)}
            title="Edit role"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setPermissionRoleFilter(role.id);
              setActiveTab("permissions");
            }}
            title="Manage permissions"
          >
            <KeyIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => void deleteRole(role)}
            loading={deletingId === role.id}
            title="Delete role"
          >
            <TrashIcon className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const permissionColumns: Column<Permission>[] = [
    {
      key: "role",
      header: "Role",
      cell: (permission) => (
        <span className="font-medium text-slate-900 dark:text-white">
          {permission.role_name}
        </span>
      ),
    },
    {
      key: "module",
      header: "Module",
      cell: (permission) => (
        <span className="capitalize">
          {labelOf(PERMISSION_MODULES, permission.module)}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      cell: (permission) => (
        <Badge variant="info">
          {labelOf(PERMISSION_ACTIONS, permission.action)}
        </Badge>
      ),
    },
    {
      key: "scope",
      header: "Resource scope",
      cell: (permission) => (
        <span className="capitalize">
          {labelOf(RESOURCE_SCOPES, permission.resource_scope)}
        </span>
      ),
    },
    {
      key: "allowed",
      header: "Decision",
      cell: (permission) =>
        permission.is_allowed ? (
          <Badge variant="success">Allowed</Badge>
        ) : (
          <Badge variant="danger">Denied</Badge>
        ),
    },
    {
      key: "priority",
      header: "Priority",
      cell: (permission) => permission.priority,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (permission) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openEditPermission(permission)}
            title="Edit permission"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => void deletePermission(permission)}
            loading={deletingId === permission.id}
            title="Delete permission"
          >
            <TrashIcon className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const assignmentColumns: Column<RoleAssignment>[] = [
    {
      key: "user",
      header: "User",
      cell: (assignment) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">
            {assignment.user_details?.full_name || "Unknown user"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {assignment.user_details?.login_id || assignment.user}
          </p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Assigned role",
      cell: (assignment) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">
            {assignment.role_details?.name || "Unknown role"}
          </p>
          <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
            {assignment.role_details?.access_level}
          </p>
        </div>
      ),
    },
    {
      key: "school",
      header: "School context",
      cell: (assignment) =>
        assignment.school_name || (
          <span className="text-slate-400">County / National</span>
        ),
    },
    {
      key: "primary",
      header: "Primary",
      cell: (assignment) =>
        assignment.is_primary_role ? (
          <Badge variant="success">Primary</Badge>
        ) : (
          <Badge variant="default">Secondary</Badge>
        ),
    },
    {
      key: "status",
      header: "Status",
      cell: (assignment) =>
        assignment.is_expired ? (
          <Badge variant="danger">Expired</Badge>
        ) : assignment.is_active ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="default">Inactive</Badge>
        ),
    },
    {
      key: "assigned",
      header: "Assigned",
      cell: (assignment) => formatDate(assignment.assigned_date),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (assignment) => (
        <div className="flex items-center gap-1">
          {assignment.is_active &&
            !assignment.is_expired &&
            !assignment.is_primary_role && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => void promoteAssignment(assignment)}
                loading={deletingId === assignment.id}
                title="Make primary role"
              >
                <CheckCircleIcon className="h-4 w-4 text-emerald-600" />
              </Button>
            )}

          {assignment.is_active && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => void revokeAssignment(assignment)}
              loading={deletingId === assignment.id}
              title="Revoke role"
            >
              <XCircleIcon className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  /* Tab navigation */

  const tabs: {
    id: Tab;
    label: string;
    count: number;
    icon: ElementType;
  }[] = [
    {
      id: "roles",
      label: "Roles",
      count: roles.length,
      icon: ShieldCheckIcon,
    },
    {
      id: "permissions",
      label: "Permissions",
      count: permissions.length,
      icon: LockClosedIcon,
    },
    {
      id: "assignments",
      label: "Assignments",
      count: assignments.length,
      icon: UsersIcon,
    },
    {
      id: "scopes",
      label: "Access scopes",
      count: ACCESS_LEVELS.length,
      icon: GlobeAltIcon,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page heading */}

      <PageHeader
        title="Roles & Access"
        description="Manage system roles, permissions, user assignments and access boundaries."
        actions={
          <Button
            variant="outline"
            onClick={() => void fetchData()}
            disabled={loading}
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      {/* Summary cards */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Defined roles"
          value={roles.length}
          description="Available system roles"
          icon={ShieldCheckIcon}
        />
        <StatCard
          label="Permission rules"
          value={permissions.length}
          description={`${allowedPermissions.length} allowed · ${deniedPermissions.length} denied`}
          icon={LockClosedIcon}
        />
        <StatCard
          label="Active assignments"
          value={activeAssignments.length}
          description="Current user-role links"
          icon={UsersIcon}
        />
        <StatCard
          label="Access levels"
          value={ACCESS_LEVELS.length}
          description="School, county and national"
          icon={GlobeAltIcon}
        />
      </div>

      {/* Tabs */}

      <div className="overflow-x-auto border-b border-slate-200 dark:border-slate-700">
        <div className="flex min-w-max gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition ${
                  active
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    active
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading and general error */}

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
          Loading roles and access data...
        </div>
      )}

      {!loading && pageError && (
        <SectionCard className="p-6">
          <p className="font-medium text-red-600 dark:text-red-400">
            Could not load Roles & Access.
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {pageError}
          </p>
          <Button className="mt-4" onClick={() => void fetchData()}>
            Try again
          </Button>
        </SectionCard>
      )}

      {!loading && !pageError && (
        <>
          {/* ---------------------------------------------------------------- */}
          {/* ROLES TAB                                                        */}
          {/* ---------------------------------------------------------------- */}

          {activeTab === "roles" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                  <Input
                    label="Search roles"
                    placeholder="Search by name or description..."
                    value={roleSearch}
                    onChange={(event) => setRoleSearch(event.target.value)}
                  />

                  <Select
                    label="Category"
                    value={roleCategoryFilter}
                    onChange={(event) =>
                      setRoleCategoryFilter(event.target.value)
                    }
                    options={ROLE_CATEGORIES}
                    placeholder="All categories"
                  />

                  <Select
                    label="Access level"
                    value={roleAccessFilter}
                    onChange={(event) =>
                      setRoleAccessFilter(event.target.value)
                    }
                    options={ACCESS_LEVELS}
                    placeholder="All access levels"
                  />
                </div>

                <Button onClick={openCreateRole}>
                  <PlusIcon className="h-4 w-4" />
                  Create role
                </Button>
              </div>

              <DataTable
                columns={roleColumns}
                data={filteredRoles}
                rowKey={(role) => role.id}
                emptyTitle="No roles found"
                emptyDescription="Create a role to start defining access in SchoolOS."
                emptyAction={
                  <Button onClick={openCreateRole}>
                    <PlusIcon className="h-4 w-4" />
                    Create first role
                  </Button>
                }
              />

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lower permission tier numbers represent higher privilege. Roles
                are not independently activated or deactivated in the current
                backend model.
              </p>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* PERMISSIONS TAB                                                  */}
          {/* ---------------------------------------------------------------- */}

          {activeTab === "permissions" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                  <Input
                    label="Search permissions"
                    placeholder="Role, module or action..."
                    value={permissionSearch}
                    onChange={(event) =>
                      setPermissionSearch(event.target.value)
                    }
                  />

                  <Select
                    label="Role"
                    value={permissionRoleFilter}
                    onChange={(event) =>
                      setPermissionRoleFilter(event.target.value)
                    }
                    options={roleOptions}
                    placeholder="All roles"
                  />

                  <Select
                    label="Module"
                    value={permissionModuleFilter}
                    onChange={(event) =>
                      setPermissionModuleFilter(event.target.value)
                    }
                    options={PERMISSION_MODULES}
                    placeholder="All modules"
                  />
                </div>

                <Button
                  onClick={openCreatePermission}
                  disabled={roles.length === 0}
                >
                  <PlusIcon className="h-4 w-4" />
                  Add permission
                </Button>
              </div>

              <DataTable
                columns={permissionColumns}
                data={filteredPermissions}
                rowKey={(permission) => permission.id}
                emptyTitle="No permissions found"
                emptyDescription="Add a permission rule to define what a role can do."
                emptyAction={
                  roles.length > 0 ? (
                    <Button onClick={openCreatePermission}>
                      <PlusIcon className="h-4 w-4" />
                      Add permission
                    </Button>
                  ) : undefined
                }
              />

              <SectionCard className="p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Permission model
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Each rule connects a role to a module, action and resource
                  scope. An allowed rule grants access when the backend
                  permission checks also pass. Conditions and priority are
                  stored with each permission record.
                </p>
              </SectionCard>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* ASSIGNMENTS TAB                                                  */}
          {/* ---------------------------------------------------------------- */}

          {activeTab === "assignments" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                  <Input
                    label="Search assignments"
                    placeholder="Name, Login ID or school..."
                    value={assignmentSearch}
                    onChange={(event) =>
                      setAssignmentSearch(event.target.value)
                    }
                  />

                  <Select
                    label="Role"
                    value={assignmentRoleFilter}
                    onChange={(event) =>
                      setAssignmentRoleFilter(event.target.value)
                    }
                    options={roleOptions}
                    placeholder="All roles"
                  />

                  <Select
                    label="Assignment status"
                    value={assignmentStatusFilter}
                    onChange={(event) =>
                      setAssignmentStatusFilter(event.target.value)
                    }
                    options={[
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                      { value: "expired", label: "Expired" },
                    ]}
                    placeholder="All statuses"
                  />
                </div>

                <Button
                  onClick={openAssignRole}
                  disabled={roles.length === 0 || users.length === 0}
                >
                  <PlusIcon className="h-4 w-4" />
                  Assign role
                </Button>
              </div>

              <DataTable
                columns={assignmentColumns}
                data={filteredAssignments}
                rowKey={(assignment) => assignment.id}
                emptyTitle="No assignments found"
                emptyDescription="Assign roles to users to establish their access in SchoolOS."
                emptyAction={
                  roles.length > 0 && users.length > 0 ? (
                    <Button onClick={openAssignRole}>
                      <PlusIcon className="h-4 w-4" />
                      Assign first role
                    </Button>
                  ) : undefined
                }
              />

              <SectionCard className="p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Assignment rules
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-400">
                  <li>School-level roles require a school assignment.</li>
                  <li>
                    County and national roles must not be assigned to a specific
                    school.
                  </li>
                  <li>
                    A user can have multiple roles, with one primary role per
                    school context.
                  </li>
                  <li>
                    Revoking an assignment uses the backend role-assignment
                    service and records the revocation.
                  </li>
                </ul>
              </SectionCard>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* ACCESS SCOPES TAB                                                */}
          {/* ---------------------------------------------------------------- */}

          {activeTab === "scopes" && (
            <div className="space-y-5">
              <SectionCard className="p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  SchoolOS access hierarchy
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Access levels define the organizational boundary of a role.
                  Resource scopes define how far a permission can reach within
                  that boundary.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {ACCESS_LEVELS.map((level) => {
                    const scopedRoles = roles.filter(
                      (role) => role.access_level === level.value,
                    );

                    const scopedAssignments = activeAssignments.filter(
                      (assignment) =>
                        assignment.role_details?.access_level === level.value,
                    );

                    return (
                      <div
                        key={level.value}
                        className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-2">
                          <GlobeAltIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {level.label}
                          </h4>
                        </div>

                        <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                          {scopedRoles.length}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Defined roles
                        </p>

                        <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-700">
                          <p className="text-lg font-semibold text-slate-900 dark:text-white">
                            {scopedAssignments.length}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Active assignments
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1">
                          {scopedRoles.slice(0, 5).map((role) => (
                            <Badge key={role.id} variant="default">
                              {role.name}
                            </Badge>
                          ))}
                          {scopedRoles.length > 5 && (
                            <Badge variant="info">
                              +{scopedRoles.length - 5} more
                            </Badge>
                          )}
                          {scopedRoles.length === 0 && (
                            <span className="text-xs text-slate-400">
                              No roles defined
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>

              <SectionCard className="p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Resource scopes
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  These are the resource-scope choices currently enforced
                  through the PermissionMatrix model.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {RESOURCE_SCOPES.map((scope) => {
                    const count = permissions.filter(
                      (permission) => permission.resource_scope === scope.value,
                    ).length;

                    return (
                      <div
                        key={scope.value}
                        className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900"
                      >
                        <p className="font-medium text-slate-900 dark:text-white">
                          {scope.label}
                        </p>
                        <p className="mt-2 text-xl font-bold text-slate-800 dark:text-slate-200">
                          {count}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Permission rules
                        </p>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>

              <SectionCard className="p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Access configuration overview
                </h3>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-120 text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="py-3 pr-4 font-medium text-slate-500">
                          Role
                        </th>
                        <th className="py-3 pr-4 font-medium text-slate-500">
                          Access level
                        </th>
                        <th className="py-3 pr-4 font-medium text-slate-500">
                          Permission rules
                        </th>
                        <th className="py-3 font-medium text-slate-500">
                          Active assignments
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {roles.map((role) => (
                        <tr key={role.id}>
                          <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">
                            {role.name}
                          </td>
                          <td className="py-3 pr-4 capitalize text-slate-600 dark:text-slate-300">
                            {role.access_level}
                          </td>
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                            {
                              permissions.filter(
                                (permission) => permission.role === role.id,
                              ).length
                            }
                          </td>
                          <td className="py-3 text-slate-600 dark:text-slate-300">
                            {
                              activeAssignments.filter(
                                (assignment) => assignment.role === role.id,
                              ).length
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            </div>
          )}
        </>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* CREATE / EDIT ROLE MODAL                                             */}
      {/* -------------------------------------------------------------------- */}

      <Modal
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        title={editingRole ? "Edit role" : "Create role"}
        description="Define the role's identity, hierarchy and organizational access level."
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="role-form" loading={saving}>
              {editingRole ? "Save changes" : "Create role"}
            </Button>
          </>
        }
      >
        <form id="role-form" onSubmit={saveRole} className="space-y-4">
          <Input
            label="Role name"
            placeholder="e.g. School Principal"
            required
            value={roleForm.name}
            onChange={(event) =>
              setRoleForm({
                ...roleForm,
                name: event.target.value,
              })
            }
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Role category"
              value={roleForm.role_category}
              onChange={(event) =>
                setRoleForm({
                  ...roleForm,
                  role_category: event.target
                    .value as RolePayload["role_category"],
                })
              }
              options={ROLE_CATEGORIES}
            />

            <Select
              label="Access level"
              value={roleForm.access_level}
              onChange={(event) =>
                setRoleForm({
                  ...roleForm,
                  access_level: event.target
                    .value as RolePayload["access_level"],
                })
              }
              options={ACCESS_LEVELS}
            />
          </div>

          <Input
            label="Permission tier"
            type="number"
            min={1}
            max={10}
            required
            value={String(roleForm.permissions_tier)}
            onChange={(event) =>
              setRoleForm({
                ...roleForm,
                permissions_tier: Number(event.target.value),
              })
            }
            hint="1 is the highest privilege; 10 is the lowest."
          />

          <Field label="Description">
            <textarea
              rows={3}
              value={roleForm.description}
              onChange={(event) =>
                setRoleForm({
                  ...roleForm,
                  description: event.target.value,
                })
              }
              placeholder="Describe the responsibilities of this role..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </Field>

          <Input
            label="Default dashboard"
            placeholder="/system/dashboard"
            value={roleForm.default_dashboard}
            onChange={(event) =>
              setRoleForm({
                ...roleForm,
                default_dashboard: event.target.value,
              })
            }
            hint="Optional frontend route for users assigned this role."
          />

          <div className="rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
            SchoolOS validates some role/access combinations on the backend. For
            example, regional roles cannot have school-level access, and
            Principal roles cannot have county-level access.
          </div>
        </form>
      </Modal>

      {/* -------------------------------------------------------------------- */}
      {/* CREATE / EDIT PERMISSION MODAL                                       */}
      {/* -------------------------------------------------------------------- */}

      <Modal
        open={permissionModalOpen}
        onClose={() => setPermissionModalOpen(false)}
        title={editingPermission ? "Edit permission" : "Add permission"}
        description="Define a role's allowed or denied action within a resource scope."
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setPermissionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form="permission-form" loading={saving}>
              {editingPermission ? "Save changes" : "Add permission"}
            </Button>
          </>
        }
      >
        <form
          id="permission-form"
          onSubmit={savePermission}
          className="space-y-4"
        >
          <Select
            label="Role"
            value={permissionForm.role}
            onChange={(event) =>
              setPermissionForm({
                ...permissionForm,
                role: event.target.value,
              })
            }
            options={roleOptions}
            placeholder="Select a role"
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Module"
              value={permissionForm.module}
              onChange={(event) =>
                setPermissionForm({
                  ...permissionForm,
                  module: event.target.value as PermissionPayload["module"],
                })
              }
              options={PERMISSION_MODULES}
            />

            <Select
              label="Action"
              value={permissionForm.action}
              onChange={(event) =>
                setPermissionForm({
                  ...permissionForm,
                  action: event.target.value as PermissionPayload["action"],
                })
              }
              options={PERMISSION_ACTIONS}
            />
          </div>

          <Select
            label="Resource scope"
            value={permissionForm.resource_scope}
            onChange={(event) =>
              setPermissionForm({
                ...permissionForm,
                resource_scope: event.target
                  .value as PermissionPayload["resource_scope"],
              })
            }
            options={RESOURCE_SCOPES}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Permission decision"
              value={permissionForm.is_allowed ? "true" : "false"}
              onChange={(event) =>
                setPermissionForm({
                  ...permissionForm,
                  is_allowed: event.target.value === "true",
                })
              }
              options={[
                { value: "true", label: "Allow" },
                { value: "false", label: "Deny" },
              ]}
            />

            <Input
              label="Priority"
              type="number"
              min={1}
              value={String(permissionForm.priority)}
              onChange={(event) =>
                setPermissionForm({
                  ...permissionForm,
                  priority: Number(event.target.value),
                })
              }
              hint="Higher priority rules are evaluated first."
            />
          </div>

          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
            <p className="text-xs leading-5 text-slate-600 dark:text-slate-400">
              Conditions are stored as JSON by the backend. The initial
              interface uses an empty conditions object. We can add a structured
              conditions editor after verifying the condition rules you want to
              support.
            </p>
          </div>
        </form>
      </Modal>

      {/* -------------------------------------------------------------------- */}
      {/* ASSIGN ROLE MODAL                                                    */}
      {/* -------------------------------------------------------------------- */}

      <Modal
        open={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        title="Assign role to user"
        description="Give a user a role within the appropriate organizational context."
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setAssignmentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form="assignment-form" loading={saving}>
              Assign role
            </Button>
          </>
        }
      >
        <form
          id="assignment-form"
          onSubmit={saveAssignment}
          className="space-y-4"
        >
          <Select
            label="User"
            value={assignmentForm.user_id}
            onChange={(event) =>
              setAssignmentForm({
                ...assignmentForm,
                user_id: event.target.value,
              })
            }
            options={userOptions}
            placeholder="Select a user"
            required
          />

          <Select
            label="Role"
            value={assignmentForm.role_id}
            onChange={(event) =>
              setAssignmentForm({
                ...assignmentForm,
                role_id: event.target.value,
                school_id: "",
              })
            }
            options={roleOptions}
            placeholder="Select a role"
            required
          />

          {selectedAssignmentRole?.access_level === "school" && (
            <Select
              label="School"
              value={assignmentForm.school_id}
              onChange={(event) =>
                setAssignmentForm({
                  ...assignmentForm,
                  school_id: event.target.value,
                })
              }
              options={schoolOptions}
              placeholder="Select a school"
              required
            />
          )}

          {selectedAssignmentRole &&
            selectedAssignmentRole.access_level !== "school" && (
              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                This is a {selectedAssignmentRole.access_level}-level role. No
                school should be attached to this assignment.
              </div>
            )}

          <label className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <input
              type="checkbox"
              checked={assignmentForm.is_primary}
              onChange={(event) =>
                setAssignmentForm({
                  ...assignmentForm,
                  is_primary: event.target.checked,
                })
              }
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>
              <span className="block text-sm font-medium text-slate-900 dark:text-white">
                Make this the primary role
              </span>
              <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                The primary role determines the user's main role for this
                organizational context.
              </span>
            </span>
          </label>
        </form>
      </Modal>
    </div>
  );
}
