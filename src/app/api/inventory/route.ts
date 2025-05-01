import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";
import { NextRequest } from "next/server";

/**
 * ✅ POST Add Inventory Item
 */
export async function POST(req: NextRequest) {
    try {
        const dataBody = await req.json();
        const { ...inventoryData } = dataBody;
        const inventoryItem = await prisma.inventory.create({
            data: {
                ...inventoryData,
            }
        });
          
        return responseFormat(201, "[CREATED] Item has been created", inventoryItem);
    } catch (error) {
        console.log(error)
        return responseFormat(500, "Failed to add inventory item", null);
    }
}

/**
 * ✅ GET seluruh inventory item (Hanya jika `is_deleted = false`)
 */
export async function GET() {
    try {
        const items = await prisma.inventory.findMany();
        return responseFormat(200, "[FOUND] All item successfully retrieved!", items);
    } catch (error) {
        console.log(error)
        return responseFormat(500, "Failed to retrieve all inventory item", null);
    }
}
