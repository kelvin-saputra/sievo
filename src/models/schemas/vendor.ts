import { z } from "zod";
import { VendorServiceCategoryEnum } from "../enums";

export const VendorSchema = z.object({
  vendor_id: z
    .string({ required_error: "Vendor ID is required" })
    .uuid({ message:  "Invalid vendor ID" })
    .default(() => crypto.randomUUID()),
  contact_id: z
    .string({ required_error: "Contact ID is required" })
    .uuid({ message: "Invalid contact ID" }),
  rating: z
    .number()
    .min(0, { message: "Minimum rating is 0" })
    .max(5, { message: "Maximum rating is 5" })
    .default(0)
    .optional(),
  bankAccountDetail: z.string().optional(),
  type: VendorServiceCategoryEnum.default("OTHERS"),
  is_deleted: z.boolean().default(false),
});

export type VendorSchema = z.infer<typeof VendorSchema>;