import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
    } from "react";

    type Theme = "light" | "dark" | "system";

    interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
    }

    const ThemeContext = createContext<ThemeContextType | null>(null);

    export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        return (localStorage.getItem("theme") as Theme) || "system";
    });

    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = (value: Theme) => {
        const systemDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;
        const shouldBeDark =
            value === "dark" || (value === "system" && systemDark);

        root.classList.toggle("dark", shouldBeDark);
        setIsDark(shouldBeDark);
        };

        applyTheme(theme);
        localStorage.setItem("theme", theme);

        // Listen to system preference changes when in "system" mode
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => {
        if (theme === "system") applyTheme("system");
        };

        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, [theme]);

    const setTheme = (value: Theme) => {
        setThemeState(value);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
        {children}
        </ThemeContext.Provider>
    );
    }

    export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}
