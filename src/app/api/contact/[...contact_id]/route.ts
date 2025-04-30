import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";
import { NextRequest } from "next/server";
import { checkRole, roleAccess } from "@/lib/rbac-api";

/**
 * ✅ GET Contact Detail
 * No restriction - all users can view contact details
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

/**
 * ✅ UPDATE Contact Detail
 * Restricted to ADMIN, EMPLOYEE, EXECUTIVE roles
 */
export async function PUT(req: NextRequest) {
  try {
    // Check user role - only ADMIN, EMPLOYEE, and EXECUTIVE can update contacts
    if (!(await checkRole(roleAccess.ADMINEXECUTIVEINTERNAL, req))) {
      return responseFormat(403, "Anda tidak memiliki akses terhadap resource ini", null);
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const data = await req.json();
    
    // Validate if contact exists
    const existingContact = await prisma.contact.findUnique({
      where: { contact_id: id }
    });
    
    if (!existingContact) {
      return responseFormat(404, "[NOT FOUND] Contact not found", null);
    }
    
    // Just extract what we need without creating unused variables
    const { name, email, phone_number, description, updated_by } = data;
    
    // Update contact data
    const updatedContact = await prisma.contact.update({
      where: { contact_id: id },
      data: {
        name,
        email,
        phone_number,
        description,
        updated_by,
        updated_at: new Date()
      }
    });
    
    return responseFormat(200, "[UPDATED] Contact successfully updated!", updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    return responseFormat(500, "Failed to update contact", null);
  }
}

/**
 * ✅ DELETE Contact
 * Restricted to ADMIN, EXECUTIVE roles
 */
export async function DELETE(req: NextRequest) {
  try {
    // Check user role - only ADMIN and EXECUTIVE can delete contacts
    if (!(await checkRole(roleAccess.ADMINEXECUTIVE, req))) {
      return responseFormat(403, "Anda tidak memiliki akses terhadap resource ini", null);
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    
    // Check if contact exists
    const existingContact = await prisma.contact.findUnique({
      where: { contact_id: id }
    });
    
    if (!existingContact) {
      return responseFormat(404, "[NOT FOUND] Contact not found", null);
    }
    
    // Soft delete the contact
    const deletedContact = await prisma.contact.update({
      where: { contact_id: id },
      data: { 
        is_deleted: true,
        updated_at: new Date()
      }
    });
    
    return responseFormat(200, "[DELETED] Contact successfully deleted!", deletedContact);
  } catch (error) {
    console.error("Error deleting contact:", error);
    return responseFormat(500, "Failed to delete contact", null);
  }
}