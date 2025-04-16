import { z } from "zod";
import { InventoryCategoryEnum } from "../enums";

export const InventorySchema = z.object({
    inventory_id: z
        .string({ required_error: "ID inventory wajib diisi" })
        .uuid({ message: "ID inventory tidak valid" })
        .default(() => crypto.randomUUID()),
    item_name: z
        .string()
        .min(3, { message: "Nama inventory minimal 3 karakter" }),
    item_qty: z
        .number()
        .min(1, { message: "Jumlah item minimal 1" }),
    item_price: z
        .number()
        .min(0, { message: "Harga item minimal 0" }),
    inventory_photo: z
        .array(z.string().url("Foto inventory tidak valid"))
        .default([]),
    category: InventoryCategoryEnum.default("NON_CONSUMABLE"),
    is_avail: z
        .boolean()
        .default(true),
    description: z
        .string()
        .optional(),
    created_by: z
        .string({required_error: "ID user wajib diisi"})
        .uuid({ message: "ID user tidak valid" }),
    updated_by: z
        .string()
        .uuid({ message: "ID user tidak valid" })
        .optional(),
    created_at: z.coerce
        .date({ invalid_type_error: "Tanggal dibuat tidak valid" })
        .default(() => new Date()),
    updated_at: z.coerce
        .date({ invalid_type_error: "Tanggal diupdate tidak valid" })
});



export type InventorySchema = z.infer<typeof InventorySchema>;