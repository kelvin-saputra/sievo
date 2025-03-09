import { z } from "zod";

export const BudgetItemStatusEnum = z.enum(["PENDING", "DONE", "CANCELED"]);
export type BudgetItemStatusEnum = z.infer<typeof BudgetItemStatusEnum>;
