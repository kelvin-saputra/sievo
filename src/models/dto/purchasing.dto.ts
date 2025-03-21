import { z } from "zod";
import { PurchasingSchema } from "../schemas";


export const AddPurchaseDTO = PurchasingSchema.pick({
    other_item_id : true,
    item_name : true,
    item_price : true,
    description : true,
    created_by : true,  
});

export const UpdatePurchaseDTO = PurchasingSchema.pick({
    other_item_id : true,
    item_name : true,
    item_price : true,
    description : true,
    updated_by : true,
    updated_at : true,
}).partial();

export type AddPurchaseDTO = z.infer<typeof AddPurchaseDTO>;
export type UpdatePurchaseDTO = z.infer<typeof UpdatePurchaseDTO>;
