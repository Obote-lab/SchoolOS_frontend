import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from "react";
import { authAPI, clearAuthTokens, setAuthTokens } from "../api/auth";
import usersAPI from "../api/users";
import type { User } from "../api/users";
import type { LoginCredentials, LoginResponse } from "../api/auth";


interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<{
        user: User;
        mustChangePassword: boolean;
    }>;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<User>) => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

    export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(async () => {
        const refresh = localStorage.getItem("refresh");
        try {
        if (refresh) {
            await authAPI.logout(refresh);
        }
        } catch {
        // ignore server errors, still clear local session
        } finally {
        clearAuthTokens();
        setCurrentUser(null);
        }
    }, []);

    const bootstrap = useCallback(async () => {
        const token = localStorage.getItem("access");
        if (!token) {
        setCurrentUser(null);
        return;
        }
        try {
        const { data } = await usersAPI.getMe();
        setCurrentUser(data);
        } catch {
        clearAuthTokens();
        setCurrentUser(null);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
        try {
            await bootstrap();
        } finally {
            if (!cancelled) setLoading(false);
        }
        })();
        return () => {
        cancelled = true;
        };
    }, [bootstrap]);

    const login = useCallback(async (credentials: LoginCredentials) => {
        const { data } = await authAPI.login(credentials);

        const { access, refresh } = data.tokens;
        if (!access || !refresh) {
            throw new Error("Login response missing access or refresh token");
        }

        setAuthTokens(data.tokens);

        // Always fetch the full user profile so we have consistent shape + roles
        const me = await usersAPI.getMe();
        setCurrentUser(me.data);

        return {
            user: me.data,
            mustChangePassword: data.user.must_change_password,
        };
        }, []);

    const updateUser = useCallback((updates: Partial<User>) => {
        setCurrentUser((prev) =>
        prev ? { ...prev, ...updates } : (updates as User),
        );
    }, []);

    const value: AuthContextType = useMemo(
        () => ({
        currentUser,
        loading,
        isAuthenticated: !!currentUser,
        login,
        logout,
        updateUser,
        refreshUser: bootstrap,
        }),
        [currentUser, loading, login, logout, updateUser, bootstrap],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    }

    export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
