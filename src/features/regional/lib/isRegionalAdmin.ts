import type { User } from "../../../api/users";

const REGIONAL_NAMES = new Set([
    "regional admin",
    "regional_admin",
    "county admin",
    "county_admin",
]);

export function isRegionalAdmin(user: User | null | undefined): boolean {
    if (!user?.roles?.length) return false;
    return user.roles.some((r) => {
        if (r.is_active === false) return false;
        const name = (r.role_name || "").trim().toLowerCase();
        return REGIONAL_NAMES.has(name) || name.includes("regional");
    });
}
