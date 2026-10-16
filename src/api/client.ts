import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

const baseURL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

/**
 * Standard API error returned by our frontend API layer.
 */
export interface ApiError {
  status?: number;
  message: string;
  data?: unknown;
}

/**
 * Convert Axios/DRF errors into a predictable frontend error.
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
      /**
       * DRF validation errors:
       *
       * {
       *   "login_id": ["This field is required."],
       *   "password": ["This field is required."]
       * }
       */
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

const api: AxiosInstance = axios.create({
  baseURL,

  /**
   * Keep this because your backend may use cookies
   * in addition to JWT authentication.
   */
  withCredentials: true,

  timeout: 15000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Attach access token to every authenticated request.
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

/**
 * Prevent multiple simultaneous requests from
 * attempting to refresh the token independently.
 */
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refresh");

  if (!refreshToken) {
    throw new Error("No refresh token available.");
  }

  const response = await axios.post<{ access: string; refresh?: string }>(
    `${baseURL}/api/auth/token/refresh/`,
    {
      refresh: refreshToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  const { access, refresh } = response.data;

  if (!access) {
    throw new Error("Token refresh failed.");
  }

  localStorage.setItem("access", access);

  /**
   * SimpleJWT may rotate the refresh token.
   */
  if (refresh) {
    localStorage.setItem("refresh", refresh);
  }

  return access;
}

/**
 * Handle expired access tokens.
 */
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | null;

    if (!originalRequest) {
      return Promise.reject(normalizeError(error));
    }

    const requestUrl = originalRequest.url || "";

    const isRefreshRequest = requestUrl.includes("/api/auth/token/refresh/");

    /**
     * Only attempt refresh for 401 responses.
     */
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;

      try {
        /**
         * If another request is already refreshing,
         * wait for that request instead of starting another one.
         */
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const newAccessToken = await refreshPromise;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        clearAuthStorage();

        /**
         * Let React Router/AuthContext ultimately handle
         * the authentication state.
         *
         * We avoid forcing window.location here because
         * that causes a full application reload.
         */
        return Promise.reject(normalizeError(refreshError));
      }
    }

    return Promise.reject(normalizeError(error));
  },
);

/**
 * Clear all locally stored authentication credentials.
 */
export function clearAuthStorage(): void {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

export default api;
