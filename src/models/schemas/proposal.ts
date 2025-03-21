import { z } from "zod";
import { ProposalStatusEnum } from "../enums";

export const ProposalSchema = z.object({
    proposal_id: z
      .string({ required_error: "ID proposal wajib diisi" })
      .uuid({ message: "ID proposal tidak valid" })
      .default(() => crypto.randomUUID()),

    proposal_name: z
      .string({ required_error: "Nama client wajib diisi" })
      .min(1, "Nama client tidak boleh kosong"), // ✅ Prevents empty strings

    status: ProposalStatusEnum.default("DRAFT"),

    client_name: z
      .string({ required_error: "Nama client wajib diisi" })
      .min(1, "Nama client tidak boleh kosong"), // ✅ Prevents empty strings

    proposal_link: z
      .string({ required_error: "Link Proposal wajib diisi" })
      .min(1, "Link Proposal tidak boleh kosong"), // ✅ Prevents empty strings

    created_by: z
      .string({ required_error: "ID user wajib diisi" })
      .min(1, "ID user tidak boleh kosong"), // ✅ Prevents empty strings

    updated_by: z.string().optional(),

    created_at: z.coerce
      .date({ invalid_type_error: "Tanggal dibuat tidak valid" })
      .default(() => new Date()),

    updated_at: z.coerce.date({ invalid_type_error: "Tanggal diupdate tidak valid" }),

    is_deleted: z.boolean().optional(),
});

export type ProposalSchema = z.infer<typeof ProposalSchema>;
