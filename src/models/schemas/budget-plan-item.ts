import { z } from "zod";

export const BudgetPlanItemSchema = z.object({
    budget_item_id: z
        .string({ required_error: "ID budget item wajib diisi" })
        .uuid({ message: "ID budget item tidak valid" })
        .default(() => crypto.randomUUID()),
    item_qty: z
        .number({ required_error: "Jumlah item wajib diisi" })
        .min(0, { message: "Jumlah item minimal 0" }),
    item_subtotal: z
        .number({ required_error: "subtotal item wajib diisi" })
        .min(0, { message: "subtotal item minimal 0" }),
    category_id : z
        .number({ required_error: "ID kategori wajib diisi" }),
    budget_id: z
        .string()
        .uuid({ message: "ID budget tidak valid" })
        .optional(),
    vendor_service_id: z
        .string()
        .optional(),
    inventory_id: z
        .string()
        .optional(),
    other_item_id: z
        .string()
        .optional(),
});

export type BudgetPlanItemSchema = z.infer<typeof BudgetPlanItemSchema>;