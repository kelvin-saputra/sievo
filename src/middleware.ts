export const runtime = 'nodejs'
import { AuthMiddleware } from "@/lib/middleware/auth.middleware";
import { NextRequest} from "next/server";
import { roleMiddleware } from "./lib/middleware/role.middleware";

export async function middleware(req: NextRequest) {
    const authResponse = await AuthMiddleware(req)
    if (authResponse) {
        return authResponse
    }

    const roleResponse = roleMiddleware(req)
    return roleResponse
}

export const config = {
	matcher: [
        '/((?!_next/static|_next/image|favicon\\.ico).*)'
    ]
}