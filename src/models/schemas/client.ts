import { z } from "zod";
import { ClientTypeEnum } from "../enums";

export const ClientSchema = z.object({
    client_id: z
        .string({ required_error: "ID client wajib diisi" })
        .uuid({ message: "ID client tidak valid" })
        .default(() => crypto.randomUUID()),
    contact_id: z
        .string({ required_error: "ID kontak wajib diisi" })
        .uuid({ message: "ID kontak tidak valid" }),
    type: ClientTypeEnum.default("INDIVIDUAL"),
});

export type ClientSchema = z.infer<typeof ClientSchema>;