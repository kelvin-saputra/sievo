import { z } from "zod";
import { ActualBudgetItemSchema, BudgetPlanItemSchema, BudgetSchema } from "../schemas";

export const AddBudgetDTO = BudgetSchema.pick({
    status: true,
    created_by: true,
    updated_by: true,
    event_id: true,
});

export const UpdateBudgetDTO = BudgetSchema.pick({
    budget_id: true,
    status: true,
    updated_by: true,
}).partial();

export const AddBudgetPlanItemDTO = BudgetPlanItemSchema.pick({
    budget_id: true,
    item_qty: true,
    item_subtotal: true,
    category_id: true,
    vendor_service_id: true,
    inventory_id: true,
    other_item_id: true,
}).extend({
    source: z.string().optional(),
    vendor_id: z.string().optional().nullable(),
    item_price: z.number().optional(),
    item_name: z.string().optional(),
    description: z.string().optional(),
    created_by: z.string().optional(),
});

export const UpdateBudgetPlanItemDTO = BudgetPlanItemSchema.pick({
    budget_item_id: true,
    item_qty: true,
    item_subtotal: true,
    category_id: true,
    vendor_service_id: true,
    inventory_id: true,
    other_item_id: true,
}).extend({
    source: z.string().optional(),
    vendor_id: z.string().optional().nullable(),
    item_price: z.number().optional(),
    item_name: z.string().optional(),
    description: z.string().optional(),
    created_by: z.string().optional(),
}).partial();

export const AddActualBudgetItemDTO = ActualBudgetItemSchema.pick({
    item_qty: true,
    item_subtotal: true,
    category_id: true,
    budget_id: true,
    vendor_service_id: true,
    inventory_id: true,
    other_item_id: true,
}).extend({
    source: z.string().optional(),
    vendor_id: z.string().optional().nullable(),
    item_price: z.number().optional(),
    item_name: z.string().optional(),
    description: z.string().optional(),
    created_by: z.string().optional(),
});

export const UpdateActualBudgetItemDTO = ActualBudgetItemSchema.pick({
    actual_budget_item_id: true,
    item_qty: true,
    item_subtotal: true,
    category_id: true,
    budget_id: true,
    vendor_service_id: true,
    inventory_id: true,
    other_item_id: true,
}).extend({
    source: z.string().optional(),
    vendor_id: z.string().optional().nullable(),
    item_price: z.number().optional(),
    item_name: z.string().optional(),
    description: z.string().optional(),
    created_by: z.string().optional(),
}).partial();

export type AddBudgetDTO = z.infer<typeof AddBudgetDTO>;
export type UpdateBudgetDTO = z.infer<typeof UpdateBudgetDTO>;

export type AddBudgetPlanItemDTO = z.infer<typeof AddBudgetPlanItemDTO>;
export type UpdateBudgetPlanItemDTO = z.infer<typeof UpdateBudgetPlanItemDTO>;

export type AddActualBudgetItemDTO = z.infer<typeof AddActualBudgetItemDTO>;
export type UpdateActualBudgetItemDTO = z.infer<typeof UpdateActualBudgetItemDTO>;