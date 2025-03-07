import { z } from "zod";

export const VendorSchema = z.object({
    vendor_id: z
        .string({ required_error: "ID vendor wajib diisi" })
        .uuid({ message: "ID vendor tidak valid" })
        .default(() => crypto.randomUUID()),
    contact_id: z
        .string({ required_error: "ID kontak wajib diisi" })
        .uuid({ message: "ID kontak tidak valid" }),
    rating: z
        .number()
        .min(0, { message: "Rating minimal 0" })
        .max(5, { message: "Rating maksimal 5" })
        .default(0)
        .optional(),
    bankAccountDetail: z
        .string({ required_error: "Detail rekening bank wajib diisi" })
});



export type VendorSchema = z.infer<typeof VendorSchema>;