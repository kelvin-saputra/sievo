import { z } from "zod";

export const BudgetStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"]);
export type BudgetStatusEnum = z.infer<typeof BudgetStatusEnum>;
