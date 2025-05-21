import { z } from "zod";
import { ContactSchema } from "../schemas";

// Fix the z.infer type usage by adding the generic parameter
export const AddContactDTO = ContactSchema.pick({
  name: true,
  email: true,
  address: true,
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
  address: true,
  phone_number: true,
  description: true,
  updated_by: true,
  updated_at: true,
  is_deleted: true,
  role: true
}).partial();

// Fix the z.infer type usage by adding the generic parameter
export type AddContactDTO = z.infer<typeof AddContactDTO>;
export type UpdateContactDTO = z.infer<typeof UpdateContactDTO>;