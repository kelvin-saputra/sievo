import { z } from "zod";
import { ProposalSchema } from "../schemas";

export const addProposalDTO = ProposalSchema.pick({
    status : true,
    proposal_name : true,
    client_name : true,
    created_at : true,
    created_by : true,
    updated_at : true,
    updated_by : true,
    proposal_link : true,
});

export const updateProposalDTO = ProposalSchema.pick({
    client_name : true,
    proposal_name : true,
    proposal_link : true,

})

export type addProposalDTO = z.infer<typeof addProposalDTO>;
export type updateProposalDTO = z.infer<typeof updateProposalDTO>