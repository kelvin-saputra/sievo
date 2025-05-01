import { useState, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import { ContactSchema } from "@/models/schemas";
import { AddContactDTO, UpdateContactDTO } from "@/models/dto";

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
        const validatedContacts = rawContacts.map((c: unknown) => {
          const parsedContact = ContactSchema.parse(c);

          const rawContact = c as { client?: object; vendor?: object };

          let role: "none" | "client" | "vendor" = "none";
          if (rawContact.client) role = "client";
          if (rawContact.vendor) role = "vendor";

          return {
            ...parsedContact,
            is_deleted: parsedContact.is_deleted ?? false,
            updated_by: parsedContact.updated_by ?? null,
            description: parsedContact.description ?? undefined,
            role
          };
        });
        setContacts(validatedContacts);
        console.log("Fetched contacts:", validatedContacts);
      } else {
        console.warn("Expected an array but received:", rawContacts);
        setContacts([]);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Contact:", error);
      toast.error("Gagal mengambil data Contact.");
    }
    setLoading(false);
  }, []);

  const fetchContactById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/${id}`);
      const rawContact = data.data;
      const parsedContact = ContactSchema.parse(rawContact);

      let role: "none" | "client" | "vendor" = "none";
      if (rawContact.client) role = "client";
      if (rawContact.vendor) role = "vendor";

      setContact({
        ...parsedContact,
        role
      });
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil Contact:", error);
      toast.error("Gagal mengambil Contact.");
    }
    setLoading(false);
  }, []);

  const handleUpdateContact = async (
    contactId: string,
    created_by: string,
    data: UpdateContactDTO
  ) => {
    try {
      // Get the current user role from localStorage
      const userData = localStorage.getItem("authUser");
      let userRole = "";
      
      if (userData) {
        const user = JSON.parse(userData);
        userRole = user.role?.toUpperCase() || "";
      }

      // Check if user has permission to update contacts
      // Only ADMIN, EMPLOYEE, and EXECUTIVE can edit
      if (!["ADMIN", "EMPLOYEE", "EXECUTIVE"].includes(userRole)) {
        toast.error("Anda tidak memiliki akses untuk mengubah Contact.");
        return;
      }

      const { role, ...contactData } = data;

      const updatedData = ContactSchema.partial().parse({
        ...contactData,
        updated_by: created_by,
      });

      const { data: updatedContact } = await axios.put(
        `${API_URL}/${contactId}`,
        updatedData
      );

      if (role) {
        await axios.put(`${API_URL}/${contactId}/role`, { role });
      }

      const parsedContact = ContactSchema.parse({
        ...updatedContact.data,
        role: role || updatedContact.data.role || "none"
      });

      setContacts((prevContacts) =>
        prevContacts.map((c) => (c.contact_id === contactId ? parsedContact : c))
      );

      if (contact?.contact_id === contactId) {
        setContact(parsedContact);
      }

      toast.success("Contact berhasil diperbarui!");
    } catch (error) {
      console.error("Terjadi kesalahan saat memperbarui Contact:", error);
      toast.error("Gagal memperbarui Contact.");
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      // Get the current user role from localStorage
      const userData = localStorage.getItem("authUser");
      let userRole = "";
      
      if (userData) {
        const user = JSON.parse(userData);
        userRole = user.role?.toUpperCase() || "";
      }

      // Check if user has permission to delete contacts
      // Only ADMIN and EXECUTIVE can delete
      if (!["ADMIN", "EXECUTIVE"].includes(userRole)) {
        toast.error("Anda tidak memiliki akses untuk menghapus Contact.");
        return;
      }

      await axios.delete(`${API_URL}/${contactId}`);

      setContacts((prevContacts) =>
        prevContacts.filter((c) => c.contact_id !== contactId)
      );
      toast.success("Contact berhasil dihapus!");
    } catch (error) {
      console.error("Terjadi kesalahan saat menghapus Contact:", error);
      toast.error("Gagal menghapus Contact.");
    }
  };

  const handleAddContact = async (newContact: AddContactDTO) => {
    try {
      const isDuplicate = contacts.some(
        (c: ContactSchema) => c.email.toLowerCase() === newContact.email.toLowerCase()
      );

      if (isDuplicate) {
        toast.error("Email sudah terdaftar. Gunakan email lain.");
        return;
      }

      const contactPayload = {
        ...newContact,
        description: newContact.description || "",
        created_by: newContact.created_by || "550e8400-e29b-41d4-a716-446655440000",
        updated_by: newContact.updated_by || "550e8400-e29b-41d4-a716-446655440000",
      };

      const { data: createdContact } = await axios.post(API_URL, contactPayload);

      const parsedContact = ContactSchema.parse({
        ...createdContact.data,
        role: newContact.role || "none"
      });

      setContacts((prevContacts) => [...prevContacts, parsedContact]);

      toast.success("Contact berhasil ditambahkan!");
    } catch (error) {
      console.error("Terjadi kesalahan saat menambahkan Contact:", error);
      toast.error("Gagal menambahkan Contact.");
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
