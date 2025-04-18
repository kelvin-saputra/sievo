import { z } from "zod";
import { RoleEnum } from "../enums/role";

export const UserSchema = z.object({
    id: z
        .string({ required_error: "ID user wajib diisi" })
        .uuid({ message: "ID user tidak valid" })
        .default(() => crypto.randomUUID()),
    name: z
        .string()
        .min(2, { message: "Nama user minimal 2 karakter" }),
    phone_number: z
        .string()
        .nonempty({ message: "Nomor handphone wajib diisi" })
        .min(10, { message: "Nomor handphone minimal 10 karakter" }),
    email: z
        .string()
        .email({ message: "Email tidak valid" })
        .nonempty({ message: "Email wajib diisi" }),
    password: z
        .string()
        .nonempty({message: "Password wajib diisi" })
        .min(8, { message: "Password minimal 8 karakter" })
        .optional(),
    role: RoleEnum.default("FREELANCE"),
    is_active: z
        .boolean()
        .default(true),
    is_admin: z
        .boolean()
        .default(false),
    started_at: z.coerce
        .date({ invalid_type_error: "Tanggal mulai tidak valid" })
        .default(() => new Date()),
    ended_at: z.coerce.date({ invalid_type_error: "Tanggal akhir tidak valid" }),
});



export type UserSchema = z.infer<typeof UserSchema>;