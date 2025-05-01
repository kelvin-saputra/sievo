import { z } from "zod";
import { InventorySchema } from "../schemas";

export const AddInventoryDTO = InventorySchema.pick({
  item_name: true,
  item_qty: true,
  item_price: true,
  inventory_photo: true,
  category: true,
  is_avail: true,
  description: true,
  created_by: true,
  created_at: true,
  updated_by: true,
  updated_at: true,
});

export const UpdateInventoryDTO = InventorySchema.pick({
    item_name: true,
    item_qty: true,
    item_qty_damaged: true,
    item_qty_reserved: true,
    item_price: true,
    inventory_photo: true,
    category: true,
    is_avail: true,
    description: true,
    updated_by: true,
    updated_at: true,
}).partial();

export type AddInventoryDTO = z.infer<typeof AddInventoryDTO>;
export type UpdateInventoryDTO = z.infer<typeof UpdateInventoryDTO>;
