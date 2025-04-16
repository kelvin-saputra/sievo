import { z } from "zod";

export const InventoryCategoryEnum = z.enum(["CONSUMABLE", "NON_CONSUMABLE"]);
export type InventoryCategoryEnum = z.infer<typeof InventoryCategoryEnum>;
