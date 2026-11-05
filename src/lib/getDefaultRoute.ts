import type { User } from "../api/users";

    /**
     * Decide where the user should land after login.
     * This will expand as you add more portals (Regional, School, Teacher, Parent...).
     */
    export function getDefaultRoute(user: User): string {
    // 1. System Root / Superuser
    if (user.is_superuser) {
        return "/system/dashboard";
    }

    // 2. Check primary role
    const primaryRole = user.roles?.find((r) => r.is_primary_role)?.role_name;

    if (primaryRole) {
        const role = primaryRole.toLowerCase();

        if (role.includes("regional")) {
        return "/regional/dashboard";
        }

        if (role.includes("principal") || role.includes("deputy")) {
        return "/school/dashboard";
        }

        if (role.includes("teacher")) {
        return "/teacher/dashboard";
        }

        if (role.includes("parent") || role.includes("guardian")) {
        return "/parent/dashboard";
        }
    }

    // Fallback
    return "/";
}


