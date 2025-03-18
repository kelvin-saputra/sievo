import { z } from "zod";

export const ContactSchema = z.object({
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
    description: z
        .string()
        .nullable(),
    created_by: z
        .string({ required_error: "ID user wajib diisi" })
        .uuid({ message: "ID user tidak valid" }),
    updated_by: z
        .string()
        .uuid({ message: "ID user tidak valid" })
        .nullable(),
    created_at: z.coerce
        .date({ invalid_type_error: "Tanggal dibuat tidak valid" })
        .default(() => new Date()),
    updated_at: z.coerce
        .date({ invalid_type_error: "Tanggal diupdate tidak valid" }),
    is_deleted: z
        .boolean()
        .default(false),
    role: z.enum(["none", "client", "vendor"]).default("none")
});

export type ContactSchema = z.infer<typeof ContactSchema>;

export type ContactWithRole = {
    contact_id: string;
    name: string;
    email: string;
    phone_number: string;
    description: string | null;
    created_by: string;
    updated_by: string | null;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
    role: "none" | "client" | "vendor"; 
  };
  