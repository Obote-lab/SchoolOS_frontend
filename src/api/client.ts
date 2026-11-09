import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const baseURL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

/*
| TYPES
*/

export interface ApiError {
  status?: number;
  message: string;
  data?: unknown;
}

/*
| ERROR NORMALIZATION
*/

export function normalizeError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) {
      return {
        message: error.message,
      };
    }

    return {
      message: "An unexpected error occurred.",
    };
  }

  const axiosError = error as AxiosError<unknown>;
  const data = axiosError.response?.data;

  let message = axiosError.message || "Unexpected error";

  if (data && typeof data === "object") {
    const responseData = data as Record<string, unknown>;

    if (typeof responseData.detail === "string") {
      message = responseData.detail;
    } else if (typeof responseData.message === "string") {
      message = responseData.message;
    } else {
      const firstError = Object.values(responseData).find(
        (value) => Array.isArray(value) && value.length > 0,
      );

      if (Array.isArray(firstError)) {
        message = String(firstError[0]);
      }
    }
  }

  return {
    status: axiosError.response?.status,
    message,
    data,
  };
}

/*
| AXIOS INSTANCE
*/

const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/*
| TOKEN STORAGE
*/

export function clearAuthStorage(): void {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

/*

| TOKEN REFRESH
*/

/**
 * Shared refresh promise prevents multiple simultaneous
 * requests from refreshing the same token independently.
 */
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refresh");

  if (!refreshToken) {
    clearAuthStorage();
    throw new Error("No refresh token available.");
  }

  /**
   * Use plain axios rather than the authenticated API
   * instance to prevent recursive refresh attempts.
   */
  const response = await axios.post<{
    access: string;
    refresh?: string;
  }>(
    `${baseURL}/api/auth/token/refresh/`,
    {
      refresh: refreshToken,
    },
    {
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  const { access, refresh } = response.data;

  if (!access) {
    throw new Error("Token refresh response is missing an access token.");
  }

  localStorage.setItem("access", access);

  /**
   * Support SimpleJWT refresh-token rotation.
   */
  if (refresh) {
    localStorage.setItem("refresh", refresh);
  }

  return access;
}

/*
| REQUEST INTERCEPTOR
*/

/**
 * Automatically attach the current access token
 * to authenticated API requests.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => Promise.reject(normalizeError(error)),
);

/*
| RESPONSE INTERCEPTOR
*/

/**
 * Refresh expired access tokens automatically.
 *
 * Important:
 * - Only HTTP 401 triggers token refresh.
 * - Login and refresh requests are excluded.
 * - Temporary server/network errors do not clear tokens.
 * - Invalid refresh credentials clear local authentication.
 */
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(normalizeError(error));
    }

    const requestUrl = originalRequest.url || "";

    const isAuthRequest =
      requestUrl.includes("/api/v1/accounts/auth/login/") ||
      requestUrl.includes("/api/v1/accounts/auth/logout/") ||
      requestUrl.includes("/api/auth/token/refresh/");

    const shouldRefresh =
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest;

    if (!shouldRefresh) {
      return Promise.reject(normalizeError(error));
    }

    originalRequest._retry = true;

    try {
      /**
       * Reuse an existing refresh operation if another
       * request has already started refreshing.
       */
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      /**
       * Retry the original request with the new token.
       */
      return api(originalRequest);
    } catch (refreshError) {
      const normalized = normalizeError(refreshError);

      /**
       * Clear credentials only when the backend explicitly
       * rejects the refresh token.
       *
       * Do not clear credentials for network errors,
       * timeouts, server errors or rate limiting.
       */
      if (normalized.status === 400 || normalized.status === 401) {
        clearAuthStorage();
      }

      return Promise.reject(normalized);
    }
  },
);

/*
  EXPORT
*/

export default api;
