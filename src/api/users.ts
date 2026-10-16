import api from "./client";

/*
  TYPES
 */

export interface UserRole {
  id: string;
  role_name: string;
  role_category: string;
  school_name: string | null;
  role: string;
  school: string | null;
  is_primary_role: boolean;
  assigned_date: string;
  valid_until: string | null;
  is_active: boolean;
}

export interface User {
  id: string;
  permanent_id: string;
  login_id: string;

  first_name: string;
  middle_name: string | null;
  last_name: string;
  full_name: string;

  email: string | null;
  phone: string | null;

  user_gender: string | null;
  preferred_language: string | null;

  notification_prefs: Record<string, unknown>;

  profile_picture: string | null;

  county: string | null;
  sub_county: string | null;
  ward: string | null;
  address: string | null;

  recovery_email: string | null;

  is_active: boolean;
  is_verified: boolean;
  can_login: boolean;
  is_locked: boolean;

  date_joined: string;
  last_login: string | null;

  created_at: string;
  updated_at: string;

  roles: UserRole[];

  last_password_change: string | null;
}

export interface UpdateMePayload {
  first_name?: string;
  middle_name?: string;
  last_name?: string;

  email?: string;
  phone?: string;

  user_gender?: string;
  preferred_language?: string;

  notification_prefs?: Record<string, unknown>;

  profile_picture?: string;

  county?: string;
  sub_county?: string;
  ward?: string;
  address?: string;

  recovery_email?: string;
}

export interface UserSearchParams {
  query?: string;
  role?: string;
  school?: string;
  is_active?: boolean;
}

export interface UserListParams {
  page?: number;
  page_size?: number;

  search?: string;

  ordering?: string;

  is_active?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface LockAccountPayload {
  hours?: number;
}

export interface MessageResponse {
  message: string;
}

export interface LockAccountResponse {
  message: string;
  is_locked: boolean;
}

export interface BulkUserPayload {
  school_id?: string;
  role_name: string;
  users: Record<string, unknown>[];
}

export interface BulkUserResultItem {
  index: number;
  user_id?: string;
  login_id?: string;
  error?: string;
}

export interface BulkUserCreateResponse {
  message?: string;
  created: BulkUserResultItem[];
  failed: BulkUserResultItem[];
  total_requested?: number;
  total_created?: number;
  total_failed?: number;
}

/*
  API
 */

const usersAPI = {
  /**
   * GET /api/v1/accounts/users/me/
   */
  getMe: (config?: { signal?: AbortSignal }) =>
    api.get<User>(
      "/api/v1/accounts/users/me/",
      config
    ),

  /**
   * PATCH /api/v1/accounts/users/me/
   */
  updateMe: (data: UpdateMePayload) =>
    api.patch<User>(
      "/api/v1/accounts/users/me/",
      data
    ),

  /**
   * GET /api/v1/accounts/users/
   */
  list: (params: UserListParams = {}) =>
    api.get<PaginatedResponse<User> | User[]>(
      "/api/v1/accounts/users/",
      { params }
    ),

  /**
   * GET /api/v1/accounts/users/:id/
   */
  get: (id: string) =>
    api.get<User>(
      `/api/v1/accounts/users/${id}/`
    ),

  /**
   * PATCH /api/v1/accounts/users/:id/
   */
  update: (
    id: string,
    data: UpdateMePayload
  ) =>
    api.patch<User>(
      `/api/v1/accounts/users/${id}/`,
      data
    ),

  /**
   * GET /api/v1/accounts/users/search/
   */
  search: (params: UserSearchParams) =>
    api.get<PaginatedResponse<User> | User[]>(
      "/api/v1/accounts/users/search/",
      { params }
    ),

  /**
   * POST /api/v1/accounts/users/change_password/
   */
  changePassword: (data: PasswordChangePayload) =>
    api.post<MessageResponse>(
      "/api/v1/accounts/users/change_password/",
      data
    ),

  /**
   * POST /api/v1/accounts/users/:id/lock_account/
   */
  lock: (
    id: string,
    data: LockAccountPayload = {}
  ) =>
    api.post<LockAccountResponse>(
      `/api/v1/accounts/users/${id}/lock_account/`,
      data
    ),

  /**
   * POST /api/v1/accounts/users/:id/unlock_account/
   */
  unlock: (id: string) =>
    api.post<LockAccountResponse>(
      `/api/v1/accounts/users/${id}/unlock_account/`
    ),

  /**
   * POST /api/v1/accounts/users/bulk_create/
   */
  bulkCreate: (data: BulkUserPayload) =>
    api.post<BulkUserCreateResponse>(
      "/api/v1/accounts/users/bulk_create/",
      data
    ),
};

export interface PasswordChangePayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export default usersAPI;
