import { createContext } from "react";
import { ContactSchema } from "@/models/schemas";
import { AddContactDTO, UpdateContactDTO } from "@/models/dto/contact.dto";

interface ContactContextType {
    contact: ContactSchema;
    loading: boolean;
  
    handleUpdateContact: (
      contactId: string,
      createdBy: string,
      data: UpdateContactDTO
    ) => Promise<void>;
    handleDeleteContact: (contactId: string) => Promise<void>;
    handleAddContact: (data: AddContactDTO) => Promise<void>;
  }
  
  const ContactContext = createContext<ContactContextType | null>(null);
  
  export default ContactContext;
  