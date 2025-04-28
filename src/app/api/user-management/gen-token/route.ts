import { createRegisterToken } from "@/lib/auth";
import { checkRole, roleAccess } from "@/lib/rbac-api";
import { responseFormat } from "@/utils/api";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role')?.toUpperCase();
    const durationParams = searchParams.get('duration');
    const duration = durationParams !== null ? parseInt(durationParams, 10) : null;
    const availableRole = ["EXECUTIVE", "INTERNAL", "FREELANCE"]

    if (!(await checkRole(roleAccess.ADMINEXECUTIVE, req))) {
        return responseFormat(403, "Anda tidak memiliki akses terhadap resource ini", null)
    }

    if (!role) {
        return responseFormat(400, "Role wajib diisi", null);
    }

    if (!availableRole.includes(role)) {
        return responseFormat(400, "Role tidak tersedia", null);
    }


    if (!duration || duration <= 0) {
        return responseFormat(400, "Durasi yang dimasukkan tidak valid", null);
    }

    try {
        const registerToken = await createRegisterToken(role, duration);
        return responseFormat(201, "Token Registrasi berhasil dibuat", registerToken);
    } catch {
        return responseFormat(500, "Gagal membuat token registrasi", null);
    }
}