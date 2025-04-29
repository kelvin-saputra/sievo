import { encryptAES } from "@/lib/aes";
import { checkRole, roleAccess } from "@/lib/rbac-api";
import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    if (await checkRole(roleAccess.ADMINEXECUTIVE, req)) {
        return responseFormat(403, "Anda tidak memiliki akses terhadap resource ini", null)
    }
    const reqBody = await req.json();

    const { email, password, name, phone_number, role, is_admin, ...userData } = reqBody

    if (!email || !password || !name || !phone_number || !role) {
        return responseFormat(400, "Semua field wajib diisi", null);
    }

    const checkUser = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (checkUser) {
        return responseFormat(400, "Alamat email sudah digunakan, silakan gunakan alamat email lain", null);
    }

    try {
        const newUser = await prisma.user.create({
            data: {
                ...userData,
                email: email,
                password: await encryptAES(password),
                phone_number: await encryptAES(phone_number),
                role: role,
                name: name,
                is_admin: true || is_admin,
            }
        })

        if (!newUser) {
            return responseFormat(400, "Terjadi kesalahan saat menyimpan data pengguna", null);
        }

        newUser.password = "[PASSWORD IS HIDDEN]"
        return responseFormat(200, "Pengguna berhasil dibuat", newUser);
    } catch {
        return responseFormat(500, "Terjadi kesalahan saat menyimpan data pengguna", null)
    }
}