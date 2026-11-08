import type { User } from "../../../api/users";

export function getManagedCounties(user: User | null | undefined): string[] {
    if (!user?.roles?.length) return [];

    const primary =
        user.roles.find((r) => r.is_primary_role && r.is_active !== false) ||
        user.roles.find((r) => r.is_active !== false);

    const fromRole = (role: (typeof user.roles)[0] | undefined): string[] => {
        const meta = role?.metadata as
        | { managed_counties?: unknown }
        | null
        | undefined;
        const raw = meta?.managed_counties;
        if (!Array.isArray(raw)) return [];
        return raw.map((c) => String(c).trim()).filter(Boolean);
    };

    const primaryCounties = fromRole(primary);
    if (primaryCounties.length) return primaryCounties;

    const set = new Set<string>();
    for (const r of user.roles) {
        if (r.is_active === false) continue;
        for (const c of fromRole(r)) set.add(c);
    }
    return Array.from(set);
}
