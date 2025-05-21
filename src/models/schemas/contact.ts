// Update to your existing ContactSchema
import { z } from "zod";
import { ClientTypeEnum, VendorServiceCategoryEnum } from "../enums";

export const ContactSchema = z.object({
  client: z.object({
    client_id: z
      .string({ required_error: "Client ID is required" })
      .uuid({ message: "Invalid client ID" })
      .optional(),
    contact_id: z
      .string({ required_error: "Contact ID is required" })
      .uuid({ message: "Invalid contact ID" })
      .default(() => crypto.randomUUID()),
    is_deleted: z.boolean().default(false),
    type: ClientTypeEnum.default("INDIVIDUAL"),
  }).nullable().optional(),
  vendor: z
    .object({
      vendor_id: z
        .string({ required_error: "Vendor ID is required" })
        .uuid({ message: "Invalid vendor ID" })
        .optional(),
      contact_id: z
        .string({ required_error: "Contact ID is required" })
        .uuid({ message: "Invalid contact ID" })
        .default(() => crypto.randomUUID()),
      is_deleted: z.boolean().default(false),
      type: VendorServiceCategoryEnum.default("OTHERS"),
      name: z.string().optional(),
    })
    .nullable()
    .optional(),
  contact_id: z
    .string({ required_error: "Contact ID is required" })
    .uuid({ message: "Invalid contact ID" })
    .default(() => crypto.randomUUID()),
  name: z
    .string()
    .min(2, { message: "Contact name must be at least 2 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email" })
    .nonempty({ message: "Email is required" }),
  phone_number: z
    .string()
    .nonempty({ message: "Phone number is required" })
    .min(10, { message: "Phone number must be at least 10 characters" }),
  description: z.string().optional(),
  address: z.string().nonempty({ message: "Address is required" }),
  created_by: z.string().nullable(),
  updated_by: z.string().nullable(),
  created_at: z.coerce
    .date({ invalid_type_error: "Invalid created date" })
    .default(() => new Date()),
  updated_at: z.coerce
    .date({ invalid_type_error: "Invalid updated date" }),
  is_deleted: z.boolean().default(false),
  role: z.enum(["none", "client", "vendor"]).default("none"),
  created_by_email: z.string().nullable().optional(),
  updated_by_email: z.string().nullable().optional(),
  created_by_name: z.string().nullable().optional(),
  updated_by_name: z.string().nullable().optional(),
});

// Fix the z.infer type usage by adding the generic parameter
export type ContactSchema = z.infer<typeof ContactSchema>;
export type ContactWithRole = z.infer<typeof ContactSchema>;