"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/common/page-header";
import useContact from "@/hooks/use-contact";
import { AddContactModal } from "@/components/contact/form/add-contact-modal";
import { ContactTable } from "../../../components/contact/data-table";
import {
  contactColumns,
  ContactWithRole,
} from "../../../components/contact/columns";
import Loading from "@/components/ui/loading";
import { ADMINEXECUTIVEINTERNAL, checkRoleClient } from "@/lib/rbac-client";

export default function ViewAllContacts() {
  const {
    contacts,
    loading,
    fetchAllContacts,
    handleAddContact,
    handleDeleteContact,
  } = useContact();

  useEffect(() => {
    fetchAllContacts();
  }, [fetchAllContacts]);

  const handleDelete = async (contactId: string) => {
    try {
      await handleDeleteContact(contactId);
      fetchAllContacts();
    } catch {
      toast.error("Failed to delete Contact. Please try again.");
    }
  };

  const typedContacts: ContactWithRole[] = contacts.map((contact) => ({
    ...contact,
    created_by: contact.created_by ?? "",
    role: contact.role ?? "none",
  }));
  

  if (loading) {
    return (
          <Loading message="Fetching contacts data..." />
    );
  }
  

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <PageHeader
        title="Contacts Overview"
      />
      {checkRoleClient(ADMINEXECUTIVEINTERNAL) && (
        <div className="mb-6">
          <AddContactModal onAddContact={handleAddContact} />
        </div>
      )}

      <div className="mb-8 p-6 border rounded-lg shadow-lg bg-super-white">
        <ContactTable<ContactWithRole>
          columns={contactColumns}
          data={typedContacts}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
