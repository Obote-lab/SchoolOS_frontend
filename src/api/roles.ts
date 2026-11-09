import api from "./client";

/* Types */

export type RoleCategory =
  | "academic"
  | "administrative"
  | "support"
  | "external";

export type AccessLevel = "school" | "county" | "national";

export type PermissionModule =
  | "finance"
  | "academic"
  | "health"
  | "attendance"
  | "discipline"
  | "activities"
  | "communication"
  | "staff"
  | "students"
  | "settings"
  | "reports"
  | "organization"
  | "identity"
  | "branding";

export type PermissionAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "approve"
  | "export"
  | "import"
  | "notify"
  | "assign"
  | "revoke";

export type ResourceScope =
  | "own"
  | "department"
  | "school"
  | "county"
  | "national";

export interface Role {
  id: string;
  name: string;
  role_category: RoleCategory;
  permissions_tier: number;
  description: string;
  default_dashboard: string;
  access_level: AccessLevel;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface RolePayload {
  name: string;
  role_category: RoleCategory;
  permissions_tier: number;
  description: string;
  default_dashboard: string;
  access_level: AccessLevel;
}

export interface Permission {
  id: string;
  role: string;
  role_name: string;
  module: PermissionModule;
  action: PermissionAction;
  resource_scope: ResourceScope;
  conditions: Record<string, unknown>;
  is_allowed: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface PermissionPayload {
  role: string;
  module: PermissionModule;
  action: PermissionAction;
  resource_scope: ResourceScope;
  conditions: Record<string, unknown>;
  is_allowed: boolean;
  priority: number;
}

export interface AssignmentUser {
  id: string;
  login_id: string;
  full_name: string;
}

export interface AssignmentRole {
  id: string;
  name: string;
  role_category: RoleCategory;
  access_level: AccessLevel;
  permissions_tier: number;
}

export interface RoleAssignment {
  id: string;
  user: string;
  user_details: AssignmentUser;
  role: string;
  role_details: AssignmentRole;
  school: string | null;
  school_name: string | null;
  is_primary_role: boolean;
  assigned_by: string | null;
  assigned_date: string;
  valid_until: string | null;
  metadata: Record<string, unknown>;
  is_active: boolean;
  is_expired: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssignRolePayload {
  user_id: string;
  role_id: string;
  school_id?: string;
  is_primary?: boolean;
}

export interface RevokeRolePayload {
  assignment_id: string;
  reason?: string;
}

export interface PromoteUserPayload {
  user_id: string;
  new_role_id: string;
  school_id?: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/* Choice options — mirror Django identity choices */

export const ROLE_CATEGORIES = [
  { value: "academic", label: "Academic" },
  { value: "administrative", label: "Administrative" },
  { value: "support", label: "Support" },
  { value: "external", label: "External" },
] satisfies { value: RoleCategory; label: string }[];

export const ACCESS_LEVELS = [
  { value: "school", label: "School level" },
  { value: "county", label: "County level" },
  { value: "national", label: "National level" },
] satisfies { value: AccessLevel; label: string }[];

export const PERMISSION_MODULES = [
  { value: "finance", label: "Finance" },
  { value: "academic", label: "Academic" },
  { value: "health", label: "Health" },
  { value: "attendance", label: "Attendance" },
  { value: "discipline", label: "Discipline" },
  { value: "activities", label: "Activities" },
  { value: "communication", label: "Communication" },
  { value: "staff", label: "Staff Management" },
  { value: "students", label: "Student Management" },
  { value: "settings", label: "System Settings" },
  { value: "reports", label: "Reports & Analytics" },
  { value: "organization", label: "Organization" },
  { value: "identity", label: "Identity & Access" },
  { value: "branding", label: "Branding" },
] satisfies { value: PermissionModule; label: string }[];

export const PERMISSION_ACTIONS = [
  { value: "create", label: "Create" },
  { value: "read", label: "Read" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
  { value: "approve", label: "Approve" },
  { value: "export", label: "Export" },
  { value: "import", label: "Import" },
  { value: "notify", label: "Send notifications" },
  { value: "assign", label: "Assign" },
  { value: "revoke", label: "Revoke" },
] satisfies { value: PermissionAction; label: string }[];

export const RESOURCE_SCOPES = [
  { value: "own", label: "Own resources" },
  { value: "department", label: "Department" },
  { value: "school", label: "School" },
  { value: "county", label: "County" },
  { value: "national", label: "National" },
] satisfies { value: ResourceScope; label: string }[];

/* Response normalization */

function rows<T>(data: T[] | Paginated<T>): T[] {
  return Array.isArray(data) ? data : (data.results ?? []);
}

/* API*/

const ROLES = "/api/v1/accounts/roles/";
const PERMISSIONS = "/api/v1/accounts/permissions/";
const ASSIGNMENTS = "/api/v1/accounts/user-roles/";

export const rolesAPI = {
  /* Roles */

  listRoles: async () => {
    const response = await api.get<Role[] | Paginated<Role>>(ROLES);
    return rows(response.data);
  },

  getRole: (id: string) => api.get<Role>(`${ROLES}${id}/`),

  createRole: (data: RolePayload) => api.post<Role>(ROLES, data),

  updateRole: (id: string, data: Partial<RolePayload>) =>
    api.patch<Role>(`${ROLES}${id}/`, data),

  deleteRole: (id: string) => api.delete(`${ROLES}${id}/`),

  /* Permissions */

  listPermissions: async () => {
    const response = await api.get<Permission[] | Paginated<Permission>>(
      PERMISSIONS,
    );

    return rows(response.data);
  },

  createPermission: (data: PermissionPayload) =>
    api.post<Permission>(PERMISSIONS, data),

  updatePermission: (id: string, data: Partial<PermissionPayload>) =>
    api.patch<Permission>(`${PERMISSIONS}${id}/`, data),

  deletePermission: (id: string) => api.delete(`${PERMISSIONS}${id}/`),

  /* User role assignments */

  listAssignments: async () => {
    const response = await api.get<
      RoleAssignment[] | Paginated<RoleAssignment>
    >(ASSIGNMENTS);

    return rows(response.data);
  },

  assignRole: (data: AssignRolePayload) =>
    api.post<RoleAssignment>(`${ASSIGNMENTS}assign_role/`, data),

  revokeRole: (data: RevokeRolePayload) =>
    api.post<RoleAssignment>(`${ASSIGNMENTS}revoke_role/`, data),

  promoteUser: (data: PromoteUserPayload) =>
    api.post<RoleAssignment>(`${ASSIGNMENTS}promote_user/`, data),

  transferUser: (user_id: string, new_school_id: string) =>
    api.post<RoleAssignment[]>(`${ASSIGNMENTS}transfer_user/`, {
      user_id,
      new_school_id,
    }),
};

export default rolesAPI;
