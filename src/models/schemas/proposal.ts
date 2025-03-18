import { z } from "zod";
import { ProposalStatusEnum } from "../enums";

export const ProposalSchema = z.object({
    proposal_id: z
        .string({ required_error: "ID proposal wajib diisi" })
        .uuid({ message: "ID proposal tidak valid" })
        .default(() => crypto.randomUUID()),
    status: ProposalStatusEnum.default("DRAFT"),
    client_id: z
        .string({ required_error: "ID client wajib diisi" })
        .uuid({ message: "ID client tidak valid" }),
    manager_id: z
        .string({ required_error: "ID manager wajib diisi" })
        .uuid({ message: "ID manager tidak valid" }),
});

export type ProposalSchema = z.infer<typeof ProposalSchema>;