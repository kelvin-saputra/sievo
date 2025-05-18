import { z } from "zod";
import { InventorySchema, PurchasingSchema, VendorServiceSchema } from "../schemas";
import { BudgetStatusEnum } from "../enums";

export const BudgetWithCategoryBudgetPlan = z.object({
    budget_id: z
        .string({ required_error: "ID budget wajib diisi" })
        .uuid({ message: "ID budget tidak valid" })
        .default(() => crypto.randomUUID()),
    status: BudgetStatusEnum.default("PENDING"),
    created_by: z
        .string({required_error: "ID user wajib diisi"}),
    updated_by: z
        .string()
        .optional()
        .nullable(),
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
        .default(false),
    categories: z.array(z
        .object({
            category_id: z
                .number({ required_error: "ID category wajib diisi" })
                .int({ message: "ID category tidak valid" })
                .positive({ message: "ID category tidak valid" }),
            category_name: z
                .string({ required_error: "Nama category wajib diisi" })
                .min(3, { message: "Nama category minimal 3 karakter"}),
            is_deleted: z
                .boolean()
                .default(false),
            budget_plan_item: z.array(z
                .object({
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
                    is_deleted: z
                        .boolean(),
                    vendor_service: VendorServiceSchema
                        .optional()
                        .nullable(),
                    inventory: InventorySchema
                        .optional()
                        .nullable(),
                    other_item: PurchasingSchema
                        .optional()
                        .nullable(),
                })
                .optional()
                .nullable()
            )
        })
        .optional()
        .nullable(),
    )
});

export type BudgetWithCategoryBudgetPlan = z.infer<typeof BudgetWithCategoryBudgetPlan>;
