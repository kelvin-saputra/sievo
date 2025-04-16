import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";
/**
 * ✅ GET Contact Detail
 */
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop(); 

        const contactItem = await prisma.contact.findUnique({
            where: { contact_id: id },
            include: {
                client: true,
                vendor: true
            }
        });

        if (!contactItem) {
            return responseFormat(404, "[NOT FOUND] Item not found", null);
        }

        let role = "none";
        if (contactItem.client) role = "client";
        if (contactItem.vendor) role = "vendor";

        const contactWithRole = {
            ...contactItem,
            role
        };

        return responseFormat(200, "[FOUND] Item successfully retrieved!", contactWithRole);
    } catch (error) {
        console.error("Error fetching contact item:", error);
        return responseFormat(500, "Failed to retrieve contact item", null);
    }
}