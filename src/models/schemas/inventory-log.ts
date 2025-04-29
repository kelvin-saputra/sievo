import { z } from "zod";

export const InventoryLogSchema = z.object({
  inventory_id: z
    .string({ required_error: "ID inventory wajib diisi" })
    .uuid({ message: "ID inventory tidak valid" }),
  action: z.enum(["CREATE", "UPDATE", "DELETE"], { message: "Aksi tidak valid" }),
  updated_by: z
    .string({ required_error: "ID user wajib diisi" })
    .uuid({ message: "ID user tidak valid" }),
    updated_at: z
    .coerce
    .date({ invalid_type_error: "Updated At tidak valid" })
    .default(() => new Date()), 
});

export type InventoryLogSchema = z.infer<typeof InventoryLogSchema>;
