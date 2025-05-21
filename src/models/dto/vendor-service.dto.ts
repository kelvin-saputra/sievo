import { z } from "zod";
import { VendorServiceSchema } from "../schemas";


export const AddVendorServiceDTO = VendorServiceSchema.pick({
    service_name: true,
    category: true,
    price: true,
    rating: true,
    description: true,
    vendor_id: true,
});

export const UpdateVendorServiceDTO = VendorServiceSchema.pick({
    service_id: true,
    service_name: true,
    category: true,
    price: true,
    rating: true,
    description: true,
    vendor_id: true,
}).partial();

export type AddVendorServiceDTO = z.infer<typeof AddVendorServiceDTO>;
export type UpdateVendorServiceDTO = z.infer<typeof UpdateVendorServiceDTO>;
