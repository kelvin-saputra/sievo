import { UserSchema } from "@/models/schemas";

/**
 * Get the user's role from localStorage.
 */
export function getUserRoleFromStorage(): string | null {
    try {
        const authUser = localStorage.getItem("authUser");
        if (!authUser) return null;

        const parsedUser = UserSchema.partial().parse(JSON.parse(authUser));
        return parsedUser.role ?? null;
    } catch {
        return null;
    }
}

/**
 * Get the current user's name from localStorage.
 */
export function getCurrentUserName(): string | null {
    try {
        const authUser = localStorage.getItem("authUser");
        if (!authUser) return null;

        const parsedUser = UserSchema.partial().parse(JSON.parse(authUser));
        return parsedUser.name ?? null;
    } catch {
        return null;
    }
}

/**
 * Get the current user's ID from localStorage.
 */
export function getUserIdFromStorage(): string | null {
    try {
        const authUser = localStorage.getItem("authUser");
        if (!authUser) return null;

        const parsedUser = UserSchema.partial().parse(JSON.parse(authUser));
        return parsedUser.id ?? null;
    } catch {
        return null;
    }
}
