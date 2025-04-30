import { z } from "zod";
import { BudgetStatusEnum } from "@/models/enums";

export const BudgetDashboardSchema = z.object({
  budget_id: z.string().uuid(),
  status: BudgetStatusEnum,
  updated_at: z.string(),
  event_id: z.string().uuid(), 
  event: z.object({
    event_name: z.string(),
  }),
});

export type BudgetDashboardSchema = z.infer<typeof BudgetDashboardSchema>;
