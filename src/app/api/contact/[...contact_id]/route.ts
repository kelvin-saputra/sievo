import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";
import { NextRequest } from "next/server";
import { checkRole, roleAccess } from "@/lib/rbac-api";

/**
 * Helper function to fetch user email information
 */
async function getUserEmailInfo(userId: string | null) {
  if (!userId) return null;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    });
    return user;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

/**
 * ✅ GET Contact Detail
 * No restriction - all users can view contact details
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    
    if (!id) {
      return responseFormat(400, "[BAD REQUEST] Contact ID is required", null);
    }

    const contactItem = await prisma.contact.findUnique({
      where: { contact_id: id },
      include: {
        client: true,
        vendor: true
      }
    });
    
    if (!contactItem) {
      return responseFormat(404, "[NOT FOUND] Contact not found", null);
    }
    
    // Determine role based on relationships
    let role = "none";
    if (contactItem.client) role = "client";
    if (contactItem.vendor) role = "vendor";
    
    // Fetch user metadata for created_by and updated_by
    const createdByUser = await getUserEmailInfo(contactItem.created_by);
    const updatedByUser = contactItem.updated_by ? await getUserEmailInfo(contactItem.updated_by) : null;
    
    const contactWithMetadata = {
      ...contactItem,
      role,
      created_by_email: createdByUser?.email || null,
      created_by_name: createdByUser?.name || null,
      updated_by_email: updatedByUser?.email || null,
      updated_by_name: updatedByUser?.name || null
    };
    
    return responseFormat(200, "[FOUND] Contact successfully retrieved!", contactWithMetadata);
  } catch (error) {
    console.error("Error fetching contact:", error);
    return responseFormat(500, "Failed to retrieve contact", null);
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
    
    if (!id) {
      return responseFormat(400, "[BAD REQUEST] Contact ID is required", null);
    }

    const data = await req.json();
    
    // Validate if contact exists
    const existingContact = await prisma.contact.findUnique({
      where: { contact_id: id }
    });
    
    if (!existingContact) {
      return responseFormat(404, "[NOT FOUND] Contact not found", null);
    }
    
    // Extract contact data and metadata
    const { name, email, phone_number, description, updated_by, metadata } = data;
    
    // Update contact data
    const updatedContact = await prisma.contact.update({
      where: { contact_id: id },
      data: {
        name,
        email,
        phone_number,
        description,
        updated_by,
        updated_at: new Date(),
        // Store metadata as JSON if provided
        ...(metadata && { metadata: JSON.stringify(metadata) })
      }
    });
    
    // Fetch updater user info if available
    const updaterInfo = updated_by ? await getUserEmailInfo(updated_by) : null;
    
    const responseData = {
      ...updatedContact,
      updated_by_email: updaterInfo?.email || metadata?.updater_email || null,
      updated_by_name: updaterInfo?.name || null
    };
    
    return responseFormat(200, "[UPDATED] Contact successfully updated!", responseData);
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
    
    if (!id) {
      return responseFormat(400, "[BAD REQUEST] Contact ID is required", null);
    }
    
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

/**
 * ✅ UPDATE Contact Role
 * Restricted to ADMIN, EXECUTIVE roles
 */
export async function PATCH(req: NextRequest) {
    try {
      // Check user role - only ADMIN and EXECUTIVE can update contact roles
      if (!(await checkRole(roleAccess.ADMINEXECUTIVE, req))) {
        return responseFormat(403, "Anda tidak memiliki akses terhadap resource ini", null);
      }
  
      const url = new URL(req.url);
      const id = url.pathname.split("/").pop();
      
      if (!id) {
        return responseFormat(400, "[BAD REQUEST] Contact ID is required", null);
      }
  
      const data = await req.json();
      const { role, updated_by } = data;
      
      if (!["none", "client", "vendor"].includes(role)) {
        return responseFormat(400, "[BAD REQUEST] Invalid role. Must be 'none', 'client', or 'vendor'", null);
      }
      
      // Validate if contact exists
      const existingContact = await prisma.contact.findUnique({
        where: { contact_id: id },
        include: {
          client: true,
          vendor: true
        }
      });
      
      if (!existingContact) {
        return responseFormat(404, "[NOT FOUND] Contact not found", null);
      }
      
      // Update role relationships based on the new role
      if (role === "client" && !existingContact.client) {
        // Create client relationship
        await prisma.client.create({
          data: {
            contact: {
              connect: { contact_id: id }
            }
          }
        });
      } else if (role === "vendor" && !existingContact.vendor) {
        // Create vendor relationship with required bankAccountDetail
        await prisma.vendor.create({
          data: {
            bankAccountDetail: "", // Add the required field with an empty string or default value
            contact: {
              connect: { contact_id: id }
            }
          }
        });
      }
      
      // Update the contact with new timestamp
      const updatedContact = await prisma.contact.update({
        where: { contact_id: id },
        data: {
          updated_by,
          updated_at: new Date()
        },
        include: {
          client: true,
          vendor: true
        }
      });
      
      return responseFormat(200, "[UPDATED] Contact role successfully updated!", {
        ...updatedContact,
        role
      });
    } catch (error) {
      console.error("Error updating contact role:", error);
      return responseFormat(500, "Failed to update contact role", null);
    }
  }