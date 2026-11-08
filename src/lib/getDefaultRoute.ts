import type { User } from "../api/users";

export function getDefaultRoute(user: User): string {
    const anyUser = user as User & { is_superuser?: boolean };

    if (anyUser.is_superuser) {
        return "/system/dashboard";
    }

    const roles = user.roles ?? [];
    const active = roles.filter((r) => r.is_active !== false);
    const primary =
        active.find((r) => r.is_primary_role)?.role_name ||
        active[0]?.role_name ||
        "";

    const name = primary.toLowerCase().trim();

    if (
        name === "system root" ||
        name === "platform admin" ||
        name === "super admin" ||
        name.includes("system root")
    ) {
        return "/system/dashboard";
    }

    if (name.includes("regional") || name.includes("county admin")) {
        return "/regional/dashboard";
    }

    if (name.includes("principal") || name.includes("deputy")) {
        return "/school/dashboard";
    }

    if (name.includes("teacher")) {
        return "/teacher/dashboard";
    }

    if (name.includes("parent") || name.includes("guardian")) {
        return "/parent/dashboard";
    }

    for (const r of active) {
        const n = (r.role_name || "").toLowerCase();
        if (n.includes("system root") || n.includes("platform admin")) {
        return "/system/dashboard";
        }
        if (n.includes("regional") || n.includes("county admin")) {
        return "/regional/dashboard";
        }
    }

    return "/login";
}
