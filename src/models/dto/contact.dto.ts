import { z } from "zod";
import { ContactSchema } from "../schemas";

export const AddContactDTO = ContactSchema.pick({
    name: true,
    email: true,
    phone_number: true,
    description: true,
    created_by: true,
    created_at: true,
    updated_by: true,
    updated_at: true,
    is_deleted: true,
    role: true 
  });

  
export const UpdateContactDTO = ContactSchema.pick({
    name: true,
    email: true,
    phone_number: true,
    description: true,
    updated_by: true,
    updated_at: true,
    is_deleted: true,
    role: true 
  }).partial();
  
export type AddContactDTO = z.infer<typeof AddContactDTO>;
export type UpdateContactDTO = z.infer<typeof UpdateContactDTO>;