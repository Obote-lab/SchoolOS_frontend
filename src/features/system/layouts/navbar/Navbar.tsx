// src/features/system/layouts/navbar/Navbar.tsx
import { Bars3Icon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../../../context/ThemeContext";
import { useBrandingOptional } from "../../../../context/BrandingContext";
import { SearchDropdown } from "./SearchDropdown";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { ThemeMenu } from "./ThemeMenu";
import { UserMenu } from "./UserMenu";
import { cn } from "../../../../lib/cn";

interface NavbarProps {
  collapsed: boolean;
  onOpenMobileSidebar?: () => void;
}

export default function Navbar({
  collapsed,
  onOpenMobileSidebar,
}: NavbarProps) {
  const { isDark } = useTheme();
  const branding = useBrandingOptional();
  const primary = branding?.primary ?? "#0B5FFF";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center justify-between border-b px-3 backdrop-blur-lg transition-all duration-300 sm:h-16 sm:px-6",
        isDark
          ? "border-slate-700 bg-slate-900/95"
          : "border-slate-200 bg-white/95",
        collapsed ? "lg:pl-20" : "lg:pl-64",
      )}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          className={cn(
            "rounded-lg p-2 transition-colors lg:hidden",
            isDark
              ? "text-slate-400 hover:bg-slate-800 hover:text-white"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
          )}
          onClick={onOpenMobileSidebar}
          aria-label="Open menu"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1
            className={cn(
              "truncate text-sm font-semibold",
              isDark ? "text-white" : "text-slate-900",
            )}
          >
            System Administration
          </h1>
          <p
            className={cn(
              "hidden truncate text-xs sm:block",
              isDark ? "text-slate-400" : "text-slate-500",
            )}
          >
            Manage the SchoolOS platform
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
        <SearchDropdown primary={primary} />

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 active:scale-[0.98] sm:px-3"
          style={{ backgroundColor: primary }}
          title="Quick add"
        >
          <PlusCircleIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Add</span>
        </button>

        <NotificationsDropdown />
        <ThemeMenu />
        <UserMenu primary={primary} />
      </div>
    </header>
  );
}
