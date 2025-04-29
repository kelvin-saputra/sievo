import { RoleEnum } from "@/models/enums"
import { NextRequest } from "next/server";
import { verify } from "./jwt";

export const roleAccess = {
    "ALL": [RoleEnum.Enum.ADMIN, RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.INTERNAL, RoleEnum.Enum.FREELANCE],
    "ADMIN": [RoleEnum.Enum.ADMIN],
    "EXECUTIVE": [RoleEnum.Enum.EXECUTIVE],
    "INTERNAL": [RoleEnum.Enum.INTERNAL],
    "FREELANCE": [RoleEnum.Enum.FREELANCE],
    "ADMINEXECUTIVE": [RoleEnum.Enum.ADMIN, RoleEnum.Enum.EXECUTIVE],
    "ADMININTERNAL": [RoleEnum.Enum.ADMIN, RoleEnum.Enum.INTERNAL],
    "ADMINFREELANCE": [RoleEnum.Enum.ADMIN, RoleEnum.Enum.FREELANCE],
    "EXECUTIVEINTERNAL": [RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.INTERNAL],
    "EXECUTIVEFREELANCE": [RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.FREELANCE],
    "INTERNALFREELANCE": [RoleEnum.Enum.INTERNAL, RoleEnum.Enum.FREELANCE],
    "ADMINEXECUTIVEINTERNAL": [RoleEnum.Enum.ADMIN, RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.INTERNAL],
    "ADMINEXECUTIVEFREELANCE": [RoleEnum.Enum.ADMIN, RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.FREELANCE],
    "EXECUTIVEINTERNALFREELANCE": [RoleEnum.Enum.EXECUTIVE, RoleEnum.Enum.INTERNAL, RoleEnum.Enum.FREELANCE]
}

export async function checkRole(listAccess: string[], req: NextRequest) {
    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
        return false;
    }
    const decodedToken = await verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET!)
    const role = (decodedToken as any).role || "";
    if (listAccess.includes(role)) {
        return true;
    }
    return false;
}