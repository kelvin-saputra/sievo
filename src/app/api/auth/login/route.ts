import { prisma } from "@/utils/prisma";
import { responseFormat } from "@/utils/api";

import { encryptAES } from "@/lib/aes";
import { setSession } from "@/lib/auth";

export async function POST(req: Request) {
    const reqBody = await req.json();
    const { email, password } = reqBody;

    if (!email || !password) {
        return responseFormat(400, "Email dan password wajib diisi", null);
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
                password: encryptAES(password),
            }
        });
        if (!user) {
            return responseFormat(404, "Pengguna tidak ditemukan, silakan mendaftar terlebih dahulu", null);
        }
        const cookiesToSet = await setSession(user.id, user.role);
        user.password="[PASSWORD IS HIDDEN]";
        return responseFormat(200, "Login Berhasil", user, cookiesToSet, "/");
    } catch {
        return responseFormat(500, "Terjadi kesalahan saat login, silakan coba lagi", null);
    }
}