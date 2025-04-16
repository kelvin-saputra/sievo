import { prisma } from "@/utils/prisma";
import { responseFormat } from "@/utils/api";

export async function GET() {
    try {
        const vendorServices = await prisma.vendorService.findMany({
            where: { is_deleted: false },
        });
        return responseFormat(200, "Berhasil mengambil layanan vendor pada database", vendorServices);
    } catch {
        return responseFormat(500, "Terjadi kesalahan saat mengambil layanan vendor", null);
    }
}