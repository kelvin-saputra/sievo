import { encryptAES } from "@/lib/aes";
import { updateAccessToken } from "@/lib/auth";
import { responseFormat } from "@/utils/api";
import redisClient from "@/utils/redis";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { id } = await req.json();
    const cookieStore = await cookies()
    if (!id) {
        return responseFormat(400, "User ID is required", null);
    }
    const refreshCookie = cookieStore.get("refreshToken")?.value
    const refreshToken = await redisClient.get(`refreshToken:${await encryptAES(id)}`);
    if (!refreshCookie || !refreshToken || refreshToken !== refreshCookie) {
        return responseFormat(401, "Your session has expired, please login again", null);
    }
    try {
        const cookiesToSet = await updateAccessToken(refreshToken);
        return responseFormat(200, "Your session has been refreshed", null, cookiesToSet);
    } catch {
        return responseFormat(500, "Failed to update token", null);
    }
}
