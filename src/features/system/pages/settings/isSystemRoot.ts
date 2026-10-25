import type { User } from "../../../../api/users";

export function isSystemRoot(user: User | null | undefined): boolean {
    if (!user?.roles?.length) return false;
    return user.roles.some((r) => r.is_active && r.role_name === "System Root");
}
