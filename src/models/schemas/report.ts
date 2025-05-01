import { z } from "zod";

export const ReportSchema = z.object({
    report_id: z
        .string({ required_error: "ID report wajib diisi" })
        .uuid({ message: "ID report tidak valid" })
        .default(() => crypto.randomUUID()),
    review: z
        .string()
        .min(3, { message: "Review minimal 3 karakter" }),
    description: z
        .string()
        .min(10, { message: "Deskripsi minimal 10 karakter" }),
    actualParticipant: z
        .number()
        .positive({ message: "Jumlah peserta tidak valid" }),
    created_by: z
        .string(),
    updated_by: z
        .string()
        .optional(),
    created_at : z.coerce
        .date({ invalid_type_error: "Tanggal dibuat tidak valid" })
        .default(() => new Date()),
    updated_at : z.coerce
        .date({ invalid_type_error: "Tanggal diupdate tidak valid" })
        .optional(),
    event_id: z
        .string({ required_error: "ID event wajib diisi" })
        .uuid({ message: "ID event tidak valid" }),
});

export type ReportSchema = z.infer<typeof ReportSchema>;