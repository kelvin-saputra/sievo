import { useState, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import { ContactSchema } from "@/models/schemas";
import { AddContactDTO, UpdateContactDTO } from "@/models/dto";
import { ADMINEXECUTIVE, ALL, checkRoleClient } from "@/lib/rbac-client";

const API_URL = process.env.NEXT_PUBLIC_CONTACT_API_URL!;

export default function useContact() {
  const [contact, setContact] = useState<ContactSchema | null>(null);
  const [contacts, setContacts] = useState<ContactSchema[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllContacts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      const rawContacts = response.data.data;

      if (Array.isArray(rawContacts)) {
        // Store contacts without validation first to avoid schema errors
        const processedContacts = rawContacts.map((c: any) => {
          // Determine role based on client or vendor relationship
          let role: "none" | "client" | "vendor" = "none";
          if (c.client) role = "client";
          if (c.vendor) role = "vendor";

          return {
            ...c,
            is_deleted: c.is_deleted ?? false,
            updated_by: c.updated_by ?? null,
            description: c.description ?? undefined,
            address: c.address ?? "",
            role,
            created_by_email: c.created_by_email,
            updated_by_email: c.updated_by_email
          };
        });
        
        setContacts(processedContacts);
        console.log("Fetched contacts:", processedContacts);
      } else {
        console.warn("Expected an array but received:", rawContacts);
        setContacts([]);
      }
    } catch (error) {
      console.error("An error occurred while retrieving Contact data:", error);
      toast.error("Failed to retrieve Contact data.");
    }
    setLoading(false);
  }, []);

  const fetchContactById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/${id}`);
      const rawContact = data.data;
      
      // Determine role based on client or vendor relationship
      let role: "none" | "client" | "vendor" = "none";
      if (rawContact.client) role = "client";
      if (rawContact.vendor) role = "vendor";

      setContact({
        ...rawContact,
        role,
        created_by_email: rawContact.created_by_email || null,
        updated_by_email: rawContact.updated_by_email || null,
        created_by_name: rawContact.created_by_name || null,
        updated_by_name: rawContact.updated_by_name || null
      });
    } catch (error) {
      console.error("An error occurred while retrieving Contact:", error);
      toast.error("Failed to retrieve Contact.");
    }
    setLoading(false);
  }, []);

const handleUpdateContact = async (
  contactId: string,
  created_by: string,
  data: UpdateContactDTO
) => {
  try {
    // Check if user has permission to update contacts
    if (!checkRoleClient(ALL)) {
      toast.error("Anda tidak memiliki akses untuk mengubah Contact.");
      return;
    }

    const updatedData = {
      name: data.name,
      
      email: data.email,
      phone_number: data.phone_number,
      description: data.description,
      address: data.address, 
      updated_by: created_by,
    };

    const { data: updatedContact } = await axios.put(
      `${API_URL}/${contactId}`,
      updatedData
    );

    const processedContact = {
      ...updatedContact.data,
      role: updatedContact.data.role || "none",
      created_by_email: updatedContact.data.created_by_email,
      updated_by_email: updatedContact.data.updated_by_email,
      address: updatedContact.data.address || data.address || "",
    };

    setContacts((prevContacts) =>
      prevContacts.map((c) => (c.contact_id === contactId ? processedContact : c))
    );

    if (contact?.contact_id === contactId) {
      setContact(processedContact);
    }

    toast.success("Contact updated successfully!");
  } catch (error) {
    console.error("An error occurred while updating Contact:", error);
    toast.error("Failed to update Contact.");
  }
};

  const handleDeleteContact = async (contactId: string) => {
    try {
      // Check if user has permission to delete contacts
      if (!checkRoleClient(ADMINEXECUTIVE)) {
        toast.error("You do not have access to delete Contact.");
        return;
      }

      await axios.delete(`${API_URL}/${contactId}`);

      setContacts((prevContacts) =>
        prevContacts.filter((c) => c.contact_id !== contactId)
      );
      toast.success("Contact successfully deleted!");
    } catch (error) {
      console.error("An error occurred while deleting Contact:", error);
      toast.error("Failed to delete Contact.");
    }
  };

  const handleAddContact = async (newContact: AddContactDTO) => {
    try {
      const isDuplicate = contacts.some(
        (c: ContactSchema) => c.email.toLowerCase() === newContact.email.toLowerCase()
      );

      if (isDuplicate) {
        toast.error("Email is already registered. Please use another email.");
        return;
      }

      const contactPayload = {
        ...newContact,
        description: newContact.description || "",
        created_by: newContact.created_by || "550e8400-e29b-41d4-a716-446655440000",
        updated_by: newContact.updated_by || "550e8400-e29b-41d4-a716-446655440000",
      };

      const { data: createdContact } = await axios.post(API_URL, contactPayload);

      const processedContact = {
        ...createdContact.data,
        role: newContact.role || "none",
        created_by_email: createdContact.data.created_by_email,
        updated_by_email: createdContact.data.updated_by_email
      };

      setContacts((prevContacts) => [...prevContacts, processedContact]);

      toast.success("Contact successfully added!");
    } catch (error) {
      console.error("An error occurred while adding Contact:", error);
      toast.error("Failed to add Contact.");
    }
  };

  return {
    contact,
    contacts,
    loading,
    fetchAllContacts,
    fetchContactById,
    handleUpdateContact,
    handleDeleteContact,
    handleAddContact,
  };
}