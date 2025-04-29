import { RoleEnum } from "@/models/enums"

export interface PermissionAccess {
    path: string;
    methods: {
        [method: string]: RoleEnum[];
    };
}

export const ALL = [RoleEnum.Enum.ADMIN, RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.INTERNAL, RoleEnum.Enum.FREELANCE]
export const ADMIN = [RoleEnum.Enum.ADMIN]
export const EXECUTIVE = [RoleEnum.Enum.EXECUTIVE]
export const INTERNAL = [RoleEnum.Enum.INTERNAL]
export const FREELANCE = [RoleEnum.Enum.FREELANCE]
export const ADMINEXECUTIVE = [RoleEnum.Enum.ADMIN, RoleEnum.Enum.EXECUTIVE]
export const ADMININTERNAL = [RoleEnum.Enum.ADMIN, RoleEnum.Enum.INTERNAL]
export const ADMINFREELANCE = [RoleEnum.Enum.ADMIN, RoleEnum.Enum.FREELANCE]
export const EXECUTIVEINTERNAL = [RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.INTERNAL]
export const EXECUTIVEFREELANCE = [RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.FREELANCE]
export const INTERNALFREELANCE = [RoleEnum.Enum.INTERNAL, RoleEnum.Enum.FREELANCE]
export const ADMINEXECUTIVEINTERNAL = [RoleEnum.Enum.ADMIN, RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.INTERNAL]
export const ADMINEXECUTIVEFREELANCE = [RoleEnum.Enum.ADMIN, RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.FREELANCE]
export const EXECUTIVEINTERNALFREELANCE = [RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.INTERNAL, RoleEnum.Enum.FREELANCE]

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