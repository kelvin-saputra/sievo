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

/**
 * ✅ Soft DELETE Inventory Item by ID (mark as deleted)
 */
export async function DELETE(req: Request) {
    try {
        console.log("INI REQUEST", req);
        
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop(); 
        console.log("INI IDNYA", id);

        // Check if ID is provided and valid
        if (!id) {
            return responseFormat(400, "Inventory ID is required.", null);
        }

        // Perform the soft delete by setting is_deleted flag to true
        const updatedInventoryItem = await prisma.inventory.update({
            where: { inventory_id: id },
            data: {
                is_deleted: true, // Mark the item as deleted
            },
        });

        // Return response indicating success
        return responseFormat(200, "[SOFT DELETED] Item successfully marked as deleted!", updatedInventoryItem);
    } catch (error) {
        console.error("Error soft deleting inventory item:", error);
        return responseFormat(500, "Failed to soft delete inventory item", null);
    }
}


/* * ✅ PUT Replace Inventory Item by ID
 */
export async function PUT(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();
        
        const dataBody = await req.json();
        const {  ...inventoryData } = dataBody;


        const updatedInventoryItem = await prisma.inventory.update({
            where: { inventory_id: id },
            data: {
                ...inventoryData,
            },
        });

        const updatedBy = updatedInventoryItem.updated_by ?? "system";
        await prisma.inventoryLog.create({
            data: {
                inventory_id: updatedInventoryItem.inventory_id,
                action: "UPDATE",
                updated_by: updatedBy, 
                updated_at: new Date(),
            },
        });

        return responseFormat(200, "[REPLACED] Item successfully replaced!", updatedInventoryItem);
    } catch (error) {
        console.error("Error replacing inventory item:", error);
        return responseFormat(500, "Failed to replace inventory item", null);
    }
}