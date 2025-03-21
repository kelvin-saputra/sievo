import { z } from "zod";

export const ProposalStatusEnum = z.enum([
  "DRAFT", 
  "ON_REVIEW",
  "APPROVED",
  "REJECTED",
  "ON_CONTACT",
  "ACCEPTED",
  "CANCELLED",
]);
export type ProposalStatusEnum = z.infer<typeof ProposalStatusEnum>;
