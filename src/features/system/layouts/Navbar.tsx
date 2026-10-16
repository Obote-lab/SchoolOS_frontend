// src/features/system/layouts/Navbar.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import {
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  ClockIcon,
  PlusCircleIcon,
  QuestionMarkCircleIcon,
  // DocumentTextIcon,
  // LifebuoyIcon,
  // ChevronLeftIcon,
  // ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Mock notification type
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

export default function Navbar({ collapsed }: { collapsed: boolean }) {
  const { currentUser, logout } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [themeOpen, setThemeOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New School Registered",
      message: "Nairobi Academy has been registered successfully",
      time: "2 minutes ago",
      read: false,
      type: "success",
    },
    {
      id: "2",
      title: "System Update",
      message: "Version 2.1.0 has been deployed successfully",
      time: "1 hour ago",
      read: false,
      type: "info",
    },
    {
      id: "3",
      title: "Security Alert",
      message: "Multiple failed login attempts detected from IP 192.168.1.1",
      time: "3 hours ago",
      read: true,
      type: "warning",
    },
    {
      id: "4",
      title: "User Report Ready",
      message: "Monthly user activity report is ready for download",
      time: "5 hours ago",
      read: true,
      type: "info",
    },
  ]);

  const themeRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        themeRef.current &&
        !themeRef.current.contains(event.target as Node)
      ) {
        setThemeOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Escape to close search
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or handle search
      console.log("Searching for:", searchQuery);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400";
      case "warning":
        return "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
      case "error":
        return "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      default:
        return "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
    }
  };

  return (
    <header
      className={`
        sticky top-0 z-30 flex h-16 items-center justify-between
        border-b transition-all duration-500 ease-in-out
        px-4 sm:px-6
        ${
          isDark
            ? "bg-slate-900/95 backdrop-blur-lg border-slate-700"
            : "bg-white/95 backdrop-blur-lg border-slate-200"
        }
        ${collapsed ? "lg:pl-20" : "lg:pl-64"}
      `}
    >
      {/* Left side - Breadcrumb or Title */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle button (visible when sidebar is collapsed on mobile) */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={() => {
            const sidebar = document.querySelector("aside");
            if (sidebar) {
              sidebar.classList.toggle("translate-x-0");
            }
          }}
        >
          <svg
            className="h-5 w-5 text-slate-600 dark:text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="hidden sm:block">
          <h1
            className={`text-sm font-semibold transition-colors duration-300 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            System Administration
          </h1>
          <p
            className={`text-xs transition-colors duration-300 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Manage the SchoolOS platform
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Search */}
        <div className="relative" ref={searchRef}>
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className={`
              rounded-lg p-2 transition-all duration-300
              ${
                isDark
                  ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }
              relative
            `}
            aria-label="Search"
            title="Search (Ctrl+K)"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            <kbd className="hidden sm:inline-block ml-1 text-[10px] font-mono opacity-50">
              ⌘K
            </kbd>
          </button>

          {/* Search Modal */}
          {searchOpen && (
            <div
              className={`
              absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border shadow-2xl overflow-hidden
              transition-all duration-300 animate-in fade-in slide-in-from-top-2
              ${
                isDark
                  ? "bg-slate-800 border-slate-700 shadow-black/50"
                  : "bg-white border-slate-200 shadow-slate-200/50"
              }
            `}
            >
              <form onSubmit={handleSearch} className="flex items-center p-2">
                <MagnifyingGlassIcon
                  className={`h-5 w-5 ml-2 ${isDark ? "text-slate-400" : "text-slate-400"}`}
                />
                <input
                  type="text"
                  placeholder="Search schools, users, settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`
                    flex-1 px-3 py-2 text-sm outline-none bg-transparent
                    ${isDark ? "text-white placeholder:text-slate-400" : "text-slate-900 placeholder:text-slate-400"}
                  `}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className={`p-1 rounded-lg transition-colors ${
                    isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
                  }`}
                >
                  <XMarkIcon className="h-4 w-4 text-slate-400" />
                </button>
              </form>
              <div
                className={`
                px-4 py-2 text-xs border-t
                ${isDark ? "border-slate-700 text-slate-400" : "border-slate-100 text-slate-500"}
              `}
              >
                <span>Quick actions: </span>
                <kbd
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    isDark ? "bg-slate-700" : "bg-slate-100"
                  }`}
                >
                  ↵
                </kbd>
                <span className="ml-2">to search</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Add */}
        <button
          type="button"
          className={`
            hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium
            transition-all duration-300 hover:scale-105
            bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25
          `}
          title="Quick Add"
        >
          <PlusCircleIcon className="h-4 w-4" />
          <span>Add</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`
              rounded-lg p-2 transition-all duration-300 relative
              ${
                isDark
                  ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }
              ${notificationsOpen ? (isDark ? "bg-slate-800" : "bg-slate-100") : ""}
            `}
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg shadow-red-500/50 animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div
              className={`
              absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border shadow-2xl overflow-hidden
              transition-all duration-300 animate-in fade-in slide-in-from-top-2
              ${
                isDark
                  ? "bg-slate-800 border-slate-700 shadow-black/50"
                  : "bg-white border-slate-200 shadow-slate-200/50"
              }
            `}
            >
              <div
                className={`
                flex items-center justify-between px-4 py-3 border-b
                ${isDark ? "border-slate-700" : "border-slate-100"}
              `}
              >
                <h3
                  className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className={`text-xs font-medium transition-colors ${
                        isDark
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-700"
                      }`}
                    >
                      Mark all read
                    </button>
                  )}
                  <span
                    className={`text-xs ${isDark ? "text-slate-400" : "text-slate-400"}`}
                  >
                    {unreadCount} unread
                  </span>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`
                        px-4 py-3 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50
                        ${!notification.read ? (isDark ? "bg-slate-700/30" : "bg-blue-50/50") : ""}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-1.5 rounded-lg ${getNotificationColor(notification.type)}`}
                        >
                          {notification.type === "success" && (
                            <ShieldCheckIcon className="h-4 w-4" />
                          )}
                          {notification.type === "warning" && (
                            <ClockIcon className="h-4 w-4" />
                          )}
                          {notification.type === "info" && (
                            <BellIcon className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}
                          >
                            {notification.title}
                          </p>
                          <p
                            className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                          >
                            {notification.message}
                          </p>
                          <p
                            className={`text-[10px] mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                          >
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1"></span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <BellIcon className="h-8 w-8 mx-auto opacity-30" />
                    <p
                      className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      No notifications
                    </p>
                  </div>
                )}
              </div>

              <div
                className={`
                px-4 py-2 text-center border-t
                ${isDark ? "border-slate-700" : "border-slate-100"}
              `}
              >
                <Link
                  to="/system/audit-logs"
                  className={`text-xs font-medium transition-colors ${
                    isDark
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                  onClick={() => setNotificationsOpen(false)}
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="relative" ref={themeRef}>
          <button
            type="button"
            onClick={() => setThemeOpen(!themeOpen)}
            className={`
              rounded-lg p-2 transition-all duration-300
              ${
                isDark
                  ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }
              ${themeOpen ? (isDark ? "bg-slate-800" : "bg-slate-100") : ""}
            `}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
          </button>

          {themeOpen && (
            <div
              className={`
              absolute right-0 mt-2 w-44 rounded-xl border shadow-2xl py-1 overflow-hidden
              transition-all duration-300 animate-in fade-in slide-in-from-top-2
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
                { value: "system", icon: ComputerDesktopIcon, label: "System" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setTheme(option.value as "light" | "dark" | "system");
                    setThemeOpen(false);
                  }}
                  className={`
                    flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors duration-200
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
                  <span className="flex-1 text-left">{option.label}</span>
                  {theme === option.value && (
                    <span className="text-blue-500">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`
              flex items-center gap-2 rounded-lg p-1.5 transition-all duration-300
              ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}
              ${userMenuOpen ? (isDark ? "bg-slate-800" : "bg-slate-100") : ""}
              group
            `}
          >
            {currentUser?.profile_picture ? (
              <img
                src={currentUser.profile_picture}
                alt={currentUser.first_name || "User"}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-500 transition-all duration-300"
              />
            ) : (
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold ring-2 ring-transparent group-hover:ring-blue-500 transition-all duration-300">
                {currentUser?.first_name?.charAt(0) || "S"}
              </div>
            )}

            <div className="hidden sm:block text-left">
              <p
                className={`text-sm font-medium transition-colors duration-300 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {currentUser?.first_name || "System Admin"}
              </p>
              <p
                className={`text-xs transition-colors duration-300 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {currentUser?.login_id || "SYSTEM"}
              </p>
            </div>

            <ChevronDownIcon
              className={`h-4 w-4 hidden sm:block transition-transform duration-300 ${
                userMenuOpen ? "rotate-180" : ""
              } ${isDark ? "text-slate-400" : "text-slate-400"}`}
            />
          </button>

          {userMenuOpen && (
            <div
              className={`
              absolute right-0 mt-2 w-56 rounded-xl border shadow-2xl py-1 overflow-hidden
              transition-all duration-300 animate-in fade-in slide-in-from-top-2
              ${
                isDark
                  ? "bg-slate-800 border-slate-700 shadow-black/50"
                  : "bg-white border-slate-200 shadow-slate-200/50"
              }
            `}
            >
              {/* User Info Header */}
              <div
                className={`
                px-4 py-3 border-b
                ${isDark ? "border-slate-700" : "border-slate-100"}
              `}
              >
                <div className="flex items-center gap-3">
                  {currentUser?.profile_picture ? (
                    <img
                      src={currentUser.profile_picture}
                      alt={currentUser.first_name || "User"}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
                      {currentUser?.first_name?.charAt(0) || "S"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      {currentUser?.full_name || "System Administrator"}
                    </p>
                    <p
                      className={`text-xs truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {currentUser?.email || currentUser?.login_id}
                    </p>
                  </div>
                </div>
                {currentUser?.is_superuser && (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:text-purple-400">
                    <ShieldCheckIcon className="h-3 w-3" />
                    Super Admin
                  </div>
                )}
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate("/system/profile");
                  }}
                  className={`
                    flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors duration-200
                    ${
                      isDark
                        ? "text-slate-300 hover:bg-slate-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }
                  `}
                >
                  <UserIcon className="h-4 w-4" />
                  My Profile
                </button>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate("/system/settings");
                  }}
                  className={`
                    flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors duration-200
                    ${
                      isDark
                        ? "text-slate-300 hover:bg-slate-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }
                  `}
                >
                  <Cog6ToothIcon className="h-4 w-4" />
                  Settings
                </button>

                <div
                  className={`
                  my-1 border-t
                  ${isDark ? "border-slate-700" : "border-slate-100"}
                `}
                />

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    // Open help/documentation
                    window.open("#", "_blank");
                  }}
                  className={`
                    flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors duration-200
                    ${
                      isDark
                        ? "text-slate-300 hover:bg-slate-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }
                  `}
                >
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                  Help & Documentation
                </button>

                <div
                  className={`
                  my-1 border-t
                  ${isDark ? "border-slate-700" : "border-slate-100"}
                `}
                />

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className={`
                    flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium transition-colors duration-200
                    text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30
                  `}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
