import { z } from "zod";

export const ProposalStatusEnum = z.enum([
  "DRAFT",
  "ON_REVIEW",
  "APPROVED",
  "REJECTED",
  "SENT",
  "ON_CONTACT",
  "INTERESTED",
]);
export type ProposalStatusEnum = z.infer<typeof ProposalStatusEnum>;
