import { encryptAES } from "@/lib/aes";
import { responseFormat } from "@/utils/api";
import redisClient from "@/utils/redis";

export async function POST(req: Request) {
    const { token } = await req.json();

    try {
        const registerToken = await redisClient.get(`registerToken:${await encryptAES(token)}`)

        if (!registerToken) {
            return responseFormat(400, "Token yang dimasukkan tidak valid", null);
        }

        return responseFormat(200, "Token yang anda masukkan valid", token)
    } catch {
        return responseFormat(500, "Terjadi kesalahan saat mengambil data token, silahkan coba lagi beberapa saat", null);
    }
}