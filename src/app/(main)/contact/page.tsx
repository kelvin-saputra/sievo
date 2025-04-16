"use client";

import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/common/page-header";
import useContact from "@/hooks/use-contact";
import { AddContactModal } from "@/components/contact/form/add-contact-modal";
import { ContactTable } from "../../../components/contact/data-table";
import { contactColumns, ContactWithRole } from "../../../components/contact/columns";

export default function ViewAllContacts() {
  const {
    contacts,
    loading,
    fetchAllContacts,
    handleAddContact,
  } = useContact();

  useEffect(() => {
    fetchAllContacts();
  }, [fetchAllContacts]);

  // Ensure the data has the correct type
  const typedContacts: ContactWithRole[] = contacts.map(contact => ({
    ...contact,
    role: contact.role ?? "none",
  }));

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <PageHeader
        title="Contacts Overview"
        breadcrumbs={[{ label: "Contacts", href: "/contact" }]}
      />

      <div className="mb-6">
        <AddContactModal onAddContact={handleAddContact} />
      </div>

      <div className="mb-8 p-6 border rounded-lg shadow-lg bg-super-white">
        {loading ? (
          <Skeleton className="h-24 w-full mb-4 rounded-lg bg-gray-300" />
        ) : (
          <ContactTable<ContactWithRole>
            columns={contactColumns}
            data={typedContacts}
            onUpdate={(updatedContact) => console.log("Updated Contact:", updatedContact)}
            onDelete={(contactId) => console.log("Deleted Contact ID:", contactId)}
          />
        )}
      </div>
    </div>
  );
}