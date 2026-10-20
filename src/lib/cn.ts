/**
 * Tiny className merger — no external deps needed.
 */
export function cn(
    ...classes: Array<string | false | null | undefined>
): string {
    return classes.filter(Boolean).join(" ");
}

