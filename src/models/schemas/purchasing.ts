import { z } from "zod";

export const PurchasingSchema = z.object({
    other_item_id: z
        .string({ required_error: "ID item wajib diisi" })
        .uuid({ message: "ID item tidak valid" })
        .default(() => crypto.randomUUID()),
    item_name: z
        .string({ required_error: "Nama item wajib diisi" })
        .min(3, { message: "Nama item minimal 3 karakter" }),
    item_price: z
        .number({ required_error: "Harga item wajib diisi" })
        .min(0, { message: "Harga item minimal 0" }),
    description: z
        .string()
        .optional(),
    created_by: z
        .string(),
    updated_by: z
        .string()
        .optional(),
    created_at : z.coerce
        .date({ invalid_type_error: "Tanggal dibuat tidak valid" })
        .default(() => new Date()),
    updated_at : z.coerce
        .date({ invalid_type_error: "Tanggal diupdate tidak valid" })
        .optional(),
});

export type PurchasingSchema = z.infer<typeof PurchasingSchema>;