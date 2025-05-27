import { encryptAES } from "@/lib/aes";
import { responseFormat } from "@/utils/api";
import redisClient from "@/utils/redis";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { token } = await req.json();

    try {
        const registerToken = await redisClient.get(`registerToken:${await encryptAES(token)}`)

        if (!registerToken) {
            return responseFormat(400, "Invalid token", null);
        }

        return responseFormat(200, "Valid token", token)
    } catch {
        return responseFormat(500, "An error occurred while retrieving token data, please try again later", null);
    }
}