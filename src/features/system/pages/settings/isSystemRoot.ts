// src/features/system/pages/settings/isSystemRoot.ts
import type { User } from "../../../../api/users";

/**
 * System Root operators (platform-wide).
 * Prefer explicit role_name; fall back to common superuser signals.
 */
export function isSystemRoot(user: User | null | undefined): boolean {
    if (!user) return false;

    // Explicit platform role
    const roles = user.roles ?? [];
    if (
        roles.some((r) => {
        if (r.is_active === false) return false;
        const name = (r.role_name || "").trim().toLowerCase();
        return (
            name === "system root" ||
            name === "system_root" ||
            name === "systemroot" ||
            name === "super admin" ||
            name === "superadmin"
        );
        })
    ) {
        return true;
    }

    // Runtime flag if API sends it (not always on the TS type)
    const anyUser = user as User & { is_superuser?: boolean };
    if (anyUser.is_superuser === true) return true;

    // Bootstrap system account
    if (user.login_id === "SYSTEM" || user.login_id === "system") return true;

    return false;
    }
