import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";

export async function POST(req: Request) {
    try {
        console.log("Masuk ke POST purchase");
        const reqBody = await req.json();
        const { ...data } = reqBody;
        console.log("Data purchase", data);

        const purchasingItem = await prisma.purchasing.create({
            data: {
                ...data,
            },
        });
        
        return responseFormat(201, "Berhasil menambahkan item purchasing", purchasingItem);
    } catch (error) {
        console.log("error POST purchase", error instanceof Error ? error.message : error);
        return responseFormat(500, "Gagal menambahkan item purchasing", null);
    }
}

export async function PUT(req: Request) {
    try {
        console.log("Masuk ke PUT purchase");
        const reqBody = await req.json();
        const { other_item_id, ...data } = reqBody;
        console.log("purchaseId", other_item_id);
        console.log("Data purchase", data);
        console.log(data);
        if (!other_item_id) {
            return responseFormat(400, "Purchase ID tidak ditemukan", null);
        }

        const purchasingItem = await prisma.purchasing.update({
            where: { other_item_id: other_item_id, is_deleted: false },
            data: { ...data },
        });

        return responseFormat(200, "Berhasil mengupdate item purchasing", purchasingItem);
    } catch (error) {
        console.log("error PUT purchase", error instanceof Error ? error.message : error);
        return responseFormat(500, "Gagal mengupdate item purchasing", null);
    }
}