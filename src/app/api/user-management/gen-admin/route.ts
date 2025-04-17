import { encryptAES } from "@/lib/aes";
import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";

export async function POST(req: Request) {
    const reqBody = await req.json();

    const { email, password, name, phone_number, role, is_admin, ...userData } = reqBody

    if (!email || !password || !name || !phone_number || !role ) {
        return responseFormat(400, "Semua field wajib diisi", null);
    }

    const checkUser = await prisma.user.findFirst ({
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
                password: encryptAES(password),
                phone_number: encryptAES(phone_number),
                role: role,
                name: name,
                is_admin: true,
            }
        })

        if(!newUser) {
            return responseFormat(400, "Terjadi kesalahan saat menyimpan data pengguna", null);
        }

        newUser.password = "[PASSWORD IS HIDDEN]"
        return responseFormat(200, "Pengguna berhasil dibuat", newUser);
    } catch {
        return responseFormat(500, "Terjadi kesalahan saat menyimpan data pengguna", null)
    }
}