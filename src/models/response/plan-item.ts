import { z } from "zod";
import { InventorySchema, PurchasingSchema, VendorServiceSchema } from "../schemas";

export const BudgetItemPlan = z.object({
    budget_item_id: z
        .string({ required_error: "ID budget item wajib diisi" })
        .uuid({ message: "ID budget item tidak valid" }),
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
        .optional()
        .nullable(),
    inventory_id: z
        .string()
        .optional()
        .nullable(),
    other_item_id: z
        .string()
        .optional()
        .nullable(),
    vendor_service: VendorServiceSchema.optional().nullable(),
    inventory: InventorySchema.optional().nullable(),
    other_item: PurchasingSchema.optional().nullable(),
});

export type BudgetItemPlan = z.infer<typeof BudgetItemPlan>;
