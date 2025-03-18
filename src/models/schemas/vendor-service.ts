import { z } from "zod";
import { VendorServiceCategoryEnum } from "../enums";

export const VendorServiceSchema = z.object({
    service_id: z
        .string({ required_error: "ID service wajib diisi" })
        .uuid({ message: "ID service tidak valid" })
        .default(() => crypto.randomUUID()),
    service_name: z
        .string()
        .min(3, { message: "Nama service minimal 3 karakter" }),
    category: VendorServiceCategoryEnum.default("OTHERS"),
    price: z
        .number({ required_error: "Harga service wajib diisi" })
        .min(0, { message: "Harga service tidak boleh negatif" }),
    rating: z
        .number( { required_error: "Rating wajib diisi" })
        .min(0, { message: "Rating minimal 0" })
        .max(5, { message: "Rating maksimal 5" })
        .default(0)
        .optional(),
    description: z
        .string()
        .optional(),
    vendor_id: z
        .string({ required_error: "ID vendor wajib diisi" })
        .uuid({ message: "ID vendor tidak valid" }),
});

export type VendorServiceSchema = z.infer<typeof VendorServiceSchema>;