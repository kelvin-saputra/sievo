import { prisma } from "@/utils/prisma";
import { responseFormat } from "@/utils/api";

/**
 * ✅ GET All Contact
 */
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      where: { is_deleted: false },
      include: {
        client: true,
        vendor: true
      }
    });
    
    if (contacts.length === 0) {
      return responseFormat(404, "[NOT FOUND] No contact found", null);
    }
    
    const transformedContacts = contacts.map((contact: typeof contacts[number]) => {
        let role: "none" | "client" | "vendor" = "none";
        if (contact.client) role = "client";
        if (contact.vendor) role = "vendor";
      
        return {
          ...contact,
          role,
        };
      });
      
    
    return responseFormat(200, "[FOUND] Contacts successfully retrieved", transformedContacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return responseFormat(500, "Failed to retrieve contacts", null);
  }
}

/**
 * ✅ POST Add Contact
 */
export async function POST(req: Request) {
  try {
    const dataBody = await req.json();
    const { role, clientType, vendorType, ...contactData } = dataBody;
    
    const contactItem = await prisma.contact.create({
      data: {
        ...contactData,
      }
    });
    
    if (role === "client") {
      await prisma.client.create({
        data: {
          contact_id: contactItem.contact_id,
          type: clientType || "INDIVIDUAL", 
          is_deleted: false
        }
      });
    } else if (role === "vendor") {
      await prisma.vendor.create({
        data: {
          contact_id: contactItem.contact_id,
          type: vendorType || "OTHERS", 
          bankAccountDetail: "",
          is_deleted: false
        }
      });
    }
    
    const updatedContact = await prisma.contact.findUnique({
      where: { contact_id: contactItem.contact_id },
      include: {
        client: true,
        vendor: true
      }
    });
    
    const contactWithRole = {
      ...updatedContact,
      role: role || "none"
    };
    
    if (!contactWithRole) {
      return responseFormat(404, "[NOT FOUND] Item is not created", null);
    }
    
    return responseFormat(201, "[CREATED] Item has been created", contactWithRole);
  } catch (error) {
    console.error("Error adding contact:", error);
    return responseFormat(500, "Failed to add contact item", null);
  }
}