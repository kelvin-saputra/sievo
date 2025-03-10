import { z } from "zod";
import { ProposalStatusEnum } from "../enums";

export const ProposalSchema = z.object({
    proposal_id: z
        .string({ required_error: "ID proposal wajib diisi" })
        .uuid({ message: "ID proposal tidak valid" })
        .default(() => crypto.randomUUID()),
    proposal_name: z
    .string({ required_error: "Nama client wajib diisi" }),
    status: ProposalStatusEnum.default("DRAFT"),
    client_name: z
        .string({ required_error: "Nama client wajib diisi" }),
    link: z
    .string({ required_error: "Link Proposal wajib diisi" }),
    created_by: z
    .string({required_error: "ID user wajib diisi"})
    .uuid({ message: "ID user tidak valid" }),
    updated_by: z
        .string()
        .uuid({ message: "ID user tidak valid" })
        .optional(),
    created_at: z.coerce
        .date({ invalid_type_error: "Tanggal dibuat tidak valid" })
        .default(() => new Date()),
    updated_at: z.coerce
        .date({ invalid_type_error: "Tanggal diupdate tidak valid" })

});

export type ProposalSchema = z.infer<typeof ProposalSchema>;