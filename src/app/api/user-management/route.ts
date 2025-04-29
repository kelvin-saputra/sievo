import { encryptAES } from "@/lib/aes";
import { checkRole, roleAccess } from "@/lib/rbac-api";
import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";
import redisClient from "@/utils/redis";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    if (!(await checkRole(roleAccess.ADMINEXECUTIVE, req))) {
        return responseFormat(403, "Anda tidak memiliki akses terhadap resource ini", null)
    }

    try {
        const users = await prisma.user.findMany({

        });

        if (users.length === 0) {
            return responseFormat(404, "Belum ada pengguna yang terdaftar", null);
        }

        return responseFormat(200, "Berhasil mengambil data user", users);
    } catch {
        return responseFormat(500, "Gagal memuat daftar pengguna, coba lagi nanti.", null);
    }
}

export async function DELETE(req: NextRequest) {
    if (!(await checkRole(roleAccess.ADMINEXECUTIVE, req))) {
        return responseFormat(403, "Anda tidak memiliki akses terhadap resource ini", null)
    }

    const { id } = await req.json();

    try {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data: {
                is_active: false,
                ended_at: new Date(),
            }
        });

        await redisClient.del(`refreshToken:${await encryptAES(id)}`)

        if (!user) {
            return responseFormat(404, "Pengguna tidak ditemukan", null);
        }

        return responseFormat(200, "Berhasil menghapus pengguna", user);
    } catch {
        return responseFormat(500, "Gagal menghapus pengguna, coba lagi nanti.", null);
    }
}