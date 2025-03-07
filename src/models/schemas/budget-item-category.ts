import { z } from "zod";

export const BudgetItemCategorySchema = z.object({
    category_id: z
        .number({ required_error: "ID category wajib diisi" })
        .int({ message: "ID category tidak valid" })
        .positive({ message: "ID category tidak valid" }),
    category_name: z
        .string({ required_error: "Nama category wajib diisi" })
        .min(3, { message: "Nama category minimal 3 karakter"}),
});

export type BudgetItemCategorySchema = z.infer<typeof BudgetItemCategorySchema>;