import { z } from "zod";
import { BudgetStatusEnum } from "../enums";

export const BudgetSchema = z.object({
    budget_id: z
        .string({ required_error: "ID budget wajib diisi" })
        .uuid({ message: "ID budget tidak valid" })
        .default(() => crypto.randomUUID()),
    status: BudgetStatusEnum.default("PENDING"),
    created_by: z
        .string({required_error: "ID user wajib diisi"}),
    updated_by: z
        .string()
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
        .uuid({ message: "ID event tidak valid" }),
    is_deleted: z
        .boolean()
        .default(false),
    is_actual: z
        .boolean()
        .default(false)
});

export type BudgetSchema = z.infer<typeof BudgetSchema>;