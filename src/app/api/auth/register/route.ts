import { encryptAES } from "@/lib/aes";
import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";

export async function POST(req:Request) {
    const reqBody = await req.json();
    const { email, password, name, phone_number, role, ...userData } = reqBody

    if (!email || !password || !name || !phone_number || !role) {
        return responseFormat(400, "Semua field wajib diisi", null);
    }

    const checkuser = await prisma.user.findFirst({
        where: {
            email: reqBody.email
        }
    })

    if (checkuser) {
        return responseFormat(400, "Alamat email sudah digunakan, lakukan login", null);
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
            }
        });
        
        if (!newUser) {
            return responseFormat(400, "Terjadi kesalahan saat menyimpan data pengguna", null);
        }
        newUser.password = "[PASSWORD IS HIDDEN]"
        return responseFormat(201, "Pengguna berhasil dibuat", newUser);
    } catch (error) {
        return responseFormat(500, "Terjadi kesalahan internal", error instanceof Error ? error.message : String(error));   
    }
}