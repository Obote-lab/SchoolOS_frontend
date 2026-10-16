import api from "./client";
/*
  TYPES
 */

export interface LoginCredentials {
  login_id: string;
  password: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface LoginSchool {
  id: string;
  name: string;
}

export interface LoginUser {
  id: string;
  login_id: string;
  full_name: string;
  email: string | null;
  is_superuser: boolean;
  school: LoginSchool | null;
  primary_role: string | null;
  must_change_password: boolean;
}

export interface LoginResponse {
  user: LoginUser;
  tokens: TokenPair;
}

export interface LogoutRequest {
  refresh: string;
}

export interface MessageResponse {
  message: string;
}

export interface ActivationRequest {
  token: string;
}

export interface AccountActivationResponse {
  message: string;
  login_id: string;
  user: unknown;
}

export interface ResendActivationRequest {
  login_id: string;
}

export interface PasswordResetRequest {
  login_id: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface PasswordChangeRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

/*
  API
 */

export const authAPI = {
  /**
   * POST /api/v1/accounts/auth/login/
   */
  login: (credentials: LoginCredentials) =>
    api.post<LoginResponse>(
      "/api/v1/accounts/auth/login/",
      credentials
    ),

  /**
   * POST /api/v1/accounts/auth/logout/
   */
  logout: (refresh: string) =>
    api.post<MessageResponse>(
      "/api/v1/accounts/auth/logout/",
      {
        refresh,
      }
    ),

  /**
   * POST /api/auth/token/refresh/
   */
  refresh: (refresh: string) =>
    api.post<TokenPair>(
      "/api/auth/token/refresh/",
      {
        refresh,
      }
    ),

  /**
   * POST /api/v1/accounts/auth/activate/
   */
  activate: (data: ActivationRequest) =>
    api.post<AccountActivationResponse>(
      "/api/v1/accounts/auth/activate/",
      data
    ),

  /**
   * POST /api/v1/accounts/auth/resend-activation/
   */
  resendActivation: (data: ResendActivationRequest) =>
    api.post<MessageResponse>(
      "/api/v1/accounts/auth/resend-activation/",
      data
    ),

  /**
   * POST /api/v1/accounts/auth/password-reset/
   */
  requestPasswordReset: (data: PasswordResetRequest) =>
    api.post<MessageResponse>(
      "/api/v1/accounts/auth/password-reset/",
      data
    ),

  /**
   * POST /api/v1/accounts/auth/password-reset/confirm/
   */
  confirmPasswordReset: (
    data: PasswordResetConfirmRequest
  ) =>
    api.post<MessageResponse>(
      "/api/v1/accounts/auth/password-reset/confirm/",
      data
    ),
};

/*
  TOKEN HELPERS
 */

export function setAuthTokens(tokens: TokenPair): void {
  localStorage.setItem("access", tokens.access);
  localStorage.setItem("refresh", tokens.refresh);
}

export function clearAuthTokens(): void {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

export function getAccessToken(): string | null {
  return localStorage.getItem("access");
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("refresh");
}

export function hasAuthTokens(): boolean {
  return Boolean(
    localStorage.getItem("access") &&
      localStorage.getItem("refresh")
  );
}