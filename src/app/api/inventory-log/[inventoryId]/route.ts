import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";

/**
 * ✅ GET Inventory Log by Inventory ID
 */
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop(); 

        const inventoryLogs = await prisma.inventoryLog.findMany({
            where: {
                inventory_id: id,
            },
            orderBy: {
                updated_at: "desc", 
            },
        });

        if (inventoryLogs.length === 0) {
            return responseFormat(200, "[NOT FOUND] No logs found for this inventory.", []);
        }

        return responseFormat(200, "[FOUND] Inventory logs successfully retrieved!", inventoryLogs);
    } catch (error) {
        console.error("Error fetching inventory logs:", error);
        return responseFormat(500, "Failed to retrieve inventory logs", null);
    }
}
