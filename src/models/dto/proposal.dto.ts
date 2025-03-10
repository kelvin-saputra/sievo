import { z } from "zod";
import { ProposalSchema } from "../schemas";

export const addProposalDTO = ProposalSchema.pick({
    status : true,
    client_name : true,
    created_at : true,
    created_by : true,
    updated_at : true,
    updated_by : true,
    link : true,
});