import { z } from "zod";
import { BudgetStatusEnum } from "../enums";

export const BudgetSchema = z.object({
    budget_id: z
        .string({ required_error: "ID budget wajib diisi" })
        .uuid({ message: "ID budget tidak valid" })
        .default(() => crypto.randomUUID()),
    total_price: z
        .number({ required_error: "Total harga wajib diisi" })
        .min(0, { message: "Total harga minimal 0" }),
    status: BudgetStatusEnum.default("PENDING"),
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
        .default(() => new Date())
        .optional(),
    event_id: z
        .string()
        .uuid({ message: "ID event tidak valid" })
});

export type BudgetSchema = z.infer<typeof BudgetSchema>;