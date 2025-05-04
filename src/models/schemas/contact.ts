// Update to your existing ContactSchema
import { z } from "zod";
import { ClientTypeEnum } from "../enums";

export const ContactSchema = z.object({
  client: z.object({
    client_id: z
      .string({ required_error: "ID klien wajib diisi" })
      .uuid({ message: "ID klien tidak valid" })
      .optional(),
    contact_id: z
      .string({ required_error: "ID kontak wajib diisi" })
      .uuid({ message: "ID kontak tidak valid" })
      .default(() => crypto.randomUUID()),
    is_deleted: z.boolean().default(false),
    type: ClientTypeEnum.default("INDIVIDUAL"),
  }).nullable().optional(),
  vendor: z
    .object({
      name: z.string().optional(),
    })
    .nullable()
    .optional(),
  contact_id: z
    .string({ required_error: "ID kontak wajib diisi" })
    .uuid({ message: "ID kontak tidak valid" })
    .default(() => crypto.randomUUID()),
  name: z
    .string()
    .min(2, { message: "Nama kontak minimal 2 karakter" }),
  email: z
    .string()
    .email({ message: "Email tidak valid" })
    .nonempty({ message: "Email wajib diisi" }),
  phone_number: z
    .string()
    .nonempty({ message: "Nomor handphone wajib diisi" })
    .min(10, { message: "Nomor handphone minimal 10 karakter" }),
  description: z.string().optional(),
  created_by: z.string().nullable(),
  updated_by: z.string().nullable(),
  created_at: z.coerce
    .date({ invalid_type_error: "Tanggal dibuat tidak valid" })
    .default(() => new Date()),
  updated_at: z.coerce
    .date({ invalid_type_error: "Tanggal diupdate tidak valid" }),
  is_deleted: z.boolean().default(false),
  role: z.enum(["none", "client", "vendor"]).default("none"),
  // Add the missing email properties
  created_by_email: z.string().nullable().optional(),
  updated_by_email: z.string().nullable().optional(),
  created_by_name: z.string().nullable().optional(),
  updated_by_name: z.string().nullable().optional(),
});

export type ContactSchema = z.infer<typeof ContactSchema>;
export type ContactWithRole = z.infer<typeof ContactSchema>;