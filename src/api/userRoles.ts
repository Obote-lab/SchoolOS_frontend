import api from "./client";
import { User, UserRole } from "./users";
import { Role } from "./roles";

/*
  TYPES
 */

export interface UserRoleDetails extends UserRole {
  user: string;
  user_details: User;

  role_details: Role;

  school: string | null;

  assigned_by: string | null;

  metadata: Record<string, unknown>;

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

export interface TransferUserPayload {
  user_id: string;
  new_school_id: string;
}

/*
  API
 */

const userRolesAPI = {
  /**
   * GET /api/v1/accounts/user-roles/
   */
  list: () =>
    api.get<UserRoleDetails[]>(
      "/api/v1/accounts/user-roles/"
    ),

  /**
   * GET /api/v1/accounts/user-roles/:id/
   */
  get: (id: string) =>
    api.get<UserRoleDetails>(
      `/api/v1/accounts/user-roles/${id}/`
    ),

  /**
   * GET /api/v1/accounts/user-roles/my_roles/
   */
  myRoles: () =>
    api.get<UserRoleDetails[]>(
      "/api/v1/accounts/user-roles/my_roles/"
    ),

  /**
   * GET /api/v1/accounts/user-roles/primary_role/
   */
  primaryRole: () =>
    api.get<UserRoleDetails>(
      "/api/v1/accounts/user-roles/primary_role/"
    ),

  /**
   * POST /api/v1/accounts/user-roles/assign_role/
   */
  assignRole: (data: AssignRolePayload) =>
    api.post<UserRoleDetails>(
      "/api/v1/accounts/user-roles/assign_role/",
      data
    ),

  /**
   * POST /api/v1/accounts/user-roles/revoke_role/
   */
  revokeRole: (data: RevokeRolePayload) =>
    api.post<UserRoleDetails>(
      "/api/v1/accounts/user-roles/revoke_role/",
      data
    ),

  /**
   * POST /api/v1/accounts/user-roles/promote_user/
   */
  promoteUser: (data: PromoteUserPayload) =>
    api.post<UserRoleDetails>(
      "/api/v1/accounts/user-roles/promote_user/",
      data
    ),

  /**
   * POST /api/v1/accounts/user-roles/transfer_user/
   */
  transferUser: (data: TransferUserPayload) =>
    api.post<UserRoleDetails[]>(
      "/api/v1/accounts/user-roles/transfer_user/",
      data
    ),
};

export default userRolesAPI;
