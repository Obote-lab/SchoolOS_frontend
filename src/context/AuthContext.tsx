import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import {
    authAPI,
    clearAuthTokens,
    setAuthTokens,
    hasAuthTokens,
} from "../api/auth";

import usersAPI from "../api/users";

import type { User } from "../api/users";
import type { LoginCredentials } from "../api/auth";

/*
| TYPES
*/

export type AuthStatus =
    | "loading"
    | "authenticated"
    | "unauthenticated"
    | "unavailable";

interface AuthContextType {
    currentUser: User | null;

    loading: boolean;

    isAuthenticated: boolean;

    authStatus: AuthStatus;

    login: (credentials: LoginCredentials) => Promise<{
        user: User;
        mustChangePassword: boolean;
    }>;

    logout: () => Promise<void>;

    updateUser: (updates: Partial<User>) => void;

    refreshUser: () => Promise<void>;
    }

/*
| CONTEXT
*/

const AuthContext = createContext<AuthContextType | null>(null);

/*
| PROVIDER
*/

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");

    /*
    | LOGOUT
    */

    const logout = useCallback(async () => {
        const refresh = localStorage.getItem("refresh");

        /**
         * Clear local state immediately so the application
         * no longer treats the user as authenticated.
         */
        clearAuthTokens();
        setCurrentUser(null);
        setAuthStatus("unauthenticated");

        if (!refresh) return;

        try {
        await authAPI.logout(refresh);
        } catch {
        /**
         * Local logout remains effective even if the
         * backend is temporarily unavailable.
         */
        }
    }, []);

    /*
    |--------------------------------------------------------------------------
    | LOAD CURRENT USER
    |--------------------------------------------------------------------------
    */

    const bootstrap = useCallback(async (): Promise<void> => {
        if (!hasAuthTokens()) {
        setCurrentUser(null);
        setAuthStatus("unauthenticated");
        return;
        }

        setAuthStatus("loading");

        try {
        const { data } = await usersAPI.getMe();

        setCurrentUser(data);
        setAuthStatus("authenticated");
        } catch {
        /**
         * The Axios interceptor already attempts token
         * refresh when the access token expires.
         *
         * If the refresh token was rejected, the interceptor
         * clears local tokens.
         */
        if (!hasAuthTokens()) {
            setCurrentUser(null);
            setAuthStatus("unauthenticated");
            return;
        }

        /**
         * Credentials still exist, so this may be a
         * network error, timeout, server error or another
         * temporary failure.
         *
         * Do not automatically log the user out.
         */
        setAuthStatus("unavailable");
        }
    }, []);

    /* INITIAL AUTHENTICATION CHECK    */

    useEffect(() => {
        let cancelled = false;

        const initialize = async () => {
        await bootstrap();
        };

        initialize().finally(() => {
        if (cancelled) return;
        });

        return () => {
        cancelled = true;
        };
    }, [bootstrap]);

    /*LOGIN*/

    const login = useCallback(async (credentials: LoginCredentials) => {
    /**
     * Authenticate credentials with the backend.
     */
    const { data } = await authAPI.login(credentials);

    const { access, refresh } = data.tokens ?? {};

    if (!access || !refresh) {
      throw new Error("Login response is missing access or refresh tokens.");
    }

    /**
     * Save tokens before requesting the full profile.
     */
    setAuthTokens(data.tokens);

    try {
      const me = await usersAPI.getMe();

      setCurrentUser(me.data);
      setAuthStatus("authenticated");

      return {
        user: me.data,
        mustChangePassword: Boolean(data.user?.must_change_password),
      };
    } catch (error) {
      /**
       * Login succeeded, but the profile could not
       * be loaded. Do not leave a partially initialized
       * session behind.
       */
      clearAuthTokens();
      setCurrentUser(null);
      setAuthStatus("unauthenticated");

      throw error;
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | UPDATE USER
  |--------------------------------------------------------------------------
  */

  const updateUser = useCallback((updates: Partial<User>) => {
    setCurrentUser((previousUser) => {
      if (!previousUser) return null;

      return {
        ...previousUser,
        ...updates,
      };
    });
  }, []);

  /*
  |--------------------------------------------------------------------------
  | REFRESH USER
  |--------------------------------------------------------------------------
  */

  const refreshUser = useCallback(async () => {
    await bootstrap();
  }, [bootstrap]);

  /*
  |--------------------------------------------------------------------------
  | CONTEXT VALUE
  |--------------------------------------------------------------------------
  */

  const loading = authStatus === "loading";

  const isAuthenticated =
    authStatus === "authenticated" && currentUser !== null;

  const value: AuthContextType = useMemo(
    () => ({
      currentUser,
      loading,
      isAuthenticated,
      authStatus,
      login,
      logout,
      updateUser,
      refreshUser,
    }),
    [
      currentUser,
      loading,
      isAuthenticated,
      authStatus,
      login,
      logout,
      updateUser,
      refreshUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/*
|--------------------------------------------------------------------------
| AUTH HOOK
|--------------------------------------------------------------------------
*/

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}
