import { NextRequest } from "next/server";
import { prisma } from "@/utils/prisma";
import { responseFormat } from "@/utils/api";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();
        

        const assignments = await prisma.userEvent.findMany({
            where: {
                userId: id,
                is_deleted: false,
            },
            select: {
                event: {
                    select: {
                        event_name: true,
                        event_id:true,
                    },
                },
                assignedAt: true,
                updated_by: true,
                id:true,
            },
        });
        return responseFormat(200, "Daftar penugasan berhasil dimuat.", assignments);
    } catch (error) {
        console.error("Error fetching assignments:", error);
        return responseFormat(500, "Failed to retrieve assignments", null);
    }
}

