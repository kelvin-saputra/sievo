import { UserSchema } from "@/models/schemas";

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

export function getCurrentUserName(): string | null {
    try {
        const user = JSON.parse(localStorage.getItem("authUser") || "");
        return user?.name ?? null;
    } catch {
        return null;
    }
}
