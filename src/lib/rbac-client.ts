import { RoleEnum } from "@/models/enums"
import { getUserDataClient } from "./userData";

export interface PermissionAccess {
    path: string;
    methods: {
        [method: string]: RoleEnum[];
    };
}

export const ALL: RoleEnum[] = [RoleEnum.Enum.ADMIN, RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.INTERNAL, RoleEnum.Enum.FREELANCE]
export const ADMIN:RoleEnum[] = [RoleEnum.Enum.ADMIN]
export const EXECUTIVE:RoleEnum[] = [RoleEnum.Enum.EXECUTIVE]
export const INTERNAL:RoleEnum[] = [RoleEnum.Enum.INTERNAL]
export const FREELANCE:RoleEnum[] = [RoleEnum.Enum.FREELANCE]
export const ADMINEXECUTIVE:RoleEnum[] = [RoleEnum.Enum.ADMIN, RoleEnum.Enum.EXECUTIVE]
export const ADMININTERNAL:RoleEnum[] = [RoleEnum.Enum.ADMIN, RoleEnum.Enum.INTERNAL]
export const ADMINFREELANCE:RoleEnum[] = [RoleEnum.Enum.ADMIN, RoleEnum.Enum.FREELANCE]
export const EXECUTIVEINTERNAL:RoleEnum[] = [RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.INTERNAL]
export const EXECUTIVEFREELANCE:RoleEnum[] = [RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.FREELANCE]
export const INTERNALFREELANCE:RoleEnum[] = [RoleEnum.Enum.INTERNAL, RoleEnum.Enum.FREELANCE]
export const ADMINEXECUTIVEINTERNAL:RoleEnum[] = [RoleEnum.Enum.ADMIN, RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.INTERNAL]
export const ADMINEXECUTIVEFREELANCE:RoleEnum[] = [RoleEnum.Enum.ADMIN, RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.FREELANCE]
export const EXECUTIVEINTERNALFREELANCE:RoleEnum[] = [RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.INTERNAL, RoleEnum.Enum.FREELANCE]

export function checkRoleClient(acceptedRole:RoleEnum[]) {
    try {
        return acceptedRole.includes(RoleEnum.parse(getUserDataClient().role));
    } catch {
        return false
    }
}

export const permission: PermissionAccess[] = [
    {
        path: '/human-resources',
        methods: {
            GET: ADMINEXECUTIVE
        }
    },
    {
        path: '/user-management',
        methods: {
            GET: ADMINEXECUTIVE
        }
    },
    {
        path: '/dashboard',
        methods: {
            GET: ADMINEXECUTIVE
        }
    },
    {
        path: '/proposal',
        methods: {
            GET: ADMINEXECUTIVEINTERNAL
        }
    },
]