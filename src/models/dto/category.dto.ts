import { z } from "zod";
import { BudgetItemCategorySchema } from "../schemas";

export const AddBudgetItemCategoryDTO = BudgetItemCategorySchema.pick({
  category_name: true,
});

export const UpdateBudgetItemCategoryDTO = BudgetItemCategorySchema.pick({
    category_name: true,
}).partial();

export type AddBudgetItemCategoryDTO = z.infer<typeof AddBudgetItemCategoryDTO>;
export type UpdateBudgetItemCategoryDTO = z.infer<typeof UpdateBudgetItemCategoryDTO>;
