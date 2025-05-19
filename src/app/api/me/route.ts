import { NextRequest } from "next/server";
import { prisma } from "@/utils/prisma";
import { responseFormat } from "@/utils/api";
import { decryptAES, encryptAES } from "@/lib/aes";
import { getUserDataServer } from "@/lib/userData";


export async function GET(req: NextRequest) {
    const userData = await getUserDataServer(req);
    if (!userData) {
        return responseFormat(401, "User unauthorized!", null)
    }
    const userID = userData.id;
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userID,
                is_active: true
            }
        });

        if (!user) {
            return responseFormat(404, "Pengguna tidak ditemukan", null);
        }

        user.password = "[PASSWORD IS HIDDEN]";
        user.phone_number = await decryptAES(user.phone_number);

        return responseFormat(200, "Berhasil mengambil data pengguna", user);
    } catch {
        return responseFormat(500, "Gagal mengambil data pengguna, coba lagi nanti", null);
    }
}

export async function POST(req: NextRequest) {
    const userData = await getUserDataServer(req);
    if (!userData) {
        return responseFormat(401, "User unauthorized!", null)
    }
    const userID = userData.id;
    const { name, email, phone_number } = await req.json();
    try {
        const user = await prisma.user.update({
            where: {
                id: userID,
            },
            data: {
                name,
                email,
                phone_number: await encryptAES(phone_number),
            }
        });

        if (!user) {
            return responseFormat(404, "Pengguna tidak ditemukan", null);
        }

        user.password = "[PASSWORD IS HIDDEN]";
        user.phone_number = await decryptAES(user.phone_number);

        return responseFormat(200, "Berhasil memperbaharui data pengguna", user);
    } catch {
        return responseFormat(500, "Gagal memperbaharui data pengguna, coba lagi nanti", null);
    }
}