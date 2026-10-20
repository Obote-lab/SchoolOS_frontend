// src/features/system/layouts/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import {
  HomeIcon,
  BuildingLibraryIcon,
  UsersIcon,
  UserGroupIcon,
  MapIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  {
    section: "Overview",
    items: [{ label: "Dashboard", path: "/system/dashboard", icon: HomeIcon }],
  },
  {
    section: "Management",
    items: [
      { label: "Schools", path: "/system/schools", icon: BuildingLibraryIcon },
      { label: "Users", path: "/system/users", icon: UsersIcon },
      {
        label: "Administrators",
        path: "/system/administrators",
        icon: UserGroupIcon,
      },
      { label: "Regions", path: "/system/regions", icon: MapIcon },
    ],
  },
  {
    section: "System",
    items: [
      {
        label: "Audit Logs",
        path: "/system/audit-logs",
        icon: ClipboardDocumentListIcon,
      },
      { label: "Settings", path: "/system/settings", icon: Cog6ToothIcon },
    ],
  },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}) {
  const { currentUser, logout } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Close theme menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target as Node)
      ) {
        setThemeMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay with blur */}
      <div
        className={`fixed inset-0 z-30 transition-all duration-500 lg:hidden
                    ${
                      mobileOpen
                        ? "opacity-100 visible backdrop-blur-sm bg-black/50"
                        : "opacity-0 invisible backdrop-blur-none bg-black/0"
                    }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
                    fixed inset-y-0 left-0 z-40 flex flex-col
                    transition-all duration-500 ease-in-out
                    // ${collapsed ? "w-18" : "w-64"}
                    ${collapsed ? "w-22" : "w-64"}
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    ${
                      isDark
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-slate-200 text-slate-900"
                    }
                    shadow-2xl
                `}
      >
        {/* Header / Logo */}
        <div
          className={`
                    flex h-16 items-center justify-between px-4 border-b transition-colors duration-300
                    ${isDark ? "border-slate-700" : "border-slate-200"}
                `}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              className={`
                            h-9 w-9 rounded-lg flex items-center justify-center shrink-0 shadow-lg transition-transform duration-300 hover:scale-105
                            ${isDark ? "bg-none" : "bg-none"}
                        `}
            >
              <img
                src="/schoolos2.png"
                alt="SchoolOS"
                className="h-8 w-8 rounded-lg object-cover"
              />
            </div>
            <div
              className={`transition-all duration-500 overflow-hidden whitespace-nowrap
                                ${collapsed ? "opacity-0 w-0 scale-95" : "opacity-100 w-auto scale-100"}
                            `}
            >
              <p className="text-sm font-bold leading-tight tracking-tight">
                SchoolOS
              </p>
              <p
                className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                System Root
              </p>
            </div>
          </div>

          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`
                            hidden lg:flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-300 hover:scale-110
                            ${
                              isDark
                                ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                                : "text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                            }
                        `}
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className={`lg:hidden flex items-center justify-center h-8 w-8 rounded-lg transition-colors
                            ${
                              isDark
                                ? "text-slate-400 hover:bg-slate-800"
                                : "text-slate-400 hover:bg-slate-100"
                            }
                        `}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {navigation.map((group) => (
            <div key={group.section}>
              {!collapsed && (
                <p
                  className={`
                                    px-3 mb-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300
                                    ${isDark ? "text-slate-500" : "text-slate-400"}
                                `}
                >
                  {group.section}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isHovered = hoveredItem === item.path;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/system/dashboard"}
                      onClick={() => setMobileOpen(false)}
                      onMouseEnter={() => setHoveredItem(item.path)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={({ isActive }) =>
                        [
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out",
                          collapsed ? "justify-center" : "",
                          isActive
                            ? isDark
                              ? "bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/10"
                              : "bg-blue-50 text-blue-600 shadow-lg shadow-blue-500/10"
                            : isDark
                              ? "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                          isHovered && !collapsed ? "scale-[1.02]" : "",
                          isHovered && collapsed ? "scale-[1.05]" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div
                            className={`relative flex items-center justify-center transition-transform duration-300 ${
                              collapsed ? "w-full" : ""
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 shrink-0 transition-all duration-300 ${
                                isActive || isHovered ? "scale-110" : ""
                              }`}
                            />

                            {/* Active dot when collapsed */}
                            {collapsed && isActive && (
                              <span className="absolute -right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                            )}
                          </div>

                          <span
                            className={`overflow-hidden whitespace-nowrap transition-all duration-500 ${
                              collapsed
                                ? "w-0 -translate-x-4 opacity-0"
                                : "w-auto translate-x-0 opacity-100"
                            }`}
                          >
                            {item.label}
                          </span>

                          {/* Active bar when expanded */}
                          {!collapsed && isActive && (
                            <span className="absolute left-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                          )}

                          {/* Tooltip when collapsed */}
                          {collapsed && (
                            <span
                              className={`absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                                isHovered
                                  ? "translate-x-0 opacity-100"
                                  : "pointer-events-none -translate-x-2 opacity-0"
                              } ${
                                isDark
                                  ? "border-slate-700 bg-slate-800 text-white shadow-xl shadow-black/30"
                                  : "border-slate-200 bg-white text-slate-900 shadow-xl shadow-black/10"
                              }`}
                            >
                              {item.label}
                              <span
                                className={`absolute top-1/2 -left-1.5 h-2 w-2 -translate-y-1/2 rotate-45 border-b border-l ${
                                  isDark
                                    ? "border-slate-700 bg-slate-800"
                                    : "border-slate-200 bg-white"
                                }`}
                              />
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section: User info + Theme toggle + Logout */}
        <div
          className={`
                    border-t p-3 space-y-2 transition-colors duration-300
                    ${isDark ? "border-slate-700" : "border-slate-200"}
                `}
        >
          {/* User Info */}
          <div
            className={`
                            flex items-center gap-3 rounded-xl p-2 transition-all duration-300
                            ${collapsed ? "justify-center" : ""}
                            ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}
                            cursor-pointer group
                        `}
            onClick={() => setCollapsed(false)}
          >
            <div
              className={`
                            flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold shrink-0
                            transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg
                            ${isDark ? "bg-none text-white" : "bg-blue-600 text-white"}
                        `}
            >
              {currentUser?.profile_picture ? (
                <img
                  src={currentUser.profile_picture}
                  alt={currentUser.first_name || "User"}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                currentUser?.first_name?.charAt(0)?.toUpperCase() || "S"
              )}
            </div>

            <div
              className={`
                                min-w-0 transition-all duration-500 overflow-hidden
                                ${collapsed ? "opacity-0 w-0 scale-95" : "opacity-100 w-auto scale-100"}
                            `}
            >
              <p className="truncate text-sm font-semibold">
                {currentUser?.first_name || "System"}
              </p>
              <p
                className={`truncate text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                {currentUser?.login_id || "SYSTEM"}
              </p>
            </div>
          </div>

          {/* Theme Toggle - Only show when expanded */}
          {!collapsed && (
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className={`
                        flex items-center gap-3 w-full rounded-xl px-3 py-2 text-sm transition-all duration-300
                        ${
                          isDark
                            ? "text-slate-300 hover:bg-slate-800"
                            : "text-slate-600 hover:bg-slate-100"
                        }
                    `}
              >
                {isDark ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                )}
                <span>Theme</span>
                <span className="ml-auto text-xs opacity-50">
                  {theme === "dark"
                    ? "Dark"
                    : theme === "light"
                      ? "Light"
                      : "System"}
                </span>
              </button>

              {themeMenuOpen && (
                <div
                  className={`
                              absolute bottom-full left-0 mb-1 w-full rounded-xl border shadow-2xl py-1 overflow-hidden
                              ${
                                isDark
                                  ? "bg-slate-800 border-slate-700 shadow-black/50"
                                  : "bg-white border-slate-200 shadow-slate-200/50"
                              }
                          `}
                >
                  {[
                    { value: "light", icon: SunIcon, label: "Light" },
                    { value: "dark", icon: MoonIcon, label: "Dark" },
                    {
                      value: "system",
                      icon: ComputerDesktopIcon,
                      label: "System",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setTheme(option.value as "light" | "dark" | "system");
                        setThemeMenuOpen(false);
                      }}
                      className={`
                                  flex items-center gap-3 w-full px-3 py-2 text-sm transition-colors duration-200
                                  ${
                                    theme === option.value
                                      ? isDark
                                        ? "bg-blue-600/20 text-blue-400"
                                        : "bg-blue-50 text-blue-600"
                                      : isDark
                                        ? "text-slate-300 hover:bg-slate-700"
                                        : "text-slate-600 hover:bg-slate-50"
                                  }
                              `}
                    >
                      <option.icon className="h-4 w-4" />
                      {option.label}
                      {theme === option.value && (
                        <span className="ml-auto text-blue-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
                            flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium
                            transition-all duration-300
                            ${collapsed ? "justify-center" : ""}
                            ${
                              isDark
                                ? "text-red-400 hover:bg-red-950/50 hover:text-red-300"
                                : "text-red-600 hover:bg-red-50 hover:text-red-700"
                            }
                            group
                        `}
          >
            <ArrowRightOnRectangleIcon
              className={`
                            h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-x-1
                        `}
            />
            <span
              className={`
                                transition-all duration-500 overflow-hidden whitespace-nowrap
                                ${collapsed ? "opacity-0 w-0 -translate-x-4" : "opacity-100 w-auto translate-x-0"}
                            `}
            >
              Sign out
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile open button - FAB */}
      <button
        onClick={() => setMobileOpen(true)}
        className={`
                    fixed bottom-6 left-6 z-50
                    flex h-14 w-14 items-center justify-center
                    rounded-full shadow-2xl
                    transition-all duration-300 hover:scale-110 hover:shadow-2xl
                    lg:hidden
                    ${
                      isDark
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }
                `}
        aria-label="Open menu"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
    </>
  );
}
