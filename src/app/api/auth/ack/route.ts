import { encryptAES } from "@/lib/aes";
import { updateAccessToken } from "@/lib/auth";
import { responseFormat } from "@/utils/api";
import redisClient from "@/utils/redis";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const { id } = await req.json();

    if (!id) {
        return responseFormat(400, "user id is required", null);
    }

    const cookieStore = await cookies();
    const cookie = cookieStore.get('refreshToken')?.value;
    const refreshToken = await redisClient.get(`refreshToken:${encryptAES(id)}`);

    if (!cookie || !refreshToken  || refreshToken !== cookie) {
        return responseFormat(401, "Saat ini sesi anda telah habis, silakan login kembali", null);
    }
    try {
        const cookiesToSet = await updateAccessToken(refreshToken);
        return responseFormat(200, "Sesi anda telah diperbarui", null, cookiesToSet);
    } catch {
        return responseFormat(500, "Gagal memperbarui token", null);
    }

}   