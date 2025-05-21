import { z } from "zod";
import { InventorySchema, PurchasingSchema, VendorServiceSchema } from "../schemas";
import { BudgetItemStatusEnum } from "../enums";

export const BudgetItemActual = z.object({
    actual_budget_item_id: z
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
    notes: z
        .string()
        .optional()
        .nullable(),
    invoice_photo: z
        .array(z.string())
        .default([]),
    status: BudgetItemStatusEnum.default("PENDING"),
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

export type BudgetItemActual = z.infer<typeof BudgetItemActual>;
