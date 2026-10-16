import api from "./client";
import usersAPI from "../api/users";
import type { User } from "../api/users";


/*
  TYPES
 */

export interface SystemDashboardSummary {
  total_users: number;
  total_schools: number;
  active_schools: number;
}

export interface SystemDashboardResponse {
  summary: SystemDashboardSummary;
  recent_users: User[];
}

export interface CreateRegionalAdminPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  managed_counties: string[];
}

export interface UserCreatedResponse {
  message: string;
  login_id: string;
  user: User;
}

export interface CreatePrincipalPayload {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone?: string;
}

export interface CreatePrincipalResponse
  extends UserCreatedResponse {
  school_id: string;
  school_name: string;
}

/*
  SYSTEM ROOT API
 */

export const systemAPI = {
  /**
   * GET /api/v1/accounts/system/dashboard/
   */
  getDashboard: () =>
    api.get<SystemDashboardResponse>(
      "/api/v1/accounts/system/dashboard/"
    ),

  /**
   * POST /api/v1/accounts/system/regional-admins/
   */
  createRegionalAdmin: (
    data: CreateRegionalAdminPayload
  ) =>
    api.post<UserCreatedResponse>(
      "/api/v1/accounts/system/regional-admins/",
      data
    ),

  /**
   * POST
   * /api/v1/accounts/system/schools/:schoolId/principals/
   */
  createPrincipal: (
    schoolId: string,
    data: CreatePrincipalPayload
  ) =>
    api.post<CreatePrincipalResponse>(
      `/api/v1/accounts/system/schools/${schoolId}/principals/`,
      data
    ),
};

export default systemAPI;