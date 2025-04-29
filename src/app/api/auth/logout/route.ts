import { cookies } from "next/headers";
import { verify } from '@/lib/jwt'
import redisClient from "@/utils/redis";
import { encryptAES } from "@/lib/aes";
import { responseFormat } from "@/utils/api";

export async function GET() {
    const cookieStore = await cookies();
    
    try {
        const refreshToken = cookieStore.get('refreshToken')?.value;
        if (!refreshToken) {
            return responseFormat(400, 'Pengguna belum melakukan login, silakan login terlebih dahulu.', null);
        }
        const decodedToken = verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET!)

        await redisClient.del(`refreshToken:${await encryptAES((decodedToken as any).id)}`)

        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");

        return responseFormat(200, "Logged out successfully", null);
    } catch {
        return responseFormat(500, "Internal Server Error", null);
    }
}