import api from "./client";

/*
  TYPES
 */

export interface Role {
  id: string;
  name: string;
  role_category: string;
  permissions_tier: number;
  description: string | null;
  default_dashboard: string | null;
  access_level: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface RolePayload {
  name: string;
  role_category: string;
  permissions_tier: number;
  description?: string;
  default_dashboard?: string;
  access_level: string;
}

/*
  API
 */

const rolesAPI = {
  list: () =>
    api.get<Role[]>(
      "/api/v1/accounts/roles/"
    ),

  get: (id: string) =>
    api.get<Role>(
      `/api/v1/accounts/roles/${id}/`
    ),

  create: (data: RolePayload) =>
    api.post<Role>(
      "/api/v1/accounts/roles/",
      data
    ),

  update: (
    id: string,
    data: Partial<RolePayload>
  ) =>
    api.patch<Role>(
      `/api/v1/accounts/roles/${id}/`,
      data
    ),

  delete: (id: string) =>
    api.delete(
      `/api/v1/accounts/roles/${id}/`
    ),
};

export default rolesAPI;