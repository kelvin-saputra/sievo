import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { ...data } = reqBody;

        const existingItem = await prisma.purchasing.findFirst({
            where: {
                item_name: data.item_name,
                is_deleted: false
            }
        })

        if (existingItem && existingItem?.item_price !== data.item_price) {
            return responseFormat(400, "Purchasing item has added before with different price!", null)
        }

        const purchasingItem = await prisma.purchasing.create({
            data: {
                ...data,
            },
        });
        
        return responseFormat(201, "Berhasil menambahkan item purchasing", purchasingItem);
    } catch(error) {
        console.log(error instanceof Error? error.message:error)
        return responseFormat(500, "Gagal menambahkan item purchasing", null);
    }
}

export async function PUT(req: Request) {
    try {
        const reqBody = await req.json();
        const { other_item_id, ...data } = reqBody;
        if (!other_item_id) {
            return responseFormat(400, "Purchase ID tidak ditemukan", null);
        }

        const existingItem = await prisma.purchasing.findFirst({
            where: {
                other_item_id: other_item_id,
                is_deleted: false,
            }
        })

        if (!existingItem) {
            const purchasingItem = await prisma.purchasing.create({
                data: {
                    ...data,
                },
            });
            return responseFormat(200, "Berhasil mengupdate item purchasing", purchasingItem)
        }

        const purchasingItem = await prisma.purchasing.update({
            where: { other_item_id: other_item_id, is_deleted: false },
            data: { ...data },
        });

        return responseFormat(200, "Berhasil mengupdate item purchasing", purchasingItem);
    } catch {
        return responseFormat(500, "Gagal mengupdate item purchasing", null);
    }
}