import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";
 

/**
 * ✅ POST Add Inventory Item
 */

export async function POST(req: Request) {
    try {
        const dataBody = await req.json();

        const { ...inventoryData } = dataBody;

        const inventoryItem = await prisma.inventory.create({
            data: {
                ...inventoryData,
            }
        });
        if (!inventoryItem){
            return responseFormat(404, "[NOT FOUND] Item is not created", null);
        }
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

        if (items.length === 0) {
            return responseFormat(404, "[NOT FOUND] No item founded", null);
        }
        return responseFormat(200, "[FOUND] All item successfully retrieved!", items);
    } catch (error) {
        console.log(error)
        return responseFormat(500, "Failed to retrieve all inventory item", null);
    }
}

