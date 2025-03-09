import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";

/**
 * ✅ GET Inventory Item by ID
 */
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop(); 

        const inventoryItem = await prisma.inventory.findUnique({
            where: { inventory_id: id },
        });

        if (!inventoryItem) {
            return responseFormat(404, "[NOT FOUND] Item not found", null);
        }

        return responseFormat(200, "[FOUND] Item successfully retrieved!", inventoryItem);
    } catch (error) {
        console.error("Error fetching inventory item:", error);
        return responseFormat(500, "Failed to retrieve inventory item", null);
    }
}